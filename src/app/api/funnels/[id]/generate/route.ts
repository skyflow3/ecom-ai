/**
 * Purpose: POST /api/funnels/[id]/generate — Async page generation.
 *          Returns jobId immediately. Frontend polls for result.
 *          GET  /api/funnels/[id]/generate?jobId=xxx — Poll job status.
 * Dependencies: db, schema, page-generator, config, generate-jobs
 * Related: src/app/api/funnels/[id]/route.ts, src/services/page-generator.ts
 *
 * WHY: Generation takes 90-180s (copywriter + composer LLM calls).
 *      Cloudflare proxies timeout at 100s → error 524.
 *      Async pattern: POST returns jobId in <1s, frontend polls GET for result.
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
import { createJob, getJob, updateJob, cleanupOldJobs } from '@/lib/generate-jobs';

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

export const maxDuration = 300;

interface RouteContext {
  params: Promise<{ id: string }>;
}

// ─── GET: Poll job status ────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const jobId = request.nextUrl.searchParams.get('jobId');

  if (!jobId) {
    return NextResponse.json(
      { success: false, error: 'Missing jobId parameter' },
      { status: 400 },
    );
  }

  const job = getJob(jobId);
  if (!job) {
    return NextResponse.json(
      { success: false, error: 'Job not found' },
      { status: 404 },
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      jobId: job.id,
      status: job.status,
      progress: job.progress,
      message: job.message,
      result: job.result,
      error: job.error,
    },
  });
}

// ─── POST: Start async generation ────────────────────────────────────────────

export async function POST(
  request: NextRequest,
  context: RouteContext,
) {
  // Cleanup old jobs on each new request
  cleanupOldJobs();

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

    // ── Create job ──────────────────────────────────────────────────────────────

    const jobId = createJob();

    // ── Fire-and-forget: run generation in background ───────────────────────────

    // WHY: We do NOT await this. The POST returns jobId immediately.
    //      The background promise updates the job store as it progresses.
    //      Frontend polls GET endpoint for status updates.
    (async () => {
      try {
        updateJob(jobId, { status: 'running', progress: 10, message: 'Loading funnel data...' });

        // ── 1. Load funnel ────────────────────────────────────────────────────
        const [funnel] = await db
          .select()
          .from(funnels)
          .where(eq(funnels.id, funnelId))
          .limit(1);

        if (!funnel) {
          updateJob(jobId, { status: 'failed', error: 'Funnel not found', progress: 0 });
          return;
        }

        if (funnel.status === 'archived') {
          updateJob(jobId, { status: 'failed', error: 'Cannot generate pages for an archived funnel', progress: 0 });
          return;
        }

        // ── 2. Verify step belongs to this funnel ──────────────────────────────
        const [step] = await db
          .select()
          .from(funnelSteps)
          .where(eq(funnelSteps.id, stepId))
          .limit(1);

        if (!step) {
          updateJob(jobId, { status: 'failed', error: 'Step not found', progress: 0 });
          return;
        }

        if (step.funnelId !== funnelId) {
          updateJob(jobId, { status: 'failed', error: 'Step does not belong to this funnel', progress: 0 });
          return;
        }

        updateJob(jobId, { progress: 20, message: 'Loading product data...' });

        // ── 3. Load product info ──────────────────────────────────────────────
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
          if (!funnel.productId) {
            updateJob(jobId, {
              status: 'failed',
              error: 'Funnel has no product linked. Provide a product override or link a product first.',
              progress: 0,
            });
            return;
          }

          const [product] = await db
            .select()
            .from(products)
            .where(eq(products.id, funnel.productId))
            .limit(1);

          if (!product) {
            updateJob(jobId, { status: 'failed', error: 'Linked product not found in database', progress: 0 });
            return;
          }

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

        updateJob(jobId, { progress: 30, message: 'Loading marketing angle...' });

        // ── 4. Load marketing angle ────────────────────────────────────────────
        let marketingAngle: GeneratePageRequest['marketingAngle'] | undefined;

        if (marketingAngleId) {
          const [angle] = await db
            .select()
            .from(marketingAngles)
            .where(eq(marketingAngles.id, marketingAngleId))
            .limit(1);

          if (!angle) {
            updateJob(jobId, { status: 'failed', error: 'Marketing angle not found', progress: 0 });
            return;
          }

          if (angle.funnelId !== funnelId) {
            updateJob(jobId, { status: 'failed', error: 'Marketing angle does not belong to this funnel', progress: 0 });
            return;
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

        // ── 5. Generate page ──────────────────────────────────────────────────
        updateJob(jobId, { progress: 40, message: 'Calling AI copywriter...' });

        const genRequest: GeneratePageRequest = {
          pageType: pageType as PageType,
          palette: palette as PaletteKey,
          product: productInfo,
          marketingAngle,
        };

        const llmConfig = getLlmConfig();
        const copywriterConfig = isCopywriterEnabled() ? getCopywriterConfig() : undefined;

        const result = await generatePage(genRequest, llmConfig, copywriterConfig);

        if (!result.success || !result.blockTree) {
          // WHY: Even on failure, capture validation errors for diagnosis.
          //      Score 0 means schema validation fails — we need to see WHY.
          updateJob(jobId, {
            status: 'failed',
            error: result.error ?? 'Page generation failed',
            progress: 90,
            result: {
              html: result.html ?? '',
              blockTree: result.blockTree ?? {},
              validation: result.validation ? {
                score: result.validation.score,
                valid: result.validation.valid,
                errors: result.validation.errors.slice(0, 10),
              } : { score: 0, valid: false, errors: [] },
              attempts: result.attempts,
              meta: result.meta as Record<string, unknown>,
            },
          });
          return;
        }

        updateJob(jobId, { progress: 80, message: 'Saving to database...' });

        // ── 6. Save BlockTree ──────────────────────────────────────────────────
        const blockTree = result.blockTree;

        if (variantName) {
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

          await db
            .update(funnelSteps)
            .set({ activeVariantId: newVariant.id })
            .where(eq(funnelSteps.id, stepId));
        } else {
          const [controlVariant] = await db
            .select()
            .from(pageVariants)
            .where(eq(pageVariants.stepId, stepId))
            .limit(1);

          if (controlVariant) {
            await db
              .update(pageVariants)
              .set({
                page: blockTree as unknown as Record<string, unknown>,
                updatedAt: new Date(),
              })
              .where(eq(pageVariants.id, controlVariant.id));
          } else {
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

        // ── 7. Done ──────────────────────────────────────────────────────────
        updateJob(jobId, {
          status: 'completed',
          progress: 100,
          message: 'Page generated successfully',
          result: {
            html: result.html ?? '',
            blockTree: result.blockTree,
            validation: result.validation ? {
              score: result.validation.score,
              valid: result.validation.valid,
              errors: result.validation.errors.slice(0, 10),
            } : { score: 0, valid: false, errors: [] },
            attempts: result.attempts,
            meta: result.meta as Record<string, unknown>,
          },
        });

        log.info('Generation completed', { jobId, attempts: result.attempts, score: result.validation?.score });

      } catch (error) {
        const message = error instanceof Error ? error.message : 'Internal server error';
        log.error('Background generation failed', { jobId, error: message });
        updateJob(jobId, {
          status: 'failed',
          error: message,
          progress: 0,
        });
      }
    })();

    // ── Return jobId immediately ──────────────────────────────────────────────
    return NextResponse.json({
      success: true,
      data: {
        jobId,
        status: 'pending',
        message: 'Generation started. Poll GET ?jobId= for status.',
      },
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    log.error('Generation request failed', { error: message });
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
