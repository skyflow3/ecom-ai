/**
 * Purpose: Thank you / confirmation page recipe.
 * Used by: Vibriance, SmoothSpine after purchase.
 *
 * Dependencies: Recipe types from index.ts
 * Related: checkout-v1-checkoutchamp.ts (the checkout that precedes this)
 */

import type { PageRecipe } from './index';

export const thankYouV1: PageRecipe = {
  id: 'thank-you-v1',
  name: 'Thank You / Confirmation',
  description:
    'Post-purchase confirmation page. Order summary, optional upsell offer, community CTA, and support info. Builds trust and reduces buyer\'s remorse.',
  pageType: 'thank-you',
  source: 'Vibriance, SmoothSpine confirmation pages',
  blocks: [
    {
      type: 'logo-header',
      required: true,
      description: 'Centered brand logo. Clean, minimal.',
      exampleProps: {
        logoUrl: '/images/logo.svg',
        textAlign: 'center',
        padding: '20px',
      },
    },
    {
      type: 'confirmation-header',
      required: true,
      description:
        '"Order Confirmed" or "Thank you {name}!". Green checkmark. Celebration feel.',
      exampleProps: {
        title: 'Order Confirmed!',
        subtitle: 'Thank you for your purchase, {firstName}!',
        icon: 'checkmark-circle',
        iconColor: '#00C249',
        titleFontSize: '32px',
        titleFontWeight: 700,
        textAlign: 'center',
      },
    },
    {
      type: 'google-maps',
      required: false,
      description: 'Shipping address embed. Optional.',
      exampleProps: {
        embedUrl: 'https://maps.google.com/...',
        width: '100%',
        height: '200px',
        borderRadius: '8px',
      },
    },
    {
      type: 'order-summary',
      required: true,
      description:
        '2-column: Contact/Address | Payment/Total. Items table with Quantity and Price columns.',
      exampleProps: {
        columns: [
          { title: 'Customer Information', fields: ['Email: {email}', 'Phone: {phone}', 'Address: {address}'] },
          { title: 'Payment Details', fields: ['Card: ****{last4}', 'Total: ${total}', 'Status: Confirmed'] },
        ],
        itemsTable: {
          headers: ['Item', 'Quantity', 'Price'],
          rows: [
            { item: 'Product Name', qty: 3, price: '$117.00' },
          ],
        },
        border: '1px solid #eaeaea',
        borderRadius: '8px',
        padding: '24px',
      },
    },
    {
      type: 'survey-link',
      required: false,
      description: 'Optional Typeform survey link. 2-min anonymous.',
      exampleProps: {
        text: 'Help us improve — take a 2-minute anonymous survey',
        url: 'https://form.typeform.com/to/xxx',
        fontSize: '16px',
        color: '#2563EB',
      },
    },
    {
      type: 'product-video',
      required: false,
      description: 'Product usage video. Vidalytics embed.',
      exampleProps: {
        headline: 'How To Get The Best Results',
        videoUrl: 'https://vidalytics.com/embed/xxx',
        aspectRatio: '16/9',
      },
    },
    {
      type: 'upsell-banner',
      required: false,
      description:
        'Community CTA, user guide, Facebook group. Post-purchase engagement.',
      exampleProps: {
        headline: 'Join Our Community',
        subtext: 'Get tips, support, and exclusive offers.',
        ctaText: 'Join Facebook Group',
        ctaUrl: 'https://facebook.com/groups/xxx',
        ctaColor: '#1877F2',
        image: '/images/community.jpg',
      },
    },
    {
      type: 'continue-shopping',
      required: false,
      description: 'Text link to continue shopping.',
      exampleProps: {
        text: 'Continue Shopping',
        url: '/',
        color: '#337AB7',
        fontSize: '16px',
      },
    },
    {
      type: 'customer-support',
      required: false,
      description:
        'CSR image + email + phone. Support info.',
      exampleProps: {
        agentName: 'Sarah',
        agentImage: '/images/csr-sarah.jpg',
        email: 'support@brand.com',
        phone: '1-800-XXX-XXXX',
        fontSize: '14px',
        color: '#666',
      },
    },
    {
      type: 'footer',
      required: true,
      description: 'Terms + Privacy + Return Policy links.',
      exampleProps: {
        links: ['Terms of Service', 'Privacy Policy', 'Return Policy'],
        fontSize: '12px',
        color: '#999',
        textAlign: 'center',
      },
    },
  ],
  designTokens: {
    maxWidth: '800px',
    primaryColor: '#02122E',
    ctaColor: '#00C249',
    ctaGradient: undefined,
    backgroundColor: '#FFFFFF',
    fontFamily: "'Open Sans', sans-serif",
  },
  notes: [
    'Clean, minimal page. Purpose: confirm order + reduce buyer\'s remorse.',
    'Green checkmark icon is universal for confirmation.',
    'Order summary is the most important element — must be accurate.',
    'Optional upsell/community banner for post-purchase engagement.',
    'CSR photo adds human touch and builds trust.',
    'Survey link is optional but valuable for product feedback.',
    'Max-width 800px — centered and focused.',
  ].join('\n'),
};
