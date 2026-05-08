/**
 * Purpose: CheckoutChamp checkout recipe — the dominant checkout pattern.
 * Used by 8/10 checkout winners: Airmoto, Rejuvacare, Vibriance, Drivse, Clarifion.
 *
 * Dependencies: Recipe types from index.ts
 * Related: checkout-v2-webflow.ts (the Webflow alternative)
 */

import type { PageRecipe } from './index';

export const checkoutV1CheckoutChamp: PageRecipe = {
  id: 'checkout-v1-checkoutchamp',
  name: 'CheckoutChamp Classic',
  description:
    'The most common DTC checkout pattern. Radio-button pricing tiers, Bootstrap-based forms, order bump with cream bg. Proven across 8+ winning brands.',
  pageType: 'checkout',
  source:
    'Airmoto, Rejuvacare, Vibriance, Drivse, MyDrivse, Clarifion, AllFemme, VitaSkin',
  blocks: [
    {
      type: 'logo-header',
      required: true,
      description: 'Centered brand logo. Minimal header, no navigation.',
      exampleProps: {
        logoUrl: '/images/logo.svg',
        logoWidth: '160px',
        borderBottom: '2px solid #ccc',
        paddingVertical: '15px',
      },
    },
    {
      type: 'scarcity-badge',
      required: false,
      description:
        'Optional sellout badge pill. Red background, pill shape, e.g. "SELLING OUT FAST".',
      exampleProps: {
        text: 'SELLING OUT FAST',
        backgroundColor: '#e84545',
        textColor: '#fff',
        borderRadius: '16px',
        fontSize: '17px',
        fontWeight: 700,
      },
    },
    {
      type: 'countdown',
      required: true,
      description:
        'Cart reservation timer. "Cart Saved For 10:00". Helvetica font, centered.',
      exampleProps: {
        label: 'Cart Saved For',
        durationMinutes: 10,
        font: 'Helvetica, serif',
        textAlign: 'center',
      },
    },
    {
      type: 'bundle-offers',
      required: true,
      description:
        'Radio-button product tiles. 1x/3x/6x tiers. Gray border unselected, gold gradient border selected. "Most Popular" on middle tier.',
      exampleProps: {
        tiers: [
          { quantity: 1, label: '1 Bottle', price: 49, perUnit: '$49/bottle', popular: false },
          { quantity: 3, label: '3 Bottles', price: 117, perUnit: '$39/bottle', popular: true, badge: 'MOST POPULAR' },
          { quantity: 6, label: '6 Bottles', price: 198, perUnit: '$33/bottle', popular: false, badge: 'BEST VALUE' },
        ],
        cardBorderUnselected: '1px solid #858585',
        cardBorderSelected: 'linear-gradient(#bd8f2f, #f9f1b2, #bd8f2f)',
        cardRadius: '3px',
        cardPadding: '12px 16px',
        radioSize: '20px',
      },
    },
    {
      type: 'order-summary',
      required: true,
      description:
        'Inline items table. Collapsible on mobile. Shows items, quantity, price. Discount code input optional.',
      exampleProps: {
        collapsible: true,
        collapsibleOnMobile: true,
        showDiscountCode: true,
        discountButtonColor: '#2563EB',
        borderColor: '1px solid lightgray',
        borderRadius: '5px',
      },
    },
    {
      type: 'guarantee',
      required: true,
      description:
        'Money-back guarantee box. Warm background, gold border, icon + text.',
      exampleProps: {
        text: '30-Day Money-Back Guarantee',
        subtext: "If you're not 100% satisfied, we'll give you a full refund.",
        backgroundColor: '#FFFBef',
        borderColor: '#FAB73C',
        borderRadius: '8px',
        padding: '16px',
      },
    },
    {
      type: 'shipping-form',
      required: true,
      description:
        'Email, First Name, Last Name, Phone, Street Address, City, Zip/Postal. Bootstrap form-control styling.',
      exampleProps: {
        fields: [
          { name: 'emailAddress', type: 'email', placeholder: 'Email Address', required: true },
          { name: 'shipFirstName', type: 'text', placeholder: 'First Name', required: true },
          { name: 'shipLastName', type: 'text', placeholder: 'Last Name', required: true },
          { name: 'shipPhone', type: 'tel', placeholder: 'Phone Number', required: true },
          { name: 'shipAddress1', type: 'text', placeholder: 'Street Address', required: true },
          { name: 'shipCity', type: 'text', placeholder: 'City', required: true },
          { name: 'shipZip', type: 'text', placeholder: 'Zip/Postal Code', required: true },
        ],
        inputBorder: '1px solid #c5c7d2',
        inputRadius: '4px',
        inputPadding: '12px 18px',
        countrySelector: true,
      },
    },
    {
      type: 'payment-form',
      required: true,
      description:
        'Credit card fields. Light gray bg block. Express checkout (PayPal + Apple/Google Pay) above card form, separated by "OR" line.',
      exampleProps: {
        showExpressCheckout: true,
        paypalBg: '#FFD11A',
        paypalTextColor: '#253B80',
        gpayBg: '#000000',
        orLineColor: '#29af5c',
        cardBlockBg: '#f8f8f8',
        cardBlockBorder: '1px solid #e6e7ea',
        cardBlockRadius: '4px',
      },
    },
    {
      type: 'order-bump',
      required: false,
      description:
        'Cream bg + dashed border + checkbox. Optional addon product with pre-checked checkbox.',
      exampleProps: {
        checked: true,
        backgroundColor: '#FCF8E3',
        borderStyle: 'dashed',
        borderColor: '#212529',
        productImage: '/images/bump-product.jpg',
        headline: 'YES! Add {product} to my order!',
        price: 19.95,
      },
    },
    {
      type: 'cta-button',
      required: true,
      description:
        'Full-width green button. "COMPLETE YOUR PURCHASE". Bold, sans-serif.',
      exampleProps: {
        text: 'COMPLETE YOUR PURCHASE',
        backgroundColor: '#00c249',
        textColor: '#fff',
        fontSize: '20px',
        fontWeight: 700,
        width: '100%',
        borderRadius: '0px',
        padding: '15px',
      },
    },
    {
      type: 'trust-badges',
      required: true,
      description:
        'SSL, secure checkout icons, payment method logos. Below CTA.',
      exampleProps: {
        badges: ['ssl', 'visa', 'mastercard', 'amex', 'paypal'],
        maxWidth: '300px',
        opacity: 0.8,
      },
    },
    {
      type: 'privacy-text',
      required: true,
      description:
        'Gray text below CTA. Terms + Privacy links. 14px.',
      exampleProps: {
        text: 'By placing your order, you agree to our Terms of Service and Privacy Policy.',
        color: '#818997',
        fontSize: '14px',
        lineHeight: '20px',
      },
    },
  ],
  designTokens: {
    maxWidth: '520px',
    primaryColor: '#02122E',
    ctaColor: '#00C249',
    ctaGradient: undefined,
    backgroundColor: '#FFFFFF',
    fontFamily: "Helvetica, 'Montserrat', sans-serif",
  },
  notes: [
    'Most popular checkout pattern — used by 8/10 checkout winners.',
    'Bootstrap 4 base (fk-row, fk-col).',
    'Bundle selector uses radio buttons, not card clicks.',
    'Order bump has cream bg (#FCF8E3) + dashed border — distinctive pattern.',
    'Max-width is narrow (520px) — forms look best centered.',
    'Express checkout MUST be above credit card form, separated by green "OR" line.',
    'Privacy text is legally required — always below CTA.',
  ].join('\n'),
};
