/**
 * Purpose: POST /api/funnels/[id]/deploy — Deploy a funnel step variant to static storage.
 *          Validates the funnel exists, resolves the variant (specified or active),
 *          calls deployVariant(), and returns the deployed URL.
 * Dependencies: services/deploy-pipeline.ts, lib/db.ts, drizzle-orm
 * Related: src/app/api/funnels/[id]/generate/route.ts
 *
 * Request body:
 *   { stepId: string, variantId?: string }
 *
 * Response:
 *   { success, url?, html?, r2Key?, validation?, error? }
 */

import { NextRequest, NextResponse } from 'next/server';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../../../../../lib/db';
import { funnels, funnelSteps, pageVariants } from '../../../../../db/schema';
import { deployVariant } from '../../../../../services/deploy-pipeline';
import { createLogger } from '../../../../../lib/logger';

const log = createLogger('api:deploy');

// ─── Request Schema ────────────────────────────────────────────────────────────

const deployRequestSchema = z.object({
  /** Which step to deploy (funnel_step UUID) */
  stepId: z.string().uuid(),
  /** Specific variant to deploy. If omitted, uses the step's active variant. */
  variantId: z.string().uuid().optional(),
});

// ─── POST Handler ──────────────────────────────────────────────────────────────

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: funnelId } = await params;

    // 1. Parse and validate request body
    const body = await request.json();
    const parsed = deployRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request',
          details: parsed.error.issues.map(i => ({
            path: i.path.join('.'),
            message: i.message,
          })),
        },
        { status: 400 },
      );
    }

    const { stepId, variantId: requestedVariantId } = parsed.data;

    // 2. Validate the funnel exists
    const funnelRows = await db
      .select({ id: funnels.id })
      .from(funnels)
      .where(eq(funnels.id, funnelId))
      .limit(1);

    if (funnelRows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Funnel not found' },
        { status: 404 },
      );
    }

    // 3. Validate the step belongs to this funnel
    const stepRows = await db
      .select({
        id: funnelSteps.id,
        activeVariantId: funnelSteps.activeVariantId,
      })
      .from(funnelSteps)
      .where(
        and(
          eq(funnelSteps.id, stepId),
          eq(funnelSteps.funnelId, funnelId),
        ),
      )
      .limit(1);

    if (stepRows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Step not found in this funnel' },
        { status: 404 },
      );
    }

    // 4. Resolve the variant to deploy
    const variantId = requestedVariantId ?? stepRows[0].activeVariantId;

    if (!variantId) {
      return NextResponse.json(
        { success: false, error: 'No variant specified and step has no active variant' },
        { status: 400 },
      );
    }

    // Verify the variant exists and belongs to this step
    const variantRows = await db
      .select({ id: pageVariants.id })
      .from(pageVariants)
      .where(
        and(
          eq(pageVariants.id, variantId),
          eq(pageVariants.stepId, stepId),
        ),
      )
      .limit(1);

    if (variantRows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Variant not found for this step' },
        { status: 404 },
      );
    }

    // 5. Deploy
    const result = await deployVariant(variantId);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          validation: result.validation,
        },
        { status: 422 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        url: result.url,
        r2Key: result.r2Key,
        validation: result.validation,
      },
      { status: 200 },
    );

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    log.error('Deploy failed', { error: message });
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
