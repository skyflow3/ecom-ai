/**
 * Purpose: Funnel list + create API routes.
 *          GET  /api/funnels?page=1&limit=20 — paginated funnel list
 *          POST /api/funnels                  — create funnel with default steps
 * Dependencies: db, schema, zod
 * Related: src/app/api/funnels/[id]/route.ts
 *
 * WHY: Creating a funnel auto-generates the 5 standard funnel steps
 *      (product-page, checkout, upsell, downsell, thank-you) with
 *      an empty default variant each. This guarantees every funnel
 *      is immediately usable by the page generator.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { eq, desc, sql, like } from 'drizzle-orm';
import { db } from '@/lib/db';
import { funnels, funnelSteps, pageVariants } from '@/db/schema';
import { stepTypeEnum } from '@/db/schema/enums';
import { createLogger } from '@/lib/logger';

const log = createLogger('api:funnels');

// ─── Validation Schemas ───────────────────────────────────────────────────────

const UUID = z.string().uuid();

const createFunnelSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Slug must be lowercase, alphanumeric, dashes only (e.g. my-product-funnel)',
    ),
  productId: UUID.optional(),
  domain: z.string().max(253).optional(),
  subdomain: z.string().max(63).optional(),
});

const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(['draft', 'active', 'paused', 'archived']).optional(),
  search: z.string().max(200).optional(),
});

// ─── Default Funnel Steps Template ────────────────────────────────────────────
// WHY: Every funnel needs the standard 5-step flow. Product-page sells,
//      checkout converts, upsell increases AOV, downsell recovers, thank-you confirms.

const DEFAULT_STEPS: Array<{
  type: (typeof stepTypeEnum.enumValues)[number];
  name: string;
  slug: string;
  sortOrder: number;
}> = [
  { type: 'product-page', name: 'Product Page', slug: 'product-page', sortOrder: 1 },
  { type: 'checkout', name: 'Checkout', slug: 'checkout', sortOrder: 2 },
  { type: 'upsell', name: 'Upsell', slug: 'upsell', sortOrder: 3 },
  { type: 'downsell', name: 'Downsell', slug: 'downsell', sortOrder: 4 },
  { type: 'thank-you', name: 'Thank You', slug: 'thank-you', sortOrder: 5 },
];

/** Empty BlockTree JSON — placeholder until page generator fills it */
const EMPTY_BLOCK_TREE = {
  version: '1.0',
  pageType: 'product-page',
  palette: 'health-warm',
  blocks: [],
  metadata: { title: 'Untitled', description: '' },
};

// ─── GET /api/funnels ─────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = paginationSchema.safeParse(
      Object.fromEntries(searchParams.entries()),
    );

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid query parameters',
          details: parsed.error.issues.map((i) => ({
            path: i.path.join('.'),
            message: i.message,
          })),
        },
        { status: 400 },
      );
    }

    const { page, limit, status, search } = parsed.data;
    const offset = (page - 1) * limit;

    // Build WHERE conditions
    const conditions = [];
    if (status) {
      conditions.push(eq(funnels.status, status));
    }
    if (search) {
      conditions.push(like(funnels.name, `%${search}%`));
    }

    // Fetch funnels + total count in parallel
    const [funnelRows, countResult] = await Promise.all([
      db
        .select()
        .from(funnels)
        .where(conditions.length > 0 ? sql`${sql.join(conditions, sql` AND `)}` : undefined)
        .orderBy(desc(funnels.createdAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(funnels)
        .where(conditions.length > 0 ? sql`${sql.join(conditions, sql` AND `)}` : undefined),
    ]);

    const total = countResult[0]?.count ?? 0;

    return NextResponse.json({
      success: true,
      data: funnelRows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    log.error('List failed', { error: message });
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}

// ─── POST /api/funnels ────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createFunnelSchema.safeParse(body);

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

    const { name, slug, productId, domain, subdomain } = parsed.data;

    // Check slug uniqueness — Drizzle unique constraint would throw but
    // we give a friendlier error message
    const existing = await db
      .select({ id: funnels.id })
      .from(funnels)
      .where(eq(funnels.slug, slug))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Slug "${slug}" is already taken by another funnel`,
        },
        { status: 409 },
      );
    }

    // Insert funnel
    const [newFunnel] = await db
      .insert(funnels)
      .values({
        name,
        slug,
        productId: productId ?? null,
        domain: domain ?? null,
        subdomain: subdomain ?? null,
        status: 'draft',
      })
      .returning();

    // Insert default steps + default empty variant for each step
    // WHY: Each step needs at least one variant so the page generator
    //      has somewhere to write the BlockTree output.
    for (const step of DEFAULT_STEPS) {
      const [newStep] = await db
        .insert(funnelSteps)
        .values({
          funnelId: newFunnel.id,
          type: step.type,
          name: step.name,
          slug: step.slug,
          sortOrder: step.sortOrder,
        })
        .returning();

      await db.insert(pageVariants).values({
        stepId: newStep.id,
        name: 'Default',
        status: 'draft',
        trafficWeight: 100,
        isControl: true,
        page: {
          ...EMPTY_BLOCK_TREE,
          pageType: step.type === 'product-page' ? 'product-page' : step.type,
        },
      });
    }

    // Return the full funnel with steps
    const steps = await db
      .select()
      .from(funnelSteps)
      .where(eq(funnelSteps.funnelId, newFunnel.id))
      .orderBy(funnelSteps.sortOrder);

    return NextResponse.json(
      {
        success: true,
        data: {
          ...newFunnel,
          steps,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    log.error('Create failed', { error: message });
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
