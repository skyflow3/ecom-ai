/**
 * Purpose: POST /api/track — Client-side event tracking endpoint
 * Dependencies: drizzle-orm, zod, schema (rawEvents, events)
 * Related: src/db/schema/analytics.ts, /api/events/capi, /api/track/script
 *
 * WHY: Fast ingestion endpoint for all client-side events.
 *      rawEvents = ingestion buffer (append-only, no FK constraints = fast writes).
 *      events = structured table with funnel/variant linkage for analytics queries.
 *      pageview also increments variant metrics — the most common event must be <50ms.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { rawEvents, events, metrics5min, testVariantMetrics } from '@/db/schema';
import { eq, and, gte, sql } from 'drizzle-orm';
import { createLogger } from '@/lib/logger';

const log = createLogger('api:track');

// ─── Request Schema ──────────────────────────────────────────────────────────

const TRACK_EVENTS = [
  'pageview',
  'scroll',
  'click',
  'cta_click',
  'form_start',
  'form_submit',
  'purchase',
] as const;

type TrackEvent = (typeof TRACK_EVENTS)[number];

/**
 * WHY: Client-side sends lowercase event names (pageview, cta_click).
 *      The DB eventTypeEnum uses PascalCase (PageView, click, scroll, form_submit).
 *      This map bridges the gap — events table gets valid enum values.
 */
const CLIENT_TO_DB_EVENT: Record<TrackEvent, string> = {
  pageview: 'PageView',
  scroll: 'scroll',
  click: 'click',
  cta_click: 'click',
  form_start: 'click',
  form_submit: 'form_submit',
  purchase: 'Purchase',
};

const trackRequestSchema = z.object({
  variantId: z.string().uuid(),
  event: z.enum(TRACK_EVENTS),
  data: z
    .object({
      blockId: z.string().optional(),
      scrollDepth: z.number().min(0).max(100).optional(),
      timeOnPage: z.number().min(0).optional(),
      elementId: z.string().optional(),
      metadata: z.record(z.unknown()).optional(),
    })
    .optional(),
  sessionId: z.string().min(1),
  url: z.string().optional(),
  referrer: z.string().optional(),
  userAgent: z.string().optional(),
});

type TrackRequestBody = z.infer<typeof trackRequestSchema>;

// ─── 5-minute bucket helper ──────────────────────────────────────────────────
// WHY: Rounds timestamp down to current 5-min bucket for metrics aggregation

function get5minBucket(): Date {
  const now = new Date();
  const minutes = now.getMinutes();
  const bucketMinutes = Math.floor(minutes / 5) * 5;
  now.setMinutes(bucketMinutes, 0, 0);
  return now;
}

// ─── Metrics increment helper ────────────────────────────────────────────────

async function incrementVariantMetrics(
  variantId: string,
  eventType: TrackEvent,
): Promise<void> {
  const bucket = get5minBucket();

  // Map event type to column increment
  const columnMap: Partial<Record<TrackEvent, 'views' | 'clicks' | 'purchases'>> = {
    pageview: 'views',
    click: 'clicks',
    cta_click: 'clicks',
    purchase: 'purchases',
  };

  const column = columnMap[eventType];
  if (!column) return; // scroll, form_start, form_submit don't increment metrics5min

  try {
    // WHY: Upsert pattern — create bucket row if missing, increment if exists.
    // Each column uses an explicit SQL increment to avoid dynamic column access issues.
    const incrementViews = column === 'views' ? sql`${metrics5min.views} + 1` : metrics5min.views;
    const incrementClicks = column === 'clicks' ? sql`${metrics5min.clicks} + 1` : metrics5min.clicks;
    const incrementPurchases = column === 'purchases' ? sql`${metrics5min.purchases} + 1` : metrics5min.purchases;

    await db
      .insert(metrics5min)
      .values({
        variantId,
        bucket,
        views: column === 'views' ? 1 : 0,
        clicks: column === 'clicks' ? 1 : 0,
        purchases: column === 'purchases' ? 1 : 0,
      })
      .onConflictDoUpdate({
        target: [metrics5min.variantId, metrics5min.bucket],
        set: {
          views: incrementViews,
          clicks: incrementClicks,
          purchases: incrementPurchases,
        },
      });
  } catch {
    // WHY: Metrics increment failure must NOT block the tracking response.
    // The raw event is already saved — metrics can be recomputed later.
  }
}

// ─── A/B Test metrics increment ──────────────────────────────────────────────

/**
 * WHY: When a variantId belongs to an active A/B test, we also increment
 *      the testVariantMetrics table. This is the data the decision engine reads
 *      to evaluate stage transitions (sandbox → elimination → ... → champion).
 *
 *      This is fire-and-forget — must not slow down the tracking response.
 *      If no active test exists for this variant, the query does nothing.
 */
async function incrementAbTestMetrics(
  variantId: string,
  eventType: TrackEvent,
  metadata?: Record<string, unknown>,
): Promise<void> {
  try {
    // Map event type to column increments
    const updates: Record<string, unknown> = {};

    if (eventType === 'pageview') {
      updates.visitors = sql`${testVariantMetrics.visitors} + 1`;
    } else if (eventType === 'cta_click') {
      updates.clicks = sql`${testVariantMetrics.clicks} + 1`;
    } else if (eventType === 'purchase') {
      updates.purchases = sql`${testVariantMetrics.purchases} + 1`;
      // WHY: Revenue comes from metadata (set by Stripe webhook)
      const revenue = Number(metadata?.revenue ?? 0);
      if (revenue > 0) {
        updates.revenue = sql`${testVariantMetrics.revenue} + ${revenue.toFixed(2)}`;
      }
    }

    if (Object.keys(updates).length === 0) return;

    // WHY: Only update if this variant belongs to an active test.
    //      The variantId appears in testVariantMetrics for ALL tests it's part of.
    await db
      .update(testVariantMetrics)
      .set(updates)
      .where(and(
        eq(testVariantMetrics.variantId, variantId),
        sql`${testVariantMetrics.eliminatedAt} IS NULL`,
      ));
  } catch {
    // WHY: A/B metrics increment failure must NOT block anything.
    //      Metrics can be recalculated from raw events later.
  }
}

// ─── POST Handler ────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body: unknown = await request.json();
    const parsed = trackRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid request', details: parsed.error.issues },
        { status: 400 },
      );
    }

    const { variantId, event, data, sessionId, url, referrer, userAgent } = parsed.data;

    // Generate dedup-safe event ID: sessionId + event + variantId + timestamp-minute
    // WHY: Prevents duplicate tracking from browser retries without storing state
    const minuteBucket = Math.floor(Date.now() / 60000);
    const eventId = `${sessionId}:${event}:${variantId}:${minuteBucket}`;

    // Build payload from all incoming data
    const payload: Record<string, unknown> = {
      variantId,
      event,
      ...(data ?? {}),
      ...(url ? { url } : {}),
      ...(referrer ? { referrer } : {}),
      ...(userAgent ? { userAgent } : {}),
    };

    // Write to rawEvents (ingestion buffer — always succeeds, no FK checks)
    await db.insert(rawEvents).values({
      eventId,
      eventType: event,
      sessionId,
      payload,
    });

    // Write to structured events table for analytics queries
    // WHY: rawEvents is the append-only buffer. events table has variant/funnel linkage
    // for JOIN queries in dashboards. Two writes are intentional — separation of concerns.
    // eventType is mapped to DB enum values (pageview → PageView, cta_click → click, etc.)
    try {
      await db.insert(events).values({
        eventType: CLIENT_TO_DB_EVENT[event] as 'PageView' | 'ViewContent' | 'AddToCart' | 'InitiateCheckout' | 'Purchase' | 'click' | 'scroll' | 'form_submit',
        eventId,
        variantId,
        sessionId,
        blockId: data?.blockId ?? null,
        payload: {
          ...payload,
          clientEvent: event, // WHY: Preserve original client event name for debugging
          ...(data?.scrollDepth != null ? { scrollDepth: data.scrollDepth } : {}),
          ...(data?.timeOnPage != null ? { timeOnPage: data.timeOnPage } : {}),
          ...(data?.elementId ? { elementId: data.elementId } : {}),
          ...(data?.metadata ? { metadata: data.metadata } : {}),
        },
      });
    } catch {
      // WHY: Duplicate eventId from events table = retry, not a real error.
      // rawEvents already has it. Events table has eventId as unique via rawEvents PK.
    }

    // Increment variant metrics for pageview (fire-and-forget, non-blocking)
    if (event === 'pageview' || event === 'click' || event === 'cta_click' || event === 'purchase') {
      // WHY: Don't await — metrics increment should not slow down the response
      incrementVariantMetrics(variantId, event).catch(() => {});
    }

    // WHY: Also increment A/B test variant metrics so the decision engine
    //      has real-time data to evaluate stage transitions.
    //      Fire-and-forget — must not block the response.
    if (event === 'pageview' || event === 'cta_click' || event === 'purchase') {
      incrementAbTestMetrics(variantId, event, data?.metadata).catch(() => {});
    }

    const elapsed = Date.now() - startTime;

    return NextResponse.json(
      { success: true, eventId },
      {
        status: 200,
        headers: {
          // WHY: Cache-control prevents CDN/proxy from caching tracking responses
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'X-Response-Time': `${elapsed}ms`,
        },
      },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    log.error('Track failed', { error: message });
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}

// ─── OPTIONS (CORS preflight) ────────────────────────────────────────────────
// WHY: Tracking script may be loaded from a different origin (funnel domain)

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}
