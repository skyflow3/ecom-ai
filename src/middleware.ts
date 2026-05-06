/**
 * Purpose: Clerk middleware — route protection for ECOM-AI
 * Dependencies: @clerk/nextjs/server, next/server
 * Related: src/lib/auth.ts, src/app/api/webhooks/clerk/route.ts
 *
 * WHY: Public routes (tracking, deployed pages, webhooks) must work without auth.
 *      Protected routes (funnels CRUD, generate, deploy) require a signed-in user.
 *      Clerk middleware handles this declaratively.
 *
 * WHY: Clerk is loaded dynamically to prevent crashes when keys are missing/invalid.
 *      If CLERK_SECRET_KEY or NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is not set,
 *      all routes are public (passthrough middleware).
 *
 * ROUTE POLICY:
 *   PUBLIC  — /, /api/webhooks/*, /api/track/*, /api/events/*, /api/pages/*
 *   PROTECT — /api/funnels/*, /api/generate, /api/deploy
 *   IGNORED — /api/webhooks/* (Clerk needs raw body, no auth check)
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// WHY: Both keys must be present for Clerk to work properly.
//      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is baked at build time (Docker ARG).
//      CLERK_SECRET_KEY is a runtime env var.
const hasClerk =
  !!process.env.CLERK_SECRET_KEY &&
  !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

/**
 * Protected routes that require authentication.
 */
const PROTECTED_PATTERNS = ["/api/funnels", "/api/generate", "/api/deploy"];

/**
 * Ignored routes — Clerk should not process these at all.
 */
const IGNORED_PATTERNS = ["/api/webhooks"];

function matchesPatterns(pathname: string, patterns: string[]): boolean {
  return patterns.some((p) => pathname.startsWith(p));
}

export default async function middleware(request: NextRequest) {
  // WHY: If Clerk is not configured, skip all auth — passthrough
  if (!hasClerk) {
    return NextResponse.next();
  }

  // WHY: Ignored routes bypass Clerk entirely — no session cookie parsing
  if (matchesPatterns(request.nextUrl.pathname, IGNORED_PATTERNS)) {
    return NextResponse.next();
  }

  // WHY: Dynamic import prevents crash if Clerk library fails to initialize
  try {
    const { clerkMiddleware } = await import("@clerk/nextjs/server");

    // WHY: Create a fresh clerkMiddleware instance and wrap our logic
    const middleware = clerkMiddleware(async (auth) => {
      // WHY: Protected routes redirect unauthenticated users to sign-in
      if (matchesPatterns(request.nextUrl.pathname, PROTECTED_PATTERNS)) {
        await auth.protect();
      }
    });

    return middleware(request);
  } catch (error) {
    // WHY: If Clerk fails (invalid key, API unreachable), log and passthrough
    //      rather than returning 500 on every route
    console.error("[middleware] Clerk initialization failed:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
