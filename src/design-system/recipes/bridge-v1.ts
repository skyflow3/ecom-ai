/**
 * Purpose: Bridge / redirect page recipe.
 * Shown briefly between funnel steps to maintain context.
 *
 * Dependencies: Recipe types from index.ts
 * Related: optin-v1.ts (often follows bridge page)
 */

import type { PageRecipe } from './index';

export const bridgeV1: PageRecipe = {
  id: 'bridge-v1',
  name: 'Bridge / Redirect Page',
  description:
    'Simple transition page between funnel steps. Headline providing context, brief explanation, and a button to continue. Keeps the user engaged during redirect.',
  pageType: 'bridge',
  source: 'Common DTC funnel pattern',
  blocks: [
    {
      type: 'headline',
      required: true,
      description:
        'Context-setting headline. Tells user what happens next.',
      exampleProps: {
        text: 'Great News! You\'re Pre-Qualified',
        fontSize: '32px',
        fontWeight: 700,
        textAlign: 'center',
        color: '#02122e',
        maxWidth: '600px',
      },
    },
    {
      type: 'body-text',
      required: true,
      description:
        'Brief explanation of what comes next. 2-3 sentences max.',
      exampleProps: {
        text: 'We\'re preparing your personalized recommendation. Click below to see your exclusive offer.',
        fontSize: '18px',
        lineHeight: '26px',
        color: '#555',
        textAlign: 'center',
        maxWidth: '500px',
      },
    },
    {
      type: 'cta-button',
      required: true,
      description:
        'Single button to continue. Full width within container. Green.',
      exampleProps: {
        text: 'See My Results',
        backgroundColor: '#00C249',
        textColor: '#fff',
        fontSize: '20px',
        fontWeight: 700,
        borderRadius: '8px',
        padding: '16px 32px',
        maxWidth: '400px',
        width: '100%',
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
    'Extremely simple page — headline + text + button.',
    'Purpose: maintain engagement during funnel transition.',
    'No navigation, no footer, no distractions.',
    'Loading animation optional (spinner or progress bar).',
    'Auto-redirect optional after 5-10 seconds.',
    'Max-width 600px — very focused.',
  ].join('\n'),
};
