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

import {
  renderNumberedBenefits, renderMediaBadges,
  renderFacebookPost, renderDoctorEndorsement,
} from './winner-blocks';

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
  { type: 'facebook-post', category: 'social-proof', label: 'Facebook Post', render: renderFacebookPost },
  { type: 'doctor-endorsement', category: 'social-proof', label: 'Doctor Endorsement', render: renderDoctorEndorsement },

  // Content
  { type: 'benefits-list', category: 'content', label: 'Benefits List', render: renderBenefitsList },
  { type: 'features-grid', category: 'content', label: 'Features Grid', render: renderFeaturesGrid },
  { type: 'comparison-chart', category: 'content', label: 'Comparison Chart', render: renderComparisonChart },
  { type: 'faq', category: 'content', label: 'FAQ', render: renderFaq },
  { type: 'before-after', category: 'content', label: 'Before/After', render: renderBeforeAfter },
  { type: 'icon-list', category: 'content', label: 'Icon List', render: renderIconList },
  { type: 'numbered-benefits', category: 'content', label: 'Numbered Benefits', render: renderNumberedBenefits },
  { type: 'media-badges', category: 'content', label: 'Media Badges', render: renderMediaBadges },
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
  'advertorial': '1100px',   // WHY: 2-column layout: 1fr + 300px sidebar
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
    font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    color: #303030;
    background: #FFFFFF;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    line-height: 1.6;
    overflow-x: hidden;
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
    overflow-x: hidden;
  }
  /* WHY: Winners use 20-25px spacing between sections */
  .ec-section + .ec-section { padding-top: 24px; }
  .ec-container {
    max-width: 720px;
    margin: 0 auto;
  }

  /* WHY: Winners (SmoothSpire, Rejuvera, Vibriance) use flat white backgrounds.
     No alternating colors. Clean, editorial, single-background. */
  .ec-section:nth-child(even) {
    background-color: transparent;
  }

  /* ─── Typography ─── */
  /* WHY: Winners use sans-serif bold ALL CAPS headings (Montserrat/Open Sans).
     DM Serif Display looks too "newspaper" — winners use hype-style sans-serif. */
  h1, h2, h3 { line-height: 1.2; }

  /* ─── Buttons ─── */
  /* WHY: Winners use 60px height, 20px font, UPPERCASE, border-radius 5px.
     No pulse animations — winners use static buttons only. */
  .ec-btn-primary {
    background: #16a34a;
    color: #FFFFFF;
    min-height: 60px;
    font-size: 20px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-radius: 5px;
    transition: background-color 200ms ease-in-out;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  .ec-btn-primary:hover {
    background: #22c55e;
  }
  .ec-btn-primary:active {
    transform: scale(0.98);
  }
  .ec-btn-urgency {
    background: #dc2626;
    color: #FFFFFF;
    min-height: 60px;
    font-size: 20px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-radius: 5px;
    box-shadow: 0 4px 14px rgba(220, 38, 38, 0.3);
  }
  .ec-btn-secondary {
    background: transparent;
    color: #2D6A4F;
    border: 2px solid #2D6A4F;
  }
  /* WHY: SmoothSpire uses orange #e1662d for the main inline CTA — stands out more */
  .ec-btn-highlight {
    background: #e1662d;
    color: #FFFFFF;
    box-shadow: 0 4px 14px rgba(225, 102, 45, 0.4);
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }
  .ec-btn-highlight:hover {
    background: #c9551f;
    transform: translateY(-1px);
  }

  /* WHY: No pulse animation — winners use static buttons only */

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
 *
 * ADVERTORIAL LAYOUT (desktop):
 *   Grid: 1fr 300px — main content left, sticky sidebar right.
 *   Sidebar auto-generated with: product image + CTA + reviews.
 *   WHY: 15/18 winning advertorials use this exact 2-column layout.
 *        Mobile: single column, sidebar moves below content.
 */
export function renderFullPage(tree: BlockTree, palette: string = 'health-warm'): string {
  const pageType = tree.pageType ?? 'advertorial';
  const maxWidth = PAGE_MAX_WIDTHS[pageType] ?? '720px';
  const isAdvertorial = pageType === 'advertorial';

  // Extract product info from tree metadata for sidebar
  const meta = tree.metadata as Record<string, unknown>;
  const productName = String(meta.productName ?? meta.title ?? '');
  const productImage = String(meta.productImage ?? '');
  const productPrice = String(meta.productPrice ?? '');
  const productOriginalPrice = String(meta.productOriginalPrice ?? '');
  const productRating = Number(meta.productRating ?? 4.8);
  const productRatingCount = String(meta.productRatingCount ?? '2,847');
  const productUrl = String(meta.productUrl ?? '#');

  const blockHtml = tree.blocks.map(block => {
    try {
      return blockRegistry.render(block);
    } catch (err) {
      console.error(`[renderer] Block "${block.type}" (${block.id}) failed:`, err);
      return `<!-- Block "${block.type}" render failed -->`;
    }
  }).join('\n');

  const normalizedHtml = normalizeUtf8(blockHtml);

  // Container override
  const containerOverride = `
    .ec-container { max-width: ${isAdvertorial ? '760px' : maxWidth}; }
    @media (min-width: 768px) { .ec-container { max-width: ${isAdvertorial ? '760px' : maxWidth}; } }
    @media (min-width: 1024px) { .ec-container { max-width: ${isAdvertorial ? '760px' : maxWidth}; } }
  `;

  // WHY: Advertorial 2-column layout — grid with 1fr main + 300px sticky sidebar.
  //      Matches winning pages (SmoothSpire, Rejuvera, Vibriance).
  //      Sidebar contains: product image + price + CTA button + star reviews.
  //      On mobile: sidebar hidden, content full-width.
  const advertorialLayout = isAdvertorial ? `
    /* ─── Advertorial 2-Column Layout ─── */
    .adv-layout {
      max-width: 1100px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr;
      gap: 0;
      align-items: start;
    }
    @media (min-width: 1024px) {
      .adv-layout {
        grid-template-columns: 1fr 300px;
        gap: 24px;
        padding: 0 16px;
      }
    }
    .adv-main {
      min-width: 0; /* Prevent grid blowout */
    }
    .adv-sidebar {
      display: none; /* Hidden on mobile */
    }
    @media (min-width: 1024px) {
      .adv-sidebar {
        display: block;
        position: sticky;
        top: 16px;
        z-index: 10;
      }
    }
    /* Sidebar card */
    .adv-sidebar-card {
      background: #fff;
      border: 1px solid #E6E7EA;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }
    .adv-sidebar-card + .adv-sidebar-card {
      margin-top: 16px;
    }
    /* Product image placeholder */
    .adv-sidebar-img {
      width: 100%;
      height: 200px;
      background: linear-gradient(135deg, #f0f4f0 0%, #e8ede8 100%);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
      overflow: hidden;
    }
    .adv-sidebar-img img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    /* Price styling */
    .adv-price-row {
      display: flex;
      align-items: baseline;
      gap: 8px;
      margin-bottom: 12px;
    }
    .adv-price-now {
      font-family: 'Inter', sans-serif;
      font-size: 28px;
      font-weight: 800;
      color: #16a34a;
    }
    .adv-price-was {
      font-family: 'Inter', sans-serif;
      font-size: 16px;
      color: #9CA3AF;
      text-decoration: line-through;
    }
    /* Sidebar CTA */
    .adv-sidebar-cta {
      display: block;
      width: 100%;
      min-height: 48px;
      line-height: 48px;
      text-align: center;
      font-family: 'Inter', sans-serif;
      font-size: 16px;
      font-weight: 700;
      color: #fff;
      text-decoration: none;
      border-radius: 8px;
      background: #16a34a;
      box-shadow: 0 4px 14px rgba(0,194,73,0.3);
      transition: background 200ms ease, transform 0.15s ease;
      margin-bottom: 12px;
    }
    .adv-sidebar-cta:hover {
      background: #53A81E;
      transform: translateY(-1px);
    }
    /* Star rating in sidebar */
    .adv-sidebar-stars {
      display: flex;
      gap: 2px;
      margin-bottom: 4px;
    }
    .adv-sidebar-rating-text {
      font-family: 'Inter', sans-serif;
      font-size: 12px;
      color: #6B7280;
      margin-bottom: 8px;
    }
    /* Sidebar review snippet */
    .adv-sidebar-review {
      padding: 12px 0;
      border-top: 1px solid #E6E7EA;
    }
    .adv-sidebar-review + .adv-sidebar-review {
      border-top: 1px solid #E6E7EA;
    }
    .adv-review-author {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 6px;
    }
    .adv-review-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #E5E7EB;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Inter', sans-serif;
      font-size: 12px;
      font-weight: 700;
      color: #6B7280;
    }
    .adv-review-name {
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      font-weight: 600;
      color: #1B1B1B;
    }
    .adv-review-verified {
      font-size: 11px;
      color: #16a34a;
      font-weight: 500;
    }
    .adv-review-text {
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      color: #4B5563;
      line-height: 1.5;
    }
    /* Guarantee badge */
    .adv-sidebar-guarantee {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px;
      background: #FFFBef;
      border: 1px solid #FAB73C;
      border-radius: 8px;
      margin-top: 12px;
    }
    .adv-sidebar-guarantee-icon {
      font-size: 20px;
      flex-shrink: 0;
    }
    .adv-sidebar-guarantee-text {
      font-family: 'Inter', sans-serif;
      font-size: 12px;
      color: #92400E;
      line-height: 1.4;
      font-weight: 500;
    }
  ` : '';

  // Build sidebar HTML for advertorials
  // WHY: Sidebar images use i.pravatar.cc (free, no API key, deterministic by ID)
  //      Product image falls back to a professional SVG placeholder with bottle icon
  const sidebarHtml = isAdvertorial ? `
    <aside class="adv-sidebar">
      <div class="adv-sidebar-card">
        <div class="adv-sidebar-img">
          ${productImage
            ? `<img src="${escapeSimple(productImage)}" alt="${escapeSimple(productName)}">`
            : `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;">
                <defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#e8f5e9"/><stop offset="100%" style="stop-color:#c8e6c9"/></linearGradient></defs>
                <rect width="200" height="200" fill="url(#bg)" rx="8"/>
                <rect x="70" y="40" width="60" height="110" rx="8" fill="#2D6A4F" opacity="0.9"/>
                <rect x="75" y="45" width="50" height="30" rx="4" fill="#fff" opacity="0.3"/>
                <text x="100" y="68" font-size="10" fill="#fff" text-anchor="middle" font-family="Inter,sans-serif" font-weight="700">${escapeSimple(productName.split(' ').map(w=>w[0]).join(''))}</text>
                <rect x="80" y="85" width="40" height="3" rx="1.5" fill="#fff" opacity="0.5"/>
                <rect x="80" y="93" width="40" height="3" rx="1.5" fill="#fff" opacity="0.5"/>
                <rect x="80" y="101" width="30" height="3" rx="1.5" fill="#fff" opacity="0.5"/>
                <rect x="65" y="145" width="70" height="30" rx="6" fill="#16a34a"/>
                <text x="100" y="165" font-size="12" fill="#fff" text-anchor="middle" font-family="Inter,sans-serif" font-weight="700">SHOP NOW</text>
              </svg>`
          }
        </div>
        ${productPrice || productOriginalPrice ? `
          <div class="adv-price-row">
            ${productPrice ? `<span class="adv-price-now">${escapeSimple(productPrice)}</span>` : ''}
            ${productOriginalPrice ? `<span class="adv-price-was">${escapeSimple(productOriginalPrice)}</span>` : ''}
          </div>
        ` : ''}
        <a href="${escapeSimple(productUrl)}" class="adv-sidebar-cta">Claim Your Offer Now</a>
        <div class="adv-sidebar-stars">${generateStars(productRating)}</div>
        <div class="adv-sidebar-rating-text">${escapeSimple(productRatingCount)} Ratings</div>
        <div class="adv-sidebar-guarantee">
          <span class="adv-sidebar-guarantee-icon">&#128274;</span>
          <span class="adv-sidebar-guarantee-text">60-Day Money-Back Guarantee — Full refund, no questions asked</span>
        </div>
      </div>
      <!-- Sidebar reviews with real avatar photos -->
      <div class="adv-sidebar-card">
        ${generateSidebarReview('Sarah M.', 'Verified Purchase', 'I\'ve tried so many supplements, but this one actually works. My bloating is gone after just 2 weeks!', 1)}
        ${generateSidebarReview('James K.', 'Verified Purchase', 'Best gut health product I\'ve ever used. The difference is night and day. Highly recommend!', 12)}
        ${generateSidebarReview('Patricia L.', 'Verified Purchase', 'Was skeptical at first, but the results speak for themselves. My digestion has never been better.', 5)}
      </div>
    </aside>
  ` : '';

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
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    ${PRO_CSS}

    /* Container override for page type: ${pageType} */
    ${containerOverride}

    /* Advertorial 2-column layout */
    ${advertorialLayout}

    /* Palette: ${palette} */
    :root {
      --color-primary: #16a34a;
      --color-primary-hover: #22c55e;
      --color-secondary: #40916C;
      --color-bg: #FFFFFF;
      --color-bg-alt: #F5F5F5;
      --color-bg-warm: #FFFBef;
      --color-text: #303030;
      --color-text-dark: #1B1B1B;
      --color-text-body: #303030;
      --color-muted: #6B7280;
      --color-border: #E5E5E5;
      --color-success: #16a34a;
      --color-warning: #F5C74D;
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
      --font-heading: 'Open Sans', sans-serif;
      --font-body: 'Open Sans', sans-serif;
    }
  </style>
</head>
<body>
${isAdvertorial
  ? `<div class="adv-layout"><main class="adv-main">${normalizedHtml}</main>${sidebarHtml}</div>`
  : normalizedHtml
}
</body>
</html>`;
}

/** Generate a sidebar review card with real avatar image */
function generateSidebarReview(name: string, badge: string, text: string, avatarId: number): string {
  // WHY: i.pravatar.cc is free, no API key, deterministic (same ID = same face)
  //      img parameter selects a specific face, size=80 for retina on 40px display
  const avatarUrl = `https://i.pravatar.cc/80?img=${avatarId}`;
  return `
    <div class="adv-sidebar-review">
      <div class="adv-review-author">
        <img src="${avatarUrl}" alt="${escapeSimple(name)}" style="width:32px;height:32px;border-radius:50%;object-fit:cover;">
        <div>
          <div class="adv-review-name">${escapeSimple(name)}</div>
          <div class="adv-review-verified">&#10003; ${escapeSimple(badge)}</div>
        </div>
      </div>
      <div class="adv-review-text">${escapeSimple(text)}</div>
    </div>
  `;
}

/** Generate star rating with SVG stars (filled + empty) */
function generateStars(rating: number): string {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.3;
  let html = '';
  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      html += `<svg width="16" height="16" viewBox="0 0 24 24" fill="#F59E0B" xmlns="http://www.w3.org/2000/svg"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
    } else if (i === fullStars && hasHalf) {
      html += `<svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="half"><stop offset="50%" stop-color="#F59E0B"/><stop offset="50%" stop-color="#D1D5DB"/></linearGradient></defs><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="url(#half)"/></svg>`;
    } else {
      html += `<svg width="16" height="16" viewBox="0 0 24 24" fill="#D1D5DB" xmlns="http://www.w3.org/2000/svg"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
    }
  }
  return html;
}

function escapeSimple(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Re-export for convenience
export { blockRegistry } from '../design-system/blocks';
export { renderFullPage as renderPage };
