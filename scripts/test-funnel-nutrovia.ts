/**
 * Purpose: Generate + deploy a full Nutrovia (Gut Health) funnel.
 *          Validates pipeline generality (different product from Vibriance).
 *
 * Run: npx tsx scripts/test-funnel-nutrovia.ts [--deploy]
 *
 * OUTPUT: test-output/funnel-nutrovia-{timestamp}/ + optional deploy to production
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

import { generateFunnel, type FunnelConfig } from '../src/services/funnel-generator';
import type { ProductBrief } from '../src/agents/prompts/template-filler';
import { getConfig } from './api-config';
import { join } from 'path';

// ─── Product Brief: Nutrovia (Gut Health) ──────────────────────────────────────

const BASE_PRODUCT: ProductBrief = {
  name: 'Nutrovia',
  description: 'A breakthrough gut health supplement that targets the hidden "Enzyme Starvation Cycle" — the real reason behind bloating, weight gain, and low energy after 40.',
  niche: 'Health & Wellness',
  targetAudience: 'Women 40-65 struggling with persistent bloating, unexplained weight gain, and digestive issues',
  benefits: [
    'Eliminates bloating within 14 days by restoring digestive enzymes',
    'Melts stubborn belly fat by fixing the enzyme starvation cycle',
    'Restores natural energy without caffeine or stimulants',
    'Reverses the hidden enzyme decline that starts after age 40',
    'Clinically tested formula with 47,300+ satisfied customers',
  ],
  price: '$49',
  originalPrice: '$119',
  discountPct: '58%',
  guarantee: '90-Day Money-Back Guarantee',
  mechanismName: 'Enzyme Starvation Cycle',
  authorPersona: 'Dr. Sarah Mitchell, MD, Nutritionist',
  categoryBadge: 'Health',
  ratingCount: '4,891',
};

// ─── Funnel Configuration ──────────────────────────────────────────────────────

const FUNNEL: FunnelConfig = {
  product: BASE_PRODUCT,
  baseUrl: '.',
  outputDir: join(process.cwd(), 'test-output', `funnel-nutrovia-${Date.now()}`),
  steps: [
    // STEP 1: Entry page (advertorial)
    {
      id: 'entry',
      templateId: 'smoothspire-advertorial',
      outputFilename: 'index.html',
      nextOnAccept: 'oto1',
    },

    // STEP 2: OTO1 — Volume deal (3-pack Nutrovia)
    {
      id: 'oto1',
      templateId: 'upsell-vibriance',
      outputFilename: 'oto1.html',
      nextOnAccept: 'oto2',
      nextOnDecline: 'oto2',
      briefOverrides: {
        name: 'Nutrovia',
        price: '$28.20',
        originalPrice: '$119.00',
        discountPct: '76%',
        offerQty: 3,
        offerUnitPrice: '$28.20',
        offerTotalPrice: '$84.60',
        retailUnitPrice: '$39.67',
        retailTotalPrice: '$119.00',
        countdownMinutes: '10',
        currencyLabel: 'USD',
        logoUrl: 'https://placehold.co/160x40/10B981/ffffff?text=Nutrovia',
        productImageUrl: 'https://placehold.co/600x600/ffffff/10B981?text=Nutrovia+3pk',
        otoPosition: 1,
        upsellType: 'same_product',
        previousProduct: 'Nutrovia',
      },
    },

    // STEP 3: OTO2 — Cross-sell (Probiotic Complex)
    {
      id: 'oto2',
      templateId: 'upsell-cross-sell',
      outputFilename: 'oto2.html',
      nextOnAccept: 'oto3',
      nextOnDecline: 'oto3',
      briefOverrides: {
        name: 'Nutrovia Probiotic Complex',
        price: '$29.00',
        originalPrice: '$49.00',
        discountPct: '41%',
        offerQty: 1,
        offerUnitPrice: '$29.00',
        offerTotalPrice: '$29.00',
        retailUnitPrice: '$49.00',
        retailTotalPrice: '$49.00',
        countdownMinutes: '10',
        currencyLabel: 'USD',
        logoUrl: 'https://placehold.co/160x40/10B981/ffffff?text=Nutrovia',
        productImageUrl: 'https://placehold.co/600x600/ffffff/8B5CF6?text=Probiotic+Complex',
        otoPosition: 2,
        upsellType: 'cross_sell',
        previousProduct: 'Nutrovia',
      },
    },

    // STEP 4: OTO3 — Cross-sell (Liver Detox)
    {
      id: 'oto3',
      templateId: 'upsell-product',
      outputFilename: 'oto3.html',
      nextOnAccept: 'oto4',
      nextOnDecline: 'oto4',
      otoPosition: 3,
      briefOverrides: {
        name: 'Nutrovia Liver Detox',
        price: '$33.00',
        originalPrice: '$59.00',
        discountPct: '44%',
        offerQty: 1,
        offerUnitPrice: '$33.00',
        offerTotalPrice: '$33.00',
        retailUnitPrice: '$59.00',
        retailTotalPrice: '$59.00',
        countdownMinutes: '10',
        currencyLabel: 'USD',
        logoUrl: 'https://placehold.co/160x40/10B981/ffffff?text=Nutrovia',
        productImageUrl: 'https://placehold.co/600x600/ffffff/06B6D4?text=Liver+Detox',
        otoPosition: 3,
        upsellType: 'cross_sell',
        previousProduct: 'Nutrovia Probiotic Complex',
      },
    },

    // STEP 5: OTO4 — Cross-sell (Collagen Booster)
    {
      id: 'oto4',
      templateId: 'upsell-product',
      outputFilename: 'oto4.html',
      nextOnAccept: 'oto5',
      nextOnDecline: 'oto5',
      otoPosition: 4,
      briefOverrides: {
        name: 'Nutrovia Collagen Booster',
        price: '$27.00',
        originalPrice: '$45.00',
        discountPct: '40%',
        offerQty: 1,
        offerUnitPrice: '$27.00',
        offerTotalPrice: '$27.00',
        retailUnitPrice: '$45.00',
        retailTotalPrice: '$45.00',
        countdownMinutes: '10',
        currencyLabel: 'USD',
        logoUrl: 'https://placehold.co/160x40/10B981/ffffff?text=Nutrovia',
        productImageUrl: 'https://placehold.co/600x600/ffffff/10B981?text=Collagen+Booster',
        otoPosition: 4,
        upsellType: 'cross_sell',
        previousProduct: 'Nutrovia Liver Detox',
      },
    },

    // STEP 6: OTO5 — Protection (Porch Pirates)
    {
      id: 'oto5',
      templateId: 'upsell-protection',
      outputFilename: 'oto5.html',
      nextOnAccept: 'thankyou',
      nextOnDecline: 'thankyou',
      briefOverrides: {
        name: 'Package Protection',
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
        logoUrl: 'https://placehold.co/160x40/10B981/ffffff?text=Nutrovia',
        productImageUrl: 'https://placehold.co/600x600/ffffff/F59E0B?text=Package+Protection',
        otoPosition: 5,
        upsellType: 'protection',
        previousProduct: 'Nutrovia Collagen Booster',
      },
    },

    // STEP 7: Thank You Page
    {
      id: 'thankyou',
      templateId: 'thank-you-page-smoothspine',
      outputFilename: 'thankyou.html',
      briefOverrides: {
        brandName: 'Nutrovia',
        billingName: 'Nutrovia Health LLC',
        supportEmail: 'support@nutrovia.com',
        supportPhone: '+1 800 555 0199',
        logoLinkUrl: '#',
        flagImageUrl: 'https://placehold.co/24x16/ffffff/10B981?text=US',
        heroImageUrl: 'https://placehold.co/600x200/ffffff/10B981?text=Thank+You',
        productImageUrl: 'https://placehold.co/560x400/ffffff/10B981?text=Nutrovia',
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
        userguideProductName: 'Nutrovia',
        shippingMethod: 'Standard Shipping (3-7 days)',
        showSurvey: true,
        showVideo: true,
        showCommunity: true,
        showUserGuide: true,
      },
    },
  ],
};

// ─── Deploy Config ─────────────────────────────────────────────────────────────

const DEPLOY = process.argv.includes('--deploy');
const DEPLOY_SLUG = 'nutrovia';

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('=== NUTROVIA FUNNEL GENERATION + DEPLOY ===\n');
  console.log(`Product: ${BASE_PRODUCT.name}`);
  console.log(`Niche: ${BASE_PRODUCT.niche}`);
  console.log(`Steps: ${FUNNEL.steps.length}`);
  console.log(`Output: ${FUNNEL.outputDir}`);
  if (DEPLOY) console.log(`Deploy: YES → ${DEPLOY_SLUG}.nutrovia.co`);
  console.log();

  const config = getConfig();
  console.log(`Model: ${config.model}\n`);

  if (DEPLOY) {
    FUNNEL.deploy = {
      routerUrl: 'http://5.161.254.135',
      routerHost: 'go.nutrovia.co',
      deployKey: process.env.DEPLOY_API_KEY ?? 'nutrovia-deploy-2026-xK9mP2vL8qR',
      slug: DEPLOY_SLUG,
    };
  }

  const result = await generateFunnel(FUNNEL, config);

  console.log('\n=== RESULTS ===');
  console.log(`Success: ${result.success}`);
  console.log(`Duration: ${result.totalDuration}s`);
  console.log(`Steps: ${result.steps.filter(s => s.success).length}/${result.steps.length}`);
  console.log(`CTAs: ${result.totalCtasInjected}`);

  for (const step of result.steps) {
    console.log(`  ${step.success ? '✓' : '✗'} ${step.stepId}`);
    for (const v of step.variants) {
      console.log(`    ${v.success ? '✓' : '✗'} ${path.basename(v.outputPath || '?')} (${v.ctasInjected} CTAs)`);
      if (v.error) console.log(`      Error: ${v.error}`);
    }
  }

  if (result.errors.length > 0) {
    console.log(`\nErrors (${result.errors.length}):`);
    result.errors.forEach(e => console.log(`  - ${e}`));
  }

  console.log('\n=== DONE ===');
  console.log(`Output: ${FUNNEL.outputDir}`);
  if (DEPLOY) console.log(`Live: https://${DEPLOY_SLUG}.nutrovia.co`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
