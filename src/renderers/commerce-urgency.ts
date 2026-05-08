/**
 * Purpose: Commerce & urgency block renderers — bundle offers, pricing, checkout,
 *          payment, shipping, countdown, scarcity, and conversion boosters.
 *          Each renderer is a standalone (block: Block) => string that returns HTML.
 * Dependencies: blocks.ts (Block), html-helpers.ts (escapeHtml, wrapSection, etc.)
 * Related: index.ts (registration), design-system/blocks.ts (schemas)
 *
 * WHY: Commerce blocks share form input styles, urgency color palettes, and
 *      mobile-first card layouts. Grouping them keeps the patterns consistent
 *      and avoids duplicating CSS variable references across files.
 */

import type { Block } from '../design-system/blocks';
import { escapeHtml, wrapSection, getProps, cn, buildResponsiveStyles, buildVisibilityClass } from './html-helpers';

// ─── Shared CSS constants (from real winning checkout pages) ────────────────────
// WHY: These exact values come from CheckoutChamp/Webflow checkout analysis.
//      Form inputs: 42px height, #E6E7EA border, 4px radius (Webflow pattern).
//      CTA buttons: #00C249 green, 20px bold, 8px radius.
//      Cards: 4px radius, 2px border transparent -> #00C249 when selected.

const FORM_INPUT_STYLE = 'height:42px;border-radius:4px;border:1px solid #E6E7EA;font-size:16px;padding:8px 12px;width:100%;box-sizing:border-box;font-family:"Inter",sans-serif;background:transparent;';
const BUTTON_BASE_STYLE = 'min-height:52px;font-weight:700;font-size:20px;border-radius:8px;border:none;cursor:pointer;width:100%;font-family:"Inter",sans-serif;transition:background-color 200ms ease-in-out;';
const CARD_BASE_STYLE = 'border-radius:4px;padding:8px 16px 16px;box-sizing:border-box;';

// ─── Urgency color helpers ───────────────────────────────────────────────────

type UrgencyLevel = 'low' | 'medium' | 'high';

function urgencyColors(level: UrgencyLevel): { bg: string; text: string } {
  switch (level) {
    case 'low':
      // WHY: Light blue trust/savings banner from Webflow checkout "top savings" pattern
      return { bg: '#ebf7ff', text: '#25a2ed' };
    case 'medium':
      // WHY: Yellow urgency box from design system --color-warning-bg (#FEFBC3)
      return { bg: '#FEFBC3', text: '#9a3412' };
    case 'high':
      // WHY: Dark green timer banner from winning checkouts (#0c230e) with lime accent
      return { bg: '#0c230e', text: '#fff' };
  }
}

// ─── 1. bundle-offers ─────────────────────────────────────────────────────────

interface BundleOfferItem {
  id: string;
  title: string;
  price: string;
  originalPrice?: string;
  perUnit?: string;
  savings?: string;
  badge?: string;
  popular?: boolean;
  selected?: boolean;
  freeShipping?: boolean;
  bonusItems?: string[];
}

interface BundleOffersProps {
  offers: BundleOfferItem[];
  layout?: 'cards' | 'list';
}

export function renderBundleOffers(block: Block): string {
  const { offers, layout = 'cards' } = getProps<BundleOffersProps>(block);
  const isCards = layout === 'cards';

  const offerCards = offers.map(offer => {
    // WHY: CheckoutChamp/Webflow pattern — unselected = transparent border, selected = green #00c249
    const borderStyle = offer.selected
      ? 'border:2px solid #00c249;box-shadow:0 0 8px rgba(0,0,0,0.16);'
      : offer.popular
        ? 'border:2px solid #00c249;box-shadow:0 0 8px rgba(0,0,0,0.16);'
        : 'border:2px solid transparent;box-shadow:0 0 8px rgba(0,0,0,0.16);';

    // WHY: Red #EC0B43 rotated ribbon from Webflow "Most Popular" badge pattern
    const badgeHtml = (offer.badge || offer.popular)
      ? `<span style="position:absolute;top:12px;left:-55px;width:200px;max-height:32px;background:#ec0b43;color:#fff;font-size:12px;font-weight:700;padding:5px;text-align:center;transform:rotate(-40deg);z-index:1;display:flex;justify-content:center;align-items:center;">${escapeHtml(offer.badge || 'Most Popular')}</span>`
      : '';

    // WHY: Strikethrough old price in #9AA0AB gray (checkout pattern), sale price larger bold navy
    const priceHtml = `
      <div style="margin-top:12px;text-align:center;">
        ${offer.originalPrice ? `<span style="font-size:16px;text-decoration:line-through;color:#9AA0AB;margin-right:4px;">${escapeHtml(offer.originalPrice)}</span>` : ''}
        <span style="font-size:24px;font-weight:700;font-family:'Inter',sans-serif;color:#1B2A43;">${escapeHtml(offer.price)}</span>
      </div>
    `;

    // WHY: Per-unit price smaller muted text below main price (checkout pattern)
    const perUnitHtml = offer.perUnit
      ? `<div style="font-size:14px;color:#4e596d;margin-top:2px;text-align:center;font-weight:500;">${escapeHtml(offer.perUnit)}</div>`
      : '';

    // WHY: Green savings text #4ECE7E or red discount #EC0B43 from checkout pages
    const savingsHtml = offer.savings
      ? `<div style="font-size:16px;font-weight:700;color:#EC0B43;margin-top:6px;text-align:center;">${escapeHtml(offer.savings)}</div>`
      : '';

    // WHY: Free shipping badge — black bg or light blue bg pattern from checkout pages
    const freeShippingHtml = offer.freeShipping
      ? `<div style="font-size:13px;font-weight:600;color:#00c249;margin-top:8px;display:flex;align-items:center;justify-content:center;gap:4px;"><span>&#10003;</span> FREE Shipping</div>`
      : '';

    const bonusHtml = offer.bonusItems && offer.bonusItems.length > 0
      ? `<ul style="margin:8px 0 0;padding-left:16px;font-size:13px;color:var(--color-text);">${offer.bonusItems.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`
      : '';

    return `
      <div style="position:relative;${CARD_BASE_STYLE}${borderStyle}flex:1;min-width:${isCards ? '220px' : '100%'};background:#fff;cursor:pointer;text-align:center;">
        ${badgeHtml}
        <div style="font-size:14px;font-weight:400;color:#1B2A43;margin-bottom:4px;font-family:'Inter',sans-serif;">${escapeHtml(offer.title)}</div>
        ${priceHtml}
        ${perUnitHtml}
        ${savingsHtml}
        ${freeShippingHtml}
        ${bonusHtml}
      </div>
    `;
  }).join('');

  // WHY: 8px gap from Webflow checkout grid-column-gap pattern
  const containerStyle = isCards
    ? 'display:grid;grid-template-columns:1fr 1fr;gap:8px;'
    : 'display:flex;flex-direction:column;gap:8px;';

  const responsiveHint = isCards
    ? `<style>[data-block-id="${block.id}"] .ec-bundle-offers-grid{${containerStyle}}@media(min-width:768px){[data-block-id="${block.id}"] .ec-bundle-offers-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));overflow:visible;}}</style>`
    : '';

  const visibilityClass = buildVisibilityClass(block.visibility);
  const responsiveStyles = buildResponsiveStyles(block.id, block.styles);

  const content = `
    ${responsiveHint}
    <div class="ec-bundle-offers-grid ${cn(visibilityClass)}" style="${containerStyle}">
      ${offerCards}
    </div>
  `;

  return wrapSection(content, {
    id: block.id,
    blockClass: 'ec-bundle-offers',
    extraClass: visibilityClass,
    analyticsId: block.analyticsId,
    abTestId: block.metadata?.abTestId,
  }) + responsiveStyles;
}

// ─── 2. pricing-card ──────────────────────────────────────────────────────────

interface PricingCardProps {
  title: string;
  price: string;
  originalPrice?: string;
  features: string[];
  popular?: boolean;
  ctaText?: string;
}

export function renderPricingCard(block: Block): string {
  const { title, price, originalPrice, features, popular, ctaText } = getProps<PricingCardProps>(block);

  // WHY: "Best Value" badge in amber #F59E0B from product page pricing card pattern
  const badgeHtml = popular
    ? `<div style="text-align:center;"><span style="display:inline-block;background:#F59E0B;color:#fff;font-size:12px;font-weight:700;padding:4px 14px;border-radius:4px;margin-bottom:12px;">Most Popular</span></div>`
    : '';

  // WHY: Card shadow from Webflow checkout -- 0 0 8px rgba(0,0,0,0.16)
  const borderStyle = popular
    ? 'border:2px solid #00c249;box-shadow:0 0 8px rgba(0,0,0,0.16);'
    : 'border:2px solid #E5E7EB;';

  const priceBlock = `
    <div style="text-align:center;margin:16px 0;">
      ${originalPrice ? `<span style="font-size:16px;text-decoration:line-through;color:#9AA0AB;margin-right:4px;">${escapeHtml(originalPrice)}</span>` : ''}
      <span style="font-size:36px;font-weight:800;font-family:'Inter',sans-serif;color:#1B2A43;">${escapeHtml(price)}</span>
    </div>
  `;

  const featuresList = features.map(f =>
    `<li style="display:flex;align-items:flex-start;gap:8px;margin-bottom:8px;font-size:15px;color:#1B2A43;"><span style="color:#00c249;font-weight:700;flex-shrink:0;">&#10003;</span>${escapeHtml(f)}</li>`
  ).join('');

  const ctaHtml = ctaText
    ? `<button style="${BUTTON_BASE_STYLE}background:#00c249;color:#fff;margin-top:16px;">${escapeHtml(ctaText)}</button>`
    : '';

  const content = `
    ${badgeHtml}
    <div style="text-align:center;font-size:18px;font-weight:700;font-family:'DM Serif Display',serif;color:var(--color-text);">${escapeHtml(title)}</div>
    ${priceBlock}
    <ul style="list-style:none;padding:0;margin:0;">${featuresList}</ul>
    ${ctaHtml}
  `;

  const visibilityClass = buildVisibilityClass(block.visibility);
  const responsiveStyles = buildResponsiveStyles(block.id, block.styles);

  return wrapSection(`<div style="${CARD_BASE_STYLE}${borderStyle}">${content}</div>`, {
    id: block.id,
    blockClass: 'ec-pricing-card',
    extraClass: visibilityClass,
    analyticsId: block.analyticsId,
    abTestId: block.metadata?.abTestId,
  }) + responsiveStyles;
}

// ─── 3. add-to-cart ───────────────────────────────────────────────────────────

interface AddToCartProps {
  buttonText: string;
  variantId?: string;
  expressCheckout?: boolean;
}

export function renderAddToCart(block: Block): string {
  const { buttonText, variantId, expressCheckout = true } = getProps<AddToCartProps>(block);

  const variantAttr = variantId ? ` data-variant-id="${escapeHtml(variantId)}"` : '';

  const expressButtons = expressCheckout
    ? `
      <div style="display:flex;gap:8px;margin-bottom:12px;">
        <button style="flex:1;height:42px;border-radius:4px;border:1px solid transparent;background:#FFC43A;color:#253B80;font-weight:700;font-size:16px;cursor:pointer;font-family:'Inter',sans-serif;" type="button">PayPal</button>
        <button style="flex:1;height:42px;border-radius:4px;border:1px solid transparent;background:#000;color:#fff;font-weight:600;font-size:16px;cursor:pointer;font-family:'Inter',sans-serif;" type="button">Apple Pay</button>
      </div>
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
        <hr style="flex:1;border:none;border-top:1px solid #E5E7EB;">
        <span style="font-size:13px;color:#9AA0AB;">Or pay with card</span>
        <hr style="flex:1;border:none;border-top:1px solid #E5E7EB;">
      </div>
    `
    : '';

  // WHY: Green #00c249 full-width CTA from Webflow checkout — "ORDER NOW" button pattern
  const content = `
    ${expressButtons}
    <button class="ec-add-to-cart" style="${BUTTON_BASE_STYLE}background:#00c249;color:#fff;height:56px;box-shadow:0 2px 4px 2px rgba(0,0,0,0.05);"${variantAttr}>${escapeHtml(buttonText)}</button>
  `;

  const visibilityClass = buildVisibilityClass(block.visibility);
  const responsiveStyles = buildResponsiveStyles(block.id, block.styles);

  return wrapSection(content, {
    id: block.id,
    blockClass: 'ec-add-to-cart',
    extraClass: visibilityClass,
    analyticsId: block.analyticsId,
    abTestId: block.metadata?.abTestId,
  }) + responsiveStyles;
}

// ─── 4. order-summary ─────────────────────────────────────────────────────────

interface OrderItem {
  name: string;
  price: string;
  quantity?: number;
}

interface OrderSummaryProps {
  items: OrderItem[];
  subtotal: string;
  shipping?: string;
  total: string;
}

export function renderOrderSummary(block: Block): string {
  const { items, subtotal, shipping, total } = getProps<OrderSummaryProps>(block);

  const rowsHtml = items.map(item => `
    <tr>
      <td style="padding:8px 0;font-size:14px;color:var(--color-text);">${escapeHtml(item.name)}${item.quantity ? ` &times; ${item.quantity}` : ''}</td>
      <td style="padding:8px 0;font-size:14px;color:var(--color-text);text-align:right;white-space:nowrap;">${escapeHtml(item.price)}</td>
    </tr>
  `).join('');

  const shippingDisplay = shipping
    ? escapeHtml(shipping)
    : '<span style="color:#16a34a;font-weight:700;">FREE</span>';

  const content = `
    <details open style="border:1px solid #e5e7eb;border-radius:12px;padding:16px;">
      <summary style="font-size:16px;font-weight:700;cursor:pointer;font-family:'DM Serif Display',serif;color:var(--color-text);">Order Summary</summary>
      <table style="width:100%;border-collapse:collapse;margin-top:12px;">
        <tbody>
          ${rowsHtml}
        </tbody>
        <tfoot>
          <tr><td colspan="2" style="padding-top:12px;"><hr style="border:none;border-top:1px solid #e5e7eb;"></td></tr>
          <tr>
            <td style="padding:8px 0;font-size:14px;color:var(--color-muted);">Subtotal</td>
            <td style="padding:8px 0;font-size:14px;color:var(--color-text);text-align:right;">${escapeHtml(subtotal)}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;font-size:14px;color:var(--color-muted);">Shipping</td>
            <td style="padding:8px 0;font-size:14px;text-align:right;">${shippingDisplay}</td>
          </tr>
          <tr><td colspan="2" style="padding-top:8px;"><hr style="border:none;border-top:1px solid #e5e7eb;"></td></tr>
          <tr>
            <td style="padding:8px 0;font-size:16px;font-weight:800;color:var(--color-text);">Total</td>
            <td style="padding:8px 0;font-size:16px;font-weight:800;color:var(--color-text);text-align:right;">${escapeHtml(total)}</td>
          </tr>
        </tfoot>
      </table>
    </details>
  `;

  const visibilityClass = buildVisibilityClass(block.visibility);
  const responsiveStyles = buildResponsiveStyles(block.id, block.styles);

  /* WHY "open" attribute: Mobile starts open for quick review. Desktop will be
     collapsed via the media-query style below since screen space is less scarce. */
  const collapseHint = `<style>@media(min-width:768px){[data-block-id="${block.id}"] details[open]{/* JS will close on desktop init */}}</style>`;

  return wrapSection(content, {
    id: block.id,
    blockClass: 'ec-order-summary',
    extraClass: visibilityClass,
    analyticsId: block.analyticsId,
    abTestId: block.metadata?.abTestId,
  }) + collapseHint + responsiveStyles;
}

// ─── 5. payment-form ──────────────────────────────────────────────────────────

interface PaymentFormProps {
  provider?: 'stripe' | 'paypal';
  expressCheckout?: boolean;
}

export function renderPaymentForm(block: Block): string {
  const { provider = 'stripe', expressCheckout = true } = getProps<PaymentFormProps>(block);

  const expressHtml = expressCheckout
    ? `
      <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px;">
        <button style="height:42px;border-radius:4px;border:1px solid transparent;background:#FFC43A;color:#253B80;font-weight:700;font-size:16px;cursor:pointer;font-family:'Inter',sans-serif;" type="button">PayPal</button>
        <div style="display:flex;gap:8px;">
          <button style="flex:1;height:42px;border-radius:4px;border:1px solid transparent;background:#000;color:#fff;font-weight:600;font-size:16px;cursor:pointer;font-family:'Inter',sans-serif;" type="button">Apple Pay</button>
          <button style="flex:1;height:42px;border-radius:4px;border:1px solid transparent;background:#000;color:#fff;font-weight:600;font-size:16px;cursor:pointer;font-family:'Inter',sans-serif;" type="button">Google Pay</button>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
        <hr style="flex:1;border:none;border-top:1px solid #E5E7EB;">
        <span style="font-size:14px;color:#9AA0AB;font-weight:500;">Or pay with card</span>
        <hr style="flex:1;border:none;border-top:1px solid #E5E7EB;">
      </div>
    `
    : '';

  // WHY: Payment card block from Webflow checkout — light gray bg #f8f8f8, #E6E7EA border, 4px radius
  const cardFields = `
    <div style="background:#f8f8f8;border:1px solid #E6E7EA;border-radius:4px;padding:16px;margin-bottom:12px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
        <span style="font-size:16px;font-weight:700;color:#1B2A43;font-family:'Inter',sans-serif;">Credit Card</span>
      </div>
      <div style="margin-bottom:12px;">
        <label style="display:block;font-size:14px;font-weight:600;margin-bottom:4px;color:#1B2A43;font-family:'Inter',sans-serif;">Card number</label>
        <input type="text" placeholder="1234 5678 9012 3456" style="${FORM_INPUT_STYLE}" autocomplete="cc-number">
      </div>
      <div style="display:flex;gap:8px;">
        <div style="flex:1;margin-bottom:12px;">
          <label style="display:block;font-size:14px;font-weight:600;margin-bottom:4px;color:#1B2A43;font-family:'Inter',sans-serif;">Expiry</label>
          <input type="text" placeholder="MM / YY" style="${FORM_INPUT_STYLE}" autocomplete="cc-exp">
        </div>
        <div style="flex:1;margin-bottom:12px;">
          <label style="display:block;font-size:14px;font-weight:600;margin-bottom:4px;color:#1B2A43;font-family:'Inter',sans-serif;">CVC</label>
          <input type="text" placeholder="123" style="${FORM_INPUT_STYLE}" autocomplete="cc-csc">
        </div>
      </div>
    </div>
  `;

  /* WHY placeholder inputs: Stripe Elements replaces these at runtime.
     The static HTML gives designers/PMs a visual preview without running JS. */
  const content = `
    <div class="ec-payment-form" data-provider="${escapeHtml(provider)}">
      ${expressHtml}
      ${cardFields}
    </div>
  `;

  const visibilityClass = buildVisibilityClass(block.visibility);
  const responsiveStyles = buildResponsiveStyles(block.id, block.styles);

  return wrapSection(content, {
    id: block.id,
    blockClass: 'ec-payment-form',
    extraClass: visibilityClass,
    analyticsId: block.analyticsId,
    abTestId: block.metadata?.abTestId,
  }) + responsiveStyles;
}

// ─── 6. shipping-form ─────────────────────────────────────────────────────────

type ShippingField = 'firstName' | 'lastName' | 'email' | 'phone' | 'address' | 'city' | 'state' | 'zip' | 'country';

interface ShippingFormProps {
  fields: ShippingField[];
}

const SHIPPING_LABELS: Record<ShippingField, string> = {
  firstName: 'First name',
  lastName: 'Last name',
  email: 'Email',
  phone: 'Phone',
  address: 'Address',
  city: 'City',
  state: 'State',
  zip: 'ZIP code',
  country: 'Country',
};

const SHIPPING_PLACEHOLDERS: Record<ShippingField, string> = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phone: '(555) 123-4567',
  address: '123 Main St',
  city: 'City',
  state: 'State',
  zip: '12345',
  country: 'United States',
};

const SHIPPING_TYPES: Record<ShippingField, string> = {
  firstName: 'text',
  lastName: 'text',
  email: 'email',
  phone: 'tel',
  address: 'text',
  city: 'text',
  state: 'text',
  zip: 'text',
  country: 'text',
};

const SHIPPING_AUTOCOMPLETE: Record<ShippingField, string> = {
  firstName: 'given-name',
  lastName: 'family-name',
  email: 'email',
  phone: 'tel',
  address: 'street-address',
  city: 'address-level2',
  state: 'address-level1',
  zip: 'postal-code',
  country: 'country-name',
};

function renderField(field: ShippingField): string {
  return `
    <div>
      <label style="display:block;font-size:14px;font-weight:600;margin-bottom:4px;color:#1B2A43;font-family:'Inter',sans-serif;">${escapeHtml(SHIPPING_LABELS[field])}</label>
      <input type="${SHIPPING_TYPES[field]}" name="${field}" placeholder="${escapeHtml(SHIPPING_PLACEHOLDERS[field])}" autocomplete="${SHIPPING_AUTOCOMPLETE[field]}" style="${FORM_INPUT_STYLE}">
    </div>
  `;
}

export function renderShippingForm(block: Block): string {
  const { fields } = getProps<ShippingFormProps>(block);

  const fieldSet = new Set(fields);
  const rows: string[] = [];

  /* WHY row grouping: First + last name share a row (2 cols), city + state + zip
     share a row (3 cols). Everything else is full-width. Order follows the natural
     top-to-bottom form flow regardless of the input array order. */

  const orderedFields: ShippingField[] = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zip', 'country']
    .filter(f => fieldSet.has(f as ShippingField)) as ShippingField[];

  let i = 0;
  while (i < orderedFields.length) {
    const current = orderedFields[i];

    // firstName + lastName → 2-column row
    if (current === 'firstName' && orderedFields[i + 1] === 'lastName') {
      rows.push(`<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">${renderField('firstName')}${renderField('lastName')}</div>`);
      i += 2;
      continue;
    }

    // city + state + zip → 3-column row
    if (current === 'city' && orderedFields.slice(i, i + 3).join(',') === 'city,state,zip') {
      rows.push(`<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;">${renderField('city')}${renderField('state')}${renderField('zip')}</div>`);
      i += 3;
      continue;
    }

    // Any other field → full-width
    rows.push(renderField(current));
    i++;
  }

  const content = `
    <form class="ec-shipping-form" style="display:flex;flex-direction:column;gap:12px;">
      ${rows.join('')}
    </form>
  `;

  const visibilityClass = buildVisibilityClass(block.visibility);
  const responsiveStyles = buildResponsiveStyles(block.id, block.styles);

  return wrapSection(content, {
    id: block.id,
    blockClass: 'ec-shipping-form',
    extraClass: visibilityClass,
    analyticsId: block.analyticsId,
    abTestId: block.metadata?.abTestId,
  }) + responsiveStyles;
}

// ─── 7. countdown ─────────────────────────────────────────────────────────────

interface CountdownProps {
  endDate?: string;
  minutes?: number;
  label?: string;
  cartReservation?: boolean;
  urgency?: UrgencyLevel;
}

export function renderCountdown(block: Block): string {
  const { endDate, minutes, label, cartReservation = false, urgency = 'medium' } = getProps<CountdownProps>(block);

  const colors = urgencyColors(urgency);

  /* WHY static placeholder: JS will hydrate this timer at runtime. We render
     a meaningful default so the design is reviewable without JS. */
  const defaultMinutes = minutes ? String(minutes).padStart(2, '0') : '14';
  const defaultSeconds = '59';

  const labelText = label || (cartReservation ? 'Cart Reserved For' : 'Offer Ends In');

  const pulseStyle = urgency === 'high'
    ? '@keyframes ec-pulse{0%,100%{opacity:1}50%{opacity:0.7}}'
    : '';

  // WHY: Dark green #0c230e banner with lime #baf363 accent from Webflow checkout timer pattern
  //      "Cart Reserved For" text in white, timer digits bold, lime accent for highlighted text
  const content = `
    <div class="ec-countdown" style="text-align:center;padding:8px 16px;border-radius:4px;background:#0c230e;color:#fff;">
      <div style="font-size:14px;font-weight:400;margin-bottom:4px;font-family:'Inter',sans-serif;color:#fff;">${escapeHtml(labelText)}</div>
      <div style="font-size:24px;font-weight:700;font-family:'Inter',sans-serif;letter-spacing:2px;color:#baf363;${urgency === 'high' ? 'animation:ec-pulse 1.5s infinite;' : ''}"
           data-end-date="${escapeHtml(endDate || '')}"
           data-minutes="${minutes || ''}">
        ${defaultMinutes}:${defaultSeconds}
      </div>
    </div>
    ${pulseStyle ? `<style>${pulseStyle}[data-block-id="${block.id}"] .ec-countdown [style*="pulse"]{animation:ec-pulse 1.5s infinite;}</style>` : ''}
  `;

  const visibilityClass = buildVisibilityClass(block.visibility);
  const responsiveStyles = buildResponsiveStyles(block.id, block.styles);

  return wrapSection(content, {
    id: block.id,
    blockClass: 'ec-countdown',
    extraClass: visibilityClass,
    analyticsId: block.analyticsId,
    abTestId: block.metadata?.abTestId,
  }) + responsiveStyles;
}

// ─── 8. scarcity-badge ────────────────────────────────────────────────────────

interface ScarcityBadgeProps {
  text: string;
  urgencyLevel?: UrgencyLevel;
}

export function renderScarcityBadge(block: Block): string {
  const { text, urgencyLevel = 'medium' } = getProps<ScarcityBadgeProps>(block);

  // WHY: Scarcity badges from real winners — yellow warning bg, red urgency, pill shape sellout badge
  const colorMap: Record<UrgencyLevel, { bg: string; text: string }> = {
    low: { bg: '#FEFBC3', text: '#854d0e' },
    medium: { bg: '#FEFBC3', text: '#D0021B' },
    high: { bg: '#e84545', text: '#ffffff' },
  };

  const { bg, text: textColor } = colorMap[urgencyLevel];

  const content = `
    <div class="ec-scarcity-badge" style="width:100%;text-align:center;font-size:14px;font-weight:700;padding:8px 16px;border-radius:16px;background:${bg};color:${textColor};font-family:'Inter',sans-serif;">
      ${escapeHtml(text)}
    </div>
  `;

  const visibilityClass = buildVisibilityClass(block.visibility);
  const responsiveStyles = buildResponsiveStyles(block.id, block.styles);

  return wrapSection(content, {
    id: block.id,
    blockClass: 'ec-scarcity-badge',
    extraClass: visibilityClass,
    analyticsId: block.analyticsId,
    abTestId: block.metadata?.abTestId,
  }) + responsiveStyles;
}

// ─── 9. negative-opt-out ──────────────────────────────────────────────────────

interface NegativeOptOutProps {
  text: string;
  checkboxLabel?: string;
  lossAversion?: string;
}

export function renderNegativeOptOut(block: Block): string {
  const { text, checkboxLabel, lossAversion } = getProps<NegativeOptOutProps>(block);

  // WHY: Opt-out from real upsell pages — blue link #0000EE, small font 14-17px, long guilt-trip copy
  const checkboxHtml = checkboxLabel
    ? `
      <label style="display:flex;align-items:center;gap:8px;font-size:13px;color:#818997;cursor:pointer;font-family:'Inter',sans-serif;">
        <input type="checkbox" style="width:16px;height:16px;accent-color:#00c249;">
        ${escapeHtml(checkboxLabel)}
      </label>
    `
    : '';

  const lossHtml = lossAversion
    ? `<div style="font-size:12px;font-style:italic;color:#818997;margin-top:6px;font-family:'Inter',sans-serif;">${escapeHtml(lossAversion)}</div>`
    : '';

  const content = `
    <div class="ec-negative-opt-out" style="text-align:center;padding:16px 0;">
      <a href="#" style="font-size:14px;color:#0000EE;text-decoration:underline;font-family:'Inter',sans-serif;">${escapeHtml(text)}</a>
      ${checkboxHtml}
      ${lossHtml}
    </div>
  `;

  const visibilityClass = buildVisibilityClass(block.visibility);
  const responsiveStyles = buildResponsiveStyles(block.id, block.styles);

  return wrapSection(content, {
    id: block.id,
    blockClass: 'ec-negative-opt-out',
    extraClass: visibilityClass,
    analyticsId: block.analyticsId,
    abTestId: block.metadata?.abTestId,
  }) + responsiveStyles;
}

// ─── 10. selling-plan-toggle ──────────────────────────────────────────────────

interface SellingPlanToggleProps {
  oneTimeLabel?: string;
  subscribeLabel?: string;
  discountPercent?: number;
}

export function renderSellingPlanToggle(block: Block): string {
  const { oneTimeLabel = 'One-time', subscribeLabel = 'Subscribe', discountPercent } = getProps<SellingPlanToggleProps>(block);

  const discountBadge = discountPercent
    ? `<span style="display:inline-block;background:#dcfce7;color:#00c249;font-size:11px;font-weight:700;padding:2px 8px;border-radius:12px;margin-left:6px;">Save ${discountPercent}%</span>`
    : '';

  const content = `
    <div class="ec-selling-plan-toggle" style="display:flex;border-radius:4px;border:1px solid #E6E7EA;overflow:hidden;">
      <button style="flex:1;padding:14px 12px;font-size:15px;font-weight:600;border:none;background:transparent;color:#9AA0AB;cursor:pointer;font-family:'Inter',sans-serif;" data-plan="one-time">
        ${escapeHtml(oneTimeLabel)}
      </button>
      <button style="flex:1;padding:14px 12px;font-size:15px;font-weight:700;border:none;background:#00c249;color:#fff;cursor:pointer;font-family:'Inter',sans-serif;" data-plan="subscribe">
        ${escapeHtml(subscribeLabel)}${discountBadge}
      </button>
    </div>
  `;

  /* WHY subscribe active by default: Subscription models have higher LTV.
     The active toggle defaults to "Subscribe" to nudge the conversion. */

  const visibilityClass = buildVisibilityClass(block.visibility);
  const responsiveStyles = buildResponsiveStyles(block.id, block.styles);

  return wrapSection(content, {
    id: block.id,
    blockClass: 'ec-selling-plan-toggle',
    extraClass: visibilityClass,
    analyticsId: block.analyticsId,
    abTestId: block.metadata?.abTestId,
  }) + responsiveStyles;
}

// ─── 11. discount-code ────────────────────────────────────────────────────────

interface DiscountCodeProps {
  placeholder?: string;
  applyButtonText?: string;
}

export function renderDiscountCode(block: Block): string {
  const { placeholder = 'Enter coupon code', applyButtonText = 'Apply' } = getProps<DiscountCodeProps>(block);

  const content = `
    <div class="ec-discount-code" style="display:flex;gap:8px;">
      <input type="text" placeholder="${escapeHtml(placeholder)}" style="flex:7;${FORM_INPUT_STYLE}text-transform:uppercase;">
      <button style="flex:3;${BUTTON_BASE_STYLE}background:#2563EB;color:#fff;font-size:14px;min-height:42px;">${escapeHtml(applyButtonText)}</button>
    </div>
  `;

  const visibilityClass = buildVisibilityClass(block.visibility);
  const responsiveStyles = buildResponsiveStyles(block.id, block.styles);

  return wrapSection(content, {
    id: block.id,
    blockClass: 'ec-discount-code',
    extraClass: visibilityClass,
    analyticsId: block.analyticsId,
    abTestId: block.metadata?.abTestId,
  }) + responsiveStyles;
}

// ─── 12. payment-options ──────────────────────────────────────────────────────

interface PaymentOptionsProps {
  methods: Array<'stripe' | 'paypal' | 'apple-pay' | 'google-pay'>;
}

const PAYMENT_LABELS: Record<string, string> = {
  'stripe': 'Card',
  'paypal': 'PayPal',
  'apple-pay': 'Apple Pay',
  'google-pay': 'Google Pay',
};

const PAYMENT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'stripe': { bg: '#fff', text: '#32325d', border: '#e5e7eb' },
  'paypal': { bg: '#ffc439', text: '#003087', border: '#ffc439' },
  'apple-pay': { bg: '#000', text: '#fff', border: '#000' },
  'google-pay': { bg: '#fff', text: '#5f6368', border: '#e5e7eb' },
};

export function renderPaymentOptions(block: Block): string {
  const { methods } = getProps<PaymentOptionsProps>(block);

  const methodButtons = methods.map(method => {
    const colors = PAYMENT_COLORS[method] || PAYMENT_COLORS['stripe'];
    return `
      <div style="display:flex;align-items:center;justify-content:center;height:44px;padding:0 16px;border-radius:8px;border:1px solid ${colors.border};background:${colors.bg};color:${colors.text};font-size:13px;font-weight:700;font-family:'Inter',sans-serif;white-space:nowrap;">
        ${escapeHtml(PAYMENT_LABELS[method] || method)}
      </div>
    `;
  }).join('');

  const content = `
    <div class="ec-payment-options" style="display:flex;justify-content:center;align-items:center;gap:12px;flex-wrap:wrap;">
      ${methodButtons}
    </div>
  `;

  const visibilityClass = buildVisibilityClass(block.visibility);
  const responsiveStyles = buildResponsiveStyles(block.id, block.styles);

  return wrapSection(content, {
    id: block.id,
    blockClass: 'ec-payment-options',
    extraClass: visibilityClass,
    analyticsId: block.analyticsId,
    abTestId: block.metadata?.abTestId,
  }) + responsiveStyles;
}

// ─── 13. guarantee ─────────────────────────────────────────────────────────────

interface GuaranteeProps {
  text: string;
  days?: number;
  icon?: string;
  guaranteeType?: 'money-back' | 'satisfaction' | 'results' | 'bottom-of-the-bottle';
  description?: string;
}

const GUARANTEE_LABELS: Record<string, string> = {
  'money-back': 'Money-Back Guarantee',
  'satisfaction': 'Satisfaction Guarantee',
  'results': 'Results Guarantee',
  'bottom-of-the-bottle': 'Bottom-of-the-Bottle Guarantee',
};

export function renderGuarantee(block: Block): string {
  const { text, days, icon, guaranteeType = 'money-back', description } = getProps<GuaranteeProps>(block);

  const iconDisplay = icon || (guaranteeType === 'bottom-of-the-bottle' ? '🛡️' : '✅');

  const headingParts: string[] = [];
  if (days) {
    headingParts.push(`${days}-Day`);
  }
  headingParts.push(GUARANTEE_LABELS[guaranteeType] || 'Guarantee');
  const heading = headingParts.join(' ');

  const descriptionHtml = description
    ? `<div style="font-size:14px;color:var(--color-text);margin-top:8px;line-height:1.5;font-family:'Inter',sans-serif;">${escapeHtml(description)}</div>`
    : '';

  const content = `
    <div class="ec-guarantee" style="text-align:center;padding:16px;border-radius:8px;background:#FFFBef;border:1px solid #FAB73C;">
      <div style="font-size:32px;margin-bottom:8px;">${iconDisplay}</div>
      <div style="font-size:18px;font-weight:800;font-family:'DM Serif Display',serif;color:#1B1B1B;">${escapeHtml(heading)}</div>
      <div style="font-size:15px;font-weight:600;margin-top:4px;color:#1B1B1B;font-family:'Inter',sans-serif;">${escapeHtml(text)}</div>
      ${descriptionHtml}
    </div>
  `;

  const visibilityClass = buildVisibilityClass(block.visibility);
  const responsiveStyles = buildResponsiveStyles(block.id, block.styles);

  return wrapSection(content, {
    id: block.id,
    blockClass: 'ec-guarantee',
    extraClass: visibilityClass,
    analyticsId: block.analyticsId,
    abTestId: block.metadata?.abTestId,
  }) + responsiveStyles;
}
