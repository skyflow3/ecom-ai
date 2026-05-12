/**
 * Purpose: Test the complete funnel generation pipeline (backward compatible).
 *          Generates ALL pages (entry → upsells → thank you) with CTA wiring.
 *
 * Run: npx tsx scripts/test-funnel.ts
 *
 * OUTPUT: test-output/funnel-{timestamp}/ with all HTML pages + funnel-manifest.json
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

// ─── Funnel Configuration ──────────────────────────────────────────────────────

const FUNNEL: FunnelConfig = {
  product: BASE_PRODUCT,
  baseUrl: '.',  // Relative URLs for local testing
  outputDir: join(process.cwd(), 'test-output', `funnel-${Date.now()}`),
  steps: [
    // STEP 1: Entry page (advertorial)
    {
      id: 'entry',
      templateId: 'smoothspire-advertorial',
      outputFilename: 'index.html',
      nextOnAccept: 'oto1',
    },

    // STEP 2: OTO1 — Volume deal (same product, 3-pack)
    {
      id: 'oto1',
      templateId: 'upsell-vibriance',
      outputFilename: 'oto1.html',
      nextOnAccept: 'oto2',
      nextOnDecline: 'oto2',
      briefOverrides: {
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

    // STEP 3: OTO2 — Cross-sell (Retinol Serum, AM/PM routine)
    {
      id: 'oto2',
      templateId: 'upsell-cross-sell',
      outputFilename: 'oto2.html',
      nextOnAccept: 'oto3',
      nextOnDecline: 'oto3',
      briefOverrides: {
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
        otoPosition: 2,
        upsellType: 'cross_sell',
        previousProduct: 'Vibriance Super C Serum',
      },
    },

    // STEP 4: OTO3 — Cross-sell (Eye Renewal Serum, body_extra zone)
    {
      id: 'oto3',
      templateId: 'upsell-product',
      outputFilename: 'oto3.html',
      nextOnAccept: 'oto4',
      nextOnDecline: 'oto4',
      otoPosition: 3,
      briefOverrides: {
        name: 'Vibriance Eye Renewal Serum',
        description: "Targeted eye serum that erases crow's feet, dark circles, and under-eye bags. Formulated with peptides and caffeine to instantly tighten and brighten the delicate eye area for women over 50.",
        niche: 'Skincare / Anti-Aging / Eye Care',
        targetAudience: "Women 50+ with mature skin: crow's feet, dark circles, under-eye bags, puffiness",
        benefits: [
          "Erases crow's feet and fine lines around eyes",
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
        otoPosition: 3,
        upsellType: 'cross_sell',
        previousProduct: 'Vibriance Retinol Serum',
      },
    },

    // STEP 5: OTO4 — Cross-sell (Moisturizing Cream, ingredients zone)
    {
      id: 'oto4',
      templateId: 'upsell-product',
      outputFilename: 'oto4.html',
      nextOnAccept: 'oto5',
      nextOnDecline: 'oto5',
      otoPosition: 4,
      briefOverrides: {
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
        otoPosition: 4,
        upsellType: 'cross_sell',
        previousProduct: 'Vibriance Eye Renewal Serum',
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
        name: 'Porch Pirates Protection',
        description: 'Full package protection against theft, loss, and damage during shipping. If your package is stolen from your porch, lost in transit, or arrives damaged — we will replace it immediately at no extra cost.',
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
  console.log('=== COMPLETE FUNNEL GENERATION TEST ===\n');
  console.log(`Product: ${BASE_PRODUCT.name}`);
  console.log(`Steps: ${FUNNEL.steps.length}`);
  console.log(`Output: ${FUNNEL.outputDir}\n`);

  const steps = FUNNEL.steps.map(s => {
    const tmpl = s.templateId ?? (s.variants?.map(v => v.templateId).join('/') ?? 'variants');
    return `  ${s.id.padEnd(12)} ${tmpl.padEnd(35)} → ${s.outputFilename}`;
  }).join('\n');
  console.log('Funnel flow:');
  console.log(steps + '\n');

  const config = getConfig();
  console.log(`Model: ${config.model}`);
  console.log(`API: ${config.apiUrl}\n`);

  // Generate the entire funnel
  const result = await generateFunnel(FUNNEL, config);

  // Report
  console.log('\n=== FUNNEL RESULTS ===');
  console.log(`Success: ${result.success}`);
  console.log(`Duration: ${result.totalDuration}s`);
  console.log(`Steps generated: ${result.steps.filter(s => s.success).length}/${result.steps.length}`);
  console.log(`Total CTAs wired: ${result.totalCtasInjected}`);

  console.log('\nSteps:');
  for (const step of result.steps) {
    const status = step.success ? '✓' : '✗';
    const router = step.routerPath ? ` [router: ${path.basename(step.routerPath)}]` : '';
    console.log(`  ${status} ${step.stepId.padEnd(12)}${router}`);
    for (const v of step.variants) {
      const vStatus = v.success ? '✓' : '✗';
      const ctaInfo = v.ctasInjected > 0 ? ` (${v.ctasInjected} CTAs)` : '';
      console.log(`    ${vStatus} variant ${v.variantId}: ${path.basename(v.outputPath || '?')}${ctaInfo}`);
      if (v.error) console.log(`      Error: ${v.error}`);
    }
  }

  if (result.errors.length > 0) {
    console.log(`\nErrors (${result.errors.length}):`);
    result.errors.forEach(e => console.log(`  - ${e}`));
  }

  // Quick validation: check CTA URLs in generated files
  console.log('\n=== CTA VALIDATION ===');
  for (const step of result.steps) {
    for (const v of step.variants) {
      if (!v.success || !v.outputPath) continue;

      const html = fs.readFileSync(v.outputPath, 'utf-8');
      const windowLocation = (html.match(/window\.location\.href=/g) || []).length;
      const neutralCtas = (html.match(/href="#"/g) || []).length;
      const nextStepCtas = (html.match(/href="#next-step"/g) || []).length;

      console.log(`  ${step.stepId}/${v.variantId} redirects: ${windowLocation} | href="#": ${neutralCtas} | href="#next-step": ${nextStepCtas}`);
    }
  }

  console.log('\n=== DONE ===');
  console.log(`Output folder: ${FUNNEL.outputDir}`);
  console.log(`Open index.html in a browser to test the funnel flow.`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
