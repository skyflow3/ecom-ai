/**
 * Purpose: Test OTO4 product upsell (Moisturizing Cream) with upsell-product template.
 * Run: npx tsx scripts/test-upsell-oto4.ts
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
  name: 'Vibriance Moisturizing Cream',
  description: 'Deep hydration cream specifically formulated for mature skin. Locks in moisture, plumps fine lines, and creates a protective barrier against dryness. Perfect companion to any Vibriance serum.',
  niche: 'Skincare / Anti-Aging / Hydration',
  targetAudience: 'Women 50+ with mature skin: dry skin, flakiness, tightness, dehydration lines',
  benefits: [
    'Locks in moisture for 72-hour hydration',
    'Plumps fine lines caused by dehydration',
    'Creates protective barrier against environmental damage',
    'Absorbs instantly without greasy residue',
    'Specially formulated to complement Vibriance serums',
  ],
  price: '$24.00',
  originalPrice: '$34.29',
  discountPct: '30%',
  guarantee: '1-Year "Bottom of the Bottle" Money-Back Guarantee',
  offerQty: 1,
  offerUnitPrice: '$24.00',
  offerTotalPrice: '$24.00',
  retailUnitPrice: '$34.29',
  retailTotalPrice: '$34.29',
  countdownMinutes: '10',
  currencyLabel: 'USD',
  logoUrl: 'https://placehold.co/160x40/30bd51/ffffff?text=Vibriance',
  productImageUrl: 'https://placehold.co/600x600/ffffff/10B981?text=Moisturizing+Cream',
  // OTO sequence fields
  otoPosition: 4,
  upsellType: 'cross_sell',
  previousProduct: 'Vibriance Eye Renewal Serum',
};

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

async function main() {
  console.log('=== OTO4 Product Upsell Test (Moisturizing Cream) ===\n');
  console.log(`Product: ${TEST_BRIEF.name}`);
  console.log(`Position: OTO4 (upsell-product template)`);
  console.log(`Previous: ${TEST_BRIEF.previousProduct}`);
  console.log(`Price: ${TEST_BRIEF.offerTotalPrice} (${TEST_BRIEF.discountPct} OFF)\n`);

  if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });

  const config = getConfig();
  const result = await generateFromTemplate('upsell-product', TEST_BRIEF, config, OUTPUT_DIR);

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
