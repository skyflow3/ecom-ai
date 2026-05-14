/**
 * Purpose: POST /api/checkout/create — create a Stripe Checkout Session
 *          for the Nutrovia Triple Fusion Massager ($95 one-time payment).
 * Dependencies: @/lib/stripe (Stripe client)
 * Related: public/checkout.html (consumer)
 *
 * WHY: Stripe Checkout hosted page handles the entire payment form.
 *      We just create a session and redirect. No client-side payment logic needed.
 */

import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { createLogger } from '@/lib/logger';

const log = createLogger('api:checkout:create');

const PRODUCT_PRICE = 9500; // $95.00 in cents
const SHIPPING_PRICE = 495; // $4.95 in cents

export async function POST(): Promise<Response> {
  try {
    const stripe = getStripe();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://nutrovia.co';

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Nutrovia Triple Fusion Massager',
              description: '3-mode back massager: traction, infrared heat, vibration. Complete package with power adapter and user guide.',
              images: ['https://nutrovia.co/images/product-hero.jpg'],
            },
            unit_amount: PRODUCT_PRICE,
          },
          quantity: 1,
        },
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Standard Shipping',
            },
            unit_amount: SHIPPING_PRICE,
          },
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/?order=success`,
      cancel_url: `${appUrl}/checkout.html`,
      metadata: {
        product: 'nutrovia-triple-fusion-massager',
        source: 'vitrine-checkout',
      },
    });

    if (!session.url) {
      throw new Error('Stripe checkout session created without a URL');
    }

    log.info('Checkout session created', { sessionId: session.id });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    log.error('Checkout session creation failed', { error: message });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
