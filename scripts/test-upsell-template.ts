/**
 * Purpose: Test the upsell template generation pipeline.
 *          Product brief → AI content → Template fill → Output HTML → Judge.
 *
 * Run: npx tsx scripts/test-upsell-template.ts
 */

// Read .env manually
import * as fs from 'fs';
import * as path from 'path';
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.substring(0, eqIdx).trim();
    const val = trimmed.substring(eqIdx + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
}

import { generateFromTemplate } from '../src/services/template-generator';
import { getTemplateInfo } from '../src/services/template-engine';
import { judgeRawText, type JudgeResult } from '../src/services/content-judge';
import type { ProductBrief } from '../src/agents/prompts/template-filler';
import type { GeneratorConfig } from '../src/services/page-generator';
import { existsSync, mkdirSync, readFileSync } from 'fs';
import { join } from 'path';

const OUTPUT_DIR = join(process.cwd(), 'test-output');

// ─── Test Upsell Brief (Vibriance Super C Serum OTO1) ─────────────────────────

const TEST_BRIEF: ProductBrief & Record<string, any> = {
  name: 'Vibriance Super C Serum',
  description: 'A vitamin C serum that firms jowls, reduces age spots, and brightens skin. Clinically proven formula with stable vitamin C derivative.',
  niche: 'Skincare / Anti-Aging',
  targetAudience: 'Women 45+ concerned about aging signs: jowls, age spots, dull skin, fine lines',
  benefits: [
    'Firms jowls and tightens sagging skin',
    'Reduces age spots and hyperpigmentation',
    'Brightens dull complexion',
    'Smooths fine lines and wrinkles',
    'Clinically proven stable vitamin C formula',
  ],
  price: '$28.20',
  originalPrice: '$47.00',
  discountPct: '40%',
  guarantee: '1-Year "Bottom of the Bottle" Money-Back Guarantee',
  // Upsell-specific fields
  offerQty: 3,
  offerUnitPrice: '$28.20',
  offerTotalPrice: '$84.60',
  retailUnitPrice: '$47.00',
  retailTotalPrice: '$141.00',
  countdownMinutes: '10',
  currencyLabel: 'USD',
  logoUrl: 'https://placehold.co/160x40/30bd51/ffffff?text=Vibriance',
  productImageUrl: 'https://placehold.co/600x600/ffffff/FF6B35?text=Super+C+Serum+3pk',
  // OTO sequence fields (new — from OTO research)
  otoPosition: 1,          // This is OTO1 (quantity deal on same product)
  upsellType: 'same_product', // More of the same product
  previousProduct: 'Vibriance Super C Serum', // What they just bought
};

// ─── API Config ───────────────────────────────────────────────────────────────

function getConfig() {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    console.error('ERROR: DEEPSEEK_API_KEY not found in .env');
    process.exit(1);
  }

  return {
    apiUrl: process.env.DEEPSEEK_API_URL ?? 'https://api.deepseek.com/v1/chat/completions',
    apiKey,
    model: process.env.DEEPSEEK_MODEL ?? 'deepseek-chat',
    temperature: 0.5,
    maxTokens: 4096,
    maxRetries: 2,
  };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const TEMPLATE_ID = 'upsell-vibriance';

  console.log('=== Upsell Page Template Test ===\n');
  console.log(`Product: ${TEST_BRIEF.name}`);
  console.log(`Offer: ${TEST_BRIEF.offerQty}x for ${TEST_BRIEF.offerTotalPrice} (${TEST_BRIEF.offerUnitPrice} each)`);
  console.log(`Retail: ${TEST_BRIEF.retailTotalPrice} (${TEST_BRIEF.retailUnitPrice}/bottle)`);
  console.log(`Discount: ${TEST_BRIEF.discountPct}\n`);

  // Show template info
  const info = getTemplateInfo(TEMPLATE_ID);
  console.log(`Template: ${info.id}`);
  console.log(`AI slots to fill: ${info.aiSlotsCount}\n`);

  // Ensure output dir exists
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Generate!
  const config = getConfig();
  console.log(`Using model: ${config.model}`);
  console.log(`API: ${config.apiUrl}\n`);
  console.log('Generating content... (this may take 15-30 seconds)\n');

  const result = await generateFromTemplate(
    TEMPLATE_ID,
    TEST_BRIEF,
    config,
    OUTPUT_DIR
  );

  // Report results
  console.log('\n=== Results ===');
  console.log(`Success: ${result.success}`);
  console.log(`Duration: ${result.duration}s`);
  console.log(`Tokens used: ${result.tokensUsed}`);
  console.log(`Retries: ${result.retries}`);
  console.log(`Slots filled: ${result.slotsFilled}`);
  console.log(`Slots empty: ${result.slotsEmpty}`);
  console.log(`Output: ${result.outputPath}`);

  if (result.warnings.length > 0) {
    console.log(`\nWarnings (${result.warnings.length}):`);
    result.warnings.forEach(w => console.log(`  - ${w}`));
  }

  if (result.error) {
    console.error(`\nError: ${result.error}`);
    process.exit(1);
  }

  // Save a copy to public/ for live preview
  const publicPath = join(process.cwd(), 'public', 'upsell-preview.html');
  const htmlContent = readFileSync(result.outputPath, 'utf-8');
  fs.writeFileSync(publicPath, htmlContent);
  console.log(`\nLive preview copied to: ${publicPath}`);
  console.log(`Preview URL: /api/upsell-preview`);

  console.log('\n=== Done ===');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
