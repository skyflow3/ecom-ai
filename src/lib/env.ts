/**
 * Purpose: Validate environment variables at startup.
 * Crash explicitly if a required key is missing.
 * Dependencies: zod
 * Related: .env.example, drizzle.config.ts
 */

import { z } from "zod";

const envSchema = z.object({
  // Database (REQUIRED — app won't start without it)
  DATABASE_URL: z.string().min(1),

  // Auth (Clerk) — optional during initial deploy, required for auth features
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().default(""),
  CLERK_SECRET_KEY: z.string().default(""),
  CLERK_WEBHOOK_SECRET: z.string().default(""),

  // Redis (Upstash) — optional, required for background jobs
  UPSTASH_REDIS_REST_URL: z.string().default(""),
  UPSTASH_REDIS_REST_TOKEN: z.string().default(""),

  // Email (Resend) — optional, required for email features
  RESEND_API_KEY: z.string().default(""),

  // Stripe — optional, required for billing
  STRIPE_SECRET_KEY: z.string().default(""),
  STRIPE_WEBHOOK_SECRET: z.string().default(""),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().default(""),

  // BullMQ (Redis) — optional, required for background jobs
  REDIS_HOST: z.string().default("localhost"),
  REDIS_PORT: z.coerce.number().default(6379),

  // Meta API — optional, required for ads features
  META_ACCESS_TOKEN: z.string().default(""),
  META_AD_ACCOUNT_ID: z.string().default(""),
  META_APP_ID: z.string().default(""),
  META_APP_SECRET: z.string().default(""),

  // AI (Content Production)
  MIMO_API_KEY: z.string().default(""),
  MIMO_API_URL: z.string().default("https://api.mimo.vn/v1/chat/completions"),
  DEEPSEEK_API_KEY: z.string().default(""),
  DEEPSEEK_API_URL: z.string().default("https://api.deepseek.com/v1/chat/completions"),

  // Storage (Supabase)
  SUPABASE_URL: z.string().default(""),
  SUPABASE_SERVICE_ROLE_KEY: z.string().default(""),

  // App
  NEXT_PUBLIC_APP_URL: z.string().default("http://localhost:3000"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const missing = parsed.error.issues.map((i) => i.path.join(".")).join(", ");
    throw new Error(`Missing env vars: ${missing}`);
  }
  return parsed.data;
}

export const env = validateEnv();
