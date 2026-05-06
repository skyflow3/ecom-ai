/**
 * Purpose: Upstash Redis client for rate limiting + BullMQ
 * Dependencies: @upstash/redis
 * Related: src/lib/env.ts, src/jobs/
 */

import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});
