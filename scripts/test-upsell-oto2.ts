/**
 * Purpose: Test OTO2 cross-sell upsell (Retinol Serum) with position-aware prompt.
 * Run: npx tsx scripts/test-upsell-oto2.ts
 */

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
import type { ProductBrief } from '../src/agents/prompts/template-filler';
import { existsSync, mkdirSync, readFileSync } from 'fs';
import { join } from 'path';

const OUTPUT_DIR = join(process.cwd(), 'test-output');

const TEST_BRIEF: ProductBrief & Record<string, any> = {
  name: 'Vibriance Retinol Serum',
  description: 'First and ONLY retinol serum made exclusively for delicate mature skin of women over 50. Stimulates natural skin collagen while reducing DEEP WRINKLES using Poly-Pore slow-release technology.',
  niche: 'Skincare / Anti-Aging',
  targetAudience: 'Women 50+ with mature skin: deep wrinkles, sagging, enlarged pores, fine lines',
  benefits: [
    'Lifts sagging skin with slow-release retinol',
    'Reduces DEEP WRINKLES using Poly-Pore Technology',
    'Shrinks enlarged pores',
    'Stimulates natural collagen production',
    'Minimizes irritation with slow-release formula',
  ],
  price: '$32.00',
  originalPrice: '$42.67',
  discountPct: '25%',
  guarantee: '1-Year "Bottom of the Bottle" Money-Back Guarantee',
  offerQty: 1,
  offerUnitPrice: '$32.00',
  offerTotalPrice: '$32.00',
  retailUnitPrice: '$42.67',
  retailTotalPrice: '$42.67',
  countdownMinutes: '10',
  currencyLabel: 'USD',
  logoUrl: 'https://placehold.co/160x40/30bd51/ffffff?text=Vibriance',
  productImageUrl: 'https://placehold.co/600x600/ffffff/8B5CF6?text=Retinol+Serum',
  // OTO sequence fields
  otoPosition: 2,
  upsellType: 'cross_sell',
  previousProduct: 'Vibriance Super C Serum',
};

// WHY: Shared config uses MiMo (FREE, CHAMPION). See scripts/api-config.ts.
import { getConfig } from './api-config';

async function main() {
  console.log('=== OTO2 Cross-Sell Test (Retinol Serum) ===\n');
  console.log(`Product: ${TEST_BRIEF.name}`);
  console.log(`Position: OTO2 (cross_sell)`);
  console.log(`Previous: ${TEST_BRIEF.previousProduct}`);
  console.log(`Price: ${TEST_BRIEF.offerTotalPrice} (${TEST_BRIEF.discountPct} OFF)\n`);

  if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });

  const config = getConfig();
  const result = await generateFromTemplate('upsell-cross-sell', TEST_BRIEF, config, OUTPUT_DIR);

  console.log('\n=== Results ===');
  console.log(`Success: ${result.success}`);
  console.log(`Duration: ${result.duration}s`);
  console.log(`Tokens: ${result.tokensUsed}`);
  console.log(`Slots filled: ${result.slotsFilled} / empty: ${result.slotsEmpty}`);

  if (result.error) {
    console.error(`Error: ${result.error}`);
    process.exit(1);
  }

  // Copy to public for preview
  const publicPath = join(process.cwd(), 'public', 'upsell-preview.html');
  fs.writeFileSync(publicPath, readFileSync(result.outputPath, 'utf-8'));
  console.log(`\nPreview: /api/upsell-preview`);

  // Extract and show generated text
  const html = readFileSync(result.outputPath, 'utf-8');
  const text = html
    .replace(/<script[^>]*>.*?<\/script>/gs, '')
    .replace(/<style[^>]*>.*?<\/style>/gs, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  console.log('\n=== Generated Copy ===');
  console.log(text.substring(0, 1500));
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
