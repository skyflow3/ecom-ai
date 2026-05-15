/**
 * Purpose: POST /api/webhooks/stripe — Stripe webhook handler.
 *          Receives billing events and updates user plans in the DB.
 *          Also handles e-commerce payment confirmations.
 * Dependencies: stripe, @/lib/db, @/db/schema, @/lib/plans, @/lib/logger
 * Related: src/app/api/billing/checkout/route.ts (creates the subscription)
 *          src/app/api/create-payment-intent/route.ts (e-commerce payments)
 *
 * WHY: Stripe pushes events to this endpoint when subscriptions change.
 *      This is the ONLY reliable way to know the user's billing state.
 *      Client-side confirmation is unreliable (user can close the tab).
 *
 * EVENTS HANDLED:
 *   checkout.session.completed     → New subscription, set plan from priceId
 *   customer.subscription.updated  → Plan change (upgrade/downgrade)
 *   customer.subscription.deleted  → Cancellation, downgrade to free
 *   invoice.payment_failed         → Log warning (user may need to update card)
 *   payment_intent.succeeded       → E-commerce payment confirmed, update purchase status
 *
 * IMPORTANT:
 *   - Always returns 200 for valid webhooks (Stripe retries on non-200).
 *   - Uses raw body (request.text()) for signature verification.
 *   - Invalid signatures return 401 (not a real Stripe event).
 */

import { eq } from 'drizzle-orm';
import Stripe from 'stripe';
import { db } from '@/lib/db';
import { users, purchases } from '@/db/schema';
import { getPlanFromPriceId } from '@/lib/plans';
import { createLogger } from '@/lib/logger';

const log = createLogger('stripe-webhook');

// ─── Webhook Secret ────────────────────────────────────────────────────────────

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

if (!STRIPE_WEBHOOK_SECRET) {
  log.error(
    'STRIPE_WEBHOOK_SECRET is not set. Stripe webhooks cannot verify signatures. ' +
    'Set it in .env (from Stripe Dashboard > Webhooks > Signing secret).',
  );
}

// ─── POST Handler ───────────────────────────────────────────────────────────────

export async function POST(request: Request): Promise<Response> {
  if (!STRIPE_WEBHOOK_SECRET) {
    log.error('Webhook received but STRIPE_WEBHOOK_SECRET is not configured');
    return new Response('Webhook secret not configured', { status: 500 });
  }

  // WHY: Stripe signature verification needs the raw body exactly as received.
  //      request.json() would parse and re-serialize, potentially changing formatting.
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    log.warn('Webhook missing stripe-signature header');
    return new Response('Missing signature', { status: 401 });
  }

  // ─── Verify Signature ──────────────────────────────────────────────────────

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    typescript: true,
  });

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown verification error';
    log.error('Stripe webhook signature verification failed', { error: message });
    return new Response('Invalid signature', { status: 401 });
  }

  log.info('Webhook received', { type: event.type, id: event.id });

  // ─── Route to Handler ────────────────────────────────────────────────────────

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      default:
        log.info('Unhandled webhook event type', { type: event.type });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown handler error';
    log.error('Webhook handler failed', { type: event.type, eventId: event.id, error: message });
    // WHY: Still return 200 — we don't want Stripe to retry on our DB errors.
    //      The webhook is valid; the failure is on our side.
  }

  return new Response('OK', { status: 200 });
}

// ─── Event Handlers ────────────────────────────────────────────────────────────

/**
 * Handle checkout.session.completed — new subscription created.
 * Updates the user's plan and stores the stripeCustomerId.
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session): Promise<void> {
  const clerkId = session.metadata?.clerkId;
  const customerId = session.customer as string;

  if (!clerkId) {
    log.error('Checkout session missing clerkId in metadata', {
      sessionId: session.id,
      customerId,
    });
    return;
  }

  // WHY: The line items contain the price ID which tells us which plan was purchased.
  //      For subscriptions, we get the subscription ID for future reference.
  const priceId = session.metadata?.plan
    ? getPriceIdForPlan(session.metadata.plan)
    : null;

  // WHY: Try to get the plan from metadata first (most reliable), then from line items.
  const planKey = session.metadata?.plan ?? 'free';

  log.info('Checkout completed', {
    clerkId,
    customerId,
    plan: planKey,
    sessionId: session.id,
  });

  await db
    .update(users)
    .set({
      plan: planKey,
      stripeCustomerId: customerId,
      updatedAt: new Date(),
    })
    .where(eq(users.clerkId, clerkId));

  log.info('User plan updated after checkout', { clerkId, plan: planKey });
}

/**
 * Handle subscription.updated — plan change (upgrade/downgrade).
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription): Promise<void> {
  const customerId = subscription.customer as string;

  // WHY: Get the price from the first item. Subscriptions can have multiple items
  //      but ECOM-AI uses single-item subscriptions (one plan per customer).
  const priceId = subscription.items.data[0]?.price.id;

  if (!priceId) {
    log.warn('Subscription updated but no price found in items', {
      subscriptionId: subscription.id,
      customerId,
    });
    return;
  }

  const planKey = getPlanFromPriceId(priceId);

  log.info('Subscription updated', {
    customerId,
    priceId,
    plan: planKey,
    subscriptionId: subscription.id,
  });

  await db
    .update(users)
    .set({
      plan: planKey,
      updatedAt: new Date(),
    })
    .where(eq(users.stripeCustomerId, customerId));

  log.info('User plan updated after subscription change', { customerId, plan: planKey });
}

/**
 * Handle subscription.deleted — user cancelled their subscription.
 * Downgrade to free plan.
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
  const customerId = subscription.customer as string;

  log.info('Subscription deleted — downgrading to free', {
    customerId,
    subscriptionId: subscription.id,
  });

  await db
    .update(users)
    .set({
      plan: 'free',
      updatedAt: new Date(),
    })
    .where(eq(users.stripeCustomerId, customerId));

  log.info('User downgraded to free', { customerId });
}

/**
 * Handle invoice.payment_failed — card declined or payment issue.
 * We log a warning but don't change the plan immediately.
 * Stripe will retry the payment and send customer.subscription.deleted
 * if all retries fail.
 */
async function handlePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
  const customerId = invoice.customer as string;

  log.warn('Payment failed', {
    customerId,
    invoiceId: invoice.id,
    attemptCount: invoice.attempt_count,
    amountDue: invoice.amount_due,
    currency: invoice.currency,
  });

  // WHY: Don't downgrade on first failure. Stripe retries automatically.
  //      If all retries fail, Stripe sends customer.subscription.deleted.
  //      We just log for monitoring — the ops team can reach out if needed.
}

// ─── E-Commerce Payment Handler ────────────────────────────────────────────────

/**
 * Handle payment_intent.succeeded — e-commerce one-time payment confirmed.
 * WHY: When funnel checkout completes, Stripe sends this event.
 *      We update the purchase status from 'pending' to 'paid'.
 *      Race condition: the client may not have created the purchase yet
 *      (it happens in parallel). If not found, we log and the client will
 *      create it with status 'pending', then this webhook will be received again
 *      on Stripe's retry (or the client's POST /api/orders sets status directly).
 */
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent): Promise<void> {
  const piId = paymentIntent.id;

  log.info('Payment intent succeeded', {
    paymentIntentId: piId,
    amount: paymentIntent.amount,
    currency: paymentIntent.currency,
    metadata: paymentIntent.metadata,
  });

  // WHY: Try to find existing purchase by paymentTransactionId
  //      Client-side creates the purchase after confirmCardPayment, webhook may arrive first
  const existing = await db.query.purchases.findFirst({
    where: eq(purchases.paymentTransactionId, piId),
  });

  if (existing) {
    if (existing.status === 'pending') {
      await db
        .update(purchases)
        .set({ status: 'paid', updatedAt: new Date() })
        .where(eq(purchases.paymentTransactionId, piId));

      log.info('Purchase status updated to paid', {
        purchaseId: existing.id,
        orderNumber: existing.orderNumber,
      });

      // WHY: Fire a purchase tracking event to /api/track so A/B test metrics
      //      get updated. The variantId comes from the purchase record.
      //      Fire-and-forget — must not delay the webhook response.
      if (existing.variantId) {
        firePurchaseTrackEvent(existing.variantId, paymentIntent.amount, existing.sessionId).catch(() => {});
      }    } else {
      log.info('Purchase already processed', {
        purchaseId: existing.id,
        status: existing.status,
      });
    }
  } else {
    // WHY: Purchase not created yet by client — webhook arrived first.
    //      The client's POST /api/orders will create it.
    //      We log this for debugging — it's expected behavior.
    log.warn('Payment intent succeeded but no purchase found (client may not have created it yet)', {
      paymentIntentId: piId,
    });
  }
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Best-effort helper: try to get a priceId for a plan name from metadata.
 * Returns undefined if not available (metadata can have the plan key, not priceId).
 */
function getPriceIdForPlan(_planName: string): string | undefined {
  // WHY: In checkout.session.completed, we already have the plan in metadata.
  //      We don't need to reverse-lookup the priceId — we use the plan directly.
  return undefined;
}

/**
 * Fire a purchase tracking event to /api/track for A/B test attribution.
 * WHY: When Stripe confirms payment, we need to tell the tracking system
 *      which variant drove this purchase, so the decision engine can
 *      calculate CVR and promote champions.
 */
async function firePurchaseTrackEvent(
  variantId: string,
  amountCents: number,
  sessionId: string,
): Promise<void> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    await fetch(`${baseUrl}/api/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        variantId,
        event: 'purchase',
        sessionId,
        data: {
          metadata: {
            revenue: (amountCents / 100).toFixed(2),
            source: 'stripe_webhook',
          },
        },
      }),
    });
  } catch {
    // WHY: Fire-and-forget. Tracking failure must not break webhook processing.
  }
}
