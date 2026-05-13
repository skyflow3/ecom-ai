/**
 * Purpose: Stripe client singleton + billing session helpers.
 *          Creates checkout sessions, customer portal sessions,
 *          and maps Stripe price IDs to ECOM-AI plans.
 * Dependencies: stripe (v18), @/lib/config (env vars), @/lib/plans
 * Related: src/app/api/billing/checkout/route.ts, src/app/api/billing/portal/route.ts
 *
 * WHY: Stripe is initialized once and reused across all billing API routes.
 *      All Stripe interaction goes through this module so the client config
 *      is consistent (API version, timeout, etc.).
 *
 * USAGE:
 *   import { createCheckoutSession, createPortalSession } from '@/lib/stripe';
 *   const session = await createCheckoutSession(userId, priceId);
 */

import Stripe from 'stripe';
import { getEnv } from '@/lib/config';
import { getPlanFromPriceId } from '@/lib/plans';
import { createLogger } from '@/lib/logger';

const log = createLogger('stripe');

// ─── Stripe Client Singleton ───────────────────────────────────────────────────

let _stripe: Stripe | null = null;

/**
 * Get the initialized Stripe client.
 * Throws if STRIPE_SECRET_KEY is not configured.
 */
export function getStripe(): Stripe {
  if (_stripe) return _stripe;

  const env = getEnv();

  // WHY: Support both naming conventions — TEST_/LIVE_ prefix or plain STRIPE_
  const secretKey = process.env.STRIPE_TEST_SECRET_KEY
    ?? process.env.STRIPE_LIVE_SECRET_KEY
    ?? env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error(
      'STRIPE_TEST_SECRET_KEY or STRIPE_SECRET_KEY is required. ' +
      'Set it in .env or disable billing routes.',
    );
  }

  _stripe = new Stripe(secretKey, {
    // WHY: Pin API version to avoid breaking changes on Stripe upgrades.
    //      v18 of the SDK ships with this API version as default.
    typescript: true,
  });

  log.info('Stripe client initialized');

  return _stripe;
}

// ─── Checkout Session ──────────────────────────────────────────────────────────

/**
 * Create a Stripe Checkout Session for a subscription.
 *
 * @param clerkId - The user's Clerk ID (stored as metadata for webhook lookup)
 * @param email - User's email (pre-fills checkout)
 * @param priceId - The Stripe Price ID to subscribe to
 * @returns Stripe Checkout Session URL
 */
export async function createCheckoutSession(
  clerkId: string,
  email: string,
  priceId: string,
): Promise<string> {
  const stripe = getStripe();
  const env = getEnv();
  const appUrl = env.NEXT_PUBLIC_APP_URL;

  const plan = getPlanFromPriceId(priceId);
  log.info('Creating checkout session', { clerkId, priceId, plan });

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer_email: email,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${appUrl}/billing?success=true`,
    cancel_url: `${appUrl}/billing?canceled=true`,
    // WHY: metadata is critical — webhooks use this to find the user in our DB.
    metadata: {
      clerkId,
      plan,
    },
  });

  if (!session.url) {
    throw new Error('Stripe checkout session created without a URL');
  }

  log.info('Checkout session created', {
    sessionId: session.id,
    clerkId,
    plan,
  });

  return session.url;
}

// ─── Customer Portal Session ───────────────────────────────────────────────────

/**
 * Create a Stripe Customer Portal session for subscription management.
 *
 * @param stripeCustomerId - The Stripe Customer ID (stored on our user record)
 * @returns Stripe Portal Session URL
 */
export async function createPortalSession(
  stripeCustomerId: string,
): Promise<string> {
  const stripe = getStripe();
  const env = getEnv();
  const appUrl = env.NEXT_PUBLIC_APP_URL;

  log.info('Creating portal session', { stripeCustomerId });

  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${appUrl}/billing`,
  });

  log.info('Portal session created', {
    sessionId: session.id,
    customerId: stripeCustomerId,
  });

  return session.url;
}

// ─── Plan from Price ───────────────────────────────────────────────────────────
// Re-exported from plans.ts for convenience (routes that import stripe.ts
// can get plan mapping without a second import)

export { getPlanFromPriceId } from '@/lib/plans';

// ─── E-Commerce Payment Intent ────────────────────────────────────────────────

/**
 * Create a Stripe Payment Intent for a one-time e-commerce purchase.
 * WHY: Funnel checkout pages need Payment Intents (not Checkout Sessions).
 *      The checkout template uses Stripe Elements with confirmCardPayment().
 *      This creates the server-side intent; the client confirms it.
 *
 * @param amount - Amount in cents (e.g., 4900 = $49.00)
 * @param currency - 3-letter currency code (e.g., 'usd')
 * @param metadata - Optional metadata (order info, funnel step, etc.)
 * @returns { clientSecret, paymentIntentId }
 */
export async function createEcomPaymentIntent(
  amount: number,
  currency: string = 'usd',
  metadata?: Record<string, string>,
): Promise<{ clientSecret: string; paymentIntentId: string }> {
  const stripe = getStripe();

  log.info('Creating e-commerce payment intent', { amount, currency });

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency,
    metadata: metadata ?? {},
    // WHY: automatic_payment_methods lets Stripe handle available methods
    //      based on the dashboard settings (cards, Apple Pay, Google Pay, etc.)
    automatic_payment_methods: { enabled: true },
  });

  if (!paymentIntent.client_secret) {
    throw new Error('Payment intent created without client_secret');
  }

  log.info('Payment intent created', {
    paymentIntentId: paymentIntent.id,
    amount,
    currency,
  });

  return {
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
  };
}
