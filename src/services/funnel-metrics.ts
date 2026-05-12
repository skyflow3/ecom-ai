/**
 * Purpose: Funnel Metrics — JSON-file-based tracking for A/B test results.
 *          No database needed. Each funnel gets a metrics.json with page views + CTA clicks.
 * Dependencies: None (fs + JSON only)
 * Related: funnel-generator.ts (initializes metrics), variant-router.ts (routing)
 *
 * WHY: AI agents need data to make decisions about which variant wins.
 *      This provides a simple tracking layer that works with static deployments.
 *
 * TRACKING FLOW:
 *   1. generateFunnel() calls initMetrics() → creates metrics.json
 *   2. Each generated HTML page has a tracking snippet injected
 *   3. On page load: snippet sends pageView event
 *   4. On CTA click: snippet sends ctaClick event
 *   5. AI agent reads metrics with getMetrics() or getLeaderboard()
 *
 * STATIC DEPLOYMENT:
 *   - Tracking snippet logs to localStorage as fallback
 *   - With a /api/track endpoint: logs to metrics.json server-side
 *   - Without endpoint: data accumulates in localStorage, exportable as JSON
 */

import * as fs from 'fs';
import * as path from 'path';

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface VariantMetrics {
  variantId: string;
  pageViews: number;
  ctaClicks: number;
  /** Per-CTA click counts: cta_url → count */
  ctas: Record<string, number>;
  /** Conversion rate: ctaClicks / pageViews (0 if no views) */
  cvr: number;
}

export interface StepMetrics {
  stepId: string;
  variants: VariantMetrics[];
  totalViews: number;
  /** Variant ID with highest CVR */
  bestVariant: string | null;
}

export interface FunnelMetrics {
  funnelId: string;
  createdAt: string;
  updatedAt: string;
  steps: Record<string, StepMetrics>;
}

export interface LeaderboardEntry {
  variantId: string;
  pageViews: number;
  ctaClicks: number;
  cvr: number;
  rank: number;
}

// ─── Initialization ─────────────────────────────────────────────────────────────

/**
 * Initialize metrics.json for a funnel.
 * Called by generateFunnel() after all pages are generated.
 *
 * @param outputDir - Funnel output directory
 * @param steps - Step IDs and their variant IDs
 */
export function initMetrics(
  outputDir: string,
  steps: Array<{ stepId: string; variantIds: string[] }>
): string {
  const now = new Date().toISOString();
  const metrics: FunnelMetrics = {
    funnelId: path.basename(outputDir),
    createdAt: now,
    updatedAt: now,
    steps: {},
  };

  for (const step of steps) {
    metrics.steps[step.stepId] = {
      stepId: step.stepId,
      variants: step.variantIds.map(id => ({
        variantId: id,
        pageViews: 0,
        ctaClicks: 0,
        ctas: {},
        cvr: 0,
      })),
      totalViews: 0,
      bestVariant: null,
    };
  }

  const metricsPath = path.join(outputDir, 'metrics.json');
  fs.writeFileSync(metricsPath, JSON.stringify(metrics, null, 2), 'utf-8');
  return metricsPath;
}

// ─── Recording Events ───────────────────────────────────────────────────────────

/**
 * Record a page view event.
 *
 * @param outputDir - Funnel output directory
 * @param stepId - Step ID (e.g., 'entry')
 * @param variantId - Variant ID (e.g., 'a')
 */
export function recordPageView(outputDir: string, stepId: string, variantId: string): void {
  const metrics = readMetrics(outputDir);
  if (!metrics) return;

  const step = metrics.steps[stepId];
  if (!step) return;

  const variant = step.variants.find(v => v.variantId === variantId);
  if (!variant) return;

  variant.pageViews++;
  step.totalViews++;
  variant.cvr = variant.pageViews > 0 ? variant.ctaClicks / variant.pageViews : 0;
  step.bestVariant = findBestVariant(step.variants);
  metrics.updatedAt = new Date().toISOString();

  writeMetrics(outputDir, metrics);
}

/**
 * Record a CTA click event.
 *
 * @param outputDir - Funnel output directory
 * @param stepId - Step ID (e.g., 'entry')
 * @param variantId - Variant ID (e.g., 'a')
 * @param ctaUrl - URL the CTA points to (for per-CTA tracking)
 */
export function recordCtaClick(outputDir: string, stepId: string, variantId: string, ctaUrl: string): void {
  const metrics = readMetrics(outputDir);
  if (!metrics) return;

  const step = metrics.steps[stepId];
  if (!step) return;

  const variant = step.variants.find(v => v.variantId === variantId);
  if (!variant) return;

  variant.ctaClicks++;
  variant.ctas[ctaUrl] = (variant.ctas[ctaUrl] ?? 0) + 1;
  variant.cvr = variant.pageViews > 0 ? variant.ctaClicks / variant.pageViews : 0;
  step.bestVariant = findBestVariant(step.variants);
  metrics.updatedAt = new Date().toISOString();

  writeMetrics(outputDir, metrics);
}

// ─── Reading Metrics ────────────────────────────────────────────────────────────

/**
 * Read metrics from a funnel's metrics.json.
 * Returns null if file doesn't exist.
 */
export function readMetrics(outputDir: string): FunnelMetrics | null {
  const metricsPath = path.join(outputDir, 'metrics.json');
  if (!fs.existsSync(metricsPath)) return null;
  return JSON.parse(fs.readFileSync(metricsPath, 'utf-8'));
}

/**
 * Get a leaderboard for a specific step, ranked by CVR (descending).
 *
 * @param outputDir - Funnel output directory
 * @param stepId - Step ID to get leaderboard for
 * @returns Ranked list of variants by conversion rate
 */
export function getLeaderboard(outputDir: string, stepId: string): LeaderboardEntry[] {
  const metrics = readMetrics(outputDir);
  if (!metrics || !metrics.steps[stepId]) return [];

  const step = metrics.steps[stepId];
  const entries: LeaderboardEntry[] = step.variants
    .map(v => ({
      variantId: v.variantId,
      pageViews: v.pageViews,
      ctaClicks: v.ctaClicks,
      cvr: v.cvr,
      rank: 0,
    }))
    .sort((a, b) => b.cvr - a.cvr);

  entries.forEach((e, i) => { e.rank = i + 1; });
  return entries;
}

/**
 * Generate a tracking snippet to inject into funnel HTML pages.
 * WHY: Each page needs JS to fire tracking events on load and CTA click.
 *
 * BEHAVIOR:
 *   - Logs events to localStorage (static deployment)
 *   - Also POSTs to /api/track if endpoint exists (server deployment)
 *   - Tracks CTA clicks via event delegation on <a> and <button> elements
 *
 * @param stepId - Step ID
 * @param variantId - Variant ID
 * @returns <script> tag string to inject before </body>
 */
export function generateTrackingSnippet(stepId: string, variantId: string): string {
  return `<script data-funnel-track="${stepId}/${variantId}">
(function(){
  var stepId="${stepId}", variantId="${variantId}";

  function track(type, url) {
    var payload = { step: stepId, variant: variantId, type: type, url: url || '', ts: Date.now() };
    try {
      var stored = JSON.parse(localStorage.getItem('funnel_events') || '[]');
      stored.push(payload);
      if (stored.length > 500) stored = stored.slice(-500);
      localStorage.setItem('funnel_events', JSON.stringify(stored));
    } catch(e) {}
    try {
      navigator.sendBeacon && navigator.sendBeacon('/api/track', JSON.stringify(payload));
    } catch(e) {}
  }

  track('pageView', window.location.href);

  document.addEventListener('click', function(e) {
    var el = e.target.closest('a[href], button[onclick]');
    if (el) {
      var href = el.getAttribute('href') || '';
      if (href && href !== '#' && !href.startsWith('javascript')) {
        track('ctaClick', href);
      }
    }
  });
})();
</script>`;
}

// ─── Helpers ────────────────────────────────────────────────────────────────────

function writeMetrics(outputDir: string, metrics: FunnelMetrics): void {
  const metricsPath = path.join(outputDir, 'metrics.json');
  fs.writeFileSync(metricsPath, JSON.stringify(metrics, null, 2), 'utf-8');
}

function findBestVariant(variants: VariantMetrics[]): string | null {
  if (variants.length === 0) return null;
  // WHY: Require minimum 10 views for statistical significance
  const eligible = variants.filter(v => v.pageViews >= 10);
  if (eligible.length === 0) return null;
  return eligible.reduce((best, v) => v.cvr > best.cvr ? v : best).variantId;
}
