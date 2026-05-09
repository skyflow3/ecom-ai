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

  return { html, templateId, slotsFilled, slotsEmpty, warnings };
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
    const value = content[slotName];
    if (html.includes(marker)) {
      if (value !== undefined) {
        html = html.split(marker).join(typeof value === 'string' ? value : String(value));
        slotsFilled++;
      } else {
        slotsEmpty++;
      }
    }
  }

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
