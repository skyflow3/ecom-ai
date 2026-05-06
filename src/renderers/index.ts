/**
 * Purpose: Block renderer registry — imports all renderers and registers them
 *          with the blockRegistry singleton. Import this file once at startup.
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

// ─── Register all blocks ─────────────────────────────────────────────────────

const ALL_BLOCKS: BlockDef[] = [
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

// ─── Full Page Render ────────────────────────────────────────────────────────

import type { BlockTree } from '../design-system/blocks';

/**
 * Render a complete HTML page from a BlockTree.
 * Includes: DOCTYPE, head with CSS variables, body with rendered blocks.
 */
export function renderFullPage(tree: BlockTree, palette: string = 'health-warm'): string {
  const blockHtml = tree.blocks.map(block => blockRegistry.render(block)).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeSimple(tree.metadata.title)}</title>
  <meta name="description" content="${escapeSimple(tree.metadata.description || '')}">
  <meta property="og:title" content="${escapeSimple(tree.metadata.title)}">
  <meta property="og:description" content="${escapeSimple(tree.metadata.description || '')}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', sans-serif; color: var(--color-text); background: var(--color-bg); -webkit-font-smoothing: antialiased; }
    img, video { max-width: 100%; height: auto; display: block; }
    a { color: inherit; text-decoration: none; }
    button { cursor: pointer; border: none; background: none; font-family: inherit; }

    /* Palette: ${palette} — replace with actual palette CSS vars from tokens */
    :root {
      --color-primary: #2D6A4F;
      --color-secondary: #40916C;
      --color-bg: #FFFFFF;
      --color-text: #1B1B1B;
      --color-muted: #6B7280;
      --color-border: #E5E7EB;
      --color-success: #10B981;
      --color-warning: #F59E0B;
      --color-error: #EF4444;
      --font-heading: 'DM Serif Display', serif;
      --font-body: 'Inter', sans-serif;
    }

    /* Shared section styles */
    .ec-section { box-sizing: border-box; width: 100%; margin: 0; padding: 16px; }
    .ec-container { max-width: 480px; margin: 0 auto; }
    @media (min-width: 768px) { .ec-section { padding: 24px; } .ec-container { max-width: 720px; } }
    @media (min-width: 1024px) { .ec-container { max-width: 960px; } }

    /* Visibility */
    .ec-mobile-only { }
    .ec-desktop-only { display: none; }
    @media (min-width: 768px) { .ec-mobile-only { display: none; } .ec-desktop-only { display: block; } }
  </style>
</head>
<body>
${blockHtml}
</body>
</html>`;
}

function escapeSimple(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Re-export for convenience
export { blockRegistry } from '../design-system/blocks';
export { renderFullPage as renderPage };
