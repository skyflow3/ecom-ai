/**
 * Purpose: Job runner — starts all BullMQ workers.
 *          Import this file to initialize the worker process.
 * Dependencies: All workers, queues
 * Related: Architecture Finale.md §52
 *
 * WHY: Workers run as a separate process from the Next.js server.
 *      This file is the entry point for the worker process:
 *        `npx tsx src/jobs/index.ts`
 *
 *      In production (Coolify), this runs as a separate container/service.
 *      In development, you can run it alongside the Next.js server.
 */

import '../renderers'; // Register all block renderers

import { createLogger } from '../lib/logger';
import { pageGenerationWorker } from './workers/page-generation';
import { pageDeployWorker } from './workers/page-deploy';
import { abEvaluationWorker, scheduleEvaluationJob } from './workers/ab-evaluation';
import { patternCodifyWorker } from './workers/pattern-codify';

const log = createLogger('jobs:runner');

log.info('Starting BullMQ workers...');

// Workers auto-start when instantiated
// Schedule A/B evaluation repeatable job
scheduleEvaluationJob().catch((err) => {
  log.error('Failed to schedule A/B evaluation job', {
    error: err instanceof Error ? err.message : String(err),
  });
});

log.info('Workers started', {
  queues: ['page-generation', 'page-deploy', 'ab-evaluation', 'pattern-codify'],
  concurrency: {
    'page-generation': 3,
    'page-deploy': 5,
    'ab-evaluation': 1,
    'pattern-codify': 1,
  },
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  log.info('SIGTERM received — closing workers...');
  await Promise.all([
    pageGenerationWorker.close(),
    pageDeployWorker.close(),
    abEvaluationWorker.close(),
    patternCodifyWorker.close(),
  ]);
  log.info('Workers closed');
  process.exit(0);
});

process.on('SIGINT', async () => {
  log.info('SIGINT received — closing workers...');
  await Promise.all([
    pageGenerationWorker.close(),
    pageDeployWorker.close(),
    abEvaluationWorker.close(),
    patternCodifyWorker.close(),
  ]);
  log.info('Workers closed');
  process.exit(0);
});
