/**
 * Purpose: Template engine for winner-based HTML templates.
 *          String-based clean-slate approach — v2.
 *          COMPLETELY INDEPENDENT from the block system (src/renderers/).
 * Dependencies: templates/*.html + templates/*.html.json (slot configs)
 * Related: templates/ directory, template-filler prompt
 *
 * ARCHITECTURE (String-based Clean Slate v2):
 *   The SmoothSpire template has this structure:
 *
 *   [HEADER/HERO] ← keep
 *   [BYLINE + photo] ← keep (replace {{byline_text}})
 *   [OPENING PARAGRAPHS] ← REPLACE with AI opening
 *   [SECTION 1-11 + content] ← REPLACE with AI sections 1-11
 *   [CTA BUTTON #1] ← keep (replace {{cta_text}}, {{product_name}}, etc.)
 *   [SECTION 12-14 + content] ← REPLACE with AI sections 12-14
 *   [CLOSING/P.S.] ← REPLACE with AI closing
 *   [CTA BUTTON #2] ← keep
 *   [P.S./P.P.S.] ← REPLACE with AI closing
 *   [CTA BUTTON #3] ← keep
 *   [UPDATE BOX + TRUST BADGES] ← keep (replace markers)
 *   [CTA BUTTON #4] ← keep
 *   [SIDEBAR] ← keep (replace markers)
 *   [FOOTER/FIXED BAR] ← keep
 *
 *   Strategy: Split HTML into "zones" — keep structural zones (CTAs, sidebar, trust badges)
 *   and replace content zones (paragraphs between structural elements).
 *
 * WHY v2: v1 tried to find content area boundaries using string offsets, but the
 *      boundary detection was fragile (wrong byline end, missed CTA between sections).
 *      v2 uses ANCHOR MARKERS: finds known markers ({{byline_text}}, {{section_N_heading}})
 *      and structural elements (<a onclick="linkMethod">) as reliable boundary points.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TemplateSlot {
  description: string;
  example?: string;
  ai_generated: boolean;
  format?: string;
  notes?: string;
}

export interface TemplateConfig {
  templateId: string;
  source: string;
  description: string;
  slots: Record<string, TemplateSlot>;
}

export interface ContentMap {
  [slotName: string]: string | string[] | Record<string, string>[];
}

export interface TemplateResult {
  html: string;
  templateId: string;
  slotsFilled: number;
  slotsEmpty: number;
  warnings: string[];
}

// ─── Template Engine ──────────────────────────────────────────────────────────

const TEMPLATES_DIR = join(process.cwd(), 'templates');

export function loadTemplateConfig(templateId: string): TemplateConfig {
  const configPath = join(TEMPLATES_DIR, `${templateId}.html.json`);
  if (!existsSync(configPath)) throw new Error(`Template config not found: ${configPath}`);
  return JSON.parse(readFileSync(configPath, 'utf-8'));
}

export function loadTemplateHtml(templateId: string): string {
  const markedPath = join(TEMPLATES_DIR, `${templateId}.marked.html`);
  if (existsSync(markedPath)) return readFileSync(markedPath, 'utf-8');
  const htmlPath = join(TEMPLATES_DIR, `${templateId}.html`);
  if (!existsSync(htmlPath)) throw new Error(`Template HTML not found: ${htmlPath}`);
  return readFileSync(htmlPath, 'utf-8');
}

/**
 * Fill a template using zone-based content replacement.
 *
 * ZONE 1 (content): After byline div → Before first CTA <a>
 * ZONE 2 (keep): CTA button #1
 * ZONE 3 (content): After CTA #1 → Before CTA #2
 * ZONE 4 (keep): CTA button #2 + closing/PS + CTA #3 + update box + trust badges + CTA #4 + sidebar + footer
 */
export function fillTemplate(
  templateId: string,
  content: ContentMap,
  mode: 'marker' | 'smart' = 'smart'
): TemplateResult {
  const warnings: string[] = [];
  let html = loadTemplateHtml(templateId);
  const config = loadTemplateConfig(templateId);
  let slotsFilled = 0;
  let slotsEmpty = 0;

  // ─── Build AI content for each zone ────────────────────────────────────────

  // Extract product image URL for content section images
  const productImageUrl = extractString(content['_productImageUrl']);

  // ZONE 1: Opening paragraphs + Sections 1-11
  const zone1Parts: string[] = [];

  const openingText = content['opening_paragraphs'];
  if (typeof openingText === 'string') {
    zone1Parts.push(...buildParagraphs(openingText));
  }

  for (let n = 1; n <= 11; n++) {
    const heading = content[`section_${n}_heading`];
    const paragraphs = content[`section_${n}_paragraphs`];
    if (typeof heading !== 'string' && typeof paragraphs !== 'string') continue;

    const headingText = typeof heading === 'string' ? heading : `Section ${n}`;
    zone1Parts.push(`<h2 data-text="text" href="" data-secondsdelay="">${headingText}</h2>`);

    // Product image right below the heading (before paragraphs)
    if (productImageUrl) {
      zone1Parts.push(buildSectionImage(productImageUrl));
    }

    if (typeof paragraphs === 'string') {
      zone1Parts.push(...buildParagraphs(paragraphs));
    }
    slotsFilled++;
  }

  // ZONE 3: Sections 12-14 + closing
  const zone3Parts: string[] = [];

  for (let n = 12; n <= 14; n++) {
    const heading = content[`section_${n}_heading`];
    const paragraphs = content[`section_${n}_paragraphs`];
    if (typeof heading !== 'string' && typeof paragraphs !== 'string') continue;

    const headingText = typeof heading === 'string' ? heading : `Section ${n}`;
    zone3Parts.push(`<h2 data-text="text" href="" data-secondsdelay="">${headingText}</h2>`);

    // Product image right below the heading (before paragraphs)
    if (productImageUrl) {
      zone3Parts.push(buildSectionImage(productImageUrl));
    }

    if (typeof paragraphs === 'string') {
      zone3Parts.push(...buildParagraphs(paragraphs));
    }
    slotsFilled++;
  }

  // Closing text (P.S., signature, urgency)
  const closingText = content['closing_paragraphs'];
  if (typeof closingText === 'string') {
    zone3Parts.push(...buildParagraphs(closingText));
  }

  if (zone1Parts.length === 0 && zone3Parts.length === 0) {
    warnings.push('No section content provided — body will be empty');
  }

  const zone1Html = zone1Parts.join('\n');
  const zone3Html = zone3Parts.join('\n');

  // ─── Find zone boundaries ──────────────────────────────────────────────────

  // BOUNDARY: End of byline area
  // The byline is in: <div ...><img ...><p ...><i ...>{{byline_text}}</i></p></div>
  // We need to find the </div> that closes this byline container.
  const bylineMarker = '{{byline_text}}';
  const bylineIdx = html.indexOf(bylineMarker);
  if (bylineIdx === -1) {
    warnings.push('Could not find {{byline_text}} marker — falling back to simple marker replacement');
    return fillSimpleMarkers(html, templateId, content, config, warnings);
  }

  // Find the </div> that closes the byline's parent div
  // Structure: <div ...><img ...><p ...><i ...>{{byline_text}}</i></p></div>
  // After the marker: </i></p></div>
  const afterByline = html.substring(bylineIdx);
  const bylineDivClose = afterByline.indexOf('</div>');
  if (bylineDivClose === -1) {
    warnings.push('Could not find byline closing </div> — falling back');
    return fillSimpleMarkers(html, templateId, content, config, warnings);
  }
  const zone1Start = bylineIdx + bylineDivClose + '</div>'.length;

  // BOUNDARY: First CTA button — <a ... onclick="linkMethod(event)" ...>{{cta_text}}</a>
  const ctaSearchFrom = zone1Start;
  const cta1Pattern = 'onclick="linkMethod(event)"';
  let cta1LinkIdx = html.indexOf(cta1Pattern, ctaSearchFrom);
  if (cta1LinkIdx === -1) {
    // Try alternate: action="route" onclick="linkMethod"
    cta1LinkIdx = html.indexOf('action="route"', ctaSearchFrom);
    if (cta1LinkIdx === -1) {
      warnings.push('Could not find first CTA button — falling back');
      return fillSimpleMarkers(html, templateId, content, config, warnings);
    }
  }

  // Go back to find the containing element (could be <a> or <div><a>)
  // Find the <a tag that contains this onclick
  const cta1ATagStart = html.lastIndexOf('<a', cta1LinkIdx);
  // Check if this <a is wrapped in a <div data-box>
  const beforeCTA1 = html.substring(Math.max(0, cta1ATagStart - 200), cta1ATagStart);
  const divBoxMatch = beforeCTA1.match(/<div data-box="true"[^>]*>\s*$/);
  let zone1End: number;
  if (divBoxMatch) {
    zone1End = cta1ATagStart - divBoxMatch[0].length;
  } else {
    // Check for <p> before the <a> (empty paragraph spacer)
    const pBeforeA = html.lastIndexOf('<p', cta1ATagStart);
    const textBetween = html.substring(pBeforeA, cta1ATagStart).trim();
    if (pBeforeA > ctaSearchFrom && (textBetween.startsWith('<p data-text="text"') && textBetween.length < 50)) {
      zone1End = pBeforeA;
    } else {
      zone1End = cta1ATagStart;
    }
  }

  // BOUNDARY: End of CTA #1 → find where it closes
  // After {{cta_text}}</a> there may be a </div> if wrapped
  const cta1TextMarker = '{{cta_text}}';
  const cta1TextIdx = html.indexOf(cta1TextMarker, cta1LinkIdx);
  const cta1AClose = html.indexOf('</a>', cta1TextIdx !== -1 ? cta1TextIdx : cta1LinkIdx);

  let zone3Start: number;
  if (cta1AClose !== -1) {
    // Check if wrapped in <div>
    const afterCta1Close = html.substring(cta1AClose, cta1AClose + 20);
    if (afterCta1Close.startsWith('</a></div>')) {
      zone3Start = cta1AClose + '</a></div>'.length;
    } else {
      zone3Start = cta1AClose + '</a>'.length;
    }
  } else {
    zone3Start = zone1End;
  }

  // BOUNDARY: Second CTA button (after sections 12-14 and closing)
  // Find the next <a onclick="linkMethod" after zone3Start
  // But this is the CTA #2 that we want to KEEP (it's the "big" one before closing)
  // Actually, looking at the HTML structure:
  //   CTA#1 (line 1385) → section_12 (line 1386) → ... → section_14 → closing → CTA#2 (line 1436)
  //   → P.S. → CTA#3 (line 1441) → update box → trust badges → CTA#4 → sidebar
  // We replace zone3 content up to CTA#2
  let zone3End: number;
  const cta2LinkIdx = html.indexOf(cta1Pattern, zone3Start);
  if (cta2LinkIdx === -1) {
    // No more CTAs — replace everything up to sidebar
    const sidebarPattern = 'main_cnt_right';
    const sidebarIdx = html.indexOf(sidebarPattern, zone3Start);
    if (sidebarIdx !== -1) {
      // Go back to find the parent element
      const parentDiv = html.lastIndexOf('<div', sidebarIdx);
      zone3End = parentDiv > zone3Start ? parentDiv : html.length;
    } else {
      zone3End = html.length;
    }
  } else {
    // Go back from CTA#2 to find the start of the structural element
    const cta2ATagStart = html.lastIndexOf('<a', cta2LinkIdx);
    // Check for <p> spacer before CTA
    const pBefore2 = html.lastIndexOf('<p', cta2ATagStart);
    const textBetween2 = html.substring(pBefore2, cta2ATagStart).trim();
    if (pBefore2 > zone3Start && textBetween2.startsWith('<p data-text="text"') && textBetween2.length < 50) {
      zone3End = pBefore2;
    } else {
      zone3End = cta2ATagStart;
    }
  }

  // ─── Perform zone replacements ─────────────────────────────────────────────

  warnings.push(`Zone 1: replacing ${zone1Start}-${zone1End} (${zone1End - zone1Start} chars → ${zone1Html.length} chars)`);
  warnings.push(`Zone 3: replacing ${zone3Start}-${zone3End} (${zone3End - zone3Start} chars → ${zone3Html.length} chars)`);

  // Replace zone 3 first (higher offset → doesn't affect zone 1 offsets)
  html = html.substring(0, zone3Start) + '\n' + zone3Html + '\n' + html.substring(zone3End);

  // Replace zone 1
  html = html.substring(0, zone1Start) + '\n' + zone1Html + '\n' + html.substring(zone1End);

  // ─── Replace zone between CTA#2 and CTA#3 (closing signature + P.S.) ─────
  // Structure: CTA#2</a> → "With love," → "Dr. ..." signature → P.S. → P.P.S. → P.P.P.S. → CTA#3
  // We replace this entire zone with AI closing_signature content.
  const closingSignature = content['closing_signature'];
  if (typeof closingSignature === 'string') {
    // Find the text "With love," as anchor for the closing zone start
    const closingAnchor = 'With love,';
    const closingStart = html.indexOf(closingAnchor);
    if (closingStart !== -1) {
      // Go back to include the <p> tag before "With love,"
      const pBeforeClosing = html.lastIndexOf('<p', closingStart);
      const closingStartIdx = pBeforeClosing !== -1 ? pBeforeClosing : closingStart;

      // Find the next CTA button after the closing zone (CTA#3)
      const closingCtaSearch = html.indexOf(cta1Pattern, closingStart + closingAnchor.length);
      if (closingCtaSearch !== -1) {
        const cta3ATagStart = html.lastIndexOf('<a', closingCtaSearch);
        // Check for <p> spacer before CTA#3
        const pBefore3 = html.lastIndexOf('<p', cta3ATagStart);
        const textBetween3 = html.substring(pBefore3, cta3ATagStart).trim();
        const closingEndIdx = (pBefore3 > closingStartIdx && textBetween3.startsWith('<p data-text="text"') && textBetween3.length < 50)
          ? pBefore3
          : cta3ATagStart;

        // Build closing HTML from AI-generated signature + P.S.
        const closingParts: string[] = [...buildParagraphs(closingSignature)];
        const closingHtml = closingParts.join('\n');
        warnings.push(`Closing zone: replacing ${closingStartIdx}-${closingEndIdx} (${closingEndIdx - closingStartIdx} chars → ${closingHtml.length} chars)`);
        html = html.substring(0, closingStartIdx) + '\n' + closingHtml + '\n' + html.substring(closingEndIdx);
      }
    }
  }

  // ─── Replace remaining markers ─────────────────────────────────────────────
  for (const [slotName, slotConfig] of Object.entries(config.slots)) {
    const marker = `{{${slotName}}}`;
    const value = content[slotName];

    // Skip paragraph/heading slots already handled in zone replacement
    if (slotName.endsWith('_paragraphs') || slotName === 'opening_paragraphs' || slotName === 'closing_paragraphs' || slotName === 'closing_signature') continue;
    if (slotName.match(/^section_\d+_heading$/)) continue;

    if (html.includes(marker)) {
      if (value !== undefined) {
        const formatted = typeof value === 'string' ? value : String(value);
        html = html.split(marker).join(formatted);
        slotsFilled++;
      } else {
        slotsEmpty++;
        warnings.push(`Slot "${slotName}": marker found but no value provided`);
      }
    }
  }

  // ─── Clean up Facebook comments (AFTER marker replacement) ────────────────
  // WHY: Must run AFTER {{product_name}} is replaced so regex matches the final text.
  //      The template has hardcoded fake FB comments referencing back pain/nerve pain.
  //      We replace these with product-agnostic versions so they work for any product.
  const productName = typeof content['product_name'] === 'string' ? content['product_name'] as string : '';
  html = cleanFakeComments(html, productName);

  // ─── Replace images (AFTER all content replacement) ───────────────────────
  // WHY: Each template has hardcoded images from the original product.
  //      We replace product-specific images with images for the new product.
  //      Per-template routing because different templates use different CDN hosts/URLs.
  html = replaceImages(html, content, templateId);

  // ─── Sync data-src → src for lazy-loaded images ─────────────────────────────
  // WHY: Some templates use data-src for lazy loading but leave src="" empty.
  //      When viewing locally (file:///) the lazy loader JS may not run.
  //      Copying data-src to src ensures images display everywhere.
  html = html.replace(/(<img[^>]*?)src=""([^>]*?)data-src="([^"]*)"([^>]*>)/gi, (match, before, mid, url, after) => {
    if (url && !url.startsWith('data:')) {
      return `${before}src="${url}"${mid}data-src="${url}"${after}`;
    }
    return match;
  });

  // ─── Strip <base href="..."> from templates ─────────────────────────────────
  // WHY: Original winner templates have <base href="https://try.smoothspine.com/...">.
  //      This makes ALL relative URLs resolve to the original domain instead of local files.
  //      In a funnel, we need relative URLs (checkout.html, oto1.html) to work from file:// or any host.
  html = html.replace(/<base\s+href="[^"]*"[^>]*>\s*/gi, '');

  return { html, templateId, slotsFilled, slotsEmpty, warnings };
}

/**
 * Sanitize AI-generated HTML content to prevent DOM corruption.
 * WHY: AI outputs content with unclosed <strong>, <em>, <b>, <i> tags and extra </div>s.
 *      These mismatched tags corrupt the DOM tree, breaking JS selectors (sticky bar, progress bar).
 *      We track opening/closing tags and append any missing closers, remove orphan closers.
 */
function sanitizeHtmlContent(html: string): string {
  // Tags that need balancing (self-closing tags excluded)
  const voidTags = new Set(['br', 'hr', 'img', 'input', 'meta', 'link', 'area', 'base', 'col', 'embed', 'source', 'track', 'wbr']);
  const tagsToBalance = ['strong', 'em', 'b', 'i', 'u', 'span', 'a', 'mark'];

  // Remove orphan </div> tags in AI content — these corrupt the parent DOM structure
  // WHY: AI sometimes wraps text in </div> by accident, which closes parent containers prematurely.
  let result = html;
  result = result.replace(/<\/div>/gi, '');

  // Balance unclosed tags
  for (const tag of tagsToBalance) {
    const openRegex = new RegExp(`<${tag}[\\s>]`, 'gi');
    const closeRegex = new RegExp(`</${tag}>`, 'gi');

    const openCount = (result.match(openRegex) || []).length;
    const closeCount = (result.match(closeRegex) || []).length;

    if (openCount > closeCount) {
      // Append missing closing tags
      const missing = openCount - closeCount;
      result += `</${tag}>`.repeat(missing);
    } else if (closeCount > openCount) {
      // Remove orphan closing tags (replace from the end)
      let toRemove = closeCount - openCount;
      let lastIdx = result.length;
      while (toRemove > 0) {
        const searchStr = `</${tag}>`;
        const idx = result.lastIndexOf(searchStr, lastIdx);
        if (idx === -1) break;
        result = result.substring(0, idx) + result.substring(idx + searchStr.length);
        lastIdx = idx;
        toRemove--;
      }
    }
  }

  return result;
}

/**
 * Fallback: simple marker replacement without body content replacement.
 */
function fillSimpleMarkers(
  html: string,
  templateId: string,
  content: ContentMap,
  config: TemplateConfig,
  warnings: string[]
): TemplateResult {
  let slotsFilled = 0;
  let slotsEmpty = 0;

  for (const [slotName, slotConfig] of Object.entries(config.slots)) {
    const marker = `{{${slotName}}}`;
    let value = content[slotName];
    if (html.includes(marker)) {
      if (value !== undefined) {
        // Sanitize AI-generated HTML to prevent DOM corruption
        // WHY: AI content for body slots often has unclosed <strong> and stray </div> tags
        //       that break the DOM structure and disable JS (sticky bar, progress bar).
        const strValue = typeof value === 'string' ? value : String(value);
        const sanitized = slotConfig.ai_generated ? sanitizeHtmlContent(strValue) : strValue;
        html = html.split(marker).join(sanitized);
        slotsFilled++;
      } else {
        slotsEmpty++;
      }
    }
  }

  // ─── Replace images (same as main fillTemplate path) ────────────────────────
  // WHY: Marker mode needs image replacement too — product images, author photos, etc.
  html = replaceImages(html, content, templateId);

  // ─── Strip <base href="..."> from templates ─────────────────────────────────
  html = html.replace(/<base\s+href="[^"]*"[^>]*>\s*/gi, '');

  return { html, templateId, slotsFilled, slotsEmpty, warnings };
}

export function saveFilledTemplate(result: TemplateResult, outputPath: string): void {
  writeFileSync(outputPath, result.html, 'utf-8');
}

// ─── HTML Building Helpers ────────────────────────────────────────────────────

/**
 * Build HTML <p> elements from pipe-separated paragraph text.
 * Supports markdown formatting: **bold**, *italic*, ***bold+italic***
 */
function buildParagraphs(text: string): string[] {
  return text
    .split('|')
    .map(p => p.trim())
    .filter(p => p.length > 0)
    .map(p => `<p data-text="text" href="" data-secondsdelay="">${convertMarkdownFormatting(p)}</p>`);
}

/**
 * Convert markdown-style formatting to HTML.
 */
function convertMarkdownFormatting(text: string): string {
  let result = text;
  result = result.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  result = result.replace(/\*\*\*(.+?)\*\*\*/g, '<b><i><span>$1</span></i></b>');
  result = result.replace(/\*\*(.+?)\*\*/g, '<b><span>$1</span></b>');
  result = result.replace(/\*(.+?)\*/g, '<i>$1</i>');
  return result;
}

// ─── Image Replacement ───────────────────────────────────────────────────────────

/**
 * Exact URLs to replace in the SmoothSpine template.
 * WHY: We match FULL exact URLs only — never fragments — to avoid replacing
 *      structural images (star ratings, trust badges, font icons, etc.).
 */
/**
 * Image replacement config per template.
 * WHY: Each template uses a different CDN (Shopify, Webflow) with different image URLs.
 *      We need per-template needle mappings so the right images get replaced.
 */
interface ImageReplacementMapping {
  /** Sidebar/hero product image */
  productHero?: string;
  /** Product image in CTA sections */
  productCta?: string;
  /** Comparison table product image */
  productCompare?: string;
  /** Author/doctor profile photo */
  authorPhoto?: string;
  /** Sidebar placeholder image (1x1 etc) */
  sidebarPlaceholder?: string;
  /** Comment/review screenshot images */
  commentScreenshots: string[];
  /** Reason block images (10 images for 10 reasons) */
  reasonImages: string[];
  // Product-page-specific fields
  /** Dark variant logo (nav bar) */
  logoDark?: string;
  /** White variant logo (footer, sticky) */
  logoWhite?: string;
  /** Multiple product detail images */
  productImages?: string[];
  /** Review avatar image */
  reviewAvatar?: string;
  /** Video URL needle substrings — all matching src get replaced */
  videoNeedles?: string[];
}

const TEMPLATE_IMAGE_MAP: Record<string, ImageReplacementMapping> = {
  'smoothspire-advertorial': {
    productHero: '1768413682017_Hero_Image_4_.png',
    productCta: '1752684886365_Design_sans_titre__18__removebg_preview.png',
    commentScreenshots: [
      '1753108886217_Screenshot_6.png',
      '1753108854342_Screenshot_2.png',
    ],
    authorPhoto: 'dr_blane_1__2_.webp',
    reasonImages: [],
  },
  'hike-reasons-why': {
    productCta: 'HF%20Stride%20Transparant',
    productCompare: 'HIKE_FOOTWEAR_BLACK',
    authorPhoto: 'Lorax%20Pro%20Barefoot',
    sidebarPlaceholder: '683f59f83bf92662dad61988_1x1',
    commentScreenshots: [
      'Customer_review_image_5',
    ],
    reasonImages: [
      // 5 remaining image-only reasons (3, 5, 7, 9, 10) use portrait placeholder
      'placehold.co/766x883',
    ],
    // Video slots for reasons 1, 2, 4, 6, 8 — SRC needles in <source> tags
    videoNeedles: ['VIDEO_SLOT'],
  },
  'product-page-tryemsense': {
    // WHY: Product page has nav logo, footer logo, doctor photo, product images, and videos
    // Nav logo handled by logoDark/logoWhite below — NOT productHero (which uses squareUrl)
    productHero: '',
    productCta: 'media-change-the-product-device-in-m',
    // WHY: productCompare is the "Our Product" image in the comparison table
    productCompare: '(p_EM1112-5)(cp_PM)(c_MI)(y_25)(w_47)(a_Advertorial).avif',
    authorPhoto: 'drol.avif',
    sidebarPlaceholder: '',
    commentScreenshots: [],
    reasonImages: [],
    // Product-page-specific: footer logo (white), product detail images
    logoDark: 'EMSense%20logo.svg',
    logoWhite: 'EMSense%20logo%20white.svg',
    // WHY: Replace product detail images + competitor image in comparison table
    productImages: [
      'ola.avif',
    ],
    // WHY: Reviewer avatars use CDN URLs — load fine in HTTPS production.
    //      No replacement needed at generation time.
    reviewAvatar: '',
    // Video URLs (all pagepipeline videos are product-specific)
    videoNeedles: [
      'cdn2.pagepipeline.com/videos/',
    ],
  },
  'checkout-clarifion': {
    // WHY: Checkout images are ALL handled by markers (gallery, bundle, logo, etc.)
    //      No needle-based replacement needed.
    productHero: '',
    productCta: '',
    productCompare: '',
    authorPhoto: '',
    sidebarPlaceholder: '',
    commentScreenshots: [],
    reasonImages: [],
    productImages: [],
    reviewAvatar: '',
    videoNeedles: [],
  },
  'upsell-vibriance': {
    // WHY: Upsell images are ALL handled by markers (logo_image_url, product_image_url).
    //      Only 2 images on the page — logo and product bundle image.
    productHero: '',
    productCta: '',
    productCompare: '',
    authorPhoto: '',
    sidebarPlaceholder: '',
    commentScreenshots: [],
    reasonImages: [],
    productImages: [],
    reviewAvatar: '',
    videoNeedles: [],
  },
  'upsell-cross-sell': {
    // WHY: Cross-sell upsell (OTO2) images handled by markers.
    productHero: '',
    productCta: '',
    productCompare: '',
    authorPhoto: '',
    sidebarPlaceholder: '',
    commentScreenshots: [],
    reasonImages: [],
    productImages: [],
    reviewAvatar: '',
    videoNeedles: [],
  },
  'upsell-product': {
    // WHY: Product upsell (OTO3-4) images handled by markers (logo_image_url, product_image_url, product_image_url_cta).
    productHero: '',
    productCta: '',
    productCompare: '',
    authorPhoto: '',
    sidebarPlaceholder: '',
    commentScreenshots: [],
    reasonImages: [],
    productImages: [],
    reviewAvatar: '',
    videoNeedles: [],
  },
  'upsell-protection': {
    // WHY: Protection upsell (OTO5) images handled by markers (logo_image_url, product_image_url).
    productHero: '',
    productCta: '',
    productCompare: '',
    authorPhoto: '',
    sidebarPlaceholder: '',
    commentScreenshots: [],
    reasonImages: [],
    productImages: [],
    reviewAvatar: '',
    videoNeedles: [],
  },
  'thank-you-page-smoothspine': {
    // WHY: Thank you page images are ALL handled by markers (flag, hero, product,
    //      guide_1, guide_2, community, trust badges). No needle-based replacement needed.
    productHero: '',
    productCta: '',
    productCompare: '',
    authorPhoto: '',
    sidebarPlaceholder: '',
    commentScreenshots: [],
    reasonImages: [],
    productImages: [],
    reviewAvatar: '',
    videoNeedles: [],
  },
};

const VIDEO_URL_NEEDLE = 'cdn.shopify.com/videos/c/o/v/4ee79c098d64428db2bcd603d759dc4f.mp4';

/**
 * Replace product-specific images based on template ID.
 * WHY: Each template has hardcoded images from the original product.
 *      We match unique needle substrings so only the right images get replaced.
 *      Does NOT touch star ratings, trust badges, UI icons, fonts, or structural images.
 */
function replaceImages(html: string, content: ContentMap, templateId: string): string {
  const productImageUrl = extractString(content['_productImageUrl']);
  const productImageSquareUrl = extractString(content['_productImageSquareUrl']);
  const doctorImageUrl = extractString(content['_doctorImageUrl']);
  const logoUrl = extractString(content['_logoUrl']);
  const commentUrls = (content['_commentScreenshotUrls'] as string[]) ?? [];
  const videoReplacementUrl = extractString(content['_productVideoUrl']);
  const videoUrls = (content['_productVideoUrls'] as string[]) ?? [];
  const useVideos = String(content['_useVideos'] ?? '') === 'true';

  const mapping = TEMPLATE_IMAGE_MAP[templateId];
  if (!mapping) {
    // Unknown template — no image replacement
    return html;
  }

  const squareUrl = productImageSquareUrl || productImageUrl;

  // ─── Product images (CTA sections, hero, sidebar) ─────────────────────────
  // WHY: Product images appear in multiple locations — CTA sections, sidebar, comparison table.
  if (mapping.productCta && squareUrl) {
    html = replaceExactUrl(html, mapping.productCta, squareUrl);
  }
  if (mapping.productHero && squareUrl) {
    html = replaceExactUrl(html, mapping.productHero, squareUrl);
  }
  if (mapping.productCompare && productImageUrl) {
    html = replaceExactUrl(html, mapping.productCompare, productImageUrl);
  }

  // ─── Sidebar placeholder (1x1.svg etc) → product image ──────────────────
  if (mapping.sidebarPlaceholder && squareUrl) {
    html = replaceExactUrl(html, mapping.sidebarPlaceholder, squareUrl);
  }

  // ─── Author photo ────────────────────────────────────────────────────────
  if (mapping.authorPhoto && doctorImageUrl) {
    html = replaceExactUrl(html, mapping.authorPhoto, doctorImageUrl);
  }

  // ─── Comment/review screenshots ──────────────────────────────────────────
  for (let i = 0; i < mapping.commentScreenshots.length && i < commentUrls.length; i++) {
    html = replaceExactUrl(html, mapping.commentScreenshots[i], commentUrls[i]);
  }

  // ─── Reason block images (10 images for 10 reasons) ──────────────────────
  // WHY: Each reason has an image. All should show the new product.
  //      Use productImageUrl for all reason images (landscape 16:9).
  if (mapping.reasonImages.length > 0 && productImageUrl) {
    for (const needle of mapping.reasonImages) {
      html = replaceExactUrl(html, needle, productImageUrl);
    }
  }

  // ─── SmoothSpire-specific: Video → image replacement ─────────────────────
  if (templateId === 'smoothspire-advertorial' && !useVideos && productImageUrl) {
    // MODE IMAGE (default): Replace entire video block with image
    html = replaceVideoWithImage(html, VIDEO_URL_NEEDLE, productImageUrl);
  }

  // ─── Hike-reasons-why-specific: Video slots → images ──────────────────────
  // WHY: Hike template has 5 <video> tags (reasons 1, 2, 4, 6, 8) with VIDEO_SLOT needles.
  //      In image mode, replace each video with <img> using productImageUrl.
  if (templateId === 'hike-reasons-why' && !useVideos && productImageUrl) {
    html = html.replace(
      /<video[^>]*>\s*<source[^>]*VIDEO_SLOT[^>]*>\s*<\/video>/gi,
      `<img src="${productImageUrl}" alt="" style="width: 100%; max-width: 766px; aspect-ratio: 766/883; object-fit: cover; border-radius: 12px;" loading="lazy">`
    );
  }

  // ─── Product-page-specific: logos, detail images, avatars ────────────────

  if (mapping.logoDark && logoUrl) {
    html = replaceExactUrl(html, mapping.logoDark, logoUrl);
  }
  if (mapping.logoWhite && logoUrl) {
    html = replaceExactUrl(html, mapping.logoWhite, logoUrl);
  }

  if (mapping.productImages && mapping.productImages.length > 0 && productImageUrl) {
    for (const needle of mapping.productImages) {
      html = replaceExactUrl(html, needle, productImageUrl);
    }
  }

  if (mapping.reviewAvatar && productImageUrl) {
    html = replaceExactUrl(html, mapping.reviewAvatar, productImageUrl);
  }

  // ─── Product-page-specific: w-embed video containers → image ──────────────
  // WHY: Product page has video containers with w-embed inner divs showing wrong product.
  //      In image mode, replace inner <video> with <img>, keeping container structure.
  if (templateId === 'product-page-tryemsense' && !useVideos && productImageUrl) {
    html = html.replace(
      /(<div class="(?:int-embeded-video|int-nu-top-card-video-embed) w-embed">)\s*<video[^>]*>[\s\S]*?<\/video>\s*(<\/div>)/gi,
      `$1<img src="${productImageUrl}" alt="" style="width:100%;height:100%;object-fit:cover;">$2`
    );
  }

  // ─── UNIVERSAL VIDEO MODE (all templates) ───────────────────────────────
  // WHY: When useVideos=true, replace all video source URLs with provided .mp4 URLs
  //      and ensure every <video> tag has GIF-like attributes:
  //      autoplay + loop + muted + playsinline (iPhone) + preload="auto" (CDN R2)
  if (useVideos) {
    const mp4Urls = videoUrls.length > 0 ? videoUrls : (videoReplacementUrl ? [videoReplacementUrl] : []);
    const needles = mapping.videoNeedles ?? ['cdn2.pagepipeline.com/videos/'];

    if (mp4Urls.length > 0) {
      // Replace all video source URLs with provided .mp4 URLs (cycle if fewer)
      for (const needle of needles) {
        for (let i = 0; i < mp4Urls.length; i++) {
          html = replaceVideoSrc(html, needle, mp4Urls[i % mp4Urls.length]);
        }
      }
    }

    // Inject GIF-like attributes on ALL <video> tags across the entire HTML
    html = ensureVideoAutoplayGif(html);
  }

  return html;
}

/**
 * Ensure ALL <video> tags have GIF-like autoplay attributes.
 * WHY: Videos must loop like GIFs without play button or sound.
 *      playsinline is CRITICAL for iPhone (without it, iOS opens fullscreen).
 *      preload="auto" ensures instant playback with CDN R2.
 */
function ensureVideoAutoplayGif(html: string): string {
  return html.replace(
    /<video([^>]*?)>/gi,
    (_match, attrs: string) => {
      let updated = attrs;
      if (!/\bautoplay\b/i.test(updated)) updated += ' autoplay';
      if (!/\bloop\b/i.test(updated)) updated += ' loop';
      if (!/\bmuted\b/i.test(updated)) updated += ' muted';
      if (!/\bplaysinline\b/i.test(updated)) updated += ' playsinline';
      if (!/\bpreload\b/i.test(updated)) updated += ' preload="auto"';
      return `<video${updated}>`;
    }
  );
}

/**
 * Replace URL in src/href/poster attributes — exact needle matching only.
 * WHY: We match a UNIQUE needle substring that appears only in the target image URL.
 *      This prevents accidentally replacing star ratings, trust badges, etc.
 */
function replaceExactUrl(html: string, needle: string, newUrl: string): string {
  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Match src="...needle..." or srcset="...needle..." or poster="...needle..." or data-src="...needle..."
  // WHY: Some templates use data-src for lazy-loaded images (e.g. SmoothSpire review screenshots).
  const regex = new RegExp(`((?:src|srcset|poster|href|data-src)=["'])[^"']*${escaped}[^"']*(["'])`, 'gi');
  return html.replace(regex, `$1${newUrl}$2`);
}

/**
 * Replace a <video> element with an <img> element.
 * WHY: The template has a product video under the headline. We don't have a video
 *      for the new product, so we replace the entire video element with a product image.
 * NOTE: The video URL is in the src="" attribute of <video>, and closing tags use <\video> <\div>.
 */
function replaceVideoWithImage(html: string, videoUrlNeedle: string, imageUrl: string): string {
  const escaped = videoUrlNeedle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Match the full <div><video src="url"...>...closing...</div> block
  // The URL is inside the src attribute, not between tags
  // Handle both </video> and <\video>, </div> and <\div>
  const closeVideo = '(?:<\\/video>|<\\\\video>)';
  const closeDiv = '(?:<\\/div>|<\\\\div>)';

  // Pattern: <div...><video ...src="url"...>...closing tags...</div>
  const videoPattern = new RegExp(
    `<div[^>]*>\\s*<video[^>]*src=["'][^"']*${escaped}[^"']*["'][^>]*>[\\s\\S]*?${closeVideo}\\s*${closeDiv}`,
    'gi'
  );

  const imageReplacement = `<div data-secondsdelay="" class="main_img_1"><img src="${imageUrl}" alt="" href="" title="" target="_self" align="center" width="" height="" onclick="" class="fk-disable-lazy disable-fk-lazy"></div>`;

  if (videoPattern.test(html)) {
    html = html.replace(videoPattern, imageReplacement);
  } else {
    // Fallback: replace just the <video> tag (URL in src attribute)
    // Find position of video URL, expand to containing <div>
    const urlIdx = html.indexOf(videoUrlNeedle);
    if (urlIdx !== -1) {
      // Go back to find <div> wrapper
      const divStart = html.lastIndexOf('<div', urlIdx);
      // Find closing tags after the URL
      const afterUrl = html.substring(urlIdx);
      const videoCloseMatch = afterUrl.match(/(?:<\/video>|<\\video>)/i);
      if (divStart !== -1 && videoCloseMatch) {
        const endIdx = urlIdx + videoCloseMatch.index! + videoCloseMatch[0].length;
        // Check if </div> follows immediately
        const afterVideoClose = html.substring(endIdx, endIdx + 20).trim();
        const finalEnd = afterVideoClose.startsWith('</div>') || afterVideoClose.startsWith('<\\div>')
          ? endIdx + (afterVideoClose.startsWith('</div>') ? 6 : 6)
          : endIdx;
        html = html.substring(0, divStart) + imageReplacement + html.substring(finalEnd);
      }
    }
  }

  return html;
}

/**
 * Replace video src URLs matching a needle substring.
 * WHY: Product page templates have multiple <video> and <source> tags
 *      with product-specific video URLs. We replace all matching src URLs.
 */
function replaceVideoSrc(html: string, needle: string, newUrl: string): string {
  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Match src="...needle..." in <video> and <source> tags
  const regex = new RegExp(`((?:src)=["'])[^"']*${escaped}[^"']*(["'])`, 'gi');
  return html.replace(regex, `$1${newUrl}$2`);
}

/**
 * Replace ALL video container blocks in the HTML with a static product image.
 * WHY: Product page templates have 5+ video containers showing the original product.
 *      When generating for a different product, we can't use those videos.
 *      We replace each ENTIRE video container (wrapper divs + video + inner divs)
 *      with a single <img> tag. Replacing only the <video> tag breaks the layout
 *      because the Webflow CSS expects the full container structure.
 */
function replaceAllVideosWithImage(html: string, imageUrl: string): string {
  let result = html;

  // Pattern 1: Webflow background video containers
  // <div ... class="int-embeded-video-container ..."><video ...>...</video><div class="int-embeded-video w-embed"><video ...>...</video></div></div>
  // Replace the ENTIRE outer container with just an <img>
  result = result.replace(
    /<div[^>]*class="[^"]*int-embeded-video-container[^"]*"[^>]*>[\s\S]*?<\/div>\s*<\/div>/gi,
    `<img src="${imageUrl}" alt="" style="width: 100%; height: 100%; object-fit: cover; border-radius: inherit;">`
  );

  // Pattern 2: Any remaining standalone <video> tags
  result = result.replace(
    /<video[^>]*>[\s\S]*?<\/video>/gi,
    ''
  );

  // Clean up leftover text
  result = result.replace(/Your browser does not support the video tag\.?/gi, '');

  return result;
}

/**
 * Build an image div to insert below a section heading.
 * WHY: Zone replacement strips all original media from between headings.
 *      We re-insert a product image below each section heading.
 * FORMAT: Matches original winner template dimensions — 1264x711 (16:9 horizontal).
 *         Uses main_img_1 class for layout + explicit width/height for correct aspect ratio.
 */
function buildSectionImage(imageUrl: string): string {
  return `<div data-secondsdelay="" class="main_img_1"><img src="${imageUrl}" alt="" href="" title="" target="_self" align="center" width="" height="" onclick="" class="fk-disable-lazy disable-fk-lazy"></div>`;
}

function extractString(value: string | string[] | Record<string, string>[] | undefined): string {
  if (typeof value === 'string') return value;
  return '';
}

// ─── Comment Cleanup ───────────────────────────────────────────────────────────

/**
 * Replace product-specific fake Facebook comments with product-agnostic versions.
 * WHY: The template has 16+ fake FB comments referencing SmoothSpine/back pain.
 *      Judges penalize incongruence (gut health article + back pain comments).
 *      We keep the comment structure but replace the text content.
 */
function cleanFakeComments(html: string, productName: string): string {
  // Map of regex patterns → replacement strings
  // WHY regex: The template uses curly quotes (\u2019 = ') instead of straight apostrophes.
  //      String .includes() fails because '\u2019' !== "'". Regex handles both.
  // WHY after marker replacement: {{product_name}} is already replaced by actual name.
  const name = productName || 'this';
  // Escape name for regex (in case it has special chars)
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const replacements: [RegExp, string][] = [
    // "walking better" → "feeling better"
    [new RegExp(`she.s walking better than she has in years with the ${escapedName}`, 'g'),
     `she's feeling better than she has in years`],
    // "steady on my feet" → "the difference is incredible"
    [new RegExp(`My granddaughter actually showed me the ${escapedName}\\. I didn.t believe it at first, but after just a few uses, I feel steady on my feet again!`, 'g'),
     `My granddaughter actually showed me the ${name}. I didn't believe it at first, but after just a few uses, the difference is incredible!`],
    // "My back hasn't felt like this in YEARS" → generic
    [/I.ve been using it for three weeks now and I.m honestly shocked\. No more burning, and I can finally sleep through the night\. My back hasn.t felt like this in YEARS\./g,
     `I've been using it for three weeks now and I'm honestly shocked. The results are incredible and I can finally sleep through the night. This has changed everything for me.`],
    // "My back has been killing me" → generic
    [/I really want to test this out\. My back has been killing me lately\./g,
     `I really want to try this out. I've been struggling with this issue for a while now.`],
    // "nerve pain" → generic
    [/Your dad will love it! It.s the perfect gift if he.s been struggling with nerve pain\./g,
     `Your dad will love it! It's the perfect gift if he's been struggling with those issues.`],
    // "this device" → "this"
    [/this device is worth every penny/g,
     'this is worth every penny'],
  ];

  for (const [pattern, replacement] of replacements) {
    html = html.replace(pattern, replacement);
  }

  return html;
}

// ─── Utility Functions ─────────────────────────────────────────────────────────

export function listTemplates(): string[] {
  if (!existsSync(TEMPLATES_DIR)) return [];
  const fs = require('fs');
  return fs.readdirSync(TEMPLATES_DIR)
    .filter((f: string) => f.endsWith('.html') && !f.endsWith('.html.json'))
    .map((f: string) => f.replace('.html', ''));
}

export function getTemplateInfo(templateId: string): {
  id: string;
  source: string;
  description: string;
  aiSlotsCount: number;
  manualSlotsCount: number;
  totalSlotsCount: number;
} {
  const config = loadTemplateConfig(templateId);
  const slots = Object.values(config.slots);
  return {
    id: config.templateId,
    source: config.source,
    description: config.description,
    aiSlotsCount: slots.filter(s => s.ai_generated).length,
    manualSlotsCount: slots.filter(s => !s.ai_generated).length,
    totalSlotsCount: slots.length,
  };
}
