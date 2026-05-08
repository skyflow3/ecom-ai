/**
 * Purpose: Quiz funnel recipe — question-by-question lead qualification.
 * Used by: AllFemale quiz-style advertorial, common DTC pattern.
 *
 * Dependencies: Recipe types from index.ts
 * Related: optin-v1.ts (simple email capture), advertorial-v1-editorial.ts (editorial approach)
 */

import type { PageRecipe } from './index';

export const quizV1: PageRecipe = {
  id: 'quiz-v1',
  name: 'Quiz Funnel',
  description:
    'Interactive quiz-style page. One question at a time with multiple-choice options. Progress bar shows completion. Results lead to personalized product recommendation.',
  pageType: 'quiz',
  source: 'AllFemale quiz-style advertorial, common DTC pattern',
  blocks: [
    {
      type: 'progress-bar',
      required: true,
      description:
        'Visual progress indicator. Shows current question out of total. Bar fills as user progresses.',
      exampleProps: {
        currentStep: 1,
        totalSteps: 5,
        fillColor: '#10B981',
        backgroundColor: '#E5E7EB',
        height: '8px',
        borderRadius: '4px',
        showLabel: true,
        labelText: 'Question 1 of 5',
        labelFontSize: '14px',
        labelColor: '#6B7280',
      },
    },
    {
      type: 'question',
      required: true,
      description:
        'Single question displayed at a time. Large, clear text. Centered.',
      exampleProps: {
        text: 'What is your biggest concern right now?',
        fontSize: '24px',
        fontWeight: 700,
        color: '#111827',
        textAlign: 'center',
        maxWidth: '600px',
      },
    },
    {
      type: 'options',
      required: true,
      description:
        'Multiple-choice options. Cards or buttons. 2-4 options per question. Full width, selectable.',
      exampleProps: {
        options: [
          { id: 'a', text: 'Joint pain and stiffness', icon: 'joint' },
          { id: 'b', text: 'Low energy and fatigue', icon: 'energy' },
          { id: 'c', text: 'Sleep problems', icon: 'sleep' },
          { id: 'd', text: 'Weight management', icon: 'weight' },
        ],
        layout: 'stacked',
        cardBorder: '2px solid #E5E7EB',
        cardBorderSelected: '2px solid #10B981',
        cardRadius: '12px',
        cardPadding: '16px 20px',
        cardBg: '#FFFFFF',
        cardBgSelected: '#F0FDF4',
        fontSize: '16px',
        fontWeight: 500,
        gap: '12px',
      },
    },
    {
      type: 'quiz-cta',
      required: true,
      description:
        'Continue/Next button. Active only after selection. Full width.',
      exampleProps: {
        text: 'Continue',
        backgroundColor: '#10B981',
        disabledBackgroundColor: '#E5E7EB',
        textColor: '#fff',
        disabledTextColor: '#9CA3AF',
        fontSize: '18px',
        fontWeight: 700,
        borderRadius: '8px',
        padding: '14px',
        width: '100%',
        maxWidth: '400px',
      },
    },
  ],
  designTokens: {
    maxWidth: '600px',
    primaryColor: '#111827',
    ctaColor: '#10B981',
    ctaGradient: undefined,
    backgroundColor: '#FFFFFF',
    fontFamily: "'Inter', 'Open Sans', sans-serif",
  },
  notes: [
    'One question per page/view — never show all questions at once.',
    'Progress bar is critical — reduces abandonment.',
    'Options should be visual (cards with icons) not just text.',
    'Questions lead to a personalized product recommendation at the end.',
    'Common question flow: Problem > Duration > Severity > Goal > Email capture.',
    'Last "question" is usually the email capture (bait-and-switch to opt-in).',
    'Flikt/FunnelKit uses quiz-progress-wrapper pattern.',
    'Max-width 600px — focused, mobile-first.',
    'Colors often use Tailwind-style palette (#111827, #10B981, #E5E7EB).',
  ].join('\n'),
};
