/**
 * Purpose: Root route handler — serves Google/Stripe compliant homepage
 * WHY: nutrovia.co/ must show a clean product page for Merchant Center verification.
 *      This is the ONLY entry point for "/" — no middleware hack needed.
 *      Dashboard at /dashboard, auth at /sign-in, funnel at /product.html.
 * Dependencies: fs
 * Related: public/index.html (the compliant page), public/product.html (Webflow funnel)
 */

import { readFileSync, existsSync } from "fs";
import { join } from "path";

// WHY: standalone mode in Docker — CWD varies depending on layer structure
const CANDIDATES = [
  join(process.cwd(), "public", "index.html"),
  join(process.cwd(), ".next", "standalone", "public", "index.html"),
  join(process.cwd(), "..", "public", "index.html"),
];

export async function GET() {
  for (const filePath of CANDIDATES) {
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

  return new Response("Homepage not found", { status: 404 });
}
