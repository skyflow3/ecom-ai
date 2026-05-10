/**
 * Purpose: Shared HTML rendering utilities for block renderers.
 *          Every renderer uses these to build consistent, mobile-first HTML.
 * Dependencies: blocks.ts (Block, ResponsiveStyles, DeviceVisibility)
 * Related: Architecture Finale.md §47 (CSS), §51 (Render pipeline)
 *
 * WHY: Renderers must produce consistent HTML with proper CSS classes,
 *      responsive styles, visibility rules, and escape safety.
 */

import type { Block, ResponsiveStyles, DeviceVisibility } from '../design-system/blocks';

// ─── HTML Escaping ───────────────────────────────────────────────────────────

/**
 * Escape HTML special characters to prevent XSS.
 * All user-generated text (headlines, body, testimonials) passes through this.
 */
export function escapeHtml(text: unknown): string {
  // WHY: AI-generated block props can have undefined, null, numbers, or objects
  //      instead of strings. Must handle all edge cases gracefully.
  if (text == null) return '';
  if (typeof text !== 'string') return String(text);
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ─── CSS Class Builder ───────────────────────────────────────────────────────

/**
 * Build a CSS class string from conditional classes.
 * Usage: cn('block', isActive && 'active', variant === 'primary' && 'btn-primary')
 */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

// ─── Section Wrapper ─────────────────────────────────────────────────────────

interface SectionOptions {
  /** Unique ID for the block */
  id: string;
  /** CSS class for the block type (e.g., 'hero', 'bundle-offers') */
  blockClass: string;
  /** Additional CSS classes */
  extraClass?: string;
  /** Background color override */
  backgroundColor?: string;
  /** Padding override (default: 16px mobile, 24px desktop) */
  padding?: string;
  /** Whether this section has a max-width container */
  container?: boolean;
  /** Analytics tracking ID */
  analyticsId?: string;
  /** A/B test ID */
  abTestId?: string;
}

const SECTION_STYLES = `
.ec-section { box-sizing: border-box; width: 100%; margin: 0; padding: 16px; }
.ec-container { max-width: 480px; margin: 0 auto; }
@media (min-width: 768px) {
  .ec-section { padding: 24px; }
  .ec-container { max-width: 720px; }
}
@media (min-width: 1024px) {
  .ec-container { max-width: 960px; }
}
`.trim();

/**
 * Wrap block content in a section with proper classes, ID, and responsive padding.
 * Every block renderer wraps its output through this.
 */
export function wrapSection(content: string, options: SectionOptions): string {
  const {
    id,
    blockClass,
    extraClass,
    backgroundColor,
    padding,
    container = true,
    analyticsId,
    abTestId,
  } = options;

  const classes = cn('ec-section', blockClass, extraClass);
  const style = [
    backgroundColor ? `background-color:${backgroundColor}` : '',
    padding ? `padding:${padding}` : '',
  ].filter(Boolean).join(';');

  const dataAttrs = [
    `data-block-id="${id}"`,
    `data-block-type="${blockClass}"`,
    analyticsId ? `data-analytics="${analyticsId}"` : '',
    abTestId ? `data-ab="${abTestId}"` : '',
  ].filter(Boolean).join(' ');

  const wrapped = container
    ? `<div class="ec-container">${content}</div>`
    : content;

  return `<section class="${classes}"${style ? ` style="${style}"` : ''} ${dataAttrs}>${wrapped}</section>`;
}

// ─── Responsive Styles ───────────────────────────────────────────────────────

/**
 * Convert a ResponsiveStyles object into a <style> block with media queries.
 * Applied when a block has custom responsive overrides.
 */
export function buildResponsiveStyles(
  blockId: string,
  styles?: ResponsiveStyles
): string {
  if (!styles) return '';

  const parts: string[] = [];

  if (styles.mobile && Object.keys(styles.mobile).length > 0) {
    const rules = Object.entries(styles.mobile)
      .map(([prop, val]) => `${camelToKebab(prop)}:${val}`)
      .join(';');
    parts.push(`[data-block-id="${blockId}"]{${rules}}`);
  }

  if (styles.tablet && Object.keys(styles.tablet).length > 0) {
    const rules = Object.entries(styles.tablet)
      .map(([prop, val]) => `${camelToKebab(prop)}:${val}`)
      .join(';');
    parts.push(`@media(min-width:768px){[data-block-id="${blockId}"]{${rules}}}`);
  }

  if (styles.desktop && Object.keys(styles.desktop).length > 0) {
    const rules = Object.entries(styles.desktop)
      .map(([prop, val]) => `${camelToKebab(prop)}:${val}`)
      .join(';');
    parts.push(`@media(min-width:1024px){[data-block-id="${blockId}"]{${rules}}}`);
  }

  return parts.length > 0 ? `<style>${parts.join('')}</style>` : '';
}

// ─── Visibility ──────────────────────────────────────────────────────────────

/**
 * Build visibility CSS classes for device-specific blocks.
 */
export function buildVisibilityClass(visibility: DeviceVisibility = 'all'): string {
  switch (visibility) {
    case 'mobile-only':
      return 'ec-mobile-only';
    case 'desktop-only':
      return 'ec-desktop-only';
    default:
      return '';
  }
}

// ─── Block Props Type Helper ─────────────────────────────────────────────────

/**
 * Type-safe prop extraction. Each renderer casts Block.props to its expected shape.
 */
export function getProps<T>(block: Block): T {
  return block.props as T;
}

// ─── Utility ─────────────────────────────────────────────────────────────────

function camelToKebab(str: string): string {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase();
}

/**
 * Generate a nano-style ID for blocks that don't have one.
 */
export function nanoId(): string {
  return Math.random().toString(36).substring(2, 10);
}

// ─── SVG Icon Helper ──────────────────────────────────────────────────────────
// WHY: Trust badges, guarantee, and other blocks need icons. The AI sends icon
//      names like "lock", "shield", "flag" but the renderer was outputting them
//      as plain text. These inline SVGs match the visual style of winner pages.

type IconName = 'lock' | 'shield' | 'shield-check' | 'flag' | 'check-circle' | 'check' | 'star' | 'globe' | 'heart' | 'thumbs-up' | 'comment' | 'share' | 'truck' | 'credit-card' | 'award' | 'stethoscope' | 'refresh' | 'rotate-ccw';

const ICON_MAP: Record<IconName, string> = {
  'lock': `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
  'shield': `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  'shield-check': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2D6A4F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>`,
  'flag': `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/></svg>`,
  'check-circle': `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
  'check': `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  'star': `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  'globe': `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#65676B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
  'heart': `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#1877F2" stroke="#1877F2" stroke-width="1"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
  'thumbs-up': `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#1877F2" stroke="#1877F2" stroke-width="1"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>`,
  'comment': `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#65676B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  'share': `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#65676B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>`,
  'truck': `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="15" height="13" x="1" y="3" rx="2"/><path d="M16 8h4a2 2 0 0 1 2 2v6h-6V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`,
  'credit-card': `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="22" height="16" x="1" y="4" rx="2"/><line x1="1" x2="23" y1="10" y2="10"/></svg>`,
  'award': `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>`,
  'stethoscope': `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6 6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/></svg>`,
  'refresh': `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>`,
  'rotate-ccw': `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>`,
};

/**
 * Render an inline SVG icon by name.
 * WHY: Trust badges, guarantee, etc. need icons. The AI sends names like "lock",
 *      "shield" — this converts them to proper SVGs matching winner page styles.
 */
export function renderIcon(name: string, size: number = 20, color?: string): string {
  const icon = ICON_MAP[name as IconName];
  if (!icon) {
    // Fallback: check-circle for unknown icons
    return applyIconTransforms(ICON_MAP['check-circle'], size, color);
  }
  return applyIconTransforms(icon, size, color);
}

/**
 * Apply size and color transforms to an SVG string.
 * WHY: SVGs have hardcoded width/height — must override for different sizes.
 *      Color override replaces "currentColor" with the specified color.
 */
function applyIconTransforms(svg: string, size: number, color?: string): string {
  let result = svg
    .replace(/width="\d+"/, `width="${size}"`)
    .replace(/height="\d+"/, `height="${size}"`);
  if (color) {
    result = result.replace(/stroke="currentColor"/g, `stroke="${color}"`);
  }
  return result;
}

/**
 * Get a random avatar URL from randomuser.me (deterministic seed).
 * WHY: Facebook posts, testimonials, bylines need realistic face photos.
 *      randomuser.me provides free, deterministic face photos.
 */
export function getRandomAvatar(seed: string): string {
  return `https://randomuser.me/api/portraits/${seed.includes('woman') || seed.includes('female') ? 'women' : 'men'}/${hashCode(seed) % 90 + 1}.jpg`;
}

/**
 * Get a random doctor avatar URL.
 * WHY: Doctor endorsements need realistic professional photos.
 *      Uses i.pravatar.cc which provides free face photos.
 */
export function getRandomDoctorAvatar(seed: string): string {
  const id = (hashCode(seed) % 70) + 1;
  return `https://i.pravatar.cc/150?img=${id}`;
}

/** Simple string hash for deterministic random selection */
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}
