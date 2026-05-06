/**
 * Purpose: BullMQ worker for page deployment jobs.
 *          Renders HTML, optimizes, uploads to storage, updates DB.
 * Dependencies: deploy-pipeline.ts, page-speed-optimizer.ts, queues.ts
 * Related: Architecture Finale.md §52 (Background Jobs)
 *
 * WHY: Deployment involves file I/O and network uploads (5-15s).
 *      Background worker enables retry on upload failure and
 *      concurrent deployments.
 */

import { Worker, type Job } from 'bullmq';
import { createLogger } from '../../lib/logger';
import { connection } from '../connection';
import type { PageDeployJobData } from '../queues';
import { deployVariant } from '../../services/deploy-pipeline';

const log = createLogger('worker:page-deploy');

// ─── Worker ───────────────────────────────────────────────────────────────────

export const pageDeployWorker = new Worker<PageDeployJobData>(
  'page-deploy',
  async (job: Job<PageDeployJobData>) => {
    const { variantId, optimizeSpeed = false, triggeredBy } = job.data;

    log.info('Starting page deploy', { variantId, optimizeSpeed, triggeredBy });

    await job.updateProgress(10);

    // Deploy the variant — validates, renders HTML, uploads to storage
    const result = await deployVariant(variantId);

    await job.updateProgress(90);

    if (!result.success) {
      log.error('Page deploy failed', {
        variantId,
        error: result.error,
      });
      throw new Error(result.error ?? 'Page deploy failed');
    }

    await job.updateProgress(100);

    log.info('Page deploy complete', {
      variantId,
      url: result.url,
      r2Key: result.r2Key,
    });

    return {
      variantId,
      url: result.url,
      r2Key: result.r2Key,
      htmlLength: result.html?.length ?? 0,
    };
  },
  {
    connection,
    concurrency: 5,  // Deploy is faster than generation
  },
);

// ─── Worker Events ────────────────────────────────────────────────────────────

pageDeployWorker.on('completed', (job) => {
  log.info('Deploy completed', { jobId: job.id, variantId: job.data.variantId });
});

pageDeployWorker.on('failed', (job, err) => {
  log.error('Deploy failed', {
    jobId: job?.id,
    variantId: job?.data.variantId,
    error: err.message,
  });
});

pageDeployWorker.on('error', (err) => {
  log.error('Deploy worker error', { error: err.message });
});
