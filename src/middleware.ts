/**
 * Purpose: Passthrough middleware — Clerk disabled
 * WHY: Clerk auth is not needed for current usage (static funnel generation via scripts).
 *      All routes are public. Re-enable Clerk when SaaS dashboard is needed.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
