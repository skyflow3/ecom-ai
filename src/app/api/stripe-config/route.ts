/**
 * Purpose: Return Stripe publishable key for client-side Stripe.js initialization.
 * WHY: The checkout.html is a static file and can't read env vars directly.
 *      This endpoint provides the publishable key (safe to expose — it's public).
 * Related: public/checkout.html (Stripe.js client), /api/create-payment-intent
 */

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  // WHY: Support both naming conventions — TEST_/LIVE_ prefix or plain STRIPE_
  const publishableKey = process.env.STRIPE_TEST_PUBLISHABLE_KEY
    ?? process.env.STRIPE_LIVE_PUBLISHABLE_KEY
    ?? process.env.STRIPE_PUBLISHABLE_KEY
    ?? process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    ?? '';

  if (!publishableKey) {
    return NextResponse.json({
      publishableKey: '',
      configured: false,
    });
  }

  return NextResponse.json({
    publishableKey,
    configured: true,
  });
}
