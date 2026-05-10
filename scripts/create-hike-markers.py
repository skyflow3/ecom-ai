"""
Purpose: Generate hike-reasons-why.marked.html from hike-reasons-why.html
         by replacing product-specific text with {{SLOT}} markers.
Run: python scripts/create-hike-markers.py
"""
import re
import sys
from pathlib import Path

TEMPLATE_PATH = Path(__file__).parent.parent / "templates" / "hike-reasons-why.html"
OUTPUT_PATH = Path(__file__).parent.parent / "templates" / "hike-reasons-why.marked.html"

with open(TEMPLATE_PATH, 'r', encoding='utf-8') as f:
    content = f.read()

# ═══════════════════════════════════════════════════════════════
# REPLACEMENTS — ORDER MATTERS (specific/long first, generic last)
# ═══════════════════════════════════════════════════════════════

replacements = []

def add(old, new, desc=""):
    replacements.append((old, new, desc))

# ─── HERO SECTION ─────────────────────────────────────────────
add(
    '<strong class="">FOOT</strong>-<strong class="">INSIDER</strong>',
    '<strong class="">{{nav_brand_bold}}</strong>-<strong class="">{{nav_brand_span}}</strong>',
    "Nav brand"
)

add(
    '<strong class="bold-text-1781">I Tried 7 Different &quot;Comfort&quot; Shoes. </strong><span class="text-span-164"><strong class="publisher">Only One Actually Worked.</strong></span>',
    '<strong class="bold-text-1781">{{hero_headline_bold}} </strong><span class="text-span-164"><strong class="publisher">{{hero_headline_span}}</strong></span>',
    "Hero headline"
)

# Hero intro paragraph — the full <p> tag content
add(
    'Let me save you the time and money I wasted. <br><br>Over the past 3 years, I\'ve tried $180 Brooks running shoes, <strong class="">$220 custom orthotics</strong>, $95 memory foam sneakers, those ugly Sketchers my mom recommended, two different &quot;orthopedic&quot; brands, some $40 Amazon shoes with 5-star reviews, and finally, these barefoot shoes everyone kept talking about.<br><br>\u200d<strong class="">Six failures. One winner.</strong> Here\'s the difference. And what I wish someone had told me before I spent $900.',
    '{{hero_intro}}',
    "Hero intro"
)

# Callout box text
add(
    'Read this BEFORE you spend another dollar on &quot;comfort shoes&quot;',
    '{{callout_text}}',
    "Callout text"
)

# Author name (appears in byline)
add('Athena Hudson', '{{author_name}}', "Author name")

# Author title
add('Barefoot Shoe Enthusiast', '{{author_title}}', "Author title")

# ─── COMPARISON TABLE ─────────────────────────────────────────
# Row categories
add('Time to Put On', '{{compare_row_1_label}}', "Compare row 1 label")
add('Shift Comfort', '{{compare_row_2_label}}', "Compare row 2 label")
add('Weight', '{{compare_row_3_label}}', "Compare row 3 label")
add('Price', '{{compare_row_4_label}}', "Compare row 4 label (bold)")

# Product column values
add('10 seconds', '{{compare_row_1_product}}', "Compare row 1 product")
add('hands-free', '{{compare_row_1_product_sub}}', "Compare row 1 product sub")
add('Natural alignment', '{{compare_row_2_product}}', "Compare row 2 product")
add('Under 6 oz', '{{compare_row_3_product}}', "Compare row 3 product")
add('ultra-light', '{{compare_row_3_product_sub}}', "Compare row 3 product sub")
add('$59.95', '{{compare_row_4_product}}', "Compare row 4 product")
add('/pair', '{{compare_row_4_product_sub}}', "Compare row 4 product sub")
add('(3-pack deal)', '{{compare_row_4_product_note}}', "Compare row 4 product note")

# Competitor 1 column
add('<strong class="">Nursing Clogs</strong>', '<strong class="">{{compare_comp1_name}}</strong>', "Competitor 1 name")
add('30-60 seconds', '{{compare_row_1_comp1}}', "Compare row 1 comp1")
add('Rigid foot bed', '{{compare_row_2_comp1}}', "Compare row 2 comp1")
add('14-16 oz', '{{compare_row_3_comp1}}', "Compare row 3 comp1")
add('$120-$160', '{{compare_row_4_comp1}}', "Compare row 4 comp1")

# Competitor 2 column
add('<strong class="">Athletic Sneakers</strong>', '<strong class="">{{compare_comp2_name}}</strong>', "Competitor 2 name")
add('1-2 minutes', '{{compare_row_1_comp2}}', "Compare row 1 comp2")
add('Cushioned heel', '{{compare_row_2_comp2}}', "Compare row 2 comp2")
add('10-12 oz', '{{compare_row_3_comp2}}', "Compare row 3 comp2")

# TLDR
add(
    '<strong class="">TLDR: HF Stride barefoot shoes have 10+ benefits that make 12-hour shifts feel like 6 \ud83d\udc47</strong>',
    '<strong class="">{{compare_tldr}}</strong>',
    "TLDR text"
)

# ─── 10 REASON BLOCKS ─────────────────────────────────────────
# Reason 1
add(
    '<strong class="bold-text-1782">I Could Actually Put Them On</strong>',
    '<strong class="bold-text-1782">{{reason_1_heading}}</strong>',
    "Reason 1 heading"
)
add(
    'This sounds small, but bending down to tie shoes was agony for my back. These? Just step in. <strong class="">No bending, no laces, no struggle.<br><br></strong>The first time I put them on, I actually laughed. Why didn\'t anyone think of this sooner?',
    '{{reason_1_body}}',
    "Reason 1 body"
)
add(
    '<strong class="bold-text-1842">See the slip-on shoe I swear by</strong>',
    '<strong class="bold-text-1842">{{reason_1_cta}}</strong>',
    "Reason 1 CTA"
)

# Reason 2
add(
    '<strong class="">Comfortable All Day Without Foot Pain</strong>',
    '<strong class="">{{reason_2_heading}}</strong>',
    "Reason 2 heading (mobile)"
)
add(
    'Usually by noon my feet were screaming. I\'d find excuses to sit down. With these, I\'d look at the clock and realize I\'d been on my feet for hours. <strong class="">No pain. No fatigue.<br><br>\u200d</strong>The <strong class="">zero-drop sole</strong> supports proper alignment, while the flexible design lets your feet move naturally. That reduces pressure on your <strong class="">knees, hips, and lower back.</strong>',
    '{{reason_2_body}}',
    "Reason 2 body"
)
add(
    '<strong class="bold-text-1842">See the exact shoe that ended my foot pain</strong>',
    '<strong class="bold-text-1842">{{reason_2_cta}}</strong>',
    "Reason 2 CTA"
)

# Reason 3
add(
    '<strong class="">My Feet Felt Steadier, Not Just More Comfortable</strong>',
    '<strong class="">{{reason_3_heading}}</strong>',
    "Reason 3 heading"
)
add(
    'I used to feel wobbly on wet floors. Uneven sidewalks. That nervous half-second stepping off a curb. I\'d grab handrails I didn\'t used to need.<br><br>These have a <strong class="">flexible, grippy sole</strong> that actually lets your feet feel the ground. It\'s the reason kids don\'t fall the way adults do. Their shoes don\'t block the signal between their feet and their brain.Within a week I stopped reaching for the railing.',
    '{{reason_3_body}}',
    "Reason 3 body"
)
add(
    '<strong class="bold-text-1842">See the grip pattern</strong>',
    '<strong class="bold-text-1842">{{reason_3_cta}}</strong>',
    "Reason 3 CTA"
)

# Reason 4
add(
    '<strong class="">My Bunions Finally Had Room</strong>',
    '<strong class="">{{reason_4_heading}}</strong>',
    "Reason 4 heading"
)
add(
    'Tired of squeezing your feet into tight, narrow shoes? The <strong class="">wide toe box</strong> lets your toes spread naturally. No more pinching. No more throbbing by the end of the day.<br><br>First time in years my feet didn\'t feel squeezed. Bunions, hammer toes, wide feet. Every pair of shoes used to be a negotiation. This one ends it.',
    '{{reason_4_body}}',
    "Reason 4 body"
)

# Reason 5
add(
    '<strong class="">I Stopped Counting Hours Until I Could Sit Down</strong>',
    '<strong class="">{{reason_5_heading}}</strong>',
    "Reason 5 heading"
)
add(
    'For years my whole day was about feet. <em class="">How long until I can sit down. How far is the parking spot.<br><br>\u200d</em>Then one Tuesday I looked at the clock. 4pm. I\'d been on my feet since breakfast. <strong class="">I hadn\'t counted once.</strong> That\'s the whole test. These are the shoes that end the counting.',
    '{{reason_5_body}}',
    "Reason 5 body"
)

# Reason 6
add(
    '6. Arthritis Stiffness Finally Had A Shoe That Didn\'t Fight Back',
    '6. {{reason_6_heading}}',
    "Reason 6 heading (mobile)"
)
add(
    '6. Arthritis Stiffness Finally Had A Shoe That Didn\'t Fight Back',
    '6. {{reason_6_heading}}',
    "Reason 6 heading (desktop)"
)
add(
    'My rheumatologist told me years ago: <strong class="">the stiffer the shoe, the harder your joints work</strong>. Every &quot;supportive&quot; shoe I\'d bought was stiff as a board.<br><br>These are the opposite. The <strong class="">flexible, zero-drop sole</strong> lets your feet move through their natural range, which means your knees and hips don\'t compensate for what your feet can\'t do. Morning stiffness still exists. But I\'m not adding to it with my shoes.',
    '{{reason_6_body}}',
    "Reason 6 body"
)

# Reason 7
add(
    '<strong class="">Lighter Than Any Other Shoe</strong>',
    '<strong class="">{{reason_7_heading}}</strong>',
    "Reason 7 heading"
)
add(
    'My old &quot;comfort&quot; shoes felt like bricks. By evening, my whole legs were tired. These are <strong class="">under 6 oz</strong>. I didn\'t believe the number until I wore them for a full day.<br><br>My legs actually had energy left by dinner. I walked the dog twice without thinking about it.',
    '{{reason_7_body}}',
    "Reason 7 body"
)

# Reason 8
add(
    '<strong class="">My Feet Stayed Cool Without Me Noticing</strong>',
    '<strong class="">{{reason_8_heading_mobile}}</strong>',
    "Reason 8 heading (mobile)"
)
add(
    '8. Breathable For All-Day Freshness',
    '8. {{reason_8_heading_desktop}}',
    "Reason 8 heading (desktop)"
)
add(
    'Sweaty feet were my embarrassing secret. By midday, I\'d be self-conscious. I\'d kick my shoes off under my desk and hope nobody walked by.<br><br>The <strong class="">breathable mesh</strong> with ventilation holes keeps your feet cool and dry. No more damp, uncomfortable feet by lunch.',
    '{{reason_8_body}}',
    "Reason 8 body"
)

# Reason 9
add(
    '9. A Podiatrist Actually Recommends Them',
    '9. {{reason_9_heading}}',
    "Reason 9 heading"
)
add(
    '9. &nbsp;A Podiatrist Actually Recommends Them',
    '9. &nbsp;{{reason_9_heading}}',
    "Reason 9 heading (desktop variant)"
)
add(
    'Not a paid celebrity. Not a wellness influencer. A board-certified foot doctor who sees patients every day for <strong class="">arthritis, neuropathy, plantar fasciitis, and balance issues</strong>.<br><br>She recommends these specifically for patients who\'ve tried everything else. That\'s the kind of endorsement I trust.',
    '{{reason_9_body}}',
    "Reason 9 body"
)

# Reason 10
add(
    '10. The Best Shoe I\'ve Owned Cost Less Than The Worst',
    '10. {{reason_10_heading}}',
    "Reason 10 heading"
)
add(
    'I spent <strong class="">over $900</strong> on shoes that didn\'t help. Custom orthotics: $220, didn\'t work. Brooks: $180, didn\'t work. &quot;Orthopedic&quot; shoes: $150, didn\'t work.<br><br>These cost <strong class="">$59.95 in the 3-pack</strong>. The only ones that actually worked.Expensive isn\'t the same as right.',
    '{{reason_10_body}}',
    "Reason 10 body"
)

# ─── MID-ARTICLE CTA ──────────────────────────────────────────
add(
    '<span class="span-red">UP TO 49% OFF</span> FOR A LIMITED TIME ONLY!',
    '<span class="span-red">UP TO {{product_discount_pct}} OFF</span> {{mid_cta_heading}}',
    "Mid CTA heading"
)
add(
    'I was skeptical too. But true to size, free shipping, and a 30-day money-back guarantee means there\'s nothing to lose.',
    '{{mid_cta_subtitle}}',
    "Mid CTA subtitle"
)
add(
    'TRY THEM RISK-FREE',
    '{{mid_cta_button}}',
    "Mid CTA button"
)
add(
    '30 days to try them. If they\'re not right, send them back. No restocking fee, no hassle.',
    '{{mid_cta_guarantee}}',
    "Mid CTA guarantee"
)
add(
    '<strong class="bold-text-1813 _2">mother\'s day sale</strong>',
    '<strong class="bold-text-1813 _2">{{sale_badge_text}}</strong>',
    "Sale badge"
)

# ─── SIDEBAR CTA ──────────────────────────────────────────────
add(
    'DEAL OF dAY - Limited Time',
    '{{sidebar_deal_text}}',
    "Sidebar deal text"
)
add(
    'Click The Button Below to claim your 50% discount',
    '{{sidebar_benefit_1}}',
    "Sidebar benefit 1"
)
add(
    'Enjoy 30-Day Money Back Guarantee',
    '{{sidebar_benefit_2}}',
    "Sidebar benefit 2"
)
add(
    'Experience the barefoot feel. It\u2019s that simple',
    '{{sidebar_benefit_3}}',
    "Sidebar benefit 3"
)
add(
    '<div id="cta_text" class="">Order now</div>',
    '<div id="cta_text" class="">{{sidebar_button}}</div>',
    "Sidebar button"
)
add(
    'Sell-Out Risk: <span class="text-span-6">High</span>',
    'Sell-Out Risk: <span class="text-span-6">{{sidebar_sellout_risk}}</span>',
    "Sell-out risk"
)
add(
    '<span class="text-span-7">FREE</span> shipping',
    '<span class="text-span-7">FREE</span> {{sidebar_shipping_text}}',
    "Shipping text"
)

# ─── LOWEST PRICE BAR ─────────────────────────────────────────
add(
    'Verified Lowest Price of the Year. Shop Now!',
    '{{lowest_price_text}}',
    "Lowest price text"
)

# ═══════════════════════════════════════════════════════════════
# APPLY REPLACEMENTS
# ═══════════════════════════════════════════════════════════════

success = 0
failed = 0

for old, new, desc in replacements:
    count = content.count(old)
    if count > 0:
        content = content.replace(old, new)
        success += 1
        print(f'  OK: {desc} ({count}x)')
    else:
        failed += 1
        print(f'  MISS: {desc}')

print(f'\nResults: {success} applied, {failed} missed')

# Save
with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
    f.write(content)

print(f'Saved: {OUTPUT_PATH}')
print(f'Size: {len(content)} chars')

# Verify markers
import re as re2
markers = re2.findall(r'\{\{(\w+)\}\}', content)
unique_markers = sorted(set(markers))
print(f'\nUnique markers: {len(unique_markers)}')
for m in unique_markers:
    print(f'  {{{{{m}}}}}')
