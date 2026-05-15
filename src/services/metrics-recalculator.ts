/**
 * Purpose: Metrics Recalculator — aggregates 5-min metrics into testVariantMetrics.
 *          Recalculates CVR, AOV, and AOV×CVR for A/B test decision engine.
 * Dependencies: @/lib/db, @/db/schema (metrics5min, testVariantMetrics)
 * Related: ab-evaluation worker (caller), experiment-state-machine.ts (consumer)
 *
 * WHY: The tracking endpoint increments testVariantMetrics row-by-row (visitors++, clicks++).
 *      But CVR, AOV, and AOV×CVR need to be RECALCULATED periodically from the raw data,
 *      not just incremented. This service does that — called by the evaluation worker.
 *
 * FLOW:
 *   1. For each active test variant:
 *      a. Sum visitors, clicks, purchases, revenue from testVariantMetrics (already incremented)
 *      b. Calculate CVR = purchases / visitors
 *      c. Calculate AOV = revenue / purchases
 *      d. Calculate AOV×CVR = CVR × AOV
 *      e. Update testVariantMetrics with calculated values
 */

import { db } from '@/lib/db';
import { testVariantMetrics, abTests } from '@/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { createLogger } from '@/lib/logger';

const log = createLogger('metrics-recalculator');

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface RecalcResult {
  testId: string;
  variantId: string;
  visitors: number;
  clicks: number;
  purchases: number;
  revenue: number;
  cvr: number;
  aov: number;
  aovTimesCvr: number;
}

// ─── Main Entry Point ───────────────────────────────────────────────────────────

/**
 * Recalculate derived metrics (CVR, AOV, AOV×CVR) for all variants in active tests.
 * Called by the A/B evaluation worker before each stage evaluation.
 *
 * @returns Array of recalculated results for logging/debugging
 */
export async function recalculateAllActiveTests(): Promise<RecalcResult[]> {
  const results: RecalcResult[] = [];

  try {
    // Get all active (running) tests
    const activeTests = await db.select({
      id: abTests.id,
    })
      .from(abTests)
      .where(eq(abTests.status, 'running'));

    for (const test of activeTests) {
      const testResults = await recalculateTestMetrics(test.id);
      results.push(...testResults);
    }

    log.info('Metrics recalculated', {
      testCount: activeTests.length,
      variantCount: results.length,
    });

  } catch (error) {
    log.error('Metrics recalculation failed', {
      error: error instanceof Error ? error.message : String(error),
    });
  }

  return results;
}

/**
 * Recalculate metrics for all variants in a specific test.
 */
export async function recalculateTestMetrics(testId: string): Promise<RecalcResult[]> {
  const results: RecalcResult[] = [];

  const metrics = await db.select({
    id: testVariantMetrics.id,
    variantId: testVariantMetrics.variantId,
    visitors: testVariantMetrics.visitors,
    clicks: testVariantMetrics.clicks,
    purchases: testVariantMetrics.purchases,
    revenue: testVariantMetrics.revenue,
  })
    .from(testVariantMetrics)
    .where(and(
      eq(testVariantMetrics.testId, testId),
      sql`${testVariantMetrics.eliminatedAt} IS NULL`,
    ));

  for (const metric of metrics) {
    const visitors = metric.visitors ?? 0;
    const clicks = metric.clicks ?? 0;
    const purchases = metric.purchases ?? 0;
    const revenue = Number(metric.revenue ?? 0);

    // WHY: CVR = purchases / visitors (not clicks/visitors).
    //      The decision engine optimizes for revenue, not click-through.
    const cvr = visitors > 0 ? purchases / visitors : 0;
    const aov = purchases > 0 ? revenue / purchases : 0;
    const aovTimesCvr = cvr * aov;

    // Update the calculated columns
    await db.update(testVariantMetrics)
      .set({
        cvr: cvr.toFixed(4),
        aov: aov.toFixed(2),
        aovTimesCvr: aovTimesCvr.toFixed(4),
        updatedAt: new Date(),
      })
      .where(eq(testVariantMetrics.id, metric.id));

    results.push({
      testId,
      variantId: metric.variantId,
      visitors,
      clicks,
      purchases,
      revenue,
      cvr,
      aov,
      aovTimesCvr,
    });
  }

  return results;
}
