/**
 * Purpose: Interrupt upsell recipe — the "WAIT!" one-time offer pattern.
 * Used by: Vibriance (OTO1-5), Clarifion (OTO1-4).
 *
 * Dependencies: Recipe types from index.ts
 * Related: upsell-v2-vsl.ts (video-based upsell), downsell-v1.ts (reduced offer)
 */

import type { PageRecipe } from './index';

export const upsellV1Interrupt: PageRecipe = {
  id: 'upsell-v1-interrupt',
  name: 'Interrupt Upsell (OTO)',
  description:
    'Classic one-time-offer upsell. Interrupt header "WAIT!", 10-min countdown, product pitch, green "YES!" CTA, guilt-trip opt-out. Proven across 9+ OTO pages.',
  pageType: 'upsell',
  source: 'Vibriance OTO1-5, Clarifion OTO1-4',
  blocks: [
    {
      type: 'interrupt-header',
      required: true,
      description:
        'Bold "WAIT!" header. Urgency text. Often on colored or animated background.',
      exampleProps: {
        text: 'WAIT! Your order is not complete!',
        subtext: 'Almost Complete...',
        fontSize: '20px',
        fontWeight: 700,
        textAlign: 'center',
      },
    },
    {
      type: 'countdown',
      required: true,
      description:
        '10-minute countdown timer. "Hurry! This offer ends in: MM:SS". Helvetica font, centered.',
      exampleProps: {
        label: 'Hurry! This offer ends in:',
        durationMinutes: 10,
        font: 'Helvetica, serif',
        textAlign: 'center',
        digitFontSize: '1rem',
      },
    },
    {
      type: 'benefits',
      required: true,
      description:
        'Product pitch headline + benefit bullets. Why they should upgrade. 3-5 bullet points.',
      exampleProps: {
        headline: 'Upgrade your order now with {product}:',
        bullets: [
          'Benefit 1 — specific, measurable result',
          'Benefit 2 — addresses objection',
          'Benefit 3 — exclusive to this offer',
          'Benefit 4 — time-limited urgency',
        ],
        fontSize: '18px',
        lineHeight: '32px',
      },
    },
    {
      type: 'product-image',
      required: true,
      description: 'Product image. Full width within container.',
      exampleProps: {
        src: '/images/upsell-product.jpg',
        alt: 'Product name',
        width: '100%',
        maxWidth: '300px',
      },
    },
    {
      type: 'price-display',
      required: true,
      description:
        'Strikethrough old price (gray) + new price + "% OFF" badge. Shows savings clearly.',
      exampleProps: {
        oldPrice: '$141.00',
        newPrice: '$84.60',
        savingsPercent: '40%',
        oldPriceColor: '#808080',
        oldPriceDecoration: 'line-through',
        savingsBadgeColor: '#EC0B43',
        fontSize: '24px',
        fontWeight: 600,
      },
    },
    {
      type: 'value-stack',
      required: false,
      description:
        'Stack of value items showing what they get. Each line has a label + price.',
      exampleProps: {
        items: [
          { label: '3x Product Bottles', value: '$141.00' },
          { label: 'Free Shipping', value: '$9.95' },
          { label: 'Total Value', value: '$150.95' },
        ],
        totalLabel: 'Your Price Today',
        totalPrice: '$84.60',
      },
    },
    {
      type: 'cta-button',
      required: true,
      description:
        'Green "YES!" CTA button. Full width, bold, 18px. The positive action.',
      exampleProps: {
        text: 'YES! Add to My Order',
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
      type: 'guarantee',
      required: true,
      description:
        'Inline guarantee text. "100% Money Back Guarantee. Try risk-free."',
      exampleProps: {
        text: '100% Money Back Guarantee. Try risk-free.',
        fontSize: '14px',
        textAlign: 'center',
      },
    },
    {
      type: 'negative-opt-out',
      required: true,
      description:
        'Blue link (#0000EE), small font (12-17px), long guilt-trip text. "No thanks, I don\'t want..." — the harder they have to work to say no, the better.',
      exampleProps: {
        text: "No thanks, I don't want to upgrade my order. I understand this is a one-time offer and I won't see this price again.",
        color: '#0000EE',
        fontSize: '17px',
        textAlign: 'center',
        padding: '10px',
        cursor: 'pointer',
      },
    },
    {
      type: 'video',
      required: false,
      description: 'Optional product video embed. YouTube via FunnelKonnekt.',
      exampleProps: {
        videoUrl: 'https://www.youtube.com/embed/xxx',
        aspectRatio: '16/9',
        playButtonBg: '#333',
        playButtonRadius: '6px',
      },
    },
    {
      type: 'package-protection',
      required: false,
      description:
        'Final OTO only. Package protection for $4.95. "Protect Against Loss & Theft".',
      exampleProps: {
        headline: 'Protect Your Package',
        price: '$4.95',
        description: 'Protect against loss & theft during shipping.',
        showOnFinalOto: true,
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
    'Single-column, centered, max-width 520px. Simple and focused.',
    'The interrupt header ("WAIT!") is critical — it stops the user from leaving.',
    '10-minute countdown creates real urgency (not fake).',
    'Green CTA (#30BD51) + blue opt-out link (#0000EE) is the universal pattern.',
    'The opt-out text should be long and guilt-inducing — this is intentional.',
    'Maximum 5 OTOs in sequence. Last one is package protection ($4.95).',
    'Prices are injected via JS template literals — not static HTML.',
    'FunnelKonnekt/CheckoutChamp builder (fk- prefixed classes).',
  ].join('\n'),
};
