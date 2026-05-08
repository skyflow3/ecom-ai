# Page Recipes

Winning page structures extracted from 79+ real DTC pages. Each recipe defines the block order, design tokens, and content requirements for a proven page type.

## How It Works

1. **Pick a recipe** by page type (checkout, upsell, advertorial, etc.)
2. **Clone the structure** — blocks are ordered top-to-bottom as they appear in real winners
3. **Fill blocks with content** — each block has `exampleProps` showing what data it needs
4. **Apply design tokens** — colors, fonts, spacing from the recipe's `designTokens`
5. **Render** — use the block renderers from `src/design-system/blocks.ts`

## Available Recipes

| Recipe ID | Page Type | Description | Source Pages |
|-----------|-----------|-------------|--------------|
| `checkout-v1-checkoutchamp` | Checkout | Radio-button pricing, Bootstrap forms, order bump | 8 pages (Airmoto, Vibriance, Clarifion...) |
| `checkout-v2-webflow` | Checkout | Card-click pricing, Stripe, premium feel | 6 pages (EmSense, HaloGrow, TryLedisa) |
| `upsell-v1-interrupt` | Upsell | "WAIT!" interrupt + countdown + guilt-trip opt-out | 9 OTOs (Vibriance, Clarifion) |
| `upsell-v2-vsl` | Upsell | Video-based upsell with timed reveal | SmoothSpine VSL pattern |
| `downsell-v1` | Downsell | "Wait! Before you go" reduced offer | Common DTC pattern |
| `advertorial-v1-editorial` | Advertorial | News-style editorial with inline CTAs | 15/18 pages analyzed |
| `product-page-v1-dtc` | Product | Long-form product page with alternating sections | 9+ brands |
| `vsl-v1` | VSL | Video sales letter — video is the page | Emma Relief, ProstaVive |
| `thank-you-v1` | Thank You | Post-purchase confirmation | Vibriance, SmoothSpine |
| `bridge-v1` | Bridge | Transition page between funnel steps | Common pattern |
| `optin-v1` | Optin | Email capture with value proposition | Common pattern |
| `quiz-v1` | Quiz | Question-by-question lead qualification | AllFemale quiz pattern |

## Recipe Structure

```typescript
interface PageRecipe {
  id: string;                    // Unique recipe identifier
  name: string;                  // Human-readable name
  description: string;           // When to use this recipe
  pageType: string;              // checkout | upsell | advertorial | product | vsl | ...
  source: string;                // Which winning pages this is based on
  blocks: RecipeBlock[];         // Ordered block list (top to bottom)
  designTokens: RecipeDesignTokens; // Colors, fonts, spacing
  notes: string;                 // Usage tips and gotchas
}

interface RecipeBlock {
  type: string;                  // Block type (matches block renderer name)
  required: boolean;             // Is this block mandatory?
  description: string;           // What this block does
  exampleProps: Record<string, unknown>; // Realistic placeholder content
  visibility?: 'all' | 'mobile' | 'desktop'; // Responsive visibility
}
```

## Usage Example

```typescript
import { ALL_RECIPES } from '@/design-system/recipes';

// 1. Pick a recipe
const recipe = ALL_RECIPES['checkout-v1-checkoutchamp'];

// 2. Get the block order
const blocks = recipe.blocks.filter(b => b.required);

// 3. Apply design tokens
const tokens = recipe.designTokens;
// tokens.ctaColor = '#00C249'
// tokens.maxWidth = '520px'
// tokens.fontFamily = "Helvetica, 'Montserrat', sans-serif"

// 4. Fill blocks with AI-generated content
const filledBlocks = blocks.map(block => ({
  ...block,
  props: generateContent(block.type, productBrief),
}));

// 5. Render the page
const html = renderBlocks(filledBlocks, tokens);
```

## Key Design Tokens Per Page Type

| Page Type | Max Width | CTA Color | Background | Font |
|-----------|-----------|-----------|------------|------|
| Checkout | 520px | #00C249 | #FFFFFF | Montserrat |
| Upsell | 520px | #30BD51 | #FFFFFF | Helvetica |
| Advertorial | 1100px | #47901A | #FFFFFF | Open Sans |
| Product | 1230px | #00C249 | #FFFFFF | Open Sans / Montserrat |
| VSL | 960px | #00C249 | #FFFFFF | Open Sans |
| Thank You | 800px | #00C249 | #FFFFFF | Open Sans |
| Bridge | 600px | #00C249 | #FFFFFF | Open Sans |
| Optin | 600px | #00C249 | #FFFFFF | Open Sans |
| Quiz | 600px | #10B981 | #FFFFFF | Inter / Open Sans |

## Block Catalog

All block types used across recipes map to renderers in `src/design-system/blocks.ts`:

- **Navigation**: announcement-bar, logo-header, breadcrumb, timer-nav, sticky-cta
- **Hero**: hero, hero-headline, hero-banner
- **Content**: body-text, headline, benefits-list, numbered-list, highlight-text, image-gallery, image-caption, blockquote, comparison-table, video
- **Social Proof**: testimonials, results-stats, as-seen-on
- **Conversion**: cta-button, bundle-offers, countdown, urgency-box, guarantee, trust-badges, price-display, value-stack
- **Forms**: shipping-form, payment-form, email-form, express-checkout, privacy-text, order-bump, order-summary
- **Upsell**: interrupt-header, negative-opt-out, package-protection, reveal-section, video-player
- **Quiz**: progress-bar, question, options, quiz-cta
- **Footer**: footer
- **Other**: confirmation-header, click-for-sound, clinical-references, discount-section, survey-link, upsell-banner, google-maps, customer-support, continue-shopping

## Data Source

All recipes are extracted from real winning DTC pages analyzed in:
- `design-data/checkout-pages-analysis.md` (19 checkout pages)
- `design-data/upsell-pages-analysis.md` (12 upsell pages)
- `design-data/advertorials-analysis.md` (18 advertorial pages)
- `design-data/product-pages-analysis.md` (15 product/sale pages)
- `design-data/DESIGN-SYSTEM.md` (unified design system)
