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
export function escapeHtml(text: string): string {
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
