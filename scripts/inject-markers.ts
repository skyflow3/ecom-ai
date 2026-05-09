/**
 * Purpose: One-time script to inject {{SLOT}} markers into the SmoothSpire template.
 *          Reads the raw winner HTML, replaces text content with markers,
 *          saves as a "marked" template ready for the template engine.
 *
 * Run: npx tsx scripts/inject-markers.ts
 *
 * WHY: The raw HTML has no markers. We need to replace specific text regions
 *      with {{SLOT_NAME}} so the template engine can do simple string replacement.
 *      This only needs to run ONCE to create the marked template.
 */

import * as fs from 'fs';
import * as path from 'path';

const TEMPLATE_DIR = path.join(__dirname, '..', 'templates');
const SRC_FILE = path.join(TEMPLATE_DIR, 'smoothspire-advertorial.html');
const DST_FILE = path.join(TEMPLATE_DIR, 'smoothspire-advertorial.marked.html');

function main() {
  console.log('Reading raw template...');
  let html = fs.readFileSync(SRC_FILE, 'utf-8');
  console.log(`Size: ${(html.length / 1024).toFixed(0)} KB\n`);

  // ─── Strategy: Replace specific text patterns with markers ─────────
  // Each replacement targets a unique text string in the HTML.

  const replacements: Array<{ search: string | RegExp; marker: string; label: string }> = [
    // Header
    { search: "Trending in 'Health'", marker: '{{header_category_badge}}', label: 'Category badge' },

    // Breadcrumb
    { search: 'Home &gt; Pain Relief &gt; Sciatica', marker: '{{breadcrumb_text}}', label: 'Breadcrumb' },

    // Headlines
    { search: 'Top Physiotherapist: \u201CThis Is the Fastest Way to Fix Sciatica for Good\u201D', marker: '{{headline}}', label: 'Headline' },

    // Subheadline (italic block after headline)
    {
      search: /Former chronic pain sufferer exposes the \$47 billion back pain conspiracy - and the \s*<span[^>]*class="[^"]*">15-minute trick that ended 18 years of agony \(without pills, shots, or surgery\)<\/span>/,
      marker: '{{subheadline}}',
      label: 'Subheadline'
    },

    // Byline
    {
      search: /Written by Dr\. Blane Schilling, PT, MD\| \s*<span[^>]*class="[^"]* dynamic-date">Jul 15, 2025<\/span>/,
      marker: '{{byline_text}}',
      label: 'Byline'
    },

    // Rating count
    { search: '3,791 Ratings', marker: '{{hero_rating_text}}', label: 'Rating count' },

    // Section 1 heading
    { search: 'THE NIGHT EVERYTHING CHANGED\u2026', marker: '{{section_1_heading}}', label: 'Section 1 heading' },

    // Section 2 heading
    { search: 'THE MIND BLOWING DISCOVERY', marker: '{{section_2_heading}}', label: 'Section 2 heading' },

    // Section 3 heading
    { search: 'THE REAL ROOT CAUSE OF SCIATICA', marker: '{{section_3_heading}}', label: 'Section 3 heading' },

    // Section 4 heading (the 15-minute miracle)
    {
      search: 'THE 15-MINUTE MIRACLE HIDING IN PLAIN SIGHT',
      marker: '{{section_4_heading}}',
      label: 'Section 4 heading'
    },

    // Section 5 heading (industry pushback)
    {
      search: 'THIS BREAKTHROUGH IS PISSING OFF AN ENTIRE INDUSTRY',
      marker: '{{section_5_heading}}',
      label: 'Section 5 heading'
    },

    // Section 6 heading (threats)
    {
      search: "WHEN YOU MESS WITH \$47 BILLION, THEY COME FOR YOU",
      marker: '{{section_6_heading}}',
      label: 'Section 6 heading'
    },

    // Section 7 heading (product intro)
    {
      search: 'INTRODUCING THE DEVICE THAT ACTUALLY FIXES SCIATICA',
      marker: '{{section_7_heading}}',
      label: 'Section 7 heading'
    },

    // Section 8 heading (how it works)
    {
      search: "HERE'S EXACTLY HOW IT DESTROYS SCIATICA IN 15 MINUTES",
      marker: '{{section_8_heading}}',
      label: 'Section 8 heading'
    },

    // Section 9 heading (results)
    {
      search: 'THE RESULTS THAT HAVE DOCTORS SCRAMBLING',
      marker: '{{section_9_heading}}',
      label: 'Section 9 heading'
    },

    // Section 10 heading (price)
    {
      search: "THE PRICE THAT'S CAUSING MEDICAL INDUSTRY PANIC",
      marker: '{{section_10_heading}}',
      label: 'Section 10 heading'
    },

    // Section 11 heading (urgency/catch)
    {
      search: "BUT HERE'S THE CATCH (AND IT'S A BIG ONE)",
      marker: '{{section_11_heading}}',
      label: 'Section 11 heading'
    },

    // Section 12 heading (guarantee)
    {
      search: 'MY PERSONAL 90-DAY "PAIN FREE" GUARANTEE',
      marker: '{{section_12_heading}}',
      label: 'Section 12 heading'
    },

    // Section 13 heading (choice)
    {
      search: 'THE CHOICE THAT WILL DEFINE YOUR NEXT DECADE',
      marker: '{{section_13_heading}}',
      label: 'Section 13 heading'
    },

    // Section 14 heading (next steps)
    {
      search: "HERE'S EXACTLY WHAT TO DO NEXT",
      marker: '{{section_14_heading}}',
      label: 'Section 14 heading'
    },

    // Product name (global) - use a marker that gets replaced everywhere
    {
      search: 'SmoothSpine Triple Fusion Massager',
      marker: '{{product_name}}',
      label: 'Product name (global)'
    },

    // SmoothSpine (short form) - appears in some contexts
    {
      search: 'SmoothSpine',
      marker: '{{product_name}}',
      label: 'Product name short'
    },

    // CTA text (appears multiple times)
    {
      search: 'Check Availability Now \u2192',
      marker: '{{cta_text}}',
      label: 'CTA text'
    },

    // Prices
    { search: '$119.95', marker: '{{product_price}}', label: 'Price' },
    { search: '$299.95', marker: '{{product_original_price}}', label: 'Original price' },
    { search: '60% OFF', marker: '{{product_discount_pct}}', label: 'Discount pct' },

    // Sidebar title
    {
      search: 'Finally! Get Instant Relief From Sciatica!',
      marker: '{{sidebar_product_title}}',
      label: 'Sidebar title'
    },

    // Update box title
    {
      search: "Mother\u2019s Day Sale - 60% OFF!",
      marker: '{{update_box_title}}',
      label: 'Update box title'
    },

    // Update box date
    {
      search: 'As of Jul 15, 2025',
      marker: '{{update_box_date}}',
      label: 'Update box date'
    },

    // Guarantee text
    {
      search: '90 Day Money Back Guarantee',
      marker: '{{trust_badge_guarantee}}',
      label: 'Trust badge guarantee'
    },
  ];

  let replaced = 0;
  let failed = 0;

  for (const repl of replacements) {
    if (repl.search instanceof RegExp) {
      const match = html.match(repl.search);
      if (match) {
        html = html.replace(repl.search, repl.marker);
        console.log(`  OK: ${repl.label}`);
        replaced++;
      } else {
        console.log(`  SKIP: ${repl.label} (pattern not found)`);
        failed++;
      }
    } else {
      const count = (html.match(new RegExp(repl.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
      if (count > 0) {
        html = html.split(repl.search).join(repl.marker);
        console.log(`  OK: ${repl.label} (${count} occurrences)`);
        replaced++;
      } else {
        console.log(`  SKIP: ${repl.label} (not found)`);
        failed++;
      }
    }
  }

  // Save marked template
  fs.writeFileSync(DST_FILE, html, 'utf-8');
  console.log(`\nMarked template saved: ${DST_FILE}`);
  console.log(`Replaced: ${replaced}, Skipped: ${failed}`);
  console.log(`Size: ${(html.length / 1024).toFixed(0)} KB`);
}

main();
