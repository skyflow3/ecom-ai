/**
 * Purpose: Auth helpers — getCurrentUser, requireAuth, requireRole
 * Dependencies: @clerk/nextjs/server, @/lib/db, @/db/schema
 * Related: src/middleware.ts, API route handlers
 *
 * WHY: API routes need to know WHO is making the request.
 *      These helpers combine Clerk session info with our local users table.
 *      Clerk gives us the clerkId; we look up the full user record (role, plan).
 *
 * USAGE:
 *   import { requireAuth } from '@/lib/auth';
 *   const user = await requireAuth();          // throws if not signed in
 *   const admin = await requireRole('admin');  // throws if not admin
 */

import { auth, clerkClient } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { createLogger } from "@/lib/logger";

const log = createLogger("auth");

/** Shape of the user record returned to API routes */
export interface LocalUser {
  id: string;
  clerkId: string;
  email: string;
  name: string | null;
  imageUrl: string | null;
  role: string;
  plan: string;
  stripeCustomerId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Custom error for auth failures — API routes can catch this to return 401/403.
 */
export class AuthError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number = 401) {
    super(message);
    this.name = "AuthError";
    this.statusCode = statusCode;
  }
}

/**
 * Get the current authenticated user (Clerk session + local DB record).
 * Returns null if not authenticated or if the local user record doesn't exist yet.
 *
 * WHY: The local users table is webhook-synced, but there's a small window
 *      between Clerk sign-up and webhook delivery where the local record
 *      doesn't exist yet. We handle that gracefully.
 */
export async function getCurrentUser(): Promise<LocalUser | null> {
  // WHY: auth() reads the session from the request cookies (set by Clerk middleware)
  const session = await auth();

  if (!session.userId) {
    return null;
  }

  // WHY: If Clerk env vars are optional and not configured, auth() returns no userId.
  //      But if we have a userId, Clerk IS configured, so we can safely query.
  const localUser = await db.query.users.findFirst({
    where: eq(users.clerkId, session.userId),
  });

  if (!localUser) {
    // WHY: Webhook hasn't fired yet — create the user on-the-fly from Clerk data.
    //      This prevents a race condition between sign-up and webhook delivery.
    log.warn("Local user not found, creating from Clerk data", {
      clerkId: session.userId,
    });

    try {
      const client = await clerkClient();
      const clerkUser = await client.users.getUser(session.userId);

      const email = clerkUser.emailAddresses[0]?.emailAddress ?? "";
      const name = [clerkUser.firstName, clerkUser.lastName]
        .filter(Boolean)
        .join(" ") || null;

      const [created] = await db.insert(users).values({
        clerkId: session.userId,
        email,
        name,
        imageUrl: clerkUser.imageUrl,
      }).returning();

      if (created) {
        return created as LocalUser;
      }
    } catch (err) {
      log.error("Failed to create user on-the-fly", {
        clerkId: session.userId,
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }

    return null;
  }

  return localUser as LocalUser;
}

/**
 * Require authentication — throws AuthError if not signed in.
 * Use in API routes that need a guaranteed user.
 *
 * @example
 * ```ts
 * export async function POST(req: Request) {
 *   const user = await requireAuth();
 *   // user is guaranteed to be non-null here
 * }
 * ```
 */
export async function requireAuth(): Promise<LocalUser> {
  const user = await getCurrentUser();

  if (!user) {
    throw new AuthError("Authentication required", 401);
  }

  if (user.role === "deleted") {
    throw new AuthError("Account has been deleted", 403);
  }

  return user;
}

/**
 * Require a specific role — throws AuthError if user lacks the role.
 * Use for admin-only endpoints.
 *
 * @example
 * ```ts
 * export async function DELETE(req: Request) {
 *   const user = await requireRole('admin');
 *   // only admins reach here
 * }
 * ```
 */
export async function requireRole(role: string): Promise<LocalUser> {
  const user = await requireAuth();

  if (user.role !== role) {
    log.warn("Role check failed", {
      userId: user.id,
      requiredRole: role,
      actualRole: user.role,
    });
    throw new AuthError(`Requires role: ${role}`, 403);
  }

  return user;
}
