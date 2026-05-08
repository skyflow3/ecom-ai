"""
Purpose: Deep CSS extraction from advertorial HTML files - extract ALL custom CSS (non-framework)
Dependencies: Python 3 standard library
Related: advertorials-analysis.md (output)
"""
import re
import json
from pathlib import Path

BASE1 = Path(r"C:\Users\Admin\Downloads\SITES\htlm-pages")
BASE2 = Path(r"C:\Users\Admin\Downloads\SITES\7m tryemsense\html")
BASE3 = Path(r"C:\Users\Admin\Downloads\SITES\4M tryhalogrow.com\sites")

FILES = [
    ("smoothspire", BASE1 / "advertorial-smoothspire.html"),
    ("vibriance", BASE1 / "advertorial vibriance.html"),
    ("rejuvacare", BASE1 / "advertorial-rejuvacare.html"),
    ("allfemale", BASE1 / "advertorial-reason-why-allfemale.html"),
    ("tryemsense", BASE1 / "advertorial-7m-tryemsense.html"),
    ("tryemsense-2", BASE1 / "advertorial-2-7m-tryemsense.html"),
    ("drivse", BASE1 / "advertorial-drivse-reason-why.html"),
    ("rejuvera", BASE1 / "advertorial-reason-why-rejuvera.html"),
    ("oricle", BASE1 / "advertorial-reason-why-oricle.html"),
    ("particulemen", BASE1 / "advertorial-particulemen.html"),
    ("clarifion", BASE1 / "advertorial-clarifion.html"),
    ("tryledisa-11m", BASE1 / "advertorial-tryledisa-11m.html"),
    ("tryledisa-en", BASE1 / "advertorial-anglais tryledisa.html"),
    ("tryemsense-v1", BASE2 / "7m tryemsense advertorial.html"),
    ("tryemsense-v2", BASE2 / "7m tryemsense advertorial 2.html"),
    ("tryemsense-v3", BASE2 / "7m tryemsense advertorial 3.html"),
    ("halogrow-de", BASE3 / "advertorial-germany.html"),
    ("halogrow-en", BASE3 / "advertorial-anglais tryledisa.html"),
]

FRAMEWORK_MARKERS = [
    'Bootstrap', 'fontawesome', 'Font Awesome', 'animate.css', 'normalize.css',
    'daneden', 'necolas', 'fontawesome.com'
]

def is_framework_block(block):
    """Check if a CSS block is a framework (Bootstrap, Font Awesome, etc.)"""
    first_200 = block[:500].lower()
    for marker in FRAMEWORK_MARKERS:
        if marker.lower() in first_200:
            return True
    return False

def extract_custom_css(content):
    """Extract only custom CSS (not framework)"""
    blocks = re.findall(r'<style[^>]*>(.*?)</style>', content, re.DOTALL)
    custom = []
    for block in blocks:
        if not is_framework_block(block):
            # Also skip blocks that are purely normalize/reset
            if block.strip().startswith('/*! normalize.css'):
                continue
            if len(block.strip()) > 10:
                custom.append(block.strip())
    return custom

def extract_html_structure(content):
    """Extract the visual structure from HTML"""
    # Remove script and style tags for structure analysis
    clean = re.sub(r'<script[^>]*>.*?</script>', '', content, flags=re.DOTALL)
    clean = re.sub(r'<style[^>]*>.*?</style>', '', clean, flags=re.DOTALL)

    # Find major structural elements with their classes and inline styles
    structure = []

    # Match major elements
    pattern = r'<(div|section|header|footer|nav|main|article|aside)[^>]*?((?:class|id|style)=["\'][^"\']*["\'])[^>]*>'
    matches = re.finditer(pattern, clean)

    for m in matches:
        tag = m.group(1)
        attrs = m.group(2)

        cls = re.search(r'class=["\']([^"\']*)["\']', attrs)
        eid = re.search(r'id=["\']([^"\']*)["\']', attrs)
        sty = re.search(r'style=["\']([^"\']*)["\']', attrs)

        structure.append({
            'tag': tag,
            'class': cls.group(1) if cls else '',
            'id': eid.group(1) if eid else '',
            'inline_style': sty.group(1) if sty else ''
        })

    return structure

def extract_all_inline_styles(content):
    """Extract ALL inline styles with element context"""
    pattern = r'<(\w+)([^>]*?)style=["\']([^"\']*)["\']([^>]*?)>'
    matches = re.findall(pattern, content)
    return [(tag, style) for tag, pre, style, post in matches]

def extract_heading_text(content):
    """Extract heading text for structure"""
    clean = re.sub(r'<script[^>]*>.*?</script>', '', content, flags=re.DOTALL)
    clean = re.sub(r'<style[^>]*>.*?</style>', '', clean, flags=re.DOTALL)

    headings = re.findall(r'<(h[1-6])[^>]*>(.*?)</\1>', clean, re.DOTALL)
    result = []
    for tag, inner in headings:
        text = re.sub(r'<[^>]+>', '', inner).strip()
        if text:
            # Get class of heading
            cls_match = re.search(r'<h[1-6][^>]*class=["\']([^"\']*)["\']', content[:content.find(inner)][:500])
            result.append((tag, text[:120]))
    return result

def extract_cta_buttons(content):
    """Extract CTA/button elements with full styling"""
    # Find all a/button elements that look like CTAs
    pattern = r'<(?:a|button)[^>]*(?:href|class|id|style)=["\'][^"\']*(?:btn|button|cta|order|buy|shop|add.to.cart|try|get|claim|click)[^"\']*["\'][^>]*>'
    matches = re.findall(pattern, content, re.IGNORECASE)

    # Also find elements with CTA-like inline styles
    cta_styles = re.findall(
        r'<(?:a|button)[^>]*style=["\']([^"\']*(?:background.*?:|padding.*?:|border-radius.*?:)[^"\']*)["\'][^>]*>',
        content
    )

    return {
        'cta_elements': len(matches),
        'cta_inline_styles': cta_styles[:10]
    }

def extract_images_with_context(content):
    """Extract img tags with their surrounding context"""
    clean = re.sub(r'<script[^>]*>.*?</script>', '', content, flags=re.DOTALL)
    clean = re.sub(r'<style[^>]*>.*?</style>', '', clean, flags=re.DOTALL)

    imgs = re.findall(
        r'<img[^>]*(?:src|data-src|alt|class|style)=["\']([^"\']*)["\'][^>]*>',
        clean
    )

    img_alts = re.findall(r'<img[^>]*alt=["\']([^"\']*)["\'][^>]*>', clean)

    return {
        'count': len(re.findall(r'<img', content)),
        'alts': img_alts[:30]
    }

def analyze_one(name, filepath):
    """Deep analysis of one file"""
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    custom_css_blocks = extract_custom_css(content)
    all_custom_css = '\n'.join(custom_css_blocks)

    # Extract colors from custom CSS only
    hex_colors = list(set(re.findall(r'#(?:[0-9a-fA-F]{3}){1,2}\b', all_custom_css)))
    rgb_colors = list(set(re.findall(r'rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)', all_custom_css)))
    rgba_colors = list(set(re.findall(r'rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)', all_custom_css)))

    # Extract fonts
    font_families = re.findall(r'font-family:\s*([^;]+);', all_custom_css)

    # Extract animations
    keyframes = re.findall(r'@keyframes\s+([\w-]+)\s*\{(.*?)\}', all_custom_css, re.DOTALL)
    animations = re.findall(r'animation[:\s]+([^;]+);', all_custom_css)

    # Extract media queries content
    media_queries = re.findall(r'@media\s*\(([^)]+)\)\s*\{', all_custom_css)

    # Inline styles
    inline_styles = extract_all_inline_styles(content)

    # Structure
    headings = extract_heading_text(content)
    images = extract_images_with_context(content)
    ctas = extract_cta_buttons(content)

    # Detect brand from heading content
    brand = "Unknown"
    for tag, text in headings:
        if tag == 'h1' and text:
            brand = text[:50]
            break

    # Detect platform
    platform = []
    if 'gf_button' in content or 'gf_row' in content: platform.append("GemPages")
    if 'data-stretch-xs' in content: platform.append("GemPages")
    if 'fkt-link' in content or 'fkt-image' in content: platform.append("FunnelKit")
    if 'CheckoutChamp' in content: platform.append("CheckoutChamp")
    if 'mcr_top' in content: platform.append("StickyMobileCTA")
    if 'scraped-container' in content: platform.append("CustomScraped")
    if 'top_bar' in content and 'header_area' in content: platform.append("EditorialTemplate")

    # Google Fonts
    google_fonts = re.findall(r'family=([^&:\'\"]+)', content)
    fonts_loaded = list(set(f.replace('+', ' ') for f in google_fonts))

    return {
        'name': name,
        'file': filepath.name,
        'size_kb': round(len(content) / 1024, 1),
        'lines': content.count('\n'),
        'platform': platform,
        'brand_hint': brand,
        'fonts_loaded': fonts_loaded,
        'font_families_in_css': list(set(font_families)),
        'hex_colors': hex_colors,
        'rgb_colors': rgb_colors,
        'rgba_colors': rgba_colors,
        'keyframes': [(name, body.strip()[:500]) for name, body in keyframes],
        'animation_values': animations,
        'media_queries': media_queries,
        'inline_styles_count': len(inline_styles),
        'headings': headings[:20],
        'images': images,
        'cta_count': ctas['cta_elements'],
        'cta_inline_styles': ctas['cta_inline_styles'],
        'custom_css_blocks_count': len(custom_css_blocks),
        'custom_css_full': all_custom_css
    }

def main():
    results = []
    for name, filepath in FILES:
        if filepath.exists():
            print(f"Deep analyzing: {name} ({filepath.name})")
            result = analyze_one(name, filepath)
            results.append(result)
        else:
            print(f"NOT FOUND: {filepath}")

    # Save full results (with CSS)
    out_path = Path(r"C:\Users\Admin\ECOM-AI\design-data\advertorials-deep.json")
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)

    # Also save a summary version without the full CSS
    summary = []
    for r in results:
        s = {k: v for k, v in r.items() if k != 'custom_css_full'}
        summary.append(s)

    sum_path = Path(r"C:\Users\Admin\ECOM-AI\design-data\advertorials-summary.json")
    with open(sum_path, 'w', encoding='utf-8') as f:
        json.dump(summary, f, indent=2, ensure_ascii=False)

    print(f"\nDeep analyzed {len(results)} files")
    print(f"Full: {out_path}")
    print(f"Summary: {sum_path}")

if __name__ == '__main__':
    main()
