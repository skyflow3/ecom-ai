# VSL, Thank You & Landing Pages Analysis

## Summary
- Total pages analyzed: 15 (5 original + 2 comparison + 6 HaloGrow + 9 EmSense)
- VSL pages: 2 (Emma Relief VSL, ProstaVive VSL)
- Thank You pages: 2 (Vibriance, SmoothSpine)
- Landing page: 1 (GetHeyFra / Total Relief)
- Advertorial comparison: 1 (SmoothSpine advertorial)
- HaloGrow (Webflow): 2 advertorials (EN/DE), 2 product pages (EN/DE), 2 checkouts (EN/DE)
- EmSense (Webflow): 3 advertorials (EN), 3 checkouts (EN/DE/NL), 3 sale pages (EN/DE/NL)

---

## Page-by-Page Analysis

### PAGE 1: VSL1 - Emma Relief VSL

**Brand**: Emma Relief (Gut Health / Probiotic)
**Page Type**: VSL (Video Sales Letter)
**Source URL**: resetdigestion.com / emmarelief.com
**Font Stack**: 'myriad-pro' (custom hosted), Inter, Work Sans
**Page Width**: max-width: 1440px (.maxwidth)

#### Page Structure (Top to Bottom)

1. **Top Band** - Background color bar
2. **Video Section** - Wistia embedded video with click-for-sound overlay
3. **Important Message** - Sound-on notice with charm icon
4. **Doctor Credibility** - Dr. Gina Sam photo + credentials (desktop sidebar)
5. **IMPORTANT: Sound Notice** (desktop + mobile variants)
6. **Green Arrow Down** - Appears after video plays (afterdrop)
7. **Order Section** - 3 pricing columns (desktop: side by side, mobile: stacked)
8. **Guarantee Section** - 90-day money back guarantee with badge
9. **Bonus: Lean Belly Shakes** - Free recipe book with multipack
10. **Testimonials** - "Your Story Can Be Next" - 4 customer stories (2x2 grid)
11. **Order Section (Repeat)** - Same pricing section repeated
12. **FAQ Section** - 7 accordion questions with green chevron toggles
13. **Supportive Studies** - Clinical studies references
14. **Footer** - Disclosure, links, copyright

#### Section Details

##### Section 1: Video Player Container
- **Container** (desktop): `.vidcont2` max-width: 840px, width: 100%
- **Container** (mobile): `.vidcont1` max-width: 573px, width: 100%
- **Click-for-sound overlay** (.clickforsound):
  - position: absolute; top: 50%; left: 50%
  - z-index: 9999; cursor: pointer
  - max-width: 1080px
  - transform: translate(-50%, -50%)
  - padding: 0 10px
- **Full-width video mode** (.fullwidth #vidcont):
  - width: 100%; max-width: unset
  - background-color: #000000f2
  - top: 0; left: 0; align-items: center
- **Aspect ratio**: Wistia videoFoam=true (responsive)

##### Section 2: "IMPORTANT" Sound Notice
- `.important`: font-family: 'myriad-pro'; font-weight: 700; font-size: 22px; color: #d0190d
- Desktop variant: text-[20px], max-w-[776px], m-auto, text-center
- Mobile variant: text-[16px], px-[5px]
- Charm sound icon: h-[16px] md:h-[24px], w-[16px] md:w-[24px]
- "IMPORTANT:" text in bold red (#d0190d)

##### Section 3: Doctor Credibility Sidebar (desktop only)
- `.ginaimage`: width: 120px (desktop) / 81.96px mobile / 147.2px md
- `.topgastro` badge: font-family: 'myriad-pro'; font-weight: 600; font-size: 16px; color: #fff; background-color: #e34134; border-radius: 2px
- `.doctorname`: font-family: 'myriad-pro'; font-weight: 700; font-size: 25.6px (desktop 32px); text-decoration-line: underline; color: #1c624d
- Doctor bio text: font-family: 'myriad-pro'; font-weight: 400; font-size: 18px; color: #000

##### Section 4: Green Arrow Down (appears after video plays)
- `.garrow`: width: 39px
- Appears via class `afterdrop d-none` (hidden initially, shown via JS)
- margin: auto; margin-top: 8px (mt-2) / 16px (mt-sm-4)

##### Section 5: Order/Pricing Section
- **Background**: `.bgcolor0A6050` background-color: #0a6050
- **Container**: `.supplydiv` max-width: 1200px, width: 100%
- **Layout**: 3-column grid (col-12 col-lg-4) on desktop, stacked on mobile

**Pricing Card Header (non-highlighted)**:
- `.orderheader9BE3C5`: background-color: #9be3c5; border-radius: 2px 2px 0 0; padding: py-3
- `.ordertitle`: font-family: 'myriad-pro'; font-weight: 900; font-size: 28px; color: #000
- `.orderdays`: font-family: 'myriad-pro'; font-weight: 600; font-size: 20px; color: #000
- `.numberofbottles`: font-weight: 400; font-size: 20px

**Pricing Card Header (highlighted/best value)**:
- `.orderheaderlinear`: background-color: #fbd262; background-image: url(bestvalue.png); background-repeat: no-repeat; background-position: left; background-size: contain; border-radius: 2px 2px 0 0
- Uses a "Most Popular" banner image

**Pricing Card Body**:
- `.bgcolorwhite`: background-color: #fff; border-radius: 0 0 2px 2px
- `.orderprice`: font-family: 'myriad-pro'; font-weight: 900; font-size: 55px; color: #000
- `.bottle`: font-family: 'myriad-pro'; font-weight: 600; font-size: 24px; color: #000
- `.shippingfee`: font-weight: 600; font-size: 16px; line-height: 100%; text-align: center
- `.oldprice`: font-family: Inter; font-weight: 600; font-size: 24px; color: #002c1e; text-decoration: line-through; text-decoration-color: red
- `.oldprice2`: font-family: Inter; font-weight: 800; font-size: 24px; color: #002c1e

**Product badges (checklist strips)**:
- `.orderchecklist1`: background-color: #dc3b3d (red - "BIGGEST DISCOUNT")
- `.orderchecklist2`: background-color: #146e54 (green - "FAST & FREE SHIPPING")
- `.orderchecklist3`: background-color: #3983d2 (blue - "LEAN BELLY SHAKES RECIPES")
- All: font-family: Inter; font-weight: 800; font-size: 16px; color: #fff; text-shadow: 0px 0px 2px rgba(0,0,0,.6); max-width: 315px

**CTA button**: Uses image-based CTA (CTA.png) + payment icons image below

##### Section 6: Guarantee Section
- **Background**: `.bgcolorF7F6F4` / `.bgcolorf7f6f4` background-color: #f7f6f4
- `.guaranteeddiv`: border: 8px solid #000; background-color: #fff; max-width: 830px
- `.guaranteedimg`: margin-top: -110px
- `.best90`: font-family: 'myriad-pro'; font-weight: 700; font-size: 24px; line-height: 40px; text-transform: uppercase; color: #0a6050
- `.moneyback`: font-family: 'myriad-pro'; font-weight: 900; font-size: 48px; line-height: 100%; text-transform: uppercase; color: #e34134
- `.quaranteepdiv`: font-weight: 400; font-size: 18px; line-height: 130%; color: #002c1e; max-width: 679px
- `.guaranteedmaindiv`: padding-top: 160px

##### Section 7: Bonus - Lean Belly Shakes
- `.crushcravingsdiv`: max-width: 870px
- `.bggradient`: background: linear-gradient(180deg, #000, #0000), #0a6050; border-radius: 5px 5px 0 0; padding: py-4
- `.crushcravings`: font-weight: 900; font-size: 40px; line-height: 100%; color: #f6ff80
- `.multipack`: font-weight: 700; font-size: 32px; line-height: 100%; color: #fff
- `.bgcolorFAF5C9`: background: linear-gradient(to bottom, #fff7da, #ffffff); border-radius: 0 0 5px 5px
- `.cravingstextcontent`: font-weight: 400; font-size: 18px; color: #000; max-width: 485px
- `.bgimgcravings`: background-image: url(leanbellyshakebook.png); background-size: 272px; box-shadow: 0 4px 10px #0006

##### Section 8: Testimonials
- `.yourstorymaindiv`: max-width: 870px
- `.yourstory`: font-weight: 900; font-size: 48px; line-height: 120%; color: #000
- `.customername`: font-weight: 700; font-size: 18px; color: #0a6050
- `.vercustomer`: font-weight: 400; font-size: 14px; line-height: 120%; color: #0a6050
- `.storybox`: background-color: #fff; padding: p-4; margin-top: mt-1
- `.storytitle`: font-style: italic; font-weight: 700; font-size: 20px; line-height: 24px; color: #000
- `.customerstory`: font-weight: 400; font-size: 16px; line-height: 24px; color: #000

##### Section 9: FAQ Section
- `.faqdiv`: max-width: 1000px (740px override)
- `.faq`: font-weight: 900; font-size: 48px (44px override); line-height: 120%; color: #000
- `.faquestiondiv`: border-bottom: 2px solid #191919; border-top: 2px solid #191919 (first item); padding: 20px
- `.faquestion`: font-weight: 600; font-size: 20px; line-height: 110%; color: #000; max-width: 740px; padding-left: 25px; color: #0a6050 (override)
- `.faq-count`: position: absolute; top: -3px; font-size: 20px; font-weight: 700; color: #0a6050
- Answer text: font-weight: 400; font-size: 18px; color: #191919; padding: 0 26px; margin-top: 16px
- Toggle: green chevron arrows (chevron-down-green.png, chevron-up-green.png)

##### Section 10: Supportive Studies
- `.bgcolorE6E4E1`: background-color: #e6e4e1
- `.supportivestudiesmaindiv`: max-width: 780px
- `.clinicalstudies`: font-weight: 700; font-size: 18px; color: #00000080
- `.studiescontent`: font-style: italic; font-weight: 400; font-size: 14px; color: #000

##### Exit Popup
- `.waitmaindiv`: max-width: 749px; background-color: #fff; border-radius: 5px
- `.wait`: font-weight: 700; font-size: 48px; color: #e34134
- `.btn-keepwatching`: background: linear-gradient(0deg, #fbff23, #fbff23), linear-gradient(360deg, #ebab00 -4.55%, #ffb800 25.74%, #f3dfa8 84.85%); box-shadow: 0 4px 4px #00000040; border-radius: 10px; font-weight: 700; font-size: 24px; max-width: 640px; padding: 10px
- **Pulse animation** (keep watching button):
  - @keyframes scale: 0% { transform: scale(1); box-shadow: 0 0 10px #3b87eafc } to { transform: scale(1.05); box-shadow: 0 0 10px 10px #3b87eafc }
  - animation-duration: 2s; animation-iteration-count: infinite; animation-direction: alternate

##### Pre-Headline / Headline (hidden on VSL page, shown on non-VSL)
- `.injust`: font-weight: 700; font-size: 48px; color: #0a5c4d; text-align: center
- `.bowelelimination`: font-weight: 700; font-size: 36px; color: #0a5c4d; text-align: center; line-height: 37px
- `.emptybowel`: font-weight: 700; font-size: 42px; color: #d0190d; max-width: 615px; line-height: 40px
- `.topnycdoctor`: font-weight: 900; font-size: 28px; color: #000000e6

##### Timer (on order section)
- `.ordertoday`: font-weight: 700; font-size: 24px; color: #fffbf8
- `.timer`: font-weight: 700; font-size: 48px; color: #f4ff61

#### Mobile Responsive Changes
@media (min-width: 375px) and (max-width: 1439px):
- Wait/injust: font-size: 44px
- Bowelelimination: font-size: 32px
- Btn-keepwatching: font-size: 18px
- Emptybowel: font-size: 36px
- Important/yourvideo: font-size: 16px
- Doctorname: font-size: 24px
- Ginaimage: width: 81px
- Asseenon/best90/multipack: font-size: 20px
- Moneyback: font-size: 32px
- Crushcravings: font-size: 26px
- Yourstory: font-size: 28px
- Faq: font-size: 32px
- Faquestion: font-size: 18px

#### Color Palette
- **Dark green (primary)**: #0a6050, #0a5c4d, #1c624d, #002c1e, #146e54
- **Red (urgency)**: #d0190d, #e34134, #dc3b3d
- **Light green**: #9be3c5
- **Yellow/gold**: #fbd262, #f6ff80, #f4ff61, #fbff23, #ffb800, #ffda3d
- **Cream/warm**: #fff7da, #f7f6f4, #faf5c9
- **Neutral**: #000, #191919, #e6e4e1
- **Blue**: #3983d2, #1d7de3
- **Transparent**: #00000080, #000000e6, #00000040, #000c

---

### PAGE 2: VSL2 - ProstaVive VSL

**Brand**: ProstaVive (Men's Prostate Health)
**Page Type**: VSL (Video Sales Letter)
**Source URL**: prostavive.org
**Font Stack**: IBM Plex Sans, Oswald, Poppins, Open Sans, Arial
**Framework**: Bootstrap 3 (col-md-*, container, row)

#### Page Structure (Top to Bottom)

1. **Top Band** - #d9877c colored strip (min-height: 5px)
2. **Section: sec-vsl-1** - Headline + Video Player
3. **Section: sec-vsl-2** - Countdown Timer + Product Offers + Guarantee + FAQ + Logo Footer

#### Section Details

##### Section 1: Headline (above video)
- `.ancient-h1`: font-family: Arial, sans-serif; font-size: 48px; font-weight: 700; letter-spacing: -0.02em; line-height: 128%; text-align: center; text-shadow: 0 1px 2px rgba(0,0,0,0.2); color: #000; padding: 5px 17%
- `.red-font`: color: red !important; font-weight: bold
- Desktop headline (hidden-sm hidden-xs): "Spring Water Mineral DISSOLVES 'Prostate Clog' in Hours"
- Mobile headline (hidden-lg hidden-md): same text with line break

##### Section 2: Video Player
- **Desktop video** (max-width > 767px): Vidalytics embed, padding-top: 56.25% (16:9)
- **Mobile video** (max-width <= 767px): Vidalytics embed, padding-top: 150% (2:3 vertical)
- `.video-con`: border: 10px solid red (desktop), border: none (mobile <= 480px)
- `.white-wrapper`: margin: 0 3%; padding: 0 20px (desktop); margin: 0; padding: 0 (tablet/mobile)

##### Section 3: Click-for-Sound / Unmute Button
- `.unmutes a`: font-family: Arial; font-size: 24px; font-weight: 700; letter-spacing: -0.02em; border-bottom: 5px solid #cc9900; border-radius: 8px; background-color: #ffbf00; background-image: url(unmute.png); background-position: 4% center; background-repeat: no-repeat; box-shadow: 0 2px 4px 0 rgba(0,0,0,0.35); padding: 10px 20px 10px 57px
- **Color change animation**:
  - @keyframes color_change: from { background-color: #ffbf00 } to { background-color: #ffdd93 }
  - animation: color_change ease-in-out 400ms infinite alternate
- `.sound-para`: text-align: center; font-size: 14px; font-weight: 700; color: #000

##### Section 4: Countdown Timer
- `.count-div`: centered
- `.couerter-text h1`: font-size: 48px; font-weight: 700
- `.countDown`: displayed as "30:00" timer

##### Section 5: Product Offers (Pricing Cards)
- `.bottle-item`: padding: 30px 35px 35px; background: linear-gradient(to bottom, #ffffff 0%, #e6e7e8 100%); border: 1px solid rgb(8,130,226); text-align: center
- `.bottle-item:hover`: box-shadow: 1px 4px 16px rgb(0,0,0,0.5)
- `.outr-wrp-pro`: border-radius: 16px; box-shadow: 1px 4px 16px rgb(0,0,0,0.2); transition: all 0.5s ease
- `.price-box:hover`: transform: scale(1.05); transition: 0.2s

**Card typography**:
- `.bottle-item h2`: font-family: Poppins; font-size: 40px; font-weight: 700; color: rgb(40,40,40)
- `.bottle-item h3`: font-family: Poppins; font-size: 30px; font-weight: 500; color: #054120
- `.price-large`: font-family: Oswald; font-size: 84px; font-weight: bold; color: rgb(6,64,114)
- `.per-bottle-span`: font-family: Oswald; font-size: 30px
- `.money-saving`: font-family: Poppins; font-size: 18px; font-weight: 700; color: rgb(204,0,0)

**CTA Button (green)**:
- `.add-cart-grn a`: font-family: Oswald; font-size: 40px; font-weight: 400; border-radius: 2px; background: #2fc265; box-shadow: 0 3px 6px 0 rgba(0,0,0,0.15); padding: 10px 60px; text-transform: uppercase; color: #fff; transition: all 333ms ease
- `.add-cart-grn a:hover`: background: #46cf78
- `.bottle-item .add-to-cart-btn`: font-family: IBM Plex Sans; font-size: 24px; font-weight: 700; line-height: 75px; color: rgb(20,35,102); max-width: 365px; height: 75px; background-color: rgb(255,218,62)

**Middle (best value) item special styling**:
- `#middle-item`: padding-top: 52px; border: 2px solid #0882e2

##### Section 6: Guarantee Section
- `.guarrantee`: border: 4px dashed; background: #fff5e0; padding: 15px; margin-bottom: 30px
- `.guarrantee h4`: font-size: 30px; font-family: Poppins; font-weight: 700; text-transform: uppercase; line-height: 132%; margin-top: 16px
- `.guarrantee p`: font-weight: 700; font-size: 16px; font-family: Open Sans; text-align: justify

##### Section 7: FAQ Section
- `.faq`: background: #f5f5f5; padding: 30px 30px 0; margin-top: 4%
- `.faq h2`: font-size: 43px; font-weight: 700; line-height: 1.267em; color: rgb(20,20,20); margin-bottom: 35px; font-family: Poppins
- `.faq h3`: font-size: 23px; font-family: Open Sans; font-weight: bolder; color: rgb(5,65,32); margin-bottom: 15px
- `.faq p`: font-family: Open Sans; font-size: 20px; color: #000; padding-bottom: 10px
- `.faq-head`: border-bottom: 1px dashed #ababab

#### Mobile Responsive Changes
@media (max-width: 1200px):
- ancient-h1 padding: 20px 15%
- bottle-item h2: 32px; h3: 25px

@media (max-width: 991px):
- ancient-h1: font-size: 50px
- sec-vsl-1/2 container width: 95%
- bottle-item h2: 30px; h3: 20px; price-large: 60px
- bottle-item padding: 30px 15px 35px

@media (max-width: 767px):
- ancient-h1: font-size: 40px
- price-box margin-bottom: 30px
- middle-item padding-top: 30px

@media (max-width: 480px):
- ancient-h1: font-size: 34px; line-height: 125%; padding: 15px 0
- unmutes a: font-size: 18px
- cart-btn: width: 100%
- today-price: font-size: 26px
- video-con: border: none
- sec-vsl-1 container: width: 100%; padding-bottom: 0
- guarrantee h4: font-size: 25px; text-align: center
- faq h2: font-size: 28px
- faq h3: font-size: 22px
- guaranteed-img: width: 73%

#### Color Palette
- **Green (CTA)**: #2fc265, #46cf78
- **Yellow (buttons)**: #ffbf00, #ffdd93, rgb(255,218,62)
- **Blue (borders/accents)**: #0882e2, rgb(6,64,114), #06f, rgb(20,35,102)
- **Red**: rgb(204,0,0), red
- **Dark text**: #000, rgb(40,40,40), rgb(20,20,20), rgb(5,65,32)
- **Warm/cream**: #fff5e0
- **Neutral bg**: #f5f5f5, #e6e7e8
- **Top band**: #d9877c
- **Dashed border guarantee**: 4px dashed

---

### PAGE 3: Thank You Page - Vibriance

**Brand**: Vibriance (Skincare/Supplements)
**Page Type**: Thank You / Order Confirmation
**Platform**: CheckoutChamp (FunnelKit)
**Font Stack**: Lato, Merriweather (Google Fonts)

#### Page Structure (Top to Bottom)

1. **Logo** - Vibriance brand logo (centered)
2. **Order Number** - "Order {{orderId}}"
3. **Thank You Message** - "Thank you {{firstName}} {{lastName}}!"
4. **Map + Confirmation** - Google Maps embed (shipping address) + "Your order is confirmed" + "You'll receive a confirmation email..."
5. **Horizontal Divider**
6. **Customer Information** - Two columns:
   - Left: Contact Info, Shipping Address, Shipping Method
   - Right: Total Price, Billing Address
7. **CTA Button** - "Learn More About Vibriance" (link to about page)
8. **Help Text** - "Need help? Contact us"
9. **Horizontal Divider**
10. **Order Summary Sidebar** (right column on desktop) - Table with Item, Quantity columns

#### CSS Values

**Layout**:
- `.fk-row`: flex layout (row)
- `.fk-col`: column layout
- `.sidebar`: right column for order summary (desktop)
- Uses CheckoutChamp's template system with {{}} placeholders

**Logo**:
- `.fk-logo`: standard image display, aligned center

**Order Number**:
- Centered, standard template styling

**Thank You Message**:
- Bold headline, centered

**Google Maps Embed**:
- `.fk-in2gu`: iframe embed, map display
- Address, zoom level: 14, map type: "q" (terrain)

**Customer Information**:
- Two-column layout (`.fk-inner-row` / `.fk-inner-column`)
- Bold labels (Contact Information, Shipping Address, etc.)
- Template variables: {{emailAddress}}, {{shipFirstName}}, {{shipAddress1}}, {{shipCity}} {{shipState}} {{shipPostalCode}}, {{shipCountry}}

**CTA Button**:
- `.btn-primary`: Bootstrap primary button
- `.fk-igar4z`: custom button class
- Text: "Learn More About Vibriance"

**Order Summary Table**:
- `#orderSummaryTable`: w-100 (full width)
- thead: "Order Summary" header, "Item" and "Quantity" columns
- tbody: Dynamic items list
- Horizontal divider (`.fk-line.horizontal-line-default`)

**YouTube/Video Player styles (present but not used)**:
- `.fk-youtube`: background-color: #000; margin-bottom: 30px; position: relative; overflow: hidden; cursor: pointer; min-height: 160px
- `.play-button`: width: 90px; height: 60px; background-color: #333; box-shadow: 0 0 30px rgba(0,0,0,0.6); border-radius: 6px; opacity: 0.8
- `.play-button:before`: CSS triangle (border trick) - 15px 0 15px 26px solid white

---

### PAGE 4: Thank You Page - SmoothSpine

**Brand**: SmoothSpine (RejuvaKnee Massager)
**Page Type**: Thank You / Order Confirmation + Upsell/Survey
**Platform**: CheckoutChamp (FunnelKit)
**Font Stack**: Inherited from CheckoutChamp

#### Page Structure (Top to Bottom)

1. **Logo Row** - SmoothSpine logo + US flag + Contact Us email (support@smoothspine.com)
2. **"Order Confirmed"** - Large headline
3. **Thank You Image** - "thank_you" image
4. **Personal Message** - "{{firstName}} {{lastName}}, You'll receive a confirmation email..."
5. **Change Request Notice** - "For any change requests please contact us within 6 hours..."
6. **Invoice Table** - Items Ordered table (Item, Quantity, Price columns) with Discount and Total
7. **Billing Notice** - "Your billing will appear as: SmoothSpine"
8. **Survey Section** - "Do you have 2 minutes to answer an anonymous survey?" with CTA
9. **Horizontal Divider**
10. **Product Usage Video** - "Please watch this video to know how to use your SmoothSpine massager" (Vidalytics embed)
11. **Upsell Banner 1** - "FIX YOUR SCIATICA AT HOME IN 30 DAYS" with image + "JOIN OUR FREE COMMUNITY NOW" CTA
12. **User Guide** - "Smoothspine Triple Fusion Massager User Guide" with image + CTA
13. **Facebook Group** - Facebook community banner + "JOIN OUR FREE COMMUNITY NOW" CTA
14. **Customer Information** - Two columns:
    - Left: Customer Info, Shipping Address, Shipping Method
    - Right: Payment Method, Billing Address
15. **Continue Shopping** - Link
16. **Customer Support** - CSR image + "We're Here To Help You" + email + phone
17. **Footer** - Terms, Privacy, Return Policy links + legal text + DMCA badge

#### CSS Values

**Layout**:
- `.fk-row`: row container
- `.fk-col.col.max-w-1170`: max-width: 1170px column
- `.fk-col.col.max-w-780`: max-width: 780px column (main content)

**Survey Section** (`.survey-box` / `.survey-section`):
- `h1`: Large headline
- `.highlight-yellow`: Yellow highlight for "2 minutes"
- `.highlight-blue`: Blue highlight for "anonymous"
- `.subtitle`: Subtitle text
- `.cta-button`: Call to action button - links to Typeform survey

**Invoice Table** (`.list-of-items` / `#fk-invoice-table`):
- `.full-width`: table width: 100%
- `.row-style`: table row styling
- `.row-padding`: row padding
- `.header-align`: header alignment
- `.table-cell`: table cell styling
- `.table-text`: table text styling
- `.fk-text-right`: text-align: right
- `.each-price`: individual price row
- `.total-prices`: total price section
- `.cc-negative-savings`: discount display (negative value styling)

**Video Box** (`.video-box`):
- Contains Vidalytics embed
- Vidalytics player loaded via JS

**Upsell Banners**:
- Bold text for headlines
- `.img-opacity-and-cursor`: Image with hover opacity + pointer cursor
- `.box-width`: CTA box width
- `.link-width-and-shadow`: CTA link with width and shadow
- `.btn-decoration-on-hover`: Button decoration on hover state

**Customer Information**:
- Two-column layout
- Template variables: {{emailAddress}}, {{shipFirstName}}, {{shipLastName}}, {{shipAddress1}}, {{shipCity}} {{shipState}}, {{shipPostalCode}}, {{shipCountry}}
- Payment: {{currencySymbol}} {{amountPaid}}

---

### PAGE 5: Landing Page - GetHeyFra (Total Relief)

**Brand**: HiRelief / GetHeyFra (Total Relief Magnesium Cream)
**Page Type**: Shopify Product Landing Page (GemPages Builder)
**Font Stack**: Figtree (body), Open Sans, system fonts
**Framework**: Shopify Dawn Theme + GemPages

#### Page Structure (Top to Bottom)

1. **Announcement Bar** - "Company Anniversary Sale! up to 55% OFF"
2. **Header** - Navigation with logo, menu (Total Relief product link), cart drawer
3. **Main Content** (GemPages builder - single section):
   - Product images (slider/carousel)
   - Product title: "Total Relief Magnesium Cream"
   - Product description sections
   - Customer reviews list (large list of 50+ reviews with names + text)
   - Add to cart form with variant selection
4. **Footer** - Three columns:
   - "90-Day Money-Back Guarantee" text
   - Menu links
   - Newsletter signup + social links + payment icons
   - Copyright

#### CSS Values

**Announcement Bar**:
- `.announcement-bar`: color-accent-1 gradient
- `.announcement-bar__message`: center, h5 class
- `.page-width`: standard Shopify page width

**Header** (Shopify Dawn):
- `.section-header`: header section with menu drawer, search, cart
- `.header__menu-item`: menu item styling
- `.header-wrapper`: header wrapper

**Product Section** (GemPages):
- Uses GemPages v3 builder (`.gf_section`, `.gf_row`, etc.)
- Product JSON data embedded in `#product-json9951828738368`
- Product images: aspect ratio 1.0 (square), 1563x1563px
- Product media: includes video (mp4 sources at 480p, 720p, 1080p + HLS)
- `.review` class for customer reviews: `.name` + `.review_text` divs

**Cart Drawer** (Shopify Dawn):
- `.cart-drawer`: slide-out cart
- `.drawer__inner`: width: 40rem; max-width: calc(100vw - 3rem)
- `.cart__checkout-button`: full width checkout button
- `.totals`: flex layout, justify-content: center, align-items: flex-end
- `.totals__subtotal`: font-size: calc(var(--font-heading-scale) * 1.6rem)
- `.totals__subtotal-value`: font-size: 1.8rem

**Footer** (Shopify Dawn):
- `.footer`: border-top: 0.1rem solid rgba(var(--color-foreground), 0.08)
- `.footer__content-top`: padding-bottom: 5rem
- `.footer-block__heading`: margin-bottom: 2rem; font-size: calc(var(--font-heading-scale) * 1.6rem)
- Desktop: grid layout with 6rem row-gap
- Mobile: stacked blocks, 4rem margin between blocks

**Product data**:
- Price: $44.00 (4400 cents)
- Vendor: HiRelief
- SKU: TotalRelief-1
- Images: 9 media items (7 images + 1 video + 1 video thumbnail)

#### Key Shopify Theme Variables (Dawn)
- `--color-foreground`: CSS variable for text color
- `--color-background`: CSS variable for bg
- `--font-heading-scale`: heading size multiplier
- `--font-body-scale`: body size multiplier
- `--inputs-border-width`: input border
- `--duration-default`: transition duration
- `--popup-corner-radius`: notification popup radius

---

### PAGE 6: Advertorial - SmoothSpine (for comparison)

**Brand**: SmoothSpine
**Page Type**: Advertorial / Sales Page
**File**: advertorial-smoothspire.html (617KB)
**Platform**: CheckoutChamp

This is a long-form sales page for the same SmoothSpine brand. Uses the same CheckoutChamp platform with similar styling patterns as the thank you page.

---

## Cross-Page Patterns

### 1. Video Player Design

| Element | VSL1 (Emma) | VSL2 (ProstaVive) | SmoothSpine TY |
|---------|-------------|-------------------|----------------|
| Platform | Wistia | Vidalytics | Vidalytics |
| Desktop aspect | 16:9 (videoFoam) | 16:9 (56.25% pt) | Vidalytics embed |
| Mobile aspect | 16:9 | 2:3 (150% pt) | Vidalytics embed |
| Border | None | 10px solid red | None |
| Click-for-sound | Custom overlay | Unmute button (#ffbf00) | Not visible |
| Background | #000000f2 | light bg image | N/A |

### 2. CTA Below Video

| Page | Style | Colors | Size |
|------|-------|--------|------|
| Emma VSL | Image-based CTA (CTA.png) | Green gradient image | Full card width |
| ProstaVive | Oswald font, text button | #2fc265 (green), yellow alt | font-size: 40px, padding: 10px 60px |
| Both | Payment method icons below CTA | Various card logos | ~200-300px wide |

### 3. Pricing Card Patterns

**Common structure**: Header (tier name) + Product image + Price + Badges + CTA + Old/New price

| Element | VSL1 (Emma) | VSL2 (ProstaVive) |
|---------|-------------|-------------------|
| Cards | 3 columns (1/6/3 bottles) | 3 columns (1/6/3 bottles) |
| Best Value highlight | Gold bg (#fbd262) + banner img | Blue border 2px + extra padding-top 52px |
| Price font | 55px Myriad Pro | 84px Oswald |
| Per-bottle | 24px Myriad Pro | 30px Oswald |
| Strikethrough | Inter, 24px, red line | Price shown as del tag |
| Badge strips | Colored bars (red/green/blue) | N/A |
| CTA | Image button | Text button (Oswald 40px green) |
| Hover effect | N/A | scale(1.05), shadow increase |

### 4. Thank You Confirmation Patterns

| Element | Vibriance TY | SmoothSpine TY |
|---------|--------------|----------------|
| Platform | CheckoutChamp | CheckoutChamp |
| Logo | Centered, top | Left-aligned with flag + email |
| Order # | "Order {{orderId}}" | "Order Confirmed" headline |
| Personal msg | Thank you + name | Thank you + name + email notice |
| Map embed | Google Maps | None |
| Invoice | Sidebar table | Inline table with discount |
| Customer info | Two-column | Two-column |
| CTA | "Learn More About Vibriance" | Continue Shopping link |
| Upsell | None | Survey + Product video + Community CTA |
| Support | Contact us link | Full CSR section with phone + email |
| Legal | Minimal | Terms + Privacy + Return Policy + DMCA |

### 5. Guarantee Section Pattern

| Page | Border | Background | Badge |
|------|--------|-----------|-------|
| Emma VSL | 8px solid #000 | #fff | Guarantee seal image (-110px offset) |
| ProstaVive | 4px dashed | #fff5e0 | Guarantee image |

### 6. FAQ Pattern

| Element | VSL1 (Emma) | VSL2 (ProstaVive) |
|---------|-------------|-------------------|
| Background | #f7f6f4 | #f5f5f5 |
| Title size | 48px/44px | 43px |
| Title font | myriad-pro 900 | Poppins 700 |
| Question font | myriad-pro 600, 20px | Open Sans bolder, 23px |
| Answer font | myriad-pro 400, 18px | Open Sans 400, 20px |
| Toggle | Green chevrons (image) | Dashed border separator |
| Border | 2px solid #191919 | 1px dashed #ababab |

### 7. Landing Page Pattern (Shopify)

| Element | Style |
|---------|-------|
| Announcement bar | Gradient background, centered h5 text |
| Navigation | Dawn theme header with drawer menu |
| Product page | GemPages builder (visual drag-drop) |
| Reviews | Simple div.name + div.review_text list |
| Cart | Slide-out drawer, full-width checkout button |
| Footer | Multi-column with guarantee, menu, newsletter |

### 8. Color Palette Summary

**DTC Health/Supplement pages use these dominant colors**:

| Purpose | Color |
|---------|-------|
| Primary CTA (green) | #2fc265, #0a6050 |
| Urgency/Warning (red) | #d0190d, #e34134, #dc3b3d |
| Highlight (yellow/gold) | #fbd262, #ffbf00, #f6ff80 |
| Dark text | #000, #191919 |
| Body text | #000, #002c1e |
| Background (warm) | #f7f6f4, #fff5e0, #fff7da |
| Background (neutral) | #f5f5f5, #e6e4e1, #e6e7e8 |
| Accent blue | #0882e2, #3983d2 |
| Success green | #146e54, #0a5c4d |

---

### PAGE 7: HaloGrow Advertorial (Webflow / Funnel Builder Pro)

**Brand**: HaloGrow (Hair Growth Spray)
**Page Type**: Advertorial (Listicle-style)
**Source URL**: www.tryhalogrow.com/articles/hairspray-mvp-ba04-us-spray-2
**Platform**: Webflow + Funnel Builder Pro
**Font Stack**: Open Sans (body + headings), Manrope (accents)
**CSS Prefix**: `adv-` (all classes prefixed)

#### Page Structure (Top to Bottom)

1. **Navbar** (`.adv-navbar`) - White bg, logo + "Advertorial" caption
2. **Hero Section** (`.adv-section-2`) - H1 headline + body text
3. **Body Content** - Repeating pattern of: H2 heading + Image + Body text
   - #1: Stop Hair Loss Where It Starts
   - #2: Science-Backed Results
   - #3: 4-in-1 Powerful Growth Formula (bullet list with checkmarks)
   - #4: Your At-Home Hair Growth Solution
   - #5: Advanced Non-Greasy Formula
   - **Mid-CTA** - "Experience visible results that boost your confidence"
   - #6: Trusted by Hair Specialists (Dr. quote block)
   - #7: Targets Multiple Causes (video embed)
   - #8: Visible Results in Just 8-12 Weeks
   - #9: Easy 3-Step Application (background video)
   - #10: Real Results from Real Women (3 testimonials)
4. **Bottom CTA** - "GET 70% DISCOUNT" button
5. **Product Block** (`.adv-product-block.spray`) - Limited time offer with checkmarks
6. **CTA Block** - "CLAIM YOUR DISCOUNT NOW" + LOW STOCK urgency
7. **Footer** (`.footer-advertorial`) - Legal links + Disclaimer + Health disclaimer

#### CSS Values

**Navbar**:
- `.adv-navbar`: background-color: #fff; border-bottom: 1px solid #e7e7e7; padding: 12px 32px; display: flex
- `.adv-logo`: max-height: 24px
- `.adv-logo-caption`: color: #262626; text-transform: uppercase; font-family: Open Sans, sans-serif; font-size: 12px; font-weight: 600; line-height: 16px

**Typography**:
- `.adv-heading-1`: color: #02122e; font-family: Open Sans; font-size: 40px; font-weight: 800; line-height: 48px
- `.adv-heading-3`: color: #02122e; font-family: Open Sans; font-size: 28px; font-weight: 800; line-height: 34px
- `.adv-heading-5`: color: #02122e; font-family: Open Sans; font-size: 20px; font-weight: 800; line-height: 26px
- `.adv-body-text`: color: #0c230e; font-family: Open Sans; font-size: 20px; line-height: 26px
- `.adv-body-text.xl.orange`: Save 70% highlight text

**Testimonial Block** (`.adv-testimonial-2`):
- `.adv-testimonial-a-wrapper`: grid with gap 16px, flex, align-items center
- `.adv-testimonial-author-2`: author avatar image
- `.adv-testimonial-a-name-wrapper`: grid gap 4px, flex-column
- `.adv-testimonial-text-wrapper`: grid gap 8px, flex-column
- Stars: SVG stars image (adv stars.svg)

**Product Block** (`.adv-product-block.spray`):
- `.adv-product-block`: grid gap 32px; flex-column; justify-content center; align-items center; padding: 32px
- `.adv-button.fw.w-button`: full-width CTA button
- Check icons: Green check SVG

**Money Back Block** (`.adv-money-back-block`):
- background-color: #fffbef; border: 1px solid #fab73c; border-radius: 8px; padding: 16px

**CTA Button** (`.adv-button`):
- Webflow `.w-button` default + custom full-width styling

**Mobile Sticky CTA** (`.mobile-sticky-button`):
- Fixed position, bottom of screen, always visible on mobile

**Footer** (`.footer-advertorial`):
- background-color: #cce0eb; padding: 56px 32px; flex-column
- `.footer-links-wrap`: flex gap 16px (Terms, Privacy, Cookie links)
- `.footer-text-3.disclaimer`: centered, Open Sans, full legal text

#### Color Palette
- **Dark navy text**: #02122e, #0c230e
- **Dark navy bg**: #0c230e, #00264c
- **CTA green**: #24aa2f
- **Warning red**: #ff1f1f, #ec0b43
- **Badge yellow-green**: #baf363
- **Warm cream**: #fffbef
- **Gold border**: #fab73c
- **Light blue footer**: #cce0eb
- **Footer dark red**: #592022

---

### PAGE 8: HaloGrow Product Page (Webflow)

**Brand**: HaloGrow (Hair Growth Spray)
**Page Type**: Product Landing Page (Long-form)
**Source URL**: www.tryhalogrow.com/products/product-1
**Platform**: Webflow + Funnel Builder Pro
**Font Stack**: Sentient (headings), Public Sans (announcement), Open Sans (body)
**CSS Prefix**: Mixed (heading-*, feature-*, alt-review-*, faq-*, ingredient-*)

#### Page Structure (Top to Bottom)

1. **Announcement Bar** (`.announcment-bar-tb`) - "Congratulations! You've Pre-Qualified For a 70% Discount!" with lime green highlight
2. **Navbar with Country** (`.navbar-with-country`) - Logo + nav links (Features, Ingredients, How to Use, Reviews, FAQ, Track My Order, Contact Us) + CTA button
3. **Hero Section** - Product image + "As Seen In..." logos
4. **Problem Section** - "Do You Know WHY You're Losing Hair?" + DHT explanation
5. **Solution Section** - "The Hair Loss Solution You've Been Waiting For"
6. **Features Grid** (`.features-grid`) - "Here's What Makes HaloGrow Stand Out" (feature cards)
7. **Use Cases** - "Perfect for all sorts of hair loss"
8. **Ingredients Section** - "Five Powerful Ingredients" (ingredient blocks with images)
   - Biotin, Castor Oil, Aminexil, Caffeine, He Shou Wu
9. **How to Use** - 4-column grid (`.how-to-use-grid`)
10. **Results Section** - "These Results Speak for Themselves"
11. **Video Section** - "How to Use HaloGrow" video
12. **Before/After** - "What do 3-5 month hair growth results look like?"
13. **Reviews Section** (`.alt-reviews-wrapper`) - Large rating display + individual reviews with bar chart
14. **Guarantee** - "30-Day Money-Back Guarantee"
15. **FAQ Section** (`.faq-accordion`) - Accordion FAQ
16. **Footer** (`.footer-main`) - Dark red bg (#592022), multi-column links

#### CSS Values

**Announcement Bar**:
- `.announcment-bar-tb`: color: #fff; font-family: Public Sans; font-size: 18px; line-height: 24px
- `.announcment-bar-container`: flex-column, max-width: 1280px
- Lime highlight span: for "70% Discount!"

**Typography**:
- `.heading-1`: color: #0c230e; font-family: Sentient, Arial; font-size: 52px; font-weight: 500; line-height: 58px
- `.heading-2`: color: #0c230e; font-family: Sentient; font-size: 52px; font-weight: 500; line-height: 58px
- `.heading-3`: color: #0c230e; font-family: Sentient; font-size: 44px; font-weight: 500; line-height: 52px
- `.heading-4`: color: #0c230e; font-family: Sentient; font-size: 32px; font-weight: 500; line-height: 40px
- `.heading-5`: color: #0c230e; font-family: Sentient; font-size: 24px; font-weight: 500; line-height: 32px

**Navbar**:
- `.navbar-with-country`: background-color: #fff; padding: 16px 32px; display: flex
- Nav links: Features, Ingredients, How to Use, Reviews, FAQ, Track My Order, Contact Us
- CTA button in nav

**Feature Cards** (`.feature-card`):
- grid gap 16px; border-bottom: 1px solid #cdcdba; flex-column; padding: 32px

**Ingredient Blocks** (`.ingredient-block`):
- `.ingredient-block`: background-color: #162d18; border-radius: 12px; overflow: clip
- `.ingredient-content-wrap`: background-color: #162d18; flex-column; padding: 32px
- `.ingredient-badge`: color: #0c230e; background-color: #baf363; border-radius: 4px; padding: 4px 12px; font-family: Public Sans; font-size: 16px; font-weight: 700

**How to Use Grid** (`.how-to-use-grid`):
- grid-template-columns: 1fr 1fr 1fr 1fr; gap: 16px
- `.how-to-use-card`: background-color: #fff; border-radius: 12px; overflow: clip
- `.how-to-use-card-content`: flex-column; gap: 8px; padding: 24px

**Reviews** (`.alt-reviews-*`):
- `.alt-reviews-total-rating`: color: #0c230e; font-family: Sentient; font-size: 88px; font-weight: 700; line-height: 96px
- `.alt-reviews-bar`: background-color: #baf363; width: 100%; height: 8px
- `.alt-reviews-bar-wrapper`: background-color: #eaeaea; border-radius: 100px; min-height: 8px; max-height: 8px
- `.alt-review`: grid-template-columns: 0.3fr 1fr (desktop) / 0.6fr 1fr (mobile); gap: 64px
- `.alt-review-image`: max-width: 64px

**FAQ** (`.faq-accordion`):
- `.faq-accordion-item`: background-color: #f4f4f4; border-radius: 8px
- `.faq-accordion-toggle`: cursor: pointer; padding: 16px; font-weight: 700
- `.faq-accordion-content`: padding: 0 16px 16px; font-size: 16px; line-height: 24px

**Footer** (`.footer-main`):
- background-color: #592022; flex-column; padding: 40px 32px; gap: 40px
- `.footer-title`: color: #ffedee; font-size: 14px
- `.footer-link`: color: #ffedee; font-size: 14px
- `.footer-description`: color: #ffedee; max-width: 1160px; font-size: 12px
- `.footer-link-grid`: grid-template-columns: 1fr 1fr 1fr; max-width: 560px
- `.footer-payment-badges`: max-height: 48px

#### Color Palette
- **Dark forest green**: #0c230e, #162d18
- **Dark navy**: #02122e
- **Badge lime**: #baf363
- **Footer dark red**: #592022
- **Light footer text**: #ffedee
- **Feature border**: #cdcdba
- **FAQ bg**: #f4f4f4
- **Review bar bg**: #eaeaea

---

### PAGE 9: HaloGrow Checkout (Webflow / Funnel Builder Pro)

**Brand**: HaloGrow (Hair Growth Spray)
**Page Type**: Checkout / Order Form
**Source URL**: cart.tryhalogrow.com/products-order/us
**Platform**: Webflow + Funnel Builder Pro
**Font Stack**: Montserrat (primary), Open Sans
**CSS Prefix**: c- (product cards), timer- (countdown), banner- (top banner)

#### Page Structure (Top to Bottom)

1. **Top Banner / Timer** (`.banner`) - Dark bg (#0c230e) with "Hurry! 70% discount reserved for" + countdown timer (15 minutes)
2. **Timer Section** (`.timer-section`) - Blue rounded timer bar (#1264e8) with "HURRY! OFFER EXPIRES IN" + clock
3. **Product Cards** (`.c-products`) - 3 product options (radio select):
   - Each card: product image, name, badge, price, original price strikethrough, discount badge, shipping info
   - Best Value highlighted with border + badge
4. **Order Summary** (JS-generated) - Dynamic cart with:
   - Product items list with quantity badges
   - Discount code input + Apply button (#2563eb blue)
   - Price breakdown: Subtotal, Discount, Shipping, Total
   - Strikethrough original prices
5. **Customer Info Form** - Email + shipping address fields
6. **Payment Section** - Credit card fields OR PayPal/Apple Pay express buttons
7. **Trust Badges** - SSL, secure checkout icons
8. **Footer** - Terms, Privacy, Contact links

#### CSS Values

**Top Banner**:
- `.banner`: background-color: #0c230e; display: block
- `.banner.uk`: background-color: #092b81
- Timer wrapper: background-color: #0c230e; padding: 8px 16px; display: flex

**Timer Section**:
- `.timer-section`: z-index: 2; background-color: #1264e8; border-radius: 8px; max-width: 1140px; margin-bottom: 40px; padding: 16px 32px
- `.timer-step`: color: #fff; font-family: Montserrat; font-size: 24px; font-weight: 700; line-height: 30px

**Product Cards** (`.c-product-card`):
- `.c-product-card`: cursor: pointer; background-color: #fff; border: 3px solid transparent; flex-direction: column; box-shadow: 0 0 8px #00000029; font-family: Montserrat
- `.c-product-card:hover` / selected: border color #667eea (purple-blue), then #FFD700 (gold)
- `.c-product-card-img`: object-fit: fill; max-height: 116px
- `.c-most-popular-badgeee`: Best Value badge

**Price Styling** (JS inline):
- Product name: font-size: dynamic; font-weight: 600; color: #333
- Badge: background: #f59e0b (amber); color: white; border-radius: 4px; font-weight: 600
- Original price: text-decoration: line-through; color: #999
- Discount badge: background: #10b981 (green); color: white; border-radius: 4px; font-weight: 600
- Shipping: color: #666

**Order Summary** (JS inline):
- Item row: display: flex; gap: 1rem; border-bottom: 1px solid #f3f4f6
- Quantity badge: background: #2563eb; border-radius: 9999px; font-size: 0.75rem
- Discount code input: border: 1px solid #d1d5db; border-radius: 0.5rem; padding: 0.625rem
- Apply button: background: #2563eb; color: white; border-radius: 0.5rem
- Discount applied: background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534
- Total: font-size: 1.5rem; font-weight: 700; color: #111827

**Express Checkout**:
- Apple Pay: native button styling
- Klarna: external script integration

#### Color Palette
- **Dark green banner**: #0c230e
- **Blue timer**: #1264e8
- **Blue CTA/links**: #2563eb
- **Amber badge**: #f59e0b
- **Green discount**: #10b981
- **Green applied**: #16a34a, #166534, #f0fdf4
- **Gold border**: #FFD700
- **Purple-blue highlight**: #667eea
- **Card shadow**: #00000029
- **Neutral text**: #333, #4b5563, #6b7280, #111827
- **Error red**: #EC0B43

---

### PAGE 10: EmSense Sale Page (Webflow)

**Brand**: EmSense (EMS Foot Massager)
**Page Type**: Product Sale Page (Long-form)
**Source URL**: www.tryemsense.com/products/product-2
**Platform**: Webflow + Funnel Builder Pro
**Font Stack**: Manrope (headings + body), Arial (fallback)
**CSS Prefix**: int- (all classes prefixed)

#### Page Structure (Top to Bottom)

1. **70% OFF Banner** (`.int-section._70-off`) - Country-targeted banners (UK, DE), dark navy (#00264c)
2. **Sticky Timer Bar** (`.int-section.sticky`) - Position sticky top 0, dark navy, countdown
3. **Hero Section** (`.int-section.hero`) - Light blue bg (#eafafa)
   - Hero title: "Finally! Real Relief for Neuropathy Pain in Your Feet"
   - Hero features grid: 3-column grid
   - CTA button (green): "Get 70% OFF"
4. **How It Works** (`.int-section-title.hiw`) - "One Device That Does It All"
   - Timeline component (`.int-timeline`) with vertical red line
5. **Problem Section** (`.int-section.light-gray`) - "The Real Cause of Foot Pain" (#f5f5f5 bg)
6. **Solution Section** (`.int-section.separator-top`) - "Meet the EMSense Triple Therapy Foot Massager"
7. **Benefits Section** (`.int-section.light-blue`) - "This Massager Also Helps With"
8. **Doctor Section** (`.int-section.cream`) - "Created by Specialists" (#f9f2e8 bg)
9. **How to Use** (`.int-section-title.how-to`) - "3 Simple Steps"
10. **Results Section** (`.int-section.light-gray`) - "These Results Speak for Themselves"
11. **Testimonials** (`.int-section-title.testimonials`) - 3-column grid of testimonial cards
12. **Reviews** (`.int-section-title.reviews`) - Star ratings + individual reviews
13. **Compare Section** (`.int-section-title.compare`) - 2-column comparison grid
14. **CTA Section** - Final call-to-action with sticky bottom bar
15. **Footer** (`.int-section.footer`) - Dark bg (#141619)
16. **Copyright** (`.int-section.copyright`) - Very dark bg (#0e0f11)

#### CSS Values

**Sections**:
- `.int-section`: flex-flow: column; padding: 64px 32px; position: relative
- `.int-section.cream`: background-color: #f9f2e8
- `.int-section._70-off`: color: #fff; background-color: #00264c; padding: 12px 0
- `.int-section.sticky`: background-color: #00264c; position: sticky; top: 0; z-index: 1
- `.int-section.light-gray`: background-color: #f5f5f5
- `.int-section.light-blue`, `.int-section.hero`: background-color: #eafafa
- `.int-section.footer`: background-color: #141619; padding: 40px 0
- `.int-section.copyright`: color: #fff; background-color: #0e0f11; padding: 24px 0

**Typography**:
- `.int-h2`: font-family: Manrope, Arial; font-size: 40px; line-height: 48px (desktop) / 32px/40px (mobile)
- `.int-h3`: font-family: Manrope, Arial; font-size: 32px; line-height: 40px (desktop) / 24px/32px (mobile)

**Buttons**:
- `.int-button`: color: #fff; background-color: #24aa2f; border-radius: 12px; padding: 18px 24px; font-size: 20px; font-weight: 700; line-height: 26px; transition: background-color 0.2s
- `.int-button:hover`: background-color: #2ac436
- `.int-button-outline`: color: #02122e; border: 2px solid #02122e; border-radius: 12px; padding: 18px 24px; font-size: 20px; font-weight: 700
- `.int-button-outline:hover`: background-color: #0000001a

**Hero** (`.int-hero`):
- grid-template-columns: 1fr 1fr; gap: 64px
- `.int-hero-features`: grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-top: 64px; font-size: 14px
- `.int-hero-feature-title`: font-size: 18px; font-weight: 700; line-height: 26px

**Testimonials** (`.int-testimonials`):
- grid-template-columns: 1fr 1fr 1fr; gap: 16px
- `.int-testimonial`: color: #3f4d67; border: 1px solid #b3d9fe; border-radius: 8px; padding: 16px
- `.int-testimonial-author`: color: #3e57a1; font-weight: 700
- `.int-testimonial-approval`: color: #41c131; font-size: 16px; font-weight: 600

**Reviews** (`.int-reviews`):
- border-bottom: 1px solid #eaeaea
- `.int-review`: gap: 64px; border-top: 1px solid #eaeaea; padding: 24px 0
- `.int-review-title`: font-size: 20px; font-weight: 700
- `.int-review-verified`: color: #24aa2f; gap: 6px; font-size: 16px
- `.int-reviews-score-val`: large score number
- `.int-reviews-subtitle`: color: #e33c4c; font-size: 20px; font-weight: 700

**Compare** (`.int-compare`):
- grid-template-columns: 1fr 1fr; gap: 16px
- `.int-compare-item`: background-color: #fff; border: 1px solid #e4e4e4; border-radius: 12px
- `.int-compare-item-title`: font-size: 26px; font-weight: 700; line-height: 34px (desktop) / 20px/26px (mobile)
- `.int-compare-content`: padding: 32px; gap: 24px

**Timeline** (`.int-timeline`):
- `.int-timeline-line`: background-color: #e33c4c29; width: 2px
- `.int-timeline-line.start`: background-color: #e33c4c; border-radius: 100px

#### Color Palette
- **Dark navy bg**: #00264c, #0e0f11, #141619
- **Text navy**: #02122e
- **CTA green**: #24aa2f, #2ac436
- **Approval green**: #41c131
- **Hero light blue**: #eafafa
- **Cream bg**: #f9f2e8
- **Light gray bg**: #f5f5f5
- **Red accent**: #e33c4c
- **Testimonial blue border**: #b3d9fe
- **Testimonial blue text**: #3e57a1
- **Body text**: #3f4d67
- **Warning/urgency red**: #EC0B43

---

### PAGE 11: EmSense Checkout (Webflow)

**Brand**: EmSense (EMS Foot Massager)
**Page Type**: Checkout / Order Form
**Source URL**: cart.tryemsense.com (inferred)
**Platform**: Webflow + Funnel Builder Pro
**Font Stack**: Montserrat (primary), Open Sans
**CSS Prefix**: ck- (checkout), c- (product cards), banner- (banners)

#### Page Structure (Top to Bottom)

1. **Top Banner** - "70% OFF" announcement
2. **Timer Section** (`.timer`) - Blue bar (#007ffd) with countdown
3. **Hero/Product Section** (`.hero`) - Light blue bg (#e2f1fe) with product overview
4. **Product Cards** (`.c-product-card`) - Same pattern as HaloGrow checkout
5. **Order Summary** - JS-generated dynamic cart (identical pattern to HaloGrow)
6. **Express Checkout** - Apple Pay, PayPal
7. **Customer Info Form** - Email, shipping address
8. **Payment Section** - Credit card fields
9. **Trust Badges** - SSL, secure checkout
10. **Footer** - Terms, Privacy, Contact

#### CSS Values

**Timer**:
- `.timer`: background-color: #007ffd; border-radius: 0; padding: 16px 32px; display: flex
- `.timer-step`: color: #fff; font-family: Montserrat; font-size: 24px; font-weight: 700

**Checkout Container**:
- `.checkout`: padding: 20px 0
- `.checkout-container`: max-width: 1140px; padding: 0 16px

**Product Cards** (`.c-product-card`):
- Same structure as HaloGrow: cursor: pointer; background-color: #fff; border: 2px solid transparent; box-shadow: 0 0 8px #00000029; font-family: Montserrat
- `.c-product-card-img`: max-height: 116px

**Checkout Inline Styles** (JS-generated):
- Error messages: color: #EC0B43; font-size: 16px; font-family: Montserrat
- Body text: color: #4e596d; font-size: 16px; font-family: Montserrat
- Success green: #4ECE7E
- Toggle switch: width: 36px; height: 20px; border-radius: 100px; box-shadow: 0 0 4px rgba(0,0,0,0.16) inset

**Price Display** (same as HaloGrow JS pattern):
- Discount badge: background: #10b981; border-radius: 4px
- Original price: text-decoration: line-through; color: #999
- Apply button: background: #2563eb; border-radius: 0.5rem

---

## Cross-Page Patterns (EXPANDED - All 15 Pages)

### 9. Webflow Platform Pattern (HaloGrow + EmSense)

Both HaloGrow and EmSense share the SAME platform (Webflow + Funnel Builder Pro) with nearly identical checkout and sale page structures.

| Element | HaloGrow | EmSense |
|---------|----------|---------|
| CSS prefix | adv- / c- / timer- | int- / ck- / c- |
| Heading font | Open Sans / Sentient | Manrope |
| Body font | Open Sans | Manrope |
| Checkout font | Montserrat | Montserrat |
| Timer color | #1264e8 (blue) | #007ffd (blue) |
| CTA color | varies | #24aa2f (green) |
| Card shadow | 0 0 8px #00000029 | 0 0 8px #00000029 |
| Discount badge | #10b981 bg | #10b981 bg |
| Apply button | #2563eb blue | #2563eb blue |
| Error text | #EC0B43 red | #EC0B43 red |
| Product border | 3px (selected: #FFD700) | 2px (selected: #667eea) |

### 10. Checkout Product Card Pattern (HaloGrow + EmSense Shared)

The checkout product card is generated via JavaScript with this EXACT structure:

```
Product Row:
  [Radio button 20x20] [Image 64-116px] [Name + Badge + Price + Discount + Shipping]

Badge: bg #f59e0b, color white, border-radius 4px
Discount: bg #10b981, color white, border-radius 4px
Selected: border-left 4px solid #667eea / border-color #FFD700

Order Summary (dynamic):
  [Image 4rem] [Quantity badge: bg #2563eb, round] [Name + Price]
  Discount code input: border #d1d5db, radius 0.5rem
  Apply button: bg #2563eb, radius 0.5rem
  Total: font-size 1.5rem, font-weight 700
```

### 11. Top Banner / Timer Pattern

| Brand | Background | Timer | Content |
|-------|-----------|-------|---------|
| HaloGrow checkout | #0c230e | #1264e8 rounded | "Hurry! 70% discount reserved for" + 15min countdown |
| EmSense checkout | #007ffd | inline | Blue bar with countdown |
| EmSense sale | #00264c | sticky | "Limited Time Promo: 70% OFF" + country flags |
| ProstaVive VSL | N/A | countdown | "30:00" timer in order section |
| Emma VSL | N/A | inline | Timer in green order section |

### 12. Testimonial / Review Pattern Comparison

| Brand | Layout | Card Style | Author Display |
|-------|--------|-----------|---------------|
| Emma VSL | 2x2 grid | Story box, white bg | Name + Verified badge |
| HaloGrow adv | Vertical stack | `.adv-testimonial-2` bordered | Avatar + Name + "VERIFIED BUYER" + stars |
| HaloGrow product | Grid 0.3fr/1fr | No border | Large rating (88px) + bar charts |
| EmSense sale | 3-col grid | border #b3d9fe, radius 8px | Author blue (#3e57a1) + approval green (#41c131) |
| GetHeyFra landing | Simple div list | div.name + div.review_text | Name + text only |

### 13. FAQ Pattern Comparison

| Brand | Background | Title Size | Question | Answer | Toggle |
|-------|-----------|-----------|----------|--------|--------|
| Emma VSL | #f7f6f4 | 48px myriad-pro 900 | 20px myriad-pro 600 | 18px myriad-pro 400 | Green chevron images |
| ProstaVive | #f5f5f5 | 43px Poppins 700 | 23px Open Sans bolder | 20px Open Sans 400 | Dashed border separator |
| HaloGrow product | #f4f4f4 | N/A | faq-accordion-toggle bold 700 | 16px line-height 24px | Accordion icon |
| EmSense sale | N/A | int-h2 | int-h2 | N/A | N/A |

### 14. Ingredient / Feature Card Pattern

| Brand | Card Style | Layout |
|-------|-----------|--------|
| HaloGrow product | `.ingredient-block`: bg #162d18, radius 12px | Image left + Content right, badge #baf363 |
| HaloGrow product | `.feature-card`: border-bottom #cdcdba | Vertical stack, gap 16px |
| EmSense sale | `.int-compare-item`: border #e4e4e4, radius 12px | 2-column comparison grid |
| HaloGrow adv | No cards, flat layout | H2 + Image + Body text repeat |

### 15. Footer Pattern Comparison

| Brand | Background | Layout | Content |
|-------|-----------|--------|---------|
| Emma VSL | #e6e4e1 | max-width 780px | Disclosure, links, copyright |
| ProstaVive | Logo grid | Logo images | Brand logos footer |
| HaloGrow adv | #cce0eb | Flex center | Terms, Privacy, Disclaimer |
| HaloGrow product | #592022 | Multi-column grid | Links + payment badges + newsletter |
| EmSense sale | #141619 / #0e0f11 | Multi-column | Links + disclaimer + email |
| GetHeyFra | Dawn theme | Grid 6rem gap | Guarantee + menu + newsletter |
| Vibriance TY | CheckoutChamp | Simple | Contact link |
| SmoothSpine TY | CheckoutChamp | Simple | Terms + Privacy + DMCA |

### 16. Color Palette Summary (EXPANDED - All Brands)

**DTC Health/Beauty/Skincare pages dominant colors:**

| Purpose | VSL (Emma/Prosta) | HaloGrow | EmSense |
|---------|-------------------|----------|---------|
| Primary CTA green | #2fc265, #0a6050 | #24aa2f | #24aa2f |
| Urgency red | #d0190d, #e34134 | #EC0B43, #ff1f1f | #EC0B43, #e33c4c |
| Timer/Blue accent | #0882e2 | #1264e8, #2563eb | #007ffd, #2563eb |
| Yellow/Gold | #fbd262, #ffbf00 | #f59e0b, #baf363 | N/A |
| Dark text | #000, #191919 | #02122e, #0c230e | #02122e |
| Dark bg (navy) | N/A | #0c230e, #00264c | #00264c, #141619 |
| Warm bg | #f7f6f4, #fff5e0 | #fffbef | #f9f2e8 |
| Neutral bg | #f5f5f5, #e6e4e1 | #f4f4f4 | #f5f5f5 |
| Success/Approval | #146e54 | #10b981 | #41c131, #10b981 |
| Card shadow | N/A | 0 0 8px #00000029 | 0 0 8px #00000029 |
| Footer dark | #e6e4e1 | #592022 | #141619 |

### 17. Shared Checkout JS Pattern (Funnel Builder Pro)

Both HaloGrow and EmSense checkouts share the SAME JavaScript code for:
- Product selection with radio buttons (20x20px)
- Dynamic order summary generation
- Discount code input (#2563eb Apply button)
- Applied discount display (#f0fdf4 bg, #bbf7d0 border)
- Price breakdown with strikethrough original prices
- Total calculation (#111827 text, 1.5rem bold)
- Product row highlight on selection (#667eea border-left)
- Quantity badges (#2563eb blue, border-radius 9999px)

This confirms a shared Funnel Builder Pro template system used across multiple brands.

### 18. Page Type CSS Architecture Summary

| Page Type | CSS Method | Font Stack | Key Pattern |
|-----------|-----------|------------|-------------|
| VSL (Emma) | Inline `<style>` minified | myriod-pro custom, Inter | Drop mechanism (video timestamp trigger) |
| VSL (ProstaVive) | Inline `<style>` | IBM Plex Sans, Oswald, Poppins | Bootstrap 3 grid, Vidalytics embed |
| Thank You (Vibriance) | CheckoutChamp inline | Lato, Merriweather | Template variables {{}}, fk-row/fk-col |
| Thank You (SmoothSpine) | CheckoutChamp inline | System fonts | Invoice table, survey, community CTAs |
| Landing (GetHeyFra) | Shopify Dawn + GemPages | Figtree, system fonts | CSS variables, drawer cart |
| Advertorial (HaloGrow) | Webflow inline | Open Sans, Sentient | adv- prefix, listicle pattern |
| Product (HaloGrow) | Webflow inline | Sentient, Public Sans | heading-* classes, ingredient blocks |
| Checkout (HaloGrow) | Webflow + JS inline | Montserrat | c- prefix, timer-, JS cart generation |
| Sale Page (EmSense) | Webflow inline | Manrope | int- prefix, section variants |
| Checkout (EmSense) | Webflow + JS inline | Montserrat | ck- prefix, same JS cart pattern |
| Advertorial (EmSense) | Webflow inline | Manrope | int-section ad11-* variants |
