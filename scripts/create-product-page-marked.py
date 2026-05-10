"""Create product-page-tryemsense.marked.html from original HTML."""
import re, sys
sys.stdout.reconfigure(encoding='utf-8')

with open('C:/Users/Admin/ECOM-AI/templates/product-page-tryemsense.html', 'r', encoding='utf-8') as f:
    html = f.read()

def replace(html, old, slot):
    """Replace text with slot marker."""
    if old in html:
        html = html.replace(old, '{{' + slot + '}}')
    return html

# --- META ---
html = re.sub(r'<title[^>]*>.*?</title>', '<title>{{page_title}}</title>', html)
html = re.sub(r'content="EMSense is a powerful massager[^"]*"', 'content="{{meta_description}}"', html)

# --- SALE BANNER ---
html = replace(html, '60% Discount', 'sale_discount_text')
html = replace(html, "Congratulations! You've Pre-Qualified For a 60% Discount!", 'sale_headline')

# --- HERO ---
html = re.sub(
    r'<h1[^>]*class="[^"]*int-hero-headline[^"]*"[^>]*>.*?</h1>',
    '<h1 class="int-hero-headline">{{hero_headline}}</h1>',
    html, flags=re.DOTALL
)
html = replace(html, "WE'VE GOT A SOLUTION!", 'hero_cta_text')

# Hero benefits
benefits = ['Drug-free pain relief', 'Red Light Heating Therapy',
            'Clinically proven methods', 'Recommended by experts',
            '3 intensity levels', '30-day money-back guarantee']
for i, b in enumerate(benefits, 1):
    html = replace(html, b, f'hero_benefit_{i}')

# --- PROBLEM ---
html = replace(html, 'The Real Cause of Foot Pain &amp; Aches', 'problem_headline')

# --- PRODUCT HEADLINE ---
html = replace(html, 'You Are One Step Closer to Getting Rid of Foot Pain Once and For All*', 'product_headline')

# --- FEATURE HEADINGS ---
features = [
    ('Meet the EMSense "Triple Therapy" Foot Massager', 'feature_1_heading'),
    ('This Massager Also Helps With', 'feature_2_heading'),
    ('Created by Specialists', 'feature_3_heading'),
    ('The Perfect At-Home Therapy', 'feature_4_heading'),
]
for text, slot in features:
    html = replace(html, text, slot)

# --- FEATURE DESCRIPTIONS ---
# Feature 1: long description about Triple Therapy
f1_start = "We've spent years developing this seemingly simple device"
f1_end = "now have all the right tools to repair and heal.*</strong>"
idx1_s = html.find(f1_start)
idx1_e = html.find(f1_end)
if idx1_s != -1 and idx1_e != -1:
    idx1_e += len(f1_end)
    html = html[:idx1_s] + '{{feature_1_description}}' + html[idx1_e:]

# Feature 2 intro
html = replace(html, "Here's a full list of conditions the EMSense massager can help with:", 'feature_2_description')

# Conditions list
conditions = ['Plantar Fasciitis', 'Neuropathy &amp; Numbness', 'Swelling &amp; Inflammation',
              'Poor Circulation', 'Achilles Tendinitis', 'Foot Arthritis',
              'Nerve Pain &amp; Tingling', 'Post-Injury Recovery',
              'Restless Leg Syndrome', 'Post-Surgery Recovery']
for i, c in enumerate(conditions, 1):
    html = replace(html, c, f'condition_{i}')

# Feature 3
f3_start = "Getting an appointment with a podiatrist"
f3_end = "but you can use it every single day."
idx3_s = html.find(f3_start)
idx3_e = html.find(f3_end)
if idx3_s != -1 and idx3_e != -1:
    idx3_e += len(f3_end)
    html = html[:idx3_s] + '{{feature_3_description}}' + html[idx3_e:]

# Feature 4
f4_start = "uses clinically backed methods"
f4_end = "reading, or simply napping."
# find with EMSense prefix
idx4_s = html.find('<strong class="">EMSense</strong> uses clinically backed methods')
if idx4_s != -1:
    idx4_e = html.find(f4_end, idx4_s)
    if idx4_e != -1:
        idx4_e += len(f4_end)
        html = html[:idx4_s] + '{{feature_4_description}}' + html[idx4_e:]

# --- TESTIMONIALS ---
html = replace(html, 'Our Customers Report Significantly Reduced Pain Levels:', 'testimonials_headline')
for name, slot in [('Jennifer L.', 'testimonial_1_name'), ('Charles P.', 'testimonial_2_name'), ('Lauren T.', 'testimonial_3_name')]:
    html = replace(html, name, slot)

# Testimonial texts - find them by their opening words
t1_start = "I been dealing with nerve pain for a while now"
t1_end = "I actually sleep through the night now."
idx = html.find(t1_start)
if idx != -1:
    end = html.find(t1_end, idx)
    if end != -1:
        end += len(t1_end)
        html = html[:idx] + '{{testimonial_1_text}}' + html[end:]

t2_start = "I work on my feet all day"
t2_end = "My wife steals it sometimes too lol"
idx = html.find(t2_start)
if idx != -1:
    end = html.find(t2_end, idx)
    if end != -1:
        end += len(t2_end)
        html = html[:idx] + '{{testimonial_2_text}}' + html[end:]

t3_start = "I got this cuz my doctor said"
t3_end = "will definitely keep using it!!"
idx = html.find(t3_start)
if idx != -1:
    end = html.find(t3_end, idx)
    if end != -1:
        end += len(t3_end)
        html = html[:idx] + '{{testimonial_3_text}}' + html[end:]

# Success rate
html = replace(html, 'Improving Blood Circulation In Your Feet*', 'success_rate_title')
html = replace(html, "84% of customers were satisfied with EMSense's triple technology and found it effective.*", 'success_rate_description')

# --- COMPARISON ---
html = replace(html, 'Ditch Expensive Treatments and Pills, Choose Safer Alternative*', 'comparison_headline')
html = replace(html, "It's non-addictive, works fast, and actually does GOOD things for your body.", 'comparison_subtitle')
html = replace(html, 'EMSense "Triple Therapy" Massager', 'our_product_title')
html = replace(html, 'Conventional Pain Relief Methods', 'their_product_title')

our_benefits = ['100% drug-free and non-invasive*', 'Delivers relief in just minutes*',
                'Recommended by medical experts*', 'Supports long-term nerve health, not just temporary fixes*',
                'Targets burning, tingling, numbness, fatigue*', 'Safe for daily use - no side effects*',
                'Easy to use at home, anytime you need it']
for i, b in enumerate(our_benefits, 1):
    html = replace(html, b, f'our_benefit_{i}')

their_negs = ['Depend on medications that may cause side effects*',
              'Can take hours (or longer) to kick in*',
              'Not always trusted by medical professionals*',
              'Offer short-term relief with repeated use*',
              'Risk of long-term harm with frequent use*',
              'Often inconvenient or require prescriptions*']
for i, n in enumerate(their_negs, 1):
    html = replace(html, n, f'their_negative_{i}')

# --- RESULTS ---
html = replace(html, 'These Results Speak for Themselves', 'results_headline')
for desc, slot in [('experience reduced foot pain*', 'result_stat_1_desc'),
                   ('experience reduced neuropathy symptoms*', 'result_stat_2_desc'),
                   ('can now walk longer distances without discomfort*', 'result_stat_3_desc')]:
    html = replace(html, desc, slot)

# Results subtitle
rsub_start = "Here's what EMSense's powerful technology can help you achieve"
idx = html.find(rsub_start)
if idx != -1:
    end = html.find('</div>', idx)
    if end != -1:
        html = html[:idx] + '{{results_subtitle}}' + html[end:]

# --- DOCTOR ---
html = replace(html, 'Dr. Jessica Thompson', 'doctor_name')
html = replace(html, 'Jessica Thompson', 'doctor_name')
html = replace(html, 'Podiatric Specialist', 'doctor_specialty')

# Doctor quote
dq_start = "I've spent the last 8 years helping patients"
dq_end = "nerve-related foot pain or poor circulation."
idx = html.find(dq_start)
if idx != -1:
    end = html.find(dq_end, idx)
    if end != -1:
        end += len(dq_end)
        html = html[:idx] + '{{doctor_quote}}' + html[end:]

# Doctor meet text
html = re.sub(r'<div class="int-dr-meet">Meet</div>', '<div class="int-dr-meet">{{doctor_meet}}</div>', html)

# --- HOW-TO ---
html = replace(html, '3 Simple Steps For Foot Pain Relief', 'howto_headline')
html = replace(html, 'Simply select the massage intensity and heating level and enjoy pain relief!', 'howto_subtitle')

steps = [
    ('Wrap It Around Your Feet', 'step_1_title',
     'Slide your feet into the massager and fasten the 4 cm adjustable straps for a comfortable fit (fits most sizes).', 'step_1_desc'),
    ('Choose Your Settings', 'step_2_title',
     'Select your preferred massage intensity, heat level, and timer using the simple control panel - each of the three intensity levels is clearly indicated by a different color.', 'step_2_desc'),
    ('Sit Back and Relax', 'step_3_title',
     "That's it! In just minutes, you'll feel soothing warmth, massaging pulses, and light compression working together to reduce discomfort.*", 'step_3_desc'),
]
for title, tslot, desc, dslot in steps:
    html = replace(html, title, tslot)
    html = replace(html, desc, dslot)

# --- REVIEWS ---
html = replace(html, 'See What Others Are Saying About Our Massager', 'reviews_subtitle')
html = replace(html, 'Thousands Of Happy Users', 'reviews_headline')

review_names = [('Michael R.', 'review_1_name'), ('Rachel D.', 'review_2_name'), ('Linda S.', 'review_3_name')]
review_titles = [('"Working great for both my elbows and ankles"', 'review_1_title'),
                 ('"It\'s helping where nothing else has"', 'review_2_title'),
                 ('"I can wake up not drugged by opiates"', 'review_3_title')]
for name, slot in review_names:
    html = replace(html, name, slot)
for title, slot in review_titles:
    html = replace(html, title, slot)

# Review texts
rv1_start = "Working great for both my elbows and my ankles"
rv1_end = "years of working in home improvements."
idx = html.find(rv1_start)
if idx != -1:
    end = html.find(rv1_end, idx)
    if end != -1:
        end += len(rv1_end)
        html = html[:idx] + '{{review_1_text}}' + html[end:]

rv2_start = "They have eased the numbness in my feet"
rv2_end = "Best wishes"
idx = html.find(rv2_start)
if idx != -1:
    end = html.find(rv2_end, idx)
    if end != -1:
        end += len(rv2_end)
        html = html[:idx] + '{{review_2_text}}' + html[end:]

rv3_start = "The shooting (burning coal) pains"
rv3_end = "I Thank You very much."
idx = html.find(rv3_start)
if idx != -1:
    end = html.find(rv3_end, idx)
    if end != -1:
        end += len(rv3_end)
        html = html[:idx] + '{{review_3_text}}' + html[end:]

# --- GUARANTEE ---
html = replace(html, '30-Day Money-Back Guarantee', 'guarantee_title')
html = replace(html, 'We put our money where our mouth is.', 'guarantee_subtitle')
html = replace(html, "If you're unhappy with EMSense, you're eligible for a 100% refund within 30 days.", 'guarantee_description')

# --- FAQ ---
html = replace(html, "Read Our Customers' Frequently Asked Questions", 'faq_headline')

faqs = [
    ('How often should I use the EMSense massager?', 'faq_q1',
     "For best results, we recommend using EMSense daily for 15\u201330 minutes. It\u2019s safe for regular use and can be easily incorporated into your morning or evening routine.", 'faq_a1'),
    ('Is it safe for people with diabetes or neuropathy?', 'faq_q2',
     "Yes! EMSense was specifically designed with conditions like diabetic neuropathy in mind. However, we always suggest consulting your healthcare provider before starting any new therapy if you have a medical condition.", 'faq_a2'),
    ('Does it fit all foot sizes?', 'faq_q3',
     "EMSense is made with an adjustable wrap design that comfortably fits most foot sizes, including both men and women. The flexible straps ensure a secure and personalized fit.", 'faq_a3'),
    ('Can I use it while standing or walking?', 'faq_q4',
     "No, EMSense is intended for use while sitting or reclining. For safety and effectiveness, always remain seated and relaxed during your session.", 'faq_a4'),
    ('How long does it take to feel relief?', 'faq_q5',
     "Many users report noticeable relief after just one session, especially from burning, tingling, or numbness. Consistent use over time can lead to longer-lasting improvement in circulation and nerve comfort.", 'faq_a5'),
]
for q, qslot, a, aslot in faqs:
    html = replace(html, q, qslot)
    html = replace(html, a, aslot)

# --- CTA TEXTS ---
html = replace(html, 'GET 60% OFF TODAY ONLY!', 'cta_text')
html = replace(html, 'ORDER&nbsp;NOW!', 'sticky_cta_text')

# --- URGENCY ---
html = replace(html, 'Get 60% OFF Discount', 'discount_urgency_text')
html = replace(html, 'if you order now. Better hurry -- stock is running out!', 'stock_urgency_text')
html = replace(html, 'Current stock level:', 'stock_level_text')
html = re.sub(r'>LOW<', '>{{stock_level}}<', html)

# --- RATING NUMBERS ---
html = re.sub(r'>4\.9<', '>{{review_score}}<', html)
html = replace(html, '1,257+', 'review_count')
html = replace(html, '1,257\\+ Reviews', 'review_count\\+ Reviews')
html = replace(html, '1,257+ Reviews', '{{review_count}}+ Reviews')
# Fix remaining review count instances
html = re.sub(r'(\{\{review_count\}\})\+ Reviews', r'\1+ Reviews', html)
html = re.sub(r'>1,257', '>{{review_count}}', html)

# --- STATS PERCENTAGES ---
# These are used in PureCounter configs AND display - need careful handling
# Stats are in p1-p4 (product) and r1-r3 (results) counters
# Leave PureCounter numbers as-is (they're JS config, not display)
# Only replace the visible stat numbers in the results section
# 68%, 52%, 84% are the result stats
for val, slot in [('68', 'result_stat_1_pct'), ('52', 'result_stat_2_pct'), ('84', 'result_stat_3_pct')]:
    # Only replace in the results display area, not in PureCounter config
    pass  # These are tricky - leave for now, handle in display area

# --- SUCCESS RATE percentage ---
# 84% Success Rate -> already handled by success_rate_pct
# The "84%" in the success rate section
html = replace(html, '84% Success Rate', '{{success_rate_pct}}% Success Rate')

# --- FOOTER DISCLAIMER ---
html = replace(html, 'EMSense. All rights reserved.', '{{copyright_text}}')

# --- Write output ---
with open('C:/Users/Admin/ECOM-AI/templates/product-page-tryemsense.marked.html', 'w', encoding='utf-8') as f:
    f.write(html)

# Count markers
markers = re.findall(r'\{\{(\w+)\}\}', html)
unique_markers = sorted(set(markers))
print(f'Total marker instances: {len(markers)}')
print(f'Unique markers: {len(unique_markers)}')
print('\nAll unique markers:')
for m in unique_markers:
    count = markers.count(m)
    suffix = f' (x{count})' if count > 1 else ''
    print(f'  - {m}{suffix}')
