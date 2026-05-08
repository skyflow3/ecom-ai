import re
import sys
from pathlib import Path

def extract_from_file(filepath, name):
    content = Path(filepath).read_text(encoding='utf-8', errors='ignore')
    result = []

    result.append(f"\n{'='*80}")
    result.append(f"FILE: {name}")
    result.append(f"{'='*80}")

    # 1. Page Builder Detection
    if 'Funnel Builder Pro' in content:
        result.append("PAGE BUILDER: Funnel Builder Pro (Tailwind CSS)")
    elif 'shopify-section' in content:
        result.append("PAGE BUILDER: Shopify (Custom Theme)")
    elif 'fk-col' in content or 'fk-row' in content:
        result.append("PAGE BUILDER: FunnelKit")
    elif 'w-background-video' in content or 'w-inline-block' in content:
        result.append("PAGE BUILDER: Webflow")
    elif 'gf-elm' in content or 'GemPages' in content:
        result.append("PAGE BUILDER: GemPages (Shopify)")

    # 2. Extract CSS :root variables
    root_vars = re.findall(r'(--[\w-]+)\s*:\s*([^;]+);', content)
    if root_vars:
        result.append("\n--- CSS ROOT VARIABLES ---")
        seen = set()
        for var, val in root_vars:
            if var not in seen and any(kw in var for kw in ['color', 'font', 'spacing', 'button', 'media', 'page', 'gradient', 'badge', 'popup', 'grid', 'radius', 'shadow', 'border']):
                result.append(f"  {var}: {val.strip()}")
                seen.add(var)

    # 3. Extract color schemes
    color_schemes = re.findall(r'\.(color-[\w-]+)\s*\{([^}]+)\}', content)
    if color_schemes:
        result.append("\n--- COLOR SCHEMES ---")
        seen = set()
        for name_cs, props in color_schemes:
            if name_cs not in seen:
                result.append(f"  .{name_cs}:")
                for line in props.split('\n'):
                    line = line.strip()
                    if line and not line.startswith('/*'):
                        result.append(f"    {line}")
                seen.add(name_cs)

    # 4. Extract @font-face families
    font_faces = re.findall(r"@font-face\s*\{[^}]*font-family:\s*['\"]?([^;'\"]+)", content)
    if font_faces:
        result.append("\n--- FONT FAMILIES ---")
        for f in sorted(set(font_faces)):
            result.append(f"  {f.strip()}")

    # 5. Extract @keyframes animation names
    keyframes = re.findall(r'@keyframes\s+([\w-]+)', content)
    if keyframes:
        result.append("\n--- ANIMATIONS (@keyframes) ---")
        for kf in sorted(set(keyframes)):
            result.append(f"  {kf}")

    # 6. Extract Tailwind custom color values
    hex_colors = re.findall(r'(?:bg|text|border)-\[#([0-9a-fA-F]{3,8})\]', content)
    if hex_colors:
        result.append("\n--- CUSTOM HEX COLORS (Tailwind arbitrary values) ---")
        color_counts = {}
        for c in hex_colors:
            c_upper = f"#{c.upper()}"
            color_counts[c_upper] = color_counts.get(c_upper, 0) + 1
        for c, count in sorted(color_counts.items(), key=lambda x: -x[1])[:30]:
            result.append(f"  {c} (x{count})")

    # 7. Extract CSS colors in style blocks
    css_hex = re.findall(r'(?:background(?:-color)?|color|border-color):\s*#([0-9a-fA-F]{3,8})\b', content)
    if css_hex:
        result.append("\n--- CSS HEX COLORS (from style properties) ---")
        color_counts2 = {}
        for c in css_hex:
            c_upper = f"#{c.upper()}"
            color_counts2[c_upper] = color_counts2.get(c_upper, 0) + 1
        for c, count in sorted(color_counts2.items(), key=lambda x: -x[1])[:20]:
            result.append(f"  {c} (x{count})")

    # 8. Extract page structure
    result.append("\n--- PAGE STRUCTURE ---")

    shopify_sections = re.findall(r'id="(shopify-section-[^"]+)"', content)
    if shopify_sections:
        result.append("  (Shopify sections)")
        for i, s in enumerate(shopify_sections):
            result.append(f"  {i+1}. {s}")

    wf_sections = re.findall(r'class="int-([\w-]+)"', content)
    if wf_sections:
        seen_wf = []
        for s in wf_sections:
            if s not in seen_wf:
                seen_wf.append(s)
        result.append("  (Webflow sections)")
        for i, s in enumerate(seen_wf[:40]):
            result.append(f"  {i+1}. int-{s}")

    fk_sections = re.findall(r'class="fk-section\s+([^"]+)"', content)
    if fk_sections:
        result.append("  (FunnelKit sections)")
        for i, s in enumerate(fk_sections):
            result.append(f"  {i+1}. {s}")

    # Generic patterns
    if not shopify_sections and not fk_sections and not wf_sections:
        sections = re.findall(r'<(?:section|div)[^>]*class="([^"]*(?:section|hero|banner|pricing|bundle|cta|testimonial|review|faq|guarantee|trust|countdown|sticky|comparison|feature|benefit|video|gallery|how-it|footer|header|announcement)[^"]*)"', content, re.IGNORECASE)
        if sections:
            seen_sec = []
            for s in sections:
                short = s[:120]
                if short not in seen_sec:
                    seen_sec.append(short)
            result.append("  (Generic sections)")
            for i, s in enumerate(seen_sec[:30]):
                result.append(f"  {i+1}. {s}")

    # 9. CTA buttons
    result.append("\n--- CTA BUTTON STYLES ---")
    buttons = re.findall(r'class="[^"]*(?:cta|add-to-cart|checkout-button)[^"]*"', content, re.IGNORECASE)
    seen_btn = set()
    for b in buttons:
        b_short = b[:200]
        if b_short not in seen_btn:
            result.append(f"  {b_short}")
            seen_btn.add(b_short)
            if len(seen_btn) > 15:
                break

    # 10. Pricing patterns
    result.append("\n--- PRICING/BUNDLE PATTERNS ---")
    pricing = re.findall(r'class="[^"]*(?:price|bundle|pricing|variant|quantity|discount|savings|offer|package|best-value|most-popular)[^"]*"', content, re.IGNORECASE)
    seen_p = set()
    for p in pricing:
        p_short = p[:200]
        if p_short not in seen_p:
            result.append(f"  {p_short}")
            seen_p.add(p_short)
            if len(seen_p) > 15:
                break

    # 11. FAQ patterns
    result.append("\n--- FAQ/ACCORDION PATTERNS ---")
    faq = re.findall(r'class="[^"]*(?:faq|accordion|collapsible|toggle)[^"]*"', content, re.IGNORECASE)
    seen_f = set()
    for f_item in faq:
        f_short = f_item[:200]
        if f_short not in seen_f:
            result.append(f"  {f_short}")
            seen_f.add(f_short)
            if len(seen_f) > 10:
                break

    # 12. Countdown
    result.append("\n--- COUNTDOWN PATTERNS ---")
    countdown = re.findall(r'class="[^"]*(?:countdown|timer|urgency)[^"]*"', content, re.IGNORECASE)
    seen_c = set()
    for c_item in countdown:
        c_short = c_item[:200]
        if c_short not in seen_c:
            result.append(f"  {c_short}")
            seen_c.add(c_short)
            if len(seen_c) > 10:
                break

    return '\n'.join(result)


# Process all files
files = [
    ("C:/Users/Admin/Downloads/SITES/htlm-pages/product-page-airmoto.html", "PRODUCT-PAGE-AIRMOTO"),
    ("C:/Users/Admin/Downloads/SITES/htlm-pages/product-page-oricle.html", "PRODUCT-PAGE-ORICLE"),
    ("C:/Users/Admin/Downloads/SITES/htlm-pages/product-page-rejuvacare.html", "PRODUCT-PAGE-REJUVACARE"),
    ("C:/Users/Admin/Downloads/SITES/htlm-pages/product-page-7m-tryemsense.html", "PRODUCT-PAGE-7M-TRYEMSENSE"),
    ("C:/Users/Admin/Downloads/SITES/htlm-pages/product-page-drivse.html", "PRODUCT-PAGE-DRIVSE"),
    ("C:/Users/Admin/Downloads/SITES/htlm-pages/product-page-smoothspire.html", "PRODUCT-PAGE-SMOOTHPSPIRE"),
    ("C:/Users/Admin/Downloads/SITES/htlm-pages/product-page-getheyfra.html", "PRODUCT-PAGE-GETHEYFRA"),
    ("C:/Users/Admin/Downloads/SITES/htlm-pages/product-page-primalqueen.html", "PRODUCT-PAGE-PRIMALQUEEN"),
    ("C:/Users/Admin/Downloads/SITES/htlm-pages/landing-page-getheyfra.html", "LANDING-PAGE-GETHEYFRA"),
    ("C:/Users/Admin/Downloads/sale-page-oricle.html", "SALE-PAGE-ORICLE"),
]

# Files with spaces
import glob
spaced_files = glob.glob("C:/Users/Admin/Downloads/SITES/htlm-pages/product page anglais tryledisa.html")
if spaced_files:
    files.append((spaced_files[0], "PRODUCT-PAGE-TRYLEDISA-EN"))

spaced_files2 = glob.glob("C:/Users/Admin/Downloads/SITES/7m tryemsense/html/7m tryemsense  sale page.html")
if spaced_files2:
    files.append((spaced_files2[0], "SALE-PAGE-7M-TRYEMSENSE"))

spaced_files3 = glob.glob("C:/Users/Admin/Downloads/SITES/7m tryemsense/html/7m tryemsense german sale page.html")
if spaced_files3:
    files.append((spaced_files3[0], "SALE-PAGE-7M-TRYEMSENSE-DE"))

spaced_files4 = glob.glob("C:/Users/Admin/Downloads/SITES/7m tryemsense/html/7m tryemsense netherland sale page.html")
if spaced_files4:
    files.append((spaced_files4[0], "SALE-PAGE-7M-TRYEMSENSE-NL"))

spaced_files5 = glob.glob("C:/Users/Admin/Downloads/SITES/4M tryhalogrow.com/sites/product page anglais tryledisa.html")
if spaced_files5:
    files.append((spaced_files5[0], "PRODUCT-PAGE-TRYLEDISA-HALOGROW"))

spaced_files6 = glob.glob("C:/Users/Admin/Downloads/SITES/4M tryhalogrow.com/sites/checkout anglais tryledisa.html")
if spaced_files6:
    files.append((spaced_files6[0], "CHECKOUT-TRYLEDISA-HALOGROW"))

output = []
for filepath, name in files:
    try:
        output.append(extract_from_file(filepath, name))
    except Exception as e:
        output.append(f"\n{'='*80}\nFILE: {name}\n{'='*80}\nERROR: {e}")

out_path = Path("C:/Users/Admin/ECOM-AI/design-data/product-pages-extract.txt")
out_path.write_text('\n'.join(output), encoding='utf-8')
joined = '\n'.join(output)
print(f"Done. Total length: {len(joined)} chars")
