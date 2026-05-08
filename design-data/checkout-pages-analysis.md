# CHECKOUT PAGES ANALYSIS - DTC Winning Checkout Pages

## Source Files Analyzed: 19 HTML checkout pages
## Date: 2026-05-08

---

## TWO DISTINCT PLATFORMS IDENTIFIED

All checkout pages fall into exactly **2 platform architectures**:

| Platform | Pages | Tech Stack | Key Identifier |
|----------|-------|------------|----------------|
| **Webflow** (Custom) | tryledisa, tryemsense, halogrow_en, halogrow_de, tryemsense_de, tryemsense_nl | Webflow CSS + custom JS + Stripe Elements | `w-dyn-list`, `w-tab-pane`, `c-offer-card` classes |
| **CheckoutChamp** | airmoto, airmoto_v2, rejuvacare, allfemme, vibriance, drivse, mydrivse, clarifion, vitaskin | Bootstrap 4 + CheckoutChamp JS + FunnelKonnekt | `fk-row`, `fk-col`, `fk-product-tile` classes |

---

## PLATFORM 1: WEBFLOW CHECKOUT (The Premium Ones)

### Pages: tryledisa, tryemsense, tryemsense_de, tryemsense_nl, halogrow_en, halogrow_de

### COMPLETE PAGE STRUCTURE (top to bottom)

```
1. ERROR MODAL          (hidden, z-index:999)
2. TOP SAVINGS BANNER   (optional, blue strip)
3. HERO BANNER          (product image + headline, 234px height)
4. TIMER BANNER         (dark green #0c230e, countdown + scarcity text)
5. PRODUCT SELECTOR     (bundle cards, 1x/2x/3x/4x options)
6. ORDER BUMP           (optional addon checkbox)
7. CHECKOUT SECTION
   a. ORDER SUMMARY     (collapsible on mobile)
   b. EXPRESS CHECKOUT  (PayPal + Google Pay buttons)
   c. CONTACT FORM      (Step 1: Email)
   d. SHIPPING FORM     (Step 2: Name, Address, Phone)
   e. PAYMENT FORM      (Step 3: Credit Card via Stripe)
   f. PRIVACY OPTIN     (Terms + Privacy checkbox)
   g. CTA BUTTON        ("ORDER NOW" green button)
8. DISCOUNT SECTION     (savings display)
9. GUARANTEE SECTION    (30-day money back badge)
10. FOOTER LINKS        (dark background, legal links)
11. FOOTER DETAILS      (darker background, copyright)
12. LOADER MODAL        (hidden, processing overlay)
```

---

### SECTION-BY-SECTION EXACT CSS

---

### 1. HERO BANNER

```css
.c-hero {
  background-color: transparent;
  background-image: url('header_bg.jpg');
  background-position: 50%;
  background-size: cover;
  height: 234px;
  display: flex;
  position: relative;
  overflow: hidden;
}
.c-hero-cont {
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  max-width: 1140px;  /* tryledisa: 1172px */
  padding-left: 16px;
  display: flex;
}
```

---

### 2. TIMER / COUNTDOWN BANNER (Scarcity)

```css
/* Outer banner section */
.banner {
  background-color: #0c230e;  /* Dark forest green */
  display: block;
}

/* Timer wrapper */
.timer-wrapper-hs {
  background-color: #0c230e;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 8px 16px;
  display: flex;
}

/* Container */
.w-layout-blockcontainer.container-9.body-7.w-container {
  /* Centers content */
}

/* Timer text */
.timer-text-container-js {
  flex: 0 auto;
  justify-content: flex-start;
  align-items: center;
  display: flex;
}

/* "Hurry!" text */
.hurry-70-discount-reserved-for-3-copy {
  color: #fff;
  font-family: Montserrat, sans-serif;
  font-size: 18px;
  font-weight: 400;
  line-height: 26px;
}

/* "70% Discount" highlighted text */
.hurry-70-discount-reserved-for-4-copy {
  color: #baf363;  /* Lime green accent */
  font-family: Montserrat, sans-serif;
  font-size: 18px;
  font-weight: 700;
  line-height: 26px;
}

/* Countdown digits */
#minutes, #seconds {
  /* Displayed as styled digit blocks */
}
```

**PATTERN**: Dark green banner (#0c230e) with white text and lime green (#baf363) accent for the discount percentage. Timer on the right side.

---

### 3. BUNDLE / PRICING SELECTOR CARDS (THE MOST IMPORTANT ELEMENT)

#### Card Container (product grid)

```css
.c-products {
  flex-flow: column wrap;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 1rem;
}

/* Grid of cards - 2 columns on mobile */
.collection-list-hs-v1 {
  grid-column-gap: 8px;
  grid-row-gap: 8px;
  flex-flow: row;
  grid-template-rows: auto auto;
  grid-template-columns: 1fr 1fr;  /* 2-col grid */
  grid-auto-columns: 1fr;
  justify-content: center;
  align-items: stretch;  /* Cards stretch to equal height */
  display: flex;
}

/* Individual item wrapper */
.collection-item-hs1 {
  width: 100%;
  padding: 0;
  display: block;
  overflow: visible;
}
```

#### Offer Card (UNSELECTED state)

```css
.c-offer-card-v2 {
  cursor: pointer;
  background-color: #fff;
  border: 2px solid transparent;  /* No border when unselected */
  border-radius: 4px;
  flex-direction: column;
  flex: 1;
  justify-content: space-between;
  align-items: center;
  width: auto;
  max-width: 174px;
  height: 100%;
  padding: 8px 0 0;
  display: flex;
  position: relative;
  overflow: visible;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.16);  /* Subtle shadow */
}
```

#### Offer Card (SELECTED state - via JS)
Selected card gets: `border: 2px solid #00c249` (green) and enhanced shadow. The product-content-default div toggles to product-content-selected.

#### "MOST POPULAR" Badge

```css
/* Corner ribbon version (original) */
.c-most-popular-badge {
  z-index: 1;
  background-color: #ec0b43;  /* Red */
  justify-content: center;
  align-items: center;
  width: 200px;
  height: 100%;
  max-height: 32px;
  padding: 5px;
  display: flex;
  position: absolute;
  top: 20px;
  left: -55px;
  transform: rotate(-40deg);  /* Angled ribbon */
}

/* Top bar version (v2, newer pages) */
.c-most-popular-badgeee {
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 0;
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  transform: translateY(-50%);  /* Sits on top edge */
  /* Background and text via nested elements */
}

.c-most-popular-badgeee, .c-best-value-badgee {
  width: 100%;  /* Full width of card */
}
```

#### Price Display

```css
/* Regular price (current/sale price) */
.c-price {
  color: #1b2a43;  /* Dark navy */
  font-family: Montserrat, sans-serif;
  font-size: 18px;
  font-weight: 700;
  line-height: 24px;
  display: inline;
  position: relative;
  z-index: 10;
}

/* Discount/strikethrough price */
.c-price-ds {
  color: #00c249;  /* Green */
  font-family: Montserrat, sans-serif;
  font-size: 24px;
  font-weight: 700;
  line-height: 30px;
  position: relative;
  z-index: 10;
}

/* Old price (strikethrough) */
.old-price {
  color: #9aa0ab;  /* Gray */
  margin-right: 0;
  font-size: 16px;
  line-height: 24px;
  text-decoration: line-through;
  display: flex;
}

/* Discount savings text */
.c-discount-red-top {
  color: #EC0B43;  /* Red */
  font-size: 18px;
  font-weight: 700;
  line-height: 26px;
  margin-top: 0;
  margin-bottom: 5px;
  font-family: Montserrat, sans-serif;
}

.c-discount-red-small {
  color: #EC0B43;
  font-size: 16px;
  font-weight: 700;
  line-height: 20px;
  font-family: Montserrat, sans-serif;
}

/* Green savings text */
.c-discount-green {
  color: #4ECE7E;
}

/* Strikethrough old price in discount block */
.c-discount-old-price {
  text-decoration: line-through;
  color: black;
}

/* Bottom price text */
.c-discount-bottom {
  color: #4e596d;
  font-size: 16px;
  font-weight: 700;
  line-height: 20px;
  margin: 0;
  font-family: Montserrat, sans-serif;
}
```

#### Product Name

```css
.product-name {
  color: #1b2a43;
  width: 100%;
  max-width: none;
  margin-bottom: 0;
  padding-right: 4px;
  font-size: 14px;
  font-weight: 400;
  display: inline;
}
```

#### Free Shipping Badge

```css
/* Black Friday style */
.free-shipping-block-bf {
  grid-column-gap: 16px;
  grid-row-gap: 16px;
  background-color: #000;  /* Black background */
  border-radius: 0.375rem;
  justify-content: center;
  align-items: center;
  margin-top: 1.5rem;
  padding: 1rem 0.5rem;
  display: flex;
}

/* Standard style */
.free-shipping-block {
  background-color: #ebf7ff;  /* Light blue */
  border-radius: 0.375rem;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 1.5rem;
  padding: 1rem 0.5rem;
  display: flex;
}

/* Alternate */
.free-shipping-block-2 {
  background-color: rgba(236, 11, 67, 0.04);  /* Very light red */
  border-radius: 6px;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 24px;
  padding: 16px 16px 1rem;
  line-height: 22px;
  display: flex;
}
```

#### Discount Badge (on card)

```css
.u1-discount-badge {
  color: #fff;
  background-color: #e6007e;  /* Hot pink */
  justify-content: flex-start;
  align-items: center;
  width: auto;
  min-width: 86px;
  height: 24px;
  margin-bottom: 0.5rem;
  padding: 0.25rem 0.5rem;
  font-size: 12px;
  font-weight: 700;
  line-height: 16px;
  display: flex;
  position: relative;
}
```

#### Savings Banner (top of page)

```css
.top-savings {
  background-color: #ebf7ff;  /* Light blue */
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 6px;
  display: flex;
}
.top-savings-image {
  height: 20px;
  margin-right: 8px;
}
.top-savings-text {
  color: #25a2ed;  /* Blue */
  font-size: 12px;
  font-weight: 700;
  line-height: 16px;
}
```

---

### 4. ORDER SUMMARY (Collapsible)

```css
/* Desktop version */
.order-summary-card-desktop {
  background-color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.13);  /* #00000021 */
  border-radius: 4px;
  flex-flow: column;
  align-self: stretch;
  margin-bottom: 0.5rem;
  padding: 1rem 1rem 0;
  display: none;  /* Hidden by default, shown on desktop */
  box-shadow: 0 2px 16px -2px rgba(0, 0, 0, 0.1);
}

/* Mobile version */
.order-summary-card-mobile-2 {
  border: 1px solid rgba(0, 0, 0, 0.13);
  border-radius: 4px;
  flex-flow: column;
  align-self: stretch;
  margin-bottom: 1rem;
  padding-left: 1rem;
  padding-right: 1rem;
  display: none;
  box-shadow: 0 2px 16px -2px rgba(0, 0, 0, 0.1);
}

/* Collapsible header */
.c-collapsible-header {
  color: #1b2a43;
  cursor: pointer;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  padding-bottom: 1rem;
  display: flex;
}
```

---

### 5. EXPRESS CHECKOUT (PayPal + Google Pay)

```css
/* PayPal Express Button */
.paypal-express-button {
  width: 100%;
  display: flex;
  position: relative;
  text-align: center;
  background-color: #ffc43a;  /* PayPal yellow */
  border-radius: 4px;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding-top: 12px;
  padding-bottom: 12px;
  text-decoration: none;
}

.paypal-button-label {
  color: #253b80;  /* PayPal dark blue */
  font-size: 16px;
  font-weight: 700;
}

/* Google Pay / Apple Pay Button */
.apple-submit-button-express {
  display: flex;
  width: 100%;
  position: relative;
  text-align: center;
  background-color: #000;  /* Black */
  border-radius: 4px;
  justify-content: center;
  align-items: center;
  padding: 13px 6px;
  text-decoration: none;
}

.apple-button-label-express {
  color: #fff;
  font-size: 16px;
  font-weight: 600;
}
```

---

### 6. FORM INPUT FIELDS

```css
.form-input-field {
  width: 100%;
  height: 42px;
  font-size: 16px;
  padding: 8px 12px;
  border-radius: 4px;
  align-self: stretch;
  border: 1px solid #E6E7EA;  /* Light gray border */
  background-color: transparent;
}

.form-input-field::placeholder {
  color: #9AA0AB;  /* Medium gray */
  opacity: 1;
}
```

**HTML Structure**:
```html
<input required type="email" id="emailAddress" name="Email Address"
       class="form-input-field" placeholder="Email Address">
<input required type="text" id="firstName" name="First Name"
       class="form-input-field" placeholder="First Name" autocomplete="given-name">
<input required type="text" id="lastName" name="Last Name"
       placeholder="Last Name" class="form-input-field" autocomplete="family-name">
<input required type="tel" id="phoneNumber" autocomplete="tel"
       name="Phone Number" class="form-input-field" placeholder="Phone Number">
<input required type="text" id="address1" name="Address 1"
       class="form-input-field" placeholder="Address Line 1">
<input required id="city" name="City" type="text"
       placeholder="Your City" class="form-input-field">
<input required type="text" id="postalCode" name="Postal Code"
       placeholder="Zip/Postal Code" class="form-input-field">
```

---

### 7. PAYMENT CARD BLOCK

```css
.payment-card-block {
  background-color: #f8f8f8;  /* Light gray */
  border: 1px solid #e6e7ea;
  border-radius: 4px;
  width: 100%;
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  font-family: Montserrat, sans-serif;
}

.payment-header {
  justify-content: space-between;
  align-items: center;
  display: flex;
}
```

---

### 8. CTA BUTTON ("ORDER NOW" / "COMPLETE PURCHASE")

```css
.card-submit-button {
  width: 100%;
  color: white;
  position: relative;
  text-align: center;
  background-color: #00c249;  /* Green */
  border-radius: 0px;  /* SQUARE corners! */
  font-size: 20px;
  line-height: 20px;
  font-weight: 700;
  font-family: Montserrat, sans-serif;
  box-shadow: 0 2px 4px 2px rgba(0, 0, 0, 0.05);
  transition: background-color 200ms ease-in-out;
  margin-bottom: 1rem;
}

.card-submit-button:hover {
  background-color: #65cd57;  /* Lighter green on hover */
}

.card-submit-button:disabled {
  box-shadow: none;
}
```

**KEY**: The CTA is FULL WIDTH, SQUARE corners (border-radius: 0), GREEN (#00c249), bold 20px Montserrat.

---

### 9. PRIVACY / OPTIN TEXT

```css
.auto-optin {
  color: #818997;  /* Gray */
  padding-top: 0;
  padding-bottom: 1rem;
  font-size: 14px;
  line-height: 20px;
}
```

---

### 10. ORDER BUMP (Addon)

```css
.addon-wrapper {
  cursor: auto;
  border: 0 solid transparent;
  border-radius: 4px;
  flex-flow: column;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  margin-left: 0;
  margin-right: 0;
  padding: 16px;
  display: flex;
  position: relative;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.16);
}

/* Toggle switch for addon */
.toggle-switch {
  display: flex;
  align-items: center;
  width: 36px;
  height: 20px;
  justify-content: flex-end;
  background: #65CD57;  /* Green when on */
  border-radius: 100px;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.16) inset;
  position: relative;
  cursor: pointer;
}

.switch {
  position: absolute;
  height: 16px;
  width: 16px;
  left: 2px;
  bottom: 2px;
  background-color: #ffffff;
  border-radius: 50%;
  transition: transform 0.1s linear;
}

.toggle-switch input:checked + .switch {
  transform: translateX(16px);
}
```

---

### 11. PROMO TEXT

```css
#promo-text {
  font-family: inherit;
  font-size: 18px;
  line-height: 26px;
}
@media (max-width: 767px) {
  #promo-text {
    font-size: 16px;
    line-height: 24px;
  }
}
.highlight {
  font-weight: 700;
  color: #C95600;  /* Orange highlight */
}
```

---

### 12. DISCOUNT HEADER

```css
.c-discount-header-block {
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
}
.checkmark-image {
  margin-top: -5px;
  margin-right: 4px;
}
```

---

### 13. FOOTER

```css
.footer-links {
  background-color: #141619;  /* Near black */
  padding-top: 40px;
  padding-bottom: 40px;
}

.footer-details {
  background-color: #0e0f11;  /* Even darker */
  padding-top: 1rem;
  padding-bottom: 1rem;
}
```

---

### 14. FOMO ANIMATION

```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}
.fomo-fade-in {
  animation: fadeIn 1s forwards;
}
.fomo-fade-out {
  animation: fadeOut 1s forwards;
}
```

---

## PLATFORM 2: CHECKOUTCHAMP CHECKOUT

### Pages: airmoto, airmoto_v2, rejuvacare, allfemme, vibriance, drivse, mydrivse, clarifion, vitaskin

### COMPLETE PAGE STRUCTURE (top to bottom)

```
1. HEADER LOGO
2. PRODUCT TILES (pricing tiers as radio-button cards)
3. COUNTDOWN TIMER ("Cart Saved For 10:00")
4. ORDER SUMMARY (mobile collapsible)
5. SHIPPING FORM (email, name, address, phone)
6. PAYMENT FORM (credit card or express checkout)
7. ORDER BUMP (checkbox + product)
8. CTA BUTTON ("COMPLETE YOUR PURCHASE")
9. TRUST BADGES (guarantee, secure checkout icons)
10. GUARANTEE BOX
```

---

### SECTION-BY-SECTION EXACT CSS

---

### 1. PRODUCT TILES (Bundle Selector)

```css
.fk-product-section {
  border: 1px solid #858585;  /* Gray border when unselected */
  border-radius: 3px;
  background-image: none;
  padding: 1px;
}

/* SELECTED state */
.fk-product-section.active {
  background-color: #fffefa !important;  /* Warm white */
  border-width: 2px !important;
  /* Gold gradient border effect (vibriance) */
  border: double 1px transparent;
  border-radius: 0px;
  background-image: linear-gradient(white, white),
                    linear-gradient(#bd8f2f, #f9f1b2, #bd8f2f);
  background-origin: border-box;
  background-clip: content-box, border-box;
}

/* Another variant (rejuvacare) */
.fk-section-border {
  border: 1px solid #d43663;  /* Pink border */
  margin-bottom: 16px;
}

/* Tile header with radio button */
.tile-header {
  padding: 12px 16px;
  text-align: left;
}
.tile-header input {
  width: 20px;
  height: 20px;
}
```

---

### 2. COUNTDOWN TIMER

```css
.countdown {
  text-align: center;
  font-family: Helvetica, serif;
}

.countdown-block {
  display: inline-block;
  margin: 0 10px;
  padding: 10px;
}

.countdown-digit {
  font-size: 1rem;
}

.countdown-endtext {
  font-size: 14px !important;
  color: rgba(0, 0, 0, 1) !important;
  text-align: center !important;
  margin: 0 auto !important;
}

.countdown-cont {
  display: inline-block;
}

.fk-countdown > span {
  width: 100% !important;
}
```

---

### 3. ORDER BUMP

```css
.bump-div-class {
  border-style: dashed;
  border-color: rgb(33, 37, 41);  /* Dark gray dashed border */
  background-color: rgb(252, 248, 227);  /* Light yellow/cream */
}

.order-bump-checkbox {
  /* Standard checkbox */
}

.fk-product-checkbox-button-parent {
  display: flex;
  align-items: center;
}
```

**HTML Structure**:
```html
<input type="checkbox" name="product" value="7053" variantvalue=""
       checked="" class="fk-product fk-product-checkbox form-check-input order-bump-checkbox">
```

---

### 4. FORM INPUT FIELDS (CheckoutChamp)

```css
/* Standard variant */
.form-control-custom {
  display: block;
  width: 100%;
  font-size: 1rem;
  line-height: 1.5;
  background-color: rgba(255, 255, 255, 1);
  background-clip: padding-box;
  border: 1px solid rgba(197, 199, 210, 1);  /* #c5c7d2 */
  border-radius: 0.25rem;  /* 4px */
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  padding: 12px 18px;
}

/* Vibriance variant */
.form-control-custom {
  display: block;
  width: 100%;
  padding-top: 12px;
  padding-bottom: 12px;
  padding-left: 18px;
  padding-right: 18px;
  font-size: 1rem;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

/* Rejuvacare variant */
.form-control-custom {
  color: red;  /* Note: color:red is likely a bug/override */
  border: 1px solid #c5c7d2;
  border-radius: 0.25rem;
}
```

**Input HTML Structure**:
```html
<input type="text" name="emailAddress" placeholder="Email Address"
       required class="form-control-custom">
<input type="text" name="shipFirstName" placeholder="First Name"
       required class="form-control-custom">
<input type="text" name="shipLastName" placeholder="Last Name"
       required class="form-control-custom">
<input type="text" name="shipAddress1" placeholder="Street Address"
       required class="form-control-custom">
<input type="text" name="shipCity" placeholder="City"
       required class="form-control-custom">
```

---

### 5. LAYOUT SYSTEM (CheckoutChamp)

```css
.fk-row {
  display: flex;
  justify-content: flex-start;
  align-items: stretch;
  flex-wrap: nowrap;
  padding: 10px;
  height: auto;
  max-width: 100%;
}

.fk-col {
  min-height: 25px;
  padding: 10px;
  flex-grow: 1;
  width: min-content;
}

.form-group {
  margin-bottom: 1rem;
}

.form-row {
  display: flex;
  flex-wrap: wrap;
  margin-right: -5px;
  margin-left: -5px;
}
```

---

### 6. PAYMENT SECTION (CheckoutChamp)

```css
.fk-payment-header {
  text-align: left;
}
.fk-payment-header-main {
  margin: 5px 10px;
  font-size: 20px;
  font-weight: 500;
}
.fk-payment-header-sub {
  margin: 5px 10px;
  color: rgba(155, 155, 155, 1);
}
.fk-payment-option-wrapper {
  padding: 5px;
}
.fk-payment-option-container {
  position: relative;
  padding: 0 5px;
}
.fk-payment-option-container:first-child .fk-payment-option-header-wrapper {
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}
.fk-payment-option-container:last-child .fk-payment-option-header-wrapper {
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
}
```

---

### 7. PAYPAL BUTTON (CheckoutChamp)

```css
.btnPayPal2 {
  background-image: url('paypal-checkout-3.png');
  background-position: center center;
  background-repeat: no-repeat;
  color: transparent;
  background-color: rgba(255, 209, 26, 1);  /* #ffd11a PayPal yellow */
  border: 1px solid transparent;
}

.btnPayPal2:hover {
  background-color: rgba(230, 184, 0, 1);  /* Darker yellow */
}

.btn-paypal2-styles {
  padding: 6px 12px;
  background-size: contain;
}
```

---

### 8. EXPRESS CHECKOUT OR LINE (CheckoutChamp)

```css
.ch-express-checkout-group-or-line span {
  display: inline-block;
  padding: 0 1em;
}

.ch-express-checkout-pay-title {
  color: #363636;
  line-height: 1.3;
  font-size: 1em;
  font-weight: 500;
  margin: 0;
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: flex-end;
  text-align: center;
}

/* Pseudo-elements for the lines */
.ch-express-checkout-pay-title::after {
  content: '';
  border-top: 1px #29af5c solid;  /* Green line */
  height: 0.58em;
  flex: 1 0 2em;
  margin-left: 1em;
}
.ch-express-checkout-pay-title::before {
  content: '';
  border-top: 1px #29af5c solid;
  height: 0.58em;
  flex: 1 0 2em;
  margin-right: 1em;
}
```

---

### 9. CART / ORDER SUMMARY (CheckoutChamp)

```css
.cc-cart-row {
  border: 1px solid lightgray;
  padding: 5px;
  border-radius: 5px;
  font-size: 16px;
  word-break: break-word;
  background-color: white;
  margin: 5px 0;
}

.cc-cart-row-prod-title {
  font-weight: bold;
  margin: 5px;
}
```

---

### 10. SELLOUT / SCARCITY BADGE (Vibriance)

```css
.sellout-badge {
  display: inline-block;
  padding: 2.5px 24px;
  border-radius: 16px;       /* Pill shape */
  background: #e84545;       /* Red */
  color: #fff;
  font-size: 17px;
  font-weight: 700;
  font-family: 'Montserrat', Arial, sans-serif;
  line-height: 1.7;
  vertical-align: middle;
}

.sellout-label {
  color: #484f24;
  font-weight: 700;
  font-size: 14px;
  margin-right: 6px;
  font-family: 'Montserrat', Arial, sans-serif;
}
```

---

### 11. WARRANTY / GUARANTEE (Clarifion)

```css
.warranty-wrapper > div > div.checked {
  background-color: #172969;  /* Dark blue checked state */
}
```

---

### 12. CTA BUTTON (CheckoutChamp - airmoto)

```css
/* Via inline class */
.checkout-btn {
  /* Text: "COMPLETE YOUR PURCHASE" */
  /* Styled via inline styles or CheckoutChamp defaults */
}
```

---

## CROSS-PAGE PATTERNS TABLE

### Color Palette

| Element | Webflow Pages | CheckoutChamp Pages |
|---------|--------------|---------------------|
| **CTA Button** | #00c249 (green), square corners | Varies (green common) |
| **CTA Hover** | #65cd57 (lighter green) | N/A |
| **PayPal Yellow** | #ffc43a | #ffd11a |
| **PayPal Dark Blue** | #253b80 | N/A |
| **Google Pay BG** | #000 (black) | N/A |
| **Most Popular Badge** | #ec0b43 (red) | N/A |
| **Discount Red** | #EC0B43 | N/A |
| **Price Green** | #00c249 | N/A |
| **Old Price Gray** | #9aa0ab | N/A |
| **Timer Banner BG** | #0c230e (dark green) | N/A |
| **Timer Accent** | #baf363 (lime) | N/A |
| **Savings Blue** | #25a2ed | N/A |
| **Input Border** | #E6E7EA | #c5c7d2 / #ced4da |
| **Input Placeholder** | #9AA0AB | Bootstrap default |
| **Card Shadow** | 0 0 8px rgba(0,0,0,.16) | 1px solid gray |
| **Order Bump BG** | N/A | #fcf8e3 (cream) |
| **Order Bump Border** | N/A | dashed, #212529 |
| **Free Ship BG** | #000 or #ebf7ff or rgba(236,11,67,.04) | N/A |
| **Footer BG** | #141619 | N/A |

### Typography

| Element | Font | Size | Weight | Line-height |
|---------|------|------|--------|-------------|
| **CTA Button** | Montserrat | 20px | 700 | 20px |
| **Price (sale)** | Montserrat | 18-24px | 700 | 24-30px |
| **Old price** | Montserrat | 16px | 400 | 24px |
| **Product name** | System | 14px | 400 | auto |
| **Timer text** | Montserrat | 18px | 400-700 | 26px |
| **Discount red** | Montserrat | 16-18px | 700 | 20-26px |
| **Input fields** | System/Montserrat | 16px | 400 | 42px height |
| **Privacy text** | System | 14px | 400 | 20px |
| **PayPal label** | System | 16px | 700 | 20px |
| **Sellout badge** | Montserrat | 17px | 700 | 1.7 |

### Spacing & Layout

| Element | Value |
|---------|-------|
| **Card gap** | 8px (grid-column-gap) |
| **Card padding** | 8-16px top, 0 sides |
| **Card border-radius** | 4px |
| **Card border unselected** | 2px solid transparent |
| **Card shadow** | 0 0 8px rgba(0,0,0,.16) |
| **Section padding** | 1rem horizontal |
| **Max-width container** | 1140px - 1172px |
| **Input height** | 42px (Webflow), auto (CheckoutChamp) |
| **Input padding** | 8px 12px (Webflow), 12px 18px (CheckoutChamp) |
| **Input border-radius** | 4px (Webflow), 4px (CheckoutChamp) |
| **CTA padding** | Implicit from font-size |
| **Timer banner padding** | 8px 16px |
| **Free shipping padding** | 1rem 0.5rem |

### Mobile Responsive Patterns

| Element | Mobile Behavior |
|---------|----------------|
| **Bundle grid** | 2 columns (grid-template-columns: 1fr 1fr) |
| **Card max-width** | 100% on mobile (overrides 174px desktop) |
| **Input fields** | Full width always |
| **CTA button** | Full width always |
| **Timer banner** | Full width, text wraps |
| **Order summary** | Collapsible on mobile |
| **Hero banner** | Full width, background-size: cover |
| **Form promo text** | 16px on mobile (vs 18px desktop) |

---

## UNIVERSAL PATTERNS (Both Platforms)

1. **Green CTA button** is universal - #00c249 or similar bright green
2. **Full-width CTA** - always spans container width
3. **Montserat font** for pricing and CTAs
4. **PayPal yellow (#ffc43a/#ffd11a)** for PayPal buttons
5. **Black Google Pay/Apple Pay** buttons
6. **Countdown timer** present on most pages
7. **Order bump** uses cream/yellow background with dashed border
8. **Trust badges** below CTA (SSL, payment icons, guarantee)
9. **Free shipping** callout near pricing
10. **"Most Popular"** badge on the best-value tier
11. **Strikethrough pricing** for old price (text-decoration: line-through)
12. **Per-unit pricing** displayed on bundle cards
13. **3-step checkout**: Contact > Shipping > Payment
14. **Express checkout** above credit card form
15. **Privacy/optin** text below CTA

---

## RAW DATA FILES

- `design-data/checkout-raw-extract.json` - Full CSS + HTML snippets per page
- `design-data/checkout-html-snippets.json` - Section-specific HTML with context
