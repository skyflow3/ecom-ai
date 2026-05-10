"""Fix testimonial markers in checkout-clarifion.marked.html"""
import re

with open('templates/checkout-clarifion.marked.html', 'r', encoding='utf-8') as f:
    html = f.read()

changes = []

def replace_first(html, old, new, label):
    if old in html:
        html = html.replace(old, new, 1)
        changes.append(label)
    else:
        changes.append(f'MISS: {label}')
    return html

# === DESKTOP ===

# 1. Fix testimonial_2_name trailing "G." (desktop)
html = replace_first(html,
    '{{testimonial_2_name}}                                    G.</span>',
    '{{testimonial_2_name}}</span>',
    'Desktop: fix testimonial_2_name trailing G.')

# 2. Desktop testimonial_2 headline
html = replace_first(html,
    '>Excellence product.\n                                            </p>',
    '>{{testimonial_2_headline}}</p>',
    'Desktop: testimonial_2_headline')

# 3. Desktop testimonial_2 text - try smart quote then straight
old_t2 = "I\u2019m an older\n                                                    guy and don\u2019t usually mess w/ this kinda stuff but my daughter swore\n                                                    by it so figured why not. plugged it in...and way less dust! THANKS!"
old_t2_plain = old_t2.replace('\u2019', "'")
if old_t2 in html:
    html = html.replace(old_t2, '{{testimonial_2_text}}', 1)
    changes.append('Desktop: testimonial_2 text')
elif old_t2_plain in html:
    html = html.replace(old_t2_plain, '{{testimonial_2_text}}', 1)
    changes.append('Desktop: testimonial_2 text (plain)')
else:
    changes.append('MISS: Desktop testimonial_2 text')

# 4. Desktop testimonial_3 headline (first occurrence)
html = replace_first(html,
    '>This easily cleans my dusty home.\n                                            </p>',
    '>{{testimonial_3_headline}}</p>',
    'Desktop: testimonial_3_headline')

# 5. Fix misplaced {{testimonial_2_text}} -> {{testimonial_3_text}}
html = replace_first(html,
    '{{testimonial_2_text}}</p>',
    '{{testimonial_3_text}}</p>',
    'Fix: testimonial_2_text -> testimonial_3_text')

# === MOBILE ===

# 6. Mobile testimonial_1 name (Dorothy P.)
html = replace_first(html,
    '>Dorothy P.\n                                                        </span>',
    '>{{testimonial_1_name}}</span>',
    'Mobile: testimonial_1_name')

# 7. Mobile testimonial_1 headline
html = replace_first(html,
    '>I got the 9x family bundle and I\n                                                    LOVE THEM!!\n                                                </p>',
    '>{{testimonial_1_headline}}</p>',
    'Mobile: testimonial_1_headline')

# 8. Mobile testimonial_1 text (contains product_name marker)
old_m1 = "I live in\n                                                        a smaller home and have grandkids over every week. One of them\n                                                        has allergies, so I wanted to try something that might help. I\n                                                        plugged in the {{product_name}} devices to my living room, bedrooms,\n                                                        and bathrooms. and wouldn\u2019t you know! Less sneezing, less dust!\n                                                        It\u2019s quiet, no filter nonsense, and it just works."
old_m1_plain = old_m1.replace('\u2019', "'")
if old_m1 in html:
    html = html.replace(old_m1, '{{testimonial_1_text}}', 1)
    changes.append('Mobile: testimonial_1 text')
elif old_m1_plain in html:
    html = html.replace(old_m1_plain, '{{testimonial_1_text}}', 1)
    changes.append('Mobile: testimonial_1 text (plain)')
else:
    changes.append('MISS: Mobile testimonial_1 text')

# 9. Mobile testimonial_2 name trailing "G."
html = replace_first(html,
    '{{testimonial_2_name}}                                        G.</span>',
    '{{testimonial_2_name}}</span>',
    'Mobile: fix testimonial_2_name trailing G.')

# 10. Mobile testimonial_2 headline
html = replace_first(html,
    '>Excellent product\n                                                </p>',
    '>{{testimonial_2_headline}}</p>',
    'Mobile: testimonial_2_headline')

# 11. Mobile testimonial_2 text
old_m2 = "i\u2019m an older guy and don\u2019t usually mess w/ this kinda stuff but\n                                                        my daughter swore by it so I figured why not. plugged it\n                                                        in...and way less dust! THANKS!"
old_m2_plain = old_m2.replace('\u2019', "'")
if old_m2 in html:
    html = html.replace(old_m2, '{{testimonial_2_text}}', 1)
    changes.append('Mobile: testimonial_2 text')
elif old_m2_plain in html:
    html = html.replace(old_m2_plain, '{{testimonial_2_text}}', 1)
    changes.append('Mobile: testimonial_2 text (plain)')
else:
    changes.append('MISS: Mobile testimonial_2 text')

# 12. Mobile testimonial_3 name (Ashley P.)
html = replace_first(html,
    '>Ashley\n                                                            P.</span>',
    '>{{testimonial_3_name}}</span>',
    'Mobile: testimonial_3_name')

# 13. Mobile testimonial_3 headline (second occurrence)
html = replace_first(html,
    '>This easily cleans my dusty home.\n                                                </p>',
    '>{{testimonial_3_headline}}</p>',
    'Mobile: testimonial_3_headline')

# 14. Mobile testimonial_3 text
old_m3 = "our house\n                                                        ALWAYS picks up dust easily. But I got this lil plug in thing to\n                                                        try and honestly? shocked. not saying it\u2019s magic but it\u2019s def\n                                                        doing something. ended up getting the 6 of them so now every\n                                                        room has one. soooo glad i did."
old_m3_plain = old_m3.replace('\u2019', "'")
if old_m3 in html:
    html = html.replace(old_m3, '{{testimonial_3_text}}', 1)
    changes.append('Mobile: testimonial_3 text')
elif old_m3_plain in html:
    html = html.replace(old_m3_plain, '{{testimonial_3_text}}', 1)
    changes.append('Mobile: testimonial_3 text (plain)')
else:
    changes.append('MISS: Mobile testimonial_3 text')

# Write back
with open('templates/checkout-clarifion.marked.html', 'w', encoding='utf-8') as f:
    f.write(html)

print(f'Changes: {len(changes)}')
for c in changes:
    print(f'  {c}')

# Verify
markers = re.findall(r'\{\{testimonial_\d+_\w+\}\}', html)
unique = sorted(set(markers))
print(f'\nFinal testimonial markers:')
for m in unique:
    print(f'  {m}: {markers.count(m)}x')

# Check remaining hardcoded
for name in ['Ashley', 'Dorothy', 'Clinton', 'Excellence product', 'older guy', 'dusty home']:
    count = html.count(name)
    if count > 0:
        print(f'Remaining "{name}": {count}')
