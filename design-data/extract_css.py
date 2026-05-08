"""
Extract detailed section structure and CSS from all advertorial HTML files.
"""
import re, json
from pathlib import Path
from collections import defaultdict

FILES = [
    ("smoothspire", r"C:\Users\Admin\Downloads\SITES\htlm-pages\advertorial-smoothspire.html"),
    ("vibriance", r"C:\Users\Admin\Downloads\SITES\htlm-pages\advertorial vibriance.html"),
    ("rejuvacare", r"C:\Users\Admin\Downloads\SITES\htlm-pages\advertorial-rejuvacare.html"),
    ("allfemale", r"C:\Users\Admin\Downloads\SITES\htlm-pages\advertorial-reason-why-allfemale.html"),
    ("tryemsense-7m", r"C:\Users\Admin\Downloads\SITES\htlm-pages\advertorial-7m-tryemsense.html"),
    ("tryemsense-2-7m", r"C:\Users\Admin\Downloads\SITES\htlm-pages\advertorial-2-7m-tryemsense.html"),
    ("drivse", r"C:\Users\Admin\Downloads\SITES\htlm-pages\advertorial-drivse-reason-why.html"),
    ("rejuvera", r"C:\Users\Admin\Downloads\SITES\htlm-pages\advertorial-reason-why-rejuvera.html"),
    ("oricle", r"C:\Users\Admin\Downloads\SITES\htlm-pages\advertorial-reason-why-oricle.html"),
    ("particulemen", r"C:\Users\Admin\Downloads\SITES\htlm-pages\advertorial-particulemen.html"),
    ("clarifion", r"C:\Users\Admin\Downloads\SITES\htlm-pages\advertorial-clarifion.html"),
    ("tryledisa-11m", r"C:\Users\Admin\Downloads\SITES\htlm-pages\advertorial-tryledisa-11m.html"),
    ("tryledisa-anglais", r"C:\Users\Admin\Downloads\SITES\htlm-pages\advertorial-anglais tryledisa.html"),
    ("tryemsense-adv1", r"C:\Users\Admin\Downloads\SITES\7m tryemsense\html\7m tryemsense advertorial.html"),
    ("tryemsense-adv2", r"C:\Users\Admin\Downloads\SITES\7m tryemsense\html\7m tryemsense advertorial 2.html"),
    ("tryemsense-adv3", r"C:\Users\Admin\Downloads\SITES\7m tryemsense\html\7m tryemsense advertorial 3.html"),
    ("halogrow-germany", r"C:\Users\Admin\Downloads\SITES\4M tryhalogrow.com\sites\advertorial-germany.html"),
    ("halogrow-anglais", r"C:\Users\Admin\Downloads\SITES\4M tryhalogrow.com\sites\advertorial-anglais tryledisa.html"),
]


def extract_css_properties(css_text):
    props = {}

    # Colors
    colors = set(re.findall(
        r'(?:color|background-color|border-color):\s*([#][0-9a-fA-F]{3,8}|rgba?\([^)]+\))',
        css_text, re.IGNORECASE
    ))
    props["colors"] = sorted(list(colors))

    # Font families
    fonts = re.findall(r'font-family:\s*([^;}{]+)', css_text)
    props["font_families"] = list(set([f.strip().strip('"').strip("'") for f in fonts]))

    # Font sizes
    sizes = re.findall(r'font-size:\s*([^;}{]+)', css_text)
    props["font_sizes"] = list(set([s.strip() for s in sizes]))

    # Font weights
    weights = re.findall(r'font-weight:\s*([^;}{]+)', css_text)
    props["font_weights"] = list(set([w.strip() for w in weights]))

    # Line heights
    lineheights = re.findall(r'line-height:\s*([^;}{]+)', css_text)
    props["line_heights"] = list(set([lh.strip() for lh in lineheights]))

    # Paddings
    paddings = re.findall(r'padding(?:-(?:top|right|bottom|left))?:\s*([^;}{]+)', css_text)
    props["paddings"] = [p.strip() for p in paddings if p.strip() != "0"]

    # Margins
    margins = re.findall(r'margin(?:-(?:top|right|bottom|left))?:\s*([^;}{]+)', css_text)
    props["margins"] = [m.strip() for m in margins if m.strip() != "0"]

    # Border radius
    radii = re.findall(r'border-radius:\s*([^;}{]+)', css_text)
    props["border_radii"] = [r.strip() for r in radii]

    # Box shadows
    shadows = re.findall(r'box-shadow:\s*([^;}{]+)', css_text)
    props["box_shadows"] = [s.strip() for s in shadows]

    # Max widths
    maxwidths = re.findall(r'max-width:\s*([^;}{]+)', css_text)
    props["max_widths"] = list(set([mw.strip() for mw in maxwidths]))

    # Borders
    borders = re.findall(r'border[^:]*:\s*([^;}{]+)', css_text)
    props["borders"] = [b.strip() for b in borders]

    return props


def extract_animations(css_text):
    animations = []
    keyframes = re.findall(r'@keyframes\s+([a-zA-Z0-9_-]+)', css_text)
    for name in keyframes:
        animations.append(name)
    return animations


def extract_media_queries(css_text):
    queries = re.findall(r'@media\s*\([^)]+\)', css_text)
    return list(set(queries))


def identify_sections(body):
    checks = {
        "sticky_bar": bool(re.search(r'position:\s*(fixed|sticky)', body)),
        "logo_header": bool(re.search(r'(logo|brand)', body[:5000], re.IGNORECASE)),
        "breadcrumb": bool(re.search(r'(breadcrumb|top[\-_]?bar)', body[:8000], re.IGNORECASE)),
        "video": bool(re.search(r'<(video|iframe)', body, re.IGNORECASE)),
        "rating": bool(re.search(r'(rating|star|review)', body[:30000], re.IGNORECASE)),
        "testimonial": bool(re.search(r'(testimonial|customer.*review|what.*customer|what.*people)', body[:50000], re.IGNORECASE)),
        "faq": bool(re.search(r'(faq|frequently.*asked)', body[:50000], re.IGNORECASE)),
        "comparison": bool(re.search(r'(comparison|compare|vs\.?|versus)', body[:50000], re.IGNORECASE)),
        "before_after": bool(re.search(r'(before.*after|avant.*apr)', body[:50000], re.IGNORECASE)),
        "benefit_list": bool(re.search(r'(benefit|advantage|why.*choose|reason|feature)', body[:50000], re.IGNORECASE)),
        "guarantee": bool(re.search(r'(guarantee|warranty|money[\-_]?back|satisfaction|30[\-_]?day)', body[:50000], re.IGNORECASE)),
        "countdown": bool(re.search(r'(countdown|timer|hurry|limited|flash|stock)', body[:50000], re.IGNORECASE)),
        "popup": bool(re.search(r'(popup|modal|overlay|pop[\-_]up)', body[:50000], re.IGNORECASE)),
        "social_proof": bool(re.search(r'(as seen on|featured.*on|doctor|expert)', body[:50000], re.IGNORECASE)),
        "author_byline": bool(re.search(r'(author|written.*by|journalist|reporter)', body[:15000], re.IGNORECASE)),
        "date": bool(re.search(r'(published|updated|january|february|march|april|may|june|july|august|september|october|november|december)', body[:15000], re.IGNORECASE)),
        "sidebar": bool(re.search(r'(sidebar|side[\-_]?bar|aside)', body[:30000], re.IGNORECASE)),
        "numbered_list": bool(re.search(r'(step\s+\d|#\d|number\s+\d|tip\s+\d)', body[:50000], re.IGNORECASE)),
        "cta_button": bool(re.search(r'(class=["\'][^"\']*(?:btn|button|cta))', body[:50000], re.IGNORECASE)),
        "image_gallery": len(re.findall(r'<img', body)) > 10,
        "unordered_list": bool(re.search(r'<ul[^>]*>.*?</ul>', body[:50000], re.DOTALL)),
    }
    return checks


all_results = {}

for name, fpath in FILES:
    try:
        with open(fpath, "r", encoding="utf-8") as f:
            content = f.read()
    except Exception as e:
        all_results[name] = {"error": str(e)}
        continue

    style_blocks = re.findall(r'<style[^>]*>(.*?)</style>', content, re.DOTALL)
    SKIP = ["bootstrap", "fontawesome", "font awesome", "animate.css", "normalize.css", "webflow"]
    custom_css = []
    for sb in style_blocks:
        if any(p in sb[:200].lower() for p in SKIP):
            continue
        if len(sb.strip()) < 30:
            continue
        custom_css.append(sb)

    all_css = "\n".join(custom_css)
    props = extract_css_properties(all_css)
    animations = extract_animations(all_css)
    breakpoints = extract_media_queries(all_css)

    body_match = re.search(r'<body[^>]*>(.*)</body>', content, re.DOTALL)
    body = body_match.group(1) if body_match else content

    headings = re.findall(r'<(h[1-6])[^>]*>(.*?)</\1>', body, re.DOTALL)
    heading_texts = []
    for tag, text in headings[:40]:
        clean = re.sub(r'<[^>]+>', '', text).strip()[:200]
        if clean:
            heading_texts.append({"tag": tag, "text": clean})

    ctas = re.findall(r'<(?:a|button)[^>]*(?:class="([^"]*)")?[^>]*(?:href="([^"]*)")?[^>]*>(.*?)</(?:a|button)>', body, re.DOTALL)
    cta_texts = []
    for cls, href, text in ctas[:25]:
        clean = re.sub(r'<[^>]+>', '', text).strip()[:150]
        if clean and len(clean) > 3:
            cta_texts.append({"class": (cls or "")[:100], "text": clean})

    section_flags = identify_sections(body)

    all_results[name] = {
        "properties": props,
        "animations": animations,
        "breakpoints": breakpoints,
        "headings": heading_texts,
        "ctas": cta_texts,
        "section_flags": section_flags,
        "css_total": len(all_css),
        "num_images": len(re.findall(r'<img', body)),
        "num_links": len(re.findall(r'<a ', body)),
    }

output = Path(r"C:\Users\Admin\ECOM-AI\design-data\detailed-extraction.json")
output.parent.mkdir(parents=True, exist_ok=True)
with open(output, "w", encoding="utf-8") as f:
    json.dump(all_results, f, ensure_ascii=False, indent=2)

print(f"Saved to {output}")

# Print summary
print(f"\n=== SECTION FLAGS ACROSS ALL PAGES ===")
flags = defaultdict(list)
for name, data in all_results.items():
    if "error" in data:
        continue
    for flag, val in data["section_flags"].items():
        if val:
            flags[flag].append(name)

for flag, pages in sorted(flags.items(), key=lambda x: -len(x[1])):
    print(f"  {flag}: {len(pages)}/18 pages")

print(f"\n=== COLOR PALETTES ===")
for name, data in all_results.items():
    if "error" in data:
        continue
    colors = data["properties"].get("colors", [])
    hex_colors = [c for c in colors if c.startswith("#")]
    print(f"  {name}: {hex_colors[:15]}")

print(f"\n=== FONT FAMILIES ===")
for name, data in all_results.items():
    if "error" in data:
        continue
    fonts = list(set(data["properties"].get("font_families", [])))
    print(f"  {name}: {fonts[:8]}")

print(f"\n=== BREAKPOINTS ===")
for name, data in all_results.items():
    if "error" in data:
        continue
    bps = data.get("breakpoints", [])
    if bps:
        print(f"  {name}: {bps}")
