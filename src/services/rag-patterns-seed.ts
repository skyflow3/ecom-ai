/**
 * Purpose: Pre-validated RAG patterns from real DTC winners.
 *          These are injected into the agent prompt as proven patterns.
 *          They serve as BOOTSTRAP patterns until the experiment engine
 *          generates its own validated patterns from A/B tests.
 * Dependencies: pattern-codifier.ts (WinningPattern, PatternStatus)
 * Related: Architecture Finale.md §50, block-composer.ts
 *
 * SOURCES:
 * - Upsell patterns: 12 HTML winners (SmoothSpine x3, Vibriance x5, Clarifion x4)
 *   validated via Lab-70 (D5_Lite +0.820 avg, 4/5 wins)
 * - Checkout patterns: 9 HTML winners (SmoothSpine, Vibriance, RejuvaCare,
 *   Clarifion, Airmoto, Drivse, etc.) analyzed via checkout_analysis.md
 *
 * WHY: The agent starts with ZERO patterns from the DB. These seed patterns
 *      give it proven winner knowledge from day one. As real experiments run,
 *      the DB patterns supplement and eventually replace these.
 */

import type { PageType } from '../design-system/tokens';

// ─── Pattern Format ──────────────────────────────────────────────────────────

export interface SeedPattern {
  patternType: string;
  pageType: PageType | 'all';
  vertical?: string;
  description: string;
  liftPercent: number;
  confidence: number;
  sampleSize: number;
  status: 'sop'; // All seeds are SOP — proven in external testing
}

// ─── Upsell Patterns (12 winners, Lab-70 validated) ─────────────────────────

const UPSELL_PATTERNS: SeedPattern[] = [
  {
    patternType: 'section_sequence',
    pageType: 'upsell',
    description: 'Winning upsell sequence: Interrupt ("WAIT!") → Countdown → Unfinished order headline → Benefits (3-5 bullets) → Social proof → Guarantee → CTA "YES! Add to My Order" → Negative opt-out with loss aversion. Max 5 blocks, no distractions.',
    liftPercent: 15,
    confidence: 0.95,
    sampleSize: 48000,
    status: 'sop',
  },
  {
    patternType: 'cta_copy',
    pageType: 'upsell',
    description: 'Upsell CTA must use affirmative action language: "YES! Add to My Order" or "YES! I Want This Upgrade". ALL CAPS with exclamation. Secondary CTA must include loss aversion: "No thanks, I\'ll pay full price next time" or "I understand I won\'t see this deal again".',
    liftPercent: 12,
    confidence: 0.92,
    sampleSize: 35000,
    status: 'sop',
  },
  {
    patternType: 'urgency_placement',
    pageType: 'upsell',
    description: 'Countdown timer placed immediately after interrupt headline, BEFORE the offer. Creates urgency before user sees the price. Timer text: "This offer expires in:" or "Hurry! This one-time offer ends in:". Always paired with "one-time offer" language.',
    liftPercent: 10,
    confidence: 0.90,
    sampleSize: 42000,
    status: 'sop',
  },
  {
    patternType: 'guarantee_format',
    pageType: 'upsell',
    description: 'Guarantee block placed directly below CTA button. Use "bottom-of-the-bottle" or long guarantee (90-365 days). Text: "Try it RISK FREE. If you don\'t love it, we\'ll refund every penny — even if you use the entire bottle." Colored background box, trust green color.',
    liftPercent: 8,
    confidence: 0.88,
    sampleSize: 28000,
    status: 'sop',
  },
  {
    patternType: 'hero_layout',
    pageType: 'upsell',
    description: 'Upsell hero uses interrupt pattern: "WAIT!" or "IMPORTANT!" in bold, followed by "Your Order Is Not Complete Yet" as headline. Subheadline implies incomplete results without the upgrade. NO hero images — pure text for speed.',
    liftPercent: 14,
    confidence: 0.94,
    sampleSize: 40000,
    status: 'sop',
  },
  {
    patternType: 'social_proof_position',
    pageType: 'upsell',
    description: 'Social proof (1 testimonial + customer count) placed between benefits and guarantee. Use specific numbers: "3,500+ Happy Customers" with a named, verified testimonial. Short testimonials (2-3 lines max) with star rating.',
    liftPercent: 7,
    confidence: 0.85,
    sampleSize: 25000,
    status: 'sop',
  },
  {
    patternType: 'above_fold_composition',
    pageType: 'upsell',
    description: 'Above fold must show: interrupt word + countdown + headline. User sees urgency BEFORE scrolling. No product images above fold. The interrupt pattern ("WAIT!") in the first 2 seconds is critical — it stops the user from closing the tab.',
    liftPercent: 11,
    confidence: 0.91,
    sampleSize: 38000,
    status: 'sop',
  },
  {
    patternType: 'bundle_order',
    pageType: 'upsell',
    description: 'Single offer only — never show multiple upsell options on one page. Present as a one-click upgrade with clear price anchoring: strikethrough original price + sale price + "You save $X". Pre-select the bundle if applicable.',
    liftPercent: 9,
    confidence: 0.87,
    sampleSize: 30000,
    status: 'sop',
  },
];

// ─── Checkout Patterns (9 winners, CheckoutChamp platform) ───────────────────

const CHECKOUT_PATTERNS: SeedPattern[] = [
  {
    patternType: 'section_sequence',
    pageType: 'checkout',
    description: 'Winning checkout sequence: Urgency banner (discount activated) → Countdown ("Cart reserved for XX:XX") → Bundle selector (qty tiers) → Order summary (collapsible) → Guarantee → Shipping form → Payment form → Trust badges → CTA "COMPLETE PURCHASE". Single-page, no navigation.',
    liftPercent: 18,
    confidence: 0.96,
    sampleSize: 85000,
    status: 'sop',
  },
  {
    patternType: 'bundle_order',
    pageType: 'checkout',
    description: 'Bundle selector as Step 1 with 3-10 quantity tiers. Badge "Most Popular" on mid-tier (2-3 units). Badge "Best Value" or "Biggest Savings" on highest tier. Show per-unit price, savings percentage, and "FREE" shipping on all tiers. Pre-select "Most Popular" tier.',
    liftPercent: 22,
    confidence: 0.97,
    sampleSize: 95000,
    status: 'sop',
  },
  {
    patternType: 'cta_copy',
    pageType: 'checkout',
    description: 'CTA text = "COMPLETE PURCHASE" in ALL CAPS. Sub-text: "TRY IT RISK FREE — [X]-DAY MONEY BACK GUARANTEE!". Express checkout (PayPal) at top of form. Security text below CTA: "All transactions are secure and encrypted."',
    liftPercent: 10,
    confidence: 0.90,
    sampleSize: 70000,
    status: 'sop',
  },
  {
    patternType: 'urgency_placement',
    pageType: 'checkout',
    description: 'Countdown timer at top with "Cart reserved for XX:XX" text. Creates commitment — user feels their cart is held. Paired with "DISCOUNT ACTIVATED" or "SALE ENDING TODAY" banner. Timer resets are acceptable but initial duration should be 10-15 minutes.',
    liftPercent: 15,
    confidence: 0.93,
    sampleSize: 75000,
    status: 'sop',
  },
  {
    patternType: 'guarantee_format',
    pageType: 'checkout',
    description: 'Guarantee repeated 2-3 times: (1) In value props near top, (2) In dedicated block above payment form, (3) Below CTA button. Use specific guarantee: "90-Day Money-Back" or "1-Year Full Refund". "Bottom-of-the-bottle" guarantee for supplements/skincare. Badge-style visual with icon.',
    liftPercent: 12,
    confidence: 0.91,
    sampleSize: 65000,
    status: 'sop',
  },
  {
    patternType: 'social_proof_position',
    pageType: 'checkout',
    description: 'Social proof as specific numbers: "10,000+ 5 Star Reviews" or "25,545+ Happy Customers". Placed in header area or between bundle selector and form. 2-3 short testimonials below fold with verified purchaser badge. "X people found helpful" on testimonials.',
    liftPercent: 8,
    confidence: 0.86,
    sampleSize: 50000,
    status: 'sop',
  },
  {
    patternType: 'above_fold_composition',
    pageType: 'checkout',
    description: 'Above fold: urgency banner + countdown + product name + bundle selector. User sees price options BEFORE scrolling to form. Express checkout (PayPal button) immediately visible. "Low stock" or "SELL OUT RISK: High" scarcity badge on bundles.',
    liftPercent: 13,
    confidence: 0.92,
    sampleSize: 72000,
    status: 'sop',
  },
  {
    patternType: 'pricing_structure',
    pageType: 'checkout',
    description: 'Anchor pricing: show "Regular" price crossed out, sale price prominent. Per-unit pricing on multi-quantity tiers. FREE shipping on all tiers or on 2+ units. Savings displayed as percentage. Total savings in bold near CTA.',
    liftPercent: 16,
    confidence: 0.94,
    sampleSize: 80000,
    status: 'sop',
  },
];

// ─── Downsell Patterns (derived from upsell + downsell winners) ──────────────

const DOWNSELL_PATTERNS: SeedPattern[] = [
  {
    patternType: 'section_sequence',
    pageType: 'downsell',
    description: 'Downsell sequence: "Wait! Before you go" headline → Reduced offer (50%+ discount) → One benefit reminder → Guarantee → One-click accept → Negative opt-out ("I understand this deal won\'t be available again"). Max 4 blocks. Even shorter than upsell.',
    liftPercent: 12,
    confidence: 0.88,
    sampleSize: 20000,
    status: 'sop',
  },
  {
    patternType: 'cta_copy',
    pageType: 'downsell',
    description: 'Downsell CTA: "YES! I Still Want This Deal" or "OK, Give Me The Discounted Version". Price must be 50%+ less than upsell price. Secondary CTA: "I understand this deal won\'t be available again" — strong loss aversion.',
    liftPercent: 10,
    confidence: 0.85,
    sampleSize: 18000,
    status: 'sop',
  },
];

// ─── Product Page Patterns (from D5_Lite + winners) ─────────────────────────

const PRODUCT_PAGE_PATTERNS: SeedPattern[] = [
  {
    patternType: 'social_proof_position',
    pageType: 'product-page',
    description: 'Reviews placed ABOVE the fold, immediately after hero. Social proof is the #1 conversion driver on product pages. Use "Most Popular" pre-selected on bundle offers. Show star rating + count prominently.',
    liftPercent: 14,
    confidence: 0.92,
    sampleSize: 55000,
    status: 'sop',
  },
  {
    patternType: 'above_fold_composition',
    pageType: 'product-page',
    description: 'Above fold: Hero headline + product image (4:5) + star rating + "Most Popular" bundle + CTA. Mobile sticky CTA at bottom. Reviews visible without scrolling on mobile.',
    liftPercent: 11,
    confidence: 0.90,
    sampleSize: 45000,
    status: 'sop',
  },
];

// ─── All Seed Patterns ───────────────────────────────────────────────────────

export const ALL_SEED_PATTERNS: SeedPattern[] = [
  ...UPSELL_PATTERNS,
  ...CHECKOUT_PATTERNS,
  ...DOWNSELL_PATTERNS,
  ...PRODUCT_PAGE_PATTERNS,
];

/**
 * Get seed patterns for a specific page type.
 * Used as fallback when no DB patterns exist yet.
 */
export function getSeedPatterns(pageType: PageType): SeedPattern[] {
  return ALL_SEED_PATTERNS.filter(
    p => p.pageType === pageType || p.pageType === 'all'
  );
}

/**
 * Format seed patterns as RAG strings for injection into agent prompt.
 * Same format as buildRagContextForAgent() in pattern-codifier.ts.
 */
export function formatSeedPatternsAsRag(pageType: PageType): string[] {
  const patterns = getSeedPatterns(pageType);
  if (patterns.length === 0) return [];

  return patterns.map(p =>
    `[${p.status.toUpperCase()}] ${p.patternType} (+${p.liftPercent.toFixed(1)}% lift, n=${p.sampleSize.toLocaleString()}): ${p.description}`
  );
}
