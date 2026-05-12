/**
 * Purpose: Generate a 2-page funnel preview (product page → checkout) for visual testing.
 *          Simulates the real user experience: see product → click CTA → land on checkout.
 * Run: npx tsx scripts/test-funnel-preview.ts
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

import { generateFunnel, type FunnelConfig } from '../src/services/funnel-generator';
import type { CheckoutBrief, CheckoutBundle, CheckoutWarranty } from '../src/agents/prompts/checkout-filler';
import type { ProductBrief } from '../src/agents/prompts/template-filler';

const OUTPUT_DIR = path.join(process.cwd(), 'test-output', 'funnel-preview');

// ─── Product Brief (Nutrovia Turmeric) ──────────────────────────────────────

const BRIEF: ProductBrief = {
  name: 'Nutrovia',
  description: 'A premium turmeric supplement with 95% curcuminoids + BioPerine for 2000% better absorption. Reduces joint pain, boosts immunity, and fights inflammation naturally.',
  niche: 'Health & Wellness',
  targetAudience: 'Adults 35-65 suffering from joint pain, inflammation, or wanting natural immune support',
  benefits: [
    'Reduces joint pain by 67% in 30 days',
    '2000% better absorption with BioPerine',
    'Fights chronic inflammation at the source',
    'Boosts immune system naturally',
    'No side effects — 100% natural ingredients',
  ],
  price: '$49.00',
  originalPrice: '$129.00',
  discountPct: '62%',
  guarantee: '60-Day Money-Back Guarantee',
  mechanismName: 'BioPerine-Enhanced Curcumin',
  authorPersona: 'Dr. Sarah Mitchell, Nutrition Specialist',
  // Image URLs for replacement system — same aspect ratios as original winner (1376x768)
  productImageUrl: 'https://placehold.co/1376x768/FF9800/ffffff?text=Nutrovia+Turmeric',
  productImageSquareUrl: 'https://placehold.co/768x768/FF9800/ffffff?text=Nutrovia',
  doctorImageUrl: 'https://placehold.co/200x200/4CAF50/ffffff?text=Dr+Sarah',
  logoUrl: 'https://placehold.co/160x40/FF9800/ffffff?text=Nutrovia',
  useVideos: false,
  // Facebook review screenshots to replace originals
  commentScreenshotUrls: [
    'https://placehold.co/400x300/FF9800/ffffff?text=Review+1',
    'https://placehold.co/400x300/FF9800/ffffff?text=Review+2',
  ],
};

// ─── Checkout Brief Overrides ───────────────────────────────────────────────

const BUNDLES: CheckoutBundle[] = [
  {
    id: '1x-unit',
    label: '1 Nutrovia',
    qtyLabel: '1x',
    unitPrice: '$49.00',
    comparePrice: '$129.00',
    totalPrice: '$49.00',
    compareTotal: '$129.00',
    totalDiscount: '$80.00',
    shipSpan: '',
    shipValue: '$4.95',
    shipping: '+ $4.95 Shipping',
    img: 'nutrovia-1x.webp',
    priceDisplay: '$49.00',
    compareDisplay: '$129.00',
    discountPct: '62%',
  },
  {
    id: '3x-pack',
    label: '52% OFF: 3 Nutrovias',
    qtyLabel: '3x',
    unitPrice: '$20.60',
    comparePrice: '$129.00',
    totalPrice: '$61.80',
    compareTotal: '$387.00',
    totalDiscount: '$325.20',
    shipSpan: '$4.95 worth',
    shipValue: 'FREE',
    shipping: 'FREE SHIPPING',
    img: 'nutrovia-3x.webp',
    priceDisplay: '$20.60',
    compareDisplay: '$129.00',
    discountPct: '52%',
  },
  {
    id: '6x-pack',
    label: '65% OFF: 6 Nutrovias',
    qtyLabel: '6x',
    unitPrice: '$15.00',
    comparePrice: '$129.00',
    totalPrice: '$90.00',
    compareTotal: '$774.00',
    totalDiscount: '$684.00',
    shipSpan: '$4.95 worth',
    shipValue: 'FREE',
    shipping: 'FREE SHIPPING',
    img: 'nutrovia-6x.webp',
    priceDisplay: '$15.00',
    compareDisplay: '$129.00',
    discountPct: '65%',
  },
];

const WARRANTY: CheckoutWarranty = {
  description: '2-Year Extended Protection Plan',
  duration: '2 Years',
  price: '$9.99',
  priceNum: '9.99',
};

const CHECKOUT_OVERRIDES: Record<string, any> = {
  namePlural: 'Nutrovias',
  productType: 'Turmeric Supplement',
  bundles: BUNDLES,
  warranty: WARRANTY,
  checkoutBaseUrl: '.',
  checkoutUrl: './checkout.html',
  stripeApiEndpoint: '/api/create-payment-intent',
  googlePlacesApiKey: 'AIzaSyDuSoHHXTNymNfNBtAfLZoDW0jCSIByNTk',
  stripeRedirectBaseUrl: '.',
  termsUrl: '#terms',
  privacyUrl: '#privacy',
  refundUrl: '#refund',
  productAssetsBaseUrl: 'placehold.co/400x400/FF9800/ffffff?text=Nutrovia/',
  galleryBaseUrl: 'placehold.co/',
  galleryImages: [
    '600x700/FF9800/ffffff?text=Front+View',
    '600x700/4CAF50/ffffff?text=Side+View',
    '600x700/2196F3/ffffff?text=Top+View',
    '600x700/9C27B0/ffffff?text=In+Box',
    '600x700/F44336/ffffff?text=In+Use',
  ],
  logoUrl: 'https://placehold.co/160x40/FF9800/ffffff?text=Nutrovia',
  brandImageUrl: 'https://placehold.co/120x40/333/fff?text=Trusted',
  contactEmail: 'contact@nutrovia.com',
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
  console.log('=== Full Funnel Preview ===\n');
  console.log(`Product: ${BRIEF.name}`);
  console.log(`Price: ${BRIEF.price} (was ${BRIEF.originalPrice}, ${BRIEF.discountPct} off)`);
  console.log(`Bundles: ${BUNDLES.length} tiers`);
  console.log(`Steps: 8 (advertorial → checkout → OTO1-5 → thank you)\n`);

  // Ensure output dir exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const UPSELL_COMMON: Record<string, any> = {
    productImageUrl: 'https://placehold.co/600x600/FF9800/ffffff?text=Nutrovia',
    logoUrl: 'https://placehold.co/160x40/FF9800/ffffff?text=Nutrovia',
    contactEmail: 'contact@nutrovia.com',
  };

  const config: FunnelConfig = {
    product: BRIEF,
    baseUrl: '.',
    outputDir: OUTPUT_DIR,
    steps: [
      // Entry: Advertorial
      {
        id: 'entry',
        outputFilename: 'index.html',
        nextOnAccept: 'checkout',
        templateId: 'smoothspire-advertorial',
      },
      // Checkout
      {
        id: 'checkout',
        outputFilename: 'checkout.html',
        nextOnAccept: 'oto1',
        templateId: 'checkout-clarifion',
        briefOverrides: CHECKOUT_OVERRIDES,
      },
      // OTO1: Volume deal (3x Nutrovia)
      {
        id: 'oto1',
        outputFilename: 'oto1.html',
        nextOnAccept: 'oto2',
        nextOnDecline: 'oto2',
        templateId: 'upsell-vibriance',
        otoPosition: 1,
        briefOverrides: {
          ...UPSELL_COMMON,
          name: 'Nutrovia',
          price: '$20.60',
          originalPrice: '$49.00',
          discountPct: '58%',
          offerQty: 3,
          upsellType: 'same_product',
        },
      },
      // OTO2: Cross-sell (Retinol Night Repair)
      {
        id: 'oto2',
        outputFilename: 'oto2.html',
        nextOnAccept: 'oto3',
        nextOnDecline: 'oto3',
        templateId: 'upsell-cross-sell',
        otoPosition: 2,
        briefOverrides: {
          ...UPSELL_COMMON,
          name: 'BioPerine Booster',
          price: '$29.00',
          originalPrice: '$79.00',
          discountPct: '63%',
          upsellType: 'cross_sell',
        },
      },
      // OTO3: Cross-sell premium (Eye Renewal)
      {
        id: 'oto3',
        outputFilename: 'oto3.html',
        nextOnAccept: 'oto4',
        nextOnDecline: 'oto4',
        templateId: 'upsell-product',
        otoPosition: 3,
        briefOverrides: {
          ...UPSELL_COMMON,
          name: 'Joint Relief Cream',
          price: '$19.00',
          originalPrice: '$59.00',
          discountPct: '68%',
          upsellType: 'cross_sell',
        },
      },
      // OTO4: Cross-sell surprise (Moisturizing Cream)
      {
        id: 'oto4',
        outputFilename: 'oto4.html',
        nextOnAccept: 'oto5',
        nextOnDecline: 'oto5',
        templateId: 'upsell-product',
        otoPosition: 4,
        briefOverrides: {
          ...UPSELL_COMMON,
          name: 'Omega-3 Fish Oil',
          price: '$24.00',
          originalPrice: '$69.00',
          discountPct: '65%',
          upsellType: 'cross_sell',
        },
      },
      // OTO5: Protection (package insurance)
      {
        id: 'oto5',
        outputFilename: 'oto5.html',
        nextOnAccept: 'thankyou',
        nextOnDecline: 'thankyou',
        templateId: 'upsell-protection',
        otoPosition: 5,
        briefOverrides: {
          ...UPSELL_COMMON,
          name: 'Package Protection',
          price: '$3.99',
          upsellType: 'protection',
        },
      },
      // Thank You
      {
        id: 'thankyou',
        outputFilename: 'thankyou.html',
        templateId: 'thank-you-page-smoothspine',
        briefOverrides: {
          ...UPSELL_COMMON,
          brandName: 'Nutrovia',
          supportEmail: 'contact@nutrovia.com',
        },
      },
    ],
  };

  const apiConfig = getConfig();
  console.log('Generating pages...\n');

  const result = await generateFunnel(config, apiConfig);

  console.log('\n=== Results ===');
  console.log(`Success: ${result.success}`);
  console.log(`Duration: ${result.duration}s`);
  console.log(`Total CTAs: ${result.totalCtasInjected}`);

  for (const step of result.steps) {
    console.log(`\n--- ${step.stepId} ---`);
    for (const v of step.variants) {
      console.log(`  ${v.variantId}: ${v.outputPath}`);
      console.log(`  CTAs: ${v.ctasInjected}`);
      if (v.error) console.log(`  ERROR: ${v.error}`);
    }
  }

  if (result.warnings && result.warnings.length > 0) {
    console.log(`\nWarnings:`);
    result.warnings.forEach((w: string) => console.log(`  - ${w}`));
  }

  // Output clickable URLs
  console.log('\n=== CLICK TO TEST ===');
  const files = ['index.html', 'checkout.html', 'oto1.html', 'oto2.html', 'oto3.html', 'oto4.html', 'oto5.html', 'thankyou.html'];
  const labels = ['1. Advertorial (START HERE)', '2. Checkout', '3. OTO1 Volume Deal', '4. OTO2 Cross-Sell', '5. OTO3 Premium', '6. OTO4 Surprise', '7. OTO5 Protection', '8. Thank You'];
  files.forEach((f, i) => {
    const p = path.join(OUTPUT_DIR, f);
    console.log(`\n${labels[i]}:`);
    console.log(`   file:///${p.replace(/\\/g, '/')}`);
  });

  console.log('\n=== Done ===');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
