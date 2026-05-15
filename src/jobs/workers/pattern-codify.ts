/**
 * Purpose: BullMQ worker for pattern codification — extracts winning patterns from A/B champions.
 *          Consumes the 'pattern-codify' queue, diffs winner vs loser, stores patterns + RAG docs.
 * Dependencies: bullmq, drizzle-orm, db/schema
 * Related: Architecture Finale.md §50 (RAG Pattern Engine), ab-evaluation.ts (producer)
 *
 * WHY: When a champion variant is found, the system needs to learn WHY it won.
 *      This worker:
 *      1. Loads winner and loser variant block trees from DB
 *      2. Diffs the block trees to find what changed
 *      3. Classifies the pattern type (hero_layout, cta_placement, etc.)
 *      4. Calculates lift % (winner CVR vs loser CVR)
 *      5. Stores in winning_patterns table
 *      6. Creates RAG document for future agent injection
 *
 * FLOW (Architecture Finale.md §50):
 *   Champion found (ab-evaluation.ts)
 *     → enqueuePatternCodify({winnerVariantId, loserVariantId, experimentId})
 *     → This worker processes the job
 *     → Pattern stored + RAG document created
 *     → Future agent runs get pattern injected via {rag_patterns}
 */

import { Worker, type Job } from 'bullmq';
import { db } from '../../lib/db';
import { pageVariants, testVariantMetrics, winningPatterns, ragDocuments } from '../../db/schema';
import { eq, and } from 'drizzle-orm';
import { createLogger } from '../../lib/logger';
import { connection } from '../connection';
import type { PatternCodifyJobData } from '../queues';

const log = createLogger('worker:pattern-codify');

// ─── Pattern Classification ────────────────────────────────────────────────────

/**
 * WHY: Pattern types from Architecture Finale.md §50.
 *      Each type represents a dimension of the page that can be optimized.
 */
const PATTERN_TYPES = [
  'hero_layout',
  'cta_placement',
  'cta_text',
  'bundle_order',
  'social_proof',
  'headline_style',
  'image_choice',
  'urgency_element',
  'guarantee_placement',
  'pricing_display',
  'page_structure',
  'color_scheme',
] as const;

type PatternType = (typeof PATTERN_TYPES)[number];

interface BlockDiff {
  /** Block type that differs (e.g., "hero-banner", "cta-button") */
  blockType: string;
  /** What changed in the winner vs loser */
  change: 'added' | 'removed' | 'modified';
  /** Specific property that changed */
  property?: string;
  /** Winner value */
  winnerValue?: unknown;
  /** Loser value */
  loserValue?: unknown;
}

interface PatternExtraction {
  patternType: PatternType;
  description: string;
  blockSignature: Record<string, unknown>;
  diffs: BlockDiff[];
}

// ─── Block Tree Diff ────────────────────────────────────────────────────────────

interface BlockNode {
  type: string;
  id?: string;
  children?: BlockNode[];
  props?: Record<string, unknown>;
  [key: string]: unknown;
}

/**
 * Diff two block trees and return the differences.
 * WHY: The diff tells us WHAT changed between winner and loser.
 *      This is the raw material for pattern classification.
 */
function diffBlockTrees(winner: BlockNode, loser: BlockNode): BlockDiff[] {
  const diffs: BlockDiff[] = [];

  // Diff top-level blocks
  const winnerBlocks = winner.children ?? [];
  const loserBlocks = loser.children ?? [];

  // WHY: Build a map of loser blocks by type for quick lookup
  const loserByType = new Map<string, BlockNode[]>();
  for (const block of loserBlocks) {
    const arr = loserByType.get(block.type) ?? [];
    arr.push(block);
    loserByType.set(block.type, arr);
  }

  for (const wBlock of winnerBlocks) {
    const lBlocks = loserByType.get(wBlock.type);

    if (!lBlocks || lBlocks.length === 0) {
      diffs.push({
        blockType: wBlock.type,
        change: 'added',
      });
      continue;
    }

    // WHY: Compare props of matching block types
    const lBlock = lBlocks.shift()!;
    const wProps = wBlock.props ?? {};
    const lProps = lBlock.props ?? {};

    for (const [key, wVal] of Object.entries(wProps)) {
      const lVal = lProps[key];
      if (JSON.stringify(wVal) !== JSON.stringify(lVal)) {
        diffs.push({
          blockType: wBlock.type,
          change: 'modified',
          property: key,
          winnerValue: wVal,
          loserValue: lVal,
        });
      }
    }
  }

  // WHY: Check for blocks that exist in loser but not in winner (removed)
  for (const [, remaining] of loserByType) {
    for (const block of remaining) {
      diffs.push({
        blockType: block.type,
        change: 'removed',
      });
    }
  }

  return diffs;
}

// ─── Pattern Classification ─────────────────────────────────────────────────────

/**
 * WHY: Maps block diffs to a pattern type and human-readable description.
 *      This is the "intelligence" of the codification — turning raw diffs into
 *      actionable insights for future agents.
 */
function classifyPattern(
  diffs: BlockDiff[],
  pageType: string,
): PatternExtraction {
  // Default pattern type
  let patternType: PatternType = 'page_structure';
  let description = 'Overall page structure difference';
  const blockSignature: Record<string, unknown> = {};

  // WHY: Classify based on the most significant diff
  for (const diff of diffs) {
    const bt = diff.blockType.toLowerCase();

    if (bt.includes('hero') || bt.includes('banner') || bt.includes('headline')) {
      patternType = 'hero_layout';
      description = diff.change === 'modified'
        ? `Hero section: ${diff.property} changed from "${String(diff.loserValue).substring(0, 50)}" to "${String(diff.winnerValue).substring(0, 50)}"`
        : `Hero section ${diff.change}`;
      blockSignature.heroBlock = diff.blockType;
      if (diff.property) blockSignature[diff.property] = diff.winnerValue;
      break;
    }

    if (bt.includes('cta') || bt.includes('button')) {
      patternType = 'cta_placement';
      description = diff.change === 'modified'
        ? `CTA: ${diff.property} changed from "${String(diff.loserValue).substring(0, 50)}" to "${String(diff.winnerValue).substring(0, 50)}"`
        : `CTA ${diff.change} in ${diff.blockType}`;
      blockSignature.ctaBlock = diff.blockType;
      if (diff.property) blockSignature[diff.property] = diff.winnerValue;
      break;
    }

    if (bt.includes('review') || bt.includes('testimonial') || bt.includes('social')) {
      patternType = 'social_proof';
      description = `Social proof ${diff.change}: ${diff.blockType}`;
      blockSignature.socialBlock = diff.blockType;
      break;
    }

    if (bt.includes('price') || bt.includes('bundle') || bt.includes('pricing')) {
      patternType = 'bundle_order';
      description = `Pricing/bundle ${diff.change}: ${diff.blockType}`;
      blockSignature.bundleBlock = diff.blockType;
      break;
    }

    if (bt.includes('guarantee') || bt.includes('warranty')) {
      patternType = 'guarantee_placement';
      description = `Guarantee section ${diff.change}: ${diff.blockType}`;
      break;
    }

    if (bt.includes('countdown') || bt.includes('urgency') || bt.includes('scarcity')) {
      patternType = 'urgency_element';
      description = `Urgency element ${diff.change}: ${diff.blockType}`;
      break;
    }

    if (bt.includes('image') || bt.includes('gallery') || bt.includes('media')) {
      patternType = 'image_choice';
      description = `Image/media ${diff.change}: ${diff.blockType}`;
      break;
    }
  }

  // WHY: If no specific pattern found, describe overall structure diff
  if (patternType === 'page_structure' && diffs.length > 0) {
    const added = diffs.filter(d => d.change === 'added').length;
    const removed = diffs.filter(d => d.change === 'removed').length;
    const modified = diffs.filter(d => d.change === 'modified').length;
    description = `${added} blocks added, ${removed} removed, ${modified} modified in ${pageType}`;
    blockSignature.diffCount = diffs.length;
    blockSignature.changes = { added, removed, modified };
  }

  return { patternType, description, blockSignature, diffs };
}

// ─── Worker ─────────────────────────────────────────────────────────────────────

export const patternCodifyWorker = new Worker<PatternCodifyJobData>(
  'pattern-codify',
  async (job: Job<PatternCodifyJobData>) => {
    const { winnerVariantId, loserVariantId, experimentId } = job.data;
    log.info('Pattern codification started', {
      jobId: job.id,
      winnerVariantId,
      loserVariantId,
      experimentId,
    });

    // Step 1: Load winner and loser variants from DB
    const [winnerRow] = await db
      .select({
        id: pageVariants.id,
        name: pageVariants.name,
        page: pageVariants.page,
        stepId: pageVariants.stepId,
      })
      .from(pageVariants)
      .where(eq(pageVariants.id, winnerVariantId))
      .limit(1);

    const [loserRow] = await db
      .select({
        id: pageVariants.id,
        name: pageVariants.name,
        page: pageVariants.page,
      })
      .from(pageVariants)
      .where(eq(pageVariants.id, loserVariantId))
      .limit(1);

    if (!winnerRow || !loserRow) {
      log.error('Variant not found for pattern codification', {
        winnerFound: !!winnerRow,
        loserFound: !!loserRow,
      });
      return { success: false, error: 'Variant not found' };
    }

    // Step 2: Get CVR metrics for both variants
    const winnerMetrics = await db
      .select({ cvr: testVariantMetrics.cvr, visitors: testVariantMetrics.visitors })
      .from(testVariantMetrics)
      .where(eq(testVariantMetrics.variantId, winnerVariantId))
      .limit(1);

    const loserMetrics = await db
      .select({ cvr: testVariantMetrics.cvr, visitors: testVariantMetrics.visitors })
      .from(testVariantMetrics)
      .where(eq(testVariantMetrics.variantId, loserVariantId))
      .limit(1);

    const winnerCvr = Number(winnerMetrics[0]?.cvr ?? 0);
    const loserCvr = Number(loserMetrics[0]?.cvr ?? 0);
    const totalSample = (winnerMetrics[0]?.visitors ?? 0) + (loserMetrics[0]?.visitors ?? 0);

    // Step 3: Calculate lift %
    // WHY: Architecture Finale.md §50 — lift % = ((winner CVR - loser CVR) / loser CVR) × 100
    const liftPercent = loserCvr > 0
      ? ((winnerCvr - loserCvr) / loserCvr) * 100
      : 0;

    // Step 4: Diff block trees
    const winnerTree = winnerRow.page as BlockNode;
    const loserTree = loserRow.page as BlockNode;
    const diffs = diffBlockTrees(winnerTree, loserTree);

    // Step 5: Classify pattern
    // WHY: Default pageType to "advertorial" if not determinable
    const pageType = (winnerTree as Record<string, unknown>).pageType as string ?? 'advertorial';
    const pattern = classifyPattern(diffs, pageType);

    // Step 6: Store winning pattern
    const [insertedPattern] = await db
      .insert(winningPatterns)
      .values({
        patternType: pattern.patternType,
        pageType,
        vertical: null,
        description: pattern.description,
        blockSignature: pattern.blockSignature,
        liftPercent,
        confidence: totalSample >= 500 ? 0.95 : totalSample >= 200 ? 0.8 : 0.5,
        sampleSize: totalSample,
        experimentIds: [experimentId],
        status: 'candidate',
        codifiedAt: new Date(),
      })
      .returning({ id: winningPatterns.id });

    // Step 7: Create RAG document
    // WHY: Architecture Finale.md §50 — RAG doc for vector search injection into agent prompts
    const ragContent = buildRagDocument(pattern, winnerCvr, loserCvr, liftPercent, totalSample);

    await db.insert(ragDocuments).values({
      sourceType: 'winning_pattern',
      content: ragContent,
      metadata: {
        patternId: insertedPattern?.id,
        experimentId,
        winnerVariantId,
        loserVariantId,
        patternType: pattern.patternType,
        pageType,
        liftPercent,
        sampleSize: totalSample,
      },
    });

    log.info('Pattern codified', {
      patternId: insertedPattern?.id,
      patternType: pattern.patternType,
      liftPercent: liftPercent.toFixed(1),
      winnerCvr: winnerCvr.toFixed(4),
      loserCvr: loserCvr.toFixed(4),
      sampleSize: totalSample,
      diffCount: diffs.length,
    });

    return {
      success: true,
      patternId: insertedPattern?.id,
      patternType: pattern.patternType,
      liftPercent,
    };
  },
  {
    connection,
    concurrency: 1,
  },
);

// ─── RAG Document Builder ───────────────────────────────────────────────────────

/**
 * WHY: Builds a human-readable RAG document that can be injected into agent prompts.
 *      Format matches Architecture Finale.md §51 {rag_patterns} placeholder.
 */
function buildRagDocument(
  pattern: PatternExtraction,
  winnerCvr: number,
  loserCvr: number,
  liftPercent: number,
  sampleSize: number,
): string {
  return [
    `## Winning Pattern: ${pattern.patternType}`,
    '',
    pattern.description,
    '',
    `**Results**: Winner CVR ${(winnerCvr * 100).toFixed(2)}% vs Loser CVR ${(loserCvr * 100).toFixed(2)}% (+${liftPercent.toFixed(1)}% lift, n=${sampleSize})`,
    '',
    `**Block signature**: ${JSON.stringify(pattern.blockSignature, null, 2)}`,
    '',
    `**Key differences**:`,
    ...pattern.diffs.slice(0, 5).map(d =>
      `- ${d.blockType}: ${d.change}${d.property ? ` (${d.property}: "${String(d.loserValue).substring(0, 40)}" → "${String(d.winnerValue).substring(0, 40)}")` : ''}`
    ),
    '',
    `**Recommendation**: Apply this pattern to similar page types for expected ${liftPercent.toFixed(0)}% CVR improvement.`,
  ].join('\n');
}

// ─── Worker Events ──────────────────────────────────────────────────────────────

patternCodifyWorker.on('completed', (job) => {
  log.info('Pattern codification completed', { jobId: job.id });
});

patternCodifyWorker.on('failed', (job, err) => {
  log.error('Pattern codification failed', {
    jobId: job?.id,
    error: err.message,
  });
});

patternCodifyWorker.on('error', (err) => {
  log.error('Pattern codify worker error', { error: err.message });
});
