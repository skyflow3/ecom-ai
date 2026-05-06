/**
 * Purpose: Block Composition Rules — strict "grammar" for each page type.
 *          The agent cannot stack blocks randomly. Each page type has required
 *          blocks, forbidden blocks, sequence constraints, and limits.
 * Dependencies: tokens.ts (SpacingKey, PageType)
 * Related: Architecture Finale.md §46, tokens.ts, validation pipeline
 *
 * WHY: Without rules, the agent creates chaos. With rules, every page is
 *      structurally sound. The agent composes within this strict frame.
 */

import type { SpacingKey, PageType } from './tokens';

// ─── Composition Rule Interface ──────────────────────────────────────────────

export interface CompositionRule {
  /** Blocks that MUST appear in this relative order (can insert between) */
  requiredSequence: BlockName[];
  /** Blocks that MUST be present somewhere in the page */
  requiredBlocks: BlockName[];
  /** Blocks that MUST NOT appear */
  forbiddenBlocks: BlockName[];
  /** Spacing token key between sections */
  sectionGap: SpacingKey;
  /** Max headline character count (mobile readability) */
  headlineMaxChars: number;
  /** Max total blocks to prevent infinite pages */
  maxBlocks: number;
}

// ─── Block Names ─────────────────────────────────────────────────────────────
// Standardized block names used across composition rules, validation, and prompts.

export type BlockName =
  | 'hero'
  | 'headline'
  | 'subheadline'
  | 'heading'
  | 'body-text'
  | 'image'
  | 'video'
  | 'button'
  | 'cta'
  | 'bundle-offers'
  | 'pricing-card'
  | 'add-to-cart'
  | 'reviews'
  | 'testimonial'
  | 'comparison-chart'
  | 'faq'
  | 'guarantee'
  | 'trust-badges'
  | 'countdown'
  | 'product-carousel'
  | 'form'
  | 'quiz-step'
  | 'order-summary'
  | 'payment-form'
  | 'social-proof'
  | 'benefits-list'
  | 'features-grid'
  | 'before-after'
  | 'icon-list'
  | 'scrolling-marquee'
  | 'progress-bar'
  | 'selling-plan-toggle'
  | 'discount-code'
  | 'payment-options'
  | 'shipping-form'
  | 'scarcity-badge'
  | 'negative-opt-out';

// ─── Page Composition Rules ─────────────────────────────────────────────────

export const PAGE_COMPOSITION_RULES: Record<PageType, CompositionRule> = {
  'product-page': {
    requiredSequence: ['hero', 'bundle-offers', 'add-to-cart'],
    requiredBlocks: ['hero', 'bundle-offers', 'reviews', 'add-to-cart', 'guarantee', 'faq'],
    forbiddenBlocks: ['form', 'quiz-step'],
    sectionGap: '10',
    headlineMaxChars: 60,
    maxBlocks: 15,
  },

  advertorial: {
    requiredSequence: ['hero'],
    requiredBlocks: ['hero', 'reviews', 'button'],
    forbiddenBlocks: ['payment-form', 'order-summary', 'quiz-step'],
    sectionGap: '8',
    headlineMaxChars: 80,
    maxBlocks: 20,
  },

  vsl: {
    requiredSequence: ['hero', 'button'],
    requiredBlocks: ['hero', 'button'],
    forbiddenBlocks: ['payment-form', 'bundle-offers', 'quiz-step'],
    sectionGap: '10',
    headlineMaxChars: 50,
    maxBlocks: 15,
  },

  checkout: {
    requiredSequence: ['bundle-offers', 'order-summary', 'shipping-form', 'payment-form'],
    requiredBlocks: ['bundle-offers', 'order-summary', 'shipping-form', 'payment-form', 'trust-badges', 'guarantee', 'countdown', 'scarcity-badge'],
    forbiddenBlocks: ['hero', 'comparison-chart', 'product-carousel', 'quiz-step', 'reviews'],
    sectionGap: '4',
    headlineMaxChars: 40,
    maxBlocks: 10,
  },

  upsell: {
    requiredSequence: ['heading', 'bundle-offers', 'add-to-cart'],
    requiredBlocks: ['heading', 'bundle-offers', 'add-to-cart', 'countdown', 'guarantee', 'negative-opt-out'],
    forbiddenBlocks: ['payment-form', 'faq', 'comparison-chart', 'product-carousel', 'quiz-step'],
    sectionGap: '4',
    headlineMaxChars: 50,
    maxBlocks: 6,
  },

  downsell: {
    requiredSequence: ['heading', 'bundle-offers', 'add-to-cart'],
    requiredBlocks: ['heading', 'bundle-offers', 'add-to-cart', 'negative-opt-out'],
    forbiddenBlocks: ['payment-form', 'faq', 'reviews', 'product-carousel'],
    sectionGap: '4',
    headlineMaxChars: 50,
    maxBlocks: 5,
  },

  optin: {
    requiredSequence: ['hero', 'form'],
    requiredBlocks: ['hero', 'form', 'trust-badges'],
    forbiddenBlocks: ['payment-form', 'order-summary', 'bundle-offers'],
    sectionGap: '8',
    headlineMaxChars: 60,
    maxBlocks: 6,
  },

  quiz: {
    requiredSequence: ['quiz-step'],
    requiredBlocks: ['quiz-step'],
    forbiddenBlocks: ['payment-form', 'order-summary', 'bundle-offers', 'comparison-chart'],
    sectionGap: '6',
    headlineMaxChars: 40,
    maxBlocks: 10,
  },

  'thank-you': {
    requiredSequence: ['heading'],
    requiredBlocks: ['heading'],
    forbiddenBlocks: ['payment-form', 'countdown', 'bundle-offers'],
    sectionGap: '6',
    headlineMaxChars: 40,
    maxBlocks: 5,
  },

  bridge: {
    requiredSequence: ['heading'],
    requiredBlocks: ['heading', 'button'],
    forbiddenBlocks: ['payment-form', 'order-summary'],
    sectionGap: '6',
    headlineMaxChars: 50,
    maxBlocks: 4,
  },
};

// ─── Page Type Structure Guides ──────────────────────────────────────────────
// Injected into the agent prompt as contextual guidance per page type.

export const PAGE_TYPE_GUIDES: Record<PageType, { structure: string; keyPoints: string }> = {
  'product-page': {
    structure: 'Hero → Social Proof (reviews HIGH!) → Images → Benefits → Trust → Bundles → Countdown → Comparison → FAQ → Guarantee → Final CTA',
    keyPoints: 'Reviews ABOVE fold. Bundle "Most Popular" pre-selected. Sticky CTA mobile.',
  },
  advertorial: {
    structure: 'Editorial Hero → Problem Story → Solution Reveal → Social Proof → Benefits → Authority → CTA woven throughout',
    keyPoints: 'NEWS ARTICLE look. Long-form. CTAs every 3-4 sections. Bold sans-serif heading.',
  },
  vsl: {
    structure: 'Hero with video → Problem → Solution → Proof → CTA (repeat 3-5x) → Guarantee → Final CTA',
    keyPoints: 'Video is the star. CTAs repeated every 3-4 sections. Scarcity badges. Max 15 sections.',
  },
  checkout: {
    structure: 'Urgency Banner (discount activated) → Countdown ("Cart reserved") → Bundle Selector (qty tiers with "Best Value"/"Most Popular" tags) → Order Summary (collapsible) → Guarantee Block → Shipping Form → Payment Form → Trust Badges → CTA "COMPLETE PURCHASE" → Security Reassurance',
    keyPoints: 'Based on 9 real winners (SmoothSpine, Vibriance, RejuvaCare, Clarifion, Airmoto, Drivse). ALL use CheckoutChamp platform. Patterns: countdown timer "Cart reserved for XX:XX", bundle selector with "Best Value"/"Most Popular" pre-selected, free shipping on ALL tiers, guarantee repeated 2-3x (90-day or 1-year), trust badges (SSL, PayPal, credit cards) next to CTA, CTA = "COMPLETE PURCHASE" in ALL CAPS, no navigation/footer, single-page form. Special cases: Airmoto has VIP bump offer ($31.63/mo) + ShipGuard ($1.95), Drivse has auto-refill subscription ($35-60/28 days), Clarifion has FAQ section. Express checkout (PayPal) at top.',
  },
  upsell: {
    structure: 'Interrupt Pattern ("WAIT!" / "IMPORTANT") → Countdown Timer → Unfinished Order Headline → Benefits (3-5 bullets) → Price Anchoring (original vs discounted) → Social Proof (testimonial, customer count) → Guarantee ("bottom-of-the-bottle") → CTA "YES! Add to My Order" → Negative Opt-Out ("No thanks, I\'ll pay full price next time")',
    keyPoints: 'Based on 12 real winners (SmoothSpine VSL x3, Vibriance text x5, Clarifion text x4). TWO types: (1) Text upsell — fast, simple, sequential. (2) VSL upsell — video pitch → reveal at timestamp → bundle cards → downsell popup. All winners: interrupt pattern "WAIT!" first line, countdown near top, one-click upgrade with clear price comparison, guarantee near CTA, secondary CTA with loss aversion, 3-5 scrolls max, no navigation/links/clutter. Emotional flow: urgency → desire → trust → action.',
  },
  downsell: {
    structure: '"Wait! Before you go" headline → Reduced offer (50%+ discount) → One-Click Accept → Negative Opt-Out',
    keyPoints: 'Triggered when user clicks "No thanks" on upsell. Simpler than upsell. Single lower-priced offer. Same interrupt pattern. "I understand this deal won\'t be available again" on decline.',
  },
  optin: {
    structure: 'Hero → Value Prop → Form (email only) → Trust',
    keyPoints: 'Email + maybe first name. NOTHING else. Button = benefit ("Get My Free Guide").',
  },
  quiz: {
    structure: 'Question → Options (2-4 visual cards) → Progress bar → Next',
    keyPoints: 'One question per screen. Visual option cards. Progress bar reduces abandonment.',
  },
  'thank-you': {
    structure: 'Confirmation → Next Steps → Upsell/Cross-sell → Social Share',
    keyPoints: 'Positive reinforcement. Order summary. Related products.',
  },
  bridge: {
    structure: 'Headline → Brief context → Button to next step',
    keyPoints: 'Single purpose: move to NEXT page. One CTA only. No distractions.',
  },
};

// ─── Validation Helpers ──────────────────────────────────────────────────────

/** Get composition rules for a page type */
export function getRules(pageType: PageType): CompositionRule {
  return PAGE_COMPOSITION_RULES[pageType];
}

/** Get all block names that appear in any page type's rules */
export function getAllBlockNames(): Set<BlockName> {
  const blocks = new Set<BlockName>();
  for (const rule of Object.values(PAGE_COMPOSITION_RULES)) {
    for (const b of rule.requiredBlocks) blocks.add(b);
    for (const b of rule.forbiddenBlocks) blocks.add(b);
    for (const b of rule.requiredSequence) blocks.add(b);
  }
  return blocks;
}

/** Check if a sequence of blocks satisfies the requiredSequence constraint */
export function validateSequence(pageType: PageType, blocks: BlockName[]): { valid: boolean; missing: BlockName[] } {
  const rule = PAGE_COMPOSITION_RULES[pageType];
  const missing: BlockName[] = [];

  // Required sequence blocks must appear in order (but can have blocks between them)
  let searchFrom = 0;
  for (const required of rule.requiredSequence) {
    const idx = blocks.indexOf(required, searchFrom);
    if (idx === -1) {
      missing.push(required);
    } else {
      searchFrom = idx + 1;
    }
  }

  return { valid: missing.length === 0, missing };
}

/** Check if all required blocks are present and no forbidden blocks exist */
export function validateBlocks(pageType: PageType, blocks: BlockName[]): {
  valid: boolean;
  missingRequired: BlockName[];
  forbiddenFound: BlockName[];
  exceedsMax: boolean;
} {
  const rule = PAGE_COMPOSITION_RULES[pageType];

  const missingRequired = rule.requiredBlocks.filter(b => !blocks.includes(b));
  const forbiddenFound = blocks.filter(b => rule.forbiddenBlocks.includes(b));

  return {
    valid: missingRequired.length === 0 && forbiddenFound.length === 0 && blocks.length <= rule.maxBlocks,
    missingRequired,
    forbiddenFound,
    exceedsMax: blocks.length > rule.maxBlocks,
  };
}
