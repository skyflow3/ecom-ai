/**
 * Purpose: Batch-clean all HTML files of Stripe/Google/Facebook red flags
 * WHY: Remove clone comments, tracking scripts, external domain references,
 *      affiliate scripts, and GTM code that could trigger verification failures.
 *
 * Usage: node scripts/clean-html-red-flags.mjs
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join, extname } from "path";

const ROOT = join(process.cwd());

// Collect all HTML files in public/ and templates/
function collectHtmlFiles(dir, results = []) {
  if (!statSync(dir).isDirectory()) return results;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      collectHtmlFiles(full, results);
    } else if (extname(entry.name).toLowerCase() === ".html") {
      results.push(full);
    }
  }
  return results;
}

const PUBLIC_DIR = join(ROOT, "public");
const TEMPLATES_DIR = join(ROOT, "templates");

const files = [
  ...collectHtmlFiles(PUBLIC_DIR),
  ...collectHtmlFiles(TEMPLATES_DIR),
];

console.log(`Found ${files.length} HTML files to process\n`);

// ─── Replacement rules (order matters!) ──────────────────────────────────────

function cleanHtml(html, filePath) {
  const isTemplate = filePath.includes(join("templates"));
  const origLen = html.length;
  let changes = [];

  // 1. Remove "Clone created with Funnel Builder Pro" comment
  if (html.includes("<!-- Clone created with Funnel Builder Pro -->")) {
    html = html.replace(/<!-- Clone created with Funnel Builder Pro -->/g, "");
    changes.push("removed Clone comment");
  }

  // 2. Remove data-wf-domain, data-wf-page, data-wf-site from <html> tag
  if (html.includes("data-wf-domain=") || html.includes("data-wf-page=") || html.includes("data-wf-site=")) {
    html = html.replace(/ data-wf-domain="[^"]*"/g, "");
    html = html.replace(/ data-wf-page="[^"]*"/g, "");
    html = html.replace(/ data-wf-site="[^"]*"/g, "");
    changes.push("removed data-wf-* attributes");
  }

  // 3. Replace external base href with "/" (keep template markers like {{checkout_base_url}})
  //    Only replace http/https external URLs
  html = html.replace(
    /<base href="https?:\/\/[^"]*">/g,
    '<base href="/">'
  );
  // Also fix missing slash: checkout.example.comcheckout → /
  html = html.replace(
    /<base href="checkout\.example\.comcheckout">/g,
    '<base href="/">'
  );

  // 4. Remove GTM script block (GTM-MWTRXDM6) — multiline
  //    Pattern: <script>(function(w,i,g){w[g]=...})\n(window,'GTM-MWTRXDM6'... through })(window,document,'script','dataLayer','GTM-MWTRXDM6');</script>
  const gtmRegex = /<script>\(function\(w,i,g\)\{w\[g\]=w\[g\]\|\|\[\];if\(typeof w\[g\]\.push=='function'\)w\[g\]\.push\(i\)\}\)\n\(window,'GTM-MWTRXDM6','google_tags_first_party'\);<\/script>/;
  if (gtmRegex.test(html)) {
    html = html.replace(gtmRegex, "");
    changes.push("removed GTM first-party script");
  }

  // Remove the main GTM block: <script>(function(w,d,s,l){w[l]=w[l]||[];...(set developer_id...)...})(window,document,'script','dataLayer','GTM-MWTRXDM6');</script>
  // This spans multiple lines, so use [\s\S]*?
  const gtmBlockRegex = /<script>\(function\(w,d,s,l\)\{w\[l\]=w\[l\]\|\|\[\];\(function\(\)\{w\[l\]\.push\(arguments\);\}\)\('set',\s*'developer_id\.dY2E1Nz',\s*true\);[\s\S]*?\}\)\(window,document,'script','dataLayer','GTM-MWTRXDM6'\);<\/script>/;
  if (gtmBlockRegex.test(html)) {
    html = html.replace(gtmBlockRegex, "");
    changes.push("removed GTM main block");
  }

  // 5. Remove GTM noscript iframe
  const gtmNoscriptRegex = /<!-- Google Tag Manager \(noscript\) -->\s*\n?\s*<noscript><iframe src="https:\/\/www\.googletagmanager\.com\/ns\.html\?id=GTM-MWTRXDM6"[^>]*><\/iframe><\/noscript>\s*\n?\s*<!-- End Google Tag Manager \(noscript\) -->/;
  if (gtmNoscriptRegex.test(html)) {
    html = html.replace(gtmNoscriptRegex, "");
    changes.push("removed GTM noscript iframe");
  }
  // Also try without the comments
  html = html.replace(
    /<noscript><iframe src="https:\/\/www\.googletagmanager\.com\/ns\.html\?id=GTM-MWTRXDM6"[^>]*><\/iframe><\/noscript>/g,
    ""
  );

  // 6. Remove emsense.js script (Webflow site JS)
  if (html.includes("emsense.eda8e657")) {
    html = html.replace(
      /<script src="https:\/\/cdn\.prod\.website-files\.com\/6819b366c1749c40aae27841\/js\/emsense\.eda8e657\.[^"]*"[^>]*><\/script>/g,
      ""
    );
    changes.push("removed emsense.js");
  }

  // 7. Remove cf-unified-params script + __appendUrlParamsInit
  //    These are on a single line with <script src="https://cdn.node33.ai/..."> and window.__appendUrlParamsInit
  const node33Regex = /<script src="https:\/\/cdn\.node33\.ai\/cf-unified-params\.min\.js"[^>]*><\/script>/;
  if (node33Regex.test(html)) {
    html = html.replace(node33Regex, "");
    changes.push("removed node33/cf-unified-params");
  }

  // Remove __appendUrlParamsInit line
  html = html.replace(
    /window\.__appendUrlParamsInit\("?",\s*\{[^}]*\},\s*(true|false),\s*null\);?\n?/g,
    ""
  );

  // 8. Remove Everflow SDK script + tracking blocks
  //    <script type="text/javascript" src="https://www.vnftrk.com/scripts/sdk/everflow.js"></script>
  //    followed by <script type="text/javascript"> ... EF.click(...) ... EF.conversion({...}) ... </script>
  if (html.includes("everflow.js")) {
    // Remove the SDK script tag
    html = html.replace(
      /<script type="text\/javascript" src="https:\/\/www\.vnftrk\.com\/scripts\/sdk\/everflow\.js"><\/script>/g,
      ""
    );

    // Remove the EF tracking block that follows
    // Pattern: <script type="text/javascript"> ... EF.click or EF.conversion ... </script>
    // These blocks can span multiple lines
    html = html.replace(
      /<script type="text\/javascript">\s*\n?\s*var\s+EF\s*=\s*EF\s*\|\|\s*\{};[\s\S]*?<\/script>/g,
      ""
    );

    // Also try pattern with EF.click({...})
    html = html.replace(
      /<script type="text\/javascript">\s*\n?\s*EF\s*=\s*EF\s*\|\|\s*\{};[\s\S]*?<\/script>/g,
      ""
    );

    changes.push("removed Everflow SDK + tracking");
  }

  // 9. Change data-tracking-project="emsense" → "nutrovia"
  if (html.includes('data-tracking-project="emsense"')) {
    html = html.replace(
      /data-tracking-project="emsense"/g,
      'data-tracking-project="nutrovia"'
    );
    changes.push("changed tracking project emsense→nutrovia");
  }

  // 10. Remove utm_auid tracking params from URLs (product page footer links)
  //     data-original-href="https://www.tryemsense.com/...?utm_auid=..."
  if (html.includes("utm_auid=")) {
    html = html.replace(/\?utm_auid=[^"'&]*/g, "");
    html = html.replace(/&utm_auid=[^"'&]*/g, "");
    changes.push("removed utm_auid params");
  }

  // 11. Replace tryemsense.com URLs in footer/product page with local Nutrovia URLs
  if (html.includes("tryemsense.com")) {
    // Footer links with data-original-href
    html = html.replace(
      /data-original-href="https:\/\/www\.tryemsense\.com\/legal\/terms-conditions[^"]*"/g,
      'data-original-href="/terms"'
    );
    html = html.replace(
      /data-original-href="https:\/\/www\.tryemsense\.com\/legal\/privacy-policy[^"]*"/g,
      'data-original-href="/privacy"'
    );
    html = html.replace(
      /data-original-href="https:\/\/www\.tryemsense\.com\/legal\/shipping-policy[^"]*"/g,
      'data-original-href="/terms"'
    );
    html = html.replace(
      /data-original-href="https:\/\/www\.tryemsense\.com\/legal\/returns-policy[^"]*"/g,
      'data-original-href="/refund"'
    );
    html = html.replace(
      /data-original-href="https:\/\/www\.tryemsense\.com\/about[^"]*"/g,
      'data-original-href="/product.html"'
    );
    html = html.replace(
      /data-original-href="https:\/\/www\.tryemsense\.com\/disclaimer[^"]*"/g,
      'data-original-href="/terms"'
    );
    html = html.replace(
      /data-original-href="https:\/\/www\.tryemsense\.com\/legal\/legal-notice[^"]*"/g,
      'data-original-href="/terms"'
    );
    html = html.replace(
      /data-original-href="https:\/\/tracking\.tryemsense\.com\/[^"]*"/g,
      'data-original-href="/contact"'
    );
    html = html.replace(
      /data-original-href="https:\/\/www\.tryemsense\.com\/faq[^"]*"/g,
      'data-original-href="/contact"'
    );
    html = html.replace(
      /data-original-href="https:\/\/www\.tryemsense\.com\/contact[^"]*"/g,
      'data-original-href="/contact"'
    );
    // Remove everflow affiliate signup link entirely
    html = html.replace(
      /<a[^>]*href="https:\/\/betterflows\.everflowclient\.io\/affiliate\/signup[^"]*"[^>]*>[^<]*<\/a>/g,
      ""
    );
    html = html.replace(
      /data-original-href="https:\/\/betterflows\.everflowclient\.io\/affiliate\/signup[^"]*"/g,
      'data-original-href="#"'
    );
    changes.push("replaced tryemsense.com URLs with local Nutrovia URLs");
  }

  // 12. Remove Webflow jQuery reference (cdn.prod.website-files.com jQuery)
  //    Only remove the Webflow-specific jQuery, not generic CDN jQuery
  //    This is fine to keep actually — it's just jQuery from Webflow CDN. Not a red flag for Stripe.

  // 13. Clean up extra whitespace left behind
  html = html.replace(/<html class="">  <head/g, '<html class=""><head');
  html = html.replace(/<html class=""> <head/g, '<html class=""><head');
  html = html.replace(/<html  class="">/g, '<html class="">');

  // Report
  const diff = origLen - html.length;
  const rel = filePath.replace(ROOT + "\\", "").replace(/\\/g, "/");
  if (changes.length > 0) {
    console.log(`CLEANED: ${rel} (${changes.join(", ")}) [${diff} bytes removed]`);
  } else {
    console.log(`CLEAN:   ${rel} (no changes)`);
  }

  return html;
}

// ─── Process all files ────────────────────────────────────────────────────────

let totalCleaned = 0;
let totalUnchanged = 0;

for (const file of files) {
  const html = readFileSync(file, "utf-8");
  const cleaned = cleanHtml(html, file);

  if (cleaned !== html) {
    writeFileSync(file, cleaned, "utf-8");
    totalCleaned++;
  } else {
    totalUnchanged++;
  }
}

console.log(`\nDone: ${totalCleaned} files cleaned, ${totalUnchanged} unchanged`);
