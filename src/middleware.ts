/**
 * Purpose: Request middleware — domain redirect + agent API key protection
 * WHY: funnel pages are public, but order listing/export/update require authentication.
 *      Single order GET is public (thank you page) — UUIDs are unguessable.
 *      Redirect app.nutrovia.co → nutrovia.co for consistent branding.
 *      Uses AGENT_API_KEYS (comma-separated) per Architecture Finale.md §19 env config.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require x-api-key header
const PROTECTED_API_PATTERNS = [
  { method: "GET", pattern: /^\/api\/orders\/?$/ },           // LIST all orders
  { method: "GET", pattern: /^\/api\/orders\/export/ },       // Export orders
  { method: "PATCH", pattern: /^\/api\/orders\/[^/]+$/ },     // UPDATE order status
];

function isProtectedRoute(method: string, pathname: string): boolean {
  return PROTECTED_API_PATTERNS.some(
    (p) => p.method === method && p.pattern.test(pathname)
  );
}

export async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;
  const host = request.headers.get("host") || "";

  // Redirect app.nutrovia.co → nutrovia.co (consistent branding for ads)
  if (host.startsWith("app.nutrovia.co")) {
    const url = request.nextUrl.clone();
    url.host = "nutrovia.co";
    return NextResponse.redirect(url, 301);
  }

  // API key protection for sensitive endpoints
  if (isProtectedRoute(request.method, pathname)) {
    const apiKey = request.headers.get("x-api-key");
    const validKeys = process.env.AGENT_API_KEYS?.split(",").map(k => k.trim()).filter(Boolean);

    if (!validKeys || validKeys.length === 0) {
      // WHY: If AGENT_API_KEYS is not configured, block protected routes entirely
      //      rather than leaving them open
      return NextResponse.json(
        { success: false, error: "Server misconfiguration: AGENT_API_KEYS not set" },
        { status: 500 },
      );
    }

    if (!apiKey || !validKeys.includes(apiKey)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: valid x-api-key header required" },
        { status: 401 },
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
