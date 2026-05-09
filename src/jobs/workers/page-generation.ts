/**
 * Purpose: BullMQ worker for page generation jobs.
 *          Calls the LLM, validates, and saves BlockTree to DB.
 * Dependencies: page-generator.ts, queues.ts, db
 * Related: Architecture Finale.md §52 (Background Jobs)
 *
 * WHY: LLM calls take 5-30s. Running them in a background worker
 *      prevents API timeouts and enables automatic retry on failure.
 */

import { Worker, type Job } from 'bullmq';
import { createLogger } from '../../lib/logger';
import { connection } from '../connection';
import type { PageGenerationJobData } from '../queues';
import { generatePage, type GeneratePageRequest } from '../../services/page-generator';
import { getLlmConfig, getCopywriterConfig, getProducerConfig } from '../../lib/config';
import { db } from '../../lib/db';
import { pageVariants } from '../../db/schema';
import { eq } from 'drizzle-orm';
import type { PageType, PaletteKey } from '../../design-system/tokens';

const log = createLogger('worker:page-generation');

// ─── Worker ───────────────────────────────────────────────────────────────────

export const pageGenerationWorker = new Worker<PageGenerationJobData>(
  'page-generation',
  async (job: Job<PageGenerationJobData>) => {
    const { variantId, stepId, pageType, palette, productContext, marketingAngle, ragPatterns, triggeredBy } = job.data;

    log.info('Starting page generation', { variantId, pageType, triggeredBy });

    await job.updateProgress(10);

    // Build generation request
    const genRequest: GeneratePageRequest = {
      pageType: pageType as PageType,
      palette: palette as PaletteKey,
      product: {
        name: 'Product', // Will be overridden by productContext in the prompt
        description: productContext,
      },
      marketingAngle,
      ragPatterns,
    };

    // Get LLM configs
    // WHY: 3-step pipeline uses MiMo (free) for generation, DeepSeek for judge.
    //      2-call pipeline uses DeepSeek for copywriter + composer.
    //      Source: GUIDE-IA.md "Architecture Actuelle"
    const llmConfig = getLlmConfig();
    const judgeConfig = getCopywriterConfig(); // DeepSeek for judging

    // WHY: For advertorial, pass producer config (MiMo, free) to enable 3-step pipeline.
    //      For other formats, pass DeepSeek for 2-call JSON pipeline.
    const producerConfig = genRequest.pageType === 'advertorial'
      ? getProducerConfig()  // MiMo (free, validated 8.92 avg)
      : judgeConfig;         // DeepSeek for JSON copywriter

    await job.updateProgress(20);

    // Call the page generator with producer + judge configs separated
    const result = await generatePage(genRequest, llmConfig, producerConfig, judgeConfig);

    await job.updateProgress(80);

    if (!result.success) {
      log.error('Page generation failed', {
        variantId,
        attempts: result.attempts,
        error: result.error,
      });
      throw new Error(result.error ?? 'Page generation failed');
    }

    // Save BlockTree to variant in DB
    await db
      .update(pageVariants)
      .set({
        page: result.blockTree ?? {},
        status: 'generated',
        updatedAt: new Date(),
      })
      .where(eq(pageVariants.id, variantId));

    await job.updateProgress(100);

    log.info('Page generation complete', {
      variantId,
      attempts: result.attempts,
      tokensUsed: result.meta.tokensUsed,
      durationMs: result.meta.durationMs,
    });

    return {
      variantId,
      success: true,
      attempts: result.attempts,
      tokensUsed: result.meta.tokensUsed,
      durationMs: result.meta.durationMs,
    };
  },
  {
    connection,
    concurrency: 3, // Max 3 concurrent LLM calls
    limiter: {
      max: 10,       // Max 10 jobs
      duration: 60000, // Per minute
    },
  },
);

// ─── Worker Events ────────────────────────────────────────────────────────────

pageGenerationWorker.on('completed', (job) => {
  log.info('Job completed', { jobId: job.id, variantId: job.data.variantId });
});

pageGenerationWorker.on('failed', (job, err) => {
  log.error('Job failed', {
    jobId: job?.id,
    variantId: job?.data.variantId,
    error: err.message,
    attemptsMade: job?.attemptsMade,
  });
});

pageGenerationWorker.on('error', (err) => {
  log.error('Worker error', { error: err.message });
});
