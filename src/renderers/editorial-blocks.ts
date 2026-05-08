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
    : `<span style="font-family:'DM Serif Display',serif;font-size:1.25rem;font-weight:700;color:#1B1B1B;">${escapeHtml(props.siteName)}</span>`;

  // WHY: "Trending in [Category]" badge with pulsing dot — SmoothSpire pattern
  const badgeHtml = props.categoryBadge
    ? `<div style="display:flex;align-items:center;gap:6px;">
        <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${categoryColor};animation:ec-pulse-dot 2s infinite;"></span>
        <span style="font-family:'Inter',sans-serif;font-size:13px;font-weight:600;color:${categoryColor};text-transform:uppercase;letter-spacing:0.05em;">${escapeHtml(props.categoryBadge)}</span>
      </div>`
    : '';

  const content = `
    <div style="display:flex;align-items:center;justify-content:space-between;width:100%;max-width:720px;margin:0 auto;padding:12px 0;">
      ${logoHtml}
      ${badgeHtml}
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
  const crumbs = props.items.map((item, i) => {
    const isLast = i === props.items.length - 1;
    const style = isLast
      ? 'font-weight:600;color:#1B1B1B;'
      : 'color:#6B7280;';
    const sep = isLast ? '' : `<span style="margin:0 8px;color:#CCC;">${separator}</span>`;
    return `<span style="font-family:'Inter',sans-serif;font-size:13px;${style}">${escapeHtml(item)}</span>${sep}`;
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
        <div style="font-family:'Inter',sans-serif;font-size:14px;font-weight:600;color:#1B1B1B;">
          ${escapeHtml(props.authorName)}<span style="font-weight:400;color:#6B7280;">${escapeHtml(credText)}</span>
        </div>
        <div style="font-family:'Inter',sans-serif;font-size:12px;color:#6B7280;margin-top:2px;">
          <span style="color:#00c249;font-weight:600;">&#10003; Verified Author</span>${escapeHtml(dateText)}${escapeHtml(readText)}
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
    ? `<div style="font-family:'Inter',sans-serif;font-size:11px;color:#F59E0B;text-align:center;margin-bottom:4px;font-weight:600;">${escapeHtml(props.urgencyText)}</div>`
    : '';

  // WHY: Green gradient for primary, red gradient for urgency — matches winning sticky bars
  const btnBg = variant === 'urgency'
    ? 'background:linear-gradient(135deg,#dc2626 0%,#b91c1c 100%);'
    : 'background:linear-gradient(135deg,#00c249 0%,#53A81E 100%);';

  const btnHtml = props.url
    ? `<a href="${escapeHtml(props.url)}" style="display:block;width:100%;min-height:52px;line-height:52px;text-align:center;font-family:'Inter',sans-serif;font-size:17px;font-weight:700;color:#fff;text-decoration:none;border-radius:8px;${btnBg}box-shadow:0 4px 14px rgba(0,0,0,0.3);">${escapeHtml(props.text)}</a>`
    : `<button style="display:block;width:100%;min-height:52px;font-family:'Inter',sans-serif;font-size:17px;font-weight:700;color:#fff;border:none;border-radius:8px;cursor:pointer;${btnBg}box-shadow:0 4px 14px rgba(0,0,0,0.3);">${escapeHtml(props.text)}</button>`;

  const content = `
    <div style="max-width:480px;margin:0 auto;">
      ${urgencyHtml}
      ${btnHtml}
    </div>
  `;

  const visClass = buildVisibilityClass(block.visibility);
  const responsiveStyles = buildResponsiveStyles(block.id, block.styles);

  // WHY: Fixed bottom on mobile with dark semi-transparent bg + blur — matches NAV-05 pattern
  //      z-index 100 from winning pages, safe-area-inset for iOS notch
  //      On desktop: becomes inline CTA (no sticky)
  const stickyStyle = `<style>
    [data-block-id="${block.id}"] {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 100;
      background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.85) 100%);
      padding: 10px 16px;
      padding-bottom: max(10px, env(safe-area-inset-bottom));
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    }
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

  // WHY: Section headings from editorial winners — serif font, optional left border or underline accent
  //      Default style uses DM Serif Display at 22px (matches --text-h3 mobile)
  let headingStyle: string;
  switch (style) {
    case 'underline':
      headingStyle = "font-family:'DM Serif Display',serif;font-size:22px;font-weight:700;color:#1B1B1B;border-bottom:3px solid #2D6A4F;padding-bottom:8px;display:inline-block;";
      break;
    case 'highlight':
      // WHY: Left border accent with light green bg — matches SmoothSpire editorial section pattern
      headingStyle = "font-family:'DM Serif Display',serif;font-size:22px;font-weight:700;color:#1B1B1B;background:linear-gradient(to right,rgba(45,106,79,0.08),transparent);padding:8px 16px;border-left:4px solid #2D6A4F;";
      break;
    default:
      headingStyle = "font-family:'DM Serif Display',serif;font-size:22px;font-weight:700;color:#1B1B1B;";
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

  // WHY: Star rating in gold/amber (#EBBF20 from Shopify pattern, #F59E0B amber)
  const starsHtml = props.rating
    ? `<div style="color:#F59E0B;font-size:16px;letter-spacing:2px;margin-bottom:8px;">${'&#9733;'.repeat(Math.min(5, props.rating))}${'&#9734;'.repeat(5 - Math.min(5, props.rating))}</div>`
    : '';

  const ratingHtml = props.ratingCount
    ? `<div style="font-family:'Inter',sans-serif;font-size:13px;color:#6B7280;margin-bottom:12px;">${escapeHtml(props.ratingCount)}</div>`
    : '';

  const productHtml = props.productText
    ? `<div style="font-family:'Inter',sans-serif;font-size:15px;color:#1B1B1B;margin-bottom:16px;line-height:1.5;">${escapeHtml(props.productText)}</div>`
    : '';

  const authorHtml = props.authorName
    ? `<div style="font-family:'Inter',sans-serif;font-size:13px;color:#6B7280;font-style:italic;">— ${escapeHtml(props.authorName)}</div>`
    : '';

  // WHY: Green #00c249 CTA button with 8px radius — matches checkout CTA button pattern
  const btnHtml = props.url
    ? `<a href="${escapeHtml(props.url)}" style="display:block;width:100%;min-height:52px;line-height:52px;text-align:center;font-family:'Inter',sans-serif;font-size:17px;font-weight:700;color:#fff;text-decoration:none;border-radius:8px;background:#00c249;box-shadow:0 4px 14px rgba(0,194,73,0.3);margin-top:12px;">${escapeHtml(props.ctaText)}</a>`
    : `<button style="display:block;width:100%;min-height:52px;font-family:'Inter',sans-serif;font-size:17px;font-weight:700;color:#fff;border:none;border-radius:8px;cursor:pointer;background:#00c249;box-shadow:0 4px 14px rgba(0,194,73,0.3);margin-top:12px;">${escapeHtml(props.ctaText)}</button>`;

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
