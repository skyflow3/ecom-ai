/**
 * Purpose: Single funnel CRUD — get full funnel, update, soft-delete.
 *          GET    /api/funnels/[id] — funnel + steps + active variants + angles
 *          PATCH  /api/funnels/[id] — update name/slug/domain/status
 *          DELETE /api/funnels/[id] — soft delete (status = 'archived')
 * Dependencies: db, schema, zod
 * Related: src/app/api/funnels/route.ts (list + create)
 *
 * WHY: GET loads everything a page editor needs in one call — funnel details,
 *      all steps, their active variants, and marketing angles. No N+1 fetches
 *      on the client side.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { eq, asc, inArray } from 'drizzle-orm';
import { db } from '@/lib/db';
import {
  funnels,
  funnelSteps,
  pageVariants,
  marketingAngles,
} from '@/db/schema';
import { createLogger } from '@/lib/logger';

const log = createLogger('api:funnels:id');

// ─── Validation ───────────────────────────────────────────────────────────────

const UUID_SCHEMA = z.string().uuid();

const updateFunnelSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug: lowercase, alphanumeric, dashes only')
    .optional(),
  domain: z.string().max(253).nullable().optional(),
  subdomain: z.string().max(63).nullable().optional(),
  status: z.enum(['draft', 'active', 'paused']).optional(),
  // NOTE: status 'archived' is reserved for DELETE (soft-delete).
  //       Setting status via PATCH only allows draft/active/paused.
  productId: z.string().uuid().nullable().optional(),
});

// ─── Route Segment Config ─────────────────────────────────────────────────────

interface RouteContext {
  params: Promise<{ id: string }>;
}

// ─── GET /api/funnels/[id] ────────────────────────────────────────────────────

export async function GET(
  _request: NextRequest,
  context: RouteContext,
) {
  try {
    const { id } = await context.params;

    if (!UUID_SCHEMA.safeParse(id).success) {
      return NextResponse.json(
        { success: false, error: 'Invalid funnel ID — must be a UUID' },
        { status: 400 },
      );
    }

    // Fetch funnel
    const [funnel] = await db
      .select()
      .from(funnels)
      .where(eq(funnels.id, id))
      .limit(1);

    if (!funnel) {
      return NextResponse.json(
        { success: false, error: 'Funnel not found' },
        { status: 404 },
      );
    }

    if (funnel.status === 'archived') {
      return NextResponse.json(
        { success: false, error: 'Funnel is archived' },
        { status: 410 },
      );
    }

    // Fetch steps, active variants, and marketing angles in parallel
    const [steps, angles] = await Promise.all([
      db
        .select()
        .from(funnelSteps)
        .where(eq(funnelSteps.funnelId, id))
        .orderBy(asc(funnelSteps.sortOrder)),
      db
        .select()
        .from(marketingAngles)
        .where(eq(marketingAngles.funnelId, id))
        .orderBy(asc(marketingAngles.createdAt)),
    ]);

    // Fetch variants for all steps in one query (using IN clause)
    const stepIds = steps.map((s) => s.id);
    const allVariants = stepIds.length > 0
      ? await db
          .select()
          .from(pageVariants)
          .where(inArray(pageVariants.stepId, stepIds))
      : [];

    // Group variants by stepId
    const variantsByStep = new Map<string, typeof allVariants>();
    for (const v of allVariants) {
      const list = variantsByStep.get(v.stepId) ?? [];
      list.push(v);
      variantsByStep.set(v.stepId, list);
    }

    // Attach variants to their steps
    const stepsWithVariants = steps.map((step) => ({
      ...step,
      variants: variantsByStep.get(step.id) ?? [],
    }));

    return NextResponse.json({
      success: true,
      data: {
        ...funnel,
        steps: stepsWithVariants,
        marketingAngles: angles,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    log.error('Get failed', { error: message });
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}

// ─── PATCH /api/funnels/[id] ──────────────────────────────────────────────────

export async function PATCH(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    const { id } = await context.params;

    if (!UUID_SCHEMA.safeParse(id).success) {
      return NextResponse.json(
        { success: false, error: 'Invalid funnel ID — must be a UUID' },
        { status: 400 },
      );
    }

    const body = await request.json();
    const parsed = updateFunnelSchema.safeParse(body);

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

    // Verify funnel exists and is not archived
    const [existing] = await db
      .select({ id: funnels.id, status: funnels.status })
      .from(funnels)
      .where(eq(funnels.id, id))
      .limit(1);

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Funnel not found' },
        { status: 404 },
      );
    }

    if (existing.status === 'archived') {
      return NextResponse.json(
        { success: false, error: 'Cannot update an archived funnel' },
        { status: 410 },
      );
    }

    // If slug is changing, check uniqueness
    if (parsed.data.slug !== undefined) {
      const [slugConflict] = await db
        .select({ id: funnels.id })
        .from(funnels)
        .where(eq(funnels.slug, parsed.data.slug))
        .limit(1);

      if (slugConflict && slugConflict.id !== id) {
        return NextResponse.json(
          {
            success: false,
            error: `Slug "${parsed.data.slug}" is already taken by another funnel`,
          },
          { status: 409 },
        );
      }
    }

    // Update funnel
    const [updated] = await db
      .update(funnels)
      .set({
        ...parsed.data,
        updatedAt: new Date(),
      })
      .where(eq(funnels.id, id))
      .returning();

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    log.error('Update failed', { error: message });
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}

// ─── DELETE /api/funnels/[id] ─────────────────────────────────────────────────

export async function DELETE(
  _request: NextRequest,
  context: RouteContext,
) {
  try {
    const { id } = await context.params;

    if (!UUID_SCHEMA.safeParse(id).success) {
      return NextResponse.json(
        { success: false, error: 'Invalid funnel ID — must be a UUID' },
        { status: 400 },
      );
    }

    // Check existence
    const [existing] = await db
      .select({ id: funnels.id, status: funnels.status })
      .from(funnels)
      .where(eq(funnels.id, id))
      .limit(1);

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Funnel not found' },
        { status: 404 },
      );
    }

    if (existing.status === 'archived') {
      return NextResponse.json(
        { success: false, error: 'Funnel is already archived' },
        { status: 410 },
      );
    }

    // Soft delete — set status to 'archived'
    const [archived] = await db
      .update(funnels)
      .set({
        status: 'archived',
        updatedAt: new Date(),
      })
      .where(eq(funnels.id, id))
      .returning();

    return NextResponse.json({
      success: true,
      data: archived,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    log.error('Delete failed', { error: message });
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
