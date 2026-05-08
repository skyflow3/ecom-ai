/**
 * Purpose: Block renderer registry — imports all renderers and registers them
 *          with the blockRegistry singleton. Also contains the full-page renderer.
 * Dependencies: blocks.ts (blockRegistry, BlockDef), all renderer files
 * Related: Architecture Finale.md §51 (Render pipeline)
 *
 * USAGE:
 *   import '../renderers';  // registers all blocks
 *   import { blockRegistry } from '../design-system/blocks';
 *   const html = blockRegistry.renderTree(blockTree);
 */

import { blockRegistry, type BlockDef } from '../design-system/blocks';
import type { Block } from '../design-system/blocks';
import type { BlockTree } from '../design-system/blocks';

// ─── Import all renderers ─────────────────────────────────────────────────────

import {
  renderHero, renderHeading, renderSubheadline, renderBodyText,
  renderImage, renderVideo, renderButton, renderCta,
  renderBenefitsList, renderFeaturesGrid, renderComparisonChart,
  renderFaq, renderBeforeAfter, renderIconList,
  renderScrollingMarquee, renderProgressBar,
} from './basic-content';

import {
  renderBundleOffers, renderPricingCard, renderAddToCart,
  renderOrderSummary, renderPaymentForm, renderShippingForm,
  renderCountdown, renderScarcityBadge, renderNegativeOptOut,
  renderSellingPlanToggle, renderDiscountCode, renderPaymentOptions,
  renderGuarantee,
} from './commerce-urgency';

import {
  renderReviews, renderTestimonial, renderSocialProof,
  renderTrustBadges, renderProductCarousel, renderForm, renderQuizStep,
} from './social-forms';

import {
  renderEditorialHeader, renderBreadcrumb, renderByline,
  renderStickyCta, renderEditorialSectionHeading, renderAuthorCta,
} from './editorial-blocks';

// ─── Register all blocks ─────────────────────────────────────────────────────

const ALL_BLOCKS: BlockDef[] = [
  // Editorial (advertorial/news-style)
  { type: 'editorial-header', category: 'editorial', label: 'Editorial Header', render: renderEditorialHeader },
  { type: 'breadcrumb', category: 'editorial', label: 'Breadcrumb', render: renderBreadcrumb },
  { type: 'byline', category: 'editorial', label: 'Byline', render: renderByline },
  { type: 'editorial-heading', category: 'editorial', label: 'Section Heading', render: renderEditorialSectionHeading },
  { type: 'author-cta', category: 'editorial', label: 'Author CTA', render: renderAuthorCta },
  { type: 'sticky-cta', category: 'editorial', label: 'Sticky CTA', render: renderStickyCta },

  // Basic
  { type: 'hero', category: 'basic', label: 'Hero', render: renderHero },
  { type: 'heading', category: 'basic', label: 'Heading', render: renderHeading },
  { type: 'subheadline', category: 'basic', label: 'Subheadline', render: renderSubheadline },
  { type: 'body-text', category: 'basic', label: 'Body Text', render: renderBodyText },
  { type: 'image', category: 'basic', label: 'Image', render: renderImage },
  { type: 'video', category: 'basic', label: 'Video', render: renderVideo },
  { type: 'button', category: 'basic', label: 'Button', render: renderButton },
  { type: 'cta', category: 'basic', label: 'CTA', render: renderCta },

  // Commerce
  { type: 'bundle-offers', category: 'commerce', label: 'Bundle Offers', render: renderBundleOffers },
  { type: 'pricing-card', category: 'commerce', label: 'Pricing Card', render: renderPricingCard },
  { type: 'add-to-cart', category: 'commerce', label: 'Add to Cart', render: renderAddToCart },
  { type: 'order-summary', category: 'commerce', label: 'Order Summary', render: renderOrderSummary },
  { type: 'payment-form', category: 'commerce', label: 'Payment Form', render: renderPaymentForm },
  { type: 'shipping-form', category: 'commerce', label: 'Shipping Form', render: renderShippingForm },
  { type: 'countdown', category: 'commerce', label: 'Countdown', render: renderCountdown },
  { type: 'scarcity-badge', category: 'commerce', label: 'Scarcity Badge', render: renderScarcityBadge },
  { type: 'negative-opt-out', category: 'commerce', label: 'Negative Opt-Out', render: renderNegativeOptOut },
  { type: 'selling-plan-toggle', category: 'commerce', label: 'Selling Plan Toggle', render: renderSellingPlanToggle },
  { type: 'discount-code', category: 'commerce', label: 'Discount Code', render: renderDiscountCode },
  { type: 'payment-options', category: 'commerce', label: 'Payment Options', render: renderPaymentOptions },
  { type: 'guarantee', category: 'commerce', label: 'Guarantee', render: renderGuarantee },

  // Social proof
  { type: 'reviews', category: 'social-proof', label: 'Reviews', render: renderReviews },
  { type: 'testimonial', category: 'social-proof', label: 'Testimonial', render: renderTestimonial },
  { type: 'social-proof', category: 'social-proof', label: 'Social Proof', render: renderSocialProof },
  { type: 'trust-badges', category: 'social-proof', label: 'Trust Badges', render: renderTrustBadges },

  // Content
  { type: 'benefits-list', category: 'content', label: 'Benefits List', render: renderBenefitsList },
  { type: 'features-grid', category: 'content', label: 'Features Grid', render: renderFeaturesGrid },
  { type: 'comparison-chart', category: 'content', label: 'Comparison Chart', render: renderComparisonChart },
  { type: 'faq', category: 'content', label: 'FAQ', render: renderFaq },
  { type: 'before-after', category: 'content', label: 'Before/After', render: renderBeforeAfter },
  { type: 'icon-list', category: 'content', label: 'Icon List', render: renderIconList },
  { type: 'scrolling-marquee', category: 'content', label: 'Scrolling Marquee', render: renderScrollingMarquee },
  { type: 'progress-bar', category: 'content', label: 'Progress Bar', render: renderProgressBar },
  { type: 'product-carousel', category: 'content', label: 'Product Carousel', render: renderProductCarousel },

  // Forms
  { type: 'form', category: 'forms', label: 'Form', render: renderForm },
  { type: 'quiz-step', category: 'forms', label: 'Quiz Step', render: renderQuizStep },
];

// Register all
for (const def of ALL_BLOCKS) {
  blockRegistry.register(def);
}

// ─── UTF-8 Text Normalization ────────────────────────────────────────────────

/**
 * Fix common UTF-8 encoding corruptions that happen when text passes through
 * PostgreSQL JSON columns or HTTP transfers.
 *
 * WHY: Em dashes (—) often render as â€" when UTF-8 bytes are misinterpreted
 *      as Windows-1252. This function fixes the most common corruptions.
 */
function normalizeUtf8(text: string): string {
  return text
    // Fix em dash corruptions
    .replace(/\u00E2\u20AC\u201C/g, '\u2014')  // â€" → —
    .replace(/\u00E2\u20AC\u201D/g, '\u2014')  // â€" → —
    // Fix smart quote corruptions
    .replace(/\u00E2\u20AC\u02DC/g, '\u2018')  // â€˜ → '
    .replace(/\u00E2\u20AC\u2122/g, '\u2019')  // â€™ → '
    .replace(/\u00E2\u20AC\u0153/g, '\u201C')  // â€œ → "
    .replace(/\u00E2\u20AC\u009D/g, '\u201D')  // â€\u009d → "
    // Fix other common corruptions
    .replace(/\u00E2\u20AC\u00A2/g, '\u2022')  // â€¢ → •
    .replace(/\u00E2\u20AC\u00A6/g, '\u2026')  // â€¦ → …
    .replace(/\u00C2\u00A0/g, '\u00A0')         // Â\u00A0 → non-breaking space
    // Ensure clean UTF-8 for common special chars
    .replace(/â€"/g, '\u2014')                   // â€" → — (fallback)
    .replace(/â€™/g, '\u2019')                    // â€™ → ' (fallback)
    .replace(/â€œ/g, '\u201C')                   // â€œ → " (fallback)
    .replace(/â€/g, '\u201D');                    // â€\u009d → " (fallback)
}

// ─── Page-type-specific max-widths ────────────────────────────────────────────

const PAGE_MAX_WIDTHS: Record<string, string> = {
  'advertorial': '720px',
  'product-page': '1024px',
  'vsl': '960px',
  'checkout': '520px',
  'upsell': '520px',
  'downsell': '520px',
  'optin': '640px',
  'quiz': '640px',
  'thank-you': '640px',
  'bridge': '720px',
};

// ─── Pro Design System CSS ───────────────────────────────────────────────────

/**
 * Production-quality CSS with EXACT values from winning DTC pages.
 * WHY: All values extracted from DESIGN-SYSTEM.md which was compiled from
 *      79+ real winning pages. No guesswork.
 * Sources: SmoothSpire, Rejuvera, Vibriance, HaloGrow, EmSense, checkout pages.
 */
const PRO_CSS = `
  /* ─── Reset & Base ─── */
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { font-size: 16px; -webkit-text-size-adjust: 100%; scroll-behavior: smooth; }
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    color: #02122E;
    background: #FFFFFF;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    line-height: 1.6;
  }
  img, video { max-width: 100%; height: auto; display: block; }
  a { color: inherit; text-decoration: none; }
  button { cursor: pointer; border: none; background: none; font-family: inherit; }
  p { margin-bottom: 1em; }
  p:last-child { margin-bottom: 0; }
  ul, ol { padding-left: 1.5em; }
  strong, b { font-weight: 700; }
  em, i { font-style: italic; }

  /* ─── Section Layout ─── */
  /* WHY: 16px mobile padding, 32px desktop from --space-section-horizontal */
  .ec-section {
    box-sizing: border-box;
    width: 100%;
    margin: 0;
    padding: 16px;
  }
  .ec-container {
    max-width: 720px;
    margin: 0 auto;
  }

  /* WHY: Alternating section backgrounds from winning pages:
        White -> Light gray #F5F5F5 -> White -> Cream #F9F2E8 -> White */
  .ec-section:nth-child(even) {
    background-color: #F5F5F5;
  }

  /* ─── Typography ─── */
  /* WHY: H1 36-52px desktop / 22-32px mobile, weight 800, 48-58px line-height */
  h1, h2, h3 { line-height: 1.2; }

  /* ─── Buttons ─── */
  /* WHY: Green #00C249 primary CTA from checkout pages, 8px radius, 20px bold */
  .ec-btn-primary {
    background: #00c249;
    color: #FFFFFF;
    transition: transform 0.15s ease, box-shadow 0.15s ease, background-color 200ms ease-in-out;
    box-shadow: 0 2px 4px 2px rgba(0, 0, 0, 0.05);
  }
  .ec-btn-primary:hover {
    background: #53A81E;
    transform: translateY(-1px);
  }
  .ec-btn-primary:active {
    transform: scale(0.97);
  }
  .ec-btn-urgency {
    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
    color: #FFFFFF;
    animation: ec-cta-pulse 2.5s ease-in-out infinite;
    box-shadow: 0 4px 14px rgba(220, 38, 38, 0.4);
  }
  .ec-btn-secondary {
    background: transparent;
    color: #2D6A4F;
    border: 2px solid #2D6A4F;
  }

  @keyframes ec-cta-pulse {
    0%, 100% { box-shadow: 0 4px 14px rgba(220, 38, 38, 0.4); }
    50% { box-shadow: 0 4px 28px rgba(220, 38, 38, 0.6); }
  }

  /* ─── Visibility ─── */
  .ec-mobile-only { }
  .ec-desktop-only { display: none; }
  @media (min-width: 768px) {
    .ec-mobile-only { display: none; }
    .ec-desktop-only { display: block; }
    .ec-section { padding: 32px; }
  }

  /* ─── Scrollbar hide for carousels ─── */
  .ec-carousel-track::-webkit-scrollbar,
  .ec-reviews-carousel::-webkit-scrollbar { display: none; }

  /* ─── Safe area for sticky CTA spacing ─── */
  /* WHY: 80px padding-bottom on mobile to prevent content hidden behind sticky bar */
  body { padding-bottom: 80px; }
  @media (min-width: 768px) { body { padding-bottom: 0; } }
`.trim();

// ─── Full Page Render ────────────────────────────────────────────────────────

/**
 * Render a complete HTML page from a BlockTree.
 * Includes: DOCTYPE, head with pro CSS + charset, body with rendered blocks.
 * Encoding: Explicitly normalizes UTF-8 and sets charset everywhere.
 */
export function renderFullPage(tree: BlockTree, palette: string = 'health-warm'): string {
  const pageType = tree.pageType ?? 'advertorial';
  const maxWidth = PAGE_MAX_WIDTHS[pageType] ?? '720px';

  const blockHtml = tree.blocks.map(block => {
    try {
      return blockRegistry.render(block);
    } catch (err) {
      console.error(`[renderer] Block "${block.type}" (${block.id}) failed:`, err);
      return `<!-- Block "${block.type}" render failed -->`;
    }
  }).join('\n');

  // Normalize the entire HTML output for UTF-8 consistency
  const normalizedHtml = normalizeUtf8(blockHtml);

  // Override container max-width based on page type
  const containerOverride = `
    .ec-container { max-width: ${maxWidth}; }
    @media (min-width: 768px) { .ec-container { max-width: ${maxWidth}; } }
    @media (min-width: 1024px) { .ec-container { max-width: ${maxWidth}; } }
  `;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeSimple(normalizeUtf8(tree.metadata.title))}</title>
  <meta name="description" content="${escapeSimple(normalizeUtf8(tree.metadata.description || ''))}">
  <meta property="og:title" content="${escapeSimple(normalizeUtf8(tree.metadata.title))}">
  <meta property="og:description" content="${escapeSimple(normalizeUtf8(tree.metadata.description || ''))}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    ${PRO_CSS}

    /* Container override for page type: ${pageType} */
    ${containerOverride}

    /* Palette: ${palette} */
    :root {
      --color-primary: #00c249;
      --color-primary-hover: #53A81E;
      --color-secondary: #40916C;
      --color-bg: #FFFFFF;
      --color-bg-alt: #F5F5F5;
      --color-bg-warm: #FFFBef;
      --color-text: #02122E;
      --color-text-dark: #1B2A43;
      --color-text-body: #1B1B1B;
      --color-muted: #6B7280;
      --color-border: #E6E7EA;
      --color-success: #00c249;
      --color-warning: #F59E0B;
      --color-error: #EC0B43;
      --color-urgency-red: #D0021B;
      --color-highlight: #FDCC5E;
      --color-urgency-bg: #FEFBC3;
      --color-guarantee-bg: #FFFBef;
      --color-guarantee-border: #FAB73C;
      --color-timer-bg: #0c230e;
      --color-timer-accent: #baf363;
      --color-footer-bg: #141619;
      --color-footer-dark: #0E0F11;
      --color-paypal: #FFC43A;
      --color-paypal-text: #253B80;
      --font-heading: 'DM Serif Display', serif;
      --font-body: 'Inter', sans-serif;
    }
  </style>
</head>
<body>
${normalizedHtml}
</body>
</html>`;
}

function escapeSimple(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Re-export for convenience
export { blockRegistry } from '../design-system/blocks';
export { renderFullPage as renderPage };
