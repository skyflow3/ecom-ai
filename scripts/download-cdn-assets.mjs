/**
 * Purpose: Download all Webflow CDN assets locally + replace URLs in HTML
 * WHY: Stop loading assets from cdn.prod.website-files.com (other sites' accounts)
 * Usage: node scripts/download-cdn-assets.mjs
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname, extname } from "path";
import { readdirSync, statSync } from "fs";

const ROOT = join(process.cwd());

// ─── Collect all HTML files ──────────────────────────────────────────────

function collectHtmlFiles(dir, results = []) {
  if (!statSync(dir).isDirectory()) return results;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) collectHtmlFiles(full, results);
    else if (extname(entry.name).toLowerCase() === ".html") results.push(full);
  }
  return results;
}

// ─── Extract all unique CDN URLs from HTML ──────────────────────────────

function extractCdnUrls(files) {
  const urls = new Set();
  for (const file of files) {
    const html = readFileSync(file, "utf-8");
    const regex = /https:\/\/cdn\.prod\.website-files\.com\/[^\s"'<>)]+/g;
    for (const match of html.matchAll(regex)) {
      urls.add(match[0]);
    }
  }
  return [...urls].sort();
}

// ─── Determine local path from CDN URL ──────────────────────────────────

function urlToLocalPath(url) {
  // Parse: https://cdn.prod.website-files.com/{siteId}/{assetId}_{filename}
  const match = url.match(/cdn\.prod\.website-files\.com\/([^/]+)\/([^/]+)_(.+)$/);
  if (!match) return null;
  const [, siteId, assetId, filename] = match;
  const decoded = decodeURIComponent(filename);
  const ext = extname(decoded).toLowerCase();

  // Route by extension
  if ([".woff2", ".woff", ".ttf", ".otf"].includes(ext)) {
    return `/fonts/${decoded}`;
  }
  if ([".js"].includes(ext)) {
    return `/js/cdn/${decoded}`;
  }
  if ([".json"].includes(ext)) {
    return `/json/${decoded}`;
  }
  // Images (svg, avif, webp, png, jpg)
  if ([".svg", ".avif", ".webp", ".png", ".jpg", ".jpeg", ".gif"].includes(ext)) {
    return `/images/ui/${decoded}`;
  }
  // Fallback
  return `/images/ui/${decoded}`;
}

// ─── Main ───────────────────────────────────────────────────────────────

const files = [
  ...collectHtmlFiles(join(ROOT, "public")),
  ...collectHtmlFiles(join(ROOT, "templates")),
];

console.log(`Found ${files.length} HTML files\n`);

const urls = extractCdnUrls(files);
console.log(`Found ${urls.length} unique CDN URLs\n`);

// Build mapping
const mapping = {};
for (const url of urls) {
  const localPath = urlToLocalPath(url);
  if (localPath) mapping[url] = localPath;
}

// Show mapping
console.log("URL mapping:");
for (const [url, local] of Object.entries(mapping)) {
  const short = url.split("/").pop();
  console.log(`  ${decodeURIComponent(short)} → ${local}`);
}

// Create directories
const dirs = new Set(Object.values(mapping).map(p => dirname(join(ROOT, "public", p))));
for (const dir of dirs) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

// Download assets
console.log(`\nDownloading ${Object.keys(mapping).length} assets...\n`);

let downloaded = 0;
let failed = 0;

for (const [url, localPath] of Object.entries(mapping)) {
  const filePath = join(ROOT, "public", localPath);
  if (existsSync(filePath)) {
    console.log(`  SKIP: ${localPath} (already exists)`);
    downloaded++;
    continue;
  }

  try {
    const resp = await fetch(url);
    if (!resp.ok) {
      console.log(`  FAIL: ${localPath} (HTTP ${resp.status})`);
      failed++;
      continue;
    }
    const buf = Buffer.from(await resp.arrayBuffer());
    writeFileSync(filePath, buf);
    const kb = (buf.length / 1024).toFixed(1);
    console.log(`  OK:   ${localPath} (${kb} KB)`);
    downloaded++;
  } catch (err) {
    console.log(`  FAIL: ${localPath} (${err.message})`);
    failed++;
  }
}

console.log(`\nDownload: ${downloaded} OK, ${failed} failed`);

// Replace URLs in HTML files
console.log(`\nReplacing URLs in ${files.length} HTML files...\n`);

let totalReplacements = 0;

for (const file of files) {
  let html = readFileSync(file, "utf-8");
  let replacements = 0;

  for (const [cdnUrl, localPath] of Object.entries(mapping)) {
    // Escape special regex chars in URL
    const escaped = cdnUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, 'g');
    const matches = html.match(regex);
    if (matches) {
      html = html.replace(regex, localPath);
      replacements += matches.length;
    }
  }

  if (replacements > 0) {
    writeFileSync(file, html, "utf-8");
    const rel = file.replace(ROOT + "\\", "").replace(/\\/g, "/");
    console.log(`  ${rel}: ${replacements} replacements`);
    totalReplacements += replacements;
  }
}

console.log(`\nTotal: ${totalReplacements} URL replacements across ${files.length} files`);
