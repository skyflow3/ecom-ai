/**
 * Purpose: POST /api/billing/portal — create a Stripe Customer Portal Session.
 *          Lets subscribers manage their payment method, view invoices,
 *          upgrade/downgrade, or cancel their subscription.
 * Dependencies: @/lib/auth, @/lib/stripe, @/lib/db, @/db/schema
 * Related: src/app/api/billing/checkout/route.ts
 *
 * WHY: Stripe requires a server-side call to create portal sessions.
 *      The portal URL lets users self-serve billing changes without contacting support.
 *
 * FLOW:
 *   1. User clicks "Manage Subscription" on /billing page
 *   2. Frontend POSTs here (optionally with customerId)
 *   3. We look up the user's stripeCustomerId from DB
 *   4. Create a Stripe portal session and return the URL
 */

import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { requireAuth, AuthError } from '@/lib/auth';
import { createPortalSession, getStripe } from '@/lib/stripe';
import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { createLogger } from '@/lib/logger';

const log = createLogger('api:billing:portal');

// ─── POST Handler ───────────────────────────────────────────────────────────────

export async function POST(): Promise<Response> {
  try {
    const user = await requireAuth();

    // WHY: Portal requires a Stripe Customer ID. Users who are on the free plan
    //      have never checked out, so they don't have one.
    if (!user.stripeCustomerId) {
      return NextResponse.json(
        {
          success: false,
          error: 'No billing account found. Please subscribe to a plan first.',
        },
        { status: 400 },
      );
    }

    log.info('Creating portal session', {
      userId: user.id,
      stripeCustomerId: user.stripeCustomerId,
    });

    const url = await createPortalSession(user.stripeCustomerId);

    return NextResponse.json({ success: true, url });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.statusCode },
      );
    }

    const message = error instanceof Error ? error.message : 'Internal server error';
    log.error('Portal session failed', { error: message });
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
