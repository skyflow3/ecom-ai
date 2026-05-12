/**
 * Purpose: Test OTO3 product upsell (Eye Renewal Serum) with upsell-product template.
 * Run: npx tsx scripts/test-upsell-oto3.ts
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
  name: 'Vibriance Eye Renewal Serum',
  description: 'Targeted eye serum that erases crow\'s feet, dark circles, and under-eye bags. Formulated with peptides and caffeine to instantly tighten and brighten the delicate eye area for women over 50.',
  niche: 'Skincare / Anti-Aging / Eye Care',
  targetAudience: 'Women 50+ with mature skin: crow\'s feet, dark circles, under-eye bags, puffiness',
  benefits: [
    'Erases crow\'s feet and fine lines around eyes',
    'Eliminates dark circles and under-eye discoloration',
    'Reduces puffiness and under-eye bags',
    'Instantly tightens and lifts the eye area',
    'Peptide + caffeine formula targets delicate eye skin',
  ],
  price: '$34.20',
  originalPrice: '$53.44',
  discountPct: '36%',
  guarantee: '1-Year "Bottom of the Bottle" Money-Back Guarantee',
  offerQty: 1,
  offerUnitPrice: '$34.20',
  offerTotalPrice: '$34.20',
  retailUnitPrice: '$53.44',
  retailTotalPrice: '$53.44',
  countdownMinutes: '10',
  currencyLabel: 'USD',
  logoUrl: 'https://placehold.co/160x40/30bd51/ffffff?text=Vibriance',
  productImageUrl: 'https://placehold.co/600x600/ffffff/06B6D4?text=Eye+Renewal+Serum',
  // OTO sequence fields
  otoPosition: 3,
  upsellType: 'cross_sell',
  previousProduct: 'Vibriance Retinol Serum',
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
  console.log('=== OTO3 Product Upsell Test (Eye Renewal Serum) ===\n');
  console.log(`Product: ${TEST_BRIEF.name}`);
  console.log(`Position: OTO3 (upsell-product template)`);
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
