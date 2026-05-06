/**
 * Purpose: Database seed script — populates initial data for development.
 *          Run with: npm run db:seed (or tsx src/db/seed.ts)
 * Dependencies: drizzle-orm, db, schema
 * Related: Architecture Finale.md §38 (default funnel), §39 (offer templates)
 *
 * WHY: Fresh dev environment needs sample data to be immediately usable.
 *      Seed creates demo product, default funnel, offer templates, and RAG patterns.
 *      Production gets only RAG seed patterns (no demo data).
 */

import { db } from '../lib/db';
import {
  products,
  funnels,
  funnelSteps,
  pageVariants,
  offerTemplates,
  winningPatterns,
} from './schema';
import { getSeedPatterns } from '../services/rag-patterns-seed';
import { createLogger } from '../lib/logger';

const log = createLogger('seed');

// ─── Offer Templates (§39) ────────────────────────────────────────────────────
// WHY: Matching the actual offerTemplates schema:
//   name, category, source, estimatedCvr, bestForNiches, funnelFlow,
//   config, headlines, ctaTexts, whyFreeTexts, guaranteeTexts,
//   cancelWarningTexts, isProven, isActive

const OFFER_TEMPLATES = [
  {
    name: 'Buy 1 Get 1 Free',
    category: 'bogo',
    source: 'lab-tested',
    estimatedCvr: '15%',
    bestForNiches: ['health', 'supplement', 'beauty', 'pet'],
    funnelFlow: ['product-page', 'checkout', 'upsell', 'thank-you'],
    config: { quantities: [1, 1], prices: [1, 0], labels: ['Buy', 'Free'] },
    headlines: ['Buy 1, Get 1 FREE — Limited Time!'],
    ctaTexts: ['Claim Your Free Bottle', 'Yes! I Want 2 for the Price of 1'],
    guaranteeTexts: ['90-Day Money-Back Guarantee'],
    isProven: true,
  },
  {
    name: '3-Bundle Most Popular',
    category: 'bundle',
    source: 'lab-tested',
    estimatedCvr: '22%',
    bestForNiches: ['health', 'supplement', 'beauty', 'pet'],
    funnelFlow: ['product-page', 'checkout', 'upsell', 'downsell', 'thank-you'],
    config: { quantities: [1, 3, 6], pricePerUnit: [1.0, 0.67, 0.50], labels: ['Single', 'Most Popular', 'Best Value'] },
    headlines: ['Most Popular: 3 Bottles at 33% OFF'],
    ctaTexts: ['Get My 3-Bottle Deal', 'Yes! Give Me the Best Value'],
    guaranteeTexts: ['90-Day Money-Back Guarantee', 'Free Shipping on 3+ Bottles'],
    isProven: true,
  },
  {
    name: 'Free Trial + Shipping',
    category: 'free_trial',
    source: 'lab-tested',
    estimatedCvr: '35%',
    bestForNiches: ['health', 'supplement', 'beauty'],
    funnelFlow: ['product-page', 'checkout', 'upsell', 'thank-you'],
    config: { shippingOnly: true, trialDays: 14, subscriptionPrice: 0.8 },
    headlines: ['Try It FREE — Just Pay Shipping'],
    ctaTexts: ['Start My Free Trial', 'Yes! Send My Free Bottle'],
    whyFreeTexts: ['We\'re so confident you\'ll love it that we\'ll send your first bottle absolutely free'],
    guaranteeTexts: ['Cancel Anytime — No Questions Asked'],
    isProven: true,
  },
  {
    name: 'Subscribe & Save 20%',
    category: 'subscription',
    source: 'industry-standard',
    estimatedCvr: '18%',
    bestForNiches: ['health', 'supplement', 'beauty', 'pet'],
    funnelFlow: ['product-page', 'checkout', 'upsell', 'thank-you'],
    config: { discount: 0.20, intervals: ['monthly', 'quarterly'], defaultInterval: 'monthly' },
    headlines: ['Save 20% With Monthly Delivery'],
    ctaTexts: ['Subscribe & Save 20%', 'Start My Monthly Supply'],
    guaranteeTexts: ['Skip, Pause, or Cancel Anytime'],
    isProven: true,
  },
  {
    name: 'Flash Sale 50% Off',
    category: 'flash_sale',
    source: 'lab-tested',
    estimatedCvr: '28%',
    bestForNiches: ['health', 'supplement', 'beauty', 'pet'],
    funnelFlow: ['product-page', 'checkout', 'thank-you'],
    config: { discount: 0.50, urgencyHours: 24 },
    headlines: ['FLASH SALE: 50% OFF — Ends Tonight!'],
    ctaTexts: ['Grab 50% Off Now', 'Yes! I Want Half Price'],
    guaranteeTexts: ['90-Day Money-Back Guarantee'],
    isProven: true,
  },
  {
    name: 'Buy 2 Get 1 Free',
    category: 'bogo',
    source: 'lab-tested',
    estimatedCvr: '19%',
    bestForNiches: ['health', 'supplement', 'beauty', 'pet'],
    funnelFlow: ['product-page', 'checkout', 'upsell', 'thank-you'],
    config: { quantities: [2, 1], prices: [1, 1, 0], labels: ['Buy 2', 'Get 1 Free'] },
    headlines: ['Buy 2, Get 1 FREE — Save 33%'],
    ctaTexts: ['Get 3 for the Price of 2', 'Claim My Free Bottle'],
    guaranteeTexts: ['90-Day Money-Back Guarantee'],
    isProven: true,
  },
  {
    name: 'Starter Kit',
    category: 'bundle',
    source: 'industry-standard',
    estimatedCvr: '12%',
    bestForNiches: ['health', 'supplement', 'beauty'],
    funnelFlow: ['product-page', 'checkout', 'thank-you'],
    config: { items: ['product', 'guide', 'shaker'], bundlePrice: 0.75 },
    headlines: ['Complete Starter Kit — Everything You Need'],
    ctaTexts: ['Get My Starter Kit', 'Start My Journey'],
    guaranteeTexts: ['90-Day Money-Back Guarantee'],
    isProven: false,
  },
  {
    name: 'Loyalty Repeat Discount',
    category: 'loyalty',
    source: 'industry-standard',
    estimatedCvr: '10%',
    bestForNiches: ['health', 'supplement', 'beauty', 'pet'],
    funnelFlow: ['product-page', 'checkout', 'thank-you'],
    config: { discount: 0.15, minOrders: 2 },
    headlines: ['Welcome Back! 15% Off Your Next Order'],
    ctaTexts: ['Claim My 15% Discount', 'Reorder Now'],
    guaranteeTexts: ['Same 90-Day Guarantee'],
    isProven: false,
  },
  {
    name: 'Referral $10/$10',
    category: 'referral',
    source: 'industry-standard',
    estimatedCvr: '8%',
    bestForNiches: ['health', 'supplement', 'beauty', 'pet'],
    funnelFlow: ['thank-you'],
    config: { referrerCredit: 10, friendDiscount: 10 },
    headlines: ['Give $10, Get $10'],
    ctaTexts: ['Share With a Friend'],
    guaranteeTexts: ['Friend Gets $10 Off Their First Order'],
    isProven: false,
  },
  {
    name: 'Guarantee Bundle',
    category: 'guarantee',
    source: 'lab-tested',
    estimatedCvr: '14%',
    bestForNiches: ['health', 'supplement', 'beauty', 'pet'],
    funnelFlow: ['product-page', 'checkout', 'upsell', 'thank-you'],
    config: { guaranteeDays: 90, bundleDiscount: 0.30 },
    headlines: ['Try Risk-Free: 90-Day Empty Bottle Guarantee'],
    ctaTexts: ['Try Risk-Free', 'Start My 90-Day Trial'],
    guaranteeTexts: ['Full refund even if the bottle is empty'],
    isProven: true,
  },
];

// ─── Main Seed Function ───────────────────────────────────────────────────────

async function seed() {
  log.info('Seeding database...');

  const isProduction = process.env.NODE_ENV === 'production';

  try {
    // ── 1. RAG Seed Patterns (ALWAYS — prod and dev) ────────────────────────
    log.info('Seeding RAG patterns...');

    const allPatterns = [
      ...getSeedPatterns('upsell'),
      ...getSeedPatterns('checkout'),
      ...getSeedPatterns('downsell'),
      ...getSeedPatterns('product-page'),
    ];

    if (allPatterns.length > 0) {
      await db.insert(winningPatterns).values(
        allPatterns.map((p) => ({
          patternType: p.patternType,
          pageType: p.pageType,
          vertical: 'general',
          description: p.description,
          blockSignature: {},
          liftPercent: p.liftPercent,
          confidence: 0.95,
          sampleSize: p.sampleSize,
          status: p.status,
        })),
      ).onConflictDoNothing();
      log.info(`Seeded ${allPatterns.length} RAG patterns`);
    }

    // ── 2. Offer Templates (ALWAYS) ─────────────────────────────────────────
    log.info('Seeding offer templates...');

    await db.insert(offerTemplates).values(
      OFFER_TEMPLATES.map((t) => ({
        name: t.name,
        category: t.category,
        source: t.source ?? null,
        estimatedCvr: t.estimatedCvr ?? null,
        bestForNiches: t.bestForNiches,
        funnelFlow: t.funnelFlow,
        config: t.config,
        headlines: t.headlines ?? [],
        ctaTexts: t.ctaTexts ?? [],
        whyFreeTexts: (t as { whyFreeTexts?: string[] }).whyFreeTexts ?? [],
        guaranteeTexts: t.guaranteeTexts ?? [],
        cancelWarningTexts: (t as { cancelWarningTexts?: string[] }).cancelWarningTexts ?? [],
        isProven: t.isProven,
      })),
    ).onConflictDoNothing();
    log.info(`Seeded ${OFFER_TEMPLATES.length} offer templates`);

    // ── 3. Dev-only seed data ────────────────────────────────────────────────
    if (!isProduction) {
      log.info('Seeding demo data (dev only)...');

      // Demo product — matching products schema (name, description, images, price, compareAtPrice, metadata)
      const [demoProduct] = await db.insert(products).values({
        name: 'GutRevive Pro',
        description: 'Advanced gut health supplement with 50 billion CFU probiotics, prebiotics, and digestive enzymes. Clinically studied strains for bloating relief and microbiome support.',
        images: ['/demo/gutrevive-bottle.png'],
        price: '49.97',
        compareAtPrice: '89.97',
        metadata: {
          niche: 'health',
          targetAudience: 'Adults 35-65 experiencing bloating, digestive discomfort',
          benefits: [
            'Reduces bloating within 7 days',
            '50 billion CFU with 16 clinically studied strains',
            'Prebiotic fiber feeds good bacteria',
            'Digestive enzymes break down hard-to-digest foods',
            'Made in FDA-registered facility, GMP certified',
          ],
          guarantee: '90-day full refund, no questions asked',
        },
      }).returning();
      log.info(`Created demo product: ${demoProduct.name}`);

      // Default funnel
      const [demoFunnel] = await db.insert(funnels).values({
        name: 'GutRevive Pro — Main Funnel',
        slug: 'gutrevive-main',
        productId: demoProduct.id,
        status: 'draft',
      }).returning();
      log.info(`Created demo funnel: ${demoFunnel.name}`);

      // 5 default steps
      const steps: Array<{ type: 'product-page' | 'checkout' | 'upsell' | 'downsell' | 'thank-you'; name: string; slug: string; sortOrder: number }> = [
        { type: 'product-page', name: 'Product Page', slug: 'product-page', sortOrder: 1 },
        { type: 'checkout', name: 'Checkout', slug: 'checkout', sortOrder: 2 },
        { type: 'upsell', name: 'Upsell', slug: 'upsell', sortOrder: 3 },
        { type: 'downsell', name: 'Downsell', slug: 'downsell', sortOrder: 4 },
        { type: 'thank-you', name: 'Thank You', slug: 'thank-you', sortOrder: 5 },
      ];

      for (const step of steps) {
        const [newStep] = await db.insert(funnelSteps).values({
          funnelId: demoFunnel.id,
          type: step.type,
          name: step.name,
          slug: step.slug,
          sortOrder: step.sortOrder,
        }).returning();

        // Default empty variant
        await db.insert(pageVariants).values({
          stepId: newStep.id,
          name: 'Default',
          status: 'draft',
          trafficWeight: 100,
          isControl: true,
          page: {
            version: '1.0',
            pageType: step.type,
            palette: 'health-warm',
            blocks: [],
            metadata: { title: `${step.name} — GutRevive Pro`, description: '' },
          },
        });
      }
      log.info(`Created ${steps.length} default funnel steps`);
    }

    log.info('Seed complete!');
  } catch (error) {
    log.error('Seed failed', { error: error instanceof Error ? error.message : String(error) });
    process.exit(1);
  }

  process.exit(0);
}

seed();
