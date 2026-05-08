/**
 * Purpose: Editorial advertorial recipe — the most common advertorial pattern.
 * Used by: EmSense, Ledisa, HaloGrow, Vibriance, SmoothSpine, Drivse, Clarifion, Oricle.
 * The "news article" format that disguises marketing as editorial content.
 *
 * Dependencies: Recipe types from index.ts
 * Related: product-page-v1-dtc.ts (direct sales page)
 */

import type { PageRecipe } from './index';

export const advertorialV1Editorial: PageRecipe = {
  id: 'advertorial-v1-editorial',
  name: 'Editorial Advertorial',
  description:
    'News-style advertorial with editorial header, breadcrumb, byline, long-form article body, inline CTAs, testimonials, and urgency box. The dominant format for DTC advertorials (15/18 pages analyzed).',
  pageType: 'advertorial',
  source:
    'EmSense (5 variants), Ledisa, HaloGrow, Vibriance, SmoothSpine, Drivse, Clarifion, Oricle',
  blocks: [
    {
      type: 'announcement-bar',
      required: false,
      description:
        'Sale banner at top. Dark navy, lime green, or brand teal. Full width. Optional.',
      exampleProps: {
        text: 'LIMITED TIME: 70% OFF + FREE SHIPPING',
        backgroundColor: '#00264C',
        textColor: '#fff',
        fontSize: '14px',
        fontWeight: 700,
        padding: '12px',
        textAlign: 'center',
      },
    },
    {
      type: 'logo-header',
      required: false,
      description:
        'Simple logo row. Logo left (120-160px), border-bottom. Optional "Advertorial" label. No navigation.',
      exampleProps: {
        logoUrl: '/images/logo.svg',
        logoWidth: '140px',
        borderBottom: '1px solid #ccc',
        paddingVertical: '8px',
        showAdvertorialLabel: false,
      },
    },
    {
      type: 'breadcrumb',
      required: false,
      description:
        '"Health > Wellness > ..." text path. Appears in 33% of advertorials.',
      exampleProps: {
        path: ['Health', 'Wellness', 'Product Name'],
        separator: '>',
        fontSize: '14px',
        color: '#666',
      },
    },
    {
      type: 'hero-headline',
      required: true,
      description:
        'H1 headline. 36-42px desktop, 22-28px mobile. Weight 800. Attention-grabbing. Open Sans or Montserrat.',
      exampleProps: {
        text: 'Big Pharma Doesn\'t Want You to Know About This Simple Discovery',
        fontSize: '40px',
        fontWeight: 800,
        lineHeight: '48px',
        color: '#02122e',
        fontFamily: "'Open Sans', sans-serif",
        mobileFontSize: '24px',
        mobileLineHeight: '32px',
      },
    },
    {
      type: 'author-byline',
      required: false,
      description:
        'Author avatar (33-40px circle) + name + separator + date. Under headline. 14-16px.',
      exampleProps: {
        authorName: 'Dr. Sarah Mitchell',
        date: 'May 8, 2026',
        avatarUrl: '/images/author-avatar.jpg',
        avatarSize: '33px',
        fontSize: '14px',
        color: '#555',
        showBorderTop: true,
      },
    },
    {
      type: 'body-text',
      required: true,
      description:
        'Problem section. Pain point narrative. 18-20px, 26px line-height. Dark text (#02122e). This is the hook.',
      exampleProps: {
        text: 'If you\'ve been struggling with {pain point}, you\'re not alone. Millions of people deal with this frustrating problem every day...',
        fontSize: '20px',
        lineHeight: '26px',
        color: '#02122e',
        fontFamily: "'Open Sans', sans-serif",
        marginBottom: '0',
      },
    },
    {
      type: 'highlight-text',
      required: false,
      description:
        'Yellow marker highlight (#FDCC5E) on key text. Or blue alert box (#3c94f6). Creates emphasis.',
      exampleProps: {
        text: 'IMPORTANT: This breakthrough discovery changes everything.',
        highlightType: 'yellow-marker',
        backgroundColor: '#FDCC5E',
        padding: '8px',
      },
    },
    {
      type: 'cta-button',
      required: true,
      description:
        'First CTA after problem section. Green (#47901a or #00c249). Max-width 410px. 8px radius. Appears every 3-5 content blocks.',
      exampleProps: {
        text: 'See How It Works',
        backgroundColor: '#47901a',
        hoverBackgroundColor: '#53a81e',
        textColor: '#fff',
        fontSize: '24px',
        fontWeight: 700,
        maxWidth: '410px',
        borderRadius: '8px',
        padding: '12px 24px',
        hoverScale: '1.05',
        transition: '0.2s ease-in-out',
      },
    },
    {
      type: 'body-text',
      required: true,
      description:
        'Solution section. Product introduction. Same styling as problem text.',
      exampleProps: {
        text: 'But recently, a team of researchers made a groundbreaking discovery...',
        fontSize: '20px',
        lineHeight: '26px',
        color: '#02122e',
        marginBottom: '0',
      },
    },
    {
      type: 'benefits-list',
      required: false,
      description:
        'Checkmark bullets. Icon + text pairs. 3-5 key benefits.',
      exampleProps: {
        headline: 'Here\'s what makes {product} different:',
        items: [
          'Clinically proven to reduce pain by 73%',
          'Works in as little as 7 days',
          'No side effects — 100% natural',
          'Backed by 30-day money-back guarantee',
        ],
        checkColor: '#00c249',
        fontSize: '18px',
        lineHeight: '26px',
      },
    },
    {
      type: 'image-gallery',
      required: false,
      description:
        'Before/after or product shots. 10+ images. Grid or carousel. 94% of advertorials use this.',
      exampleProps: {
        images: [
          '/images/before-1.jpg',
          '/images/after-1.jpg',
          '/images/product-1.jpg',
        ],
        layout: 'grid',
        columns: 2,
        gap: '10px',
        borderRadius: '8px',
      },
    },
    {
      type: 'image-caption',
      required: false,
      description: 'Yellow bg highlight caption under images.',
      exampleProps: {
        text: 'Real results from real customers. Results may vary.',
        backgroundColor: '#FDCC5E',
        padding: '8px',
        textAlign: 'center',
        fontSize: '20px',
      },
    },
    {
      type: 'cta-button',
      required: true,
      description:
        'Second CTA — mid-article. Same styling as first CTA.',
      exampleProps: {
        text: 'Claim Your 70% Discount',
        backgroundColor: '#00c249',
        hoverBackgroundColor: '#04a340',
        textColor: '#fff',
        fontSize: '18px',
        fontWeight: 800,
        maxWidth: '410px',
        borderRadius: '8px',
        padding: '16px',
        width: '100%',
      },
    },
    {
      type: 'numbered-list',
      required: false,
      description:
        '"5 Reasons Why..." pattern. Numbered items with large numbers (73px desktop, 50px mobile).',
      exampleProps: {
        headline: '5 Reasons Why Doctors Are Recommending {product}',
        items: [
          { number: 1, title: 'Clinically Proven', text: 'Backed by 12 clinical studies...' },
          { number: 2, title: 'Fast Results', text: 'Users report improvement in 7 days...' },
          { number: 3, title: '100% Natural', text: 'No chemicals, no side effects...' },
          { number: 4, title: 'Affordable', text: 'Fraction of the cost of alternatives...' },
          { number: 5, title: 'Risk-Free', text: '30-day money-back guarantee...' },
        ],
        numberFontSize: '73px',
        numberColor: '#02122e',
      },
    },
    {
      type: 'testimonial',
      required: false,
      description:
        'Customer quote. Facebook post style (border + shadow + avatar) or bordered card.',
      exampleProps: {
        quote: 'I was skeptical at first, but after just 2 weeks I noticed a huge difference!',
        author: 'Sarah M.',
        location: 'Verified Buyer',
        avatarUrl: '/images/avatar-1.jpg',
        avatarSize: '40px',
        cardBorder: '1px solid #ccc',
        cardRadius: '10px',
        cardShadow: '0 0 6px rgba(0,0,0,0.2)',
        authorColor: '#3658A6',
        quoteFontSize: '14px',
      },
    },
    {
      type: 'blockquote',
      required: false,
      description:
        'Expert quote. Left border (2-10px solid), light bg.',
      exampleProps: {
        quote: 'This is the most promising breakthrough I\'ve seen in 20 years of practice.',
        author: 'Dr. James Wilson, MD',
        borderLeft: '10px solid #ccc',
        backgroundColor: '#f9f9f9',
        padding: '20px 20px 20px 40px',
        fontSize: '16px',
      },
    },
    {
      type: 'comparison-table',
      required: false,
      description:
        'Product vs competitors. 2-column grid. Feature by feature.',
      exampleProps: {
        headline: 'How {product} Compares',
        headers: ['Feature', '{product}', 'Competitors'],
        rows: [
          { feature: 'Price', product: '$39', competitor: '$199+' },
          { feature: 'Natural', product: 'Yes', competitor: 'No' },
          { feature: 'Guarantee', product: '30 days', competitor: 'None' },
        ],
        gridColumns: 'repeat(2, 1fr)',
        columnGap: '30px',
      },
    },
    {
      type: 'urgency-box',
      required: false,
      description:
        'Yellow bg (#FEFBC3) + red dashed border (#D0021B). Limited stock/timer. Near CTAs.',
      exampleProps: {
        text: 'WARNING: Limited stock available! Only 47 bottles left at this price.',
        backgroundColor: '#FEFBC3',
        border: '2px dashed #D0021B',
        borderRadius: '8px',
        padding: '12px',
        textAlign: 'center',
        fontWeight: 700,
      },
    },
    {
      type: 'bundle-offers',
      required: false,
      description:
        'Pricing cards at bottom or in sidebar. 3-column (1x, 3x, 6x) with "Best Value".',
      exampleProps: {
        tiers: [
          { quantity: 1, price: 49, perUnit: '$49/bottle', popular: false },
          { quantity: 3, price: 117, perUnit: '$39/bottle', popular: true, badge: 'MOST POPULAR' },
          { quantity: 6, price: 198, perUnit: '$33/bottle', popular: false, badge: 'BEST VALUE' },
        ],
      },
    },
    {
      type: 'guarantee',
      required: false,
      description:
        'Warm bg (#FFFBef) + gold border (#FAB73C) + icon. 8px radius.',
      exampleProps: {
        text: '30-Day Money-Back Guarantee',
        subtext: 'Try it risk-free. If you are not 100% satisfied, return it for a full refund.',
        backgroundColor: '#FFFBef',
        borderColor: '#FAB73C',
        borderRadius: '8px',
        padding: '16px',
        imageMaxHeight: '170px',
      },
    },
    {
      type: 'faq',
      required: false,
      description:
        'Accordion FAQ. Light gray bg items (#F4F4F4), bold question, hidden answer.',
      exampleProps: {
        questions: [
          { q: 'How long does shipping take?', a: '3-5 business days within the US.' },
          { q: 'Is there a money-back guarantee?', a: 'Yes, 30-day full refund guarantee.' },
          { q: 'Are there any side effects?', a: 'No. 100% natural ingredients.' },
        ],
        itemBg: '#F4F4F4',
        itemRadius: '8px',
        questionWeight: 700,
        answerFontSize: '16px',
      },
    },
    {
      type: 'footer',
      required: true,
      description:
        'Centered links (uppercase, blue #337AB7) + disclaimer (50% opacity).',
      exampleProps: {
        links: ['Terms', 'Privacy', 'Contact', 'Affiliates'],
        linkColor: '#337AB7',
        linkTransform: 'uppercase',
        disclaimer: 'These statements have not been evaluated by the FDA...',
        disclaimerOpacity: 0.5,
        maxWidth: '1100px',
      },
    },
    {
      type: 'sticky-cta',
      required: false,
      description:
        'Mobile-only sticky bottom bar. Dark bg, white text, CTA button. Hidden on desktop.',
      exampleProps: {
        text: 'CLAIM YOUR DISCOUNT',
        backgroundColor: '#0e0f11',
        textColor: '#fff',
        ctaColor: '#00c249',
        position: 'fixed',
        bottom: '0',
        zIndex: 999,
      },
      visibility: 'mobile',
    },
  ],
  designTokens: {
    maxWidth: '1100px',
    primaryColor: '#02122E',
    ctaColor: '#47901A',
    ctaGradient: undefined,
    backgroundColor: '#FFFFFF',
    fontFamily: "'Open Sans', sans-serif",
  },
  notes: [
    'The dominant advertorial format — used by 15/18 pages analyzed.',
    '2-column layout on desktop (content 760px + sidebar 300px), 1-column mobile.',
    'Max-width 1100px for the full container, 760px for content column.',
    'CTAs appear every 3-5 content blocks (minimum 3 per page).',
    'Urgency box (#FEFBC3 bg + #D0021B dashed border) appears near CTAs.',
    'Yellow highlight (#FDCC5E) for inline emphasis.',
    'Testimonials: Facebook post style (border + shadow + avatar circle).',
    'Footer: Centered links (uppercase, blue) + disclaimer (50% opacity).',
    'Sidebar: Contains sticky CTA, guarantee badge, bundle cards on desktop.',
    'Body text: 18-20px, #02122e, Open Sans, 26px line-height.',
    'Author byline with avatar appears in 61% of pages.',
  ].join('\n'),
};
