/**
 * Purpose: Create a Stripe Payment Intent for funnel checkout payment.
 * WHY: The checkout page uses Stripe.js Elements. When the customer clicks
 *      "Pay", the frontend calls this endpoint to create a PaymentIntent,
 *      then confirms it client-side with stripe.confirmCardPayment().
 * Dependencies: stripe (v18), @/lib/stripe
 * Related: public/checkout.html (Stripe.js client), src/lib/stripe.ts
 */

import { NextResponse } from 'next/server';
import { createEcomPaymentIntent } from '@/lib/stripe';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, currency = 'usd' } = body;

    // WHY: Amount must be in cents (integer). $49.00 = 4900.
    if (!amount || typeof amount !== 'number' || amount < 50) {
      return NextResponse.json(
        { success: false, error: 'Invalid amount. Must be >= 50 cents.' },
        { status: 400 },
      );
    }

    const result = await createEcomPaymentIntent(
      Math.round(amount),
      currency,
      { source: 'funnel-checkout' },
    );

    return NextResponse.json({
      success: true,
      clientSecret: result.clientSecret,
      paymentIntentId: result.paymentIntentId,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[create-payment-intent] Error:', message);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
