/**
 * Purpose: Funnel Auto-Config Prompt — AI generates a complete FunnelConfig from a product brief alone.
 *          Used by AI agents to autonomously plan and generate marketing funnels.
 * Dependencies: None (pure prompt builder)
 * Related: funnel-generator.ts (consumer of generated config)
 *
 * WHY: AI agents need to create funnels without human configuration.
 *      Given a product brief, this prompt asks the AI to:
 *      1. Choose entry page types to A/B test (advertorial, listicle, product page)
 *      2. Decide number of upsells and their types
 *      3. Generate brief overrides for each step
 *      4. Configure traffic weights for variants
 *
 * ARCHITECTURE:
 *   ProductBrief → buildFunnelConfigPrompt() → LLM → FunnelConfig JSON → generateFunnel()
 *
 * DESIGN FOR AI AGENTS:
 *   - Output is a valid FunnelConfig JSON (can be passed directly to generateFunnel)
 *   - Includes all available templates and page types for the AI to choose from
 *   - Psychology-based upsell strategy recommendations
 */

import type { ProductBrief } from './template-filler';

// ─── Available Templates ────────────────────────────────────────────────────────

/**
 * WHY: The AI needs to know what templates and page types are available.
 *      This data is embedded in the prompt so the AI can make informed choices.
 */
const AVAILABLE_TEMPLATES = [
  { id: 'smoothspire-advertorial', role: 'entry', type: 'advertorial', description: 'Narrative advertorial — story-driven, long-form. Best for awareness/interest stage.' },
  { id: 'hike-reasons-why', role: 'entry', type: 'listicle', description: 'Listicle "10 Reasons Why" — numbered list format. Best for skeptical/analytical audience.' },
  { id: 'product-page-tryemsense', role: 'entry', type: 'product_page', description: 'DTC product page — features, reviews, pricing. Best for warm/intent traffic.' },
  { id: 'checkout-clarifion', role: 'checkout', type: 'checkout', description: 'Checkout page — 127 slots, 3/4 bundle options, Stripe integration, Places autocomplete.' },
  { id: 'upsell-vibriance', role: 'upsell', type: 'upsell', otoPosition: 1, description: 'OTO1 volume deal — same product, bulk discount (3-pack, 6-pack). Creates urgency + savings.' },
  { id: 'upsell-cross-sell', role: 'upsell', type: 'upsell', otoPosition: 2, description: 'OTO2 cross-sell — complementary product (AM/PM routine). "Complete the system" angle.' },
  { id: 'upsell-product', role: 'upsell', type: 'upsell', otoPosition: [3, 4], description: 'OTO3+OTO4 cross-sell — premium product or surprise bundle. Different zone per position.' },
  { id: 'upsell-protection', role: 'upsell', type: 'upsell', otoPosition: 5, description: 'OTO5 protection — package insurance against loss/theft/damage. Low price, high margin.' },
  { id: 'thank-you-page-smoothspine', role: 'thankyou', type: 'thankyou', description: 'Thank you page — order confirmation, user guide, community, survey.' },
];

const AVAILABLE_PAGE_TYPES = [
  'product-page', 'checkout', 'upsell', 'downsell', 'optin', 'quiz', 'thank-you', 'bridge',
];

const AVAILABLE_PALETTES = [
  { id: 'health-warm', bestFor: ['supplement', 'health', 'fitness'] },
  { id: 'beauty-clean', bestFor: ['skincare', 'beauty', 'cosmetics'] },
  { id: 'supplement-bold', bestFor: ['supplement', 'nutrition', 'wellness'] },
  { id: 'pet-friendly', bestFor: ['pet', 'animal', 'dog', 'cat'] },
  { id: 'beauty-bold', bestFor: ['skincare', 'anti-aging', 'beauty'] },
];

// ─── Prompt Builder ─────────────────────────────────────────────────────────────

/**
 * Build a prompt that asks the AI to generate a complete FunnelConfig.
 *
 * @param brief - Product brief with all product details
 * @returns System prompt + user prompt for the LLM
 */
export function buildFunnelConfigPrompt(brief: ProductBrief): { system: string; user: string } {
  const system = `You are an expert e-commerce funnel strategist. Your job is to design the optimal funnel configuration for a product.

You must output a valid JSON FunnelConfig that can be used directly by the funnel generator.

AVAILABLE TEMPLATES (template mode, 99.9% visual fidelity):
${JSON.stringify(AVAILABLE_TEMPLATES, null, 2)}

AVAILABLE PAGE TYPES (block mode, AI-composed, ~82% fidelity):
${JSON.stringify(AVAILABLE_PAGE_TYPES, null, 2)}

AVAILABLE COLOR PALETTES (for block mode):
${JSON.stringify(AVAILABLE_PALETTES, null, 2)}

FUNNEL ARCHITECTURE RULES:
1. Standard flow: Entry → Checkout → OTO1 → OTO2 → OTO3 → OTO4 → OTO5 → Thank You
2. Entry page should have 2-3 A/B variants (advertorial, listicle, product page)
3. Each upsell has exactly 1 variant (no A/B testing on upsells unless specifically needed)
4. Thank you page has exactly 1 variant
5. Checkout is skipped in static deployments (backend handles payment → redirect)

VARIANT WEIGHT RULES:
- All traffic weights for a step must sum to 100
- Typical split: 34/33/33 for 3 variants, 50/50 for 2 variants

UPSELL PSYCHOLOGY (position-by-position):
- OTO1 (volume deal): Same product, bulk discount. Psychology: "Save more by buying more."
- OTO2 (cross-sell): Complementary product. Psychology: "Complete the system/routine."
- OTO3 (premium): Higher-value cross-sell. Psychology: "You deserve the premium experience."
- OTO4 (surprise): Unexpected value-add. Psychology: "One more thing you'll love."
- OTO5 (protection): Package insurance. Psychology: "Protect your investment."

CATEGORY-SPECIFIC RULES:
- Consumable (supplements, skincare): Volume deals work best for OTO1
- Device (gadgets, tools): Accessories/warranties work best for OTO1
- Digital (courses, software): Premium tiers work best for OTO1
- Apparel: Style bundles work best for OTO1

OUTPUT FORMAT:
Return ONLY a JSON object matching this FunnelConfig structure (no markdown, no explanation):
{
  "product": { ... same as input brief ... },
  "baseUrl": ".",
  "outputDir": "auto-generated",
  "steps": [
    {
      "id": "entry",
      "outputFilename": "index.html",
      "nextOnAccept": "checkout",
      "variants": [
        {
          "id": "a",
          "name": "Advertorial",
          "mode": "template",
          "templateId": "smoothspire-advertorial",
          "trafficWeight": 34,
          "briefOverrides": {}
        },
        {
          "id": "b",
          "name": "Listicle",
          "mode": "template",
          "templateId": "hike-reasons-why",
          "trafficWeight": 33,
          "briefOverrides": {}
        },
        {
          "id": "c",
          "name": "Product Page",
          "mode": "template",
          "templateId": "product-page-tryemsense",
          "trafficWeight": 33,
          "briefOverrides": {}
        }
      ]
    },
    {
      "id": "checkout",
      "outputFilename": "checkout.html",
      "nextOnAccept": "oto1",
      "templateId": "checkout-clarifion"
    },
    {
      "id": "oto1",
      "outputFilename": "oto1.html",
      "nextOnAccept": "oto2",
      "nextOnDecline": "oto2",
      "templateId": "upsell-vibriance",
      "briefOverrides": {
        "name": "...",
        "price": "...",
        "offerQty": 3,
        "offerUnitPrice": "...",
        "offerTotalPrice": "...",
        "retailUnitPrice": "...",
        "retailTotalPrice": "...",
        "upsellType": "same_product",
        "countdownMinutes": "10",
        "currencyLabel": "USD",
        "otoPosition": 1,
        "previousProduct": "..."
      }
    },
    ... more upsells ...
    {
      "id": "thankyou",
      "outputFilename": "thankyou.html",
      "templateId": "thank-you-page-smoothspine",
      "briefOverrides": {
        "brandName": "...",
        "billingName": "... LLC",
        "supportEmail": "...",
        "supportPhone": "+1 ...",
        "showSurvey": true,
        "showVideo": true,
        "showCommunity": true,
        "showUserGuide": true
      }
    }
  ]
}

IMAGE GENERATION:
- Image generation is available via ComfyUI Flux.2 Klein + LoRA (local, unlimited)
- Store generated images in: /public/products/{product-slug}/
- Include all image URLs in the product brief and briefOverrides where needed
- If images don't exist yet, use placeholder paths that the image gen pipeline will fill later

IMPORTANT:
- Use mode "template" for all pages when templates are available (highest fidelity)
- Use mode "block" only when no template exists for a needed page type
- Generate realistic upsell products, prices, and brief overrides based on the input product
- Each upsell should feel like a NATURAL extension of the customer's purchase journey
- Prices should show clear discount (30-60% off retail)
- ALL fields in briefOverrides must be filled (no empty strings)
- Include all image URLs (logo, gallery, bundle, upsell product) in the output config
- If images don't exist yet, use placeholder paths that the image gen pipeline will fill later`;

  const user = `Design the optimal funnel for this product:

PRODUCT BRIEF:
${JSON.stringify(brief, null, 2)}

Generate the complete FunnelConfig JSON now.`;

  return { system, user };
}
