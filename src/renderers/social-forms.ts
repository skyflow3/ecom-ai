/**
 * Purpose: Block renderers for social proof, testimonial, form, and quiz blocks.
 *          Each renderer is a pure function (block: Block) => string returning HTML.
 * Dependencies: blocks.ts (Block), html-helpers.ts (escapeHtml, wrapSection, getProps, cn, buildResponsiveStyles, buildVisibilityClass)
 * Related: index.ts (registration), blocks.ts (schemas)
 *
 * WHY: Social proof blocks (reviews, testimonials, trust badges) and form blocks
 *      (optin, quiz) are the highest-conversion elements on e-commerce funnels.
 *      They share mobile-first CSS patterns and strict escape requirements.
 */

import type { Block } from '../design-system/blocks';
import { escapeHtml, wrapSection, getProps, cn, buildResponsiveStyles, buildVisibilityClass, renderIcon } from './html-helpers';

// ─── Shared Styles ─────────────────────────────────────────────────────────

/**
 * Base CSS for social/form blocks — values extracted from winning DTC pages.
 * WHY: Stars use #F59E0B amber (Shopify/Getheyfra pattern), verified green #00c249,
 *      review cards match Facebook-post and bordered card variants from design system.
 */
const SOCIAL_FORM_CSS = `
<style>
/* ── Reviews ── */
.ec-reviews{width:100%}
.ec-reviews-grid{display:grid;grid-template-columns:1fr;gap:16px}
@media(min-width:768px){.ec-reviews-grid{grid-template-columns:1fr 1fr}}
.ec-review-card{background:#fff;border:1px solid #CCC;border-radius:10px;padding:16px;box-shadow:0 0 6px rgba(0,0,0,0.2)}
.ec-review-card .ec-stars{color:#F59E0B;font-size:16px;letter-spacing:2px;margin-bottom:8px}
.ec-review-card .ec-review-body{font-family:"Inter",sans-serif;font-size:15px;line-height:1.6;color:#02122E;margin-bottom:12px}
.ec-review-card .ec-review-author{font-family:"Inter",sans-serif;font-weight:600;font-size:14px;color:#1B1B1B}
.ec-review-card .ec-review-date{font-family:"Inter",sans-serif;font-size:12px;color:#9AA0AB;margin-left:8px}
.ec-review-card .ec-verified{display:inline-flex;align-items:center;gap:4px;font-size:12px;color:#00c249;margin-left:8px;font-family:"Inter",sans-serif;font-weight:600}
.ec-reviews-carousel{display:flex;gap:16px;overflow-x:auto;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;padding-bottom:8px;scrollbar-width:none}
.ec-reviews-carousel::-webkit-scrollbar{display:none}
.ec-reviews-carousel .ec-review-card{min-width:300px;max-width:360px;scroll-snap-align:center;flex-shrink:0}
.ec-reviews-list .ec-review-item{padding:24px 0;border-top:1px solid #EAEAEA}
.ec-reviews-list .ec-review-item:last-child{border-bottom:none}

/* ── Testimonial ── */
.ec-testimonial{position:relative;padding:24px;text-align:center}
.ec-testimonial-quote-mark{font-family:"DM Serif Display",serif;font-size:64px;line-height:1;color:#2D6A4F;opacity:0.25;position:absolute;top:8px;left:16px}
.ec-testimonial-text{font-family:"Inter",sans-serif;font-style:italic;font-size:16px;line-height:1.5;color:#02122E;margin-bottom:16px;position:relative;z-index:1}
.ec-testimonial-author{display:flex;flex-direction:column;align-items:center;gap:4px}
.ec-testimonial-avatar{width:40px;height:40px;border-radius:50%;object-fit:cover;margin-bottom:8px;border:2px solid #E5E7EB}
.ec-testimonial-name{font-family:"Inter",sans-serif;font-weight:600;font-size:14px;color:#1B1B1B}
.ec-testimonial-title{font-family:"Inter",sans-serif;font-size:13px;color:#6B7280}
.ec-testimonial .ec-stars{color:#F59E0B;font-size:16px;letter-spacing:2px;margin-bottom:12px}

/* ── Social Proof ── */
.ec-social-proof-bar{width:100%;text-align:center;padding:8px 16px;font-family:"Inter",sans-serif;font-size:14px;color:#1B1B1B;background:rgba(0,194,73,0.06)}
.ec-social-proof-count{font-weight:700}
.ec-social-proof-source{font-size:12px;color:#6B7280;margin-left:6px}

/* ── Trust Badges ── */
.ec-trust-badges{display:flex;justify-content:center;flex-wrap:wrap;gap:24px;padding:12px 0}
.ec-trust-badge{display:flex;flex-direction:column;align-items:center;gap:4px;text-align:center}
.ec-trust-badge-icon{font-size:24px;line-height:1}
.ec-trust-badge-text{font-family:"Inter",sans-serif;font-size:12px;color:#6B7280;max-width:80px}

/* ── Product Carousel ── */
.ec-product-carousel{position:relative;width:100%}
.ec-carousel-track{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;scrollbar-width:none;border-radius:8px}
.ec-carousel-track::-webkit-scrollbar{display:none}
.ec-carousel-slide{min-width:100%;scroll-snap-align:center;flex-shrink:0;aspect-ratio:1/1;overflow:hidden}
.ec-carousel-slide img{width:100%;height:100%;object-fit:cover;display:block}
.ec-carousel-dots{display:flex;justify-content:center;gap:8px;margin-top:12px}
.ec-carousel-dot{width:8px;height:8px;border-radius:50%;background:#d1d5db;border:none;padding:0;cursor:pointer}
.ec-carousel-dot.active{background:#2D6A4F}

/* ── Form ── */
.ec-form{width:100%}
.ec-form-stacked{display:flex;flex-direction:column;gap:16px}
.ec-form-inline{display:flex;flex-direction:row;align-items:flex-end;gap:12px;flex-wrap:wrap}
.ec-form-field{display:flex;flex-direction:column;gap:4px;flex:1;min-width:0}
.ec-form-inline .ec-form-field{flex:1}
.ec-form-label{font-family:"Inter",sans-serif;font-size:14px;font-weight:500;color:#1B2A43}
.ec-form-required{color:#EC0B43;margin-left:2px}
.ec-form-input,.ec-form-select{height:42px;padding:0 12px;border:1px solid #E6E7EA;border-radius:4px;font-size:16px;font-family:"Inter",sans-serif;color:#1B1B1B;background:transparent;width:100%;box-sizing:border-box;-webkit-appearance:none;appearance:none}
.ec-form-input::placeholder{color:#9AA0AB}
.ec-form-select{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M6 8L1 3h10z' fill='%236b7280'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 16px center;padding-right:40px}
.ec-form-submit{display:inline-flex;align-items:center;justify-content:center;height:42px;padding:0 24px;border:none;border-radius:8px;background:#00c249;color:#fff;font-family:"Inter",sans-serif;font-size:16px;font-weight:700;cursor:pointer;transition:background-color 200ms ease-in-out;box-shadow:0 2px 4px 2px rgba(0,0,0,0.05)}
.ec-form-submit:hover{background:#53A81E}
.ec-form-stacked .ec-form-submit{width:100%}
.ec-form-inline .ec-form-submit{flex-shrink:0;width:auto}

/* ── Quiz Step ── */
.ec-quiz-step{width:100%;text-align:center}
.ec-quiz-progress{margin-bottom:24px}
.ec-quiz-progress-label{font-family:"Inter",sans-serif;font-size:13px;color:#6B7280;margin-bottom:8px}
.ec-quiz-progress-bar{width:100%;height:6px;background:#E5E7EB;border-radius:3px;overflow:hidden}
.ec-quiz-progress-fill{height:100%;background:#00c249;border-radius:3px;transition:width 0.3s ease}
.ec-quiz-question{font-family:"DM Serif Display",serif;font-size:24px;line-height:1.3;color:#1B1B1B;margin-bottom:24px}
.ec-quiz-options{display:grid;grid-template-columns:1fr 1fr;gap:12px}
@media(min-width:768px){.ec-quiz-options{grid-template-columns:1fr 1fr 1fr}}
@media(min-width:1024px){.ec-quiz-options{grid-template-columns:1fr 1fr 1fr 1fr}}
.ec-quiz-option{display:flex;flex-direction:column;border:2px solid #E5E7EB;border-radius:8px;padding:12px;cursor:pointer;transition:transform 0.15s,box-shadow 0.15s,border-color 0.15s;background:#fff;text-align:center}
.ec-quiz-option:hover{transform:scale(1.02);box-shadow:0 4px 12px rgba(0,0,0,0.1);border-color:#00c249}
.ec-quiz-option img{width:100%;aspect-ratio:1/1;object-fit:cover;border-radius:8px;margin-bottom:8px}
.ec-quiz-option-label{font-family:"Inter",sans-serif;font-size:14px;font-weight:500;color:#1B1B1B}
</style>
`;

/** Track if CSS was already injected to avoid duplicate <style> blocks */
let cssInjected = false;

/**
 * Return the shared CSS block once per render cycle.
 * Callers should prepend this to the first rendered social/form block.
 */
export function getSocialFormCss(): string {
  if (cssInjected) return '';
  cssInjected = true;
  return SOCIAL_FORM_CSS;
}

/** Reset CSS injection flag (useful for SSR or re-renders) */
export function resetSocialFormCss(): void {
  cssInjected = false;
}

// ─── Star Rating Helper ────────────────────────────────────────────────────

/**
 * Build an HTML star rating string from a 1-5 rating value.
 * WHY: Reviews, testimonials, and other blocks all need the same star format.
 *      Centralising avoids subtle inconsistencies (wrong char, wrong color).
 */
function renderStars(rating: number): string {
  const clamped = Math.max(1, Math.min(5, Math.round(rating)));
  const filled = '&#9733;'.repeat(clamped);   // ★
  const empty = '&#9734;'.repeat(5 - clamped); // ☆
  return `<span class="ec-stars">${filled}${empty}</span>`;
}

// ─── 1. Reviews Renderer ───────────────────────────────────────────────────

interface ReviewItem {
  author: string;
  rating: number;
  body: string;
  date?: string;
  verified?: boolean;
}

interface ReviewsProps {
  reviews: ReviewItem[];
  layout?: 'cards' | 'carousel' | 'list';
  showRating?: boolean;
}

/**
 * Render a single review card (used by 'cards' and 'carousel' layouts).
 */
function renderReviewCard(review: ReviewItem, showRating: boolean): string {
  const starsHtml = showRating !== false ? renderStars(review.rating) : '';
  const verifiedHtml = review.verified
    ? `<span class="ec-verified">&#10003; Verified</span>`
    : '';
  const dateHtml = review.date
    ? `<span class="ec-review-date">${escapeHtml(review.date)}</span>`
    : '';

  return `<div class="ec-review-card">
  ${starsHtml}
  <div class="ec-review-body">${escapeHtml(review.body)}</div>
  <div>
    <span class="ec-review-author">${escapeHtml(review.author)}</span>${dateHtml}${verifiedHtml}
  </div>
</div>`;
}

/**
 * Render a single review list item (used by 'list' layout, no card borders).
 */
function renderReviewListItem(review: ReviewItem, showRating: boolean): string {
  const starsHtml = showRating !== false ? renderStars(review.rating) : '';
  const verifiedHtml = review.verified
    ? `<span class="ec-verified">&#10003; Verified</span>`
    : '';
  const dateHtml = review.date
    ? `<span class="ec-review-date">${escapeHtml(review.date)}</span>`
    : '';

  return `<div class="ec-review-item">
  ${starsHtml}
  <div class="ec-review-body">${escapeHtml(review.body)}</div>
  <div>
    <span class="ec-review-author">${escapeHtml(review.author)}</span>${dateHtml}${verifiedHtml}
  </div>
</div>`;
}

export function renderReviews(block: Block): string {
  const props = getProps<ReviewsProps>(block);
  const { reviews, layout = 'cards', showRating = true } = props;

  const visibilityClass = buildVisibilityClass(block.visibility);
  const responsiveStyles = buildResponsiveStyles(block.id, block.styles);
  const cssPrefix = getSocialFormCss();

  let innerHtml: string;

  if (layout === 'carousel') {
    const cards = reviews.map(r => renderReviewCard(r, showRating)).join('\n');
    innerHtml = `<div class="ec-reviews-carousel">${cards}</div>`;
  } else if (layout === 'list') {
    const items = reviews.map(r => renderReviewListItem(r, showRating)).join('\n');
    innerHtml = `<div class="ec-reviews-list">${items}</div>`;
  } else {
    // 'cards' (default)
    const cards = reviews.map(r => renderReviewCard(r, showRating)).join('\n');
    innerHtml = `<div class="ec-reviews-grid">${cards}</div>`;
  }

  return `${cssPrefix}${responsiveStyles}${wrapSection(innerHtml, {
    id: block.id,
    blockClass: cn('ec-reviews', visibilityClass),
  })}`;
}

// ─── 2. Testimonial Renderer ───────────────────────────────────────────────

interface TestimonialProps {
  author: string;
  quote: string;
  rating?: number;
  avatar?: string;
  title?: string;
}

export function renderTestimonial(block: Block): string {
  const props = getProps<TestimonialProps>(block);
  const { author, quote, rating, avatar, title } = props;

  const visibilityClass = buildVisibilityClass(block.visibility);
  const responsiveStyles = buildResponsiveStyles(block.id, block.styles);
  const cssPrefix = getSocialFormCss();

  const avatarHtml = avatar
    ? `<img class="ec-testimonial-avatar" src="${escapeHtml(avatar)}" alt="${escapeHtml(author)}" />`
    : '';
  const starsHtml = rating ? renderStars(rating) : '';
  const titleHtml = title
    ? `<span class="ec-testimonial-title">${escapeHtml(title)}</span>`
    : '';

  const innerHtml = `<blockquote class="ec-testimonial">
  <span class="ec-testimonial-quote-mark">&ldquo;</span>
  ${starsHtml}
  <div class="ec-testimonial-text">${escapeHtml(quote)}</div>
  <div class="ec-testimonial-author">
    ${avatarHtml}
    <span class="ec-testimonial-name">${escapeHtml(author)}</span>
    ${titleHtml}
  </div>
</blockquote>`;

  return `${cssPrefix}${responsiveStyles}${wrapSection(innerHtml, {
    id: block.id,
    blockClass: cn('ec-testimonial', visibilityClass),
  })}`;
}

// ─── 3. Social Proof Renderer ──────────────────────────────────────────────

interface SocialProofProps {
  text: string;
  count?: number;
  source?: string;
}

export function renderSocialProof(block: Block): string {
  const props = getProps<SocialProofProps>(block);
  const { text, count, source } = props;

  const visibilityClass = buildVisibilityClass(block.visibility);
  const responsiveStyles = buildResponsiveStyles(block.id, block.styles);
  const cssPrefix = getSocialFormCss();

  const countHtml = count !== undefined
    ? `<span class="ec-social-proof-count">${count.toLocaleString()}</span> `
    : '';
  const sourceHtml = source
    ? `<span class="ec-social-proof-source">${escapeHtml(source)}</span>`
    : '';

  const innerHtml = `<div class="ec-social-proof-bar">
  ${countHtml}${escapeHtml(text)}${sourceHtml}
</div>`;

  return `${cssPrefix}${responsiveStyles}${wrapSection(innerHtml, {
    id: block.id,
    blockClass: cn('ec-social-proof', visibilityClass),
    container: false,
  })}`;
}

// ─── 4. Trust Badges Renderer ──────────────────────────────────────────────

interface TrustBadgeItem {
  icon?: string;
  text: string;
  /** WHY: AI sometimes generates "name" instead of "text" — accept both */
  name?: string;
}

interface TrustBadgesProps {
  badges: TrustBadgeItem[];
}

export function renderTrustBadges(block: Block): string {
  const props = getProps<TrustBadgesProps>(block);
  const { badges } = props;

  const visibilityClass = buildVisibilityClass(block.visibility);
  const responsiveStyles = buildResponsiveStyles(block.id, block.styles);
  const cssPrefix = getSocialFormCss();

  // WHY: AI can generate badges as undefined or with missing fields — defensive
  const safeBadges = Array.isArray(badges) ? badges : [];
  const badgeItems = safeBadges.map(badge => {
    // Handle string items (AI sometimes sends plain strings)
    // WHY: AI generates "name" OR "text" field — handle both gracefully
    const b = typeof badge === 'string'
      ? { text: badge, icon: '' }
      : badge;
    const badgeText = b.text || b.name || '';
    const iconHtml = b.icon
      ? `<span class="ec-trust-badge-icon">${renderIcon(b.icon, 24, '#6B7280')}</span>`
      : '';
    return `<div class="ec-trust-badge">
  ${iconHtml}
  <span class="ec-trust-badge-text">${escapeHtml(badgeText)}</span>
</div>`;
  }).join('\n');

  const innerHtml = `<div class="ec-trust-badges">${badgeItems}</div>`;

  return `${cssPrefix}${responsiveStyles}${wrapSection(innerHtml, {
    id: block.id,
    blockClass: cn('ec-trust-badges-section', visibilityClass),
  })}`;
}

// ─── 5. Product Carousel Renderer ──────────────────────────────────────────

interface CarouselImage {
  src: string;
  alt: string;
}

interface ProductCarouselProps {
  images: CarouselImage[];
}

export function renderProductCarousel(block: Block): string {
  const props = getProps<ProductCarouselProps>(block);
  const { images } = props;

  const visibilityClass = buildVisibilityClass(block.visibility);
  const responsiveStyles = buildResponsiveStyles(block.id, block.styles);
  const cssPrefix = getSocialFormCss();

  const slides = images.map((img, i) =>
    `<div class="ec-carousel-slide">
  <img src="${escapeHtml(img.src)}" alt="${escapeHtml(img.alt)}" loading="${i === 0 ? 'eager' : 'lazy'}" />
</div>`
  ).join('\n');

  const dots = images.map((_, i) =>
    `<button class="ec-carousel-dot${i === 0 ? ' active' : ''}" aria-label="Image ${i + 1}"></button>`
  ).join('\n');

  const innerHtml = `<div class="ec-product-carousel">
  <div class="ec-carousel-track">${slides}</div>
  <div class="ec-carousel-dots">${dots}</div>
</div>`;

  return `${cssPrefix}${responsiveStyles}${wrapSection(innerHtml, {
    id: block.id,
    blockClass: cn('ec-product-carousel-section', visibilityClass),
  })}`;
}

// ─── 6. Form Renderer ──────────────────────────────────────────────────────

interface FormField {
  name: string;
  type: 'email' | 'text' | 'tel' | 'number' | 'select';
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
}

interface FormProps {
  fields: FormField[];
  submitText: string;
  variant?: 'inline' | 'stacked';
}

/**
 * Render a single form field (input or select).
 * WHY: Form fields share the same label + input structure regardless of type.
 *      One helper avoids copy-paste and ensures consistent required markers.
 */
function renderFormField(field: FormField): string {
  const requiredMarker = field.required
    ? `<span class="ec-form-required">*</span>`
    : '';
  const placeholder = field.placeholder ? ` placeholder="${escapeHtml(field.placeholder)}"` : '';
  const requiredAttr = field.required ? ' required' : '';

  let inputHtml: string;

  if (field.type === 'select') {
    // WHY: Select needs option elements; placeholder as first disabled option.
    //      The caller may pass options via the field or we render an empty placeholder.
    const optionsHtml = (field.options || [])
      .map(opt => `<option value="${escapeHtml(opt)}">${escapeHtml(opt)}</option>`)
      .join('');
    const placeholderOption = field.placeholder
      ? `<option value="" disabled selected>${escapeHtml(field.placeholder)}</option>`
      : '';

    inputHtml = `<select class="ec-form-select" name="${escapeHtml(field.name)}"${requiredAttr}>${placeholderOption}${optionsHtml}</select>`;
  } else {
    inputHtml = `<input class="ec-form-input" type="${field.type}" name="${escapeHtml(field.name)}"${placeholder}${requiredAttr} />`;
  }

  return `<div class="ec-form-field">
  <label class="ec-form-label">${escapeHtml(field.label)}${requiredMarker}</label>
  ${inputHtml}
</div>`;
}

export function renderForm(block: Block): string {
  const props = getProps<FormProps>(block);
  const { fields, submitText, variant = 'stacked' } = props;

  const visibilityClass = buildVisibilityClass(block.visibility);
  const responsiveStyles = buildResponsiveStyles(block.id, block.styles);
  const cssPrefix = getSocialFormCss();

  const layoutClass = variant === 'inline' ? 'ec-form-inline' : 'ec-form-stacked';
  const fieldHtml = fields.map(f => renderFormField(f)).join('\n');

  const innerHtml = `<form class="ec-form ${layoutClass}" novalidate>
  ${fieldHtml}
  <button type="submit" class="ec-form-submit">${escapeHtml(submitText)}</button>
</form>`;

  return `${cssPrefix}${responsiveStyles}${wrapSection(innerHtml, {
    id: block.id,
    blockClass: cn('ec-form-section', visibilityClass),
  })}`;
}

// ─── 7. Quiz Step Renderer ─────────────────────────────────────────────────

interface QuizOption {
  label: string;
  value: string;
  image?: string;
}

interface QuizStepProps {
  question: string;
  options: QuizOption[];
  stepNumber: number;
  totalSteps: number;
}

export function renderQuizStep(block: Block): string {
  const props = getProps<QuizStepProps>(block);
  const { question, options, stepNumber, totalSteps } = props;

  const visibilityClass = buildVisibilityClass(block.visibility);
  const responsiveStyles = buildResponsiveStyles(block.id, block.styles);
  const cssPrefix = getSocialFormCss();

  // Progress bar: percentage filled based on current step
  const progressPercent = Math.round((stepNumber / totalSteps) * 100);

  const optionCards = options.map(option => {
    const imageHtml = option.image
      ? `<img src="${escapeHtml(option.image)}" alt="${escapeHtml(option.label)}" />`
      : '';
    return `<div class="ec-quiz-option" data-value="${escapeHtml(option.value)}">
  ${imageHtml}
  <span class="ec-quiz-option-label">${escapeHtml(option.label)}</span>
</div>`;
  }).join('\n');

  const innerHtml = `<div class="ec-quiz-step">
  <div class="ec-quiz-progress">
    <div class="ec-quiz-progress-label">Step ${stepNumber} of ${totalSteps}</div>
    <div class="ec-quiz-progress-bar">
      <div class="ec-quiz-progress-fill" style="width:${progressPercent}%"></div>
    </div>
  </div>
  <h2 class="ec-quiz-question">${escapeHtml(question)}</h2>
  <div class="ec-quiz-options">${optionCards}</div>
</div>`;

  return `${cssPrefix}${responsiveStyles}${wrapSection(innerHtml, {
    id: block.id,
    blockClass: cn('ec-quiz-step-section', visibilityClass),
  })}`;
}
