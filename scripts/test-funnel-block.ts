/**
 * Purpose: Test block mode end-to-end in a funnel context.
 *          Generates a product page using block system (mode: 'block')
 *          and verifies CTA injection via data-funnel-cta attribute.
 *
 * Run: npx tsx scripts/test-funnel-block.ts
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

// ─── Product Brief ──────────────────────────────────────────────────────────────

const PRODUCT: ProductBrief = {
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

// ─── Funnel Config: Mix template + block modes ──────────────────────────────────

const FUNNEL: FunnelConfig = {
  product: PRODUCT,
  baseUrl: '.',
  outputDir: join(process.cwd(), 'test-output', `funnel-block-${Date.now()}`),
  steps: [
    // Entry: block mode (AI creates from scratch)
    {
      id: 'entry',
      outputFilename: 'index.html',
      nextOnAccept: 'oto1',
      variants: [
        {
          id: 'a',
          name: 'Block Product Page',
          mode: 'block',
          pageType: 'product-page',
          palette: 'emerald',
          trafficWeight: 100,
        },
      ],
    },
    // Upsell: template mode (same as always)
    {
      id: 'oto1',
      templateId: 'upsell-vibriance',
      outputFilename: 'oto1.html',
      nextOnAccept: 'thankyou',
      nextOnDecline: 'thankyou',
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
    // Thank you: template mode
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

  // Use DeepSeek for all modes (MiMo balance may be depleted)
  return {
    apiUrl: process.env.DEEPSEEK_API_URL ?? 'https://api.deepseek.com/v1/chat/completions',
    apiKey,
    model: process.env.DEEPSEEK_MODEL ?? 'deepseek-chat',
    temperature: 0.3,
    maxTokens: 16384,
    maxRetries: 3,
  };
}

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('=== BLOCK MODE FUNNEL TEST ===\n');
  console.log(`Entry: block mode (product-page)`);
  console.log(`OTO1: template mode`);
  console.log(`Thank You: template mode`);
  console.log(`Output: ${FUNNEL.outputDir}\n`);

  const config = getConfig();
  console.log(`Model: ${config.model}\n`);

  const result = await generateFunnel(FUNNEL, config);

  console.log('\n=== RESULTS ===');
  console.log(`Success: ${result.success}`);
  console.log(`Duration: ${result.totalDuration}s`);
  console.log(`Total CTAs: ${result.totalCtasInjected}`);

  for (const step of result.steps) {
    console.log(`\n  Step: ${step.stepId}`);
    for (const v of step.variants) {
      console.log(`    variant ${v.variantId}: ${v.success ? '✓' : '✗'} ${path.basename(v.outputPath || '?')} (${v.ctasInjected} CTAs)`);
      if (v.error) console.log(`      Error: ${v.error}`);
    }
  }

  // Validate data-funnel-cta injection
  console.log('\n=== BLOCK MODE CTA VALIDATION ===');
  const entryStep = result.steps.find(s => s.stepId === 'entry');
  if (entryStep) {
    for (const v of entryStep.variants) {
      if (!v.success || !v.outputPath) continue;

      const html = fs.readFileSync(v.outputPath, 'utf-8');
      const funnelCtas = (html.match(/data-funnel-cta/g) || []).length;
      const redirects = (html.match(/window\.location\.href=/g) || []).length;
      const otoLinks = (html.match(/oto1\.html/g) || []).length;

      console.log(`  entry/${v.variantId}:`);
      console.log(`    data-funnel-cta attributes: ${funnelCtas}`);
      console.log(`    window.location.href redirects: ${redirects}`);
      console.log(`    Links to oto1.html: ${otoLinks}`);

      if (funnelCtas === 0) {
        console.log(`    ⚠ NO data-funnel-cta found — block renderers may not have CTA blocks`);
      }
      if (redirects > 0 && otoLinks > 0) {
        console.log(`    ✓ CTAs correctly wired to next step (oto1.html)`);
      }
    }
  }

  console.log('\n=== DONE ===');
  console.log(`Output: ${FUNNEL.outputDir}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
