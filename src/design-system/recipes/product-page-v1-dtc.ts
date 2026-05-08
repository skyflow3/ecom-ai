/**
 * Purpose: Standard DTC product page recipe — long-form sales page.
 * Used by: EmSense, HaloGrow, Airmoto, Oricle, Drivse, SmoothSpine, Getheyfra, PrimalQueen.
 *
 * Dependencies: Recipe types from index.ts
 * Related: advertorial-v1-editorial.ts (editorial format), vsl-v1.ts (video sales letter)
 */

import type { PageRecipe } from './index';

export const productPageV1Dtc: PageRecipe = {
  id: 'product-page-v1-dtc',
  name: 'DTC Product Page',
  description:
    'Standard direct-to-consumer product page. Full-width sections with alternating backgrounds. Product-focused with hero, benefits, social proof, comparison, bundles, guarantee, FAQ. Used by 9+ winning brands.',
  pageType: 'product',
  source:
    'EmSense, HaloGrow, Airmoto, Oricle, Drivse, SmoothSpine, Getheyfra, PrimalQueen',
  blocks: [
    {
      type: 'announcement-bar',
      required: true,
      description:
        '"70% OFF + FREE SHIPPING" banner. Dark navy (#00264C), lime green (#BAF363), or teal. Full width, bold text.',
      exampleProps: {
        text: 'LIMITED TIME: 70% OFF + FREE SHIPPING',
        backgroundColor: '#00264C',
        textColor: '#fff',
        fontSize: '14px',
        fontWeight: 700,
        padding: '8px 12px',
        textAlign: 'center',
      },
    },
    {
      type: 'timer-nav',
      required: false,
      description:
        'Sticky top countdown timer with anchor links. Dark bg. Visible on scroll.',
      exampleProps: {
        backgroundColor: '#00264C',
        textColor: '#fff',
        countdownDurationMinutes: 30,
        links: ['Benefits', 'How It Works', 'Reviews', 'Pricing'],
        sticky: true,
        top: '0',
        zIndex: '10',
      },
    },
    {
      type: 'hero',
      required: true,
      description:
        'Product image + headline + star rating + video. 2-column on desktop (image left + info right). Background: light cyan (#EAFAFA) or beige (#EDEDE4).',
      exampleProps: {
        headline: 'Finally! Real Relief That Actually Works',
        starRating: 4.9,
        reviewCount: '1,257+',
        productImageUrl: '/images/product-hero.jpg',
        videoUrl: 'https://fast.wistia.net/embed/iframe/xxx',
        backgroundColor: '#EAFAFA',
        desktopPadding: '64px 32px',
        mobilePadding: '40px 16px',
        gridColumns: '47% auto',
        columnGap: '50px',
      },
    },
    {
      type: 'usp-bar',
      required: false,
      description:
        'Quick trust badges row. "100,000+ verified users" + 3-4 icons. Lime green bg or navy.',
      exampleProps: {
        text: 'Over 100,000 verified users',
        badges: ['Free Shipping', '30-Day Guarantee', 'Secure Checkout'],
        backgroundColor: '#BAF363',
        textColor: '#0C230E',
        padding: '16px',
        fontWeight: 600,
      },
    },
    {
      type: 'as-seen-on',
      required: false,
      description:
        'Media logo row. Marquee scroll animation. "As Seen On" label.',
      exampleProps: {
        label: 'As Seen On',
        logos: ['/images/logo-forbes.svg', '/images/logo-cnn.svg'],
        animation: 'marquee',
        grayscale: true,
        maxHeight: '48px',
      },
    },
    {
      type: 'problem-agitation',
      required: false,
      description:
        'Pain point narrative. Often on dark bg (dark green #0C230E or navy). Dramatic headline.',
      exampleProps: {
        headline: 'Do You Know WHY You\'re Losing Hair?',
        bodyText: 'The real cause is not what you think...',
        backgroundColor: '#0C230E',
        textColor: '#fff',
      },
    },
    {
      type: 'video',
      required: false,
      description:
        'Product demo or explainer video. 16:9, rounded, blue border accent.',
      exampleProps: {
        videoUrl: 'https://fast.wistia.net/embed/iframe/xxx',
        aspectRatio: '16/9',
        borderRadius: '8px',
        border: '4px solid #00599d',
        desktopHeight: '400px',
        mobileHeight: '250px',
      },
    },
    {
      type: 'benefits',
      required: true,
      description:
        '3-5 key benefits with icons. Full-width section, white bg.',
      exampleProps: {
        headline: 'One Device That Does It All',
        items: [
          { icon: 'target', title: 'Targeted Relief', text: 'Precision EMS technology...' },
          { icon: 'clock', title: 'Fast Results', text: 'Feel improvement in 7 days...' },
          { icon: 'shield', title: 'Drug-Free', text: '100% natural, no side effects...' },
        ],
        backgroundColor: '#FFFFFF',
        sectionPadding: '64px 32px',
      },
    },
    {
      type: 'how-it-works',
      required: false,
      description:
        '3-step timeline. Step cards with icons. Vertical line connecting steps.',
      exampleProps: {
        headline: '3 Simple Steps For Relief',
        steps: [
          { number: 1, title: 'Apply', description: 'Place the device on the affected area.', image: '/images/step1.jpg' },
          { number: 2, title: 'Activate', description: 'Press the button and relax for 15 minutes.', image: '/images/step2.jpg' },
          { number: 3, title: 'Feel Relief', description: 'Experience lasting comfort.', image: '/images/step3.jpg' },
        ],
        backgroundColor: '#F9F2E8',
        lineColor: '#D0021B',
      },
    },
    {
      type: 'results-stats',
      required: false,
      description:
        'Large number (88px) + bar charts + star breakdown. Social proof with data.',
      exampleProps: {
        overallScore: '4.9',
        totalReviews: '1,257',
        breakdown: [
          { stars: 5, percent: 85 },
          { stars: 4, percent: 10 },
          { stars: 3, percent: 3 },
          { stars: 2, percent: 1 },
          { stars: 1, percent: 1 },
        ],
        scoreFontSize: '88px',
        scoreLineHeight: '96px',
      },
    },
    {
      type: 'testimonials',
      required: true,
      description:
        'Customer review cards. Avatar + name + verified badge + quote + optional video.',
      exampleProps: {
        reviews: [
          { name: 'John D.', verified: true, rating: 5, text: 'This changed my life...', image: '/images/review-1.jpg' },
          { name: 'Sarah M.', verified: true, rating: 5, text: 'Best purchase ever...', image: '/images/review-2.jpg' },
        ],
        cardBorderTop: '1px solid #eaeaea',
        cardPadding: '24px 0',
        authorGap: '64px',
        verifiedColor: '#24AA2F',
        nameFontSize: '20px',
        imageBorderRadius: '6px',
      },
    },
    {
      type: 'comparison',
      required: false,
      description:
        'Product vs competitors. 2-column grid. Feature rows.',
      exampleProps: {
        headline: 'Ditch Expensive Treatments and Pills',
        columns: ['Feature', '{Product}', 'Alternatives'],
        rows: [
          { feature: 'Cost', us: '$39', them: '$199+' },
          { feature: 'Natural', us: 'Yes', them: 'No' },
          { feature: 'Guarantee', us: '90 Days', them: 'None' },
          { feature: 'Side Effects', us: 'None', them: 'Many' },
        ],
        backgroundColor: '#F4F9FF',
        gridColumns: 'repeat(2, 1fr)',
        columnGap: '30px',
        borderRight: '1px solid #CFD6E3',
      },
    },
    {
      type: 'bundle-offers',
      required: true,
      description:
        '3-column bundle selector. 1x, 3x, 6x with "Best Value" on 6x. Per-unit pricing.',
      exampleProps: {
        tiers: [
          { quantity: 1, label: '1 Bottle', price: 49, oldPrice: 99, perUnit: '$49/bottle', shipping: '+ $9.95', popular: false },
          { quantity: 3, label: '3 Bottles', price: 117, oldPrice: 297, perUnit: '$39/bottle', shipping: 'FREE', popular: true, badge: 'MOST POPULAR', badgeColor: '#EC0B43' },
          { quantity: 6, label: '6 Bottles', price: 198, oldPrice: 594, perUnit: '$33/bottle', shipping: 'FREE', popular: false, badge: 'BEST VALUE', badgeColor: '#F59E0B' },
        ],
        cardBorder: '2px solid #E5E7EB',
        cardRadius: '12px',
        cardPadding: '24px 16px',
        oldPriceColor: '#999',
        salePriceColor: '#E33C4C',
      },
    },
    {
      type: 'guarantee',
      required: true,
      description:
        '30 or 90-day guarantee. Shield/circle badge image + text. Flex row layout.',
      exampleProps: {
        text: '30-Day Money-Back Guarantee',
        subtext: "Try it risk-free. If you don't love it, we'll give you a full refund.",
        badgeImage: '/images/guarantee-badge.png',
        badgeMaxHeight: '170px',
        sectionPadding: '64px 32px',
        backgroundColor: '#F5F5F5',
      },
    },
    {
      type: 'faq',
      required: true,
      description:
        '5-10 questions accordion. Light gray items (#F4F4F4), bold question, expandable answer.',
      exampleProps: {
        headline: 'Frequently Asked Questions',
        questions: [
          { q: 'How long does shipping take?', a: '3-5 business days within the US.' },
          { q: 'Is there a money-back guarantee?', a: 'Yes, full 30-day guarantee.' },
          { q: 'How do I use it?', a: 'Simply apply to the affected area...' },
          { q: 'Are there side effects?', a: 'No, 100% natural ingredients.' },
          { q: 'Can I return it?', a: 'Absolutely. Full refund within 30 days.' },
        ],
        itemBg: '#F4F4F4',
        itemRadius: '8px',
        itemMargin: '0 0 8px',
        questionPadding: '16px',
        questionWeight: 700,
        answerPadding: '0 16px 16px',
        answerFontSize: '16px',
        answerLineHeight: '24px',
      },
    },
    {
      type: 'footer',
      required: true,
      description:
        'Dark 2-section footer. Links (#141619 bg) + copyright (#0E0F11 bg). Payment badges.',
      exampleProps: {
        linksBg: '#141619',
        copyrightBg: '#0E0F11',
        linkColumns: [
          { title: 'INFO', links: ['About', 'Contact', 'Blog'] },
          { title: 'ORDER', links: ['Track Order', 'Returns', 'FAQ'] },
        ],
        paymentBadges: ['visa', 'mastercard', 'amex', 'paypal'],
        linkColor: '#ffffffb8',
        padding: '40px',
        copyrightPadding: '24px',
        copyrightFontSize: '14px',
      },
    },
    {
      type: 'sticky-cta',
      required: false,
      description:
        'Mobile sticky bottom bar. Black bg, white text, CTA button. Hidden on desktop.',
      exampleProps: {
        backgroundColor: '#000000',
        textColor: '#fff',
        ctaText: 'ORDER NOW',
        ctaColor: '#00c249',
        zIndex: 100,
      },
      visibility: 'mobile',
    },
  ],
  designTokens: {
    maxWidth: '1230px',
    primaryColor: '#02122E',
    ctaColor: '#00C249',
    ctaGradient: undefined,
    backgroundColor: '#FFFFFF',
    fontFamily: "'Open Sans', 'Montserrat', sans-serif",
  },
  notes: [
    'Full-width sections with alternating backgrounds for visual rhythm.',
    'Background alternation: White > Light Gray (#F5F5F5) > White > Cream (#F9F2E8) > White.',
    'HaloGrow variant: Beige > Lime > Dark Green > Beige > White > Dark Green > Beige.',
    'Section padding: 64-80px vertical desktop, 16-40px mobile.',
    'Container max-width varies: 1040-1230px per brand.',
    '2-column hero layout (47% image / auto info) on desktop.',
    'Bundle cards: 3-column grid, center highlighted, per-unit pricing.',
    'Star rating summary with 88px font for the score number.',
    'FAQ accordion is universal — light gray bg items, 8px radius.',
    'Sticky bottom CTA on mobile only (78% of pages).',
    'Review cards with verified green badge (#24AA2F).',
  ].join('\n'),
};
