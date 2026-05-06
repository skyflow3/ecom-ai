/**
 * Purpose: Plan definitions, limits, and quota enforcement for ECOM-AI billing.
 *          Free/Pro/Enterprise tiers with feature gates.
 * Dependencies: None (pure logic, no DB calls here)
 * Related: src/lib/stripe.ts (price → plan mapping), src/lib/auth.ts (LocalUser.plan)
 *
 * WHY: Plan logic must live in ONE place. All API routes import helpers from here
 *      to check quotas. Limits are -1 for unlimited (Enterprise).
 *
 * USAGE:
 *   import { getPlanLimits, canCreateFunnel } from '@/lib/plans';
 *   const limits = getPlanLimits(user.plan);        // { funnels: 10, ... }
 *   const allowed = canCreateFunnel(user, 3);        // true/false
 */

// ─── Plan Definitions ──────────────────────────────────────────────────────────

export interface PlanLimits {
  /** Display name for UI */
  name: string;
  /** Monthly price in USD */
  price: number;
  /** Max funnels allowed (-1 = unlimited) */
  funnels: number;
  /** Max pages generated per month (-1 = unlimited) */
  pagesPerMonth: number;
  /** Max A/B tests running simultaneously (-1 = unlimited, 0 = disabled) */
  abTests: number;
  /** Whether custom domain is allowed */
  customDomain: boolean;
  /** Stripe price ID (null for free tier) */
  stripePriceId: string | null;
}

export type PlanKey = 'free' | 'pro' | 'enterprise';

/**
 * All plan definitions. Source of truth for billing AND feature gates.
 * stripePriceId maps to the Stripe Price object created in the Stripe dashboard.
 */
export const PLANS: Record<PlanKey, PlanLimits> = {
  free: {
    name: 'Free',
    price: 0,
    funnels: 1,
    pagesPerMonth: 5,
    abTests: 0,
    customDomain: false,
    stripePriceId: null,
  },
  pro: {
    name: 'Pro',
    price: 29,
    funnels: 10,
    pagesPerMonth: 100,
    abTests: 5,
    customDomain: true,
    stripePriceId: process.env.STRIPE_PRO_PRICE_ID ?? null,
  },
  enterprise: {
    name: 'Enterprise',
    price: 99,
    funnels: -1,
    pagesPerMonth: -1,
    abTests: -1,
    customDomain: true,
    stripePriceId: process.env.STRIPE_ENTERPRISE_PRICE_ID ?? null,
  },
};

// ─── Reverse lookup: Stripe price ID → plan key ────────────────────────────────
// WHY: Webhooks give us a priceId. We need to map it back to our plan key
//      to update the user's plan column in the DB.

const priceIdToPlan = new Map<string, PlanKey>();

for (const [key, plan] of Object.entries(PLANS) as Array<[PlanKey, PlanLimits]>) {
  if (plan.stripePriceId) {
    priceIdToPlan.set(plan.stripePriceId, key);
  }
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Get the limits for a given plan name.
 * Falls back to 'free' if the plan name is unrecognized.
 */
export function getPlanLimits(plan: string): PlanLimits {
  const key = plan as PlanKey;
  return PLANS[key] ?? PLANS.free;
}

/**
 * Map a Stripe price ID back to our plan key.
 * Returns 'free' if the price ID is not recognized.
 */
export function getPlanFromPriceId(priceId: string): PlanKey {
  return priceIdToPlan.get(priceId) ?? 'free';
}

/**
 * Check if a user can create more funnels.
 * @param user - Must have `plan` field from LocalUser
 * @param currentFunnelCount - Number of funnels the user already has
 */
export function canCreateFunnel(
  user: { plan: string },
  currentFunnelCount: number,
): boolean {
  const limits = getPlanLimits(user.plan);
  // WHY: -1 means unlimited (Enterprise)
  if (limits.funnels === -1) return true;
  return currentFunnelCount < limits.funnels;
}

/**
 * Check if a user can generate more pages this month.
 * @param user - Must have `plan` field from LocalUser
 * @param usedThisMonth - Pages already generated this month
 */
export function canGeneratePage(
  user: { plan: string },
  usedThisMonth: number,
): boolean {
  const limits = getPlanLimits(user.plan);
  // WHY: -1 means unlimited (Enterprise)
  if (limits.pagesPerMonth === -1) return true;
  return usedThisMonth < limits.pagesPerMonth;
}

/**
 * Check if a user can run more A/B tests.
 * @param user - Must have `plan` field from LocalUser
 * @param activeTests - Number of currently active tests
 */
export function canCreateAbTest(
  user: { plan: string },
  activeTests: number,
): boolean {
  const limits = getPlanLimits(user.plan);
  if (limits.abTests === -1) return true;
  if (limits.abTests === 0) return false;
  return activeTests < limits.abTests;
}

/**
 * Check if a user can use custom domains.
 */
export function canUseCustomDomain(user: { plan: string }): boolean {
  return getPlanLimits(user.plan).customDomain;
}
