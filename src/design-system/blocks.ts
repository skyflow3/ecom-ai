/**
 * Purpose: Block types, schemas, and registry for the funnel builder.
 *          Defines the Block interface, BlockTree structure, Zod validation schemas,
 *          and the registry that maps block types to renderers.
 * Dependencies: zod, tokens.ts (PageType, PaletteKey), composition-rules.ts (BlockName)
 * Related: Architecture Finale.md §1.2 (Block types), §46 (Composition), §48 (Validation)
 *
 * WHY: The agent outputs a BlockTree JSON. This file defines what valid JSON looks like
 *      and how blocks get validated and rendered. No human ever touches HTML directly.
 */

import { z } from 'zod';
import type { PageType, PaletteKey, SpacingKey } from './tokens';
import type { BlockName } from './composition-rules';

// ─── Responsive Styles ───────────────────────────────────────────────────────

export interface ResponsiveStyles {
  mobile?: Record<string, string>;
  tablet?: Record<string, string>;
  desktop?: Record<string, string>;
}

export type DeviceVisibility = 'all' | 'mobile-only' | 'desktop-only';

// ─── Block Interface ─────────────────────────────────────────────────────────

export interface Block<T = Record<string, unknown>> {
  /** Unique ID (nanoid) */
  id: string;
  /** Block type from the registry */
  type: BlockName | string;
  /** Block-specific properties (validated by Zod schema per type) */
  props: T;
  /** Responsive styles (mobile-first overrides) */
  styles?: ResponsiveStyles;
  /** Show/hide on specific devices */
  visibility: DeviceVisibility;
  /** Nested blocks (for section, container) */
  children?: Block[];
  /** Locked blocks cannot be moved/deleted by the agent */
  locked?: boolean;
  /** Block-level analytics tracking */
  analyticsId?: string;
  /** Metadata for marketing angle injection and CRO */
  metadata?: {
    marketingAngle?: string;
    abTestId?: string;
    cro?: {
      priority: 'critical' | 'high' | 'medium' | 'low';
      note?: string;
    };
  };
}

// ─── Block Tree (Agent Output) ───────────────────────────────────────────────

export interface BlockTree {
  version: '1.0';
  pageType: PageType;
  palette: PaletteKey;
  blocks: Block[];
  metadata: {
    title: string;
    description: string;
    trackingId?: string;
  };
}

// ─── Zod Schemas (Pass 1 Validation) ─────────────────────────────────────────

/** Base block schema — shared by all block types */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const baseBlockSchema: any = z.object({
  id: z.string().min(1),
  type: z.string().min(1),
  props: z.record(z.unknown()),
  styles: z.object({
    mobile: z.record(z.string()).optional(),
    tablet: z.record(z.string()).optional(),
    desktop: z.record(z.string()).optional(),
  }).optional().default({}),
  visibility: z.enum(['all', 'mobile-only', 'desktop-only']).optional().default('all'),
  children: z.lazy(() => z.array(blockSchema)).optional(),
  locked: z.boolean().optional(),
  analyticsId: z.string().optional(),
  metadata: z.object({
    marketingAngle: z.string().optional(),
    abTestId: z.string().optional(),
    cro: z.object({
      priority: z.enum(['critical', 'high', 'medium', 'low']),
      note: z.string().optional(),
    }).optional(),
  }).optional(),
});

/** Discriminated union — each block type has its own props schema */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const blockSchema: any = z.discriminatedUnion('type', [
  // Hero block
  z.object({
    ...baseBlockSchema.shape,
    type: z.literal('hero'),
    props: z.object({
      headline: z.string().max(80),
      subheadline: z.string().optional(),
      backgroundImage: z.string().url().optional(),
      ctaText: z.string().min(1),
      ctaUrl: z.string().optional(),
      alignment: z.enum(['left', 'center']).optional().default('left'),
    }),
  }),

  // Heading / Headline
  z.object({
    ...baseBlockSchema.shape,
    type: z.literal('heading'),
    props: z.object({
      text: z.string().max(80),
      level: z.enum(['hero', 'section', 'card']).optional().default('section'),
      alignment: z.enum(['left', 'center']).optional().default('left'),
    }),
  }),

  // Body text
  z.object({
    ...baseBlockSchema.shape,
    type: z.literal('body-text'),
    props: z.object({
      content: z.string(),
      size: z.enum(['base', 'sm']).optional().default('base'),
    }),
  }),

  // Image
  z.object({
    ...baseBlockSchema.shape,
    type: z.literal('image'),
    props: z.object({
      src: z.string().min(1),
      alt: z.string().min(1),
      aspectRatio: z.enum(['4:5', '1:1', '16:9', '21:9']).optional(),
      caption: z.string().optional(),
    }),
  }),

  // Video
  z.object({
    ...baseBlockSchema.shape,
    type: z.literal('video'),
    props: z.object({
      src: z.string().min(1),
      poster: z.string().optional(),
      autoplay: z.boolean().optional().default(false),
      controls: z.boolean().optional().default(true),
    }),
  }),

  // CTA / Button
  z.object({
    ...baseBlockSchema.shape,
    type: z.literal('button'),
    props: z.object({
      text: z.string().min(1),
      url: z.string().optional(),
      variant: z.enum(['primary', 'secondary', 'urgency']).optional().default('primary'),
      fullWidth: z.boolean().optional(),
    }),
  }),

  // CTA (alias for button with conversion tracking)
  z.object({
    ...baseBlockSchema.shape,
    type: z.literal('cta'),
    props: z.object({
      text: z.string().min(1),
      url: z.string().optional(),
      variant: z.enum(['primary', 'secondary', 'urgency']).optional().default('primary'),
      fullWidth: z.boolean().optional(),
      conversionEvent: z.string().optional(),
    }),
  }),

  // Bundle offers (checkout qty tiers, upsell packages)
  z.object({
    ...baseBlockSchema.shape,
    type: z.literal('bundle-offers'),
    props: z.object({
      offers: z.array(z.object({
        id: z.string(),
        title: z.string(),
        price: z.string(),
        originalPrice: z.string().optional(),
        perUnit: z.string().optional(),
        savings: z.string().optional(),
        badge: z.string().optional(),
        popular: z.boolean().optional(),
        selected: z.boolean().optional(),
        freeShipping: z.boolean().optional(),
        bonusItems: z.array(z.string()).optional(),
      })).min(1),
      layout: z.enum(['cards', 'list']).optional().default('cards'),
    }),
  }),

  // Pricing card
  z.object({
    ...baseBlockSchema.shape,
    type: z.literal('pricing-card'),
    props: z.object({
      title: z.string(),
      price: z.string(),
      originalPrice: z.string().optional(),
      features: z.array(z.string()),
      popular: z.boolean().optional(),
      ctaText: z.string().optional(),
    }),
  }),

  // Add to cart
  z.object({
    ...baseBlockSchema.shape,
    type: z.literal('add-to-cart'),
    props: z.object({
      buttonText: z.string().min(1),
      variantId: z.string().optional(),
      expressCheckout: z.boolean().optional().default(true),
    }),
  }),

  // Reviews
  z.object({
    ...baseBlockSchema.shape,
    type: z.literal('reviews'),
    props: z.object({
      reviews: z.array(z.object({
        author: z.string(),
        rating: z.number().min(1).max(5),
        body: z.string(),
        date: z.string().optional(),
        verified: z.boolean().optional(),
      })).min(1),
      layout: z.enum(['cards', 'carousel', 'list']).optional().default('cards'),
      showRating: z.boolean().optional().default(true),
    }),
  }),

  // Single testimonial
  z.object({
    ...baseBlockSchema.shape,
    type: z.literal('testimonial'),
    props: z.object({
      author: z.string(),
      quote: z.string(),
      rating: z.number().min(1).max(5).optional(),
      avatar: z.string().optional(),
      title: z.string().optional(),
    }),
  }),

  // Comparison chart
  z.object({
    ...baseBlockSchema.shape,
    type: z.literal('comparison-chart'),
    props: z.object({
      title: z.string().optional(),
      rows: z.array(z.object({
        feature: z.string(),
        us: z.string(),
        competitor: z.string(),
      })).min(1),
    }),
  }),

  // FAQ
  z.object({
    ...baseBlockSchema.shape,
    type: z.literal('faq'),
    props: z.object({
      items: z.array(z.object({
        question: z.string(),
        answer: z.string(),
      })).min(1),
    }),
  }),

  // Guarantee (money-back, bottom-of-the-bottle, etc.)
  z.object({
    ...baseBlockSchema.shape,
    type: z.literal('guarantee'),
    props: z.object({
      text: z.string(),
      days: z.number().optional(),
      icon: z.string().optional(),
      /** Guarantee type: 'bottom-of-bottle' = use every drop and still get refund */
      guaranteeType: z.enum(['money-back', 'satisfaction', 'results', 'bottom-of-bottle']).optional().default('money-back'),
      /** Full description near CTA */
      description: z.string().optional(),
    }),
  }),

  // Trust badges
  z.object({
    ...baseBlockSchema.shape,
    type: z.literal('trust-badges'),
    props: z.object({
      badges: z.array(z.object({
        icon: z.string().optional(),
        text: z.string(),
      })).min(1),
    }),
  }),

  // Countdown timer
  z.object({
    ...baseBlockSchema.shape,
    type: z.literal('countdown'),
    props: z.object({
      endDate: z.string().optional(),
      minutes: z.number().optional(),
      label: z.string().optional(),
      /** Checkout pattern: "Cart reserved for XX:XX" */
      cartReservation: z.boolean().optional().default(false),
      urgency: z.enum(['low', 'medium', 'high']).optional().default('medium'),
    }),
  }),

  // Product carousel
  z.object({
    ...baseBlockSchema.shape,
    type: z.literal('product-carousel'),
    props: z.object({
      images: z.array(z.object({
        src: z.string(),
        alt: z.string(),
      })).min(1),
    }),
  }),

  // Form (optin, checkout)
  z.object({
    ...baseBlockSchema.shape,
    type: z.literal('form'),
    props: z.object({
      fields: z.array(z.object({
        name: z.string(),
        type: z.enum(['email', 'text', 'tel', 'number', 'select']),
        label: z.string(),
        placeholder: z.string().optional(),
        required: z.boolean().optional().default(false),
      })).min(1),
      submitText: z.string().min(1),
      variant: z.enum(['inline', 'stacked']).optional().default('stacked'),
    }),
  }),

  // Quiz step
  z.object({
    ...baseBlockSchema.shape,
    type: z.literal('quiz-step'),
    props: z.object({
      question: z.string(),
      options: z.array(z.object({
        label: z.string(),
        value: z.string(),
        image: z.string().optional(),
      })).min(2),
      stepNumber: z.number(),
      totalSteps: z.number(),
    }),
  }),

  // Order summary
  z.object({
    ...baseBlockSchema.shape,
    type: z.literal('order-summary'),
    props: z.object({
      items: z.array(z.object({
        name: z.string(),
        price: z.string(),
        quantity: z.number().optional(),
      })).min(1),
      subtotal: z.string(),
      shipping: z.string().optional(),
      total: z.string(),
    }),
  }),

  // Payment form
  z.object({
    ...baseBlockSchema.shape,
    type: z.literal('payment-form'),
    props: z.object({
      provider: z.enum(['stripe', 'paypal']).optional().default('stripe'),
      expressCheckout: z.boolean().optional().default(true),
    }),
  }),

  // Social proof
  z.object({
    ...baseBlockSchema.shape,
    type: z.literal('social-proof'),
    props: z.object({
      text: z.string(),
      count: z.number().optional(),
      source: z.string().optional(),
    }),
  }),

  // Benefits list
  z.object({
    ...baseBlockSchema.shape,
    type: z.literal('benefits-list'),
    props: z.object({
      benefits: z.array(z.object({
        icon: z.string().optional(),
        title: z.string(),
        description: z.string().optional(),
      })).min(1),
      layout: z.enum(['list', 'grid']).optional().default('list'),
    }),
  }),

  // Features grid
  z.object({
    ...baseBlockSchema.shape,
    type: z.literal('features-grid'),
    props: z.object({
      features: z.array(z.object({
        icon: z.string().optional(),
        title: z.string(),
        description: z.string().optional(),
      })).min(1),
      columns: z.number().min(1).max(4).optional().default(2),
    }),
  }),

  // Before/After
  z.object({
    ...baseBlockSchema.shape,
    type: z.literal('before-after'),
    props: z.object({
      beforeImage: z.string(),
      afterImage: z.string(),
      beforeLabel: z.string().optional().default('Before'),
      afterLabel: z.string().optional().default('After'),
    }),
  }),

  // Icon list
  z.object({
    ...baseBlockSchema.shape,
    type: z.literal('icon-list'),
    props: z.object({
      items: z.array(z.object({
        icon: z.string(),
        text: z.string(),
      })).min(1),
    }),
  }),

  // ─── Blocks ajoutés après analyse 15 HTML winners ─────────────────

  z.object({
    ...baseBlockSchema.shape,
    type: z.literal('scrolling-marquee'),
    props: z.object({
      text: z.string().min(1),
      speed: z.enum(['slow', 'normal', 'fast']).optional(),
      backgroundColor: z.string().optional(),
    }),
  }),

  z.object({
    ...baseBlockSchema.shape,
    type: z.literal('progress-bar'),
    props: z.object({
      steps: z.array(z.object({
        label: z.string(),
        completed: z.boolean().optional(),
      })).min(2),
    }),
  }),

  z.object({
    ...baseBlockSchema.shape,
    type: z.literal('selling-plan-toggle'),
    props: z.object({
      oneTimeLabel: z.string().optional(),
      subscribeLabel: z.string().optional(),
      discountPercent: z.number().optional(),
    }),
  }),

  z.object({
    ...baseBlockSchema.shape,
    type: z.literal('discount-code'),
    props: z.object({
      placeholder: z.string().optional(),
      applyButtonText: z.string().optional(),
    }),
  }),

  z.object({
    ...baseBlockSchema.shape,
    type: z.literal('payment-options'),
    props: z.object({
      methods: z.array(z.enum(['stripe', 'paypal', 'apple-pay', 'google-pay'])).min(1),
    }),
  }),

  z.object({
    ...baseBlockSchema.shape,
    type: z.literal('shipping-form'),
    props: z.object({
      fields: z.array(z.enum(['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zip', 'country'])).min(1),
    }),
  }),

  z.object({
    ...baseBlockSchema.shape,
    type: z.literal('scarcity-badge'),
    props: z.object({
      text: z.string().min(1),
      urgencyLevel: z.enum(['low', 'medium', 'high']).optional(),
    }),
  }),

  z.object({
    ...baseBlockSchema.shape,
    type: z.literal('negative-opt-out'),
    props: z.object({
      text: z.string().min(1),
      checkboxLabel: z.string().optional(),
      /** Loss aversion phrase ("I'll pay full price next time", "I understand I won't see this deal again") */
      lossAversion: z.string().optional(),
    }),
  }),

  // ─── Editorial blocks (advertorial/news-style) ────────────────────────────

  z.object({
    ...baseBlockSchema.shape,
    type: z.literal('editorial-header'),
    props: z.object({
      logoText: z.string().min(1),
      logoUrl: z.string().optional(),
      badgeText: z.string().optional(),
      category: z.string().optional(),
    }),
  }),

  z.object({
    ...baseBlockSchema.shape,
    type: z.literal('breadcrumb'),
    props: z.object({
      items: z.array(z.string()).min(1),
    }),
  }),

  z.object({
    ...baseBlockSchema.shape,
    type: z.literal('byline'),
    props: z.object({
      authorName: z.string().min(1),
      authorAvatar: z.string().optional(),
      credentials: z.string().optional(),
      date: z.string().optional(),
      badgeText: z.string().optional(),
    }),
  }),

  z.object({
    ...baseBlockSchema.shape,
    type: z.literal('sticky-cta'),
    props: z.object({
      text: z.string().min(1),
      url: z.string().optional(),
      subtext: z.string().optional(),
    }),
  }),

  z.object({
    ...baseBlockSchema.shape,
    type: z.literal('editorial-heading'),
    props: z.object({
      text: z.string().min(1),
      variant: z.enum(['default', 'highlight', 'underline']).optional().default('default'),
    }),
  }),

  z.object({
    ...baseBlockSchema.shape,
    type: z.literal('author-cta'),
    props: z.object({
      headline: z.string().min(1),
      productName: z.string().optional(),
      rating: z.number().min(1).max(5).optional(),
      buttonText: z.string().optional(),
      buttonUrl: z.string().optional(),
      trustText: z.string().optional(),
    }),
  }),
]);

// ─── BlockTree Zod Schema ────────────────────────────────────────────────────

export const blockTreeSchema = z.object({
  version: z.literal('1.0'),
  pageType: z.enum([
    'product-page', 'advertorial', 'vsl', 'checkout',
    'upsell', 'downsell', 'optin', 'quiz', 'thank-you', 'bridge',
  ] satisfies [PageType, ...PageType[]]),
  palette: z.enum([
    'health-warm', 'beauty-clean', 'supplement-bold', 'pet-friendly', 'beauty-bold',
  ] satisfies [PaletteKey, ...PaletteKey[]]),
  blocks: z.array(blockSchema).min(1),
  metadata: z.object({
    title: z.string().min(1).max(200),
    description: z.string().max(500).optional(),
    trackingId: z.string().optional(),
  }),
});

// ─── Block Registry ──────────────────────────────────────────────────────────
// Maps block types to their render functions and schemas.

export type RenderFn = (block: Block) => string;

export interface BlockDef {
  type: string;
  category: 'basic' | 'commerce' | 'social-proof' | 'content' | 'forms' | 'editorial';
  label: string;
  render: RenderFn;
}

class BlockRegistryClass {
  private renderers = new Map<string, RenderFn>();
  private categories = new Map<string, string>();
  private labels = new Map<string, string>();

  register(def: BlockDef): void {
    this.renderers.set(def.type, def.render);
    this.categories.set(def.type, def.category);
    this.labels.set(def.type, def.label);
  }

  render(block: Block): string {
    const renderFn = this.renderers.get(block.type);
    if (!renderFn) {
      throw new Error(`Unknown block type: ${block.type}`);
    }
    return renderFn(block);
  }

  renderTree(tree: BlockTree): string {
    const html = tree.blocks.map(block => this.render(block)).join('\n');
    return `<!-- Page: ${tree.metadata.title} | Type: ${tree.pageType} | Palette: ${tree.palette} -->\n${html}`;
  }

  has(type: string): boolean {
    return this.renderers.has(type);
  }

  getCategory(type: string): string | undefined {
    return this.categories.get(type);
  }

  getLabel(type: string): string | undefined {
    return this.labels.get(type);
  }

  getRegisteredTypes(): string[] {
    return [...this.renderers.keys()];
  }
}

/** Singleton registry — import and register blocks at startup */
export const blockRegistry = new BlockRegistryClass();

// ─── Validation Result Types ─────────────────────────────────────────────────

export interface ValidationError {
  code: string;
  message: string;
  severity: 'error' | 'warning';
  blockId?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  score: number;   // 0-100 quality score
}

// ─── Convenience ─────────────────────────────────────────────────────────────

/** Validate a BlockTree JSON against the Zod schema (Pass 1 of validation pipeline) */
export function validateBlockTreeSchema(json: unknown): {
  success: boolean;
  data?: BlockTree;
  errors?: z.ZodError;
} {
  const result = blockTreeSchema.safeParse(json);
  if (result.success) {
    return { success: true, data: result.data as BlockTree };
  }
  return { success: false, errors: result.error };
}
