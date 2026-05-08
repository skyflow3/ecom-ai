# Product/Sale Pages Analysis

## Summary
- Total pages analyzed: 15 (8 product pages, 3 sale page variants, 1 landing page, 3 localized variants, 1 checkout page)
- Builders detected: Funnel Builder Pro/Tailwind (5), FunnelKit/Bootstrap (3), Webflow/int- (5), Shopify+GemPages (2), Shopify+Custom (1)
- Common structure: Announcement Bar > Hero + Product Image > Benefits/Features > Social Proof > How It Works > Testimonials > Guarantee > FAQ > Footer
- Common section count: 10-19 sections per page

### Page Builder Overview

| Page | Brand | Builder | CSS Framework |
|---|---|---|---|
| Airmoto | Airmoto | Funnel Builder Pro | Tailwind CSS |
| Oricle | Oricle Hearing | Funnel Builder Pro | Tailwind CSS |
| Sale-Oricle | Oricle Hearing | Funnel Builder Pro | Tailwind CSS |
| Rejuvacare | RejuvaCare/Ozempatch | FunnelKit | Bootstrap 4 + Animate.css |
| Drivse | Drivse/IonDrops | FunnelKit | Bootstrap 4 + Animate.css |
| SmoothSpire | SmoothSpine | FunnelKit | Bootstrap 4 + Swiper |
| 7m-Tryemsense EN | EMSense | Webflow-style | Custom `int-` classes |
| Sale-Tryemsense EN | EMSense | Webflow-style | Custom `int-` classes |
| Sale-Tryemsense DE | EMSense | Webflow-style | Custom `int-` classes |
| Sale-Tryemsense NL | EMSense | Webflow-style | Custom `int-` classes |
| Tryledisa EN | HaloGrow | Webflow-style | Custom `int-` classes + Sentient font |
| Tryledisa HaloGrow | HaloGrow | Webflow-style | Custom `int-` classes + Sentient font |
| Checkout-Tryledisa | HaloGrow | Webflow-style | Custom `int-` classes |
| Getheyfra Product | Getheyfra | Shopify + GemPages | Dawn theme + GemPages |
| Getheyfra Landing | Getheyfra | Shopify + GemPages | Dawn theme + GemPages |
| PrimalQueen | Primal Queen | Shopify + Custom | Dawn theme + Tailwind + custom blocks |

### Common Colors Across Pages

| Color Type | Hex Code | Usage |
|---|---|---|
| Primary CTA Green | `#24aa2f` / `#28a745` / `#1a7a28` | Add to Cart buttons, verified badges |
| Dark Navy/Blue | `#00264c` / `#0c230e` / `#065252` | Announcement bars, dark sections |
| White | `#fff` / `#ffffff` | Most section backgrounds |
| Light Gray | `#f5f5f5` / `#e9ecef` / `#F4F9FF` | Alternating sections |
| Cream/Beige | `#edede4` / `#f9f2e8` / `#fef3f7` | Warm sections |
| Brand Teal | `#387272` | Drivse brand color |
| Accent Lime | `#baf363` | HaloGrow accent |
| Getheyfra Gold | `#c3843f` / `#f4c323` | Premium feel |
| Getheyfra Green | `#43744e` / `#699763` | Nature/health |
| PrimalQueen Pink | `#E94480` / `#FCBFC7` / `#2f0147` | Feminine brand |
| Oricle Blue | `#1b96d3` / `#F1F6FA` | Medical/trust |
| SmoothSpire Blue | `#CDDFF7` / `#EFF5FF` / `#F4F9FF` | Medical/clean |
| Text Dark | `#303030` / `#02122e` / `#0c230e` / `#2a2a2a` | Body text |
| Text Light | `#fff` / `#ffffff` | On dark backgrounds |
| Error/Sale Red | `#e33c4c` / `#c1292e` | Sale badges, urgency |

### Common Fonts

| Builder | Primary Font | Heading Font | Sizes |
|---|---|---|---|
| Funnel Builder (int) | System/sans-serif | Sentient, Arial | 14-40px body, 32-52px headings |
| GemPages (Getheyfra) | Inherit/system | Custom serif/sans | 18-24px body, 28-35px headings |
| GemPages (SmoothSpire) | Arial, sans-serif | Arial | 17px body, 24-25px headings |
| Tailwind (Airmoto) | System | System | 14-18px body, 24-40px headings |
| Tailwind (Oricle) | System | System | 16-18px body, 20-30px headings |
| PageFly (PrimalQueen) | Custom | Custom | 14-20px body, 17-22px headings |

---

## Page-by-Page Analysis

---

### PRIMALQUEEN
**Brand**: Primal Queen
**URL**: https://primalqueen.com/pages/tiktok
**Page Type**: Product page (Shopify + Custom Theme + Tailwind blocks)
**Builder**: Shopify Dawn + Custom Sections + Tailwind CSS blocks

**Page Structure (top to bottom):**
1. [COUNTDOWN_HEADER] - Countdown timer with hearts decoration
2. [HEADER] - Navigation header
3. [MAIN_PRODUCT] - Product hero with headline + buy box
4. [FOUNDER_1] - Primal Queen founder story section 1
5. [FOUNDER_2] - Primal Queen founder story section 2
6. [NUTRIENT_RICH] - Nutrient-rich benefits section
7. [VIDEO] - Product explainer video
8. [TIMELINE] - Consistent use timeline
9. [REVIEWS_SHOWCASE] - Customer review cards
10. [OUR_BELIEF] - Brand belief section
11. [HOW_TO_USE] - Usage instructions
12. [PRODUCT_COMPARISON] - Product vs competitors grid
13. [SOLD_OUT_ALERT] - Urgency alert
14. [FUN_EASY] - Fun easy consuming section
15. [WHO_IS_FOR] - Target audience section
16. [CONTRAINDICATION] - Safety info
17. [OUR_ANCESTORS] - Heritage section
18. [IMAGE] - Lifestyle image
19. [UVPS] - Unique value propositions
20. [BUY_BOXES] - 3-tier bundle selector with prices
21. [TRUST_BADGES] - Trust/payment badges
22. [FAQ] - FAQ accordion
23. [STICKY_FOOTER] - Sticky mobile CTA
24. [FOOTER] - Standard footer

**Exact CSS Custom Properties:**
```css
:root {
  /* Colors (RGB format) */
  --color-background: 253,251,247;           /* #FDFBF7 cream */
  --gradient-background: linear-gradient(180deg, rgba(240,244,236,1), rgba(241,235,226,1) 100%);
  --color-foreground: 46,42,57;              /* #2E2A39 dark purple-gray */
  --color-shadow: 46,42,57;
  --color-button: 155,4,111;                 /* #9B046F hot pink */
  --color-button-text: 253,251,247;           /* cream */
  --color-secondary-button: 253,251,247;
  --color-secondary-button-text: 46,42,57;
  --color-link: 46,42,57;
  --color-badge-foreground: 46,42,57;
  --color-badge-background: 253,251,247;
  --color-badge-border: 46,42,57;
  --payment-terms-background-color: rgb(253 251 247);

  /* Typography */
  --font-body-family: Inter, sans-serif;
  --font-heading-family: Inter, sans-serif;
  --font-body-style: normal;
  --font-body-weight: 400;
  --font-body-weight-bold: 700;
  --font-heading-weight: 400;
  --font-body-scale: 1.0;
  --font-heading-scale: 1.3;

  /* Media */
  --media-radius: 12px;
  --media-border-width: 0px;
  --media-shadow-opacity: 0.1;
  --media-shadow-horizontal-offset: 10px;
  --media-shadow-vertical-offset: 12px;
  --media-shadow-blur-radius: 20px;
  --media-shadow-visible: 1;

  /* Layout */
  --page-width: 120rem;
  --page-width-margin: 0rem;
  --spacing-sections-desktop: 36px;
  --spacing-sections-mobile: 25px;
  --grid-desktop-vertical-spacing: 40px;
  --grid-desktop-horizontal-spacing: 40px;
  --grid-mobile-vertical-spacing: 20px;
  --grid-mobile-horizontal-spacing: 20px;

  /* Buttons */
  --buttons-radius: 10px;
  --buttons-radius-outset: 11px;
  --buttons-border-width: 1px;
  --buttons-border-opacity: 0.55;
  --buttons-shadow-opacity: 0.0;
  --buttons-shadow-vertical-offset: 4px;
  --buttons-shadow-blur-radius: 5px;
  --buttons-border-offset: 0.3px;

  /* Inputs */
  --inputs-radius: 10px;
  --inputs-border-width: 1px;
  --inputs-border-opacity: 0.55;
  --inputs-radius-outset: 11px;

  /* Variant Pills */
  --variant-pills-radius: 10px;
  --variant-pills-border-width: 0px;
  --variant-pills-border-opacity: 0.1;

  /* Cards */
  --product-card-corner-radius: 1.2rem;
  --product-card-shadow-opacity: 0.05;
  --product-card-shadow-visible: 1;
  --product-card-shadow-horizontal-offset: 1.0rem;
  --product-card-shadow-vertical-offset: 1.0rem;
  --product-card-shadow-blur-radius: 3.5rem;
  --collection-card-corner-radius: 1.2rem;
  --badge-corner-radius: 2.0rem;

  /* Text Boxes */
  --text-boxes-radius: 24px;
  --text-boxes-border-width: 0px;

  /* Popup */
  --popup-corner-radius: 22px;
  --popup-border-width: 1px;
  --popup-shadow-opacity: 0.1;
  --popup-shadow-horizontal-offset: 10px;
  --popup-shadow-vertical-offset: 12px;
  --popup-shadow-blur-radius: 20px;
}
```

**Custom Tailwind Block Variables:**
```css
/* Countdown header & buy box custom properties */
--db-bg-color: #FFF1F6;
--db-heading-color: #2f0147;
--db-highlight-color: #fa679c;
--db-cta-border: #40a754;
--db-review-border: #2f0147;
--button-height: 70px;
--button-height-mobile: 70px;
--title-color: #2f0147;
--title-font-size-desktop: 52px;
--title-font-size-tablet: 34px;
--title-font-size-mobile: 27px;
--content-font-size-desktop: 22px;
--content-font-size-mobile: 17px;
--border-color: #ff699f;
--text-color: #ffffff;
--bold-color: #eff759;
--list-color: #ffffff;
--cut-price-color: #ffffff;
```

**Tailwind Color Usage (by frequency):**
- `#2F0147` (x115) - Primary purple, headings, borders
- `#FF699F` (x59) - Pink accent, borders, highlights
- `#32CD32` (x22) - Green checkmarks
- `#00AD21` (x14) - CTA button green
- `#63357B` (x14) - Purple variant
- `#FB689C` (x13) - Pink variant
- `#AE95B3` (x4) - Muted purple
- `#E94480` (x4) - Hot pink
- `#EFF759` (x3) - Yellow-green highlight

**Countdown Header CSS:**
```css
.countdown-header { /* announcement/promo bar */ }
.countdown-header__wrapper { /* flex container */ }
.countdown-header__title { font-weight: 700; }
.countdown-header__timer { /* flex row of timer items */ }
.countdown-header__timer-item { /* individual digit */ }
.countdown-header__timer-number { font-weight: 700; font-size: large; }
```

**Buy Box CSS:**
```css
.buy-box__add-to-cart { margin-top: 20px; }
.buy-box__add-to-cart-form { width: 100%; padding: 5px 10px; display: flex; }
.buy-box__add-to-cart-button-wrapper { height: 100%; width: 100%; }
.buy-box__list-item-price-wrapper { display: flex; gap: 7px; justify-content: flex-end; flex-wrap: nowrap; }
.buy-box__list-item-price { font-weight: 700; font-size: 14px; line-height: 1.3; }
.buy-box__list-item-compare-price { font-weight: 700; font-size: 14px; line-height: 1.3; text-decoration: line-through; }
.buy-box__quantity-selector { border: 1px solid #fff; height: 44px; width: 160px; display: flex; align-items: center; justify-content: space-around; }
.buy-box__quantity { max-width: 48px; text-align: center; font-size: 16px; font-weight: 700; }
```

**FAQ Accordion CSS:**
```css
.faq__section { padding-top: 40px; }
.faq__container { display: flex; flex-direction: column; align-items: center; padding-bottom: 30px; gap: 1.25rem; }
.faq__container-inner { max-width: 830px; width: 100%; text-align: left; margin-top: 10px; }
.faq__question__block {
  width: 100%;
  background: #fff;
  border: 3px solid #2f0147;
  padding: 10px 25px;
  border-radius: 8px;
  margin-bottom: 25px;
  transition: all 0.3s;
}
.faq__button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  text-align: left;
  color: #2f0147;
  font-size: 17px;   /* mobile */
  font-size: 22px;   /* sm+ */
  padding: 10px 0;   /* mobile */
  padding: 20px 0;   /* sm+ */
  font-weight: 800;
  cursor: pointer;
  border-radius: 10px;
}
.faq__answer {
  max-height: 0;
  overflow: hidden;
  transition: all 0.3s;
  width: 100%;
  background: #fff;
}
```

**CTA Button CSS:**
```css
.cta-button__block-btn {
  background: #00ad21;
  padding: 2.5px 20px;
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  text-transform: uppercase;
  text-decoration: none;
  color: #fff;
}
.cta-button__block-btn-wrapper {
  max-width: 465px;
  position: relative;
  width: 100%;
  height: 70px;       /* var(--button-height) */
  padding: 5px 10px;
}
```

**Colors:**
- Background cream: `rgb(253, 251, 247)` = `#FDFBF7`
- Background gradient: `linear-gradient(180deg, rgba(240,244,236,1), rgba(241,235,226,1) 100%)`
- Brand purple: `#2F0147` (headings, borders, dark sections)
- Brand pink: `#E94480` / `#FF699F` (accents, borders)
- Hot pink: `#9B046F` (buttons)
- Light pink bg: `#FFF1F6`, `#FEF3F7`, `#FFF3F7`
- Yellow-green highlight: `#EFF759`
- CTA green: `#00AD21` / `#32CD32`
- Text: `#2E2A39` (body), `#FFFFFF` (on dark)
- Accent gradient: `linear-gradient(90deg, #FCBFC7 0%, #E94480 12.98%, #E94480 90.7%, #FCBFC7 100%)`

---

### DRIVSE (IonDrops)
**Brand**: Drivse / IonDrops
**URL**: https://try.mydrivse.com/
**Page Type**: Product/sale page (FunnelKit)
**Builder**: FunnelKit (Bootstrap 4 + Animate.css)

**Page Structure (top to bottom):**
1. [ANNOUNCEMENT_BAR] - "50% OFF + FREE SHIPPING" - dark bg
2. [TRUST_HEADER] - "Over 2M+ Happy Customers!" + product name + doctor endorsement
3. [BENEFITS] - 4 key benefits with icons (hydrated skin, hair growth, water pressure, save water)
4. [VIDEO_HERO] - Product video + long-form copy (82K chars)
5. [PROBLEM_AGITATION] - "Breakthrough Discovery" section
6. [PROBLEM_AGITATION] - "No More Dark spots, Dry or Itchy Skin"
7. [PROBLEM_AGITATION] - "Effective Against ALL Types of Hair Problems"
8. [VIDEO_SECTION] - "Ditch that Outdated Low-Pressure Shower"
9. [PROBLEM] - "Why are you showering in Dirty Water?"
10. [FEATURES] - "Medically Designed & Made to Fit All Showers!"
11. [COMPARISON_TABLE] - IonDrops vs Other showers (6-row grid)
12. [REVIEWS_SUMMARY] - "Based on 3,591 reviews" star summary
13. [TESTIMONIALS] - Individual customer testimonials
14. [GUARANTEE_CTA] - "Don't Let Contaminated Water Hold You Back" + 50% OFF
15. [GUARANTEE] - "90-Day Results or Full Refund Guarantee"
16. [URGENCY_CTA] - "Over 134,000 Customers Use IonDrops Daily" + countdown
17. [FAQ] - Accordion FAQ (5+ questions)
18. [FOOTER] - Legal links + copyright

**Exact CSS Custom Properties:**
```css
:root {
  --main-color: rgba(22, 163, 74, 1);  /* #16A34A - primary green */
  --font-family-sans-serif: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif;
  --font-family-monospace: SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;
}
```

**CSS Hex Colors (by frequency):**
- `#FFF` (x114) - White
- `#303030` (x101) - Primary text (dark gray)
- `#111111` (x39) - Dark text
- `#6C757D` (x37) - Secondary text (gray-600)
- `#007BFF` (x34) - Bootstrap blue (buttons)
- `#212529` (x32) - Dark background
- `#387272` (x31) - Brand teal
- `#000000` (x29) - Black
- `#28A745` (x26) - Bootstrap green (success)
- `#DC3545` (x26) - Bootstrap red (danger/sale)
- `#FFFFFF` (x24) - White
- `#343A40` (x17) - Dark gray
- `#F8F9FA` (x17) - Light gray bg
- `#17A2B8` (x15) - Bootstrap cyan (info)
- `#FFC107` (x15) - Bootstrap yellow (warning)
- `#E9ECEF` (x13) - Light gray border
- `#EDF4F3` (x9) - Light teal bg

**Section CSS:**
- Bootstrap 4 base (`.btn`, `.btn-primary`, `.container`)
- Primary brand teal: `#387272`
- Light teal bg: `#EDF4F3`
- Text: `#303030` (dominant), `#111111`
- Buttons: Bootstrap `.btn-primary` (`#007BFF` bg, `#FFF` text)
- Font sizes: `16px` (base), `24px` (h2), `18px` (h3), `22px` (prominent)
- Border-radius: `.25rem` (4px default), `1rem` (16px rounded)
- Box-shadow: `0 4px 7px 1px rgba(0,0,0,0.19)` on cards
- Keyframes: 78 animations (slideIn, fadeIn, pulse, bounce, shake, etc.)

**Sticky CTA Pattern:**
```css
.fk-row.sticky {
  position: sticky;
  /* FunnelKit sticky row with CTA */
}
.fk-col.col.max-width.cta-3 {
  /* CTA column layout */
}
```

**FAQ/Accordion Pattern (FunnelKit):**
```css
.fk-collapsible-list-collection { /* FAQ container */ }
.fk-collapsible-list-wrapper { /* wrapper */ }
.fk-collapsible-list { /* list */ }
.fk-collapsible-list-details { /* individual item */ }
.fk-collapsible-list-label-text { /* question text */ }
.fk-collapsible-list-label-icon { /* toggle icon */ }
.fk-collapsible-list-content { /* answer content */ }
.fk-collapsible-list-content-text { /* answer text */ }
```

---

### REJUVACARE
**Brand**: RejuvaCare / Ozempatch
**URL**: https://www.healthadvicetoday.com/discover-ozempatch-kay-sp
**Page Type**: Product/sale page
**Builder**: FunnelKit (Bootstrap 4 + Animate.css)

**Page Structure:** Same FunnelKit builder pattern as Drivse:
1. [ANNOUNCEMENT_BAR] - Promo offer
2. [HERO] - Product + doctor endorsement
3. [VIDEO] - Long-form video section
4. [BENEFITS] - Key benefits
5. [TESTIMONIALS] - Customer reviews
6. [PRICING] - Bundle/price selector
7. [GUARANTEE] - Money-back guarantee
8. [FAQ] - Accordion FAQ
9. [FOOTER]

**CSS Hex Colors (by frequency):**
- `#FFF` (x218) - White (very dominant)
- `#6C757D` (x74) - Gray-600
- `#007BFF` (x64) - Bootstrap blue (primary)
- `#212529` (x60) - Dark text
- `#28A745` (x47) - Bootstrap green (success)
- `#DC3545` (x47) - Bootstrap red (danger)
- `#F8F9FA` (x34) - Light bg
- `#343A40` (x32) - Dark bg
- `#17A2B8` (x30) - Bootstrap cyan
- `#FFC107` (x30) - Bootstrap yellow
- `#E9ECEF` (x26) - Light gray border
- `#495057` (x24) - Gray-700
- `#13B691` (x13) - Unique teal accent
- `#434339` (x13) - Warm dark text (unique to Rejuvacare)

**Section CSS:**
- Same Bootstrap 4 base as Drivse
- Primary: `#007BFF` (Bootstrap blue)
- Success green: `#28A745`
- Text: `#434339` (unique warm dark), `#212529`
- Unique teal accent: `#13B691`
- Font sizes: `20px` (base), `40px` (h1), `30-32px` (h2), `24-28px` (h3)
- Box-shadow on cards: `0 4px 7px 1px rgba(0,0,0,0.19) !important`
- 78 keyframe animations (same FunnelKit/Animate.css library)

**Sticky CTA Pattern:**
```css
.fk-row.sticky {
  position: sticky;
  /* FunnelKit sticky CTA row */
}
.fk-col.col.max-width.cta-3 {
  /* CTA column */
}
```

**FAQ/Accordion:** Same FunnelKit collapsible pattern as Drivse (`fk-collapsible-list-*` classes).

---

### SMOOTHSPIRE
**Brand**: SmoothSpine
**URL**: https://try.smoothspine.com/tfbm-coc-sp2
**Page Type**: Product page (FunnelKit)
**Builder**: FunnelKit (Bootstrap 4 + Swiper + Font Awesome 6)

**Page Structure (top to bottom):**
1. [HERO_IMAGE_GALLERY] - Product image carousel (1/15 images)
2. [HERO_PRODUCT] - Headline + product info + CTA (right side layout)
3. [HERO_TESTIMONIAL] - Customer story quote
4. [PRICING_BUNDLE] - "90-DAY MONEY BACK GUARANTEE" + bundle options
5. [VIDEO_LONG_FORM] - "Your Spine Is LITERALLY Suffocating" video section
6. [VIDEO_EXPLAINER] - "Why It Works When Everything Else Failed"
7. [HOW_IT_WORKS] - "How The SmoothSpine Triple Fusion Massager Works" (3 steps)
8. [GUARANTEE] - "Try It For 90 Days, 100% Risk-Free"
9. [COMPARISON] - "The SmoothSpine Massager Is The Safer, Healthier Choice" (comparison grid)
10. [RESULTS] - "Real Users, Real Life-Changing Results" (3 testimonial cards)
11. [HOW_TO_USE] - "STEP 1, 2, 3" instructions with images
12. [PRICING_CTA] - "Mother's Day Mega Sale On Now" + bundle selector
13. [REVIEWS_HEADER] - "What Our Customers Have To Say"
14. [TRUSTPILOT_REVIEWS] - Trustpilot widget with reviews
15. [REVIEW_MODAL] - Individual review modal
16. [GUARANTEE_FINAL] - "100% SATISFACTION 90-DAY MONEY BACK GUARANTEE"
17. [AS_SEEN_ON] - "We're Getting Noticed!" media logos
18. [FAQ] - Frequently Asked Questions accordion

**Exact Section CSS:**
```css
.hero-area {
  background-color: #ffffff;
  padding: 30px 0 0 0;
}
.hero-main {
  display: grid;
  grid-template-columns: 47% auto;
  column-gap: 50px;
  margin: auto;
  margin-top: 50px;
}
.hero-btm-main {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 10px;
}
.hero-btm-container {
  max-width: 1230px;
}
.option-area {
  background: #F4F9FF;
  padding: 20px 0;
  margin-top: 20px;
}
.option-main {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 30px;
  align-items: center;
}
.option-item-flex {
  display: grid;
  grid-template-columns: 115px auto;
  align-items: center;
  column-gap: 10px;
}
.video-area {
  background: #F4F9FF;
  padding: 60px 0;
}
.video-main {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 20px;
  align-items: center;
}
.video-area2 {
  background: #ffffff;
}
.video-left h3 {
  font-weight: 700;
  font-size: 25px;
  color: #000000;
  margin-bottom: 38px;
}
.video-left p {
  font-weight: 400;
  font-size: 17px;
  color: #000000;
  margin-top: 20px;
}
.choice-area {
  background-color: rgba(239, 245, 255, 1);
  padding: 60px 0;
}
.choice-main {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin-top: 70px;
  column-gap: 30px;
}
.choice-item1 {
  border-right: 1px solid #CFD6E3;
}
.result-area {
  background: #ffffff;
  padding: 60px 0;
}
.result-main {
  max-width: 1110px;
  margin: auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 15px;
  margin-top: 45px;
}
.result-item1 {
  padding: 12px 10px;
  background-color: rgba(255, 255, 255, 1) !important;
  box-shadow: 2px 2px 8px 2px rgba(0, 0, 0, 0.12) !important;
  border-radius: 15px;
}
.steps-area {
  background: #CDDFF7;
  padding: 30px 0;
}
.steps-main {
  max-width: 1125px;
  margin: auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 45px;
}
.winter-area {
  background: #ffffff;
  padding: 30px 0;
}
.winter-main {
  border: 2px solid rgba(205, 223, 247, 1);
  background: rgba(240, 245, 255, 1);
  padding: 40px 20px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 30px;
  align-items: center;
}
.guarantee-area {
  background: #ffffff;
  padding: 60px 0;
}
.guarantee-main {
  display: grid;
  grid-template-columns: 250px auto;
  column-gap: 30px;
  align-items: center;
  margin-top: 40px;
}
.noticed-area {
  background: #EFF5FF;
  padding: 40px 0;
}
.questions-area {
  background: #ffffff;
  padding: 60px 0;
}
```

**Typography:**
- Body: `Arial, sans-serif`, `16px`, `color: #000000`
- H2: `24-25px`, `font-weight: 700`, `color: #000000`
- H3: `25px`, `font-weight: 700`, `color: #000000`
- Paragraphs: `17px`, `color: #000000`, `margin-top: 20px`

**Testimonial Cards:**
```css
.result-item1 {
  padding: 12px 10px;
  background-color: rgba(255, 255, 255, 1) !important;
  box-shadow: 2px 2px 8px 2px rgba(0, 0, 0, 0.12) !important;
  border-radius: 15px;
}
```

**Trustpilot Widget:**
```css
.tp-section {
  padding: 20px 20px;
  background: rgba(255, 255, 255, 1);
  font-family: Arial, sans-serif;
  max-width: 1040px;
  margin: 0 auto;
}
```

**CSS Custom Properties:**
```css
:root {
  --swiper-theme-color: #007aff;
  --swiper-preloader-color: #fff;
  --fa-font-brands: normal 400 1em/1 "Font Awesome 6 Brands";
  --fa-font-regular: normal 400 1em/1 "Font Awesome 6 Free";
  --fa-font-solid: normal 900 1em/1 "Font Awesome 6 Free";
}
```

**CSS Hex Colors (by frequency):**
- `#FFF` (x118) - White
- `#212529` (x49) - Dark text
- `#6C757D` (x37) - Gray
- `#007BFF` (x32) - Bootstrap blue (buttons)
- `#28A745` (x26) - Green (success)
- `#DC3545` (x26) - Red (danger)
- `#000000` (x22) - Black
- `#343A40` (x17) - Dark gray
- `#F8F9FA` (x17) - Light gray bg
- `#17A2B8` (x15) - Cyan (info)
- `#FFC107` (x15) - Yellow (warning)
- `#E9ECEF` (x13) - Light gray border
- `#000` (x13) - Black
- `#495057` (x12) - Gray-700

**Fonts:** Font Awesome 5 + 6 Brands/Free, FontAwesome, swiper-icons

**FAQ/Accordion:**
```css
.accordion-main-wrap-cd10 { /* FAQ wrapper */ }
.accordion-container-cd10 { /* FAQ container */ }
```

**Animations:** 85+ unique @keyframes (same Bootstrap 4 + Animate.css library as Drivse/Rejuvacare, plus `slideUp`, `swiper-preloader-spin`, Font Awesome animations: `fa-beat`, `fa-beat-fade`, `fa-bounce`, `fa-fade`, `fa-flip`, `fa-shake`)

---

### AIRMOTO
**Brand**: Airmoto
**URL**: https://deals.getairmoto.com/promo
**Page Type**: Product page
**Builder**: Funnel Builder Pro (Tailwind CSS)

**Page Structure:** Tailwind utility-based funnel page.
1. [HERO] - Dark hero with product gallery
2. [PRICING] - Bundle/price selector
3. [CTA] - Add to Cart buttons
4. [DISCOUNT_CODE] - Discount code input section

**Exact CTA Button CSS:**
```css
/* Primary CTA button */
.cta {
  max-width: 400px;
  width: 100%;
  padding: 16px;
  background: #facc15;             /* yellow-400 */
  font-weight: 700;
  font-size: 18px;
  border-radius: 24px;             /* rounded-3xl */
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #eab308;       /* yellow-500 */
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
}
.cta:hover {
  background: #eab308;             /* yellow-500 */
}
```

**Animations:**
```css
@keyframes pulse { /* CTA pulse */ }
@keyframes pulseCta { /* CTA-specific pulse */ }
@keyframes pulseGreen { /* green pulse */ }
@keyframes pulseRed { /* red urgency pulse */ }
@keyframes wiggle { /* attention wiggle */ }
@keyframes scroll { /* scroll indicator */ }
```

**Tailwind Color Values:**
- `#F9F9F9` (x4) - Light bg
- `#333333` (x2) - Text
- `#3CB54B` (x2) - Green accent
- `#000413` (x1) - Ultra dark

**CSS Hex Colors (from inline styles):**
- `#111827` (x7) - Gray-900 text
- `#999` (x5) - Muted/strikethrough
- `#16A34A` (x3) - Green-600
- `#272727` (x2) - Dark hero bg
- `#2563EB` (x2) - Blue-600 link
- `#1F2937` (x2) - Gray-800

**Pricing CSS Classes:**
- `.product-price`, `.original-price`, `.product-discount`
- `.order-item-quantity-badge`, `.order-item-quantity-text`
- `.strikethrough-price`, `.new-price`
- `.order-discount-code-input`, `.order-discount-code-button`

---

### ORICLE
**Brand**: Oricle Hearing
**URL**: https://hear.oriclehearing.com/
**Page Type**: Product page
**Builder**: Funnel Builder Pro (Tailwind CSS)

**Page Structure (top to bottom):**
1. [HERO] - "The Smallest Ever Wireless Hearing Aid For Just $99!" + video + reviews
2. [AS_ADVERTISED_ON] - "AS ADVERTISED ON" media logos slider
3. [VIDEO_REVIEWS] - Customer video testimonial carousel
4. [COMPARISON] - "Why Thousands Are Switching From $3,000 Hearing Aids" + comparison cards
5. [HOW_TO_USE] - "Enjoy Better Hearing In Just 3 Simple Steps" (3 steps with icons)
6. [FEATURES_GRID] - "Advanced Tech Traditional Hearing Aids Can't Match" (feature cards)
7. [COMPARISON_TABLE] - "Oricle Vs Other Hearing Aid" detailed table
8. [TESTIMONIALS_VIDEO] - "100,000+ Raving Customers" video marquee
9. [WHATS_IN_BOX] - "What's In The Box" product contents
10. [FAQ] - "Frequently Asked Questions" accordion
11. [STICKY_BOTTOM_BAR] - Mobile sticky bottom bar (`bg-[#000] text-[#fff] z-[100]`)

**Section CSS (Tailwind utility-based):**
- Sections use padding utilities: `p-[10px_0_30px] md:p-[30px_0_50px] lg:p-[60px_0_70px]`
- Background alternating: `bg-[#fff]` and `bg-[#F1F6FA]` (light blue)

**Tailwind Color Usage (by frequency):**
- `#002445` (x56) - Primary navy (headings, dark sections)
- `#FFF` (x46) - White text on dark
- `#202950` (x18) - Secondary navy
- `#CECECE` (x17) - Light gray borders
- `#000` (x15) - Black text
- `#1EB13A` (x12) - Green checkmarks/verified
- `#04F532` (x11) - Bright green accents
- `#F1F6FA` (x7) - Light blue bg
- `#185B97` (x7) - Medium blue
- `#E7EEF5` (x7) - Light gray-blue
- `#F1F1F1` (x7) - Light gray bg
- `#DEDEDE` (x6) - Gray borders
- `#CECCCE` (x6) - Gray muted

**CSS Hex Colors (from inline styles):**
- `#000` (x13) - Black text
- `#1B96D3` (x7) - Brand blue
- `#111827` (x7) - Gray-900 text
- `#999` (x5) - Muted text
- `#22C55E` (x3) - Green-500
- `#0769ED` (x3) - Blue link
- `#16A34A` (x3) - Green-600
- `#4368E0` (x2) - Brand blue variant

**Animations:** 23 unique @keyframes:
- `breath` - Breathing effect
- `checkmark` - Animated checkmark
- `expandWidth` - Width expansion
- `fillUp` / `fillUpRed` - Fill animations
- `move-ticker` / `moveLogos` / `partnersTicker` - Logo carousels
- `sales-19-marquee` - Sale marquee
- `ticker` - Ticker scroll

**Fonts:** 22+ Google Fonts loaded:
- Inter, Open Sans, Montserrat, Work Sans, Outfit, Archivo, Source Sans 3, Roboto, EB Garamond, Poppins, Red Hat Display, Noto Sans, Lato, Raleway, Nunito Sans, Inter Tight, Figtree, Hanken Grotesk, Homemade Apple
- All with local fallbacks (e.g., `__Inter_Local_Fallback`)

---

### GETHEYFRA
**Brand**: Getheyfra
**URL**: https://getheyfra.com/products/total-relief-magnesium-cream
**Page Type**: Product page (Shopify + GemPages)
**Builder**: Shopify Dawn + GemPages

**Page Structure:** GemPages uses nested `<div>` elements with `gpo-` prefixed classes.
1. [ANNOUNCEMENT_BAR] - Promo bar
2. [HEADER] - Shopify header
3. [HERO] - Product image + headline
4. [BENEFITS] - Key benefits section
5. [TESTIMONIALS] - Large review section (203 elements)
6. [PRICING_BUNDLE] - Multi-quantity pricing
7. [FAQ] - FAQ accordion
8. [GUARANTEE] - Guarantee badge
9. [TRUST] - Trust badges
10. [FOOTER] - Standard footer

**Exact CSS Custom Properties:**
```css
:root {
  /* Colors (RGB format) */
  --color-base-text: 0, 0, 0;
  --color-base-background-1: 255, 255, 255;       /* white */
  --color-base-background-2: 107, 151, 99;         /* #6B9763 green */
  --color-base-accent-1: 232, 244, 234;            /* #E8F4EA light green */
  --color-base-accent-2: 234, 227, 213;            /* #EAE3D5 warm beige */

  /* Typography */
  --font-body-family: Montserrat, sans-serif;
  --font-heading-family: Montserrat, sans-serif;
  --font-body-weight: 400;
  --font-body-weight-bold: 700;
  --font-heading-weight: 600;
  --font-body-scale: 1.2;
  --font-heading-scale: 0.875;

  /* Media */
  --media-radius: 12px;
  --media-shadow-opacity: 0.1;
  --media-shadow-horizontal-offset: 10px;
  --media-shadow-vertical-offset: 12px;
  --media-shadow-blur-radius: 20px;

  /* Layout */
  --page-width: 100rem;
  --spacing-sections-desktop: 0px;
  --spacing-sections-mobile: 0px;
  --grid-desktop-vertical-spacing: 4px;
  --grid-desktop-horizontal-spacing: 12px;
  --grid-mobile-vertical-spacing: 2px;
  --grid-mobile-horizontal-spacing: 6px;

  /* Buttons */
  --buttons-radius: 40px;          /* pill shape */
  --buttons-radius-outset: 41px;
  --buttons-border-width: 1px;
  --buttons-border-opacity: 0.55;

  /* Inputs */
  --inputs-radius: 40px;           /* pill shape */
  --inputs-radius-outset: 41px;

  /* Cards */
  --product-card-corner-radius: 1.2rem;
  --product-card-shadow-opacity: 0.05;
  --product-card-shadow-horizontal-offset: 1.0rem;
  --product-card-shadow-vertical-offset: 1.0rem;
  --product-card-shadow-blur-radius: 3.5rem;
  --collection-card-corner-radius: 1.2rem;
  --badge-corner-radius: 2.0rem;

  /* Text Boxes */
  --text-boxes-radius: 24px;

  /* Popup */
  --popup-corner-radius: 22px;
  --popup-shadow-opacity: 0.1;
  --popup-shadow-horizontal-offset: 10px;
  --popup-shadow-vertical-offset: 12px;
  --popup-shadow-blur-radius: 20px;

  /* GemPages Brand Colors */
  --lxs-rating-icon-color: #EBBF20;
  --gf_gs-color1-brand: #e96b93;     /* pink */
  --gf_gs-color2-brand: #df2c64;     /* deep pink */
  --gf_gs-color3-brand: #a7214b;     /* dark pink */
  --gf_gs-color1-accent: #b1f3c4;    /* light green */
  --gf_gs-color2-accent: #85eccc;    /* teal */
  --gf_gs-color3-accent: #1dadbb;    /* teal dark */
  --gf_gs-color4-accent: #c3843f;    /* gold */
  --gf_gs-color5-accent: #ffffff;
}
```

**Section CSS:**
- Brand green: `#43744e`, `#699763`, `#1b5039`, `#2d6043`, `#6B9763`
- Brand gold: `#c3843f`, `#f4c323`
- Background: `#fff`, `#f1f1f1`, `#E8F4EA` (light green), `#EAE3D5` (warm beige)
- Text: `#2a2a2a`, `#242424`, `#3a3a3a`, `#fff`
- Font: `Montserrat, sans-serif` (body + headings)
- Font sizes: `20px` (most common), `24px` (h2), `18px` (body), `35px` (large heading), `32px`
- Border-radius: `24px` (text boxes), `40px` (buttons - pill shape), `12px` (media), `2.0rem` (badges)
- Star rating: `#EBBF20`
- Box-shadow: `0 0 #fdfbf7` (subtle), `0 0 #333`
- Pricing cards: 18 pricing-related CSS rules
- Review system: 41 review-related CSS rules

---

### GETHEYFRA-LANDING
**Brand**: Getheyfra
**URL**: https://getheyfra.com/
**Page Type**: Landing page (Shopify + GemPages)
**Builder**: Shopify Dawn + GemPages

**Page Structure:** Simpler landing page format:
1. [ANNOUNCEMENT_BAR] - Promo bar
2. [HEADER] - Shopify header
3. [HERO] - Product showcase (single GemPages section)
4. [FOOTER] - Standard footer

**CSS:** Same CSS custom properties as Getheyfra product page. Landing page has a single large GemPages section (`shopify-section-template--22576280076608__1762000708d16w0iid`) containing all visual content.

**Tailwind Color Usage (by frequency):**
- `#FFF` (x165) - White text/elements
- `#FAAD14` (x100) - Yellow/gold accent (star rating)
- `#242424` (x75) - Dark text
- `#3A3A3A` (x60) - Secondary text
- `#000` (x59) - Black
- `#2D6043` (x35) - Green accent
- `#295241` (x25) - Dark green
- `#699763` (x17) - Brand green
- `#C3843F` (x15) - Gold accent

---

### TRYEMSENSE
**Brand**: EMSense
**URL**: https://www.tryemsense.com/products/product-2/
**Page Type**: Product page (Webflow-based)
**Builder**: Funnel Builder (Webflow-style)

**Page Structure (top to bottom):**
1. [ANNOUNCEMENT_COUNTDOWN] - "Limited Time Promo: 70% OFF" (geo-targeted UK banner, hidden)
2. [ANNOUNCEMENT_COUNTDOWN] - "Limited Time Promo: 70% OFF" (geo-targeted DE banner)
3. [TIMER_NAV] - Countdown timer + "Pre-Qualified" nav with anchor links
4. [HERO] - "1,257+ REVIEWS" + "Finally! Real Relief for Neuropathy Pain" + video
5. [FEATURES] - "One Device That Does It All" + 3 benefit items
6. [PROBLEM_VIDEO] - "The Real Cause of Foot Pain" + video
7. [STICKY_BANNER] - "1,257+ REVIEWS ORDER NOW!" (sticky top)
8. [PRODUCT_DETAILS] - "You Are One Step Closer" + product info + video on `light-gray` bg
9. [CUSTOMER_RESULTS] - "Our Customers Report Significantly Reduced Pain Levels"
10. [COMPARISON] - "Ditch Expensive Treatments and Pills" on `light-blue` bg
11. [RESULTS_VIDEO] - "These Results Speak for Themselves" + video
12. [HOW_TO_USE] - "3 Simple Steps For Foot Pain Relief" on `cream` bg + video
13. [REVIEWS] - "See What Others Are Saying" + review cards
14. [GUARANTEE] - "30-Day Money-Back Guarantee" on `light-gray` bg
15. [FAQ] - "Read Our Customers' FAQ" accordion
16. [FOOTER] - "INFO" + "ORDER" columns on dark bg
17. [COPYRIGHT] - "2026 EMSense" on dark bg

**Exact Section CSS:**
```css
/* Base section */
.int-section {
  flex-flow: column;
  justify-content: center;
  align-items: center;
  padding: 64px 32px;
  position: relative;
  overflow: clip;
}

/* Mobile override */
.int-section {
  padding: 40px 16px;
}

/* Announcement/countdown bar */
.int-section._70-off {
  color: #fff;
  background-color: #00264c;
  padding-top: 12px;
  padding-bottom: 12px;
  display: flex;
}

/* Hero */
.int-section.hero {
  background-color: #eafafa;
  padding-top: 24px;
}

/* Sticky banner */
.int-section.sticky {
  z-index: 1;
  color: #fff;
  background-color: #00264c;
  padding-top: 12px;
  padding-bottom: 12px;
  position: sticky;
  top: 0;
}

/* Alternating backgrounds */
.int-section.light-gray {
  background-color: #f5f5f5;
}
.int-section.cream {
  background-color: #f9f2e8;
}

/* Separator */
.int-section.separator-top {
  border-top: 1px solid #02122e14;
}

/* Footer */
.int-section.footer {
  background-color: #141619;
  padding-top: 40px;
  padding-bottom: 40px;
}
.int-section.copyright {
  color: #fff;
  background-color: #0e0f11;
  padding-top: 24px;
  padding-bottom: 24px;
}
```

**Button CSS:**
```css
.cta-wrapper {
  grid-column-gap: 8px;
  grid-row-gap: 8px;
  border-top: 1px solid #e7e7e7;
  border-bottom: 1px solid #e7e7e7;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  padding: 16px;
  display: flex;
}
```

**Review/Testimonial CSS:**
```css
.review-image {
  object-fit: cover;
  border-radius: 8px;
  width: 100%;
  max-height: 250px;
}
.int-review-verified {
  grid-column-gap: 6px;
  color: #24aa2f;
  align-items: center;
  font-size: 16px;
  font-weight: 400;
  line-height: 22px;
  display: flex;
}
.int-review-author {
  grid-column-gap: 16px;
  align-items: center;
  min-width: 250px;
  display: flex;
}
.int-review-name {
  grid-column-gap: 4px;
  flex-flow: column;
  font-size: 20px;
  font-weight: 700;
  display: flex;
}
.int-reviews-subtitle {
  color: #e33c4c;
  font-size: 20px;
  font-weight: 700;
  line-height: 28px;
}
.int-review {
  grid-column-gap: 64px;
  border-top: 1px solid #eaeaea;
  align-items: flex-start;
  padding-top: 24px;
  padding-bottom: 24px;
  display: flex;
}
.int-reviews-score-val {
  font-size: 88px;
  font-weight: 700;
  line-height: 96px;
}
.int-review-video {
  border-radius: 6px;
  width: 100%;
  min-height: 250px;
  max-height: 250px;
  overflow: clip;
}
```

**FAQ/Accordion CSS:**
```css
.faq-accordion {
  grid-column-gap: 16px;
  flex-flow: column;
  display: flex;
}
.faq-accordion-item {
  background-color: #f4f4f4;
  border-radius: 8px;
}
.faq-accordion-toggle {
  text-align: left;
  cursor: pointer;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  font-weight: 700;
  display: flex;
}
.faq-accordion-content {
  text-align: left;
  padding-bottom: 16px;
  padding-left: 16px;
  padding-right: 16px;
  font-size: 16px;
  line-height: 24px;
}
```

**Guarantee CSS:**
```css
.guarantee-flex {
  grid-column-gap: 40px;
  justify-content: flex-start;
  align-items: flex-start;
  display: flex;
}
.guarantee-badge {
  max-height: 170px;
}
```

**Colors:**
- Navy dark: `#00264c` (announcement, sticky banner)
- Hero bg: `#eafafa` (light cyan)
- Section bg gray: `#f5f5f5`
- Section bg cream: `#f9f2e8`
- Footer dark: `#141619`, `#0e0f11`
- CTA green: `#24aa2f`
- Sale red: `#e33c4c`
- Text dark: `#02122e`
- Text secondary: `#00183a`, `#17191c`
- FAQ item bg: `#f4f4f4`
- Review border: `#eaeaea`

---

### TRYLEDISA (HaloGrow)
**Brand**: HaloGrow
**URL**: https://www.tryhalogrow.com/products/product-1/
**Page Type**: Product page (Webflow-based)
**Builder**: Funnel Builder (Webflow-style)

**Page Structure (top to bottom):**
1. [HERO] - Product hero with image slider
2. [USP_BAR] - "Over 100,000 verified users" + 4 USP badges (lime green bg)
3. [AS_SEEN_ON] - "As Seen In" media logos
4. [PROBLEM_AGITATION] - "Do You Know WHY You're Losing Hair?" (dark green bg)
5. [VIDEO_SOLUTION] - "The Hair Loss Solution You've Been Waiting For" + video (beige bg)
6. [FEATURES] - "Here's What Makes HaloGrow Stand Out" (5 features)
7. [USE_CASES] - "Perfect for all sorts of hair loss" (beige bg)
8. [INGREDIENTS] - "Five Powerful Ingredients" (dark green bg)
9. [HOW_TO_USE] - "How to Use" 3 steps (beige bg)
10. [RESULTS_STATS] - "These Results Speak for Themselves" + stats
11. [TESTIMONIAL_VIDEO] - "How to Use HaloGrow" + video testimonial (green bg)
12. [RESULTS_GALLERY] - "3,000+ success stories" before/after gallery
13. [CTA_FULLWIDTH] - "Visibly thicker and longer hair" + "70% DISCOUNT ORDER NOW" (bg-image)
14. [REVIEWS] - "See What Others Are Saying" + review cards
15. [GUARANTEE] - "30-Day Money-Back Guarantee" (beige bg)
16. [FAQ] - Accordion FAQ
17. [FOOTER] - 2-column footer (dark bg)
18. [COPYRIGHT] - Copyright bar (dark bg)

**Exact Section CSS:**
```css
/* Base section */
.section {
  flex-flow: column;
  justify-content: center;
  align-items: center;
  padding: 80px 32px;
  display: flex;
  overflow: hidden;
}

/* Mobile override */
.section {
  padding: 40px 16px;
}

/* USP bar */
.section.narrow-usp-section {
  background-color: #baf363;
  padding-top: 16px;
  padding-bottom: 16px;
}

/* Hero */
.section.hero {
  background-color: #edede4;
  background-image: url(...);
  background-position: 100% 100%, 0 100%;
  background-size: cover, auto;
  padding-top: 0;
  padding-bottom: 0;
}

/* Green (dark) sections */
.section.green {
  background-color: #0c230e;
  overflow: clip;
}

/* Beige sections */
.section.beige {
  background-color: #edede4;
}

/* FAQ */
.section.faq {
  background-image: url(...);
  background-position: 50%;
  background-size: cover;
}

/* CTA full-width image bg */
.section.bg-image {
  background-image: url(...);
  background-position: 50%;
  background-repeat: no-repeat;
  background-size: cover;
}
```

**Typography CSS:**
```css
.heading-1 {
  color: #0c230e;
  font-family: Sentient, Arial, sans-serif;
  font-size: 52px;
  font-weight: 500;
  line-height: 58px;
}
.heading-3 {
  color: #0c230e;
  font-family: Sentient, Arial, sans-serif;
  font-size: 44px;
  font-weight: 500;
  line-height: 52px;
}
.heading-4 {
  color: #0c230e;
  font-family: Sentient, Arial, sans-serif;
  font-size: 32px;
  font-weight: 500;
  line-height: 40px;
}
.heading-5 {
  color: #0c230e;
  font-family: Sentient, Arial, sans-serif;
  font-size: 24px;
  font-weight: 500;
  line-height: 32px;
}

/* Mobile overrides */
.heading-1 { font-size: 48px; line-height: 56px; }  /* tablet */
.heading-1 { font-size: 32px; line-height: 40px; }  /* mobile */
.heading-3 { font-size: 32px; line-height: 40px; }  /* mobile */
.heading-4 { font-size: 32px; line-height: 40px; }  /* mobile */
.heading-5 { font-size: 24px; line-height: 32px; }  /* mobile */
```

**Colors:**
- Dark green: `#0c230e`
- Lime accent: `#baf363`
- Brand green: `#24aa2f`, `#00c249`
- Beige: `#edede4`
- CTA green button: `#24aa2f`
- Text dark: `#0c230e`, `#02122e`
- White text on dark: `#fff`
- Dark footer: `#141619`, `#0e0f11`

---

### SALE-PAGE-ORICLE
**Brand**: Oricle Hearing
**URL**: https://hear.oriclehearing.com/ (sale variant)
**Page Type**: Sale page (Funnel Builder Pro)
**Builder**: Funnel Builder Pro (Tailwind CSS)

**Page Structure:** Same builder as Oricle product page but optimized for sale conversion:
1. [STICKY_BOTTOM_BAR] - Mobile sticky bottom bar (`bg-[#000] text-[#fff] z-[100]`)
2. [HERO] - Product hero + headline
3. [PRICING] - Bundle selector
4. [FAQ] - FAQ section

**CSS:** Identical to Oricle product page. Uses same Tailwind utility classes and color palette:
- Primary navy: `#002445` (x56 usage)
- White: `#FFF` (x46)
- Dark blue: `#202950` (x18)
- Green: `#1EB13A` (x12), `#04F532` (x11)
- Light blue bg: `#F1F6FA` (x7), `#E7EEF5` (x7)
- Gray: `#CECECE` (x17), `#DEDEDE` (x6)

**Animations:** 23 unique @keyframes including `breath`, `checkmark`, `expandWidth`, `fillUp`, `move-ticker`, `moveLogos`, `partnersTicker`, `sales-19-marquee`, `ticker`

**Fonts:** 22+ Google Fonts loaded (Inter, Open Sans, Montserrat, Work Sans, Outfit, Archivo, Poppins, Roboto, etc.) with local fallbacks

---

### TRYLEDISA-EN (HaloGrow English Variant)
**Brand**: HaloGrow
**URL**: https://www.tryhalogrow.com/ (English variant)
**Page Type**: Product page (Webflow-style)
**Builder**: Funnel Builder (Webflow-style)

**Page Structure:** Identical layout to Tryledisa (HaloGrow) product page:
1. [HERO] - Product hero with image slider
2. [USP_BAR] - "Over 100,000 verified users" + badges
3. [AS_SEEN_ON] - Media logos
4. [PROBLEM_AGITATION] - Hair loss problem
5. [VIDEO_SOLUTION] - Solution video
6. [FEATURES] - Product features
7. [USE_CASES] - Hair loss types
8. [INGREDIENTS] - 5 ingredients
9. [HOW_TO_USE] - 3 steps
10. [RESULTS] - Stats + testimonials
11. [REVIEWS] - Customer reviews
12. [GUARANTEE] - 30-day guarantee
13. [FAQ] - Accordion
14. [FOOTER] - 2-column footer

**CSS:** Same exact CSS as Tryledisa HaloGrow page:
- Dark green: `#0C230E` (x57)
- White: `#FFF` (x107)
- Lime accent: `#BAF363` (x19)
- Deep dark: `#0E0C23` (x17)
- CTA green: `#24AA2F` (x14), `#00C249` (x7)
- Beige: `#EDEDE4` (x8)
- Sale red: `#E33C4C` (x7)
- Orange: `#C95600` (x10)
- Font: Sentient Variable (heading) + system (body)

---

### SALE-PAGE-TRYEMSENSE (DE/NL Variants)
**Brand**: EMSense
**URL**: Localized sale pages (German + Dutch)
**Page Type**: Sale page (Webflow-style)
**Builder**: Funnel Builder (Webflow-style)

**Page Structure:** Same layout as Tryemsense EN product page with localized content:
1. [ANNOUNCEMENT_COUNTDOWN] - "Limited Time Promo: 70% OFF" (geo-targeted)
2. [TIMER_NAV] - Countdown timer + nav
3. [HERO] - "1,257+ REVIEWS" + headline + video
4. [FEATURES] - 3 benefit items
5. [PROBLEM_VIDEO] - Pain point video
6. [STICKY_BANNER] - Sticky top CTA
7. [PRODUCT_DETAILS] - Product info + video
8. [CUSTOMER_RESULTS] - Pain reduction stats
9. [COMPARISON] - Product vs alternatives
10. [HOW_TO_USE] - 3 steps
11. [TESTIMONIALS] - Review cards
12. [GUARANTEE] - 30-day guarantee
13. [FAQ] - Accordion
14. [FOOTER] - 2-column footer

**CSS:** Identical CSS to Tryemsense EN page. DE and NL variants share the exact same CSS (color frequencies are identical to the EN variant):
- Dark navy: `#00264C` (x10), `#02122E` (x46)
- White: `#FFF` (x81)
- Sale red: `#E33C4C` (x16)
- CTA green: `#24AA2F` (x13), `#00C249` (x5)
- Light gray: `#F5F5F5` (x10)
- Cream: `#F9F2E8` (N/A in sale variants)
- Font: Bitter Variable (headings) + Manrope (body)

---

### CHECKOUT-TRYLEDISA (HaloGrow Checkout)
**Brand**: HaloGrow
**URL**: Checkout page
**Page Type**: Checkout/order page (Webflow-style)
**Builder**: Funnel Builder (Webflow-style)

**Page Structure:** Checkout-focused layout:
1. [BANNER] - Sale/promo banner (multi-geo: EN, DE, NL, NO, SE, FR)
2. [HERO] - Product hero with checkout CTA
3. [BENEFITS_LIST] - Key benefits with icons
4. [REVIEW_BANNER] - Social proof banner
5. [DISCOUNT_HEADER] - Discount info header
6. [BUNDLE_SELECTORS] - Gift bundle variant selectors
7. [PRODUCT_CARDS] - Product card bundles
8. [FAQ_COLLAPSIBLE] - Expandable FAQ sections
9. [PRICE_BOX] - Price breakdown (old price, discount, shipping)
10. [TIMER] - Countdown timer (multi-geo variants)

**Exact CSS (Checkout-specific):**
```css
/* Checkout uses a more complex color system */
/* Primary colors */
--checkout-navy: #02122E;          /* (x140 - dominant) */
--checkout-white: #FFF;             /* (x276) */
--checkout-dark: #1B2A43;           /* (x67 - dark variant) */
--checkout-green: #00C249;          /* (x67 - CTA green) */
--checkout-red: #EC0B43;            /* (x66 - urgency red) */
--checkout-gray: #818997;           /* (x57) */
--checkout-dark-green: #0C230E;     /* (x52) */
--checkout-muted: #9AA0AB;          /* (x45) */
--checkout-blue-gray: #4E596D;      /* (x39) */
--checkout-lime: #BAF363;           /* (x17 - lime accent) */
--checkout-light-bg: #F8F8F8;       /* (x21) */
--checkout-link-blue: #1264E8;      /* (x25) */
--checkout-light-blue: #EBF7FF;     /* (x14) */
--checkout-orange: #FF9201;         /* (x11) */
```

**Bundle Selector CSS:**
```css
.product-card-bundle { /* bundle card */ }
.bundle-green-bg { background: green; }
.gift-bundle-selectors { /* variant picker */ }
```

**Timer CSS:**
```css
.timer-wrapper-hs { /* timer container */ }
.timer-container { /* timer block */ }
.timer-discount-icon-2 { /* timer icon embed */ }
```

---

## Cross-Page Patterns

### Most Common Section Order (Product Pages)

1. **Announcement/Promo Bar** (70% of pages) - Discount %, free shipping, geo-targeted
2. **Hero Section** - Product name, headline, star rating, product image/video
3. **USP/Trust Bar** (60%) - Quick trust badges, verified users count
4. **Problem/Agitation** (80%) - Pain point narrative, "Why you need this"
5. **Video Section** (90%) - Product demo or explainer video
6. **Benefits/Features** (90%) - 3-5 key benefits with icons/images
7. **How It Works** (70%) - 3 simple steps with images
8. **Results/Testimonials** (100%) - Customer reviews, before/after
9. **Comparison** (50%) - Product vs competitors table/grid
10. **Pricing/Bundle Selector** (100%) - 1x, 3x, 6x bundles with per-unit pricing
11. **Guarantee** (90%) - 30/90 day money-back guarantee with badge
12. **FAQ** (100%) - 5-10 questions accordion
13. **Footer** (100%) - Links, legal, copyright

### Common Section Alternation Pattern
Most pages alternate section backgrounds for visual rhythm:
- White `#fff` > Light gray `#f5f5f5` / `#F4F9FF` > White > Beige `#edede4` / Cream `#f9f2e8`

### Bundle/Pricing Card Patterns

**Standard Bundle Layout:**
- 3-column grid (1x, 3x, 6x or 1x, 2x, 3x)
- Center column highlighted as "Most Popular" / "Best Value"
- Each card contains: product image, quantity label, price per unit, total price, strikethrough original price, "Add to Cart" button

**Pricing Card CSS (common patterns):**
```css
/* Card container */
.pricing-card {
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px 16px;
  text-align: center;
  background: #fff;
  position: relative;
}

/* "Best Value" badge */
.best-value-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: #f59e0b;  /* amber/gold */
  color: white;
  padding: 4px 16px;
  border-radius: 4px;
  font-weight: 700;
  font-size: 12px;
}

/* Strikethrough price */
.original-price {
  text-decoration: line-through;
  color: #999;
  font-size: 16px;
}

/* Sale price */
.sale-price {
  font-weight: 700;
  color: #e33c4c; /* or brand color */
  font-size: 24px;
}

/* Per-unit price */
.per-unit {
  font-size: 14px;
  color: #6c757d;
}
```

### CTA Button Patterns

**Primary CTA (Add to Cart / Order Now):**

| Page | Background | Text | Border-Radius | Padding | Font Size |
|---|---|---|---|---|---|
| Drivse/Funnel | `#007bff` (blue) | `#fff` | `.25rem` (4px) | `6px 12px` to `.375rem .75rem` | `16px` |
| Tryemsense | `#24aa2f` (green) | `#fff` | `8px` | `16px` | `16px` |
| Tryledisa | `#24aa2f` (green) | `#fff` | `100px` (pill) | `16px 32px` | `16-18px` |
| SmoothSpire | `#007bff` (blue) | `#fff` | `.25rem` | `6px 12px` | `16px` |
| Oricle | `#1b96d3` (blue) | `#fff` | `8px` | Custom | `16px` |
| Getheyfra | `#43744e` (green) | `#fff` | `60px` (pill) | Custom | `16-18px` |
| Airmoto | `#1a7a28` (green) | `#fff` | `12px` | Custom | `16px` |
| PrimalQueen | `#E94480` (pink) | `#fff` | `15px` | Custom | `16-18px` |

**Hover Effects:**
```css
/* Drivse (Bootstrap) */
.btn-primary:hover {
  background-color: #0069d9;
  border-color: #0062cc;
}

/* Common pattern */
button:hover {
  opacity: 0.9;
  transform: scale(1.02);
}
```

**Animation on CTA (common):**
```css
/* Pulse animation for CTA */
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
```

### Trust Element Patterns

**Guarantee Badge:**
- Usually circular or shield-shaped image
- `max-height: 170px` (tryemsense)
- Centered within guarantee section
- Text: "30-Day / 90-Day Money-Back Guarantee"

**Trust Bar (USP bar at top):**
- Horizontal flex row of 3-4 badges
- Background: Brand lime `#baf363` (tryledisa) or brand navy `#00264c` (tryemsense)
- Small icons + short text
- Compact padding: `8-16px` top/bottom

**Payment Icons:**
- Visa, Mastercard, Amex, PayPal
- Usually grayscale
- Displayed at bottom of pricing section or in footer

**Review Stars:**
- 5-star yellow/orange: `#f59e0b` or `#fbbf24`
- Star character or SVG
- Rating number + review count: "4.9 (1,257+ Reviews)"

### Video Section Patterns

```css
/* Common video wrapper */
.video-wrapper {
  border-radius: 8px;
  overflow: hidden;
  width: 100%;
  aspect-ratio: 16/9;
}
.video-wrapper video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

/* Video with border accent (tryemsense) */
.int-an05-hero-video-wrapper {
  border: 4px solid #00599d;
}
```

### Announcement/Countdown Bar Patterns

```css
/* Dark navy bar */
.announcement-bar {
  color: #fff;
  background-color: #00264c;
  padding: 8px 12px;
  text-align: center;
  font-size: 14-16px;
  font-weight: 700;
}

/* Lime green bar (tryledisa) */
.usp-bar {
  background-color: #baf363;
  padding: 16px;
  color: #0c230e;
  font-weight: 600;
}
```

### Sticky Banner Pattern

```css
/* Sticky top or bottom banner */
.sticky-banner {
  z-index: 1;
  color: #fff;
  background-color: #00264c;
  padding: 12px;
  position: sticky;
  top: 0;  /* or bottom: 0 */
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
}
```

### FAQ Accordion Pattern

```css
/* Common FAQ accordion */
.faq-item {
  background-color: #f4f4f4;
  border-radius: 8px;
  margin-bottom: 8px;
}
.faq-question {
  padding: 16px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.faq-answer {
  padding: 0 16px 16px;
  font-size: 16px;
  line-height: 24px;
  text-align: left;
}
```

### Footer Pattern

```css
/* Dark footer */
.footer {
  background-color: #141619;
  padding: 40px;
  color: #fff;
}
.footer-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}
.footer a {
  color: #ffffffb8;
  text-decoration: none;
}

/* Copyright bar */
.copyright {
  background-color: #0e0f11;
  padding: 24px;
  color: #fff;
  text-align: center;
  font-size: 14px;
}
```

### Max-Width Container Pattern

Most pages use a max-width container:
- `max-width: 1230px` (SmoothSpire)
- `max-width: 1125px` (SmoothSpine steps)
- `max-width: 1110px` (SmoothSpine results)
- `max-width: 1040px` (SmoothSpine Trustpilot)
- `max-width: 800px` (tryemsense testimonials)
- `max-width: 856px` (tryemsense comparison)

### Responsive Breakpoints

Common breakpoints across pages:
- `768px` (tablet) - `.md:` prefix in Tailwind
- `1024px` (desktop) - `.lg:` prefix in Tailwind
- Grid changes from multi-column to single column
- Padding reduces from `64-80px` to `16-40px`
- Font sizes reduce (e.g., `52px` -> `32px` for headings)
- Hero changes from side-by-side to stacked layout

### Image Handling

```css
/* Product images */
.product-image {
  width: 100%;
  height: auto;
  border-radius: 8-15px;
  object-fit: cover;
}

/* Gallery/carousel images */
.gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}
```

### Box Shadow Patterns

```css
/* Subtle card shadow */
.card-shadow {
  box-shadow: 2px 2px 8px 2px rgba(0, 0, 0, 0.12);
}

/* Comparison card shadow */
.comparison-shadow {
  box-shadow: 2px 2px 4px 1px rgba(0, 0, 0, 0.1);
}

/* Focus shadow (Bootstrap) */
.focus-shadow {
  box-shadow: 0 0 0 .2rem rgba(0, 123, 255, 0.25);
}
```

### Animation Patterns

Common keyframe animations found across pages:
- `fadeIn` / `fadeInUp` / `fadeInDown` - entrance animations
- `pulse` - CTA button attention
- `bounce` / `shake` - urgency elements
- `slideIn` / `slideUp` - content reveal on scroll
- `marquee` - logo/testimonial carousel scrolling
- `spin` - loading indicators
- `float` - decorative elements

```css
/* Marquee scroll (Oricle reviews) */
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
```

---

## Builder-Specific Patterns

### Funnel Builder Pro (Tailwind) - Airmoto, Oricle, Sale-Oricle
- Tailwind CSS utility-first with JIT arbitrary values
- `p-[30px_0_35px]`, `bg-[#F1F6FA]`, `text-[#002445]`
- Responsive prefixes: `md:p-[50px_0_60px]`, `lg:p-[60px_0_70px]`
- Dynamic pricing via JavaScript template literals
- `data-box="true"` attributes on elements
- Pricing injected via JS: `${product.price}`, `${globalCurrency.symbol}`
- 22+ Google Fonts loaded with local fallbacks
- Unique animations: `breath`, `checkmark`, `expandWidth`, `move-ticker`
- Yellow CTA buttons (Airmoto: `#facc15`), blue (Oricle: `#1b96d3`)

### FunnelKit (Bootstrap 4) - Drivse, Rejuvacare, SmoothSpire
- Bootstrap 4 base framework (`.btn`, `.btn-primary`, `.container`)
- Animate.css library (78+ animations: bounceIn, fadeIn, slideIn, etc.)
- `fkt-` prefixed IDs, `fk-` prefixed classes
- FunnelKit collapsible FAQ: `fk-collapsible-list-*` class pattern
- `data-box="true"` attributes on elements
- Dynamic pricing via JavaScript template literals
- Heavy use of `!important` on inline styles
- Pricing injected via JS: `${product.price}`, `${globalCurrency.symbol}`
- SmoothSpire adds: Swiper carousel, Font Awesome 6, custom area classes (`.hero-area`, `.video-area`)
- Trustpilot integration (SmoothSpire)

### Webflow-style (int- prefix) - Tryemsense (EN/DE/NL), Tryledisa (EN/HaloGrow), Checkout-Tryledisa
- Custom CSS with `int-` prefixed classes: `.int-section`, `.int-review`, `.int-btn`
- Clean grid layouts using `display: flex` and CSS Grid
- Responsive with clear mobile overrides
- Geo-targeted banners (`.uk-banner`, `.de-banner`, `.nl-banner`)
- Sentient font family for headings (Tryledisa), Bitter Variable + Manrope (Tryemsense)
- FAQ accordion: `faq-accordion`, `faq-accordion-item`, `faq-accordion-toggle`
- Countdown timer: `int-70-off-countdown-wrapper`, `countdown-timer`
- Sticky CTA: `int-sticky-cta` with brand logo, divider, stars
- Checkout variant: expanded color system with `#EC0B43` urgency red, `#1264E8` link blue

### Shopify + GemPages - Getheyfra (Product + Landing)
- Dawn theme CSS custom properties: `--color-base-*`, `--font-body-family`, `--buttons-radius`
- GemPages builder: `gf_*` prefixed classes, `gpo-` on elements
- GemPages custom colors: `--gf_gs-color*-brand/neutral/accent`
- Montserrat font (body + headings)
- Pill-shaped buttons: `--buttons-radius: 40px`, `--inputs-radius: 40px`
- Text box radius: `24px`, media radius: `12px`
- Star rating: `--lxs-rating-icon-color: #EBBF20`
- `gf_add-to-cart` button classes
- `gf_restabs` for FAQ accordion
- `count-down` module for countdown timer

### Shopify + Custom Theme - PrimalQueen
- Dawn theme CSS custom properties: `--color-background`, `--color-foreground`, `--color-button`
- Tailwind CSS blocks integrated with Shopify sections
- Inter font family (body + headings)
- Custom block variables: `--db-bg-color`, `--db-heading-color`, `--title-color`
- Button height CSS variables: `--button-height: 70px`, `--button-height-mobile: 70px`
- Title font size responsive: `--title-font-size-desktop: 52px`, `--title-font-size-tablet: 34px`, `--title-font-size-mobile: 27px`
- CTA button: `bg-[#00ad21]` green, uppercase, bold
- FAQ: `border: 3px solid #2f0147`, `border-radius: 8px`, `font-weight: 800`
- 24 Shopify sections: `shopify-section-template--*`
- Countdown header with hearts decoration
- Buy box with quantity selector
