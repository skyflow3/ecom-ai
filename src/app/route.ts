/**
 * Purpose: Root route handler — serves product page for visitors
 * WHY: nutrovia.co/ must show a real product page (Stripe/Google verification),
 *      not a dashboard login. Dashboard is at /dashboard, auth at /sign-in.
 * Dependencies: fs, path
 * Related: src/app/api/funnel/[page]/route.ts
 */

import { readFileSync, existsSync } from "fs";
import { join } from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  const candidates = [
    join(process.cwd(), "public", "product.html"),
    join(process.cwd(), ".next", "standalone", "public", "product.html"),
    join(process.cwd(), "..", "public", "product.html"),
  ];

  for (const filePath of candidates) {
    if (existsSync(filePath)) {
      const html = readFileSync(filePath, "utf-8");
      return new Response(html, {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-cache",
        },
      });
    }
  }

  return new Response("Product page not found", { status: 404 });
}
