/**
 * Purpose: Test the thank you page template generation pipeline.
 *          Brand brief → AI content → Template fill → Section removal → Output HTML.
 *
 * Run: npx tsx scripts/test-thankyou-template.ts
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

import { generateFromTemplate, type TemplateGenerateResult } from '../src/services/template-generator';
import { getTemplateInfo } from '../src/services/template-engine';
import type { ProductBrief } from '../src/agents/prompts/template-filler';
import type { ThankYouBrief } from '../src/agents/prompts/thankyou-filler';
import { existsSync, mkdirSync, readFileSync } from 'fs';
import { join } from 'path';

const OUTPUT_DIR = join(process.cwd(), 'test-output');
const TEMPLATE_ID = 'thank-you-page-smoothspine';

// ─── Test Brand Brief ────────────────────────────────────────────────────────

const TEST_BRIEF: ThankYouBrief & ProductBrief = {
  // ProductBrief fields
  name: 'Nutrovia',
  description: 'A breakthrough gut health supplement that targets the hidden "Enzyme Starvation Cycle" — the real reason behind bloating, weight gain, and low energy after 40.',
  niche: 'Health & Wellness',
  targetAudience: 'Women 40-65 struggling with persistent bloating, unexplained weight gain, and digestive issues',
  benefits: [
    'Eliminates bloating within 14 days',
    'Melts stubborn belly fat by fixing the enzyme starvation cycle',
    'Restores natural energy without caffeine or stimulants',
    'Clinically tested formula with 47,300+ satisfied customers',
  ],
  price: '$49',
  originalPrice: '$119',
  discountPct: '58%',
  guarantee: '90-Day Money-Back Guarantee',
  mechanismName: 'Enzyme Starvation Cycle',
  authorPersona: 'Dr. Sarah Mitchell, MD',
  categoryBadge: 'Health',
  ratingCount: '4,891',

  // ThankYouBrief fields
  brandName: 'Nutrovia',
  billingName: 'Serenova Digital LLC',
  supportEmail: 'contact@nutrovia.co',
  supportPhone: '+1 786 431 2093',
  logoLinkUrl: '#',
  flagImageUrl: 'https://placehold.co/24x16/ffffff/10B981?text=US',
  heroImageUrl: 'https://placehold.co/600x200/ffffff/10B981?text=Thank+You',
  productImageUrl: 'https://placehold.co/560x400/ffffff/10B981?text=Product',
  guideImage1Url: 'https://placehold.co/400x300/ffffff/10B981?text=Guide+1',
  guideImage2Url: 'https://placehold.co/400x300/ffffff/10B981?text=Guide+2',
  communityImageUrl: 'https://placehold.co/400x300/ffffff/10B981?text=Community',
  trustBadge1Url: 'https://placehold.co/80x40/ffffff/10B981?text=SSL',
  trustBadge2Url: 'https://placehold.co/80x40/ffffff/10B981?text=DMCA',
  surveyUrl: '#',
  communityUrl: '#',
  termsUrl: '#',
  privacyUrl: '#',
  refundUrl: '#',
  trackingScriptUrl: '',
  userguideProductName: 'Nutrovia Gut Health Supplement',
  shippingMethod: 'Standard Shipping (3-7 days)',
  showSurvey: true,
  showVideo: true,
  showCommunity: true,
  showUserGuide: true,
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
    maxTokens: 8192,
    maxRetries: 2,
  };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('=== Thank You Page Template Test ===\n');
  console.log(`Brand: ${TEST_BRIEF.brandName}`);
  console.log(`Product: ${TEST_BRIEF.name}`);
  console.log(`Template: ${TEMPLATE_ID}\n`);

  // Show template info
  try {
    const info = getTemplateInfo(TEMPLATE_ID);
    console.log(`Template ID: ${info.id}`);
    console.log(`AI slots: ${info.aiSlotsCount}`);
    console.log(`Manual slots: ${info.manualSlotsCount}`);
    console.log(`Total slots: ${info.totalSlotsCount}\n`);
  } catch (e) {
    console.warn(`Warning: Could not load template info: ${(e as Error).message}\n`);
  }

  // Ensure output dir exists
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Generate!
  const config = getConfig();
  console.log(`Model: ${config.model}`);
  console.log(`API: ${config.apiUrl}\n`);
  console.log('Generating content...\n');

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

  // Quick validation
  if (result.success && result.outputPath) {
    const html = readFileSync(result.outputPath, 'utf-8');

    // Check no unreplaced markers remain
    const unreplaced = html.match(/\{\{[a-z_]+\}\}/g);
    if (unreplaced) {
      // Filter out backend variables (firstName, lastName, etc.) — these are expected
      const backendVars = ['firstName', 'lastName', 'emailAddress', 'shipFirstName', 'shipLastName',
        'shipAddress1', 'shipCity', 'shipState', 'shipPostalCode', 'shipCountry',
        'currencySymbol', 'amountPaid', 'address1', 'city', 'state', 'postalCode', 'country'];
      const realUnreplaced = unreplaced.filter(m => {
        const name = m.replace(/\{\{|\}\}/g, '');
        return !backendVars.includes(name);
      });
      if (realUnreplaced.length > 0) {
        console.log(`\nUnreplaced markers (${realUnreplaced.length}):`);
        [...new Set(realUnreplaced)].forEach(m => console.log(`  - ${m}`));
      } else {
        console.log('\nAll AI markers replaced. Backend variables ({{firstName}}, etc.) are expected — filled at runtime.');
      }
    }

    // Check section markers are cleaned up
    const sectionMarkers = html.match(/<!-- SECTION_\w+_(START|END) -->/g);
    if (sectionMarkers) {
      console.log(`\nSection markers remaining (${sectionMarkers.length}): these should be removed.`);
    } else {
      console.log('All section markers removed.');
    }

    // Check brand name appears
    if (html.includes(TEST_BRIEF.brandName)) {
      console.log(`Brand "${TEST_BRIEF.brandName}" found in output.`);
    }
  }

  console.log('\n=== Done ===');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
