/**
 * Purpose: POST /api/billing/checkout — create a Stripe Checkout Session.
 *          Authenticated users send a priceId and get a Stripe checkout URL.
 * Dependencies: @/lib/auth, @/lib/stripe, @/lib/plans
 * Related: src/app/api/billing/portal/route.ts, src/app/api/webhooks/stripe/route.ts
 *
 * WHY: Frontend calls this endpoint when the user clicks "Upgrade to Pro/Enterprise".
 *      We create the checkout server-side so the priceId stays secret and we
 *      can attach user metadata for the webhook to pick up.
 *
 * FLOW:
 *   1. User clicks "Upgrade" on /billing page
 *   2. Frontend POSTs { priceId } here
 *   3. We create a Stripe Checkout Session with user metadata
 *   4. Return the session URL → frontend redirects user to Stripe
 *   5. After payment, Stripe webhook updates the user's plan in DB
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth, AuthError } from '@/lib/auth';
import { createCheckoutSession } from '@/lib/stripe';
import { PLANS, type PlanKey } from '@/lib/plans';
import { createLogger } from '@/lib/logger';

const log = createLogger('api:billing:checkout');

// ─── Validation ─────────────────────────────────────────────────────────────────

const checkoutSchema = z.object({
  /** Stripe Price ID (e.g. price_1ABC...) */
  priceId: z.string().min(1, 'priceId is required'),
});

// ─── POST Handler ───────────────────────────────────────────────────────────────

export async function POST(request: Request): Promise<Response> {
  try {
    // WHY: requireAuth throws AuthError(401) if not signed in — we catch it below.
    const user = await requireAuth();

    const body = await request.json();
    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request body',
          details: parsed.error.issues.map((i) => ({
            path: i.path.join('.'),
            message: i.message,
          })),
        },
        { status: 400 },
      );
    }

    const { priceId } = parsed.data;

    // WHY: Validate that the priceId matches one of our configured plans.
    //      Prevents users from passing arbitrary price IDs.
    const validPlan = Object.entries(PLANS).find(
      ([, plan]) => plan.stripePriceId === priceId,
    );

    if (!validPlan) {
      log.warn('Invalid priceId attempted', {
        userId: user.id,
        priceId,
      });
      return NextResponse.json(
        { success: false, error: 'Invalid price ID' },
        { status: 400 },
      );
    }

    const [planKey] = validPlan as [PlanKey, typeof PLANS[PlanKey]];

    // WHY: Don't allow downgrading to the same plan or lower via checkout.
    //      Portal handles upgrades/downgrades for existing subscribers.
    if (user.plan === planKey) {
      return NextResponse.json(
        { success: false, error: 'You are already on this plan' },
        { status: 400 },
      );
    }

    log.info('Creating checkout session', {
      userId: user.id,
      currentPlan: user.plan,
      targetPlan: planKey,
    });

    const url = await createCheckoutSession(
      user.clerkId,
      user.email,
      priceId,
    );

    return NextResponse.json({ success: true, url });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.statusCode },
      );
    }

    const message = error instanceof Error ? error.message : 'Internal server error';
    log.error('Checkout session failed', { error: message });
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
