/**
 * Purpose: Opt-in / lead capture page recipe.
 * Used to collect email addresses before sending user to the main offer.
 *
 * Dependencies: Recipe types from index.ts
 * Related: bridge-v1.ts (often precedes opt-in), quiz-v1.ts (quiz-based opt-in)
 */

import type { PageRecipe } from './index';

export const optinV1: PageRecipe = {
  id: 'optin-v1',
  name: 'Opt-In / Lead Capture',
  description:
    'Email capture page with hero, value proposition, simple form, and trust badges. Minimal friction — just email + button. Often paired with a lead magnet.',
  pageType: 'optin',
  source: 'Common DTC funnel pattern, EmSense pre-qualifier',
  blocks: [
    {
      type: 'hero',
      required: true,
      description:
        'Headline + subheadline. Value proposition. What they get for their email.',
      exampleProps: {
        headline: 'Get Your Free Guide: 7 Secrets Doctors Won\'t Tell You',
        subheadline: 'Join 50,000+ people who\'ve already discovered the truth.',
        textAlign: 'center',
        headlineFontSize: '36px',
        headlineFontWeight: 800,
        subheadlineFontSize: '18px',
        subheadlineColor: '#555',
        maxWidth: '600px',
      },
    },
    {
      type: 'benefits-list',
      required: false,
      description: '3-5 quick value points. What they\'ll receive.',
      exampleProps: {
        items: [
          'The #1 mistake 90% of people make',
          'A simple 3-step solution',
          'Real results from real people',
        ],
        iconType: 'checkmark',
        iconColor: '#00C249',
        fontSize: '16px',
      },
    },
    {
      type: 'email-form',
      required: true,
      description:
        'Email input + submit button. Single field. Minimal friction. Green button.',
      exampleProps: {
        placeholder: 'Enter your email address',
        buttonText: 'GET FREE ACCESS',
        buttonColor: '#00C249',
        buttonTextColor: '#fff',
        buttonFontSize: '18px',
        buttonFontWeight: 700,
        borderRadius: '8px',
        inputBorder: '1px solid #E6E7EA',
        inputHeight: '48px',
        inputFontSize: '16px',
        layout: 'stacked',
        maxWidth: '400px',
      },
    },
    {
      type: 'trust-badges',
      required: false,
      description:
        'Small trust indicators below form. "No spam", "Unsubscribe anytime", SSL icon.',
      exampleProps: {
        badges: ['no-spam', 'ssl', 'unsubscribe'],
        text: 'We respect your privacy. Unsubscribe anytime.',
        fontSize: '12px',
        color: '#999',
        textAlign: 'center',
      },
    },
  ],
  designTokens: {
    maxWidth: '600px',
    primaryColor: '#02122E',
    ctaColor: '#00C249',
    ctaGradient: undefined,
    backgroundColor: '#FFFFFF',
    fontFamily: "'Open Sans', sans-serif",
  },
  notes: [
    'Extremely focused page — single purpose: collect email.',
    'Minimum friction: just email + button (no name, no phone).',
    'Value proposition must be clear and compelling.',
    'Trust badges reduce hesitation about sharing email.',
    'Often paired with a lead magnet (free guide, video, discount).',
    'Max-width 600px — centered and focused.',
    'Can be used as a pop-up or standalone page.',
  ].join('\n'),
};
