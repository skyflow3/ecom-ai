"""Fix product-page-tryemsense.marked.html — add missing markers for ALL product-specific text."""
import re, sys
sys.stdout.reconfigure(encoding='utf-8')

with open('C:/Users/Admin/ECOM-AI/templates/product-page-tryemsense.marked.html', 'r', encoding='utf-8') as f:
    html = f.read()

def replace_text(html, old, slot, label=''):
    """Replace exact text with marker. Returns html and count."""
    if old in html:
        html = html.replace(old, '{{' + slot + '}}')
        print(f'  [OK] {label or slot}')
        return html, 1
    else:
        print(f'  [MISSING] {label or slot}: {old[:60]}...')
        return html, 0

def replace_range(html, start_text, end_text, slot, label=''):
    """Replace text from start_text to end_text (inclusive) with marker."""
    idx_s = html.find(start_text)
    if idx_s == -1:
        print(f'  [MISSING RANGE] {label or slot}: start not found')
        return html, 0
    idx_e = html.find(end_text, idx_s)
    if idx_e == -1:
        print(f'  [MISSING RANGE] {label or slot}: end not found')
        return html, 0
    idx_e += len(end_text)
    old = html[idx_s:idx_e]
    html = html[:idx_s] + '{{' + slot + '}}' + html[idx_e:]
    print(f'  [OK RANGE] {label or slot} ({len(old)} chars replaced)')
    return html, 1

total = 0

# ─── TRUST BADGES (under hero CTA) ────────────────────────────────────────────
# These are trust badge icons + text that are specific to the product
html, n = replace_text(html, '30-day money back', 'trust_badge_1_title', 'trust_badge_1_title')
total += n
html, n = replace_range(html,
    "We\u2019re so confident EmSense will help you, we\u2019re giving you 30 full days to try it out.",
    "try it out.",
    'trust_badge_1_desc', 'trust_badge_1_desc')
total += n

html, n = replace_text(html, 'Free shipping', 'trust_badge_2_title', 'trust_badge_2_title')
total += n
html, n = replace_text(html,
    'Order today and we will handle &amp; send your package completely free of charge!',
    'trust_badge_2_desc', 'trust_badge_2_desc')
total += n

html, n = replace_text(html, 'High quality guarantee', 'trust_badge_3_title', 'trust_badge_3_title')
total += n
html, n = replace_text(html,
    'Made from durable, high quality materials, this device is created to last for years.',
    'trust_badge_3_desc', 'trust_badge_3_desc')
total += n

# ─── HIW SECTION HEADING ──────────────────────────────────────────────────────
html, n = replace_text(html, 'One Device That Does It All - Here\u2019s How:', 'hiw_heading', 'hiw_heading')
total += n

# ─── HIW FEATURE CARDS (4 cards with title + description) ─────────────────────
# Card 1
html, n = replace_text(html, 'Promotes better blood flow', 'hiw_card_1_title', 'hiw_card_1_title')
total += n
html, n = replace_range(html,
    'Targeted red light wavelengths penetrate the surface of the skin',
    'promoting more efficient blood flow.*',
    'hiw_card_1_desc', 'hiw_card_1_desc')
total += n

# Card 2
html, n = replace_text(html, 'Supports pain relief', 'hiw_card_2_title', 'hiw_card_2_title')
total += n
html, n = replace_range(html,
    'Different massage intensity levels help relieve pain',
    'neuropathy in the feet.*',
    'hiw_card_2_desc', 'hiw_card_2_desc')
total += n

# Card 3
html, n = replace_text(html, 'Helps reduce swelling', 'hiw_card_3_title', 'hiw_card_3_title')
total += n
html, n = replace_range(html,
    '100% Natural helps reduce swelling in the feet',
    'healing of damaged nerves.*',
    'hiw_card_3_desc', 'hiw_card_3_desc')
total += n

# Card 4
html, n = replace_text(html, 'Easy to use at home', 'hiw_card_4_title', 'hiw_card_4_title')
total += n
html, n = replace_range(html,
    'No side effects, no complicated routines.',
    'neuropathy symptoms fade.',
    'hiw_card_4_desc', 'hiw_card_4_desc')
total += n

# ─── PROBLEM SECTION DESCRIPTION ──────────────────────────────────────────────
# This is a long educational paragraph about the root cause
html, n = replace_range(html,
    'Your nerves need oxygen to function properly',
    'much-needed oxygen.*',
    'problem_description', 'problem_description')
total += n

# ─── PROBLEM STATS (PureCounter numbers) ──────────────────────────────────────
# These are the percentage stats: "people aged 40+ report occasional foot pain"
html, n = replace_text(html,
    'people aged 40+ report occasional foot pain*',
    'problem_stat_1_desc', 'problem_stat_1_desc')
total += n
html, n = replace_text(html,
    'say their everyday life is affected due to foot pain.*',
    'problem_stat_2_desc', 'problem_stat_2_desc')
total += n
html, n = replace_text(html,
    'rely on painkillers to reduce foot pain.*',
    'problem_stat_3_desc', 'problem_stat_3_desc')
total += n
html, n = replace_text(html,
    'noticed negative mood changes due to constant pain.*',
    'problem_stat_4_desc', 'problem_stat_4_desc')
total += n

# ─── SALE BANNER ──────────────────────────────────────────────────────────────
html, n = replace_text(html,
    'Limited Time Promo: 70% OFF for uk residents',
    'sale_banner_uk_text', 'sale_banner_uk_text')
total += n
html, n = replace_text(html,
    "Congratulations! You\u2019ve Pre-Qualified For a",
    'sale_prequal_text', 'sale_prequal_text')
total += n

# ─── STEP 3 DESC ──────────────────────────────────────────────────────────────
# The step_3_desc wasn't captured earlier
html, n = replace_range(html,
    "That\u2019s it! In just minutes, you\u2019ll feel soothing warmth",
    "reduce discomfort.*",
    'step_3_desc', 'step_3_desc')
total += n

# ─── WRITE OUTPUT ─────────────────────────────────────────────────────────────
with open('C:/Users/Admin/ECOM-AI/templates/product-page-tryemsense.marked.html', 'w', encoding='utf-8') as f:
    f.write(html)

# Count final markers
markers = re.findall(r'\{\{(\w+)\}\}', html)
unique_markers = sorted(set(markers))
print(f'\nTotal new replacements: {total}')
print(f'Total marker instances: {len(markers)}')
print(f'Unique markers: {len(unique_markers)}')
