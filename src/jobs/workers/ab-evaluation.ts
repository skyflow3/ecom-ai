/**
 * Purpose: BullMQ worker for A/B test evaluation — runs every 15 minutes.
 *          Reads active test metrics, evaluates stage transitions via state machine,
 *          eliminates weak variants, promotes champions, triggers pattern codification.
 * Dependencies: bullmq, drizzle-orm, experiment-state-machine.ts, metrics-recalculator.ts
 * Related: Architecture Finale.md §49, src/jobs/queues.ts, src/services/experiment-state-machine.ts
 *
 * WHY: A/B tests need periodic evaluation — the state machine decides when to:
 *      - Advance to next stage (sandbox→elimination→commando→duel→champion)
 *      - Eliminate weak variants (CVR < 50% of best)
 *      - Crown a champion (statistical significance reached)
 *
 *      Running this as a BullMQ repeatable job means:
 *      - Automatic retry on failure
 *      - Visibility in job dashboards
 *      - No cron daemon needed (Redis-based scheduling)
 *
 * FLOW (every 15 min):
 *   1. Recalculate CVR/AOV/AOV×CVR for all active tests
 *   2. For each test:
 *      a. Read testVariantMetrics (non-eliminated variants)
 *      b. Build ExperimentData for state machine
 *      c. Evaluate stage transition
 *      d. If shouldTransition → update abTests.phase
 *      e. If weak variants → mark eliminatedAt
 *      f. If champion → update winnerVariantId, enqueue pattern codify
 */

import { Worker, type Job, Queue } from 'bullmq';
import { db } from '../../lib/db';
import { abTests, testVariantMetrics, funnelSteps } from '../../db/schema';
import { eq, and, sql, isNull } from 'drizzle-orm';
import { createLogger } from '../../lib/logger';
import { connection } from '../connection';
import {
  evaluateStage,
  type ExperimentData,
  type VariantData,
  type Stage,
} from '../../services/experiment-state-machine';
import { recalculateAllActiveTests } from '../../services/metrics-recalculator';
import { enqueuePatternCodify } from '../queues';

const log = createLogger('worker:ab-evaluation');

// ─── Repeatable Job Setup ──────────────────────────────────────────────────────

const EVALUATION_QUEUE_NAME = 'ab-evaluation';

/**
 * WHY: Separate queue instance for scheduling the repeatable job.
 *      The worker consumes from this queue. We use add() with jobId
 *      to prevent duplicate repeatable jobs.
 */
const evaluationScheduler = new Queue(EVALUATION_QUEUE_NAME, { connection });

/**
 * Schedule the evaluation job to run every 15 minutes.
 * Call this once at worker startup.
 * WHY: BullMQ repeatable jobs use Redis to track schedules. If the job
 *      already exists with the same repeat key, it won't duplicate.
 */
export async function scheduleEvaluationJob(): Promise<void> {
  await evaluationScheduler.add(
    'evaluate-active-tests',
    {},
    {
      repeat: { every: 15 * 60 * 1000 }, // 15 minutes
      jobId: 'ab-evaluation-repeat',
      removeOnComplete: { count: 10 },
      removeOnFail: { count: 5 },
    },
  );
  log.info('A/B evaluation scheduled (every 15 min)');
}

// ─── Worker ────────────────────────────────────────────────────────────────────

export const abEvaluationWorker = new Worker(
  EVALUATION_QUEUE_NAME,
  async (job: Job) => {
    const startedAt = Date.now();
    log.info('A/B evaluation run starting', { jobId: job.id });

    try {
      // Step 1: Recalculate derived metrics from raw counters
      const recalcResults = await recalculateAllActiveTests();
      log.info('Metrics recalculated', {
        variantCount: recalcResults.length,
        testsAffected: new Set(recalcResults.map(r => r.testId)).size,
      });

      // Step 2: Get all active (running) tests
      const activeTests = await db
        .select({
          id: abTests.id,
          stepId: abTests.stepId,
          phase: abTests.phase,
        })
        .from(abTests)
        .where(eq(abTests.status, 'running'));

      // WHY: phase can be null from DB default — default to 'sandbox'
      const validTests = activeTests.map(t => ({
        ...t,
        phase: t.phase ?? 'sandbox',
      }));

      log.info('Evaluating active tests', { count: activeTests.length });

      const outcomes: EvaluationOutcome[] = [];

      for (const test of validTests) {
        const outcome = await evaluateSingleTest(test);
        outcomes.push(outcome);
      }

      const elapsed = Date.now() - startedAt;
      log.info('A/B evaluation run complete', {
        testsEvaluated: outcomes.length,
        transitions: outcomes.filter(o => o.transitioned).length,
        eliminations: outcomes.reduce((sum, o) => sum + o.eliminatedCount, 0),
        champions: outcomes.filter(o => o.championVariantId).length,
        elapsedMs: elapsed,
      });

      return { outcomes, elapsed };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      log.error('A/B evaluation run failed', { error: message });
      throw error; // Re-throw so BullMQ retries
    }
  },
  {
    connection,
    concurrency: 1, // Only one evaluation at a time
  },
);

// ─── Single Test Evaluation ────────────────────────────────────────────────────

interface EvaluationOutcome {
  testId: string;
  transitioned: boolean;
  fromStage: string;
  toStage: string | null;
  eliminatedCount: number;
  championVariantId: string | null;
}

async function evaluateSingleTest(test: {
  id: string;
  stepId: string;
  phase: string;
}): Promise<EvaluationOutcome> {
  const outcome: EvaluationOutcome = {
    testId: test.id,
    transitioned: false,
    fromStage: test.phase,
    toStage: null,
    eliminatedCount: 0,
    championVariantId: null,
  };

  // Read non-eliminated variant metrics for this test
  const metrics = await db
    .select({
      id: testVariantMetrics.id,
      variantId: testVariantMetrics.variantId,
      visitors: testVariantMetrics.visitors,
      purchases: testVariantMetrics.purchases,
      cvr: testVariantMetrics.cvr,
    })
    .from(testVariantMetrics)
    .where(
      and(
        eq(testVariantMetrics.testId, test.id),
        isNull(testVariantMetrics.eliminatedAt),
      ),
    );

  if (metrics.length === 0) {
    log.warn('Test has no active variants', { testId: test.id });
    return outcome;
  }

  // Build ExperimentData for the state machine
  const variants: VariantData[] = metrics.map((m) => ({
    id: m.variantId,
    name: m.variantId, // WHY: State machine uses this as identifier
    isControl: false, // WHY: We don't track control explicitly — the best variant wins
    views: m.visitors ?? 0,
    conversions: m.purchases ?? 0,
    conversionRate: Number(m.cvr ?? 0),
  }));

  const totalViews = variants.reduce((sum, v) => sum + v.views, 0);

  const experimentData: ExperimentData = {
    stage: test.phase as Stage,
    totalViews,
    variants,
  };

  // Evaluate via state machine
  const result = evaluateStage(experimentData);

  log.info('Test evaluated', {
    testId: test.id,
    stage: result.currentStage,
    shouldTransition: result.shouldTransition,
    nextStage: result.nextStage,
    reason: result.transitionReason,
    weakVariants: result.weakVariants.length,
    hasChampion: !!result.champion,
  });

  // Handle weak variants (eliminate them)
  if (result.weakVariants.length > 0) {
    for (const weak of result.weakVariants) {
      await db
        .update(testVariantMetrics)
        .set({
          eliminatedAt: new Date(),
          eliminatedReason: `CVR ${weak.conversionRate.toFixed(4)} < 50% of best`,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(testVariantMetrics.testId, test.id),
            eq(testVariantMetrics.variantId, weak.id),
          ),
        );
    }
    outcome.eliminatedCount = result.weakVariants.length;
    log.info('Weak variants eliminated', {
      testId: test.id,
      count: result.weakVariants.length,
      variantIds: result.weakVariants.map(v => v.id),
    });
  }

  // Handle stage transition
  if (result.shouldTransition && result.nextStage) {
    await db
      .update(abTests)
      .set({
        phase: result.nextStage,
      })
      .where(eq(abTests.id, test.id));

    outcome.transitioned = true;
    outcome.toStage = result.nextStage;

    log.info('Test advanced to next stage', {
      testId: test.id,
      from: result.currentStage,
      to: result.nextStage,
      reason: result.transitionReason,
    });
  }

  // Handle champion found
  if (result.champion) {
    outcome.championVariantId = result.champion.id;

    // Update test with winner
    await db
      .update(abTests)
      .set({
        status: 'completed',
        winnerVariantId: result.champion.id,
        endedAt: new Date(),
      })
      .where(eq(abTests.id, test.id));

    // Update funnelStep's activeVariantId to the champion
    // WHY: The variant router reads activeVariantId to route 100% traffic to champion
    await db
      .update(funnelSteps)
      .set({
        activeVariantId: result.champion.id,
      })
      .where(eq(funnelSteps.id, test.stepId));

    log.info('Champion crowned', {
      testId: test.id,
      championVariantId: result.champion.id,
      championCVR: result.champion.conversionRate.toFixed(4),
      championViews: result.champion.views,
      stepId: test.stepId,
    });

    // Enqueue pattern codification (fire-and-forget)
    // WHY: Extract what made the winner work → store as RAG → inject into future generations
    try {
      const loserVariants = variants.filter(v => v.id !== result.champion!.id);
      const loserId = loserVariants[0]?.id; // Compare against first loser

      if (loserId) {
        await enqueuePatternCodify({
          winnerVariantId: result.champion.id,
          loserVariantId: loserId,
          experimentId: test.id,
        });
        log.info('Pattern codification enqueued', {
          winnerId: result.champion.id,
          loserId,
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      log.error('Failed to enqueue pattern codification', {
        testId: test.id,
        error: message,
      });
      // WHY: Pattern codification failure must not break evaluation
    }
  }

  return outcome;
}

// ─── Worker Events ─────────────────────────────────────────────────────────────

abEvaluationWorker.on('completed', (job) => {
  log.info('Evaluation job completed', { jobId: job.id });
});

abEvaluationWorker.on('failed', (job, err) => {
  log.error('Evaluation job failed', {
    jobId: job?.id,
    error: err.message,
  });
});

abEvaluationWorker.on('error', (err) => {
  log.error('Evaluation worker error', { error: err.message });
});
