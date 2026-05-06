/**
 * Purpose: Clerk webhook handler — syncs Clerk users to local DB
 * Dependencies: svix, drizzle-orm, @/lib/db, @/lib/logger
 * Related: src/db/schema/auth.ts (users table), src/middleware.ts (ignored route)
 *
 * WHY: Clerk is the source of truth for auth, but we need a local users table
 *      for relational queries (JOINs on funnels.createdBy, etc.).
 *      This webhook keeps the local table in sync with Clerk events.
 *
 * EVENTS:
 *   user.created  → INSERT into users
 *   user.updated  → UPDATE users (email, name, image)
 *   user.deleted  → Soft-delete (role = 'deleted')
 *
 * IMPORTANT: Always returns 200 for valid webhooks (Clerk retries on non-200).
 *            Invalid signatures return 401.
 */

import { headers } from "next/headers";
import { Webhook } from "svix";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { createLogger } from "@/lib/logger";

const log = createLogger("clerk-webhook");

/**
 * Clerk webhook event payload (minimal shape we need).
 * Full spec: https://clerk.com/docs/integrations/webhooks
 */
interface ClerkWebhookEvent {
  type: string;
  data: {
    id: string;
    email_addresses: Array<{ id: string; email_address: string }>;
    first_name: string | null;
    last_name: string | null;
    image_url: string | null;
    deleted?: boolean;
  };
}

/**
 * Extract the primary email from Clerk's email_addresses array.
 * Clerk always puts the primary email first, or we fall back to the first one.
 */
function getPrimaryEmail(
  emails: Array<{ id: string; email_address: string }>
): string {
  if (emails.length === 0) return "";
  return emails[0].email_address;
}

/**
 * Build a display name from first/last name fields.
 */
function getDisplayName(firstName: string | null, lastName: string | null): string | null {
  const parts = [firstName, lastName].filter(Boolean);
  return parts.length > 0 ? parts.join(" ") : null;
}

export async function POST(request: Request): Promise<Response> {
  const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!CLERK_WEBHOOK_SECRET) {
    log.error("Missing CLERK_WEBHOOK_SECRET env var — webhook cannot verify signatures");
    return new Response("Webhook secret not configured", { status: 500 });
  }

  // ─── Verify signature ──────────────────────────────────────────────────────
  // WHY: svix needs raw body + headers to verify the webhook is genuinely from Clerk.
  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    log.warn("Webhook missing svix headers", {
      hasId: !!svixId,
      hasTimestamp: !!svixTimestamp,
      hasSignature: !!svixSignature,
    });
    return new Response("Missing svix headers", { status: 401 });
  }

  const body = await request.text();

  const wh = new Webhook(CLERK_WEBHOOK_SECRET);
  let event: ClerkWebhookEvent;

  try {
    event = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkWebhookEvent;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown verification error";
    log.error("Webhook signature verification failed", { error: message });
    return new Response("Invalid signature", { status: 401 });
  }

  log.info("Webhook received", { type: event.type, clerkId: event.data.id });

  // ─── Route to handler ──────────────────────────────────────────────────────

  try {
    switch (event.type) {
      case "user.created":
        await handleUserCreated(event);
        break;
      case "user.updated":
        await handleUserUpdated(event);
        break;
      case "user.deleted":
        await handleUserDeleted(event);
        break;
      default:
        log.info("Unhandled webhook event type", { type: event.type });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown DB error";
    log.error("Webhook handler failed", { type: event.type, clerkId: event.data.id, error: message });
    // WHY: Still return 200 — we don't want Clerk to retry on DB errors.
    //      The webhook is valid; the failure is on our side.
  }

  return new Response("OK", { status: 200 });
}

// ─── Event Handlers ──────────────────────────────────────────────────────────────

async function handleUserCreated(event: ClerkWebhookEvent): Promise<void> {
  const { data } = event;

  const email = getPrimaryEmail(data.email_addresses);
  const name = getDisplayName(data.first_name, data.last_name);

  await db.insert(users).values({
    clerkId: data.id,
    email,
    name,
    imageUrl: data.image_url,
    // role and plan use schema defaults ('user', 'free')
  }).onConflictDoNothing({
    target: users.clerkId,
    // WHY: If the user already exists (race condition), don't fail — just skip.
  });

  log.info("User created", { clerkId: data.id, email });
}

async function handleUserUpdated(event: ClerkWebhookEvent): Promise<void> {
  const { data } = event;

  const email = getPrimaryEmail(data.email_addresses);
  const name = getDisplayName(data.first_name, data.last_name);

  await db
    .update(users)
    .set({
      email,
      name,
      imageUrl: data.image_url,
      updatedAt: new Date(),
    })
    .where(eq(users.clerkId, data.id));

  log.info("User updated", { clerkId: data.id, email });
}

async function handleUserDeleted(event: ClerkWebhookEvent): Promise<void> {
  const { data } = event;

  // WHY: Soft-delete instead of hard-delete — preserves FK integrity for
  //      historical funnels/purchases that reference this user.
  await db
    .update(users)
    .set({
      role: "deleted",
      updatedAt: new Date(),
    })
    .where(eq(users.clerkId, data.id));

  log.info("User soft-deleted", { clerkId: data.id });
}
