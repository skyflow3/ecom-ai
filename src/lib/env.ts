/**
 * Purpose: Validate environment variables at startup.
 * Crash explicitly if a required key is missing.
 * Dependencies: zod
 * Related: .env.example, drizzle.config.ts
 */

import { z } from "zod";

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),

  // Auth (Clerk)
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
  CLERK_SECRET_KEY: z.string().min(1),
  CLERK_WEBHOOK_SECRET: z.string().min(1),

  // Redis (Upstash)
  UPSTASH_REDIS_REST_URL: z.string().url(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1),

  // Email (Resend)
  RESEND_API_KEY: z.string().min(1),

  // Stripe
  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1),

  // BullMQ (Redis)
  REDIS_HOST: z.string().min(1),
  REDIS_PORT: z.coerce.number().default(6379),

  // Meta API
  META_ACCESS_TOKEN: z.string().min(1),
  META_AD_ACCOUNT_ID: z.string().min(1),
  META_APP_ID: z.string().min(1),
  META_APP_SECRET: z.string().min(1),

  // AI (Content Production)
  MIMO_API_KEY: z.string().min(1).optional(),
  MIMO_API_URL: z.string().url().optional(),
  DEEPSEEK_API_KEY: z.string().min(1).optional(),
  DEEPSEEK_API_URL: z.string().url().optional(),

  // Storage (Supabase)
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),

  // App
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
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
