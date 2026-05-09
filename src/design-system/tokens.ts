/**
 * Purpose: Design Token System — the ONLY visual values the AI agent may use.
 *          Any value not defined here = rejected by the validation pipeline.
 * Dependencies: None (pure constants)
 * Related: Architecture Finale.md §45, composition-rules.ts, mobile-first.css
 *
 * WHY: The agent composes blocks, CSS does 90% of the visual work.
 *      Tokens are a "prison" — the agent can only combine what's here.
 */

// ─── Spacing (4px base, 12 steps) ────────────────────────────────────────────
// WHY 4px: Mobile thumb = 44px min tap target. 4px divides 44 perfectly (11 steps).

export const SPACING = {
  '0': '0px',
  '1': '4px',       // micro — badge padding, icon gap
  '2': '8px',       // tight — inline gaps, chip padding
  '3': '12px',      // compact — card inner gaps
  '4': '16px',      // base mobile padding — the default
  '5': '20px',      // comfortable — list item gaps
  '6': '24px',      // section gap mobile
  '8': '32px',      // large gap
  '10': '40px',     // section padding mobile
  '12': '48px',     // section padding desktop
  '16': '64px',     // hero spacing
} as const;

export type SpacingKey = keyof typeof SPACING;

// ─── Typography (2 fonts, modular scale 1.25) ────────────────────────────────
// WHY 2 fonts max: More fonts = slow load + visual inconsistency.
//    Sans-serif heading = DTC standard (0/15 winners use serif).
//    Bold Inter heading = trust + modern. Body Inter = readable at 16px mobile.

export const TYPOGRAPHY = {
  families: {
    heading: "'Inter', -apple-system, sans-serif",
    body: "'Inter', -apple-system, sans-serif",
  },

  sizes: {
    xs: '0.75rem',       // 12px — captions, badges, legal
    sm: '0.875rem',      // 14px — body compact mobile, metadata
    base: '1rem',        // 16px — body default (NEVER smaller on mobile)
    lg: '1.125rem',      // 18px — subheadline, CTA text
    xl: '1.25rem',       // 20px — small heading mobile
    '2xl': '1.5rem',     // 24px — heading mobile
    '3xl': '1.875rem',   // 30px — headline mobile
    '4xl': '2.25rem',    // 36px — hero headline mobile
    '5xl': '3rem',       // 48px — hero headline desktop ONLY
  },

  weights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,           // CTAs, headlines
    black: 900,          // hero headlines only
  },

  lineHeight: {
    tight: '1.2',        // headlines
    snug: '1.375',       // subheadlines
    normal: '1.5',       // body
    relaxed: '1.625',    // long-form advertorial
  },
} as const;

export type FontSizeKey = keyof typeof TYPOGRAPHY.sizes;
export type FontWeightKey = keyof typeof TYPOGRAPHY.weights;
export type LineHeightKey = keyof typeof TYPOGRAPHY.lineHeight;

// ─── Color Palettes (per niche, WCAG AA validated) ───────────────────────────
// RULE: Agent picks ONE palette per funnel. Never mix.
// Each palette is pre-validated for contrast ≥ 4.5 on mobile.

export const PALETTES = {
  // Health/Supplement — urgency + trust
  'health-warm': {
    name: 'Health Warm',
    bestFor: ['supplement', 'health', 'fitness'] as const,
    primary: '#E74C3C',
    primaryHover: '#C0392B',
    secondary: '#2C3E50',
    accent: '#F39C12',
    background: '#FFFFFF',
    surface: '#F8F9FA',
    text: '#1A1A1A',
    textMuted: '#6B7280',
    success: '#27AE60',
    warning: '#F39C12',
  },

  // Beauty/Skincare — premium, clean, golden
  'beauty-clean': {
    name: 'Beauty Clean',
    bestFor: ['skincare', 'beauty', 'cosmetics'] as const,
    primary: '#D4A574',
    primaryHover: '#C4956A',
    secondary: '#4A4A4A',
    accent: '#E8C9A0',
    background: '#FEFEFE',
    surface: '#F5F0EB',
    text: '#2D2D2D',
    textMuted: '#8B8B8B',
    success: '#7FB069',
    warning: '#E6B655',
  },

  // Supplement Bold — high energy, action
  'supplement-bold': {
    name: 'Supplement Bold',
    bestFor: ['supplement', 'nootropic', 'energy'] as const,
    primary: '#FF6B00',
    primaryHover: '#E05E00',
    secondary: '#1A1A2E',
    accent: '#FFB800',
    background: '#FFFFFF',
    surface: '#FFF8F0',
    text: '#1A1A1A',
    textMuted: '#6B7280',
    success: '#10B981',
    warning: '#F59E0B',
  },

  // Pet — natural, friendly, trust
  'pet-friendly': {
    name: 'Pet Friendly',
    bestFor: ['pet', 'animal', 'natural'] as const,
    primary: '#4CAF50',
    primaryHover: '#43A047',
    secondary: '#37474F',
    accent: '#FF9800',
    background: '#FFFFFF',
    surface: '#F1F8E9',
    text: '#263238',
    textMuted: '#78909C',
    success: '#66BB6A',
    warning: '#FFA726',
  },

  // Beauty Bold — rose/violet + vert CTA (PrimalQueen validated)
  // WHY: #9b046f + #00ad21 = most seen combo in DTC beauty/skincare winners
  'beauty-bold': {
    name: 'Beauty Bold',
    bestFor: ['skincare', 'beauty', 'cosmetics', 'supplement'] as const,
    primary: '#9B046F',
    primaryHover: '#7D035A',
    secondary: '#2F0147',
    accent: '#FF0075',
    background: '#FFFFFF',
    surface: '#FFF3F7',
    text: '#1A1A1A',
    textMuted: '#6B7280',
    success: '#00AD21',
    warning: '#F59E0B',
  },
} as const;

export type PaletteKey = keyof typeof PALETTES;
export type PaletteColorKey = keyof typeof PALETTES['health-warm'];

// ─── Border Radius ───────────────────────────────────────────────────────────
// WHY soft never sharp: DTC premium = rounded. Sharp = cheap/enterprise look.

export const RADIUS = {
  none: '0px',
  sm: '4px',        // small elements, tags
  md: '8px',        // inputs, small cards
  lg: '12px',       // buttons mobile, cards
  xl: '16px',       // premium cards, modals
  full: '9999px',   // pills, badges, avatars
} as const;

export type RadiusKey = keyof typeof RADIUS;

// ─── Shadows ─────────────────────────────────────────────────────────────────
// WHY subtle only: heavy shadows = cheap template builder look.

export const SHADOW = {
  none: 'none',
  sm: '0 1px 2px rgba(0,0,0,0.05)',
  md: '0 4px 6px rgba(0,0,0,0.07)',
  lg: '0 10px 15px rgba(0,0,0,0.1)',
} as const;

export type ShadowKey = keyof typeof SHADOW;

// ─── Breakpoints ─────────────────────────────────────────────────────────────

export const BREAKPOINTS = {
  mobile: '0px',       // 0-767px — DEFAULT, always designed first
  tablet: '768px',     // 768-1024px
  desktop: '1025px',   // 1025+
} as const;

// ─── CTA Dimensions (Mobile-First, Thumb-Friendly) ──────────────────────────

export const CTA_DIMENSIONS = {
  minHeight: '52px',
  minHeightDesktop: '56px',
  paddingX: '24px',
  paddingXDesktop: '32px',
  fontSize: '1.125rem',         // 18px — NEVER smaller on CTAs
  fontWeight: 700,
  borderRadius: '12px',         // RADIUS.lg
  fullWidthMobile: true,
  fullWidthDesktop: false,
  minDesktopWidth: '220px',
  touchFeedback: 'scale(0.97)',
} as const;

// ─── Universal CTA Colors ──────────────────────────────────────────────────────
// WHY: Green #00ad21 = universal DTC winner CTA (PrimalQueen, SmoothSpine, etc.)
//      Blue #2563eb = checkout/upsell standard (Airmoto, ThePetLabCo).
//      Used across ALL palettes for maximum conversion regardless of brand color.

export const CTA_COLORS = {
  /** Primary action — "Add to Cart", "Unlock Now" */
  primary: '#00AD21',
  primaryHover: '#009A1D',
  /** Checkout/secure action — "Complete Order", "Submit" */
  checkout: '#2563EB',
  checkoutHover: '#1D4ED8',
  /** Urgency — limited time, countdown offers */
  urgency: '#E74C3C',
  /** Decline/negative opt-out — muted, NOT prominent */
  decline: '#9CA3AF',
} as const;

// ─── Image Aspect Ratios (DTC-Specific) ──────────────────────────────────────

export const IMAGE_RATIOS = {
  productHero: '4:5',          // 1080x1350 — Instagram/DTC standard, best mobile
  productThumbnail: '1:1',     // square grid
  lifestyle: '16:9',           // wide lifestyle shot
  beforeAfter: '1:1',          // side-by-side comparison
  testimonial: '1:1',          // avatar/photo
  banner: '21:9',              // desktop only hero banner
  productInUse: '4:5',         // person using product, portrait
} as const;

export type ImageRatioKey = keyof typeof IMAGE_RATIOS;

// ─── Page Max-Widths by Type ─────────────────────────────────────────────────
// WHY: Page width = psychological prime.
//    Checkout narrow = focus. Advertorial narrow = article. Product wide = e-commerce.

export const PAGE_MAX_WIDTHS: Record<PageType, string> = {
  advertorial: '720px',
  listicle: '720px',
  'product-page': '1024px',
  vsl: '1200px',
  checkout: '520px',
  upsell: '520px',
  downsell: '520px',
  optin: '640px',
  quiz: '640px',
  'thank-you': '640px',
  bridge: '640px',
};

// ─── Page Types ──────────────────────────────────────────────────────────────

export const PAGE_TYPES = [
  'product-page',
  'advertorial',
  'listicle',
  'vsl',
  'checkout',
  'upsell',
  'downsell',
  'optin',
  'quiz',
  'thank-you',
  'bridge',
] as const;

export type PageType = (typeof PAGE_TYPES)[number];

// ─── Block Types ─────────────────────────────────────────────────────────────

export const BLOCK_TYPES = [
  'hero',
  'headline',
  'subheadline',
  'body-text',
  'image',
  'video',
  'cta',
  'button',
  'bundle',
  'pricing-card',
  'add-to-cart',
  'reviews',
  'testimonial',
  'comparison',
  'faq',
  'guarantee',
  'trust-badges',
  'countdown',
  'carousel',
  'form',
  'quiz-step',
  'order-summary',
  'payment-form',
  'social-proof',
  'benefits-list',
  'features-grid',
  'before-after',
  'icon-list',
  'heading',
  // ─── Blocks ajoutés après analyse 15 HTML winners ─────────────────
  'scrolling-marquee',       // Flash Sale banner défilant (PrimalQueen)
  'progress-bar',            // Étapes checkout (3/3 checkouts)
  'selling-plan-toggle',     // One-time vs Subscribe (PrimalQueen buy-boxes)
  'discount-code',           // Champ promo code checkout
  'payment-options',         // Icons Stripe/PayPal/Apple Pay
  'shipping-form',           // Formulaire adresse checkout
  'scarcity-badge',          // "High risk of selling out" badge
  'negative-opt-out',        // Checkbox "Don't add" (upsell)
  // ─── Blocks ajoutés après analyse winners advertorial ─────────────────
  'numbered-benefits',       // Numbered benefit grid ("7 Reasons Why" — listicle pattern)
  'media-badges',            // "As Seen On" media logos (Clarifion, Vibriance pattern)
  'facebook-post',           // Facebook-style social proof card (Clarifion pattern)
  'doctor-endorsement',      // Expert/doctor endorsement with credentials
] as const;

export type BlockType = (typeof BLOCK_TYPES)[number];

// ─── Master Export ───────────────────────────────────────────────────────────

export const DESIGN_TOKENS = {
  spacing: SPACING,
  typography: TYPOGRAPHY,
  palettes: PALETTES,
  radius: RADIUS,
  shadow: SHADOW,
  breakpoints: BREAKPOINTS,
  cta: CTA_DIMENSIONS,
  imageRatios: IMAGE_RATIOS,
  pageMaxWidth: PAGE_MAX_WIDTHS,
} as const;

export type DesignTokenSet = typeof DESIGN_TOKENS;

// ─── Validation Helper ───────────────────────────────────────────────────────
// Used by validation pipeline to check if a value is a valid token

/** Check if a color value belongs to any palette */
export function isValidPaletteColor(value: string): boolean {
  for (const palette of Object.values(PALETTES)) {
    for (const color of Object.values(palette)) {
      if (typeof color === 'string' && color.toLowerCase() === value.toLowerCase()) {
        return true;
      }
    }
  }
  return false;
}

/** Check if a spacing value is a valid token */
export function isValidSpacing(value: string): boolean {
  return Object.values(SPACING).includes(value as (typeof SPACING)[SpacingKey]);
}

/** Check if a radius value is a valid token */
export function isValidRadius(value: string): boolean {
  return Object.values(RADIUS).includes(value as (typeof RADIUS)[RadiusKey]);
}

/** Get palette by key */
export function getPalette(key: PaletteKey) {
  return PALETTES[key];
}

/** Get all valid color values across all palettes */
export function getAllValidColors(): string[] {
  const colors = new Set<string>();
  for (const palette of Object.values(PALETTES)) {
    for (const [k, v] of Object.entries(palette)) {
      if (typeof v === 'string' && k !== 'name') {
        colors.add(v);
      }
    }
  }
  return [...colors];
}
