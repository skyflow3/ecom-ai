/**
 * Purpose: Inject {{section_N_paragraphs}} markers into the marked HTML.
 *          Builds on top of the existing heading markers from inject-markers.ts.
 *          Replaces ALL text content between H2 headings with paragraph markers,
 *          while keeping media elements (videos, images) intact.
 *
 * Run: npx tsx scripts/inject-section-content-markers.ts
 *
 * WHY: The first version only replaced headings. But 90% of the content is
 *      the body paragraphs — those MUST be replaced too for the template
 *      system to work. This script adds {{section_N_paragraphs}} markers
 *      between each section heading.
 */

import * as fs from 'fs';
import * as path from 'path';

const TEMPLATE_DIR = path.join(__dirname, '..', 'templates');
const SRC_FILE = path.join(TEMPLATE_DIR, 'smoothspire-advertorial.marked.html');
const DST_FILE = path.join(TEMPLATE_DIR, 'smoothspire-advertorial.marked.html');

function main() {
  console.log('Reading marked template...');
  let html = fs.readFileSync(SRC_FILE, 'utf-8');
  console.log(`Size: ${(html.length / 1024).toFixed(0)} KB\n`);

  let totalReplaced = 0;

  // ─── Strategy ──────────────────────────────────────────────────────────
  // For each section N (1-14):
  //   1. Find </h2> after {{section_N_heading}}
  //   2. Find the next <h2 before {{section_N+1_heading}} (or end marker)
  //   3. Within that range, keep <div> with video/img, replace rest with marker
  //
  // Also handle:
  //   - opening_paragraphs: between byline and section_1
  //   - closing_paragraphs: after section_14 content

  const sections = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

  // Process sections in REVERSE order so offsets don't shift
  for (let i = sections.length - 1; i >= 0; i--) {
    const n = sections[i];
    const headingMarker = `{{section_${n}_heading}}`;

    // Find the position right after </h2> for this section's heading
    const headingIdx = html.indexOf(headingMarker);
    if (headingIdx === -1) {
      console.log(`  SKIP section_${n}: heading marker not found`);
      continue;
    }

    // Find the closing </h2> after the marker
    const h2Close = html.indexOf('</h2>', headingIdx);
    if (h2Close === -1) {
      console.log(`  SKIP section_${n}: </h2> not found`);
      continue;
    }

    const sectionStart = h2Close + '</h2>'.length;

    // Find the next section heading (or end of content area)
    let sectionEnd: number;
    if (i < sections.length - 1) {
      const nextN = sections[i + 1];
      const nextMarker = `{{section_${nextN}_heading}}`;
      const nextIdx = html.indexOf(nextMarker, sectionStart);
      if (nextIdx === -1) {
        console.log(`  SKIP section_${n}: next heading not found`);
        continue;
      }
      // Go back to find the <h2 before the next marker
      sectionEnd = html.lastIndexOf('</h2>', nextIdx);
      if (sectionEnd === -1 || sectionEnd < sectionStart) {
        // Try finding <h2 before the next marker
        sectionEnd = html.lastIndexOf('<h2', nextIdx);
        if (sectionEnd === -1 || sectionEnd < sectionStart) {
          console.log(`  SKIP section_${n}: section boundary unclear`);
          continue;
        }
      }
      // Actually we want everything up to but NOT including the content before next <h2
      // Let's find the last </p> or </div> or </ul> before the next <h2
      // Simpler: find the <h2 tag that contains the next marker
      const nextH2Idx = html.lastIndexOf('<h2', nextIdx);
      if (nextH2Idx > sectionStart) {
        sectionEnd = nextH2Idx;
      } else {
        sectionEnd = nextIdx;
      }
    } else {
      // Last section — find a reasonable end point
      // Look for the testimonials or CTA area markers
      const endMarkers = ['{{cta_text}}', 'data-fbcomment', 'comments-area', 'trust-badges'];
      sectionEnd = html.length;
      for (const em of endMarkers) {
        const emIdx = html.indexOf(em, sectionStart);
        if (emIdx !== -1 && emIdx < sectionEnd) {
          sectionEnd = emIdx;
        }
      }
    }

    // Extract the section content
    const sectionContent = html.substring(sectionStart, sectionEnd);

    // Now split this content: keep media divs, replace text content with marker
    // Strategy: find all <div...><video...></div> and <div...><img...></div>, keep them
    // Replace everything else with {{section_N_paragraphs}}

    // Extract media elements (video/img divs)
    const mediaElements: string[] = [];
    let processedContent = sectionContent;

    // Find and preserve divs containing video elements
    const videoDivRegex = /<div[^>]*>\s*<video[^>]*>[\s\S]*?<\/video>\s*<\/div>/g;
    let match;
    while ((match = videoDivRegex.exec(processedContent)) !== null) {
      mediaElements.push(match[0]);
    }

    // Find and preserve divs containing img elements (not inside video divs)
    const imgDivRegex = /<div[^>]*>\s*<img[^>]*>\s*<\/div>/g;
    while ((match = imgDivRegex.exec(processedContent)) !== null) {
      if (!mediaElements.includes(match[0])) {
        mediaElements.push(match[0]);
      }
    }

    // Build replacement: media elements + paragraph marker
    const marker = `{{section_${n}_paragraphs}}`;
    let replacement: string;
    if (mediaElements.length > 0) {
      replacement = mediaElements.join('') + marker;
    } else {
      replacement = marker;
    }

    // Replace the section content
    html = html.substring(0, sectionStart) + replacement + html.substring(sectionEnd);
    totalReplaced++;

    console.log(`  OK: section_${n}_paragraphs (${mediaElements.length} media kept, ${sectionContent.length} chars replaced)`);
  }

  // ─── Handle opening paragraphs ────────────────────────────────────────
  // Find the area between byline/hero and section_1_heading
  const section1Idx = html.indexOf('{{section_1_heading}}');
  if (section1Idx !== -1) {
    // Look backwards from section_1 for the hero area end
    // The opening paragraphs are between the hero/rating area and section_1
    // Find the last </p> or </div> before section_1 that's after the byline
    const bylineIdx = html.indexOf('{{byline_text}}');
    if (bylineIdx !== -1) {
      // Find the end of the byline line (closing tags)
      const bylineEnd = html.indexOf('</p>', bylineIdx);
      if (bylineEnd !== -1) {
        const openStart = bylineEnd + '</p>'.length;
        const openEnd = html.lastIndexOf('</h2>', section1Idx);
        if (openEnd === -1 || openEnd < openStart) {
          // Find the <h2 tag for section 1
          const h2Tag = html.lastIndexOf('<h2', section1Idx);
          if (h2Tag > openStart) {
            const openingContent = html.substring(openStart, h2Tag);
            if (openingContent.trim().length > 10) {
              html = html.substring(0, openStart) + '{{opening_paragraphs}}' + html.substring(h2Tag);
              totalReplaced++;
              console.log(`  OK: opening_paragraphs (${openingContent.length} chars replaced)`);
            }
          }
        }
      }
    }
  }

  // ─── Handle closing signature ─────────────────────────────────────────
  // After section_14 content, before the end
  const section14Idx = html.indexOf('{{section_14_heading}}');
  if (section14Idx !== -1) {
    // Find where section 14 paragraphs end
    const s14ParaIdx = html.indexOf('{{section_14_paragraphs}}', section14Idx);
    if (s14ParaIdx !== -1) {
      const s14ParaEnd = s14ParaIdx + '{{section_14_paragraphs}}'.length;
      // Find the next structural element (sidebar, comments, trust badges, etc.)
      const closingMarkers = ['sidebar-product', 'data-fbcomment', 'trust-badges', '{{cta_text}}'];
      let closingEnd = html.length;
      for (const cm of closingMarkers) {
        const cmIdx = html.indexOf(cm, s14ParaEnd);
        if (cmIdx !== -1 && cmIdx < closingEnd) {
          closingEnd = cmIdx;
        }
      }

      const closingContent = html.substring(s14ParaEnd, closingEnd);
      // Only replace if there's substantial content
      const textOnly = closingContent.replace(/<[^>]+>/g, '').trim();
      if (textOnly.length > 20) {
        html = html.substring(0, s14ParaEnd) + '{{closing_paragraphs}}' + html.substring(closingEnd);
        totalReplaced++;
        console.log(`  OK: closing_paragraphs (${textOnly.length} chars text)`);
      } else {
        console.log(`  SKIP: closing_paragraphs (only ${textOnly.length} chars text)`);
      }
    }
  }

  // Save
  fs.writeFileSync(DST_FILE, html, 'utf-8');
  console.log(`\nUpdated marked template: ${DST_FILE}`);
  console.log(`Total sections processed: ${totalReplaced}`);
  console.log(`Size: ${(html.length / 1024).toFixed(0)} KB`);
}

main();
