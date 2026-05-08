/**
 * Purpose: Video Sales Letter (VSL) recipe — video-first sales page.
 * Used by: Emma Relief, ProstaVive.
 *
 * Dependencies: Recipe types from index.ts
 * Related: product-page-v1-dtc.ts (text-based product page), upsell-v2-vsl.ts (upsell variant)
 */

import type { PageRecipe } from './index';

export const vslV1: PageRecipe = {
  id: 'vsl-v1',
  name: 'Video Sales Letter (VSL)',
  description:
    'Video-first sales page. Large headline, centered video player, CTA below video, pricing cards after CTA. Video is the primary selling tool — text is secondary.',
  pageType: 'vsl',
  source: 'Emma Relief, ProstaVive',
  blocks: [
    {
      type: 'announcement-bar',
      required: false,
      description:
        'Thin colored strip at top. Brand color or neutral.',
      exampleProps: {
        height: '4px',
        backgroundColor: '#0C230E',
      },
    },
    {
      type: 'hero-headline',
      required: true,
      description:
        'Large centered H1. 48px desktop, 28px mobile. Weight 800. The main hook.',
      exampleProps: {
        text: 'Discover The Natural Solution That Doctors Are Calling "Revolutionary"',
        fontSize: '48px',
        fontWeight: 800,
        lineHeight: '58px',
        textAlign: 'center',
        color: '#02122e',
        mobileFontSize: '28px',
        mobileLineHeight: '36px',
        maxWidth: '800px',
      },
    },
    {
      type: 'video-player',
      required: true,
      description:
        'Wistia or Vidalytics embed. 16:9 desktop. 2:3 ratio mobile variant. Centered. This IS the page.',
      exampleProps: {
        videoUrl: 'https://fast.wistia.net/embed/iframe/xxx',
        aspectRatio: '16/9',
        width: '100%',
        maxWidth: '960px',
        unmuteButtonBg: '#FFBF00',
        unmuteButtonRadius: '8px',
        unmutePulse: true,
        desktopHeight: '540px',
        mobileHeight: '400px',
      },
    },
    {
      type: 'click-for-sound',
      required: false,
      description:
        'Overlay button on video. Yellow (#FFBF00) with pulse animation. "Click for Sound".',
      exampleProps: {
        text: 'Click for Sound',
        backgroundColor: '#FFBF00',
        pulseAnimation: '#FFBF00 -> #FFDD93 400ms infinite alternate',
        position: 'overlay',
      },
    },
    {
      type: 'cta-button',
      required: true,
      description:
        'Green CTA below video. May appear via JS after video timestamp. Large and prominent.',
      exampleProps: {
        text: 'CLAIM YOUR DISCOUNTED BOTTLE NOW',
        backgroundColor: '#00C249',
        textColor: '#fff',
        fontSize: '24px',
        fontWeight: 700,
        width: '100%',
        maxWidth: '410px',
        borderRadius: '8px',
        padding: '18px 24px',
        hoverScale: '1.05',
        arrowIcon: true,
      },
    },
    {
      type: 'bundle-offers',
      required: true,
      description:
        '3-column pricing cards. Large price font (55-84px). Gold header or blue border highlight.',
      exampleProps: {
        tiers: [
          { quantity: 1, label: '1 Bottle', price: 69, shipping: '+ $9.95', popular: false },
          { quantity: 3, label: '3 Bottles', price: 177, perUnit: '$59/bottle', shipping: 'FREE', popular: true },
          { quantity: 6, label: '6 Bottles', price: 294, perUnit: '$49/bottle', shipping: 'FREE', popular: false, badge: 'BEST VALUE' },
        ],
        priceFontSize: '55px',
        priceFontWeight: 900,
        cardBorder: '1px solid #0882E2',
        selectedCardBorder: '2px solid #0882E2',
        selectedCardShadow: '1px 4px 16px rgba(0,0,0,0.2)',
        badgeStyle: 'gold-header',
        badgeColor: '#FBD262',
      },
    },
    {
      type: 'guarantee',
      required: true,
      description:
        'Bold guarantee. 8px solid black border or 4px dashed border. Guarantee seal image.',
      exampleProps: {
        text: '60-Day 100% Money-Back Guarantee',
        subtext: "If you're not satisfied, return it for a full refund.",
        border: '8px solid #000',
        backgroundColor: '#FFF',
        guaranteeImage: '/images/guarantee-seal.png',
        marginTop: '-110px',
      },
    },
    {
      type: 'bonus-section',
      required: false,
      description:
        'Free bonus with multipack purchase. Book, recipe guide, etc.',
      exampleProps: {
        headline: 'FREE BONUS When You Order 3 or 6 Bottles',
        bonusTitle: 'The Complete Health Guide (Value: $47)',
        bonusImage: '/images/bonus-book.png',
        backgroundColor: '#FEFBC3',
      },
    },
    {
      type: 'testimonials',
      required: false,
      description:
        '2x2 grid of customer stories. Simpler than product page testimonials.',
      exampleProps: {
        reviews: [
          { name: 'Robert K.', location: 'Austin, TX', text: 'I was skeptical but the results speak for themselves.', rating: 5 },
          { name: 'Maria S.', location: 'Miami, FL', text: 'Best decision I ever made. Feel 20 years younger!', rating: 5 },
        ],
        gridColumns: 'repeat(2, 1fr)',
        gap: '16px',
      },
    },
    {
      type: 'cta-button',
      required: true,
      description:
        'Repeated pricing section + CTA. Same as above, repeated for conversion.',
      exampleProps: {
        text: 'CLAIM YOUR DISCOUNTED BOTTLE NOW',
        backgroundColor: '#00C249',
        textColor: '#fff',
        fontSize: '24px',
        fontWeight: 700,
        width: '100%',
        maxWidth: '410px',
        borderRadius: '8px',
        padding: '18px 24px',
      },
    },
    {
      type: 'faq',
      required: false,
      description: 'Accordion FAQ section.',
      exampleProps: {
        headline: 'Frequently Asked Questions',
        questions: [
          { q: 'How long until I see results?', a: 'Most users report improvement within 2-4 weeks.' },
          { q: 'Is it safe?', a: 'Yes, 100% natural with no known side effects.' },
        ],
        separatorStyle: 'border-bottom: 2px solid #191919',
        questionColor: '#0A6050',
        questionSize: '20px',
      },
    },
    {
      type: 'clinical-references',
      required: false,
      description: 'Clinical study references. Credibility section.',
      exampleProps: {
        headline: 'Supported By Clinical Research',
        studies: [
          'Study 1: Published in Journal of XYZ, 2023',
          'Study 2: University of ABC Clinical Trial, 2024',
        ],
        fontSize: '14px',
        color: '#666',
      },
    },
    {
      type: 'footer',
      required: true,
      description: 'Standard footer with links + disclaimer.',
      exampleProps: {
        links: ['Terms', 'Privacy', 'Contact', 'Affiliates'],
        disclaimer: 'These statements have not been evaluated by the FDA...',
        linkColor: '#337AB7',
        disclaimerOpacity: 0.5,
      },
    },
  ],
  designTokens: {
    maxWidth: '960px',
    primaryColor: '#02122E',
    ctaColor: '#00C249',
    ctaGradient: undefined,
    backgroundColor: '#FFFFFF',
    fontFamily: "'Open Sans', 'Myriad Pro', sans-serif",
  },
  notes: [
    'Video is THE page — everything else supports the video.',
    'CTA may be hidden until video reaches a specific timestamp (JS-controlled).',
    'Green arrow appears below video via JS to draw attention to CTA.',
    'Pricing cards have VERY large price font (55-84px) — bigger than other page types.',
    'Guarantee uses bold black border (8px solid) — distinctive from other pages.',
    'Bonus section is common for multi-bottle purchases.',
    'Pricing section is repeated (appears twice on the page).',
    'Video platforms: Wistia (16:9 desktop), Vidalytics (2:3 mobile variant).',
    'Unmute button pulses yellow (#FFBF00 <-> #FFDD93).',
    'Max-width 960px — centered and focused.',
  ].join('\n'),
};
