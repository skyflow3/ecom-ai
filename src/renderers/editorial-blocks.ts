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
  // WHY: Green brand color for editorial categories — matches winning advertorials
  const categoryColor = props.categoryColor ?? '#2D6A4F';

  // WHY: Logo left — 28px height matches SmoothSpire/rejuvera editorial headers
  const logoHtml = props.logoSrc
    ? `<img src="${escapeHtml(props.logoSrc)}" alt="${escapeHtml(props.siteName)}" style="height:28px;width:auto;object-fit:contain;">`
    : `<span style="font-family:'Open Sans',sans-serif;font-size:1.25rem;font-weight:700;color:#1B1B1B;">${escapeHtml(props.siteName)}</span>`;

  // WHY: "Trending in [Category]" badge with pulsing dot — SmoothSpire pattern
  const badgeHtml = props.categoryBadge
    ? `<div style="display:flex;align-items:center;gap:6px;">
        <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${categoryColor};animation:ec-pulse-dot 2s infinite;"></span>
        <span style="font-family:'Open Sans',sans-serif;font-size:13px;font-weight:600;color:${categoryColor};text-transform:uppercase;letter-spacing:0.05em;">${escapeHtml(props.categoryBadge)}</span>
      </div>`
    : '';

  const content = `
    <div style="display:flex;align-items:center;justify-content:space-between;width:100%;max-width:720px;margin:0 auto;padding:12px 0;">
      ${logoHtml}
      <div style="display:flex;align-items:center;gap:12px;">
        <span style="font-family:'Open Sans',sans-serif;font-size:11px;color:#9AA0AB;text-transform:uppercase;letter-spacing:0.08em;font-weight:600;">Advertorial</span>
        ${badgeHtml}
      </div>
    </div>
  `;

  // WHY: #f8f9fa bg with thin #CCC bottom border — matches news-site editorial headers
  const visClass = buildVisibilityClass(block.visibility);
  const responsiveStyles = buildResponsiveStyles(block.id, block.styles);

  const styleBlock = `<style>
    @keyframes ec-pulse-dot{0%,100%{opacity:1}50%{opacity:0.4}}
    [data-block-id="${block.id}"]{background:#f8f9fa;border-bottom:1px solid #CCC;}
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

  // WHY: Desktop-only breadcrumb — hidden on mobile per design system rules
  // AI can generate items as strings or objects — handle both gracefully
  const items = Array.isArray(props.items) ? props.items : [];
  const crumbs = items.map((item, i) => {
    const label = typeof item === 'string' ? item : (item?.label ?? item?.text ?? '');
    const isLast = i === items.length - 1;
    const style = isLast
      ? 'font-weight:600;color:#1B1B1B;'
      : 'color:#6B7280;';
    const sep = isLast ? '' : `<span style="margin:0 8px;color:#CCC;">${separator}</span>`;
    return `<span style="font-family:'Open Sans',sans-serif;font-size:13px;${style}">${escapeHtml(label)}</span>${sep}`;
  }).join('');

  const content = `<nav aria-label="Breadcrumb" style="padding:8px 0;">${crumbs}</nav>`;

  const visClass = buildVisibilityClass(block.visibility);
  const responsiveStyles = buildResponsiveStyles(block.id, block.styles);

  // Desktop only — hidden on mobile screens per design system
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

  // WHY: Real author avatar via i.pravatar.cc (free, deterministic).
  //      Fallback to colored initial if no name provided.
  //      avatarSrc from LLM takes priority, then generated avatar.
  const avatarHtml = props.avatarSrc
    ? `<img src="${escapeHtml(props.avatarSrc)}" alt="${escapeHtml(props.authorName)}" style="width:40px;height:40px;border-radius:50%;object-fit:cover;border:2px solid #E5E7EB;">`
    : `<img src="https://i.pravatar.cc/80?img=47" alt="${escapeHtml(props.authorName)}" style="width:40px;height:40px;border-radius:50%;object-fit:cover;border:2px solid #E5E7EB;">`;

  const credText = props.credentials ? `, ${props.credentials}` : '';
  const dateText = props.date ? ` | ${props.date}` : '';
  const readText = props.readTime ? ` | ${props.readTime}` : '';

  // WHY: #CCC border-bottom from editorial header pattern, 14px byline text
  const content = `
    <div style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid #CCC;margin-bottom:16px;">
      ${avatarHtml}
      <div>
        <div style="font-family:'Open Sans',sans-serif;font-size:14px;font-weight:600;color:#1B1B1B;">
          ${escapeHtml(props.authorName)}<span style="font-weight:400;color:#6B7280;">${escapeHtml(credText)}</span>
        </div>
        <div style="font-family:'Open Sans',sans-serif;font-size:12px;color:#6B7280;margin-top:2px;">
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

  // WHY: Urgency text in yellow/gold above CTA — matches mobile sticky bar pattern
  const urgencyHtml = props.urgencyText
    ? `<div style="font-family:'Open Sans',sans-serif;font-size:11px;color:#F59E0B;text-align:center;margin-bottom:4px;font-weight:600;">${escapeHtml(props.urgencyText)}</div>`
    : '';

  // WHY: Green gradient for primary, red gradient for urgency — matches winning sticky bars
  const btnBg = variant === 'urgency'
    ? 'background:linear-gradient(135deg,#dc2626 0%,#b91c1c 100%);'
    : 'background:linear-gradient(135deg,#16a34a 0%,#53A81E 100%);';

  const btnHtml = props.url
    ? `<a href="${escapeHtml(props.url)}" style="display:block;width:100%;min-height:48px;padding:10px 16px;line-height:1.3;text-align:center;font-family:'Open Sans',sans-serif;font-size:17px;font-weight:700;color:#fff;text-decoration:none;border-radius:8px;${btnBg}box-shadow:0 4px 14px rgba(0,0,0,0.3);">${escapeHtml(props.text)}</a>`
    : `<button style="display:block;width:100%;min-height:52px;font-family:'Open Sans',sans-serif;font-size:17px;font-weight:700;color:#fff;border:none;border-radius:8px;cursor:pointer;${btnBg}box-shadow:0 4px 14px rgba(0,0,0,0.3);">${escapeHtml(props.text)}</button>`;

  const content = `
    <div style="max-width:480px;margin:0 auto;">
      ${urgencyHtml}
      ${btnHtml}
    </div>
  `;

  const visClass = buildVisibilityClass(block.visibility);
  const responsiveStyles = buildResponsiveStyles(block.id, block.styles);

  // WHY: Fixed bottom on mobile with solid semi-transparent bg (no blur/gradient — winners use solid)
  const stickyStyle = `<style>
    [data-block-id="${block.id}"] {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 100;
      background: rgba(0,0,0,0.85);
      padding: 10px 16px;
      padding-bottom: max(10px, env(safe-area-inset-bottom));
    }
    @media (min-width: 768px) {
      [data-block-id="${block.id}"] {
        position: relative;
        background: transparent;
        padding: 16px;
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

  // WHY: Winners use ALL CAPS sans-serif bold headings (28px, weight 800).
  //      "highlight" style = yellow callout box (Drivse, Clarifion, SmoothSpire pattern)
  let content: string;
  if (style === 'highlight') {
    content = `<div style="background:#FEFBD9;border:2px solid #DBDB95;border-radius:10px;padding:16px 20px;display:flex;align-items:center;gap:12px;">
      <span style="font-family:'Open Sans',sans-serif;font-size:18px;font-weight:600;color:#1B1B1B;line-height:1.5;">${escapeHtml(props.text)}</span>
    </div>`;
  } else {
    const headingStyle = "font-family:'Open Sans',sans-serif;font-size:28px;font-weight:800;text-transform:uppercase;letter-spacing:0.5px;color:#1B1B1B;margin-bottom:16px;";
    content = `<h2 style="${headingStyle}">${escapeHtml(props.text)}</h2>`;
  }

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

  // WHY: Star rating in gold/amber (#EBBF20 from Shopify pattern, #F59E0B amber)
  const starsHtml = props.rating
    ? `<div style="color:#F59E0B;font-size:16px;letter-spacing:2px;margin-bottom:8px;">${'&#9733;'.repeat(Math.min(5, props.rating))}${'&#9734;'.repeat(5 - Math.min(5, props.rating))}</div>`
    : '';

  const ratingHtml = props.ratingCount
    ? `<div style="font-family:'Open Sans',sans-serif;font-size:13px;color:#6B7280;margin-bottom:12px;">${escapeHtml(props.ratingCount)}</div>`
    : '';

  const productHtml = props.productText
    ? `<div style="font-family:'Open Sans',sans-serif;font-size:15px;color:#1B1B1B;margin-bottom:16px;line-height:1.5;">${escapeHtml(props.productText)}</div>`
    : '';

  const authorHtml = props.authorName
    ? `<div style="font-family:'Open Sans',sans-serif;font-size:13px;color:#6B7280;font-style:italic;">— ${escapeHtml(props.authorName)}</div>`
    : '';

  // WHY: Green #16a34a CTA button with 8px radius — matches checkout CTA button pattern
  const btnHtml = props.url
    ? `<a href="${escapeHtml(props.url)}" style="display:block;width:100%;min-height:52px;line-height:52px;text-align:center;font-family:'Open Sans',sans-serif;font-size:17px;font-weight:700;color:#fff;text-decoration:none;border-radius:8px;background:#16a34a;box-shadow:0 4px 14px rgba(0,194,73,0.3);margin-top:12px;">${escapeHtml(props.ctaText)}</a>`
    : `<button style="display:block;width:100%;min-height:52px;font-family:'Open Sans',sans-serif;font-size:17px;font-weight:700;color:#fff;border:none;border-radius:8px;cursor:pointer;background:#16a34a;box-shadow:0 4px 14px rgba(0,194,73,0.3);margin-top:12px;">${escapeHtml(props.ctaText)}</button>`;

  // WHY: Card with subtle green border and light bg — matches mid-article callout pattern
  const content = `
    <div style="background:linear-gradient(135deg,rgba(0,194,73,0.05) 0%,rgba(0,194,73,0.02) 100%);border:2px solid #2D6A4F;border-radius:12px;padding:24px;text-align:center;">
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
