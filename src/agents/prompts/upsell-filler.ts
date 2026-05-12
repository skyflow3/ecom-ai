/**
 * Purpose: Upsell Page Template Filler — generates TEXT content for upsell page slots.
 *          Takes a product brief + OTO position → outputs a JSON ContentMap for the template engine.
 *          Pricing/image/URL values come from the brief (NOT AI-generated).
 *
 * Dependencies: templates/upsell-vibriance.html.json (slot config)
 * Related: template-engine.ts (consumes output), template-generator.ts (orchestrates)
 *
 * WHY: Upsell pages are POST-CHECKOUT offers. The visitor JUST bought and sees a
 *      one-time upgrade deal. The AI generates the persuasion copy, banner, headline,
 *      CTA, and rejection text. Prices, URLs, and countdown come from the brief.
 *
 * RESEARCH SOURCE: "upsell OTO Sequence Strategy.md" — 10 AI research responses
 *   with data from Zipify ($1B+ upsell revenue), SamCart ($7B processed), CartHook,
 *   Recharge, Aftersell, Shopify Plus, CXL, and 40,000+ DTC brands.
 *
 * KEY FINDINGS APPLIED:
 *   - OTO1-2 generate 70-90% of upsell revenue. Copy quality matters most here.
 *   - Copy length should shrink 30% per OTO step (150 words → <40 words).
 *   - Tone shifts: celebratory (OTO1) → educational (OTO2) → simple (OTO3) → protective (OTO5)
 *   - Timer helps OTO1-2 (+7% conversion), hurts OTO4+ (+19% abandonment)
 *   - Soft-loss "No Thanks" works OTO1-2, damages trust OTO4+
 *   - Subscription placement optimal at OTO2-3 (never OTO1)
 *   - Price anchoring: 3-4x perceived value vs sale price
 *   - Rejection link: must include FUTURE full retail price for loss aversion
 */

import type { ProductBrief } from './template-filler';

// ─── Upsell Type ──────────────────────────────────────────────────────────────

/**
 * What TYPE of upsell this is. Determines the persuasion strategy.
 * WHY: Different upsell types need completely different copy approaches.
 *   - same_product: More of what they just bought (quantity deal, OTO1 classic)
 *   - cross_sell: Complementary product that completes their routine
 *   - protection: Insurance/warranty/guarantee add-on (fear-based, low price)
 *   - subscription: Recurring delivery offer (commitment-based)
 */
export type UpsellType = 'same_product' | 'cross_sell' | 'protection' | 'subscription';

/**
 * Product category — determines vocabulary, guarantee phrasing, and persuasion angles.
 * WHY: Consumable copy says "stock up on bottles, never run out".
 *      Device copy says "complete your setup, add the accessory". Same funnel, different language.
 */
export type ProductCategory = 'consumable' | 'device' | 'apparel' | 'digital';

/**
 * Extended brief for upsell pages.
 * WHY: Upsell needs the offer details (quantity, per-unit price, original retail price)
 *      plus the previous purchase context to frame the upgrade.
 */
export interface UpsellBrief extends ProductBrief {
  /** Upsell offer quantity (e.g., 3). Use 1 for single-unit cross-sells. */
  offerQty: number;
  /** Upsell price per unit (e.g., "$28.20") */
  offerUnitPrice: string;
  /** Upsell total price (e.g., "$84.60") */
  offerTotalPrice: string;
  /** Original retail price per unit (e.g., "$47.00") */
  retailUnitPrice: string;
  /** Original total at retail (e.g., "$141.00") */
  retailTotalPrice: string;
  /** Discount percentage (e.g., "40%") */
  discountPct: string;
  /** Logo image URL */
  logoUrl: string;
  /** Product bundle image URL */
  productImageUrl: string;
  /** Countdown timer minutes (default: 10). Set to "" to hide timer. */
  countdownMinutes: string;
  /** Currency label (e.g., "USD") */
  currencyLabel: string;
  /**
   * OTO position in the funnel sequence (1-5).
   * WHY: Each position requires different tone, copy length, and persuasion strategy.
   *   OTO1 = peak buying momentum, celebratory, 150 words
   *   OTO2 = curiosity/logic, educational, 100 words
   *   OTO3 = fatigue emerging, simplified, 70 words
   *   OTO4 = skepticism, soft/completion framing, 50 words
   *   OTO5 = protection mode, fear-based, <40 words
   * Default: 1
   */
  otoPosition?: number;
  /**
   * Type of upsell offer.
   * WHY: Determines whether copy frames as "more of the same" vs "complete your routine"
   *      vs "protect your investment" vs "never run out".
   * Default: 'same_product' for OTO1, 'cross_sell' for OTO2-4, 'protection' for OTO5
   */
  upsellType?: UpsellType;
  /**
   * Previous product the customer just purchased (for transition continuity).
   * WHY: Each OTO page must reference the PREVIOUS decision to create narrative flow.
   *   "Since you just added [previousProduct]..." — not "Buy this new thing!"
   */
  previousProduct?: string;
  /**
   * Product category — determines vocabulary, guarantee phrasing, and examples.
   * WHY: "Bottom of the bottle" makes no sense for a WiFi extender.
   *   Consumables: bottles, supply, routine, run out, consistent use
   *   Devices: setup, system, accessory, bundle, coverage, reliability
   *   Apparel: collection, style, wardrobe, matching
   *   Digital: access, upgrade, lifetime, premium, unlock
   * Default: 'consumable' (backwards-compatible)
   */
  productCategory?: ProductCategory;
}

// ─── Position Configs ─────────────────────────────────────────────────────────

interface PositionConfig {
  /** Tone description for the AI */
  tone: string;
  /** Maximum total words across all persuasion slots */
  maxWords: number;
  /** Whether to use urgency/timer in copy */
  useUrgency: boolean;
  /** How aggressive the soft-loss framing should be */
  softLossIntensity: 'high' | 'medium' | 'low' | 'none';
  /** Whether to reference the previous decision for continuity */
  referencePrevious: boolean;
  /** Main persuasion angle */
  angle: string;
}

// WHY: Word budgets calibrated from ACTUAL Vibriance winner pages:
//   OTO1 (upsell-vibriance template): ~150 words (premium 7-paragraph layout)
//   OTO2-4 (cross-sell template): 180-220 words (original winners: OTO3=183, OTO4=220)
//   OTO5 (cross-sell, sections removed): ~120 words (original winner: 123)
//   The research said "shrink 30% per step" but the ACTUAL winners show OTO3-4 are NOT shorter.
const POSITION_CONFIGS: Record<number, PositionConfig> = {
  1: {
    tone: 'CELEBRATORY and CONFIDENT. The visitor just bought — they\'re in a buying trance. Reward their decision. Frame the upsell as an UPGRADE, not a new purchase. Direct, benefit-focused. Urgency-light.',
    maxWords: 150,
    useUrgency: true,
    softLossIntensity: 'high',
    referencePrevious: true,
    angle: 'MOMENTUM — leverage the "yes" momentum. "You just made a smart choice. Here\'s how to make it even better." Commitment + consistency. The customer already values the product — more of it feels safe.',
  },
  2: {
    tone: 'EDUCATIONAL and COMPLEMENTARY. The initial excitement is still present but rational brain is returning. Position as a "missing piece" or "natural next step" in their routine. Curiosity-driven.',
    maxWords: 200,
    useUrgency: true,
    softLossIntensity: 'medium',
    referencePrevious: true,
    angle: 'ROUTINE COMPLETION — "Customers who use [Product A] achieve 2x better results when they add [Product B]." Build the system. The product should feel like a natural extension, not a random pitch.',
  },
  3: {
    tone: 'PAIN-FOCUSED and EDUCATIONAL. Address a SPECIFIC problem they have. Explain the product with ingredients/mechanism. Social proof matters. The original Vibriance OTO3 uses pain hooks + ingredient names + 3 benefits + social proof = 183 words. MATCH THIS LENGTH.',
    maxWords: 180,
    useUrgency: true,
    softLossIntensity: 'medium',
    referencePrevious: true,
    angle: 'PAIN-PIERCE + SOCIAL PROOF — Start with a painful SOCIAL question (not physical symptom). Vibriance uses "Fed up with people saying you look tired?" — this pierces because it is about how OTHERS perceive you, not just a skin problem. Then introduce the product with 4 named ingredients. End with vivid social proof (specific number + emotional outcome). Full persuasion, NOT simplified.',
  },
  4: {
    tone: 'PROBLEM-AGITATION and MULTI-USE. The original Vibriance OTO4 is actually the LONGEST at 220 words. It uses a pain question, detailed ingredient breakdown with NAMES, and MULTIPLE use cases. MATCH THIS LENGTH.',
    maxWords: 220,
    useUrgency: true,
    softLossIntensity: 'medium',
    referencePrevious: true,
    angle: 'COMPLETION WITH DEPTH — "Your serum handles X but skin needs Y." Detailed ingredient breakdown (name + what it does). Multiple use cases ("layer it", "under makeup", "in your purse"). The goal is to show VERSATILITY and VALUE.',
  },
  5: {
    tone: 'PROTECTIVE and PRACTICAL. Pure utility framing. Low-pressure. The visitor is in protection mode — validate their purchase rather than adding to it. Calm, reassuring. NO urgency pressure.',
    maxWords: 120,
    useUrgency: false,
    softLossIntensity: 'none',
    referencePrevious: false,
    angle: 'FEAR + LOSS AVERSION — Use "Over 40% Of Packages Are Lost, Stolen, Or Damaged!" + "Don\'t Be The Next Victim." Identity threat (being a victim) is stronger than risk framing (packages get lost). NO country-specific references. The offer requires no product evaluation — it\'s a reflexive yes at $4.95. Insurance framing with guilt-trip rejection.',
  },
};

// ─── Type-Specific Prompt Additions ───────────────────────────────────────────

function getTypePrompt(type: UpsellType): string {
  switch (type) {
    case 'same_product':
      return `
### SAME PRODUCT (Quantity Deal) Rules
- This is MORE OF THE SAME product they just bought.
- Frame as "stock up" or "extend your supply" — NOT as buying something new.
- Use commitment/consistency: "You already chose this product. Here's the smartest way to get more."
- Quantity language: "3 more bottles", "stock up", "your supply", "backup bottles".
- Price anchoring is critical: show per-unit savings vs retail. "$28.20 each vs $47.00 retail".
	- COMPETITOR ANCHORING (Vibriance proven): Compare to what competitors charge. "Comparable [products] sell for over $79 per [bottle/unit]" — this makes YOUR price look like a steal. Use realistic but higher competitor pricing.
	- REJECTION MUST include full retail price reminder: "When I run out I'll just pay the full price of $47 per bottle on my next order." This makes clicking NO feel financially stupid.`;

    case 'cross_sell':
      return `
### CROSS-SELL (Complementary Product) Rules
- This is a DIFFERENT product that completes their routine/system.
- Frame as "the missing piece" or "natural next step" — NOT a random upsell.
- Use routine-building logic: "Your [serum] handles the surface. This [cream] locks it in."
- Reference the PRODUCT they bought, not just the brand.
- Explain WHY these products work together (complementary, not redundant).
- Position as "smart buyer" identity: "Customers who invest in their routine add this."
- AM/PM PROTOCOL (Vibriance OTO2 proven): When selling a complementary product, show HOW to use BOTH together. "Use [Product A] in the morning to hydrate and protect. Use [Product B] in the evening to repair and rejuvenate." This locks in usage of BOTH products and makes the pair feel like a SYSTEM, not random add-ons.
- FIRST & ONLY USP (Vibriance proven): If the product has any unique differentiator, frame it as "the FIRST & ONLY [product type] made exclusively for [target audience]". Example: "the FIRST & ONLY retinol serum made exclusively for the delicate MATURE skin of women over 50." This creates instant authority.
- REJECTION FOMO (Vibriance proven): Rejection text must include loss of exclusivity. "NO THANKS, and miss out on the lowest price we've EVER offered. (This one-time discount isn't available anywhere else.)" Double scarcity: price + availability.`;

    case 'protection':
      return `
### PROTECTION (Insurance/Warranty) Rules
- This is NOT a product — it's risk mitigation. Completely different psychology.
- Use FEAR of loss on their accumulated investment: "Protect what you just bought."
- Keep copy MINIMAL. The decision should be reflexive, not deliberative.
- Use statistics with SPECIFIC numbers: "Over 40% Of Packages Are Lost, Stolen, Or Damaged In Transit!" (specific % feels more real than "many packages"). Do NOT reference a specific country — the product may be sold globally.
- Frame as loss aversion: "Don't Be The Next Victim Of Porch Pirates" — identity threat, not just risk.
- Price is so low ($4.95-$9.95) it should feel like a no-brainer insurance policy.
- NO countdown timer reference. NO urgency language. Calm and practical.
- CTA must be SPECIFIC about what they're protected against: "YES! PROTECT MY ORDER AGAINST LOSS & THEFT" — not just "PROTECT MY ORDER" (Vibriance proven).
- Rejection text MUST make the customer feel irresponsible: "No thanks, I don't want to protect my order against theft" — the word "theft" creates resistance to clicking NO (Vibriance proven).`;

    case 'subscription':
      return `
### SUBSCRIPTION (Recurring Delivery) Rules
- This is a COMMITMENT offer — the customer signs up for ongoing delivery.
- Frame as CONVENIENCE and SAVINGS: "Never run out" + "Save X% every month."
- Subscription works best at OTO2-3 because the customer has enough brand context.
- Emphasize: cancel anytime, no lock-in, same discount every renewal.
- Use "routine continuity" angle: "Breaking your streak means starting over."
- The discount should be meaningful: 15-25% vs one-time price.
- CTA should emphasize ease: "YES! Auto-refill my routine every month."`;
  }
}

// ─── Category-Specific Vocabulary & Rules ──────────────────────────────────────

function getCategoryPrompt(category: ProductCategory): string {
  switch (category) {
    case 'consumable':
      return `
### PRODUCT CATEGORY: CONSUMABLE (skincare, supplements, food, drinks)
- Vocabulary: bottles, jars, supply, stock up, routine, consistent use, run out, daily use
- Unit names: "bottle", "jar", "pack", "box", " pouch" — match the actual packaging
- Same product angle: "Stock up and save", "Never run out", "Your X-month supply"
- Cross-sell angle: "Complete your routine", "These products work together"
- Guarantee language: "bottom of the bottle", "empty jar" — use-entire-product guarantee
- Time framing: "X-month supply", "daily routine", "consistent results over time"
- Replenishment logic: results require ongoing use, running out = starting over`;

    case 'device':
      return `
### PRODUCT CATEGORY: DEVICE / ELECTRONICS (gadgets, tools, home tech, wellness devices)
- Vocabulary: unit, device, setup, system, coverage, accessory, bundle, upgrade, reliability
- Unit names: "unit", "device", "system" — NOT "bottle" or "jar"
- Same product angle: "Cover multiple rooms", "One for home, one for travel", "Gift for family"
- Cross-sell angle: "Complete your setup", "Essential companion accessory", "Unlock full potential"
- Guarantee language: "X-day money-back guarantee", "full refund", "no risk trial" — NOT "bottom of the bottle"
- Time framing: "X-year warranty", "24/7 protection", "instant results" — NOT "daily routine"
- Durability logic: built to last, one-time purchase, long-term value
- Compatibility: "designed to work with your [main device]", "plug and play"
- Placement: "one for bedroom, one for living room", "home + office", "home + travel"
- Power/charging references when relevant: "battery lasts X hours", "USB-C charging"`;

    case 'apparel':
      return `
### PRODUCT CATEGORY: APPAREL (clothing, accessories, fashion)
- Vocabulary: piece, item, collection, style, wardrobe, look, fit, color, size
- Unit names: "piece", "pair", "item" — NOT "bottle" or "unit"
- Same product angle: "Different color for every occasion", "Stock up on your favorites"
- Cross-sell angle: "Complete the look", "Matching [item] pairs perfectly", "Build your collection"
- Guarantee language: "X-day return policy", "full exchange", "perfect fit guarantee"
- Time framing: "season", "every occasion", "everyday wear"
- Style logic: versatile, timeless, complements existing wardrobe
- Size/fit: "true to size", "flattering fit", "designed for [body type]"`;

    case 'digital':
      return `
### PRODUCT CATEGORY: DIGITAL (software, courses, subscriptions, apps)
- Vocabulary: access, upgrade, lifetime, premium, unlock, feature, plan, license
- Unit names: "license", "seat", "account", "access" — NOT physical units
- Same product angle: "Add more seats", "Team license", "Lifetime access upgrade"
- Cross-sell angle: "Unlock advanced features", "Companion course", "Premium add-on"
- Guarantee language: "X-day money-back guarantee", "cancel anytime", "no lock-in"
- Time framing: "lifetime access", "12-month subscription", "instant access"
- Value logic: one-time payment vs ongoing, unlimited vs limited features
- Delivery: "instant access", "login details sent immediately", "no shipping needed"`;
  }
}

/**
 * Returns category-appropriate guarantee phrase.
 * WHY: "Bottom of the bottle" makes zero sense for a WiFi extender.
 */
function getCategoryGuaranteeExample(category: ProductCategory): string {
  switch (category) {
    case 'consumable': return 'All orders are protected by a 1 year bottom of the bottle money back guarantee.';
    case 'device': return 'Your purchase is covered by a 30 day money back guarantee. If you are not satisfied, return it for a full refund.';
    case 'apparel': return 'We offer a 30 day perfect fit guarantee. Not happy? Return it for a full refund or exchange.';
    case 'digital': return 'Your purchase includes a 30 day money back guarantee. Cancel anytime, no questions asked.';
  }
}

/**
 * Returns category-appropriate risk reversal part 2.
 * WHY: "even if you use all the bottles" only applies to consumables.
 */
function getCategoryRiskReversal(category: ProductCategory, guarantee: string): { part1: string; part2: string } {
  switch (category) {
    case 'consumable':
      return {
        part1: 'If you do not get the promised results you can call us back for a full refund -',
        part2: 'even if you use all the bottles!',
      };
    case 'device':
      return {
        part1: 'If you are not 100% satisfied with the results, return it for a complete refund -',
        part2: 'no questions asked, no restocking fees.',
      };
    case 'apparel':
      return {
        part1: 'If it does not fit perfectly or you are not thrilled with the quality, send it back -',
        part2: 'full refund, free return shipping.',
      };
    case 'digital':
      return {
        part1: 'If you do not see the value within the first 30 days, just let us know -',
        part2: 'full refund, instant, no questions asked.',
      };
  }
}

/**
 * Returns category-appropriate "stock up" phrasing for same_product type.
 * WHY: Devices don't "run out" — you buy multiples for different rooms/locations.
 */
function getCategoryStockPhrase(category: ProductCategory, qty: number, productName: string): string {
  switch (category) {
    case 'consumable':
      return `stock up on ${qty} more bottles of ${productName}`;
    case 'device':
      return `add ${qty} more ${qty > 1 ? 'units' : 'unit'} of ${productName} — cover every room`;
    case 'apparel':
      return `grab ${qty} more in different colors`;
    case 'digital':
      return `upgrade to ${qty > 1 ? `${qty} licenses` : 'a lifetime license'}`;
  }
}

/**
 * Returns category-appropriate CTA action word.
 */
function getCategoryCtaAction(category: ProductCategory): string {
  switch (category) {
    case 'consumable': return 'ADD TO MY ORDER';
    case 'device': return 'UPGRADE MY SETUP';
    case 'apparel': return 'ADD TO MY BAG';
    case 'digital': return 'UNLOCK NOW';
  }
}

// ─── Soft-Loss Framing by Intensity ───────────────────────────────────────────

function getSoftLossRules(intensity: PositionConfig['softLossIntensity'], retailPrice: string): string {
  switch (intensity) {
    case 'high':
      return `
- **rejection_reason**: MUST make saying NO feel financially STUPID.
  Include the FULL RETAIL PRICE to create strong loss aversion.
  Examples:
  - "When I run out I'll just pay the full price of ${retailPrice} per bottle on my next order."
  - "I understand this 40% OFF deal won't be offered again and I'll pay full price later."
  The reader must feel: "If I click NO, I'm losing money."`;

    case 'medium':
      return `
- **rejection_reason**: Make saying NO feel like a missed opportunity.
  Include the discount or future full price, but less aggressively.
  Examples:
  - "I'll pass on this and may pay full price later."
  - "No thanks, I understand this exclusive offer expires when I leave."
  The reader should feel: "I'm passing on a good deal."`;

    case 'low':
      return `
- **rejection_reason**: Gentle, neutral decline. No guilt trip.
  The reader is already fatigued — aggressive framing damages trust at this point.
  Examples:
  - "No thanks, this offer isn't for me right now."
  - "I'll skip this step."
  Simple, respectful, no price anchoring.`;

    case 'none':
      return `
- **rejection_reason**: Purely neutral. No emotional manipulation at all.
  This is a protection/utility offer — guilt tripping here feels predatory.
  Example: "No thanks, I don't need to protect my order."
  Clean, simple, respectful of the customer's decision.`;
  }
}

// ─── Main Prompt Builder ──────────────────────────────────────────────────────

export function buildUpsellFillerPrompt(brief: ProductBrief, templateId?: string): string {
  const ub = brief as UpsellBrief;
  const isCrossSell = templateId === 'upsell-cross-sell';
  const isProductUpsell = templateId === 'upsell-product';
  const isProtection = templateId === 'upsell-protection';
  const position = ub.otoPosition ?? 1;
  const posConfig = POSITION_CONFIGS[Math.min(position, 5)] ?? POSITION_CONFIGS[1];

  // Auto-detect upsell type if not specified
  const upsellType: UpsellType = ub.upsellType ?? (
    position >= 5 ? 'protection'
    : position >= 2 ? 'cross_sell'
    : 'same_product'
  );

  // Previous product for transition continuity
  const previousProduct = ub.previousProduct ?? 'your recent purchase';

  // Product category — determines vocabulary and guarantee phrasing
  const category: ProductCategory = ub.productCategory ?? 'consumable';

  // Word budget guidance per persuasion slot
  const wordBudgets = getWordBudgets(position, upsellType);

  // Category-aware risk reversal examples
  const riskReversal = getCategoryRiskReversal(category, brief.guarantee);

  // Category-aware CTA action
  const ctaAction = getCategoryCtaAction(category);

  // Pre-build example strings to avoid nested template literal escaping issues
  const ctaExample = upsellType === 'protection' ? 'YES! PROTECT MY ORDER' : `YES! ${ctaAction}`;
  const rejectionTextExample = upsellType === 'protection'
    ? "No thanks, I don't want to protect my order"
    : `No thanks, I don't want to ${category === 'consumable' ? 'add this to my order' : category === 'device' ? 'upgrade my setup' : category === 'apparel' ? 'add this to my bag' : 'unlock this feature'}`;
  const rejectionReasonExample = upsellType === 'protection'
    ? "I understand I'm responsible if my package is lost or stolen."
    : category === 'consumable'
      ? `When I run out I'll just pay the full price of ${ub.retailUnitPrice} per bottle on my next order.`
      : category === 'device'
        ? `I'll skip this and buy it separately at full price (${ub.retailUnitPrice}) later if I need it.`
        : `I understand this is the lowest price offered and this discount won't be available anywhere else — I'll pay full price later.`;
  const countdownGuidance = posConfig.useUrgency
    ? 'Text before timer. Creates urgency. Example: Hurry! This offer ends in:'
    : 'Leave as empty string or neutral text. No urgency for this position.';
  const waitBannerExample = position === 1 ? 'WAIT! Your order is not complete!'
    : position === 5 ? 'FINAL STEP: Protect Your Order'
    : 'One More Special Offer...';
  const progressExample = position >= 4 ? 'Almost Done...' : 'Almost Complete...';
  const ctaWordGuidance = position <= 2 ? '4-8 words. Strong action.' : '3-5 words. Simple action.';
  const rejectionWordGuidance = position >= 4 ? 'Neutral and brief.' : 'Specific to the offer.';
  const rejectionReasonGuidance = position >= 4 ? 'Simple and neutral.' : 'Makes NO feel costly. Includes $price.';

  return `You are an ELITE DTC upsell page copywriter. You specialize in ONE-TIME OFFER pages
that appear immediately after checkout. Your copy converts at 15-30% (industry avg is 5-10%).

## YOUR TASK
Generate TEXT content for a post-checkout upsell page.
This is **OTO${position}** (position ${position} of the upsell sequence).

## PRODUCT INFO
- Name: ${brief.name}
- Description: ${brief.description}
- Niche: ${brief.niche}
- Target Audience: ${brief.targetAudience}
- Key Benefits: ${brief.benefits.join(', ')}
- Guarantee: ${brief.guarantee}
- Previous purchase: ${previousProduct}
- Category: ${category === 'consumable' ? 'CONSUMABLE (skincare, supplements, food)' : category === 'device' ? 'DEVICE / ELECTRONICS (gadget, tool, home tech)' : category === 'apparel' ? 'APPAREL (clothing, accessories)' : 'DIGITAL (software, courses, apps)'}

## UPSOFFER DETAILS
- Offer type: ${upsellType === 'same_product' ? 'Quantity deal (more of the same product)' : upsellType === 'cross_sell' ? 'Cross-sell (complementary product)' : upsellType === 'protection' ? 'Protection/insurance add-on' : 'Subscription (recurring delivery)'}
- Quantity: ${ub.offerQty}
- Price per unit: ${ub.offerUnitPrice}
- Total price: ${ub.offerTotalPrice}
- Retail per unit: ${ub.retailUnitPrice}
- Retail total: ${ub.retailTotalPrice}
- Discount: ${ub.discountPct}

## POSITION PSYCHOLOGY (OTO${position})
Tone: ${posConfig.tone}
Persuasion angle: ${posConfig.angle}
Maximum words across ALL persuasion slots: ${posConfig.maxWords}
Urgency/timer: ${posConfig.useUrgency ? 'YES — use countdown urgency in copy' : 'NO — do NOT reference timers or urgency. Calm and practical.'}
Previous decision reference: ${posConfig.referencePrevious ? `YES — reference "${previousProduct}" to create continuity` : 'NOT needed for this position.'}
${getTypePrompt(upsellType)}
${getCategoryPrompt(category)}

## OUTPUT FORMAT
Output a SINGLE JSON object. Each value is a string. No markdown, no code fences.

## CONTENT RULES (MANDATORY)

### Choice Validation (PROVEN — used by ALL top-converting upsells)
${posConfig.referencePrevious ? `The page MUST start by validating their previous purchase decision BEFORE introducing anything new.
This triggers commitment/consistency psychology — they just said YES, so saying YES again feels natural.
Pattern: "[Acknowledge their smart choice] + [But there's more to the story] + [New offer]"
Good: "Since you just added ${previousProduct}, complete your routine with..."
Good: "Great choice on ${previousProduct}! Now here's how to make it even better..."
Good: "You're going to love ${previousProduct}. But for BEST results..."
Bad: "Buy ${brief.name}!" or "Check out this product!" (no context = feels random)` : 'No validation needed — jump straight to the protection/utility framing.'}

### Voice & Style
- ${position <= 2 ? 'Write like a CONCERNED FRIEND who got them a special deal.' : 'Write like a HELPFUL ADVISOR completing their order.'}
- Short sentences. Punchy. Each paragraph = 1 idea.
- Use SPECIFIC numbers: prices, percentages, quantities, durations.
- ${position <= 2 ? 'Bold claims backed by specific data.' : 'Minimal claims. Let the offer speak.'}
- NO: "revolutionary", "amazing", "incredible", "unbelievable", "transformative".
- YES: Specific outcomes, concrete numbers, direct commands.
- Product name "${brief.name}" must appear in at least ${position <= 2 ? '2' : '1'} persuasion paragraphs.

### Ingredient Names (CRITICAL for credibility)
When mentioning ingredients, formula components, or active compounds:
- Use SPECIFIC, scientific-sounding names — NOT generic categories.
- Good: "Pepha-Tight®", "PrimalHyal™ Ultrafiller", "Fucogel® skin sugar", "Ecoslim™"
- Bad: "peptides", "botanicals", "antioxidants", "natural ingredients"
- If the actual product has trademarked names, use them. If not, INVENT plausible scientific-sounding names.
- Format: "#N - [Trademarked Name] [specific benefit it delivers]"
- Each ingredient must have a DISTINCT, specific benefit (not "improves skin" — "plumps fine lines while locking in hydration").

### Price Justification (PROVEN — increases conversion by framing deal as earned, not random)
Include ONE line explaining WHY this price is so low. This eliminates "too good to be true" skepticism.
Patterns that work:
- "Because we don't have to pay for advertising to reach you again, we're passing those savings directly to you."
- "Since you're already a customer, we can skip the middleman and offer this at our lowest price ever."
- "This is a hidden page — the public pays full price, but you get exclusive access."

### Behavioral Social Proof (PROVEN — +8-15% conversion, Response 7 data)
Include ONE specific behavioral statistic that shows OTHER customers choosing this offer.
This triggers bandwagon effect — if everyone else is doing it, it must be good.
Patterns that work:
- "73% of customers who see this page choose to add the ${category === 'consumable' ? 'full supply' : 'upgrade'}."
- "Over 12,000 customers added this to their routine last month."
- "9 out of 10 women see visible results in just 2 weeks."
- "93% of our customers place another order within 3 days of receiving their first package."
Use a SPECIFIC number (not "many" or "thousands"). The more specific, the more credible.

### Cost Reframing (PROVEN — reduces price resistance, Response 2 data)
${category === 'consumable' ? `For consumable products, break down the price into a daily cost to make it feel trivial.
Calculate: total price / supply duration. Example formulas:
- "$24 for a 30-day supply = less than $0.80/day"
- "$34.20 for a full bottle = less than your daily coffee"
- "$84.60 for 3 bottles = just $0.94/day for a 90-day supply"
Include this in product_intro_2 or the body text. Make the price feel like pocket change.` : `Frame the price as a comparison to something more expensive they already pay for.
- "Less than a single copay at the chiropractor"
- "Cheaper than one month of gym membership"
The comparison should be relatable to the target audience.`}

### Complementarity Analogy (for cross-sell offers — OTO2-4)
When the upsell is a DIFFERENT product from the previous purchase, use a 2-part analogy:
- "${previousProduct} is the foundation. ${brief.name} is the accelerator."
- "${previousProduct} gets you 80% of the way. This completes the last 20%."
- "Think of ${previousProduct} as the engine. ${brief.name} is the fuel."
- "Your ${previousProduct} handles the surface. ${brief.name} locks it in deep."
One analogy is enough — include it in product_intro or product_intro_2.

### Objection Pre-emption (subtle, not heavy-handed)
Address the #1 silent objection: "Do I really need this?"
Use a single line that acknowledges this thought and reframes it:
- "You don't NEED it to use ${previousProduct}. You need it if you want results 2x faster."
- "${previousProduct} works great on its own. But for BEST results, you need the complete routine."
- "This isn't more of the same. It's the missing piece that makes everything else work better."
Keep it brief — 1 sentence woven into the body text, not a separate paragraph.

### Transition Opening${posConfig.referencePrevious ? ' (CRITICAL)' : ''}
${posConfig.referencePrevious ? `The first words must reference their PREVIOUS decision, NOT start with a product name.
This creates narrative continuity — the visitor feels like they're continuing a process, not being sold something new.
Good: "Since you just added ${previousProduct}..." or "Great choice! Now let's complete your routine..."
Bad: "Buy ${brief.name}!" or "Check out this product!"` : 'No transition needed — jump straight to the protection/utility framing.'}

### Persuasion Sequence Rules
${getWordBudgetsText(wordBudgets)}

### CTA Rules
- **cta_text**: ALL CAPS. Must include YES. Must be SPECIFIC to the offer — NOT generic.
  OTO1 (same_product): Include quantity or upgrade framing. "YES! ADD 3 BOTTLES TO MY ORDER" or "YES! CONFIRM THIS AMAZING UPGRADE" (Vibriance proven).
  OTO2 (cross_sell): Include product name or outcome. "YES! UPGRADE MY ORDER NOW..." (Vibriance proven — ellipsis creates anticipation).
  OTO3-4 (cross_sell): Include the specific action or benefit. "YES! UPGRADE MY ORDER" (Vibriance proven).
  OTO5 (protection): Include what they are protected against. "YES! PROTECT MY ORDER AGAINST LOSS & THEFT" (Vibriance proven — more specific = higher conversion).
  NOT: "Click here" or "Buy now" (too weak). NOT: generic "YES! ADD TO MY ORDER" for every OTO — each must feel unique.

### Rejection Rules
- **rejection_text**: Starts with "No thanks". CRITICAL VIBRIANCE TECHNIQUE: The rejection text must REPEAT the specific benefit they lose AND the discount percentage. This is the LAST chance to sell — the rejection link IS copy (Vibriance proven).
  OTO1-2 (high intensity): "No thanks, I don't want to upgrade my order." Then rejection_reason adds: "When I run out I'll just pay the full price of $X per bottle." The full retail price creates strong loss aversion.
  OTO3-4 (medium): "No thanks, I don't want to give my eyes an instant refresh for 36% OFF." (Vibriance proven — repeats benefit + discount IN the rejection link itself).
  OTO5 (protection): "No thanks, I don't want to protect my order against theft" — the word "theft" makes clicking NO feel irresponsible (Vibriance proven).
  NEVER use generic text like "No thanks, I understand this expires" — it MUST name the SPECIFIC thing they lose.
  ALSO for OTO2 (Vibriance proven): Add a parenthetical like "(Please note, this one-time discount isn't available anywhere else.)" — doubles the scarcity.

## SLOTS TO FILL (TEXT ONLY)

${isProtection ? getProtectionSlots(position, ub, brief, ctaExample, rejectionTextExample) : isProductUpsell ? getProductSlots(position, ub, brief, ctaExample, rejectionTextExample, ctaWordGuidance, rejectionWordGuidance) : isCrossSell ? getCrossSellSlots(position, upsellType, ub, posConfig, brief, countdownGuidance, ctaExample, rejectionTextExample, rejectionReasonExample, ctaWordGuidance, rejectionWordGuidance, rejectionReasonGuidance) : getOto1Slots(position, upsellType, ub, posConfig, brief, countdownGuidance, waitBannerExample, progressExample, ctaExample, rejectionTextExample, rejectionReasonExample, ctaWordGuidance, rejectionWordGuidance, rejectionReasonGuidance)}

## CRITICAL RULES
1. Output ONLY the JSON object. No markdown, no code fences, no explanation.
2. Every string must be properly escaped for JSON.
3. Do NOT generate pricing, URL, image, or countdown values — those come from the brief.
4. The persuasion sequence must flow naturally as a single argument (Hook → Action).
5. Total word count across ${isCrossSell || isProductUpsell || isProtection ? 'all text slots' : 'persuasion_1 through persuasion_7b'} must stay under ${posConfig.maxWords} words.
6. ${posConfig.useUrgency ? 'Urgency IS appropriate for this position.' : 'Do NOT use urgency or countdown language — it damages trust at this position.'}
7. cta_text must be different from the product name — it's an ACTION command.
8. ${posConfig.referencePrevious ? `The persuasion MUST reference "${previousProduct}" for narrative continuity.` : 'No need to reference previous purchases.'}`;
}

// ─── OTO1 Slot Template ────────────────────────────────────────────────────────

function getOto1Slots(
  position: number, upsellType: UpsellType, ub: UpsellBrief, posConfig: PositionConfig,
  brief: ProductBrief, countdownGuidance: string, waitBannerExample: string,
  progressExample: string, ctaExample: string, rejectionTextExample: string,
  rejectionReasonExample: string, ctaWordGuidance: string, rejectionWordGuidance: string,
  rejectionReasonGuidance: string
): string {
  return `{
  "wait_banner": "Attention banner text. ${position === 1 ? 'ALL CAPS. Must create pattern interrupt.' : position === 5 ? 'Final step framing. Protective tone.' : 'Urgent but not aggressive.'} ${position <= 3 ? '5-10 words.' : '3-6 words.'} Example: ${waitBannerExample}",
  "progress_text": "Progress bar text. 2-4 words. Example: ${progressExample}",
  "upsell_headline": "Main offer headline. Must include product + price + key benefit.",
  "countdown_label": "${countdownGuidance}",
  "persuasion_1": "${getSlotGuidance('persuasion_1', position, upsellType, ub)}",
  "persuasion_2": "${getSlotGuidance('persuasion_2', position, upsellType, ub)}",
  "persuasion_3": "${getSlotGuidance('persuasion_3', position, upsellType, ub)}",
  "persuasion_4": "${getSlotGuidance('persuasion_4', position, upsellType, ub)}",
  "persuasion_5": "${getSlotGuidance('persuasion_5', position, upsellType, ub)}",
  "persuasion_6": "${getSlotGuidance('persuasion_6', position, upsellType, ub)}",
  "persuasion_7a": "${getSlotGuidance('persuasion_7a', position, upsellType, ub)}",
  "persuasion_7b": "${getSlotGuidance('persuasion_7b', position, upsellType, ub)}",
  "cta_text": "YES CTA button. ALL CAPS. ${ctaWordGuidance} Example: ${ctaExample}",
  "rejection_text": "Rejection anchor text. Starts with No thanks. ${rejectionWordGuidance} Example: ${rejectionTextExample}",
  "rejection_reason": "Rejection consequence. ${rejectionReasonGuidance} Example: ${rejectionReasonExample}"
}`;
}

// ─── Cross-Sell Slot Template (OTO2-5) ─────────────────────────────────────────

function getCrossSellSlots(
  position: number, upsellType: UpsellType, ub: UpsellBrief, posConfig: PositionConfig,
  brief: ProductBrief, countdownGuidance: string, ctaExample: string,
  rejectionTextExample: string, rejectionReasonExample: string,
  ctaWordGuidance: string, rejectionWordGuidance: string,
  rejectionReasonGuidance: string
): string {
  const category: ProductCategory = ub.productCategory ?? 'consumable';
  const bulletPrefix = category === 'consumable' ? 'Heart emoji + ' : 'Dash or bullet + ';
  const isExtended = position <= 2; // OTO2 keeps benefits/science, OTO3-5 removes them

  // WHY: Per-slot word counts calibrated from ACTUAL Vibriance winner pages.
  //   OTO3 original (183 words): pain question + ingredients + 3 benefits + social proof
  //   OTO4 original (220 words): pain question + 3 detailed ingredients + multiple use cases + versatility
  //   OTO5 original (123 words): fear stat + protection framing + simple CTA

  // Position-specific slot guidance — the key differences between OTO2/3/4/5
  const bannerStatGuide = position === 5
    ? 'Protection statistic. Shocking number. NO country references. 5-8 words. Example: "Over 40% Of Packages Are Lost Or Stolen!"'
    : position <= 2
      ? 'Bold PERCENTAGE social proof opening (Vibriance proven: "80% Of Repeat Vibriance Customers Add THIS To Their Order..."). Use a specific % + customer action + curiosity ("THIS" or ellipsis). This creates instant bandwagon effect. 8-15 words.'
      : 'Bold stat with specific outcome. 8-12 words.';

  const warningGuide = position === 5
    ? 'Fear hook about loss/damage. 8-12 words. Example: "Don\'t Be The Next Victim Of Porch Pirates!"'
    : position === 4
      ? 'PAIN QUESTION targeting a specific problem. 10-20 words. Example: "Does Your Skin Get Extra Dry? Upgrade Your Order With This Extra BOOST Of Hydration"'
      : position === 3
        ? 'PAIN QUESTION or frustration hook. Must agitate a specific problem. 15-25 words. Example: "Fed up with people saying you look tired? Dark circles and under-eye bags can age you by a decade."'
        : 'Bold claim with WARNING prefix or exclusivity framing. Vibriance proven: "WARNING: Only for those ready to uncover dramatically younger-looking skin." Creates intrigue + exclusivity. 10-20 words.';

  // WHY: For OTO3-4, extended sections (benefits, science, usage) are REMOVED from HTML.
  //      product_intro becomes the MAIN persuasion paragraph — must carry the full argument:
  //      ingredient names, mechanism, key outcomes, and social proof. All in one compelling block.
  const productIntroGuide = position === 5
    ? 'Brief protection description. 1 sentence.'
    : position === 4
      ? 'MAIN persuasion paragraph. Since benefits/science sections are hidden, include EVERYTHING here: product description with 3 named ingredients/components, what each does, multiple use cases, and social proof. 4-6 sentences, 60-80 words. Example: "That is why we created [Product], featuring a triple-action complex: #1 [Ingredient] does X, #2 [Ingredient] does Y, #3 [Ingredient] does Z. Layer it with your serum! Wear it under makeup! Keep it in your purse! Like all our products, it comes with a full guarantee."'
      : position === 3
        ? 'MAIN persuasion paragraph. Since benefits/science sections are hidden, include EVERYTHING here: product description with ingredient/component names, how they work together, key outcomes. 3-5 sentences, 50-70 words. Example: "That is why we created [Product]: a powerful 4-in-1 formula featuring [Ingredient1], [Ingredient2], [Ingredient3] that work together to deliver [outcome1], [outcome2], [outcome3]. Already helped thousands of women worldwide."'
        : 'Product introduction. Frame as upgrade to previous purchase. 1-2 sentences.';

  const productClaimGuide = !isExtended
    ? 'IGNORE — leave empty string. This section is hidden for OTO3-5.'
    : position >= 3
      ? `Product description with SPECIFIC INGREDIENT or COMPONENT NAMES. Explain the formula/composition. ${position === 4 ? 'Include 3 named ingredients/components with what each one does. 40-60 words.' : 'Include 3-4 named ingredients/components. 30-50 words.'} Example for consumable: "A powerful 4-in-1 formula featuring Pepha-Tight, Ecoslim, PrimalHyal Ultrafiller, and Argireline Amplified that work together to..."`
      : 'Main product differentiator using FIRST & ONLY USP (Vibriance proven: "the FIRST & ONLY retinol serum made exclusively for the delicate MATURE skin of women over 50"). This creates instant authority. Bold claim with specific audience targeting. 20-40 words.';

  const productScienceGuide = !isExtended
    ? 'IGNORE — leave empty string. This section is hidden for OTO3-5.'
    : position >= 3
      ? `How the ingredients/mechanism deliver results. Be SPECIFIC about what each ingredient does. ${position === 4 ? 'Break down 3 ingredients with individual benefits. 40-50 words.' : 'List 3 specific outcomes with the mechanism. 30-40 words.'}`
      : 'How it works. Mechanism + benefit. 20-30 words.';

  // WHY: For OTO3+, usage_instructions section is REMOVED from HTML.
  //      For OTO3-4, usage/synergy info must be included INSIDE product_intro instead.
  const usageGuide = !isExtended
    ? 'IGNORE — leave empty string. This section is hidden for OTO3-5.'
    : position === 4
      ? 'MULTIPLE use cases — show versatility. "Layer it with serum!" + "Wear under makeup!" + "Keep it in your purse!" Minimum 2 different use cases. 30-50 words.'
      : position === 3
        ? 'How to use + synergy with previous product. 1-2 sentences, 15-25 words.'
        : 'AM/PM PROTOCOL (Vibriance OTO2 proven): Explain how to use BOTH products together in a morning/evening routine. This creates a SYSTEM, not random add-ons. "Use [Product A] in the morning to hydrate and protect. Use [Product B] in the evening 2-3 times per week to multiply results. Using both together ensures 24-hour care." 2-3 sentences, 30-50 words.';

  const guaranteeGuide = position === 5
    ? 'Brief guarantee. 1 short sentence. Example: "No questions asked order replacement."'
    : 'Full risk-free guarantee with duration + what happens if not satisfied. 2 sentences.';

  return `{
  "banner_stat": "${bannerStatGuide}",
  "progress_text": "Progress bar text. 2-4 words. Example: Almost Complete...",
  "warning_headline": "${warningGuide}",
  "product_intro": "${productIntroGuide}",
  "product_claim": "${productClaimGuide}",
  "product_science": "${productScienceGuide}",
  "results_intro": "${isExtended ? 'Transition to benefits. 2-5 words. Example: "See the difference:"' : 'IGNORE — leave empty string. This section is hidden for OTO3-5.'}",
  "benefit_1": "${isExtended ? `Benefit bullet 1. ${bulletPrefix}specific outcome with action verb. ${position >= 3 ? '5-10 words with detail.' : '3-8 words.'}` : 'IGNORE — leave empty string.'}",
  "benefit_2": "${isExtended ? `Benefit bullet 2. Same format.` : 'IGNORE — leave empty string.'}",
  "benefit_3": "${isExtended ? 'Benefit bullet 3. Same format.' : 'IGNORE — leave empty string.'}",
  "benefit_4": "${isExtended ? 'Benefit bullet 4. Same format.' : 'IGNORE — leave empty string.'}",
  "benefit_5": "${isExtended ? 'Benefit bullet 5. Same format.' : 'IGNORE — leave empty string.'}",
  "usage_instructions": "${usageGuide}",
  "pricing_headline": "Pricing section header. ${position <= 2 ? '8-12 words.' : '5-8 words.'} Example: Upgrade Your Order Now With A One-Month Treatment:",
  "countdown_label": "${countdownGuidance}",
  "guarantee_text": "${guaranteeGuide}",
  "cta_text": "YES CTA button. ALL CAPS. ${ctaWordGuidance} Example: ${ctaExample}",
  "rejection_text": "Rejection anchor text. Starts with No thanks. ${rejectionWordGuidance} Example: ${rejectionTextExample}",
  "rejection_reason": "Rejection consequence. ${rejectionReasonGuidance} Example: ${rejectionReasonExample}"
}`;
}

// ─── Product Upsell Slot Template (OTO3-4, upsell-product) ──────────────────────

function getProductSlots(
  position: number, ub: UpsellBrief, brief: ProductBrief,
  ctaExample: string, rejectionTextExample: string,
  ctaWordGuidance: string, rejectionWordGuidance: string
): string {
  // WHY: OTO3 shows SECTION_BODY_EXTRA (bullets + extra paragraphs) but hides ingredients/usage.
  //      OTO4 shows ingredients/usage but hides SECTION_BODY_EXTRA.
  //      This gives each OTO enough slots for rich persuasion copy.
  const hasDetails = position >= 4;
  const hasBodyExtra = position < 4; // OTO3 gets the extended body section
  const category: ProductCategory = ub.productCategory ?? 'consumable';

  // Slot guidance for ingredient/usage sections — only OTO4 gets real content
  const ingredientGuide = hasDetails
    ? 'Ingredient/component name with SPECIFIC, TRADEMARK-WORTHY name. NOT generic categories. Format: "#N - [Trademarked Name] [specific benefit]". 8-15 words. Good: "#1 - Fucogel skin sugar plumps fine lines while locking in hydration". Bad: "#1 - Peptides improve skin".'
    : 'IGNORE — leave empty string. This section is hidden for OTO3.';
  const usageGuide = hasDetails
    ? 'Usage tip or use case. Action-oriented. 8-15 words. Show a DIFFERENT way to use the product each time.'
    : 'IGNORE — leave empty string. This section is hidden for OTO3.';
  const benefitGuide = hasDetails
    ? 'Extended benefit detail for this ingredient. Often empty string — only fill if the ingredient name alone is not enough.'
    : 'IGNORE — leave empty string.';

  // Body extra section guidance — only OTO3 gets this
  const bodyExtraGuide = (desc: string) => hasBodyExtra ? desc : 'IGNORE — leave empty string. This section is hidden for OTO4.';

  return `{
  "page_title": "SEO page title. 5-10 words. Include product name. Example: ${brief.name} - Exclusive Upgrade Offer",
  "headline_top": "Attention banner at very top. Pattern interrupt. ${position === 3 ? 'Aspirational claim + pain hook. Vibriance uses "Take Years Off Your Eyes With [Product]" — an aspirational promise followed by the pain question. 10-15 words.' : 'Soft upgrade framing. 8-12 words.'} Example: ${position === 3 ? 'Fed Up With People Saying You Look Tired?' : 'One More Special Offer Before We Ship Your Order...'}",
  "sub_headline": "Main hook headline. Pain question or bold claim. ${position === 3 ? 'Agitate a SPECIFIC problem the target audience has. 8-15 words.' : 'Pain question followed by benefit promise. 8-15 words.'} Example: Does Your Skin Get Extra Dry?",
  "sub_benefit": "Benefit promise following the hook. Transition to solution. Must mention the discount or offer. 8-12 words. Example: Upgrade Your Order With This Extra BOOST Of Hydration...",
  "product_intro": "First body paragraph. ${hasBodyExtra ? 'CHOICE VALIDATION + Pain hook. First validate their previous purchase decision (\"You are going to love [previous product]\" or \"Great choice on [previous product]!\"), THEN agitate a specific problem that the NEW product solves. 2-3 sentences, 25-40 words. Example: \"You are going to love your Retinol Serum. But if you are like most women, you have probably noticed dark circles and under-eye bags that make you look years older than you feel. Vibriance uses the phrase "age you by a decade" — include a similar vivid quantification of the problem.\"' : 'CHOICE VALIDATION + Product context. First validate their previous purchase, then introduce the upgrade as the natural next step. Frame as completing what they started. 2-3 sentences, 30-50 words. Example: \"Great choice on the Eye Serum! Your serum handles the surface. But mature skin needs deep moisture locked in — and that is where [Product] comes in.\"'}",
  "product_intro_2": "Second body paragraph. CRITICAL: Use SPECIFIC, TRADEMARK-WORTHY ingredient names — NOT generic categories. ${hasBodyExtra ? 'Product introduction — name the product and its key formula with 4 SPECIFIC ingredient names (Vibriance uses 4: Pepha-Tight, Ecoslim, PrimalHyal Ultrafiller, AND Argireline Amplified. Always 4 names, never 3, for maximum scientific authority — NOT \"peptides\" or \"botanicals\"). 2-3 sentences, 30-50 words. Example: \"That is why we created [Product], a powerful 4-in-1 formula featuring Pepha-Tight that firms, PrimalHyal Ultrafiller that plumps, and Argireline Amplified that smooths.\"' : 'Introduce the product with SPECIFIC ingredient/formula names — NOT generic categories. Use scientific-sounding or trademarked names. 2-3 sentences, 30-50 words. Example: \"CRITICAL: Start this paragraph with a BEHAVIORAL SOCIAL PROOF stat ("73% of customers add this to complete their routine" or "Over 12,000 customers added this last month"). Then introduce ingredients. Example: "73% of customers add this to complete their routine. Formulated with Fucogel skin sugar that plumps, plant-based Squalane that combats dryness, and mineral-rich Red Algae that prevents moisture loss.\"'}",
  "body_text_3": "${bodyExtraGuide('Ingredient/mechanism details with SPECIFIC NAMES. Explain HOW each named ingredient works. Use the SAME ingredient names from product_intro_2. 1-2 sentences, 20-30 words. Example: \"Peptides plump fine lines, caffeine tightens bags, and botanical extracts erase dark circles. Each one targets a specific sign of aging around the eyes.\"')}",
  "bullet_1": "${bodyExtraGuide('Benefit bullet 1 with checkmark. Start with ✔ then bold benefit + outcome. 8-12 words. Example: \"✔ Depuff & tighten eye bags instantly\"')}",
  "bullet_2": "${bodyExtraGuide('Benefit bullet 2 with checkmark. Start with ✔ then bold benefit + outcome. 8-12 words. Example: \"✔ Brighten dark circles with targeted botanicals\"')}",
  "bullet_3": "${bodyExtraGuide('Benefit bullet 3 with checkmark. Start with ✔ then bold benefit + outcome. 8-12 words. Example: \"✔ Smooth fine lines & wrinkles for younger-looking eyes\"')}",
  "body_text_4": "${bodyExtraGuide('VIVID social proof paragraph. CRITICAL: Use specific, vivid language — NOT generic claims. Include a specific number (thousands, 50,000+, 93%) and an EMOTIONAL outcome with CAPS emphasis. Pattern: \"[Product] has already helped [specific number] [audience] [vivid verb phrase] their [specific result].\" Example: \"Vibriance Eye Renewal Serum has already helped thousands of women worldwide give their eyes an INSTANT REFRESH.\" Example: \"Over 50,000 women have used this to banish dry, tight skin for GOOD.\" The CAPS word creates visual emphasis that stops scanning.')}",
  "body_text_5": "${bodyExtraGuide('Risk-free offer transition. Bold guarantee statement. 1 sentence, 10-20 words. Example: \"Now you can try a FULL [bottle/tube/unit] risk-free for one year!\"')}",
  "ingredient_1_name": "${ingredientGuide}",
  "ingredient_2_name": "${ingredientGuide}",
  "ingredient_3_name": "${ingredientGuide}",
  "ingredient_1_benefit": "${benefitGuide}",
  "ingredient_2_benefit": "${benefitGuide}",
  "ingredient_3_benefit": "${benefitGuide}",
  "usage_tip_1": "${usageGuide} ${hasDetails ? 'Example: Layer it with your serum for extra hydration!' : ''}",
  "usage_tip_2": "${usageGuide} ${hasDetails ? 'Different application. Example: Wear it under your makeup for a flawless look!' : ''}",
  "usage_tip_3": "${usageGuide} ${hasDetails ? 'Creative SURPRISE use case (Vibriance proven): "Even keep it in your purse as a luxurious hand cream to combat dryness from frequent washing." — this multiplies perceived value by showing it is not just for one purpose.' : ''}",
  "usage_tip_4": "${hasDetails ? 'Usage tip 4. Can be empty string if only 3 tips are enough.' : 'IGNORE — leave empty string.'}",
  "usage_guarantee": "${hasDetails ? 'Guarantee line inside the usage section. Mention the guarantee name and duration. 1-2 sentences, 15-25 words. Example: \"Like all of our products, it comes with a 1-Year Bottom Of The Bottle money-back guarantee!\"' : 'IGNORE — leave empty string. This section is hidden for OTO3.'}",
  "guarantee_text": "Risk reversal guarantee text under CTA. 1-2 sentences. Include guarantee duration + what happens if not satisfied. Example: ${getCategoryGuaranteeExample(category)}",
  "cta_text": "YES CTA button. ALL CAPS. ${ctaWordGuidance} Example: ${ctaExample}",
  "rejection_text": "Decline link text with LOSS FRAMING. CRITICAL FORMAT: Start with 'No thanks,' then describe the SPECIFIC benefit or result they're giving up, AND mention the discount percentage or deal they lose. This makes clicking NO feel like a concrete loss, not just skipping an offer. Example: 'No thanks, I don't want to give my eyes an instant refresh for 36% OFF.' Example: 'No thanks, I'll risk dry, tight skin and pay full price later.' Example: 'No thanks, but this 30% OFF deal won't be offered again.' Do NOT use generic text like 'I understand this expires' — it must name the SPECIFIC thing they lose."
}`;
}

// ─── Protection Slot Template (OTO5, upsell-protection) ─────────────────────────

function getProtectionSlots(
  position: number, ub: UpsellBrief, brief: ProductBrief,
  ctaExample: string, rejectionTextExample: string
): string {
  return `{
  "page_title": "SEO page title. 5-8 words. Protection framing. Example: Protect Your Order - Porch Pirates Protection",
  "headline_top": "Final step headline at top. Protective tone. 5-10 words. Example: FINAL STEP: Protect Your Order",
  "hook_stat": "Fear-based statistic. Bold number. Shocking but believable. NO country-specific references. 5-10 words. Example: Over 40% Of Packages Are Lost, Stolen, Or Damaged!",
  "hook_subtitle_1": "First subtitle under the stat. Agitate the fear. 6-10 words. Example: Don't Be The Next Victim Of Porch Pirates",
  "hook_subtitle_2": "Second subtitle. Transition from fear to protection. 6-10 words. Example: And Make Sure You Get Your Order...",
  "offer_headline": "Main offer headline. ALL CAPS. What they get + price. 8-15 words. Example: NO QUESTIONS ASKED ORDER REPLACEMENT FOR ONLY $4.95",
  "offer_desc_1": "What the protection covers. Specific scenarios. 1-2 sentences. Example: In the event that your package is lost, stolen, or damaged in transit.",
  "offer_desc_2": "How it works. Simple and reassuring. 1-2 sentences. Example: Just add it to your order, and it will allow us to ship you a replacement at no extra cost to you, no questions asked.",
  "cta_text": "YES CTA button. ALL CAPS. Protection framing. 4-8 words. Example: ${ctaExample}",
  "rejection_text": "Decline link text. Must include what they refuse to protect against — makes clicking NO feel irresponsible. Vibriance proven: "No thanks, I don't want to protect my order against theft" — the word "theft" creates resistance to clicking. NOT neutral — protection rejection should make the customer pause. Example: ${rejectionTextExample}"
}`;
}

// ─── Helper: Word Budgets Per Position ────────────────────────────────────────

interface WordBudget {
  slot: string;
  max: number;
  guidance: string;
}

function getWordBudgets(position: number, type: UpsellType): WordBudget[] {
  // Base budgets decrease with position
  const budgets: Record<number, number[]> = {
    1: [30, 20, 25, 10, 20, 15, 15, 15],   // ~150 total
    2: [20, 15, 20, 8, 15, 10, 7, 5],       // ~100 total
    3: [15, 10, 12, 5, 10, 8, 5, 5],        // ~70 total
    4: [10, 8, 8, 5, 8, 5, 3, 3],           // ~50 total
    5: [8, 5, 5, 3, 5, 5, 5, 4],            // ~40 total
  };

  const slots = ['persuasion_1', 'persuasion_2', 'persuasion_3', 'persuasion_4', 'persuasion_5', 'persuasion_6', 'persuasion_7a', 'persuasion_7b'];
  const limits = budgets[Math.min(position, 5)] ?? budgets[1];

  return slots.map((slot, i) => ({
    slot,
    max: limits[i],
    guidance: '',
  }));
}

function getWordBudgetsText(budgets: WordBudget[]): string {
  return budgets.map(b => `${b.slot}: max ${b.max} words`).join('\n');
}

// ─── Helper: Per-Slot Guidance ────────────────────────────────────────────────

function getSlotGuidance(slot: string, position: number, type: UpsellType, brief: UpsellBrief): string {
  const p = Math.min(position, 5);
  const category: ProductCategory = brief.productCategory ?? 'consumable';
  const riskReversal = getCategoryRiskReversal(category, brief.guarantee);
  const guaranteeExample = getCategoryGuaranteeExample(category);

  if (type === 'protection') {
    // Protection offers have very different copy needs
    switch (slot) {
      case 'persuasion_1':
        return p === 5 ? 'Fear statistic. Bold. 1 sentence. NO country name. Example: Over 40% Of Packages Are Lost Or Stolen!' : 'Problem statement. 1 sentence.';
      case 'persuasion_2':
        return 'What the protection covers. 1 sentence. Example: In the event your package is lost, stolen, or damaged — we ship a replacement at no cost.';
      case 'persuasion_3':
        return 'Peace of mind framing. 1 sentence. Example: Just add it to your order for complete peace of mind.';
      case 'persuasion_4':
        return p >= 4 ? 'Skip or minimal. 3-5 words max.' : 'Urgency nudge. 1 short sentence.';
      case 'persuasion_5':
        return 'Action step. Simple. 1 sentence.';
      case 'persuasion_6':
        return 'No questions asked. 1 sentence. Example: No questions asked order replacement.';
      case 'persuasion_7a':
        return 'Bold guarantee. Partial sentence. Example: We will replace your order for any reason - ';
      case 'persuasion_7b':
        return 'Completes guarantee. 3-5 words. Example: no questions asked.';
    }
  }

  // Standard product upsell guidance — adapted per category
  switch (slot) {
    case 'persuasion_1':
      return `Hook paragraph. ${p <= 2 ? `Bold. Address a specific pain/desire. ${category === 'consumable' ? 'Frame around consistent use and long-term results.' : category === 'device' ? 'Frame around coverage, convenience, or reliability.' : 'Frame around value and completeness.'}` : 'Bold. ONE specific benefit. Keep it simple.'} ${p <= 2 ? '1-2 sentences.' : '1 sentence.'} ${p === 1 ? `Example: ${category === 'consumable' ? "If you're looking to firm your jowls or reduce your age spots we recommend stocking up as it can take several months to see impressive results." : category === 'device' ? `If you want ${brief.name} working in every room of your home, this is your chance to cover more ground at the lowest price we have ever offered.` : `If you want the full experience, this is your chance to upgrade at the best price.`}` : 'Must connect to their original purchase motivation.'}`;

    case 'persuasion_2':
      return `Offer explanation. ${type === 'same_product' ? `Restate the deal. What they get + why it is special + BEHAVIORAL SOCIAL PROOF (specific stat about other customers choosing this). Example: "We have upgraded your order so you can claim ${getCategoryStockPhrase(category, brief.offerQty, brief.name)}. 73% of customers who see this page choose to add the full supply."` : `Why THIS product complements what they already bought. Use a COMPLEMENTARITY ANALOGY (X is the engine, Y is the fuel). Include BEHAVIORAL SOCIAL PROOF. ${category === 'consumable' ? `Example: "${brief.name} completes the routine by targeting what your previous purchase alone cannot reach. 73% of our customers add this to their order."` : category === 'device' ? `Example: "${brief.name} is the essential companion — it unlocks the full potential of your setup. Over 12,000 customers added this last month."` : `Example: "${brief.name} is the natural next step to maximize your results. 9 out of 10 customers choose to upgrade."`} 1-2 sentences.`}`;

    case 'persuasion_3':
      return `Price anchoring + COST REFRAMING. ${p <= 2 ? 'Compare to retail/competitors. Include $prices. Then break down into per-day cost to make it feel trivial.' : 'Quick value comparison + per-day cost. Include $price.'} ${p <= 2 ? '1-2 sentences.' : '1 sentence.'} ${category === 'consumable' ? 'Example: "Normally $47 per bottle. Today just $28.20 each — less than $0.94/day for your full 90-day supply. Cheaper than your daily coffee."' : 'Example: "Normally $97. Today just $47 — and it pays for itself the first time you use it."'} Must include actual $price numbers AND a per-unit or per-day breakdown. ALSO include COMPETITOR ANCHORING: "Comparable [products] sell for over $XX per [unit]" — this makes the deal feel like a steal.`;

    case 'persuasion_4':
      return `Scarcity trigger. ${p <= 3 ? 'Bold, short. Fear of stock-out or missing out. 1 sentence ending with ellipsis.' : 'Minimal or skip. 3-6 words max.'} Example: We are expecting to go out of stock very soon...`;

    case 'persuasion_5':
      return `Action step. Tell them what to do + benefit + worst-case protection. ${p <= 2 ? '1 sentence.' : '1 short sentence.'} Example: ${category === 'consumable' ? `Add ${brief.offerQty} more to your order so you can [benefit] - even if [worst case].` : category === 'device' ? `Add this to your order and get [benefit] in every room — risk-free with our guarantee.` : `Add this to your order now and [benefit] — risk-free.`}`;

    case 'persuasion_6':
      return `Guarantee mention. Include duration and guarantee name. 1 sentence. Example: ${guaranteeExample}`;

    case 'persuasion_7a':
      return `Risk reversal part 1. Bold claim about full refund. Partial sentence ending with dash. ${p <= 3 ? '1 sentence.' : 'Short.'} Example: ${riskReversal.part1}`;

    case 'persuasion_7b':
      return `Risk reversal part 2. Completes the bold promise. 3-8 words. Example: ${riskReversal.part2}`;

    default:
      return 'Fill with relevant persuasive copy.';
  }
}
