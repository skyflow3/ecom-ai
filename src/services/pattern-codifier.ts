/**
 * Purpose: RAG Pattern Engine — autonomous feedback loop.
 *          When a champion is found, extract the pattern, store as SOP,
 *          and inject into future generations. Zero human involvement.
 *          Each generation of pages is better than the previous.
 * Dependencies: experiment-state-machine.ts (getWinner, VariantData)
 * Related: Architecture Finale.md §50, Drizzle schema (winning_patterns, rag_documents)
 *
 * Flow: Champion found → Diff block trees → Classify pattern → Calculate lift →
 *       Generate SOP description → Store winning_pattern → Create RAG document →
 *       Inject into next agent context
 *
 * SOP Promotion Pipeline:
 *   candidate → validated (3+ experiments) → sop (5+ experiments + lift >10% + confidence >95%)
 *   → deprecated (stopped winning)
 */

import type { VariantData } from './experiment-state-machine';
import type { PageType } from '../design-system/tokens';

// ─── Pattern Types ───────────────────────────────────────────────────────────

export const PATTERN_TYPES = [
  'hero_layout',
  'cta_placement',
  'bundle_order',
  'testimonial_count',
  'cta_copy',
  'section_sequence',
  'image_placement',
  'pricing_structure',
  'social_proof_position',
  'urgency_placement',
  'guarantee_format',
  'faq_depth',
  'color_usage',
  'headline_length',
  'above_fold_composition',
] as const;

export type PatternType = (typeof PATTERN_TYPES)[number];

// ─── Pattern Status ──────────────────────────────────────────────────────────

export const PATTERN_STATUSES = ['candidate', 'validated', 'sop', 'deprecated'] as const;
export type PatternStatus = (typeof PATTERN_STATUSES)[number];

// ─── Winning Pattern ─────────────────────────────────────────────────────────

export interface WinningPattern {
  id: string;
  patternType: PatternType | string;
  pageType: PageType | string;
  vertical?: string;
  description: string;
  blockSignature: BlockSignature;
  liftPercent: number;
  confidence: number;
  sampleSize: number;
  experimentIds: string[];
  status: PatternStatus;
  codifiedAt?: Date;
  createdAt: Date;
}

// ─── Block Signature ─────────────────────────────────────────────────────────
// Fingerprint of a block tree — used to diff winner vs loser.

export interface BlockSignature {
  /** Ordered list of block types */
  blockSequence: string[];
  /** Block type → count */
  blockCounts: Record<string, number>;
  /** Key props that differ between winner and loser */
  keyDifferences: string[];
  /** Total blocks */
  totalBlocks: number;
}

// ─── RAG Document ────────────────────────────────────────────────────────────

export interface RagDocument {
  id: string;
  sourceType: 'winning_pattern' | 'experiment_result' | 'brand_guideline' | 'competitor_analysis';
  content: string;
  metadata: Record<string, unknown>;
  embedding?: number[];
  createdAt: Date;
}

// ─── Agent Context ───────────────────────────────────────────────────────────

export interface AgentContext {
  brandName: string;
  pageType: PageType;
  vertical: string;
  winningPatterns: Array<{
    description: string;
    blockSignature: BlockSignature;
    lift: number;
    status: PatternStatus;
  }>;
  designTokens: Record<string, unknown>;
}

// ─── SOP Promotion Thresholds ────────────────────────────────────────────────

export const PROMOTION_THRESHOLDS = {
  /** Experiments needed to validate a candidate */
  validatedMinExperiments: 3,
  /** Experiments needed to promote to SOP */
  sopMinExperiments: 5,
  /** Minimum lift % for SOP promotion */
  sopMinLiftPercent: 10,
  /** Minimum confidence for SOP promotion */
  sopMinConfidence: 0.95,
} as const;

// ─── Pattern Extraction ──────────────────────────────────────────────────────

/**
 * Extract a block signature from a block tree.
 * This is the "fingerprint" used to compare winner vs loser.
 */
export function extractBlockSignature(blocks: Array<{ type: string; props?: Record<string, unknown> }>): BlockSignature {
  const blockSequence = blocks.map(b => b.type);
  const blockCounts: Record<string, number> = {};

  for (const type of blockSequence) {
    blockCounts[type] = (blockCounts[type] || 0) + 1;
  }

  return {
    blockSequence,
    blockCounts,
    keyDifferences: [], // filled during diff
    totalBlocks: blocks.length,
  };
}

/**
 * Diff two block signatures to find what's different.
 * Returns the key differences between winner and loser.
 */
export function diffBlockSignatures(winner: BlockSignature, loser: BlockSignature): string[] {
  const differences: string[] = [];

  // Different sequence
  if (JSON.stringify(winner.blockSequence) !== JSON.stringify(loser.blockSequence)) {
    differences.push(`Sequence differs: winner has ${winner.blockSequence.join('→')}, loser has ${loser.blockSequence.join('→')}`);
  }

  // Different block counts
  const allTypes = new Set([...Object.keys(winner.blockCounts), ...Object.keys(loser.blockCounts)]);
  for (const type of allTypes) {
    const winnerCount = winner.blockCounts[type] || 0;
    const loserCount = loser.blockCounts[type] || 0;
    if (winnerCount !== loserCount) {
      differences.push(`Block "${type}": winner has ${winnerCount}, loser has ${loserCount}`);
    }
  }

  // Different total blocks
  if (winner.totalBlocks !== loser.totalBlocks) {
    differences.push(`Total blocks: winner has ${winner.totalBlocks}, loser has ${loser.totalBlocks}`);
  }

  return differences;
}

// ─── Pattern Classification ──────────────────────────────────────────────────

/**
 * Classify the type of pattern based on the diff between winner and loser.
 * Uses simple heuristic rules to categorize the winning pattern.
 */
export function classifyPattern(differences: string[]): PatternType | string {
  const diffStr = differences.join(' ').toLowerCase();

  if (diffStr.includes('hero') || diffStr.includes('sequence') && diffStr.includes('hero')) {
    return 'hero_layout';
  }
  if (diffStr.includes('cta') || diffStr.includes('button')) {
    return 'cta_placement';
  }
  if (diffStr.includes('bundle') || diffStr.includes('pricing')) {
    return 'bundle_order';
  }
  if (diffStr.includes('testimonial') || diffStr.includes('review')) {
    return 'testimonial_count';
  }
  if (diffStr.includes('sequence')) {
    return 'section_sequence';
  }
  if (diffStr.includes('image')) {
    return 'image_placement';
  }
  if (diffStr.includes('faq')) {
    return 'faq_depth';
  }
  if (diffStr.includes('guarantee')) {
    return 'guarantee_format';
  }
  if (diffStr.includes('trust') || diffStr.includes('social')) {
    return 'social_proof_position';
  }
  if (diffStr.includes('countdown') || diffStr.includes('urgency')) {
    return 'urgency_placement';
  }

  return 'above_fold_composition';
}

// ─── Lift Calculation ────────────────────────────────────────────────────────

/**
 * Calculate lift % of winner over loser.
 * lift = ((winner CVR - loser CVR) / loser CVR) × 100
 */
export function calculateLift(winner: VariantData, loser: VariantData): number {
  if (loser.conversionRate === 0) return 0;
  return ((winner.conversionRate - loser.conversionRate) / loser.conversionRate) * 100;
}

// ─── SOP Description Generator ───────────────────────────────────────────────

/**
 * Generate a description for a winning pattern.
 * In production, this would be called by an LLM.
 * Here we generate a structured template that the LLM would fill.
 */
export function generatePatternDescription(params: {
  patternType: string;
  pageType: string;
  lift: number;
  winnerSignature: BlockSignature;
  differences: string[];
}): string {
  return `PATTERN: ${params.patternType}
PAGE TYPE: ${params.pageType}
LIFT: +${params.lift.toFixed(1)}%

WINNING STRUCTURE: ${params.winnerSignature.blockSequence.join(' → ')}

KEY DIFFERENCES FROM LOSER:
${params.differences.map(d => `- ${d}`).join('\n')}

BLOCK COUNTS: ${Object.entries(params.winnerSignature.blockCounts)
    .map(([type, count]) => `${type}×${count}`)
    .join(', ')}`;
}

// ─── SOP Promotion Logic ─────────────────────────────────────────────────────

export interface PromotionCheck {
  currentStatus: PatternStatus;
  newStatus: PatternStatus | null;
  shouldPromote: boolean;
  reason: string;
}

/**
 * Check if a pattern should be promoted to the next status.
 *
 * candidate → validated: 3+ independent experiments confirm the pattern
 * validated → sop: 5+ experiments + lift > 10% + confidence > 95%
 * sop → deprecated: pattern stops winning (not handled here — separate deprecation job)
 */
export function evaluatePatternPromotion(pattern: {
  status: PatternStatus;
  experimentCount: number;
  liftPercent: number;
  confidence: number;
}): PromotionCheck {
  if (pattern.status === 'candidate') {
    if (pattern.experimentCount >= PROMOTION_THRESHOLDS.validatedMinExperiments) {
      return {
        currentStatus: 'candidate',
        newStatus: 'validated',
        shouldPromote: true,
        reason: `${pattern.experimentCount} experiments confirm the pattern (min ${PROMOTION_THRESHOLDS.validatedMinExperiments})`,
      };
    }
    return {
      currentStatus: 'candidate',
      newStatus: null,
      shouldPromote: false,
      reason: `Only ${pattern.experimentCount}/${PROMOTION_THRESHOLDS.validatedMinExperiments} confirming experiments`,
    };
  }

  if (pattern.status === 'validated') {
    const meetsExperiments = pattern.experimentCount >= PROMOTION_THRESHOLDS.sopMinExperiments;
    const meetsLift = pattern.liftPercent >= PROMOTION_THRESHOLDS.sopMinLiftPercent;
    const meetsConfidence = pattern.confidence >= PROMOTION_THRESHOLDS.sopMinConfidence;

    if (meetsExperiments && meetsLift && meetsConfidence) {
      return {
        currentStatus: 'validated',
        newStatus: 'sop',
        shouldPromote: true,
        reason: `${pattern.experimentCount} experiments, +${pattern.liftPercent.toFixed(1)}% lift, ${(pattern.confidence * 100).toFixed(1)}% confidence`,
      };
    }

    const blockers: string[] = [];
    if (!meetsExperiments) blockers.push(`need ${PROMOTION_THRESHOLDS.sopMinExperiments} experiments (have ${pattern.experimentCount})`);
    if (!meetsLift) blockers.push(`need ${PROMOTION_THRESHOLDS.sopMinLiftPercent}% lift (have ${pattern.liftPercent.toFixed(1)}%)`);
    if (!meetsConfidence) blockers.push(`need ${(PROMOTION_THRESHOLDS.sopMinConfidence * 100)}% confidence (have ${(pattern.confidence * 100).toFixed(1)}%)`);

    return {
      currentStatus: 'validated',
      newStatus: null,
      shouldPromote: false,
      reason: `Not yet SOP: ${blockers.join(', ')}`,
    };
  }

  // SOP or deprecated — no further promotion
  return {
    currentStatus: pattern.status,
    newStatus: null,
    shouldPromote: false,
    reason: `Status "${pattern.status}" is terminal`,
  };
}

// ─── RAG Document Format ─────────────────────────────────────────────────────

/**
 * Create a RAG document from a winning pattern for vector search.
 * This document is what gets embedded and retrieved for future agent context.
 */
export function createRagDocument(pattern: WinningPattern): string {
  return `PATTERN: ${pattern.patternType}
PAGE TYPE: ${pattern.pageType}
${pattern.vertical ? `VERTICAL: ${pattern.vertical}` : ''}
LIFT: +${pattern.liftPercent.toFixed(1)}%
CONFIDENCE: ${(pattern.confidence * 100).toFixed(1)}%
SAMPLE: ${pattern.sampleSize} total views
STATUS: ${pattern.status}

DESCRIPTION:
${pattern.description}

BLOCK SIGNATURE:
${pattern.blockSignature.blockSequence.join(' → ')}

CONFIRMED BY: ${pattern.experimentIds.length} experiments`;
}

// ─── Agent Context Builder ───────────────────────────────────────────────────

/**
 * Build the context that gets injected into the agent prompt.
 * This is the RAG query — retrieves top N winning patterns for the given
 * page type and vertical.
 */
export function buildRagContextForAgent(params: {
  pageType: PageType;
  vertical?: string;
  patterns: WinningPattern[];
  maxPatterns?: number;
}): string[] {
  const { pageType, vertical, patterns, maxPatterns = 10 } = params;

  // Filter patterns relevant to this page type and vertical
  const relevant = patterns
    .filter(p => {
      if (p.status !== 'validated' && p.status !== 'sop') return false;
      if (p.pageType !== pageType && p.pageType !== 'all') return false;
      if (vertical && p.vertical && p.vertical !== vertical) return false;
      return true;
    })
    .sort((a, b) => b.liftPercent - a.liftPercent)
    .slice(0, maxPatterns);

  return relevant.map(p =>
    `[${p.status.toUpperCase()}] ${p.patternType} (+${p.liftPercent.toFixed(1)}% lift): ${p.description.substring(0, 200)}`
  );
}
