/**
 * Purpose: Clerk middleware — route protection for ECOM-AI
 * Dependencies: @clerk/nextjs/server
 * Related: src/lib/auth.ts, src/app/api/webhooks/clerk/route.ts
 *
 * WHY: Public routes (tracking, deployed pages, webhooks) must work without auth.
 *      Protected routes (funnels CRUD, generate, deploy) require a signed-in user.
 *      Clerk middleware handles this declaratively.
 *
 * ROUTE POLICY:
 *   PUBLIC  — /, /api/webhooks/*, /api/track/*, /api/events/*, /api/pages/*
 *   PROTECT — /api/funnels/*, /api/generate, /api/deploy
 *   IGNORED — /api/webhooks/* (Clerk needs raw body, no auth check)
 */

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// WHY: Clerk is optional during initial deploy. If CLERK_SECRET_KEY is empty,
//      we skip auth middleware entirely so the app can start without Clerk configured.
const hasClerk = !!process.env.CLERK_SECRET_KEY;

/**
 * Routes that require authentication.
 * Everything else is public by default.
 */
const isProtectedRoute = createRouteMatcher([
  "/api/funnels(.*)",
  "/api/generate(.*)",
  "/api/deploy(.*)",
]);

/**
 * Routes Clerk should ignore entirely (no session injection).
 * WHY: Webhooks need the raw request body for signature verification.
 *      Clerk middleware parses the body, which breaks svix verification.
 */
const isIgnoredRoute = createRouteMatcher([
  "/api/webhooks(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  // WHY: If Clerk is not configured, skip all auth checks
  if (!hasClerk) {
    return;
  }

  // WHY: Ignored routes bypass Clerk entirely — no session cookie parsing
  if (isIgnoredRoute(request)) {
    return;
  }

  // WHY: Protected routes redirect unauthenticated users to sign-in
  if (isProtectedRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
