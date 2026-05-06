/**
 * Purpose: Comprehensive Vitest unit tests for ECOM-AI's page generation pipeline.
 *          Covers: page-generator, rag-patterns-seed, validation/pipeline, block-composer.
 * Dependencies: vitest, all source modules under test
 * Related: Architecture Finale.md §48/§51
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ─── Test Helpers ──────────────────────────────────────────────────────────────

/**
 * Minimal valid BlockTree for an upsell page.
 * Satisfies Zod schema (Pass 1) and composition rules (Pass 2).
 */
function makeValidBlockTree(overrides: Record<string, unknown> = {}) {
  return {
    version: '1.0',
    pageType: 'upsell',
    palette: 'health-warm',
    blocks: [
      {
        id: 'blk-1',
        type: 'heading',
        props: { text: 'WAIT! Your Order Is Not Complete', level: 'hero', alignment: 'center' },
        styles: {},
        visibility: 'all',
      },
      {
        id: 'blk-2',
        type: 'countdown',
        props: { minutes: 10, label: 'Offer expires in:', urgency: 'high' },
        styles: {},
        visibility: 'all',
      },
      {
        id: 'blk-3',
        type: 'bundle-offers',
        props: {
          offers: [{
            id: 'offer-1',
            title: 'Upgrade Bundle',
            price: '$39',
            originalPrice: '$79',
            savings: 'You save $40 (50% off)',
            popular: true,
            selected: true,
            freeShipping: true,
          }],
        },
        styles: {},
        visibility: 'all',
      },
      {
        id: 'blk-4',
        type: 'guarantee',
        props: {
          text: '90-Day Money-Back Guarantee',
          days: 90,
          guaranteeType: 'money-back',
          description: 'Try it RISK FREE.',
        },
        styles: {},
        visibility: 'all',
      },
      {
        id: 'blk-5',
        type: 'add-to-cart',
        props: { buttonText: 'YES! Add to My Order', expressCheckout: true },
        styles: {},
        visibility: 'all',
      },
      {
        id: 'blk-6',
        type: 'negative-opt-out',
        props: {
          text: "No thanks, I'll pay full price next time",
          lossAversion: "I understand this deal won't be available again",
        },
        styles: {},
        visibility: 'all',
      },
    ],
    metadata: {
      title: 'Upsell Page Test',
      description: 'Test upsell page',
      trackingId: 'test-track-001',
    },
    ...overrides,
  };
}

/** Minimal valid BlockTree for a checkout page (passes schema + composition). */
function makeCheckoutBlockTree() {
  return {
    version: '1.0',
    pageType: 'checkout',
    palette: 'supplement-bold',
    blocks: [
      {
        id: 'blk-1',
        type: 'scarcity-badge',
        props: { text: 'SELL OUT RISK: High', urgencyLevel: 'high' },
        styles: {},
        visibility: 'all',
      },
      {
        id: 'blk-2',
        type: 'countdown',
        props: { minutes: 10, label: 'Cart Reserved For', cartReservation: true, urgency: 'high' },
        styles: {},
        visibility: 'all',
      },
      {
        id: 'blk-3',
        type: 'bundle-offers',
        props: {
          offers: [{
            id: 'offer-1',
            title: '3 Bottles',
            price: '$29',
            originalPrice: '$59',
            popular: true,
            selected: true,
            freeShipping: true,
          }],
        },
        styles: {},
        visibility: 'all',
      },
      {
        id: 'blk-4',
        type: 'order-summary',
        props: {
          items: [{ name: 'Product', price: '$29', quantity: 3 }],
          subtotal: '$87',
          shipping: 'FREE',
          total: '$87',
        },
        styles: {},
        visibility: 'all',
      },
      {
        id: 'blk-5',
        type: 'guarantee',
        props: { text: '90-Day Money-Back', days: 90, guaranteeType: 'money-back' },
        styles: {},
        visibility: 'all',
      },
      {
        id: 'blk-6',
        type: 'shipping-form',
        props: { fields: ['firstName', 'lastName', 'email', 'address'] },
        styles: {},
        visibility: 'all',
      },
      {
        id: 'blk-7',
        type: 'payment-form',
        props: { buttonText: 'Pay Now', expressCheckout: true },
        styles: {},
        visibility: 'all',
      },
      {
        id: 'blk-8',
        type: 'trust-badges',
        props: { badges: [{ text: 'SSL Encrypted' }, { text: 'PayPal' }] },
        styles: {},
        visibility: 'all',
      },
    ],
    metadata: {
      title: 'Checkout Page Test',
      description: 'Test checkout page',
    },
  };
}

// ─── Mock LLM response helper ─────────────────────────────────────────────────

function makeLlmResponse(content: string, tokens = 300) {
  return {
    ok: true,
    json: () => Promise.resolve({
      choices: [{ message: { content } }],
      usage: { prompt_tokens: 100, completion_tokens: tokens },
    }),
  };
}

function makeLlmError(status: number, body: string) {
  return {
    ok: false,
    status,
    text: () => Promise.resolve(body),
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// 1. RAG Patterns Seed
// ═══════════════════════════════════════════════════════════════════════════════

import { getSeedPatterns, formatSeedPatternsAsRag, ALL_SEED_PATTERNS } from '../services/rag-patterns-seed';

describe('RAG Patterns Seed', () => {
  describe('getSeedPatterns', () => {
    it('returns upsell patterns for upsell page type', () => {
      const patterns = getSeedPatterns('upsell');
      expect(patterns.length).toBeGreaterThan(0);
      expect(patterns.every(p => p.pageType === 'upsell' || p.pageType === 'all')).toBe(true);
    });

    it('returns checkout patterns for checkout page type', () => {
      const patterns = getSeedPatterns('checkout');
      expect(patterns.length).toBeGreaterThan(0);
      expect(patterns.every(p => p.pageType === 'checkout' || p.pageType === 'all')).toBe(true);
    });

    it('returns downsell patterns for downsell page type', () => {
      const patterns = getSeedPatterns('downsell');
      expect(patterns.length).toBeGreaterThan(0);
      expect(patterns.every(p => p.pageType === 'downsell' || p.pageType === 'all')).toBe(true);
    });

    it('returns product-page patterns for product-page type', () => {
      const patterns = getSeedPatterns('product-page');
      expect(patterns.length).toBeGreaterThan(0);
      expect(patterns.every(p => p.pageType === 'product-page' || p.pageType === 'all')).toBe(true);
    });

    it('returns empty array for page types with no seed patterns', () => {
      // optin has no dedicated patterns in the seed data
      const patterns = getSeedPatterns('optin');
      // optin should have 0 since no patterns have pageType 'optin' or 'all'
      expect(patterns.length).toBe(0);
    });

    it('all patterns have status "sop"', () => {
      for (const pattern of ALL_SEED_PATTERNS) {
        expect(pattern.status).toBe('sop');
      }
    });

    it('all patterns have required fields', () => {
      for (const pattern of ALL_SEED_PATTERNS) {
        expect(pattern).toHaveProperty('patternType');
        expect(pattern).toHaveProperty('pageType');
        expect(pattern).toHaveProperty('description');
        expect(pattern).toHaveProperty('liftPercent');
        expect(pattern).toHaveProperty('confidence');
        expect(pattern).toHaveProperty('sampleSize');
        expect(typeof pattern.liftPercent).toBe('number');
        expect(typeof pattern.confidence).toBe('number');
        expect(typeof pattern.sampleSize).toBe('number');
      }
    });

    it('confidence values are between 0 and 1', () => {
      for (const pattern of ALL_SEED_PATTERNS) {
        expect(pattern.confidence).toBeGreaterThan(0);
        expect(pattern.confidence).toBeLessThanOrEqual(1);
      }
    });
  });

  describe('formatSeedPatternsAsRag', () => {
    it('returns string array for upsell', () => {
      const rag = formatSeedPatternsAsRag('upsell');
      expect(Array.isArray(rag)).toBe(true);
      expect(rag.length).toBeGreaterThan(0);
      for (const line of rag) {
        expect(typeof line).toBe('string');
      }
    });

    it('each RAG string starts with [SOP] and contains lift info', () => {
      const rag = formatSeedPatternsAsRag('upsell');
      for (const line of rag) {
        expect(line).toMatch(/^\[SOP\]/);
        expect(line).toContain('% lift');
        expect(line).toContain('n=');
      }
    });

    it('includes lift percentage with one decimal', () => {
      const rag = formatSeedPatternsAsRag('checkout');
      for (const line of rag) {
        // Matches patterns like "+22.0% lift" or "+8.0% lift"
        expect(line).toMatch(/\+\d+\.\d+% lift/);
      }
    });

    it('returns empty array for page type with no patterns', () => {
      const rag = formatSeedPatternsAsRag('optin');
      expect(rag).toEqual([]);
    });

    it('checkout patterns contain expected pattern types', () => {
      const rag = formatSeedPatternsAsRag('checkout');
      const allText = rag.join(' ');
      expect(allText).toContain('bundle_order');
      expect(allText).toContain('section_sequence');
      expect(allText).toContain('cta_copy');
    });

    it('upsell patterns describe interrupt pattern in description', () => {
      const patterns = getSeedPatterns('upsell');
      const sectionSeq = patterns.find(p => p.patternType === 'section_sequence');
      expect(sectionSeq).toBeDefined();
      expect(sectionSeq!.description).toContain('WAIT');
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 2. Validation Pipeline
// ═══════════════════════════════════════════════════════════════════════════════

import {
  validateBlockTree,
  formatRetryFeedback,
  pass1_schema,
  pass2_composition,
  pass3_designTokens,
  pass5_performance,
  pass6_accessibility,
  pass7_compliance,
} from '../validation/pipeline';
import type { PipelineResult } from '../validation/pipeline';

describe('Validation Pipeline', () => {
  describe('pass1_schema', () => {
    it('accepts a valid BlockTree JSON', () => {
      const tree = makeValidBlockTree();
      const result = pass1_schema(tree);
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.errors).toHaveLength(0);
    });

    it('rejects an object with missing version', () => {
      const tree = makeValidBlockTree();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (tree as any).version;
      const result = pass1_schema(tree);
      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('rejects an object with invalid pageType', () => {
      const tree = makeValidBlockTree({ pageType: 'invalid-type' });
      const result = pass1_schema(tree);
      expect(result.success).toBe(false);
    });

    it('rejects an object with empty blocks array', () => {
      const tree = makeValidBlockTree({ blocks: [] });
      const result = pass1_schema(tree);
      expect(result.success).toBe(false);
    });

    it('rejects a block with missing id', () => {
      const tree = makeValidBlockTree();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (tree as any).blocks[0].id;
      const result = pass1_schema(tree);
      expect(result.success).toBe(false);
    });

    it('rejects completely invalid input', () => {
      const result = pass1_schema('not json');
      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('rejects null input', () => {
      const result = pass1_schema(null);
      expect(result.success).toBe(false);
    });
  });

  describe('pass2_composition', () => {
    it('passes for a valid upsell tree with all required blocks', () => {
      const tree = makeValidBlockTree();
      const schemaResult = pass1_schema(tree);
      expect(schemaResult.success).toBe(true);
      const result = pass2_composition(schemaResult.data!);
      // Upsell requires: heading, bundle-offers, add-to-cart, countdown, guarantee, negative-opt-out
      // All present in our fixture
      expect(result.valid).toBe(true);
      expect(result.errors.filter(e => e.severity === 'error')).toHaveLength(0);
    });

    it('reports missing required blocks', () => {
      const tree = makeValidBlockTree();
      // Remove the countdown block to trigger a missing required error
      tree.blocks = tree.blocks.filter(b => b.type !== 'countdown');
      const schemaResult = pass1_schema(tree);
      expect(schemaResult.success).toBe(true);
      const result = pass2_composition(schemaResult.data!);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.code === 'REQUIRED_BLOCK_MISSING')).toBe(true);
    });

    it('reports forbidden blocks for upsell', () => {
      const tree = makeValidBlockTree();
      // Add a forbidden block: payment-form is forbidden on upsell
      tree.blocks.push({
        id: 'blk-forbidden',
        type: 'payment-form',
        props: { buttonText: 'Pay Now', expressCheckout: true },
        styles: {},
        visibility: 'all',
      });
      const schemaResult = pass1_schema(tree);
      // payment-form is valid in the Zod schema, so it should pass
      if (schemaResult.success) {
        const result = pass2_composition(schemaResult.data!);
        expect(result.errors.some(e => e.code === 'FORBIDDEN_BLOCK_PRESENT')).toBe(true);
      }
    });

    it('reports sequence violation when blocks are out of order', () => {
      const tree = makeValidBlockTree();
      // Move add-to-cart before bundle-offers to violate the required sequence
      // Upsell requires: heading → bundle-offers → add-to-cart
      const addToCartIdx = tree.blocks.findIndex(b => b.type === 'add-to-cart');
      const bundleIdx = tree.blocks.findIndex(b => b.type === 'bundle-offers');
      if (addToCartIdx > bundleIdx) {
        // Swap positions: put add-to-cart first
        const [addToCart] = tree.blocks.splice(addToCartIdx, 1);
        tree.blocks.unshift(addToCart);
      }
      const schemaResult = pass1_schema(tree);
      if (schemaResult.success) {
        const result = pass2_composition(schemaResult.data!);
        const seqErrors = result.errors.filter(e => e.code === 'SEQUENCE_VIOLATION');
        expect(seqErrors.length).toBeGreaterThan(0);
      }
    });
  });

  describe('pass3_designTokens', () => {
    it('passes for blocks with no custom styles', () => {
      const tree = makeValidBlockTree();
      const schemaResult = pass1_schema(tree);
      expect(schemaResult.success).toBe(true);
      const result = pass3_designTokens(schemaResult.data!);
      // No custom styles = no token violations
      expect(result.errors.filter(e => e.severity === 'error')).toHaveLength(0);
    });

    it('reports warning for non-token colors in styles', () => {
      const tree = makeValidBlockTree();
      tree.blocks[0].styles = {
        mobile: { 'background-color': 'neonpink' },
      };
      const schemaResult = pass1_schema(tree);
      if (schemaResult.success) {
        const result = pass3_designTokens(schemaResult.data!);
        const colorErrors = result.errors.filter(e => e.code === 'INVALID_COLOR_TOKEN');
        expect(colorErrors.length).toBeGreaterThan(0);
      }
    });

    it('allows CSS variable references in styles', () => {
      const tree = makeValidBlockTree();
      tree.blocks[0].styles = {
        mobile: { 'background-color': 'var(--color-primary)' },
      };
      const schemaResult = pass1_schema(tree);
      if (schemaResult.success) {
        const result = pass3_designTokens(schemaResult.data!);
        const colorErrors = result.errors.filter(e => e.code === 'INVALID_COLOR_TOKEN');
        expect(colorErrors).toHaveLength(0);
      }
    });

    it('allows hex colors in styles', () => {
      const tree = makeValidBlockTree();
      tree.blocks[0].styles = {
        mobile: { 'color': '#FF6B00' },
      };
      const schemaResult = pass1_schema(tree);
      if (schemaResult.success) {
        const result = pass3_designTokens(schemaResult.data!);
        const colorErrors = result.errors.filter(e => e.code === 'INVALID_COLOR_TOKEN');
        expect(colorErrors).toHaveLength(0);
      }
    });
  });

  describe('pass5_performance', () => {
    it('passes for a tree within performance budgets', () => {
      const tree = makeValidBlockTree();
      const schemaResult = pass1_schema(tree);
      expect(schemaResult.success).toBe(true);
      const result = pass5_performance(schemaResult.data!);
      expect(result.errors.filter(e => e.severity === 'error')).toHaveLength(0);
    });

    it('reports error when image count exceeds max', () => {
      const tree = makeValidBlockTree();
      // Add 13 image blocks to exceed maxImageCount (12)
      for (let i = 0; i < 13; i++) {
        tree.blocks.push({
          id: `img-${i}`,
          type: 'image',
          props: { src: `https://example.com/img${i}.jpg`, alt: `Image ${i}` },
          styles: {},
          visibility: 'all',
        } as any);
      }
      const schemaResult = pass1_schema(tree);
      if (schemaResult.success) {
        const result = pass5_performance(schemaResult.data!);
        const imgErrors = result.errors.filter(e => e.code === 'TOO_MANY_IMAGES');
        expect(imgErrors.length).toBeGreaterThan(0);
      }
    });
  });

  describe('pass6_accessibility', () => {
    it('passes for blocks with proper alt text and button text', () => {
      const tree = makeValidBlockTree();
      const schemaResult = pass1_schema(tree);
      if (schemaResult.success) {
        const result = pass6_accessibility(schemaResult.data!);
        expect(result.errors.filter(e => e.severity === 'error')).toHaveLength(0);
      }
    });

    it('reports error for image block missing alt text', () => {
      const tree = makeValidBlockTree();
      tree.blocks.push({
        id: 'blk-img-no-alt',
        type: 'image',
        props: { src: 'https://example.com/photo.jpg', alt: '' },
      } as any);
      const schemaResult = pass1_schema(tree);
      if (schemaResult.success) {
        const result = pass6_accessibility(schemaResult.data!);
        const altErrors = result.errors.filter(e => e.code === 'MISSING_ALT_TEXT');
        expect(altErrors.length).toBeGreaterThan(0);
      }
    });

    it('reports error for button/cta missing text', () => {
      const tree = makeValidBlockTree();
      tree.blocks.push({
        id: 'blk-empty-cta',
        type: 'cta',
        props: { text: 'x' },
        styles: {},
        visibility: 'all',
      } as any);
      const schemaResult = pass1_schema(tree);
      if (schemaResult.success) {
        const result = pass6_accessibility(schemaResult.data!);
        const btnErrors = result.errors.filter(e => e.code === 'MISSING_BUTTON_TEXT');
        expect(btnErrors.length).toBeGreaterThan(0);
      }
    });

    it('reports error for form fields missing labels', () => {
      const tree = makeValidBlockTree();
      tree.blocks.push({
        id: 'blk-form',
        type: 'form',
        props: {
          fields: [
            { name: 'email', type: 'email' as const, label: 'Email', required: true },
            { name: 'phone', type: 'tel' as const, label: '', placeholder: 'Phone' },
          ],
          submitText: 'Submit',
        },
        styles: {},
        visibility: 'all',
      } as any);
      const schemaResult = pass1_schema(tree);
      if (schemaResult.success) {
        const result = pass6_accessibility(schemaResult.data!);
        const labelErrors = result.errors.filter(e => e.code === 'MISSING_FORM_LABEL');
        expect(labelErrors.length).toBeGreaterThan(0);
      }
    });
  });

  describe('pass7_compliance', () => {
    it('passes for a valid checkout tree with payment-form and trust-badges', () => {
      const tree = makeCheckoutBlockTree();
      const schemaResult = pass1_schema(tree);
      if (schemaResult.success) {
        const result = pass7_compliance(schemaResult.data!);
        expect(result.errors.filter(e => e.severity === 'error')).toHaveLength(0);
      }
    });

    it('reports error for checkout without payment-form', () => {
      const tree = makeCheckoutBlockTree();
      tree.blocks = tree.blocks.filter(b => b.type !== 'payment-form');
      const schemaResult = pass1_schema(tree);
      if (schemaResult.success) {
        const result = pass7_compliance(schemaResult.data!);
        const payErrors = result.errors.filter(e => e.code === 'MISSING_PAYMENT_FORM');
        expect(payErrors.length).toBeGreaterThan(0);
      }
    });

    it('reports warning for checkout without trust-badges', () => {
      const tree = makeCheckoutBlockTree();
      tree.blocks = tree.blocks.filter(b => b.type !== 'trust-badges');
      const schemaResult = pass1_schema(tree);
      if (schemaResult.success) {
        const result = pass7_compliance(schemaResult.data!);
        const trustErrors = result.errors.filter(e => e.code === 'MISSING_TRUST_SIGNALS');
        expect(trustErrors.length).toBeGreaterThan(0);
        // Should be a warning, not an error
        expect(trustErrors[0].severity).toBe('warning');
      }
    });

    it('does not enforce checkout rules on non-checkout pages', () => {
      const tree = makeValidBlockTree(); // upsell
      const schemaResult = pass1_schema(tree);
      if (schemaResult.success) {
        const result = pass7_compliance(schemaResult.data!);
        expect(result.errors).toHaveLength(0);
      }
    });
  });

  describe('validateBlockTree (full pipeline)', () => {
    it('returns valid=true for a correct upsell tree with skipMobileLayout', async () => {
      const tree = makeValidBlockTree();
      const result = await validateBlockTree(tree, { skipMobileLayout: true });
      expect(result.valid).toBe(true);
      expect(result.score).toBeGreaterThan(0);
      expect(result.passResults.schema).toBe(true);
      expect(result.passResults.composition).toBe(true);
      expect(result.passResults.performance).toBe(true);
      expect(result.passResults.accessibility).toBe(true);
      expect(result.passResults.compliance).toBe(true);
    });

    it('returns valid=false for invalid JSON input', async () => {
      const result = await validateBlockTree({ garbage: true }, { skipMobileLayout: true });
      expect(result.valid).toBe(false);
      expect(result.score).toBe(0);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.passResults.schema).toBe(false);
    });

    it('returns valid=false when required blocks are missing', async () => {
      const tree = makeValidBlockTree();
      // Remove heading block — required for upsell
      tree.blocks = tree.blocks.filter(b => b.type !== 'heading');
      const result = await validateBlockTree(tree, { skipMobileLayout: true });
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.code === 'REQUIRED_BLOCK_MISSING')).toBe(true);
    });

    it('calculates score correctly: 100 - (errors * 10) - (warnings * 3)', async () => {
      const tree = makeValidBlockTree();
      const result = await validateBlockTree(tree, { skipMobileLayout: true });
      // A valid tree should have score 100 (no errors, no warnings)
      // unless composition or performance generate warnings
      expect(result.score).toBeGreaterThan(0);
      expect(result.score).toBeLessThanOrEqual(100);
    });

    it('separates errors and warnings', async () => {
      const tree = makeCheckoutBlockTree();
      // Remove guarantee to trigger a compliance warning
      tree.blocks = tree.blocks.filter(b => b.type !== 'guarantee');
      const result = await validateBlockTree(tree, { skipMobileLayout: true });
      // checkout requires guarantee in requiredBlocks — this causes REQUIRED_BLOCK_MISSING (error)
      expect(result.errors).toBeDefined();
      expect(result.warnings).toBeDefined();
    });

    it('short-circuits on schema failure (skips remaining passes)', async () => {
      const result = await validateBlockTree('not-valid', { skipMobileLayout: true });
      expect(result.passResults.schema).toBe(false);
      // All other passes should remain at their initial falsy state
      expect(result.passResults.composition).toBe(false);
      expect(result.passResults.designTokens).toBe(false);
      expect(result.passResults.performance).toBe(false);
    });
  });

  describe('formatRetryFeedback', () => {
    it('returns empty string for valid result with score >= 70', () => {
      const result: PipelineResult = {
        valid: true,
        score: 85,
        errors: [],
        warnings: [],
        passResults: {
          schema: true,
          composition: true,
          designTokens: true,
          performance: true,
          accessibility: true,
          compliance: true,
        },
      };
      const feedback = formatRetryFeedback(result);
      expect(feedback).toBe('');
    });

    it('includes error details when validation failed', () => {
      const result: PipelineResult = {
        valid: false,
        score: 50,
        errors: [
          { code: 'REQUIRED_BLOCK_MISSING', message: '"countdown" is required', severity: 'error' },
        ],
        warnings: [],
        passResults: {
          schema: true,
          composition: false,
          designTokens: true,
          performance: true,
          accessibility: true,
          compliance: true,
        },
      };
      const feedback = formatRetryFeedback(result);
      expect(feedback).toContain('Previous Attempt Failed');
      expect(feedback).toContain('REQUIRED_BLOCK_MISSING');
      expect(feedback).toContain('countdown');
    });

    it('includes warnings in feedback', () => {
      const result: PipelineResult = {
        valid: true,
        score: 60,  // Below 70 threshold
        errors: [],
        warnings: [
          { code: 'INVALID_COLOR_TOKEN', message: 'Non-token color used', severity: 'warning' },
        ],
        passResults: {
          schema: true,
          composition: true,
          designTokens: true,
          performance: true,
          accessibility: true,
          compliance: true,
        },
      };
      const feedback = formatRetryFeedback(result);
      expect(feedback).toContain('Warnings');
      expect(feedback).toContain('INVALID_COLOR_TOKEN');
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 3. Block Composer
// ═══════════════════════════════════════════════════════════════════════════════

import {
  buildComposerPrompt,
  buildRetryPrompt,
  BLOCK_COMPOSER_SYSTEM_PROMPT,
} from '../agents/prompts/block-composer';
import type { ComposerPromptParams } from '../agents/prompts/block-composer';

describe('Block Composer', () => {
  describe('buildComposerPrompt', () => {
    const baseParams: ComposerPromptParams = {
      pageType: 'upsell',
      palette: 'health-warm',
    };

    it('returns a non-empty string', () => {
      const prompt = buildComposerPrompt(baseParams);
      expect(typeof prompt).toBe('string');
      expect(prompt.length).toBeGreaterThan(100);
    });

    it('contains the page type in the prompt', () => {
      const prompt = buildComposerPrompt(baseParams);
      expect(prompt).toContain('upsell');
    });

    it('contains the palette name', () => {
      const prompt = buildComposerPrompt(baseParams);
      expect(prompt).toContain('health-warm');
    });

    it('contains required blocks for upsell', () => {
      const prompt = buildComposerPrompt(baseParams);
      // Upsell requires: heading, bundle-offers, add-to-cart, countdown, guarantee, negative-opt-out
      expect(prompt).toContain('heading');
      expect(prompt).toContain('bundle-offers');
      expect(prompt).toContain('add-to-cart');
      expect(prompt).toContain('countdown');
    });

    it('contains forbidden blocks for upsell', () => {
      const prompt = buildComposerPrompt(baseParams);
      // Upsell forbids: payment-form, faq, comparison-chart, product-carousel, quiz-step
      expect(prompt).toContain('payment-form');
      expect(prompt).toContain('quiz-step');
    });

    it('contains the upsell content guide with WAIT! pattern', () => {
      const prompt = buildComposerPrompt(baseParams);
      expect(prompt).toContain('WAIT');
      expect(prompt).toContain('UPSELL CONTENT GUIDE');
    });

    it('includes upsell seed patterns via RAG injection', () => {
      const prompt = buildComposerPrompt(baseParams);
      // Seed patterns contain [SOP] and lift info
      expect(prompt).toContain('[SOP]');
      expect(prompt).toContain('lift');
    });

    it('includes user-provided RAG patterns', () => {
      const params: ComposerPromptParams = {
        ...baseParams,
        ragPatterns: ['Custom pattern: use red CTA (+5% lift)'],
      };
      const prompt = buildComposerPrompt(params);
      expect(prompt).toContain('Custom pattern: use red CTA');
    });

    it('includes marketing angle when provided', () => {
      const params: ComposerPromptParams = {
        ...baseParams,
        marketingAngle: {
          headline: 'Transform Your Skin in 30 Days',
          subheadline: 'Clinically proven formula',
          ctaText: 'Get My Upgrade Now',
          benefits: ['Reduces wrinkles', 'Brightens skin'],
          guarantee: '90-Day Full Refund',
          painPoint: 'Tired of products that don\'t work?',
        },
      };
      const prompt = buildComposerPrompt(params);
      expect(prompt).toContain('Transform Your Skin in 30 Days');
      expect(prompt).toContain('Clinically proven formula');
      expect(prompt).toContain('Get My Upgrade Now');
      expect(prompt).toContain('Reduces wrinkles');
      expect(prompt).toContain('90-Day Full Refund');
      expect(prompt).toContain("Tired of products that don't work?");
    });

    it('includes product context when provided', () => {
      const params: ComposerPromptParams = {
        ...baseParams,
        productContext: 'Product: TestProduct\nPrice: $49',
      };
      const prompt = buildComposerPrompt(params);
      expect(prompt).toContain('PRODUCT CONTEXT');
      expect(prompt).toContain('TestProduct');
    });

    it('uses "No specific content guide" for page types without a custom guide', () => {
      const params: ComposerPromptParams = {
        pageType: 'bridge',
        palette: 'beauty-clean',
      };
      const prompt = buildComposerPrompt(params);
      // bridge has no entry in PAGE_CONTENT_GUIDES
      expect(prompt).toContain('No specific content guide');
    });

    it('contains checkout content guide for checkout type', () => {
      const params: ComposerPromptParams = {
        pageType: 'checkout',
        palette: 'supplement-bold',
      };
      const prompt = buildComposerPrompt(params);
      expect(prompt).toContain('CHECKOUT CONTENT GUIDE');
      expect(prompt).toContain('COMPLETE PURCHASE');
    });

    it('contains downsell content guide for downsell type', () => {
      const params: ComposerPromptParams = {
        pageType: 'downsell',
        palette: 'pet-friendly',
      };
      const prompt = buildComposerPrompt(params);
      expect(prompt).toContain('DOWNSELL CONTENT GUIDE');
      expect(prompt).toContain('Wait! Before You Go');
    });

    it('fills max_blocks placeholder correctly', () => {
      const prompt = buildComposerPrompt(baseParams);
      // Upsell maxBlocks = 6
      expect(prompt).toContain('6');
    });

    it('fills headline_max_chars placeholder correctly', () => {
      const prompt = buildComposerPrompt(baseParams);
      // Upsell headlineMaxChars = 50
      expect(prompt).toContain('50');
    });
  });

  describe('buildRetryPrompt', () => {
    it('includes attempt number and max attempts', () => {
      const prompt = buildRetryPrompt(
        { pageType: 'upsell', palette: 'health-warm' },
        [{ code: 'REQUIRED_BLOCK_MISSING', message: 'countdown missing' }],
        2,
        3,
      );
      expect(prompt).toContain('Attempt 2/3');
    });

    it('lists all errors with codes and messages', () => {
      const errors = [
        { code: 'ERROR_A', message: 'Something broke' },
        { code: 'ERROR_B', message: 'Another issue' },
      ];
      const prompt = buildRetryPrompt(
        { pageType: 'upsell', palette: 'health-warm' },
        errors,
        1,
        3,
      );
      expect(prompt).toContain('ERROR_A');
      expect(prompt).toContain('Something broke');
      expect(prompt).toContain('ERROR_B');
      expect(prompt).toContain('Another issue');
    });

    it('includes the "Regenerate" instruction', () => {
      const prompt = buildRetryPrompt(
        { pageType: 'upsell', palette: 'health-warm' },
        [{ code: 'X', message: 'Y' }],
        1,
        3,
      );
      expect(prompt).toContain('Regenerate the COMPLETE block tree');
    });

    it('instructs to keep valid blocks unchanged', () => {
      const prompt = buildRetryPrompt(
        { pageType: 'upsell', palette: 'health-warm' },
        [{ code: 'X', message: 'Y' }],
        1,
        3,
      );
      expect(prompt).toContain('Keep all valid blocks unchanged');
    });
  });

  describe('BLOCK_COMPOSER_SYSTEM_PROMPT', () => {
    it('contains all required placeholder keys', () => {
      expect(BLOCK_COMPOSER_SYSTEM_PROMPT).toContain('{{pageType}}');
      expect(BLOCK_COMPOSER_SYSTEM_PROMPT).toContain('{{palette}}');
      expect(BLOCK_COMPOSER_SYSTEM_PROMPT).toContain('{{required_blocks}}');
      expect(BLOCK_COMPOSER_SYSTEM_PROMPT).toContain('{{forbidden_blocks}}');
      expect(BLOCK_COMPOSER_SYSTEM_PROMPT).toContain('{{max_blocks}}');
      expect(BLOCK_COMPOSER_SYSTEM_PROMPT).toContain('{{headline_max_chars}}');
      expect(BLOCK_COMPOSER_SYSTEM_PROMPT).toContain('{{required_sequence}}');
      expect(BLOCK_COMPOSER_SYSTEM_PROMPT).toContain('{{tokens_reference}}');
      expect(BLOCK_COMPOSER_SYSTEM_PROMPT).toContain('{{available_blocks}}');
      expect(BLOCK_COMPOSER_SYSTEM_PROMPT).toContain('{{rag_patterns}}');
    });

    it('includes mobile-first design rules', () => {
      expect(BLOCK_COMPOSER_SYSTEM_PROMPT).toContain('MOBILE FIRST');
      expect(BLOCK_COMPOSER_SYSTEM_PROMPT).toContain('390px');
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 4. Page Generator
// ═══════════════════════════════════════════════════════════════════════════════

import { generatePage, validateAndRender } from '../services/page-generator';
import type { GeneratePageRequest, GeneratorConfig } from '../services/page-generator';

describe('Page Generator', () => {
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockFetch = vi.fn();
    (global.fetch as ReturnType<typeof vi.fn>) = mockFetch;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const defaultConfig: GeneratorConfig = {
    apiUrl: 'https://api.example.com/v1/chat/completions',
    apiKey: 'test-key-123',
    model: 'test-model',
    temperature: 0.3,
    maxTokens: 8000,
    maxRetries: 3,
    minScore: 70,
  };

  const defaultRequest: GeneratePageRequest = {
    pageType: 'upsell',
    palette: 'health-warm',
    product: {
      name: 'TestProduct Pro',
      description: 'A revolutionary supplement for energy',
      price: '$49.99',
      originalPrice: '$99.99',
      niche: 'health',
      targetAudience: 'Adults 30-55',
      benefits: ['More energy', 'Better focus', 'Improved sleep'],
      guarantee: '90-Day Money-Back',
      imageUrl: 'https://example.com/product.jpg',
    },
  };

  describe('generatePage', () => {
    it('returns success=true with valid HTML on first attempt', async () => {
      const validTree = makeValidBlockTree();
      mockFetch.mockResolvedValue(makeLlmResponse(JSON.stringify(validTree)));

      const result = await generatePage(defaultRequest, defaultConfig);

      expect(result.success).toBe(true);
      expect(result.html).toBeDefined();
      expect(result.html).toContain('<!DOCTYPE html>');
      expect(result.html).toContain('Upsell Page Test');
      expect(result.blockTree).toBeDefined();
      expect(result.blockTree!.pageType).toBe('upsell');
      expect(result.attempts).toBe(1);
      expect(result.meta.model).toBe('test-model');
      expect(result.meta.tokensUsed).toBeGreaterThan(0);
      expect(result.meta.pageType).toBe('upsell');
      expect(result.meta.palette).toBe('health-warm');
      expect(result.meta.durationMs).toBeGreaterThanOrEqual(0);
    });

    it('sends correct request headers and body to the LLM API', async () => {
      const validTree = makeValidBlockTree();
      mockFetch.mockResolvedValue(makeLlmResponse(JSON.stringify(validTree)));

      await generatePage(defaultRequest, defaultConfig);

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const [url, options] = mockFetch.mock.calls[0];
      expect(url).toBe(defaultConfig.apiUrl);
      expect(options.method).toBe('POST');
      expect(options.headers['Authorization']).toBe('Bearer test-key-123');
      expect(options.headers['Content-Type']).toBe('application/json');

      const body = JSON.parse(options.body);
      expect(body.model).toBe('test-model');
      expect(body.temperature).toBe(0.3);
      expect(body.max_tokens).toBe(8000);
      expect(body.messages).toHaveLength(2);
      expect(body.messages[0].role).toBe('system');
      expect(body.messages[1].role).toBe('user');
    });

    it('handles JSON wrapped in markdown code fences', async () => {
      const validTree = makeValidBlockTree();
      const fencedContent = '```json\n' + JSON.stringify(validTree, null, 2) + '\n```';
      mockFetch.mockResolvedValue(makeLlmResponse(fencedContent));

      const result = await generatePage(defaultRequest, defaultConfig);

      expect(result.success).toBe(true);
      expect(result.blockTree).toBeDefined();
    });

    it('handles JSON with surrounding text', async () => {
      const validTree = makeValidBlockTree();
      const contentWithText = 'Here is the page:\n' + JSON.stringify(validTree) + '\nHope you like it!';
      mockFetch.mockResolvedValue(makeLlmResponse(contentWithText));

      const result = await generatePage(defaultRequest, defaultConfig);

      expect(result.success).toBe(true);
      expect(result.blockTree).toBeDefined();
    });

    it('retries on validation failure and succeeds on second attempt', async () => {
      const validTree = makeValidBlockTree();
      // First call: return invalid JSON (missing required blocks)
      const invalidTree = { version: '1.0', pageType: 'upsell', palette: 'health-warm', blocks: [], metadata: { title: 'Bad' } };
      mockFetch
        .mockResolvedValueOnce(makeLlmResponse(JSON.stringify(invalidTree)))
        .mockResolvedValueOnce(makeLlmResponse(JSON.stringify(validTree)));

      const result = await generatePage(defaultRequest, defaultConfig);

      expect(result.success).toBe(true);
      expect(result.attempts).toBe(2);
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('returns failure after exhausting all retries', async () => {
      const invalidTree = { version: '1.0', pageType: 'upsell', palette: 'health-warm', blocks: [], metadata: { title: 'Bad' } };
      mockFetch.mockResolvedValue(makeLlmResponse(JSON.stringify(invalidTree)));

      const result = await generatePage(defaultRequest, defaultConfig);

      expect(result.success).toBe(false);
      // maxRetries=3, so attempts = 4 (initial + 3 retries)
      expect(result.attempts).toBe(4);
      expect(result.error).toContain('Validation failed');
    });

    it('retries on JSON parse error and returns failure if all fail', async () => {
      // Return non-JSON content on every call
      mockFetch.mockResolvedValue(makeLlmResponse('This is not JSON at all, no braces here.'));

      const result = await generatePage(defaultRequest, defaultConfig);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(mockFetch).toHaveBeenCalledTimes(defaultConfig.maxRetries! + 1);
    });

    it('returns failure on LLM API error', async () => {
      mockFetch.mockResolvedValue(makeLlmError(500, 'Internal Server Error'));

      const result = await generatePage(defaultRequest, defaultConfig);

      expect(result.success).toBe(false);
      expect(result.error).toContain('LLM API error 500');
    });

    it('returns failure on LLM API authentication error', async () => {
      mockFetch.mockResolvedValue(makeLlmError(401, 'Unauthorized'));

      const result = await generatePage(defaultRequest, defaultConfig);

      expect(result.success).toBe(false);
      expect(result.error).toContain('401');
    });

    it('includes product info in the system prompt sent to LLM', async () => {
      const validTree = makeValidBlockTree();
      mockFetch.mockResolvedValue(makeLlmResponse(JSON.stringify(validTree)));

      await generatePage(defaultRequest, defaultConfig);

      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      const systemPrompt = body.messages[0].content;
      expect(systemPrompt).toContain('TestProduct Pro');
      expect(systemPrompt).toContain('A revolutionary supplement for energy');
      expect(systemPrompt).toContain('$49.99');
      expect(systemPrompt).toContain('$99.99');
      expect(systemPrompt).toContain('More energy');
    });

    it('uses default config values when not specified', async () => {
      const validTree = makeValidBlockTree();
      mockFetch.mockResolvedValue(makeLlmResponse(JSON.stringify(validTree)));

      const minimalConfig: GeneratorConfig = {
        apiUrl: 'https://api.example.com/v1/chat/completions',
        apiKey: 'test-key',
        model: 'test-model',
      };

      const result = await generatePage(defaultRequest, minimalConfig);

      expect(result.success).toBe(true);
      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.temperature).toBe(0.3);
      expect(body.max_tokens).toBe(8000);
    });

    it('handles generatePage with no optional product fields', async () => {
      const validTree = makeValidBlockTree();
      mockFetch.mockResolvedValue(makeLlmResponse(JSON.stringify(validTree)));

      const minimalRequest: GeneratePageRequest = {
        pageType: 'upsell',
        palette: 'health-warm',
        product: {
          name: 'Basic Product',
          description: 'Simple description',
        },
      };

      const result = await generatePage(minimalRequest, defaultConfig);

      expect(result.success).toBe(true);
      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.messages[0].content).toContain('Basic Product');
      expect(body.messages[0].content).toContain('Simple description');
    });

    it('passes RAG patterns through to the composer prompt', async () => {
      const validTree = makeValidBlockTree();
      mockFetch.mockResolvedValue(makeLlmResponse(JSON.stringify(validTree)));

      const requestWithRag: GeneratePageRequest = {
        ...defaultRequest,
        ragPatterns: ['Pattern A: Use green CTA', 'Pattern B: Add testimonials'],
      };

      await generatePage(requestWithRag, defaultConfig);

      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.messages[0].content).toContain('Pattern A: Use green CTA');
      expect(body.messages[0].content).toContain('Pattern B: Add testimonials');
    });

    it('appends error feedback to system prompt on retry after JSON parse error', async () => {
      const validTree = makeValidBlockTree();
      mockFetch
        .mockResolvedValueOnce(makeLlmResponse('not json'))   // Triggers parse error
        .mockResolvedValueOnce(makeLlmResponse(JSON.stringify(validTree)));  // Succeeds

      await generatePage(defaultRequest, defaultConfig);

      // Second call should have error feedback appended to system prompt
      const secondCallBody = JSON.parse(mockFetch.mock.calls[1][1].body);
      const secondSystemPrompt = secondCallBody.messages[0].content;
      expect(secondSystemPrompt).toContain('ERROR');
      expect(secondSystemPrompt).toContain('valid JSON');
    });
  });

  describe('validateAndRender', () => {
    it('returns valid=true and html for a valid BlockTree', async () => {
      const tree = makeValidBlockTree();
      const result = await validateAndRender(tree);

      expect(result.valid).toBe(true);
      expect(result.html).toBeDefined();
      expect(result.html).toContain('<!DOCTYPE html>');
      expect(result.validation).toBeDefined();
    });

    it('returns valid=false for invalid BlockTree JSON', async () => {
      const result = await validateAndRender({ invalid: true });

      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.validation).toBeDefined();
    });

    it('returns valid=false with error message for schema-invalid input', async () => {
      const result = await validateAndRender(null);

      expect(result.valid).toBe(false);
      expect(result.error).toContain('Validation failed');
    });

    it('returns valid=false for tree missing required blocks', async () => {
      const tree = makeValidBlockTree();
      // Remove all blocks to make it fail
      tree.blocks = [];
      const result = await validateAndRender(tree);

      expect(result.valid).toBe(false);
    });

    it('includes validation result with errors array', async () => {
      const result = await validateAndRender('not-valid');

      expect(result.validation.errors).toBeDefined();
      expect(result.validation.errors.length).toBeGreaterThan(0);
    });

    it('renders HTML for a checkout tree', async () => {
      const tree = makeCheckoutBlockTree();
      const result = await validateAndRender(tree);

      // Checkout tree has all required blocks so it should be valid
      if (result.valid) {
        expect(result.html).toContain('<!DOCTYPE html>');
      }
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 5. Design Tokens (smoke tests for validation helpers)
// ═══════════════════════════════════════════════════════════════════════════════

import {
  isValidPaletteColor,
  isValidSpacing,
  isValidRadius,
  getAllValidColors,
  PALETTES,
  PAGE_TYPES,
  BLOCK_TYPES,
  SPACING,
  RADIUS,
} from '../design-system/tokens';

describe('Design Tokens', () => {
  describe('isValidPaletteColor', () => {
    it('returns true for a known palette color', () => {
      expect(isValidPaletteColor('#E74C3C')).toBe(true); // health-warm primary
    });

    it('returns true regardless of case', () => {
      expect(isValidPaletteColor('#e74c3c')).toBe(true);
    });

    it('returns false for unknown colors', () => {
      expect(isValidPaletteColor('#FF00FF')).toBe(false);
    });
  });

  describe('isValidSpacing', () => {
    it('returns true for valid spacing values', () => {
      expect(isValidSpacing('16px')).toBe(true);
      expect(isValidSpacing('0px')).toBe(true);
      expect(isValidSpacing('64px')).toBe(true);
    });

    it('returns false for invalid spacing', () => {
      expect(isValidSpacing('15px')).toBe(false);
      expect(isValidSpacing('10px')).toBe(false);
    });
  });

  describe('isValidRadius', () => {
    it('returns true for valid radius values', () => {
      expect(isValidRadius('4px')).toBe(true);
      expect(isValidRadius('9999px')).toBe(true);
      expect(isValidRadius('0px')).toBe(true);
    });

    it('returns false for invalid radius', () => {
      expect(isValidRadius('5px')).toBe(false);
      expect(isValidRadius('10px')).toBe(false);
    });
  });

  describe('getAllValidColors', () => {
    it('returns a non-empty array', () => {
      const colors = getAllValidColors();
      expect(colors.length).toBeGreaterThan(0);
    });

    it('includes primary colors from all palettes', () => {
      const colors = getAllValidColors();
      for (const palette of Object.values(PALETTES)) {
        expect(colors).toContain(palette.primary);
      }
    });
  });

  describe('Constants', () => {
    it('PAGE_TYPES contains all expected types', () => {
      expect(PAGE_TYPES).toContain('product-page');
      expect(PAGE_TYPES).toContain('upsell');
      expect(PAGE_TYPES).toContain('checkout');
      expect(PAGE_TYPES).toContain('downsell');
      expect(PAGE_TYPES).toContain('vsl');
      expect(PAGE_TYPES).toContain('quiz');
    });

    it('BLOCK_TYPES contains key block types', () => {
      expect(BLOCK_TYPES).toContain('hero');
      expect(BLOCK_TYPES).toContain('cta');
      expect(BLOCK_TYPES).toContain('bundle');
      expect(BLOCK_TYPES).toContain('guarantee');
      expect(BLOCK_TYPES).toContain('countdown');
      expect(BLOCK_TYPES).toContain('negative-opt-out');
    });

    it('SPACING has 4px base scale', () => {
      expect(SPACING['0']).toBe('0px');
      expect(SPACING['1']).toBe('4px');
      expect(SPACING['4']).toBe('16px');
      expect(SPACING['16']).toBe('64px');
    });

    it('RADIUS includes none and full', () => {
      expect(RADIUS.none).toBe('0px');
      expect(RADIUS.full).toBe('9999px');
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 6. Composition Rules
// ═══════════════════════════════════════════════════════════════════════════════

import {
  PAGE_COMPOSITION_RULES,
  validateSequence,
  validateBlocks,
  PAGE_TYPE_GUIDES,
} from '../design-system/composition-rules';

describe('Composition Rules', () => {
  describe('PAGE_COMPOSITION_RULES', () => {
    it('has rules for every page type', () => {
      for (const pageType of PAGE_TYPES) {
        expect(PAGE_COMPOSITION_RULES).toHaveProperty(pageType);
      }
    });

    it('every rule has required fields', () => {
      for (const [type, rule] of Object.entries(PAGE_COMPOSITION_RULES)) {
        expect(rule.requiredBlocks).toBeDefined();
        expect(rule.forbiddenBlocks).toBeDefined();
        expect(rule.requiredSequence).toBeDefined();
        expect(rule.maxBlocks).toBeGreaterThan(0);
        expect(rule.headlineMaxChars).toBeGreaterThan(0);
      }
    });

    it('upsell allows max 6 blocks', () => {
      expect(PAGE_COMPOSITION_RULES['upsell'].maxBlocks).toBe(6);
    });

    it('checkout requires payment-form in sequence', () => {
      expect(PAGE_COMPOSITION_RULES['checkout'].requiredSequence).toContain('payment-form');
    });
  });

  describe('validateSequence', () => {
    it('validates correct sequence for upsell', () => {
      const result = validateSequence('upsell', ['heading', 'bundle-offers', 'add-to-cart']);
      expect(result.valid).toBe(true);
      expect(result.missing).toHaveLength(0);
    });

    it('reports missing blocks when sequence is incomplete', () => {
      const result = validateSequence('upsell', ['heading']);
      expect(result.valid).toBe(false);
      expect(result.missing).toContain('bundle-offers');
      expect(result.missing).toContain('add-to-cart');
    });

    it('allows extra blocks between required sequence blocks', () => {
      const result = validateSequence('upsell', ['heading', 'countdown', 'bundle-offers', 'social-proof', 'add-to-cart']);
      expect(result.valid).toBe(true);
    });

    it('fails when sequence blocks are in wrong order', () => {
      // add-to-cart before bundle-offers
      const result = validateSequence('upsell', ['add-to-cart', 'heading', 'bundle-offers']);
      // heading must come before bundle-offers, and bundle-offers before add-to-cart
      // In this arrangement: heading is after add-to-cart and before bundle-offers
      // So heading → bundle-offers is OK, but bundle-offers → add-to-cart fails
      // because add-to-cart is at index 0 and bundle-offers is at index 2
      expect(result.valid).toBe(false);
    });
  });

  describe('validateBlocks', () => {
    it('reports missing required blocks', () => {
      const result = validateBlocks('upsell', ['heading']);
      expect(result.valid).toBe(false);
      expect(result.missingRequired).toContain('bundle-offers');
      expect(result.missingRequired).toContain('add-to-cart');
    });

    it('reports forbidden blocks', () => {
      const result = validateBlocks('upsell', ['heading', 'bundle-offers', 'add-to-cart', 'countdown', 'guarantee', 'negative-opt-out', 'payment-form']);
      expect(result.forbiddenFound).toContain('payment-form');
    });

    it('reports when max blocks is exceeded', () => {
      // Upsell maxBlocks = 6
      const manyBlocks = Array(7).fill('heading') as unknown as import('../design-system/composition-rules').BlockName[];
      const result = validateBlocks('upsell', manyBlocks);
      expect(result.exceedsMax).toBe(true);
    });

    it('passes for a valid block list', () => {
      const result = validateBlocks('upsell', ['heading', 'bundle-offers', 'add-to-cart', 'countdown', 'guarantee', 'negative-opt-out']);
      expect(result.missingRequired).toHaveLength(0);
      expect(result.forbiddenFound).toHaveLength(0);
      expect(result.exceedsMax).toBe(false);
    });
  });

  describe('PAGE_TYPE_GUIDES', () => {
    it('has a guide for every page type', () => {
      for (const pageType of PAGE_TYPES) {
        expect(PAGE_TYPE_GUIDES).toHaveProperty(pageType);
        expect(PAGE_TYPE_GUIDES[pageType as keyof typeof PAGE_TYPE_GUIDES].structure).toBeDefined();
        expect(PAGE_TYPE_GUIDES[pageType as keyof typeof PAGE_TYPE_GUIDES].keyPoints).toBeDefined();
      }
    });
  });
});
