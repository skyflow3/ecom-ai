/**
 * Purpose: App configuration — typed access to environment variables
 * Dependencies: none (wraps process.env)
 * Related: src/lib/env.ts (validates at startup), src/lib/stripe.ts
 *
 * WHY: Some modules need env vars but can't import env.ts (which crashes
 *      if vars are missing during tests). This provides a safe subset.
 *      env.ts validates at app startup; config.ts provides runtime access.
 */

import type { GeneratorConfig } from "@/services/page-generator";

export function getEnv() {
  return {
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ?? "",
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    DATABASE_URL: process.env.DATABASE_URL ?? "",
    REDIS_HOST: process.env.REDIS_HOST ?? "localhost",
    REDIS_PORT: process.env.REDIS_PORT ?? "6379",
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL ?? "",
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN ?? "",
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY ?? "",
    CLERK_WEBHOOK_SECRET: process.env.CLERK_WEBHOOK_SECRET ?? "",
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET ?? "",
    RESEND_API_KEY: process.env.RESEND_API_KEY ?? "",
  };
}

/**
 * WHY: Page generation needs an LLM API config. Default to MiMo (free)
 *      but can be overridden for DeepSeek or other providers.
 */
export function getLlmConfig(): GeneratorConfig {
  return {
    apiUrl: process.env.MIMO_API_URL ?? "https://api.mimo.vn/v1/chat/completions",
    apiKey: process.env.MIMO_API_KEY ?? "",
    model: process.env.LLM_MODEL ?? "mimo-v2-flash",
    temperature: 0.3,
    maxTokens: 8000,
    maxRetries: 3,
    minScore: 70,
  };
}
