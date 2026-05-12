/**
 * Purpose: Test A/B funnel generation with 3 entry page variants.
 *          Entry page tests: advertorial vs listicle vs product page.
 *          Upsells use single variant (no A/B test on upsells).
 *
 * Run: npx tsx scripts/test-funnel-ab.ts
 *
 * OUTPUT: test-output/funnel-ab-{timestamp}/ with:
 *   - index.html (router → redirects to entry-a/b/c)
 *   - entry-a.html (smoothspire-advertorial)
 *   - entry-b.html (hike-reasons-why listicle)
 *   - entry-c.html (product-page-tryemsense)
 *   - oto1-5.html (upsells, single variant each)
 *   - thankyou.html
 *   - funnel-manifest.json
 *   - metrics.json
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

import { generateFunnel, type FunnelConfig, type FunnelVariant } from '../src/services/funnel-generator';
import { initMetrics } from '../src/services/funnel-metrics';
import type { ProductBrief } from '../src/agents/prompts/template-filler';
import { join } from 'path';

// ─── Base Product Brief (Vibriance Super C Serum) ──────────────────────────────────

const BASE_PRODUCT: ProductBrief = {
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
  price: '$49',
  originalPrice: '$99',
  discountPct: '50%',
  guarantee: '1-Year "Bottom of the Bottle" Money-Back Guarantee',
  mechanismName: 'Poly-Pore Slow-Release Vitamin C',
  authorPersona: 'Dr. Sarah Mitchell, MD',
  categoryBadge: 'Skincare',
  ratingCount: '4,891',
};

// ─── A/B Funnel Configuration ──────────────────────────────────────────────────

const FUNNEL: FunnelConfig = {
  product: BASE_PRODUCT,
  baseUrl: '.',
  outputDir: join(process.cwd(), 'test-output', `funnel-ab-${Date.now()}`),
  steps: [
    // STEP 1: Entry page — 3 A/B VARIANTS
    {
      id: 'entry',
      outputFilename: 'index.html',
      nextOnAccept: 'oto1',
      variants: [
        {
          id: 'a',
          name: 'Advertorial (SmoothSpire)',
          mode: 'template',
          templateId: 'smoothspire-advertorial',
          trafficWeight: 34,
        },
        {
          id: 'b',
          name: 'Listicle (Hike Reasons Why)',
          mode: 'template',
          templateId: 'hike-reasons-why',
          trafficWeight: 33,
        },
        {
          id: 'c',
          name: 'Product Page (TryemSense)',
          mode: 'template',
          templateId: 'product-page-tryemsense',
          trafficWeight: 33,
        },
      ],
    },

    // STEP 2-6: Upsells (single variant each)
    {
      id: 'oto1',
      templateId: 'upsell-vibriance',
      outputFilename: 'oto1.html',
      nextOnAccept: 'oto2',
      nextOnDecline: 'oto2',
      briefOverrides: {
        name: 'Vibriance Super C Serum',
        price: '$28.20',
        originalPrice: '$47.00',
        discountPct: '40%',
        offerQty: 3,
        offerUnitPrice: '$28.20',
        offerTotalPrice: '$84.60',
        retailUnitPrice: '$47.00',
        retailTotalPrice: '$141.00',
        countdownMinutes: '10',
        currencyLabel: 'USD',
        logoUrl: 'https://placehold.co/160x40/30bd51/ffffff?text=Vibriance',
        productImageUrl: 'https://placehold.co/600x600/ffffff/FF6B35?text=Super+C+Serum+3pk',
        otoPosition: 1,
        upsellType: 'same_product',
        previousProduct: 'Vibriance Super C Serum',
      },
    },
    {
      id: 'oto2',
      templateId: 'upsell-cross-sell',
      outputFilename: 'oto2.html',
      nextOnAccept: 'oto3',
      nextOnDecline: 'oto3',
      briefOverrides: {
        name: 'Vibriance Retinol Serum',
        price: '$32.00',
        originalPrice: '$42.67',
        discountPct: '25%',
        offerQty: 1,
        offerUnitPrice: '$32.00',
        offerTotalPrice: '$32.00',
        retailUnitPrice: '$42.67',
        retailTotalPrice: '$42.67',
        countdownMinutes: '10',
        currencyLabel: 'USD',
        logoUrl: 'https://placehold.co/160x40/30bd51/ffffff?text=Vibriance',
        productImageUrl: 'https://placehold.co/600x600/ffffff/8B5CF6?text=Retinol+Serum',
        otoPosition: 2,
        upsellType: 'cross_sell',
        previousProduct: 'Vibriance Super C Serum',
      },
    },
    {
      id: 'oto3',
      templateId: 'upsell-product',
      outputFilename: 'oto3.html',
      nextOnAccept: 'oto4',
      nextOnDecline: 'oto4',
      otoPosition: 3,
      briefOverrides: {
        name: 'Vibriance Eye Renewal Serum',
        price: '$34.20',
        originalPrice: '$53.44',
        discountPct: '36%',
        offerQty: 1,
        offerUnitPrice: '$34.20',
        offerTotalPrice: '$34.20',
        retailUnitPrice: '$53.44',
        retailTotalPrice: '$53.44',
        countdownMinutes: '10',
        currencyLabel: 'USD',
        logoUrl: 'https://placehold.co/160x40/30bd51/ffffff?text=Vibriance',
        productImageUrl: 'https://placehold.co/600x600/ffffff/06B6D4?text=Eye+Renewal',
        otoPosition: 3,
        upsellType: 'cross_sell',
        previousProduct: 'Vibriance Retinol Serum',
      },
    },
    {
      id: 'oto4',
      templateId: 'upsell-product',
      outputFilename: 'oto4.html',
      nextOnAccept: 'oto5',
      nextOnDecline: 'oto5',
      otoPosition: 4,
      briefOverrides: {
        name: 'Vibriance Moisturizing Cream',
        price: '$24.00',
        originalPrice: '$34.29',
        discountPct: '30%',
        offerQty: 1,
        offerUnitPrice: '$24.00',
        offerTotalPrice: '$24.00',
        retailUnitPrice: '$34.29',
        retailTotalPrice: '$34.29',
        countdownMinutes: '10',
        currencyLabel: 'USD',
        logoUrl: 'https://placehold.co/160x40/30bd51/ffffff?text=Vibriance',
        productImageUrl: 'https://placehold.co/600x600/ffffff/10B981?text=Moisturizing+Cream',
        otoPosition: 4,
        upsellType: 'cross_sell',
        previousProduct: 'Vibriance Eye Renewal Serum',
      },
    },
    {
      id: 'oto5',
      templateId: 'upsell-protection',
      outputFilename: 'oto5.html',
      nextOnAccept: 'thankyou',
      nextOnDecline: 'thankyou',
      briefOverrides: {
        name: 'Porch Pirates Protection',
        price: '$4.95',
        originalPrice: '$9.95',
        discountPct: '50%',
        offerQty: 1,
        offerUnitPrice: '$4.95',
        offerTotalPrice: '$4.95',
        retailUnitPrice: '$9.95',
        retailTotalPrice: '$9.95',
        countdownMinutes: '10',
        currencyLabel: 'USD',
        logoUrl: 'https://placehold.co/160x40/30bd51/ffffff?text=Vibriance',
        productImageUrl: 'https://placehold.co/600x600/ffffff/F59E0B?text=Protection',
        otoPosition: 5,
        upsellType: 'protection',
        previousProduct: 'Vibriance Moisturizing Cream',
      },
    },

    // STEP 7: Thank You Page
    {
      id: 'thankyou',
      templateId: 'thank-you-page-smoothspine',
      outputFilename: 'thankyou.html',
      briefOverrides: {
        brandName: 'Vibriance',
        billingName: 'Vibriance Digital LLC',
        supportEmail: 'support@vibriance.com',
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
        userguideProductName: 'Vibriance Super C Serum',
        shippingMethod: 'Standard Shipping (3-7 days)',
        showSurvey: true,
        showVideo: true,
        showCommunity: true,
        showUserGuide: true,
      },
    },
  ],
};

// ─── API Config ────────────────────────────────────────────────────────────────

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
    maxTokens: 16384,
    maxRetries: 2,
  };
}

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('=== A/B FUNNEL GENERATION TEST ===\n');
  console.log(`Product: ${BASE_PRODUCT.name}`);
  console.log(`Steps: ${FUNNEL.steps.length}`);
  console.log(`Entry variants: ${(FUNNEL.steps[0].variants?.length ?? 1)}`);
  console.log(`Output: ${FUNNEL.outputDir}\n`);

  // Show A/B setup
  const entryStep = FUNNEL.steps[0];
  if (entryStep.variants) {
    console.log('Entry page A/B test:');
    for (const v of entryStep.variants) {
      console.log(`  Variant ${v.id} (${v.name}): ${(v as FunnelVariant).trafficWeight}% → ${(v as FunnelVariant).templateId}`);
    }
    console.log('');
  }

  const config = getConfig();
  console.log(`Model: ${config.model}\n`);

  // Generate the entire funnel
  const result = await generateFunnel(FUNNEL, config);

  // Initialize metrics for A/B tracking
  const metricsSteps = result.steps.map(s => ({
    stepId: s.stepId,
    variantIds: s.variants.map(v => v.variantId),
  }));
  const metricsPath = initMetrics(FUNNEL.outputDir, metricsSteps);

  // Report
  console.log('\n=== FUNNEL RESULTS ===');
  console.log(`Success: ${result.success}`);
  console.log(`Duration: ${result.totalDuration}s`);
  console.log(`Total CTAs wired: ${result.totalCtasInjected}`);

  console.log('\nSteps:');
  for (const step of result.steps) {
    const router = step.routerPath ? ` [ROUTER: ${path.basename(step.routerPath)}]` : '';
    console.log(`  ${step.stepId.padEnd(12)}${router}`);
    for (const v of step.variants) {
      const ctaInfo = v.ctasInjected > 0 ? ` (${v.ctasInjected} CTAs)` : '';
      console.log(`    variant ${v.variantId}: ${path.basename(v.outputPath || '?')}${ctaInfo} ${v.success ? '✓' : '✗'}`);
      if (v.error) console.log(`      Error: ${v.error}`);
    }
  }

  if (result.errors.length > 0) {
    console.log(`\nErrors (${result.errors.length}):`);
    result.errors.forEach(e => console.log(`  - ${e}`));
  }

  // Validate router
  console.log('\n=== ROUTER VALIDATION ===');
  const entryRouter = result.steps.find(s => s.stepId === 'entry');
  if (entryRouter?.routerPath) {
    const routerHtml = fs.readFileSync(entryRouter.routerPath, 'utf-8');
    const hasLocalStorage = routerHtml.includes('localStorage');
    const hasReplace = routerHtml.includes('window.location.replace');
    const variantFiles = entryRouter.variants.map(v => path.basename(v.outputPath || ''));
    const allFilesLinked = variantFiles.every(f => routerHtml.includes(f));

    console.log(`  Router file: ${path.basename(entryRouter.routerPath)}`);
    console.log(`  localStorage sticky: ${hasLocalStorage ? '✓' : '✗'}`);
    console.log(`  Redirect logic: ${hasReplace ? '✓' : '✗'}`);
    console.log(`  All variants linked: ${allFilesLinked ? '✓' : '✗'} (${variantFiles.join(', ')})`);
  } else {
    console.log('  No router generated (entry has single variant)');
  }

  // Validate CTA wiring
  console.log('\n=== CTA VALIDATION ===');
  for (const step of result.steps) {
    for (const v of step.variants) {
      if (!v.success || !v.outputPath) continue;

      const html = fs.readFileSync(v.outputPath, 'utf-8');
      const redirects = (html.match(/window\.location\.href=/g) || []).length;
      const neutralCtas = (html.match(/href="#"/g) || []).length;

      console.log(`  ${step.stepId}/${v.variantId} redirects: ${redirects} | href="#": ${neutralCtas}`);
    }
  }

  // Show metrics file
  console.log(`\n=== METRICS ===`);
  console.log(`Metrics file: ${metricsPath}`);

  console.log('\n=== DONE ===');
  console.log(`Output folder: ${FUNNEL.outputDir}`);
  console.log(`Open index.html → router redirects to entry-a/b/c.html (random, sticky session)`);
  console.log(`Each variant CTA → oto1.html → oto2.html → ... → thankyou.html`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
