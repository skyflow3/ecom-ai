/**
 * Purpose: Block renderers for basic content types (hero, heading, text, media, lists).
 *          Each renderer is a pure function (block: Block) => string returning HTML.
 *          Registration is done in index.ts — this file only exports render functions.
 * Dependencies: blocks.ts (Block), html-helpers.ts (escapeHtml, wrapSection, getProps, cn, buildResponsiveStyles, buildVisibilityClass)
 * Related: renderers/index.ts (registration), design-system/mobile-first.css (styles)
 *
 * WHY: Separating render logic from registration keeps each file under 300 LOC
 *      and makes renderers independently testable.
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

interface HeroProps {
  headline: string;
  subheadline?: string;
  backgroundImage?: string;
  ctaText: string;
  ctaUrl?: string;
  alignment?: 'left' | 'center';
}

interface HeadingProps {
  text: string;
  level?: 'hero' | 'section' | 'card';
  alignment?: 'left' | 'center';
}

interface SubheadlineProps {
  content?: string;
  text?: string;
  size?: 'base' | 'sm';
}

interface BodyTextProps {
  content: string;
  size?: 'base' | 'sm';
}

interface ImageProps {
  src: string;
  alt: string;
  aspectRatio?: '4:5' | '1:1' | '16:9' | '21:9';
  caption?: string;
}

interface VideoProps {
  src: string;
  poster?: string;
  autoplay?: boolean;
  controls?: boolean;
}

interface ButtonProps {
  text: string;
  url?: string;
  variant?: 'primary' | 'secondary' | 'urgency';
  fullWidth?: boolean;
}

interface CtaProps {
  text: string;
  url?: string;
  variant?: 'primary' | 'secondary' | 'urgency';
  fullWidth?: boolean;
  conversionEvent?: string;
}

interface BenefitsListProps {
  benefits: Array<{
    icon?: string;
    title: string;
    description?: string;
  }>;
  layout?: 'list' | 'grid';
}

interface FeaturesGridProps {
  features: Array<{
    icon?: string;
    title: string;
    description?: string;
  }>;
  columns?: number;
}

interface ComparisonChartProps {
  title?: string;
  rows: Array<{
    feature: string;
    us: string;
    competitor: string;
  }>;
}

interface FaqProps {
  items: Array<{
    question: string;
    answer: string;
  }>;
}

interface BeforeAfterProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}

interface IconListProps {
  items: Array<{
    icon: string;
    text: string;
  }>;
}

interface ScrollingMarqueeProps {
  text: string;
  speed?: 'slow' | 'normal' | 'fast';
  backgroundColor?: string;
}

interface ProgressBarProps {
  steps: Array<{
    label: string;
    completed?: boolean;
  }>;
}

// ─── Aspect Ratio Map ────────────────────────────────────────────────────────

const ASPECT_RATIO_PADDING: Record<string, string> = {
  '4:5': '125%',
  '1:1': '100%',
  '16:9': '56.25%',
  '21:9': '42.86%',
};

// ─── Variant Class Map ───────────────────────────────────────────────────────

const BUTTON_VARIANT_CLASS: Record<string, string> = {
  primary: 'ec-btn-primary',
  secondary: 'ec-btn-secondary',
  urgency: 'ec-btn-urgency',
};

// ─── Marquee Speed Map ───────────────────────────────────────────────────────

const MARQUEE_DURATION: Record<string, string> = {
  slow: '20s',
  normal: '10s',
  fast: '5s',
};

// ─── Helper: Build shared block wrapper ──────────────────────────────────────

/**
 * Wraps content with responsive styles + visibility + section wrapper.
 * Every renderer uses this to ensure consistent structure.
 */
function renderBlock(
  block: Block,
  blockClass: string,
  content: string,
  extraOpts?: { container?: boolean; backgroundColor?: string }
): string {
  const visClass = buildVisibilityClass(block.visibility);
  const responsiveStyles = buildResponsiveStyles(block.id, block.styles);
  const sectionContent = wrapSection(content, {
    id: block.id,
    blockClass: cn(blockClass, visClass),
    extraClass: visClass || undefined,
    backgroundColor: extraOpts?.backgroundColor,
    container: extraOpts?.container ?? true,
    analyticsId: block.analyticsId,
    abTestId: block.metadata?.abTestId,
  });
  return responsiveStyles + sectionContent;
}

// ─── 1. Hero ─────────────────────────────────────────────────────────────────

/**
 * Render hero block. For advertorial pages, the hero is EDITORIAL style:
 * large headline + subheadline + optional image. NO CTA button in hero.
 *
 * WHY: Real advertorials (SmoothSpire, Rejuvera) look like news articles.
 *      The hero is the article headline, not a landing page with CTA.
 *      The CTA belongs in sticky-cta blocks or mid-article callouts.
 *
 * For non-advertorial pages (product-page, landing-page), the hero CAN have a CTA.
 */
export function renderHero(block: Block): string {
  const props = getProps<HeroProps>(block);
  const alignment = props.alignment ?? 'left';

  // Check if this is an editorial-style page (no CTA in hero)
  // WHY: The block metadata or presence of editorial blocks determines this.
  //      We detect it by checking if ctaText exists but there's no explicit CTA URL
  //      In practice, the block-composer handles this via composition rules.
  const isEditorial = !props.ctaUrl && !props.backgroundImage;

  // Background image with overlay gradient
  const bgStyle = props.backgroundImage
    ? `background-image:linear-gradient(rgba(0,0,0,0.45),rgba(0,0,0,0.45)),url('${escapeHtml(props.backgroundImage)}');background-size:cover;background-position:center;`
    : '';

  const textColor = props.backgroundImage ? 'color:#fff;' : '';

  const subheadlineHtml = props.subheadline
    ? `<p class="ec-hero-subheadline" style="font-family:'Inter',sans-serif;font-size:1.125rem;line-height:1.5;color:${props.backgroundImage ? '#e5e5e5' : '#4B5563'};margin-top:12px;">${escapeHtml(props.subheadline)}</p>`
    : '';

  // For editorial: NO CTA button in hero. For commerce: show CTA.
  const ctaHtml = (!isEditorial && props.ctaText)
    ? props.ctaUrl
      ? `<a href="${escapeHtml(props.ctaUrl)}" class="ec-btn ec-btn-primary ec-hero-cta" style="display:inline-block;margin-top:20px;min-height:52px;line-height:52px;padding:0 24px;font-size:1.125rem;font-weight:700;border-radius:12px;text-decoration:none;">${escapeHtml(props.ctaText)}</a>`
      : `<button class="ec-btn ec-btn-primary ec-hero-cta" style="margin-top:20px;min-height:52px;padding:0 24px;font-size:1.125rem;font-weight:700;border-radius:12px;border:none;cursor:pointer;">${escapeHtml(props.ctaText)}</button>`
    : '';

  // WHY: Editorial hero = large serif headline matching winning advertorial pattern
  //      28px mobile / 40px desktop for editorial (clamp), 36px desktop for commerce
  //      Weight 800, DM Serif Display font -- matches --text-h1 token from design system
  const headlineFont = isEditorial
    ? "font-family:'DM Serif Display',serif;font-size:clamp(1.75rem,5vw,2.5rem);font-weight:800;line-height:1.15;color:#1B1B1B;"
    : "font-family:'DM Serif Display',serif;font-size:clamp(1.875rem,5vw,2.25rem);font-weight:800;line-height:1.2;";

  const content = `
    <div class="ec-hero-content" style="text-align:${alignment};${textColor}">
      <h1 class="ec-hero-headline" style="${headlineFont}">${escapeHtml(props.headline)}</h1>
      ${subheadlineHtml}
      ${ctaHtml}
    </div>`;

  const responsiveStyles = buildResponsiveStyles(block.id, block.styles);
  const visClass = buildVisibilityClass(block.visibility);

  const sectionHtml = wrapSection(content, {
    id: block.id,
    blockClass: cn('ec-hero', visClass),
    backgroundColor: undefined,
    container: true,
    analyticsId: block.analyticsId,
    abTestId: block.metadata?.abTestId,
  });

  const finalHtml = props.backgroundImage
    ? sectionHtml.replace(
        'class="ec-section',
        `style="${bgStyle}" class="ec-section`
      )
    : sectionHtml;

  return responsiveStyles + finalHtml;
}

// ─── 2. Heading ──────────────────────────────────────────────────────────────

export function renderHeading(block: Block): string {
  const props = getProps<HeadingProps>(block);
  const level = props.level ?? 'section';
  const alignment = props.alignment ?? 'left';

  // WHY: Heading sizes from design system typography tokens:
  //      hero: 36px desktop / 24px mobile (clamp), weight 800
  //      section: 24px, card: 20px
  const tagMap: Record<string, string> = { hero: 'h1', section: 'h2', card: 'h3' };
  const sizeMap: Record<string, string> = {
    hero: 'font-size:clamp(1.5rem,5vw,2.25rem)',
    section: 'font-size:24px',
    card: 'font-size:20px',
  };

  const tag = tagMap[level] ?? 'h2';
  const size = sizeMap[level] ?? 'font-size:24px';
  const escapedText = escapeHtml(props.text);

  const content = `<${tag} class="ec-heading ec-heading-${level}" style="font-family:'DM Serif Display',serif;${size};font-weight:700;line-height:1.2;margin:0;text-align:${alignment};color:#1B1B1B;">${escapedText}</${tag}>`;

  return renderBlock(block, 'ec-heading-block', content);
}

// ─── 3. Subheadline ──────────────────────────────────────────────────────────

export function renderSubheadline(block: Block): string {
  // Subheadline uses body-text pattern — supports both 'content' and 'text' prop names
  const rawProps = getProps<SubheadlineProps>(block);
  const text = rawProps.content ?? rawProps.text ?? '';

  // WHY: Subheadline = 18px muted text, matching --text-body secondary style
  const escapedText = escapeHtml(text);
  const content = `<p class="ec-subheadline" style="font-family:'Inter',sans-serif;font-size:18px;line-height:1.5;color:#6B7280;margin:0;">${escapedText}</p>`;

  return renderBlock(block, 'ec-subheadline-block', content);
}

// ─── 4. Body Text ────────────────────────────────────────────────────────────

/**
 * Render body text with PROPER paragraph splitting.
 *
 * WHY: Real advertorials have many short paragraphs (2-3 lines each).
 *      The content comes as a single string with \n\n separators.
 *      We MUST split on \n\n to create individual <p> tags.
 *      Also supports **bold** and *italic* markdown-like syntax.
 */
export function renderBodyText(block: Block): string {
  const props = getProps<BodyTextProps>(block);
  // WHY: Body text from design system — 18px base, 26px line-height (1.7 ratio)
  //      Matches --text-body token (16-20px, 400 weight, 24-28px line-height)
  const size = props.size ?? 'base';
  const fontSize = size === 'sm' ? '14px' : '18px';
  const lineHeight = size === 'sm' ? '1.5' : '1.7';

  // Split into paragraphs on double newline
  const paragraphs = props.content
    .split(/\n\n+/)
    .filter(p => p.trim().length > 0);

  const paragraphsHtml = paragraphs.map(para => {
    // Convert inline formatting: **bold** → <strong>, *italic* → <em>
    let formatted = escapeHtml(para.trim());

    // Bold: **text** → <strong>text</strong>
    formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    // Italic: *text* → <em>text</em> (but not inside <strong>)
    formatted = formatted.replace(/(?<!<strong>)\*(.+?)\*(?!<\/strong>)/g, '<em>$1</em>');

    // Single newlines within a paragraph become <br>
    formatted = formatted.replace(/\n/g, '<br>');

    return `<p style="font-family:'Inter',sans-serif;font-size:${fontSize};line-height:${lineHeight};color:#02122E;margin-bottom:1em;">${formatted}</p>`;
  }).join('\n');

  return renderBlock(block, 'ec-body-text', paragraphsHtml);
}

// ─── 5. Image ────────────────────────────────────────────────────────────────

export function renderImage(block: Block): string {
  const props = getProps<ImageProps>(block);

  const useRatio = props.aspectRatio && ASPECT_RATIO_PADDING[props.aspectRatio];
  const paddingTop = useRatio ? ASPECT_RATIO_PADDING[props.aspectRatio!] : undefined;

  // Wrapper for aspect ratio padding hack
  const wrapperStyle = paddingTop
    ? `position:relative;padding-top:${paddingTop};overflow:hidden;`
    : '';

  const imgStyle = paddingTop
    ? 'position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;'
    : 'display:block;width:100%;height:auto;';

  const imgTag = `<img src="${escapeHtml(props.src)}" alt="${escapeHtml(props.alt)}" loading="lazy" decoding="async" style="${imgStyle}">`;

  const innerContent = paddingTop
    ? `<div style="${wrapperStyle}">${imgTag}</div>`
    : imgTag;

  const captionHtml = props.caption
    ? `<figcaption class="ec-image-caption" style="font-size:0.875rem;color:var(--color-muted);margin-top:8px;text-align:center;">${escapeHtml(props.caption)}</figcaption>`
    : '';

  const content = `<figure class="ec-image" style="margin:0;">${innerContent}${captionHtml}</figure>`;

  return renderBlock(block, 'ec-image-block', content);
}

// ─── 6. Video ────────────────────────────────────────────────────────────────

export function renderVideo(block: Block): string {
  const props = getProps<VideoProps>(block);
  const autoplay = props.autoplay ?? false;
  const controls = props.controls ?? true;

  const attrs: string[] = [
    `src="${escapeHtml(props.src)}"`,
    'style="display:block;width:100%;height:auto;border-radius:8px;"',
    'playsinline',
  ];

  if (autoplay) {
    attrs.push('muted', 'autoplay');
  }
  if (controls) {
    attrs.push('controls');
  }
  if (props.poster) {
    attrs.push(`poster="${escapeHtml(props.poster)}"`);
  }

  const content = `<video ${attrs.join(' ')}></video>`;
  return renderBlock(block, 'ec-video-block', content);
}

// ─── 7. Button ───────────────────────────────────────────────────────────────

export function renderButton(block: Block): string {
  const props = getProps<ButtonProps>(block);
  const variant = props.variant ?? 'primary';
  const variantClass = BUTTON_VARIANT_CLASS[variant] ?? 'ec-btn-primary';
  const fullWidthStyle = props.fullWidth ? 'width:100%;' : '';
  const escapedText = escapeHtml(props.text);

  // WHY: Button variants from winning DTC pages:
  //      Primary: green #00C249, 8px radius (matches checkout CTA)
  //      Urgency: red #dc2626 with pulse animation
  //      Secondary: outline with green border
  const variantStyleMap: Record<string, string> = {
    primary: 'background:#00c249;color:#fff;box-shadow:0 2px 4px 2px rgba(0,0,0,0.05);',
    urgency: 'background:#dc2626;color:#fff;box-shadow:0 4px 14px rgba(220,38,38,0.4);',
    secondary: 'background:transparent;color:#2D6A4F;border:2px solid #2D6A4F;',
  };

  const variantStyle = variantStyleMap[variant] ?? variantStyleMap['primary'];

  const baseBtnStyle = [
    'display:inline-block',
    'min-height:52px',
    'line-height:52px',
    'padding:0 24px',
    'font-size:18px',
    'font-weight:700',
    'font-family:Inter,-apple-system,sans-serif',
    'border-radius:8px',
    'text-decoration:none',
    'text-align:center',
    'cursor:pointer',
    'border:none',
    'box-sizing:border-box',
    fullWidthStyle,
    variantStyle,
    'transition:transform 0.15s ease,box-shadow 0.15s ease,background-color 200ms ease-in-out;',
  ].filter(Boolean).join(';');

  const html = props.url
    ? `<a href="${escapeHtml(props.url)}" class="ec-btn ${variantClass}" style="${baseBtnStyle}">${escapedText}</a>`
    : `<button class="ec-btn ${variantClass}" style="${baseBtnStyle}">${escapedText}</button>`;

  const content = `<div style="text-align:center;">${html}</div>`;
  return renderBlock(block, 'ec-button-block', content);
}

// ─── 8. CTA ──────────────────────────────────────────────────────────────────

export function renderCta(block: Block): string {
  const props = getProps<CtaProps>(block);
  const variant = props.variant ?? 'primary';
  const variantClass = BUTTON_VARIANT_CLASS[variant] ?? 'ec-btn-primary';
  const fullWidthStyle = props.fullWidth ? 'width:100%;' : '';
  const escapedText = escapeHtml(props.text);

  const conversionAttr = props.conversionEvent
    ? ` data-conversion-event="${escapeHtml(props.conversionEvent)}"`
    : '';

  const ariaLabel = ` aria-label="${escapedText}"`;

  // WHY: Same variant styles as renderButton for consistency
  const variantStyleMap: Record<string, string> = {
    primary: 'background:#00c249;color:#fff;box-shadow:0 2px 4px 2px rgba(0,0,0,0.05);',
    urgency: 'background:#dc2626;color:#fff;box-shadow:0 4px 14px rgba(220,38,38,0.4);',
    secondary: 'background:transparent;color:#2D6A4F;border:2px solid #2D6A4F;',
  };

  const variantStyle = variantStyleMap[variant] ?? variantStyleMap['primary'];

  const baseBtnStyle = [
    'display:inline-block',
    'min-height:52px',
    'line-height:52px',
    'padding:0 24px',
    'font-size:18px',
    'font-weight:700',
    'font-family:Inter,-apple-system,sans-serif',
    'border-radius:8px',
    'text-decoration:none',
    'text-align:center',
    'cursor:pointer',
    'border:none',
    'box-sizing:border-box',
    fullWidthStyle,
    variantStyle,
    'transition:transform 0.15s ease,box-shadow 0.15s ease,background-color 200ms ease-in-out;',
  ].filter(Boolean).join(';');

  const btnHtml = props.url
    ? `<a href="${escapeHtml(props.url)}" class="ec-btn ${variantClass}" style="${baseBtnStyle}"${ariaLabel}>${escapedText}</a>`
    : `<button class="ec-btn ${variantClass}" style="${baseBtnStyle}"${ariaLabel}>${escapedText}</button>`;

  const content = `<div class="ec-cta-container"${conversionAttr}>${btnHtml}</div>`;
  return renderBlock(block, 'ec-cta-block', content);
}

// ─── 9. Benefits List ────────────────────────────────────────────────────────

export function renderBenefitsList(block: Block): string {
  const props = getProps<BenefitsListProps>(block);
  const layout = props.layout ?? 'list';
  const isGrid = layout === 'grid';

  const listStyle = isGrid
    ? 'display:grid;grid-template-columns:1fr;gap:12px;list-style:none;padding:0;margin:0;'
    : 'list-style:none;padding:0;margin:0;';

  const itemsHtml = props.benefits.map((benefit) => {
    const iconHtml = benefit.icon
      ? `<span class="ec-benefit-icon" style="font-size:1.25rem;margin-right:8px;flex-shrink:0;">${escapeHtml(benefit.icon)}</span>`
      : '';
    const titleHtml = `<strong style="color:var(--color-text);">${escapeHtml(benefit.title)}</strong>`;
    const descHtml = benefit.description
      ? `<p style="margin:4px 0 0;font-size:0.9375rem;color:var(--color-muted);line-height:1.4;">${escapeHtml(benefit.description)}</p>`
      : '';

    return `<li class="ec-benefit-item" style="display:flex;align-items:flex-start;gap:4px;">
      ${iconHtml}
      <div>${titleHtml}${descHtml}</div>
    </li>`;
  }).join('');

  const content = `<ul class="ec-benefits" style="${listStyle}">${itemsHtml}</ul>`;

  // Add responsive grid breakpoint via inline style block
  const gridStyle = isGrid
    ? `<style>@media(min-width:768px){[data-block-id="${block.id}"] .ec-benefits{grid-template-columns:1fr 1fr;}}</style>`
    : '';

  return gridStyle + renderBlock(block, 'ec-benefits-block', content);
}

// ─── 10. Features Grid ───────────────────────────────────────────────────────

export function renderFeaturesGrid(block: Block): string {
  const props = getProps<FeaturesGridProps>(block);
  const columns = props.columns ?? 2;
  // Mobile-first: always 1 column on mobile, N columns on tablet+
  const gridCols = `repeat(${columns}, 1fr)`;

  const itemsHtml = props.features.map((feature) => {
    const iconHtml = feature.icon
      ? `<div class="ec-feature-icon" style="font-size:1.5rem;margin-bottom:8px;">${escapeHtml(feature.icon)}</div>`
      : '';
    const titleHtml = `<h3 style="font-size:1rem;font-weight:600;margin:0 0 4px;color:var(--color-text);font-family:'Inter',sans-serif;">${escapeHtml(feature.title)}</h3>`;
    const descHtml = feature.description
      ? `<p style="margin:0;font-size:0.875rem;color:var(--color-muted);line-height:1.5;">${escapeHtml(feature.description)}</p>`
      : '';

    return `<div class="ec-feature-item" style="text-align:center;padding:12px;">
      ${iconHtml}${titleHtml}${descHtml}
    </div>`;
  }).join('');

  const content = `<div class="ec-features-grid" style="display:grid;grid-template-columns:1fr;gap:16px;">${itemsHtml}</div>`;

  // Responsive: switch to multi-column on tablet+
  const responsiveGrid = `<style>@media(min-width:768px){[data-block-id="${block.id}"] .ec-features-grid{grid-template-columns:${gridCols};}}</style>`;

  return responsiveGrid + renderBlock(block, 'ec-features-grid-block', content);
}

// ─── 11. Comparison Chart ────────────────────────────────────────────────────

export function renderComparisonChart(block: Block): string {
  const props = getProps<ComparisonChartProps>(block);

  const titleHtml = props.title
    ? `<h3 style="font-family:'DM Serif Display',serif;font-size:1.25rem;margin:0 0 16px;color:var(--color-text);text-align:center;">${escapeHtml(props.title)}</h3>`
    : '';

  const tableStyle = [
    'width:100%',
    'border-collapse:collapse',
    'font-size:0.9375rem',
    'font-family:Inter,-apple-system,sans-serif',
  ].join(';');

  const thStyle = [
    'padding:12px 8px',
    'text-align:left',
    'font-weight:600',
    'border-bottom:2px solid var(--color-muted)',
    'color:var(--color-text)',
    'font-size:0.875rem',
  ].join(';');

  const thUsStyle = thStyle + ';color:var(--color-primary);';

  const tdStyle = [
    'padding:10px 8px',
    'border-bottom:1px solid #e5e7eb',
    'color:var(--color-text)',
  ].join(';');

  const tdUsStyle = tdStyle + ';background-color:rgba(0,173,33,0.06);font-weight:500;';

  const rowsHtml = props.rows.map((row) => {
    // Check if "us" value looks like a positive (checkmark/yes/true)
    const usLower = row.us.toLowerCase().trim();
    const isCheck = ['yes', 'true', '1', 'check', '✓', '&#10003;'].includes(usLower);
    const usDisplay = isCheck
      ? '<span style="color:#00AD21;font-size:1.25rem;">&#10003;</span>'
      : escapeHtml(row.us);

    // Check if "competitor" value looks negative
    const compLower = row.competitor.toLowerCase().trim();
    const isCross = ['no', 'false', '0', 'x', '✗', '&#10007;'].includes(compLower);
    const compDisplay = isCross
      ? '<span style="color:#E74C3C;font-size:1.25rem;">&#10007;</span>'
      : escapeHtml(row.competitor);

    return `<tr>
      <td style="${tdStyle}">${escapeHtml(row.feature)}</td>
      <td style="${tdUsStyle}">${usDisplay}</td>
      <td style="${tdStyle}">${compDisplay}</td>
    </tr>`;
  }).join('');

  const content = `${titleHtml}
    <div style="overflow-x:auto;">
      <table class="ec-comparison" style="${tableStyle}">
        <thead>
          <tr>
            <th style="${thStyle}">Feature</th>
            <th style="${thUsStyle}">Us</th>
            <th style="${thStyle}">Competitor</th>
          </tr>
        </thead>
        <tbody>${rowsHtml}</tbody>
      </table>
    </div>`;

  return renderBlock(block, 'ec-comparison-block', content);
}

// ─── 12. FAQ ─────────────────────────────────────────────────────────────────

export function renderFaq(block: Block): string {
  const props = getProps<FaqProps>(block);

  const itemsHtml = props.items.map((item) => {
    const escapedQuestion = escapeHtml(item.question);
    const escapedAnswer = escapeHtml(item.answer);

    return `<details class="ec-faq-item" style="border-bottom:1px solid #e5e7eb;">
      <summary class="ec-faq-question" style="padding:16px 0;font-weight:600;cursor:pointer;font-family:'Inter',sans-serif;font-size:1rem;color:var(--color-text);list-style:none;display:flex;justify-content:space-between;align-items:center;">
        <span>${escapedQuestion}</span>
        <span class="ec-faq-chevron" style="transition:transform 0.2s;font-size:0.75rem;color:var(--color-muted);">&#9660;</span>
      </summary>
      <dd class="ec-faq-answer" style="padding:0 0 16px;font-size:0.9375rem;line-height:1.6;color:var(--color-muted);margin:0;">
        ${escapedAnswer}
      </dd>
    </details>`;
  }).join('');

  const content = `<dl class="ec-faq" style="margin:0;">${itemsHtml}</dl>`;

  // CSS-only accordion: rotate chevron when open
  const faqStyle = `<style>[data-block-id="${block.id}"] details[open] .ec-faq-chevron{transform:rotate(180deg);}</style>`;

  return faqStyle + renderBlock(block, 'ec-faq-block', content);
}

// ─── 13. Before/After ────────────────────────────────────────────────────────

export function renderBeforeAfter(block: Block): string {
  const props = getProps<BeforeAfterProps>(block);
  const beforeLabel = props.beforeLabel ?? 'Before';
  const afterLabel = props.afterLabel ?? 'After';

  const halfStyle = [
    'flex:1',
    'position:relative',
    'overflow:hidden',
    'border-radius:8px',
  ].join(';');

  const labelStyle = [
    'position:absolute',
    'bottom:8px',
    'left:8px',
    'background:rgba(0,0,0,0.6)',
    'color:#fff',
    'padding:4px 10px',
    'border-radius:4px',
    'font-size:0.75rem',
    'font-weight:600',
    'font-family:Inter,-apple-system,sans-serif',
  ].join(';');

  const content = `<div class="ec-before-after" style="display:flex;gap:8px;">
    <div style="${halfStyle}">
      <img src="${escapeHtml(props.beforeImage)}" alt="${escapeHtml(beforeLabel)}" loading="lazy" decoding="async" style="display:block;width:100%;height:auto;">
      <span style="${labelStyle}">${escapeHtml(beforeLabel)}</span>
    </div>
    <div style="${halfStyle}">
      <img src="${escapeHtml(props.afterImage)}" alt="${escapeHtml(afterLabel)}" loading="lazy" decoding="async" style="display:block;width:100%;height:auto;">
      <span style="${labelStyle}">${escapeHtml(afterLabel)}</span>
    </div>
  </div>`;

  return renderBlock(block, 'ec-before-after-block', content);
}

// ─── 14. Icon List ───────────────────────────────────────────────────────────

export function renderIconList(block: Block): string {
  const props = getProps<IconListProps>(block);

  const itemsHtml = props.items.map((item) => {
    // Icon can be an emoji or a short label — render as-is (escaped)
    return `<li class="ec-icon-list-item" style="display:flex;align-items:center;gap:10px;padding:6px 0;">
      <span class="ec-icon" style="font-size:1.125rem;flex-shrink:0;width:24px;text-align:center;">${escapeHtml(item.icon)}</span>
      <span style="font-size:1rem;color:var(--color-text);line-height:1.4;">${escapeHtml(item.text)}</span>
    </li>`;
  }).join('');

  const content = `<ul class="ec-icon-list" style="list-style:none;padding:0;margin:0;">${itemsHtml}</ul>`;

  return renderBlock(block, 'ec-icon-list-block', content);
}

// ─── 15. Scrolling Marquee ───────────────────────────────────────────────────

export function renderScrollingMarquee(block: Block): string {
  const props = getProps<ScrollingMarqueeProps>(block);
  const speed = props.speed ?? 'normal';
  const duration = MARQUEE_DURATION[speed] ?? '10s';
  const bgColor = props.backgroundColor ?? 'var(--color-primary)';

  // Repeat text 3x for seamless loop
  const escapedText = escapeHtml(props.text);
  const textSpan = `<span style="display:inline-block;padding:0 32px;white-space:nowrap;font-weight:700;font-size:0.9375rem;text-transform:uppercase;letter-spacing:0.05em;">${escapedText}</span>`;
  const repeatedContent = textSpan + textSpan + textSpan;

  // Generate unique animation name to avoid collisions when multiple marquees exist
  const animName = `ec-marquee-${block.id}`;

  const content = `<div class="ec-marquee" style="overflow:hidden;background-color:${bgColor};color:#fff;padding:12px 0;" aria-label="${escapedText}">
    <div class="ec-marquee-track" style="display:flex;width:max-content;animation:${animName} ${duration} linear infinite;">
      ${repeatedContent}
    </div>
  </div>`;

  // Inline keyframes for the animation
  const marqueeStyle = `<style>@keyframes ${animName}{from{transform:translateX(0)}to{transform:translateX(-33.33%)}}</style>`;

  // Marquee is full-width — no container
  return marqueeStyle + renderBlock(block, 'ec-marquee-block', content, { container: false });
}

// ─── 16. Progress Bar ────────────────────────────────────────────────────────

export function renderProgressBar(block: Block): string {
  const props = getProps<ProgressBarProps>(block);
  const totalSteps = props.steps.length;

  const stepsHtml = props.steps.map((step, index) => {
    const isCompleted = step.completed ?? false;
    const isLast = index === totalSteps - 1;

    // Circle styles
    const circleBg = isCompleted ? 'background:var(--color-primary);color:#fff;' : 'background:#e5e7eb;color:var(--color-muted);';
    const circleStyle = [
      'width:32px',
      'height:32px',
      'border-radius:50%',
      'display:flex',
      'align-items:center',
      'justify-content:center',
      'font-size:0.8125rem',
      'font-weight:700',
      'flex-shrink:0',
      circleBg,
    ].join(';');

    // Connector line between circles
    const lineStyle = [
      'flex:1',
      'height:2px',
      isCompleted ? 'background:var(--color-primary);' : 'background:#e5e7eb;',
      'min-width:16px',
    ].join(';');

    const connectorHtml = isLast ? '' : `<div style="${lineStyle}"></div>`;

    // Label below the circle
    const labelStyle = [
      'font-size:0.6875rem',
      'color:var(--color-muted)',
      'text-align:center',
      'margin-top:4px',
      'max-width:64px',
      'word-wrap:break-word',
      isCompleted ? 'color:var(--color-primary);font-weight:600;' : '',
    ].join(';');

    return `<div style="display:flex;flex-direction:column;align-items:center;">
      <div style="display:flex;align-items:center;width:100%;">
        <div style="${circleStyle}">${isCompleted ? '&#10003;' : String(index + 1)}</div>
        ${connectorHtml}
      </div>
      <span style="${labelStyle}">${escapeHtml(step.label)}</span>
    </div>`;
  }).join('');

  const content = `<div class="ec-progress" style="display:flex;align-items:flex-start;gap:0;">
    ${stepsHtml}
  </div>`;

  return renderBlock(block, 'ec-progress-block', content);
}
