/**
 * Purpose: Test the checkout page template generation pipeline.
 *          Checkout brief (with bundle pricing) → AI text content → Template fill → Output HTML.
 *
 * Run: npx tsx scripts/test-checkout-template.ts
 *
 * WHY: Checkout is very different from advertorials/product pages.
 *      - 3 or 4 bundle tiers with pricing
 *      - Payment integration (Stripe/PayPal)
 *      - Warranty upsell
 *      - FAQ section (11 Q&A)
 *      - Testimonials
 *      Most content is brief-supplied (not AI-generated).
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
import type { CheckoutBrief, CheckoutBundle, CheckoutWarranty } from '../src/agents/prompts/checkout-filler';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const OUTPUT_DIR = join(process.cwd(), 'test-output');

// ─── Test Checkout Brief (Air purifier product) ──────────────────────────────

const TEST_BUNDLES: CheckoutBundle[] = [
  {
    id: '1x-unit',
    label: '1 AirPure',
    qtyLabel: '1x',
    unitPrice: '$79.00',
    comparePrice: '$79.00',
    totalPrice: '$79.00',
    compareTotal: '$79.00',
    totalDiscount: '$0.00',
    shipSpan: '$4.95 worth',
    shipValue: '$4.95',
    shipping: '+ $4.95 Shipping',
    img: '80x80/4CAF50/ffffff?text=1x',
    priceDisplay: '$79.00',
    compareDisplay: '$79.00',
    discountPct: '',
  },
  {
    id: '3x-pack',
    label: '40% OFF: 3 AirPures',
    qtyLabel: '3x',
    unitPrice: '$47.40',
    comparePrice: '$79.00',
    totalPrice: '$142.20',
    compareTotal: '$237.00',
    totalDiscount: '$94.80',
    shipSpan: '$4.95 worth',
    shipValue: 'FREE',
    shipping: 'FREE SHIPPING',
    img: '80x80/2196F3/ffffff?text=3x',
    priceDisplay: '$47.40',
    compareDisplay: '$79.00',
    discountPct: '40%',
  },
  {
    id: '6x-pack',
    label: '60% OFF: 6 AirPures',
    qtyLabel: '6x',
    unitPrice: '$31.60',
    comparePrice: '$79.00',
    totalPrice: '$189.60',
    compareTotal: '$474.00',
    totalDiscount: '$284.40',
    shipSpan: '$4.95 worth',
    shipValue: 'FREE',
    shipping: 'FREE SHIPPING',
    img: '80x80/FF9800/ffffff?text=6x',
    priceDisplay: '$31.60',
    compareDisplay: '$79.00',
    discountPct: '60%',
  },
  // Bundle 4 — set to empty to test 3-bundle mode
  // Uncomment to test 4-bundle mode:
  // {
  //   id: '9x-pack',
  //   label: '66% OFF: 9 AirPures',
  //   qtyLabel: '9x',
  //   unitPrice: '$11.89',
  //   comparePrice: '$79.00',
  //   totalPrice: '$107.00',
  //   compareTotal: '$711.00',
  //   totalDiscount: '$604.00',
  //   shipSpan: 'FREE 5-8 Days',
  //   shipValue: 'FREE',
  //   shipping: 'FREE SHIPPING',
  //   img: 'product-9x.webp',
  //   priceDisplay: '$11.89',
  //   compareDisplay: '$79.00',
  // },
];

const TEST_WARRANTY: CheckoutWarranty = {
  description: '2-Year Extended Protection Plan',
  duration: '2 Years',
  price: '$9.99',
  priceNum: '9.99',
};

const TEST_BRIEF: CheckoutBrief = {
  // ProductBrief fields
  name: 'AirPure',
  description: 'A compact negative ion air purifier that plugs into any wall outlet. Neutralizes dust, allergens, and odors silently. No filters needed — ever.',
  niche: 'Home & Wellness',
  targetAudience: 'Homeowners and renters with allergies, dust issues, or pet odors who want clean air without expensive HEPA filters',
  benefits: [
    'Eliminates 99% of airborne allergens',
    'Zero filter replacements — saves $200+/year',
    'Whisper-quiet operation (under 20dB)',
    'Covers up to 300 sq ft per unit',
    'Works in any room — just plug it in',
  ],
  price: '$19.67',
  originalPrice: '$79.00',
  discountPct: '60%',
  guarantee: '30-Day Money-Back Guarantee',
  mechanismName: 'Negative Ion Technology',
  authorPersona: 'Air Quality Expert',

  // CheckoutBrief fields
  namePlural: 'AirPures',
  productType: 'Air Purifier',
  bundles: TEST_BUNDLES,
  warranty: TEST_WARRANTY,
  checkoutBaseUrl: 'https://checkout.example.com',
  checkoutUrl: 'https://checkout.example.com/order',
  stripeApiEndpoint: 'https://api.example.com/create-payment-intent',
  googlePlacesApiKey: 'AIzaSyDuSoHHXTNymNfNBtAfLZoDW0jCSIByNTk',
  stripeRedirectBaseUrl: 'https://checkout.example.com',
  termsUrl: 'https://example.com/terms',
  privacyUrl: 'https://example.com/privacy',
  refundUrl: 'https://example.com/refund',
  productAssetsBaseUrl: 'placehold.co/400x400/4CAF50/ffffff?text=AirPure/',
  galleryBaseUrl: 'placehold.co/',
  galleryImages: [
    '600x700/4CAF50/ffffff?text=Front+View',
    '600x700/2196F3/ffffff?text=Side+View',
    '600x700/FF9800/ffffff?text=Top+View',
    '600x700/9C27B0/ffffff?text=In+Box',
    '600x700/F44336/ffffff?text=In+Use',
  ],
  logoUrl: 'https://placehold.co/160x40/4CAF50/ffffff?text=AirPure',
  brandImageUrl: 'https://placehold.co/120x40/333/fff?text=Trusted',
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
    maxTokens: 8192, // Checkout needs less tokens than advertorials (fewer text slots)
    maxRetries: 2,
  };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const TEMPLATE_ID = 'checkout-clarifion';
  const bundleCount = TEST_BUNDLES.length;

  console.log('=== Checkout Page Template Test ===\n');
  console.log(`Product: ${TEST_BRIEF.name}`);
  console.log(`Type: ${TEST_BRIEF.productType}`);
  console.log(`Bundles: ${bundleCount} tiers`);
  console.log(`Price range: ${TEST_BUNDLES[0].totalPrice} - ${TEST_BUNDLES[bundleCount - 1].totalPrice}`);
  console.log(`Warranty: ${TEST_WARRANTY.description} (${TEST_WARRANTY.price})\n`);

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
  console.log('Generating content... (this may take 20-40 seconds)\n');

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

  // Verify bundle 4 is hidden (3-bundle mode)
  const htmlContent = fs.readFileSync(result.outputPath, 'utf-8');
  const bundle4Hidden = htmlContent.includes('display:none');
  const bundle4Visible = htmlContent.includes('id="product-4"') && !htmlContent.includes('id="product-4" data-id="9" href="" srcset="" data-secondsdelay="" style="display:none"');
  console.log(`\nBundle 4 hidden (3-bundle mode): ${bundle4Hidden}`);

  // Verify prices are correct in the output
  const hasBundle1Price = htmlContent.includes('$39.00');
  const hasBundle2Price = htmlContent.includes('$59.00');
  const hasBundle3Price = htmlContent.includes('$95.00');
  console.log(`Bundle 1 price ($39.00): ${hasBundle1Price ? 'OK' : 'MISSING'}`);
  console.log(`Bundle 2 price ($59.00): ${hasBundle2Price ? 'OK' : 'MISSING'}`);
  console.log(`Bundle 3 price ($95.00): ${hasBundle3Price ? 'OK' : 'MISSING'}`);

  // Verify no remaining markers
  const remainingMarkers = htmlContent.match(/\{\{(\w+)\}\}/g);
  if (remainingMarkers) {
    console.log(`\nWARNING: ${remainingMarkers.length} unfilled markers remaining:`);
    const unique = [...new Set(remainingMarkers)];
    unique.forEach(m => console.log(`  ${m}`));
  } else {
    console.log('\nAll markers filled!');
  }

  // Save test results metadata
  const metaOutputPath = result.outputPath.replace('.html', '.test.json');
  const testData = {
    templateId: TEMPLATE_ID,
    product: TEST_BRIEF.name,
    bundleCount,
    bundleMode: bundleCount >= 4 ? '4-bundle' : '3-bundle',
    duration: result.duration,
    tokensUsed: result.tokensUsed,
    slotsFilled: result.slotsFilled,
    slotsEmpty: result.slotsEmpty,
    bundle4Hidden,
    pricesCorrect: hasBundle1Price && hasBundle2Price && hasBundle3Price,
    markersRemaining: remainingMarkers?.length ?? 0,
    timestamp: new Date().toISOString(),
  };
  fs.writeFileSync(metaOutputPath, JSON.stringify(testData, null, 2));
  console.log(`\nTest metadata saved: ${metaOutputPath}`);

  console.log('\n=== Done ===');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
