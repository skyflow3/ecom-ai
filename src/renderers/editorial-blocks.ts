/**
 * Purpose: Editorial-specific block renderers for advertorial/news-style pages.
 *          These blocks replicate the design patterns from winning HTML pages
 *          (SmoothSpire, Rejuvera, Vibriance advertorials).
 * Dependencies: blocks.ts (Block), html-helpers.ts (escapeHtml, wrapSection, etc.)
 * Related: index.ts (registration), basic-content.ts (body text)
 *
 * WHY: Advertorial pages look like NEWS ARTICLES, not landing pages.
 *      They need: header with logo, breadcrumb, byline, editorial body, sticky CTA.
 *      Standard e-commerce renderers (hero with CTA, product cards) look WRONG here.
 *
 * DESIGN PRINCIPLES (from SmoothSpire winner):
 *   - Header: logo + "Trending in [Category]" badge, gray background
 *   - Breadcrumb: "Home > Category > Product" (desktop only)
 *   - Byline: author avatar + name + credentials + date
 *   - Body: short paragraphs (2-3 lines), bold key phrases, section headings
 *   - Sticky CTA: fixed bottom bar on mobile, subtle on desktop
 *   - Max width: 720px for content (editorial narrow)
 */

import type { Block } from '../design-system/blocks';
import {
  escapeHtml,
  wrapSection,
  getProps,
  cn,
  buildResponsiveStyles,
  buildVisibilityClass,
} from './html-helpers';

// ─── Prop Interfaces ─────────────────────────────────────────────────────────

interface EditorialHeaderProps {
  /** Logo image URL */
  logoSrc?: string;
  /** Logo alt text / site name */
  siteName: string;
  /** Category badge text (e.g., "Trending in Health") */
  categoryBadge?: string;
  /** Category color (defaults to primary) */
  categoryColor?: string;
}

interface BreadcrumbProps {
  /** Breadcrumb items, e.g., ["Home", "Pain Relief", "Sciatica"] */
  items: string[];
  /** Separator character (default: ">") */
  separator?: string;
}

interface BylineProps {
  /** Author full name */
  authorName: string;
  /** Author credentials (e.g., "PT, MD") */
  credentials?: string;
  /** Author avatar image URL */
  avatarSrc?: string;
  /** Publication date (e.g., "Jul 15, 2025") */
  date?: string;
  /** Reading time (e.g., "8 min read") */
  readTime?: string;
}

interface StickyCtaProps {
  /** CTA button text */
  text: string;
  /** CTA destination URL */
  url?: string;
  /** Urgency text shown above button */
  urgencyText?: string;
  /** CTA variant style */
  variant?: 'primary' | 'urgency';
}

interface EditorialSectionHeadingProps {
  /** Section heading text */
  text: string;
  /** Visual style */
  style?: 'default' | 'underline' | 'highlight';
}

interface AuthorCtaProps {
  /** Author name */
  authorName?: string;
  /** CTA text */
  ctaText: string;
  /** CTA URL */
  url?: string;
  /** Product mention text */
  productText?: string;
  /** Star rating (1-5) */
  rating?: number;
  /** Rating count text (e.g., "3,791 Ratings") */
  ratingCount?: string;
}

// ─── 1. Editorial Header ──────────────────────────────────────────────────────

export function renderEditorialHeader(block: Block): string {
  const props = getProps<EditorialHeaderProps>(block);
  const categoryColor = props.categoryColor ?? 'var(--color-primary)';

  const logoHtml = props.logoSrc
    ? `<img src="${escapeHtml(props.logoSrc)}" alt="${escapeHtml(props.siteName)}" style="height:28px;width:auto;object-fit:contain;">`
    : `<span style="font-family:'DM Serif Display',serif;font-size:1.25rem;font-weight:700;color:var(--color-text);">${escapeHtml(props.siteName)}</span>`;

  const badgeHtml = props.categoryBadge
    ? `<div style="display:flex;align-items:center;gap:6px;">
        <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${categoryColor};animation:ec-pulse-dot 2s infinite;"></span>
        <span style="font-family:'Inter',sans-serif;font-size:0.8125rem;font-weight:600;color:${categoryColor};text-transform:uppercase;letter-spacing:0.05em;">${escapeHtml(props.categoryBadge)}</span>
      </div>`
    : '';

  const content = `
    <div style="display:flex;align-items:center;justify-content:space-between;width:100%;max-width:720px;margin:0 auto;padding:12px 0;">
      ${logoHtml}
      ${badgeHtml}
    </div>
  `;

  // Header has no container wrapping — it's full-width with bg
  const visClass = buildVisibilityClass(block.visibility);
  const responsiveStyles = buildResponsiveStyles(block.id, block.styles);

  const styleBlock = `<style>
    @keyframes ec-pulse-dot{0%,100%{opacity:1}50%{opacity:0.4}}
    [data-block-id="${block.id}"]{background:#f8f9fa;border-bottom:1px solid #e5e7eb;}
  </style>`;

  return `${styleBlock}${responsiveStyles}${wrapSection(content, {
    id: block.id,
    blockClass: cn('ec-editorial-header', visClass),
    container: false,
  })}`;
}

// ─── 2. Breadcrumb ────────────────────────────────────────────────────────────

export function renderBreadcrumb(block: Block): string {
  const props = getProps<BreadcrumbProps>(block);
  const separator = props.separator ?? '&rsaquo;';

  const crumbs = props.items.map((item, i) => {
    const isLast = i === props.items.length - 1;
    const style = isLast
      ? 'font-weight:600;color:var(--color-text);'
      : 'color:var(--color-muted);';
    const sep = isLast ? '' : `<span style="margin:0 8px;color:#d1d5db;">${separator}</span>`;
    return `<span style="font-family:'Inter',sans-serif;font-size:0.8125rem;${style}">${escapeHtml(item)}</span>${sep}`;
  }).join('');

  const content = `<nav aria-label="Breadcrumb" style="padding:8px 0;">${crumbs}</nav>`;

  const visClass = buildVisibilityClass(block.visibility);
  const responsiveStyles = buildResponsiveStyles(block.id, block.styles);

  // Desktop only on mobile — hidden on small screens
  const responsiveHide = `<style>
    [data-block-id="${block.id}"]{display:none;}
    @media(min-width:768px){[data-block-id="${block.id}"]{display:block;}}
  </style>`;

  return `${responsiveHide}${responsiveStyles}${wrapSection(content, {
    id: block.id,
    blockClass: cn('ec-breadcrumb', visClass),
  })}`;
}

// ─── 3. Byline ───────────────────────────────────────────────────────────────

export function renderByline(block: Block): string {
  const props = getProps<BylineProps>(block);

  const avatarHtml = props.avatarSrc
    ? `<img src="${escapeHtml(props.avatarSrc)}" alt="${escapeHtml(props.authorName)}" style="width:40px;height:40px;border-radius:50%;object-fit:cover;border:2px solid #e5e7eb;">`
    : `<div style="width:40px;height:40px;border-radius:50%;background:var(--color-primary);color:#fff;display:flex;align-items:center;justify-content:center;font-family:'Inter',sans-serif;font-weight:700;font-size:0.875rem;">${escapeHtml(props.authorName.charAt(0))}</div>`;

  const credText = props.credentials ? `, ${props.credentials}` : '';
  const dateText = props.date ? ` | ${props.date}` : '';
  const readText = props.readTime ? ` | ${props.readTime}` : '';

  const content = `
    <div style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid #e5e7eb;margin-bottom:16px;">
      ${avatarHtml}
      <div>
        <div style="font-family:'Inter',sans-serif;font-size:0.875rem;font-weight:600;color:var(--color-text);">
          ${escapeHtml(props.authorName)}<span style="font-weight:400;color:var(--color-muted);">${escapeHtml(credText)}</span>
        </div>
        <div style="font-family:'Inter',sans-serif;font-size:0.75rem;color:var(--color-muted);margin-top:2px;">
          <span style="color:#16a34a;font-weight:600;">&#10003; Verified Author</span>${escapeHtml(dateText)}${escapeHtml(readText)}
        </div>
      </div>
    </div>
  `;

  const visClass = buildVisibilityClass(block.visibility);
  const responsiveStyles = buildResponsiveStyles(block.id, block.styles);

  return `${responsiveStyles}${wrapSection(content, {
    id: block.id,
    blockClass: cn('ec-byline', visClass),
  })}`;
}

// ─── 4. Sticky CTA Bar ───────────────────────────────────────────────────────

export function renderStickyCta(block: Block): string {
  const props = getProps<StickyCtaProps>(block);
  const variant = props.variant ?? 'urgency';

  const urgencyHtml = props.urgencyText
    ? `<div style="font-family:'Inter',sans-serif;font-size:0.6875rem;color:#fbbf24;text-align:center;margin-bottom:4px;font-weight:600;">${escapeHtml(props.urgencyText)}</div>`
    : '';

  const btnBg = variant === 'urgency'
    ? 'background:linear-gradient(135deg,#dc2626 0%,#b91c1c 100%);'
    : 'background:linear-gradient(135deg,var(--color-primary) 0%,#1a5c3a 100%);';

  const btnHtml = props.url
    ? `<a href="${escapeHtml(props.url)}" style="display:block;width:100%;min-height:52px;line-height:52px;text-align:center;font-family:'Inter',sans-serif;font-size:1.0625rem;font-weight:700;color:#fff;text-decoration:none;border-radius:12px;${btnBg}box-shadow:0 4px 14px rgba(0,0,0,0.3);">${escapeHtml(props.text)}</a>`
    : `<button style="display:block;width:100%;min-height:52px;font-family:'Inter',sans-serif;font-size:1.0625rem;font-weight:700;color:#fff;border:none;border-radius:12px;cursor:pointer;${btnBg}box-shadow:0 4px 14px rgba(0,0,0,0.3);">${escapeHtml(props.text)}</button>`;

  const content = `
    <div style="max-width:480px;margin:0 auto;">
      ${urgencyHtml}
      ${btnHtml}
    </div>
  `;

  const visClass = buildVisibilityClass(block.visibility);
  const responsiveStyles = buildResponsiveStyles(block.id, block.styles);

  // Sticky positioning: fixed bottom on mobile, inline on desktop
  const stickyStyle = `<style>
    [data-block-id="${block.id}"] {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 9999;
      background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.85) 100%);
      padding: 10px 16px;
      padding-bottom: max(10px, env(safe-area-inset-bottom));
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    }
    /* Desktop: sticky becomes a normal inline CTA */
    @media (min-width: 768px) {
      [data-block-id="${block.id}"] {
        position: relative;
        background: transparent;
        padding: 16px;
        backdrop-filter: none;
        -webkit-backdrop-filter: none;
      }
    }
  </style>`;

  return `${stickyStyle}${responsiveStyles}${wrapSection(content, {
    id: block.id,
    blockClass: cn('ec-sticky-cta', visClass),
    container: true,
  })}`;
}

// ─── 5. Editorial Section Heading ────────────────────────────────────────────

export function renderEditorialSectionHeading(block: Block): string {
  const props = getProps<EditorialSectionHeadingProps>(block);
  const style = props.style ?? 'default';

  let headingStyle: string;
  switch (style) {
    case 'underline':
      headingStyle = "font-family:'DM Serif Display',serif;font-size:1.375rem;font-weight:700;color:var(--color-text);border-bottom:3px solid var(--color-primary);padding-bottom:8px;display:inline-block;";
      break;
    case 'highlight':
      headingStyle = "font-family:'DM Serif Display',serif;font-size:1.375rem;font-weight:700;color:var(--color-text);background:linear-gradient(to right,rgba(45,106,79,0.1),transparent);padding:8px 16px;border-left:4px solid var(--color-primary);";
      break;
    default:
      headingStyle = "font-family:'DM Serif Display',serif;font-size:1.375rem;font-weight:700;color:var(--color-text);";
  }

  const content = `<h2 style="${headingStyle}">${escapeHtml(props.text)}</h2>`;

  const visClass = buildVisibilityClass(block.visibility);
  const responsiveStyles = buildResponsiveStyles(block.id, block.styles);

  return `${responsiveStyles}${wrapSection(content, {
    id: block.id,
    blockClass: cn('ec-editorial-heading', visClass),
  })}`;
}

// ─── 6. Author CTA (mid-article callout) ─────────────────────────────────────

export function renderAuthorCta(block: Block): string {
  const props = getProps<AuthorCtaProps>(block);

  const starsHtml = props.rating
    ? `<div style="color:#f59e0b;font-size:1rem;letter-spacing:2px;margin-bottom:8px;">${'&#9733;'.repeat(Math.min(5, props.rating))}${'&#9734;'.repeat(5 - Math.min(5, props.rating))}</div>`
    : '';

  const ratingHtml = props.ratingCount
    ? `<div style="font-family:'Inter',sans-serif;font-size:0.8125rem;color:var(--color-muted);margin-bottom:12px;">${escapeHtml(props.ratingCount)}</div>`
    : '';

  const productHtml = props.productText
    ? `<div style="font-family:'Inter',sans-serif;font-size:0.9375rem;color:var(--color-text);margin-bottom:16px;line-height:1.5;">${escapeHtml(props.productText)}</div>`
    : '';

  const authorHtml = props.authorName
    ? `<div style="font-family:'Inter',sans-serif;font-size:0.8125rem;color:var(--color-muted);font-style:italic;">— ${escapeHtml(props.authorName)}</div>`
    : '';

  const btnHtml = props.url
    ? `<a href="${escapeHtml(props.url)}" style="display:block;width:100%;min-height:52px;line-height:52px;text-align:center;font-family:'Inter',sans-serif;font-size:1.0625rem;font-weight:700;color:#fff;text-decoration:none;border-radius:12px;background:linear-gradient(135deg,var(--color-primary) 0%,#1a5c3a 100%);box-shadow:0 4px 14px rgba(45,106,79,0.3);margin-top:12px;">${escapeHtml(props.ctaText)}</a>`
    : `<button style="display:block;width:100%;min-height:52px;font-family:'Inter',sans-serif;font-size:1.0625rem;font-weight:700;color:#fff;border:none;border-radius:12px;cursor:pointer;background:linear-gradient(135deg,var(--color-primary) 0%,#1a5c3a 100%);box-shadow:0 4px 14px rgba(45,106,79,0.3);margin-top:12px;">${escapeHtml(props.ctaText)}</button>`;

  const content = `
    <div style="background:linear-gradient(135deg,rgba(45,106,79,0.05) 0%,rgba(45,106,79,0.02) 100%);border:2px solid var(--color-primary);border-radius:16px;padding:24px;text-align:center;">
      ${starsHtml}
      ${ratingHtml}
      ${productHtml}
      ${btnHtml}
      ${authorHtml}
    </div>
  `;

  const visClass = buildVisibilityClass(block.visibility);
  const responsiveStyles = buildResponsiveStyles(block.id, block.styles);

  return `${responsiveStyles}${wrapSection(content, {
    id: block.id,
    blockClass: cn('ec-author-cta', visClass),
  })}`;
}
