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

// ─── MiMo Round-Robin ───────────────────────────────────────────────────────
// WHY: MiMo free keys have rate limits. Round-robin distributes calls across
//      multiple keys to avoid hitting limits on any single key.

const MIMO_KEYS = [
  process.env.MIMO_API_KEY ?? "",
  process.env.MIMO_API_KEY_2 ?? "",
  process.env.MIMO_API_KEY_3 ?? "",
  process.env.MIMO_API_KEY_4 ?? "",
  process.env.MIMO_API_KEY_5 ?? "",
  process.env.MIMO_API_KEY_6 ?? "",
].filter(Boolean); // Remove empty strings

let mimoKeyIndex = 0;

function getNextMimoKey(): string {
  if (MIMO_KEYS.length === 0) return process.env.MIMO_API_KEY ?? "";
  const key = MIMO_KEYS[mimoKeyIndex % MIMO_KEYS.length];
  mimoKeyIndex++;
  return key;
}

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
 * WHY: Composer (structurer) uses DeepSeek — better at following complex layout
 *      instructions, produces longer text, respects 2-column advertorial structure.
 *      MiMo was too weak: short text, ignored layout, missing images.
 *      3 of 4 MiMo keys were out of balance anyway.
 *      Fallback to MiMo if DEEPSEEK_COMPOSER_ENABLED is not set.
 */
export function getLlmConfig(): GeneratorConfig {
  const useDeepSeek = process.env.DEEPSEEK_COMPOSER_ENABLED === "true"
    || MIMO_KEYS.length === 0;

  if (useDeepSeek) {
    return {
      apiUrl: process.env.DEEPSEEK_API_URL ?? "https://api.deepseek.com/v1/chat/completions",
      apiKey: process.env.DEEPSEEK_API_KEY ?? "",
      model: process.env.DEEPSEEK_MODEL ?? "deepseek-chat",
      temperature: 0.3,
      // WHY: No limit — let the AI generate as much content as it needs.
      // DeepSeek max output is 8192 by default, can go up to 16384 with parameter.
      maxTokens: 16384,
      maxRetries: 3,
      minScore: 70,
    };
  }

  return {
    apiUrl: process.env.MIMO_API_URL ?? "https://api.xiaomimimo.com/v1/chat/completions",
    apiKey: getNextMimoKey(),
    model: process.env.LLM_MODEL ?? "mimo-v2-flash",
    temperature: 0.3,
    maxTokens: 16384,
    maxRetries: 3,
    minScore: 70,
    allKeys: MIMO_KEYS.length > 1 ? MIMO_KEYS : undefined,
  };
}

/**
 * WHY: Two-call pipeline — copywriter uses DeepSeek (better at creative writing),
 *      composer uses MiMo (free, good at structured JSON output).
 *      Lab testing proved DeepSeek solo beats MiMo Dual Persona on advertorial (+1.010).
 * Source: CHAMPIONS.md #12, testing-ai-prompt discoveries
 */
export function getCopywriterConfig(): GeneratorConfig {
  return {
    apiUrl: process.env.COPYWRITER_API_URL ?? "https://api.deepseek.com/v1/chat/completions",
    apiKey: process.env.DEEPSEEK_API_KEY ?? "",
    model: process.env.COPYWRITER_MODEL ?? "deepseek-chat",
    temperature: 0.5,
    maxTokens: 16384,
    maxRetries: 3,
    minScore: 70,
  };
}

/**
 * WHY: 3-step pipeline producer uses MiMo (FREE) — validated as champion producer.
 *      Lab scores: MiMo free text 8.92 avg vs DeepSeek JSON 6.44. MiMo is free AND better.
 *      Judge still uses DeepSeek (more accurate scoring).
 * Source: GUIDE-IA.md #10, test-results/2026-05-09-lab-exact-v2-validated.md
 */
export function getProducerConfig(): GeneratorConfig {
  return {
    apiUrl: process.env.MIMO_API_URL ?? "https://api.xiaomimimo.com/v1/chat/completions",
    apiKey: getNextMimoKey(),
    model: process.env.MIMO_MODEL ?? "mimo-v2-flash",
    temperature: 0.3,
    maxTokens: 16384,
    maxRetries: 3,
    minScore: 70,
    allKeys: MIMO_KEYS.length > 1 ? MIMO_KEYS : undefined,
  };
}

/**
 * WHY: Feature flag for the two-call pipeline. OFF by default so existing
 *      single-call behavior is unchanged until explicitly enabled.
 *      When disabled, falls back to single-call MiMo pipeline.
 */
export function isCopywriterEnabled(): boolean {
  return process.env.COPYWRITER_ENABLED === "true";
}
