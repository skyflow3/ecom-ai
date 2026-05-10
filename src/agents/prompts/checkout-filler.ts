/**
 * Purpose: Checkout Page Template Filler — generates TEXT content for checkout page slots.
 *          Takes a product brief → outputs a JSON ContentMap for the template engine.
 *          Pricing/bundle/URL values come from the brief (NOT AI-generated).
 *
 * Dependencies: templates/checkout-clarifion.html.json (slot config)
 * Related: template-engine.ts (consumes output), template-generator.ts (orchestrates)
 *
 * WHY: Checkout pages are TRANSACTIONAL. The AI generates headlines, features,
 *      testimonials, and FAQ. Prices, URLs, and bundle config come from the brief
 *      and are injected by the template generator (not the AI).
 *
 * NOTE: This prompt ONLY generates text slots. All pricing, bundle, and URL markers
 *       are filled by the brief merge in template-generator.ts.
 */

import type { ProductBrief } from './template-filler';

/**
 * Extended brief for checkout pages. Includes bundle pricing and checkout URLs.
 * WHY: Checkout needs detailed pricing per bundle tier + payment endpoints.
 */
export interface CheckoutBrief extends ProductBrief {
  /** Plural form of product name (e.g., "Clarifions") */
  namePlural: string;
  /** Product type/category (e.g., "Air Purifier") */
  productType: string;
  /** Bundle configurations (3 or 4 bundles) */
  bundles: CheckoutBundle[];
  /** Warranty upsell configuration */
  warranty: CheckoutWarranty;
  /** Checkout base URL (for API calls) */
  checkoutBaseUrl: string;
  /** Full checkout page URL */
  checkoutUrl: string;
  /** Stripe payment intent endpoint */
  stripeApiEndpoint: string;
  /** Google Places API key for address autocomplete (empty = no autocomplete) */
  googlePlacesApiKey?: string;
  /** Stripe redirect base URL */
  stripeRedirectBaseUrl: string;
  /** Terms of service URL */
  termsUrl: string;
  /** Privacy policy URL */
  privacyUrl: string;
  /** Refund policy URL */
  refundUrl: string;
  /** Base URL for product asset images */
  productAssetsBaseUrl: string;
  /** Base URL for gallery images */
  galleryBaseUrl: string;
  /** Gallery image filenames (5 images) */
  galleryImages: string[];
  /** Logo image URL */
  logoUrl: string;
  /** Brand badge image URL */
  brandImageUrl: string;
  /** WHY: Consumable products (supplements, food, cosmetics, oils, skincare, drinks)
   *      don't need a 2-year warranty upsell. The AI filler prompt auto-detects
   *      this from the product description and sets the flag. Default: true. */
  hasWarranty?: boolean; // default: true
}

export interface CheckoutBundle {
  /** Bundle identifier (e.g., "1x-unit", "3x-pack") */
  id: string;
  /** Display label (e.g., "17% OFF: 3 Purifiers") */
  label: string;
  /** Quantity label (e.g., "1x", "3x", "6x") */
  qtyLabel: string;
  /** Unit price (e.g., "$39.00") */
  unitPrice: string;
  /** Compare-at unit price (e.g., "$49.00") */
  comparePrice: string;
  /** Total price (e.g., "$96.90") */
  totalPrice: string;
  /** Compare-at total price (e.g., "$147.00") */
  compareTotal: string;
  /** Total discount (e.g., "$50.10") */
  totalDiscount: string;
  /** Shipping time (e.g., "3-5 Days", "FREE 3-5 Days") */
  shipSpan: string;
  /** Shipping cost display (e.g., "$4.95", "FREE") */
  shipValue: string;
  /** Shipping text for HTML card (e.g., "+ $4.95 Shipping", "FREE SHIPPING") */
  shipping: string;
  /** Product image filename for this bundle (empty for bundle 1) */
  img: string;
  /** Price display for JS (e.g., "$32.30") */
  priceDisplay: string;
  /** Compare display for JS strikethrough (e.g., "$49.00") */
  compareDisplay: string;
  /** Marketing discount percentage (e.g., "40%", "60%"). Empty/0 = hide badge. */
  discountPct?: string;
}

export interface CheckoutWarranty {
  /** Warranty description (e.g., "2-Year Extended Protection Plan") */
  description: string;
  /** Duration text (e.g., "2 Years") */
  duration: string;
  /** Price (e.g., "$9.99") */
  price: string;
  /** Price as number for JS calc (e.g., "9.99") */
  priceNum: string;
}

/**
 * Build the prompt for checkout page TEXT content generation.
 * Pricing and URL values are NOT generated here — they come from the brief.
 */
export function buildCheckoutFillerPrompt(brief: ProductBrief): string {
  return `You are an ELITE DTC checkout page copywriter.

## YOUR TASK
Generate TEXT content for a checkout/order page selling: **${brief.name}**

## PRODUCT INFO
- Name: ${brief.name}
- Description: ${brief.description}
- Niche: ${brief.niche}
- Target Audience: ${brief.targetAudience}
- Key Benefits: ${brief.benefits.join(', ')}
- Price: ${brief.price} (was ${brief.originalPrice}, ${brief.discountPct} OFF)
- Guarantee: ${brief.guarantee}

## OUTPUT FORMAT
Output a SINGLE JSON object. Each value is a string. No markdown, no code fences.

## CONTENT RULES (MANDATORY)

### Voice & Style
- Write like a FRIEND recommending a product. Short, punchy, conversational.
- Use SPECIFIC numbers: "4.9/5 from 12,744 reviews", "in just 15 minutes".
- NO: "revolutionary", "cutting-edge", "game-changer", "innovative".
- YES: Specific benefits, real outcomes, concrete promises.

### Checkout Page Psychology
Every element on a checkout page must REDUCE FRICTION and CREATE URGENCY.
The visitor has already decided to buy — your job is to prevent abandonment.

1. **Hero Headline**: Frame the product as the solution. Short, confident.
2. **Feature Bullets**: 4 short benefits with icons. Each = 1 outcome.
3. **Urgency Text**: Scarcity or time pressure. Action-oriented.
4. **Testimonials**: 3 real-sounding reviews from DIFFERENT personas.
   Each highlights a DIFFERENT benefit. Imperfect grammar = authentic.
   Include a headline/title for each review.
5. **FAQ**: 11 questions addressing EVERY possible objection.
   Cover: how it works, safety, results timeline, shipping, returns,
   compatibility, side effects, usage, durability, comparison, support.
   Answers should be concise (1-3 sentences) and reassuring.

### Testimonial Rules
- Name: First name + last initial (e.g., "Sarah M.")
- Headline: Short review title (3-8 words)
- Text: 2-4 sentences. Conversational. Specific outcome. Sounds like a real person.
- 3 DIFFERENT personas: e.g., skeptical older person, busy parent, tech-savvy user
- NO marketing language in testimonials

## SLOTS TO FILL (TEXT ONLY)

{
  "hero_headline": "Bold emotional headline above the product. 5-10 words. Example: Is Your Home's Air Making You Sick?",
  "feature_1_text": "Feature bullet 1. Short benefit + outcome. 3-8 words. Example: Purifies 300 sq ft in 30 min",
  "feature_2_text": "Feature bullet 2. Different benefit. 3-8 words. Example: No filters to replace, ever",
  "feature_3_text": "Feature bullet 3. Different benefit. 3-8 words. Example: Whisper quiet operation",
  "feature_4_text": "Feature bullet 4. Different benefit. 3-8 words. Example: Works in any room",
  "urgency_text": "Urgency banner text. 5-12 words. Create time pressure. Example: Hurry! Sale Ends When Timer Hits Zero!",
  "discount_applied_text": "Discount confirmation text. Format: '{pct} OFF Applied'. Example: 60% OFF Applied",
  "testimonial_1_name": "First name + last initial. Example: Dorothy P.",
  "testimonial_1_headline": "Review title. 3-8 words. Example: I got the family bundle and I LOVE THEM!",
  "testimonial_1_text": "Review text. 2-4 sentences. Conversational. Mention the product naturally.",
  "testimonial_2_name": "Different persona. First name + last initial.",
  "testimonial_2_headline": "Different angle review title. 3-8 words.",
  "testimonial_2_text": "Different benefit highlighted. 2-4 sentences. Authentic voice.",
  "testimonial_3_name": "Third persona. First name + last initial.",
  "testimonial_3_headline": "Third angle review title. 3-8 words.",
  "testimonial_3_text": "Third benefit highlighted. 2-4 sentences. Different tone.",
  "testimonial_4_name": "Name for social proof popup (recent buyer). First name + last initial.",
  "faq_heading": "FAQ section heading. Example: Frequently Asked Questions",
  "faq_q1": "FAQ question 1 about how the product works. Example: How does it work?",
  "faq_a1": "Clear, reassuring answer. 1-3 sentences. Mention the mechanism.",
  "faq_q2": "FAQ question 2 about safety/side effects.",
  "faq_a2": "Safety answer. Reassuring but honest.",
  "faq_q3": "FAQ question 3 about results timeline.",
  "faq_a3": "Realistic timeline with encouragement.",
  "faq_q4": "FAQ question 4 about ease of use/setup.",
  "faq_a4": "Simple setup explanation. 'Just plug it in' style.",
  "faq_q5": "FAQ question 5 about who it's for / compatibility.",
  "faq_a5": "Broad compatibility answer with niche specifics.",
  "faq_q6": "FAQ question 6 about durability/longevity.",
  "faq_a6": "Durability claim with specifics.",
  "faq_q7": "FAQ question 7 about shipping/delivery.",
  "faq_a7": "Shipping timeline and process.",
  "faq_q8": "FAQ question 8 about returns/guarantee.",
  "faq_a8": "Guarantee terms. Risk reversal.",
  "faq_q9": "FAQ question 9 comparing to alternatives.",
  "faq_a9": "Comparison answer highlighting advantages.",
  "faq_q10": "FAQ question 10 about energy/power usage.",
  "faq_a10": "Energy efficiency answer with specifics.",
  "faq_q11": "FAQ question 11 about maintenance/care.",
  "faq_a11": "Simple maintenance answer.",
  "hasWarranty": "true or false. true = physical durable product (electronics, devices, tools). false = consumable product (supplements, food, cosmetics, oils, drinks)."
}

## CRITICAL RULES
1. Output ONLY the JSON object. No markdown, no code fences, no explanation.
2. Every string must be properly escaped for JSON.
3. Product name "${brief.name}" must appear naturally in testimonials and FAQ answers.
4. Do NOT generate any pricing, URL, or bundle fields — those are handled separately.
5. Testimonials must sound like REAL PEOPLE — imperfect grammar OK, specific details required.
6. FAQ answers must be CONCISE (checkout pages need quick answers, not essays).
7. All 11 FAQ questions must cover DIFFERENT topics (no duplicates).
8. WARRANTY RULE: If the product is CONSUMABLE (supplements, food, drinks, cosmetics,
   skincare, oils, vitamins, coffee, tea, protein powder, etc.) → output "hasWarranty": false.
   If the product is a PHYSICAL DURABLE (electronics, devices, tools, equipment, accessories) → output "hasWarranty": true.`;
}
