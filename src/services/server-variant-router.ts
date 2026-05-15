/**
 * Purpose: Server-Side Variant Router — assigns funnel page variants for A/B testing.
 *          Reads from DB (abTests, pageVariants, funnelSteps), uses cookies for sticky sessions.
 * Dependencies: @/lib/db, @/db/schema, experiment-state-machine (traffic allocation)
 * Related: src/middleware.ts (consumer), Architecture Finale.md §3 (A/B Testing)
 *
 * WHY: Client-side routing (redirect + localStorage) adds latency and loses tracking data.
 *      Server-side routing serves the right HTML directly, sets a cookie, and the visitor
 *      never sees a redirect. This is the foundation for auto-optimization.
 *
 * FLOW:
 *   1. Middleware intercepts /funnels/{slug}/ or /funnels/{slug}/{page}
 *   2. Calls resolveVariant(funnelSlug, stepSlug, cookieValue)
 *   3. Returns { variantId, htmlPath, shouldSetCookie, cookieValue }
 *   4. Middleware rewrites to htmlPath + sets cookie if needed
 *
 * TRAFFIC ALLOCATION BY PHASE (from experiment-state-machine.ts):
 *   sandbox:    10% to test variants, 90% to champion
 *   elimination: 30% to test variants, 70% to champion
 *   commando:   50% to test variants, 50% to champion
 *   duel:       70% to test variants, 30% to champion
 *   champion:   100% to winner
 */

import { db } from '@/lib/db';
import { funnels, funnelSteps, pageVariants, abTests, testVariantMetrics } from '@/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { getTrafficAllocation, type Stage } from './experiment-state-machine';
import { createLogger } from '@/lib/logger';

const log = createLogger('variant-router');

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface VariantResolution {
  /** Whether a variant was successfully resolved */
  success: boolean;
  /** Variant UUID (for tracking) */
  variantId: string | null;
  /** HTML file path to rewrite to (relative to public/) e.g., "/funnels/turmeric/advertorial.html" */
  htmlPath: string | null;
  /** Whether to set a cookie (first-time assignment) */
  shouldSetCookie: boolean;
  /** Cookie value to set (variantId) */
  cookieValue: string | null;
  /** Cookie name that was/would be set */
  cookieName: string;
  /** Error message if resolution failed */
  error?: string;
}

// ─── Cookie naming ──────────────────────────────────────────────────────────────

/** Generate cookie name for a funnel step */
export function getVariantCookieName(funnelSlug: string, stepSlug: string): string {
  // WHY: Short prefix to minimize cookie overhead. Max cookie size is 4KB.
  return `fv_${funnelSlug}_${stepSlug}`;
}

// ─── Main Entry Point ───────────────────────────────────────────────────────────

/**
 * Resolve which variant to serve for a funnel step request.
 *
 * @param funnelSlug - URL slug of the funnel (e.g., "turmeric")
 * @param stepSlug - URL slug of the step (e.g., "advertorial"). Empty string = entry page.
 * @param cookieVariantId - Variant ID from cookie (if visitor was previously assigned)
 * @returns VariantResolution with the HTML path to serve
 */
export async function resolveVariant(
  funnelSlug: string,
  stepSlug: string,
  cookieVariantId?: string,
): Promise<VariantResolution> {
  const cookieName = getVariantCookieName(funnelSlug, stepSlug || 'entry');

  try {
    // ── Step 1: Find the funnel ──
    const [funnel] = await db.select({ id: funnels.id, slug: funnels.slug })
      .from(funnels)
      .where(eq(funnels.slug, funnelSlug))
      .limit(1);

    if (!funnel) {
      // Funnel not in DB — serve static file as-is (no A/B test)
      return fallbackResolve(funnelSlug, stepSlug, cookieName);
    }

    // ── Step 2: Find the step ──
    // WHY: stepSlug empty = entry page. Default to "entry" for DB lookup.
    const effectiveStepSlug = stepSlug || 'entry';

    const [step] = await db.select({
      id: funnelSteps.id,
      slug: funnelSteps.slug,
      activeVariantId: funnelSteps.activeVariantId,
    })
      .from(funnelSteps)
      .where(and(
        eq(funnelSteps.funnelId, funnel.id),
        eq(funnelSteps.slug, effectiveStepSlug),
      ))
      .limit(1);

    if (!step) {
      // Step not in DB — serve static file as-is
      return fallbackResolve(funnelSlug, stepSlug, cookieName);
    }

    // ── Step 3: Check for active A/B test on this step ──
    const [activeTest] = await db.select({
      id: abTests.id,
      phase: abTests.phase,
      winnerVariantId: abTests.winnerVariantId,
    })
      .from(abTests)
      .where(and(
        eq(abTests.stepId, step.id),
        eq(abTests.status, 'running'),
      ))
      .limit(1);

    if (!activeTest) {
      // No active test — serve the active variant or default file
      if (step.activeVariantId) {
        const variantHtmlPath = await getVariantHtmlPath(step.activeVariantId);
        return {
          success: true,
          variantId: step.activeVariantId,
          htmlPath: variantHtmlPath,
          shouldSetCookie: false,
          cookieValue: null,
          cookieName,
        };
      }
      return fallbackResolve(funnelSlug, stepSlug, cookieName);
    }

    // ── Step 4: Handle champion phase (100% winner) ──
    if (activeTest.phase === 'champion' && activeTest.winnerVariantId) {
      const variantHtmlPath = await getVariantHtmlPath(activeTest.winnerVariantId);
      return {
        success: true,
        variantId: activeTest.winnerVariantId,
        htmlPath: variantHtmlPath,
        shouldSetCookie: cookieVariantId !== activeTest.winnerVariantId,
        cookieValue: activeTest.winnerVariantId,
        cookieName,
      };
    }

    // ── Step 5: Check cookie for sticky session ──
    if (cookieVariantId) {
      // Verify this variant is still active in the test
      const isValidVariant = await isVariantInTest(cookieVariantId, activeTest.id);
      if (isValidVariant) {
        const variantHtmlPath = await getVariantHtmlPath(cookieVariantId);
        return {
          success: true,
          variantId: cookieVariantId,
          htmlPath: variantHtmlPath,
          shouldSetCookie: false,
          cookieValue: null,
          cookieName,
        };
      }
      // WHY: Cookie variant was eliminated — reassign fresh
    }

    // ── Step 6: Assign variant based on test phase + traffic allocation ──
    const assignment = await assignTestVariant(activeTest.id, activeTest.phase as Stage);

    if (!assignment) {
      return fallbackResolve(funnelSlug, stepSlug, cookieName);
    }

    const variantHtmlPath = await getVariantHtmlPath(assignment.variantId);
    return {
      success: true,
      variantId: assignment.variantId,
      htmlPath: variantHtmlPath,
      shouldSetCookie: true,
      cookieValue: assignment.variantId,
      cookieName,
    };

  } catch (error) {
    log.error('Variant resolution failed', {
      funnelSlug,
      stepSlug,
      error: error instanceof Error ? error.message : String(error),
    });
    // WHY: Never break the page — always fall back to static file
    return fallbackResolve(funnelSlug, stepSlug, cookieName);
  }
}

// ─── Variant Assignment ─────────────────────────────────────────────────────────

interface TestVariant {
  variantId: string;
  trafficWeight: number;
  isControl: boolean;
}

/**
 * Assign a variant for a new visitor based on the test phase.
 * Uses traffic allocation from the state machine.
 */
async function assignTestVariant(testId: string, phase: Stage): Promise<{ variantId: string } | null> {
  // Get all active (non-eliminated) variants in this test
  const testVariants = await db.select({
    variantId: testVariantMetrics.variantId,
  })
    .from(testVariantMetrics)
    .where(and(
      eq(testVariantMetrics.testId, testId),
      sql`${testVariantMetrics.eliminatedAt} IS NULL`,
    ));

  if (testVariants.length === 0) return null;

  if (testVariants.length === 1) {
    return { variantId: testVariants[0].variantId };
  }

  // Get page variant details for traffic weights
  const variantIds = testVariants.map(tv => tv.variantId);

  // WHY: For sandbox/elimination/commando phases, traffic is split between test variants.
  //      The state machine defines what % of TOTAL traffic goes to the experiment.
  //      For simplicity in the MVP, we split experiment traffic equally among active variants.
  const allocation = getTrafficAllocation(phase);

  // WHY: weighted random selection among active variants
  //      In MVP: equal split. In V2: use actual trafficWeight from pageVariants.
  const randomIndex = Math.floor(Math.random() * variantIds.length);
  const selectedVariantId = variantIds[randomIndex];

  // WHY: Respect traffic allocation — only assign to test if random < allocation
  //      Otherwise, fall through to default (champion/control) variant.
  //      This ensures sandbox tests only get 10% of traffic, etc.
  if (Math.random() > allocation.experimentTraffic) {
    // Visitor goes to control/champion — find the control variant
    const controlVariant = await db.select({ variantId: pageVariants.id })
      .from(pageVariants)
      .where(and(
        sql`${pageVariants.id} IN (${sql.join(variantIds.map(id => sql`${id}`), sql`, `)})`,
        eq(pageVariants.isControl, true),
      ))
      .limit(1);

    if (controlVariant.length > 0) {
      return { variantId: controlVariant[0].variantId };
    }
    // No control marked — use first variant
    return { variantId: variantIds[0] };
  }

  return { variantId: selectedVariantId };
}

// ─── Helpers ────────────────────────────────────────────────────────────────────

/**
 * Get the HTML file path for a variant from its deployedUrl.
 * Falls back to a convention-based path if deployedUrl is not set.
 */
async function getVariantHtmlPath(variantId: string): Promise<string> {
  const [variant] = await db.select({
    deployedUrl: pageVariants.deployedUrl,
    name: pageVariants.name,
    stepId: pageVariants.stepId,
  })
    .from(pageVariants)
    .where(eq(pageVariants.id, variantId))
    .limit(1);

  if (variant?.deployedUrl) {
    return variant.deployedUrl;
  }

  // Fallback: convention-based path from variant name
  // WHY: Template-generated pages may not have deployedUrl set yet
  return `/funnels/unknown/${variant?.name || 'index'}.html`;
}

/**
 * Check if a variant is still active (not eliminated) in a given test.
 */
async function isVariantInTest(variantId: string, testId: string): Promise<boolean> {
  const [metric] = await db.select({ id: testVariantMetrics.id })
    .from(testVariantMetrics)
    .where(and(
      eq(testVariantMetrics.variantId, variantId),
      eq(testVariantMetrics.testId, testId),
      sql`${testVariantMetrics.eliminatedAt} IS NULL`,
    ))
    .limit(1);

  return !!metric;
}

/**
 * Fallback resolution when no DB data exists.
 * Serves the default static file based on URL conventions.
 */
function fallbackResolve(
  funnelSlug: string,
  stepSlug: string,
  cookieName: string,
): VariantResolution {
  // WHY: When no A/B test is running, serve the static file directly.
  //      Entry page (/funnels/turmeric/) → advertorial.html
  //      Other pages (/funnels/turmeric/product) → product.html
  const filename = stepSlug
    ? `${stepSlug}.html`
    : 'advertorial.html';

  return {
    success: true,
    variantId: null,
    htmlPath: `/funnels/${funnelSlug}/${filename}`,
    shouldSetCookie: false,
    cookieValue: null,
    cookieName,
  };
}
