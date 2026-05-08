/**
 * Purpose: Downsell recipe — the "Wait! Before you go" reduced offer.
 * Shown when user declines the upsell. Lower price, smaller package.
 *
 * Dependencies: Recipe types from index.ts
 * Related: upsell-v1-interrupt.ts (the upsell that precedes this)
 */

import type { PageRecipe } from './index';

export const downsellV1: PageRecipe = {
  id: 'downsell-v1',
  name: 'Downsell (Reduced Offer)',
  description:
    'Shown after user declines the upsell. "Wait! Before you go" — offers a reduced version at a lower price point. The last attempt to convert.',
  pageType: 'downsell',
  source: 'Vibriance downsell, Clarifion downsell patterns',
  blocks: [
    {
      type: 'interrupt-header',
      required: true,
      description:
        '"Wait! Before you go" header. Slightly less aggressive than upsell interrupt.',
      exampleProps: {
        text: 'WAIT! Before You Go...',
        subtext: "We don't want you to miss out!",
        fontSize: '24px',
        fontWeight: 700,
        textAlign: 'center',
      },
    },
    {
      type: 'countdown',
      required: true,
      description: 'Shorter countdown — 5 minutes. More urgency.',
      exampleProps: {
        label: 'This page expires in:',
        durationMinutes: 5,
        textAlign: 'center',
      },
    },
    {
      type: 'headline',
      required: true,
      description:
        'Reduced offer headline. Acknowledges the price objection.',
      exampleProps: {
        text: 'We understand. How about a smaller package?',
        fontSize: '20px',
        fontWeight: 600,
      },
    },
    {
      type: 'price-display',
      required: true,
      description:
        'Reduced price. Smaller quantity. Still shows savings vs retail.',
      exampleProps: {
        oldPrice: '$79.00',
        newPrice: '$39.00',
        savingsPercent: '50%',
        quantity: 1,
        label: '1 Bottle — Just for You',
        oldPriceColor: '#808080',
        savingsBadgeColor: '#EC0B43',
      },
    },
    {
      type: 'cta-button',
      required: true,
      description: 'Green CTA for the reduced offer.',
      exampleProps: {
        text: 'YES! I Want This Deal',
        backgroundColor: '#30BD51',
        textColor: '#fff',
        fontSize: '18px',
        fontWeight: 600,
        width: '100%',
        borderRadius: '4px',
        padding: '15px 25px',
      },
    },
    {
      type: 'negative-opt-out',
      required: true,
      description:
        'Final decline option. Shorter than upsell version.',
      exampleProps: {
        text: "No thanks, I don't need this.",
        color: '#0000EE',
        fontSize: '14px',
      },
    },
  ],
  designTokens: {
    maxWidth: '520px',
    primaryColor: '#02122E',
    ctaColor: '#30BD51',
    ctaGradient: undefined,
    backgroundColor: '#FFFFFF',
    fontFamily: "'Helvetica', serif",
  },
  notes: [
    'Downsell is simpler and shorter than upsell.',
    'The offer must be genuinely different (smaller quantity, lower price).',
    'Countdown is shorter (5 min) to increase urgency.',
    'This is the LAST conversion attempt before user exits.',
    'Less text than upsell — get straight to the offer.',
  ].join('\n'),
};
