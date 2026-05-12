/**
 * Purpose: Test OTO5 protection upsell (Porch Pirates) with upsell-protection template.
 * Run: npx tsx scripts/test-upsell-oto5.ts
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
  name: 'Porch Pirates Protection',
  description: 'Full package protection against theft, loss, and damage during shipping. If your package is stolen from your porch, lost in transit, or arrives damaged — we will replace it immediately at no extra cost. Peace of mind for your entire order.',
  niche: 'Package Protection / Insurance',
  targetAudience: 'Online shoppers who want peace of mind for their delivery',
  benefits: [
    'Full replacement if package is stolen from porch',
    'Immediate resend if package is lost in transit',
    'Free replacement for damaged items on arrival',
    'Covers your ENTIRE order value',
    'No hassle claims — one email, instant resolution',
  ],
  price: '$4.95',
  originalPrice: '$9.95',
  discountPct: '50%',
  guarantee: 'Full Coverage Guarantee — package replaced or money back',
  offerQty: 1,
  offerUnitPrice: '$4.95',
  offerTotalPrice: '$4.95',
  retailUnitPrice: '$9.95',
  retailTotalPrice: '$9.95',
  countdownMinutes: '10',
  currencyLabel: 'USD',
  logoUrl: 'https://placehold.co/160x40/30bd51/ffffff?text=Vibriance',
  productImageUrl: 'https://placehold.co/600x600/ffffff/F59E0B?text=Package+Protection',
  // OTO sequence fields
  otoPosition: 5,
  upsellType: 'protection',
  previousProduct: 'Vibriance Moisturizing Cream',
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
  console.log('=== OTO5 Protection Test (Porch Pirates) ===\n');
  console.log(`Product: ${TEST_BRIEF.name}`);
  console.log(`Position: OTO5 (upsell-protection template)`);
  console.log(`Price: ${TEST_BRIEF.offerTotalPrice}\n`);

  if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });

  const config = getConfig();
  const result = await generateFromTemplate('upsell-protection', TEST_BRIEF, config, OUTPUT_DIR);

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
