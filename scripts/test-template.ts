/**
 * Purpose: Test script for the template engine. Loads SmoothSpire template,
 *          fills with sample content, saves to test-output/.
 * Dependencies: template-engine.ts, templates/smoothspire-advertorial.html
 *
 * Run: npx tsx scripts/test-template.ts
 */

import { fillTemplate, saveFilledTemplate, getTemplateInfo, listTemplates } from '../src/services/template-engine';
import { mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const OUTPUT_DIR = join(process.cwd(), 'test-output');

async function main() {
  console.log('=== Template Engine Test ===\n');

  // List available templates
  const templates = listTemplates();
  console.log(`Available templates: ${templates.join(', ')}\n`);

  // Get template info
  const info = getTemplateInfo('smoothspire-advertorial');
  console.log(`Template: ${info.id}`);
  console.log(`Source: ${info.source}`);
  console.log(`AI slots: ${info.aiSlotsCount} | Manual slots: ${info.manualSlotsCount} | Total: ${info.totalSlotsCount}\n`);

  // Sample content for testing (minimal set to verify replacement works)
  const sampleContent = {
    header_category_badge: "Trending in 'Wellness'",
    headline: "Top Dermatologist: \"This Is the Fastest Way to Erase Wrinkles for Good\"",
    product_name: "GlowRevive Youth Serum",
    cta_text: "Claim Your Bottle Now \u2192",
    product_price: "$49.95",
    product_original_price: "$129.95",
    product_discount_pct: "62% OFF",
    hero_rating_text: "4,892 Ratings",
    sidebar_product_title: "Finally! Get Youthful Skin at Any Age!",
  };

  console.log('Filling template with sample content...');
  const result = fillTemplate('smoothspire-advertorial', sampleContent, 'smart');

  console.log(`\nResults:`);
  console.log(`  Slots filled: ${result.slotsFilled}`);
  console.log(`  Warnings: ${result.warnings.length}`);
  result.warnings.forEach(w => console.log(`    - ${w}`));

  // Save output
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const outputPath = join(OUTPUT_DIR, 'template-smoothspire-test.html');
  saveFilledTemplate(result, outputPath);

  console.log(`\nOutput saved to: ${outputPath}`);
  console.log(`File size: ${(Buffer.byteLength(result.html) / 1024).toFixed(0)} KB`);
  console.log('\n=== Test Complete ===');
}

main().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
