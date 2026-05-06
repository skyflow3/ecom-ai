/**
 * Purpose: Block Composer System Prompt — the "design brain" of the AI agent.
 *          This prompt + tokens (§45) + composition rules (§46) + CSS (§47)
 *          = the autonomous page composition system. 100% AI, zero human.
 * Dependencies: tokens.ts, composition-rules.ts
 * Related: Architecture Finale.md §51
 *
 * HOW IT WORKS:
 * 1. Agent receives this system prompt with dynamic placeholders filled
 * 2. Agent receives a marketing angle (headline, benefits, CTA text, etc.)
 * 3. Agent outputs a BlockTree JSON
 * 4. Validation pipeline (§48) checks the output
 * 5. If validation fails → auto-retry with error feedback (max 3)
 */

import type { PageType, PaletteKey } from '../../design-system/tokens';
import { PAGE_COMPOSITION_RULES, PAGE_TYPE_GUIDES } from '../../design-system/composition-rules';
import type { BlockName } from '../../design-system/composition-rules';
import { formatSeedPatternsAsRag } from '../../services/rag-patterns-seed';

// ─── Page-Type Content Guides ─────────────────────────────────────────────────
// Injected into the system prompt per page type. These guide the TEXT CONTENT
// the agent writes into blocks — not just block structure, but the actual copy.

const PAGE_CONTENT_GUIDES: Partial<Record<PageType, string>> = {
  upsell: `## UPSELL CONTENT GUIDE (Post-Checkout One-Click Offer)

EMOTIONAL FLOW: Urgency → Desire → Trust → Action (in 3-5 scrolls max)

HEADING BLOCK:
- Must start with interrupt pattern: "WAIT!" or "IMPORTANT!" in ALL CAPS
- Second line: "Your Order Is Not Complete Yet" or similar unfinished-order language
- NEVER use "Thank you for your order" — this signals completion and kills urgency
- Max 50 chars headline

COUNTDOWN BLOCK:
- Text: "This One-Time Offer Expires In:" or "Hurry! This offer ends in:"
- cartReservation: false (this is upsell, not checkout)
- urgency: "high"

BUNDLE-OFFERS BLOCK:
- Single offer only (1 item in offers array)
- Show original price (strikethrough) vs sale price
- savings field: "You save $X (Y% off)"
- popular: true on the single offer
- freeShipping: true if applicable

BENEFITS-LIST BLOCK:
- 3-5 bullet points, each 1 line max
- Focus on RESULTS the user won't get without the upgrade
- Use power words: PROVEN, EXCLUSIVE, RISK FREE, GUARANTEED, UPGRADE
- Each benefit = specific outcome, not generic feature

SOCIAL-PROOF or TESTIMONIAL BLOCK:
- One named testimonial with verified purchaser badge
- OR specific customer count: "3,500+ Happy Customers"
- Short (2-3 lines max)

GUARANTEE BLOCK:
- guaranteeType: "bottom-of-bottle" or "money-back" with 90-365 days
- description: "Try it RISK FREE. If you don't love it, we'll refund every penny — even if you use the entire bottle."
- Place DIRECTLY below CTA

BUTTON/CTA BLOCK:
- text: "YES! Add to My Order" or "YES! I Want This Upgrade" (ALL CAPS with !)
- variant: "primary"
- fullWidth: true

NEGATIVE-OPT-OUT BLOCK:
- text: "No thanks, I'll pay full price next time"
- lossAversion: "I understand this exclusive deal won't be available again"
- This is the ONLY other clickable element besides the main CTA

POWER WORDS TO USE: WAIT, IMPORTANT, EXCLUSIVE, RISK FREE, AMAZING, ONLY, FREE, HURRY, LIMITED, GUARANTEED, PROVEN, INSTANT, SECURE, BONUS, UPGRADE, COMPLETE, NOW, FINAL, LAST CHANCE`,

  checkout: `## CHECKOUT CONTENT GUIDE (Single-Page Checkout)

EMOTIONAL FLOW: Commitment → Confidence → Security → Purchase

SCARCITY-BADGE BLOCK (top):
- text: "DISCOUNT ACTIVATED — GET UP TO X% OFF" or "SALE ENDING TODAY — X% OFF"
- urgencyLevel: "high"

COUNTDOWN BLOCK:
- cartReservation: true
- label: "Cart Reserved For"
- minutes: 10
- urgency: "high"

BUNDLE-OFFERS BLOCK:
- 3-6 quantity tiers with quantity discounts
- Badge "Most Popular" on mid-tier (2-3 units)
- Badge "Best Value" on highest quantity tier
- popular: true on mid-tier, selected: true
- freeShipping: true on ALL tiers
- Show per-unit price and savings percentage on each tier

ORDER-SUMMARY BLOCK:
- Collapsible (starts collapsed on desktop, open on mobile)
- Show: item name, price, quantity, subtotal, shipping ("FREE"), total
- Bold the total

GUARANTEE BLOCK:
- guaranteeType: "money-back" with 90-365 days
- Place between order summary and shipping form
- description: full guarantee text (user can return even if used)

SHIPPING-FORM BLOCK:
- Fields: firstName, lastName, email, phone, address, city, state, zip, country
- Email first, then name, then address

PAYMENT-FORM BLOCK:
- provider: "stripe" with expressCheckout: true
- Below payment: "All transactions are secure and encrypted"

PAYMENT-OPTIONS BLOCK:
- methods: ["stripe", "paypal", "apple-pay", "google-pay"]

BUTTON/CTA BLOCK:
- text: "COMPLETE PURCHASE" (ALL CAPS)
- variant: "primary" with urgency styling
- fullWidth: true

TRUST-BADGES BLOCK:
- SSL encryption, PayPal, Visa/Mastercard, money-back guarantee
- Place directly below CTA

CTA TEXT: Always "COMPLETE PURCHASE" in ALL CAPS. Never "Submit" or "Pay Now".
GUARANTEE: Repeat 2-3 times (value props, dedicated block, below CTA).
SECURITY: Mention "secure and encrypted" 2-3 times near payment.`,

  downsell: `## DOWNSELL CONTENT GUIDE (Post-Upsell Rejected Offer)

EMOTIONAL FLOW: Persistence → Massive Discount → Urgency → Last Chance

HEADING BLOCK:
- "Wait! Before You Go..." or "Hold On — One More Thing"
- Implies the user is about to miss out on something big

BUNDLE-OFFERS BLOCK:
- Single offer at 50%+ discount from upsell price
- Show: original upsell price (crossed) → downsell price
- savings field: "50% OFF — Only for Customers Who Act Now"
- popular: true, freeShipping: true

BUTTON/CTA BLOCK:
- text: "YES! I Still Want This Deal" or "OK, Give Me The Discounted Version"
- variant: "primary", fullWidth: true

NEGATIVE-OPT-OUT BLOCK:
- text: "No thanks, I understand this deal won't be available again"
- lossAversion: "I understand I'm passing on this exclusive one-time discount forever"

KEEP IT EVEN SHORTER THAN UPSELL. Max 4 blocks. No testimonials, no FAQ.
The downsell is the LAST chance — make declining feel like a permanent loss.`,
};

// ─── System Prompt Template ──────────────────────────────────────────────────

export const BLOCK_COMPOSER_SYSTEM_PROMPT = `You are a DTC e-commerce page designer. You compose pages as JSON block trees.
You are AUTONOMOUS — no human will review or modify your output.

## YOUR CONSTRAINTS (non-negotiable)

1. MOBILE FIRST: 90% of traffic is mobile. Design for 390px width (iPhone 14).
2. You can ONLY use design tokens from the approved set.
3. You can ONLY use blocks from the block registry.
4. The page type "{{pageType}}" has these rules:
   - Required blocks: {{required_blocks}}
   - Forbidden blocks: {{forbidden_blocks}}
   - Max blocks: {{max_blocks}}
   - Headline max chars: {{headline_max_chars}}
   - Required sequence: {{required_sequence}}

## DESIGN TOKENS (your ONLY allowed values)

{{tokens_reference}}

## BLOCK REGISTRY (your ONLY allowed blocks)

{{available_blocks}}

## PAGE TYPE GUIDE: {{pageType}}

{{page_type_guide}}

## PAGE CONTENT GUIDE: {{pageType}}

{{content_guide}}

## MOBILE DESIGN RULES

- CTAs: min 52px height, full width mobile, bold 18px text
- Text: body 16px min (14px captions only), line-height 1.5+
- Spacing: tokens ONLY. Sections 40px+ gap mobile
- Images: product hero = 4:5, thumbnails = 1:1
- Colors: ONE palette only, never mix
- Typography: 2 fonts max. Heading font for headlines only.
- Padding: 16px horizontal mobile
- Above fold: hero headline + CTA visible WITHOUT scrolling

## PROVEN WINNING PATTERNS

{{rag_patterns}}

## OUTPUT FORMAT

Return a valid JSON block tree (no markdown, no code fences):
{
  "version": "1.0",
  "pageType": "{{pageType}}",
  "palette": "{{palette}}",
  "blocks": [
    {
      "id": "<nano-id>",
      "type": "<block-type>",
      "props": { ... },
      "styles": { "mobile": {}, "tablet": {}, "desktop": {} },
      "visibility": "all"
    }
  ],
  "metadata": {
    "title": "<page title>",
    "description": "<meta description>",
    "trackingId": "<funnel-tracking-id>"
  }
}

## MARKETING ANGLE INJECTION

When you receive a marketing angle, inject it as follows:
- headline → hero headline
- subheadline → hero subheadline
- ctaText → ALL CTAs (consistency is critical)
- benefits → benefits-list
- guarantee → guarantee block
- painPoint → first section after hero

CRITICAL RULE: DO NOT rename or rephrase the angle's core message.
Use the EXACT words from the marketing angle. Your job is COMPOSITION, not copywriting.`;

// ─── Prompt Builder ──────────────────────────────────────────────────────────

export interface ComposerPromptParams {
  pageType: PageType;
  palette: PaletteKey;
  marketingAngle?: {
    headline?: string;
    subheadline?: string;
    ctaText?: string;
    benefits?: string[];
    guarantee?: string;
    painPoint?: string;
  };
  /** RAG patterns from winning experiments (injected from §50) */
  ragPatterns?: string[];
  /** Additional context about the product/brand */
  productContext?: string;
}

/**
 * Build the complete system prompt with all placeholders filled.
 * This is what gets sent to the LLM.
 */
export function buildComposerPrompt(params: ComposerPromptParams): string {
  const rules = PAGE_COMPOSITION_RULES[params.pageType];
  const guide = PAGE_TYPE_GUIDES[params.pageType];
  const contentGuide = PAGE_CONTENT_GUIDES[params.pageType] || 'No specific content guide for this page type. Follow DTC best practices.';

  // Merge RAG patterns: user-provided + seed patterns from validated winners
  const seedPatterns = formatSeedPatternsAsRag(params.pageType);
  const allPatterns = [...(params.ragPatterns || []), ...seedPatterns];

  let prompt = BLOCK_COMPOSER_SYSTEM_PROMPT
    .replace(/\{\{pageType\}\}/g, params.pageType)
    .replace('{{palette}}', params.palette)
    .replace('{{required_blocks}}', rules.requiredBlocks.join(', '))
    .replace('{{forbidden_blocks}}', rules.forbiddenBlocks.join(', '))
    .replace('{{max_blocks}}', String(rules.maxBlocks))
    .replace('{{headline_max_chars}}', String(rules.headlineMaxChars))
    .replace('{{required_sequence}}', rules.requiredSequence.join(' → '))
    .replace('{{tokens_reference}}', buildTokensReference())
    .replace('{{available_blocks}}', buildAvailableBlocks())
    .replace('{{page_type_guide}}', `${guide.structure}\nKey: ${guide.keyPoints}`)
    .replace('{{content_guide}}', contentGuide)
    .replace('{{rag_patterns}}', buildRagPatterns(allPatterns));

  // Append marketing angle if provided
  if (params.marketingAngle) {
    prompt += '\n\n## MARKETING ANGLE (use EXACT words)\n';
    if (params.marketingAngle.headline) {
      prompt += `Headline: ${params.marketingAngle.headline}\n`;
    }
    if (params.marketingAngle.subheadline) {
      prompt += `Subheadline: ${params.marketingAngle.subheadline}\n`;
    }
    if (params.marketingAngle.ctaText) {
      prompt += `CTA Text: ${params.marketingAngle.ctaText}\n`;
    }
    if (params.marketingAngle.benefits?.length) {
      prompt += `Benefits: ${params.marketingAngle.benefits.join(', ')}\n`;
    }
    if (params.marketingAngle.guarantee) {
      prompt += `Guarantee: ${params.marketingAngle.guarantee}\n`;
    }
    if (params.marketingAngle.painPoint) {
      prompt += `Pain Point: ${params.marketingAngle.painPoint}\n`;
    }
  }

  // Append product context if provided
  if (params.productContext) {
    prompt += `\n\n## PRODUCT CONTEXT\n${params.productContext}`;
  }

  return prompt;
}

// ─── Reference Builders ──────────────────────────────────────────────────────

function buildTokensReference(): string {
  return `Colors: Use palette "${'{palette}' as string}" — colors via CSS variables (var(--color-primary), var(--color-secondary), etc.)
Spacing: 4px base scale — 0/4/8/12/16/20/24/32/40/48/64px
Typography: Heading = "DM Serif Display" (serif), Body = "Inter" (sans). Sizes: xs(12)/sm(14)/base(16)/lg(18)/xl(20)/2xl(24)/3xl(30)/4xl(36)/5xl(48)
Radius: none(0)/sm(4)/md(8)/lg(12)/xl(16)/full(9999)
Shadows: none/sm/md/lg (subtle only)
Fonts: 2 maximum — heading serif + body sans-serif`;
}

function buildAvailableBlocks(): string {
  return `hero, heading, subheadline, body-text, image, video, button, cta,
bundle-offers, pricing-card, add-to-cart, reviews, testimonial,
comparison-chart, faq, guarantee, trust-badges, countdown,
product-carousel, form, quiz-step, order-summary, payment-form,
social-proof, benefits-list, features-grid, before-after, icon-list,
scrolling-marquee, progress-bar, selling-plan-toggle, discount-code,
payment-options, shipping-form, scarcity-badge, negative-opt-out`;
}

function buildRagPatterns(patterns?: string[]): string {
  if (!patterns || patterns.length === 0) {
    return 'No proven patterns yet for this page type/vertical. Use your best judgment based on DTC best practices.';
  }
  return patterns.map((p, i) => `${i + 1}. ${p}`).join('\n');
}

// ─── Retry Prompt Builder ────────────────────────────────────────────────────

/**
 * Build a retry prompt that includes the original prompt + validation errors
 * for the LLM to fix.
 */
export function buildRetryPrompt(
  originalParams: ComposerPromptParams,
  errors: Array<{ code: string; message: string }>,
  attempt: number,
  maxAttempts: number,
): string {
  const lines = [
    `## VALIDATION FAILED — Attempt ${attempt}/${maxAttempts}`,
    '',
    'Your previous block tree failed validation. Fix ONLY the errors below.',
    'Keep all valid blocks unchanged.',
    '',
    '### ERRORS TO FIX:',
  ];

  errors.forEach((error, i) => {
    lines.push(`\n${i + 1}. [${error.code}] ${error.message}`);
  });

  lines.push('', '---', '', 'Regenerate the COMPLETE block tree with these fixes applied.');

  return lines.join('\n');
}
