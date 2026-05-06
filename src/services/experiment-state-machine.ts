/**
 * Purpose: A/B Testing State Machine — 5 stages with statistical gates.
 *          100% automated. AI launches tests, analyzes results, promotes champions.
 *          When champion found → pattern auto-codified into SOP via §50.
 * Dependencies: None (pure logic — DB integration via Drizzle in schema layer)
 * Related: Architecture Finale.md §49, Drizzle schema (experiments, variants, conversions)
 *
 * Stages: Sandbox → Elimination → Commando → Duel → Champion
 *
 * Stage Gates:
 *   Sandbox → Elimination: ≥ 200 total views across all variants
 *   Elimination → Commando: Only 2-3 strong remain (CVR ≥ 50% of best)
 *   Commando → Duel: p < 0.10 (Chi-squared approaching significance)
 *   Duel → Champion: p < 0.05 (Chi-squared statistical significance)
 */

// ─── Stage Type ──────────────────────────────────────────────────────────────

export const STAGES = ['sandbox', 'elimination', 'commando', 'duel', 'champion'] as const;
export type Stage = (typeof STAGES)[number];

// ─── Stage Transition ────────────────────────────────────────────────────────

export interface StageTransition {
  from: Stage;
  to: Stage;
  condition: string;
  check: (data: ExperimentData) => boolean;
}

export interface ExperimentData {
  stage: Stage;
  totalViews: number;
  variants: VariantData[];
}

export interface VariantData {
  id: string;
  name: string;
  isControl: boolean;
  views: number;
  conversions: number;
  conversionRate: number;
}

// ─── Transitions Definition ──────────────────────────────────────────────────

export const TRANSITIONS: StageTransition[] = [
  {
    from: 'sandbox',
    to: 'elimination',
    condition: 'Total traffic ≥ 200 views across all variants',
    check: (data) => data.totalViews >= 200,
  },
  {
    from: 'elimination',
    to: 'commando',
    condition: 'Only 2-3 strong variants remain (CVR ≥ 50% of best)',
    check: (data) => {
      const strong = getStrongVariants(data.variants);
      return strong.length >= 2 && strong.length <= 3;
    },
  },
  {
    from: 'commando',
    to: 'duel',
    condition: 'Chi-squared p-value < 0.10',
    check: (data) => {
      const pValue = chiSquaredTest(data.variants);
      return pValue < 0.10;
    },
  },
  {
    from: 'duel',
    to: 'champion',
    condition: 'Chi-squared p-value < 0.05',
    check: (data) => {
      const pValue = chiSquaredTest(data.variants);
      return pValue < 0.05;
    },
  },
];

// ─── Traffic Allocation ──────────────────────────────────────────────────────

export function getTrafficAllocation(stage: Stage): {
  experimentTraffic: number;  // % of total page traffic allocated to experiment
  variantSplit: 'equal' | 'weighted' | 'fifty-fifty';
} {
  switch (stage) {
    case 'sandbox':
      return { experimentTraffic: 0.10, variantSplit: 'equal' };
    case 'elimination':
      return { experimentTraffic: 0.30, variantSplit: 'equal' };
    case 'commando':
      return { experimentTraffic: 0.50, variantSplit: 'weighted' };
    case 'duel':
      return { experimentTraffic: 0.70, variantSplit: 'fifty-fifty' };
    case 'champion':
      return { experimentTraffic: 1.0, variantSplit: 'equal' };
  }
}

// ─── Minimum Sample Sizes ────────────────────────────────────────────────────

export const MIN_SAMPLE_SIZES: Record<Stage, number> = {
  sandbox: 200,       // total views to exit sandbox
  elimination: 500,   // per remaining variant
  commando: 1000,     // per variant
  duel: 2000,         // per variant (50/50 split)
  champion: Infinity,  // champion runs indefinitely
};

// ─── Chi-Squared Test ────────────────────────────────────────────────────────

/**
 * Chi-squared test for independence between variants.
 * Compares conversion rates across all variants.
 * Returns p-value (lower = more statistically significant difference).
 *
 * WHY Chi-squared: Standard for comparing proportions (CVR) across groups.
 *    No distribution assumption needed. Works with binary outcomes (convert/no-convert).
 */
export function chiSquaredTest(variants: VariantData[]): number {
  if (variants.length < 2) return 1;

  const totalViews = variants.reduce((sum, v) => sum + v.views, 0);
  const totalConversions = variants.reduce((sum, v) => sum + v.conversions, 0);

  if (totalViews === 0 || totalConversions === 0) return 1;

  // Overall conversion rate
  const overallRate = totalConversions / totalViews;

  // Calculate chi-squared statistic
  let chiSquared = 0;

  for (const variant of variants) {
    if (variant.views === 0) continue;

    const expectedConversions = variant.views * overallRate;
    const expectedNonConversions = variant.views * (1 - overallRate);

    // WHY +0.5 continuity correction: prevents division by zero for small samples
    const observedConv = variant.conversions;
    const observedNonConv = variant.views - variant.conversions;

    chiSquared += Math.pow(observedConv - expectedConversions, 2) / (expectedConversions + 0.5);
    chiSquared += Math.pow(observedNonConv - expectedNonConversions, 2) / (expectedNonConversions + 0.5);
  }

  // Degrees of freedom = number of variants - 1
  const df = variants.length - 1;

  // Approximate p-value from chi-squared CDF
  return chiSquaredToPValue(chiSquared, df);
}

/**
 * Approximate p-value from chi-squared statistic using Wilson-Hilferty transformation.
 * Good enough for stage gate decisions (doesn't need to be exact).
 */
function chiSquaredToPValue(chiSquared: number, df: number): number {
  if (df <= 0 || chiSquared <= 0) return 1;

  // Wilson-Hilferty approximation
  const z = Math.pow(chiSquared / df, 1 / 3) - (1 - 2 / (9 * df));
  const denom = Math.sqrt(2 / (9 * df));

  if (denom === 0) return 1;

  const normalizedZ = z / denom;

  // Standard normal CDF approximation (Abramowitz & Stegun)
  const t = 1 / (1 + 0.2316419 * Math.abs(normalizedZ));
  const d = 0.3989422804014327; // 1/sqrt(2*PI)
  const p = d * Math.exp(-normalizedZ * normalizedZ / 2) *
    (t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.8212560 + t * 1.3302744)))));

  return normalizedZ > 0 ? p : 1 - p;
}

// ─── Variant Filtering ───────────────────────────────────────────────────────

/** Get variants with CVR ≥ 50% of the best variant */
export function getStrongVariants(variants: VariantData[]): VariantData[] {
  if (variants.length === 0) return [];

  const bestCVR = Math.max(...variants.map(v => v.conversionRate));
  const threshold = bestCVR * 0.5;

  return variants.filter(v => v.conversionRate >= threshold);
}

/** Get variants that should be killed (CVR < 50% of best) */
export function getWeakVariants(variants: VariantData[]): VariantData[] {
  if (variants.length <= 2) return []; // Don't kill if only 2 left

  const bestCVR = Math.max(...variants.map(v => v.conversionRate));
  const threshold = bestCVR * 0.5;

  return variants.filter(v => v.conversionRate < threshold);
}

// ─── Stage Evaluation ────────────────────────────────────────────────────────

export interface EvaluationResult {
  currentStage: Stage;
  nextStage: Stage | null;
  shouldTransition: boolean;
  transitionReason: string;
  weakVariants: VariantData[];
  champion: VariantData | null;
}

/**
 * Evaluate whether an experiment should advance to the next stage.
 * Called periodically (e.g., every hour or every 100 new views).
 */
export function evaluateStage(data: ExperimentData): EvaluationResult {
  const transition = TRANSITIONS.find(t => t.from === data.stage);

  if (!transition) {
    // Already champion or unknown stage
    return {
      currentStage: data.stage,
      nextStage: null,
      shouldTransition: false,
      transitionReason: data.stage === 'champion'
        ? 'Already champion — pattern codification triggered'
        : `Unknown stage: ${data.stage}`,
      weakVariants: [],
      champion: data.stage === 'champion' ? getWinner(data.variants) : null,
    };
  }

  const shouldTransition = transition.check(data);

  if (!shouldTransition) {
    // Check for weak variants to kill (elimination stage)
    const weakVariants = data.stage === 'elimination'
      ? getWeakVariants(data.variants)
      : [];

    return {
      currentStage: data.stage,
      nextStage: transition.to,
      shouldTransition: false,
      transitionReason: `Condition not met: ${transition.condition}`,
      weakVariants,
      champion: null,
    };
  }

  return {
    currentStage: data.stage,
    nextStage: transition.to,
    shouldTransition: true,
    transitionReason: transition.condition,
    weakVariants: [],
    champion: transition.to === 'champion' ? getWinner(data.variants) : null,
  };
}

/** Get the winning variant (highest conversion rate) */
export function getWinner(variants: VariantData[]): VariantData | null {
  if (variants.length === 0) return null;
  return variants.reduce((best, v) =>
    v.conversionRate > best.conversionRate ? v : best
  );
}

/** Calculate conversion rate */
export function calculateCVR(views: number, conversions: number): number {
  if (views === 0) return 0;
  return conversions / views;
}
