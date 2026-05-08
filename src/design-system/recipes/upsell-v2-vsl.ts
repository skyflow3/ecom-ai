/**
 * Purpose: VSL upsell recipe — video-based upsell where the video does the selling.
 * Different from text interrupt upsell — video is the star, less text heavy.
 *
 * Dependencies: Recipe types from index.ts
 * Related: upsell-v1-interrupt.ts (text-based upsell), vsl-v1.ts (main VSL page)
 */

import type { PageRecipe } from './index';

export const upsellV2Vsl: PageRecipe = {
  id: 'upsell-v2-vsl',
  name: 'VSL Upsell',
  description:
    'Video-based upsell page. The video plays first, then reveals the offer. Less aggressive than interrupt upsell. Used for higher-ticket or supplement upsells.',
  pageType: 'upsell',
  source: 'SmoothSpine VSL upsell, Emma Relief upsell pattern',
  blocks: [
    {
      type: 'video-player',
      required: true,
      description:
        'Full-width video player. Wistia or Vidalytics embed. 16:9 aspect ratio. This is the primary selling element.',
      exampleProps: {
        videoUrl: 'https://fast.wistia.net/embed/iframe/xxx',
        aspectRatio: '16/9',
        width: '100%',
        maxWidth: '720px',
        unmuteButtonColor: '#FFBF00',
        unmuteButtonPulse: true,
      },
    },
    {
      type: 'reveal-section',
      required: true,
      description:
        'Offer reveal after video timestamp. Hidden initially, shown via JS when video reaches a certain point. Contains the actual offer.',
      exampleProps: {
        revealAtSeconds: 300,
        transition: 'fadeIn 1s',
        headline: 'Special One-Time Offer Just For You',
      },
    },
    {
      type: 'bundle-offers',
      required: true,
      description:
        'Bundle cards revealed after video. 1-3 tiers. Simpler than checkout bundles.',
      exampleProps: {
        tiers: [
          { quantity: 1, label: '1 Bottle', price: 39, popular: false },
          { quantity: 3, label: '3 Bottles', price: 99, perUnit: '$33/bottle', popular: true },
        ],
        cardBorder: '1px solid #E5E7EB',
        cardRadius: '12px',
        bestValueBadgeColor: '#F59E0B',
      },
    },
    {
      type: 'cta-button',
      required: true,
      description: 'Green CTA to accept the upsell offer.',
      exampleProps: {
        text: 'YES! Add to My Order',
        backgroundColor: '#00C249',
        textColor: '#fff',
        fontSize: '20px',
        fontWeight: 700,
        width: '100%',
        borderRadius: '8px',
        padding: '18px 24px',
      },
    },
    {
      type: 'guarantee',
      required: true,
      description: 'Money-back guarantee. Dashed border or solid black border.',
      exampleProps: {
        text: '90-Day Money-Back Guarantee',
        subtext: 'Try it risk-free. If you are not satisfied, get a full refund.',
        borderStyle: '4px dashed',
        borderColor: '#000',
        backgroundColor: '#FFF5E0',
      },
    },
    {
      type: 'negative-opt-out',
      required: true,
      description: 'The decline option. Less aggressive than interrupt pattern.',
      exampleProps: {
        text: "No thanks, I'll pass on this offer.",
        color: '#0000EE',
        fontSize: '14px',
      },
    },
  ],
  designTokens: {
    maxWidth: '720px',
    primaryColor: '#02122E',
    ctaColor: '#00C249',
    ctaGradient: undefined,
    backgroundColor: '#FFFFFF',
    fontFamily: "'Open Sans', sans-serif",
  },
  notes: [
    'Video is the primary selling tool — text is minimal.',
    'Offer is HIDDEN until video reaches a timestamp (JS-controlled reveal).',
    'Green arrow or "Click to reveal" button may appear after video.',
    'Less aggressive than interrupt upsell — builds value through video.',
    'Best for: higher-ticket items, supplements, health products.',
    'Video platform: Wistia (most common) or Vidalytics.',
    'Guarantee often uses dashed border — distinctive from checkout guarantee.',
  ].join('\n'),
};
