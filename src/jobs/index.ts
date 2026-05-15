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

import http from 'http';
import { createLogger } from '../lib/logger';
import { pageGenerationWorker } from './workers/page-generation';
import { pageDeployWorker } from './workers/page-deploy';
import { abEvaluationWorker, scheduleEvaluationJob } from './workers/ab-evaluation';
import { patternCodifyWorker } from './workers/pattern-codify';

const log = createLogger('jobs:runner');

// WHY: Coolify healthcheck needs HTTP 200. Minimal server on port 3010.
const HEALTH_PORT = parseInt(process.env.WORKER_HEALTH_PORT || '3010', 10);
const healthServer = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', service: 'bullmq-worker' }));
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});
healthServer.listen(HEALTH_PORT, () => {
  log.info('Health server started', { port: HEALTH_PORT });
});

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
