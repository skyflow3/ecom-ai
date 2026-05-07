/**
 * Purpose: POST /api/funnels/[id]/generate — Generate a page for a funnel step.
 *          Loads funnel + product from DB, calls the LLM page generator,
 *          saves the BlockTree JSON into the page variant, returns HTML + tree.
 * Dependencies: db, schema, page-generator, config
 * Related: src/app/api/funnels/[id]/route.ts, src/services/page-generator.ts
 *
 * WHY: This is the bridge between the funnel manager and the AI page generator.
 *      It resolves the funnel's product info + marketing angle, calls generatePage(),
 *      and persists the result so it can be deployed and served later.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import {
  funnels,
  funnelSteps,
  pageVariants,
  marketingAngles,
  products,
} from '@/db/schema';
import { generatePage, type GeneratePageRequest } from '@/services/page-generator';
import { getLlmConfig, getCopywriterConfig, isCopywriterEnabled } from '@/lib/config';
import type { PageType, PaletteKey } from '@/design-system/tokens';
import { createLogger } from '@/lib/logger';

const log = createLogger('api:generate-step');

// ─── Validation ───────────────────────────────────────────────────────────────

const UUID_SCHEMA = z.string().uuid();

const VALID_PAGE_TYPES: [string, ...string[]] = [
  'product-page', 'advertorial', 'vsl', 'checkout',
  'upsell', 'downsell', 'optin', 'quiz', 'thank-you', 'bridge',
];

const VALID_PALETTES: [string, ...string[]] = [
  'health-warm', 'beauty-clean', 'supplement-bold',
  'pet-friendly', 'beauty-bold',
];

const generateRequestSchema = z.object({
  stepId: z.string().uuid(),
  pageType: z.enum(VALID_PAGE_TYPES),
  palette: z.enum(VALID_PALETTES),
  marketingAngleId: z.string().uuid().optional(),
  product: z.object({
    name: z.string().min(1).optional(),
    description: z.string().min(10).optional(),
    price: z.string().optional(),
    originalPrice: z.string().optional(),
    niche: z.string().optional(),
    targetAudience: z.string().optional(),
    benefits: z.array(z.string()).optional(),
    guarantee: z.string().optional(),
    imageUrl: z.string().optional(),
  }).optional(),
  /** Optional: create a new variant instead of overwriting the default */
  variantName: z.string().max(100).optional(),
});

// ─── Route Segment Config ─────────────────────────────────────────────────────

interface RouteContext {
  params: Promise<{ id: string }>;
}

// ─── POST /api/funnels/[id]/generate ──────────────────────────────────────────

export async function POST(
  request: NextRequest,
  context: RouteContext,
) {
  const startTime = Date.now();

  try {
    const { id: funnelId } = await context.params;

    // Validate funnel ID
    if (!UUID_SCHEMA.safeParse(funnelId).success) {
      return NextResponse.json(
        { success: false, error: 'Invalid funnel ID — must be a UUID' },
        { status: 400 },
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const parsed = generateRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request body',
          details: parsed.error.issues.map((i) => ({
            path: i.path.join('.'),
            message: i.message,
          })),
        },
        { status: 400 },
      );
    }

    const { stepId, pageType, palette, marketingAngleId, product: productOverride, variantName } = parsed.data;

    // ── 1. Load funnel ────────────────────────────────────────────────────────

    const [funnel] = await db
      .select()
      .from(funnels)
      .where(eq(funnels.id, funnelId))
      .limit(1);

    if (!funnel) {
      return NextResponse.json(
        { success: false, error: 'Funnel not found' },
        { status: 404 },
      );
    }

    if (funnel.status === 'archived') {
      return NextResponse.json(
        { success: false, error: 'Cannot generate pages for an archived funnel' },
        { status: 410 },
      );
    }

    // ── 2. Verify step belongs to this funnel ─────────────────────────────────

    const [step] = await db
      .select()
      .from(funnelSteps)
      .where(eq(funnelSteps.id, stepId))
      .limit(1);

    if (!step) {
      return NextResponse.json(
        { success: false, error: 'Step not found' },
        { status: 404 },
      );
    }

    if (step.funnelId !== funnelId) {
      return NextResponse.json(
        { success: false, error: 'Step does not belong to this funnel' },
        { status: 403 },
      );
    }

    // ── 3. Load product info (from funnel's product or override) ──────────────

    let productInfo: {
      name: string;
      description: string;
      price?: string;
      originalPrice?: string;
      niche?: string;
      targetAudience?: string;
      benefits?: string[];
      guarantee?: string;
      imageUrl?: string;
    };

    if (productOverride?.name && productOverride?.description) {
      // Full override provided — use it directly
      productInfo = {
        name: productOverride.name,
        description: productOverride.description,
        price: productOverride.price,
        originalPrice: productOverride.originalPrice,
        niche: productOverride.niche,
        targetAudience: productOverride.targetAudience,
        benefits: productOverride.benefits,
        guarantee: productOverride.guarantee,
        imageUrl: productOverride.imageUrl,
      };
    } else {
      // Load from DB via funnel's productId
      if (!funnel.productId) {
        return NextResponse.json(
          {
            success: false,
            error: 'Funnel has no product linked. Provide a product override or link a product first.',
          },
          { status: 422 },
        );
      }

      const [product] = await db
        .select()
        .from(products)
        .where(eq(products.id, funnel.productId))
        .limit(1);

      if (!product) {
        return NextResponse.json(
          { success: false, error: 'Linked product not found in database' },
          { status: 404 },
        );
      }

      // Merge DB product with partial override
      productInfo = {
        name: productOverride?.name ?? product.name,
        description: productOverride?.description ?? product.description ?? '',
        price: productOverride?.price ?? product.price ?? undefined,
        originalPrice: productOverride?.originalPrice ?? product.compareAtPrice ?? undefined,
        niche: productOverride?.niche ?? undefined,
        targetAudience: productOverride?.targetAudience ?? undefined,
        benefits: productOverride?.benefits ?? undefined,
        guarantee: productOverride?.guarantee ?? undefined,
        imageUrl: productOverride?.imageUrl ?? product.images?.[0] ?? undefined,
      };
    }

    // ── 4. Load marketing angle (if specified) ───────────────────────────────

    let marketingAngle: GeneratePageRequest['marketingAngle'] | undefined;

    if (marketingAngleId) {
      const [angle] = await db
        .select()
        .from(marketingAngles)
        .where(eq(marketingAngles.id, marketingAngleId))
        .limit(1);

      if (!angle) {
        return NextResponse.json(
          { success: false, error: 'Marketing angle not found' },
          { status: 404 },
        );
      }

      if (angle.funnelId !== funnelId) {
        return NextResponse.json(
          { success: false, error: 'Marketing angle does not belong to this funnel' },
          { status: 403 },
        );
      }

      marketingAngle = {
        headline: angle.headline,
        subheadline: angle.subheadline ?? undefined,
        ctaText: angle.ctaText ?? undefined,
        benefits: angle.benefits ?? undefined,
        guarantee: angle.guarantee ?? undefined,
        painPoint: angle.painPoint ?? undefined,
      };
    }

    // ── 5. Call page generator ────────────────────────────────────────────────

    const genRequest: GeneratePageRequest = {
      pageType: pageType as PageType,
      palette: palette as PaletteKey,
      product: productInfo,
      marketingAngle,
    };

    const llmConfig = getLlmConfig();

    // WHY: Two-call pipeline — copywriter (DeepSeek) generates champion text,
    //      then composer (MiMo) places it into BlockTree structure.
    //      Feature-flagged so existing behavior is unchanged until enabled.
    const copywriterConfig = isCopywriterEnabled() ? getCopywriterConfig() : undefined;

    const result = await generatePage(genRequest, llmConfig, copywriterConfig);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error ?? 'Page generation failed',
          attempts: result.attempts,
          meta: result.meta,
        },
        { status: 422 },
      );
    }

    // ── 6. Save BlockTree into page variant ───────────────────────────────────

    const blockTree = result.blockTree;
    if (!blockTree) {
      return NextResponse.json(
        {
          success: false,
          error: 'Page generator returned success but no block tree',
          attempts: result.attempts,
          meta: result.meta,
        },
        { status: 500 },
      );
    }

    if (variantName) {
      // Create a new variant
      const [newVariant] = await db
        .insert(pageVariants)
        .values({
          stepId,
          name: variantName,
          status: 'draft',
          trafficWeight: 50,
          isControl: false,
          page: blockTree as unknown as Record<string, unknown>,
        })
        .returning();

      // Update step's active variant to the new one
      await db
        .update(funnelSteps)
        .set({ activeVariantId: newVariant.id })
        .where(eq(funnelSteps.id, stepId));
    } else {
      // Upsert into the default (control) variant for this step
      const [controlVariant] = await db
        .select()
        .from(pageVariants)
        .where(eq(pageVariants.stepId, stepId))
        .limit(1);

      if (controlVariant) {
        // Update existing variant
        await db
          .update(pageVariants)
          .set({
            page: blockTree as unknown as Record<string, unknown>,
            updatedAt: new Date(),
          })
          .where(eq(pageVariants.id, controlVariant.id));
      } else {
        // Create a default variant (shouldn't normally happen — create does this)
        const [newVariant] = await db
          .insert(pageVariants)
          .values({
            stepId,
            name: 'Default',
            status: 'draft',
            trafficWeight: 100,
            isControl: true,
            page: blockTree as unknown as Record<string, unknown>,
          })
          .returning();

        await db
          .update(funnelSteps)
          .set({ activeVariantId: newVariant.id })
          .where(eq(funnelSteps.id, stepId));
      }
    }

    // ── 7. Return result ──────────────────────────────────────────────────────

    const durationMs = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      data: {
        html: result.html,
        blockTree: result.blockTree,
        validation: result.validation,
        attempts: result.attempts,
        meta: {
          ...result.meta,
          totalDurationMs: durationMs,
        },
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    log.error('Generation failed', { error: message });
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
