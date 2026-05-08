# UPSELL PAGES ANALYSIS - Exact CSS & Structure (FINAL)

_Extracted from 12 real DTC upsell pages (Vibriance x5, Clarifion x4, VSL x3)_
_CSS values extracted from builder-generated stylesheets (FunnelKonnekt/CheckoutChamp)_
_Text content from static HTML + JavaScript templates_

---

## Vibriance OTO1 (upsell-oto1-vibriance.html)

- **File size**: 524,573 bytes | **Custom CSS**: 8,514 bytes
- **Timer**: 10 min
- **ID rules**: 41 | **Class rules**: 21 | **Keyframes**: 1

### A. Interrupt Header

**ID**: `#ii15r` | **Tag**: `<div>` | **Text**: `WAIT! Your order is not complete! Almost Complete...`

**ID**: `#i0ruk` | **Tag**: `<div>` | **Text**: `WAIT! Your order is not complete! Almost Complete...`

**ID**: `#i2c8i` | **Tag**: `<div>` | **Text**: `WAIT! Your order is not complete!`

**ID**: `#isbth` | **Tag**: `<div>` | **Text**: `WAIT! Your order is not complete!`

### B. Countdown Timer

**Duration**: 10 min

`.countdown`:
```css
  font-family: Helvetica, serif;
  text-align: center;
```

`.countdown-block`:
```css
  display: inline-block;
  margin: 0 10px;
  padding: 10px;
```

`.countdown-cont`:
```css
  display: inline-block;
```

`.countdown-digit`:
```css
  font-size: 1rem;
```

`.countdown-endtext`:
```css
  font-size: 5rem;
```

### C. Headlines

_No static headlines found in HTML (rendered via JS)_

### D. CTA Button

**Text**: `YES! CONFIRM THIS AMAZING UPGRADE`
**Tag**: `<button>` | **ID**: `#iaqwq`

**Text**: `No thanks, I don't want to upgrade my order. When I run out I'll just pay the fu`
**Tag**: `<a>` | **ID**: `#fkt-link-3ec-291-8ab`

**CTA Class Styles:**
`.btn`:
```css
  -moz-user-select: none;
  -ms-user-select: none;
  -webkit-user-select: none;
  border: 1px solid transparent;
  border-radius: .25rem;
  display: inline-block;
  font-family: Helvetica, serif;
  font-size: 20px;
  font-weight: 400;
  line-height: 1.5;
  margin: 20px auto;
  padding-bottom: 10px;
  padding-left: 25px;
  padding-right: 25px;
  padding-top: 10px;
  text-align: center;
  transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
  user-select: none;
  vertical-align: middle;
  white-space: normal;
```

`.btn.btn-primary`:
```css
  background: #007bff;
  border-color: #007bff;
  color: #fff;
  white-space: normal;
```

`.fk-youtube .play-button`:
```css
  background-color: #333;
  border-radius: 6px;
  box-shadow: 0 0 30px rgba( 0,0,0,0.6 );
  height: 60px;
  opacity: 0.8;
  width: 90px;
  z-index: 1;
```

### E. Opt-Out (Negative Option)

**Text**: `No thanks, I don't want to upgrade my order. When I run out I'll just pay the fu`
**Tag**: `<a>` | **ID**: `#fkt-link-3ec-291-8ab`

### F. Price Elements

`#fkt-link-3ec-291-8ab`:
```css
  border-bottom-left-radius: 1px;
  border-bottom-right-radius: 1px;
  border-top-left-radius: 1px;
  border-top-right-radius: 1px;
  color: #0000EE !important;
  cursor: pointer;
  display: inline-block;
  flex: 0 0;
  font-family: Helvetica, serif;
  font-size: 17px;
  padding-left: 10px;
  padding-right: 10px;
```

`#is9hi`:
```css
  color: #808080 !important;
  font-family: Helvetica, serif;
  font-size: 18px;
  font-weight: 600;
  padding: 10px;
  text-decoration: line-through;
```

### G. Guarantee

**Text**: `Upgrade your order and get 3 more bottles of Super C Serum for ONLY $28.20 each!`

### H. Key ID-Based CSS (Conversion-Relevant)

```css
  #fkt-image-239-8b7-918 {
    color: black !important;
    height: 41px;
    margin-bottom: 0;
    width: auto !important;
  }
  #fkt-image-b47-490-9ec {
    color: black !important;
    height: auto;
    width: 100% !important;
  }
  #fkt-link-3ec-291-8ab {
    border-bottom-left-radius: 1px;
    border-bottom-right-radius: 1px;
    border-top-left-radius: 1px;
    border-top-right-radius: 1px;
    color: #0000EE !important;
    cursor: pointer;
    display: inline-block;
    flex: 0 0;
    font-family: Helvetica, serif;
    font-size: 17px;
    padding-left: 10px;
    padding-right: 10px;
  }
  #i0g57 {
    padding-left: 2%;
    padding-right: 2%;
  }
  #i0ruk {
    padding-bottom: 10px;
  }
  #i2c8i {
    margin-left: 0;
    margin-right: 0;
    padding-bottom: 0;
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
  }
  #i45ha {
    padding-left: 10px;
    padding-right: 10px;
  }
  #i5rkoi {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    margin-top: 10px;
  }
  #i6d5l {
    display: none;
    justify-content: space-between;
    margin-bottom: 10px;
    margin-top: 10px;
  }
  #i7l4d {
    margin-left: 0;
    margin-right: 0;
    padding-bottom: 0;
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
  }
  #i898y {
    margin-left: 0;
    margin-right: 0;
    padding-left: 0;
    padding-right: 0;
  }
  #i8egh {
    display: none;
  }
  #iaqwq {
    background-color: #30bd51 !important;
    border-style: none;
    flex: 0 0;
    font-weight: 600;
    height: auto;
    padding-bottom: 15px;
    padding-top: 15px;
    width: 100% !important;
  }
  #ibgcg {
    font-size: 18px;
  }
  #ichqs {
    margin-bottom: 0;
    margin-left: 0;
    margin-right: 0;
    margin-top: 0;
    padding-bottom: 0;
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
  }
  #id47h {
    display: flex;
  }
  #idjao {
    font-size: 18px;
  }
  #idn0f {
    margin-left: 0;
    margin-right: 0;
    padding-bottom: 0;
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
  }
  #igv9k {
    justify-content: flex-start;
    margin-left: auto;
    margin-right: auto;
  }
  #ii15r {
    padding-bottom: 10px;
  }
  #ijhcd {
    font-size: 20px;
    font-weight: 600;
  }
  #ikb99 {
    align-items: center;
    display: flex;
    justify-content: center;
  }
  #ikdky {
    font-size: 18px;
  }
  #imu2f {
    font-size: 14px;
    font-weight: 400;
    margin-right: 4px;
  }
  #inlhk {
    font-size: 19px;
  }
  #io87s {
    animation: move 2s linear infinite;
    background-color: rgb(71, 71, 83) !important;
    shape-outside: 50%;
    width: 50%;
  }
  #iozz2 {
    align-items: center;
    display: flex;
    font-family: Helvetica, serif;
    font-size: 21px;
    font-weight: 600;
    justify-content: flex-end;
    padding: 10px;
    text-align: left;
  }
  #iq0j7 {
    display: block;
  }
  #irsjh {
    font-size: 14px;
  }
  #irtid {
    padding-left: 50px;
  }
  #is81k {
    align-items: center;
    display: flex;
    justify-content: center;
  }
  #is9hi {
    color: #808080 !important;
    font-family: Helvetica, serif;
    font-size: 18px;
    font-weight: 600;
    padding: 10px;
    text-decoration: line-through;
  }
  #isbth {
    font-size: 20px;
  }
  #it5rp {
    font-size: 20px;
    font-weight: 600;
  }
  #ius4i {
    margin-left: 0;
    margin-right: 0;
    padding-bottom: 10px;
    padding-left: 0;
    padding-right: 0;
  }
  #ivrkf {
    font-size: 14px;
    font-weight: 400;
    margin-right: 4px;
  }
  #iwr6q {
    height: auto;
    width: auto;
  }
  #ixe8os {
    font-size: 24px;
  }
  #iyd8d {
    font-size: 19px;
  }
  #iyicj {
    font-size: 20px;
    font-weight: 600;
  }
  #izt0d {
    display: block;
  }
```

### I. Key Class-Based CSS

```css
  .btn {
    -moz-user-select: none;
    -ms-user-select: none;
    -webkit-user-select: none;
    border: 1px solid transparent;
    border-radius: .25rem;
    display: inline-block;
    font-family: Helvetica, serif;
    font-size: 20px;
    font-weight: 400;
    line-height: 1.5;
    margin: 20px auto;
    padding-bottom: 10px;
    padding-left: 25px;
    padding-right: 25px;
    padding-top: 10px;
    text-align: center;
    transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
    user-select: none;
    vertical-align: middle;
    white-space: normal;
  }
  .btn.btn-primary {
    background: #007bff;
    border-color: #007bff;
    color: #fff;
    white-space: normal;
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
    font-size: 5rem;
  }
  .fk-progress-bar-striped {
    align-items: center;
    border-radius: 8px;
    width: 50%;
  }
  .fk-youtube .fk-rm.image {
    -webkit-background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    height: 100%;
    position: absolute;
    width: 100%;
  }
  .fk-youtube .play-button {
    background-color: #333;
    border-radius: 6px;
    box-shadow: 0 0 30px rgba( 0,0,0,0.6 );
    height: 60px;
    opacity: 0.8;
    width: 90px;
    z-index: 1;
  }
  .fk-youtube .play-button:before {
    border-color: transparent transparent transparent #fff;
    border-style: solid;
    border-width: 15px 0 15px 26.0px;
    content: "";
  }
```

### J. All Static Text Content (from HTML)

  `#fkt-link-3ec-291-8ab` (a): `No thanks, I don't want to upgrade my order. When I run out I'll just pay the fu`
  `#i0ruk` (div): `WAIT! Your order is not complete! Almost Complete...`
  `#i2c8i` (div): `WAIT! Your order is not complete!`
  `#i5rkoi` (div): `$141.00 40% OFF! Total: $84.60`
  `#i6d5l` (div): `$141.00 40% OFF! USD $84.60`
  `#iaqwq` (button): `YES! CONFIRM THIS AMAZING UPGRADE`
  `#ibgcg` (div): `$141.00`
  `#id47h` (span): `00 : 00`
  `#idjao` (div): `Hurry! This offer ends in:`
  `#igv9k` (div): `Almost Complete...`
  `#ii15r` (div): `WAIT! Your order is not complete! Almost Complete...`
  `#ikb99` (div): `Hurry! This offer ends in: 00 : 00`
  `#ikdky` (div): `Upgrade your order and get 3 more bottles of Super C Serum for ONLY $28.20 each!`
  `#inlhk` (div): `40% OFF!`
  `#io87s` (div): `Almost Complete...`
  `#iozz2` (div): `USD $84.60`
  `#irsjh` (div): `Almost Complete...`
  `#irtid` (div): `Almost Complete...`
  `#is9hi` (div): `$141.00`
  `#isbth` (div): `WAIT! Your order is not complete!`
  `#ivrkf` (span): `Total:`
  `#iwr6q` (div): `00 : 00`
  `#ixe8os` (div): `Total: $84.60`
  `#iyd8d` (div): `40% OFF!`
  `#pageDataScript` (script): `var pageData = {"pageViewReferenceId":"b1949f77-2134-4b6c-9dde-486c79127f53","fu`

### K. JavaScript Template Texts

- `); // Step 2: Confirm payment with Stripe.js console.log(`
- `); e.preventDefault(); orderSummary.classList.toggle(`
- `); orderSummary.classList.toggle(`
- `); orders.unshift(order); localStorage.setItem(`
- `); updateOrderStatus(order.id,`
- `, JSON.stringify(orders)); console.log(`
- `, currencyCode); // Create order draft BEFORE payment processing console.log(`
- `, error); // Update order status to failed updateOrderStatus(order.id,`
- `, foundDiscount); appliedDiscountCode = foundDiscount; setTimeout(() => { syncOrderSummaryWithProduc`
- `, orderId); } catch (error) { console.error(`
- `.order-applied-discount-remove`
- `.order-discount-code-button`
- `.order-discount-code-input`
- `.order-summary-body`
- `.order-summary-header`
- `; // Order Item bodyHTML +=`
- `; productRow.style.borderLeft =`
- `; r.style.borderLeft =`
- `; row.style.borderColor =`
- `; row.style.borderLeft =`

---

## Vibriance OTO2 (upsell-oto2-vibriance.html)

- **File size**: 516,731 bytes | **Custom CSS**: 10,825 bytes
- **Timer**: 10 min
- **ID rules**: 43 | **Class rules**: 18 | **Keyframes**: 1

### A. Interrupt Header

_No interrupt header found_

### B. Countdown Timer

**Duration**: 10 min

`.countdown-digit`:
```css
  font-size: 1rem;
```

### C. Headlines

_No static headlines found in HTML (rendered via JS)_

### D. CTA Button

**Text**: `YES!  Upgrade My Order Now...`
**Tag**: `<div>` | **ID**: `#iihia7`

**Text**: `YES!  Upgrade My Order Now...`
**Tag**: `<div>` | **ID**: `#imkpfs`

**Text**: `YES!  Upgrade My Order Now...`
**Tag**: `<button>` | **ID**: `#ih9qzc`

**CTA Class Styles:**
`.btn`:
```css
  -moz-user-select: none;
  -ms-user-select: none;
  -webkit-user-select: none;
  border: 1px solid transparent;
  border-radius: .25rem;
  display: inline-block;
  font-family: Helvetica, serif;
  font-size: 20px;
  font-weight: 400;
  line-height: 1.5;
  margin: 20px auto;
  padding-bottom: 10px;
  padding-left: 25px;
  padding-right: 25px;
  padding-top: 10px;
  text-align: center;
  transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
  user-select: none;
  vertical-align: middle;
  white-space: normal;
```

`.btn.btn-primary`:
```css
  background: #007bff;
  border-color: #007bff;
  color: #fff;
  white-space: normal;
```

`.btn.btn-primary.btnStyle`:
```css
  background: #f4f4f4;
  border-color: #007bff;
  border-radius: 30px;
  border-width: 3px;
  color: #007bff;
  font-family: Helvetica, serif;
  padding: 6px 20px;
  padding-bottom: 10px;
  padding-left: 25px;
  padding-right: 25px;
  padding-top: 10px;
  white-space: normal;
```

`.btn.btn-primary.btnStyle:hover`:
```css
  background: #007bff;
  border-color: #007bff;
  color: #fff;
  white-space: normal;
```

`.fk-youtube .play-button`:
```css
  background-color: #333;
  border-radius: 6px;
  box-shadow: 0 0 30px rgba( 0,0,0,0.6 );
  height: 60px;
  opacity: 0.8;
  width: 90px;
  z-index: 1;
```

### E. Opt-Out (Negative Option)

**Text**: `Or, click here to say “NO THANKS” and miss out
on the lowest price we’ve ever of`
**Tag**: `<div>` | **ID**: `#izz9ao`

**Text**: `Or, click here to say “NO THANKS” and miss out
on the lowest price we’ve ever of`
**Tag**: `<a>` | **ID**: `#fkt-link-cf5-c9a-8cd`

### F. Price Elements

_No price-specific CSS found (prices rendered via JS)_

### G. Guarantee

**Text**: `Try It RISK FREE for one full year! Use it all and love it, or your money back!`

### H. Key ID-Based CSS (Conversion-Relevant)

```css
  #fkt-image-898-194-80e {
    margin-top: 5px;
  }
  #fkt-image-8a7-d93-883 {
    color: black !important;
    width: 200px !important;
  }
  #i2v6e {
    padding-bottom: 0;
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
  }
  #i2zpd4 {
    font-size: 20px;
    line-height: 35px;
    padding-left: 3px;
    padding-right: 3px;
  }
  #i3n5a {
    padding-bottom: 0;
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
  }
  #i4kpf {
    font-family: Poppins, sans-serif;
    font-size: 32px;
    font-weight: 600;
    line-height: 42px;
  }
  #i4q6u {
    font-size: 22px;
  }
  #i5vc9z {
    background-color: #FF1D8E !important;
    padding-bottom: 7px;
    padding-top: 7px;
  }
  #iaj9il {
    font-size: 42px;
  }
  #id47h {
    display: flex;
    margin-left: 5px;
  }
  #idekn4 {
    padding-bottom: 0;
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
  }
  #idn0f {
    margin-bottom: 2px;
    margin-left: 0;
    margin-right: 0;
    margin-top: 2px;
    padding-bottom: 0;
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
  }
  #iehkqi {
    font-size: 20px;
    line-height: 35px;
    padding-left: 5px;
    padding-right: 5px;
  }
  #ifdxh {
    padding-bottom: 0;
    padding-top: 10px;
  }
  #iflw4q {
    text-align: left;
  }
  #igpy0q {
    font-size: 20px;
  }
  #ih9qzc {
    font-size: 18px;
    line-height: 28px;
    width: 80% !important;
  }
  #iihia7 {
    padding-bottom: 0;
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
  }
  #ijhcd {
    font-size: 22px;
  }
  #ikgr2h {
    font-size: 22px;
    line-height: 32px;
  }
  #iko6sr {
    font-size: 22px;
  }
  #iktv2k {
    padding-bottom: 0;
    padding-top: 0;
  }
  #ilwsa8 {
    display: none;
  }
  #im6yxl {
    font-size: 20px;
    line-height: 32px;
  }
  #imkpfs {
    margin-top: 5px;
    padding-bottom: 0;
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
  }
  #inop49 {
    padding-bottom: 0;
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
  }
  #io1fk {
    margin-left: 0;
    margin-right: 0;
    padding-left: 3px;
    padding-right: 3px;
  }
  #io7aau {
    font-size: 18px;
  }
  #ioc7n6 {
    padding-bottom: 0;
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
  }
  #iomrb {
    font-size: 18px;
  }
  #ipgtci {
    padding-bottom: 0;
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
  }
  #it5rp {
    font-size: 22px;
  }
  #iti6db {
    padding-bottom: 0;
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
  }
  #itk7sk {
    font-size: 14px;
    margin-top: 10px;
  }
  #itryq {
    font-size: 14px;
  }
  #ius4i {
    margin-left: 0;
    margin-right: 0;
    padding-bottom: 0;
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
  }
  #iy91g {
    width: 90%;
  }
  #iyc5sj {
    padding-bottom: 0;
    padding-top: 0;
  }
  #iyw8qe {
    font-size: 24px;
  }
  #iz74c {
    animation: move 2s linear infinite;
    background-color: rgb(71, 71, 83) !important;
    shape-outside: 50%;
    width: 50%;
  }
  #izz9ao {
    font-family: Poppins, sans-serif;
    font-size: 12px;
  }
```

### I. Key Class-Based CSS

```css
  .btn {
    -moz-user-select: none;
    -ms-user-select: none;
    -webkit-user-select: none;
    border: 1px solid transparent;
    border-radius: .25rem;
    display: inline-block;
    font-family: Helvetica, serif;
    font-size: 20px;
    font-weight: 400;
    line-height: 1.5;
    margin: 20px auto;
    padding-bottom: 10px;
    padding-left: 25px;
    padding-right: 25px;
    padding-top: 10px;
    text-align: center;
    transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
    user-select: none;
    vertical-align: middle;
    white-space: normal;
  }
  .btn.btn-primary {
    background: #007bff;
    border-color: #007bff;
    color: #fff;
    white-space: normal;
  }
  .btn.btn-primary.btnStyle {
    background: #f4f4f4;
    border-color: #007bff;
    border-radius: 30px;
    border-width: 3px;
    color: #007bff;
    font-family: Helvetica, serif;
    padding: 6px 20px;
    padding-bottom: 10px;
    padding-left: 25px;
    padding-right: 25px;
    padding-top: 10px;
    white-space: normal;
  }
  .btn.btn-primary.btnStyle:hover {
    background: #007bff;
    border-color: #007bff;
    color: #fff;
    white-space: normal;
  }
  .countdown-digit {
    font-size: 1rem;
  }
  .fk-progress-bar-striped {
    align-items: center;
    border-radius: 8px;
    width: 50%;
  }
  .fk-youtube .fk-rm.image {
    -webkit-background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    height: 100%;
    position: absolute;
    width: 100%;
  }
  .fk-youtube .play-button {
    background-color: #333;
    border-radius: 6px;
    box-shadow: 0 0 30px rgba( 0,0,0,0.6 );
    height: 60px;
    opacity: 0.8;
    width: 90px;
    z-index: 1;
  }
  .fk-youtube .play-button:before {
    border-color: transparent transparent transparent #fff;
    border-style: solid;
    border-width: 15px 0 15px 26.0px;
    content: "";
  }
```

### J. All Static Text Content (from HTML)

  `#fkt-link-cf5-c9a-8cd` (a): `Or, click here to say “NO THANKS” and miss out
on the lowest price we’ve ever of`
  `#i2v6e` (div): `WARNING: Only for those ready to uncover dramatically younger-looking skin.`
  `#i2zpd4` (div): `It stimulates natural skin collagen while reducing DEEP WRINKLES using Poly-Pore`
  `#i3fww` (b): `MATURE skin of women over 50...`
  `#i3n5a` (div): `WARNING: Only for those ready to uncover dramatically younger-looking skin.`
  `#i4kpf` (div): `WARNING: Only for those ready to uncover dramatically younger-looking skin.`
  `#i4q6u` (div): `Upgrade your order now with Vibriance Retinol Serum:`
  `#i5vc9z` (div): `Almost Complete...`
  `#iaj9il` (div): `Just $32`
  `#ic11x` (div): `It stimulates natural skin collagen while reducing DEEP WRINKLES using Poly-Pore`
  `#id47h` (span): `09 : 57`
  `#idekn4` (div): `Upgrade Your Order Now With A One-Month Treatment: Just $32 25% OFF, today only!`
  `#iflw4q` (i): `minimizes skin irritation!`
  `#igoq6` (span): `retinol serum made exclusively for the delicate`
  `#igpy0q` (div): `Using both together ensures 24-hour care for mature skin: Smoothing and brighten`
  `#ih9qzc` (button): `YES!  Upgrade My Order Now...`
  `#ii16j` (div): `It's the FIRST & ONLY retinol serum made exclusively for the delicate MATURE ski`
  `#iihia7` (div): `YES!  Upgrade My Order Now...`
  `#ikgr2h` (div): `Hurry, offer ends in 09 : 57`
  `#iko6sr` (div): `Upgrade Your Order Now With A One-Month Treatment:`
  `#im6yxl` (div): `It's the FIRST & ONLY retinol serum made exclusively for the delicate MATURE ski`
  `#imkpfs` (div): `YES!  Upgrade My Order Now...`
  `#inop49` (div): `Upgrade Your Order Now With A One-Month Treatment: Just $32 25% OFF, today only!`
  `#io7aau` (div): `For results you can see: 🩷 Lifts sagging skin 🩷 Smoothes fine lines & wrinkles 🩷`
  `#ioc7n6` (div): `80% Of Repeat Vibriance Customers Add THIS To Their Order...`
  `#iomrb` (div): `80% Of Repeat Vibriance Customers Add THIS To Their Order...`
  `#ipgtci` (div): `Almost Complete...`
  `#iti6db` (div): `80% Of Repeat Vibriance Customers Add THIS To Their Order...`
  `#itk7sk` (div): `Try It RISK FREE for one full year! Use it all and love it, or your money back!`
  `#itryq` (div): `Almost Complete...`
  `#iwr6q` (div): `09 : 57`
  `#iy91g` (div): `Almost Complete...`
  `#iyw8qe` (div): `25% OFF, today only!`
  `#iz74c` (div): `Almost Complete...`
  `#izz9ao` (div): `Or, click here to say “NO THANKS” and miss out
on the lowest price we’ve ever of`
  `#pageDataScript` (script): `var pageData = {"pageViewReferenceId":"fee07d30-9e1b-4c70-a1d4-9ace02943597","fu`

### K. JavaScript Template Texts

- `); // Step 2: Confirm payment with Stripe.js console.log(`
- `); e.preventDefault(); orderSummary.classList.toggle(`
- `); orderSummary.classList.toggle(`
- `); orders.unshift(order); localStorage.setItem(`
- `); updateOrderStatus(order.id,`
- `, JSON.stringify(orders)); console.log(`
- `, currencyCode); // Create order draft BEFORE payment processing console.log(`
- `, error); // Update order status to failed updateOrderStatus(order.id,`
- `, foundDiscount); appliedDiscountCode = foundDiscount; setTimeout(() => { syncOrderSummaryWithProduc`
- `, orderId); } catch (error) { console.error(`
- `.order-applied-discount-remove`
- `.order-discount-code-button`
- `.order-discount-code-input`
- `.order-summary-body`
- `.order-summary-header`
- `; // Order Item bodyHTML +=`
- `; productRow.style.borderLeft =`
- `; r.style.borderLeft =`
- `; row.style.borderColor =`
- `; row.style.borderLeft =`

---

## Vibriance OTO3 (upsell-oto3-vibriance.html)

- **File size**: 506,599 bytes | **Custom CSS**: 9,690 bytes
- **Timer**: 10 min
- **ID rules**: 43 | **Class rules**: 22 | **Keyframes**: 1

### A. Interrupt Header

**ID**: `#iti6db` | **Tag**: `<div>` | **Text**: `WAIT! Your Order Is Not Complete...`

**ID**: `#ioc7n6` | **Tag**: `<div>` | **Text**: `WAIT! Your Order Is Not Complete...`

**ID**: `#iomrb` | **Tag**: `<div>` | **Text**: `WAIT! Your Order Is Not Complete...`

### B. Countdown Timer

**Duration**: 10 min

`.countdown`:
```css
  font-family: Helvetica, serif;
  text-align: center;
```

`.countdown-block`:
```css
  display: inline-block;
  margin: 0 10px;
  padding: 10px;
```

`.countdown-cont`:
```css
  display: inline-block;
```

`.countdown-digit`:
```css
  font-size: 1rem;
```

`.countdown-endtext`:
```css
  font-size: 5rem;
```

### C. Headlines

_No static headlines found in HTML (rendered via JS)_

### D. CTA Button

**Text**: `Yes! Upgrade My Order... Comes with 100% Money Back Guarantee. Try a FULL SERUM `
**Tag**: `<div>` | **ID**: `#iihia7`

**Text**: `Yes! Upgrade My Order... Comes with 100% Money Back Guarantee. Try a FULL SERUM `
**Tag**: `<div>` | **ID**: `#imkpfs`

**Text**: `Yes! Upgrade My Order...`
**Tag**: `<button>` | **ID**: `#ih9qzc`

**CTA Class Styles:**
`.btn`:
```css
  -moz-user-select: none;
  -ms-user-select: none;
  -webkit-user-select: none;
  border: 1px solid transparent;
  border-radius: .25rem;
  display: inline-block;
  font-family: Helvetica, serif;
  font-size: 20px;
  font-weight: 400;
  line-height: 1.5;
  margin: 20px auto;
  padding-bottom: 10px;
  padding-left: 25px;
  padding-right: 25px;
  padding-top: 10px;
  text-align: center;
  transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
  user-select: none;
  vertical-align: middle;
  white-space: normal;
```

`.btn.btn-primary`:
```css
  background: #007bff;
  border-color: #007bff;
  color: #fff;
  white-space: normal;
```

`.btn.btn-primary.btnStyle`:
```css
  background: #f4f4f4;
  border-color: #007bff;
  border-radius: 30px;
  border-width: 3px;
  color: #007bff;
  font-family: Helvetica, serif;
  padding: 6px 20px;
  padding-bottom: 10px;
  padding-left: 25px;
  padding-right: 25px;
  padding-top: 10px;
  white-space: normal;
```

`.btn.btn-primary.btnStyle:hover`:
```css
  background: #007bff;
  border-color: #007bff;
  color: #fff;
  white-space: normal;
```

`.fk-youtube .play-button`:
```css
  background-color: #333;
  border-radius: 6px;
  box-shadow: 0 0 30px rgba( 0,0,0,0.6 );
  height: 60px;
  opacity: 0.8;
  width: 90px;
  z-index: 1;
```

### E. Opt-Out (Negative Option)

**Text**: `Or, click here to say NO THANKS, I don't want
to give my eyes an instant refresh`
**Tag**: `<div>` | **ID**: `#izz9ao`

**Text**: `Or, click here to say NO THANKS, I don't want
to give my eyes an instant refresh`
**Tag**: `<a>` | **ID**: `#fkt-link-858-996-91d`

### F. Price Elements

_No price-specific CSS found (prices rendered via JS)_

### G. Guarantee

**Text**: `Yes! Upgrade My Order... Comes with 100% Money Back Guarantee. Try a FULL SERUM `

**Text**: `Yes! Upgrade My Order... Comes with 100% Money Back Guarantee. Try a FULL SERUM `

**Text**: `Comes with 100% Money Back Guarantee. Try a FULL SERUM risk-free for one year.`

### H. Key ID-Based CSS (Conversion-Relevant)

```css
  #fkt-image-8a7-d93-883 {
    color: black !important;
    width: 200px !important;
  }
  #fkt-image-ddd-6b4-bb8 {
    color: black !important;
  }
  #fkt-image-ff6-ba9-be2 {
    color: black !important;
  }
  #i1uod5 {
    font-size: 32px;
    line-height: 45px;
  }
  #i2v6e {
    padding-bottom: 0;
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
  }
  #i3n5a {
    padding-bottom: 0;
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
  }
  #i4kpf {
    font-size: 22px;
    line-height: 35px;
  }
  #i5vc9z {
    background-color: #FF1D8E !important;
    border-bottom-left-radius: 1px;
    border-bottom-right-radius: 1px;
    border-bottom-width: 1px;
    border-left-width: 1px;
    border-right-width: 1px;
    border-top-left-radius: 1px;
    border-top-right-radius: 1px;
    border-top-width: 1px;
    flex: 1 0;
  }
  #i7l4d {
    margin-left: 0;
    margin-right: 0;
    padding-bottom: 0;
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
  }
  #i9gchl {
    margin-left: 10px;
    margin-right: 10px;
  }
  #iahre1 {
    padding-bottom: 0;
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
  }
  #ib5vpl {
    font-size: 24px;
    margin-left: 5px;
    margin-right: 5px;
  }
  #ichqs {
    margin-bottom: 0;
    margin-left: 0;
    margin-right: 0;
    margin-top: 0;
    padding-bottom: 0;
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
  }
  #id0dwg {
    padding-bottom: 0;
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
  }
  #id47h {
    display: flex;
  }
  #idekn4 {
    padding-bottom: 0;
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
  }
  #idjao {
    font-size: 18px;
  }
  #idn0f {
    margin-bottom: 5px;
    margin-left: 0;
    margin-right: 0;
    margin-top: 5px;
    padding-bottom: 0;
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
  }
  #idq347 {
    margin-bottom: 10px;
    padding-bottom: 0;
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
  }
  #ih9qzc {
    width: 95% !important;
  }
  #iihia7 {
    padding-bottom: 0;
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
  }
  #ijhcd {
    font-size: 18px;
  }
  #ik53yi {
    flex-direction: column;
  }
  #ikb99 {
    display: flex;
  }
  #iko6sr {
    font-size: 24px;
  }
  #imkpfs {
    margin-top: 5px;
    padding-bottom: 0;
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
  }
  #inop49 {
    padding-bottom: 0;
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
  }
  #ioc7n6 {
    padding-bottom: 0;
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
  }
  #iomrb {
    font-size: 18px;
  }
  #ipgtci {
    padding-bottom: 0;
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
  }
  #iq9hxk {
    padding-bottom: 0;
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
  }
  #it5rp {
    display: flex;
    flex-direction: row;
    font-size: 18px;
    justify-content: center;
  }
  #iti6db {
    padding-bottom: 0;
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
  }
  #itk7sk {
    font-family: Poppins, sans-serif;
    font-size: 16px;
    font-weight: 700;
    margin-top: 1px;
    padding: 1px;
  }
  #itryq {
    font-size: 14px;
  }
  #iu9ojg {
    padding-bottom: 0;
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
  }
  #ius4i {
    margin-left: 0;
    margin-right: 0;
    padding-bottom: 0;
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
  }
  #iwr6q {
    height: auto;
    width: auto;
  }
  #iy91g {
    width: 90%;
  }
  #iyicj {
    font-size: 18px;
  }
  #iz74c {
    animation: move 2s linear infinite;
    background-color: rgb(71, 71, 83) !important;
    shape-outside: 50%;
    width: 50%;
  }
  #izz9ao {
    font-family: Poppins, sans-serif;
    font-size: 14px;
    margin-left: 15px;
    margin-right: 15px;
  }
```

### I. Key Class-Based CSS

```css
  .btn {
    -moz-user-select: none;
    -ms-user-select: none;
    -webkit-user-select: none;
    border: 1px solid transparent;
    border-radius: .25rem;
    display: inline-block;
    font-family: Helvetica, serif;
    font-size: 20px;
    font-weight: 400;
    line-height: 1.5;
    margin: 20px auto;
    padding-bottom: 10px;
    padding-left: 25px;
    padding-right: 25px;
    padding-top: 10px;
    text-align: center;
    transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
    user-select: none;
    vertical-align: middle;
    white-space: normal;
  }
  .btn.btn-primary {
    background: #007bff;
    border-color: #007bff;
    color: #fff;
    white-space: normal;
  }
  .btn.btn-primary.btnStyle {
    background: #f4f4f4;
    border-color: #007bff;
    border-radius: 30px;
    border-width: 3px;
    color: #007bff;
    font-family: Helvetica, serif;
    padding: 6px 20px;
    padding-bottom: 10px;
    padding-left: 25px;
    padding-right: 25px;
    padding-top: 10px;
    white-space: normal;
  }
  .btn.btn-primary.btnStyle:hover {
    background: #007bff;
    border-color: #007bff;
    color: #fff;
    white-space: normal;
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
    font-size: 5rem;
  }
  .fk-progress-bar-striped {
    align-items: center;
    border-radius: 8px;
    width: 50%;
  }
  .fk-youtube .fk-rm.image {
    -webkit-background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    height: 100%;
    position: absolute;
    width: 100%;
  }
  .fk-youtube .play-button {
    background-color: #333;
    border-radius: 6px;
    box-shadow: 0 0 30px rgba( 0,0,0,0.6 );
    height: 60px;
    opacity: 0.8;
    width: 90px;
    z-index: 1;
  }
  .fk-youtube .play-button:before {
    border-color: transparent transparent transparent #fff;
    border-style: solid;
    border-width: 15px 0 15px 26.0px;
    content: "";
  }
```

### J. All Static Text Content (from HTML)

  `#fkt-link-858-996-91d` (a): `Or, click here to say NO THANKS, I don't want
to give my eyes an instant refresh`
  `#i1uod5` (div): `Instantly Brightens & Depuffs Tired Eyes...`
  `#i2v6e` (div): `Take Years Off Your Eyes With Vibriance™ Eye Renewal Serum Instantly Brightens &`
  `#i3n5a` (div): `Take Years Off Your Eyes With Vibriance™ Eye Renewal Serum Instantly Brightens &`
  `#i4kpf` (div): `Take Years Off Your Eyes With Vibriance™ Eye Renewal Serum`
  `#i5vc9z` (div): `Almost Complete...`
  `#iahre1` (div): `Hurry! This offer ends in: 00 : 00`
  `#ib5vpl` (div): `... 36% OFF, Today Only!`
  `#id47h` (span): `00 : 00`
  `#idekn4` (div): `Upgrade your order now: 36% OFF, just $34.20`
  `#idjao` (div): `Hurry! This offer ends in:`
  `#ih9qzc` (button): `Yes! Upgrade My Order...`
  `#iihia7` (div): `Yes! Upgrade My Order... Comes with 100% Money Back Guarantee. Try a FULL SERUM `
  `#ik53yi` (div): `Hurry! This offer ends in: 00 : 00`
  `#ikb99` (div): `00 : 00`
  `#iko6sr` (div): `Upgrade your order now: 36% OFF, just $34.20`
  `#imkpfs` (div): `Yes! Upgrade My Order... Comes with 100% Money Back Guarantee. Try a FULL SERUM `
  `#inop49` (div): `Upgrade your order now: 36% OFF, just $34.20`
  `#ioc7n6` (div): `WAIT! Your Order Is Not Complete...`
  `#iomrb` (div): `WAIT! Your Order Is Not Complete...`
  `#ipgtci` (div): `Almost Complete...`
  `#iti6db` (div): `WAIT! Your Order Is Not Complete...`
  `#itk7sk` (div): `Comes with 100% Money Back Guarantee. Try a FULL SERUM risk-free for one year.`
  `#itryq` (div): `Almost Complete...`
  `#iwr6q` (div): `00 : 00`
  `#iy91g` (div): `Almost Complete...`
  `#iz74c` (div): `Almost Complete...`
  `#izz9ao` (div): `Or, click here to say NO THANKS, I don't want
to give my eyes an instant refresh`
  `#pageDataScript` (script): `var pageData = {"pageViewReferenceId":"5b3ee485-695f-4803-bc35-8b7ae29d1f39","fu`

### K. JavaScript Template Texts

- `); // Step 2: Confirm payment with Stripe.js console.log(`
- `); e.preventDefault(); orderSummary.classList.toggle(`
- `); orderSummary.classList.toggle(`
- `); orders.unshift(order); localStorage.setItem(`
- `); updateOrderStatus(order.id,`
- `, JSON.stringify(orders)); console.log(`
- `, currencyCode); // Create order draft BEFORE payment processing console.log(`
- `, error); // Update order status to failed updateOrderStatus(order.id,`
- `, foundDiscount); appliedDiscountCode = foundDiscount; setTimeout(() => { syncOrderSummaryWithProduc`
- `, orderId); } catch (error) { console.error(`
- `.order-applied-discount-remove`
- `.order-discount-code-button`
- `.order-discount-code-input`
- `.order-summary-body`
- `.order-summary-header`
- `; // Order Item bodyHTML +=`
- `; productRow.style.borderLeft =`
- `; r.style.borderLeft =`
- `; row.style.borderColor =`
- `; row.style.borderLeft =`

---

## Vibriance OTO4 (upsell-oto4-vibriance.html)

- **File size**: 510,279 bytes | **Custom CSS**: 11,345 bytes
- **Timer**: 10 min
- **ID rules**: 45 | **Class rules**: 22 | **Keyframes**: 1

### A. Interrupt Header

_No interrupt header found_

### B. Countdown Timer

**Duration**: 10 min

`.countdown`:
```css
  font-family: Helvetica, serif;
  text-align: center;
```

`.countdown-block`:
```css
  display: inline-block;
  margin: 0 10px;
  padding: 10px;
```

`.countdown-cont`:
```css
  display: inline-block;
```

`.countdown-digit`:
```css
  font-size: 1rem;
```

`.countdown-endtext`:
```css
  font-size: 5rem;
```

### C. Headlines

_No static headlines found in HTML (rendered via JS)_

### D. CTA Button

**Text**: `Yes! Upgrade My Order... Comes with 100% Money Back Guarantee. Try a FULL TUBE r`
**Tag**: `<div>` | **ID**: `#iihia7`

**Text**: `Yes! Upgrade My Order... Comes with 100% Money Back Guarantee. Try a FULL TUBE r`
**Tag**: `<div>` | **ID**: `#imkpfs`

**Text**: `Yes! Upgrade My Order...`
**Tag**: `<button>` | **ID**: `#ih9qzc`

**CTA Class Styles:**
`.btn`:
```css
  -moz-user-select: none;
  -ms-user-select: none;
  -webkit-user-select: none;
  border: 1px solid transparent;
  border-radius: .25rem;
  display: inline-block;
  font-family: Helvetica, serif;
  font-size: 20px;
  font-weight: 400;
  line-height: 1.5;
  margin: 20px auto;
  padding-bottom: 10px;
  padding-left: 25px;
  padding-right: 25px;
  padding-top: 10px;
  text-align: center;
  transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
  user-select: none;
  vertical-align: middle;
  white-space: normal;
```

`.btn.btn-primary`:
```css
  background: #007bff;
  border-color: #007bff;
  color: #fff;
  white-space: normal;
```

`.btn.btn-primary.btnStyle`:
```css
  background: #f4f4f4;
  border-color: #007bff;
  border-radius: 30px;
  border-width: 3px;
  color: #007bff;
  font-family: Helvetica, serif;
  padding: 6px 20px;
  padding-bottom: 10px;
  padding-left: 25px;
  padding-right: 25px;
  padding-top: 10px;
  white-space: normal;
```

`.btn.btn-primary.btnStyle:hover`:
```css
  background: #007bff;
  border-color: #007bff;
  color: #fff;
  white-space: normal;
```

`.fk-youtube .play-button`:
```css
  background-color: #333;
  border-radius: 6px;
  box-shadow: 0 0 30px rgba( 0,0,0,0.6 );
  height: 60px;
  opacity: 0.8;
  width: 90px;
  z-index: 1;
```

### E. Opt-Out (Negative Option)

**Text**: `Or, click here to say NO THANKS, but this
30% OFF deal won't be offered again.`
**Tag**: `<div>` | **ID**: `#izz9ao`

**Text**: `Or, click here to say NO THANKS, but this
30% OFF deal won't be offered again.`
**Tag**: `<a>` | **ID**: `#fkt-link-d3a-fb6-b7d`

### F. Price Elements

_No price-specific CSS found (prices rendered via JS)_

### G. Guarantee

**Text**: `Yes! Upgrade My Order... Comes with 100% Money Back Guarantee. Try a FULL TUBE r`

**Text**: `Yes! Upgrade My Order... Comes with 100% Money Back Guarantee. Try a FULL TUBE r`

**Text**: `Comes with 100% Money Back Guarantee. Try a FULL TUBE risk-free for one year.`

### H. Key ID-Based CSS (Conversion-Relevant)

```css
  #fkt-image-8a7-d93-883 {
    color: black !important;
    width: 200px !important;
  }
  #fkt-image-920-aa2-b40 {
    width: 50% !important;
  }
  #fkt-image-a99-b95-a4a {
    width: 60% !important;
  }
  #i1uod5 {
    font-size: 32px;
    line-height: 45px;
  }
  #i2v6e {
    padding-bottom: 0;
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
  }
  #i3n5a {
    padding-bottom: 0;
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
  }
  #i4kpf {
    font-size: 22px;
    line-height: 35px;
  }
  #i5vc9z {
    background-color: #FF1D8E !important;
    border-bottom-left-radius: 1px;
    border-bottom-right-radius: 1px;
    border-bottom-width: 1px;
    border-left-width: 1px;
    border-right-width: 1px;
    border-top-left-radius: 1px;
    border-top-right-radius: 1px;
    border-top-width: 1px;
    flex: 1 0;
  }
  #i7l4d {
    margin-left: 0;
    margin-right: 0;
    padding-bottom: 0;
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
  }
  #i9gchl {
    margin-left: 10px;
    margin-right: 10px;
  }
  #iahre1 {
    padding-bottom: 0;
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
  }
  #ib5vpl {
    font-size: 24px;
    margin-left: 5px;
    margin-right: 5px;
  }
  #ichqs {
    margin-bottom: 0;
    margin-left: 0;
    margin-right: 0;
    margin-top: 0;
    padding-bottom: 0;
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
  }
  #id0dwg {
    padding-bottom: 0;
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
  }
  #id47h {
    display: flex;
  }
  #idekn4 {
    padding-bottom: 0;
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
  }
  #idjao {
    font-size: 18px;
  }
  #idn0f {
    margin-bottom: 5px;
    margin-left: 0;
    margin-right: 0;
    margin-top: 5px;
    padding-bottom: 0;
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
  }
  #idq347 {
    border-color: #ff1d8e !important;
    margin-bottom: 10px;
    padding-bottom: 0;
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
  }
  #ieq1a6 {
    margin-left: 10px;
    margin-right: 10px;
  }
  #ih9qzc {
    width: 95% !important;
  }
  #iihia7 {
    padding-bottom: 0;
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
  }
  #ijhcd {
    font-size: 18px;
  }
  #ik53yi {
    flex-direction: column;
  }
  #ikb99 {
    display: flex;
  }
  #iko6sr {
    font-size: 24px;
    line-height: 35px;
  }
  #imkpfs {
    margin-top: 5px;
    padding-bottom: 0;
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
  }
  #inop49 {
    padding-bottom: 0;
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
  }
  #ioc7n6 {
    padding-bottom: 0;
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
  }
  #iomrb {
    font-size: 24px;
  }
  #ipgtci {
    padding-bottom: 0;
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
  }
  #iq9hxk {
    padding-bottom: 0;
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
  }
  #ispw4u {
    margin-left: 10px;
    margin-right: 10px;
  }
  #it5rp {
    display: flex;
    flex-direction: row;
    font-size: 18px;
    justify-content: center;
  }
  #iti6db {
    padding-bottom: 0;
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
  }
  #itk7sk {
    font-family: Poppins, sans-serif;
    font-size: 16px;
    font-weight: 700;
    margin-top: 1px;
    padding: 1px;
  }
  #itryq {
    font-size: 14px;
  }
  #iu9ojg {
    padding-bottom: 0;
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
  }
  #ius4i {
    margin-left: 0;
    margin-right: 0;
    padding-bottom: 0;
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
  }
  #iwr6q {
    height: auto;
    width: auto;
  }
  #iy91g {
    width: 90%;
  }
  #iyicj {
    font-size: 18px;
  }
  #iz74c {
    animation: move 2s linear infinite;
    background-color: rgb(71, 71, 83) !important;
    shape-outside: 50%;
    width: 50%;
  }
  #izz9ao {
    font-family: Poppins, sans-serif;
    font-size: 14px;
    margin-left: 30px;
    margin-right: 30px;
  }
```

### I. Key Class-Based CSS

```css
  .btn {
    -moz-user-select: none;
    -ms-user-select: none;
    -webkit-user-select: none;
    border: 1px solid transparent;
    border-radius: .25rem;
    display: inline-block;
    font-family: Helvetica, serif;
    font-size: 20px;
    font-weight: 400;
    line-height: 1.5;
    margin: 20px auto;
    padding-bottom: 10px;
    padding-left: 25px;
    padding-right: 25px;
    padding-top: 10px;
    text-align: center;
    transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
    user-select: none;
    vertical-align: middle;
    white-space: normal;
  }
  .btn.btn-primary {
    background: #007bff;
    border-color: #007bff;
    color: #fff;
    white-space: normal;
  }
  .btn.btn-primary.btnStyle {
    background: #f4f4f4;
    border-color: #007bff;
    border-radius: 30px;
    border-width: 3px;
    color: #007bff;
    font-family: Helvetica, serif;
    padding: 6px 20px;
    padding-bottom: 10px;
    padding-left: 25px;
    padding-right: 25px;
    padding-top: 10px;
    white-space: normal;
  }
  .btn.btn-primary.btnStyle:hover {
    background: #007bff;
    border-color: #007bff;
    color: #fff;
    white-space: normal;
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
    font-size: 5rem;
  }
  .fk-progress-bar-striped {
    align-items: center;
    border-radius: 8px;
    width: 50%;
  }
  .fk-youtube .fk-rm.image {
    -webkit-background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    height: 100%;
    position: absolute;
    width: 100%;
  }
  .fk-youtube .play-button {
    background-color: #333;
    border-radius: 6px;
    box-shadow: 0 0 30px rgba( 0,0,0,0.6 );
    height: 60px;
    opacity: 0.8;
    width: 90px;
    z-index: 1;
  }
  .fk-youtube .play-button:before {
    border-color: transparent transparent transparent #fff;
    border-style: solid;
    border-width: 15px 0 15px 26.0px;
    content: "";
  }
```

### J. All Static Text Content (from HTML)

  `#fkt-link-d3a-fb6-b7d` (a): `Or, click here to say NO THANKS, but this
30% OFF deal won't be offered again.`
  `#i1uod5` (div): `Upgrade Your Order With This Extra BOOST Of Hydration`
  `#i2v6e` (div): `Does Your Skin Get Extra Dry? Upgrade Your Order With This Extra BOOST Of Hydrat`
  `#i3n5a` (div): `Does Your Skin Get Extra Dry? Upgrade Your Order With This Extra BOOST Of Hydrat`
  `#i4kpf` (div): `Does Your Skin Get Extra Dry?`
  `#i5vc9z` (div): `Almost Complete...`
  `#i9po92` (div): `Plumps fine lines while locking in hydration`
  `#iahre1` (div): `Hurry! This offer ends in: 00 : 00`
  `#ib5vpl` (div): `... 30% OFF, Today Only!`
  `#ibms4c` (div): `#3 - Mineral-rich Red Algae`
  `#ic25gu` (div): `Mimics skin’s natural oils to combat dryness`
  `#id47h` (span): `00 : 00`
  `#idekn4` (div): `Upgrade your order now: 30% OFF, just $24`
  `#idjao` (div): `Hurry! This offer ends in:`
  `#iel2nj` (div): `#1 - Fucogel® "skin sugar"`
  `#ih9qzc` (button): `Yes! Upgrade My Order...`
  `#iihia7` (div): `Yes! Upgrade My Order... Comes with 100% Money Back Guarantee. Try a FULL TUBE r`
  `#iisvw3` (div): `Strengthens the skin barrier to prevent moisture loss`
  `#ik53yi` (div): `Hurry! This offer ends in: 00 : 00`
  `#ikb99` (div): `00 : 00`
  `#iko6sr` (div): `Upgrade your order now: 30% OFF, just $24`
  `#ilnwsy` (div): `#2 - Plant-based Squalane`
  `#imkpfs` (div): `Yes! Upgrade My Order... Comes with 100% Money Back Guarantee. Try a FULL TUBE r`
  `#inop49` (div): `Upgrade your order now: 30% OFF, just $24`
  `#ioc7n6` (div): `One More Special Offer Before We Ship Your Order...`
  `#iomrb` (div): `One More Special Offer Before We Ship Your Order...`
  `#ipgtci` (div): `Almost Complete...`
  `#iti6db` (div): `One More Special Offer Before We Ship Your Order...`
  `#itk7sk` (div): `Comes with 100% Money Back Guarantee. Try a FULL TUBE risk-free for one year.`
  `#itryq` (div): `Almost Complete...`
  `#iwr6q` (div): `00 : 00`
  `#iy91g` (div): `Almost Complete...`
  `#iyjuh` (b): `... 30% OFF, Today Only!`
  `#iz74c` (div): `Almost Complete...`
  `#izz9ao` (div): `Or, click here to say NO THANKS, but this
30% OFF deal won't be offered again.`
  `#pageDataScript` (script): `var pageData = {"pageViewReferenceId":"996106be-57a2-48ac-a5f2-d941da6b2c8e","fu`

### K. JavaScript Template Texts

- `); // Step 2: Confirm payment with Stripe.js console.log(`
- `); e.preventDefault(); orderSummary.classList.toggle(`
- `); orderSummary.classList.toggle(`
- `); orders.unshift(order); localStorage.setItem(`
- `); updateOrderStatus(order.id,`
- `, JSON.stringify(orders)); console.log(`
- `, currencyCode); // Create order draft BEFORE payment processing console.log(`
- `, error); // Update order status to failed updateOrderStatus(order.id,`
- `, foundDiscount); appliedDiscountCode = foundDiscount; setTimeout(() => { syncOrderSummaryWithProduc`
- `, orderId); } catch (error) { console.error(`
- `.order-applied-discount-remove`
- `.order-discount-code-button`
- `.order-discount-code-input`
- `.order-summary-body`
- `.order-summary-header`
- `; // Order Item bodyHTML +=`
- `; productRow.style.borderLeft =`
- `; r.style.borderLeft =`
- `; row.style.borderColor =`
- `; row.style.borderLeft =`

---

## Vibriance OTO5 (upsell-oto5-vibriance.html)

- **File size**: 517,818 bytes | **Custom CSS**: 3,899 bytes
- **Timer**: 10 min
- **ID rules**: 0 | **Class rules**: 0 | **Keyframes**: 0

### A. Interrupt Header

_No interrupt header found_

### B. Countdown Timer

_No countdown timer_

### C. Headlines

_No static headlines found in HTML (rendered via JS)_

### D. CTA Button

**Text**: `YES! PROTECT MY ORDER AGAINST LOSS & THEFT`
**Tag**: `<button>` | **ID**: `#iqjgd`

**Text**: `No thanks, I don’t want to protect my order against theft`
**Tag**: `<a>` | **ID**: `#fkt-link-3ec-291-8ab`

### E. Opt-Out (Negative Option)

**Text**: `No thanks, I don’t want to protect my order against theft`
**Tag**: `<a>` | **ID**: `#fkt-link-3ec-291-8ab`

### F. Price Elements

_No price-specific CSS found (prices rendered via JS)_

### G. Guarantee

_No guarantee found_

### H. Key ID-Based CSS (Conversion-Relevant)

```css
```

### I. Key Class-Based CSS

```css
```

### J. All Static Text Content (from HTML)

  `#fkt-link-3ec-291-8ab` (a): `No thanks, I don’t want to protect my order against theft`
  `#i4bzp` (div): `"40% Of Americans Are Porch Pirate Victims!" Don't Be The Next Victim Of Porch P`
  `#i5vc9z` (div): `Almost Complete...`
  `#i6d5l` (div): `Total USD $4.95`
  `#i6nfm` (div): `Total`
  `#idn0f-2` (div): `"40% Of Americans Are Porch Pirate Victims!" Don't Be The Next Victim Of Porch P`
  `#iirc4` (div): `Hurry! This offer ends in: 00 : 00`
  `#ijipr` (div): `Hurry! This offer ends in:`
  `#im432` (div): `NO QUESTIONS ASKED ORDER REPLACEMENT FOR ONLY $4.95`
  `#ioc7n6` (div): `🛑 FINAL STEP: Protect Your Order 🛑`
  `#iomrb` (div): `🛑 FINAL STEP: Protect Your Order 🛑`
  `#iozz2` (div): `USD $4.95`
  `#ipgtci` (div): `Almost Complete...`
  `#iqjgd` (button): `YES! PROTECT MY ORDER AGAINST LOSS & THEFT`
  `#iti6db` (div): `🛑 FINAL STEP: Protect Your Order 🛑`
  `#itryq` (div): `Almost Complete...`
  `#ius4i-2` (div): `"40% Of Americans Are Porch Pirate Victims!" Don't Be The Next Victim Of Porch P`
  `#ivxd1` (span): `00 : 00`
  `#ixhki` (div): `00 : 00`
  `#iy91g` (div): `Almost Complete...`
  `#iz74c` (div): `Almost Complete...`
  `#pageDataScript` (script): `var pageData = {"pageViewReferenceId":"59221d70-dd96-4a71-9dcb-7b61e1ff55d5","fu`

### K. JavaScript Template Texts

- `); // Step 2: Confirm payment with Stripe.js console.log(`
- `); e.preventDefault(); orderSummary.classList.toggle(`
- `); orderSummary.classList.toggle(`
- `); orders.unshift(order); localStorage.setItem(`
- `); updateOrderStatus(order.id,`
- `, JSON.stringify(orders)); console.log(`
- `, currencyCode); // Create order draft BEFORE payment processing console.log(`
- `, error); // Update order status to failed updateOrderStatus(order.id,`
- `, foundDiscount); appliedDiscountCode = foundDiscount; setTimeout(() => { syncOrderSummaryWithProduc`
- `, orderId); } catch (error) { console.error(`
- `.order-applied-discount-remove`
- `.order-discount-code-button`
- `.order-discount-code-input`
- `.order-summary-body`
- `.order-summary-header`
- `; // Order Item bodyHTML +=`
- `; productRow.style.borderLeft =`
- `; r.style.borderLeft =`
- `; row.style.borderColor =`
- `; row.style.borderLeft =`

---

## Clarifion OTO1 (upsell-oto1-clarifion.html)

- **File size**: 604,211 bytes | **Custom CSS**: 232,798 bytes
- **Timer**: None
- **ID rules**: 10 | **Class rules**: 804 | **Keyframes**: 8

### A. Interrupt Header

**ID**: `#iq099` | **Tag**: `<h1>` | **Text**: `Wait! Wait!`

**ID**: `#ifhdn` | **Tag**: `<p>` | **Text**: `Wait!`

**ID**: `#idsdp` | **Tag**: `<p>` | **Text**: `Wait!`

### B. Countdown Timer

_No countdown timer_

### C. Headlines

**<h1>** `Wait! Wait!`

### D. CTA Button

**Text**: `Yes! Send me an additional 3 Clarifion™ for
                            only $18`
**Tag**: `<div>` | **ID**: `#izofs`

**Text**: `Yes! Send me an additional 3 Clarifion™ for
                            only $18`
**Tag**: `<button>` | **ID**: `#iwjle`

**CTA Class Styles:**
`.btn-primary`:
```css
  background-color: #1ab22c;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 1px;
  margin-top: 35.2px;
  outline: none;
  padding: 8.8px;
  transition: all 600ms cubic-bezier(0, 0.3, 0.7, 1);
```

`.btn-primary:hover`:
```css
  background-color: #1ab22c;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 1px;
  margin-top: 35.2px;
  outline: none;
  padding: 8.8px;
  transition: all 600ms cubic-bezier(0, 0.3, 0.7, 1);
```

`.fk-youtube .play-button`:
```css
  background-color: #333;
  border-radius: 6px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.6);
  height: 60px;
  opacity: 0.8;
  width: 90px;
  z-index: 1;
```

`.yotpo-close-modal.yotpo-icon-btn-small .yotpo-icon.yotpo-icon-cross`:
```css
  background: red !important;
  border: 2px solid black !important;
  border-radius: 5px !important;
  box-sizing: border-box !important;
  color: white !important;
```

### E. Opt-Out (Negative Option)

_No opt-out found_

### F. Price Elements

_No price-specific CSS found (prices rendered via JS)_

### G. Guarantee

_No guarantee found_

### H. Key ID-Based CSS (Conversion-Relevant)

```css
  #bodyElementDummy {
    display: none;
  }
  #fkt-image-e70-2ae-a30 {
    height: 150px;
    width: 150px;
  }
  #fkt-image-e97-4af-806 {
    border-bottom-left-radius: 1px;
    border-bottom-right-radius: 1px;
    border-bottom-width: 1px;
    border-left-width: 1px;
    border-right-width: 1px;
    border-top-left-radius: 1px;
    border-top-right-radius: 1px;
    border-top-width: 1px;
    flex: 0 0;
    height: auto;
    width: auto !important;
  }
  #fkt-image-fb6-dab-a9a {
    height: 50px;
    width: 200px;
  }
  #ifhdn {
    color: rgb(255, 189, 3) !important;
  }
  #iq099 {
    font-weight: 700;
  }
  #iwjle {
    flex: 0 0;
  }
  #izic7 {
    height: 157px;
    width: 829px;
  }
```

### I. Key Class-Based CSS

```css
  .AD_25px {
    background-position: 0 0px;
  }
  .AE_25px {
    background-position: 0 -25px;
  }
  .AF_25px {
    background-position: 0 -50px;
  }
  .AG_25px {
    background-position: 0 -75px;
  }
  .AI_25px {
    background-position: 0 -100px;
  }
  .AIs6iEbf9UqkqPBo2ltj_,
        .vTejYh3eCvcK7lRihCOoE ._2nCLeYL5EZBblBAAOtOCuk .AIs6iEbf9UqkqPBo2ltj_ {
    border-radius: 3px;
    display: flex;
    margin-top: 0.4rem;
    padding: 10px;
    width: 90%;
  }
  .AIs6iEbf9UqkqPBo2ltj_._2DFz4-s4Ae8O4NaBK9mzmC,
        .vTejYh3eCvcK7lRihCOoE ._2nCLeYL5EZBblBAAOtOCuk .AIs6iEbf9UqkqPBo2ltj_._2DFz4-s4Ae8O4NaBK9mzmC {
    background-color: #f4f4f4;
  }
  .AL_25px {
    background-position: 0 -125px;
  }
  .AM_25px {
    background-position: 0 -150px;
  }
  .AO_25px {
    background-position: 0 -175px;
  }
  .AR_25px {
    background-position: 0 -200px;
  }
  .AS_25px {
    background-position: 0 -225px;
  }
  .AT_25px {
    background-position: 0 -250px;
  }
  .AU_25px {
    background-position: 0 -275px;
  }
  .AW_25px {
    background-position: 0 -300px;
  }
  .AX_25px {
    background-position: 0 -325px;
  }
  .AZ_25px {
    background-position: 0 -350px;
  }
  .BA_25px {
    background-position: 0 -375px;
  }
  .BB_25px {
    background-position: 0 -400px;
  }
  .BD_25px {
    background-position: 0 -425px;
  }
  .BE_25px {
    background-position: 0 -450px;
  }
  .BF_25px {
    background-position: 0 -475px;
  }
  .BG_25px {
    background-position: 0 -500px;
  }
  .BH_25px {
    background-position: 0 -525px;
  }
  .BI_25px {
    background-position: 0 -550px;
  }
  .BJ_25px {
    background-position: 0 -575px;
  }
  .BM_25px {
    background-position: 0 -600px;
  }
  .BN_25px {
    background-position: 0 -625px;
  }
  .BO_25px {
    background-position: 0 -650px;
  }
  .BR_25px {
    background-position: 0 -675px;
  }
  .BS_25px {
    background-position: 0 -700px;
  }
  .BT_25px {
    background-position: 0 -725px;
  }
  .BW_25px {
    background-position: 0 -750px;
  }
  .BY_25px {
    background-position: 0 -775px;
  }
  .BZ_25px {
    background-position: 0 -800px;
  }
  .CA_25px {
    background-position: 0 -825px;
  }
  .CBiOYQVFHfGbez1vPW5Eu {
    background-color: #323232;
    color: white;
  }
  .CC_25px {
    background-position: 0 -850px;
  }
  .CD_25px {
    background-position: 0 -875px;
  }
  .CF_25px {
    background-position: 0 -900px;
  }
  .CG_25px {
    background-position: 0 -925px;
  }
  .CH_25px {
    background-position: 0 -950px;
  }
  .CL_25px {
    background-position: 0 -975px;
  }
  .CM_25px {
    background-position: 0 -1000px;
  }
  .CN_25px {
    background-position: 0 -1025px;
  }
  .CO_25px {
    background-position: 0 -1050px;
  }
  .CR_25px {
    background-position: 0 -1075px;
  }
  .CU_25px {
    background-position: 0 -1100px;
  }
  .CV_25px {
    background-position: 0 -1125px;
  }
  .CX_25px {
    background-position: 0 -1150px;
  }
  .CY_25px {
    background-position: 0 -1175px;
  }
  .CZ_25px {
    background-position: 0 -1200px;
  }
  .DE_25px {
    background-position: 0 -1225px;
  }
  .DJ_25px {
    background-position: 0 -1250px;
  }
  .DK_25px {
    background-position: 0 -1275px;
  }
  .DM_25px {
    background-position: 0 -1300px;
  }
  .DO_25px {
    background-position: 0 -1325px;
  }
  .DZ_25px {
    background-position: 0 -1350px;
  }
  .EC_25px {
    background-position: 0 -1375px;
  }
  .EE_25px {
    background-position: 0 -1400px;
  }
  .EG_25px {
    background-position: 0 -1425px;
  }
  .EH_25px {
    background-position: 0 -1450px;
  }
  .ER_25px {
    background-position: 0 -1475px;
  }
  .ERxklc1DEy6MRbHq8F_oL ._3qG_M93hEacQkijHPJkGp3 {
    align-items: center;
    background-color: #323232;
    border: 2px solid rgba(40, 40, 80, 0.3);
    border-radius: 3px;
    color: white;
    display: flex;
    font-size: 16px;
    justify-content: space-between;
    line-height: 140%;
    padding: 13.33333px 20px;
    text-align: left;
  }
  .ERxklc1DEy6MRbHq8F_oL .xFfiAqzH9NFPaQ_MJUds_ {
    color: #323232;
    font-size: 14px;
    line-height: 180%;
    padding: 20px 40px;
    text-align: left;
  }
  .ES_25px {
    background-position: 0 -1500px;
  }
  .ET_25px {
    background-position: 0 -1525px;
  }
  .FI_25px {
    background-position: 0 -1550px;
  }
  .FJ_25px {
    background-position: 0 -1575px;
  }
  .FK_25px {
    background-position: 0 -1600px;
  }
  .FM_25px {
    background-position: 0 -1625px;
  }
  .FO_25px {
    background-position: 0 -1650px;
  }
  .FR_25px {
    background-position: 0 -1675px;
  }
  .FamgNeTLmEx83Uzx_1NaQ {
    color: #323232;
    font-size: 0.9rem;
    font-weight: normal;
  }
  .G7lcMZWWCM-fOTm8KoSxB {
    align-items: center;
    background-color: #89a383;
    border-radius: 50%;
    color: white;
    display: flex;
    height: 2.5rem;
    justify-content: center;
    margin-right: 0.5rem;
    padding: 4px;
    position: relative;
    width: 2.5rem;
  }
  .GA_25px {
    background-position: 0 -1700px;
  }
  .GB_25px {
    background-position: 0 -1725px;
  }
  .GCMqIV_Qclk3NatceK653 ._2AGbX7Mg4BOLr5JAZNj8Ld {
    background-color: rgba(50, 50, 50, 0.1);
    height: 1px;
    margin-bottom: 20px;
  }
  .GCMqIV_Qclk3NatceK653 ._35Nj9y3o_mxX3bUWTYbUTQ {
    align-items: center;
    display: flex;
    font-size: 12px;
    font-weight: 200;
    margin: 5px 0 0 1px;
  }
  .GD_25px {
    background-position: 0 -1750px;
  }
  .GE_25px {
    background-position: 0 -1775px;
  }
  .GF_25px {
    background-position: 0 -1800px;
  }
  .GH_25px {
    background-position: 0 -1825px;
  }
  .GI_25px {
    background-position: 0 -1850px;
  }
  .GL_25px {
    background-position: 0 -1875px;
  }
  .GM_25px {
    background-position: 0 -1900px;
  }
  .GN_25px {
    background-position: 0 -1925px;
  }
  .GP_25px {
    background-position: 0 -1950px;
  }
  .GQ_25px {
    background-position: 0 -1975px;
  }
  .GR_25px {
    background-position: 0 -2000px;
  }
  .GT_25px {
    background-position: 0 -2025px;
  }
  .GW_25px {
    background-position: 0 -2050px;
  }
  .GY_25px {
    background-position: 0 -2075px;
  }
  .GrCbT77cZ3fSodwurZxaE,
        ._3ug74DsppSWcd9Mr08we_O ._2aoXngB9i7hXnWxW9feDj7 .GrCbT77cZ3fSodwurZxaE {
    align-items: center;
    display: flex;
    font-size: 11px;
    font-weight: bold;
    margin-top: 3px;
  }
  .HH5BcFkiFC7Nljlmy12A4 .MhGHhOA0lJjLWqgG7Mggw {
    border-radius: 4px;
    border-style: solid;
    border-width: 1px;
    padding: 0.5rem;
  }
  .HH5BcFkiFC7Nljlmy12A4 ._3e6CJniDBfmcZztBvIHnrl {
    padding-top: 4px;
  }
  .HK_25px {
    background-position: 0 -2100px;
  }
  .HN_25px {
    background-position: 0 -2125px;
  }
  .HR_25px {
    background-position: 0 -2150px;
  }
  .HT_25px {
    background-position: 0 -2175px;
  }
  .HU_25px {
    background-position: 0 -2200px;
  }
  .I9R-4mT-75umb_ObLZAsE,
        ._3eBT-caf7Z2L7t3J6X2-j6 ._21ffV9cayPfHIkFdZ_XvWn .I9R-4mT-75umb_ObLZAsE,
        ._18ikUvP25CDHcrfz1MsnXQ ._21ffV9cayPfHIkFdZ_XvWn .oAPVXsJiQ_ivBy1znc2Gg,
        ._3eBT-caf7Z2L7t3J6X2-j6 ._21ffV9cayPfHIkFdZ_XvWn .oAPVXsJiQ_ivBy1znc2Gg {
    border: 3px #474747 solid;
    border-radius: 2px;
  }
  .IE_25px {
    background-position: 0 -2225px;
  }
  .IL_25px {
    background-position: 0 -2250px;
  }
  .IM_25px {
    background-position: 0 -2275px;
  }
  .IN_25px {
    background-position: 0 -2300px;
  }
  .IO_25px {
    background-position: 0 -2325px;
  }
  .IQ_25px {
    background-position: 0 -2350px;
  }
  .IR_25px {
    background-position: 0 -2375px;
  }
  .IS_25px {
    background-position: 0 -2400px;
  }
  .IT_25px {
    background-position: 0 -2425px;
  }
  .In37K49i342Itc7t84w5h {
    background-color: white;
    border-radius: 5px;
    box-shadow: 0 2vh 10vh rgba(0, 0, 0, 0.3);
    height: 90%;
    max-width: 1200px;
    overflow: hidden;
    width: 90%;
  }
  .JE_25px {
    background-position: 0 -2450px;
  }
  .JM_25px {
    background-position: 0 -2475px;
  }
  .JO_25px {
    background-position: 0 -2500px;
  }
  .JP_25px {
    background-position: 0 -2525px;
  }
  .KE_25px {
    background-position: 0 -2550px;
  }
  .KG_25px {
    background-position: 0 -2575px;
  }
  .KH_25px {
    background-position: 0 -2600px;
  }
  .KI_25px {
    background-position: 0 -2625px;
  }
  .KM_25px {
    background-position: 0 -2650px;
  }
  .KN_25px {
    background-position: 0 -2675px;
  }
  .KP_25px {
    background-position: 0 -2700px;
  }
  .KR_25px {
    background-position: 0 -2725px;
  }
  .KW_25px {
    background-position: 0 -2750px;
  }
  .KY_25px {
    background-position: 0 -2775px;
  }
  .KZ_25px {
    background-position: 0 -2800px;
  }
  .L1dT-sUvPlZsvAwSwE6re {
    color: #323232;
    font-size: 1rem;
    margin: 4px auto;
  }
  .LA_25px {
    background-position: 0 -2825px;
  }
  .LB_25px {
    background-position: 0 -2850px;
  }
  .LC_25px {
    background-position: 0 -2875px;
  }
  .LI_25px {
    background-position: 0 -2900px;
  }
  .LK_25px {
    background-position: 0 -2925px;
  }
  .LR_25px {
    background-position: 0 -2950px;
  }
  .LS_25px {
    background-position: 0 -2975px;
  }
  .LT_25px {
    background-position: 0 -3000px;
  }
  .LU_25px {
    background-position: 0 -3025px;
  }
  .LV_25px {
    background-position: 0 -3050px;
  }
  .LY_25px {
    background-position: 0 -3075px;
  }
  .MA_25px {
    background-position: 0 -3100px;
  }
  .MC_25px {
    background-position: 0 -3125px;
  }
  .MD_25px {
    background-position: 0 -3150px;
  }
  .MG_25px {
    background-position: 0 -3175px;
  }
  .MH_25px {
    background-position: 0 -3200px;
  }
  .MK_25px {
    background-position: 0 -3225px;
  }
  .ML_25px {
    background-position: 0 -3250px;
  }
  .MM_25px {
    background-position: 0 -3275px;
  }
  .MN_25px {
    background-position: 0 -3300px;
  }
  .MP_25px {
    background-position: 0 -3325px;
  }
  .MQ_25px {
    background-position: 0 -3350px;
  }
  .MR_25px {
    background-position: 0 -3375px;
  }
  .MS_25px {
    background-position: 0 -3400px;
  }
  .MT_25px {
    background-position: 0 -3425px;
  }
  .MU_25px {
    background-position: 0 -3450px;
  }
  .MV_25px {
    background-position: 0 -3475px;
  }
  .MW_25px {
    background-position: 0 -3500px;
  }
  .MX_25px {
    background-position: 0 -3525px;
  }
  .MY_25px {
    background-position: 0 -3550px;
  }
  .MZ_25px {
    background-position: 0 -3575px;
  }
  .MowGJB0-86qBzKLnJwrBA ._1_qdewUQ53jSdFSJP1PHxW {
    padding-bottom: 1rem;
  }
  .MowGJB0-86qBzKLnJwrBA ._3ZBIDpy0mQ4NkMkhRuDCR7 {
    font-size: 12px;
    font-weight: normal;
    line-height: 160%;
    margin-top: 10px;
    text-align: left;
  }
  .NA_25px {
    background-position: 0 -3600px;
  }
  .NE_25px {
    background-position: 0 -3625px;
  }
  .NG_25px {
    background-position: 0 -3650px;
  }
  .NI_25px {
    background-position: 0 -3675px;
  }
  .NL_25px {
    background-position: 0 -3700px;
  }
  .NO_25px {
    background-position: 0 -3725px;
  }
  .NP_25px {
    background-position: 0 -3750px;
  }
  .NR_25px {
    background-position: 0 -3775px;
  }
  .NVxISeEA3XlEhoEVZlQnd {
    -webkit-animation: _3u5YnePr2qJC3i9uUdgTnc 12s linear infinite;
    animation: _3u5YnePr2qJC3i9uUdgTnc 12s linear infinite;
    border: 2px dashed white;
    border-radius: 100%;
    height: 84px;
    position: absolute;
    width: 84px;
  }
  .NZ_25px {
    background-position: 0 -3800px;
  }
  .OM_25px {
    background-position: 0 -3825px;
  }
  .PA_25px {
    background-position: 0 -3850px;
  }
  .PE_25px {
    background-position: 0 -3875px;
  }
  .PF_25px {
    background-position: 0 -3900px;
  }
  .PG_25px {
    background-position: 0 -3925px;
  }
  .PH_25px {
    background-position: 0 -3950px;
  }
  .PK_25px {
    background-position: 0 -3975px;
  }
  .PL_25px {
    background-position: 0 -4000px;
  }
  .PM_25px {
    background-position: 0 -4025px;
  }
  .PR_25px {
    background-position: 0 -4050px;
  }
  .PT_25px {
    background-position: 0 -4075px;
  }
  .PW_25px {
    background-position: 0 -4100px;
  }
  .PY_25px {
    background-position: 0 -4125px;
  }
  .QA_25px {
    background-position: 0 -4150px;
  }
  .RE_25px {
    background-position: 0 -4175px;
  }
  .RO_25px {
    background-position: 0 -4200px;
  }
  .RS_25px {
    background-position: 0 -4225px;
  }
  .RU_25px {
    background-position: 0 -4250px;
  }
  .RW_25px {
    background-position: 0 -4275px;
  }
  .SA_25px {
    background-position: 0 -4300px;
  }
  .SB_25px {
    background-position: 0 -4325px;
  }
  .SC_25px {
    background-position: 0 -4350px;
  }
  .SD_25px {
    background-position: 0 -4375px;
  }
  .SE_25px {
    background-position: 0 -4400px;
  }
  .SG_25px {
    background-position: 0 -4425px;
  }
  .SH_25px {
    background-position: 0 -4450px;
  }
  .SI_25px {
    background-position: 0 -4475px;
  }
  .SK_25px {
    background-position: 0 -4500px;
  }
  .SL_25px {
    background-position: 0 -4525px;
  }
  .SM_25px {
    background-position: 0 -4550px;
  }
  .SN_25px {
    background-position: 0 -4575px;
  }
  .SO_25px {
    background-position: 0 -4600px;
  }
  .SR_25px {
    background-position: 0 -4625px;
  }
  .SS_25px {
    background-position: 0 -4650px;
  }
  .SV_25px {
    background-position: 0 -4675px;
  }
  .SY_25px {
    background-position: 0 -4700px;
  }
  .SZ_25px {
    background-position: 0 -4725px;
  }
  .TC_25px {
    background-position: 0 -4750px;
  }
  .TD_25px {
    background-position: 0 -4775px;
  }
  .TF_25px {
    background-position: 0 -4800px;
  }
  .TG_25px {
    background-position: 0 -4825px;
  }
  .TH_25px {
    background-position: 0 -4850px;
  }
  .TJ_25px {
    background-position: 0 -4875px;
  }
  .TM_25px {
    background-position: 0 -4900px;
  }
  .TN_25px {
    background-position: 0 -4925px;
  }
  .TO_25px {
    background-position: 0 -4950px;
  }
  .TR_25px {
    background-position: 0 -4975px;
  }
  .TT_25px {
    background-position: 0 -5000px;
  }
  .TV_25px {
    background-position: 0 -5025px;
  }
  .TW_25px {
    background-position: 0 -5050px;
  }
  .TZ_25px {
    background-position: 0 -5075px;
  }
  .UA_25px {
    background-position: 0 -5100px;
  }
  .UFTTmf4ibWuxFlB3zG_8M,
        .vTejYh3eCvcK7lRihCOoE ._3sK-HIWLy1TBLAaqiMmfKP .UFTTmf4ibWuxFlB3zG_8M {
    color: #5c909b;
    padding-left: 0.5rem;
  }
  .UG_25px {
    background-position: 0 -5125px;
  }
  .US_25px {
    background-position: 0 -5150px;
  }
  .UY_25px {
    background-position: 0 -5175px;
  }
  .UZ_25px {
    background-position: 0 -5200px;
  }
  .VA_25px {
    background-position: 0 -5225px;
  }
  .VC_25px {
    background-position: 0 -5250px;
  }
  .VE_25px {
    background-position: 0 -5275px;
  }
  .VG_25px {
    background-position: 0 -5300px;
  }
  .VI_25px {
    background-position: 0 -5325px;
  }
  .VN_25px {
    background-position: 0 -5350px;
  }
  .VU_25px {
    background-position: 0 -5375px;
  }
  .WS_25px {
    background-position: 0 -5400px;
  }
  .X9C1UR7aKWoQ25ioe_o0t ._2M3sIExapNLIKikB_MGkZg {
    color: #666667;
  }
  .YE_25px {
    background-position: 0 -5425px;
  }
  .YT_25px {
    background-position: 0 -5450px;
  }
  .ZA_25px {
    background-position: 0 -5475px;
  }
  .ZM_25px {
    background-position: 0 -5500px;
  }
  .ZW_25px {
    background-position: 0 -5525px;
  }
  .bXEHHNudOC_AVXF1Z0Efi {
    font-size: large;
    font-weight: bolder;
    line-height: 1rem;
    text-align: left;
  }
  .btn-primary {
    background-color: #1ab22c;
    border-radius: 5px;
    color: white;
    cursor: pointer;
    font-size: 18px;
    font-weight: bold;
    letter-spacing: 1px;
    margin-top: 35.2px;
    outline: none;
    padding: 8.8px;
    transition: all 600ms cubic-bezier(0, 0.3, 0.7, 1);
  }
  .btn-primary:hover {
    background-color: #1ab22c;
    border-radius: 5px;
    color: white;
    cursor: pointer;
    font-size: 18px;
    font-weight: bold;
    letter-spacing: 1px;
    margin-top: 35.2px;
    outline: none;
    padding: 8.8px;
    transition: all 600ms cubic-bezier(0, 0.3, 0.7, 1);
  }
  .d67E1vMVN9hKY2RuJfvcF ._1SU_1l7NRE4_4HeO73a9cG {
    font-size: 22px;
    margin: 1.4rem 0 0.5rem 0;
    padding: 0 15px;
  }
  .d67E1vMVN9hKY2RuJfvcF ._2j4ceEmaxKgn_aEmbDEgfj {
    background-color: white !important;
    border: unset;
    color: black;
    cursor: pointer;
    font-size: 1.5rem !important;
    font-weight: 300;
    line-height: 1.6rem;
    margin: 0 !important;
    padding: 0 !important;
    position: absolute;
    right: 15px;
    top: 15px;
    width: unset !important;
  }
  .d67E1vMVN9hKY2RuJfvcF ._3ZGFbdHDkNghT28ondmIZp {
    font-size: 16px;
    margin-top: 8px;
    padding: 0 15px;
  }
  .d67E1vMVN9hKY2RuJfvcF .mI1bIfEooIJRvwVYblI1v {
    background-color: #ededed;
    height: 1px;
    width: 100%;
  }
  .eSNl_WwyPdan9T4mntWvG {
    -moz-user-select: none;
    -ms-user-select: none;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    align-items: center;
    border-bottom: 2px whitesmoke solid;
    cursor: pointer;
    display: flex;
    height: 80px;
    min-height: 50px;
    user-select: none;
  }
  .fk-youtube .fk-rm.image {
    -webkit-background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    height: 100%;
    position: absolute;
    width: 100%;
  }
  .fk-youtube .play-button {
    background-color: #333;
    border-radius: 6px;
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.6);
    height: 60px;
    opacity: 0.8;
    width: 90px;
    z-index: 1;
  }
  .fk-youtube .play-button:before {
    border-color: transparent transparent transparent #fff;
    border-style: solid;
    border-width: 15px 0 15px 26.0px;
    content: "";
  }
  .gXamJyQ_Wt9dYwaLd-sXA ._1s3P8BRVKw__qNAsZ1Z0MN ._1QwIr9xSNLO_m0AsBwv7Jf {
    background-color: whitesmoke;
    border-radius: 10px;
    height: 15px;
    margin-top: 20px;
    overflow: hidden;
    padding: 6px;
  }
  .gXamJyQ_Wt9dYwaLd-sXA ._1s3P8BRVKw__qNAsZ1Z0MN ._1QwIr9xSNLO_m0AsBwv7Jf ._1X8jpjsZ2yy88o_Aq7oD1F {
    -webkit-animation: _1In82js7Wmt2lS9HB6pZnL 1s linear infinite;
    animation: _1In82js7Wmt2lS9HB6pZnL 1s linear infinite;
    background-color: #1ab22c;
    background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);
    background-size: 40px 40px;
    border-radius: 10px;
    height: 100%;
    transition: all 2500ms cubic-bezier(0.2, 0.6, 0.6, 0.95);
  }
  .gXamJyQ_Wt9dYwaLd-sXA ._1s3P8BRVKw__qNAsZ1Z0MN ._2OjtxqxV7Z-E8Q2Y4a3mx6 {
    color: black;
    font-size: 16px;
    font-weight: bold;
  }
  .i59VT2R06KRH_suaW4_d5,
        ._3eBT-caf7Z2L7t3J6X2-j6 ._21ffV9cayPfHIkFdZ_XvWn._3mO11n1YFhXV5T_954uhx_.i59VT2R06KRH_suaW4_d5 {
    -webkit-animation: _2JOBaSB3lCNo6sPT0Z4IAx 0.4s ease;
    animation: _2JOBaSB3lCNo6sPT0Z4IAx 0.4s ease;
  }
  .image-gallery-bullets .image-gallery-bullet {
    padding: 2.7px;
  }
  .image-gallery-bullets .image-gallery-bullet.active {
    background: #fff;
  }
  .image-gallery-bullets .image-gallery-bullet:focus,
        .image-gallery-bullets .image-gallery-bullet:hover {
    background: #337ab7;
    transform: scale(1.1);
  }
  .image-gallery-bullets .image-gallery-bullets.scraped-container {
    margin: 0;
    padding: 0;
    text-align: center;
  }
  .image-gallery-slide .image-gallery-description {
    bottom: 45px;
    font-size: .8em;
    padding: 8px 15px;
  }
  .image-gallery-thumbnails-wrapper.left .image-gallery-thumbnails .image-gallery-thumbnail,
        .image-gallery-thumbnails-wrapper.right .image-gallery-thumbnails .image-gallery-thumbnail {
    display: block;
    margin-right: 0;
    padding: 0;
  }
  .image-gallery-thumbnails-wrapper.left .image-gallery-thumbnails,
        .image-gallery-thumbnails-wrapper.right .image-gallery-thumbnails {
    height: 100%;
    left: 0;
    padding: 0;
    position: absolute;
    top: 0;
    width: 100%;
  }
  .j7nw2156hcT8fjGrlqexr {
    display: flex;
    padding: 10px 0;
  }
  .main {
    background-color: whitesmoke;
  }
  .nXFIVse6Goo_SkQdzVsyt {
    background-color: white;
    margin: 8.8px 0;
    padding: 8.8px 0;
  }
  .ndhv3JBskvHN0dJtC7dpr {
    -webkit-animation: DNutUMIDhPFLy5hbNphJg 2s linear infinite;
    animation: DNutUMIDhPFLy5hbNphJg 2s linear infinite;
    bottom: 0;
    height: 100%;
    left: 0;
    margin: auto;
    position: absolute;
    right: 0;
    top: 0;
    transform-origin: center center;
    width: 100%;
  }
  .ndhv3JBskvHN0dJtC7dpr ._3J-1b0JUEHFIu3aHQiXY2m {
    -webkit-animation: UgX3W_HhivQrETKdD6X_c 1.5s ease-in-out infinite;
    animation: UgX3W_HhivQrETKdD6X_c 1.5s ease-in-out infinite;
    stroke: rgba(0, 0, 0, 0.2);
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
    stroke-linecap: round;
  }
  .oAPVXsJiQ_ivBy1znc2Gg,
        ._3eBT-caf7Z2L7t3J6X2-j6 ._21ffV9cayPfHIkFdZ_XvWn .oAPVXsJiQ_ivBy1znc2Gg {
    background-color: #1ab22c;
    border-color: #1ab22c;
  }
  .qsJPd_oEWG2lywXPD0a66 ._1-5wFy0rJNbLwXFG0xG4sa {
    background: #d8dce2;
    border-radius: 5px;
    font-size: 1.1rem;
    line-height: 1.25rem;
    padding: 0.5rem;
  }
  .qsJPd_oEWG2lywXPD0a66 ._2GJYv6Bk7-6qpy4rN_l5NJ {
    color: green;
    padding: 0.5rem;
  }
  .ufuTSZ5BObomevjoHGiLC .Fe58O0X7CwMwtwEMeV8iP {
    font-size: 12px;
  }
  .vTejYh3eCvcK7lRihCOoE ._27tk3yj6WZpa9R_3CyMVrr {
    align-items: flex-start;
    align-self: flex-start;
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    justify-content: flex-start;
    padding: 4px;
  }
  .vTejYh3eCvcK7lRihCOoE ._27tk3yj6WZpa9R_3CyMVrr ._2ajy_cAehVVryWZIXfCycW {
    border: 1px solid #666667;
    font-size: 0.9rem;
    height: 100%;
    margin-left: 8px;
    margin-top: 2px;
    padding: 6px;
    width: 25%;
  }
  .vTejYh3eCvcK7lRihCOoE ._2KRVLJzSq1J-7huwd3hAd7 {
    padding-left: 4px;
  }
  .vTejYh3eCvcK7lRihCOoE ._2nCLeYL5EZBblBAAOtOCuk {
    font-size: 1.2rem;
    font-weight: normal;
    line-height: 1.1rem;
    margin: 12px 0 14px;
    width: 100%;
  }
  .vTejYh3eCvcK7lRihCOoE ._2nCLeYL5EZBblBAAOtOCuk ._2jHpMojDwPNJGgSt60JlsE {
    padding-bottom: 8px;
  }
  .vTejYh3eCvcK7lRihCOoE ._2nCLeYL5EZBblBAAOtOCuk ._2veNj-PsWe3wKXWQUYXXMZ {
    padding-left: 6px;
    width: 100%;
  }
  .vTejYh3eCvcK7lRihCOoE ._2zZXxl2dDQvKEhLTIAVk9m {
    font-size: 1.2rem;
  }
  .vTejYh3eCvcK7lRihCOoE ._3EgFLmBMjjTqYjBAUwxjhe {
    align-items: flex-start;
    display: flex;
    justify-content: flex-start;
    padding: 0 8px;
  }
  .vTejYh3eCvcK7lRihCOoE ._3eZE4T4NMF2tId8u7cCv50 {
    color: #06a015;
    font-size: 1rem;
    font-weight: bold;
  }
  .vhClywwBOSDOuuTFKr8YP {
    background-color: #000000;
    color: white;
  }
  .xvxeQN82BJ2CYoJBUxuuA .AD_56px {
    background-position: 0 0px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .AE_56px {
    background-position: 0 -56px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .AF_56px {
    background-position: 0 -112px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .AG_56px {
    background-position: 0 -168px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .AI_56px {
    background-position: 0 -224px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .AL_56px {
    background-position: 0 -280px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .AM_56px {
    background-position: 0 -336px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .AO_56px {
    background-position: 0 -392px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .AR_56px {
    background-position: 0 -448px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .AS_56px {
    background-position: 0 -504px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .AT_56px {
    background-position: 0 -560px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .AU_56px {
    background-position: 0 -616px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .AW_56px {
    background-position: 0 -672px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .AX_56px {
    background-position: 0 -728px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .AZ_56px {
    background-position: 0 -784px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .BA_56px {
    background-position: 0 -840px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .BB_56px {
    background-position: 0 -896px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .BD_56px {
    background-position: 0 -952px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .BE_56px {
    background-position: 0 -1008px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .BF_56px {
    background-position: 0 -1064px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .BG_56px {
    background-position: 0 -1120px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .BH_56px {
    background-position: 0 -1176px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .BI_56px {
    background-position: 0 -1232px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .BJ_56px {
    background-position: 0 -1288px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .BM_56px {
    background-position: 0 -1344px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .BN_56px {
    background-position: 0 -1400px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .BO_56px {
    background-position: 0 -1456px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .BR_56px {
    background-position: 0 -1512px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .BS_56px {
    background-position: 0 -1568px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .BT_56px {
    background-position: 0 -1624px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .BW_56px {
    background-position: 0 -1680px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .BY_56px {
    background-position: 0 -1736px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .BZ_56px {
    background-position: 0 -1792px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .CA_56px {
    background-position: 0 -1848px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .CC_56px {
    background-position: 0 -1904px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .CD_56px {
    background-position: 0 -1960px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .CF_56px {
    background-position: 0 -2016px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .CG_56px {
    background-position: 0 -2072px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .CH_56px {
    background-position: 0 -2128px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .CL_56px {
    background-position: 0 -2184px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .CM_56px {
    background-position: 0 -2240px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .CN_56px {
    background-position: 0 -2296px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .CO_56px {
    background-position: 0 -2352px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .CR_56px {
    background-position: 0 -2408px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .CU_56px {
    background-position: 0 -2464px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .CV_56px {
    background-position: 0 -2520px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .CX_56px {
    background-position: 0 -2576px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .CY_56px {
    background-position: 0 -2632px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .CZ_56px {
    background-position: 0 -2688px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .DE_56px {
    background-position: 0 -2744px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .DJ_56px {
    background-position: 0 -2800px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .DK_56px {
    background-position: 0 -2856px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .DM_56px {
    background-position: 0 -2912px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .DO_56px {
    background-position: 0 -2968px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .DZ_56px {
    background-position: 0 -3024px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .EC_56px {
    background-position: 0 -3080px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .EE_56px {
    background-position: 0 -3136px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .EG_56px {
    background-position: 0 -3192px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .EH_56px {
    background-position: 0 -3248px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .ER_56px {
    background-position: 0 -3304px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .ES_56px {
    background-position: 0 -3360px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .ET_56px {
    background-position: 0 -3416px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .FI_56px {
    background-position: 0 -3472px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .FJ_56px {
    background-position: 0 -3528px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .FK_56px {
    background-position: 0 -3584px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .FM_56px {
    background-position: 0 -3640px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .FO_56px {
    background-position: 0 -3696px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .FR_56px {
    background-position: 0 -3752px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .GA_56px {
    background-position: 0 -3808px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .GB_56px {
    background-position: 0 -3864px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .GD_56px {
    background-position: 0 -3920px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .GE_56px {
    background-position: 0 -3976px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .GF_56px {
    background-position: 0 -4032px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .GH_56px {
    background-position: 0 -4088px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .GI_56px {
    background-position: 0 -4144px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .GL_56px {
    background-position: 0 -4200px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .GM_56px {
    background-position: 0 -4256px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .GN_56px {
    background-position: 0 -4312px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .GP_56px {
    background-position: 0 -4368px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .GQ_56px {
    background-position: 0 -4424px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .GR_56px {
    background-position: 0 -4480px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .GT_56px {
    background-position: 0 -4536px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .GW_56px {
    background-position: 0 -4592px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .GY_56px {
    background-position: 0 -4648px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .HK_56px {
    background-position: 0 -4704px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .HN_56px {
    background-position: 0 -4760px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .HR_56px {
    background-position: 0 -4816px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .HT_56px {
    background-position: 0 -4872px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .HU_56px {
    background-position: 0 -4928px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .IE_56px {
    background-position: 0 -4984px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .IL_56px {
    background-position: 0 -5040px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .IM_56px {
    background-position: 0 -5096px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .IN_56px {
    background-position: 0 -5152px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .IO_56px {
    background-position: 0 -5208px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .IQ_56px {
    background-position: 0 -5264px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .IR_56px {
    background-position: 0 -5320px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .IS_56px {
    background-position: 0 -5376px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .IT_56px {
    background-position: 0 -5432px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .JE_56px {
    background-position: 0 -5488px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .JM_56px {
    background-position: 0 -5544px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .JO_56px {
    background-position: 0 -5600px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .JP_56px {
    background-position: 0 -5656px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .KE_56px {
    background-position: 0 -5712px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .KG_56px {
    background-position: 0 -5768px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .KH_56px {
    background-position: 0 -5824px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .KI_56px {
    background-position: 0 -5880px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .KM_56px {
    background-position: 0 -5936px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .KN_56px {
    background-position: 0 -5992px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .KP_56px {
    background-position: 0 -6048px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .KR_56px {
    background-position: 0 -6104px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .KW_56px {
    background-position: 0 -6160px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .KY_56px {
    background-position: 0 -6216px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .KZ_56px {
    background-position: 0 -6272px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .LA_56px {
    background-position: 0 -6328px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .LB_56px {
    background-position: 0 -6384px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .LC_56px {
    background-position: 0 -6440px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .LI_56px {
    background-position: 0 -6496px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .LK_56px {
    background-position: 0 -6552px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .LR_56px {
    background-position: 0 -6608px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .LS_56px {
    background-position: 0 -6664px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .LT_56px {
    background-position: 0 -6720px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .LU_56px {
    background-position: 0 -6776px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .LV_56px {
    background-position: 0 -6832px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .LY_56px {
    background-position: 0 -6888px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MA_56px {
    background-position: 0 -6944px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MC_56px {
    background-position: 0 -7000px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MD_56px {
    background-position: 0 -7056px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MG_56px {
    background-position: 0 -7112px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MH_56px {
    background-position: 0 -7168px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MK_56px {
    background-position: 0 -7224px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .ML_56px {
    background-position: 0 -7280px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MM_56px {
    background-position: 0 -7336px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MN_56px {
    background-position: 0 -7392px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MP_56px {
    background-position: 0 -7448px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MQ_56px {
    background-position: 0 -7504px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MR_56px {
    background-position: 0 -7560px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MS_56px {
    background-position: 0 -7616px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MT_56px {
    background-position: 0 -7672px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MU_56px {
    background-position: 0 -7728px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MV_56px {
    background-position: 0 -7784px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MW_56px {
    background-position: 0 -7840px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MX_56px {
    background-position: 0 -7896px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MY_56px {
    background-position: 0 -7952px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MZ_56px {
    background-position: 0 -8008px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .NA_56px {
    background-position: 0 -8064px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .NE_56px {
    background-position: 0 -8120px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .NG_56px {
    background-position: 0 -8176px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .NI_56px {
    background-position: 0 -8232px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .NL_56px {
    background-position: 0 -8288px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .NO_56px {
    background-position: 0 -8344px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .NP_56px {
    background-position: 0 -8400px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .NR_56px {
    background-position: 0 -8456px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .NZ_56px {
    background-position: 0 -8512px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .OM_56px {
    background-position: 0 -8568px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .PA_56px {
    background-position: 0 -8624px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .PE_56px {
    background-position: 0 -8680px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .PF_56px {
    background-position: 0 -8736px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .PG_56px {
    background-position: 0 -8792px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .PH_56px {
    background-position: 0 -8848px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .PK_56px {
    background-position: 0 -8904px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .PL_56px {
    background-position: 0 -8960px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .PM_56px {
    background-position: 0 -9016px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .PR_56px {
    background-position: 0 -9072px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .PT_56px {
    background-position: 0 -9128px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .PW_56px {
    background-position: 0 -9184px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .PY_56px {
    background-position: 0 -9240px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .QA_56px {
    background-position: 0 -9296px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .RE_56px {
    background-position: 0 -9352px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .RO_56px {
    background-position: 0 -9408px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .RS_56px {
    background-position: 0 -9464px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .RU_56px {
    background-position: 0 -9520px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .RW_56px {
    background-position: 0 -9576px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .SA_56px {
    background-position: 0 -9632px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .SB_56px {
    background-position: 0 -9688px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .SC_56px {
    background-position: 0 -9744px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .SD_56px {
    background-position: 0 -9800px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .SE_56px {
    background-position: 0 -9856px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .SG_56px {
    background-position: 0 -9912px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .SH_56px {
    background-position: 0 -9968px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .SI_56px {
    background-position: 0 -10024px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .SK_56px {
    background-position: 0 -10080px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .SL_56px {
    background-position: 0 -10136px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .SM_56px {
    background-position: 0 -10192px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .SN_56px {
    background-position: 0 -10248px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .SO_56px {
    background-position: 0 -10304px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .SR_56px {
    background-position: 0 -10360px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .SS_56px {
    background-position: 0 -10416px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .SV_56px {
    background-position: 0 -10472px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .SY_56px {
    background-position: 0 -10528px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .SZ_56px {
    background-position: 0 -10584px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .TC_56px {
    background-position: 0 -10640px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .TD_56px {
    background-position: 0 -10696px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .TF_56px {
    background-position: 0 -10752px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .TG_56px {
    background-position: 0 -10808px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .TH_56px {
    background-position: 0 -10864px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .TJ_56px {
    background-position: 0 -10920px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .TM_56px {
    background-position: 0 -10976px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .TN_56px {
    background-position: 0 -11032px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .TO_56px {
    background-position: 0 -11088px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .TR_56px {
    background-position: 0 -11144px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .TT_56px {
    background-position: 0 -11200px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .TV_56px {
    background-position: 0 -11256px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .TW_56px {
    background-position: 0 -11312px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .TZ_56px {
    background-position: 0 -11368px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .UA_56px {
    background-position: 0 -11424px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .UG_56px {
    background-position: 0 -11480px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .US_56px {
    background-position: 0 -11536px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .UY_56px {
    background-position: 0 -11592px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .UZ_56px {
    background-position: 0 -11648px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .VA_56px {
    background-position: 0 -11704px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .VC_56px {
    background-position: 0 -11760px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .VE_56px {
    background-position: 0 -11816px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .VG_56px {
    background-position: 0 -11872px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .VI_56px {
    background-position: 0 -11928px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .VN_56px {
    background-position: 0 -11984px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .VU_56px {
    background-position: 0 -12040px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .WS_56px {
    background-position: 0 -12096px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .YE_56px {
    background-position: 0 -12152px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .YT_56px {
    background-position: 0 -12208px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .ZA_56px {
    background-position: 0 -12264px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .ZM_56px {
    background-position: 0 -12320px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .ZW_56px {
    background-position: 0 -12376px;
  }
  .y7Lxdef35rl_xZd88Xven {
    color: #90949c;
    padding-left: 0.2rem;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .AD_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .AD_25px {
    background-position: 0 0px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .AE_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .AE_25px {
    background-position: 0 -25px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .AF_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .AF_25px {
    background-position: 0 -50px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .AG_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .AG_25px {
    background-position: 0 -75px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .AI_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .AI_25px {
    background-position: 0 -100px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .AL_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .AL_25px {
    background-position: 0 -125px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .AM_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .AM_25px {
    background-position: 0 -150px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .AO_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .AO_25px {
    background-position: 0 -175px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .AR_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .AR_25px {
    background-position: 0 -200px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .AS_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .AS_25px {
    background-position: 0 -225px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .AT_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .AT_25px {
    background-position: 0 -250px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .AU_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .AU_25px {
    background-position: 0 -275px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .AW_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .AW_25px {
    background-position: 0 -300px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .AX_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .AX_25px {
    background-position: 0 -325px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .AZ_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .AZ_25px {
    background-position: 0 -350px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .BA_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .BA_25px {
    background-position: 0 -375px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .BB_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .BB_25px {
    background-position: 0 -400px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .BD_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .BD_25px {
    background-position: 0 -425px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .BE_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .BE_25px {
    background-position: 0 -450px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .BF_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .BF_25px {
    background-position: 0 -475px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .BG_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .BG_25px {
    background-position: 0 -500px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .BH_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .BH_25px {
    background-position: 0 -525px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .BI_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .BI_25px {
    background-position: 0 -550px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .BJ_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .BJ_25px {
    background-position: 0 -575px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .BM_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .BM_25px {
    background-position: 0 -600px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .BN_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .BN_25px {
    background-position: 0 -625px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .BO_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .BO_25px {
    background-position: 0 -650px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .BR_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .BR_25px {
    background-position: 0 -675px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .BS_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .BS_25px {
    background-position: 0 -700px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .BT_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .BT_25px {
    background-position: 0 -725px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .BW_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .BW_25px {
    background-position: 0 -750px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .BY_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .BY_25px {
    background-position: 0 -775px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .BZ_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .BZ_25px {
    background-position: 0 -800px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .CA_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .CA_25px {
    background-position: 0 -825px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .CC_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .CC_25px {
    background-position: 0 -850px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .CD_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .CD_25px {
    background-position: 0 -875px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .CF_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .CF_25px {
    background-position: 0 -900px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .CG_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .CG_25px {
    background-position: 0 -925px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .CH_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .CH_25px {
    background-position: 0 -950px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .CL_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .CL_25px {
    background-position: 0 -975px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .CM_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .CM_25px {
    background-position: 0 -1000px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .CN_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .CN_25px {
    background-position: 0 -1025px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .CO_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .CO_25px {
    background-position: 0 -1050px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .CR_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .CR_25px {
    background-position: 0 -1075px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .CU_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .CU_25px {
    background-position: 0 -1100px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .CV_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .CV_25px {
    background-position: 0 -1125px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .CX_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .CX_25px {
    background-position: 0 -1150px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .CY_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .CY_25px {
    background-position: 0 -1175px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .CZ_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .CZ_25px {
    background-position: 0 -1200px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .DE_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .DE_25px {
    background-position: 0 -1225px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .DJ_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .DJ_25px {
    background-position: 0 -1250px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .DK_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .DK_25px {
    background-position: 0 -1275px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .DM_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .DM_25px {
    background-position: 0 -1300px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .DO_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .DO_25px {
    background-position: 0 -1325px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .DZ_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .DZ_25px {
    background-position: 0 -1350px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .EC_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .EC_25px {
    background-position: 0 -1375px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .EE_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .EE_25px {
    background-position: 0 -1400px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .EG_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .EG_25px {
    background-position: 0 -1425px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .EH_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .EH_25px {
    background-position: 0 -1450px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .ER_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .ER_25px {
    background-position: 0 -1475px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .ES_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .ES_25px {
    background-position: 0 -1500px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .ET_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .ET_25px {
    background-position: 0 -1525px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .FI_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .FI_25px {
    background-position: 0 -1550px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .FJ_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .FJ_25px {
    background-position: 0 -1575px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .FK_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .FK_25px {
    background-position: 0 -1600px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .FM_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .FM_25px {
    background-position: 0 -1625px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .FO_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .FO_25px {
    background-position: 0 -1650px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .FR_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .FR_25px {
    background-position: 0 -1675px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .GA_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .GA_25px {
    background-position: 0 -1700px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .GB_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .GB_25px {
    background-position: 0 -1725px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .GD_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .GD_25px {
    background-position: 0 -1750px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .GE_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .GE_25px {
    background-position: 0 -1775px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .GF_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .GF_25px {
    background-position: 0 -1800px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .GH_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .GH_25px {
    background-position: 0 -1825px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .GI_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .GI_25px {
    background-position: 0 -1850px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .GL_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .GL_25px {
    background-position: 0 -1875px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .GM_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .GM_25px {
    background-position: 0 -1900px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .GN_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .GN_25px {
    background-position: 0 -1925px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .GP_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .GP_25px {
    background-position: 0 -1950px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .GQ_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .GQ_25px {
    background-position: 0 -1975px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .GR_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .GR_25px {
    background-position: 0 -2000px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .GT_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .GT_25px {
    background-position: 0 -2025px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .GW_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .GW_25px {
    background-position: 0 -2050px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .GY_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .GY_25px {
    background-position: 0 -2075px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .HK_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .HK_25px {
    background-position: 0 -2100px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .HN_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .HN_25px {
    background-position: 0 -2125px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .HR_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .HR_25px {
    background-position: 0 -2150px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .HT_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .HT_25px {
    background-position: 0 -2175px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .HU_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .HU_25px {
    background-position: 0 -2200px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .IE_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .IE_25px {
    background-position: 0 -2225px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .IL_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .IL_25px {
    background-position: 0 -2250px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .IM_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .IM_25px {
    background-position: 0 -2275px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .IN_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .IN_25px {
    background-position: 0 -2300px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .IO_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .IO_25px {
    background-position: 0 -2325px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .IQ_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .IQ_25px {
    background-position: 0 -2350px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .IR_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .IR_25px {
    background-position: 0 -2375px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .IS_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .IS_25px {
    background-position: 0 -2400px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .IT_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .IT_25px {
    background-position: 0 -2425px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .JE_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .JE_25px {
    background-position: 0 -2450px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .JM_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .JM_25px {
    background-position: 0 -2475px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .JO_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .JO_25px {
    background-position: 0 -2500px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .JP_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .JP_25px {
    background-position: 0 -2525px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .KE_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .KE_25px {
    background-position: 0 -2550px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .KG_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .KG_25px {
    background-position: 0 -2575px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .KH_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .KH_25px {
    background-position: 0 -2600px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .KI_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .KI_25px {
    background-position: 0 -2625px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .KM_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .KM_25px {
    background-position: 0 -2650px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .KN_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .KN_25px {
    background-position: 0 -2675px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .KP_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .KP_25px {
    background-position: 0 -2700px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .KR_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .KR_25px {
    background-position: 0 -2725px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .KW_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .KW_25px {
    background-position: 0 -2750px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .KY_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .KY_25px {
    background-position: 0 -2775px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .KZ_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .KZ_25px {
    background-position: 0 -2800px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .LA_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .LA_25px {
    background-position: 0 -2825px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .LB_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .LB_25px {
    background-position: 0 -2850px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .LC_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .LC_25px {
    background-position: 0 -2875px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .LI_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .LI_25px {
    background-position: 0 -2900px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .LK_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .LK_25px {
    background-position: 0 -2925px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .LR_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .LR_25px {
    background-position: 0 -2950px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .LS_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .LS_25px {
    background-position: 0 -2975px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .LT_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .LT_25px {
    background-position: 0 -3000px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .LU_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .LU_25px {
    background-position: 0 -3025px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .LV_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .LV_25px {
    background-position: 0 -3050px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .LY_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .LY_25px {
    background-position: 0 -3075px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MA_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MA_25px {
    background-position: 0 -3100px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MC_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MC_25px {
    background-position: 0 -3125px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MD_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MD_25px {
    background-position: 0 -3150px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MG_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MG_25px {
    background-position: 0 -3175px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MH_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MH_25px {
    background-position: 0 -3200px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MK_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MK_25px {
    background-position: 0 -3225px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .ML_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .ML_25px {
    background-position: 0 -3250px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MM_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MM_25px {
    background-position: 0 -3275px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MN_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MN_25px {
    background-position: 0 -3300px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MP_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MP_25px {
    background-position: 0 -3325px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MQ_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MQ_25px {
    background-position: 0 -3350px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MR_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MR_25px {
    background-position: 0 -3375px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MS_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MS_25px {
    background-position: 0 -3400px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MT_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MT_25px {
    background-position: 0 -3425px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MU_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MU_25px {
    background-position: 0 -3450px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MV_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MV_25px {
    background-position: 0 -3475px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MW_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MW_25px {
    background-position: 0 -3500px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MX_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MX_25px {
    background-position: 0 -3525px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MY_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MY_25px {
    background-position: 0 -3550px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MZ_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MZ_25px {
    background-position: 0 -3575px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .NA_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .NA_25px {
    background-position: 0 -3600px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .NE_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .NE_25px {
    background-position: 0 -3625px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .NG_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .NG_25px {
    background-position: 0 -3650px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .NI_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .NI_25px {
    background-position: 0 -3675px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .NL_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .NL_25px {
    background-position: 0 -3700px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .NO_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .NO_25px {
    background-position: 0 -3725px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .NP_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .NP_25px {
    background-position: 0 -3750px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .NR_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .NR_25px {
    background-position: 0 -3775px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .NZ_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .NZ_25px {
    background-position: 0 -3800px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .OM_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .OM_25px {
    background-position: 0 -3825px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .PA_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .PA_25px {
    background-position: 0 -3850px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .PE_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .PE_25px {
    background-position: 0 -3875px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .PF_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .PF_25px {
    background-position: 0 -3900px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .PG_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .PG_25px {
    background-position: 0 -3925px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .PH_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .PH_25px {
    background-position: 0 -3950px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .PK_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .PK_25px {
    background-position: 0 -3975px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .PL_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .PL_25px {
    background-position: 0 -4000px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .PM_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .PM_25px {
    background-position: 0 -4025px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .PR_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .PR_25px {
    background-position: 0 -4050px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .PT_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .PT_25px {
    background-position: 0 -4075px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .PW_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .PW_25px {
    background-position: 0 -4100px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .PY_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .PY_25px {
    background-position: 0 -4125px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .QA_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .QA_25px {
    background-position: 0 -4150px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .RE_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .RE_25px {
    background-position: 0 -4175px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .RO_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .RO_25px {
    background-position: 0 -4200px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .RS_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .RS_25px {
    background-position: 0 -4225px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .RU_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .RU_25px {
    background-position: 0 -4250px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .RW_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .RW_25px {
    background-position: 0 -4275px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .SA_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .SA_25px {
    background-position: 0 -4300px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .SB_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .SB_25px {
    background-position: 0 -4325px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .SC_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .SC_25px {
    background-position: 0 -4350px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .SD_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .SD_25px {
    background-position: 0 -4375px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .SE_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .SE_25px {
    background-position: 0 -4400px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .SG_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .SG_25px {
    background-position: 0 -4425px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .SH_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .SH_25px {
    background-position: 0 -4450px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .SI_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .SI_25px {
    background-position: 0 -4475px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .SK_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .SK_25px {
    background-position: 0 -4500px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .SL_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .SL_25px {
    background-position: 0 -4525px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .SM_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .SM_25px {
    background-position: 0 -4550px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .SN_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .SN_25px {
    background-position: 0 -4575px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .SO_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .SO_25px {
    background-position: 0 -4600px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .SR_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .SR_25px {
    background-position: 0 -4625px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .SS_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .SS_25px {
    background-position: 0 -4650px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .SV_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .SV_25px {
    background-position: 0 -4675px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .SY_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .SY_25px {
    background-position: 0 -4700px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .SZ_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .SZ_25px {
    background-position: 0 -4725px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .TC_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .TC_25px {
    background-position: 0 -4750px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .TD_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .TD_25px {
    background-position: 0 -4775px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .TF_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .TF_25px {
    background-position: 0 -4800px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .TG_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .TG_25px {
    background-position: 0 -4825px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .TH_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .TH_25px {
    background-position: 0 -4850px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .TJ_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .TJ_25px {
    background-position: 0 -4875px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .TM_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .TM_25px {
    background-position: 0 -4900px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .TN_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .TN_25px {
    background-position: 0 -4925px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .TO_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .TO_25px {
    background-position: 0 -4950px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .TR_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .TR_25px {
    background-position: 0 -4975px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .TT_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .TT_25px {
    background-position: 0 -5000px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .TV_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .TV_25px {
    background-position: 0 -5025px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .TW_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .TW_25px {
    background-position: 0 -5050px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .TZ_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .TZ_25px {
    background-position: 0 -5075px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .UA_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .UA_25px {
    background-position: 0 -5100px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .UG_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .UG_25px {
    background-position: 0 -5125px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .US_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .US_25px {
    background-position: 0 -5150px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .UY_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .UY_25px {
    background-position: 0 -5175px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .UZ_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .UZ_25px {
    background-position: 0 -5200px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .VA_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .VA_25px {
    background-position: 0 -5225px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .VC_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .VC_25px {
    background-position: 0 -5250px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .VE_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .VE_25px {
    background-position: 0 -5275px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .VG_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .VG_25px {
    background-position: 0 -5300px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .VI_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .VI_25px {
    background-position: 0 -5325px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .VN_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .VN_25px {
    background-position: 0 -5350px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .VU_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .VU_25px {
    background-position: 0 -5375px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .VrvZWTU4wpGJwxeTzir79,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .VrvZWTU4wpGJwxeTzir79 {
    color: #666667;
    margin-left: auto;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .WS_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .WS_25px {
    background-position: 0 -5400px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .YE_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .YE_25px {
    background-position: 0 -5425px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .YT_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .YT_25px {
    background-position: 0 -5450px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .ZA_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .ZA_25px {
    background-position: 0 -5475px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .ZM_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .ZM_25px {
    background-position: 0 -5500px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .ZW_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .ZW_25px {
    background-position: 0 -5525px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd ._11QU_BIqESitk6Tryg9hVJ,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd ._11QU_BIqESitk6Tryg9hVJ {
    background-image: url('https://checkout.clarifion.com/champflxbnzet1upsell/img/flag_sprite.png');
    background-repeat: no-repeat;
    background-size: 100%;
    display: inline-block;
    height: 25px;
    width: 25px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd {
    align-items: center;
    background-color: white;
    cursor: pointer;
    display: flex;
    height: 55px;
    padding: 0 20px;
  }
  .yBiQ1tylQlUl3F4-r4bTi,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf {
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 3px 30px rgba(0, 0, 0, 0.3);
    height: 220px;
    overflow: hidden;
    overflow-y: scroll;
    position: absolute;
    top: 72px;
    width: 100%;
    z-index: 10000;
  }
  .yotpo-close-modal.yotpo-icon-btn-small .yotpo-icon.yotpo-icon-cross {
    background: red !important;
    border: 2px solid black !important;
    border-radius: 5px !important;
    box-sizing: border-box !important;
    color: white !important;
  }
```

### J. All Static Text Content (from HTML)

  `#fkt-link-82c-ea0-9be` (a): `No, Thank you!`
  `#i2yaj` (span): `Copyright (c) 2024 Clarifion`
  `#i45x9` (p): `Not ready for 6
                                Clarifions just yet?`
  `#iarqc` (p): `Here's 3 Extra
                                Clarifions Ionizers for ONLY $54!`
  `#idsdp` (p): `Wait!`
  `#ifhdn` (p): `Wait!`
  `#igbwl` (p): `And yes, shipping's
                                still on us.`
  `#iq099` (h1): `Wait! Wait!`
  `#iwjle` (button): `Yes! Send me an additional 3 Clarifion™ for
                            only $18`
  `#izofs` (div): `Yes! Send me an additional 3 Clarifion™ for
                            only $18`
  `#pageDataScript` (script): `var pageData = { "pageViewReferenceId": "13369a02-dbb6-4fbd-b50d-fb8878f894b3", `
  `#reject-upsell` (div): `No, Thank you!`

### K. JavaScript Template Texts

- `); // Step 2: Confirm payment with Stripe.js console.log(`
- `); e.preventDefault(); orderSummary.classList.toggle(`
- `); orderSummary.classList.toggle(`
- `); orders.unshift(order); localStorage.setItem(`
- `); updateOrderStatus(order.id,`
- `, JSON.stringify(orders)); console.log(`
- `, currencyCode); // Create order draft BEFORE payment processing console.log(`
- `, error); // Update order status to failed updateOrderStatus(order.id,`
- `, foundDiscount); appliedDiscountCode = foundDiscount; setTimeout(() => { syncOrderSummaryWithProduc`
- `, orderId); } catch (error) { console.error(`
- `.order-applied-discount-remove`
- `.order-discount-code-button`
- `.order-discount-code-input`
- `.order-summary-body`
- `.order-summary-header`
- `; // Order Item bodyHTML +=`
- `; productRow.style.borderLeft =`
- `; r.style.borderLeft =`
- `; row.style.borderColor =`
- `; row.style.borderLeft =`

---

## Clarifion OTO2 (upsell-oto2-clarifion.html)

- **File size**: 605,181 bytes | **Custom CSS**: 232,260 bytes
- **Timer**: None
- **ID rules**: 7 | **Class rules**: 804 | **Keyframes**: 8

### A. Interrupt Header

**ID**: `#iqapq` | **Tag**: `<h1>` | **Text**: `Wait! Here’s another way to clean your
                                air`

### B. Countdown Timer

_No countdown timer_

### C. Headlines

**<h1>** `Wait! Here’s another way to clean your
                                air`

### D. CTA Button

**Text**: `YES! Add 3 ODRx devices to my
                            order for only
       `
**Tag**: `<button>` | **ID**: `#iwjle`

**CTA Class Styles:**
`.btn-primary`:
```css
  background-color: #1ab22c;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 1px;
  margin-top: 35.2px;
  outline: none;
  padding: 8.8px;
  transition: all 600ms cubic-bezier(0, 0.3, 0.7, 1);
```

`.btn-primary:hover`:
```css
  background-color: #1ab22c;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 1px;
  margin-top: 35.2px;
  outline: none;
  padding: 8.8px;
  transition: all 600ms cubic-bezier(0, 0.3, 0.7, 1);
```

`.fk-youtube .play-button`:
```css
  background-color: #333;
  border-radius: 6px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.6);
  height: 60px;
  opacity: 0.8;
  width: 90px;
  z-index: 1;
```

`.yotpo-close-modal.yotpo-icon-btn-small .yotpo-icon.yotpo-icon-cross`:
```css
  background: red !important;
  border: 2px solid black !important;
  border-radius: 5px !important;
  box-sizing: border-box !important;
  color: white !important;
```

### E. Opt-Out (Negative Option)

_No opt-out found_

### F. Price Elements

_No price-specific CSS found (prices rendered via JS)_

### G. Guarantee

_No guarantee found_

### H. Key ID-Based CSS (Conversion-Relevant)

```css
  #bodyElementDummy {
    display: none;
  }
  #fkt-image-045-88a-a45 {
    height: 150px;
    width: 150px;
  }
  #fkt-image-4cb-3af-952 {
    height: auto;
    width: auto !important;
  }
  #fkt-image-de4-389-977 {
    height: 50px;
    width: 200px;
  }
  #iqapq {
    font-weight: 700;
  }
```

### I. Key Class-Based CSS

```css
  .AD_25px {
    background-position: 0 0px;
  }
  .AE_25px {
    background-position: 0 -25px;
  }
  .AF_25px {
    background-position: 0 -50px;
  }
  .AG_25px {
    background-position: 0 -75px;
  }
  .AI_25px {
    background-position: 0 -100px;
  }
  .AIs6iEbf9UqkqPBo2ltj_,
        .vTejYh3eCvcK7lRihCOoE ._2nCLeYL5EZBblBAAOtOCuk .AIs6iEbf9UqkqPBo2ltj_ {
    border-radius: 3px;
    display: flex;
    margin-top: 0.4rem;
    padding: 10px;
    width: 90%;
  }
  .AIs6iEbf9UqkqPBo2ltj_._2DFz4-s4Ae8O4NaBK9mzmC,
        .vTejYh3eCvcK7lRihCOoE ._2nCLeYL5EZBblBAAOtOCuk .AIs6iEbf9UqkqPBo2ltj_._2DFz4-s4Ae8O4NaBK9mzmC {
    background-color: #f4f4f4;
  }
  .AL_25px {
    background-position: 0 -125px;
  }
  .AM_25px {
    background-position: 0 -150px;
  }
  .AO_25px {
    background-position: 0 -175px;
  }
  .AR_25px {
    background-position: 0 -200px;
  }
  .AS_25px {
    background-position: 0 -225px;
  }
  .AT_25px {
    background-position: 0 -250px;
  }
  .AU_25px {
    background-position: 0 -275px;
  }
  .AW_25px {
    background-position: 0 -300px;
  }
  .AX_25px {
    background-position: 0 -325px;
  }
  .AZ_25px {
    background-position: 0 -350px;
  }
  .BA_25px {
    background-position: 0 -375px;
  }
  .BB_25px {
    background-position: 0 -400px;
  }
  .BD_25px {
    background-position: 0 -425px;
  }
  .BE_25px {
    background-position: 0 -450px;
  }
  .BF_25px {
    background-position: 0 -475px;
  }
  .BG_25px {
    background-position: 0 -500px;
  }
  .BH_25px {
    background-position: 0 -525px;
  }
  .BI_25px {
    background-position: 0 -550px;
  }
  .BJ_25px {
    background-position: 0 -575px;
  }
  .BM_25px {
    background-position: 0 -600px;
  }
  .BN_25px {
    background-position: 0 -625px;
  }
  .BO_25px {
    background-position: 0 -650px;
  }
  .BR_25px {
    background-position: 0 -675px;
  }
  .BS_25px {
    background-position: 0 -700px;
  }
  .BT_25px {
    background-position: 0 -725px;
  }
  .BW_25px {
    background-position: 0 -750px;
  }
  .BY_25px {
    background-position: 0 -775px;
  }
  .BZ_25px {
    background-position: 0 -800px;
  }
  .CA_25px {
    background-position: 0 -825px;
  }
  .CBiOYQVFHfGbez1vPW5Eu {
    background-color: #323232;
    color: white;
  }
  .CC_25px {
    background-position: 0 -850px;
  }
  .CD_25px {
    background-position: 0 -875px;
  }
  .CF_25px {
    background-position: 0 -900px;
  }
  .CG_25px {
    background-position: 0 -925px;
  }
  .CH_25px {
    background-position: 0 -950px;
  }
  .CL_25px {
    background-position: 0 -975px;
  }
  .CM_25px {
    background-position: 0 -1000px;
  }
  .CN_25px {
    background-position: 0 -1025px;
  }
  .CO_25px {
    background-position: 0 -1050px;
  }
  .CR_25px {
    background-position: 0 -1075px;
  }
  .CU_25px {
    background-position: 0 -1100px;
  }
  .CV_25px {
    background-position: 0 -1125px;
  }
  .CX_25px {
    background-position: 0 -1150px;
  }
  .CY_25px {
    background-position: 0 -1175px;
  }
  .CZ_25px {
    background-position: 0 -1200px;
  }
  .DE_25px {
    background-position: 0 -1225px;
  }
  .DJ_25px {
    background-position: 0 -1250px;
  }
  .DK_25px {
    background-position: 0 -1275px;
  }
  .DM_25px {
    background-position: 0 -1300px;
  }
  .DO_25px {
    background-position: 0 -1325px;
  }
  .DZ_25px {
    background-position: 0 -1350px;
  }
  .EC_25px {
    background-position: 0 -1375px;
  }
  .EE_25px {
    background-position: 0 -1400px;
  }
  .EG_25px {
    background-position: 0 -1425px;
  }
  .EH_25px {
    background-position: 0 -1450px;
  }
  .ER_25px {
    background-position: 0 -1475px;
  }
  .ERxklc1DEy6MRbHq8F_oL ._3qG_M93hEacQkijHPJkGp3 {
    align-items: center;
    background-color: #323232;
    border: 2px solid rgba(40, 40, 80, 0.3);
    border-radius: 3px;
    color: white;
    display: flex;
    font-size: 16px;
    justify-content: space-between;
    line-height: 140%;
    padding: 13.33333px 20px;
    text-align: left;
  }
  .ERxklc1DEy6MRbHq8F_oL .xFfiAqzH9NFPaQ_MJUds_ {
    color: #323232;
    font-size: 14px;
    line-height: 180%;
    padding: 20px 40px;
    text-align: left;
  }
  .ES_25px {
    background-position: 0 -1500px;
  }
  .ET_25px {
    background-position: 0 -1525px;
  }
  .FI_25px {
    background-position: 0 -1550px;
  }
  .FJ_25px {
    background-position: 0 -1575px;
  }
  .FK_25px {
    background-position: 0 -1600px;
  }
  .FM_25px {
    background-position: 0 -1625px;
  }
  .FO_25px {
    background-position: 0 -1650px;
  }
  .FR_25px {
    background-position: 0 -1675px;
  }
  .FamgNeTLmEx83Uzx_1NaQ {
    color: #323232;
    font-size: 0.9rem;
    font-weight: normal;
  }
  .G7lcMZWWCM-fOTm8KoSxB {
    align-items: center;
    background-color: #89a383;
    border-radius: 50%;
    color: white;
    display: flex;
    height: 2.5rem;
    justify-content: center;
    margin-right: 0.5rem;
    padding: 4px;
    position: relative;
    width: 2.5rem;
  }
  .GA_25px {
    background-position: 0 -1700px;
  }
  .GB_25px {
    background-position: 0 -1725px;
  }
  .GCMqIV_Qclk3NatceK653 ._2AGbX7Mg4BOLr5JAZNj8Ld {
    background-color: rgba(50, 50, 50, 0.1);
    height: 1px;
    margin-bottom: 20px;
  }
  .GCMqIV_Qclk3NatceK653 ._35Nj9y3o_mxX3bUWTYbUTQ {
    align-items: center;
    display: flex;
    font-size: 12px;
    font-weight: 200;
    margin: 5px 0 0 1px;
  }
  .GD_25px {
    background-position: 0 -1750px;
  }
  .GE_25px {
    background-position: 0 -1775px;
  }
  .GF_25px {
    background-position: 0 -1800px;
  }
  .GH_25px {
    background-position: 0 -1825px;
  }
  .GI_25px {
    background-position: 0 -1850px;
  }
  .GL_25px {
    background-position: 0 -1875px;
  }
  .GM_25px {
    background-position: 0 -1900px;
  }
  .GN_25px {
    background-position: 0 -1925px;
  }
  .GP_25px {
    background-position: 0 -1950px;
  }
  .GQ_25px {
    background-position: 0 -1975px;
  }
  .GR_25px {
    background-position: 0 -2000px;
  }
  .GT_25px {
    background-position: 0 -2025px;
  }
  .GW_25px {
    background-position: 0 -2050px;
  }
  .GY_25px {
    background-position: 0 -2075px;
  }
  .GrCbT77cZ3fSodwurZxaE,
        ._3ug74DsppSWcd9Mr08we_O ._2aoXngB9i7hXnWxW9feDj7 .GrCbT77cZ3fSodwurZxaE {
    align-items: center;
    display: flex;
    font-size: 11px;
    font-weight: bold;
    margin-top: 3px;
  }
  .HH5BcFkiFC7Nljlmy12A4 .MhGHhOA0lJjLWqgG7Mggw {
    border-radius: 4px;
    border-style: solid;
    border-width: 1px;
    padding: 0.5rem;
  }
  .HH5BcFkiFC7Nljlmy12A4 ._3e6CJniDBfmcZztBvIHnrl {
    padding-top: 4px;
  }
  .HK_25px {
    background-position: 0 -2100px;
  }
  .HN_25px {
    background-position: 0 -2125px;
  }
  .HR_25px {
    background-position: 0 -2150px;
  }
  .HT_25px {
    background-position: 0 -2175px;
  }
  .HU_25px {
    background-position: 0 -2200px;
  }
  .I9R-4mT-75umb_ObLZAsE,
        ._3eBT-caf7Z2L7t3J6X2-j6 ._21ffV9cayPfHIkFdZ_XvWn .I9R-4mT-75umb_ObLZAsE,
        ._18ikUvP25CDHcrfz1MsnXQ ._21ffV9cayPfHIkFdZ_XvWn .oAPVXsJiQ_ivBy1znc2Gg,
        ._3eBT-caf7Z2L7t3J6X2-j6 ._21ffV9cayPfHIkFdZ_XvWn .oAPVXsJiQ_ivBy1znc2Gg {
    border: 3px #474747 solid;
    border-radius: 2px;
  }
  .IE_25px {
    background-position: 0 -2225px;
  }
  .IL_25px {
    background-position: 0 -2250px;
  }
  .IM_25px {
    background-position: 0 -2275px;
  }
  .IN_25px {
    background-position: 0 -2300px;
  }
  .IO_25px {
    background-position: 0 -2325px;
  }
  .IQ_25px {
    background-position: 0 -2350px;
  }
  .IR_25px {
    background-position: 0 -2375px;
  }
  .IS_25px {
    background-position: 0 -2400px;
  }
  .IT_25px {
    background-position: 0 -2425px;
  }
  .In37K49i342Itc7t84w5h {
    background-color: white;
    border-radius: 5px;
    box-shadow: 0 2vh 10vh rgba(0, 0, 0, 0.3);
    height: 90%;
    max-width: 1200px;
    overflow: hidden;
    width: 90%;
  }
  .JE_25px {
    background-position: 0 -2450px;
  }
  .JM_25px {
    background-position: 0 -2475px;
  }
  .JO_25px {
    background-position: 0 -2500px;
  }
  .JP_25px {
    background-position: 0 -2525px;
  }
  .KE_25px {
    background-position: 0 -2550px;
  }
  .KG_25px {
    background-position: 0 -2575px;
  }
  .KH_25px {
    background-position: 0 -2600px;
  }
  .KI_25px {
    background-position: 0 -2625px;
  }
  .KM_25px {
    background-position: 0 -2650px;
  }
  .KN_25px {
    background-position: 0 -2675px;
  }
  .KP_25px {
    background-position: 0 -2700px;
  }
  .KR_25px {
    background-position: 0 -2725px;
  }
  .KW_25px {
    background-position: 0 -2750px;
  }
  .KY_25px {
    background-position: 0 -2775px;
  }
  .KZ_25px {
    background-position: 0 -2800px;
  }
  .L1dT-sUvPlZsvAwSwE6re {
    color: #323232;
    font-size: 1rem;
    margin: 4px auto;
  }
  .LA_25px {
    background-position: 0 -2825px;
  }
  .LB_25px {
    background-position: 0 -2850px;
  }
  .LC_25px {
    background-position: 0 -2875px;
  }
  .LI_25px {
    background-position: 0 -2900px;
  }
  .LK_25px {
    background-position: 0 -2925px;
  }
  .LR_25px {
    background-position: 0 -2950px;
  }
  .LS_25px {
    background-position: 0 -2975px;
  }
  .LT_25px {
    background-position: 0 -3000px;
  }
  .LU_25px {
    background-position: 0 -3025px;
  }
  .LV_25px {
    background-position: 0 -3050px;
  }
  .LY_25px {
    background-position: 0 -3075px;
  }
  .MA_25px {
    background-position: 0 -3100px;
  }
  .MC_25px {
    background-position: 0 -3125px;
  }
  .MD_25px {
    background-position: 0 -3150px;
  }
  .MG_25px {
    background-position: 0 -3175px;
  }
  .MH_25px {
    background-position: 0 -3200px;
  }
  .MK_25px {
    background-position: 0 -3225px;
  }
  .ML_25px {
    background-position: 0 -3250px;
  }
  .MM_25px {
    background-position: 0 -3275px;
  }
  .MN_25px {
    background-position: 0 -3300px;
  }
  .MP_25px {
    background-position: 0 -3325px;
  }
  .MQ_25px {
    background-position: 0 -3350px;
  }
  .MR_25px {
    background-position: 0 -3375px;
  }
  .MS_25px {
    background-position: 0 -3400px;
  }
  .MT_25px {
    background-position: 0 -3425px;
  }
  .MU_25px {
    background-position: 0 -3450px;
  }
  .MV_25px {
    background-position: 0 -3475px;
  }
  .MW_25px {
    background-position: 0 -3500px;
  }
  .MX_25px {
    background-position: 0 -3525px;
  }
  .MY_25px {
    background-position: 0 -3550px;
  }
  .MZ_25px {
    background-position: 0 -3575px;
  }
  .MowGJB0-86qBzKLnJwrBA ._1_qdewUQ53jSdFSJP1PHxW {
    padding-bottom: 1rem;
  }
  .MowGJB0-86qBzKLnJwrBA ._3ZBIDpy0mQ4NkMkhRuDCR7 {
    font-size: 12px;
    font-weight: normal;
    line-height: 160%;
    margin-top: 10px;
    text-align: left;
  }
  .NA_25px {
    background-position: 0 -3600px;
  }
  .NE_25px {
    background-position: 0 -3625px;
  }
  .NG_25px {
    background-position: 0 -3650px;
  }
  .NI_25px {
    background-position: 0 -3675px;
  }
  .NL_25px {
    background-position: 0 -3700px;
  }
  .NO_25px {
    background-position: 0 -3725px;
  }
  .NP_25px {
    background-position: 0 -3750px;
  }
  .NR_25px {
    background-position: 0 -3775px;
  }
  .NVxISeEA3XlEhoEVZlQnd {
    -webkit-animation: _3u5YnePr2qJC3i9uUdgTnc 12s linear infinite;
    animation: _3u5YnePr2qJC3i9uUdgTnc 12s linear infinite;
    border: 2px dashed white;
    border-radius: 100%;
    height: 84px;
    position: absolute;
    width: 84px;
  }
  .NZ_25px {
    background-position: 0 -3800px;
  }
  .OM_25px {
    background-position: 0 -3825px;
  }
  .PA_25px {
    background-position: 0 -3850px;
  }
  .PE_25px {
    background-position: 0 -3875px;
  }
  .PF_25px {
    background-position: 0 -3900px;
  }
  .PG_25px {
    background-position: 0 -3925px;
  }
  .PH_25px {
    background-position: 0 -3950px;
  }
  .PK_25px {
    background-position: 0 -3975px;
  }
  .PL_25px {
    background-position: 0 -4000px;
  }
  .PM_25px {
    background-position: 0 -4025px;
  }
  .PR_25px {
    background-position: 0 -4050px;
  }
  .PT_25px {
    background-position: 0 -4075px;
  }
  .PW_25px {
    background-position: 0 -4100px;
  }
  .PY_25px {
    background-position: 0 -4125px;
  }
  .QA_25px {
    background-position: 0 -4150px;
  }
  .RE_25px {
    background-position: 0 -4175px;
  }
  .RO_25px {
    background-position: 0 -4200px;
  }
  .RS_25px {
    background-position: 0 -4225px;
  }
  .RU_25px {
    background-position: 0 -4250px;
  }
  .RW_25px {
    background-position: 0 -4275px;
  }
  .SA_25px {
    background-position: 0 -4300px;
  }
  .SB_25px {
    background-position: 0 -4325px;
  }
  .SC_25px {
    background-position: 0 -4350px;
  }
  .SD_25px {
    background-position: 0 -4375px;
  }
  .SE_25px {
    background-position: 0 -4400px;
  }
  .SG_25px {
    background-position: 0 -4425px;
  }
  .SH_25px {
    background-position: 0 -4450px;
  }
  .SI_25px {
    background-position: 0 -4475px;
  }
  .SK_25px {
    background-position: 0 -4500px;
  }
  .SL_25px {
    background-position: 0 -4525px;
  }
  .SM_25px {
    background-position: 0 -4550px;
  }
  .SN_25px {
    background-position: 0 -4575px;
  }
  .SO_25px {
    background-position: 0 -4600px;
  }
  .SR_25px {
    background-position: 0 -4625px;
  }
  .SS_25px {
    background-position: 0 -4650px;
  }
  .SV_25px {
    background-position: 0 -4675px;
  }
  .SY_25px {
    background-position: 0 -4700px;
  }
  .SZ_25px {
    background-position: 0 -4725px;
  }
  .TC_25px {
    background-position: 0 -4750px;
  }
  .TD_25px {
    background-position: 0 -4775px;
  }
  .TF_25px {
    background-position: 0 -4800px;
  }
  .TG_25px {
    background-position: 0 -4825px;
  }
  .TH_25px {
    background-position: 0 -4850px;
  }
  .TJ_25px {
    background-position: 0 -4875px;
  }
  .TM_25px {
    background-position: 0 -4900px;
  }
  .TN_25px {
    background-position: 0 -4925px;
  }
  .TO_25px {
    background-position: 0 -4950px;
  }
  .TR_25px {
    background-position: 0 -4975px;
  }
  .TT_25px {
    background-position: 0 -5000px;
  }
  .TV_25px {
    background-position: 0 -5025px;
  }
  .TW_25px {
    background-position: 0 -5050px;
  }
  .TZ_25px {
    background-position: 0 -5075px;
  }
  .UA_25px {
    background-position: 0 -5100px;
  }
  .UFTTmf4ibWuxFlB3zG_8M,
        .vTejYh3eCvcK7lRihCOoE ._3sK-HIWLy1TBLAaqiMmfKP .UFTTmf4ibWuxFlB3zG_8M {
    color: #5c909b;
    padding-left: 0.5rem;
  }
  .UG_25px {
    background-position: 0 -5125px;
  }
  .US_25px {
    background-position: 0 -5150px;
  }
  .UY_25px {
    background-position: 0 -5175px;
  }
  .UZ_25px {
    background-position: 0 -5200px;
  }
  .VA_25px {
    background-position: 0 -5225px;
  }
  .VC_25px {
    background-position: 0 -5250px;
  }
  .VE_25px {
    background-position: 0 -5275px;
  }
  .VG_25px {
    background-position: 0 -5300px;
  }
  .VI_25px {
    background-position: 0 -5325px;
  }
  .VN_25px {
    background-position: 0 -5350px;
  }
  .VU_25px {
    background-position: 0 -5375px;
  }
  .WS_25px {
    background-position: 0 -5400px;
  }
  .X9C1UR7aKWoQ25ioe_o0t ._2M3sIExapNLIKikB_MGkZg {
    color: #666667;
  }
  .YE_25px {
    background-position: 0 -5425px;
  }
  .YT_25px {
    background-position: 0 -5450px;
  }
  .ZA_25px {
    background-position: 0 -5475px;
  }
  .ZM_25px {
    background-position: 0 -5500px;
  }
  .ZW_25px {
    background-position: 0 -5525px;
  }
  .bXEHHNudOC_AVXF1Z0Efi {
    font-size: large;
    font-weight: bolder;
    line-height: 1rem;
    text-align: left;
  }
  .btn-primary {
    background-color: #1ab22c;
    border-radius: 5px;
    color: white;
    cursor: pointer;
    font-size: 18px;
    font-weight: bold;
    letter-spacing: 1px;
    margin-top: 35.2px;
    outline: none;
    padding: 8.8px;
    transition: all 600ms cubic-bezier(0, 0.3, 0.7, 1);
  }
  .btn-primary:hover {
    background-color: #1ab22c;
    border-radius: 5px;
    color: white;
    cursor: pointer;
    font-size: 18px;
    font-weight: bold;
    letter-spacing: 1px;
    margin-top: 35.2px;
    outline: none;
    padding: 8.8px;
    transition: all 600ms cubic-bezier(0, 0.3, 0.7, 1);
  }
  .d67E1vMVN9hKY2RuJfvcF ._1SU_1l7NRE4_4HeO73a9cG {
    font-size: 22px;
    margin: 1.4rem 0 0.5rem 0;
    padding: 0 15px;
  }
  .d67E1vMVN9hKY2RuJfvcF ._2j4ceEmaxKgn_aEmbDEgfj {
    background-color: white !important;
    border: unset;
    color: black;
    cursor: pointer;
    font-size: 1.5rem !important;
    font-weight: 300;
    line-height: 1.6rem;
    margin: 0 !important;
    padding: 0 !important;
    position: absolute;
    right: 15px;
    top: 15px;
    width: unset !important;
  }
  .d67E1vMVN9hKY2RuJfvcF ._3ZGFbdHDkNghT28ondmIZp {
    font-size: 16px;
    margin-top: 8px;
    padding: 0 15px;
  }
  .d67E1vMVN9hKY2RuJfvcF .mI1bIfEooIJRvwVYblI1v {
    background-color: #ededed;
    height: 1px;
    width: 100%;
  }
  .eSNl_WwyPdan9T4mntWvG {
    -moz-user-select: none;
    -ms-user-select: none;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    align-items: center;
    border-bottom: 2px whitesmoke solid;
    cursor: pointer;
    display: flex;
    height: 80px;
    min-height: 50px;
    user-select: none;
  }
  .fk-youtube .fk-rm.image {
    -webkit-background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    height: 100%;
    position: absolute;
    width: 100%;
  }
  .fk-youtube .play-button {
    background-color: #333;
    border-radius: 6px;
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.6);
    height: 60px;
    opacity: 0.8;
    width: 90px;
    z-index: 1;
  }
  .fk-youtube .play-button:before {
    border-color: transparent transparent transparent #fff;
    border-style: solid;
    border-width: 15px 0 15px 26.0px;
    content: "";
  }
  .gXamJyQ_Wt9dYwaLd-sXA ._1s3P8BRVKw__qNAsZ1Z0MN ._1QwIr9xSNLO_m0AsBwv7Jf {
    background-color: whitesmoke;
    border-radius: 10px;
    height: 15px;
    margin-top: 20px;
    overflow: hidden;
    padding: 6px;
  }
  .gXamJyQ_Wt9dYwaLd-sXA ._1s3P8BRVKw__qNAsZ1Z0MN ._1QwIr9xSNLO_m0AsBwv7Jf ._1X8jpjsZ2yy88o_Aq7oD1F {
    -webkit-animation: _1In82js7Wmt2lS9HB6pZnL 1s linear infinite;
    animation: _1In82js7Wmt2lS9HB6pZnL 1s linear infinite;
    background-color: #1ab22c;
    background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);
    background-size: 40px 40px;
    border-radius: 10px;
    height: 100%;
    transition: all 2500ms cubic-bezier(0.2, 0.6, 0.6, 0.95);
  }
  .gXamJyQ_Wt9dYwaLd-sXA ._1s3P8BRVKw__qNAsZ1Z0MN ._2OjtxqxV7Z-E8Q2Y4a3mx6 {
    color: black;
    font-size: 16px;
    font-weight: bold;
  }
  .i59VT2R06KRH_suaW4_d5,
        ._3eBT-caf7Z2L7t3J6X2-j6 ._21ffV9cayPfHIkFdZ_XvWn._3mO11n1YFhXV5T_954uhx_.i59VT2R06KRH_suaW4_d5 {
    -webkit-animation: _2JOBaSB3lCNo6sPT0Z4IAx 0.4s ease;
    animation: _2JOBaSB3lCNo6sPT0Z4IAx 0.4s ease;
  }
  .image-gallery-bullets .image-gallery-bullet {
    padding: 2.7px;
  }
  .image-gallery-bullets .image-gallery-bullet.active {
    background: #fff;
  }
  .image-gallery-bullets .image-gallery-bullet:focus,
        .image-gallery-bullets .image-gallery-bullet:hover {
    background: #337ab7;
    transform: scale(1.1);
  }
  .image-gallery-bullets .image-gallery-bullets.scraped-container {
    margin: 0;
    padding: 0;
    text-align: center;
  }
  .image-gallery-slide .image-gallery-description {
    bottom: 45px;
    font-size: .8em;
    padding: 8px 15px;
  }
  .image-gallery-thumbnails-wrapper.left .image-gallery-thumbnails .image-gallery-thumbnail,
        .image-gallery-thumbnails-wrapper.right .image-gallery-thumbnails .image-gallery-thumbnail {
    display: block;
    margin-right: 0;
    padding: 0;
  }
  .image-gallery-thumbnails-wrapper.left .image-gallery-thumbnails,
        .image-gallery-thumbnails-wrapper.right .image-gallery-thumbnails {
    height: 100%;
    left: 0;
    padding: 0;
    position: absolute;
    top: 0;
    width: 100%;
  }
  .j7nw2156hcT8fjGrlqexr {
    display: flex;
    padding: 10px 0;
  }
  .main {
    background-color: whitesmoke;
  }
  .nXFIVse6Goo_SkQdzVsyt {
    background-color: white;
    margin: 8.8px 0;
    padding: 8.8px 0;
  }
  .ndhv3JBskvHN0dJtC7dpr {
    -webkit-animation: DNutUMIDhPFLy5hbNphJg 2s linear infinite;
    animation: DNutUMIDhPFLy5hbNphJg 2s linear infinite;
    bottom: 0;
    height: 100%;
    left: 0;
    margin: auto;
    position: absolute;
    right: 0;
    top: 0;
    transform-origin: center center;
    width: 100%;
  }
  .ndhv3JBskvHN0dJtC7dpr ._3J-1b0JUEHFIu3aHQiXY2m {
    -webkit-animation: UgX3W_HhivQrETKdD6X_c 1.5s ease-in-out infinite;
    animation: UgX3W_HhivQrETKdD6X_c 1.5s ease-in-out infinite;
    stroke: rgba(0, 0, 0, 0.2);
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
    stroke-linecap: round;
  }
  .oAPVXsJiQ_ivBy1znc2Gg,
        ._3eBT-caf7Z2L7t3J6X2-j6 ._21ffV9cayPfHIkFdZ_XvWn .oAPVXsJiQ_ivBy1znc2Gg {
    background-color: #1ab22c;
    border-color: #1ab22c;
  }
  .qsJPd_oEWG2lywXPD0a66 ._1-5wFy0rJNbLwXFG0xG4sa {
    background: #d8dce2;
    border-radius: 5px;
    font-size: 1.1rem;
    line-height: 1.25rem;
    padding: 0.5rem;
  }
  .qsJPd_oEWG2lywXPD0a66 ._2GJYv6Bk7-6qpy4rN_l5NJ {
    color: green;
    padding: 0.5rem;
  }
  .ufuTSZ5BObomevjoHGiLC .Fe58O0X7CwMwtwEMeV8iP {
    font-size: 12px;
  }
  .vTejYh3eCvcK7lRihCOoE ._27tk3yj6WZpa9R_3CyMVrr {
    align-items: flex-start;
    align-self: flex-start;
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    justify-content: flex-start;
    padding: 4px;
  }
  .vTejYh3eCvcK7lRihCOoE ._27tk3yj6WZpa9R_3CyMVrr ._2ajy_cAehVVryWZIXfCycW {
    border: 1px solid #666667;
    font-size: 0.9rem;
    height: 100%;
    margin-left: 8px;
    margin-top: 2px;
    padding: 6px;
    width: 25%;
  }
  .vTejYh3eCvcK7lRihCOoE ._2KRVLJzSq1J-7huwd3hAd7 {
    padding-left: 4px;
  }
  .vTejYh3eCvcK7lRihCOoE ._2nCLeYL5EZBblBAAOtOCuk {
    font-size: 1.2rem;
    font-weight: normal;
    line-height: 1.1rem;
    margin: 12px 0 14px;
    width: 100%;
  }
  .vTejYh3eCvcK7lRihCOoE ._2nCLeYL5EZBblBAAOtOCuk ._2jHpMojDwPNJGgSt60JlsE {
    padding-bottom: 8px;
  }
  .vTejYh3eCvcK7lRihCOoE ._2nCLeYL5EZBblBAAOtOCuk ._2veNj-PsWe3wKXWQUYXXMZ {
    padding-left: 6px;
    width: 100%;
  }
  .vTejYh3eCvcK7lRihCOoE ._2zZXxl2dDQvKEhLTIAVk9m {
    font-size: 1.2rem;
  }
  .vTejYh3eCvcK7lRihCOoE ._3EgFLmBMjjTqYjBAUwxjhe {
    align-items: flex-start;
    display: flex;
    justify-content: flex-start;
    padding: 0 8px;
  }
  .vTejYh3eCvcK7lRihCOoE ._3eZE4T4NMF2tId8u7cCv50 {
    color: #06a015;
    font-size: 1rem;
    font-weight: bold;
  }
  .vhClywwBOSDOuuTFKr8YP {
    background-color: #000000;
    color: white;
  }
  .xvxeQN82BJ2CYoJBUxuuA .AD_56px {
    background-position: 0 0px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .AE_56px {
    background-position: 0 -56px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .AF_56px {
    background-position: 0 -112px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .AG_56px {
    background-position: 0 -168px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .AI_56px {
    background-position: 0 -224px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .AL_56px {
    background-position: 0 -280px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .AM_56px {
    background-position: 0 -336px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .AO_56px {
    background-position: 0 -392px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .AR_56px {
    background-position: 0 -448px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .AS_56px {
    background-position: 0 -504px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .AT_56px {
    background-position: 0 -560px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .AU_56px {
    background-position: 0 -616px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .AW_56px {
    background-position: 0 -672px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .AX_56px {
    background-position: 0 -728px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .AZ_56px {
    background-position: 0 -784px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .BA_56px {
    background-position: 0 -840px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .BB_56px {
    background-position: 0 -896px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .BD_56px {
    background-position: 0 -952px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .BE_56px {
    background-position: 0 -1008px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .BF_56px {
    background-position: 0 -1064px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .BG_56px {
    background-position: 0 -1120px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .BH_56px {
    background-position: 0 -1176px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .BI_56px {
    background-position: 0 -1232px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .BJ_56px {
    background-position: 0 -1288px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .BM_56px {
    background-position: 0 -1344px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .BN_56px {
    background-position: 0 -1400px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .BO_56px {
    background-position: 0 -1456px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .BR_56px {
    background-position: 0 -1512px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .BS_56px {
    background-position: 0 -1568px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .BT_56px {
    background-position: 0 -1624px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .BW_56px {
    background-position: 0 -1680px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .BY_56px {
    background-position: 0 -1736px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .BZ_56px {
    background-position: 0 -1792px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .CA_56px {
    background-position: 0 -1848px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .CC_56px {
    background-position: 0 -1904px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .CD_56px {
    background-position: 0 -1960px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .CF_56px {
    background-position: 0 -2016px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .CG_56px {
    background-position: 0 -2072px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .CH_56px {
    background-position: 0 -2128px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .CL_56px {
    background-position: 0 -2184px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .CM_56px {
    background-position: 0 -2240px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .CN_56px {
    background-position: 0 -2296px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .CO_56px {
    background-position: 0 -2352px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .CR_56px {
    background-position: 0 -2408px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .CU_56px {
    background-position: 0 -2464px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .CV_56px {
    background-position: 0 -2520px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .CX_56px {
    background-position: 0 -2576px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .CY_56px {
    background-position: 0 -2632px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .CZ_56px {
    background-position: 0 -2688px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .DE_56px {
    background-position: 0 -2744px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .DJ_56px {
    background-position: 0 -2800px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .DK_56px {
    background-position: 0 -2856px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .DM_56px {
    background-position: 0 -2912px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .DO_56px {
    background-position: 0 -2968px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .DZ_56px {
    background-position: 0 -3024px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .EC_56px {
    background-position: 0 -3080px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .EE_56px {
    background-position: 0 -3136px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .EG_56px {
    background-position: 0 -3192px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .EH_56px {
    background-position: 0 -3248px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .ER_56px {
    background-position: 0 -3304px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .ES_56px {
    background-position: 0 -3360px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .ET_56px {
    background-position: 0 -3416px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .FI_56px {
    background-position: 0 -3472px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .FJ_56px {
    background-position: 0 -3528px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .FK_56px {
    background-position: 0 -3584px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .FM_56px {
    background-position: 0 -3640px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .FO_56px {
    background-position: 0 -3696px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .FR_56px {
    background-position: 0 -3752px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .GA_56px {
    background-position: 0 -3808px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .GB_56px {
    background-position: 0 -3864px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .GD_56px {
    background-position: 0 -3920px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .GE_56px {
    background-position: 0 -3976px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .GF_56px {
    background-position: 0 -4032px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .GH_56px {
    background-position: 0 -4088px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .GI_56px {
    background-position: 0 -4144px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .GL_56px {
    background-position: 0 -4200px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .GM_56px {
    background-position: 0 -4256px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .GN_56px {
    background-position: 0 -4312px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .GP_56px {
    background-position: 0 -4368px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .GQ_56px {
    background-position: 0 -4424px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .GR_56px {
    background-position: 0 -4480px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .GT_56px {
    background-position: 0 -4536px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .GW_56px {
    background-position: 0 -4592px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .GY_56px {
    background-position: 0 -4648px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .HK_56px {
    background-position: 0 -4704px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .HN_56px {
    background-position: 0 -4760px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .HR_56px {
    background-position: 0 -4816px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .HT_56px {
    background-position: 0 -4872px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .HU_56px {
    background-position: 0 -4928px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .IE_56px {
    background-position: 0 -4984px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .IL_56px {
    background-position: 0 -5040px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .IM_56px {
    background-position: 0 -5096px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .IN_56px {
    background-position: 0 -5152px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .IO_56px {
    background-position: 0 -5208px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .IQ_56px {
    background-position: 0 -5264px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .IR_56px {
    background-position: 0 -5320px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .IS_56px {
    background-position: 0 -5376px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .IT_56px {
    background-position: 0 -5432px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .JE_56px {
    background-position: 0 -5488px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .JM_56px {
    background-position: 0 -5544px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .JO_56px {
    background-position: 0 -5600px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .JP_56px {
    background-position: 0 -5656px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .KE_56px {
    background-position: 0 -5712px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .KG_56px {
    background-position: 0 -5768px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .KH_56px {
    background-position: 0 -5824px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .KI_56px {
    background-position: 0 -5880px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .KM_56px {
    background-position: 0 -5936px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .KN_56px {
    background-position: 0 -5992px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .KP_56px {
    background-position: 0 -6048px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .KR_56px {
    background-position: 0 -6104px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .KW_56px {
    background-position: 0 -6160px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .KY_56px {
    background-position: 0 -6216px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .KZ_56px {
    background-position: 0 -6272px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .LA_56px {
    background-position: 0 -6328px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .LB_56px {
    background-position: 0 -6384px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .LC_56px {
    background-position: 0 -6440px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .LI_56px {
    background-position: 0 -6496px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .LK_56px {
    background-position: 0 -6552px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .LR_56px {
    background-position: 0 -6608px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .LS_56px {
    background-position: 0 -6664px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .LT_56px {
    background-position: 0 -6720px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .LU_56px {
    background-position: 0 -6776px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .LV_56px {
    background-position: 0 -6832px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .LY_56px {
    background-position: 0 -6888px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MA_56px {
    background-position: 0 -6944px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MC_56px {
    background-position: 0 -7000px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MD_56px {
    background-position: 0 -7056px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MG_56px {
    background-position: 0 -7112px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MH_56px {
    background-position: 0 -7168px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MK_56px {
    background-position: 0 -7224px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .ML_56px {
    background-position: 0 -7280px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MM_56px {
    background-position: 0 -7336px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MN_56px {
    background-position: 0 -7392px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MP_56px {
    background-position: 0 -7448px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MQ_56px {
    background-position: 0 -7504px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MR_56px {
    background-position: 0 -7560px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MS_56px {
    background-position: 0 -7616px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MT_56px {
    background-position: 0 -7672px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MU_56px {
    background-position: 0 -7728px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MV_56px {
    background-position: 0 -7784px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MW_56px {
    background-position: 0 -7840px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MX_56px {
    background-position: 0 -7896px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MY_56px {
    background-position: 0 -7952px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MZ_56px {
    background-position: 0 -8008px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .NA_56px {
    background-position: 0 -8064px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .NE_56px {
    background-position: 0 -8120px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .NG_56px {
    background-position: 0 -8176px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .NI_56px {
    background-position: 0 -8232px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .NL_56px {
    background-position: 0 -8288px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .NO_56px {
    background-position: 0 -8344px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .NP_56px {
    background-position: 0 -8400px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .NR_56px {
    background-position: 0 -8456px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .NZ_56px {
    background-position: 0 -8512px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .OM_56px {
    background-position: 0 -8568px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .PA_56px {
    background-position: 0 -8624px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .PE_56px {
    background-position: 0 -8680px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .PF_56px {
    background-position: 0 -8736px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .PG_56px {
    background-position: 0 -8792px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .PH_56px {
    background-position: 0 -8848px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .PK_56px {
    background-position: 0 -8904px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .PL_56px {
    background-position: 0 -8960px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .PM_56px {
    background-position: 0 -9016px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .PR_56px {
    background-position: 0 -9072px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .PT_56px {
    background-position: 0 -9128px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .PW_56px {
    background-position: 0 -9184px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .PY_56px {
    background-position: 0 -9240px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .QA_56px {
    background-position: 0 -9296px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .RE_56px {
    background-position: 0 -9352px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .RO_56px {
    background-position: 0 -9408px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .RS_56px {
    background-position: 0 -9464px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .RU_56px {
    background-position: 0 -9520px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .RW_56px {
    background-position: 0 -9576px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .SA_56px {
    background-position: 0 -9632px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .SB_56px {
    background-position: 0 -9688px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .SC_56px {
    background-position: 0 -9744px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .SD_56px {
    background-position: 0 -9800px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .SE_56px {
    background-position: 0 -9856px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .SG_56px {
    background-position: 0 -9912px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .SH_56px {
    background-position: 0 -9968px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .SI_56px {
    background-position: 0 -10024px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .SK_56px {
    background-position: 0 -10080px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .SL_56px {
    background-position: 0 -10136px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .SM_56px {
    background-position: 0 -10192px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .SN_56px {
    background-position: 0 -10248px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .SO_56px {
    background-position: 0 -10304px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .SR_56px {
    background-position: 0 -10360px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .SS_56px {
    background-position: 0 -10416px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .SV_56px {
    background-position: 0 -10472px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .SY_56px {
    background-position: 0 -10528px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .SZ_56px {
    background-position: 0 -10584px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .TC_56px {
    background-position: 0 -10640px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .TD_56px {
    background-position: 0 -10696px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .TF_56px {
    background-position: 0 -10752px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .TG_56px {
    background-position: 0 -10808px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .TH_56px {
    background-position: 0 -10864px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .TJ_56px {
    background-position: 0 -10920px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .TM_56px {
    background-position: 0 -10976px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .TN_56px {
    background-position: 0 -11032px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .TO_56px {
    background-position: 0 -11088px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .TR_56px {
    background-position: 0 -11144px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .TT_56px {
    background-position: 0 -11200px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .TV_56px {
    background-position: 0 -11256px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .TW_56px {
    background-position: 0 -11312px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .TZ_56px {
    background-position: 0 -11368px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .UA_56px {
    background-position: 0 -11424px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .UG_56px {
    background-position: 0 -11480px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .US_56px {
    background-position: 0 -11536px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .UY_56px {
    background-position: 0 -11592px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .UZ_56px {
    background-position: 0 -11648px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .VA_56px {
    background-position: 0 -11704px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .VC_56px {
    background-position: 0 -11760px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .VE_56px {
    background-position: 0 -11816px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .VG_56px {
    background-position: 0 -11872px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .VI_56px {
    background-position: 0 -11928px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .VN_56px {
    background-position: 0 -11984px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .VU_56px {
    background-position: 0 -12040px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .WS_56px {
    background-position: 0 -12096px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .YE_56px {
    background-position: 0 -12152px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .YT_56px {
    background-position: 0 -12208px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .ZA_56px {
    background-position: 0 -12264px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .ZM_56px {
    background-position: 0 -12320px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .ZW_56px {
    background-position: 0 -12376px;
  }
  .y7Lxdef35rl_xZd88Xven {
    color: #90949c;
    padding-left: 0.2rem;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .AD_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .AD_25px {
    background-position: 0 0px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .AE_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .AE_25px {
    background-position: 0 -25px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .AF_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .AF_25px {
    background-position: 0 -50px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .AG_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .AG_25px {
    background-position: 0 -75px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .AI_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .AI_25px {
    background-position: 0 -100px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .AL_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .AL_25px {
    background-position: 0 -125px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .AM_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .AM_25px {
    background-position: 0 -150px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .AO_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .AO_25px {
    background-position: 0 -175px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .AR_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .AR_25px {
    background-position: 0 -200px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .AS_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .AS_25px {
    background-position: 0 -225px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .AT_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .AT_25px {
    background-position: 0 -250px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .AU_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .AU_25px {
    background-position: 0 -275px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .AW_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .AW_25px {
    background-position: 0 -300px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .AX_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .AX_25px {
    background-position: 0 -325px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .AZ_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .AZ_25px {
    background-position: 0 -350px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .BA_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .BA_25px {
    background-position: 0 -375px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .BB_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .BB_25px {
    background-position: 0 -400px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .BD_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .BD_25px {
    background-position: 0 -425px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .BE_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .BE_25px {
    background-position: 0 -450px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .BF_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .BF_25px {
    background-position: 0 -475px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .BG_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .BG_25px {
    background-position: 0 -500px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .BH_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .BH_25px {
    background-position: 0 -525px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .BI_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .BI_25px {
    background-position: 0 -550px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .BJ_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .BJ_25px {
    background-position: 0 -575px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .BM_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .BM_25px {
    background-position: 0 -600px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .BN_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .BN_25px {
    background-position: 0 -625px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .BO_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .BO_25px {
    background-position: 0 -650px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .BR_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .BR_25px {
    background-position: 0 -675px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .BS_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .BS_25px {
    background-position: 0 -700px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .BT_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .BT_25px {
    background-position: 0 -725px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .BW_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .BW_25px {
    background-position: 0 -750px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .BY_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .BY_25px {
    background-position: 0 -775px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .BZ_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .BZ_25px {
    background-position: 0 -800px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .CA_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .CA_25px {
    background-position: 0 -825px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .CC_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .CC_25px {
    background-position: 0 -850px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .CD_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .CD_25px {
    background-position: 0 -875px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .CF_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .CF_25px {
    background-position: 0 -900px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .CG_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .CG_25px {
    background-position: 0 -925px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .CH_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .CH_25px {
    background-position: 0 -950px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .CL_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .CL_25px {
    background-position: 0 -975px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .CM_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .CM_25px {
    background-position: 0 -1000px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .CN_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .CN_25px {
    background-position: 0 -1025px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .CO_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .CO_25px {
    background-position: 0 -1050px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .CR_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .CR_25px {
    background-position: 0 -1075px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .CU_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .CU_25px {
    background-position: 0 -1100px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .CV_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .CV_25px {
    background-position: 0 -1125px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .CX_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .CX_25px {
    background-position: 0 -1150px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .CY_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .CY_25px {
    background-position: 0 -1175px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .CZ_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .CZ_25px {
    background-position: 0 -1200px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .DE_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .DE_25px {
    background-position: 0 -1225px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .DJ_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .DJ_25px {
    background-position: 0 -1250px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .DK_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .DK_25px {
    background-position: 0 -1275px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .DM_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .DM_25px {
    background-position: 0 -1300px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .DO_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .DO_25px {
    background-position: 0 -1325px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .DZ_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .DZ_25px {
    background-position: 0 -1350px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .EC_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .EC_25px {
    background-position: 0 -1375px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .EE_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .EE_25px {
    background-position: 0 -1400px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .EG_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .EG_25px {
    background-position: 0 -1425px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .EH_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .EH_25px {
    background-position: 0 -1450px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .ER_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .ER_25px {
    background-position: 0 -1475px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .ES_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .ES_25px {
    background-position: 0 -1500px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .ET_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .ET_25px {
    background-position: 0 -1525px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .FI_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .FI_25px {
    background-position: 0 -1550px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .FJ_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .FJ_25px {
    background-position: 0 -1575px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .FK_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .FK_25px {
    background-position: 0 -1600px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .FM_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .FM_25px {
    background-position: 0 -1625px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .FO_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .FO_25px {
    background-position: 0 -1650px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .FR_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .FR_25px {
    background-position: 0 -1675px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .GA_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .GA_25px {
    background-position: 0 -1700px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .GB_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .GB_25px {
    background-position: 0 -1725px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .GD_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .GD_25px {
    background-position: 0 -1750px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .GE_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .GE_25px {
    background-position: 0 -1775px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .GF_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .GF_25px {
    background-position: 0 -1800px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .GH_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .GH_25px {
    background-position: 0 -1825px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .GI_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .GI_25px {
    background-position: 0 -1850px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .GL_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .GL_25px {
    background-position: 0 -1875px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .GM_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .GM_25px {
    background-position: 0 -1900px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .GN_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .GN_25px {
    background-position: 0 -1925px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .GP_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .GP_25px {
    background-position: 0 -1950px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .GQ_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .GQ_25px {
    background-position: 0 -1975px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .GR_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .GR_25px {
    background-position: 0 -2000px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .GT_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .GT_25px {
    background-position: 0 -2025px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .GW_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .GW_25px {
    background-position: 0 -2050px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .GY_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .GY_25px {
    background-position: 0 -2075px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .HK_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .HK_25px {
    background-position: 0 -2100px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .HN_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .HN_25px {
    background-position: 0 -2125px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .HR_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .HR_25px {
    background-position: 0 -2150px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .HT_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .HT_25px {
    background-position: 0 -2175px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .HU_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .HU_25px {
    background-position: 0 -2200px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .IE_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .IE_25px {
    background-position: 0 -2225px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .IL_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .IL_25px {
    background-position: 0 -2250px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .IM_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .IM_25px {
    background-position: 0 -2275px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .IN_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .IN_25px {
    background-position: 0 -2300px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .IO_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .IO_25px {
    background-position: 0 -2325px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .IQ_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .IQ_25px {
    background-position: 0 -2350px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .IR_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .IR_25px {
    background-position: 0 -2375px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .IS_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .IS_25px {
    background-position: 0 -2400px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .IT_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .IT_25px {
    background-position: 0 -2425px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .JE_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .JE_25px {
    background-position: 0 -2450px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .JM_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .JM_25px {
    background-position: 0 -2475px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .JO_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .JO_25px {
    background-position: 0 -2500px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .JP_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .JP_25px {
    background-position: 0 -2525px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .KE_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .KE_25px {
    background-position: 0 -2550px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .KG_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .KG_25px {
    background-position: 0 -2575px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .KH_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .KH_25px {
    background-position: 0 -2600px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .KI_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .KI_25px {
    background-position: 0 -2625px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .KM_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .KM_25px {
    background-position: 0 -2650px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .KN_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .KN_25px {
    background-position: 0 -2675px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .KP_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .KP_25px {
    background-position: 0 -2700px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .KR_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .KR_25px {
    background-position: 0 -2725px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .KW_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .KW_25px {
    background-position: 0 -2750px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .KY_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .KY_25px {
    background-position: 0 -2775px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .KZ_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .KZ_25px {
    background-position: 0 -2800px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .LA_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .LA_25px {
    background-position: 0 -2825px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .LB_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .LB_25px {
    background-position: 0 -2850px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .LC_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .LC_25px {
    background-position: 0 -2875px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .LI_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .LI_25px {
    background-position: 0 -2900px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .LK_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .LK_25px {
    background-position: 0 -2925px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .LR_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .LR_25px {
    background-position: 0 -2950px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .LS_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .LS_25px {
    background-position: 0 -2975px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .LT_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .LT_25px {
    background-position: 0 -3000px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .LU_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .LU_25px {
    background-position: 0 -3025px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .LV_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .LV_25px {
    background-position: 0 -3050px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .LY_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .LY_25px {
    background-position: 0 -3075px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MA_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MA_25px {
    background-position: 0 -3100px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MC_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MC_25px {
    background-position: 0 -3125px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MD_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MD_25px {
    background-position: 0 -3150px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MG_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MG_25px {
    background-position: 0 -3175px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MH_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MH_25px {
    background-position: 0 -3200px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MK_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MK_25px {
    background-position: 0 -3225px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .ML_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .ML_25px {
    background-position: 0 -3250px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MM_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MM_25px {
    background-position: 0 -3275px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MN_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MN_25px {
    background-position: 0 -3300px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MP_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MP_25px {
    background-position: 0 -3325px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MQ_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MQ_25px {
    background-position: 0 -3350px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MR_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MR_25px {
    background-position: 0 -3375px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MS_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MS_25px {
    background-position: 0 -3400px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MT_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MT_25px {
    background-position: 0 -3425px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MU_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MU_25px {
    background-position: 0 -3450px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MV_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MV_25px {
    background-position: 0 -3475px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MW_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MW_25px {
    background-position: 0 -3500px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MX_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MX_25px {
    background-position: 0 -3525px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MY_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MY_25px {
    background-position: 0 -3550px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MZ_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MZ_25px {
    background-position: 0 -3575px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .NA_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .NA_25px {
    background-position: 0 -3600px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .NE_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .NE_25px {
    background-position: 0 -3625px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .NG_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .NG_25px {
    background-position: 0 -3650px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .NI_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .NI_25px {
    background-position: 0 -3675px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .NL_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .NL_25px {
    background-position: 0 -3700px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .NO_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .NO_25px {
    background-position: 0 -3725px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .NP_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .NP_25px {
    background-position: 0 -3750px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .NR_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .NR_25px {
    background-position: 0 -3775px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .NZ_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .NZ_25px {
    background-position: 0 -3800px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .OM_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .OM_25px {
    background-position: 0 -3825px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .PA_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .PA_25px {
    background-position: 0 -3850px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .PE_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .PE_25px {
    background-position: 0 -3875px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .PF_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .PF_25px {
    background-position: 0 -3900px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .PG_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .PG_25px {
    background-position: 0 -3925px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .PH_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .PH_25px {
    background-position: 0 -3950px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .PK_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .PK_25px {
    background-position: 0 -3975px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .PL_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .PL_25px {
    background-position: 0 -4000px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .PM_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .PM_25px {
    background-position: 0 -4025px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .PR_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .PR_25px {
    background-position: 0 -4050px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .PT_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .PT_25px {
    background-position: 0 -4075px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .PW_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .PW_25px {
    background-position: 0 -4100px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .PY_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .PY_25px {
    background-position: 0 -4125px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .QA_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .QA_25px {
    background-position: 0 -4150px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .RE_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .RE_25px {
    background-position: 0 -4175px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .RO_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .RO_25px {
    background-position: 0 -4200px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .RS_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .RS_25px {
    background-position: 0 -4225px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .RU_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .RU_25px {
    background-position: 0 -4250px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .RW_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .RW_25px {
    background-position: 0 -4275px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .SA_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .SA_25px {
    background-position: 0 -4300px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .SB_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .SB_25px {
    background-position: 0 -4325px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .SC_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .SC_25px {
    background-position: 0 -4350px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .SD_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .SD_25px {
    background-position: 0 -4375px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .SE_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .SE_25px {
    background-position: 0 -4400px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .SG_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .SG_25px {
    background-position: 0 -4425px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .SH_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .SH_25px {
    background-position: 0 -4450px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .SI_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .SI_25px {
    background-position: 0 -4475px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .SK_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .SK_25px {
    background-position: 0 -4500px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .SL_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .SL_25px {
    background-position: 0 -4525px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .SM_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .SM_25px {
    background-position: 0 -4550px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .SN_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .SN_25px {
    background-position: 0 -4575px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .SO_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .SO_25px {
    background-position: 0 -4600px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .SR_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .SR_25px {
    background-position: 0 -4625px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .SS_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .SS_25px {
    background-position: 0 -4650px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .SV_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .SV_25px {
    background-position: 0 -4675px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .SY_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .SY_25px {
    background-position: 0 -4700px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .SZ_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .SZ_25px {
    background-position: 0 -4725px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .TC_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .TC_25px {
    background-position: 0 -4750px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .TD_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .TD_25px {
    background-position: 0 -4775px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .TF_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .TF_25px {
    background-position: 0 -4800px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .TG_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .TG_25px {
    background-position: 0 -4825px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .TH_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .TH_25px {
    background-position: 0 -4850px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .TJ_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .TJ_25px {
    background-position: 0 -4875px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .TM_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .TM_25px {
    background-position: 0 -4900px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .TN_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .TN_25px {
    background-position: 0 -4925px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .TO_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .TO_25px {
    background-position: 0 -4950px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .TR_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .TR_25px {
    background-position: 0 -4975px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .TT_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .TT_25px {
    background-position: 0 -5000px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .TV_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .TV_25px {
    background-position: 0 -5025px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .TW_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .TW_25px {
    background-position: 0 -5050px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .TZ_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .TZ_25px {
    background-position: 0 -5075px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .UA_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .UA_25px {
    background-position: 0 -5100px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .UG_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .UG_25px {
    background-position: 0 -5125px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .US_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .US_25px {
    background-position: 0 -5150px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .UY_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .UY_25px {
    background-position: 0 -5175px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .UZ_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .UZ_25px {
    background-position: 0 -5200px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .VA_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .VA_25px {
    background-position: 0 -5225px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .VC_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .VC_25px {
    background-position: 0 -5250px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .VE_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .VE_25px {
    background-position: 0 -5275px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .VG_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .VG_25px {
    background-position: 0 -5300px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .VI_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .VI_25px {
    background-position: 0 -5325px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .VN_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .VN_25px {
    background-position: 0 -5350px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .VU_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .VU_25px {
    background-position: 0 -5375px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .VrvZWTU4wpGJwxeTzir79,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .VrvZWTU4wpGJwxeTzir79 {
    color: #666667;
    margin-left: auto;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .WS_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .WS_25px {
    background-position: 0 -5400px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .YE_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .YE_25px {
    background-position: 0 -5425px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .YT_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .YT_25px {
    background-position: 0 -5450px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .ZA_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .ZA_25px {
    background-position: 0 -5475px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .ZM_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .ZM_25px {
    background-position: 0 -5500px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .ZW_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .ZW_25px {
    background-position: 0 -5525px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd ._11QU_BIqESitk6Tryg9hVJ,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd ._11QU_BIqESitk6Tryg9hVJ {
    background-image: url('https://checkout.clarifion.com//champflxbnzet1upsell/img/flag_sprite.png');
    background-repeat: no-repeat;
    background-size: 100%;
    display: inline-block;
    height: 25px;
    width: 25px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd {
    align-items: center;
    background-color: white;
    cursor: pointer;
    display: flex;
    height: 55px;
    padding: 0 20px;
  }
  .yBiQ1tylQlUl3F4-r4bTi,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf {
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 3px 30px rgba(0, 0, 0, 0.3);
    height: 220px;
    overflow: hidden;
    overflow-y: scroll;
    position: absolute;
    top: 72px;
    width: 100%;
    z-index: 10000;
  }
  .yotpo-close-modal.yotpo-icon-btn-small .yotpo-icon.yotpo-icon-cross {
    background: red !important;
    border: 2px solid black !important;
    border-radius: 5px !important;
    box-sizing: border-box !important;
    color: white !important;
  }
```

### J. All Static Text Content (from HTML)

  `#fkt-link-82c-ea0-9be` (a): `NO, THANKS. I’ll just buy this at regular price next time.
                     `
  `#ifrfi` (span): `Copyright (c) 2024 Clarifion`
  `#iqapq` (h1): `Wait! Here’s another way to clean your
                                air`
  `#iwjle` (button): `YES! Add 3 ODRx devices to my
                            order for only
       `
  `#pageDataScript` (script): `var pageData = { "pageViewReferenceId": "ba396fab-5447-4574-ac46-c966a112cd72", `
  `#reject-upsell` (div): `NO, THANKS. I’ll just buy this at regular price next time.
                     `

### K. JavaScript Template Texts

- `); // Step 2: Confirm payment with Stripe.js console.log(`
- `); e.preventDefault(); orderSummary.classList.toggle(`
- `); orderSummary.classList.toggle(`
- `); orders.unshift(order); localStorage.setItem(`
- `); updateOrderStatus(order.id,`
- `, JSON.stringify(orders)); console.log(`
- `, currencyCode); // Create order draft BEFORE payment processing console.log(`
- `, error); // Update order status to failed updateOrderStatus(order.id,`
- `, foundDiscount); appliedDiscountCode = foundDiscount; setTimeout(() => { syncOrderSummaryWithProduc`
- `, orderId); } catch (error) { console.error(`
- `.order-applied-discount-remove`
- `.order-discount-code-button`
- `.order-discount-code-input`
- `.order-summary-body`
- `.order-summary-header`
- `; // Order Item bodyHTML +=`
- `; productRow.style.borderLeft =`
- `; r.style.borderLeft =`
- `; row.style.borderColor =`
- `; row.style.borderLeft =`

---

## Clarifion OTO3 (upsell-oto3-clarifion.html)

- **File size**: 603,881 bytes | **Custom CSS**: 232,227 bytes
- **Timer**: None
- **ID rules**: 7 | **Class rules**: 804 | **Keyframes**: 8

### A. Interrupt Header

**ID**: `#i4sel` | **Tag**: `<h1>` | **Text**: `Wait! Wait!`

**ID**: `#ixdbk` | **Tag**: `<p>` | **Text**: `Wait!`

### B. Countdown Timer

_No countdown timer_

### C. Headlines

**<h1>** `Wait! Wait!`

**<h2>** `** Please do not close this page. **`

**<h2>** `Don’t need 3
                                odor-busting devices?`

### D. CTA Button

**Text**: `YES! Add 1 ODRx device for only
                            $39.97`
**Tag**: `<button>` | **ID**: `#iwjle`

**CTA Class Styles:**
`.btn-primary`:
```css
  background-color: #1ab22c;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 1px;
  margin-top: 35.2px;
  outline: none;
  padding: 8.8px;
  transition: all 600ms cubic-bezier(0, 0.3, 0.7, 1);
```

`.btn-primary:hover`:
```css
  background-color: #1ab22c;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 1px;
  margin-top: 35.2px;
  outline: none;
  padding: 8.8px;
  transition: all 600ms cubic-bezier(0, 0.3, 0.7, 1);
```

`.fk-youtube .play-button`:
```css
  background-color: #333;
  border-radius: 6px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.6);
  height: 60px;
  opacity: 0.8;
  width: 90px;
  z-index: 1;
```

`.yotpo-close-modal.yotpo-icon-btn-small .yotpo-icon.yotpo-icon-cross`:
```css
  background: red !important;
  border: 2px solid black !important;
  border-radius: 5px !important;
  box-sizing: border-box !important;
  color: white !important;
```

### E. Opt-Out (Negative Option)

_No opt-out found_

### F. Price Elements

_No price-specific CSS found (prices rendered via JS)_

### G. Guarantee

_No guarantee found_

### H. Key ID-Based CSS (Conversion-Relevant)

```css
  #bodyElementDummy {
    display: none;
  }
  #fkt-image-045-88a-a45 {
    height: 150px;
    width: 150px;
  }
  #fkt-image-4cb-3af-952 {
    height: auto;
    width: auto !important;
  }
  #fkt-image-de4-389-977 {
    height: 50px;
    width: 200px;
  }
  #i0mqg {
    margin-top: 10px;
  }
  #i4sel {
    font-weight: 700;
  }
```

### I. Key Class-Based CSS

```css
  .AD_25px {
    background-position: 0 0px;
  }
  .AE_25px {
    background-position: 0 -25px;
  }
  .AF_25px {
    background-position: 0 -50px;
  }
  .AG_25px {
    background-position: 0 -75px;
  }
  .AI_25px {
    background-position: 0 -100px;
  }
  .AIs6iEbf9UqkqPBo2ltj_,
        .vTejYh3eCvcK7lRihCOoE ._2nCLeYL5EZBblBAAOtOCuk .AIs6iEbf9UqkqPBo2ltj_ {
    border-radius: 3px;
    display: flex;
    margin-top: 0.4rem;
    padding: 10px;
    width: 90%;
  }
  .AIs6iEbf9UqkqPBo2ltj_._2DFz4-s4Ae8O4NaBK9mzmC,
        .vTejYh3eCvcK7lRihCOoE ._2nCLeYL5EZBblBAAOtOCuk .AIs6iEbf9UqkqPBo2ltj_._2DFz4-s4Ae8O4NaBK9mzmC {
    background-color: #f4f4f4;
  }
  .AL_25px {
    background-position: 0 -125px;
  }
  .AM_25px {
    background-position: 0 -150px;
  }
  .AO_25px {
    background-position: 0 -175px;
  }
  .AR_25px {
    background-position: 0 -200px;
  }
  .AS_25px {
    background-position: 0 -225px;
  }
  .AT_25px {
    background-position: 0 -250px;
  }
  .AU_25px {
    background-position: 0 -275px;
  }
  .AW_25px {
    background-position: 0 -300px;
  }
  .AX_25px {
    background-position: 0 -325px;
  }
  .AZ_25px {
    background-position: 0 -350px;
  }
  .BA_25px {
    background-position: 0 -375px;
  }
  .BB_25px {
    background-position: 0 -400px;
  }
  .BD_25px {
    background-position: 0 -425px;
  }
  .BE_25px {
    background-position: 0 -450px;
  }
  .BF_25px {
    background-position: 0 -475px;
  }
  .BG_25px {
    background-position: 0 -500px;
  }
  .BH_25px {
    background-position: 0 -525px;
  }
  .BI_25px {
    background-position: 0 -550px;
  }
  .BJ_25px {
    background-position: 0 -575px;
  }
  .BM_25px {
    background-position: 0 -600px;
  }
  .BN_25px {
    background-position: 0 -625px;
  }
  .BO_25px {
    background-position: 0 -650px;
  }
  .BR_25px {
    background-position: 0 -675px;
  }
  .BS_25px {
    background-position: 0 -700px;
  }
  .BT_25px {
    background-position: 0 -725px;
  }
  .BW_25px {
    background-position: 0 -750px;
  }
  .BY_25px {
    background-position: 0 -775px;
  }
  .BZ_25px {
    background-position: 0 -800px;
  }
  .CA_25px {
    background-position: 0 -825px;
  }
  .CBiOYQVFHfGbez1vPW5Eu {
    background-color: #323232;
    color: white;
  }
  .CC_25px {
    background-position: 0 -850px;
  }
  .CD_25px {
    background-position: 0 -875px;
  }
  .CF_25px {
    background-position: 0 -900px;
  }
  .CG_25px {
    background-position: 0 -925px;
  }
  .CH_25px {
    background-position: 0 -950px;
  }
  .CL_25px {
    background-position: 0 -975px;
  }
  .CM_25px {
    background-position: 0 -1000px;
  }
  .CN_25px {
    background-position: 0 -1025px;
  }
  .CO_25px {
    background-position: 0 -1050px;
  }
  .CR_25px {
    background-position: 0 -1075px;
  }
  .CU_25px {
    background-position: 0 -1100px;
  }
  .CV_25px {
    background-position: 0 -1125px;
  }
  .CX_25px {
    background-position: 0 -1150px;
  }
  .CY_25px {
    background-position: 0 -1175px;
  }
  .CZ_25px {
    background-position: 0 -1200px;
  }
  .DE_25px {
    background-position: 0 -1225px;
  }
  .DJ_25px {
    background-position: 0 -1250px;
  }
  .DK_25px {
    background-position: 0 -1275px;
  }
  .DM_25px {
    background-position: 0 -1300px;
  }
  .DO_25px {
    background-position: 0 -1325px;
  }
  .DZ_25px {
    background-position: 0 -1350px;
  }
  .EC_25px {
    background-position: 0 -1375px;
  }
  .EE_25px {
    background-position: 0 -1400px;
  }
  .EG_25px {
    background-position: 0 -1425px;
  }
  .EH_25px {
    background-position: 0 -1450px;
  }
  .ER_25px {
    background-position: 0 -1475px;
  }
  .ERxklc1DEy6MRbHq8F_oL ._3qG_M93hEacQkijHPJkGp3 {
    align-items: center;
    background-color: #323232;
    border: 2px solid rgba(40, 40, 80, 0.3);
    border-radius: 3px;
    color: white;
    display: flex;
    font-size: 16px;
    justify-content: space-between;
    line-height: 140%;
    padding: 13.33333px 20px;
    text-align: left;
  }
  .ERxklc1DEy6MRbHq8F_oL .xFfiAqzH9NFPaQ_MJUds_ {
    color: #323232;
    font-size: 14px;
    line-height: 180%;
    padding: 20px 40px;
    text-align: left;
  }
  .ES_25px {
    background-position: 0 -1500px;
  }
  .ET_25px {
    background-position: 0 -1525px;
  }
  .FI_25px {
    background-position: 0 -1550px;
  }
  .FJ_25px {
    background-position: 0 -1575px;
  }
  .FK_25px {
    background-position: 0 -1600px;
  }
  .FM_25px {
    background-position: 0 -1625px;
  }
  .FO_25px {
    background-position: 0 -1650px;
  }
  .FR_25px {
    background-position: 0 -1675px;
  }
  .FamgNeTLmEx83Uzx_1NaQ {
    color: #323232;
    font-size: 0.9rem;
    font-weight: normal;
  }
  .G7lcMZWWCM-fOTm8KoSxB {
    align-items: center;
    background-color: #89a383;
    border-radius: 50%;
    color: white;
    display: flex;
    height: 2.5rem;
    justify-content: center;
    margin-right: 0.5rem;
    padding: 4px;
    position: relative;
    width: 2.5rem;
  }
  .GA_25px {
    background-position: 0 -1700px;
  }
  .GB_25px {
    background-position: 0 -1725px;
  }
  .GCMqIV_Qclk3NatceK653 ._2AGbX7Mg4BOLr5JAZNj8Ld {
    background-color: rgba(50, 50, 50, 0.1);
    height: 1px;
    margin-bottom: 20px;
  }
  .GCMqIV_Qclk3NatceK653 ._35Nj9y3o_mxX3bUWTYbUTQ {
    align-items: center;
    display: flex;
    font-size: 12px;
    font-weight: 200;
    margin: 5px 0 0 1px;
  }
  .GD_25px {
    background-position: 0 -1750px;
  }
  .GE_25px {
    background-position: 0 -1775px;
  }
  .GF_25px {
    background-position: 0 -1800px;
  }
  .GH_25px {
    background-position: 0 -1825px;
  }
  .GI_25px {
    background-position: 0 -1850px;
  }
  .GL_25px {
    background-position: 0 -1875px;
  }
  .GM_25px {
    background-position: 0 -1900px;
  }
  .GN_25px {
    background-position: 0 -1925px;
  }
  .GP_25px {
    background-position: 0 -1950px;
  }
  .GQ_25px {
    background-position: 0 -1975px;
  }
  .GR_25px {
    background-position: 0 -2000px;
  }
  .GT_25px {
    background-position: 0 -2025px;
  }
  .GW_25px {
    background-position: 0 -2050px;
  }
  .GY_25px {
    background-position: 0 -2075px;
  }
  .GrCbT77cZ3fSodwurZxaE,
        ._3ug74DsppSWcd9Mr08we_O ._2aoXngB9i7hXnWxW9feDj7 .GrCbT77cZ3fSodwurZxaE {
    align-items: center;
    display: flex;
    font-size: 11px;
    font-weight: bold;
    margin-top: 3px;
  }
  .HH5BcFkiFC7Nljlmy12A4 .MhGHhOA0lJjLWqgG7Mggw {
    border-radius: 4px;
    border-style: solid;
    border-width: 1px;
    padding: 0.5rem;
  }
  .HH5BcFkiFC7Nljlmy12A4 ._3e6CJniDBfmcZztBvIHnrl {
    padding-top: 4px;
  }
  .HK_25px {
    background-position: 0 -2100px;
  }
  .HN_25px {
    background-position: 0 -2125px;
  }
  .HR_25px {
    background-position: 0 -2150px;
  }
  .HT_25px {
    background-position: 0 -2175px;
  }
  .HU_25px {
    background-position: 0 -2200px;
  }
  .I9R-4mT-75umb_ObLZAsE,
        ._3eBT-caf7Z2L7t3J6X2-j6 ._21ffV9cayPfHIkFdZ_XvWn .I9R-4mT-75umb_ObLZAsE,
        ._18ikUvP25CDHcrfz1MsnXQ ._21ffV9cayPfHIkFdZ_XvWn .oAPVXsJiQ_ivBy1znc2Gg,
        ._3eBT-caf7Z2L7t3J6X2-j6 ._21ffV9cayPfHIkFdZ_XvWn .oAPVXsJiQ_ivBy1znc2Gg {
    border: 3px #474747 solid;
    border-radius: 2px;
  }
  .IE_25px {
    background-position: 0 -2225px;
  }
  .IL_25px {
    background-position: 0 -2250px;
  }
  .IM_25px {
    background-position: 0 -2275px;
  }
  .IN_25px {
    background-position: 0 -2300px;
  }
  .IO_25px {
    background-position: 0 -2325px;
  }
  .IQ_25px {
    background-position: 0 -2350px;
  }
  .IR_25px {
    background-position: 0 -2375px;
  }
  .IS_25px {
    background-position: 0 -2400px;
  }
  .IT_25px {
    background-position: 0 -2425px;
  }
  .In37K49i342Itc7t84w5h {
    background-color: white;
    border-radius: 5px;
    box-shadow: 0 2vh 10vh rgba(0, 0, 0, 0.3);
    height: 90%;
    max-width: 1200px;
    overflow: hidden;
    width: 90%;
  }
  .JE_25px {
    background-position: 0 -2450px;
  }
  .JM_25px {
    background-position: 0 -2475px;
  }
  .JO_25px {
    background-position: 0 -2500px;
  }
  .JP_25px {
    background-position: 0 -2525px;
  }
  .KE_25px {
    background-position: 0 -2550px;
  }
  .KG_25px {
    background-position: 0 -2575px;
  }
  .KH_25px {
    background-position: 0 -2600px;
  }
  .KI_25px {
    background-position: 0 -2625px;
  }
  .KM_25px {
    background-position: 0 -2650px;
  }
  .KN_25px {
    background-position: 0 -2675px;
  }
  .KP_25px {
    background-position: 0 -2700px;
  }
  .KR_25px {
    background-position: 0 -2725px;
  }
  .KW_25px {
    background-position: 0 -2750px;
  }
  .KY_25px {
    background-position: 0 -2775px;
  }
  .KZ_25px {
    background-position: 0 -2800px;
  }
  .L1dT-sUvPlZsvAwSwE6re {
    color: #323232;
    font-size: 1rem;
    margin: 4px auto;
  }
  .LA_25px {
    background-position: 0 -2825px;
  }
  .LB_25px {
    background-position: 0 -2850px;
  }
  .LC_25px {
    background-position: 0 -2875px;
  }
  .LI_25px {
    background-position: 0 -2900px;
  }
  .LK_25px {
    background-position: 0 -2925px;
  }
  .LR_25px {
    background-position: 0 -2950px;
  }
  .LS_25px {
    background-position: 0 -2975px;
  }
  .LT_25px {
    background-position: 0 -3000px;
  }
  .LU_25px {
    background-position: 0 -3025px;
  }
  .LV_25px {
    background-position: 0 -3050px;
  }
  .LY_25px {
    background-position: 0 -3075px;
  }
  .MA_25px {
    background-position: 0 -3100px;
  }
  .MC_25px {
    background-position: 0 -3125px;
  }
  .MD_25px {
    background-position: 0 -3150px;
  }
  .MG_25px {
    background-position: 0 -3175px;
  }
  .MH_25px {
    background-position: 0 -3200px;
  }
  .MK_25px {
    background-position: 0 -3225px;
  }
  .ML_25px {
    background-position: 0 -3250px;
  }
  .MM_25px {
    background-position: 0 -3275px;
  }
  .MN_25px {
    background-position: 0 -3300px;
  }
  .MP_25px {
    background-position: 0 -3325px;
  }
  .MQ_25px {
    background-position: 0 -3350px;
  }
  .MR_25px {
    background-position: 0 -3375px;
  }
  .MS_25px {
    background-position: 0 -3400px;
  }
  .MT_25px {
    background-position: 0 -3425px;
  }
  .MU_25px {
    background-position: 0 -3450px;
  }
  .MV_25px {
    background-position: 0 -3475px;
  }
  .MW_25px {
    background-position: 0 -3500px;
  }
  .MX_25px {
    background-position: 0 -3525px;
  }
  .MY_25px {
    background-position: 0 -3550px;
  }
  .MZ_25px {
    background-position: 0 -3575px;
  }
  .MowGJB0-86qBzKLnJwrBA ._1_qdewUQ53jSdFSJP1PHxW {
    padding-bottom: 1rem;
  }
  .MowGJB0-86qBzKLnJwrBA ._3ZBIDpy0mQ4NkMkhRuDCR7 {
    font-size: 12px;
    font-weight: normal;
    line-height: 160%;
    margin-top: 10px;
    text-align: left;
  }
  .NA_25px {
    background-position: 0 -3600px;
  }
  .NE_25px {
    background-position: 0 -3625px;
  }
  .NG_25px {
    background-position: 0 -3650px;
  }
  .NI_25px {
    background-position: 0 -3675px;
  }
  .NL_25px {
    background-position: 0 -3700px;
  }
  .NO_25px {
    background-position: 0 -3725px;
  }
  .NP_25px {
    background-position: 0 -3750px;
  }
  .NR_25px {
    background-position: 0 -3775px;
  }
  .NVxISeEA3XlEhoEVZlQnd {
    -webkit-animation: _3u5YnePr2qJC3i9uUdgTnc 12s linear infinite;
    animation: _3u5YnePr2qJC3i9uUdgTnc 12s linear infinite;
    border: 2px dashed white;
    border-radius: 100%;
    height: 84px;
    position: absolute;
    width: 84px;
  }
  .NZ_25px {
    background-position: 0 -3800px;
  }
  .OM_25px {
    background-position: 0 -3825px;
  }
  .PA_25px {
    background-position: 0 -3850px;
  }
  .PE_25px {
    background-position: 0 -3875px;
  }
  .PF_25px {
    background-position: 0 -3900px;
  }
  .PG_25px {
    background-position: 0 -3925px;
  }
  .PH_25px {
    background-position: 0 -3950px;
  }
  .PK_25px {
    background-position: 0 -3975px;
  }
  .PL_25px {
    background-position: 0 -4000px;
  }
  .PM_25px {
    background-position: 0 -4025px;
  }
  .PR_25px {
    background-position: 0 -4050px;
  }
  .PT_25px {
    background-position: 0 -4075px;
  }
  .PW_25px {
    background-position: 0 -4100px;
  }
  .PY_25px {
    background-position: 0 -4125px;
  }
  .QA_25px {
    background-position: 0 -4150px;
  }
  .RE_25px {
    background-position: 0 -4175px;
  }
  .RO_25px {
    background-position: 0 -4200px;
  }
  .RS_25px {
    background-position: 0 -4225px;
  }
  .RU_25px {
    background-position: 0 -4250px;
  }
  .RW_25px {
    background-position: 0 -4275px;
  }
  .SA_25px {
    background-position: 0 -4300px;
  }
  .SB_25px {
    background-position: 0 -4325px;
  }
  .SC_25px {
    background-position: 0 -4350px;
  }
  .SD_25px {
    background-position: 0 -4375px;
  }
  .SE_25px {
    background-position: 0 -4400px;
  }
  .SG_25px {
    background-position: 0 -4425px;
  }
  .SH_25px {
    background-position: 0 -4450px;
  }
  .SI_25px {
    background-position: 0 -4475px;
  }
  .SK_25px {
    background-position: 0 -4500px;
  }
  .SL_25px {
    background-position: 0 -4525px;
  }
  .SM_25px {
    background-position: 0 -4550px;
  }
  .SN_25px {
    background-position: 0 -4575px;
  }
  .SO_25px {
    background-position: 0 -4600px;
  }
  .SR_25px {
    background-position: 0 -4625px;
  }
  .SS_25px {
    background-position: 0 -4650px;
  }
  .SV_25px {
    background-position: 0 -4675px;
  }
  .SY_25px {
    background-position: 0 -4700px;
  }
  .SZ_25px {
    background-position: 0 -4725px;
  }
  .TC_25px {
    background-position: 0 -4750px;
  }
  .TD_25px {
    background-position: 0 -4775px;
  }
  .TF_25px {
    background-position: 0 -4800px;
  }
  .TG_25px {
    background-position: 0 -4825px;
  }
  .TH_25px {
    background-position: 0 -4850px;
  }
  .TJ_25px {
    background-position: 0 -4875px;
  }
  .TM_25px {
    background-position: 0 -4900px;
  }
  .TN_25px {
    background-position: 0 -4925px;
  }
  .TO_25px {
    background-position: 0 -4950px;
  }
  .TR_25px {
    background-position: 0 -4975px;
  }
  .TT_25px {
    background-position: 0 -5000px;
  }
  .TV_25px {
    background-position: 0 -5025px;
  }
  .TW_25px {
    background-position: 0 -5050px;
  }
  .TZ_25px {
    background-position: 0 -5075px;
  }
  .UA_25px {
    background-position: 0 -5100px;
  }
  .UFTTmf4ibWuxFlB3zG_8M,
        .vTejYh3eCvcK7lRihCOoE ._3sK-HIWLy1TBLAaqiMmfKP .UFTTmf4ibWuxFlB3zG_8M {
    color: #5c909b;
    padding-left: 0.5rem;
  }
  .UG_25px {
    background-position: 0 -5125px;
  }
  .US_25px {
    background-position: 0 -5150px;
  }
  .UY_25px {
    background-position: 0 -5175px;
  }
  .UZ_25px {
    background-position: 0 -5200px;
  }
  .VA_25px {
    background-position: 0 -5225px;
  }
  .VC_25px {
    background-position: 0 -5250px;
  }
  .VE_25px {
    background-position: 0 -5275px;
  }
  .VG_25px {
    background-position: 0 -5300px;
  }
  .VI_25px {
    background-position: 0 -5325px;
  }
  .VN_25px {
    background-position: 0 -5350px;
  }
  .VU_25px {
    background-position: 0 -5375px;
  }
  .WS_25px {
    background-position: 0 -5400px;
  }
  .X9C1UR7aKWoQ25ioe_o0t ._2M3sIExapNLIKikB_MGkZg {
    color: #666667;
  }
  .YE_25px {
    background-position: 0 -5425px;
  }
  .YT_25px {
    background-position: 0 -5450px;
  }
  .ZA_25px {
    background-position: 0 -5475px;
  }
  .ZM_25px {
    background-position: 0 -5500px;
  }
  .ZW_25px {
    background-position: 0 -5525px;
  }
  .bXEHHNudOC_AVXF1Z0Efi {
    font-size: large;
    font-weight: bolder;
    line-height: 1rem;
    text-align: left;
  }
  .btn-primary {
    background-color: #1ab22c;
    border-radius: 5px;
    color: white;
    cursor: pointer;
    font-size: 18px;
    font-weight: bold;
    letter-spacing: 1px;
    margin-top: 35.2px;
    outline: none;
    padding: 8.8px;
    transition: all 600ms cubic-bezier(0, 0.3, 0.7, 1);
  }
  .btn-primary:hover {
    background-color: #1ab22c;
    border-radius: 5px;
    color: white;
    cursor: pointer;
    font-size: 18px;
    font-weight: bold;
    letter-spacing: 1px;
    margin-top: 35.2px;
    outline: none;
    padding: 8.8px;
    transition: all 600ms cubic-bezier(0, 0.3, 0.7, 1);
  }
  .d67E1vMVN9hKY2RuJfvcF ._1SU_1l7NRE4_4HeO73a9cG {
    font-size: 22px;
    margin: 1.4rem 0 0.5rem 0;
    padding: 0 15px;
  }
  .d67E1vMVN9hKY2RuJfvcF ._2j4ceEmaxKgn_aEmbDEgfj {
    background-color: white !important;
    border: unset;
    color: black;
    cursor: pointer;
    font-size: 1.5rem !important;
    font-weight: 300;
    line-height: 1.6rem;
    margin: 0 !important;
    padding: 0 !important;
    position: absolute;
    right: 15px;
    top: 15px;
    width: unset !important;
  }
  .d67E1vMVN9hKY2RuJfvcF ._3ZGFbdHDkNghT28ondmIZp {
    font-size: 16px;
    margin-top: 8px;
    padding: 0 15px;
  }
  .d67E1vMVN9hKY2RuJfvcF .mI1bIfEooIJRvwVYblI1v {
    background-color: #ededed;
    height: 1px;
    width: 100%;
  }
  .eSNl_WwyPdan9T4mntWvG {
    -moz-user-select: none;
    -ms-user-select: none;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    align-items: center;
    border-bottom: 2px whitesmoke solid;
    cursor: pointer;
    display: flex;
    height: 80px;
    min-height: 50px;
    user-select: none;
  }
  .fk-youtube .fk-rm.image {
    -webkit-background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    height: 100%;
    position: absolute;
    width: 100%;
  }
  .fk-youtube .play-button {
    background-color: #333;
    border-radius: 6px;
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.6);
    height: 60px;
    opacity: 0.8;
    width: 90px;
    z-index: 1;
  }
  .fk-youtube .play-button:before {
    border-color: transparent transparent transparent #fff;
    border-style: solid;
    border-width: 15px 0 15px 26.0px;
    content: "";
  }
  .gXamJyQ_Wt9dYwaLd-sXA ._1s3P8BRVKw__qNAsZ1Z0MN ._1QwIr9xSNLO_m0AsBwv7Jf {
    background-color: whitesmoke;
    border-radius: 10px;
    height: 15px;
    margin-top: 20px;
    overflow: hidden;
    padding: 6px;
  }
  .gXamJyQ_Wt9dYwaLd-sXA ._1s3P8BRVKw__qNAsZ1Z0MN ._1QwIr9xSNLO_m0AsBwv7Jf ._1X8jpjsZ2yy88o_Aq7oD1F {
    -webkit-animation: _1In82js7Wmt2lS9HB6pZnL 1s linear infinite;
    animation: _1In82js7Wmt2lS9HB6pZnL 1s linear infinite;
    background-color: #1ab22c;
    background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);
    background-size: 40px 40px;
    border-radius: 10px;
    height: 100%;
    transition: all 2500ms cubic-bezier(0.2, 0.6, 0.6, 0.95);
  }
  .gXamJyQ_Wt9dYwaLd-sXA ._1s3P8BRVKw__qNAsZ1Z0MN ._2OjtxqxV7Z-E8Q2Y4a3mx6 {
    color: black;
    font-size: 16px;
    font-weight: bold;
  }
  .i59VT2R06KRH_suaW4_d5,
        ._3eBT-caf7Z2L7t3J6X2-j6 ._21ffV9cayPfHIkFdZ_XvWn._3mO11n1YFhXV5T_954uhx_.i59VT2R06KRH_suaW4_d5 {
    -webkit-animation: _2JOBaSB3lCNo6sPT0Z4IAx 0.4s ease;
    animation: _2JOBaSB3lCNo6sPT0Z4IAx 0.4s ease;
  }
  .image-gallery-bullets .image-gallery-bullet {
    padding: 2.7px;
  }
  .image-gallery-bullets .image-gallery-bullet.active {
    background: #fff;
  }
  .image-gallery-bullets .image-gallery-bullet:focus,
        .image-gallery-bullets .image-gallery-bullet:hover {
    background: #337ab7;
    transform: scale(1.1);
  }
  .image-gallery-bullets .image-gallery-bullets.scraped-container {
    margin: 0;
    padding: 0;
    text-align: center;
  }
  .image-gallery-slide .image-gallery-description {
    bottom: 45px;
    font-size: .8em;
    padding: 8px 15px;
  }
  .image-gallery-thumbnails-wrapper.left .image-gallery-thumbnails .image-gallery-thumbnail,
        .image-gallery-thumbnails-wrapper.right .image-gallery-thumbnails .image-gallery-thumbnail {
    display: block;
    margin-right: 0;
    padding: 0;
  }
  .image-gallery-thumbnails-wrapper.left .image-gallery-thumbnails,
        .image-gallery-thumbnails-wrapper.right .image-gallery-thumbnails {
    height: 100%;
    left: 0;
    padding: 0;
    position: absolute;
    top: 0;
    width: 100%;
  }
  .j7nw2156hcT8fjGrlqexr {
    display: flex;
    padding: 10px 0;
  }
  .main {
    background-color: whitesmoke;
  }
  .nXFIVse6Goo_SkQdzVsyt {
    background-color: white;
    margin: 8.8px 0;
    padding: 8.8px 0;
  }
  .ndhv3JBskvHN0dJtC7dpr {
    -webkit-animation: DNutUMIDhPFLy5hbNphJg 2s linear infinite;
    animation: DNutUMIDhPFLy5hbNphJg 2s linear infinite;
    bottom: 0;
    height: 100%;
    left: 0;
    margin: auto;
    position: absolute;
    right: 0;
    top: 0;
    transform-origin: center center;
    width: 100%;
  }
  .ndhv3JBskvHN0dJtC7dpr ._3J-1b0JUEHFIu3aHQiXY2m {
    -webkit-animation: UgX3W_HhivQrETKdD6X_c 1.5s ease-in-out infinite;
    animation: UgX3W_HhivQrETKdD6X_c 1.5s ease-in-out infinite;
    stroke: rgba(0, 0, 0, 0.2);
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
    stroke-linecap: round;
  }
  .oAPVXsJiQ_ivBy1znc2Gg,
        ._3eBT-caf7Z2L7t3J6X2-j6 ._21ffV9cayPfHIkFdZ_XvWn .oAPVXsJiQ_ivBy1znc2Gg {
    background-color: #1ab22c;
    border-color: #1ab22c;
  }
  .qsJPd_oEWG2lywXPD0a66 ._1-5wFy0rJNbLwXFG0xG4sa {
    background: #d8dce2;
    border-radius: 5px;
    font-size: 1.1rem;
    line-height: 1.25rem;
    padding: 0.5rem;
  }
  .qsJPd_oEWG2lywXPD0a66 ._2GJYv6Bk7-6qpy4rN_l5NJ {
    color: green;
    padding: 0.5rem;
  }
  .ufuTSZ5BObomevjoHGiLC .Fe58O0X7CwMwtwEMeV8iP {
    font-size: 12px;
  }
  .vTejYh3eCvcK7lRihCOoE ._27tk3yj6WZpa9R_3CyMVrr {
    align-items: flex-start;
    align-self: flex-start;
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    justify-content: flex-start;
    padding: 4px;
  }
  .vTejYh3eCvcK7lRihCOoE ._27tk3yj6WZpa9R_3CyMVrr ._2ajy_cAehVVryWZIXfCycW {
    border: 1px solid #666667;
    font-size: 0.9rem;
    height: 100%;
    margin-left: 8px;
    margin-top: 2px;
    padding: 6px;
    width: 25%;
  }
  .vTejYh3eCvcK7lRihCOoE ._2KRVLJzSq1J-7huwd3hAd7 {
    padding-left: 4px;
  }
  .vTejYh3eCvcK7lRihCOoE ._2nCLeYL5EZBblBAAOtOCuk {
    font-size: 1.2rem;
    font-weight: normal;
    line-height: 1.1rem;
    margin: 12px 0 14px;
    width: 100%;
  }
  .vTejYh3eCvcK7lRihCOoE ._2nCLeYL5EZBblBAAOtOCuk ._2jHpMojDwPNJGgSt60JlsE {
    padding-bottom: 8px;
  }
  .vTejYh3eCvcK7lRihCOoE ._2nCLeYL5EZBblBAAOtOCuk ._2veNj-PsWe3wKXWQUYXXMZ {
    padding-left: 6px;
    width: 100%;
  }
  .vTejYh3eCvcK7lRihCOoE ._2zZXxl2dDQvKEhLTIAVk9m {
    font-size: 1.2rem;
  }
  .vTejYh3eCvcK7lRihCOoE ._3EgFLmBMjjTqYjBAUwxjhe {
    align-items: flex-start;
    display: flex;
    justify-content: flex-start;
    padding: 0 8px;
  }
  .vTejYh3eCvcK7lRihCOoE ._3eZE4T4NMF2tId8u7cCv50 {
    color: #06a015;
    font-size: 1rem;
    font-weight: bold;
  }
  .vhClywwBOSDOuuTFKr8YP {
    background-color: #000000;
    color: white;
  }
  .xvxeQN82BJ2CYoJBUxuuA .AD_56px {
    background-position: 0 0px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .AE_56px {
    background-position: 0 -56px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .AF_56px {
    background-position: 0 -112px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .AG_56px {
    background-position: 0 -168px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .AI_56px {
    background-position: 0 -224px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .AL_56px {
    background-position: 0 -280px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .AM_56px {
    background-position: 0 -336px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .AO_56px {
    background-position: 0 -392px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .AR_56px {
    background-position: 0 -448px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .AS_56px {
    background-position: 0 -504px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .AT_56px {
    background-position: 0 -560px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .AU_56px {
    background-position: 0 -616px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .AW_56px {
    background-position: 0 -672px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .AX_56px {
    background-position: 0 -728px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .AZ_56px {
    background-position: 0 -784px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .BA_56px {
    background-position: 0 -840px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .BB_56px {
    background-position: 0 -896px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .BD_56px {
    background-position: 0 -952px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .BE_56px {
    background-position: 0 -1008px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .BF_56px {
    background-position: 0 -1064px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .BG_56px {
    background-position: 0 -1120px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .BH_56px {
    background-position: 0 -1176px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .BI_56px {
    background-position: 0 -1232px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .BJ_56px {
    background-position: 0 -1288px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .BM_56px {
    background-position: 0 -1344px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .BN_56px {
    background-position: 0 -1400px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .BO_56px {
    background-position: 0 -1456px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .BR_56px {
    background-position: 0 -1512px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .BS_56px {
    background-position: 0 -1568px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .BT_56px {
    background-position: 0 -1624px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .BW_56px {
    background-position: 0 -1680px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .BY_56px {
    background-position: 0 -1736px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .BZ_56px {
    background-position: 0 -1792px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .CA_56px {
    background-position: 0 -1848px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .CC_56px {
    background-position: 0 -1904px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .CD_56px {
    background-position: 0 -1960px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .CF_56px {
    background-position: 0 -2016px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .CG_56px {
    background-position: 0 -2072px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .CH_56px {
    background-position: 0 -2128px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .CL_56px {
    background-position: 0 -2184px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .CM_56px {
    background-position: 0 -2240px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .CN_56px {
    background-position: 0 -2296px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .CO_56px {
    background-position: 0 -2352px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .CR_56px {
    background-position: 0 -2408px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .CU_56px {
    background-position: 0 -2464px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .CV_56px {
    background-position: 0 -2520px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .CX_56px {
    background-position: 0 -2576px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .CY_56px {
    background-position: 0 -2632px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .CZ_56px {
    background-position: 0 -2688px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .DE_56px {
    background-position: 0 -2744px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .DJ_56px {
    background-position: 0 -2800px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .DK_56px {
    background-position: 0 -2856px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .DM_56px {
    background-position: 0 -2912px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .DO_56px {
    background-position: 0 -2968px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .DZ_56px {
    background-position: 0 -3024px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .EC_56px {
    background-position: 0 -3080px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .EE_56px {
    background-position: 0 -3136px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .EG_56px {
    background-position: 0 -3192px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .EH_56px {
    background-position: 0 -3248px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .ER_56px {
    background-position: 0 -3304px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .ES_56px {
    background-position: 0 -3360px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .ET_56px {
    background-position: 0 -3416px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .FI_56px {
    background-position: 0 -3472px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .FJ_56px {
    background-position: 0 -3528px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .FK_56px {
    background-position: 0 -3584px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .FM_56px {
    background-position: 0 -3640px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .FO_56px {
    background-position: 0 -3696px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .FR_56px {
    background-position: 0 -3752px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .GA_56px {
    background-position: 0 -3808px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .GB_56px {
    background-position: 0 -3864px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .GD_56px {
    background-position: 0 -3920px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .GE_56px {
    background-position: 0 -3976px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .GF_56px {
    background-position: 0 -4032px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .GH_56px {
    background-position: 0 -4088px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .GI_56px {
    background-position: 0 -4144px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .GL_56px {
    background-position: 0 -4200px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .GM_56px {
    background-position: 0 -4256px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .GN_56px {
    background-position: 0 -4312px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .GP_56px {
    background-position: 0 -4368px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .GQ_56px {
    background-position: 0 -4424px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .GR_56px {
    background-position: 0 -4480px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .GT_56px {
    background-position: 0 -4536px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .GW_56px {
    background-position: 0 -4592px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .GY_56px {
    background-position: 0 -4648px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .HK_56px {
    background-position: 0 -4704px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .HN_56px {
    background-position: 0 -4760px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .HR_56px {
    background-position: 0 -4816px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .HT_56px {
    background-position: 0 -4872px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .HU_56px {
    background-position: 0 -4928px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .IE_56px {
    background-position: 0 -4984px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .IL_56px {
    background-position: 0 -5040px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .IM_56px {
    background-position: 0 -5096px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .IN_56px {
    background-position: 0 -5152px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .IO_56px {
    background-position: 0 -5208px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .IQ_56px {
    background-position: 0 -5264px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .IR_56px {
    background-position: 0 -5320px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .IS_56px {
    background-position: 0 -5376px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .IT_56px {
    background-position: 0 -5432px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .JE_56px {
    background-position: 0 -5488px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .JM_56px {
    background-position: 0 -5544px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .JO_56px {
    background-position: 0 -5600px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .JP_56px {
    background-position: 0 -5656px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .KE_56px {
    background-position: 0 -5712px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .KG_56px {
    background-position: 0 -5768px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .KH_56px {
    background-position: 0 -5824px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .KI_56px {
    background-position: 0 -5880px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .KM_56px {
    background-position: 0 -5936px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .KN_56px {
    background-position: 0 -5992px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .KP_56px {
    background-position: 0 -6048px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .KR_56px {
    background-position: 0 -6104px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .KW_56px {
    background-position: 0 -6160px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .KY_56px {
    background-position: 0 -6216px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .KZ_56px {
    background-position: 0 -6272px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .LA_56px {
    background-position: 0 -6328px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .LB_56px {
    background-position: 0 -6384px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .LC_56px {
    background-position: 0 -6440px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .LI_56px {
    background-position: 0 -6496px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .LK_56px {
    background-position: 0 -6552px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .LR_56px {
    background-position: 0 -6608px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .LS_56px {
    background-position: 0 -6664px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .LT_56px {
    background-position: 0 -6720px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .LU_56px {
    background-position: 0 -6776px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .LV_56px {
    background-position: 0 -6832px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .LY_56px {
    background-position: 0 -6888px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MA_56px {
    background-position: 0 -6944px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MC_56px {
    background-position: 0 -7000px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MD_56px {
    background-position: 0 -7056px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MG_56px {
    background-position: 0 -7112px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MH_56px {
    background-position: 0 -7168px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MK_56px {
    background-position: 0 -7224px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .ML_56px {
    background-position: 0 -7280px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MM_56px {
    background-position: 0 -7336px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MN_56px {
    background-position: 0 -7392px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MP_56px {
    background-position: 0 -7448px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MQ_56px {
    background-position: 0 -7504px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MR_56px {
    background-position: 0 -7560px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MS_56px {
    background-position: 0 -7616px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MT_56px {
    background-position: 0 -7672px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MU_56px {
    background-position: 0 -7728px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MV_56px {
    background-position: 0 -7784px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MW_56px {
    background-position: 0 -7840px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MX_56px {
    background-position: 0 -7896px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MY_56px {
    background-position: 0 -7952px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MZ_56px {
    background-position: 0 -8008px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .NA_56px {
    background-position: 0 -8064px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .NE_56px {
    background-position: 0 -8120px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .NG_56px {
    background-position: 0 -8176px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .NI_56px {
    background-position: 0 -8232px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .NL_56px {
    background-position: 0 -8288px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .NO_56px {
    background-position: 0 -8344px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .NP_56px {
    background-position: 0 -8400px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .NR_56px {
    background-position: 0 -8456px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .NZ_56px {
    background-position: 0 -8512px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .OM_56px {
    background-position: 0 -8568px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .PA_56px {
    background-position: 0 -8624px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .PE_56px {
    background-position: 0 -8680px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .PF_56px {
    background-position: 0 -8736px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .PG_56px {
    background-position: 0 -8792px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .PH_56px {
    background-position: 0 -8848px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .PK_56px {
    background-position: 0 -8904px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .PL_56px {
    background-position: 0 -8960px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .PM_56px {
    background-position: 0 -9016px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .PR_56px {
    background-position: 0 -9072px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .PT_56px {
    background-position: 0 -9128px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .PW_56px {
    background-position: 0 -9184px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .PY_56px {
    background-position: 0 -9240px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .QA_56px {
    background-position: 0 -9296px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .RE_56px {
    background-position: 0 -9352px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .RO_56px {
    background-position: 0 -9408px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .RS_56px {
    background-position: 0 -9464px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .RU_56px {
    background-position: 0 -9520px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .RW_56px {
    background-position: 0 -9576px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .SA_56px {
    background-position: 0 -9632px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .SB_56px {
    background-position: 0 -9688px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .SC_56px {
    background-position: 0 -9744px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .SD_56px {
    background-position: 0 -9800px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .SE_56px {
    background-position: 0 -9856px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .SG_56px {
    background-position: 0 -9912px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .SH_56px {
    background-position: 0 -9968px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .SI_56px {
    background-position: 0 -10024px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .SK_56px {
    background-position: 0 -10080px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .SL_56px {
    background-position: 0 -10136px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .SM_56px {
    background-position: 0 -10192px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .SN_56px {
    background-position: 0 -10248px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .SO_56px {
    background-position: 0 -10304px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .SR_56px {
    background-position: 0 -10360px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .SS_56px {
    background-position: 0 -10416px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .SV_56px {
    background-position: 0 -10472px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .SY_56px {
    background-position: 0 -10528px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .SZ_56px {
    background-position: 0 -10584px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .TC_56px {
    background-position: 0 -10640px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .TD_56px {
    background-position: 0 -10696px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .TF_56px {
    background-position: 0 -10752px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .TG_56px {
    background-position: 0 -10808px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .TH_56px {
    background-position: 0 -10864px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .TJ_56px {
    background-position: 0 -10920px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .TM_56px {
    background-position: 0 -10976px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .TN_56px {
    background-position: 0 -11032px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .TO_56px {
    background-position: 0 -11088px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .TR_56px {
    background-position: 0 -11144px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .TT_56px {
    background-position: 0 -11200px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .TV_56px {
    background-position: 0 -11256px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .TW_56px {
    background-position: 0 -11312px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .TZ_56px {
    background-position: 0 -11368px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .UA_56px {
    background-position: 0 -11424px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .UG_56px {
    background-position: 0 -11480px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .US_56px {
    background-position: 0 -11536px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .UY_56px {
    background-position: 0 -11592px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .UZ_56px {
    background-position: 0 -11648px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .VA_56px {
    background-position: 0 -11704px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .VC_56px {
    background-position: 0 -11760px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .VE_56px {
    background-position: 0 -11816px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .VG_56px {
    background-position: 0 -11872px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .VI_56px {
    background-position: 0 -11928px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .VN_56px {
    background-position: 0 -11984px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .VU_56px {
    background-position: 0 -12040px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .WS_56px {
    background-position: 0 -12096px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .YE_56px {
    background-position: 0 -12152px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .YT_56px {
    background-position: 0 -12208px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .ZA_56px {
    background-position: 0 -12264px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .ZM_56px {
    background-position: 0 -12320px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .ZW_56px {
    background-position: 0 -12376px;
  }
  .y7Lxdef35rl_xZd88Xven {
    color: #90949c;
    padding-left: 0.2rem;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .AD_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .AD_25px {
    background-position: 0 0px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .AE_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .AE_25px {
    background-position: 0 -25px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .AF_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .AF_25px {
    background-position: 0 -50px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .AG_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .AG_25px {
    background-position: 0 -75px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .AI_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .AI_25px {
    background-position: 0 -100px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .AL_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .AL_25px {
    background-position: 0 -125px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .AM_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .AM_25px {
    background-position: 0 -150px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .AO_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .AO_25px {
    background-position: 0 -175px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .AR_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .AR_25px {
    background-position: 0 -200px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .AS_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .AS_25px {
    background-position: 0 -225px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .AT_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .AT_25px {
    background-position: 0 -250px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .AU_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .AU_25px {
    background-position: 0 -275px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .AW_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .AW_25px {
    background-position: 0 -300px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .AX_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .AX_25px {
    background-position: 0 -325px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .AZ_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .AZ_25px {
    background-position: 0 -350px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .BA_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .BA_25px {
    background-position: 0 -375px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .BB_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .BB_25px {
    background-position: 0 -400px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .BD_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .BD_25px {
    background-position: 0 -425px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .BE_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .BE_25px {
    background-position: 0 -450px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .BF_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .BF_25px {
    background-position: 0 -475px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .BG_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .BG_25px {
    background-position: 0 -500px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .BH_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .BH_25px {
    background-position: 0 -525px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .BI_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .BI_25px {
    background-position: 0 -550px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .BJ_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .BJ_25px {
    background-position: 0 -575px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .BM_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .BM_25px {
    background-position: 0 -600px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .BN_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .BN_25px {
    background-position: 0 -625px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .BO_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .BO_25px {
    background-position: 0 -650px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .BR_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .BR_25px {
    background-position: 0 -675px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .BS_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .BS_25px {
    background-position: 0 -700px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .BT_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .BT_25px {
    background-position: 0 -725px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .BW_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .BW_25px {
    background-position: 0 -750px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .BY_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .BY_25px {
    background-position: 0 -775px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .BZ_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .BZ_25px {
    background-position: 0 -800px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .CA_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .CA_25px {
    background-position: 0 -825px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .CC_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .CC_25px {
    background-position: 0 -850px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .CD_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .CD_25px {
    background-position: 0 -875px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .CF_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .CF_25px {
    background-position: 0 -900px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .CG_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .CG_25px {
    background-position: 0 -925px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .CH_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .CH_25px {
    background-position: 0 -950px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .CL_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .CL_25px {
    background-position: 0 -975px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .CM_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .CM_25px {
    background-position: 0 -1000px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .CN_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .CN_25px {
    background-position: 0 -1025px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .CO_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .CO_25px {
    background-position: 0 -1050px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .CR_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .CR_25px {
    background-position: 0 -1075px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .CU_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .CU_25px {
    background-position: 0 -1100px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .CV_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .CV_25px {
    background-position: 0 -1125px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .CX_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .CX_25px {
    background-position: 0 -1150px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .CY_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .CY_25px {
    background-position: 0 -1175px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .CZ_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .CZ_25px {
    background-position: 0 -1200px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .DE_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .DE_25px {
    background-position: 0 -1225px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .DJ_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .DJ_25px {
    background-position: 0 -1250px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .DK_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .DK_25px {
    background-position: 0 -1275px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .DM_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .DM_25px {
    background-position: 0 -1300px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .DO_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .DO_25px {
    background-position: 0 -1325px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .DZ_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .DZ_25px {
    background-position: 0 -1350px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .EC_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .EC_25px {
    background-position: 0 -1375px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .EE_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .EE_25px {
    background-position: 0 -1400px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .EG_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .EG_25px {
    background-position: 0 -1425px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .EH_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .EH_25px {
    background-position: 0 -1450px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .ER_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .ER_25px {
    background-position: 0 -1475px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .ES_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .ES_25px {
    background-position: 0 -1500px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .ET_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .ET_25px {
    background-position: 0 -1525px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .FI_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .FI_25px {
    background-position: 0 -1550px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .FJ_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .FJ_25px {
    background-position: 0 -1575px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .FK_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .FK_25px {
    background-position: 0 -1600px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .FM_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .FM_25px {
    background-position: 0 -1625px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .FO_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .FO_25px {
    background-position: 0 -1650px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .FR_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .FR_25px {
    background-position: 0 -1675px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .GA_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .GA_25px {
    background-position: 0 -1700px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .GB_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .GB_25px {
    background-position: 0 -1725px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .GD_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .GD_25px {
    background-position: 0 -1750px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .GE_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .GE_25px {
    background-position: 0 -1775px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .GF_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .GF_25px {
    background-position: 0 -1800px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .GH_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .GH_25px {
    background-position: 0 -1825px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .GI_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .GI_25px {
    background-position: 0 -1850px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .GL_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .GL_25px {
    background-position: 0 -1875px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .GM_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .GM_25px {
    background-position: 0 -1900px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .GN_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .GN_25px {
    background-position: 0 -1925px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .GP_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .GP_25px {
    background-position: 0 -1950px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .GQ_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .GQ_25px {
    background-position: 0 -1975px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .GR_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .GR_25px {
    background-position: 0 -2000px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .GT_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .GT_25px {
    background-position: 0 -2025px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .GW_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .GW_25px {
    background-position: 0 -2050px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .GY_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .GY_25px {
    background-position: 0 -2075px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .HK_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .HK_25px {
    background-position: 0 -2100px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .HN_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .HN_25px {
    background-position: 0 -2125px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .HR_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .HR_25px {
    background-position: 0 -2150px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .HT_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .HT_25px {
    background-position: 0 -2175px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .HU_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .HU_25px {
    background-position: 0 -2200px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .IE_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .IE_25px {
    background-position: 0 -2225px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .IL_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .IL_25px {
    background-position: 0 -2250px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .IM_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .IM_25px {
    background-position: 0 -2275px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .IN_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .IN_25px {
    background-position: 0 -2300px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .IO_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .IO_25px {
    background-position: 0 -2325px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .IQ_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .IQ_25px {
    background-position: 0 -2350px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .IR_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .IR_25px {
    background-position: 0 -2375px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .IS_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .IS_25px {
    background-position: 0 -2400px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .IT_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .IT_25px {
    background-position: 0 -2425px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .JE_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .JE_25px {
    background-position: 0 -2450px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .JM_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .JM_25px {
    background-position: 0 -2475px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .JO_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .JO_25px {
    background-position: 0 -2500px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .JP_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .JP_25px {
    background-position: 0 -2525px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .KE_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .KE_25px {
    background-position: 0 -2550px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .KG_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .KG_25px {
    background-position: 0 -2575px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .KH_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .KH_25px {
    background-position: 0 -2600px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .KI_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .KI_25px {
    background-position: 0 -2625px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .KM_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .KM_25px {
    background-position: 0 -2650px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .KN_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .KN_25px {
    background-position: 0 -2675px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .KP_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .KP_25px {
    background-position: 0 -2700px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .KR_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .KR_25px {
    background-position: 0 -2725px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .KW_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .KW_25px {
    background-position: 0 -2750px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .KY_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .KY_25px {
    background-position: 0 -2775px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .KZ_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .KZ_25px {
    background-position: 0 -2800px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .LA_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .LA_25px {
    background-position: 0 -2825px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .LB_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .LB_25px {
    background-position: 0 -2850px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .LC_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .LC_25px {
    background-position: 0 -2875px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .LI_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .LI_25px {
    background-position: 0 -2900px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .LK_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .LK_25px {
    background-position: 0 -2925px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .LR_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .LR_25px {
    background-position: 0 -2950px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .LS_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .LS_25px {
    background-position: 0 -2975px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .LT_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .LT_25px {
    background-position: 0 -3000px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .LU_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .LU_25px {
    background-position: 0 -3025px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .LV_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .LV_25px {
    background-position: 0 -3050px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .LY_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .LY_25px {
    background-position: 0 -3075px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MA_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MA_25px {
    background-position: 0 -3100px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MC_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MC_25px {
    background-position: 0 -3125px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MD_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MD_25px {
    background-position: 0 -3150px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MG_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MG_25px {
    background-position: 0 -3175px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MH_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MH_25px {
    background-position: 0 -3200px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MK_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MK_25px {
    background-position: 0 -3225px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .ML_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .ML_25px {
    background-position: 0 -3250px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MM_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MM_25px {
    background-position: 0 -3275px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MN_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MN_25px {
    background-position: 0 -3300px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MP_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MP_25px {
    background-position: 0 -3325px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MQ_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MQ_25px {
    background-position: 0 -3350px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MR_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MR_25px {
    background-position: 0 -3375px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MS_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MS_25px {
    background-position: 0 -3400px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MT_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MT_25px {
    background-position: 0 -3425px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MU_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MU_25px {
    background-position: 0 -3450px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MV_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MV_25px {
    background-position: 0 -3475px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MW_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MW_25px {
    background-position: 0 -3500px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MX_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MX_25px {
    background-position: 0 -3525px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MY_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MY_25px {
    background-position: 0 -3550px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MZ_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MZ_25px {
    background-position: 0 -3575px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .NA_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .NA_25px {
    background-position: 0 -3600px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .NE_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .NE_25px {
    background-position: 0 -3625px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .NG_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .NG_25px {
    background-position: 0 -3650px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .NI_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .NI_25px {
    background-position: 0 -3675px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .NL_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .NL_25px {
    background-position: 0 -3700px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .NO_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .NO_25px {
    background-position: 0 -3725px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .NP_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .NP_25px {
    background-position: 0 -3750px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .NR_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .NR_25px {
    background-position: 0 -3775px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .NZ_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .NZ_25px {
    background-position: 0 -3800px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .OM_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .OM_25px {
    background-position: 0 -3825px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .PA_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .PA_25px {
    background-position: 0 -3850px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .PE_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .PE_25px {
    background-position: 0 -3875px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .PF_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .PF_25px {
    background-position: 0 -3900px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .PG_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .PG_25px {
    background-position: 0 -3925px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .PH_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .PH_25px {
    background-position: 0 -3950px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .PK_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .PK_25px {
    background-position: 0 -3975px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .PL_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .PL_25px {
    background-position: 0 -4000px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .PM_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .PM_25px {
    background-position: 0 -4025px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .PR_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .PR_25px {
    background-position: 0 -4050px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .PT_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .PT_25px {
    background-position: 0 -4075px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .PW_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .PW_25px {
    background-position: 0 -4100px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .PY_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .PY_25px {
    background-position: 0 -4125px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .QA_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .QA_25px {
    background-position: 0 -4150px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .RE_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .RE_25px {
    background-position: 0 -4175px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .RO_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .RO_25px {
    background-position: 0 -4200px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .RS_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .RS_25px {
    background-position: 0 -4225px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .RU_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .RU_25px {
    background-position: 0 -4250px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .RW_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .RW_25px {
    background-position: 0 -4275px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .SA_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .SA_25px {
    background-position: 0 -4300px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .SB_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .SB_25px {
    background-position: 0 -4325px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .SC_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .SC_25px {
    background-position: 0 -4350px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .SD_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .SD_25px {
    background-position: 0 -4375px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .SE_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .SE_25px {
    background-position: 0 -4400px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .SG_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .SG_25px {
    background-position: 0 -4425px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .SH_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .SH_25px {
    background-position: 0 -4450px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .SI_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .SI_25px {
    background-position: 0 -4475px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .SK_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .SK_25px {
    background-position: 0 -4500px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .SL_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .SL_25px {
    background-position: 0 -4525px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .SM_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .SM_25px {
    background-position: 0 -4550px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .SN_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .SN_25px {
    background-position: 0 -4575px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .SO_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .SO_25px {
    background-position: 0 -4600px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .SR_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .SR_25px {
    background-position: 0 -4625px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .SS_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .SS_25px {
    background-position: 0 -4650px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .SV_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .SV_25px {
    background-position: 0 -4675px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .SY_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .SY_25px {
    background-position: 0 -4700px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .SZ_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .SZ_25px {
    background-position: 0 -4725px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .TC_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .TC_25px {
    background-position: 0 -4750px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .TD_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .TD_25px {
    background-position: 0 -4775px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .TF_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .TF_25px {
    background-position: 0 -4800px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .TG_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .TG_25px {
    background-position: 0 -4825px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .TH_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .TH_25px {
    background-position: 0 -4850px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .TJ_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .TJ_25px {
    background-position: 0 -4875px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .TM_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .TM_25px {
    background-position: 0 -4900px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .TN_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .TN_25px {
    background-position: 0 -4925px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .TO_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .TO_25px {
    background-position: 0 -4950px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .TR_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .TR_25px {
    background-position: 0 -4975px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .TT_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .TT_25px {
    background-position: 0 -5000px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .TV_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .TV_25px {
    background-position: 0 -5025px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .TW_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .TW_25px {
    background-position: 0 -5050px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .TZ_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .TZ_25px {
    background-position: 0 -5075px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .UA_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .UA_25px {
    background-position: 0 -5100px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .UG_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .UG_25px {
    background-position: 0 -5125px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .US_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .US_25px {
    background-position: 0 -5150px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .UY_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .UY_25px {
    background-position: 0 -5175px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .UZ_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .UZ_25px {
    background-position: 0 -5200px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .VA_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .VA_25px {
    background-position: 0 -5225px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .VC_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .VC_25px {
    background-position: 0 -5250px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .VE_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .VE_25px {
    background-position: 0 -5275px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .VG_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .VG_25px {
    background-position: 0 -5300px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .VI_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .VI_25px {
    background-position: 0 -5325px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .VN_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .VN_25px {
    background-position: 0 -5350px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .VU_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .VU_25px {
    background-position: 0 -5375px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .VrvZWTU4wpGJwxeTzir79,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .VrvZWTU4wpGJwxeTzir79 {
    color: #666667;
    margin-left: auto;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .WS_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .WS_25px {
    background-position: 0 -5400px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .YE_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .YE_25px {
    background-position: 0 -5425px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .YT_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .YT_25px {
    background-position: 0 -5450px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .ZA_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .ZA_25px {
    background-position: 0 -5475px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .ZM_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .ZM_25px {
    background-position: 0 -5500px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .ZW_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .ZW_25px {
    background-position: 0 -5525px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd ._11QU_BIqESitk6Tryg9hVJ,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd ._11QU_BIqESitk6Tryg9hVJ {
    background-image: url('https://checkout.clarifion.com//champflxbnzet1upsell/img/flag_sprite.png');
    background-repeat: no-repeat;
    background-size: 100%;
    display: inline-block;
    height: 25px;
    width: 25px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd {
    align-items: center;
    background-color: white;
    cursor: pointer;
    display: flex;
    height: 55px;
    padding: 0 20px;
  }
  .yBiQ1tylQlUl3F4-r4bTi,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf {
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 3px 30px rgba(0, 0, 0, 0.3);
    height: 220px;
    overflow: hidden;
    overflow-y: scroll;
    position: absolute;
    top: 72px;
    width: 100%;
    z-index: 10000;
  }
  .yotpo-close-modal.yotpo-icon-btn-small .yotpo-icon.yotpo-icon-cross {
    background: red !important;
    border: 2px solid black !important;
    border-radius: 5px !important;
    box-sizing: border-box !important;
    color: white !important;
  }
```

### J. All Static Text Content (from HTML)

  `#fkt-link-82c-ea0-9be` (a): `NO, THANKS. I’ll just buy this at regular price next time.
                     `
  `#i0mqg` (p): `And yes, you still get
                                FREE shipping.`
  `#i2ws1` (h2): `** Please do not close this page. **`
  `#i3j99` (strong): `Please do not close this page.`
  `#i4sel` (h1): `Wait! Wait!`
  `#ied79` (p): `Don’t need 3
                                odor-busting devices?`
  `#ifrfi` (span): `Copyright (c) 2024 Clarifion`
  `#iwak2` (h2): `Don’t need 3
                                odor-busting devices?`
  `#iwjle` (button): `YES! Add 1 ODRx device for only
                            $39.97`
  `#ixdbk` (p): `Wait!`
  `#pageDataScript` (script): `var pageData = { "pageViewReferenceId": "9cdac069-d313-41e0-9221-f571b824ce4e", `
  `#reject-upsell` (div): `NO, THANKS. I’ll just buy this at regular price next time.
                     `

### K. JavaScript Template Texts

- `); // Step 2: Confirm payment with Stripe.js console.log(`
- `); e.preventDefault(); orderSummary.classList.toggle(`
- `); orderSummary.classList.toggle(`
- `); orders.unshift(order); localStorage.setItem(`
- `); updateOrderStatus(order.id,`
- `, JSON.stringify(orders)); console.log(`
- `, currencyCode); // Create order draft BEFORE payment processing console.log(`
- `, error); // Update order status to failed updateOrderStatus(order.id,`
- `, foundDiscount); appliedDiscountCode = foundDiscount; setTimeout(() => { syncOrderSummaryWithProduc`
- `, orderId); } catch (error) { console.error(`
- `.order-applied-discount-remove`
- `.order-discount-code-button`
- `.order-discount-code-input`
- `.order-summary-body`
- `.order-summary-header`
- `; // Order Item bodyHTML +=`
- `; productRow.style.borderLeft =`
- `; r.style.borderLeft =`
- `; row.style.borderColor =`
- `; row.style.borderLeft =`

---

## Clarifion OTO4 (upsell-oto4-clarifion.html)

- **File size**: 604,794 bytes | **Custom CSS**: 232,297 bytes
- **Timer**: None
- **ID rules**: 8 | **Class rules**: 804 | **Keyframes**: 8

### A. Interrupt Header

_No interrupt header found_

### B. Countdown Timer

_No countdown timer_

### C. Headlines

**<h1>** `Thank You For Your Order!`

### D. CTA Button

**Text**: `YES! Send me 5 Clear Air Purifiers
                            for Only $9 each `
**Tag**: `<button>` | **ID**: `#iwjle`

**CTA Class Styles:**
`.btn-primary`:
```css
  background-color: #1ab22c;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 1px;
  margin-top: 35.2px;
  outline: none;
  padding: 8.8px;
  transition: all 600ms cubic-bezier(0, 0.3, 0.7, 1);
```

`.btn-primary:hover`:
```css
  background-color: #1ab22c;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 1px;
  margin-top: 35.2px;
  outline: none;
  padding: 8.8px;
  transition: all 600ms cubic-bezier(0, 0.3, 0.7, 1);
```

`.fk-youtube .play-button`:
```css
  background-color: #333;
  border-radius: 6px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.6);
  height: 60px;
  opacity: 0.8;
  width: 90px;
  z-index: 1;
```

`.yotpo-close-modal.yotpo-icon-btn-small .yotpo-icon.yotpo-icon-cross`:
```css
  background: red !important;
  border: 2px solid black !important;
  border-radius: 5px !important;
  box-sizing: border-box !important;
  color: white !important;
```

### E. Opt-Out (Negative Option)

_No opt-out found_

### F. Price Elements

_No price-specific CSS found (prices rendered via JS)_

### G. Guarantee

_No guarantee found_

### H. Key ID-Based CSS (Conversion-Relevant)

```css
  #bodyElementDummy {
    display: none;
  }
  #fkt-image-51b-caf-b80 {
    height: auto;
    width: auto !important;
  }
  #fkt-image-ac3-88c-b65 {
    height: 150px;
    width: 150px;
  }
  #fkt-image-eec-99e-858 {
    height: 50px;
    width: 200px;
  }
  #iwjle {
    flex: 0 0;
  }
  #izau3 {
    font-weight: 700;
  }
```

### I. Key Class-Based CSS

```css
  .AD_25px {
    background-position: 0 0px;
  }
  .AE_25px {
    background-position: 0 -25px;
  }
  .AF_25px {
    background-position: 0 -50px;
  }
  .AG_25px {
    background-position: 0 -75px;
  }
  .AI_25px {
    background-position: 0 -100px;
  }
  .AIs6iEbf9UqkqPBo2ltj_,
        .vTejYh3eCvcK7lRihCOoE ._2nCLeYL5EZBblBAAOtOCuk .AIs6iEbf9UqkqPBo2ltj_ {
    border-radius: 3px;
    display: flex;
    margin-top: 0.4rem;
    padding: 10px;
    width: 90%;
  }
  .AIs6iEbf9UqkqPBo2ltj_._2DFz4-s4Ae8O4NaBK9mzmC,
        .vTejYh3eCvcK7lRihCOoE ._2nCLeYL5EZBblBAAOtOCuk .AIs6iEbf9UqkqPBo2ltj_._2DFz4-s4Ae8O4NaBK9mzmC {
    background-color: #f4f4f4;
  }
  .AL_25px {
    background-position: 0 -125px;
  }
  .AM_25px {
    background-position: 0 -150px;
  }
  .AO_25px {
    background-position: 0 -175px;
  }
  .AR_25px {
    background-position: 0 -200px;
  }
  .AS_25px {
    background-position: 0 -225px;
  }
  .AT_25px {
    background-position: 0 -250px;
  }
  .AU_25px {
    background-position: 0 -275px;
  }
  .AW_25px {
    background-position: 0 -300px;
  }
  .AX_25px {
    background-position: 0 -325px;
  }
  .AZ_25px {
    background-position: 0 -350px;
  }
  .BA_25px {
    background-position: 0 -375px;
  }
  .BB_25px {
    background-position: 0 -400px;
  }
  .BD_25px {
    background-position: 0 -425px;
  }
  .BE_25px {
    background-position: 0 -450px;
  }
  .BF_25px {
    background-position: 0 -475px;
  }
  .BG_25px {
    background-position: 0 -500px;
  }
  .BH_25px {
    background-position: 0 -525px;
  }
  .BI_25px {
    background-position: 0 -550px;
  }
  .BJ_25px {
    background-position: 0 -575px;
  }
  .BM_25px {
    background-position: 0 -600px;
  }
  .BN_25px {
    background-position: 0 -625px;
  }
  .BO_25px {
    background-position: 0 -650px;
  }
  .BR_25px {
    background-position: 0 -675px;
  }
  .BS_25px {
    background-position: 0 -700px;
  }
  .BT_25px {
    background-position: 0 -725px;
  }
  .BW_25px {
    background-position: 0 -750px;
  }
  .BY_25px {
    background-position: 0 -775px;
  }
  .BZ_25px {
    background-position: 0 -800px;
  }
  .CA_25px {
    background-position: 0 -825px;
  }
  .CBiOYQVFHfGbez1vPW5Eu {
    background-color: #323232;
    color: white;
  }
  .CC_25px {
    background-position: 0 -850px;
  }
  .CD_25px {
    background-position: 0 -875px;
  }
  .CF_25px {
    background-position: 0 -900px;
  }
  .CG_25px {
    background-position: 0 -925px;
  }
  .CH_25px {
    background-position: 0 -950px;
  }
  .CL_25px {
    background-position: 0 -975px;
  }
  .CM_25px {
    background-position: 0 -1000px;
  }
  .CN_25px {
    background-position: 0 -1025px;
  }
  .CO_25px {
    background-position: 0 -1050px;
  }
  .CR_25px {
    background-position: 0 -1075px;
  }
  .CU_25px {
    background-position: 0 -1100px;
  }
  .CV_25px {
    background-position: 0 -1125px;
  }
  .CX_25px {
    background-position: 0 -1150px;
  }
  .CY_25px {
    background-position: 0 -1175px;
  }
  .CZ_25px {
    background-position: 0 -1200px;
  }
  .DE_25px {
    background-position: 0 -1225px;
  }
  .DJ_25px {
    background-position: 0 -1250px;
  }
  .DK_25px {
    background-position: 0 -1275px;
  }
  .DM_25px {
    background-position: 0 -1300px;
  }
  .DO_25px {
    background-position: 0 -1325px;
  }
  .DZ_25px {
    background-position: 0 -1350px;
  }
  .EC_25px {
    background-position: 0 -1375px;
  }
  .EE_25px {
    background-position: 0 -1400px;
  }
  .EG_25px {
    background-position: 0 -1425px;
  }
  .EH_25px {
    background-position: 0 -1450px;
  }
  .ER_25px {
    background-position: 0 -1475px;
  }
  .ERxklc1DEy6MRbHq8F_oL ._3qG_M93hEacQkijHPJkGp3 {
    align-items: center;
    background-color: #323232;
    border: 2px solid rgba(40, 40, 80, 0.3);
    border-radius: 3px;
    color: white;
    display: flex;
    font-size: 16px;
    justify-content: space-between;
    line-height: 140%;
    padding: 13.33333px 20px;
    text-align: left;
  }
  .ERxklc1DEy6MRbHq8F_oL .xFfiAqzH9NFPaQ_MJUds_ {
    color: #323232;
    font-size: 14px;
    line-height: 180%;
    padding: 20px 40px;
    text-align: left;
  }
  .ES_25px {
    background-position: 0 -1500px;
  }
  .ET_25px {
    background-position: 0 -1525px;
  }
  .FI_25px {
    background-position: 0 -1550px;
  }
  .FJ_25px {
    background-position: 0 -1575px;
  }
  .FK_25px {
    background-position: 0 -1600px;
  }
  .FM_25px {
    background-position: 0 -1625px;
  }
  .FO_25px {
    background-position: 0 -1650px;
  }
  .FR_25px {
    background-position: 0 -1675px;
  }
  .FamgNeTLmEx83Uzx_1NaQ {
    color: #323232;
    font-size: 0.9rem;
    font-weight: normal;
  }
  .G7lcMZWWCM-fOTm8KoSxB {
    align-items: center;
    background-color: #89a383;
    border-radius: 50%;
    color: white;
    display: flex;
    height: 2.5rem;
    justify-content: center;
    margin-right: 0.5rem;
    padding: 4px;
    position: relative;
    width: 2.5rem;
  }
  .GA_25px {
    background-position: 0 -1700px;
  }
  .GB_25px {
    background-position: 0 -1725px;
  }
  .GCMqIV_Qclk3NatceK653 ._2AGbX7Mg4BOLr5JAZNj8Ld {
    background-color: rgba(50, 50, 50, 0.1);
    height: 1px;
    margin-bottom: 20px;
  }
  .GCMqIV_Qclk3NatceK653 ._35Nj9y3o_mxX3bUWTYbUTQ {
    align-items: center;
    display: flex;
    font-size: 12px;
    font-weight: 200;
    margin: 5px 0 0 1px;
  }
  .GD_25px {
    background-position: 0 -1750px;
  }
  .GE_25px {
    background-position: 0 -1775px;
  }
  .GF_25px {
    background-position: 0 -1800px;
  }
  .GH_25px {
    background-position: 0 -1825px;
  }
  .GI_25px {
    background-position: 0 -1850px;
  }
  .GL_25px {
    background-position: 0 -1875px;
  }
  .GM_25px {
    background-position: 0 -1900px;
  }
  .GN_25px {
    background-position: 0 -1925px;
  }
  .GP_25px {
    background-position: 0 -1950px;
  }
  .GQ_25px {
    background-position: 0 -1975px;
  }
  .GR_25px {
    background-position: 0 -2000px;
  }
  .GT_25px {
    background-position: 0 -2025px;
  }
  .GW_25px {
    background-position: 0 -2050px;
  }
  .GY_25px {
    background-position: 0 -2075px;
  }
  .GrCbT77cZ3fSodwurZxaE,
        ._3ug74DsppSWcd9Mr08we_O ._2aoXngB9i7hXnWxW9feDj7 .GrCbT77cZ3fSodwurZxaE {
    align-items: center;
    display: flex;
    font-size: 11px;
    font-weight: bold;
    margin-top: 3px;
  }
  .HH5BcFkiFC7Nljlmy12A4 .MhGHhOA0lJjLWqgG7Mggw {
    border-radius: 4px;
    border-style: solid;
    border-width: 1px;
    padding: 0.5rem;
  }
  .HH5BcFkiFC7Nljlmy12A4 ._3e6CJniDBfmcZztBvIHnrl {
    padding-top: 4px;
  }
  .HK_25px {
    background-position: 0 -2100px;
  }
  .HN_25px {
    background-position: 0 -2125px;
  }
  .HR_25px {
    background-position: 0 -2150px;
  }
  .HT_25px {
    background-position: 0 -2175px;
  }
  .HU_25px {
    background-position: 0 -2200px;
  }
  .I9R-4mT-75umb_ObLZAsE,
        ._3eBT-caf7Z2L7t3J6X2-j6 ._21ffV9cayPfHIkFdZ_XvWn .I9R-4mT-75umb_ObLZAsE,
        ._18ikUvP25CDHcrfz1MsnXQ ._21ffV9cayPfHIkFdZ_XvWn .oAPVXsJiQ_ivBy1znc2Gg,
        ._3eBT-caf7Z2L7t3J6X2-j6 ._21ffV9cayPfHIkFdZ_XvWn .oAPVXsJiQ_ivBy1znc2Gg {
    border: 3px #474747 solid;
    border-radius: 2px;
  }
  .IE_25px {
    background-position: 0 -2225px;
  }
  .IL_25px {
    background-position: 0 -2250px;
  }
  .IM_25px {
    background-position: 0 -2275px;
  }
  .IN_25px {
    background-position: 0 -2300px;
  }
  .IO_25px {
    background-position: 0 -2325px;
  }
  .IQ_25px {
    background-position: 0 -2350px;
  }
  .IR_25px {
    background-position: 0 -2375px;
  }
  .IS_25px {
    background-position: 0 -2400px;
  }
  .IT_25px {
    background-position: 0 -2425px;
  }
  .In37K49i342Itc7t84w5h {
    background-color: white;
    border-radius: 5px;
    box-shadow: 0 2vh 10vh rgba(0, 0, 0, 0.3);
    height: 90%;
    max-width: 1200px;
    overflow: hidden;
    width: 90%;
  }
  .JE_25px {
    background-position: 0 -2450px;
  }
  .JM_25px {
    background-position: 0 -2475px;
  }
  .JO_25px {
    background-position: 0 -2500px;
  }
  .JP_25px {
    background-position: 0 -2525px;
  }
  .KE_25px {
    background-position: 0 -2550px;
  }
  .KG_25px {
    background-position: 0 -2575px;
  }
  .KH_25px {
    background-position: 0 -2600px;
  }
  .KI_25px {
    background-position: 0 -2625px;
  }
  .KM_25px {
    background-position: 0 -2650px;
  }
  .KN_25px {
    background-position: 0 -2675px;
  }
  .KP_25px {
    background-position: 0 -2700px;
  }
  .KR_25px {
    background-position: 0 -2725px;
  }
  .KW_25px {
    background-position: 0 -2750px;
  }
  .KY_25px {
    background-position: 0 -2775px;
  }
  .KZ_25px {
    background-position: 0 -2800px;
  }
  .L1dT-sUvPlZsvAwSwE6re {
    color: #323232;
    font-size: 1rem;
    margin: 4px auto;
  }
  .LA_25px {
    background-position: 0 -2825px;
  }
  .LB_25px {
    background-position: 0 -2850px;
  }
  .LC_25px {
    background-position: 0 -2875px;
  }
  .LI_25px {
    background-position: 0 -2900px;
  }
  .LK_25px {
    background-position: 0 -2925px;
  }
  .LR_25px {
    background-position: 0 -2950px;
  }
  .LS_25px {
    background-position: 0 -2975px;
  }
  .LT_25px {
    background-position: 0 -3000px;
  }
  .LU_25px {
    background-position: 0 -3025px;
  }
  .LV_25px {
    background-position: 0 -3050px;
  }
  .LY_25px {
    background-position: 0 -3075px;
  }
  .MA_25px {
    background-position: 0 -3100px;
  }
  .MC_25px {
    background-position: 0 -3125px;
  }
  .MD_25px {
    background-position: 0 -3150px;
  }
  .MG_25px {
    background-position: 0 -3175px;
  }
  .MH_25px {
    background-position: 0 -3200px;
  }
  .MK_25px {
    background-position: 0 -3225px;
  }
  .ML_25px {
    background-position: 0 -3250px;
  }
  .MM_25px {
    background-position: 0 -3275px;
  }
  .MN_25px {
    background-position: 0 -3300px;
  }
  .MP_25px {
    background-position: 0 -3325px;
  }
  .MQ_25px {
    background-position: 0 -3350px;
  }
  .MR_25px {
    background-position: 0 -3375px;
  }
  .MS_25px {
    background-position: 0 -3400px;
  }
  .MT_25px {
    background-position: 0 -3425px;
  }
  .MU_25px {
    background-position: 0 -3450px;
  }
  .MV_25px {
    background-position: 0 -3475px;
  }
  .MW_25px {
    background-position: 0 -3500px;
  }
  .MX_25px {
    background-position: 0 -3525px;
  }
  .MY_25px {
    background-position: 0 -3550px;
  }
  .MZ_25px {
    background-position: 0 -3575px;
  }
  .MowGJB0-86qBzKLnJwrBA ._1_qdewUQ53jSdFSJP1PHxW {
    padding-bottom: 1rem;
  }
  .MowGJB0-86qBzKLnJwrBA ._3ZBIDpy0mQ4NkMkhRuDCR7 {
    font-size: 12px;
    font-weight: normal;
    line-height: 160%;
    margin-top: 10px;
    text-align: left;
  }
  .NA_25px {
    background-position: 0 -3600px;
  }
  .NE_25px {
    background-position: 0 -3625px;
  }
  .NG_25px {
    background-position: 0 -3650px;
  }
  .NI_25px {
    background-position: 0 -3675px;
  }
  .NL_25px {
    background-position: 0 -3700px;
  }
  .NO_25px {
    background-position: 0 -3725px;
  }
  .NP_25px {
    background-position: 0 -3750px;
  }
  .NR_25px {
    background-position: 0 -3775px;
  }
  .NVxISeEA3XlEhoEVZlQnd {
    -webkit-animation: _3u5YnePr2qJC3i9uUdgTnc 12s linear infinite;
    animation: _3u5YnePr2qJC3i9uUdgTnc 12s linear infinite;
    border: 2px dashed white;
    border-radius: 100%;
    height: 84px;
    position: absolute;
    width: 84px;
  }
  .NZ_25px {
    background-position: 0 -3800px;
  }
  .OM_25px {
    background-position: 0 -3825px;
  }
  .PA_25px {
    background-position: 0 -3850px;
  }
  .PE_25px {
    background-position: 0 -3875px;
  }
  .PF_25px {
    background-position: 0 -3900px;
  }
  .PG_25px {
    background-position: 0 -3925px;
  }
  .PH_25px {
    background-position: 0 -3950px;
  }
  .PK_25px {
    background-position: 0 -3975px;
  }
  .PL_25px {
    background-position: 0 -4000px;
  }
  .PM_25px {
    background-position: 0 -4025px;
  }
  .PR_25px {
    background-position: 0 -4050px;
  }
  .PT_25px {
    background-position: 0 -4075px;
  }
  .PW_25px {
    background-position: 0 -4100px;
  }
  .PY_25px {
    background-position: 0 -4125px;
  }
  .QA_25px {
    background-position: 0 -4150px;
  }
  .RE_25px {
    background-position: 0 -4175px;
  }
  .RO_25px {
    background-position: 0 -4200px;
  }
  .RS_25px {
    background-position: 0 -4225px;
  }
  .RU_25px {
    background-position: 0 -4250px;
  }
  .RW_25px {
    background-position: 0 -4275px;
  }
  .SA_25px {
    background-position: 0 -4300px;
  }
  .SB_25px {
    background-position: 0 -4325px;
  }
  .SC_25px {
    background-position: 0 -4350px;
  }
  .SD_25px {
    background-position: 0 -4375px;
  }
  .SE_25px {
    background-position: 0 -4400px;
  }
  .SG_25px {
    background-position: 0 -4425px;
  }
  .SH_25px {
    background-position: 0 -4450px;
  }
  .SI_25px {
    background-position: 0 -4475px;
  }
  .SK_25px {
    background-position: 0 -4500px;
  }
  .SL_25px {
    background-position: 0 -4525px;
  }
  .SM_25px {
    background-position: 0 -4550px;
  }
  .SN_25px {
    background-position: 0 -4575px;
  }
  .SO_25px {
    background-position: 0 -4600px;
  }
  .SR_25px {
    background-position: 0 -4625px;
  }
  .SS_25px {
    background-position: 0 -4650px;
  }
  .SV_25px {
    background-position: 0 -4675px;
  }
  .SY_25px {
    background-position: 0 -4700px;
  }
  .SZ_25px {
    background-position: 0 -4725px;
  }
  .TC_25px {
    background-position: 0 -4750px;
  }
  .TD_25px {
    background-position: 0 -4775px;
  }
  .TF_25px {
    background-position: 0 -4800px;
  }
  .TG_25px {
    background-position: 0 -4825px;
  }
  .TH_25px {
    background-position: 0 -4850px;
  }
  .TJ_25px {
    background-position: 0 -4875px;
  }
  .TM_25px {
    background-position: 0 -4900px;
  }
  .TN_25px {
    background-position: 0 -4925px;
  }
  .TO_25px {
    background-position: 0 -4950px;
  }
  .TR_25px {
    background-position: 0 -4975px;
  }
  .TT_25px {
    background-position: 0 -5000px;
  }
  .TV_25px {
    background-position: 0 -5025px;
  }
  .TW_25px {
    background-position: 0 -5050px;
  }
  .TZ_25px {
    background-position: 0 -5075px;
  }
  .UA_25px {
    background-position: 0 -5100px;
  }
  .UFTTmf4ibWuxFlB3zG_8M,
        .vTejYh3eCvcK7lRihCOoE ._3sK-HIWLy1TBLAaqiMmfKP .UFTTmf4ibWuxFlB3zG_8M {
    color: #5c909b;
    padding-left: 0.5rem;
  }
  .UG_25px {
    background-position: 0 -5125px;
  }
  .US_25px {
    background-position: 0 -5150px;
  }
  .UY_25px {
    background-position: 0 -5175px;
  }
  .UZ_25px {
    background-position: 0 -5200px;
  }
  .VA_25px {
    background-position: 0 -5225px;
  }
  .VC_25px {
    background-position: 0 -5250px;
  }
  .VE_25px {
    background-position: 0 -5275px;
  }
  .VG_25px {
    background-position: 0 -5300px;
  }
  .VI_25px {
    background-position: 0 -5325px;
  }
  .VN_25px {
    background-position: 0 -5350px;
  }
  .VU_25px {
    background-position: 0 -5375px;
  }
  .WS_25px {
    background-position: 0 -5400px;
  }
  .X9C1UR7aKWoQ25ioe_o0t ._2M3sIExapNLIKikB_MGkZg {
    color: #666667;
  }
  .YE_25px {
    background-position: 0 -5425px;
  }
  .YT_25px {
    background-position: 0 -5450px;
  }
  .ZA_25px {
    background-position: 0 -5475px;
  }
  .ZM_25px {
    background-position: 0 -5500px;
  }
  .ZW_25px {
    background-position: 0 -5525px;
  }
  .bXEHHNudOC_AVXF1Z0Efi {
    font-size: large;
    font-weight: bolder;
    line-height: 1rem;
    text-align: left;
  }
  .btn-primary {
    background-color: #1ab22c;
    border-radius: 5px;
    color: white;
    cursor: pointer;
    font-size: 18px;
    font-weight: bold;
    letter-spacing: 1px;
    margin-top: 35.2px;
    outline: none;
    padding: 8.8px;
    transition: all 600ms cubic-bezier(0, 0.3, 0.7, 1);
  }
  .btn-primary:hover {
    background-color: #1ab22c;
    border-radius: 5px;
    color: white;
    cursor: pointer;
    font-size: 18px;
    font-weight: bold;
    letter-spacing: 1px;
    margin-top: 35.2px;
    outline: none;
    padding: 8.8px;
    transition: all 600ms cubic-bezier(0, 0.3, 0.7, 1);
  }
  .d67E1vMVN9hKY2RuJfvcF ._1SU_1l7NRE4_4HeO73a9cG {
    font-size: 22px;
    margin: 1.4rem 0 0.5rem 0;
    padding: 0 15px;
  }
  .d67E1vMVN9hKY2RuJfvcF ._2j4ceEmaxKgn_aEmbDEgfj {
    background-color: white !important;
    border: unset;
    color: black;
    cursor: pointer;
    font-size: 1.5rem !important;
    font-weight: 300;
    line-height: 1.6rem;
    margin: 0 !important;
    padding: 0 !important;
    position: absolute;
    right: 15px;
    top: 15px;
    width: unset !important;
  }
  .d67E1vMVN9hKY2RuJfvcF ._3ZGFbdHDkNghT28ondmIZp {
    font-size: 16px;
    margin-top: 8px;
    padding: 0 15px;
  }
  .d67E1vMVN9hKY2RuJfvcF .mI1bIfEooIJRvwVYblI1v {
    background-color: #ededed;
    height: 1px;
    width: 100%;
  }
  .eSNl_WwyPdan9T4mntWvG {
    -moz-user-select: none;
    -ms-user-select: none;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    align-items: center;
    border-bottom: 2px whitesmoke solid;
    cursor: pointer;
    display: flex;
    height: 80px;
    min-height: 50px;
    user-select: none;
  }
  .fk-youtube .fk-rm.image {
    -webkit-background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    height: 100%;
    position: absolute;
    width: 100%;
  }
  .fk-youtube .play-button {
    background-color: #333;
    border-radius: 6px;
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.6);
    height: 60px;
    opacity: 0.8;
    width: 90px;
    z-index: 1;
  }
  .fk-youtube .play-button:before {
    border-color: transparent transparent transparent #fff;
    border-style: solid;
    border-width: 15px 0 15px 26.0px;
    content: "";
  }
  .gXamJyQ_Wt9dYwaLd-sXA ._1s3P8BRVKw__qNAsZ1Z0MN ._1QwIr9xSNLO_m0AsBwv7Jf {
    background-color: whitesmoke;
    border-radius: 10px;
    height: 15px;
    margin-top: 20px;
    overflow: hidden;
    padding: 6px;
  }
  .gXamJyQ_Wt9dYwaLd-sXA ._1s3P8BRVKw__qNAsZ1Z0MN ._1QwIr9xSNLO_m0AsBwv7Jf ._1X8jpjsZ2yy88o_Aq7oD1F {
    -webkit-animation: _1In82js7Wmt2lS9HB6pZnL 1s linear infinite;
    animation: _1In82js7Wmt2lS9HB6pZnL 1s linear infinite;
    background-color: #1ab22c;
    background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);
    background-size: 40px 40px;
    border-radius: 10px;
    height: 100%;
    transition: all 2500ms cubic-bezier(0.2, 0.6, 0.6, 0.95);
  }
  .gXamJyQ_Wt9dYwaLd-sXA ._1s3P8BRVKw__qNAsZ1Z0MN ._2OjtxqxV7Z-E8Q2Y4a3mx6 {
    color: black;
    font-size: 16px;
    font-weight: bold;
  }
  .i59VT2R06KRH_suaW4_d5,
        ._3eBT-caf7Z2L7t3J6X2-j6 ._21ffV9cayPfHIkFdZ_XvWn._3mO11n1YFhXV5T_954uhx_.i59VT2R06KRH_suaW4_d5 {
    -webkit-animation: _2JOBaSB3lCNo6sPT0Z4IAx 0.4s ease;
    animation: _2JOBaSB3lCNo6sPT0Z4IAx 0.4s ease;
  }
  .image-gallery-bullets .image-gallery-bullet {
    padding: 2.7px;
  }
  .image-gallery-bullets .image-gallery-bullet.active {
    background: #fff;
  }
  .image-gallery-bullets .image-gallery-bullet:focus,
        .image-gallery-bullets .image-gallery-bullet:hover {
    background: #337ab7;
    transform: scale(1.1);
  }
  .image-gallery-bullets .image-gallery-bullets.scraped-container {
    margin: 0;
    padding: 0;
    text-align: center;
  }
  .image-gallery-slide .image-gallery-description {
    bottom: 45px;
    font-size: .8em;
    padding: 8px 15px;
  }
  .image-gallery-thumbnails-wrapper.left .image-gallery-thumbnails .image-gallery-thumbnail,
        .image-gallery-thumbnails-wrapper.right .image-gallery-thumbnails .image-gallery-thumbnail {
    display: block;
    margin-right: 0;
    padding: 0;
  }
  .image-gallery-thumbnails-wrapper.left .image-gallery-thumbnails,
        .image-gallery-thumbnails-wrapper.right .image-gallery-thumbnails {
    height: 100%;
    left: 0;
    padding: 0;
    position: absolute;
    top: 0;
    width: 100%;
  }
  .j7nw2156hcT8fjGrlqexr {
    display: flex;
    padding: 10px 0;
  }
  .main {
    background-color: whitesmoke;
  }
  .nXFIVse6Goo_SkQdzVsyt {
    background-color: white;
    margin: 8.8px 0;
    padding: 8.8px 0;
  }
  .ndhv3JBskvHN0dJtC7dpr {
    -webkit-animation: DNutUMIDhPFLy5hbNphJg 2s linear infinite;
    animation: DNutUMIDhPFLy5hbNphJg 2s linear infinite;
    bottom: 0;
    height: 100%;
    left: 0;
    margin: auto;
    position: absolute;
    right: 0;
    top: 0;
    transform-origin: center center;
    width: 100%;
  }
  .ndhv3JBskvHN0dJtC7dpr ._3J-1b0JUEHFIu3aHQiXY2m {
    -webkit-animation: UgX3W_HhivQrETKdD6X_c 1.5s ease-in-out infinite;
    animation: UgX3W_HhivQrETKdD6X_c 1.5s ease-in-out infinite;
    stroke: rgba(0, 0, 0, 0.2);
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
    stroke-linecap: round;
  }
  .oAPVXsJiQ_ivBy1znc2Gg,
        ._3eBT-caf7Z2L7t3J6X2-j6 ._21ffV9cayPfHIkFdZ_XvWn .oAPVXsJiQ_ivBy1znc2Gg {
    background-color: #1ab22c;
    border-color: #1ab22c;
  }
  .qsJPd_oEWG2lywXPD0a66 ._1-5wFy0rJNbLwXFG0xG4sa {
    background: #d8dce2;
    border-radius: 5px;
    font-size: 1.1rem;
    line-height: 1.25rem;
    padding: 0.5rem;
  }
  .qsJPd_oEWG2lywXPD0a66 ._2GJYv6Bk7-6qpy4rN_l5NJ {
    color: green;
    padding: 0.5rem;
  }
  .ufuTSZ5BObomevjoHGiLC .Fe58O0X7CwMwtwEMeV8iP {
    font-size: 12px;
  }
  .vTejYh3eCvcK7lRihCOoE ._27tk3yj6WZpa9R_3CyMVrr {
    align-items: flex-start;
    align-self: flex-start;
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    justify-content: flex-start;
    padding: 4px;
  }
  .vTejYh3eCvcK7lRihCOoE ._27tk3yj6WZpa9R_3CyMVrr ._2ajy_cAehVVryWZIXfCycW {
    border: 1px solid #666667;
    font-size: 0.9rem;
    height: 100%;
    margin-left: 8px;
    margin-top: 2px;
    padding: 6px;
    width: 25%;
  }
  .vTejYh3eCvcK7lRihCOoE ._2KRVLJzSq1J-7huwd3hAd7 {
    padding-left: 4px;
  }
  .vTejYh3eCvcK7lRihCOoE ._2nCLeYL5EZBblBAAOtOCuk {
    font-size: 1.2rem;
    font-weight: normal;
    line-height: 1.1rem;
    margin: 12px 0 14px;
    width: 100%;
  }
  .vTejYh3eCvcK7lRihCOoE ._2nCLeYL5EZBblBAAOtOCuk ._2jHpMojDwPNJGgSt60JlsE {
    padding-bottom: 8px;
  }
  .vTejYh3eCvcK7lRihCOoE ._2nCLeYL5EZBblBAAOtOCuk ._2veNj-PsWe3wKXWQUYXXMZ {
    padding-left: 6px;
    width: 100%;
  }
  .vTejYh3eCvcK7lRihCOoE ._2zZXxl2dDQvKEhLTIAVk9m {
    font-size: 1.2rem;
  }
  .vTejYh3eCvcK7lRihCOoE ._3EgFLmBMjjTqYjBAUwxjhe {
    align-items: flex-start;
    display: flex;
    justify-content: flex-start;
    padding: 0 8px;
  }
  .vTejYh3eCvcK7lRihCOoE ._3eZE4T4NMF2tId8u7cCv50 {
    color: #06a015;
    font-size: 1rem;
    font-weight: bold;
  }
  .vhClywwBOSDOuuTFKr8YP {
    background-color: #000000;
    color: white;
  }
  .xvxeQN82BJ2CYoJBUxuuA .AD_56px {
    background-position: 0 0px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .AE_56px {
    background-position: 0 -56px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .AF_56px {
    background-position: 0 -112px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .AG_56px {
    background-position: 0 -168px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .AI_56px {
    background-position: 0 -224px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .AL_56px {
    background-position: 0 -280px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .AM_56px {
    background-position: 0 -336px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .AO_56px {
    background-position: 0 -392px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .AR_56px {
    background-position: 0 -448px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .AS_56px {
    background-position: 0 -504px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .AT_56px {
    background-position: 0 -560px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .AU_56px {
    background-position: 0 -616px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .AW_56px {
    background-position: 0 -672px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .AX_56px {
    background-position: 0 -728px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .AZ_56px {
    background-position: 0 -784px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .BA_56px {
    background-position: 0 -840px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .BB_56px {
    background-position: 0 -896px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .BD_56px {
    background-position: 0 -952px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .BE_56px {
    background-position: 0 -1008px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .BF_56px {
    background-position: 0 -1064px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .BG_56px {
    background-position: 0 -1120px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .BH_56px {
    background-position: 0 -1176px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .BI_56px {
    background-position: 0 -1232px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .BJ_56px {
    background-position: 0 -1288px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .BM_56px {
    background-position: 0 -1344px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .BN_56px {
    background-position: 0 -1400px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .BO_56px {
    background-position: 0 -1456px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .BR_56px {
    background-position: 0 -1512px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .BS_56px {
    background-position: 0 -1568px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .BT_56px {
    background-position: 0 -1624px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .BW_56px {
    background-position: 0 -1680px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .BY_56px {
    background-position: 0 -1736px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .BZ_56px {
    background-position: 0 -1792px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .CA_56px {
    background-position: 0 -1848px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .CC_56px {
    background-position: 0 -1904px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .CD_56px {
    background-position: 0 -1960px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .CF_56px {
    background-position: 0 -2016px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .CG_56px {
    background-position: 0 -2072px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .CH_56px {
    background-position: 0 -2128px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .CL_56px {
    background-position: 0 -2184px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .CM_56px {
    background-position: 0 -2240px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .CN_56px {
    background-position: 0 -2296px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .CO_56px {
    background-position: 0 -2352px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .CR_56px {
    background-position: 0 -2408px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .CU_56px {
    background-position: 0 -2464px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .CV_56px {
    background-position: 0 -2520px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .CX_56px {
    background-position: 0 -2576px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .CY_56px {
    background-position: 0 -2632px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .CZ_56px {
    background-position: 0 -2688px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .DE_56px {
    background-position: 0 -2744px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .DJ_56px {
    background-position: 0 -2800px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .DK_56px {
    background-position: 0 -2856px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .DM_56px {
    background-position: 0 -2912px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .DO_56px {
    background-position: 0 -2968px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .DZ_56px {
    background-position: 0 -3024px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .EC_56px {
    background-position: 0 -3080px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .EE_56px {
    background-position: 0 -3136px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .EG_56px {
    background-position: 0 -3192px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .EH_56px {
    background-position: 0 -3248px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .ER_56px {
    background-position: 0 -3304px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .ES_56px {
    background-position: 0 -3360px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .ET_56px {
    background-position: 0 -3416px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .FI_56px {
    background-position: 0 -3472px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .FJ_56px {
    background-position: 0 -3528px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .FK_56px {
    background-position: 0 -3584px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .FM_56px {
    background-position: 0 -3640px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .FO_56px {
    background-position: 0 -3696px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .FR_56px {
    background-position: 0 -3752px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .GA_56px {
    background-position: 0 -3808px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .GB_56px {
    background-position: 0 -3864px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .GD_56px {
    background-position: 0 -3920px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .GE_56px {
    background-position: 0 -3976px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .GF_56px {
    background-position: 0 -4032px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .GH_56px {
    background-position: 0 -4088px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .GI_56px {
    background-position: 0 -4144px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .GL_56px {
    background-position: 0 -4200px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .GM_56px {
    background-position: 0 -4256px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .GN_56px {
    background-position: 0 -4312px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .GP_56px {
    background-position: 0 -4368px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .GQ_56px {
    background-position: 0 -4424px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .GR_56px {
    background-position: 0 -4480px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .GT_56px {
    background-position: 0 -4536px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .GW_56px {
    background-position: 0 -4592px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .GY_56px {
    background-position: 0 -4648px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .HK_56px {
    background-position: 0 -4704px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .HN_56px {
    background-position: 0 -4760px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .HR_56px {
    background-position: 0 -4816px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .HT_56px {
    background-position: 0 -4872px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .HU_56px {
    background-position: 0 -4928px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .IE_56px {
    background-position: 0 -4984px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .IL_56px {
    background-position: 0 -5040px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .IM_56px {
    background-position: 0 -5096px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .IN_56px {
    background-position: 0 -5152px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .IO_56px {
    background-position: 0 -5208px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .IQ_56px {
    background-position: 0 -5264px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .IR_56px {
    background-position: 0 -5320px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .IS_56px {
    background-position: 0 -5376px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .IT_56px {
    background-position: 0 -5432px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .JE_56px {
    background-position: 0 -5488px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .JM_56px {
    background-position: 0 -5544px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .JO_56px {
    background-position: 0 -5600px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .JP_56px {
    background-position: 0 -5656px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .KE_56px {
    background-position: 0 -5712px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .KG_56px {
    background-position: 0 -5768px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .KH_56px {
    background-position: 0 -5824px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .KI_56px {
    background-position: 0 -5880px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .KM_56px {
    background-position: 0 -5936px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .KN_56px {
    background-position: 0 -5992px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .KP_56px {
    background-position: 0 -6048px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .KR_56px {
    background-position: 0 -6104px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .KW_56px {
    background-position: 0 -6160px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .KY_56px {
    background-position: 0 -6216px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .KZ_56px {
    background-position: 0 -6272px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .LA_56px {
    background-position: 0 -6328px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .LB_56px {
    background-position: 0 -6384px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .LC_56px {
    background-position: 0 -6440px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .LI_56px {
    background-position: 0 -6496px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .LK_56px {
    background-position: 0 -6552px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .LR_56px {
    background-position: 0 -6608px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .LS_56px {
    background-position: 0 -6664px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .LT_56px {
    background-position: 0 -6720px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .LU_56px {
    background-position: 0 -6776px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .LV_56px {
    background-position: 0 -6832px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .LY_56px {
    background-position: 0 -6888px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MA_56px {
    background-position: 0 -6944px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MC_56px {
    background-position: 0 -7000px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MD_56px {
    background-position: 0 -7056px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MG_56px {
    background-position: 0 -7112px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MH_56px {
    background-position: 0 -7168px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MK_56px {
    background-position: 0 -7224px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .ML_56px {
    background-position: 0 -7280px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MM_56px {
    background-position: 0 -7336px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MN_56px {
    background-position: 0 -7392px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MP_56px {
    background-position: 0 -7448px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MQ_56px {
    background-position: 0 -7504px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MR_56px {
    background-position: 0 -7560px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MS_56px {
    background-position: 0 -7616px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MT_56px {
    background-position: 0 -7672px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MU_56px {
    background-position: 0 -7728px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MV_56px {
    background-position: 0 -7784px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MW_56px {
    background-position: 0 -7840px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MX_56px {
    background-position: 0 -7896px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MY_56px {
    background-position: 0 -7952px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .MZ_56px {
    background-position: 0 -8008px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .NA_56px {
    background-position: 0 -8064px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .NE_56px {
    background-position: 0 -8120px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .NG_56px {
    background-position: 0 -8176px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .NI_56px {
    background-position: 0 -8232px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .NL_56px {
    background-position: 0 -8288px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .NO_56px {
    background-position: 0 -8344px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .NP_56px {
    background-position: 0 -8400px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .NR_56px {
    background-position: 0 -8456px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .NZ_56px {
    background-position: 0 -8512px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .OM_56px {
    background-position: 0 -8568px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .PA_56px {
    background-position: 0 -8624px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .PE_56px {
    background-position: 0 -8680px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .PF_56px {
    background-position: 0 -8736px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .PG_56px {
    background-position: 0 -8792px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .PH_56px {
    background-position: 0 -8848px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .PK_56px {
    background-position: 0 -8904px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .PL_56px {
    background-position: 0 -8960px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .PM_56px {
    background-position: 0 -9016px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .PR_56px {
    background-position: 0 -9072px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .PT_56px {
    background-position: 0 -9128px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .PW_56px {
    background-position: 0 -9184px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .PY_56px {
    background-position: 0 -9240px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .QA_56px {
    background-position: 0 -9296px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .RE_56px {
    background-position: 0 -9352px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .RO_56px {
    background-position: 0 -9408px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .RS_56px {
    background-position: 0 -9464px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .RU_56px {
    background-position: 0 -9520px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .RW_56px {
    background-position: 0 -9576px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .SA_56px {
    background-position: 0 -9632px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .SB_56px {
    background-position: 0 -9688px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .SC_56px {
    background-position: 0 -9744px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .SD_56px {
    background-position: 0 -9800px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .SE_56px {
    background-position: 0 -9856px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .SG_56px {
    background-position: 0 -9912px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .SH_56px {
    background-position: 0 -9968px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .SI_56px {
    background-position: 0 -10024px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .SK_56px {
    background-position: 0 -10080px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .SL_56px {
    background-position: 0 -10136px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .SM_56px {
    background-position: 0 -10192px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .SN_56px {
    background-position: 0 -10248px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .SO_56px {
    background-position: 0 -10304px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .SR_56px {
    background-position: 0 -10360px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .SS_56px {
    background-position: 0 -10416px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .SV_56px {
    background-position: 0 -10472px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .SY_56px {
    background-position: 0 -10528px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .SZ_56px {
    background-position: 0 -10584px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .TC_56px {
    background-position: 0 -10640px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .TD_56px {
    background-position: 0 -10696px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .TF_56px {
    background-position: 0 -10752px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .TG_56px {
    background-position: 0 -10808px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .TH_56px {
    background-position: 0 -10864px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .TJ_56px {
    background-position: 0 -10920px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .TM_56px {
    background-position: 0 -10976px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .TN_56px {
    background-position: 0 -11032px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .TO_56px {
    background-position: 0 -11088px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .TR_56px {
    background-position: 0 -11144px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .TT_56px {
    background-position: 0 -11200px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .TV_56px {
    background-position: 0 -11256px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .TW_56px {
    background-position: 0 -11312px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .TZ_56px {
    background-position: 0 -11368px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .UA_56px {
    background-position: 0 -11424px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .UG_56px {
    background-position: 0 -11480px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .US_56px {
    background-position: 0 -11536px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .UY_56px {
    background-position: 0 -11592px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .UZ_56px {
    background-position: 0 -11648px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .VA_56px {
    background-position: 0 -11704px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .VC_56px {
    background-position: 0 -11760px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .VE_56px {
    background-position: 0 -11816px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .VG_56px {
    background-position: 0 -11872px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .VI_56px {
    background-position: 0 -11928px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .VN_56px {
    background-position: 0 -11984px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .VU_56px {
    background-position: 0 -12040px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .WS_56px {
    background-position: 0 -12096px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .YE_56px {
    background-position: 0 -12152px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .YT_56px {
    background-position: 0 -12208px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .ZA_56px {
    background-position: 0 -12264px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .ZM_56px {
    background-position: 0 -12320px;
  }
  .xvxeQN82BJ2CYoJBUxuuA .ZW_56px {
    background-position: 0 -12376px;
  }
  .y7Lxdef35rl_xZd88Xven {
    color: #90949c;
    padding-left: 0.2rem;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .AD_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .AD_25px {
    background-position: 0 0px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .AE_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .AE_25px {
    background-position: 0 -25px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .AF_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .AF_25px {
    background-position: 0 -50px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .AG_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .AG_25px {
    background-position: 0 -75px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .AI_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .AI_25px {
    background-position: 0 -100px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .AL_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .AL_25px {
    background-position: 0 -125px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .AM_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .AM_25px {
    background-position: 0 -150px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .AO_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .AO_25px {
    background-position: 0 -175px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .AR_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .AR_25px {
    background-position: 0 -200px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .AS_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .AS_25px {
    background-position: 0 -225px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .AT_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .AT_25px {
    background-position: 0 -250px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .AU_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .AU_25px {
    background-position: 0 -275px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .AW_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .AW_25px {
    background-position: 0 -300px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .AX_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .AX_25px {
    background-position: 0 -325px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .AZ_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .AZ_25px {
    background-position: 0 -350px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .BA_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .BA_25px {
    background-position: 0 -375px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .BB_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .BB_25px {
    background-position: 0 -400px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .BD_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .BD_25px {
    background-position: 0 -425px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .BE_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .BE_25px {
    background-position: 0 -450px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .BF_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .BF_25px {
    background-position: 0 -475px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .BG_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .BG_25px {
    background-position: 0 -500px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .BH_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .BH_25px {
    background-position: 0 -525px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .BI_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .BI_25px {
    background-position: 0 -550px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .BJ_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .BJ_25px {
    background-position: 0 -575px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .BM_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .BM_25px {
    background-position: 0 -600px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .BN_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .BN_25px {
    background-position: 0 -625px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .BO_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .BO_25px {
    background-position: 0 -650px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .BR_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .BR_25px {
    background-position: 0 -675px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .BS_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .BS_25px {
    background-position: 0 -700px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .BT_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .BT_25px {
    background-position: 0 -725px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .BW_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .BW_25px {
    background-position: 0 -750px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .BY_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .BY_25px {
    background-position: 0 -775px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .BZ_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .BZ_25px {
    background-position: 0 -800px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .CA_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .CA_25px {
    background-position: 0 -825px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .CC_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .CC_25px {
    background-position: 0 -850px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .CD_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .CD_25px {
    background-position: 0 -875px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .CF_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .CF_25px {
    background-position: 0 -900px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .CG_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .CG_25px {
    background-position: 0 -925px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .CH_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .CH_25px {
    background-position: 0 -950px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .CL_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .CL_25px {
    background-position: 0 -975px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .CM_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .CM_25px {
    background-position: 0 -1000px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .CN_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .CN_25px {
    background-position: 0 -1025px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .CO_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .CO_25px {
    background-position: 0 -1050px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .CR_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .CR_25px {
    background-position: 0 -1075px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .CU_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .CU_25px {
    background-position: 0 -1100px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .CV_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .CV_25px {
    background-position: 0 -1125px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .CX_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .CX_25px {
    background-position: 0 -1150px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .CY_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .CY_25px {
    background-position: 0 -1175px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .CZ_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .CZ_25px {
    background-position: 0 -1200px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .DE_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .DE_25px {
    background-position: 0 -1225px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .DJ_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .DJ_25px {
    background-position: 0 -1250px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .DK_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .DK_25px {
    background-position: 0 -1275px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .DM_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .DM_25px {
    background-position: 0 -1300px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .DO_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .DO_25px {
    background-position: 0 -1325px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .DZ_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .DZ_25px {
    background-position: 0 -1350px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .EC_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .EC_25px {
    background-position: 0 -1375px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .EE_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .EE_25px {
    background-position: 0 -1400px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .EG_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .EG_25px {
    background-position: 0 -1425px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .EH_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .EH_25px {
    background-position: 0 -1450px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .ER_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .ER_25px {
    background-position: 0 -1475px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .ES_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .ES_25px {
    background-position: 0 -1500px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .ET_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .ET_25px {
    background-position: 0 -1525px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .FI_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .FI_25px {
    background-position: 0 -1550px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .FJ_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .FJ_25px {
    background-position: 0 -1575px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .FK_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .FK_25px {
    background-position: 0 -1600px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .FM_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .FM_25px {
    background-position: 0 -1625px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .FO_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .FO_25px {
    background-position: 0 -1650px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .FR_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .FR_25px {
    background-position: 0 -1675px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .GA_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .GA_25px {
    background-position: 0 -1700px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .GB_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .GB_25px {
    background-position: 0 -1725px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .GD_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .GD_25px {
    background-position: 0 -1750px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .GE_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .GE_25px {
    background-position: 0 -1775px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .GF_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .GF_25px {
    background-position: 0 -1800px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .GH_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .GH_25px {
    background-position: 0 -1825px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .GI_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .GI_25px {
    background-position: 0 -1850px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .GL_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .GL_25px {
    background-position: 0 -1875px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .GM_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .GM_25px {
    background-position: 0 -1900px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .GN_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .GN_25px {
    background-position: 0 -1925px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .GP_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .GP_25px {
    background-position: 0 -1950px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .GQ_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .GQ_25px {
    background-position: 0 -1975px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .GR_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .GR_25px {
    background-position: 0 -2000px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .GT_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .GT_25px {
    background-position: 0 -2025px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .GW_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .GW_25px {
    background-position: 0 -2050px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .GY_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .GY_25px {
    background-position: 0 -2075px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .HK_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .HK_25px {
    background-position: 0 -2100px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .HN_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .HN_25px {
    background-position: 0 -2125px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .HR_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .HR_25px {
    background-position: 0 -2150px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .HT_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .HT_25px {
    background-position: 0 -2175px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .HU_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .HU_25px {
    background-position: 0 -2200px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .IE_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .IE_25px {
    background-position: 0 -2225px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .IL_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .IL_25px {
    background-position: 0 -2250px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .IM_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .IM_25px {
    background-position: 0 -2275px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .IN_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .IN_25px {
    background-position: 0 -2300px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .IO_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .IO_25px {
    background-position: 0 -2325px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .IQ_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .IQ_25px {
    background-position: 0 -2350px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .IR_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .IR_25px {
    background-position: 0 -2375px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .IS_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .IS_25px {
    background-position: 0 -2400px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .IT_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .IT_25px {
    background-position: 0 -2425px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .JE_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .JE_25px {
    background-position: 0 -2450px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .JM_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .JM_25px {
    background-position: 0 -2475px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .JO_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .JO_25px {
    background-position: 0 -2500px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .JP_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .JP_25px {
    background-position: 0 -2525px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .KE_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .KE_25px {
    background-position: 0 -2550px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .KG_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .KG_25px {
    background-position: 0 -2575px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .KH_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .KH_25px {
    background-position: 0 -2600px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .KI_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .KI_25px {
    background-position: 0 -2625px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .KM_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .KM_25px {
    background-position: 0 -2650px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .KN_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .KN_25px {
    background-position: 0 -2675px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .KP_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .KP_25px {
    background-position: 0 -2700px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .KR_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .KR_25px {
    background-position: 0 -2725px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .KW_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .KW_25px {
    background-position: 0 -2750px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .KY_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .KY_25px {
    background-position: 0 -2775px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .KZ_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .KZ_25px {
    background-position: 0 -2800px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .LA_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .LA_25px {
    background-position: 0 -2825px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .LB_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .LB_25px {
    background-position: 0 -2850px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .LC_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .LC_25px {
    background-position: 0 -2875px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .LI_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .LI_25px {
    background-position: 0 -2900px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .LK_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .LK_25px {
    background-position: 0 -2925px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .LR_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .LR_25px {
    background-position: 0 -2950px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .LS_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .LS_25px {
    background-position: 0 -2975px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .LT_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .LT_25px {
    background-position: 0 -3000px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .LU_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .LU_25px {
    background-position: 0 -3025px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .LV_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .LV_25px {
    background-position: 0 -3050px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .LY_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .LY_25px {
    background-position: 0 -3075px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MA_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MA_25px {
    background-position: 0 -3100px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MC_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MC_25px {
    background-position: 0 -3125px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MD_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MD_25px {
    background-position: 0 -3150px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MG_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MG_25px {
    background-position: 0 -3175px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MH_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MH_25px {
    background-position: 0 -3200px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MK_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MK_25px {
    background-position: 0 -3225px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .ML_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .ML_25px {
    background-position: 0 -3250px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MM_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MM_25px {
    background-position: 0 -3275px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MN_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MN_25px {
    background-position: 0 -3300px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MP_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MP_25px {
    background-position: 0 -3325px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MQ_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MQ_25px {
    background-position: 0 -3350px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MR_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MR_25px {
    background-position: 0 -3375px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MS_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MS_25px {
    background-position: 0 -3400px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MT_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MT_25px {
    background-position: 0 -3425px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MU_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MU_25px {
    background-position: 0 -3450px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MV_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MV_25px {
    background-position: 0 -3475px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MW_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MW_25px {
    background-position: 0 -3500px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MX_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MX_25px {
    background-position: 0 -3525px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MY_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MY_25px {
    background-position: 0 -3550px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .MZ_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .MZ_25px {
    background-position: 0 -3575px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .NA_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .NA_25px {
    background-position: 0 -3600px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .NE_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .NE_25px {
    background-position: 0 -3625px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .NG_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .NG_25px {
    background-position: 0 -3650px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .NI_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .NI_25px {
    background-position: 0 -3675px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .NL_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .NL_25px {
    background-position: 0 -3700px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .NO_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .NO_25px {
    background-position: 0 -3725px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .NP_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .NP_25px {
    background-position: 0 -3750px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .NR_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .NR_25px {
    background-position: 0 -3775px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .NZ_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .NZ_25px {
    background-position: 0 -3800px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .OM_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .OM_25px {
    background-position: 0 -3825px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .PA_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .PA_25px {
    background-position: 0 -3850px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .PE_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .PE_25px {
    background-position: 0 -3875px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .PF_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .PF_25px {
    background-position: 0 -3900px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .PG_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .PG_25px {
    background-position: 0 -3925px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .PH_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .PH_25px {
    background-position: 0 -3950px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .PK_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .PK_25px {
    background-position: 0 -3975px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .PL_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .PL_25px {
    background-position: 0 -4000px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .PM_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .PM_25px {
    background-position: 0 -4025px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .PR_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .PR_25px {
    background-position: 0 -4050px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .PT_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .PT_25px {
    background-position: 0 -4075px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .PW_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .PW_25px {
    background-position: 0 -4100px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .PY_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .PY_25px {
    background-position: 0 -4125px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .QA_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .QA_25px {
    background-position: 0 -4150px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .RE_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .RE_25px {
    background-position: 0 -4175px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .RO_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .RO_25px {
    background-position: 0 -4200px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .RS_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .RS_25px {
    background-position: 0 -4225px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .RU_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .RU_25px {
    background-position: 0 -4250px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .RW_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .RW_25px {
    background-position: 0 -4275px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .SA_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .SA_25px {
    background-position: 0 -4300px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .SB_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .SB_25px {
    background-position: 0 -4325px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .SC_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .SC_25px {
    background-position: 0 -4350px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .SD_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .SD_25px {
    background-position: 0 -4375px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .SE_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .SE_25px {
    background-position: 0 -4400px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .SG_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .SG_25px {
    background-position: 0 -4425px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .SH_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .SH_25px {
    background-position: 0 -4450px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .SI_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .SI_25px {
    background-position: 0 -4475px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .SK_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .SK_25px {
    background-position: 0 -4500px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .SL_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .SL_25px {
    background-position: 0 -4525px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .SM_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .SM_25px {
    background-position: 0 -4550px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .SN_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .SN_25px {
    background-position: 0 -4575px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .SO_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .SO_25px {
    background-position: 0 -4600px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .SR_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .SR_25px {
    background-position: 0 -4625px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .SS_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .SS_25px {
    background-position: 0 -4650px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .SV_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .SV_25px {
    background-position: 0 -4675px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .SY_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .SY_25px {
    background-position: 0 -4700px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .SZ_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .SZ_25px {
    background-position: 0 -4725px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .TC_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .TC_25px {
    background-position: 0 -4750px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .TD_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .TD_25px {
    background-position: 0 -4775px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .TF_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .TF_25px {
    background-position: 0 -4800px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .TG_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .TG_25px {
    background-position: 0 -4825px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .TH_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .TH_25px {
    background-position: 0 -4850px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .TJ_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .TJ_25px {
    background-position: 0 -4875px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .TM_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .TM_25px {
    background-position: 0 -4900px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .TN_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .TN_25px {
    background-position: 0 -4925px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .TO_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .TO_25px {
    background-position: 0 -4950px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .TR_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .TR_25px {
    background-position: 0 -4975px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .TT_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .TT_25px {
    background-position: 0 -5000px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .TV_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .TV_25px {
    background-position: 0 -5025px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .TW_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .TW_25px {
    background-position: 0 -5050px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .TZ_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .TZ_25px {
    background-position: 0 -5075px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .UA_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .UA_25px {
    background-position: 0 -5100px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .UG_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .UG_25px {
    background-position: 0 -5125px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .US_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .US_25px {
    background-position: 0 -5150px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .UY_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .UY_25px {
    background-position: 0 -5175px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .UZ_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .UZ_25px {
    background-position: 0 -5200px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .VA_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .VA_25px {
    background-position: 0 -5225px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .VC_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .VC_25px {
    background-position: 0 -5250px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .VE_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .VE_25px {
    background-position: 0 -5275px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .VG_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .VG_25px {
    background-position: 0 -5300px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .VI_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .VI_25px {
    background-position: 0 -5325px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .VN_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .VN_25px {
    background-position: 0 -5350px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .VU_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .VU_25px {
    background-position: 0 -5375px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .VrvZWTU4wpGJwxeTzir79,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .VrvZWTU4wpGJwxeTzir79 {
    color: #666667;
    margin-left: auto;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .WS_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .WS_25px {
    background-position: 0 -5400px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .YE_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .YE_25px {
    background-position: 0 -5425px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .YT_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .YT_25px {
    background-position: 0 -5450px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .ZA_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .ZA_25px {
    background-position: 0 -5475px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .ZM_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .ZM_25px {
    background-position: 0 -5500px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd .ZW_25px,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd .ZW_25px {
    background-position: 0 -5525px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd ._11QU_BIqESitk6Tryg9hVJ,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd ._11QU_BIqESitk6Tryg9hVJ {
    background-image: url('https://checkout.clarifion.com//champflxbnzet1upsell/img/flag_sprite.png');
    background-repeat: no-repeat;
    background-size: 100%;
    display: inline-block;
    height: 25px;
    width: 25px;
  }
  .yBiQ1tylQlUl3F4-r4bTi .kElX5iKFAiCTJumjTNYfd,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf .kElX5iKFAiCTJumjTNYfd {
    align-items: center;
    background-color: white;
    cursor: pointer;
    display: flex;
    height: 55px;
    padding: 0 20px;
  }
  .yBiQ1tylQlUl3F4-r4bTi,
        ._2NmoFRDWQGDT78VaFhQOU_ ._8qI7v0yYJp8QRJbhnyHCf {
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 3px 30px rgba(0, 0, 0, 0.3);
    height: 220px;
    overflow: hidden;
    overflow-y: scroll;
    position: absolute;
    top: 72px;
    width: 100%;
    z-index: 10000;
  }
  .yotpo-close-modal.yotpo-icon-btn-small .yotpo-icon.yotpo-icon-cross {
    background: red !important;
    border: 2px solid black !important;
    border-radius: 5px !important;
    box-sizing: border-box !important;
    color: white !important;
  }
```

### J. All Static Text Content (from HTML)

  `#fkt-link-82c-ea0-9be` (a): `No, Thank you!`
  `#ih166` (span): `Copyright (c) 2024 Clarifion`
  `#iwjle` (button): `YES! Send me 5 Clear Air Purifiers
                            for Only $9 each `
  `#izau3` (h1): `Thank You For Your Order!`
  `#pageDataScript` (script): `var pageData = { "pageViewReferenceId": "c1c9b314-20c0-4a31-bfe7-64893d291f91", `
  `#reject-upsell` (div): `No, Thank you!`

### K. JavaScript Template Texts

- `); // Step 2: Confirm payment with Stripe.js console.log(`
- `); e.preventDefault(); orderSummary.classList.toggle(`
- `); orderSummary.classList.toggle(`
- `); orders.unshift(order); localStorage.setItem(`
- `); updateOrderStatus(order.id,`
- `, JSON.stringify(orders)); console.log(`
- `, currencyCode); // Create order draft BEFORE payment processing console.log(`
- `, error); // Update order status to failed updateOrderStatus(order.id,`
- `, foundDiscount); appliedDiscountCode = foundDiscount; setTimeout(() => { syncOrderSummaryWithProduc`
- `, orderId); } catch (error) { console.error(`
- `.order-applied-discount-remove`
- `.order-discount-code-button`
- `.order-discount-code-input`
- `.order-summary-body`
- `.order-summary-header`
- `; // Order Item bodyHTML +=`
- `; productRow.style.borderLeft =`
- `; r.style.borderLeft =`
- `; row.style.borderColor =`
- `; row.style.borderLeft =`

---

## VSL OTO1 (upsell-vsl-oto-1.html)

- **File size**: 629,221 bytes | **Custom CSS**: 83,223 bytes
- **Timer**: 29, 9, 10 min
- **ID rules**: 213 | **Class rules**: 475 | **Keyframes**: 1

### A. Interrupt Header

**ID**: `#itigy` | **Tag**: `<div>` | **Text**: `IMPORTANT: Do NOT Close This Window Or Click The "Back" Button: It may double-bi`

**ID**: `#i5yjt` | **Tag**: `<div>` | **Text**: `IMPORTANT: Do NOT Close This Window Or Click The "Back" Button: It may double-bi`

**ID**: `#iwd04` | **Tag**: `<div>` | **Text**: `IMPORTANT: Do NOT Close This Window Or Click The "Back" Button:`

**ID**: `#i1hlj` | **Tag**: `<div>` | **Text**: `IMPORTANT: Do NOT Close This Window Or Click The "Back" Button:`

**ID**: `#iheazj` | **Tag**: `<div>` | **Text**: `WAIT {{firstName}}! Your Order Is Not Complete Yet Please Watch This Important M`

**ID**: `#i52fhp` | **Tag**: `<div>` | **Text**: `WAIT {{firstName}}! Your Order Is Not Complete Yet Please Watch This Important M`

**ID**: `#iftkwi` | **Tag**: `<ul>` | **Text**: `WAIT {{firstName}}! Your Order Is Not Complete Yet Please Watch This Important M`

**ID**: `#cc-id-pDzC9oKjcRax` | **Tag**: `<li>` | **Text**: `WAIT {{firstName}}! Your Order Is Not Complete Yet Please Watch This Important M`

**ID**: `#ig0vd7` | **Tag**: `<div>` | **Text**: `WAIT {{firstName}}!`

**ID**: `#cc-id-NelMQjYpN8aS` | **Tag**: `<div>` | **Text**: `WAIT {{firstName}}!`

**ID**: `#imwkh3` | **Tag**: `<div>` | **Text**: `WAIT {{firstName}}!`

**ID**: `#im5mnj` | **Tag**: `<div>` | **Text**: `Your Order Is Not Complete Yet Please Watch This Important Message Below Now`

**ID**: `#irvrk` | **Tag**: `<div>` | **Text**: `Your Order Is Not Complete Yet Please Watch This Important Message Below Now`

**ID**: `#io6mok` | **Tag**: `<div>` | **Text**: `Please Watch This Important Message Below Now`

**ID**: `#i1meq` | **Tag**: `<div>` | **Text**: `Please Watch This Important Message Below Now`

**ID**: `#ijtvht` | **Tag**: `<span>` | **Text**: `Please Watch This Important Message Below Now`

**ID**: `#ipsth` | **Tag**: `<div>` | **Text**: `DO THIS FIRST: Please watch this important New Customer update from Dr. Schillin`

**ID**: `#iowya` | **Tag**: `<div>` | **Text**: `DO THIS FIRST: Please watch this important New Customer update from Dr. Schillin`

**ID**: `#irwkl3` | **Tag**: `<div>` | **Text**: `DO THIS FIRST: Please watch this important New Customer update from Dr. Schillin`

**ID**: `#ix1whc-3` | **Tag**: `<div>` | **Text**: `Wait…$147 is too much?`

**ID**: `#i5ocpe` | **Tag**: `<div>` | **Text**: `Wait…$147 is too much?`

### B. Countdown Timer

**Duration**: 29, 9, 10 min

`.countdown`:
```css
  font-family: Helvetica, serif;
  text-align: center;
```

`.countdown-block`:
```css
  display: inline-block;
  margin: 0px 10px;
  padding: 10px;
```

`.countdown-cont`:
```css
  display: inline-block;
```

`.countdown-digit`:
```css
  font-size: 1rem;
```

`.countdown-endtext`:
```css
  font-size: 5rem;
```

`#countdownCont-4`:
```css
  align-items: center;
  display: flex;
  justify-content: center;
```

`#ig7bg2 > .countdown-endtext`:
```css
  font-family: Montserrat, sans-serif !important;
  font-size: 26px !important;
  font-weight: 700 !important;
  line-height: 40px !important;
  margin-left: 10px !important;
```

### C. Headlines

**<h1>** `Are You Sure?`

**<h1>** `This is a one-time only offer 🔥`

**<h3>** `1x  SmoothSpine Multitherapy Pro`

**<h3>** `1x  SmoothSpine Multitherapy Pro`

### D. CTA Button

**Text**: `SECURE OUR LOWEST PRICE ON THE INTERNET`
**Tag**: `<div>` | **ID**: `#ic7jlo`

**Text**: `★★★★★ OVER 65,000+ HAPPY CUSTOMERS 1x  SmoothSpine Multitherapy Pro Only +$127 $`
**Tag**: `<div>` | **ID**: `#i7y8gi`

**Text**: `★★★★★ OVER 65,000+ HAPPY CUSTOMERS 1x  SmoothSpine Multitherapy Pro Only +$127 $`
**Tag**: `<div>` | **ID**: `#im1np6`

**Text**: `YES UPGRADE MY ORDER!`
**Tag**: `<a>` | **ID**: `#fkt-link-f12-5b5-a1f`

**CTA Class Styles:**
`.btn`:
```css
  border: 1px solid transparent;
  border-radius: 0.25rem;
  display: inline-block;
  font-family: Helvetica, serif;
  font-size: 20px;
  font-weight: 400;
  line-height: 1.5;
  margin: 20px 10px;
  padding: 10px 25px;
  text-align: center;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  user-select: none;
  vertical-align: middle;
  white-space: normal;
```

`.btn-primary`:
```css
  background: rgb(0, 123, 255);
  border-color: rgb(0, 123, 255);
  color: rgb(255, 255, 255);
  white-space: normal;
```

`.btn.btn-primary`:
```css
  background: rgb(0, 123, 255);
  border-color: rgb(0, 123, 255);
  color: rgb(255, 255, 255);
  white-space: normal;
```

`.buy_now_btn`:
```css
  background-attachment: scroll;
  background-image: url("https://assets.checkoutchamp.com/bb6d9900-4f98-11ef-a365-7332b5bb1723/1722764088413_btn_bg.png");
  background-position: left top;
  background-repeat: repeat;
  background-size: auto;
  border-color: rgb(186, 147, 0) !important;
  border-radius: 30px;
  color: rgb(0, 0, 0) !important;
  font-family: "Open Sans", sans-serif;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.5px;
  margin-bottom: 0px;
  margin-top: 0px;
  padding-left: 30px;
  padding-right: 30px;
  text-shadow: rgb(255, 255, 255) 0px 1px 0px !important;
```

`.fk-youtube .play-button`:
```css
  background-color: #333;
  border-radius: 6px;
  box-shadow: 0 0 30px rgba( 0,0,0,0.6 );
  height: 60px;
  opacity: 0.8;
  width: 90px;
  z-index: 1;
```

### E. Opt-Out (Negative Option)

**Text**: `No thanks, - I do not want to heal my Sciatica in half the time and I
	  underst`
**Tag**: `<div>` | **ID**: `#iu2k54`

**Text**: `No thanks, - I do not want to heal my Sciatica in half the time and I
	  underst`
**Tag**: `<a>` | **ID**: `#fkt-link-5f5-4b2-a41`

**Text**: `No thanks, maybe Later...`
**Tag**: `<a>` | **ID**: `#fkt-link-445-b8f-b29`

### F. Price Elements

`#cc-id-ksoXspKnoV1K`:
```css
  -webkit-font-smoothing: antialiased;
  -webkit-text-stroke-width: 0px;
  box-sizing: border-box;
  color: white;
  display: block;
  font-family: Dosis;
  font-size: 26px;
  font-style: normal;
  font-variant-caps: normal;
  font-variant-ligatures: normal;
  font-weight: 700;
  letter-spacing: normal;
  line-height: 1.5;
  margin: 0px;
  orphans: 2;
  outline-offset: -1px !important;
  text-align: center;
  text-decoration-color: initial !important;
  text-decoration-style: initial;
  text-decoration-thickness: initial;
  text-indent: 0px;
  text-rendering: optimizelegibility;
  text-transform: uppercase;
  white-space: normal;
  widows: 2;
  word-spacing: 0px;
```

`#cc-id-vG0lEF3T1Th7`:
```css
  -webkit-font-smoothing: antialiased;
  -webkit-text-stroke-width: 0px;
  box-sizing: border-box;
  color: rgb(0, 0, 0);
  display: block;
  font-family: Montserrat, sans-serif;
  font-size: 26px;
  font-style: normal;
  font-variant-caps: normal;
  font-variant-ligatures: normal;
  font-weight: 700;
  letter-spacing: normal;
  line-height: 1.5;
  margin: 0px;
  orphans: 2;
  outline-offset: -1px !important;
  text-align: center;
  text-decoration-color: initial;
  text-decoration-style: initial;
  text-decoration-thickness: initial;
  text-indent: 0px;
  text-rendering: optimizelegibility;
  text-transform: uppercase;
  white-space: normal;
  widows: 2;
  word-spacing: 0px;
```

`#fkt-link-445-b8f-b29`:
```css
  color: rgb(99, 99, 99);
  cursor: pointer;
  display: inline-block;
  font-family: Montserrat, sans-serif;
  font-size: 18px;
  padding: 13px 10px 1px;
```

`#i3jt56`:
```css
  color: rgb(255, 245, 0) !important;
  font-family: Oswald, sans-serif;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 4px;
  padding: 1px;
```

`#i4ysb2`:
```css
  color: rgb(229, 0, 0) !important;
  font-family: Montserrat, sans-serif;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0px;
  padding: 1px;
```

`#i5ocpe`:
```css
  color: rgb(255, 255, 255);
  font-family: Montserrat, sans-serif;
  font-size: 20px;
  padding: 1px;
  text-align: center;
```

`#i8dnp9`:
```css
  color: black !important;
  font-size: 16px;
```

`#iawhif`:
```css
  background-color: rgb(68, 157, 68) !important;
  border-radius: 6px;
  font-family: Montserrat, sans-serif;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 10px;
  margin-top: 10px;
  padding-left: 15px;
  padding-right: 15px;
```

`#icifvmc`:
```css
  color: rgb(229, 0, 0) !important;
  font-family: Montserrat, sans-serif;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0px;
  padding: 1px;
```

`#iin3hd`:
```css
  background-color: rgb(245, 255, 234);
  border-color: rgb(222, 185, 11);
  border-radius: 50px;
  border-style: solid;
  font-family: Montserrat, sans-serif;
  font-size: 13px;
  font-weight: 600;
  padding: 6px 1px;
```

`#ij5qsh`:
```css
  color: rgb(7, 4, 53);
  font-family: Montserrat, sans-serif;
  font-size: 20px;
  margin-bottom: 19px;
  padding: 1px;
  text-align: center;
```

`#imwkh3`:
```css
  color: rgb(204, 2, 2) !important;
  font-size: 23px;
```

`#in179h`:
```css
  color: rgb(0, 0, 0);
  font-family: "Arial Black", Gadget, sans-serif;
  font-size: 26px;
  font-weight: 400;
  margin-bottom: 12px;
  margin-top: 12px;
  padding: 1px;
  text-align: center;
```

`#io6mok`:
```css
  color: black !important;
  font-family: Roboto, sans-serif;
  font-size: 15px;
  letter-spacing: -0.8px;
```

`#iruszwh`:
```css
  color: rgb(229, 0, 0) !important;
  font-family: Montserrat, sans-serif;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0px;
  padding: 1px;
```

`#itj3z3`:
```css
  color: rgb(255, 245, 0) !important;
  font-family: Oswald, sans-serif;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 4px;
  padding: 1px;
```

`#iuh42u`:
```css
  background-color: rgb(217, 83, 79) !important;
  border-radius: 6px;
  font-family: Montserrat, sans-serif;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 10px;
  margin-top: 10px;
  padding-left: 15px;
  padding-right: 15px;
```

`#izi6sl`:
```css
  color: rgb(255, 245, 0) !important;
  font-family: Oswald, sans-serif;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 4px;
  padding: 1px;
```

### G. Guarantee

**Text**: `100% Satisfaction 180-Day Money-Back Guarantee`

**Text**: `100% Satisfaction 180-Day Money-Back Guarantee`

**Text**: `180-day 100% money-back guarantee`

**Text**: `180-Days Money-Back Guarantee`

**Text**: `180-Days Money-Back Guarantee`

**Text**: `90-Days Money-Back Guarantee`

**Text**: `Refund Policy Privacy Policy Terms of Service`

**Text**: `Refund Policy Privacy Policy Terms of Service`

**Text**: `Refund Policy Privacy Policy Terms of Service`

**Text**: `Refund Policy`

### H. Key ID-Based CSS (Conversion-Relevant)

```css
  #NoButton1 {
    background-color: rgb(239, 253, 250) !important;
  }
  #a-link {
    color: rgb(24, 120, 185) !important;
    text-decoration: none;
    transition: color 0.2s ease-in-out;
  }
  #cc-id-7zXHFA86hCmp {
    margin-left: auto;
    margin-right: auto;
  }
  #cc-id-eU4iztnkuUdD {
    margin-left: auto;
    margin-right: auto;
  }
  #cc-id-eWKxowVKCq6ss {
    margin-left: auto;
    margin-right: auto;
  }
  #cc-id-ksoXspKnoV1K {
    -webkit-font-smoothing: antialiased;
    -webkit-text-stroke-width: 0px;
    box-sizing: border-box;
    color: white;
    display: block;
    font-family: Dosis;
    font-size: 26px;
    font-style: normal;
    font-variant-caps: normal;
    font-variant-ligatures: normal;
    font-weight: 700;
    letter-spacing: normal;
    line-height: 1.5;
    margin: 0px;
    orphans: 2;
    outline-offset: -1px !important;
    text-align: center;
    text-decoration-color: initial !important;
    text-decoration-style: initial;
    text-decoration-thickness: initial;
    text-indent: 0px;
    text-rendering: optimizelegibility;
    text-transform: uppercase;
    white-space: normal;
    widows: 2;
    word-spacing: 0px;
  }
  #cc-id-qk45QF3Ov5Fz {
    padding: 12px 10px;
    width: 100%;
  }
  #cc-id-vG0lEF3T1Th7 {
    -webkit-font-smoothing: antialiased;
    -webkit-text-stroke-width: 0px;
    box-sizing: border-box;
    color: rgb(0, 0, 0);
    display: block;
    font-family: Montserrat, sans-serif;
    font-size: 26px;
    font-style: normal;
    font-variant-caps: normal;
    font-variant-ligatures: normal;
    font-weight: 700;
    letter-spacing: normal;
    line-height: 1.5;
    margin: 0px;
    orphans: 2;
    outline-offset: -1px !important;
    text-align: center;
    text-decoration-color: initial;
    text-decoration-style: initial;
    text-decoration-thickness: initial;
    text-indent: 0px;
    text-rendering: optimizelegibility;
    text-transform: uppercase;
    white-space: normal;
    widows: 2;
    word-spacing: 0px;
  }
  #countdownCont-4 {
    align-items: center;
    display: flex;
    justify-content: center;
  }
  #customizable_popup {
    background-color: #0e0d0d91 !important;
    bottom: 0;
    display: none;
    height: auto;
    inset: 0px;
    left: 0;
    min-height: 300px;
    opacity: 1;
    overflow: auto;
    padding-left: 1px;
    position: fixed;
    right: 0;
    top: 0;
  }
  #fkt-image-035-0b0-987 {
    color: black !important;
    height: 15px;
    width: 79px !important;
  }
  #fkt-image-048-eaa-862 {
    color: black !important;
    height: 100%;
    width: 34px !important;
  }
  #fkt-image-054-0be-993 {
    color: black !important;
    height: auto;
    width: 260px !important;
  }
  #fkt-image-16e-a8a-a36 {
    color: black;
    height: 100%;
    width: 80%;
  }
  #fkt-image-1b6-fb7-86c {
    color: black !important;
    height: 15px;
    width: 79px !important;
  }
  #fkt-image-25b-0be-b95 {
    color: black !important;
    height: auto;
    width: 260px !important;
  }
  #fkt-image-298-ab3-af0 {
    color: black !important;
    height: 22px;
    width: 22px !important;
  }
  #fkt-image-444-abb-adf {
    color: black !important;
    height: 22px;
    width: 22px !important;
  }
  #fkt-image-6d5-5bb-8ba {
    color: black !important;
    height: 32px;
    margin-top: -4px !important;
    width: 60px !important;
  }
  #fkt-image-7e6-897-953 {
    color: black !important;
    height: 22px;
    width: 22px !important;
  }
  #fkt-image-80a-696-951 {
    color: black !important;
    height: 22px;
    width: 22px !important;
  }
  #fkt-image-95f-bad-b92 {
    color: black !important;
    height: auto;
    margin-bottom: 20px;
    width: 300px !important;
  }
  #fkt-image-963-5b2-834 {
    color: black !important;
    height: 22px;
    width: 22px !important;
  }
  #fkt-image-a13-691-9e8 {
    color: black !important;
    height: 22px;
    width: 22px !important;
  }
  #fkt-image-a86-d8c-b9c {
    color: black !important;
    height: 22px;
    width: 22px !important;
  }
  #fkt-image-dca-cb0-b8e {
    color: black !important;
    height: 22px;
    width: 22px !important;
  }
  #fkt-image-e41-188-829 {
    color: black !important;
    height: auto;
    width: 260px !important;
  }
  #fkt-image-ebf-481-af6 {
    color: black !important;
    height: auto;
    margin-bottom: 20px;
    width: 250px !important;
  }
  #fkt-image-f21-4a3-846 {
    color: black !important;
    height: 15px;
    width: 79px !important;
  }
  #fkt-image-f58-5b6-b82 {
    color: black !important;
    height: 22px;
    width: 22px !important;
  }
  #fkt-image-f75-bbe-a66 {
    color: black !important;
    height: auto;
    margin-bottom: 20px;
    width: 100% !important;
  }
  #fkt-link-445-b8f-b29 {
    color: rgb(99, 99, 99);
    cursor: pointer;
    display: inline-block;
    font-family: Montserrat, sans-serif;
    font-size: 18px;
    padding: 13px 10px 1px;
  }
  #fkt-link-490-292-b70 {
    font-size: 13px;
    line-height: 20px;
  }
  #fkt-link-509-795-ab8 {
    font-size: 13px;
    line-height: 20px;
    padding-right: 10px;
  }
  #fkt-link-636-784-a01 {
    font-size: 13px;
    line-height: 20px;
    padding-right: 10px;
  }
  #fkt-link-647-c8b-8d0 {
    color: rgb(217, 131, 166) !important;
  }
  #fkt-link-f12-5b5-a1f {
    padding-bottom: 12px;
    padding-top: 12px;
  }
  #fkt-multiple-popup-e3b-a8d-a95 {
    background-color: #0e0d0d91 !important;
    bottom: 0;
    display: none;
    height: auto;
    left: 0;
    min-height: 300px;
    opacity: 1;
    overflow: auto;
    position: fixed;
    right: 0;
    top: 0;
  }
  #i0228r6 {
    display: flex;
    font-family: Montserrat, sans-serif;
    font-size: 16px;
    line-height: 23px;
    padding: 2px 10px 2px 20px;
    width: 100%;
  }
  #i039xon {
    display: flex;
    font-family: Montserrat, sans-serif;
    font-size: 16px;
    line-height: 23px;
    margin-top: 1px !important;
    padding: 2px 10px 2px 20px;
    width: 100%;
  }
  #i04b7h {
    margin-top: 1px;
  }
  #i0ai2l {
    align-items: center !important;
    align-self: auto;
    background-color: rgb(255, 255, 255) !important;
    border-radius: 12px 12px 10px 10px;
    border-style: solid;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    max-width: 373px;
    padding: 0px 0px 20px;
    text-align: center;
    transition: 0.65s;
    width: 100%;
  }
  #i0b4i {
    color: rgb(204, 2, 2) !important;
  }
  #i0bezj {
    font-family: Montserrat, sans-serif;
    font-size: 23px;
    padding: 10px;
    text-align: left;
  }
  #i0sp7u {
    background-color: rgba(0, 0, 0, 0) !important;
    border-top-width: 1px;
    height: 3px;
  }
  #i0y7uq-2 {
    font-family: Montserrat, sans-serif;
    font-size: 21px;
  }
  #i1ebd8i {
    display: flex;
    font-family: Montserrat, sans-serif;
    font-size: 16px;
    line-height: 23px;
    padding: 2px 10px 2px 20px;
    width: 100%;
  }
  #i1fmrq {
    flex-direction: column;
  }
  #i1ggiw {
    padding-bottom: 0;
    padding-left: 0;
    padding-right: 0;
  }
  #i1hlj {
    font-size: 16px;
    justify-content: space-around;
    line-height: 22px;
    margin-top: 0px;
  }
  #i1m3u2 {
    background-color: rgb(18, 18, 18) !important;
  }
  #i1meq {
    padding-left: 0px;
    padding-right: 0px;
  }
  #i279bz {
    font-size: 25px;
    font-weight: bold;
  }
  #i2cl47 {
    font-size: 20px;
  }
  #i308di8 {
    font-family: "Open Sans", sans-serif;
    font-size: 15px;
    margin-left: 10px;
    padding: 1px;
  }
  #i30sen4 {
    font-family: Montserrat, sans-serif;
    font-size: 27px;
    font-weight: 800;
    letter-spacing: 1px;
    padding: 1px;
  }
  #i34tqi {
    text-align: left;
  }
  #i3jt56 {
    color: rgb(255, 245, 0) !important;
    font-family: Oswald, sans-serif;
    font-size: 18px;
    font-weight: 600;
    letter-spacing: 4px;
    padding: 1px;
  }
  #i3qb8s {
    height: auto;
    width: auto;
  }
  #i4ruth {
    height: 40px;
    margin-left: 2px;
    margin-right: 0px;
    padding-left: 0px;
    padding-right: 0px;
    padding-top: 0px;
  }
  #i4ysb2 {
    color: rgb(229, 0, 0) !important;
    font-family: Montserrat, sans-serif;
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 0px;
    padding: 1px;
  }
  #i4z7f4 {
    font-size: 12px;
  }
  #i52fhp {
    padding: 0px;
  }
  #i552w4 {
    width: 200px !important;
  }
  #i5ehrj {
    background-color: rgb(255, 255, 255) !important;
    border-radius: 12px 12px 10px 10px;
    border-style: solid;
    display: flex;
    flex-direction: column;
    max-width: 373px;
    padding: 0px 0px 20px;
    transition: 0.65s;
    width: 100%;
  }
  #i5h1oh {
    padding-bottom: 0px;
    padding-left: 0px;
    padding-right: 0px;
  }
  #i5ocpe {
    color: rgb(255, 255, 255);
    font-family: Montserrat, sans-serif;
    font-size: 20px;
    padding: 1px;
    text-align: center;
  }
  #i5s8knj {
    font-size: 12px;
  }
  #i5yjt {
    padding: 0px 0px 10px;
  }
  #i7jrua {
    font-family: "Open Sans", sans-serif;
    font-size: 15px;
    margin-left: 10px;
    padding: 1px;
  }
  #i7mtdw {
    align-self: auto;
    justify-content: center;
    padding-top: 0px;
  }
  #i7no4h {
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
  #i7uujdx {
    font-family: Montserrat, sans-serif;
    font-size: 16px;
    font-weight: 500;
    letter-spacing: 1px;
    padding: 1px;
  }
  #i7ylnlf {
    display: flex;
    font-family: Montserrat, sans-serif;
    font-size: 16px;
    line-height: 23px;
    margin-bottom: 20px;
    margin-top: 1px !important;
    padding: 2px 10px 2px 20px;
    width: 100%;
  }
  #i80fgbh {
    text-align: left;
  }
  #i8dnp9 {
    color: black !important;
    font-size: 16px;
  }
  #i8mey {
    background-color: #EFFDFA !important;
  }
  #i9dzv5 {
    display: flex;
    font-family: Montserrat, sans-serif;
    font-size: 16px;
    line-height: 23px;
    padding: 2px 10px 2px 20px;
    width: 100%;
  }
  #i9q1k4 {
    padding: 10px;
    width: 100%;
  }
  #i9tnp1 {
    font-size: 0px;
    font-weight: 100;
    height: 40px;
    margin-left: 0px;
    margin-right: 2px;
    padding-left: 0px;
    padding-right: 0px;
    padding-top: 0px;
  }
  #i9znnvq {
    align-items: center;
    display: flex;
    justify-content: center;
    padding: 10px 10px 0px;
    width: 100%;
  }
  #iaa4mlf {
    align-items: center;
    display: flex;
    justify-content: center;
    padding: 4px 10px 5px;
    width: 100%;
  }
  #iawhif {
    background-color: rgb(68, 157, 68) !important;
    border-radius: 6px;
    font-family: Montserrat, sans-serif;
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 10px;
    margin-top: 10px;
    padding-left: 15px;
    padding-right: 15px;
  }
  #iax499 {
    font-family: "Open Sans", sans-serif;
    font-size: 15px;
    margin-left: 10px;
    padding: 1px;
  }
  #ib45ea .cc-cart-row-margin {
    align-items: center;
    display: flex;
  }
  #ibnfj {
    padding-bottom: 0;
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
  }
  #ibxj7p {
    text-align: left;
  }
  #ic7jlo {
    font-size: 14px;
    margin-top: 6px;
  }
  #icadox {
    font-size: 23px;
  }
  #icb25i6 {
    display: flex;
    font-family: Montserrat, sans-serif;
    font-size: 16px;
    line-height: 23px;
    margin-bottom: 20px;
    margin-top: 1px !important;
    padding: 2px 10px 2px 20px;
    width: 100%;
  }
  #icfidi {
    padding-top: 20px;
  }
  #icifvmc {
    color: rgb(229, 0, 0) !important;
    font-family: Montserrat, sans-serif;
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 0px;
    padding: 1px;
  }
  #icsgek {
    align-items: center;
    display: flex;
    justify-content: center;
  }
  #idyfdp {
    margin-left: 0px;
    margin-right: 0px;
    padding-left: 5px;
    padding-right: 5px;
  }
  #iedtk9d {
    align-items: center;
    display: flex;
    justify-content: center;
    padding: 10px 10px 0px;
    width: 100%;
  }
  #iekcwz {
    align-items: stretch;
    display: flex;
    justify-content: center;
    line-height: 22px;
  }
  #ieufpw {
    padding-left: 0px;
    padding-right: 0px;
  }
  #ieugr9u {
    font-family: "Open Sans", sans-serif;
    font-size: 15px;
    margin-left: 10px;
    padding: 1px;
  }
  #iezvaz {
    padding: 20px 1px 10px;
  }
  #if3fiu {
    text-align: left;
  }
  #ifcvz0x {
    font-size: 12px;
  }
  #ife8j1 {
    font-size: 20px;
  }
  #iftkwi {
    margin-bottom: 0px;
    margin-left: 0px;
    margin-right: 0px;
    padding-left: 0px;
    padding-right: 0px;
  }
  #ifuxb4 {
    height: auto;
    width: auto;
  }
  #ifvuov {
    padding-bottom: 0px;
    padding-left: 20px;
    padding-right: 20px;
  }
  #ig0vd7 {
    align-items: center;
    justify-content: center;
    margin-top: 1px;
    padding-bottom: 0px;
    padding-top: 5px;
  }
  #ig7bg2 > .countdown-endtext {
    font-family: Montserrat, sans-serif !important;
    font-size: 26px !important;
    font-weight: 700 !important;
    line-height: 40px !important;
    margin-left: 10px !important;
  }
  #igzhht {
    display: flex;
    font-family: Montserrat, sans-serif;
    font-size: 16px;
    line-height: 23px;
    margin-bottom: 20px;
    margin-top: 1px !important;
    padding: 2px 10px 2px 20px;
    width: 100%;
  }
  #ih4wig {
    padding: 12px 10px 5px;
    width: 100%;
  }
  #iheazj {
    padding-bottom: 0px;
    padding-left: 0px;
    padding-right: 0px;
  }
  #ihjbp7 {
    align-items: center !important;
    background-color: rgb(255, 255, 255) !important;
    border-radius: 12px 12px 10px 10px;
    border-style: solid;
    display: flex;
    flex-direction: column;
    max-width: 373px;
    padding: 0px 0px 40px;
    transition: 0.65s;
    width: 100%;
  }
  #ihlkrn {
    font-size: 17px;
    line-height: 22px;
  }
  #ii19f {
    background-color: #EFFDFA !important;
  }
  #ii2umi {
    color: rgb(228, 61, 44) !important;
  }
  #ii3if {
    font-size: 16px;
  }
  #ii6yul-3 {
    padding: 12px 10px;
    width: 100%;
  }
  #iice3sv {
    font-family: "Open Sans", sans-serif;
    font-size: 15px;
    margin-left: 10px;
    padding: 1px;
  }
  #iif9e9-2 {
    font-family: Montserrat, sans-serif;
    font-size: 21px;
  }
  #iifhgn-3 {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 12px 10px;
    width: 100%;
  }
  #iifwqfh {
    font-family: "Open Sans", sans-serif;
    font-size: 15px;
    margin-left: 10px;
    padding: 1px;
  }
  #iin3hd {
    background-color: rgb(245, 255, 234);
    border-color: rgb(222, 185, 11);
    border-radius: 50px;
    border-style: solid;
    font-family: Montserrat, sans-serif;
    font-size: 13px;
    font-weight: 600;
    padding: 6px 1px;
  }
  #iiunhd {
    color: rgb(240, 176, 0);
  }
  #ij1idn.realPrice {
    margin-top: 54px;
  }
  #ij39xl {
    font-family: Montserrat, sans-serif;
    font-size: 16px;
    margin-bottom: 20px;
    padding: 20px 1px 10px;
  }
  #ij5qsh {
    color: rgb(7, 4, 53);
    font-family: Montserrat, sans-serif;
    font-size: 20px;
    margin-bottom: 19px;
    padding: 1px;
    text-align: center;
  }
  #ij6e4 {
    justify-content: center;
    text-align: center;
  }
  #ijhv0g {
    font-size: 23px;
    line-height: 30px;
  }
  #ijhvu {
    background-color: #EFFDFA !important;
  }
  #ijp6t {
    text-align: center;
  }
  #ijrsuo {
    font-family: "Open Sans", sans-serif;
    font-size: 15px;
    margin-left: 10px;
    padding: 1px;
  }
  #ijtvht {
    font-size: 15px;
    font-weight: normal;
  }
  #ik20m7-3 {
    display: flex;
    justify-content: space-around;
    margin-top: 0px;
    padding-bottom: 0px;
  }
  #ik681rk {
    text-align: left;
  }
  #ikn1ck {
    text-align: left;
  }
  #il1o2t {
    margin-top: 87px;
  }
  #im0s07 {
    flex-direction: column;
    padding-left: 0px;
    padding-right: 0px;
  }
  #im1np6 {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 1px;
  }
  #im5mnj {
    align-items: center;
    justify-content: center;
    padding-bottom: 15px;
    padding-top: 0px;
    text-align: center;
  }
  #im7kqa {
    background-color: rgb(51, 51, 51) !important;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    padding: 16px 10px;
    width: 100%;
  }
  #imwkh3 {
    color: rgb(204, 2, 2) !important;
    font-size: 23px;
  }
  #in179h {
    color: rgb(0, 0, 0);
    font-family: "Arial Black", Gadget, sans-serif;
    font-size: 26px;
    font-weight: 400;
    margin-bottom: 12px;
    margin-top: 12px;
    padding: 1px;
    text-align: center;
  }
  #incb2h {
    padding-bottom: 12px;
  }
  #inm09k {
    padding: 0px;
  }
  #io3hf5 {
    margin-left: 0px;
    margin-right: 0px;
    padding-left: 5px;
    padding-right: 5px;
  }
  #io6mok {
    color: black !important;
    font-family: Roboto, sans-serif;
    font-size: 15px;
    letter-spacing: -0.8px;
  }
  #io6plp {
    font-size: 17px;
  }
  #iodm66 {
    margin-top: 1px;
  }
  #ioluu5 {
    align-items: center;
    display: flex;
    justify-content: center;
    padding: 4px 10px 5px;
    width: 100%;
  }
  #iotdv9g {
    text-align: left;
  }
  #iowya {
    padding-bottom: 0px;
    padding-left: 0px;
    padding-right: 0px;
  }
  #ipdamk {
    padding-bottom: 0px;
  }
  #ipns6l {
    text-align: left;
  }
  #ipphk8 {
    display: flex;
    font-family: Montserrat, sans-serif;
    font-size: 16px;
    line-height: 23px;
    margin-top: 1px !important;
    padding: 2px 10px 2px 20px;
    width: 100%;
  }
  #ipppiy {
    font-family: Montserrat, sans-serif;
    font-size: 16px;
    font-weight: 500;
    letter-spacing: 1px;
    padding: 1px;
  }
  #ipsth {
    background-color: rgb(255, 255, 255) !important;
    flex-direction: column;
  }
  #iqe2el3 {
    text-align: left;
  }
  #iqhbni {
    margin-top: 84px;
  }
  #iqls1y {
    align-items: center;
    display: flex;
    justify-content: center;
    padding: 10px 10px 0px;
    width: 100%;
  }
  #iqpg65 {
    font-family: "Open Sans", sans-serif;
    font-size: 15px;
    margin-left: 10px;
    padding: 1px;
  }
  #iqshmj {
    font-family: Montserrat, sans-serif;
    font-size: 16px;
    margin-bottom: 20px;
    padding: 20px 1px 10px;
  }
  #ir3abk9 {
    display: flex;
    font-family: Montserrat, sans-serif;
    font-size: 16px;
    line-height: 23px;
    margin-top: 1px !important;
    padding: 2px 10px 2px 20px;
    width: 100%;
  }
  #ir3igf {
    background-color: rgb(239, 253, 250) !important;
    display: none;
    flex-direction: column;
    padding: 0px;
  }
  #iropysq {
    text-align: left;
  }
  #iruszwh {
    color: rgb(229, 0, 0) !important;
    font-family: Montserrat, sans-serif;
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 0px;
    padding: 1px;
  }
  #irvrk {
    padding-left: 0px;
    padding-right: 0px;
  }
  #is5zgb {
    font-size: 23px;
    line-height: 30px;
  }
  #ise4cn {
    margin-bottom: 0px;
    padding-bottom: 0px;
  }
  #istw2k {
    font-size: 25px;
    font-weight: bold;
  }
  #ith2yt-2 {
    font-weight: normal;
  }
  #itigy {
    background-color: rgb(255, 140, 0) !important;
    border-radius: 1px;
    border-width: 1px;
    flex: 0 0 0%;
    padding-bottom: 1px;
    padding-top: 1px;
  }
  #itj3z3 {
    color: rgb(255, 245, 0) !important;
    font-family: Oswald, sans-serif;
    font-size: 18px;
    font-weight: 600;
    letter-spacing: 4px;
    padding: 1px;
  }
  #itp5lej {
    font-family: "Open Sans", sans-serif;
    font-size: 15px;
    margin-left: 10px;
    padding: 1px;
  }
  #itpyhsq {
    font-family: Montserrat, sans-serif;
    font-size: 27px;
    font-weight: 800;
    letter-spacing: 1px;
    padding: 1px;
  }
  #itrbez {
    color: rgb(242, 54, 7);
  }
  #its9l7l {
    text-align: left;
  }
  #iu2k54 {
    padding-bottom: 10px;
  }
  #iugqyl {
    font-family: Montserrat, sans-serif;
    font-size: 27px;
    font-weight: 800;
    letter-spacing: 1px;
    padding: 1px;
  }
  #iuh42u {
    background-color: rgb(217, 83, 79) !important;
    border-radius: 6px;
    font-family: Montserrat, sans-serif;
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 10px;
    margin-top: 10px;
    padding-left: 15px;
    padding-right: 15px;
  }
  #ivvs67 {
    margin: 15px 0px;
  }
  #ivxr0ei {
    align-items: center;
    display: flex;
    justify-content: center;
    padding: 4px 10px 5px;
    width: 100%;
  }
  #iw178h {
    font-size: 20px;
  }
  #iwd04 {
    margin-top: 10px;
  }
  #iwkcv9 {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0px 10px;
    width: 100%;
  }
  #iwt1j2 {
    font-family: Montserrat, sans-serif;
    font-size: 16px;
    margin-bottom: 20px;
    padding: 20px 1px 10px;
  }
  #iwxmah {
    text-align: left;
  }
  #ix1whc-3 {
    margin-left: 1px;
  }
  #ix6tdu {
    font-family: Montserrat, sans-serif;
    font-size: 18px;
    padding: 10px;
    text-align: left;
  }
  #ixgb6m {
    align-items: stretch;
    flex-direction: column-reverse;
    justify-content: space-between;
  }
  #ixmq47j {
    font-family: Montserrat, sans-serif;
    font-size: 16px;
    font-weight: 500;
    letter-spacing: 1px;
    padding: 1px;
  }
  #ixmwqk {
    background-color: rgb(51, 51, 51) !important;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    padding: 16px 10px;
    width: 100%;
  }
  #ixnv7l {
    height: auto;
    width: auto;
  }
  #iyhfge {
    padding: 32px 29px !important;
  }
  #iyj5fm {
    font-size: 20px;
  }
  #iyvapl {
    padding-bottom: 30px;
    padding-top: 30px;
  }
  #iz4ec1.shownprice {
    margin-top: 57px;
  }
  #izi6sl {
    color: rgb(255, 245, 0) !important;
    font-family: Oswald, sans-serif;
    font-size: 18px;
    font-weight: 600;
    letter-spacing: 4px;
    padding: 1px;
  }
  #popup_content {
    background-color: #fff;
    margin-top: 10%;
  }
  #popup_content-2 {
    background-color: #eaecf0 !important;
    margin-left: auto;
    margin-right: auto;
    margin-top: 10%;
    padding: 5px;
    padding-bottom: 0;
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
    z-index: 9999;
  }
```

### I. Key Class-Based CSS

```css
  .avatar {
    border: 2px solid #fff;
    border-radius: 50%;
    box-shadow: 0 1px 4px rgba(0,0,0,.12);
    display: block;
    height: 44px;
    object-fit: cover;
    width: 44px;
  }
  .backgroundMargin {
    background-color: #fff;
    margin-top: 10%;
  }
  .borderRadius {
    border-radius: 5px;
  }
  .bordered-ul {
    border: 1px solid rgb(217, 217, 217);
    border-radius: 4px;
    list-style: none;
    margin: 0px 0px 12px;
    padding: 0px;
    width: 100%;
  }
  .box {
    border: 3px solid rgb(236, 236, 236);
  }
  .btn {
    border: 1px solid transparent;
    border-radius: 0.25rem;
    display: inline-block;
    font-family: Helvetica, serif;
    font-size: 20px;
    font-weight: 400;
    line-height: 1.5;
    margin: 20px 10px;
    padding: 10px 25px;
    text-align: center;
    transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    user-select: none;
    vertical-align: middle;
    white-space: normal;
  }
  .btn-primary {
    background: rgb(0, 123, 255);
    border-color: rgb(0, 123, 255);
    color: rgb(255, 255, 255);
    white-space: normal;
  }
  .btn.btn-primary {
    background: rgb(0, 123, 255);
    border-color: rgb(0, 123, 255);
    color: rgb(255, 255, 255);
    white-space: normal;
  }
  .buy_now_btn {
    background-attachment: scroll;
    background-image: url("https://assets.checkoutchamp.com/bb6d9900-4f98-11ef-a365-7332b5bb1723/1722764088413_btn_bg.png");
    background-position: left top;
    background-repeat: repeat;
    background-size: auto;
    border-color: rgb(186, 147, 0) !important;
    border-radius: 30px;
    color: rgb(0, 0, 0) !important;
    font-family: "Open Sans", sans-serif;
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 0.5px;
    margin-bottom: 0px;
    margin-top: 0px;
    padding-left: 30px;
    padding-right: 30px;
    text-shadow: rgb(255, 255, 255) 0px 1px 0px !important;
  }
  .buy_now_btn:hover {
    border-color: rgb(243, 168, 0) !important;
    border-style: solid;
    box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 5px 0px;
  }
  .cbtb .cbtb-close {
    color: rgb(0, 0, 0);
    float: right;
    font-size: 21px;
    font-weight: 700;
    line-height: 1;
    opacity: 0.2;
    text-shadow: rgb(255, 255, 255) 0px 1px 0px;
  }
  .cbtb .cbtb-close:hover, .cbtb .cbtb-close:focus {
    color: rgb(0, 0, 0);
    cursor: pointer;
    opacity: 0.5;
    text-decoration: none;
  }
  .cbtb .cbtb-col-xs-1, .cbtb .cbtb-col-sm-1, .cbtb .cbtb-col-md-1, .cbtb .cbtb-col-lg-1, .cbtb .cbtb-col-xs-2, .cbtb .cbtb-col-sm-2, .cbtb .cbtb-col-md-2, .cbtb .cbtb-col-lg-2, .cbtb .cbtb-col-xs-3, .cbtb .cbtb-col-sm-3, .cbtb .cbtb-col-md-3, .cbtb .cbtb-col-lg-3, .cbtb .cbtb-col-xs-4, .cbtb .cbtb-col-sm-4, .cbtb .cbtb-col-md-4, .cbtb .cbtb-col-lg-4, .cbtb .cbtb-col-xs-5, .cbtb .cbtb-col-sm-5, .cbtb .cbtb-col-md-5, .cbtb .cbtb-col-lg-5, .cbtb .cbtb-col-xs-6, .cbtb .cbtb-col-sm-6, .cbtb .cbtb-col-md-6, .cbtb .cbtb-col-lg-6, .cbtb .cbtb-col-xs-7, .cbtb .cbtb-col-sm-7, .cbtb .cbtb-col-md-7, .cbtb .cbtb-col-lg-7, .cbtb .cbtb-col-xs-8, .cbtb .cbtb-col-sm-8, .cbtb .cbtb-col-md-8, .cbtb .cbtb-col-lg-8, .cbtb .cbtb-col-xs-9, .cbtb .cbtb-col-sm-9, .cbtb .cbtb-col-md-9, .cbtb .cbtb-col-lg-9, .cbtb .cbtb-col-xs-10, .cbtb .cbtb-col-sm-10, .cbtb .cbtb-col-md-10, .cbtb .cbtb-col-lg-10, .cbtb .cbtb-col-xs-11, .cbtb .cbtb-col-sm-11, .cbtb .cbtb-col-md-11, .cbtb .cbtb-col-lg-11, .cbtb .cbtb-col-xs-12, .cbtb .cbtb-col-sm-12, .cbtb .cbtb-col-md-12, .cbtb .cbtb-col-lg-12 {
    min-height: 1px;
    padding-left: 15px;
    padding-right: 15px;
    position: relative;
  }
  .cbtb .cbtb-img-circle {
    border-radius: 50%;
  }
  .cbtb .cbtb-img-rounded {
    border-radius: 6px;
  }
  .cbtb .cbtb-img-thumbnail {
    background-color: rgb(255, 255, 255);
    border: 1px solid rgb(221, 221, 221);
    border-radius: 4px;
    display: inline-block;
    height: auto;
    line-height: 1.42857;
    max-width: 100%;
    padding: 4px;
    transition: 0.2s ease-in-out;
  }
  .cbtb .cbtb-modal .cbtb-modal-dialog .cbtb-modal-content .cbtb-modal-header, .cbtb .cbtb-modal.cbtb-fade.cbtb-in .cbtb-modal-dialog .cbtb-modal-content .cbtb-modal-header {
    padding: 5px 15px;
  }
  .cbtb .cbtb-modal .cbtb-modal-dialog .cbtb-modal-content .cbtb-row, .cbtb .cbtb-modal.cbtb-fade.cbtb-in .cbtb-modal-dialog .cbtb-modal-content .cbtb-row {
    padding: 0px;
  }
  .cbtb .cbtb-modal .cbtb-modal-dialog .cbtb-modal-content, .cbtb .cbtb-modal.cbtb-fade.cbtb-in .cbtb-modal-dialog .cbtb-modal-content {
    border-radius: 0px 0px 6px 6px;
  }
  .cbtb .cbtb-modal .cbtb-modal-dialog, .cbtb .cbtb-modal.cbtb-fade.cbtb-in .cbtb-modal-dialog {
    border: medium;
    margin: 0px auto;
    max-width: 100%;
    padding: 0px;
    top: 0px;
    width: 400px;
  }
  .cbtb .cbtb-modal, .cbtb .cbtb-modal.cbtb-fade.cbtb-in {
    background: none;
    border: medium;
    box-shadow: none;
    inset: 0px;
    margin: 0px;
    padding: 0px;
    position: fixed;
    width: 100%;
    z-index: 2147483647;
  }
  .cbtb .cbtb-modal-backdrop {
    background-color: rgb(0, 0, 0);
    inset: 0px;
    opacity: 0 !important;
    position: fixed;
    z-index: 1040;
  }
  .cbtb .cbtb-modal-body {
    padding: 15px;
    position: relative;
  }
  .cbtb .cbtb-modal-footer {
    border-top: 1px solid rgb(229, 229, 229);
    padding: 15px;
    text-align: right;
  }
  .cbtb .cbtb-modal-header {
    border-bottom: 1px solid rgb(229, 229, 229);
    min-height: 16.4286px;
    padding: 15px;
  }
  .cbtb .cbtb-modal.cbtb-fade .cbtb-modal-dialog.tab.bottom-left .cbtb-modal-content, .cbtb .cbtb-modal.cbtb-in .cbtb-modal-dialog.tab.bottom-left .cbtb-modal-content, .cbtb .cbtb-modal.cbtb-fade.cbtb-in .cbtb-modal-dialog.tab.bottom-left .cbtb-modal-content, .cbtb .cbtb-modal.cbtb-fade .cbtb-modal-dialog.tab.bottom-right .cbtb-modal-content, .cbtb .cbtb-modal.cbtb-in .cbtb-modal-dialog.tab.bottom-right .cbtb-modal-content, .cbtb .cbtb-modal.cbtb-fade.cbtb-in .cbtb-modal-dialog.tab.bottom-right .cbtb-modal-content {
    border-bottom: medium;
    border-radius: 6px 6px 0px 0px;
  }
  .cbtb .cbtb-sr-only {
    border: 0px;
    clip: rect(0px, 0px, 0px, 0px);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0px;
    position: absolute;
    width: 1px;
  }
  .cbtb .cbtb-text-hide {
    background-color: transparent;
    border: 0px;
    color: transparent;
    font: 0px / 0 a;
    text-shadow: none;
  }
  .cbtb .cbtb.scraped-container-fluid {
    margin-left: auto;
    margin-right: auto;
    padding-left: 15px;
    padding-right: 15px;
  }
  .cbtb .trust-badge {
    border: medium !important;
    display: none !important;
  }
  .cbtb .trust-badge .cbtb-close, .cbtb .cbtb-modal-content .cbtb-close {
    color: rgb(47, 72, 92) !important;
    opacity: 0.6;
  }
  .cbtb .trust-badge .cbtb-modal-header, .cbtb .cbtb-modal-content .cbtb-modal-header {
    border-bottom: 1px solid rgb(204, 204, 204);
  }
  .cbtb .trust-badge, .cbtb .cbtb-modal-content {
    border: 1px solid rgb(204, 204, 204);
    color: rgb(47, 72, 92) !important;
  }
  .cbtb .trust-badge.black .cbtb-close, .cbtb .cbtb-modal-content.black .cbtb-close {
    color: rgb(255, 255, 255) !important;
  }
  .cbtb .trust-badge.black .cbtb-modal-header, .cbtb .cbtb-modal-content.black .cbtb-modal-header {
    border-bottom: 1px solid rgb(47, 72, 92);
  }
  .cbtb .trust-badge.black, .cbtb .cbtb-modal-content.black {
    background-color: rgb(0, 0, 0) !important;
    border: 1px solid rgb(47, 72, 92);
    color: rgb(255, 255, 255) !important;
  }
  .cbtb .trust-badge.dark-blue .cbtb-close, .cbtb .cbtb-modal-content.dark-blue .cbtb-close {
    color: rgb(204, 204, 204) !important;
  }
  .cbtb .trust-badge.dark-blue .cbtb-modal-header, .cbtb .cbtb-modal-content.dark-blue .cbtb-modal-header {
    border-bottom: 1px solid rgb(138, 149, 158);
  }
  .cbtb .trust-badge.dark-blue, .cbtb .cbtb-modal-content.dark-blue {
    background-color: rgb(47, 72, 92) !important;
    border: 1px solid rgb(138, 149, 158);
    color: rgb(204, 204, 204) !important;
  }
  .cbtb .trust-badge.dark-grey .cbtb-close, .cbtb .cbtb-modal-content.dark-grey .cbtb-close {
    color: rgb(204, 204, 204) !important;
  }
  .cbtb .trust-badge.dark-grey .cbtb-modal-header, .cbtb .cbtb-modal-content.dark-grey .cbtb-modal-header {
    border-bottom: 1px solid rgb(138, 149, 158);
  }
  .cbtb .trust-badge.dark-grey, .cbtb .cbtb-modal-content.dark-grey {
    background-color: rgb(51, 51, 51) !important;
    border: 1px solid rgb(138, 149, 158);
    color: rgb(204, 204, 204) !important;
  }
  .cbtb .trust-badge.header {
    border: medium !important;
  }
  .cbtb .trust-badge.light-blue .cbtb-close, .cbtb .cbtb-modal-content.light-blue .cbtb-close {
    color: rgb(47, 72, 92) !important;
  }
  .cbtb .trust-badge.light-blue .cbtb-modal-header, .cbtb .cbtb-modal-content.light-blue .cbtb-modal-header {
    border-bottom: 1px solid rgb(138, 149, 158);
  }
  .cbtb .trust-badge.light-blue, .cbtb .cbtb-modal-content.light-blue {
    background-color: rgb(196, 220, 235) !important;
    border: 1px solid rgb(138, 149, 158);
    color: rgb(47, 72, 92) !important;
  }
  .cbtb .trust-badge.light-green .cbtb-close, .cbtb .cbtb-modal-content.light-green .cbtb-close {
    color: rgb(47, 72, 92) !important;
  }
  .cbtb .trust-badge.light-green .cbtb-modal-header, .cbtb .cbtb-modal-content.light-green .cbtb-modal-header {
    border-bottom: 1px solid rgb(204, 204, 204);
  }
  .cbtb .trust-badge.light-green, .cbtb .cbtb-modal-content.light-green {
    background-color: rgb(200, 237, 200) !important;
    border: 1px solid rgb(204, 204, 204);
    color: rgb(47, 72, 92) !important;
  }
  .cbtb .trust-badge.light-grey .cbtb-close, .cbtb .cbtb-modal-content.light-grey .cbtb-close {
    color: rgb(47, 72, 92) !important;
  }
  .cbtb .trust-badge.light-grey .cbtb-modal-header, .cbtb .cbtb-modal-content.light-grey .cbtb-modal-header {
    border-bottom: 1px solid rgb(204, 204, 204);
  }
  .cbtb .trust-badge.light-grey, .cbtb .cbtb-modal-content.light-grey {
    background-color: rgb(242, 242, 242) !important;
    border: 1px solid rgb(204, 204, 204);
    color: rgb(47, 72, 92) !important;
  }
  .cbtb .trust-badge.light-yellow .cbtb-close, .cbtb .cbtb-modal-content.light-yellow .cbtb-close {
    color: rgb(47, 72, 92) !important;
  }
  .cbtb .trust-badge.light-yellow .cbtb-modal-header, .cbtb .cbtb-modal-content.light-yellow .cbtb-modal-header {
    border-bottom: 1px solid rgb(138, 149, 158);
  }
  .cbtb .trust-badge.light-yellow, .cbtb .cbtb-modal-content.light-yellow {
    background-color: rgb(250, 235, 171) !important;
    border: 1px solid rgb(138, 149, 158);
    color: rgb(47, 72, 92) !important;
  }
  .cbtb .trust-badge.tab {
    border-radius: 0px 0px 5px 5px;
    height: 50px;
    left: 10px;
    padding: 5px 10px;
    position: absolute;
    top: 0px;
    width: 190px;
    z-index: 2147483646;
  }
  .cbtb .trust-badge.tab.bottom-left, .cbtb .trust-badge.tab.bottom-right {
    border-bottom: medium;
    border-radius: 5px 5px 0px 0px;
    bottom: 0px;
    position: fixed;
    top: auto;
  }
  .cbtb .trust-badge.tab.top-left, .cbtb .trust-badge.tab.top-right {
    border-top: medium;
  }
  .cbtb .trust-badge.tab:hover {
    animation: 500ms pulse;
  }
  .cbtb-close {
    appearance: none;
    background: transparent;
    border: 0px;
    cursor: pointer;
    padding: 0px;
  }
  .cc-bottom-nav-carousel, .cc-bottom-nav-carousel .cc-thumnail-carousel-slide {
    margin: 5px;
    padding: 5px;
  }
  .cc-cart-details-block .cc-cart-details-value, .cc-cart-details-block .cc-cart-details-label {
    display: block;
    font-size: 16px;
    font-weight: 400;
    text-align: right;
    width: auto;
  }
  .cc-side-nav-carousel .cc-thumnail-carousel-slide {
    height: auto;
    margin: 5px;
    padding: 5px;
    width: 100%;
  }
  .close_popup {
    background: #000;
    border: 2px solid #fff;
    border-radius: 50%;
    color: #fff;
    float: right;
    padding: 5px 6px;
    position: relative;
    right: -8px;
    top: -10px;
  }
  .colon {
    font-size: 1rem;
    margin: 0px;
    padding: 0px;
  }
  .countdown-block {
    display: inline-block;
    margin: 0px 10px;
    padding: 10px;
  }
  .countdown-digit {
    font-size: 1rem;
  }
  .countdown-endtext {
    font-size: 5rem;
  }
  .fa-caret-down {
    color: rgb(255, 255, 255) !important;
  }
  .fees-text {
    color: #000000 !important;
    font-family: Helvetica, serif;
    font-size: 20px;
    font-weight: 700;
    line-height: 30px;
    padding: 10px;
    text-align: center;
  }
  .fk-bullet {
    font-size: 20px;
    font-weight: 700;
    list-style: none;
    padding: 2px 15px;
    text-align: left;
  }
  .fk-bullet-icon-container {
    padding: 5px 10px 5px 5px;
  }
  .fk-bullet-list-container {
    align-items: baseline;
    display: flex;
    flex-direction: row;
    padding: 5px;
  }
  .fk-collapsible-list-content {
    border-radius: 0px 0px 5px 5px;
    display: block;
  }
  .fk-collapsible-list-label-text {
    color: rgb(255, 255, 255) !important;
  }
  .fk-collapsible-list-left-label {
    border-radius: 5px 5px 0px 0px;
  }
  .fk-collapsible-list-right-label {
    border-radius: 5px 5px 0px 0px;
  }
  .fk-inner-header-wrapper .fk-menu-container .fk-menu {
    color: black;
    padding: 5px;
    white-space: nowrap;
  }
  .fk-inner-header-wrapper .fk-menu-container .fk-menu:hover, .fk-inner-header-wrapper .fk-menu-container .fk-menu:focus {
    color: black;
  }
  .fk-payment-option-body {
    border: 1px solid rgb(217, 217, 217);
    display: flex;
  }
  .fk-payment-option-container:first-child .fk-payment-option-header-wrapper {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
  .fk-payment-option-container:last-child .fk-payment-option-body {
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
  }
  .fk-payment-option-container:last-child .fk-payment-option-header-wrapper {
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
  }
  .fk-payment-option-header-wrapper {
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
  }
  .fk-popup {
    background-color: #0e0d0d91;
    bottom: 0;
    display: none;
    height: auto;
    inset: 0px;
    left: 0;
    min-height: 300px;
    opacity: 1;
    overflow: auto;
    position: fixed;
    right: 0;
    top: 0;
    z-index: 999999;
  }
  .fk-product-variant-select .variant-label1, .fk-product-variant-select .variant-label2, .fk-product-variant-select .variant-label3 {
    background-size: contain;
    border: 2px solid rgb(197, 202, 205);
    flex: 1 1 0%;
    height: auto;
    margin: 10px;
    padding: 10px;
    width: auto;
  }
  .fk-shopping-cart .dynamic-price-total, .fk-shopping-cart .dynamic-shipping-total, .fk-shopping-cart .salesTax, .fk-shopping-cart .discount, .fk-shopping-cart .grandTotal {
    font-size: 1rem;
    font-weight: 500;
    margin-right: 0.75rem;
    width: 20%;
  }
  .fk-youtube .fk-rm.image {
    -webkit-background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    height: 100%;
    position: absolute;
    width: 100%;
  }
  .fk-youtube .play-button {
    background-color: #333;
    border-radius: 6px;
    box-shadow: 0 0 30px rgba( 0,0,0,0.6 );
    height: 60px;
    opacity: 0.8;
    width: 90px;
    z-index: 1;
  }
  .fk-youtube .play-button:before {
    border-color: transparent transparent transparent #fff;
    border-style: solid;
    border-width: 15px 0 15px 26.0px;
    content: "";
  }
  .font-000000FF {
    color: rgb(0, 0, 0);
  }
  .form-check .form-check-input {
    accent-color: rgb(223, 44, 100);
    position: relative;
    top: 5px;
  }
  .form-check.selectedWB {
    background-color: rgb(252, 234, 234) !important;
    border: 2px solid rgb(223, 44, 100) !important;
  }
  .form-check.selectedWB .form-check-input {
    accent-color: rgb(223, 44, 100);
  }
  .header-div {
    font-family: Proxima Nova, Helvetica, Arial, sans-serif !important;
    font-size: 38px;
    font-weight: 700;
    line-height: 45.6px;
  }
  .horizontal-line-default {
    background-color: rgb(0, 0, 0);
    max-width: 100%;
    width: 100%;
  }
  .input-wrap .ch-input, .select-wrap .ch-select {
    appearance: none;
    border: 1px solid rgb(217, 217, 217);
    color: rgb(51, 51, 51);
    font-size: 14px;
    height: 50px;
    outline: none;
    width: 100%;
  }
  .input-wrap .ch-input:focus, .select-wrap .ch-select:focus {
    border-color: rgb(25, 123, 189);
    box-shadow: rgb(25, 123, 189) 0px 0px 0px 1px;
    outline: none;
  }
  .input-wrap .input-label {
    color: rgb(153, 153, 153);
    font-size: 14px;
    font-weight: normal;
    left: 0px;
    overflow: hidden;
    padding-left: 13px;
    padding-right: 13px;
    pointer-events: none;
    position: absolute;
    top: 15px;
    white-space: nowrap;
    width: calc(100% - 13px);
  }
  .ms-collapsed .basic-information-section {
    border-bottom: 1px solid transparent;
    height: 0px;
  }
  .popup-header {
    color: #353535 !important;
  }
  .popup-title {
    font-size: 21px;
    font-weight: 400;
    line-height: 28px;
  }
  .review-body {
    padding: 22px;
  }
  .review-card {
    background: var(--card);
    border: 1px solid var(--line);
    border-radius: 16px;
    box-shadow: 0 6px 18px rgba(0,0,0,.04);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .review-quote {
    color: var(--text);
    font-size: 14px;
    line-height: 1.65;
    margin: 0 0 18px 0;
    position: relative;
  }
  .reviewer {
    align-items: center;
    color: var(--text);
    display: flex;
    font-weight: 600;
    gap: 12px;
    margin-top: 6px;
  }
  .reviews-section {
    background: var(--bg);
    border-radius: 18px;
    font-family: "Open Sans", Arial, sans-serif;
    margin: 0 auto;
    max-width: 1000px;
    padding: 32px 20px;
  }
  .select-wrap .ch-select {
    padding-right: 32px;
  }
  .select-wrap .ch-select.ch-dirty {
    padding-top: 22px;
  }
  .selected-label {
    border: 3px solid rgb(1, 105, 156) !important;
  }
  .sidepanel .cc-panel-view-cart, .sidepanel .cc-panel-checkout {
    font-size: 16px;
    margin: 0px auto;
    padding: 5px 0px;
  }
  .table-4lp .title-dla {
    font-size: 26px;
  }
  .table-hs3 .title-dla {
    color: white;
  }
  .text-ywn {
    color: rgb(52, 58, 64);
  }
  .trust-statement {
    font-size: 14px !important;
  }
  .video-w-desktop {
    margin: auto;
    max-width: 1200px;
    padding-left: 0px !important;
    padding-right: 0px !important;
  }
```

### J. All Static Text Content (from HTML)

  `#NoButton1` (div): `Refund Policy Privacy Policy Terms of Service`
  `#cc-id-2WzVuRbvO05r` (span): `00 Minutes : : 00 Seconds`
  `#cc-id-38kk2yWQCOQO` (div): `00 Minutes`
  `#cc-id-7zXHFA86hCmp` (button): `SELECT TO SAVE $953`
  `#cc-id-AAcqGm0xIULD` (div): `Are You Sure?`
  `#cc-id-Ba6p8E9Znmxj` (span): `This is a one-time only offer 🔥`
  `#cc-id-NelMQjYpN8aS` (div): `WAIT {{firstName}}!`
  `#cc-id-T4M1OI7GNUta` (h1): `This is a one-time only offer 🔥`
  `#cc-id-WHXG5juLVM69` (div): `Seconds`
  `#cc-id-XgABu5x5LCjX` (h1): `Are You Sure?`
  `#cc-id-afpk1MR7uStc` (div): `Minutes`
  `#cc-id-eU4iztnkuUdD` (button): `SELECT TO SAVE $1,879`
  `#cc-id-eWKxowVKCq6ss` (button): `SELECT TO SAVE $353`
  `#cc-id-ksoXspKnoV1K` (h3): `1x  SmoothSpine Multitherapy Pro`
  `#cc-id-nOpsX2g68A2k` (span): `1x  SmoothSpine Multitherapy Pro`
  `#cc-id-pDzC9oKjcRax` (li): `WAIT {{firstName}}! Your Order Is Not Complete Yet Please Watch This Important M`
  `#cc-id-pOmIMXZh2kSm` (div): `00 Seconds`
  `#cc-id-tdfobXy0kVTm` (div): `✖ Yes, cancel my upgrade 👍 No, accept my upgrade`
  `#cc-id-vG0lEF3T1Th7` (h3): `1x  SmoothSpine Multitherapy Pro`
  `#countdownCont-4` (span): `00 : : 00`
  `#customizable_popup` (div): `Are You Sure? This is a one-time only offer 🔥 The upgrade is only available for `
  `#fkt-link-445-b8f-b29` (a): `No thanks, maybe Later...`
  `#fkt-link-490-292-b70` (a): `Terms of Service`
  `#fkt-link-509-795-ab8` (a): `Privacy Policy`
  `#fkt-link-5f5-4b2-a41` (a): `No thanks, - I do not want to heal my Sciatica in half the time and I
	  underst`
  `#fkt-link-636-784-a01` (a): `Refund Policy`
  `#fkt-link-f12-5b5-a1f` (a): `YES UPGRADE MY ORDER!`
  `#i0228r6` (div): `Experience Relief Within 15 Minutes`
  `#i039xon` (div): `6 Technologies Working In Synergy`
  `#i0b4i` (b): `DO THIS FIRST:`
  `#i0bezj` (div): `100% Satisfaction 180-Day Money-Back Guarantee`
  `#i0y7uq-2` (b): `based on 1,548 reviews!`
  `#i1ebd8i` (div): `Experience Relief Within 15 Minutes`
  `#i1fmrq` (div): `THIS UPGRADE IS ONLY AVAILABLE FOR THE NEXT: : 00 : : 00`
  `#i1hlj` (div): `IMPORTANT: Do NOT Close This Window Or Click The "Back" Button:`
  `#i1meq` (div): `Please Watch This Important Message Below Now`
  `#i2b95` (div): `Your Order Is Not Complete Yet`
  `#i2cl47` (div): `UPGRADE TO 2`
  `#i308di8` (div): `6 Technologies Working In Synergy`
  `#i30sen4` (div): `+$123.50 each`
  `#i34tqi` (div): `Experience Relief Within 15 Minutes`
  `#i3jt56` (div): `BEST VALUE`
  `#i3qb8s` (div): `00 Minutes : : 00 Seconds`
  `#i3w2y` (span): `Mike M`
  `#i4ysb2` (div): `180-Days Money-Back Guarantee`
  `#i4z7f4` (div): `3,500+ Happy Customers`
  `#i52fhp` (div): `WAIT {{firstName}}! Your Order Is Not Complete Yet Please Watch This Important M`
  `#i5guu` (div): `Your Order Is Not Complete Yet`
  `#i5h1oh` (div): `WHICH UPGRADE DO YOU CHOOSE? THIS UPGRADE IS ONLY AVAILABLE FOR THE NEXT: : 00 :`
  `#i5ocpe` (div): `Wait…$147 is too much?`
  `#i5s8knj` (div): `3,500+ Happy Customers`
  `#i5yjt` (div): `IMPORTANT: Do NOT Close This Window Or Click The "Back" Button: It may double-bi`
  `#i793x4` (span): `Susan M`
  `#i7jrua` (div): `6 Technologies Working In Synergy`
  `#i7uujdx` (div): `( $185 Total )`
  `#i7y8gi` (div): `★★★★★ OVER 65,000+ HAPPY CUSTOMERS 1x  SmoothSpine Multitherapy Pro Only +$127 $`
  `#i7ylnlf` (div): `Heals Knees From The Inside Out`
  `#i80fgbh` (div): `Experience Relief Within 15 Minutes`
  `#i8dnp9` (div): `Your Order Is Not Complete Yet`
  `#i9dzv5` (div): `Experience Relief Within 15 Minutes`
  `#i9znnvq` (div): `3,500+ Happy Customers`
  `#iawhif` (button): `👍 No, accept my upgrade`
  `#iax499` (div): `Experience Relief Within 15 Minutes`
  `#ibgczp` (div): `The upgrade is only available for the next`
  `#ibxj7p` (div): `Heals Sciatica And Back Pain From The Inside Out`
  `#ic7jlo` (div): `SECURE OUR LOWEST PRICE ON THE INTERNET`
  `#icadox` (span): `WHICH UPGRADE DO YOU CHOOSE?`
  `#icb25i6` (div): `Heals Sciatica And Back Pain From The Inside Out`
  `#icfidi` (div): `MOST POPULAR UPGRADE TO 2`
  `#icgjep` (b): `180-day 100% money-back guarantee`
  `#icifvmc` (div): `180-Days Money-Back Guarantee`
  `#iedtk9d` (div): `3,500+ Happy Customers`
  `#iekcwz` (span): `: 00 : : 00`
  `#ieugr9u` (div): `Heals Knees From The Inside Out`
  `#iezvaz` (div): `Refund Policy Privacy Policy Terms of Service`
  `#if3fiu` (div): `6 Technologies Working In Synergy`
  `#ifcvz0x` (div): `3,500+ Happy Customers`
  `#ife8j1` (div): `Get 70% OFF... 1x  SmoothSpine Multitherapy Pro`
  `#iftkwi` (ul): `WAIT {{firstName}}! Your Order Is Not Complete Yet Please Watch This Important M`
  `#ifuxb4` (div): `: 00 : : 00`
  `#ig0vd7` (div): `WAIT {{firstName}}!`
  `#igrshc` (div): `Susan M`
  `#igzhht` (div): `Heals Sciatica And Back Pain From The Inside Out`
  `#ih4wig` (div): `SELECT TO SAVE $353`
  `#ih4wig-2` (div): `SELECT TO SAVE $953`
  `#ih4wig-3` (div): `SELECT TO SAVE $1,879`
  `#iheazj` (div): `WAIT {{firstName}}! Your Order Is Not Complete Yet Please Watch This Important M`
  `#ihlkrn` (div): `THIS UPGRADE IS ONLY AVAILABLE FOR THE NEXT:`
  `#ii2umi` (span): `DO THIS FIRST:`
  `#ii3if` (div): `It may double-bill your card`
  `#iice3sv` (div): `Reduces Swelling & Increases Mobility`
  `#iif9e9-2` (b): `Our customers say`
  `#iifwqfh` (div): `Experience Relief Within 15 Minutes`
  `#iin3hd` (div): `★★★★★ OVER 65,000+ HAPPY CUSTOMERS`
  `#iiubk` (div): `Jaxon P`
  `#iiunhd` (span): `★★★★★`
  `#ij39xl` (div): `2x SmoothSpine Multitherapy Pro`
  `#ij5qsh` (div): `Only +$127 $500`
  `#ij6e4` (div): `Mike M`
  `#ijp6t` (span): `Your Order Is Not Complete Yet`
  `#ijrsuo` (div): `Experience Relief Within 15 Minutes`
  `#ijtvht` (span): `Please Watch This Important Message Below Now`
  `#ik20m7-3` (div): `Refund Policy Privacy Policy Terms of Service`
  `#ik681rk` (div): `Heals Knees From The Inside Out`
  `#ikn1ck` (span): `Experience Relief Within 15 Minutes`
  `#im0s07` (div): `The upgrade is only available for the next 00 : : 00`
  `#im1np6` (div): `★★★★★ OVER 65,000+ HAPPY CUSTOMERS 1x  SmoothSpine Multitherapy Pro Only +$127 $`
  `#im5mnj` (div): `Your Order Is Not Complete Yet Please Watch This Important Message Below Now`
  `#im7kqa` (div): `BASIC UPGRADE TO 1`
  `#imwkh3` (div): `WAIT {{firstName}}!`
  `#in179h` (div): `1x  SmoothSpine Multitherapy Pro`
  `#incb2h` (div): `WHICH UPGRADE DO YOU CHOOSE? THIS UPGRADE IS ONLY AVAILABLE FOR THE NEXT: : 00 :`
  `#io6mok` (div): `Please Watch This Important Message Below Now`
  `#io6plp` (b): `WHICH UPGRADE DO YOU CHOOSE?`
  `#iotdv9g` (span): `Experience Relief Within 15 Minutes`
  `#iowya` (div): `DO THIS FIRST: Please watch this important New Customer update from Dr. Schillin`
  `#ipns6l` (span): `Experience Relief Within 15 Minutes`
  `#ipphk8` (div): `6 Technologies Working In Synergy`
  `#ipppiy` (div): `( +$147 Total )`
  `#ipsth` (div): `DO THIS FIRST: Please watch this important New Customer update from Dr. Schillin`
  `#iqe2el3` (div): `Reduces Swelling & Increases Mobility`
  `#iqls1y` (div): `3,500+ Happy Customers`
  `#iqpg65` (div): `Heals Sciatica And Back Pain From The Inside Out`
  `#iqshmj` (div): `3 Red Light Pro Devices`
  `#ir3abk9` (div): `Reduces Swelling & Increases Mobility`
  `#iropysq` (div): `Heals Sciatica And Back Pain From The Inside Out`
  `#iruszwh` (div): `90-Days Money-Back Guarantee`
  `#irvrk` (div): `Your Order Is Not Complete Yet Please Watch This Important Message Below Now`
  `#irwkl3` (div): `DO THIS FIRST: Please watch this important New Customer update from Dr. Schillin`
  `#iss5w6` (strike): `$500`
  `#itex5l` (b): `Only +$127 $500`
  `#ith2yt-2` (span): `based on`
  `#itigy` (div): `IMPORTANT: Do NOT Close This Window Or Click The "Back" Button: It may double-bi`
  `#itj3z3` (div): `BASIC`
  `#itogax` (b): `100% Satisfaction 180-Day Money-Back Guarantee`
  `#itp5lej` (div): `Heals Sciatica And Back Pain From The Inside Out`
  `#itpyhsq` (div): `$61 / each`
  `#itrbez` (span): `$500`
  `#its9l7l` (div): `6 Technologies Working In Synergy`
  `#iu2k54` (div): `No thanks, - I do not want to heal my Sciatica in half the time and I
	  underst`
  `#iugqyl` (div): `+$147`
  `#iuh42u` (button): `✖ Yes, cancel my upgrade`
  `#iw178h` (div): `UPGRADE TO 1`
  `#iwd04` (div): `IMPORTANT: Do NOT Close This Window Or Click The "Back" Button:`
  `#iwt1j2` (div): `1x SmoothSpine Multitherapy Pro`
  `#iwxmah` (div): `Experience Relief Within 15 Minutes`
  `#ix1whc-3` (div): `Wait…$147 is too much?`
  `#ixgb6m` (div): `✖ Yes, cancel my upgrade 👍 No, accept my upgrade`
  `#ixmq47j` (div): `( +$247 Total )`
  `#ixmwqk` (div): `BEST VALUE UPGRADE TO 3`
  `#ixnv7l` (div): `00 : : 00`
  `#iyj5fm` (div): `UPGRADE TO 3`
  `#izi6sl` (div): `MOST POPULAR`
  `#pageDataScript` (script): `var pageData = {"pageViewReferenceId":"658f2a09-d731-4803-9108-0c3d7fa8f1e9","fu`
  `#popup_content` (div): `Are You Sure? This is a one-time only offer 🔥 The upgrade is only available for `

### K. JavaScript Template Texts

- `); // Step 2: Confirm payment with Stripe.js console.log(`
- `); e.preventDefault(); orderSummary.classList.toggle(`
- `); orderSummary.classList.toggle(`
- `); orders.unshift(order); localStorage.setItem(`
- `); updateOrderStatus(order.id,`
- `, JSON.stringify(orders)); console.log(`
- `, currencyCode); // Create order draft BEFORE payment processing console.log(`
- `, error); // Update order status to failed updateOrderStatus(order.id,`
- `, foundDiscount); appliedDiscountCode = foundDiscount; setTimeout(() => { syncOrderSummaryWithProduc`
- `, orderId); } catch (error) { console.error(`
- `.order-applied-discount-remove`
- `.order-discount-code-button`
- `.order-discount-code-input`
- `.order-summary-body`
- `.order-summary-header`
- `; // Order Item bodyHTML +=`
- `; productRow.style.borderLeft =`
- `; r.style.borderLeft =`
- `; row.style.borderColor =`
- `; row.style.borderLeft =`

---

## VSL OTO2 (upsell-vsl-oto-2.html)

- **File size**: 667,135 bytes | **Custom CSS**: 15,993 bytes
- **Timer**: 7 min
- **ID rules**: 0 | **Class rules**: 0 | **Keyframes**: 0

### A. Interrupt Header

**ID**: `#i44wv3-3` | **Tag**: `<div>` | **Text**: `WAIT! Your Order Is Not Complete Yet Please Watch This Important Message Below N`

**ID**: `#ilublk` | **Tag**: `<div>` | **Text**: `WAIT! Your Order Is Not Complete Yet`

**ID**: `#i6gd7v` | **Tag**: `<div>` | **Text**: `Please Watch This Important Message Below Now`

**ID**: `#i4k4gj` | **Tag**: `<div>` | **Text**: `Please Watch This Important Message Below Now`

**ID**: `#i3im5w` | **Tag**: `<h1>` | **Text**: `WAIT... Is $98 too much?`

**ID**: `#i13plo` | **Tag**: `<span>` | **Text**: `WAIT... Is $98 too much?`

### B. Countdown Timer

_No countdown timer_

### C. Headlines

**<h2>** `ADD TO ORDER`

**<h2>** `ADD TO ORDER`

**<h2>** `ADD TO ORDER`

**<h1>** `WAIT... Is $98 too much?`

**<h2>** `ADD TO ORDER`

### D. CTA Button

**Text**: `1x SmoothSpine™ NMES Massager $49.99 /each SAVE 50%! TOTAL: $49.99 FREE SHIPPING`
**Tag**: `<div>` | **ID**: `#iw98q`

**Text**: `$49.99 /each SAVE 50%! TOTAL: $49.99 FREE SHIPPING ADD TO ORDER 90 DAY MONEY BAC`
**Tag**: `<div>` | **ID**: `#i2erv`

**Text**: `ADD TO ORDER 90 DAY MONEY BACK GUARANTEE!`
**Tag**: `<a>` | **ID**: `#fkt-link-c43-db3-b64`

**Text**: `$32.99 /each SAVE 70%! TOTAL: $98.97 BIGGEST DISCOUNT FREE SHIPPING 90 DAY GUARA`
**Tag**: `<div>` | **ID**: `#ibriog`

**Text**: `ADD TO ORDER 90 DAY MONEY BACK GUARANTEE!`
**Tag**: `<a>` | **ID**: `#fkt-link-408-784-a35`

**Text**: `$24.99 /each SAVE 65%! TOTAL: $149.94 FREE SHIPPING 90 DAY GUARANTEE ADD TO ORDE`
**Tag**: `<div>` | **ID**: `#ionbdz`

**Text**: `ADD TO ORDER 90 DAY MONEY BACK GUARANTEE!`
**Tag**: `<a>` | **ID**: `#fkt-link-110-c97-afe`

**Text**: `ADD TO ORDER 90 DAY MONEY BACK GUARANTEE! * Plus applicable sales tax No thanks,`
**Tag**: `<div>` | **ID**: `#irvl04-3`

**Text**: `ADD TO ORDER 90 DAY MONEY BACK GUARANTEE!`
**Tag**: `<a>` | **ID**: `#fkt-link-408-784-a35-2`

### E. Opt-Out (Negative Option)

**Text**: `No thank you... I'm declining this offer. I fully understand this may be my only`
**Tag**: `<div>` | **ID**: `#ieb4w`

**Text**: `No thank you... I'm declining this offer. I fully understand this may be my only`
**Tag**: `<div>` | **ID**: `#ibm8tk`

**Text**: `No thank you... I'm declining this offer. I fully understand this may be my only`
**Tag**: `<a>` | **ID**: `#fkt-link-cc4-396-a3c`

**Text**: `ADD TO ORDER 90 DAY MONEY BACK GUARANTEE! * Plus applicable sales tax No thanks,`
**Tag**: `<div>` | **ID**: `#irvl04-3`

**Text**: `No thanks, maybe Later...`
**Tag**: `<a>` | **ID**: `#fkt-link-e08-ebe-bd5`

### F. Price Elements

_No price-specific CSS found (prices rendered via JS)_

### G. Guarantee

**Text**: `$49.99 /each SAVE 50%! TOTAL: $49.99 FREE SHIPPING ADD TO ORDER 90 DAY MONEY BAC`

**Text**: `ADD TO ORDER 90 DAY MONEY BACK GUARANTEE!`

**Text**: `90 DAY MONEY BACK GUARANTEE!`

**Text**: `$32.99 /each SAVE 70%! TOTAL: $98.97 BIGGEST DISCOUNT FREE SHIPPING 90 DAY GUARA`

**Text**: `90 DAY GUARANTEE`

**Text**: `90 DAY GUARANTEE`

**Text**: `ADD TO ORDER 90 DAY MONEY BACK GUARANTEE!`

**Text**: `90 DAY MONEY BACK GUARANTEE!`

**Text**: `$24.99 /each SAVE 65%! TOTAL: $149.94 FREE SHIPPING 90 DAY GUARANTEE ADD TO ORDE`

**Text**: `90 DAY GUARANTEE`

**Text**: `90 DAY GUARANTEE`

**Text**: `ADD TO ORDER 90 DAY MONEY BACK GUARANTEE!`

**Text**: `90 DAY MONEY BACK GUARANTEE!`

**Text**: `90 DAY GUARANTEE`

**Text**: `90 DAY GUARANTEE`

**Text**: `ADD TO ORDER 90 DAY MONEY BACK GUARANTEE! * Plus applicable sales tax No thanks,`

**Text**: `ADD TO ORDER 90 DAY MONEY BACK GUARANTEE!`

**Text**: `90 DAY MONEY BACK GUARANTEE!`

### H. Key ID-Based CSS (Conversion-Relevant)

```css
```

### I. Key Class-Based CSS

```css
```

### J. All Static Text Content (from HTML)

  `#fkt-link-101-d8b-bc4` (a): `Privacy Policy`
  `#fkt-link-110-c97-afe` (a): `ADD TO ORDER 90 DAY MONEY BACK GUARANTEE!`
  `#fkt-link-408-784-a35` (a): `ADD TO ORDER 90 DAY MONEY BACK GUARANTEE!`
  `#fkt-link-408-784-a35-2` (a): `ADD TO ORDER 90 DAY MONEY BACK GUARANTEE!`
  `#fkt-link-51c-d80-bca` (a): `Terms Of Service`
  `#fkt-link-881-999-bf2` (a): `Return Policy`
  `#fkt-link-c43-db3-b64` (a): `ADD TO ORDER 90 DAY MONEY BACK GUARANTEE!`
  `#fkt-link-cc4-396-a3c` (a): `No thank you... I'm declining this offer. I fully understand this may be my only`
  `#fkt-link-e08-ebe-bd5` (a): `No thanks, maybe Later...`
  `#i02a58` (div): `SAVE 65%!`
  `#i13plo` (span): `WAIT... Is $98 too much?`
  `#i1bckl` (div): `SmoothSpine™ NMES Massager (Buy 2 Get 1 FREE)`
  `#i1dw0c` (div): `FREE SHIPPING`
  `#i1e8y` (div): `SAVE 50%!`
  `#i1q3y2` (div): `/each`
  `#i1q3y2-2` (div): `/each`
  `#i1vxe4` (div): `$32.99`
  `#i1vxe4-2` (div): `$25.00`
  `#i2erv` (div): `$49.99 /each SAVE 50%! TOTAL: $49.99 FREE SHIPPING ADD TO ORDER 90 DAY MONEY BAC`
  `#i3im5w` (h1): `WAIT... Is $98 too much?`
  `#i3k27b` (span): `$32.99`
  `#i3k27b-2` (span): `$25.00`
  `#i44wv3-3` (div): `WAIT! Your Order Is Not Complete Yet Please Watch This Important Message Below N`
  `#i45u3` (div): `/each`
  `#i4hrhh` (i): `* Plus applicable sales tax`
  `#i4jsn4` (div): `FREE SHIPPING`
  `#i4k4gj` (div): `Please Watch This Important Message Below Now`
  `#i4og4k` (div): `FREE SHIPPING`
  `#i4xbpm` (div): `FREE SHIPPING`
  `#i55qtf` (div): `90 DAY GUARANTEE`
  `#i58y9r` (div): `90 DAY GUARANTEE`
  `#i6bjw8` (div): `90 DAY GUARANTEE`
  `#i6gd7v` (div): `Please Watch This Important Message Below Now`
  `#i7i9gc` (div): `CHOOSE YOUR PACKAGE`
  `#i7jldl` (div): `90 DAY GUARANTEE`
  `#i7ln43` (div): `$24.99`
  `#i7orl2` (div): `SmoothSpine - Copyright {{yyyy}} - All Rights Reserved. Privacy Policy - Terms O`
  `#i80w5i` (div): `* Plus applicable sales tax`
  `#i80w5i-2` (div): `* Plus applicable sales tax`
  `#i84ggv` (h2): `ADD TO ORDER`
  `#i8887j` (span): `SAVE 70%!`
  `#i8887j-2` (span): `SAVE 80%!`
  `#i8jb3a` (div): `+1 (270) 517-6971 • support@SmoothSpine.com`
  `#i8wis` (div): `* Plus applicable sales tax`
  `#i8ze0g` (h2): `ADD TO ORDER`
  `#i8ze0g-2` (h2): `ADD TO ORDER`
  `#i9jzmh` (div): `$32.99 /each SAVE 70%!`
  `#i9jzmh-4` (div): `$25.00 /each SAVE 80%!`
  `#i9oasl` (div): `Privacy Policy - Terms Of Service - Return Policy`
  `#ibh98f` (div): `* Plus applicable sales tax`
  `#ibm8tk` (div): `No thank you... I'm declining this offer. I fully understand this may be my only`
  `#ibriog` (div): `$32.99 /each SAVE 70%! TOTAL: $98.97 BIGGEST DISCOUNT FREE SHIPPING 90 DAY GUARA`
  `#icqx7y` (div): `SAVE 70%!`
  `#icqx7y-2` (div): `SAVE 80%!`
  `#idg1h` (div): `$49.99`
  `#idhpw` (div): `SAVE 50%!`
  `#ie909` (div): `$49.99`
  `#ie948z` (p): `90 DAY MONEY BACK GUARANTEE!`
  `#ie9w8y` (div): `FREE SHIPPING`
  `#ieb4w` (div): `No thank you... I'm declining this offer. I fully understand this may be my only`
  `#iepl08` (div): `SmoothSpine™ NMES Massager (Buy 3 Get 3 FREE) SmoothSpine™ NMES Massager (Buy 3 `
  `#if2h4i` (div): `$32.99`
  `#if2h4i-2` (div): `$25.00`
  `#ifj73` (div): `** Do not hit your back button as you might accidentally place a double order. *`
  `#ifntif` (div): `SmoothSpine™ NMES Massager (Buy 3 Get 3 FREE)`
  `#ify1au` (div): `FREE SHIPPING`
  `#ighx0a` (div): `$32.99`
  `#ighx0a-2` (div): `$25.00`
  `#igmtk8` (div): `SAVE 65%!`
  `#igwq09` (div): `/each`
  `#ih8tpk` (div): `/each`
  `#ii8i2q` (div): `$24.99 /each SAVE 65%!`
  `#iiki0i` (div): `90 DAY GUARANTEE`
  `#iipso` (i): `* Plus applicable sales tax`
  `#iiqlm` (div): `TOTAL: $49.99`
  `#ij3ti` (div): `/each SAVE 50%!`
  `#ijk25h` (h2): `ADD TO ORDER`
  `#ijqf6s` (div): `SAVE 70%!`
  `#ijqf6s-2` (div): `SAVE 80%!`
  `#ikdshh` (div): `SmoothSpine™ NMES Massager (Buy 2 Get 1 FREE) SmoothSpine™ NMES Massager (Buy 2 `
  `#ikxs3j` (div): `/each SAVE 70%!`
  `#ikxs3j-2` (div): `/each SAVE 80%!`
  `#il3fp` (div): `1x SmoothSpine™ NMES Massager`
  `#illw4y` (div): `SmoothSpine™ NMES Massager (Buy 3 Get 3 FREE)`
  `#ilublk` (div): `WAIT! Your Order Is Not Complete Yet`
  `#imxp0y` (div): `BIGGEST DISCOUNT`
  `#imxp0y-2` (div): `BIGGEST DISCOUNT`
  `#imybgf` (div): `/each`
  `#io6mxx` (div): `/each`
  `#io6mxx-2` (div): `/each`
  `#io9azm` (div): `Get 80% OFF... Buy 2 Get 1 FREE`
  `#ioafc` (div): `/each`
  `#ionbdz` (div): `$24.99 /each SAVE 65%! TOTAL: $149.94 FREE SHIPPING 90 DAY GUARANTEE ADD TO ORDE`
  `#ippuo1` (div): `$24.99`
  `#iptzbu` (div): `BIGGEST DISCOUNT`
  `#iptzbu-4` (div): `BIGGEST DISCOUNT`
  `#ipyyyk` (p): `90 DAY MONEY BACK GUARANTEE!`
  `#ipyyyk-2` (p): `90 DAY MONEY BACK GUARANTEE!`
  `#iqcurh` (div): `TOTAL: $149.94`
  `#iqzyfk` (div): `$24.99`
  `#ir0oi` (div): `Option 2 of 3 to Customize Your Order`
  `#ir498a` (span): `SAVE 65%!`
  `#irupi` (div): `$49.99`
  `#irvl04-3` (div): `ADD TO ORDER 90 DAY MONEY BACK GUARANTEE! * Plus applicable sales tax No thanks,`
  `#is0fu2` (span): `/each`
  `#isb1u4` (div): `FREE SHIPPING`
  `#itau3l` (div): `FREE SHIPPING`
  `#itq27h` (span): `/each`
  `#itq27h-2` (span): `/each`
  `#iu5mam` (span): `$24.99`
  `#iufev2` (div): `/each`
  `#iufev2-2` (div): `/each`
  `#iupy71` (div): `SAVE 70%!`
  `#iupy71-2` (div): `SAVE 80%!`
  `#ive6k5` (div): `SAVE 65%!`
  `#ivfmxi` (div): `SmoothSpine™ NMES Massager (Buy 2 Get 1 FREE)`
  `#ivgo5r` (p): `90 DAY MONEY BACK GUARANTEE!`
  `#iw98q` (div): `1x SmoothSpine™ NMES Massager $49.99 /each SAVE 50%! TOTAL: $49.99 FREE SHIPPING`
  `#iw9oe` (span): `$49.99`
  `#iwgwe` (span): `/each`
  `#ixazq5` (div): `/each`
  `#ixfqsw` (div): `/each SAVE 65%!`
  `#ixgkm7` (div): `90 DAY GUARANTEE`
  `#ixiza` (div): `Option 2 of 3 to Customize Your Order`
  `#ixj0h` (div): `$49.99 /each SAVE 50%!`
  `#ixvh73` (div): `REJUVAKNEE NeuroMuscular Stimulator (Buy 2 Get 1 FREE)`
  `#iygy2` (div): `SAVE 50%!`
  `#iyw0h` (span): `SAVE 50%!`
  `#izb9vk` (div): `Get 80% OFF... Buy 2 Get 1 FREE`
  `#izlkv` (div): `1x SmoothSpine™ NMES Massager`
  `#izq0lk` (div): `TOTAL: $98.97`
  `#pageDataScript` (script): `var pageData = {"pageViewReferenceId":"345d7d18-b72a-457f-a37d-b10e719adb7f","fu`

### K. JavaScript Template Texts

- `); // Step 2: Confirm payment with Stripe.js console.log(`
- `); e.preventDefault(); orderSummary.classList.toggle(`
- `); orderSummary.classList.toggle(`
- `); orders.unshift(order); localStorage.setItem(`
- `); updateOrderStatus(order.id,`
- `, JSON.stringify(orders)); console.log(`
- `, currencyCode); // Create order draft BEFORE payment processing console.log(`
- `, error); // Update order status to failed updateOrderStatus(order.id,`
- `, foundDiscount); appliedDiscountCode = foundDiscount; setTimeout(() => { syncOrderSummaryWithProduc`
- `, orderId); } catch (error) { console.error(`
- `.order-applied-discount-remove`
- `.order-discount-code-button`
- `.order-discount-code-input`
- `.order-summary-body`
- `.order-summary-header`
- `; // Order Item bodyHTML +=`
- `; productRow.style.borderLeft =`
- `; r.style.borderLeft =`
- `; row.style.borderColor =`
- `; row.style.borderLeft =`

---

## VSL OTO3 (upsell-vsl-oto-3.html)

- **File size**: 659,909 bytes | **Custom CSS**: 112,204 bytes
- **Timer**: 29, 9 min
- **ID rules**: 255 | **Class rules**: 482 | **Keyframes**: 1

### A. Interrupt Header

**ID**: `#itigy` | **Tag**: `<div>` | **Text**: `IMPORTANT: Do NOT Close This Window Or Click The "Back" Button: It may double-bi`

**ID**: `#i5yjt` | **Tag**: `<div>` | **Text**: `IMPORTANT: Do NOT Close This Window Or Click The "Back" Button: It may double-bi`

**ID**: `#iwd04` | **Tag**: `<div>` | **Text**: `IMPORTANT: Do NOT Close This Window Or Click The "Back" Button:`

**ID**: `#i1hlj` | **Tag**: `<div>` | **Text**: `IMPORTANT: Do NOT Close This Window Or Click The "Back" Button:`

**ID**: `#iheazj` | **Tag**: `<div>` | **Text**: `WAIT {{firstName}}! Your Order Is Not Complete Yet Please Watch This Important M`

**ID**: `#i52fhp` | **Tag**: `<div>` | **Text**: `WAIT {{firstName}}! Your Order Is Not Complete Yet Please Watch This Important M`

**ID**: `#iftkwi` | **Tag**: `<ul>` | **Text**: `WAIT {{firstName}}! Your Order Is Not Complete Yet Please Watch This Important M`

**ID**: `#cc-id-pDzC9oKjcRax` | **Tag**: `<li>` | **Text**: `WAIT {{firstName}}! Your Order Is Not Complete Yet Please Watch This Important M`

**ID**: `#ig0vd7` | **Tag**: `<div>` | **Text**: `WAIT {{firstName}}!`

**ID**: `#cc-id-NelMQjYpN8aS` | **Tag**: `<div>` | **Text**: `WAIT {{firstName}}!`

**ID**: `#imwkh3` | **Tag**: `<div>` | **Text**: `WAIT {{firstName}}!`

**ID**: `#im5mnj` | **Tag**: `<div>` | **Text**: `Your Order Is Not Complete Yet Please Watch This Important Message Below Now`

**ID**: `#irvrk` | **Tag**: `<div>` | **Text**: `Your Order Is Not Complete Yet Please Watch This Important Message Below Now`

**ID**: `#io6mok` | **Tag**: `<div>` | **Text**: `Please Watch This Important Message Below Now`

**ID**: `#i1meq` | **Tag**: `<div>` | **Text**: `Please Watch This Important Message Below Now`

**ID**: `#ijtvht` | **Tag**: `<span>` | **Text**: `Please Watch This Important Message Below Now`

**ID**: `#ipsth` | **Tag**: `<div>` | **Text**: `DO THIS FIRST: Please watch this important New Customer update from Dr. Schillin`

**ID**: `#iowya` | **Tag**: `<div>` | **Text**: `DO THIS FIRST: Please watch this important New Customer update from Dr. Schillin`

**ID**: `#irwkl3` | **Tag**: `<div>` | **Text**: `DO THIS FIRST: Please watch this important New Customer update from Dr. Schillin`

**ID**: `#iyyueg4-2` | **Tag**: `<div>` | **Text**: `WAIT! Get SciatiCalm For Just $1`

**ID**: `#ix1whc-3` | **Tag**: `<div>` | **Text**: `Wait…$247 is too much?`

**ID**: `#i5ocpe` | **Tag**: `<div>` | **Text**: `Wait…$247 is too much?`

**ID**: `#iyyueg4` | **Tag**: `<div>` | **Text**: `WAIT! Get SciatiCalm For Just $1`

### B. Countdown Timer

**Duration**: 29, 9 min

`.countdown`:
```css
  font-family: Helvetica, serif;
  text-align: center;
```

`.countdown-block`:
```css
  display: inline-block;
  margin: 0px 10px;
  padding: 10px;
```

`.countdown-cont`:
```css
  display: inline-block;
```

`.countdown-digit`:
```css
  font-size: 1rem;
```

`.countdown-endtext`:
```css
  font-size: 5rem;
```

`#ig7bg2 > .countdown-endtext`:
```css
  font-family: Montserrat, sans-serif !important;
  font-size: 26px !important;
  font-weight: 700 !important;
  line-height: 40px !important;
  margin-left: 10px !important;
```

### C. Headlines

**<h3>** `2x  SmoothSpine Multitherapy Pro`

**<h3>** `2x  SmoothSpine Multitherapy Pro`

### D. CTA Button

**Text**: `SECURE OUR LOWEST PRICE ON THE INTERNET`
**Tag**: `<div>` | **ID**: `#ic7jlo`

**Text**: `★★★★★ OVER 65,000+ HAPPY CUSTOMERS 2x  SmoothSpine Multitherapy Pro Only $247 $1`
**Tag**: `<div>` | **ID**: `#i7y8gi`

**Text**: `★★★★★ OVER 65,000+ HAPPY CUSTOMERS 2x  SmoothSpine Multitherapy Pro Only $247 $1`
**Tag**: `<div>` | **ID**: `#im1np6`

**Text**: `YES UPGRADE MY ORDER!`
**Tag**: `<a>` | **ID**: `#fkt-link-f12-5b5-a1f`

**CTA Class Styles:**
`.btn`:
```css
  border: 1px solid transparent;
  border-radius: 0.25rem;
  display: inline-block;
  font-family: Helvetica, serif;
  font-size: 20px;
  font-weight: 400;
  line-height: 1.5;
  margin: 20px 10px;
  padding: 10px 25px;
  text-align: center;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  user-select: none;
  vertical-align: middle;
  white-space: normal;
```

`.btn-primary`:
```css
  background: rgb(0, 123, 255);
  border-color: rgb(0, 123, 255);
  color: rgb(255, 255, 255);
  white-space: normal;
```

`.btn.btn-primary`:
```css
  background: rgb(0, 123, 255);
  border-color: rgb(0, 123, 255);
  color: rgb(255, 255, 255);
  white-space: normal;
```

`.buy_now_btn`:
```css
  background-attachment: scroll;
  background-image: url("https://assets.checkoutchamp.com/bb6d9900-4f98-11ef-a365-7332b5bb1723/1722764088413_btn_bg.png");
  background-position: left top;
  background-repeat: repeat;
  background-size: auto;
  border-color: rgb(186, 147, 0) !important;
  border-radius: 30px;
  color: rgb(0, 0, 0) !important;
  font-family: "Open Sans", sans-serif;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.5px;
  margin-bottom: 0px;
  margin-top: 0px;
  padding-left: 30px;
  padding-right: 30px;
  text-shadow: rgb(255, 255, 255) 0px 1px 0px !important;
```

`.fk-youtube .play-button`:
```css
  background-color: #333;
  border-radius: 6px;
  box-shadow: 0 0 30px rgba( 0,0,0,0.6 );
  height: 60px;
  opacity: 0.8;
  width: 90px;
  z-index: 1;
```

### E. Opt-Out (Negative Option)

**Text**: `No thanks — I'll leave my nerve inflamed and hope my devices alone can do the fu`
**Tag**: `<div>` | **ID**: `#iu2k54-3`

**Text**: `No thanks — I'll leave my nerve inflamed and hope my devices alone can do the fu`
**Tag**: `<a>` | **ID**: `#fkt-link-5f5-4b2-a41`

**Text**: `No thanks — I'll leave my nerve inflamed and hope my devices alone can do the fu`
**Tag**: `<i>` | **ID**: `#in32j2`

**Text**: `No Thank You GET SciatiCalm Nerve Support FOR JUST $1`
**Tag**: `<div>` | **ID**: `#igxjs36-2`

**Text**: `No Thank You`
**Tag**: `<button>` | **ID**: `#iv0ru7k-2`

**Text**: `No thanks, maybe Later...`
**Tag**: `<a>` | **ID**: `#fkt-link-445-b8f-b29`

**Text**: `No Thank You GET SciatiCalm Nerve Support FOR JUST $1`
**Tag**: `<div>` | **ID**: `#igxjs36`

**Text**: `No Thank You`
**Tag**: `<button>` | **ID**: `#iv0ru7k`

### F. Price Elements

`#cc-id-ksoXspKnoV1K`:
```css
  -webkit-font-smoothing: antialiased;
  -webkit-text-stroke-width: 0px;
  box-sizing: border-box;
  color: white;
  display: block;
  font-family: Dosis;
  font-size: 26px;
  font-style: normal;
  font-variant-caps: normal;
  font-variant-ligatures: normal;
  font-weight: 700;
  letter-spacing: normal;
  line-height: 1.5;
  margin: 0px;
  orphans: 2;
  outline-offset: -1px !important;
  text-align: center;
  text-decoration-color: initial !important;
  text-decoration-style: initial;
  text-decoration-thickness: initial;
  text-indent: 0px;
  text-rendering: optimizelegibility;
  text-transform: uppercase;
  white-space: normal;
  widows: 2;
  word-spacing: 0px;
```

`#cc-id-vG0lEF3T1Th7`:
```css
  -webkit-font-smoothing: antialiased;
  -webkit-text-stroke-width: 0px;
  box-sizing: border-box;
  color: rgb(0, 0, 0);
  display: block;
  font-family: Dosis;
  font-size: 26px;
  font-style: normal;
  font-variant-caps: normal;
  font-variant-ligatures: normal;
  font-weight: 700;
  letter-spacing: normal;
  line-height: 1.5;
  margin: 0px;
  orphans: 2;
  outline-offset: -1px !important;
  text-align: center;
  text-decoration-color: initial;
  text-decoration-style: initial;
  text-decoration-thickness: initial;
  text-indent: 0px;
  text-rendering: optimizelegibility;
  text-transform: uppercase;
  white-space: normal;
  widows: 2;
  word-spacing: 0px;
```

`#fkt-link-445-b8f-b29`:
```css
  color: rgb(99, 99, 99);
  cursor: pointer;
  display: inline-block;
  font-family: Helvetica, serif;
  font-size: 18px;
  padding: 13px 10px 1px;
```

`#i1c4pl5`:
```css
  color: #333333 !important;
  font-family: Poppins, sans-serif;
  font-size: 17px;
  padding: 1px;
  text-align: center;
```

`#i1c4pl5-2`:
```css
  color: #333333 !important;
  font-family: Poppins, sans-serif;
  font-size: 17px;
  padding: 1px;
  text-align: center;
```

`#i1f0yp`:
```css
  color: rgb(229, 0, 0) !important;
  font-family: Montserrat, sans-serif;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0px;
  padding: 1px;
```

`#i3jt56`:
```css
  color: rgb(255, 245, 0) !important;
  font-family: Oswald, sans-serif;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 4px;
  padding: 1px;
```

`#i4ysb2`:
```css
  color: rgb(229, 0, 0) !important;
  font-family: Montserrat, sans-serif;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0px;
  padding: 1px;
```

`#i5ocpe`:
```css
  color: rgb(255, 255, 255);
  font-family: "Arial Black", Gadget, sans-serif;
  font-size: 20px;
  padding: 1px;
  text-align: center;
```

`#i8dnp9`:
```css
  color: black !important;
  font-size: 16px;
```

`#icifvmc`:
```css
  color: rgb(229, 0, 0) !important;
  font-family: Montserrat, sans-serif;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0px;
  padding: 1px;
```

`#iin3hd`:
```css
  background-color: rgb(245, 255, 234);
  border-color: rgb(222, 185, 11);
  border-radius: 50px;
  border-style: solid;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 14px;
  font-weight: 600;
  padding: 6px 1px;
```

`#ij5qsh`:
```css
  color: rgb(7, 4, 53);
  font-family: Arial, Helvetica, sans-serif;
  font-size: 20px;
  margin-bottom: 19px;
  padding: 1px;
  text-align: center;
```

`#imwkh3`:
```css
  color: rgb(204, 2, 2) !important;
  font-size: 23px;
```

`#in179h`:
```css
  color: rgb(0, 0, 0);
  font-family: "Arial Black", Gadget, sans-serif;
  font-size: 26px;
  font-weight: 400;
  margin-bottom: 12px;
  margin-top: 12px;
  padding: 1px;
  text-align: center;
```

`#io6mok`:
```css
  color: black !important;
  font-family: Roboto, sans-serif;
  font-size: 15px;
  letter-spacing: -0.8px;
```

`#iruszwh`:
```css
  color: rgb(229, 0, 0) !important;
  font-family: Montserrat, sans-serif;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0px;
  padding: 1px;
```

`#itj3z3`:
```css
  color: rgb(255, 245, 0) !important;
  font-family: Oswald, sans-serif;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 4px;
  padding: 1px;
```

`#iw44wk`:
```css
  color: rgb(255, 245, 0) !important;
  font-family: Oswald, sans-serif;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 4px;
  padding: 1px;
```

`#iyyueg4`:
```css
  color: #dc0000 !important;
  font-family: Poppins, sans-serif;
  font-size: 28px;
  line-height: 40px;
```

`#iyyueg4-2`:
```css
  color: #dc0000 !important;
  font-family: Poppins, sans-serif;
  font-size: 28px;
  line-height: 40px;
```

`#izi6sl`:
```css
  color: rgb(255, 245, 0) !important;
  font-family: Oswald, sans-serif;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 4px;
  padding: 1px;
```

### G. Guarantee

**Text**: `100% Satisfaction 90-Day Money-Back Guarantee`

**Text**: `100% Satisfaction 90-Day Money-Back Guarantee`

**Text**: `1 Bottle (30-day supply)`

**Text**: `$39.95 / bottle 3-7 Day Delivery`

**Text**: `YES, ADD 1 BOTTLE TO MY ORDER`

**Text**: `YES, ADD 1 BOTTLE TO MY ORDER`

**Text**: `90-Day Money-Back Guarantee`

**Text**: `3 Bottles (90-day supply)`

**Text**: `$33.25 / bottle 3-7 Day Delivery`

**Text**: `YES, ADD 3 BOTTLE TO MY ORDER`

**Text**: `YES, ADD 3 BOTTLE TO MY ORDER`

**Text**: `90-Day Money-Back Guarantee`

**Text**: `6 Bottles (180-day supply)`

**Text**: `$29.95 / bottle 3-7 Day Delivery`

**Text**: `YES, ADD 6 BOTTLE TO MY ORDER`

**Text**: `YES, ADD 6 BOTTLE TO MY ORDER`

**Text**: `90-Day Money-Back Guarantee`

**Text**: `90-Days Money-Back Guarantee`

**Text**: `Refund Policy Privacy Policy Terms of Service`

**Text**: `Refund Policy Privacy Policy Terms of Service`

**Text**: `Refund Policy Privacy Policy Terms of Service`

**Text**: `Refund Policy`

### H. Key ID-Based CSS (Conversion-Relevant)

```css
  #NoButton1 {
    background-color: rgb(239, 253, 250) !important;
  }
  #a-link {
    color: rgb(24, 120, 185) !important;
    text-decoration: none;
    transition: color 0.2s ease-in-out;
  }
  #cc-id-7zXHFA86hCmp {
    font-size: 14px;
    margin-left: auto;
    margin-right: auto;
  }
  #cc-id-eU4iztnkuUdD {
    margin-left: auto;
    margin-right: auto;
  }
  #cc-id-eWKxowVKCq6ss {
    font-size: 14px;
    margin-left: auto;
    margin-right: auto;
  }
  #cc-id-ksoXspKnoV1K {
    -webkit-font-smoothing: antialiased;
    -webkit-text-stroke-width: 0px;
    box-sizing: border-box;
    color: white;
    display: block;
    font-family: Dosis;
    font-size: 26px;
    font-style: normal;
    font-variant-caps: normal;
    font-variant-ligatures: normal;
    font-weight: 700;
    letter-spacing: normal;
    line-height: 1.5;
    margin: 0px;
    orphans: 2;
    outline-offset: -1px !important;
    text-align: center;
    text-decoration-color: initial !important;
    text-decoration-style: initial;
    text-decoration-thickness: initial;
    text-indent: 0px;
    text-rendering: optimizelegibility;
    text-transform: uppercase;
    white-space: normal;
    widows: 2;
    word-spacing: 0px;
  }
  #cc-id-qk45QF3Ov5Fz {
    padding: 12px 10px;
    width: 100%;
  }
  #cc-id-vG0lEF3T1Th7 {
    -webkit-font-smoothing: antialiased;
    -webkit-text-stroke-width: 0px;
    box-sizing: border-box;
    color: rgb(0, 0, 0);
    display: block;
    font-family: Dosis;
    font-size: 26px;
    font-style: normal;
    font-variant-caps: normal;
    font-variant-ligatures: normal;
    font-weight: 700;
    letter-spacing: normal;
    line-height: 1.5;
    margin: 0px;
    orphans: 2;
    outline-offset: -1px !important;
    text-align: center;
    text-decoration-color: initial;
    text-decoration-style: initial;
    text-decoration-thickness: initial;
    text-indent: 0px;
    text-rendering: optimizelegibility;
    text-transform: uppercase;
    white-space: normal;
    widows: 2;
    word-spacing: 0px;
  }
  #customizable_popup {
    background-color: #0e0d0d91 !important;
    bottom: 0;
    display: none;
    height: auto;
    inset: 0px;
    left: 0;
    min-height: 300px;
    opacity: 1;
    overflow: auto;
    padding-left: 1px;
    position: fixed;
    right: 0;
    top: 0;
  }
  #fkt-image-035-0b0-987 {
    color: black !important;
    height: 15px;
    width: 79px !important;
  }
  #fkt-image-048-eaa-862 {
    color: black !important;
    height: 100%;
    width: 34px !important;
  }
  #fkt-image-054-0be-993 {
    color: black !important;
    height: auto;
    width: 260px !important;
  }
  #fkt-image-08d-197-8e7 {
    color: black !important;
    height: 22px;
    width: 22px !important;
  }
  #fkt-image-16e-a8a-a36 {
    color: black;
    height: 100%;
    width: 80%;
  }
  #fkt-image-1b6-fb7-86c {
    color: black !important;
    height: 15px;
    width: 79px !important;
  }
  #fkt-image-25b-0be-b95 {
    color: black !important;
    height: auto;
    width: 260px !important;
  }
  #fkt-image-298-ab3-af0 {
    color: black !important;
    height: 22px;
    width: 22px !important;
  }
  #fkt-image-327-3a9-bd0 {
    color: black !important;
    height: 15px;
    width: 79px !important;
  }
  #fkt-image-444-abb-adf {
    color: black !important;
    height: 22px;
    width: 22px !important;
  }
  #fkt-image-56d-c95-b9e {
    color: black !important;
    height: 22px;
    width: 22px !important;
  }
  #fkt-image-6d5-5bb-8ba {
    color: black !important;
    height: 32px;
    margin-top: -4px !important;
    width: 60px !important;
  }
  #fkt-image-7e6-897-953 {
    color: black !important;
    height: 22px;
    width: 22px !important;
  }
  #fkt-image-80a-696-951 {
    color: black !important;
    height: 22px;
    width: 22px !important;
  }
  #fkt-image-93c-bb5-aa9 {
    color: black !important;
    height: auto;
    margin-bottom: 20px;
    width: 250px !important;
  }
  #fkt-image-95f-bad-b92 {
    color: black !important;
    height: auto;
    margin-bottom: 20px;
    width: 300px !important;
  }
  #fkt-image-963-5b2-834 {
    color: black !important;
    height: 22px;
    width: 22px !important;
  }
  #fkt-image-a13-691-9e8 {
    color: black !important;
    height: 22px;
    width: 22px !important;
  }
  #fkt-image-a86-d8c-b9c {
    color: black !important;
    height: 22px;
    width: 22px !important;
  }
  #fkt-image-dca-cb0-b8e {
    color: black !important;
    height: 22px;
    width: 22px !important;
  }
  #fkt-image-e41-188-829 {
    color: black !important;
    height: auto;
    width: 260px !important;
  }
  #fkt-image-e4f-396-8e3 {
    color: black !important;
    height: 22px;
    width: 22px !important;
  }
  #fkt-image-e63-596-bd0 {
    color: black !important;
    height: auto;
    width: 260px !important;
  }
  #fkt-image-ebf-481-af6 {
    color: black !important;
    height: auto;
    margin-bottom: 20px;
    width: 250px !important;
  }
  #fkt-image-f21-4a3-846 {
    color: black !important;
    height: 15px;
    width: 79px !important;
  }
  #fkt-image-f58-5b6-b82 {
    color: black !important;
    height: 22px;
    width: 22px !important;
  }
  #fkt-image-f75-bbe-a66 {
    color: black !important;
    height: auto;
    margin-bottom: 20px;
    width: 100% !important;
  }
  #fkt-link-445-b8f-b29 {
    color: rgb(99, 99, 99);
    cursor: pointer;
    display: inline-block;
    font-family: Helvetica, serif;
    font-size: 18px;
    padding: 13px 10px 1px;
  }
  #fkt-link-490-292-b70 {
    font-size: 13px;
    line-height: 20px;
  }
  #fkt-link-509-795-ab8 {
    font-size: 13px;
    line-height: 20px;
    padding-right: 10px;
  }
  #fkt-link-636-784-a01 {
    font-size: 13px;
    line-height: 20px;
    padding-right: 10px;
  }
  #fkt-link-647-c8b-8d0 {
    color: rgb(217, 131, 166) !important;
  }
  #fkt-link-f12-5b5-a1f {
    padding-bottom: 12px;
    padding-top: 12px;
  }
  #fkt-multiple-popup-e3b-a8d-a95 {
    background-color: #0e0d0d91 !important;
    bottom: 0;
    display: none;
    height: auto;
    left: 0;
    min-height: 300px;
    opacity: 1;
    overflow: auto;
    position: fixed;
    right: 0;
    top: 0;
  }
  #fkt-multiple-popup-f61-1af-8d3 {
    background-color: #0e0d0d91 !important;
    bottom: 0;
    display: none;
    height: auto;
    left: 0;
    min-height: 300px;
    opacity: 1;
    overflow: auto;
    position: fixed;
    right: 0;
    top: 0;
  }
  #i0228r6 {
    display: flex;
    font-family: Montserrat, sans-serif;
    font-size: 16px;
    line-height: 23px;
    padding: 2px 10px 2px 20px;
    width: 100%;
  }
  #i039xon {
    display: flex;
    font-family: Montserrat, sans-serif;
    font-size: 16px;
    line-height: 23px;
    margin-top: 1px !important;
    padding: 2px 10px 2px 20px;
    width: 100%;
  }
  #i04b7h {
    margin-top: 1px;
  }
  #i0ai2l {
    align-items: center !important;
    align-self: auto;
    background-color: rgb(255, 255, 255) !important;
    border-radius: 12px 12px 10px 10px;
    border-style: solid;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    max-width: 373px;
    padding: 0px 0px 20px;
    text-align: center;
    transition: 0.65s;
    width: 100%;
  }
  #i0b4i {
    color: rgb(204, 2, 2) !important;
  }
  #i0bezj {
    font-family: Montserrat, sans-serif;
    font-size: 23px;
    padding: 10px;
    text-align: left;
  }
  #i0sp7u {
    background-color: rgba(0, 0, 0, 0) !important;
    border-top-width: 1px;
    height: 3px;
  }
  #i0y7uq-2 {
    font-family: Montserrat, sans-serif;
    font-size: 21px;
  }
  #i1c4pl5 {
    color: #333333 !important;
    font-family: Poppins, sans-serif;
    font-size: 17px;
    padding: 1px;
    text-align: center;
  }
  #i1c4pl5-2 {
    color: #333333 !important;
    font-family: Poppins, sans-serif;
    font-size: 17px;
    padding: 1px;
    text-align: center;
  }
  #i1ebd8i {
    display: flex;
    font-family: Montserrat, sans-serif;
    font-size: 16px;
    line-height: 23px;
    padding: 2px 10px 2px 20px;
    width: 100%;
  }
  #i1f0yp {
    color: rgb(229, 0, 0) !important;
    font-family: Montserrat, sans-serif;
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 0px;
    padding: 1px;
  }
  #i1fmrq {
    flex-direction: column;
  }
  #i1ggiw {
    padding-bottom: 0;
    padding-left: 0;
    padding-right: 0;
  }
  #i1hlj {
    font-size: 16px;
    justify-content: space-around;
    line-height: 22px;
    margin-top: 0px;
  }
  #i1m3u2 {
    background-color: rgb(18, 18, 18) !important;
  }
  #i1meq {
    padding-left: 0px;
    padding-right: 0px;
  }
  #i279bz {
    font-size: 25px;
    font-weight: bold;
  }
  #i2cl47 {
    font-size: 20px;
  }
  #i2d6c2k {
    background-color: #f8f8f8 !important;
    margin-bottom: 0;
    padding-bottom: 10px;
    padding-top: 10px;
  }
  #i2d6c2k-2 {
    background-color: #eaecf0 !important;
    margin-bottom: 0;
    padding-bottom: 10px;
    padding-top: 10px;
  }
  #i308di8 {
    font-family: "Open Sans", sans-serif;
    font-size: 15px;
    margin-left: 10px;
    padding: 1px;
  }
  #i30sen4 {
    font-family: Montserrat, sans-serif;
    font-size: 18px;
    font-weight: 800;
    letter-spacing: 1px;
    padding: 1px;
  }
  #i34tqi {
    text-align: left;
  }
  #i3jt56 {
    color: rgb(255, 245, 0) !important;
    font-family: Oswald, sans-serif;
    font-size: 18px;
    font-weight: 600;
    letter-spacing: 4px;
    padding: 1px;
  }
  #i3qb8s {
    height: auto;
    width: auto;
  }
  #i3w9ei {
    font-family: Montserrat, sans-serif;
    font-size: 16px;
    font-weight: 500;
    letter-spacing: 1px;
    padding: 1px;
  }
  #i3xdb4 {
    font-size: 12px;
  }
  #i3xhz1 {
    font-family: "Open Sans", sans-serif;
    font-size: 15px;
    margin-left: 10px;
    padding: 1px;
  }
  #i3zjko {
    display: flex;
    font-family: Montserrat, sans-serif;
    font-size: 16px;
    line-height: 23px;
    margin-top: 1px !important;
    padding: 2px 10px 2px 20px;
    width: 100%;
  }
  #i4ruth {
    height: 40px;
    margin-left: 2px;
    margin-right: 0px;
    padding-left: 0px;
    padding-right: 0px;
    padding-top: 0px;
  }
  #i4ysb2 {
    color: rgb(229, 0, 0) !important;
    font-family: Montserrat, sans-serif;
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 0px;
    padding: 1px;
  }
  #i4z7f4 {
    font-size: 12px;
  }
  #i52fhp {
    padding: 0px;
  }
  #i552w4 {
    width: 200px !important;
  }
  #i58b02 {
    text-align: left;
  }
  #i5ehrj {
    background-color: rgb(255, 255, 255) !important;
    border-radius: 12px 12px 10px 10px;
    border-style: solid;
    display: flex;
    flex-direction: column;
    max-width: 373px;
    padding: 0px 0px 20px;
    transition: 0.65s;
    width: 100%;
  }
  #i5fgmk {
    font-family: "Open Sans", sans-serif;
    font-size: 15px;
    margin-left: 10px;
    padding: 1px;
  }
  #i5h1oh {
    padding-bottom: 0px;
    padding-left: 0px;
    padding-right: 0px;
  }
  #i5ocpe {
    color: rgb(255, 255, 255);
    font-family: "Arial Black", Gadget, sans-serif;
    font-size: 20px;
    padding: 1px;
    text-align: center;
  }
  #i5s8knj {
    font-size: 12px;
  }
  #i5xhu4 {
    align-items: center !important;
    align-self: auto;
    background-color: rgb(255, 255, 255) !important;
    border-radius: 12px 12px 10px 10px;
    border-style: solid;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    max-width: 373px;
    padding: 0px 0px 20px;
    text-align: center;
    transition: 0.65s;
    width: 100%;
  }
  #i5yjt {
    padding: 0px 0px 10px;
  }
  #i7jrua {
    font-family: "Open Sans", sans-serif;
    font-size: 15px;
    margin-left: 10px;
    padding: 1px;
  }
  #i7mtdw {
    align-self: auto;
    justify-content: center;
    padding-top: 0px;
  }
  #i7pt272 {
    padding-left: 15px;
    padding-right: 15px;
    width: 400px;
  }
  #i7pt272-2 {
    padding-left: 15px;
    padding-right: 15px;
    width: 400px;
  }
  #i7uujdx {
    font-family: Montserrat, sans-serif;
    font-size: 16px;
    font-weight: 500;
    letter-spacing: 1px;
    padding: 1px;
  }
  #i7ylnlf {
    display: flex;
    font-family: Montserrat, sans-serif;
    font-size: 16px;
    line-height: 23px;
    margin-bottom: 20px;
    margin-top: 1px !important;
    padding: 2px 10px 2px 20px;
    width: 100%;
  }
  #i80fgbh {
    text-align: left;
  }
  #i8dnp9 {
    color: black !important;
    font-size: 16px;
  }
  #i8mey {
    background-color: #EFFDFA !important;
  }
  #i9dzv5 {
    display: flex;
    font-family: Montserrat, sans-serif;
    font-size: 16px;
    line-height: 23px;
    padding: 2px 10px 2px 20px;
    width: 100%;
  }
  #i9q1k4 {
    padding: 10px;
    width: 100%;
  }
  #i9tnp1 {
    font-size: 0px;
    font-weight: 100;
    height: 40px;
    margin-left: 0px;
    margin-right: 2px;
    padding-left: 0px;
    padding-right: 0px;
    padding-top: 0px;
  }
  #i9znnvq {
    align-items: center;
    display: flex;
    justify-content: center;
    padding: 10px 10px 0px;
    width: 100%;
  }
  #iaa4mlf {
    align-items: center;
    display: flex;
    justify-content: center;
    padding: 4px 10px 5px;
    width: 100%;
  }
  #iax499 {
    font-family: "Open Sans", sans-serif;
    font-size: 15px;
    margin-left: 10px;
    padding: 1px;
  }
  #ib45ea .cc-cart-row-margin {
    align-items: center;
    display: flex;
  }
  #ibnfj {
    padding-bottom: 0;
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
  }
  #ibxj7p {
    text-align: left;
  }
  #ic3oi4 {
    background-color: rgb(51, 51, 51) !important;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    padding: 16px 10px;
    width: 100%;
  }
  #ic7jlo {
    font-size: 14px;
    margin-top: 6px;
  }
  #icadox {
    font-size: 23px;
  }
  #icb25i6 {
    display: flex;
    font-family: Montserrat, sans-serif;
    font-size: 16px;
    line-height: 23px;
    margin-bottom: 20px;
    margin-top: 1px !important;
    padding: 2px 10px 2px 20px;
    width: 100%;
  }
  #icfidi {
    padding-top: 20px;
  }
  #icifvmc {
    color: rgb(229, 0, 0) !important;
    font-family: Montserrat, sans-serif;
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 0px;
    padding: 1px;
  }
  #icsgek {
    align-items: center;
    display: flex;
    justify-content: center;
  }
  #iczk1v {
    margin-top: 1px;
  }
  #iedtk9d {
    align-items: center;
    display: flex;
    justify-content: center;
    padding: 10px 10px 0px;
    width: 100%;
  }
  #iekcwz {
    align-items: stretch;
    display: flex;
    justify-content: center;
    line-height: 22px;
  }
  #ieufpw-3 {
    padding-left: 0px;
    padding-right: 0px;
  }
  #ieugr9u {
    font-family: "Open Sans", sans-serif;
    font-size: 15px;
    margin-left: 10px;
    padding: 1px;
  }
  #iezvaz {
    padding: 20px 1px 10px;
  }
  #if3fiu {
    text-align: left;
  }
  #ifcvz0x {
    font-size: 12px;
  }
  #ife8j1 {
    font-size: 20px;
  }
  #iftkwi {
    margin-bottom: 0px;
    margin-left: 0px;
    margin-right: 0px;
    padding-left: 0px;
    padding-right: 0px;
  }
  #ifuxb4 {
    height: auto;
    width: auto;
  }
  #ifvuov {
    padding-bottom: 0px;
    padding-left: 20px;
    padding-right: 20px;
  }
  #ig0vd7 {
    align-items: center;
    justify-content: center;
    margin-top: 1px;
    padding-bottom: 0px;
    padding-top: 5px;
  }
  #ig7bg2 > .countdown-endtext {
    font-family: Montserrat, sans-serif !important;
    font-size: 26px !important;
    font-weight: 700 !important;
    line-height: 40px !important;
    margin-left: 10px !important;
  }
  #igh01i {
    align-items: center;
    display: flex;
    justify-content: center;
    padding: 10px 10px 0px;
    width: 100%;
  }
  #igxjs36 {
    margin-top: 0;
  }
  #igxjs36-2 {
    margin-top: 0;
  }
  #igzhht {
    display: flex;
    font-family: Montserrat, sans-serif;
    font-size: 16px;
    line-height: 23px;
    margin-bottom: 20px;
    margin-top: 1px !important;
    padding: 2px 10px 2px 20px;
    width: 100%;
  }
  #ih3e8tt {
    padding: 12px 10px;
    padding-bottom: 0;
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 0;
    width: 100%;
  }
  #ih3e8tt-2 {
    padding: 12px 10px;
    padding-bottom: 0;
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 0;
    width: 100%;
  }
  #ih4wig {
    padding: 12px 10px 5px;
    width: 100%;
  }
  #ihbsf8f {
    margin-bottom: 0;
    padding-bottom: 0;
  }
  #iheazj {
    padding-bottom: 0px;
    padding-left: 0px;
    padding-right: 0px;
  }
  #ihjbp7 {
    align-items: center !important;
    background-color: rgb(255, 255, 255) !important;
    border-radius: 12px 12px 10px 10px;
    border-style: solid;
    display: flex;
    flex-direction: column;
    max-width: 373px;
    padding: 0px 0px 40px;
    transition: 0.65s;
    width: 100%;
  }
  #ihlkrn {
    font-size: 17px;
    line-height: 22px;
  }
  #ii19f {
    background-color: #EFFDFA !important;
  }
  #ii2umi {
    color: rgb(228, 61, 44) !important;
  }
  #ii3if {
    font-size: 16px;
  }
  #ii4l5i {
    font-family: Montserrat, sans-serif;
    font-size: 16px;
    margin-bottom: 20px;
    padding: 20px 1px 10px;
  }
  #ii6yul-3 {
    padding: 12px 10px;
    width: 100%;
  }
  #iice3sv {
    font-family: "Open Sans", sans-serif;
    font-size: 15px;
    margin-left: 10px;
    padding: 1px;
  }
  #iif9e9-2 {
    font-family: Montserrat, sans-serif;
    font-size: 21px;
  }
  #iifhgn-3 {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 12px 10px;
    width: 100%;
  }
  #iifwqfh {
    font-family: "Open Sans", sans-serif;
    font-size: 15px;
    margin-left: 10px;
    padding: 1px;
  }
  #iimqil {
    align-items: center;
    display: flex;
    justify-content: center;
    padding: 4px 10px 5px;
    width: 100%;
  }
  #iimrlo {
    text-align: left;
  }
  #iin3hd {
    background-color: rgb(245, 255, 234);
    border-color: rgb(222, 185, 11);
    border-radius: 50px;
    border-style: solid;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 14px;
    font-weight: 600;
    padding: 6px 1px;
  }
  #iiunhd {
    color: rgb(240, 176, 0);
  }
  #ij1idn.realPrice {
    margin-top: 54px;
  }
  #ij39xl {
    font-family: Montserrat, sans-serif;
    font-size: 16px;
    margin-bottom: 20px;
    padding: 20px 1px 10px;
  }
  #ij5qsh {
    color: rgb(7, 4, 53);
    font-family: Arial, Helvetica, sans-serif;
    font-size: 20px;
    margin-bottom: 19px;
    padding: 1px;
    text-align: center;
  }
  #ij6e4 {
    justify-content: center;
    text-align: center;
  }
  #ij6urtv-6 {
    background-color: #EFFDFA !important;
    flex-direction: column;
  }
  #ijhv0g {
    font-size: 23px;
    line-height: 30px;
  }
  #ijhvu {
    background-color: #EFFDFA !important;
  }
  #ijmoo0q {
    padding-right: 52px;
  }
  #ijp6t {
    text-align: center;
  }
  #ijrsuo {
    font-family: "Open Sans", sans-serif;
    font-size: 15px;
    margin-left: 10px;
    padding: 1px;
  }
  #ijtvht {
    font-size: 15px;
    font-weight: normal;
  }
  #ik20m7-3 {
    display: flex;
    justify-content: space-around;
    margin-top: 0px;
    padding-bottom: 0px;
  }
  #ik2j48 {
    font-size: 14px;
    margin-left: auto;
    margin-right: auto;
  }
  #ik681rk {
    text-align: left;
  }
  #ikn1ck {
    text-align: left;
  }
  #il1o2t {
    margin-top: 87px;
  }
  #im1np6 {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 1px;
  }
  #im5mnj {
    align-items: center;
    justify-content: center;
    padding-bottom: 15px;
    padding-top: 0px;
    text-align: center;
  }
  #im7kqa {
    background-color: rgb(51, 51, 51) !important;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    padding: 16px 10px;
    width: 100%;
  }
  #imwkh3 {
    color: rgb(204, 2, 2) !important;
    font-size: 23px;
  }
  #in179h {
    color: rgb(0, 0, 0);
    font-family: "Arial Black", Gadget, sans-serif;
    font-size: 26px;
    font-weight: 400;
    margin-bottom: 12px;
    margin-top: 12px;
    padding: 1px;
    text-align: center;
  }
  #incb2h {
    padding-bottom: 12px;
  }
  #inm09k {
    padding: 0px;
  }
  #io6mok {
    color: black !important;
    font-family: Roboto, sans-serif;
    font-size: 15px;
    letter-spacing: -0.8px;
  }
  #io6plp {
    font-size: 17px;
  }
  #iodm66 {
    margin-top: 1px;
  }
  #ioluu5 {
    align-items: center;
    display: flex;
    justify-content: center;
    padding: 4px 10px 5px;
    width: 100%;
  }
  #iotdv9g {
    text-align: left;
  }
  #iowya {
    padding-bottom: 0px;
    padding-left: 0px;
    padding-right: 0px;
  }
  #ipdamk {
    padding-bottom: 0px;
  }
  #ipns6l {
    text-align: left;
  }
  #ipphk8 {
    display: flex;
    font-family: Montserrat, sans-serif;
    font-size: 16px;
    line-height: 23px;
    margin-top: 1px !important;
    padding: 2px 10px 2px 20px;
    width: 100%;
  }
  #ipppiy {
    font-family: Montserrat, sans-serif;
    font-size: 16px;
    font-weight: 500;
    letter-spacing: 1px;
    padding: 1px;
  }
  #ipsth {
    background-color: rgb(255, 255, 255) !important;
    flex-direction: column;
  }
  #iqe2el3 {
    text-align: left;
  }
  #iqeox3 {
    padding: 12px 10px 5px;
    width: 100%;
  }
  #iqhbni {
    margin-top: 84px;
  }
  #iqls1y {
    align-items: center;
    display: flex;
    justify-content: center;
    padding: 10px 10px 0px;
    width: 100%;
  }
  #iqpg65 {
    font-family: "Open Sans", sans-serif;
    font-size: 15px;
    margin-left: 10px;
    padding: 1px;
  }
  #iqshmj {
    font-family: Montserrat, sans-serif;
    font-size: 16px;
    margin-bottom: 20px;
    padding: 20px 1px 10px;
  }
  #ir3abk9 {
    display: flex;
    font-family: Montserrat, sans-serif;
    font-size: 16px;
    line-height: 23px;
    margin-top: 1px !important;
    padding: 2px 10px 2px 20px;
    width: 100%;
  }
  #ir3igf {
    background-color: rgb(239, 253, 250) !important;
    display: none;
    flex-direction: column;
    padding: 0px;
  }
  #ir8apk {
    font-family: Montserrat, sans-serif;
    font-size: 18px;
    font-weight: 800;
    letter-spacing: 1px;
    padding: 1px;
  }
  #iropysq {
    text-align: left;
  }
  #iruszwh {
    color: rgb(229, 0, 0) !important;
    font-family: Montserrat, sans-serif;
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 0px;
    padding: 1px;
  }
  #irvrk {
    padding-left: 0px;
    padding-right: 0px;
  }
  #is4fbo {
    text-align: left;
  }
  #is5zgb {
    font-size: 23px;
    line-height: 30px;
  }
  #ise4cn {
    margin-bottom: 0px;
    padding-bottom: 0px;
  }
  #istw2k {
    font-size: 25px;
    font-weight: bold;
  }
  #ith2yt-2 {
    font-weight: normal;
  }
  #itigy {
    background-color: rgb(255, 140, 0) !important;
    border-radius: 1px;
    border-width: 1px;
    flex: 0 0 0%;
    padding-bottom: 1px;
    padding-top: 1px;
  }
  #itj3z3 {
    color: rgb(255, 245, 0) !important;
    font-family: Oswald, sans-serif;
    font-size: 18px;
    font-weight: 600;
    letter-spacing: 4px;
    padding: 1px;
  }
  #itp5lej {
    font-family: "Open Sans", sans-serif;
    font-size: 15px;
    margin-left: 10px;
    padding: 1px;
  }
  #itpyhsq {
    font-family: Montserrat, sans-serif;
    font-size: 27px;
    font-weight: 800;
    letter-spacing: 1px;
    padding: 1px;
  }
  #itrbez {
    color: rgb(242, 54, 7);
  }
  #its9l7l {
    text-align: left;
  }
  #iu2k54-3 {
    padding-bottom: 10px;
  }
  #iu4ae2o-3 {
    background-color: #fdfdfd !important;
    padding: 12px 10px;
    padding-bottom: 0;
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
    width: 100%;
  }
  #iu4ae2o-6 {
    padding: 12px 10px;
    padding-bottom: 0;
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
    width: 100%;
  }
  #iu8m2ei {
    background-color: #fbfdaa !important;
  }
  #iu8m2ei-2 {
    background-color: #fbfdaa !important;
  }
  #iubyeh {
    font-family: "Open Sans", sans-serif;
    font-size: 15px;
    margin-left: 10px;
    padding: 1px;
  }
  #iugqyl {
    font-family: Montserrat, sans-serif;
    font-size: 18px;
    font-weight: 800;
    letter-spacing: 1px;
    padding: 1px;
  }
  #iut1fm {
    display: flex;
    font-family: Montserrat, sans-serif;
    font-size: 16px;
    line-height: 23px;
    margin-bottom: 20px;
    margin-top: 1px !important;
    padding: 2px 10px 2px 20px;
    width: 100%;
  }
  #iv0ru7k {
    margin-top: 10px;
    width: 400px;
  }
  #iv0ru7k-2 {
    margin-top: 10px;
    width: 400px;
  }
  #ivvs67 {
    margin: 15px 0px;
  }
  #ivxr0ei {
    align-items: center;
    display: flex;
    justify-content: center;
    padding: 4px 10px 5px;
    width: 100%;
  }
  #iw178h {
    font-size: 20px;
  }
  #iw3xqn {
    font-size: 20px;
  }
  #iw44wk {
    color: rgb(255, 245, 0) !important;
    font-family: Oswald, sans-serif;
    font-size: 18px;
    font-weight: 600;
    letter-spacing: 4px;
    padding: 1px;
  }
  #iwd04 {
    margin-top: 10px;
  }
  #iwkcv9 {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0px 10px;
    width: 100%;
  }
  #iwt1j2 {
    font-family: Montserrat, sans-serif;
    font-size: 16px;
    margin-bottom: 20px;
    padding: 20px 1px 10px;
  }
  #iwxa7o {
    text-align: left;
  }
  #iwxmah {
    text-align: left;
  }
  #ix1whc-3 {
    margin-left: 1px;
  }
  #ix6tdu {
    font-family: Montserrat, sans-serif;
    font-size: 18px;
    padding: 10px;
    text-align: left;
  }
  #ixmq47j {
    font-family: Montserrat, sans-serif;
    font-size: 16px;
    font-weight: 500;
    letter-spacing: 1px;
    padding: 1px;
  }
  #ixmwqk {
    background-color: rgb(51, 51, 51) !important;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    padding: 16px 10px;
    width: 100%;
  }
  #iyhfge {
    padding: 32px 29px !important;
  }
  #iyj5fm {
    font-size: 20px;
  }
  #iylqnl {
    display: flex;
    font-family: Montserrat, sans-serif;
    font-size: 16px;
    line-height: 23px;
    padding: 2px 10px 2px 20px;
    width: 100%;
  }
  #iyvapl {
    padding-bottom: 30px;
    padding-top: 30px;
  }
  #iyyueg4 {
    color: #dc0000 !important;
    font-family: Poppins, sans-serif;
    font-size: 28px;
    line-height: 40px;
  }
  #iyyueg4-2 {
    color: #dc0000 !important;
    font-family: Poppins, sans-serif;
    font-size: 28px;
    line-height: 40px;
  }
  #iz4ec1.shownprice {
    margin-top: 57px;
  }
  #izi6sl {
    color: rgb(255, 245, 0) !important;
    font-family: Oswald, sans-serif;
    font-size: 18px;
    font-weight: 600;
    letter-spacing: 4px;
    padding: 1px;
  }
  #popup_content {
    background-color: #fff;
    margin-top: 10%;
  }
  #popup_content-2 {
    background-color: #eaecf0 !important;
    margin-left: auto;
    margin-right: auto;
    margin-top: 10%;
    padding: 5px;
    padding-bottom: 0;
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
    z-index: 9999;
  }
  #popup_content-3 {
    background-color: #ffffff !important;
    margin-left: auto;
    margin-right: auto;
    margin-top: 10%;
    padding: 5px;
    z-index: 9999;
  }
```

### I. Key Class-Based CSS

```css
  .avatar {
    border: 2px solid #fff;
    border-radius: 50%;
    box-shadow: 0 1px 4px rgba(0,0,0,.12);
    display: block;
    height: 44px;
    object-fit: cover;
    width: 44px;
  }
  .backgroundMargin {
    background-color: #fff;
    margin-top: 10%;
  }
  .borderRadius {
    border-radius: 25px;
  }
  .bordered-ul {
    border: 1px solid rgb(217, 217, 217);
    border-radius: 4px;
    list-style: none;
    margin: 0px 0px 12px;
    padding: 0px;
    width: 100%;
  }
  .box {
    border: 3px solid rgb(236, 236, 236);
  }
  .btn {
    border: 1px solid transparent;
    border-radius: 0.25rem;
    display: inline-block;
    font-family: Helvetica, serif;
    font-size: 20px;
    font-weight: 400;
    line-height: 1.5;
    margin: 20px 10px;
    padding: 10px 25px;
    text-align: center;
    transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    user-select: none;
    vertical-align: middle;
    white-space: normal;
  }
  .btn-primary {
    background: rgb(0, 123, 255);
    border-color: rgb(0, 123, 255);
    color: rgb(255, 255, 255);
    white-space: normal;
  }
  .btn.btn-primary {
    background: rgb(0, 123, 255);
    border-color: rgb(0, 123, 255);
    color: rgb(255, 255, 255);
    white-space: normal;
  }
  .buy_now_btn {
    background-attachment: scroll;
    background-image: url("https://assets.checkoutchamp.com/bb6d9900-4f98-11ef-a365-7332b5bb1723/1722764088413_btn_bg.png");
    background-position: left top;
    background-repeat: repeat;
    background-size: auto;
    border-color: rgb(186, 147, 0) !important;
    border-radius: 30px;
    color: rgb(0, 0, 0) !important;
    font-family: "Open Sans", sans-serif;
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 0.5px;
    margin-bottom: 0px;
    margin-top: 0px;
    padding-left: 30px;
    padding-right: 30px;
    text-shadow: rgb(255, 255, 255) 0px 1px 0px !important;
  }
  .buy_now_btn:hover {
    border-color: rgb(243, 168, 0) !important;
    border-style: solid;
    box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 5px 0px;
  }
  .cbtb .cbtb-close {
    color: rgb(0, 0, 0);
    float: right;
    font-size: 21px;
    font-weight: 700;
    line-height: 1;
    opacity: 0.2;
    text-shadow: rgb(255, 255, 255) 0px 1px 0px;
  }
  .cbtb .cbtb-close:hover, .cbtb .cbtb-close:focus {
    color: rgb(0, 0, 0);
    cursor: pointer;
    opacity: 0.5;
    text-decoration: none;
  }
  .cbtb .cbtb-col-xs-1, .cbtb .cbtb-col-sm-1, .cbtb .cbtb-col-md-1, .cbtb .cbtb-col-lg-1, .cbtb .cbtb-col-xs-2, .cbtb .cbtb-col-sm-2, .cbtb .cbtb-col-md-2, .cbtb .cbtb-col-lg-2, .cbtb .cbtb-col-xs-3, .cbtb .cbtb-col-sm-3, .cbtb .cbtb-col-md-3, .cbtb .cbtb-col-lg-3, .cbtb .cbtb-col-xs-4, .cbtb .cbtb-col-sm-4, .cbtb .cbtb-col-md-4, .cbtb .cbtb-col-lg-4, .cbtb .cbtb-col-xs-5, .cbtb .cbtb-col-sm-5, .cbtb .cbtb-col-md-5, .cbtb .cbtb-col-lg-5, .cbtb .cbtb-col-xs-6, .cbtb .cbtb-col-sm-6, .cbtb .cbtb-col-md-6, .cbtb .cbtb-col-lg-6, .cbtb .cbtb-col-xs-7, .cbtb .cbtb-col-sm-7, .cbtb .cbtb-col-md-7, .cbtb .cbtb-col-lg-7, .cbtb .cbtb-col-xs-8, .cbtb .cbtb-col-sm-8, .cbtb .cbtb-col-md-8, .cbtb .cbtb-col-lg-8, .cbtb .cbtb-col-xs-9, .cbtb .cbtb-col-sm-9, .cbtb .cbtb-col-md-9, .cbtb .cbtb-col-lg-9, .cbtb .cbtb-col-xs-10, .cbtb .cbtb-col-sm-10, .cbtb .cbtb-col-md-10, .cbtb .cbtb-col-lg-10, .cbtb .cbtb-col-xs-11, .cbtb .cbtb-col-sm-11, .cbtb .cbtb-col-md-11, .cbtb .cbtb-col-lg-11, .cbtb .cbtb-col-xs-12, .cbtb .cbtb-col-sm-12, .cbtb .cbtb-col-md-12, .cbtb .cbtb-col-lg-12 {
    min-height: 1px;
    padding-left: 15px;
    padding-right: 15px;
    position: relative;
  }
  .cbtb .cbtb-img-circle {
    border-radius: 50%;
  }
  .cbtb .cbtb-img-rounded {
    border-radius: 6px;
  }
  .cbtb .cbtb-img-thumbnail {
    background-color: rgb(255, 255, 255);
    border: 1px solid rgb(221, 221, 221);
    border-radius: 4px;
    display: inline-block;
    height: auto;
    line-height: 1.42857;
    max-width: 100%;
    padding: 4px;
    transition: 0.2s ease-in-out;
  }
  .cbtb .cbtb-modal .cbtb-modal-dialog .cbtb-modal-content .cbtb-modal-header, .cbtb .cbtb-modal.cbtb-fade.cbtb-in .cbtb-modal-dialog .cbtb-modal-content .cbtb-modal-header {
    padding: 5px 15px;
  }
  .cbtb .cbtb-modal .cbtb-modal-dialog .cbtb-modal-content .cbtb-row, .cbtb .cbtb-modal.cbtb-fade.cbtb-in .cbtb-modal-dialog .cbtb-modal-content .cbtb-row {
    padding: 0px;
  }
  .cbtb .cbtb-modal .cbtb-modal-dialog .cbtb-modal-content, .cbtb .cbtb-modal.cbtb-fade.cbtb-in .cbtb-modal-dialog .cbtb-modal-content {
    border-radius: 0px 0px 6px 6px;
  }
  .cbtb .cbtb-modal .cbtb-modal-dialog, .cbtb .cbtb-modal.cbtb-fade.cbtb-in .cbtb-modal-dialog {
    border: medium;
    margin: 0px auto;
    max-width: 100%;
    padding: 0px;
    top: 0px;
    width: 400px;
  }
  .cbtb .cbtb-modal, .cbtb .cbtb-modal.cbtb-fade.cbtb-in {
    background: none;
    border: medium;
    box-shadow: none;
    inset: 0px;
    margin: 0px;
    padding: 0px;
    position: fixed;
    width: 100%;
    z-index: 2147483647;
  }
  .cbtb .cbtb-modal-backdrop {
    background-color: rgb(0, 0, 0);
    inset: 0px;
    opacity: 0 !important;
    position: fixed;
    z-index: 1040;
  }
  .cbtb .cbtb-modal-body {
    padding: 15px;
    position: relative;
  }
  .cbtb .cbtb-modal-footer {
    border-top: 1px solid rgb(229, 229, 229);
    padding: 15px;
    text-align: right;
  }
  .cbtb .cbtb-modal-header {
    border-bottom: 1px solid rgb(229, 229, 229);
    min-height: 16.4286px;
    padding: 15px;
  }
  .cbtb .cbtb-modal.cbtb-fade .cbtb-modal-dialog.tab.bottom-left .cbtb-modal-content, .cbtb .cbtb-modal.cbtb-in .cbtb-modal-dialog.tab.bottom-left .cbtb-modal-content, .cbtb .cbtb-modal.cbtb-fade.cbtb-in .cbtb-modal-dialog.tab.bottom-left .cbtb-modal-content, .cbtb .cbtb-modal.cbtb-fade .cbtb-modal-dialog.tab.bottom-right .cbtb-modal-content, .cbtb .cbtb-modal.cbtb-in .cbtb-modal-dialog.tab.bottom-right .cbtb-modal-content, .cbtb .cbtb-modal.cbtb-fade.cbtb-in .cbtb-modal-dialog.tab.bottom-right .cbtb-modal-content {
    border-bottom: medium;
    border-radius: 6px 6px 0px 0px;
  }
  .cbtb .cbtb-sr-only {
    border: 0px;
    clip: rect(0px, 0px, 0px, 0px);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0px;
    position: absolute;
    width: 1px;
  }
  .cbtb .cbtb-text-hide {
    background-color: transparent;
    border: 0px;
    color: transparent;
    font: 0px / 0 a;
    text-shadow: none;
  }
  .cbtb .cbtb.scraped-container-fluid {
    margin-left: auto;
    margin-right: auto;
    padding-left: 15px;
    padding-right: 15px;
  }
  .cbtb .trust-badge {
    border: medium !important;
    display: none !important;
  }
  .cbtb .trust-badge .cbtb-close, .cbtb .cbtb-modal-content .cbtb-close {
    color: rgb(47, 72, 92) !important;
    opacity: 0.6;
  }
  .cbtb .trust-badge .cbtb-modal-header, .cbtb .cbtb-modal-content .cbtb-modal-header {
    border-bottom: 1px solid rgb(204, 204, 204);
  }
  .cbtb .trust-badge, .cbtb .cbtb-modal-content {
    border: 1px solid rgb(204, 204, 204);
    color: rgb(47, 72, 92) !important;
  }
  .cbtb .trust-badge.black .cbtb-close, .cbtb .cbtb-modal-content.black .cbtb-close {
    color: rgb(255, 255, 255) !important;
  }
  .cbtb .trust-badge.black .cbtb-modal-header, .cbtb .cbtb-modal-content.black .cbtb-modal-header {
    border-bottom: 1px solid rgb(47, 72, 92);
  }
  .cbtb .trust-badge.black, .cbtb .cbtb-modal-content.black {
    background-color: rgb(0, 0, 0) !important;
    border: 1px solid rgb(47, 72, 92);
    color: rgb(255, 255, 255) !important;
  }
  .cbtb .trust-badge.dark-blue .cbtb-close, .cbtb .cbtb-modal-content.dark-blue .cbtb-close {
    color: rgb(204, 204, 204) !important;
  }
  .cbtb .trust-badge.dark-blue .cbtb-modal-header, .cbtb .cbtb-modal-content.dark-blue .cbtb-modal-header {
    border-bottom: 1px solid rgb(138, 149, 158);
  }
  .cbtb .trust-badge.dark-blue, .cbtb .cbtb-modal-content.dark-blue {
    background-color: rgb(47, 72, 92) !important;
    border: 1px solid rgb(138, 149, 158);
    color: rgb(204, 204, 204) !important;
  }
  .cbtb .trust-badge.dark-grey .cbtb-close, .cbtb .cbtb-modal-content.dark-grey .cbtb-close {
    color: rgb(204, 204, 204) !important;
  }
  .cbtb .trust-badge.dark-grey .cbtb-modal-header, .cbtb .cbtb-modal-content.dark-grey .cbtb-modal-header {
    border-bottom: 1px solid rgb(138, 149, 158);
  }
  .cbtb .trust-badge.dark-grey, .cbtb .cbtb-modal-content.dark-grey {
    background-color: rgb(51, 51, 51) !important;
    border: 1px solid rgb(138, 149, 158);
    color: rgb(204, 204, 204) !important;
  }
  .cbtb .trust-badge.header {
    border: medium !important;
  }
  .cbtb .trust-badge.light-blue .cbtb-close, .cbtb .cbtb-modal-content.light-blue .cbtb-close {
    color: rgb(47, 72, 92) !important;
  }
  .cbtb .trust-badge.light-blue .cbtb-modal-header, .cbtb .cbtb-modal-content.light-blue .cbtb-modal-header {
    border-bottom: 1px solid rgb(138, 149, 158);
  }
  .cbtb .trust-badge.light-blue, .cbtb .cbtb-modal-content.light-blue {
    background-color: rgb(196, 220, 235) !important;
    border: 1px solid rgb(138, 149, 158);
    color: rgb(47, 72, 92) !important;
  }
  .cbtb .trust-badge.light-green .cbtb-close, .cbtb .cbtb-modal-content.light-green .cbtb-close {
    color: rgb(47, 72, 92) !important;
  }
  .cbtb .trust-badge.light-green .cbtb-modal-header, .cbtb .cbtb-modal-content.light-green .cbtb-modal-header {
    border-bottom: 1px solid rgb(204, 204, 204);
  }
  .cbtb .trust-badge.light-green, .cbtb .cbtb-modal-content.light-green {
    background-color: rgb(200, 237, 200) !important;
    border: 1px solid rgb(204, 204, 204);
    color: rgb(47, 72, 92) !important;
  }
  .cbtb .trust-badge.light-grey .cbtb-close, .cbtb .cbtb-modal-content.light-grey .cbtb-close {
    color: rgb(47, 72, 92) !important;
  }
  .cbtb .trust-badge.light-grey .cbtb-modal-header, .cbtb .cbtb-modal-content.light-grey .cbtb-modal-header {
    border-bottom: 1px solid rgb(204, 204, 204);
  }
  .cbtb .trust-badge.light-grey, .cbtb .cbtb-modal-content.light-grey {
    background-color: rgb(242, 242, 242) !important;
    border: 1px solid rgb(204, 204, 204);
    color: rgb(47, 72, 92) !important;
  }
  .cbtb .trust-badge.light-yellow .cbtb-close, .cbtb .cbtb-modal-content.light-yellow .cbtb-close {
    color: rgb(47, 72, 92) !important;
  }
  .cbtb .trust-badge.light-yellow .cbtb-modal-header, .cbtb .cbtb-modal-content.light-yellow .cbtb-modal-header {
    border-bottom: 1px solid rgb(138, 149, 158);
  }
  .cbtb .trust-badge.light-yellow, .cbtb .cbtb-modal-content.light-yellow {
    background-color: rgb(250, 235, 171) !important;
    border: 1px solid rgb(138, 149, 158);
    color: rgb(47, 72, 92) !important;
  }
  .cbtb .trust-badge.tab {
    border-radius: 0px 0px 5px 5px;
    height: 50px;
    left: 10px;
    padding: 5px 10px;
    position: absolute;
    top: 0px;
    width: 190px;
    z-index: 2147483646;
  }
  .cbtb .trust-badge.tab.bottom-left, .cbtb .trust-badge.tab.bottom-right {
    border-bottom: medium;
    border-radius: 5px 5px 0px 0px;
    bottom: 0px;
    position: fixed;
    top: auto;
  }
  .cbtb .trust-badge.tab.top-left, .cbtb .trust-badge.tab.top-right {
    border-top: medium;
  }
  .cbtb .trust-badge.tab:hover {
    animation: 500ms pulse;
  }
  .cbtb-close {
    appearance: none;
    background: transparent;
    border: 0px;
    cursor: pointer;
    padding: 0px;
  }
  .cc-bottom-nav-carousel, .cc-bottom-nav-carousel .cc-thumnail-carousel-slide {
    margin: 5px;
    padding: 5px;
  }
  .cc-cart-details-block .cc-cart-details-value, .cc-cart-details-block .cc-cart-details-label {
    display: block;
    font-size: 16px;
    font-weight: 400;
    text-align: right;
    width: auto;
  }
  .cc-side-nav-carousel .cc-thumnail-carousel-slide {
    height: auto;
    margin: 5px;
    padding: 5px;
    width: 100%;
  }
  .close_popup {
    background: #000;
    border: 2px solid #fff;
    border-radius: 50%;
    color: #fff;
    float: right;
    padding: 5px 6px;
    position: relative;
    right: -8px;
    top: -10px;
  }
  .colon {
    font-size: 1rem;
    margin: 0px;
    padding: 0px;
  }
  .countdown-block {
    display: inline-block;
    margin: 0px 10px;
    padding: 10px;
  }
  .countdown-digit {
    font-size: 1rem;
  }
  .countdown-endtext {
    font-size: 5rem;
  }
  .dark-highlight .relative .img {
    padding: 0 15px;
  }
  .fa-caret-down {
    color: rgb(255, 255, 255) !important;
  }
  .feat-img {
    max-width: 60%;
    padding-top: 20px;
  }
  .fk-bullet {
    font-size: 20px;
    font-weight: 700;
    list-style: none;
    padding: 2px 15px;
    text-align: left;
  }
  .fk-bullet-icon-container {
    padding: 5px 10px 5px 5px;
  }
  .fk-bullet-list-container {
    align-items: baseline;
    display: flex;
    flex-direction: row;
    padding: 5px;
  }
  .fk-collapsible-list-content {
    border-radius: 0px 0px 5px 5px;
    display: block;
  }
  .fk-collapsible-list-label-text {
    color: rgb(255, 255, 255) !important;
  }
  .fk-collapsible-list-left-label {
    border-radius: 5px 5px 0px 0px;
  }
  .fk-collapsible-list-right-label {
    border-radius: 5px 5px 0px 0px;
  }
  .fk-inner-header-wrapper .fk-menu-container .fk-menu {
    color: black;
    padding: 5px;
    white-space: nowrap;
  }
  .fk-inner-header-wrapper .fk-menu-container .fk-menu:hover, .fk-inner-header-wrapper .fk-menu-container .fk-menu:focus {
    color: black;
  }
  .fk-payment-option-body {
    border: 1px solid rgb(217, 217, 217);
    display: flex;
  }
  .fk-payment-option-container:first-child .fk-payment-option-header-wrapper {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
  .fk-payment-option-container:last-child .fk-payment-option-body {
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
  }
  .fk-payment-option-container:last-child .fk-payment-option-header-wrapper {
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
  }
  .fk-payment-option-header-wrapper {
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
  }
  .fk-popup {
    background-color: #0e0d0d91;
    bottom: 0;
    display: none;
    height: auto;
    inset: 0px;
    left: 0;
    min-height: 300px;
    opacity: 1;
    overflow: auto;
    position: fixed;
    right: 0;
    top: 0;
    z-index: 999999;
  }
  .fk-product-variant-select .variant-label1, .fk-product-variant-select .variant-label2, .fk-product-variant-select .variant-label3 {
    background-size: contain;
    border: 2px solid rgb(197, 202, 205);
    flex: 1 1 0%;
    height: auto;
    margin: 10px;
    padding: 10px;
    width: auto;
  }
  .fk-shopping-cart .dynamic-price-total, .fk-shopping-cart .dynamic-shipping-total, .fk-shopping-cart .salesTax, .fk-shopping-cart .discount, .fk-shopping-cart .grandTotal {
    font-size: 1rem;
    font-weight: 500;
    margin-right: 0.75rem;
    width: 20%;
  }
  .fk-youtube .fk-rm.image {
    -webkit-background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    height: 100%;
    position: absolute;
    width: 100%;
  }
  .fk-youtube .play-button {
    background-color: #333;
    border-radius: 6px;
    box-shadow: 0 0 30px rgba( 0,0,0,0.6 );
    height: 60px;
    opacity: 0.8;
    width: 90px;
    z-index: 1;
  }
  .fk-youtube .play-button:before {
    border-color: transparent transparent transparent #fff;
    border-style: solid;
    border-width: 15px 0 15px 26.0px;
    content: "";
  }
  .font-000000FF {
    color: rgb(0, 0, 0);
  }
  .form-check .form-check-input {
    accent-color: rgb(223, 44, 100);
    position: relative;
    top: 5px;
  }
  .form-check.selectedWB {
    background-color: rgb(252, 234, 234) !important;
    border: 2px solid rgb(223, 44, 100) !important;
  }
  .form-check.selectedWB .form-check-input {
    accent-color: rgb(223, 44, 100);
  }
  .header-div {
    font-family: Proxima Nova, Helvetica, Arial, sans-serif !important;
    font-size: 38px;
    font-weight: 700;
    line-height: 45.6px;
  }
  .headline {
    padding: 0px 15px 0px 15px !important;
  }
  .horizontal-line-default {
    background-color: rgb(0, 0, 0);
    max-width: 100%;
    width: 100%;
  }
  .input-wrap .ch-input, .select-wrap .ch-select {
    appearance: none;
    border: 1px solid rgb(217, 217, 217);
    color: rgb(51, 51, 51);
    font-size: 14px;
    height: 50px;
    outline: none;
    width: 100%;
  }
  .input-wrap .ch-input:focus, .select-wrap .ch-select:focus {
    border-color: rgb(25, 123, 189);
    box-shadow: rgb(25, 123, 189) 0px 0px 0px 1px;
    outline: none;
  }
  .input-wrap .input-label {
    color: rgb(153, 153, 153);
    font-size: 14px;
    font-weight: normal;
    left: 0px;
    overflow: hidden;
    padding-left: 13px;
    padding-right: 13px;
    pointer-events: none;
    position: absolute;
    top: 15px;
    white-space: nowrap;
    width: calc(100% - 13px);
  }
  .ms-collapsed .basic-information-section {
    border-bottom: 1px solid transparent;
    height: 0px;
  }
  .popup-header {
    color: #353535 !important;
  }
  .review-body {
    padding: 22px;
  }
  .review-card {
    background: var(--card);
    border: 1px solid var(--line);
    border-radius: 16px;
    box-shadow: 0 6px 18px rgba(0,0,0,.04);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .review-quote {
    color: var(--text);
    font-size: 14px;
    line-height: 1.65;
    margin: 0 0 18px 0;
    position: relative;
  }
  .reviewer {
    align-items: center;
    color: var(--text);
    display: flex;
    font-weight: 600;
    gap: 12px;
    margin-top: 6px;
  }
  .reviews-section {
    background: var(--bg);
    border-radius: 18px;
    font-family: "Open Sans", Arial, sans-serif;
    margin: 0 auto;
    max-width: 1000px;
    padding: 32px 20px;
  }
  .select-wrap .ch-select {
    padding-right: 32px;
  }
  .select-wrap .ch-select.ch-dirty {
    padding-top: 22px;
  }
  .selected-label {
    border: 3px solid rgb(1, 105, 156) !important;
  }
  .sidepanel .cc-panel-view-cart, .sidepanel .cc-panel-checkout {
    font-size: 16px;
    margin: 0px auto;
    padding: 5px 0px;
  }
  .table-4lp .title-dla {
    font-size: 26px;
  }
  .table-hs3 .title-dla {
    color: white;
  }
  .text-ywn {
    color: rgb(52, 58, 64);
  }
  .trust-statement {
    font-size: 14px !important;
  }
  .video-w-desktop {
    margin: auto;
    max-width: 1200px;
    padding-left: 0px !important;
    padding-right: 0px !important;
  }
```

### J. All Static Text Content (from HTML)

  `#NoButton1` (div): `Refund Policy Privacy Policy Terms of Service`
  `#cc-id-2WzVuRbvO05r` (span): `00 Minutes : : 00 Seconds`
  `#cc-id-38kk2yWQCOQO` (div): `00 Minutes`
  `#cc-id-7zXHFA86hCmp` (button): `YES, ADD 3 BOTTLE TO MY ORDER`
  `#cc-id-NelMQjYpN8aS` (div): `WAIT {{firstName}}!`
  `#cc-id-WHXG5juLVM69` (div): `Seconds`
  `#cc-id-afpk1MR7uStc` (div): `Minutes`
  `#cc-id-eU4iztnkuUdD` (button): `SELECT TO SAVE $1,879`
  `#cc-id-eWKxowVKCq6ss` (button): `YES, ADD 1 BOTTLE TO MY ORDER`
  `#cc-id-ksoXspKnoV1K` (h3): `2x  SmoothSpine Multitherapy Pro`
  `#cc-id-nOpsX2g68A2k` (span): `2x  SmoothSpine Multitherapy Pro`
  `#cc-id-pDzC9oKjcRax` (li): `WAIT {{firstName}}! Your Order Is Not Complete Yet Please Watch This Important M`
  `#cc-id-pOmIMXZh2kSm` (div): `00 Seconds`
  `#cc-id-vG0lEF3T1Th7` (h3): `2x  SmoothSpine Multitherapy Pro`
  `#fkt-link-445-b8f-b29` (a): `No thanks, maybe Later...`
  `#fkt-link-490-292-b70` (a): `Terms of Service`
  `#fkt-link-509-795-ab8` (a): `Privacy Policy`
  `#fkt-link-5f5-4b2-a41` (a): `No thanks — I'll leave my nerve inflamed and hope my devices alone can do the fu`
  `#fkt-link-636-784-a01` (a): `Refund Policy`
  `#fkt-link-f12-5b5-a1f` (a): `YES UPGRADE MY ORDER!`
  `#i0228r6` (div): `Breaks the Inflammation Loop Your Devices Can't Reach`
  `#i039xon` (div): `Calms Hypersensitive Nerve Firing Within Days`
  `#i0b4i` (b): `DO THIS FIRST:`
  `#i0bezj` (div): `100% Satisfaction 90-Day Money-Back Guarantee`
  `#i0y7uq-2` (b): `based on 1,548 reviews!`
  `#i1ebd8i` (div): `Experience Relief Within 15 Minutes`
  `#i1f0yp` (div): `90-Day Money-Back Guarantee`
  `#i1fmrq` (div): `THIS UPGRADE IS ONLY AVAILABLE FOR THE NEXT: : 00 : : 00`
  `#i1hlj` (div): `IMPORTANT: Do NOT Close This Window Or Click The "Back" Button:`
  `#i1meq` (div): `Please Watch This Important Message Below Now`
  `#i2b95` (div): `Your Order Is Not Complete Yet`
  `#i2cl47` (div): `UPGRADE TO 2`
  `#i308di8` (div): `Calms Hypersensitive Nerve Firing Within Days`
  `#i30sen4` (div): `$33.25 / bottle 3-7 Day Delivery`
  `#i34tqi` (div): `Breaks the Inflammation Loop Your Devices Can't Reach`
  `#i3jt56` (div): `BEST VALUE`
  `#i3qb8s` (div): `00 Minutes : : 00 Seconds`
  `#i3r7od` (span): `3-7 Day Delivery`
  `#i3w2y` (span): `Carol T`
  `#i3w9ei` (div): `Total: $179.70 (Save $60)`
  `#i3xdb4` (div): `76,500+ Happy customers`
  `#i3xhz1` (div): `Breaks the Inflammation Loop Your Devices Can't Reach`
  `#i3zjko` (div): `Calms Hypersensitive Nerve Firing Within Days`
  `#i4ysb2` (div): `90-Day Money-Back Guarantee`
  `#i4z7f4` (div): `76,500+ Happy customers`
  `#i4zn5y9` (b): `Get a 30-day supply for just $1`
  `#i4zn5y9-2` (b): `Get a 30-day supply for just $1`
  `#i52fhp` (div): `WAIT {{firstName}}! Your Order Is Not Complete Yet Please Watch This Important M`
  `#i58b02` (div): `Patented 4-Ingredient SciatiCalm-4 Complex`
  `#i5fgmk` (div): `Patented 4-Ingredient SciatiCalm-4 Complex`
  `#i5guu` (div): `Your Order Is Not Complete Yet`
  `#i5ocpe` (div): `Wait…$247 is too much?`
  `#i5s8knj` (div): `76,500+ Happy customers`
  `#i5yjt` (div): `IMPORTANT: Do NOT Close This Window Or Click The "Back" Button: It may double-bi`
  `#i793x4` (span): `Patricia H`
  `#i7jrua` (div): `Calms Hypersensitive Nerve Firing Within Days`
  `#i7pt272` (button): `GET SciatiCalm Nerve Support FOR JUST $1`
  `#i7pt272-2` (button): `GET SciatiCalm Nerve Support FOR JUST $1`
  `#i7uujdx` (div): `( $185 Total )`
  `#i7y8gi` (div): `★★★★★ OVER 65,000+ HAPPY CUSTOMERS 2x  SmoothSpine Multitherapy Pro Only $247 $1`
  `#i7ylnlf` (div): `Heals Knees From The Inside Out`
  `#i80fgbh` (div): `Experience Relief Within 15 Minutes`
  `#i86ece` (span): `3-7 Day Delivery`
  `#i8dnp9` (div): `Your Order Is Not Complete Yet`
  `#i9dzv5` (div): `Breaks the Inflammation Loop Your Devices Can't Reach`
  `#i9znnvq` (div): `3,500+ Happy Customers`
  `#iax499` (div): `Breaks the Inflammation Loop Your Devices Can't Reach`
  `#ibednl` (b): `Only $247 $1200`
  `#ibxj7p` (div): `Patented 4-Ingredient SciatiCalm-4 Complex`
  `#ic3oi4` (div): `BEST VALUE UPGRADE TO 3`
  `#ic7jlo` (div): `SECURE OUR LOWEST PRICE ON THE INTERNET`
  `#icadox` (span): `WHICH UPGRADE DO YOU CHOOSE?`
  `#icb25i6` (div): `Patented 4-Ingredient SciatiCalm-4 Complex`
  `#icfidi` (div): `MOST POPULAR UPGRADE TO 2`
  `#icifvmc` (div): `90-Day Money-Back Guarantee`
  `#iedtk9d` (div): `76,500+ Happy customers`
  `#iekcwz` (span): `: 00 : : 00`
  `#ieugr9u` (div): `Heals Knees From The Inside Out`
  `#iezvaz` (div): `Refund Policy Privacy Policy Terms of Service`
  `#if3fiu` (div): `Calms Hypersensitive Nerve Firing Within Days`
  `#if75f` (span): `Gary W`
  `#ifcvz0x` (div): `3,500+ Happy Customers`
  `#ife8j1` (div): `Get 70% OFF... 2x  SmoothSpine Multitherapy Pro`
  `#iftkwi` (ul): `WAIT {{firstName}}! Your Order Is Not Complete Yet Please Watch This Important M`
  `#ifuxb4` (div): `: 00 : : 00`
  `#ig0vd7` (div): `WAIT {{firstName}}!`
  `#igh01i` (div): `76,500+ Happy customers`
  `#igrshc` (div): `Patricia H`
  `#igxjs36` (div): `No Thank You GET SciatiCalm Nerve Support FOR JUST $1`
  `#igxjs36-2` (div): `No Thank You GET SciatiCalm Nerve Support FOR JUST $1`
  `#igzhht` (div): `Patented 4-Ingredient SciatiCalm-4 Complex`
  `#ih4wig` (div): `YES, ADD 1 BOTTLE TO MY ORDER`
  `#ih4wig-2` (div): `YES, ADD 3 BOTTLE TO MY ORDER`
  `#ih4wig-3` (div): `SELECT TO SAVE $1,879`
  `#iheazj` (div): `WAIT {{firstName}}! Your Order Is Not Complete Yet Please Watch This Important M`
  `#ihlkrn` (div): `THIS UPGRADE IS ONLY AVAILABLE FOR THE NEXT:`
  `#ii2umi` (span): `DO THIS FIRST:`
  `#ii3if` (div): `It may double-bill your card`
  `#ii4l5i` (div): `6 Bottles (180-day supply)`
  `#iice3sv` (div): `Reduces Swelling & Increases Mobility`
  `#iif9e9-2` (b): `Our customers say`
  `#iifwqfh` (div): `Experience Relief Within 15 Minutes`
  `#iimrlo` (span): `Breaks the Inflammation Loop Your Devices Can't Reach`
  `#iin3hd` (div): `★★★★★ OVER 65,000+ HAPPY CUSTOMERS`
  `#iiubk` (div): `Gary W`
  `#iiunhd` (span): `★★★★★`
  `#ij39xl` (div): `3 Bottles (90-day supply)`
  `#ij5qsh` (div): `Only $247 $1200`
  `#ij6e4` (div): `Carol T`
  `#ijp6t` (span): `Your Order Is Not Complete Yet`
  `#ijrsuo` (div): `Breaks the Inflammation Loop Your Devices Can't Reach`
  `#ijtvht` (span): `Please Watch This Important Message Below Now`
  `#ik20m7-3` (div): `Refund Policy Privacy Policy Terms of Service`
  `#ik2j48` (button): `YES, ADD 6 BOTTLE TO MY ORDER`
  `#ik681rk` (div): `Heals Knees From The Inside Out`
  `#ikdaos` (strike): `$1200`
  `#ikmlah` (span): `3-7 Day Delivery`
  `#ikn1ck` (span): `Breaks the Inflammation Loop Your Devices Can't Reach`
  `#im1np6` (div): `★★★★★ OVER 65,000+ HAPPY CUSTOMERS 2x  SmoothSpine Multitherapy Pro Only $247 $1`
  `#im5mnj` (div): `Your Order Is Not Complete Yet Please Watch This Important Message Below Now`
  `#im7kqa` (div): `BASIC UPGRADE TO 1`
  `#imwkh3` (div): `WAIT {{firstName}}!`
  `#in179h` (div): `2x  SmoothSpine Multitherapy Pro`
  `#in32j2` (i): `No thanks — I'll leave my nerve inflamed and hope my devices alone can do the fu`
  `#incb2h` (div): `WHICH UPGRADE DO YOU CHOOSE? THIS UPGRADE IS ONLY AVAILABLE FOR THE NEXT: : 00 :`
  `#io6mok` (div): `Please Watch This Important Message Below Now`
  `#io6plp` (b): `WHICH UPGRADE DO YOU CHOOSE?`
  `#iotdv9g` (span): `Experience Relief Within 15 Minutes`
  `#iowya` (div): `DO THIS FIRST: Please watch this important New Customer update from Dr. Schillin`
  `#ipns6l` (span): `Breaks the Inflammation Loop Your Devices Can't Reach`
  `#ipphk8` (div): `Calms Hypersensitive Nerve Firing Within Days`
  `#ipppiy` (div): `Total: $39.95 (Save $10)`
  `#ipsth` (div): `DO THIS FIRST: Please watch this important New Customer update from Dr. Schillin`
  `#iqe2el3` (div): `Reduces Swelling & Increases Mobility`
  `#iqeox3` (div): `YES, ADD 6 BOTTLE TO MY ORDER`
  `#iqls1y` (div): `76,500+ Happy customers`
  `#iqpg65` (div): `Patented 4-Ingredient SciatiCalm-4 Complex`
  `#iqshmj` (div): `3 Red Light Pro Devices`
  `#ir3abk9` (div): `Reduces Swelling & Increases Mobility`
  `#ir8apk` (div): `$29.95 / bottle 3-7 Day Delivery`
  `#iropysq` (div): `Patented 4-Ingredient SciatiCalm-4 Complex`
  `#iruszwh` (div): `90-Days Money-Back Guarantee`
  `#irvrk` (div): `Your Order Is Not Complete Yet Please Watch This Important Message Below Now`
  `#irwkl3` (div): `DO THIS FIRST: Please watch this important New Customer update from Dr. Schillin`
  `#is4fbo` (div): `Calms Hypersensitive Nerve Firing Within Days`
  `#ith2yt-2` (span): `based on`
  `#itigy` (div): `IMPORTANT: Do NOT Close This Window Or Click The "Back" Button: It may double-bi`
  `#itj3z3` (div): `BASIC`
  `#itogax` (b): `100% Satisfaction 90-Day Money-Back Guarantee`
  `#itp5lej` (div): `Patented 4-Ingredient SciatiCalm-4 Complex`
  `#itpyhsq` (div): `$61 / each`
  `#itrbez` (span): `$1200`
  `#its9l7l` (div): `Calms Hypersensitive Nerve Firing Within Days`
  `#iu2k54-3` (div): `No thanks — I'll leave my nerve inflamed and hope my devices alone can do the fu`
  `#iu8m2ei` (span): `Get a 30-day supply for just $1`
  `#iu8m2ei-2` (span): `Get a 30-day supply for just $1`
  `#iubyeh` (div): `Calms Hypersensitive Nerve Firing Within Days`
  `#iugqyl` (div): `$39.95 / bottle 3-7 Day Delivery`
  `#iut1fm` (div): `Patented 4-Ingredient SciatiCalm-4 Complex`
  `#iv0ru7k` (button): `No Thank You`
  `#iv0ru7k-2` (button): `No Thank You`
  `#iw178h` (div): `UPGRADE TO 1`
  `#iw3xqn` (div): `UPGRADE TO 3`
  `#iw44wk` (div): `BEST VALUE`
  `#iwd04` (div): `IMPORTANT: Do NOT Close This Window Or Click The "Back" Button:`
  `#iwt1j2` (div): `1 Bottle (30-day supply)`
  `#iwxa7o` (div): `Breaks the Inflammation Loop Your Devices Can't Reach`
  `#iwxmah` (div): `Breaks the Inflammation Loop Your Devices Can't Reach`
  `#ix1whc-3` (div): `Wait…$247 is too much?`
  `#ixmq47j` (div): `Total: $99.85 (Save $20)`
  `#ixmwqk` (div): `BEST VALUE UPGRADE TO 3`
  `#iyj5fm` (div): `UPGRADE TO 3`
  `#iylqnl` (div): `Breaks the Inflammation Loop Your Devices Can't Reach`
  `#iyyueg4` (div): `WAIT! Get SciatiCalm For Just $1`
  `#iyyueg4-2` (div): `WAIT! Get SciatiCalm For Just $1`
  `#izi6sl` (div): `MOST POPULAR`
  `#pageDataScript` (script): `var pageData = {"pageViewReferenceId":"ab2408b9-63ed-4f02-a75d-8ce045ce3d09","fu`

### K. JavaScript Template Texts

- `); // Step 2: Confirm payment with Stripe.js console.log(`
- `); e.preventDefault(); orderSummary.classList.toggle(`
- `); orderSummary.classList.toggle(`
- `); orders.unshift(order); localStorage.setItem(`
- `); updateOrderStatus(order.id,`
- `, JSON.stringify(orders)); console.log(`
- `, currencyCode); // Create order draft BEFORE payment processing console.log(`
- `, error); // Update order status to failed updateOrderStatus(order.id,`
- `, foundDiscount); appliedDiscountCode = foundDiscount; setTimeout(() => { syncOrderSummaryWithProduc`
- `, orderId); } catch (error) { console.error(`
- `.order-applied-discount-remove`
- `.order-discount-code-button`
- `.order-discount-code-input`
- `.order-summary-body`
- `.order-summary-header`
- `; // Order Item bodyHTML +=`
- `; productRow.style.borderLeft =`
- `; r.style.borderLeft =`
- `; row.style.borderColor =`
- `; row.style.borderLeft =`

---

## CROSS-PAGE PATTERNS

### 1. Interrupt Header Text Across All Pages

| Brand | OTO | Interrupt Text | Has CSS? |
|-------|-----|---------------|----------|
| Vibriance | OTO1 | WAIT! Your order is not complete! Almost Complete. | No |
| Vibriance | OTO2 | None | N/A |
| Vibriance | OTO3 | WAIT! Your Order Is Not Complete... | No |
| Vibriance | OTO4 | None | N/A |
| Vibriance | OTO5 | None | N/A |
| Clarifion | OTO1 | Wait! Wait! | No |
| Clarifion | OTO2 | Wait! Here’s another way to clean your
            | No |
| Clarifion | OTO3 | Wait! Wait! | No |
| Clarifion | OTO4 | None | N/A |
| VSL | OTO1 | IMPORTANT: Do NOT Close This Window Or Click The " | No |
| VSL | OTO2 | WAIT! Your Order Is Not Complete Yet Please Watch  | No |
| VSL | OTO3 | IMPORTANT: Do NOT Close This Window Or Click The " | No |

### 2. CTA Button CSS Across All Pages

| Brand | OTO | Text | Background | Color | Font-Size | Border-Radius |
|-------|-----|------|-----------|-------|-----------|--------------|
| Vibriance | OTO1 | Upgrade your order and get 3 m | N/A | N/A | N/A | N/A |
| Vibriance | OTO2 | Upgrade your order now with Vi | N/A | N/A | N/A | N/A |
| Vibriance | OTO3 | Upgrade your order now: 36% OF | N/A | N/A | N/A | N/A |
| Vibriance | OTO4 | Does Your Skin Get Extra Dry?  | N/A | N/A | N/A | N/A |
| Vibriance | OTO5 | 🛑 FINAL STEP: Protect Your Ord | N/A | N/A | N/A | N/A |
| Clarifion | OTO1 | Yes! Send me an additional 3 C | #1ab22c | white | 18px | 5px |
| Clarifion | OTO2 | YES! Add 3 ODRx devices to my
 | #1ab22c | white | 18px | 5px |
| Clarifion | OTO3 | YES! Add 1 ODRx device for onl | #1ab22c | white | 18px | 5px |
| Clarifion | OTO4 | YES! Send me 5 Clear Air Purif | #1ab22c | white | 18px | 5px |
| VSL | OTO1 | WHICH UPGRADE DO YOU CHOOSE? T | N/A | rgb(255, 255, 255) | N/A | N/A |
| VSL | OTO2 | 1x SmoothSpine™ NMES Massager  | N/A | N/A | N/A | N/A |
| VSL | OTO3 | WHICH UPGRADE DO YOU CHOOSE? T | N/A | rgb(255, 255, 255) | N/A | N/A |

### 3. Opt-Out Text Across All Pages

**Vibriance OTO1**: `No thanks, I don't want to upgrade my order. When I run out I'll just `
**Vibriance OTO2**: `Or, click here to say “NO THANKS” and miss out
on the lowest price we’`
**Vibriance OTO3**: `Or, click here to say NO THANKS, I don't want
to give my eyes an insta`
**Vibriance OTO4**: `Or, click here to say NO THANKS, but this
30% OFF deal won't be offere`
**Vibriance OTO5**: `No thanks, I don’t want to protect my order against theft`
**VSL OTO1**: `No thanks, - I do not want to heal my Sciatica in half the time and I
`
**VSL OTO2**: `ADD TO ORDER 90 DAY MONEY BACK GUARANTEE! * Plus applicable sales tax `
**VSL OTO3**: `No thanks — I'll leave my nerve inflamed and hope my devices alone can`

### 4. Countdown Timer Patterns

| Brand | OTO | Duration | Digit Font | End Text Font |
|-------|-----|----------|-----------|--------------|
| Vibriance | OTO1 | 10 min | 1rem | 5rem |
| Vibriance | OTO2 | 10 min | 1rem | N/A |
| Vibriance | OTO3 | 10 min | 1rem | 5rem |
| Vibriance | OTO4 | 10 min | 1rem | 5rem |
| Vibriance | OTO5 | 10 min | N/A | N/A |
| Clarifion | OTO1 | None min | N/A | N/A |
| Clarifion | OTO2 | None min | N/A | N/A |
| Clarifion | OTO3 | None min | N/A | N/A |
| Clarifion | OTO4 | None min | N/A | N/A |
| VSL | OTO1 | 29, 9, 10 min | 1rem | 5rem |
| VSL | OTO2 | 7 min | N/A | N/A |
| VSL | OTO3 | 29, 9 min | 1rem | 5rem |

### 5. Guarantee Text Across All Pages

**Vibriance OTO2**: `Try It RISK FREE for one full year! Use it all and love it, or your mo`
**Vibriance OTO3**: `Yes! Upgrade My Order... Comes with 100% Money Back Guarantee. Try a F`
**Vibriance OTO4**: `Yes! Upgrade My Order... Comes with 100% Money Back Guarantee. Try a F`
**VSL OTO1**: `100% Satisfaction 180-Day Money-Back Guarantee`
**VSL OTO2**: `$49.99 /each SAVE 50%! TOTAL: $49.99 FREE SHIPPING ADD TO ORDER 90 DAY`
**VSL OTO3**: `100% Satisfaction 90-Day Money-Back Guarantee`

## OTO PROGRESSION ANALYSIS

### Vibriance Funnel: OTO1 through OTO5

| Metric  | OTO1 | OTO2 | OTO3 | OTO4 | OTO5 |
|--------|------|------|------|------|------|
| File Size | 524,573 | 516,731 | 506,599 | 510,279 | 517,818 |
| Custom CSS | 8,514 | 10,825 | 9,690 | 11,345 | 3,899 |
| Timer | 10 min | 10 min | 10 min | 10 min | 10 min |
| ID Rules | 41 | 43 | 43 | 45 | 0 |
| Has Interrupt | Yes | No | Yes | No | No |
| CTA | Upgrade your order and ge | Upgrade your order now wi | Upgrade your order now: 3 | Does Your Skin Get Extra  | 🛑 FINAL STEP: Protect You |

#### Vibriance Key Text Progression

**OTO1**:
  - `WAIT! Your order is not complete! Almost Complete...`
  - `WAIT! Your order is not complete! Almost Complete...`
  - `WAIT! Your order is not complete!`
  - `WAIT! Your order is not complete!`
  - `Upgrade your order and get 3 more bottles of Super C Serum f`

**OTO2**:
  - `80% Of Repeat Vibriance Customers Add THIS To Their Order...`
  - `80% Of Repeat Vibriance Customers Add THIS To Their Order...`
  - `80% Of Repeat Vibriance Customers Add THIS To Their Order...`
  - `Upgrade your order now with Vibriance Retinol Serum:`
  - `Upgrade Your Order Now With A One-Month Treatment: Just $32 `

**OTO3**:
  - `WAIT! Your Order Is Not Complete...`
  - `WAIT! Your Order Is Not Complete...`
  - `WAIT! Your Order Is Not Complete...`
  - `Take Years Off Your Eyes With Vibriance™ Eye Renewal Serum I`
  - `Take Years Off Your Eyes With Vibriance™ Eye Renewal Serum I`

**OTO4**:
  - `Does Your Skin Get Extra Dry? Upgrade Your Order With This E`
  - `Does Your Skin Get Extra Dry? Upgrade Your Order With This E`
  - `Upgrade Your Order With This Extra BOOST Of Hydration`
  - `Upgrade your order now: 30% OFF, just $24`
  - `Upgrade your order now: 30% OFF, just $24`

**OTO5**:
  - `🛑 FINAL STEP: Protect Your Order 🛑`
  - `🛑 FINAL STEP: Protect Your Order 🛑`
  - `🛑 FINAL STEP: Protect Your Order 🛑`
  - `YES! PROTECT MY ORDER AGAINST LOSS & THEFT`
  - `No thanks, I don’t want to protect my order against theft`

### Clarifion Funnel: OTO1 through OTO4

| Metric  | OTO1 | OTO2 | OTO3 | OTO4 |
|--------|------|------|------|------|
| File Size | 604,211 | 605,181 | 603,881 | 604,794 |
| Custom CSS | 232,798 | 232,260 | 232,227 | 232,297 |
| Timer | None | None | None | None |
| ID Rules | 10 | 7 | 7 | 8 |
| Has Interrupt | Yes | Yes | Yes | No |
| CTA | Yes! Send me an additiona | YES! Add 3 ODRx devices t | YES! Add 1 ODRx device fo | YES! Send me 5 Clear Air  |

#### Clarifion Key Text Progression

**OTO1**:
  - `Wait! Wait!`
  - `Wait!`
  - `Wait!`
  - `And yes, shipping's
                                still on`
  - `Yes! Send me an additional 3 Clarifion™ for
                `

**OTO2**:
  - `Wait! Here’s another way to clean your
                     `
  - `YES! Add 3 ODRx devices to my
                            or`

**OTO3**:
  - `Wait! Wait!`
  - `Wait!`
  - `And yes, you still get
                                FREE `
  - `YES! Add 1 ODRx device for only
                            `

**OTO4**:
  - `YES! Send me 5 Clear Air Purifiers
                         `

### VSL Funnel: OTO1 through OTO3

| Metric  | OTO1 | OTO2 | OTO3 |
|--------|------|------|------|
| File Size | 629,221 | 667,135 | 659,909 |
| Custom CSS | 83,223 | 15,993 | 112,204 |
| Timer | 29, 9, 10 min | 7 min | 29, 9 min |
| ID Rules | 213 | 0 | 255 |
| Has Interrupt | Yes | Yes | Yes |
| CTA | WHICH UPGRADE DO YOU CHOO | 1x SmoothSpine™ NMES Mass | WHICH UPGRADE DO YOU CHOO |

#### VSL Key Text Progression

**OTO1**:
  - `IMPORTANT: Do NOT Close This Window Or Click The "Back" Butt`
  - `IMPORTANT: Do NOT Close This Window Or Click The "Back" Butt`
  - `IMPORTANT: Do NOT Close This Window Or Click The "Back" Butt`
  - `IMPORTANT: Do NOT Close This Window Or Click The "Back" Butt`
  - `WAIT {{firstName}}! Your Order Is Not Complete Yet Please Wa`

**OTO2**:
  - `WAIT! Your Order Is Not Complete Yet Please Watch This Impor`
  - `WAIT! Your Order Is Not Complete Yet`
  - `Please Watch This Important Message Below Now`
  - `Please Watch This Important Message Below Now`
  - `1x SmoothSpine™ NMES Massager $49.99 /each SAVE 50%! TOTAL: `

**OTO3**:
  - `IMPORTANT: Do NOT Close This Window Or Click The "Back" Butt`
  - `IMPORTANT: Do NOT Close This Window Or Click The "Back" Butt`
  - `IMPORTANT: Do NOT Close This Window Or Click The "Back" Butt`
  - `IMPORTANT: Do NOT Close This Window Or Click The "Back" Butt`
  - `WAIT {{firstName}}! Your Order Is Not Complete Yet Please Wa`

## SYNTHESIZED UPSELL PAGE DESIGN SYSTEM

### 1. Universal Page Structure (Top to Bottom)

```
1. INTERRUPT HEADER  --  'WAIT!' or 'IMPORTANT: Do NOT Close This Window'
2. COUNTDOWN TIMER   --  7-10 minutes, urgency driver
3. HEADLINE          --  Product-specific offer ('Get [Product] for just $X')
4. PRODUCT IMAGE     --  Hero product shot
5. BENEFIT LIST      --  Checkmarked bullet points
6. VALUE STACK       --  'Regular $X' strikethrough -> 'Today $Y' in green
7. TESTIMONIALS      --  Star ratings + customer quotes
8. GUARANTEE         --  'X-Day Money-Back Guarantee' with shield icon
9. CTA BUTTON        --  'YES! Add to My Order' prominent button
10. OPT-OUT LINK     --  Small muted 'No thanks' at bottom
```

### 2. CTA Button Design Tokens (Per Brand)

```css
/* Vibriance CTA */
.btn-primary {
  background-color: #007bff;
  color: #fff;
  font-size: 20px;
  border-radius: .25rem;
  padding: 6px 20px;
  font-weight: 400;
  letter-spacing: normal;
  font-family: Helvetica, serif;
  cursor: pointer;
}

/* Clarifion CTA (GREEN - most aggressive) */
.btn-primary {
  background-color: #1ab22c;
  color: white;
  font-size: 18px;
  border-radius: 5px;
  padding: 8.8px;
  font-weight: bold;
  letter-spacing: 1px;
  transition: all 600ms cubic-bezier(0, 0.3, 0.7, 1);
}

/* VSL CTA */
.btn-primary {
  background-color: rgb(0, 123, 255);  /* same as #007bff */
  color: rgb(255, 255, 255);
  font-family: Montserrat, sans-serif;
}
```

### 3. Countdown Timer Design Tokens

```css
/* Base timer */
.countdown {
  font-family: Helvetica, serif;
  text-align: center;
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
  font-size: 5rem;  /* When timer ends */
}

/* VSL countdown - more styled */
#ig7bg2 > .countdown-endtext {
  font-family: Montserrat, sans-serif !important;
  font-size: 26px !important;
  font-weight: 700 !important;
  line-height: 40px !important;
}
```

### 4. Price Comparison Design Tokens

```css
/* Strikethrough original price */
.original-price {
  text-decoration: line-through;
  color: #999;
  font-size: 0.9rem;
}

/* Discount badge */
.product-discount {
  display: inline-block;
  background: #10b981;
  color: white;
  border-radius: 4px;
  font-weight: 600;
  margin-bottom: 5px;
}
```

### 5. Interrupt Header Patterns

| Pattern | Brand | Text |
|---------|-------|------|
| Classic | Vibriance OTO1/OTO3 | WAIT! Your order is not complete! |
| Aggressive | VSL OTO1/OTO3 | IMPORTANT: Do NOT Close This Window Or Click The Back Button |
| Soft | Clarifion OTO1/OTO3 | Wait! Please Do Not Close This Page |
| Question | VSL OTO2 | WAIT... Is $98 too much? |

### 6. Opt-Out Copy Patterns

| Pattern | Example |
|---------|---------|
| Fear of loss | 'No thanks, I'll pay full price later' |
| Negative consequence | 'No thanks, I don't want to heal my Sciatica in half the time' |
| Simple decline | 'No thanks, maybe Later...' |
| Guilt-based | 'No thank you... I'm declining this offer. I fully understand...' |

### 7. Guarantee Copy Patterns

| Brand | Duration | Type | Copy |
|-------|----------|------|------|
| Vibriance | 1 year | Bottom of bottle | 'All orders are protected by a 1 year bottom of the bottle guarantee' |
| VSL OTO1 | 180 days | Money-back | '100% Satisfaction 180-Day Money-Back Guarantee' |
| VSL OTO3 | 90 days | Money-back | '100% Satisfaction 90-Day Money-Back Guarantee' |

### 8. OTO Progression Rules

1. **Timer durations decrease**: VSL uses 10+9+29 min (OTO1) -> 7 min (OTO2) -> 9+29 min (OTO3)
2. **Interrupt intensity varies**: OTO1 has strongest interrupt, later OTOs may skip it
3. **Price anchoring**: Higher OTOs show bigger savings percentages
4. **CTA text evolves**: 'Confirm upgrade' -> 'Add to order' -> 'Protect my order' (Vibriance)
5. **Opt-out guilt increases**: Later OTOs have longer, more guilt-inducing opt-out text
6. **File size stays similar**: All OTOs in a funnel use the same builder template, just different content

### 9. VSL-Specific Package Selector CSS

```css
/* Product package cards */
.box {
  border: 3px solid rgb(236, 236, 236);
  border-radius: 12px;
  background-color: white;
  max-width: 373px;
  transition: 0.65s;
}

/* Selected state */
.selected-label {
  border: 3px solid rgb(1, 105, 156) !important;
}

/* Hover state */
.box:hover {
  background-color: rgb(255, 255, 204) !important;
  border-color: rgb(1, 105, 156) !important;
}
```
