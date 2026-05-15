/**
 * Purpose: Next.js middleware — domain redirect + API key protection.
 * WHY: Funnel A/B routing has been moved to the Express variant router (src/router/).
 *      This middleware only handles:
 *      1. Redirects app.nutrovia.co → nutrovia.co for consistent branding
 *      2. Protects sensitive API endpoints with x-api-key
 *
 * Funnel routing is handled by:
 *   - Express router (src/router/index.ts) on port 3001
 *   - Nginx routes *.nutrovia.co → router:3001
 *   - Nginx routes /funnels/* → router:3001 (backward compat)
 */

import { NextResponse, type NextRequest } from "next/server";

// ─── Protected API routes ───────────────────────────────────────────────────────

const PROTECTED_API_PATTERNS = [
  { method: "GET", pattern: /^\/api\/orders\/?$/ },
  { method: "GET", pattern: /^\/api\/orders\/export/ },
  { method: "PATCH", pattern: /^\/api\/orders\/[^/]+$/ },
];

function isProtectedRoute(method: string, pathname: string): boolean {
  return PROTECTED_API_PATTERNS.some(
    (p) => p.method === method && p.pattern.test(pathname),
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get("host") || "";

  // ── Domain redirect: app.nutrovia.co → nutrovia.co ──
  if (host.startsWith("app.nutrovia.co")) {
    const url = request.nextUrl.clone();
    url.host = "nutrovia.co";
    return NextResponse.redirect(url, 301);
  }

  // ── API key protection for sensitive endpoints ──
  if (isProtectedRoute(request.method, pathname)) {
    const apiKey = request.headers.get("x-api-key");
    const validKeys = process.env.AGENT_API_KEYS?.split(",").map(k => k.trim()).filter(Boolean);

    if (!validKeys || validKeys.length === 0) {
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
