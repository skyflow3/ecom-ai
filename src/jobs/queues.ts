/**
 * Purpose: BullMQ queue definitions for ECOM-AI background jobs.
 * Dependencies: bullmq, connection.ts
 * Related: Architecture Finale.md §52 (Background Jobs)
 *
 * WHY: Page generation and deployment are slow (5-30s LLM calls, file uploads).
 *      Moving them to background jobs prevents API timeouts and enables:
 *      - Retry on failure
 *      - Progress tracking
 *      - Concurrent job processing
 *      - Job priority (generate = high, deploy = normal)
 *
 * QUEUES:
 *   - page-generation: LLM generates BlockTree from product brief
 *   - page-deploy: Render HTML → upload to storage → update DB
 *   - pattern-codify: Extract patterns from A/B test winners (low priority)
 */

import { Queue } from 'bullmq';
import { connection } from './connection';

// ─── Queue Instances ──────────────────────────────────────────────────────────

/** Page generation — calls LLM, validates BlockTree, saves to DB */
export const pageGenerationQueue = new Queue('page-generation', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 5000 },
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 50 },
  },
});

/** Page deployment — renders HTML, uploads to storage, updates URL */
export const pageDeployQueue = new Queue('page-deploy', {
  connection,
  defaultJobOptions: {
    attempts: 2,
    backoff: { type: 'exponential', delay: 3000 },
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 50 },
  },
});

/** A/B evaluation — runs every 15 min to evaluate active A/B tests */
export const abEvaluationQueue = new Queue('ab-evaluation', {
  connection,
  defaultJobOptions: {
    attempts: 2,
    backoff: { type: 'exponential', delay: 10000 },
    removeOnComplete: { count: 20 },
    removeOnFail: { count: 10 },
  },
});

/** Pattern codification — extracts patterns from A/B test champions */
export const patternCodifyQueue = new Queue('pattern-codify', {
  connection,
  defaultJobOptions: {
    attempts: 2,
    backoff: { type: 'exponential', delay: 10000 },
    removeOnComplete: { count: 50 },
    removeOnFail: { count: 20 },
    priority: 10, // Low priority — runs after generation/deploy
  },
});

// ─── Job Data Types ───────────────────────────────────────────────────────────

export interface PageGenerationJobData {
  /** UUID of the page_variant to generate */
  variantId: string;
  /** Funnel step ID */
  stepId: string;
  /** Page type */
  pageType: string;
  /** Palette to use */
  palette: string;
  /** Product context for the LLM */
  productContext: string;
  /** Optional marketing angle */
  marketingAngle?: {
    headline?: string;
    subheadline?: string;
    ctaText?: string;
    benefits?: string[];
    guarantee?: string;
    painPoint?: string;
  };
  /** Optional RAG patterns to inject */
  ragPatterns?: string[];
  /** Who triggered the generation */
  triggeredBy: string;
}

export interface PageDeployJobData {
  /** UUID of the page_variant to deploy */
  variantId: string;
  /** Whether to run page speed optimizations before deploy */
  optimizeSpeed?: boolean;
  /** Who triggered the deploy */
  triggeredBy: string;
}

export interface PatternCodifyJobData {
  /** UUID of the winning experiment variant */
  winnerVariantId: string;
  /** UUID of the losing variant to compare against */
  loserVariantId: string;
  /** Experiment ID for pattern linkage */
  experimentId: string;
}

// ─── Job Helpers ──────────────────────────────────────────────────────────────

/**
 * Add a page generation job to the queue.
 * Returns the job ID for tracking.
 */
export async function enqueuePageGeneration(data: PageGenerationJobData): Promise<string> {
  const job = await pageGenerationQueue.add('generate', data, {
    priority: 1, // High priority
  });
  return job.id!;
}

/**
 * Add a page deploy job to the queue.
 * Returns the job ID for tracking.
 */
export async function enqueuePageDeploy(data: PageDeployJobData): Promise<string> {
  const job = await pageDeployQueue.add('deploy', data, {
    priority: 2,
  });
  return job.id!;
}

/**
 * Add a pattern codification job to the queue.
 * Returns the job ID for tracking.
 */
export async function enqueuePatternCodify(data: PatternCodifyJobData): Promise<string> {
  const job = await patternCodifyQueue.add('codify', data);
  return job.id!;
}
