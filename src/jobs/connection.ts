/**
 * Purpose: Redis connection for BullMQ job queues.
 *          Separate from Upstash REST client (used for rate limiting).
 * Dependencies: ioredis
 * Related: src/jobs/workers/*.ts, Architecture Finale.md §52 (Background Jobs)
 *
 * WHY: BullMQ requires a standard Redis connection (ioredis), not the REST API.
 *      The Upstash REST client is for rate limiting only.
 *      Using Upstash Redis with ioredis-compatible mode for production.
 */

import IORedis from 'ioredis';
import { createLogger } from '../lib/logger';

const log = createLogger('jobs:redis');

const REDIS_URL = process.env.REDIS_URL
  ?? `redis://default:${process.env.UPSTASH_REDIS_REST_TOKEN}@${process.env.UPSTASH_REDIS_REST_URL?.replace('https://', '')}`;

/**
 * Shared Redis connection for all BullMQ queues.
 * BullMQ requires ioredis — it doesn't work with REST clients.
 */
export const connection = new IORedis(REDIS_URL, {
  maxRetriesPerRequest: null, // Required by BullMQ
  enableReadyCheck: false,    // Required by BullMQ
  lazyConnect: true,          // Don't connect until first job
});

connection.on('error', (err) => {
  log.error('Redis connection error', { error: err.message });
});

connection.on('connect', () => {
  log.info('Redis connected for BullMQ');
});
