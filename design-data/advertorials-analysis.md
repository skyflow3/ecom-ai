# ADVERTORIAL PAGES ANALYSIS - 18 Winning DTC Pages

Generated: 2026-05-08
Source: 18 real winning DTC advertorial HTML pages

---

## 1. OVERVIEW - PAGE TEMPLATES & BUILDERS

### Builder Types Identified

| Builder | Pages | Products |
|---------|-------|----------|
| **Webflow** (Funnel Builder Pro cloned) | 10 pages | tryemsense (x5), tryledisa-anglais, halogrow-germany, halogrow-anglais, rejuvacare, rejuvera, clarifion |
| **Flikt/FunnelKit** (WordPress-based page builder) | 5 pages | smoothspire, vibriance, drivse, allfemale, particulemen |
| **Replo** (Shopify native) | 1 page | tryledisa-11m |
| **Tailwind/Next.js** (custom) | 1 page | oricle |
| **Custom HTML** | 1 page | particulemen (mixed) |

### Page Template Clusters

**Cluster A - Webflow "adv-him" template** (8 pages share identical CSS):
- tryemsense-7m, tryemsense-2-7m, tryemsense-adv1, tryemsense-adv2, tryemsense-adv3
- tryledisa-anglais, halogrow-germany, halogrow-anglais
- All share: `.adv-him-*` class naming, identical color palette (#02122e, #00c249, #0e0f11)

**Cluster B - Flikt builder** (4 pages share same inline color system):
- smoothspire, vibriance, drivse, allfemale
- All share: Tailwind-style inline colors (#111827, #16a34a, #10b981, #f59e0b)

**Cluster C - Webflow "rejuvacare" template** (2 pages):
- rejuvacare, rejuvera
- Share: `.heading`, `.container`, `.button` pattern, green theme (#12ab88, #14b691)

---

## 2. PAGE STRUCTURE - MOST COMMON FLOW

Based on 18 pages, the MOST COMMON section order (top to bottom):

```
1.  SALE BANNER / TOP BAR          (15/18 pages) - Sticky or fixed top banner
2.  LOGO HEADER / NAVBAR           (13/18 pages) - Simple logo, sometimes with nav
3.  BREADCRUMB / CATEGORY LABEL    (6/18 pages)  - "Health > Wellness > ..."
4.  AUTHOR BYLINE + DATE           (11/18 pages) - "By [Name] | Updated [Date]"
5.  HERO HEADLINE (H1)             (18/18 pages) - Large, attention-grabbing
6.  HERO IMAGE / VIDEO             (14/18 pages) - Featured media
7.  BODY TEXT - Problem Section     (18/18 pages) - Pain point narrative
8.  INLINE CTA BUTTON              (14/18 pages) - First CTA after problem
9.  BODY TEXT - Solution Section    (18/18 pages) - Product introduction
10. BENEFIT / FEATURE LIST          (12/18 pages) - Bulleted benefits
11. IMAGE GALLERY / PROOF           (17/18 pages) - Before/after or product shots
12. INLINE CTA BUTTON              (14/18 pages) - Second CTA mid-article
13. TESTIMONIALS / REVIEWS         (11/18 pages) - Customer quotes
14. NUMBERED LIST / REASONS        (13/18 pages) - "5 Reasons Why..." pattern
15. COMPARISON TABLE               (9/18 pages)  - Product vs competitors
16. BEFORE/AFTER SECTION           (8/18 pages)  - Visual transformation
17. SOCIAL PROOF / EXPERT QUOTES   (13/18 pages) - Doctor/expert endorsement
18. GUARANTEE / WARRANTY           (12/18 pages) - Money-back badge
19. URGENCY / COUNTDOWN            (14/18 pages) - Limited stock/timer
20. PRICING / BUNDLE CARDS         (varies)      - At bottom or sidebar
21. FAQ SECTION                    (varies)      - Accordion-style
22. FOOTER / DISCLAIMERS           (18/18 pages) - Legal, links, copyright
23. MOBILE STICKY BAR              (14/18 pages) - Fixed bottom CTA on mobile
```

### Section Frequency Table

| Section | Frequency | Percentage |
|---------|-----------|------------|
| Hero Headline (H1) | 18/18 | 100% |
| Body Text | 18/18 | 100% |
| Image Gallery (10+ images) | 17/18 | 94% |
| Sale Banner/Top Bar | 15/18 | 83% |
| Video Embed | 14/18 | 78% |
| CTA Button | 14/18 | 78% |
| Countdown/Urgency | 14/18 | 78% |
| Logo Header | 13/18 | 72% |
| Social Proof/Expert | 13/18 | 72% |
| Numbered List | 13/18 | 72% |
| Benefit List | 12/18 | 67% |
| Guarantee Badge | 12/18 | 67% |
| Testimonials | 11/18 | 61% |
| Author Byline | 11/18 | 61% |
| Comparison Table | 9/18 | 50% |
| Date/Published | 9/18 | 50% |
| Before/After | 8/18 | 44% |
| Breadcrumb | 6/18 | 33% |
| Sticky Bar | 3/18 | 17% |
| Popup/Modal | 2/18 | 11% |

---

## 3. EXACT CSS VALUES BY SECTION TYPE

### 3A. SALE BANNER / TOP BAR

**Webflow template (Cluster A):**
```css
.sale-banner-wrapper {
  /* Full width, sits above everything */
}
.sale-banner-3 {
  /* Hidden by default via w-condition-invisible */
}
.container-3.sale-banner-container {
  /* Contains left/right split */
}
.sale-banner-usp {
  /* Individual USP items */
}
```

**Rejuvacare template (Cluster C):**
```css
.section {
  background-color: #14b691;
  padding-top: 12px;
  padding-bottom: 12px;
}
.text-block {
  color: #fff;
  text-align: center;
  font-family: Roboto, sans-serif;
  font-size: 20px;
  font-weight: 700;
}
```

**Flikt builder (Cluster B):**
```css
/* Inline styles */
background-color: #f59e0b; /* Amber */
color: #111827;
font-size: 0.875rem;
padding: 0.25rem 1rem;
text-align: center;
```

**Common pattern:** Full-width colored bar, white or dark text, 12px padding top/bottom, centered text, bold font.

---

### 3B. LOGO HEADER / NAVBAR

**Webflow template (Cluster A):**
```css
.adv-navbar {
  padding-top: 8px;
  padding-bottom: 8px;
}
/* Contains adv-logo-wrapper > adv-logo + adv-logo-caption */
```

**Clarifion:**
```css
.header {
  width: 100%;
  height: auto;
  border-bottom: 2px solid #ccc;
}
.brand-flex {
  display: flex;
  padding-top: 15px;
  padding-bottom: 15px;
  justify-content: space-between;
  align-items: center;
}
.logo {
  display: block;
  width: 160px;
}
```

**Rejuvacare:**
```css
.container {
  color: #212529;
  max-width: 1000px;
}
```

**Common pattern:** Simple row, logo left (120-160px width), optional nav right, border-bottom 1-2px solid #ccc, padding 8-15px vertical.

---

### 3C. HERO HEADLINE (H1)

**Webflow template (Cluster A):**
```css
.adv-heading-1-5r {
  color: #02122e;
  margin-top: 0;
  margin-bottom: 0;
  font-family: "Open Sans", sans-serif;
  font-size: 40px;
  font-weight: 800;
  line-height: 48px;
}
/* Mobile: font-size reduces to ~28px, line-height: 36px */
```

**Rejuvacare:**
```css
.heading {
  margin-top: 0;
  margin-bottom: 10px;
  font-family: Montserrat, sans-serif;
  font-size: 36px;
  font-weight: 800;
  line-height: inherit;
}
/* Mobile (max-width: 767px): font-size: 24px, line-height: 35px */
```

**Clarifion:**
```css
.heading-title {
  width: 100%;
  margin: 25px auto;
  font-family: "Open Sans", sans-serif;
  color: #222;
  font-size: 34.666px;
  line-height: 44px;
  font-weight: 400;
  text-align: center;
  letter-spacing: -1px;
}
```

**Oricle (Tailwind):**
```css
/* H2 in markdown content */
font-size: 1.875rem; /* 30px */
line-height: 2.25rem; /* 36px */
font-weight: 700;
line-height: 1.375;
color: rgb(0, 0, 0);
margin-top: 3rem;
margin-bottom: 1rem;
```

**Tryledisa (Replo/Shopify):**
```css
font-family: "Filson Pro Black", sans-serif;
font-size: 22px;
font-weight: 800;
color: #000000FF;
```

| Property | Desktop Range | Mobile Range | Most Common |
|----------|--------------|--------------|-------------|
| Font size | 30-42px | 22-28px | 36-40px desktop, 24px mobile |
| Font weight | 700-800 | 700-800 | 800 |
| Line height | 44-48px | 33-36px | 48px desktop |
| Color | Dark (#02122e, #222, #000) | Same | #02122e or #222 |
| Font family | Open Sans, Montserrat, Poppins | Same | Open Sans / Montserrat |
| Text align | Left or center | Left | Left (editorial) or center (magazine) |

---

### 3D. AUTHOR BYLINE

**Webflow template (Cluster A):**
```css
.adv-author-wrapper {
  grid-column-gap: 12px;
  grid-row-gap: 12px;
  justify-content: flex-start;
  align-items: center;
  display: flex;
}
.adv-author-image-33 {
  /* Author photo */
}
.adv-author-separator {
  /* Divider between author and date */
}
.adv-author-name {
  /* Author name text */
}
```

**Clarifion:**
```css
.author {
  max-width: 316px;
  margin: 15px auto;
  padding-top: 10px;
  border-top: 1px solid #ccc;
  color: #555;
  font-size: 14.5px;
  font-weight: 400;
  text-align: center;
  letter-spacing: -0.3px;
}
```

**Common pattern:** Flex row, avatar (30-40px) + name + separator + date. Font 14-16px, color #555 or #666. Border-top separator on some. Under headline.

---

### 3E. BODY TEXT / ARTICLE CONTENT

**Webflow template (Cluster A):**
```css
.adv-body-text {
  color: #02122e;
  margin-bottom: 0;
  font-family: "Open Sans", sans-serif;
  font-size: 20px;
  line-height: 26px;
}
.adv-body-text-2 {
  color: #17191c;
  margin-bottom: 0;
  font-family: "Open Sans", sans-serif;
  font-size: 18px;
  line-height: 24px;
}
.adv-body-text-3 {
  color: #00183a;
  margin-bottom: 0;
  font-family: "Open Sans", sans-serif;
  font-size: 16px;
  line-height: 24px;
}
```

**Clarifion:**
```css
body {
  background-color: #d5d4d0;
  font-family: "Open Sans", sans-serif;
  color: #333;
  font-size: 17px;
  line-height: 26px;
}
p {
  display: block;
  margin-top: 17px;
  margin-bottom: 17px;
  font-weight: 400;
}
```

**Rejuvacare:**
```css
:root {
  --bsc-fnt-sz: 18px;
  --bscfont-clr: #231f20;
}
.text-block-4 {
  color: #212529;
  font-family: Montserrat, sans-serif;
  font-size: var(--bsc-fnt-sz); /* 18px */
  font-weight: 500;
  line-height: 27px;
}
```

**Oricle (Tailwind markdown):**
```css
/* p, ul, ol, blockquote */
margin-top: 1rem;
margin-bottom: 1rem;
font-size: 20px;
line-height: 1.625;
```

| Property | Range | Most Common |
|----------|-------|-------------|
| Font size | 16-20px | 18-20px |
| Line height | 24-28px | 26px |
| Font weight | 400-500 | 400 |
| Color | #02122e, #333, #212529, #00183a | Dark near-black |
| Font family | Open Sans, Montserrat | Open Sans |

---

### 3F. CTA BUTTONS

**Webflow template (Cluster A) - MAIN CTA:**
```css
.adv-him-button {
  color: #fff;
  text-align: center;
  background-color: #47901a;  /* Green */
  border-radius: 8px;
  margin-left: auto;
  margin-right: auto;
  padding: 12px 24px;
  font-family: Poppins, sans-serif;
  font-size: 24px;
  font-weight: 700;
  line-height: 32px;
  text-decoration: none;
  transition: transform 0.2s ease-in-out, background-color 0.2s ease-in-out;
  display: block;
}
.adv-him-button:hover {
  background-color: #53a81e;
  transform: scale(1.05);
}
```

**Webflow template - VARIANT (5r button):**
```css
.adv-5r-btn {
  text-align: center;
  text-transform: uppercase;
  background-color: #00c249;  /* Bright green */
  border-radius: 8px;
  width: 100%;
  max-width: 410px;
  height: auto;
  padding: 16px;
  font-family: "Open Sans", sans-serif;
  font-size: 18px;
  font-weight: 800;
  line-height: 24px;
  transition: all 0.2s;
}
.adv-5r-btn:hover {
  background-color: #04a340;
}
```

**Rejuvacare:**
```css
.button {
  text-align: center;
  background-color: #12ab88;  /* Teal green */
  border-radius: 4px;
  width: 90%;
  margin: 10px 20px;
  padding: 20px 0;
  font-family: Montserrat, sans-serif;
  font-size: 30px;
  font-weight: 700;
}
```

**Clarifion - PRIMARY CTA:**
```css
.btn-primary {
  width: 100%;
  padding: 22px 10px;
  border: 2px solid #c2712c;
  border-radius: 8px;
  background-color: #f99035;  /* Orange */
  font-family: Roboto, sans-serif;
  font-size: 22px;
  line-height: 30px;
  font-weight: 700;
  text-align: center;
}
```

**Clarifion - INLINE CTA (green):**
```css
.cta-button {
  width: 100%;
  padding: 12px 20px;
  border-radius: 4px;
  background-color: #63d021;  /* Bright green */
  font-family: Roboto, sans-serif;
  color: #fff;
  font-size: 30px;
  line-height: 36px;
  font-weight: 700;
  text-align: center;
}
.cta-button:hover {
  background-color: #49a511;
}
```

**Drivse (Flikt builder):**
```css
/* Inline styles on buttons */
.btn {
  font-family: Barlow, sans-serif;
  font-size: 20px;
  text-align: center;
  line-height: 1;
  margin: 10px 0;
  padding: 15px 30px;
  background-color: #527535;  /* Olive green */
  box-shadow: none;
}
```

**Tryledisa (Replo):**
```css
/* CTA buttons in Replo */
background-color: #138B9CFF;  /* Teal */
color: #FFFFFFFF;
font-family: "Filson Pro Black", sans-serif;
font-size: 18px;
font-weight: 800;
```

#### CTA Button Summary Table

| Property | Green CTA | Orange CTA | Teal CTA |
|----------|-----------|------------|----------|
| Background | #47901a / #00c249 / #63d021 | #f99035 | #12ab88 / #138B9C |
| Hover | #53a81e / #04a340 / #49a511 | - | - |
| Text color | #fff | #fff | #fff |
| Font size | 18-30px | 22px | 18-30px |
| Font weight | 700-800 | 700 | 700-800 |
| Padding | 12-20px | 22px | 16-20px |
| Border radius | 4-8px | 8px | 4-8px |
| Width | 100% or max 410px | 100% | 90% |
| Hover effect | scale(1.05) + color shift | - | - |
| Transition | 0.2s ease | - | - |
| Text transform | sometimes uppercase | none | none |

---

### 3G. URGENCY / LIMITED OFFER BOX

**Webflow template:**
```css
.adv-him-limited {
  background-color: #fefbc3;  /* Yellow highlight */
  border: 2px dashed #d0021b;  /* Red dashed border */
  margin-bottom: 20px;
  padding: 12px;
}
.adv-him-limited-text {
  text-align: center;
  font-weight: 700;
}
.adv-him-limited-text-red {
  color: red;
}
```

**Pattern:** Yellow background (#fefbc3, #FEFCDF, #fefbd9), red dashed border (2px dashed #d0021b or #cb0a0a), centered bold text, 12px padding.

---

### 3H. HIGHLIGHT / EMPHASIS TEXT

**Webflow template:**
```css
.adv-him-h2-highlight {
  background-color: #fdcc5e;  /* Yellow marker highlight */
}
.adv-him-red-underline {
  color: red;
  text-decoration: underline;
}
.adv-him-img-caption {
  text-align: center;
  background-color: #fdcc5e;
  padding: 8px;
  font-size: 20px;
  line-height: 28px;
}
```

**Clarifion:**
```css
.heading {
  padding: 20px 20px 20px 55px;
  border-radius: 6px;
  background-color: #3c94f6;  /* Blue alert box */
  color: #fff;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}
```

**Pattern:** Yellow marker (#fdcc5e) for inline highlights, blue (#3c94f6) for alert/update boxes, red for urgency text.

---

### 3I. TESTIMONIALS

**Webflow template:**
```css
.adv-right-testimonial {
  grid-column-gap: 16px;
  grid-row-gap: 16px;
  flex-flow: column;
  display: flex;
}
.adv-testimonial {
  /* Individual testimonial card */
}
.adv-testimonial-a-wrapper {
  /* Author section: avatar + name */
}
.adv-testimonial-text-wrapper {
  /* Quote text */
}
```

**Clarifion (Facebook post style):**
```css
.facebook-post {
  max-width: 600px;
  margin: 30px auto;
  padding: 15px 20px 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.2);
}
.picture {
  width: 40px;
  height: 40px;
  margin-right: 8px;
  border-radius: 100%;
}
.name {
  color: #3658a6;
  font-size: 14px;
  font-weight: 700;
}
.post-text {
  color: #212121;
  font-size: 14px;
  line-height: 19px;
}
```

**Rejuvacare:**
```css
.grid-2 {
  grid-column-gap: 10px;
  grid-row-gap: 10px;
  border-radius: 15px;
  grid-template-columns: minmax(200px, 0.75fr) 1fr;
  padding: 10px;
  box-shadow: 0 1px 11.5px 10px #0003;
}
```

**Pattern:** Cards with 1px border or subtle shadow, avatar (40px circle), name (14px, blue #3658a6), quote text (14-16px). Max-width 600px. Border-radius 10-15px.

---

### 3J. MONEY-BACK GUARANTEE

**Webflow template:**
```css
.adv-money-back-block {
  grid-column-gap: 16px;
  grid-row-gap: 16px;
  background-color: #fffbef;  /* Warm off-white */
  border: 1px solid #fab73c;  /* Gold border */
  border-radius: 8px;
  justify-content: flex-start;
  align-items: center;
  padding: 16px;
  display: flex;
}
```

**Pattern:** Warm background (#fffbef), gold border (#fab73c), 8px radius, 16px padding, flex row with icon + text.

---

### 3K. STICKY BAR (Top/Bottom)

**Webflow template (ad11 variant):**
```css
.ad11-sticky {
  z-index: 1;
  color: #fff;
  background-color: #0e0f11;  /* Near black */
  padding-top: 12px;
  padding-bottom: 12px;
  position: sticky;
  top: 0;
}
```

**Mobile sticky button pattern:**
```css
.mobile-sticky-button {
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 999;
}
```

**Pattern:** Dark background (#0e0f11 or #1a1a1a), white text, sticky top or fixed bottom, 12px padding, z-index 1-999.

---

### 3L. LAYOUT CONTAINERS

**Webflow template - 2-column editorial layout:**
```css
.adv-him-layout {
  grid-column-gap: 12px;
  grid-row-gap: 12px;
  grid-template-columns: 1fr 300px;  /* Main + sidebar */
  grid-auto-columns: 1fr;
  align-items: start;
  display: grid;
}
.adv-him-container {
  max-width: 1100px;
}
.adv-left-column {
  flex-flow: column;
  width: 100%;
  max-width: 760px;
}
.adv-right-column {
  width: 100%;
  max-width: 352px;
}
/* On mobile: grid-template-columns collapses to 1fr */
```

**Clarifion - 2-column with sidebar:**
```css
.main {
  max-width: 1600px;
  margin: 0 auto;
  background-color: #fff;
  box-shadow: 0 0 7px 0 #000;
}
.advert-body {
  display: flex;
  justify-content: space-between;
}
.left-content {
  width: 100%;
  max-width: 800px;
}
.sidebar {
  width: 100%;
  max-width: 300px;
  margin-left: 20px;
}
.container {
  max-width: 1250px;
  padding: 0 5px;
}
```

**Rejuvacare:**
```css
.container {
  max-width: 1000px;
}
.container-2 {
  max-width: 1200px;
}
```

**Flikt builder:**
```css
.section {
  margin-top: var(--spacing-sections-mobile);
  /* Desktop: var(--spacing-sections-desktop) */
}
.page-width {
  max-width: var(--page-width);
  margin: 0 auto;
  padding: 0 1.5rem;
}
```

| Property | Range | Most Common |
|----------|-------|-------------|
| Max width (content) | 760-1100px | 1000-1100px |
| Max width (full page) | 1200-1600px | 1250px |
| Sidebar width | 280-352px | 300px |
| Grid gap | 12-20px | 12px |
| Padding (mobile) | 16-20px | 16px |

---

### 3M. FOOTER

**Webflow template:**
```css
.adv-footer-links {
  grid-column-gap: 8px;
  flex-flow: wrap;
  justify-content: center;
}
.adv-footer-link {
  color: #337ab7;
  text-transform: uppercase;
  font-family: "Open Sans", sans-serif;
  font-weight: 700;
  text-decoration: none;
}
.adv-footer-disclaimer {
  color: rgba(0, 0, 0, 0.5);  /* Semi-transparent black */
  text-align: center;
  max-width: 1100px;
  margin: 0 auto;
}
```

**Clarifion:**
```css
.footer {
  padding: 20px 0;
  background-color: #5a787c;  /* Muted teal */
  font-family: Roboto, sans-serif;
  color: #fff;
  font-size: 14px;
  text-align: center;
}
```

**Pattern:** Centered links (uppercase, 14px, blue #337ab7), disclaimer below (50% opacity black text), optional colored background. Simple, minimal.

---

### 3N. QUOTE / BLOCKQUOTE

**Clarifion:**
```css
.quote-item {
  margin: 20px 0 20px 40px;
  padding: 20px 20px 20px 40px;
  border-left: 10px solid #ccc;
  background-color: #f9f9f9;
  font-size: 16px;
  line-height: 24px;
}
```

**Oricle (Tailwind):**
```css
blockquote {
  border-left: 2px solid #333;
  background-color: #f3f4f6;
  padding: 1rem;
}
```

**Pattern:** Left border (2-10px solid #ccc or #333), light background (#f9f9f9 or #f3f4f6), 16-20px text, padding 10-20px.

---

### 3O. VIDEO EMBED

**Webflow template:**
```css
.adv-him-embeded-video-container {
  aspect-ratio: 16/9;
  width: 100%;
  height: auto;
}
.responsive-video-link {
  display: block;
  width: 100%;
  height: 400px;       /* Desktop */
  overflow: hidden;
}
@media (max-width: 768px) {
  .responsive-video-link {
    height: 250px;     /* Mobile */
  }
}
```

**Pattern:** 16:9 aspect ratio, full-width, 400px desktop / 250px mobile, overflow hidden.

---

## 4. CROSS-PAGE COLOR PALETTES

### 4A. Color Palette by Template Cluster

**Cluster A (Webflow adv-him - tryemsense/tryledisa/halogrow):**
| Role | Color | Hex |
|------|-------|-----|
| Background (page) | White | #FFFFFF |
| Background (main content) | White | #FFFFFF |
| Background (dark sections) | Near black | #0e0f11 |
| Text (primary) | Dark navy | #02122e |
| Text (secondary) | Dark blue | #00183a |
| Text (light) | Light gray | #333 / #666 |
| CTA (primary green) | Green | #47901a / #00c249 |
| CTA (hover green) | Darker green | #53a81e / #04a340 |
| Link color | Blue | #00e / #0082f3 |
| Highlight (yellow) | Marker yellow | #fdcc5e |
| Urgency (red) | Red | #d0021b |
| Alert border (gold) | Gold | #fab73c |
| Guarantee bg | Warm white | #fffbef |
| Limited offer bg | Yellow | #fefbc3 |
| Guarantee border | Gold | #fab73c |

**Cluster B (Flikt - smoothspire/vibriance/drivse/allfemale):**
| Role | Color | Hex |
|------|-------|-----|
| Background (page) | White | #FFFFFF |
| Text (primary) | Dark gray | #111827 |
| Text (secondary) | Medium gray | #4b5563 / #6b7280 |
| Text (light) | Light gray | #9ca3af / #999 |
| CTA (green) | Emerald | #10b981 / #16a34a |
| CTA (green dark) | Dark green | #166534 |
| CTA (blue) | Blue | #2563eb |
| CTA (orange) | Amber | #f59e0b |
| Background (green tint) | Light green | #dcfce7 / #f0fdf4 |
| Background (green CTA) | Dark olive | #527535 |

**Cluster C (Webflow rejuvacare/rejuvera):**
| Role | Color | Hex |
|------|-------|-----|
| Background (page) | White | #FFFFFF |
| Top bar bg | Teal green | #14b691 |
| Text (primary) | Dark | #212529 |
| Text (secondary) | Dark | #231f20 |
| CTA button | Teal | #12ab88 |
| Highlight (red) | Red | #cb0a0a |
| Number accent | Teal | #14b691 |
| Image radius | Rounded | 10px |

**Clarifion (unique template):**
| Role | Color | Hex |
|------|-------|-----|
| Background (page) | Gray | #d5d4d0 |
| Background (content) | White | #fff |
| Text (primary) | Dark gray | #333 |
| Text (headings) | Near black | #17191c / #222 |
| CTA (orange) | Orange | #f99035 |
| CTA border | Brown-orange | #c2712c |
| CTA (green inline) | Green | #63d021 |
| Alert box | Blue | #3c94f6 |
| Link | Blue | #205cc3 |
| Footer bg | Muted teal | #5a787c |
| Facebook name | Facebook blue | #3658a6 |

**Oricle (Tailwind/Next.js):**
| Role | Color | Hex |
|------|-------|-----|
| Background | Light gray | #f5f5f5 |
| Text (primary) | Black | #000 |
| Text (strong) | Dark gray | #333 |
| Link | Blue | #2563eb / #1e40af |
| Blockquote bg | Light gray | #f3f4f6 |
| Blockquote border | Dark | #333 |
| Button bg | Blue | #459ef7 / #59797c |

**Tryledisa (Replo/Shopify):**
| Role | Color | Hex |
|------|-------|-----|
| Background | Black | #000000FF |
| Text | White | #FFFFFFFF |
| CTA | Teal | #138B9CFF |
| Font heading | Filson Pro Black | - |
| Font body | Be Vietnam Pro / Inter | - |

---

### 4B. Universal Color Patterns (Across ALL 18 Pages)

| Color Role | Most Common Hex | Frequency |
|------------|----------------|-----------|
| Page background | #FFFFFF (white) | 17/18 |
| Primary text | #000/#111827/#02122e/#333 | 18/18 |
| Secondary text | #555/#666/#6b7280 | 16/18 |
| CTA green | #00c249/#47901a/#63d021/#10b981 | 15/18 |
| Link blue | #337ab7/#0082f3/#2563eb | 14/18 |
| Highlight yellow | #fdcc5e/#fefbc3 | 12/18 |
| Urgency red | #d0021b/#cb0a0a/#F10000 | 14/18 |
| Alert blue | #3c94f6/#3b97c8 | 6/18 |
| CTA orange | #f99035 | 2/18 |
| Footer dark | #5a787c/#0e0f11 | 8/18 |

---

## 5. TYPOGRAPHY PATTERNS

### 5A. Font Family Usage

| Font Family | Pages | Role |
|-------------|-------|------|
| **Open Sans** | 10+ | Body text, headings (most common overall) |
| **Montserrat** | 6 | Headings, buttons |
| **Poppins** | 6 | Headings, UI elements |
| **Roboto** | 4 | Body text, buttons, UI |
| **Inter** | 4 | Body text |
| **Manrope** | 5 | Headings (Webflow template) |
| **Barlow** | 2 | Buttons (drivse) |
| **Filson Pro** | 2 | Headings (Replo/tryledisa) |
| **Oswald** | 1 | Sub-headings (clarifion) |
| **Lato** | 1 | Body (vibriance) |
| **Bitter** | 5 | Accent (Webflow template variant) |
| **Sentient** | 3 | Body (halogrow/tryledisa variant) |

### 5B. Typography Scale

| Element | Desktop Size | Mobile Size | Weight | Line Height |
|---------|-------------|-------------|--------|-------------|
| H1 (Hero) | 36-42px | 22-28px | 800 | 44-48px |
| H2 (Section) | 24-30px | 20-24px | 700 | 32-36px |
| H3 (Subsection) | 22-26px | 18-21px | 700 | 28-33px |
| H4 (Minor heading) | 18-22px | 16-18px | 600-700 | 24-28px |
| Body text | 16-20px | 16-18px | 400-500 | 24-28px |
| Small text / caption | 12-14px | 12-13px | 400 | 15-20px |
| CTA button | 18-30px | 18-24px | 700-800 | 24-32px |
| Author byline | 14-16px | 14px | 400 | 20-24px |
| Footer text | 12-14px | 12px | 400 | 15-20px |
| Testimonial text | 14-16px | 14px | 400 | 19-24px |

### 5C. Font Weight Usage

| Weight | Name | Usage |
|--------|------|-------|
| 400 | Regular | Body text, descriptions |
| 500 | Medium | Body text (some templates) |
| 600 | Semi-Bold | Sub-headings |
| 700 | Bold | Headings, CTAs, emphasis |
| 800 | Extra-Bold | Hero H1, CTA buttons, key headings |
| 900 | Black | Rare, only Replo template |

---

## 6. SPACING & LAYOUT VALUES

### 6A. Padding Values

| Element | Padding | Most Common |
|---------|---------|-------------|
| Section (vertical) | 32-50px top/bottom | 32px |
| Section (horizontal) | 16-20px sides | 16px mobile, variable desktop |
| Container (horizontal) | 0-50px sides | 20px |
| CTA button | 12-22px vert, 20-30px horiz | 15px 30px |
| Card | 15-20px all | 20px |
| Footer | 20px top/bottom | 20px |
| Image caption | 8px | 8px |
| Alert box | 20px | 20px |
| Author byline | 10px top | 10px |

### 6B. Margin Values

| Element | Margin | Most Common |
|---------|--------|-------------|
| Between sections | 20-60px bottom | 20-30px |
| H1 bottom | 0-15px | 10px |
| H2 bottom | 10-15px | 10px |
| Paragraph | 0-17px top/bottom | 10-17px |
| Image | 20-30px bottom | 20px |
| CTA block | 20px bottom | 20px |
| Testimonial | 20-30px bottom | 20px |

### 6C. Layout Max-Widths

| Container | Max Width |
|-----------|-----------|
| Full page wrapper | 1200-1600px |
| Content area (2-col) | 1100-1250px |
| Content area (1-col) | 760-1000px |
| Sidebar | 280-352px |
| CTA button | 410px (when max-width set) |
| Testimonial card | 600px |
| Author block | 316px |

---

## 7. BORDERS & SHADOWS

### 7A. Border Radius Values

| Element | Border Radius |
|---------|--------------|
| CTA button | 4-8px |
| Card (testimonial) | 10-15px |
| Image | 10px |
| Avatar | 50% (circle) or 100% |
| Alert box | 6px |
| Video embed | 0px (or inherited) |
| Guarantee block | 8px |
| Mobile sticky bar | 0px |
| Badge/pill | 9999px (pill shape) |
| Footer links | 0-4px |

### 7B. Border Patterns

| Element | Border |
|---------|--------|
| Header bottom | 1-2px solid #ccc |
| Author byline top | 1px solid #ccc |
| Urgency box | 2px dashed #d0021b |
| Guarantee | 1px solid #fab73c |
| CTA (clarifion) | 2px solid #c2712c |
| Testimonial card | 1px solid #ccc |
| Blockquote left | 2-10px solid #ccc or #333 |
| Update box | 2px dashed #cecece |

### 7C. Box Shadows

| Element | Box Shadow |
|---------|-----------|
| Page wrapper | 0 0 7px 0 #000 |
| Testimonial card | 0 0 6px 0 rgba(0,0,0,0.2) |
| Pricing card | 0 1px 11px 10px rgba(0,0,0,0.2) |
| CTA button | none (most common) |
| Urgency box | none |

---

## 8. ANIMATIONS & INTERACTIONS

### 8A. Animation Catalog (from @keyframes)

**Webflow template animations:**
- CTA hover: `transform: scale(1.05)` + `background-color` transition (0.2s ease)
- Button transitions: `transition: all 0.2s` or `transition: transform 0.2s ease-in-out, background-color 0.2s ease-in-out`
- Fade-in elements: Webflow's built-in `w--animate` classes

**Flikt builder animations:**
- Font Awesome animate.css: `animate.css v3.7.2` (bounce, fadeIn, slideIn)
- Countdown timer animations (CSS-based)

### 8B. Hover States

| Element | Hover Effect |
|---------|-------------|
| CTA button | Background darkens (#47901a -> #53a81e), slight scale(1.05) |
| Links | Color change (underline on some) |
| Testimonial cards | None |
| Images | None (pointer-events: none on some) |

---

## 9. RESPONSIVE BREAKPOINTS

### 9A. Breakpoint Usage by Template

**Webflow template (Cluster A):**
- Desktop: > 768px (2-column layout)
- Mobile: <= 768px (1-column, sidebar hidden or moved below)

**Rejuvacare (Cluster C):**
- Desktop: > 991px
- Tablet: 768-991px
- Mobile: < 767px

**Flikt builder (Cluster B):**
- Desktop: > 1024px
- Tablet: 600-1024px
- Mobile: < 600px

**Oricle (Tailwind):**
- sm: >= 640px
- md: >= 768px
- lg: >= 1024px
- xl: >= 1280px
- 2xl: >= 1536px

### 9B. Mobile-First Changes

| Property | Desktop | Mobile |
|----------|---------|--------|
| Layout | 2-column grid (1fr 300px) | 1-column stack |
| H1 size | 36-42px | 22-28px |
| H2 size | 24-30px | 20-24px |
| Body text | 18-20px | 16-18px |
| Container padding | 0-50px sides | 16-20px sides |
| Video height | 400px | 250px |
| Sidebar | Visible (300px) | Hidden or below content |
| CTA button | 24px font | 20px font |
| Sticky bar | Hidden | Visible (fixed bottom) |
| Image gallery grid | 2 columns | 1 column |
| Number list font | 73px | 50px |

---

## 10. PAGE-SPECIFIC ANALYSIS

### Page 1: advertorial-smoothspire.html
- **Builder:** Flikt (WordPress-based)
- **Size:** 632 KB
- **Theme:** Health/wellness product
- **Colors:** Multi-color editorial (blues, greens, oranges)
- **Layout:** Full-width sections with inline styled elements
- **Key CSS:** Open Sans + Montserrat fonts, #E1662D orange accents, #0D8390 teal
- **Structure:** Logo header > Hero headline > Author > Body sections > Footer

### Page 2: advertorial vibriance.html
- **Builder:** Flikt (WordPress-based)
- **Size:** 579 KB
- **Theme:** Beauty/skincare
- **Colors:** Pink (#ec489e, #d983a6) + neutral grays
- **Key CSS:** Helvetica/Lato fonts, pink brand color, animate.css animations
- **Structure:** Standard Flikt layout with play button video overlay

### Page 3: advertorial-rejuvacare.html
- **Builder:** Webflow
- **Size:** 143 KB
- **Theme:** Health patches
- **Colors:** Teal green (#14b691, #12ab88), red highlights (#cb0a0a)
- **Key CSS:** Montserrat font family, CSS variables (--mb: 20px, --bsc-fnt-sz: 18px), 10px image radius
- **Structure:** Green top bar > Breadcrumb > Hero > Numbered list > Grid comparison > CTA > Guarantee > Footer

### Page 4: advertorial-reason-why-allfemale.html
- **Builder:** Flikt (WordPress-based)
- **Size:** 1133 KB (largest)
- **Theme:** Women's health supplement
- **Colors:** Tailwind palette (#111827, #16a34a, #10b981)
- **Key CSS:** Uses quiz progress wrapper, scraped container pattern
- **Structure:** Quiz-style progress bar > Main content > Footer

### Page 5-6: advertorial-7m-tryemsense.html / advertorial-2-7m-tryemsense.html
- **Builder:** Webflow (identical template, different content variants)
- **Size:** 271-279 KB
- **Theme:** EMS muscle stimulator
- **Colors:** Dark navy (#02122e, #00183a), green CTA (#47901a, #00c249), near-black (#0e0f11)
- **Key CSS:** `.adv-him-*` naming, `.adv-5r-*` variant, Open Sans + Poppins fonts
- **Structure:** Sale banner > Navbar > 2-column (content + sidebar) > CTA > Testimonials > Money-back > Footer > Mobile sticky

### Page 7: advertorial-drivse-reason-why.html
- **Builder:** Flikt (WordPress-based)
- **Size:** 375 KB
- **Theme:** Automotive/tech product
- **Colors:** Green theme (#527535, #10b981, #16a34a), dark (#111827, #121212)
- **Key CSS:** Barlow + Montserrat + Roboto fonts, section-based layout with .el-XXXXX IDs
- **Structure:** Multi-section page builder with timer containers and product bundles

### Page 8: advertorial-reason-why-rejuvera.html
- **Builder:** Webflow (identical to rejuvacare template)
- **Size:** 143 KB
- **Colors:** Same teal green palette as rejuvacare
- **Structure:** Same template, different product content

### Page 9: advertorial-reason-why-oricle.html
- **Builder:** Custom (Tailwind CSS)
- **Size:** 708 KB
- **Theme:** Hearing aid product
- **Colors:** Blue (#459ef7, #2563eb), gray (#f5f5f5), white, black
- **Key CSS:** Full Tailwind utility classes, Inter font, markdown-rendered content
- **Structure:** Sticky sidebar + main content area, blog-style layout, custom markdown renderer

### Page 10: advertorial-particulemen.html
- **Builder:** Custom/WordPress mixed
- **Size:** 447 KB
- **Theme:** Men's hair product
- **Colors:** Deep blue (#0038AF, #030b2e, #040446), clean white
- **Key CSS:** Prompt + Inter + Open Sans fonts, landing-page_wrapper pattern
- **Structure:** Author section > Content sections > Countdown > Reviews > Product bundles

### Page 11: advertorial-clarifion.html
- **Builder:** Webflow
- **Size:** 182 KB
- **Theme:** Air purifier/ionizer
- **Colors:** Orange CTA (#f99035), blue alerts (#3c94f6), green inline CTA (#63d021), gray page bg (#d5d4d0)
- **Key CSS:** Open Sans + Roboto + Oswald fonts, 2-column layout with sidebar, Facebook-style testimonials
- **Structure:** Header > Headline > Author > Body (with sidebar) > CTA > Facebook posts > Order form > Footer

### Page 12: advertorial-tryledisa-11m.html
- **Builder:** Replo (Shopify)
- **Size:** 1469 KB (second largest)
- **Theme:** Wellness patches
- **Colors:** Black bg (#000000FF), white text, teal CTA (#138B9CFF)
- **Key CSS:** Filson Pro + Be Vietnam Pro + Inter fonts, scoped Replo .r-* classes, Shopify theme variables
- **Structure:** Full Replo page (header/footer hidden), listicle-style content, product bundles

### Page 13: advertorial-anglais tryledisa.html
- **Builder:** Webflow (same as tryemsense cluster)
- **Size:** 272 KB
- **Colors:** Same dark navy + green palette as tryemsense
- **Structure:** Same template structure

### Pages 14-16: 7m tryemsense advertorial 1/2/3
- **Builder:** Webflow (identical template, 3 variants)
- **Size:** 271-277 KB
- **Colors:** Same Cluster A palette
- **Structure:** Same template, A/B/C test variants

### Page 17: advertorial-germany.html (halogrow)
- **Builder:** Webflow (tryledisa variant)
- **Size:** 273 KB
- **Colors:** Same Cluster A palette
- **Notes:** German language version

### Page 18: advertorial-anglais tryledisa.html (halogrow)
- **Builder:** Webflow (tryledisa variant)
- **Size:** 272 KB
- **Colors:** Same Cluster A palette
- **Notes:** English language version

---

## 11. DESIGN SYSTEM SUMMARY

### The "Winning Advertorial" Design Formula

Based on analyzing all 18 winning pages, the consistent design pattern is:

**LAYOUT:** Single-column editorial (mobile) with optional 300px sidebar (desktop). Max-width 1000-1100px for content. Clean white background.

**TYPOGRAPHY:** Sans-serif stack (Open Sans > Montserrat > Poppins). H1 at 36-40px/800 weight desktop, 24px mobile. Body at 18-20px/400 weight. CTA at 20-30px/700-800 weight.

**COLOR SYSTEM:**
- Background: White (#FFFFFF)
- Text: Near-black (#02122e / #111827 / #333)
- CTA: Green (#47901a or #00c249) - used on 15/18 pages
- Links: Blue (#337ab7 or #0082f3)
- Highlights: Yellow (#fdcc5e)
- Urgency: Red (#d0021b dashed border)
- Alert/Update: Blue (#3c94f6)

**CTA PATTERN:** Full-width green button, 8px radius, white bold text, hover darkens + slight scale. Appears 3-5 times throughout the page.

**URGENCY:** Yellow background (#fefbc3) box with red dashed border, centered bold text. Placed near CTAs.

**SOCIAL PROOF:** Avatar (40px circle) + name + quote. Facebook-post style cards with 1px border and subtle shadow.

**MOBILE:** Everything stacks to 1-column, font sizes reduce 30-40%, sticky bottom CTA appears, sidebar disappears.

**GUARANTEE:** Warm off-white (#fffbef) box with gold border (#fab73c), 8px radius, flex row with icon.
