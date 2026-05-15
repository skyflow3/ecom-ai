/**
 * Purpose: POST /api/checkout/payment-intent — create a Stripe Payment Intent
 *          for e-commerce funnel checkout pages.
 * Dependencies: @/lib/stripe (createEcomPaymentIntent)
 * Related: checkout-clarifion template (consumer), funnel-generator.ts (config)
 *
 * WHY: The checkout template uses Stripe Elements on the client side.
 *      Client needs a Payment Intent's clientSecret to confirm payment.
 *      This route creates it server-side so the secret key never touches the browser.
 *
 * FLOW:
 *   1. Checkout page JS collects: amount, currency, customer info
 *   2. JS POSTs here → we create a Stripe Payment Intent
 *   3. Return clientSecret → JS confirms with stripe.confirmCardPayment()
 *   4. On success → JS redirects to OTO1 (next funnel step)
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createEcomPaymentIntent } from '@/lib/stripe';
import { createLogger } from '@/lib/logger';

const log = createLogger('api:checkout:payment-intent');

// ─── Validation ─────────────────────────────────────────────────────────────────

const paymentIntentSchema = z.object({
  /** Amount in cents (e.g., 4900 = $49.00) */
  amount: z.number().int().min(50, 'Minimum amount is $0.50'),
  /** 3-letter currency code */
  currency: z.string().length(3).default('usd'),
  /** Optional metadata for tracking */
  metadata: z.record(z.string()).optional(),
  /** WHY: Variant ID from A/B test tracking — stored in PaymentIntent metadata
   *      so the Stripe webhook can attribute purchases to the right variant. */
  variantId: z.string().optional(),
  /** Session ID for tracking */
  sessionId: z.string().optional(),
});

// ─── CORS Headers ───────────────────────────────────────────────────────────────

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// ─── OPTIONS Handler (CORS preflight) ───────────────────────────────────────────

export async function OPTIONS(): Promise<Response> {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

// ─── POST Handler ───────────────────────────────────────────────────────────────

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const parsed = paymentIntentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.issues },
        { status: 400, headers: CORS_HEADERS },
      );
    }

    const { amount, currency, metadata, variantId, sessionId } = parsed.data;

    // WHY: Merge variantId and sessionId into metadata so the Stripe webhook
    //      can attribute purchases to the right A/B test variant.
    const enrichedMetadata = {
      ...metadata,
      ...(variantId ? { variantId } : {}),
      ...(sessionId ? { sessionId } : {}),
    };

    log.info('Creating payment intent', { amount, currency, hasVariant: !!variantId });

    const result = await createEcomPaymentIntent(amount, currency, enrichedMetadata);

    return NextResponse.json(
      {
        clientSecret: result.clientSecret,
        paymentIntentId: result.paymentIntentId,
      },
      { headers: CORS_HEADERS },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    log.error('Payment intent creation failed', { error: message });
    return NextResponse.json(
      { error: message },
      { status: 500, headers: CORS_HEADERS },
    );
  }
}
