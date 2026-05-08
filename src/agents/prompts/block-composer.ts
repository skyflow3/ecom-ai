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
import type { CopywriterOutput } from './copywriter';
import { getRecipesByPageType, type PageRecipe } from '../../design-system/recipes';

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
   - Required sequence: {{required_sequence}}
   - NO LIMIT on total blocks — use as many as needed to create the best page possible
   - NO LIMIT on headline length — make it compelling and attention-grabbing

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

// ─── Advertorial-specific content guide ───────────────────────────────────────

PAGE_CONTENT_GUIDES['advertorial'] = `## ADVERTORIAL CONTENT GUIDE (News-Style Editorial Page)

EMOTIONAL FLOW: Curiosity → Pain Agitation → Discovery → Proof → Urgency → Action

CRITICAL: This page must look like a NEWS ARTICLE, not a sales page.
It needs editorial blocks that create the "article" feel.

════════════════════════════════════════════════════════════════
MANDATORY CONTENT REQUIREMENTS (NON-NEGOTIABLE):
════════════════════════════════════════════════════════════════
- MINIMUM 30 blocks total (winners average 35-45 blocks)
- MINIMUM 8 image blocks distributed throughout (product shots, in-use, lifestyle, results)
- MINIMUM 6 body-text blocks with 3-6 paragraphs EACH
- MINIMUM 3 testimonial blocks with different people
- MINIMUM 3 editorial-heading blocks as section dividers
- MINIMUM 2 author-cta blocks (mid-article callouts)
- TARGET: 2,000-3,000 total words across all body-text blocks
- Every image block MUST have a realistic imageUrl (use descriptive placeholder URLs)

════════════════════════════════════════════════════════════════
REQUIRED BLOCK SEQUENCE (30-45 blocks):
════════════════════════════════════════════════════════════════

PHASE 1 — HEADER & OPENING (Blocks 1-6):
1. editorial-header — Logo + "Trending in [Category]" badge
2. breadcrumb — "Home > Category > Product" (desktop only)
3. hero — Headline ONLY (NO CTA, NO background). Pattern interrupt headline.
4. byline — Author avatar + name + credentials + date + "Verified Author" badge
5. image — Hero image (product or lifestyle, realistic URL)
6. body-text — Opening hook (4-5 paragraphs, ~300 words). Start with personal story.
   Pattern: "I Thought My [Problem] Was Normal..." or "Top Doctor Reveals..."
   Use **bold** on key phrases. Build curiosity and empathy.

PHASE 2 — PAIN AGITATION (Blocks 7-12):
7. editorial-heading — "THE HIDDEN PROBLEM" or similar, style: "highlight"
8. body-text — Pain deepening (3-5 paragraphs, ~250 words). Describe the suffering.
   Use specific details: "Every morning I'd wake up and...", "The doctors told me..."
9. image — Pain point illustration (person suffering, medical diagram, etc.)
10. body-text — More pain/social proof (3-4 paragraphs). Statistics, expert quotes.
11. image — Chart, infographic, or comparison visual
12. body-text — "What the medical industry won't tell you" angle (3 paragraphs)

PHASE 3 — DISCOVERY (Blocks 13-19):
13. editorial-heading — "THE BREAKTHROUGH DISCOVERY" style: "underline"
14. body-text — Discovery narrative (4-5 paragraphs, ~300 words). How researchers found it.
15. image — Product or ingredient image
16. body-text — Science/mechanism explanation (3-4 paragraphs). How it works.
17. image — Before/after or clinical study visual
18. author-cta — Mid-article CTA #1 with product mention + rating + CTA button
19. body-text — Expert endorsement (3 paragraphs). Quote a doctor/researcher.

PHASE 4 — PROOF (Blocks 20-27):
20. editorial-heading — "REAL PEOPLE, REAL RESULTS" style: "highlight"
21. testimonial — Customer story #1 (detailed, 3-4 sentences, with name and location)
22. image — Customer result photo
23. testimonial — Customer story #2 (different person, different angle)
24. body-text — Social proof paragraph (statistics, "47,300+ customers", media mentions)
25. image — Product packaging or lifestyle shot
26. author-cta — Mid-article CTA #2 with urgency ("Limited stock available")
27. benefits-list — 5-7 key benefits with checkmark icons

PHASE 5 — CONVERSION (Blocks 28-40+):
28. editorial-heading — "SPECIAL LIMITED TIME OFFER" style: "default"
29. social-proof — Customer count + urgency ("Over 47,300 satisfied customers")
30. bundle-offers — Pricing tiers (1x, 3x, 6x with "Most Popular" on mid-tier)
31. image — Product bundle/lifestyle shot
32. testimonial — Customer story #3 (focus on value/results)
33. body-text — Urgency text (stock running out, limited-time discount) 2-3 paragraphs
34. image — Scarcity visual (stock counter, timer, etc.)
35. guarantee — Money-back guarantee (90-180 days)
36. body-text — Final reassurance paragraph (risk-free, try it today)
37. button — Final CTA (full width, primary variant, strong text)
38. trust-badges — SSL, Made in USA, GMP, FDA registered, etc.
39. faq — 5-8 common questions (builds trust, addresses objections)
40. sticky-cta — Fixed bottom CTA bar (mobile, urgency variant)

════════════════════════════════════════════════════════════════
IMAGE REQUIREMENTS (CRITICAL — 8-12 images minimum):
════════════════════════════════════════════════════════════════
Every image block MUST have a "src" field with a URL. WITHOUT src THE IMAGE WILL NOT DISPLAY.
NEVER leave src empty. NEVER omit src. EVERY image block must have src set to a URL.

Image block format:
{
  "type": "image",
  "props": {
    "src": "https://placehold.co/800x600/COLOR/FFFFFF?text=Label",
    "alt": "Description of what the image shows",
    "aspectRatio": "4:5"
  }
}

Use these URLs for the src field:
- Product hero: "https://placehold.co/800x600/2D6A4F/FFFFFF?text=Product+Hero"
- Lifestyle: "https://placehold.co/800x600/F5F5DC/333333?text=Lifestyle+Image"
- Before/After: "https://placehold.co/800x400/FF6B6B/FFFFFF?text=Before+%2F+After"
- Results: "https://placehold.co/800x600/00C249/FFFFFF?text=Results"
- Ingredients: "https://placehold.co/800x600/1B1B1B/FFFFFF?text=Ingredients"
- Customer: "https://placehold.co/600x600/F0F0F0/333333?text=Customer+Photo"
- Packaging: "https://placehold.co/800x800/2D6A4F/FFFFFF?text=Product+Bundle"
- Chart: "https://placehold.co/800x400/E8F5E9/333333?text=Clinical+Study"

════════════════════════════════════════════════════════════════
BODY-TEXT DEPTH REQUIREMENTS:
════════════════════════════════════════════════════════════════
Each body-text block MUST contain 3-6 paragraphs separated by \\n\\n.
Each paragraph should be 2-4 sentences.
Use **bold** on key phrases (2-4 per body-text block).
Write like a journalist telling a story, NOT a marketer selling a product.

EXAMPLE of a GOOD body-text block (~200 words):
{
  "type": "body-text",
  "props": {
    "content": "I'll never forget the morning everything changed. I had been dealing with **chronic joint pain** for over six years, and like most people, I thought it was just something I had to live with.\\n\\nMy doctor had prescribed me the usual medications — anti-inflammatories, pain relievers, even physical therapy. Nothing worked long-term. The pain always came back, sometimes worse than before. I started to lose hope.\\n\\nThen one evening, while scrolling through a medical journal online, I stumbled upon a study that would change my life forever. Researchers at a leading university had discovered a **natural compound** that was showing remarkable results in clinical trials.\\n\\nThe study showed that participants experienced a **73% reduction in pain** after just 30 days. But what really caught my attention was that the compound had **zero side effects** — something I couldn't say about any of my current medications.\\n\\nI was skeptical, of course. I'd been burned before by \"miracle cures\" that turned out to be nothing more than expensive placebos. But something about this research felt different. It was backed by real science, published in peer-reviewed journals, and endorsed by medical professionals I actually recognized."
  }
}

════════════════════════════════════════════════════════════════
TESTIMONIAL REQUIREMENTS (3 minimum):
════════════════════════════════════════════════════════════════
Each testimonial should feel like a REAL person sharing their experience:
- Include specific details (timeframe, symptoms, results)
- Use conversational language (not marketing copy)
- Add location or "Verified Buyer" badge text
- Different angles: skeptic converted, life-changing results, best purchase ever

════════════════════════════════════════════════════════════════
EDITORIAL STYLE RULES:
════════════════════════════════════════════════════════════════
- Body text: SHORT paragraphs (2-4 sentences each). Use \\n\\n between paragraphs.
  The renderer splits on double-newline to create proper <p> tags.
- Use **bold** for emphasis on key phrases (renderer converts to <strong>)
- Section headings: ALL CAPS or Title Case ("THE REAL ROOT CAUSE", "Breakthrough Discovery")
- Headline: max 80 chars, pattern interrupt ("I Thought...", "Top Doctor Reveals...")
- Subheadline: the "hook" that makes them keep reading
- NO CTA button in the hero — the hero is the article headline only
- CTAs appear mid-article (author-cta ×2) and at bottom (button + sticky-cta)
- Include ratings text like "3,791 Ratings" in author-cta blocks

HERO BLOCK FOR ADVERTORIAL:
{
  "type": "hero",
  "props": {
    "headline": "The headline (max 80 chars, pattern interrupt)",
    "subheadline": "The hook/subtitle that creates curiosity",
    "alignment": "left"
  }
}
NOTE: No ctaText, no ctaUrl, no backgroundImage for advertorial hero.

EDITORIAL-HEADER BLOCK:
{
  "type": "editorial-header",
  "props": {
    "siteName": "Health Discovery Today",
    "categoryBadge": "Trending in Health",
    "logoSrc": ""
  }
}

BYLINE BLOCK:
{
  "type": "byline",
  "props": {
    "authorName": "Dr. Sarah Mitchell",
    "credentials": "MD, Nutritionist",
    "date": "May 9, 2026",
    "readTime": "12 min read",
    "avatarSrc": ""
  }
}

EDITORIAL-HEADING BLOCK (section dividers):
{
  "type": "editorial-heading",
  "props": {
    "text": "THE BREAKTHROUGH DISCOVERY",
    "style": "highlight"
  }
}

AUTHOR-CTA BLOCK (mid-article callout, use 2 of these):
{
  "type": "author-cta",
  "props": {
    "ctaText": "Check Availability Now →",
    "productText": "Over 47,300 customers have already transformed their health with this breakthrough.",
    "rating": 5,
    "ratingCount": "3,791 Ratings",
    "authorName": "Dr. Sarah Mitchell"
  }
}

STICKY-CTA BLOCK (mobile fixed bottom):
{
  "type": "sticky-cta",
  "props": {
    "text": "Check Availability Now →",
    "variant": "primary"
  }
}

════════════════════════════════════════════════════════════════
WORD COUNT CHECKLIST (verify before outputting):
════════════════════════════════════════════════════════════════
Before submitting, count your total words across ALL body-text blocks:
- Opening hook (Block 6): ~300 words
- Pain section (Blocks 8, 10, 12): ~600 words total
- Discovery (Blocks 14, 16, 19): ~600 words total
- Proof/urgency (Blocks 24, 33, 36): ~400 words total
- TOTAL TARGET: 2,000-3,000 words minimum

If your total is below 2,000 words, ADD more paragraphs to body-text blocks.
Do NOT submit a page with fewer than 2,000 words — it will be rejected.

POWER WORDS: BREAKTHROUGH, SECRET, DISCOVERY, SHOCKING, FORBIDDEN, EXPOSED, MIRACLE,
PROVEN, CLINICAL, DOCTOR, FINALLY, SIMPLE, NATURAL, RISK-FREE, GUARANTEED, GROUNDBREAKING,
REVOLUTIONARY, TRANSFORMATIVE, LIFE-CHANGING, EXTRAORDINARY, REMARKABLE`;

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
  /**
   * WHY: Two-call pipeline — copywriter (DeepSeek) generates text first,
   *      then composer (MiMo) places it into BlockTree structure.
   *      When provided, the composer must use these EXACT words, not rewrite.
   * Source: CHAMPION-PROMPTS-DEPLOY.md §17 Architecture Hybride
   */
  prewrittenCopy?: CopywriterOutput;
  /** RAG patterns from winning experiments (injected from §50) */
  ragPatterns?: string[];
  /** Additional context about the product/brand */
  productContext?: string;
  /**
   * WHY: Recipes give the AI a winning page structure to start from.
   *      Instead of building from scratch, the composer follows a proven template.
   *      The AI can still modify the recipe (add/remove/swap blocks) as needed.
   * Source: design-data/DESIGN-SYSTEM.md, design-system/recipes/
   */
  recipeId?: string;
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
    .replace('{{required_sequence}}', rules.requiredSequence.join(' → '))
    .replace('{{tokens_reference}}', buildTokensReference())
    .replace('{{available_blocks}}', buildAvailableBlocks())
    .replace('{{page_type_guide}}', `${guide.structure}\nKey: ${guide.keyPoints}`)
    .replace('{{content_guide}}', contentGuide)
    .replace('{{rag_patterns}}', buildRagPatterns(allPatterns));

  // WHY: When pre-written copy exists (two-call pipeline), inject it with
  //      STRONG instruction to use EXACT words. The composer is NOT a copywriter.
  if (params.prewrittenCopy) {
    const copy = params.prewrittenCopy;
    const copyLines = [
      '## PRE-WRITTEN COPY (USE THESE EXACT WORDS — DO NOT REWRITE)',
      '',
      'A professional copywriter has already written the marketing text. Your job is ONLY to place it into the block structure.',
      'Use the EXACT text below. You may adjust whitespace or add formatting, but DO NOT change words.',
      '',
      `HEADLINE: ${copy.headline}`,
      `SUBHEADLINE: ${copy.subheadline}`,
    ];

    if (copy.painPoint) copyLines.push(`PAIN POINT (opening section): ${copy.painPoint}`);
    copyLines.push(`BODY (main copy): ${copy.body.replace(/\n/g, '\n')}`);
    if (copy.benefits?.length) copyLines.push(`BENEFITS: ${copy.benefits.join(' | ')}`);
    copyLines.push(`CTA TEXT: ${copy.ctaText}`);
    if (copy.ctaSecondary) copyLines.push(`CTA SECONDARY (negative opt-out): ${copy.ctaSecondary}`);
    if (copy.guarantee) copyLines.push(`GUARANTEE: ${copy.guarantee}`);
    if (copy.testimonial) copyLines.push(`TESTIMONIAL: "${copy.testimonial.quote}" — ${copy.testimonial.name}, ${copy.testimonial.detail}`);
    if (copy.urgency) copyLines.push(`URGENCY: ${copy.urgency}`);

    prompt += '\n\n' + copyLines.join('\n');
  }

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

  // WHY: Inject a winning page recipe as the starting structure.
  //      The AI follows the proven block order but can customize content.
  //      If no recipe specified, auto-pick the best one for this page type.
  const recipe = params.recipeId
    ? getRecipesByPageType(params.pageType).find(r => r.id === params.recipeId)
    : getRecipesByPageType(params.pageType)[0]; // auto-pick first recipe

  if (recipe) {
    prompt += '\n\n## RECOMMENDED PAGE STRUCTURE (Recipe: ' + recipe.name + ')\n';
    prompt += `Source: ${recipe.source}\n`;
    prompt += `Description: ${recipe.description}\n\n`;
    prompt += 'Follow this block order. You may add or remove OPTIONAL blocks, but keep all REQUIRED blocks:\n\n';

    recipe.blocks.forEach((block, i) => {
      const tag = block.required ? 'REQUIRED' : 'OPTIONAL';
      const vis = block.visibility && block.visibility !== 'all' ? ` [${block.visibility} only]` : '';
      prompt += `${i + 1}. [${tag}] ${block.type}${vis} — ${block.description}\n`;
    });

    prompt += `\nDesign tokens for this recipe:\n`;
    prompt += `- Max width: ${recipe.designTokens.maxWidth}\n`;
    prompt += `- Primary color: ${recipe.designTokens.primaryColor}\n`;
    prompt += `- CTA color: ${recipe.designTokens.ctaColor}\n`;
    if (recipe.designTokens.ctaGradient) {
      prompt += `- CTA gradient: ${recipe.designTokens.ctaGradient}\n`;
    }
    prompt += `- Background: ${recipe.designTokens.backgroundColor}\n`;
    if (recipe.designTokens.fontFamily) {
      prompt += `- Font: ${recipe.designTokens.fontFamily}\n`;
    }

    prompt += `\nNotes: ${recipe.notes}\n`;
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
payment-options, shipping-form, scarcity-badge, negative-opt-out,
editorial-header, breadcrumb, byline, sticky-cta, editorial-heading, author-cta`;
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
