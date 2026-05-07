/**
 * Purpose: One-time seed endpoint — populates initial data
 * Dependencies: postgres (raw SQL)
 * Related: /api/admin/setup (run setup FIRST to create tables)
 *
 * WHY: Standalone Docker build can't run tsx/seed.ts directly.
 *      This endpoint inserts offer templates + RAG patterns via raw SQL.
 *      Call once: GET /api/admin/seed (after /api/admin/setup)
 */

import { NextResponse } from "next/server";
import postgres from "postgres";

export const dynamic = "force-dynamic";

const OFFER_TEMPLATES = [
  {
    name: "Buy 1 Get 1 Free",
    category: "bogo",
    source: "lab-tested",
    estimatedCvr: "15%",
    bestForNiches: ["health", "supplement", "beauty", "pet"],
    funnelFlow: ["product-page", "checkout", "upsell", "thank-you"],
    config: { quantities: [1, 1], prices: [1, 0], labels: ["Buy", "Free"] },
    headlines: ["Buy 1, Get 1 FREE — Limited Time!"],
    ctaTexts: ["Claim Your Free Bottle", "Yes! I Want 2 for the Price of 1"],
    guaranteeTexts: ["90-Day Money-Back Guarantee"],
    isProven: true,
  },
  {
    name: "3-Bundle Most Popular",
    category: "bundle",
    source: "lab-tested",
    estimatedCvr: "22%",
    bestForNiches: ["health", "supplement", "beauty", "pet"],
    funnelFlow: ["product-page", "checkout", "upsell", "downsell", "thank-you"],
    config: { quantities: [1, 3, 6], pricePerUnit: [1.0, 0.67, 0.50], labels: ["Single", "Most Popular", "Best Value"] },
    headlines: ["Most Popular: 3 Bottles at 33% OFF"],
    ctaTexts: ["Get My 3-Bottle Deal", "Yes! Give Me the Best Value"],
    guaranteeTexts: ["90-Day Money-Back Guarantee", "Free Shipping on 3+ Bottles"],
    isProven: true,
  },
  {
    name: "Free Trial + Shipping",
    category: "free_trial",
    source: "lab-tested",
    estimatedCvr: "35%",
    bestForNiches: ["health", "supplement", "beauty"],
    funnelFlow: ["product-page", "checkout", "upsell", "thank-you"],
    config: { shippingOnly: true, trialDays: 14, subscriptionPrice: 0.8 },
    headlines: ["Try It FREE — Just Pay Shipping"],
    ctaTexts: ["Start My Free Trial", "Yes! Send My Free Bottle"],
    guaranteeTexts: ["Cancel Anytime — No Questions Asked"],
    isProven: true,
  },
  {
    name: "Subscribe & Save 20%",
    category: "subscription",
    source: "industry-standard",
    estimatedCvr: "18%",
    bestForNiches: ["health", "supplement", "beauty", "pet"],
    funnelFlow: ["product-page", "checkout", "upsell", "thank-you"],
    config: { discount: 0.20, intervals: ["monthly", "quarterly"], defaultInterval: "monthly" },
    headlines: ["Save 20% With Monthly Delivery"],
    ctaTexts: ["Subscribe & Save 20%", "Start My Monthly Supply"],
    guaranteeTexts: ["Skip, Pause, or Cancel Anytime"],
    isProven: true,
  },
  {
    name: "Flash Sale 50% Off",
    category: "flash_sale",
    source: "lab-tested",
    estimatedCvr: "28%",
    bestForNiches: ["health", "supplement", "beauty", "pet"],
    funnelFlow: ["product-page", "checkout", "thank-you"],
    config: { discount: 0.50, urgencyHours: 24 },
    headlines: ["FLASH SALE: 50% OFF — Ends Tonight!"],
    ctaTexts: ["Grab 50% Off Now", "Yes! I Want Half Price"],
    guaranteeTexts: ["90-Day Money-Back Guarantee"],
    isProven: true,
  },
  {
    name: "Buy 2 Get 1 Free",
    category: "bogo",
    source: "lab-tested",
    estimatedCvr: "19%",
    bestForNiches: ["health", "supplement", "beauty", "pet"],
    funnelFlow: ["product-page", "checkout", "upsell", "thank-you"],
    config: { quantities: [2, 1], prices: [1, 1, 0], labels: ["Buy 2", "Get 1 Free"] },
    headlines: ["Buy 2, Get 1 FREE — Save 33%"],
    ctaTexts: ["Get 3 for the Price of 2", "Claim My Free Bottle"],
    guaranteeTexts: ["90-Day Money-Back Guarantee"],
    isProven: true,
  },
  {
    name: "Starter Kit",
    category: "bundle",
    source: "industry-standard",
    estimatedCvr: "12%",
    bestForNiches: ["health", "supplement", "beauty"],
    funnelFlow: ["product-page", "checkout", "thank-you"],
    config: { items: ["product", "guide", "shaker"], bundlePrice: 0.75 },
    headlines: ["Complete Starter Kit — Everything You Need"],
    ctaTexts: ["Get My Starter Kit", "Start My Journey"],
    guaranteeTexts: ["90-Day Money-Back Guarantee"],
    isProven: false,
  },
  {
    name: "Loyalty Repeat Discount",
    category: "loyalty",
    source: "industry-standard",
    estimatedCvr: "10%",
    bestForNiches: ["health", "supplement", "beauty", "pet"],
    funnelFlow: ["product-page", "checkout", "thank-you"],
    config: { discount: 0.15, minOrders: 2 },
    headlines: ["Welcome Back! 15% Off Your Next Order"],
    ctaTexts: ["Claim My 15% Discount", "Reorder Now"],
    guaranteeTexts: ["Same 90-Day Guarantee"],
    isProven: false,
  },
  {
    name: "Referral $10/$10",
    category: "referral",
    source: "industry-standard",
    estimatedCvr: "8%",
    bestForNiches: ["health", "supplement", "beauty", "pet"],
    funnelFlow: ["thank-you"],
    config: { referrerCredit: 10, friendDiscount: 10 },
    headlines: ["Give $10, Get $10"],
    ctaTexts: ["Share With a Friend"],
    guaranteeTexts: ["Friend Gets $10 Off Their First Order"],
    isProven: false,
  },
  {
    name: "Guarantee Bundle",
    category: "guarantee",
    source: "lab-tested",
    estimatedCvr: "14%",
    bestForNiches: ["health", "supplement", "beauty", "pet"],
    funnelFlow: ["product-page", "checkout", "upsell", "thank-you"],
    config: { guaranteeDays: 90, bundleDiscount: 0.30 },
    headlines: ["Try Risk-Free: 90-Day Empty Bottle Guarantee"],
    ctaTexts: ["Try Risk-Free", "Start My 90-Day Trial"],
    guaranteeTexts: ["Full refund even if the bottle is empty"],
    isProven: true,
  },
];

// WHY: 20 validated RAG patterns from lab testing
const RAG_PATTERNS = [
  { patternType: "section_sequence", pageType: "upsell", description: "Problem reminder → new mechanism → social proof → irresistible offer → urgency CTA", liftPercent: 23.5, sampleSize: 4500 },
  { patternType: "section_sequence", pageType: "upsell", description: "Exclusivity frame → secret reveal → limited availability → one-click add → confirmation", liftPercent: 18.2, sampleSize: 3200 },
  { patternType: "cta_copy", pageType: "upsell", description: "Yes! Add [BOTTLE_COUNT] More at [DISCOUNT]% OFF", liftPercent: 31.7, sampleSize: 5800 },
  { patternType: "cta_copy", pageType: "upsell", description: "Unlock My [DISCOUNT]% Discount — Add to Order", liftPercent: 27.4, sampleSize: 4100 },
  { patternType: "urgency_element", pageType: "upsell", description: "Timer counting down from 10:00 with 'This offer expires when you leave this page'", liftPercent: 15.8, sampleSize: 2900 },
  { patternType: "social_proof", pageType: "upsell", description: " '[X] people upgraded in the last hour' notification bar", liftPercent: 12.3, sampleSize: 3800 },
  { patternType: "price_anchor", pageType: "upsell", description: "Show original price crossed out → new price → per-unit savings highlighted", liftPercent: 19.6, sampleSize: 4200 },
  { patternType: "risk_reversal", pageType: "upsell", description: "Full 90-day guarantee specifically on the upsell item (not just main product)", liftPercent: 14.1, sampleSize: 3100 },
  { patternType: "section_sequence", pageType: "checkout", description: "Order summary → trust badges → guarantee → testimonials → secure checkout button", liftPercent: 22.8, sampleSize: 6200 },
  { patternType: "section_sequence", pageType: "checkout", description: "Progress bar (step 1/2) → form fields → order bump → total → pay button", liftPercent: 17.5, sampleSize: 4500 },
  { patternType: "cta_copy", pageType: "checkout", description: "Complete My Order — [AMOUNT]", liftPercent: 25.3, sampleSize: 5100 },
  { patternType: "cta_copy", pageType: "checkout", description: "Secure Checkout — 256-bit SSL Encrypted", liftPercent: 21.1, sampleSize: 4800 },
  { patternType: "trust_element", pageType: "checkout", description: "McAfee/Norton badges + payment method logos inline above CTA", liftPercent: 16.7, sampleSize: 3900 },
  { patternType: "order_bump", pageType: "checkout", description: "Checkbox: 'Add [PRODUCT] for just $[PRICE] — [SAVINGS]% OFF' with one-click add", liftPercent: 34.2, sampleSize: 7200 },
  { patternType: "form_optimization", pageType: "checkout", description: "Single-page checkout with inline validation and auto-complete enabled", liftPercent: 13.4, sampleSize: 3500 },
  { patternType: "guarantee_placement", pageType: "checkout", description: "Guarantee badge directly below pay button + expanded text on hover", liftPercent: 11.9, sampleSize: 2800 },
  { patternType: "exit_intent", pageType: "checkout", description: "Exit-intent popup: 'Wait! Complete your order and get FREE shipping'", liftPercent: 18.6, sampleSize: 4100 },
  { patternType: "urgency_element", pageType: "checkout", description: "Inventory counter: 'Only [X] left at this price' with live decrement", liftPercent: 14.8, sampleSize: 3300 },
  { patternType: "section_sequence", pageType: "downsell", description: "Acknowledgment → reduced offer → same guarantee → simple yes/no CTA", liftPercent: 19.3, sampleSize: 2600 },
  { patternType: "cta_copy", pageType: "downsell", description: "I'll Take the Smaller Discount — Save [AMOUNT]", liftPercent: 22.1, sampleSize: 3100 },
];

export async function GET() {
  const results: string[] = [];

  try {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      return NextResponse.json({ error: "DATABASE_URL not set" }, { status: 500 });
    }

    const sql = postgres(connectionString, { max: 1 });

    // ── Step 1: Seed Offer Templates ───────────────────────────────────────
    let offerCount = 0;
    for (const t of OFFER_TEMPLATES) {
      try {
        await sql`
          INSERT INTO offer_templates (name, category, source, "estimatedCvr", "bestForNiches", "funnelFlow", config, headlines, "ctaTexts", "guaranteeTexts", "isProven", "isActive")
          VALUES (${t.name}, ${t.category}, ${t.source}, ${t.estimatedCvr}, ${t.bestForNiches}, ${t.funnelFlow}, ${sql.json(t.config)}, ${t.headlines}, ${t.ctaTexts}, ${t.guaranteeTexts}, ${t.isProven}, true)
          ON CONFLICT DO NOTHING
        `;
        offerCount++;
      } catch (err: any) {
        results.push(`Offer "${t.name}" error: ${err?.message}`);
      }
    }
    results.push(`Seeded ${offerCount}/${OFFER_TEMPLATES.length} offer templates`);

    // ── Step 2: Seed RAG Patterns ──────────────────────────────────────────
    let patternCount = 0;
    for (const p of RAG_PATTERNS) {
      try {
        await sql`
          INSERT INTO winning_patterns ("patternType", "pageType", vertical, description, "blockSignature", "liftPercent", confidence, "sampleSize", status)
          VALUES (${p.patternType}, ${p.pageType}, 'general', ${p.description}, ${sql.json({})}, ${p.liftPercent}, 0.95, ${p.sampleSize}, 'sop')
          ON CONFLICT DO NOTHING
        `;
        patternCount++;
      } catch (err: any) {
        results.push(`Pattern error: ${err?.message}`);
      }
    }
    results.push(`Seeded ${patternCount}/${RAG_PATTERNS.length} RAG patterns`);

    await sql.end();

    return NextResponse.json({ status: "done", steps: results });
  } catch (error: any) {
    return NextResponse.json({ status: "error", error: error?.message, steps: results }, { status: 500 });
  }
}
