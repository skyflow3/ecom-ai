/**
 * Purpose: Webflow premium checkout recipe — the high-end checkout pattern.
 * Used by: TryLedisa, EmSense, HaloGrow (6 pages across 3 brands + geo variants).
 *
 * Dependencies: Recipe types from index.ts
 * Related: checkout-v1-checkoutchamp.ts (the CheckoutChamp alternative)
 */

import type { PageRecipe } from './index';

export const checkoutV2Webflow: PageRecipe = {
  id: 'checkout-v2-webflow',
  name: 'Webflow Premium Checkout',
  description:
    'Premium checkout with hero banner, countdown timer in dark green, card-click bundle selector with "Most Popular" ribbon, Stripe payment, and order bump with toggle switch. Used by EmSense, HaloGrow, TryLedisa.',
  pageType: 'checkout',
  source: 'TryLedisa, EmSense (EN/DE/NL), HaloGrow (EN/DE)',
  blocks: [
    {
      type: 'announcement-bar',
      required: false,
      description:
        'Light blue savings banner at top. "You saved X%". Optional, geo-targeted.',
      exampleProps: {
        text: 'You saved 70%',
        backgroundColor: '#ebf7ff',
        textColor: '#25a2ed',
        fontSize: '12px',
        fontWeight: 700,
        padding: '6px',
      },
    },
    {
      type: 'hero-banner',
      required: true,
      description:
        'Product image + headline banner. Background image, 234px height. Flex start alignment.',
      exampleProps: {
        backgroundImage: '/images/checkout-hero-bg.jpg',
        height: '234px',
        headline: 'Special Offer Just For You',
        maxWidth: '1140px',
        padding: '0 16px',
      },
    },
    {
      type: 'countdown',
      required: true,
      description:
        'Dark green (#0C230E) timer banner. White text + lime accent (#BAF363) for discount. Montserrat font.',
      exampleProps: {
        label: "Hurry! 70% Discount reserved for",
        accentText: '70% Discount',
        accentColor: '#BAF363',
        backgroundColor: '#0C230E',
        textColor: '#fff',
        font: 'Montserrat, sans-serif',
        fontSize: '18px',
        padding: '8px 16px',
        durationMinutes: 10,
      },
    },
    {
      type: 'bundle-offers',
      required: true,
      description:
        'Card-click bundle selector (not radio). 2x2 grid on desktop, 2-col on mobile. Transparent border unselected, green (#00C249) selected. Red rotated "Most Popular" ribbon or amber top bar.',
      exampleProps: {
        tiers: [
          { quantity: 1, label: '1X', price: 49, oldPrice: 99, discount: '50% OFF', popular: false },
          { quantity: 2, label: '2X', price: 78, oldPrice: 198, discount: '60% OFF', popular: false },
          { quantity: 3, label: '3X', price: 99, oldPrice: 297, discount: '70% OFF', popular: true, badge: 'MOST POPULAR', badgeColor: '#EC0B43' },
          { quantity: 4, label: '4X', price: 120, oldPrice: 396, discount: '75% OFF', popular: false, badge: 'BEST VALUE', badgeColor: '#F59E0B' },
        ],
        gridColumns: '1fr 1fr',
        gridGap: '8px',
        cardBorderUnselected: '2px solid transparent',
        cardBorderSelected: '2px solid #00C249',
        cardRadius: '4px',
        cardShadow: '0 0 8px rgba(0,0,0,0.16)',
        cardMaxWidth: '174px',
        badgeStyle: 'ribbon',
        badgeRotation: '-40deg',
        freeShippingBg: '#ebf7ff',
      },
    },
    {
      type: 'order-bump',
      required: false,
      description:
        'Toggle switch addon. Green when on (#65CD57). Shadow box. Not cream bg (unlike CheckoutChamp).',
      exampleProps: {
        checked: false,
        productImage: '/images/addon-product.jpg',
        headline: 'Add {product} for just $19',
        backgroundColor: '#fff',
        boxShadow: '0 0 8px rgba(0,0,0,0.16)',
        toggleActiveColor: '#65CD57',
      },
    },
    {
      type: 'order-summary',
      required: true,
      description:
        'Collapsible on mobile. Border + shadow. Items list + discount code input.',
      exampleProps: {
        collapsibleOnMobile: true,
        showDiscountCode: true,
        border: '1px solid rgba(0,0,0,0.13)',
        borderRadius: '4px',
        boxShadow: '0 2px 16px -2px rgba(0,0,0,0.1)',
      },
    },
    {
      type: 'express-checkout',
      required: true,
      description:
        'PayPal + Google/Apple Pay buttons above credit card form. Separated by "OR" line.',
      exampleProps: {
        paypalBg: '#FFC43A',
        paypalTextColor: '#253B80',
        gpayBg: '#000000',
        gpayTextColor: '#fff',
        orLineColor: '#29af5c',
      },
    },
    {
      type: 'shipping-form',
      required: true,
      description:
        '3-step form: Contact (email) → Shipping (name/address/phone) → Payment (Stripe). 42px input height.',
      exampleProps: {
        steps: ['Contact', 'Shipping', 'Payment'],
        fields: [
          { step: 1, name: 'email', type: 'email', placeholder: 'Email Address' },
          { step: 2, name: 'firstName', type: 'text', placeholder: 'First Name' },
          { step: 2, name: 'lastName', type: 'text', placeholder: 'Last Name' },
          { step: 2, name: 'phone', type: 'tel', placeholder: 'Phone Number' },
          { step: 2, name: 'address1', type: 'text', placeholder: 'Address Line 1' },
          { step: 2, name: 'city', type: 'text', placeholder: 'Your City' },
          { step: 2, name: 'zip', type: 'text', placeholder: 'Zip/Postal Code' },
        ],
        inputBorder: '1px solid #E6E7EA',
        inputHeight: '42px',
        inputRadius: '4px',
        placeholderColor: '#9AA0AB',
      },
    },
    {
      type: 'payment-form',
      required: true,
      description:
        'Stripe Elements credit card form. Light gray bg block. Card fields inside.',
      exampleProps: {
        blockBg: '#f8f8f8',
        blockBorder: '1px solid #e6e7ea',
        blockRadius: '4px',
        blockPadding: '1rem',
      },
    },
    {
      type: 'privacy-text',
      required: true,
      description: 'Checkbox for terms + privacy. Gray text, below CTA.',
      exampleProps: {
        text: 'I agree to the Terms of Service and Privacy Policy',
        color: '#818997',
        fontSize: '14px',
      },
    },
    {
      type: 'cta-button',
      required: true,
      description:
        'Full-width GREEN (#00C249), SQUARE corners (radius 0). "ORDER NOW". Montserrat 700 20px. This is the most distinctive element.',
      exampleProps: {
        text: 'ORDER NOW',
        backgroundColor: '#00C249',
        hoverBackgroundColor: '#65cd57',
        textColor: '#fff',
        fontSize: '20px',
        fontWeight: 700,
        width: '100%',
        borderRadius: '0px',
        boxShadow: '0 2px 4px 2px rgba(0,0,0,0.05)',
        transition: '200ms ease-in-out',
      },
    },
    {
      type: 'discount-section',
      required: false,
      description:
        'Savings display with checkmarks. Shows what customer saved.',
      exampleProps: {
        items: [
          { text: 'Free Shipping Included', checked: true },
          { text: '70% Discount Applied', checked: true },
          { text: 'Money-Back Guarantee', checked: true },
        ],
        highlightColor: '#C95600',
      },
    },
    {
      type: 'guarantee',
      required: true,
      description: '30-day money back guarantee badge section.',
      exampleProps: {
        text: '30-Day Money-Back Guarantee',
        image: '/images/guarantee-badge.png',
        imageMaxHeight: '170px',
      },
    },
    {
      type: 'footer',
      required: true,
      description:
        'Dark 2-section footer. Links row (#141619 bg) + copyright (#0E0F11 bg).',
      exampleProps: {
        linksBg: '#141619',
        copyrightBg: '#0E0F11',
        links: ['Terms', 'Privacy', 'Contact', 'Returns'],
        padding: '40px',
      },
    },
  ],
  designTokens: {
    maxWidth: '520px',
    primaryColor: '#02122E',
    ctaColor: '#00C249',
    ctaGradient: undefined,
    backgroundColor: '#FFFFFF',
    fontFamily: "'Montserrat', sans-serif",
  },
  notes: [
    'Premium pattern — uses Stripe Elements for payment.',
    'CTA has SQUARE corners (border-radius: 0) — this is a distinctive Webflow pattern.',
    'Bundle selector uses card clicks (not radio buttons). Cards have shadow.',
    '"Most Popular" badge is a rotated red ribbon (#EC0B43) or amber top bar (#F59E0B).',
    'Countdown banner uses dark green (#0C230E) with lime (#BAF363) accent.',
    '3-step form flow: Contact > Shipping > Payment.',
    'Geo-targeted banners (.uk-banner, .de-banner, .nl-banner) available.',
    'FOMO animations (fadeIn/fadeOut 1s) for social proof popups.',
  ].join('\n'),
};
