"""
Purpose: Extract complete CSS + structure from advertorial HTML files
Dependencies: Python 3 standard library only
Related: advertorials-analysis.md (output)
"""
import re
import os
import json
from pathlib import Path
from html.parser import HTMLParser

BASE1 = Path(r"C:\Users\Admin\Downloads\SITES\htlm-pages")
BASE2 = Path(r"C:\Users\Admin\Downloads\SITES\7m tryemsense\html")
BASE3 = Path(r"C:\Users\Admin\Downloads\SITES\4M tryhalogrow.com\sites")

FILES = [
    BASE1 / "advertorial-smoothspire.html",
    BASE1 / "advertorial vibriance.html",
    BASE1 / "advertorial-rejuvacare.html",
    BASE1 / "advertorial-reason-why-allfemale.html",
    BASE1 / "advertorial-7m-tryemsense.html",
    BASE1 / "advertorial-2-7m-tryemsense.html",
    BASE1 / "advertorial-drivse-reason-why.html",
    BASE1 / "advertorial-reason-why-rejuvera.html",
    BASE1 / "advertorial-reason-why-oricle.html",
    BASE1 / "advertorial-particulemen.html",
    BASE1 / "advertorial-clarifion.html",
    BASE1 / "advertorial-tryledisa-11m.html",
    BASE1 / "advertorial-anglais tryledisa.html",
    BASE2 / "7m tryemsense advertorial.html",
    BASE2 / "7m tryemsense advertorial 2.html",
    BASE2 / "7m tryemsense advertorial 3.html",
    BASE3 / "advertorial-germany.html",
    BASE3 / "advertorial-anglais tryledisa.html",
]

def read_file(path):
    with open(path, 'r', encoding='utf-8', errors='ignore') as f:
        return f.read()

def extract_style_blocks(content):
    """Extract all <style> block contents"""
    blocks = re.findall(r'<style[^>]*>(.*?)</style>', content, re.DOTALL)
    return blocks

def extract_inline_styles(content):
    """Extract all inline style attributes with their element context"""
    # Match opening tags with style attributes
    pattern = r'<(\w+)([^>]*?)style=["\']([^"\']*)["\']([^>]*?)>'
    matches = re.findall(pattern, content)
    return [(tag, pre_attr, style, post_attr) for tag, pre_attr, style, post_attr in matches]

def detect_platform(content):
    """Detect the page builder/platform"""
    platforms = []
    if 'gf_button' in content or 'gf_row' in content:
        platforms.append("GemPages")
    if 'data-stretch-xs' in content:
        platforms.append("GemPages")
    if 'fkt-link' in content or 'fkt-image' in content:
        platforms.append("FunnelKit/GemPages")
    if 'Bootstrap' in content:
        platforms.append("Bootstrap")
    if 'shopify' in content.lower() or 'cdn.shopify.com' in content:
        platforms.append("Shopify")
    if 'checkoutchamp' in content.lower():
        platforms.append("CheckoutChamp")
    if 'clickfunnels' in content.lower():
        platforms.append("ClickFunnels")
    if 'wordpress' in content.lower() or 'wp-content' in content:
        platforms.append("WordPress")
    if 'elementor' in content.lower():
        platforms.append("Elementor")
    if 'mcr_top' in content:
        platforms.append("MobileCTA-sticky")
    return list(set(platforms)) if platforms else ["Unknown"]

def extract_brand(content):
    """Try to detect brand name from title or meta"""
    title_match = re.search(r'<title>([^<]+)</title>', content)
    og_site = re.search(r'og:site_name["\s]+content=["\']([^"\']+)', content)

    candidates = []
    if title_match:
        candidates.append(title_match.group(1))
    if og_site:
        candidates.append(og_site.group(1))

    return candidates[0] if candidates else "Unknown"

def extract_google_fonts(content):
    """Extract Google Fonts loaded"""
    fonts = re.findall(r'fonts\.googleapis\.com/css\?[^"\'>]*family=([^&"\'>]+)', content)
    fonts += re.findall(r'fonts\.googleapis\.com/css2\?[^"\'>]*family=([^&"\'>:]+)', content)
    # Clean up
    cleaned = set()
    for f in fonts:
        cleaned.add(f.replace('+', ' ').replace('%20', ' '))
    return list(cleaned)

def extract_colors_from_css(css_text):
    """Extract all hex colors from CSS"""
    hex_colors = re.findall(r'#(?:[0-9a-fA-F]{3}){1,2}\b', css_text)
    rgb_colors = re.findall(r'rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)', css_text)
    rgba_colors = re.findall(r'rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)', css_text)

    hex_set = set(hex_colors)
    return {
        'hex': list(hex_set),
        'rgb': rgb_colors,
        'rgba': rgba_colors
    }

def extract_animations(css_text):
    """Extract @keyframes and animation properties"""
    keyframes = re.findall(r'@keyframes\s+([\w-]+)\s*\{([^}]+)\}', css_text, re.DOTALL)
    animations = re.findall(r'animation:\s*([^;]+);', css_text)
    return {
        'keyframes': [(name, body.strip()) for name, body in keyframes],
        'animation_values': animations
    }

def extract_media_queries(css_text):
    """Extract media query blocks"""
    queries = re.findall(r'@media\s*\([^)]+\)\s*\{', css_text)
    return queries

def extract_custom_css_only(content):
    """Filter out framework CSS and return only custom styles"""
    blocks = extract_style_blocks(content)
    custom = []
    for block in blocks:
        # Skip blocks that are purely Bootstrap
        if block.strip().startswith('/*') and 'Bootstrap' in block[:200]:
            # Check if there's custom CSS after bootstrap
            # Find end of bootstrap comment
            end_comment = block.find('*/')
            if end_comment > 0 and len(block) > end_comment + 100:
                after = block[end_comment+2:]
                # Check if it's mostly grid/column classes (bootstrap)
                if '.col-' in after[:500] and '.row' in after[:500]:
                    # This is all bootstrap grid, skip
                    continue
        custom.append(block)
    return '\n'.join(custom)

def extract_structure_hints(content):
    """Extract structural hints from HTML class names and IDs"""
    # Find major section containers
    sections = []

    # Look for header/nav
    headers = re.findall(r'<header[^>]*class=["\']([^"\']*)["\']', content)
    headers += re.findall(r'<nav[^>]*class=["\']([^"\']*)["\']', content)

    # Look for section elements
    section_elems = re.findall(r'<section[^>]*class=["\']([^"\']*)["\']', content)

    # Look for major div containers with descriptive classes
    major_divs = re.findall(r'<div[^>]*class=["\']([^"\']*(?:hero|banner|headline|article|content|cta|testimonial|faq|pricing|guarantee|trust|social|countdown|sticky|popup|footer|headline|byline|intro|benefit|comparison)[^"\']*)["\']', content, re.IGNORECASE)

    # Look for heading hierarchy
    headings = re.findall(r'<(h[1-6])[^>]*(?:class=["\']([^"\']*)["\'])?[^>]*>([^<]{0,100})', content)

    # Look for images with alt text
    images = re.findall(r'<img[^>]*alt=["\']([^"\']*)["\']', content)

    # Look for video elements
    videos = re.findall(r'<(?:iframe|video)[^>]*(?:src|data-src)=["\']([^"\']*(?:youtube|vimeo|wistia)[^"\']*)["\']', content)

    # Look for buttons/CTAs
    buttons = re.findall(r'<(?:a|button)[^>]*(?:class|id)=["\']([^"\']*(?:btn|button|cta)[^"\']*)["\']', content, re.IGNORECASE)

    # Look for star ratings
    stars = re.findall(r'(?:star|rating|review)', content, re.IGNORECASE)

    # Look for countdown elements
    countdowns = re.findall(r'(?:countdown|timer|count-down)', content, re.IGNORECASE)

    return {
        'headers': headers[:10],
        'sections': section_elems[:10],
        'major_divs': major_divs[:20],
        'headings': [(tag, cls, text.strip()) for tag, cls, text in headings[:30]],
        'images': images[:20],
        'videos': videos[:5],
        'buttons': buttons[:20],
        'has_stars': len(stars) > 0,
        'has_countdown': len(countdowns) > 0,
    }

def extract_meta_info(content):
    """Extract meta information"""
    desc = re.search(r'<meta[^>]*name=["\']description["\'][^>]*content=["\']([^"\']*)', content)
    og_title = re.search(r'<meta[^>]*property=["\']og:title["\'][^>]*content=["\']([^"\']*)', content)
    og_desc = re.search(r'<meta[^>]*property=["\']og:description["\'][^>]*content=["\']([^"\']*)', content)
    return {
        'description': desc.group(1) if desc else None,
        'og_title': og_title.group(1) if og_title else None,
        'og_description': og_desc.group(1) if og_desc else None,
    }

def analyze_file(filepath):
    """Complete analysis of one file"""
    content = read_file(filepath)
    all_css = '\n'.join(extract_style_blocks(content))

    return {
        'filename': filepath.name,
        'filepath': str(filepath),
        'size_bytes': len(content),
        'line_count': content.count('\n'),
        'platform': detect_platform(content),
        'brand': extract_brand(content),
        'fonts': extract_google_fonts(content),
        'meta': extract_meta_info(content),
        'colors': extract_colors_from_css(all_css),
        'animations': extract_animations(all_css),
        'media_queries': extract_media_queries(all_css),
        'structure': extract_structure_hints(content),
        'inline_styles_count': len(extract_inline_styles(content)),
        'style_blocks_count': len(extract_style_blocks(content)),
    }

def main():
    results = []
    for f in FILES:
        if f.exists():
            print(f"Analyzing: {f.name}")
            result = analyze_file(f)
            results.append(result)
        else:
            print(f"NOT FOUND: {f}")

    output_path = Path(r"C:\Users\Admin\ECOM-AI\design-data\advertorials-raw.json")
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)

    print(f"\nAnalyzed {len(results)} files")
    print(f"Saved to: {output_path}")

if __name__ == '__main__':
    main()
