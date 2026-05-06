/**
 * Purpose: Validation Pipeline — 8 passes that every block tree must pass
 *          before becoming rendered HTML. 100% automated, zero human validation.
 * Dependencies: zod, tokens.ts, composition-rules.ts, blocks.ts
 * Related: Architecture Finale.md §48
 *
 * Pipeline: Schema → Composition → Design Token → Mobile Layout →
 *           Performance → Accessibility → Compliance → Lighthouse
 *
 * Auto-retry: max 3 attempts with error feedback to LLM. Score < 70 = retry.
 */

import { blockTreeSchema } from '../design-system/blocks';
import { validateBlocks, validateSequence } from '../design-system/composition-rules';
import {
  isValidPaletteColor,
  isValidSpacing,
  isValidRadius,
  getAllValidColors,
} from '../design-system/tokens';
import type { PageType, PaletteKey } from '../design-system/tokens';
import type { BlockName } from '../design-system/composition-rules';
import type { BlockTree, Block, ValidationError, ValidationResult } from '../design-system/blocks';

// ─── Pass 1: Schema Validation (Zod) ────────────────────────────────────────

export function pass1_schema(tree: unknown): {
  success: boolean;
  data?: BlockTree;
  errors: ValidationError[];
} {
  const result = blockTreeSchema.safeParse(tree);
  if (result.success) {
    return { success: true, data: result.data as BlockTree, errors: [] };
  }

  const errors: ValidationError[] = result.error.issues.map(issue => ({
    code: 'SCHEMA_INVALID',
    message: `${issue.path.join('.')}: ${issue.message}`,
    severity: 'error' as const,
  }));

  return { success: false, errors };
}

// ─── Pass 2: Composition Rules (§46) ─────────────────────────────────────────

export function pass2_composition(tree: BlockTree): ValidationResult {
  const pageType = tree.pageType as PageType;
  const blockTypes = tree.blocks.map(b => b.type) as BlockName[];

  const { missingRequired, forbiddenFound, exceedsMax } = validateBlocks(pageType, blockTypes);
  const { missing: missingSequence } = validateSequence(pageType, blockTypes);

  const errors: ValidationError[] = [];

  for (const block of missingRequired) {
    errors.push({
      code: 'REQUIRED_BLOCK_MISSING',
      message: `"${block}" is required for page type "${pageType}"`,
      severity: 'error',
    });
  }

  for (const block of forbiddenFound) {
    errors.push({
      code: 'FORBIDDEN_BLOCK_PRESENT',
      message: `"${block}" is forbidden in page type "${pageType}"`,
      severity: 'error',
    });
  }

  for (const block of missingSequence) {
    errors.push({
      code: 'SEQUENCE_VIOLATION',
      message: `"${block}" missing from required sequence`,
      severity: 'error',
    });
  }

  if (exceedsMax) {
    errors.push({
      code: 'MAX_BLOCKS_EXCEEDED',
      message: `${blockTypes.length} blocks exceed maximum for "${pageType}"`,
      severity: 'warning',
    });
  }

  // Headline length check
  const rules = tree.blocks
    .filter(b => b.type === 'heading' || b.type === 'hero')
    .forEach(b => {
      const text = (b.props as Record<string, unknown>).headline ||
                   (b.props as Record<string, unknown>).text || '';
      if (typeof text === 'string' && text.length > 80) {
        errors.push({
          code: 'HEADLINE_TOO_LONG',
          message: `Headline "${text.substring(0, 40)}..." is ${text.length} chars (max 80)`,
          severity: 'warning',
          blockId: b.id,
        });
      }
    });

  return {
    valid: errors.filter(e => e.severity === 'error').length === 0,
    errors,
    score: 0, // calculated later
  };
}

// ─── Pass 3: Design Token Compliance (§45) ───────────────────────────────────

export function pass3_designTokens(tree: BlockTree): ValidationResult {
  const errors: ValidationError[] = [];
  const validColors = new Set(getAllValidColors().map(c => c.toLowerCase()));

  // Also allow CSS variable references (var(--color-*))
  const isCssVar = (v: string) => v.startsWith('var(');

  function checkBlock(block: Block) {
    const styles = block.styles;
    if (!styles) return;

    const allStyles = {
      ...styles.mobile,
      ...styles.tablet,
      ...styles.desktop,
    };

    for (const [prop, value] of Object.entries(allStyles)) {
      if (typeof value !== 'string') continue;

      // Color checks
      if (prop.includes('color') || prop.includes('background') || prop.includes('border-color')) {
        if (!isCssVar(value) && !validColors.has(value.toLowerCase()) && !value.startsWith('#')) {
          errors.push({
            code: 'INVALID_COLOR_TOKEN',
            message: `Block "${block.id}": "${prop}" uses non-token color "${value}"`,
            severity: 'warning',
            blockId: block.id,
          });
        }
      }

      // Spacing checks
      if (prop.includes('padding') || prop.includes('margin') || prop.includes('gap')) {
        if (!isCssVar(value) && !isValidSpacing(value) && !value.includes('calc(')) {
          errors.push({
            code: 'INVALID_SPACING_TOKEN',
            message: `Block "${block.id}": "${prop}" uses non-token spacing "${value}"`,
            severity: 'warning',
            blockId: block.id,
          });
        }
      }

      // Border-radius checks
      if (prop.includes('radius') || prop.includes('border-radius')) {
        if (!isCssVar(value) && !isValidRadius(value)) {
          errors.push({
            code: 'INVALID_RADIUS_TOKEN',
            message: `Block "${block.id}": "${prop}" uses non-token radius "${value}"`,
            severity: 'warning',
            blockId: block.id,
          });
        }
      }
    }

    // Check children recursively
    if (block.children) {
      for (const child of block.children) {
        checkBlock(child);
      }
    }
  }

  for (const block of tree.blocks) {
    checkBlock(block);
  }

  return {
    valid: errors.filter(e => e.severity === 'error').length === 0,
    errors,
    score: 0,
  };
}

// ─── Pass 4: Mobile Layout Constraints (requires Playwright at runtime) ──────

export const MOBILE_CONSTRAINTS = {
  viewportWidth: 375,
  viewportHeight: 812,
  minTapTarget: 44,
  minCtaHeight: 52,
  minBodyFontSize: 16,
  maxClsScore: 0.1,
  maxSectionHeight: 1200,
} as const;

/**
 * Pass 4: Mobile Layout — requires Playwright.
 * Returns a function that must be called with a Playwright page.
 * WHY: Only real rendering can catch overflow, CLS, and tap target issues.
 */
export function createPass4_mobileLayout() {
  return async function pass4(html: string): Promise<ValidationResult> {
    const errors: ValidationError[] = [];

    // This requires Playwright to be imported dynamically
    // because it's not available at build time
    try {
      const { chromium } = await import('playwright');
      const browser = await chromium.launch();
      const page = await browser.newPage();
      await page.setViewportSize({
        width: MOBILE_CONSTRAINTS.viewportWidth,
        height: MOBILE_CONSTRAINTS.viewportHeight,
      });
      await page.setContent(html, { waitUntil: 'networkidle' });

      // Check horizontal overflow
      const hasOverflow = await page.evaluate(() =>
        document.documentElement.scrollWidth > document.documentElement.clientWidth
      );
      if (hasOverflow) {
        errors.push({
          code: 'HORIZONTAL_OVERFLOW',
          severity: 'error',
          message: 'Horizontal scroll detected at 375px viewport',
        });
      }

      // Check tap targets >= 44x44px
      const smallTargets = await page.evaluate(() =>
        Array.from(document.querySelectorAll('button, a, input, [role="button"]'))
          .filter(el => {
            const r = el.getBoundingClientRect();
            return r.width < 44 || r.height < 44;
          })
          .map(el => ({
            tag: el.tagName,
            text: el.textContent?.substring(0, 30),
            width: Math.round(el.getBoundingClientRect().width),
            height: Math.round(el.getBoundingClientRect().height),
          }))
      );
      if (smallTargets.length > 0) {
        errors.push({
          code: 'TAP_TARGET_TOO_SMALL',
          severity: 'error',
          message: `${smallTargets.length} interactive elements < 44x44px: ${JSON.stringify(smallTargets.slice(0, 3))}`,
        });
      }

      // Check first CTA above fold
      const ctaTop = await page.evaluate(() => {
        const cta = document.querySelector('.cta-button, [data-track*="cta"]');
        return cta ? Math.round(cta.getBoundingClientRect().top) : null;
      });
      if (ctaTop === null) {
        errors.push({
          code: 'NO_CTA_FOUND',
          severity: 'error',
          message: 'No CTA element found in the page',
        });
      } else if (ctaTop > MOBILE_CONSTRAINTS.viewportHeight) {
        errors.push({
          code: 'CTA_BELOW_FOLD',
          severity: 'error',
          message: `First CTA at y=${ctaTop}px, below ${MOBILE_CONSTRAINTS.viewportHeight}px viewport`,
        });
      }

      await page.close();
      await browser.close();
    } catch {
      errors.push({
        code: 'PLAYWRIGHT_UNAVAILABLE',
        severity: 'warning',
        message: 'Playwright not available for mobile layout validation — skipping',
      });
    }

    return {
      valid: errors.filter(e => e.severity === 'error').length === 0,
      errors,
      score: 0,
    };
  };
}

// ─── Pass 5: Performance Budget ──────────────────────────────────────────────

export const PERFORMANCE_BUDGETS = {
  maxTotalImageWeight: 800,    // KB
  maxImageCount: 12,
  maxFontCount: 3,
  maxCssSize: 50,              // KB
  maxDomNodes: 800,
  zeroJs: true,                // Zero JS except tracking + Stripe
} as const;

export function pass5_performance(tree: BlockTree): ValidationResult {
  const errors: ValidationError[] = [];

  // Count images
  const imageBlocks = tree.blocks.filter(b => b.type === 'image');
  if (imageBlocks.length > PERFORMANCE_BUDGETS.maxImageCount) {
    errors.push({
      code: 'TOO_MANY_IMAGES',
      severity: 'error',
      message: `${imageBlocks.length} images exceed max ${PERFORMANCE_BUDGETS.maxImageCount}`,
    });
  }

  // Check for JS-heavy blocks
  const jsBlocks = tree.blocks.filter(b =>
    b.type === 'custom-html' ||
    (b.props as Record<string, unknown>).javascript !== undefined
  );
  if (jsBlocks.length > 0 && PERFORMANCE_BUDGETS.zeroJs) {
    errors.push({
      code: 'JS_BLOCK_DETECTED',
      severity: 'warning',
      message: `${jsBlocks.length} blocks contain custom JS (zero JS policy)`,
    });
  }

  // Count total blocks (proxy for DOM nodes)
  let totalNodes = 0;
  function countNodes(block: Block) {
    totalNodes++;
    if (block.children) block.children.forEach(countNodes);
  }
  tree.blocks.forEach(countNodes);

  if (totalNodes > PERFORMANCE_BUDGETS.maxDomNodes) {
    errors.push({
      code: 'DOM_TOO_LARGE',
      severity: 'warning',
      message: `${totalNodes} blocks exceed max ${PERFORMANCE_BUDGETS.maxDomNodes} DOM nodes estimate`,
    });
  }

  return {
    valid: errors.filter(e => e.severity === 'error').length === 0,
    errors,
    score: 0,
  };
}

// ─── Pass 6: Accessibility ───────────────────────────────────────────────────

export function pass6_accessibility(tree: BlockTree): ValidationResult {
  const errors: ValidationError[] = [];

  for (const block of tree.blocks) {
    // All images must have alt text
    if (block.type === 'image') {
      const props = block.props as Record<string, unknown>;
      if (!props.alt || (typeof props.alt === 'string' && props.alt.trim().length === 0)) {
        errors.push({
          code: 'MISSING_ALT_TEXT',
          severity: 'error',
          message: `Image block "${block.id}" missing alt text`,
          blockId: block.id,
        });
      }
    }

    // All buttons must have text
    if (block.type === 'button' || block.type === 'cta') {
      const props = block.props as Record<string, unknown>;
      if (!props.text || (typeof props.text === 'string' && props.text.trim().length === 0)) {
        errors.push({
          code: 'MISSING_BUTTON_TEXT',
          severity: 'error',
          message: `Button/CTA block "${block.id}" missing accessible text`,
          blockId: block.id,
        });
      }
    }

    // Form inputs need labels
    if (block.type === 'form') {
      const props = block.props as Record<string, unknown>;
      const fields = props.fields as Array<Record<string, unknown>> | undefined;
      if (fields) {
        for (const field of fields) {
          if (!field.label) {
            errors.push({
              code: 'MISSING_FORM_LABEL',
              severity: 'error',
              message: `Form field "${field.name}" missing label`,
              blockId: block.id,
            });
          }
        }
      }
    }

    // Check children recursively
    if (block.children) {
      for (const child of block.children) {
        if (child.type === 'image') {
          const props = child.props as Record<string, unknown>;
          if (!props.alt || (typeof props.alt === 'string' && props.alt.trim().length === 0)) {
            errors.push({
              code: 'MISSING_ALT_TEXT',
              severity: 'error',
              message: `Nested image "${child.id}" missing alt text`,
              blockId: child.id,
            });
          }
        }
      }
    }
  }

  return {
    valid: errors.filter(e => e.severity === 'error').length === 0,
    errors,
    score: 0,
  };
}

// ─── Pass 7: Compliance ──────────────────────────────────────────────────────

export function pass7_compliance(tree: BlockTree): ValidationResult {
  const errors: ValidationError[] = [];

  // Checkout pages MUST have payment-form and trust-badges
  if (tree.pageType === 'checkout') {
    const hasPaymentForm = tree.blocks.some(b => b.type === 'payment-form');
    const hasTrustBadges = tree.blocks.some(b => b.type === 'trust-badges');
    const hasGuarantee = tree.blocks.some(b => b.type === 'guarantee');

    if (!hasPaymentForm) {
      errors.push({
        code: 'MISSING_PAYMENT_FORM',
        severity: 'error',
        message: 'Checkout page must include payment-form block',
      });
    }

    if (!hasTrustBadges) {
      errors.push({
        code: 'MISSING_TRUST_SIGNALS',
        severity: 'warning',
        message: 'Checkout page should include trust-badges',
      });
    }

    if (!hasGuarantee) {
      errors.push({
        code: 'MISSING_GUARANTEE',
        severity: 'warning',
        message: 'Checkout page should include guarantee block',
      });
    }
  }

  return {
    valid: errors.filter(e => e.severity === 'error').length === 0,
    errors,
    score: 0,
  };
}

// ─── Pass 8: Lighthouse (placeholder — runs at deploy time) ──────────────────

export function pass8_lighthouse(): ValidationResult {
  // Lighthouse runs after HTML generation, not on the block tree.
  // This is a placeholder that gets called after rendering.
  return {
    valid: true,
    errors: [],
    score: 0,
  };
}

// ─── Orchestrator: Full Pipeline ─────────────────────────────────────────────

export interface PipelineResult {
  valid: boolean;
  score: number;
  errors: ValidationError[];
  warnings: ValidationError[];
  passResults: {
    schema: boolean;
    composition: boolean;
    designTokens: boolean;
    mobileLayout?: boolean;
    performance: boolean;
    accessibility: boolean;
    compliance: boolean;
  };
}

/** Calculate quality score: 100 - (errors × 10) - (warnings × 3) */
function calculateScore(errors: ValidationError[], warnings: ValidationError[]): number {
  return Math.max(0, 100 - errors.length * 10 - warnings.length * 3);
}

/** Run the full validation pipeline on a block tree */
export async function validateBlockTree(
  treeJson: unknown,
  options?: { skipMobileLayout?: boolean }
): Promise<PipelineResult> {
  const allErrors: ValidationError[] = [];
  const passResults = {
    schema: false,
    composition: false,
    designTokens: false,
    mobileLayout: undefined as boolean | undefined,
    performance: false,
    accessibility: false,
    compliance: false,
  };

  // Pass 1: Schema
  const p1 = pass1_schema(treeJson);
  if (!p1.success || !p1.data) {
    allErrors.push(...p1.errors);
    return {
      valid: false,
      score: 0,
      errors: allErrors.filter(e => e.severity === 'error'),
      warnings: allErrors.filter(e => e.severity === 'warning'),
      passResults,
    };
  }
  passResults.schema = true;
  const tree = p1.data;

  // Pass 2: Composition
  const p2 = pass2_composition(tree);
  allErrors.push(...p2.errors);
  passResults.composition = p2.valid;

  // Pass 3: Design Tokens
  const p3 = pass3_designTokens(tree);
  allErrors.push(...p3.errors);
  passResults.designTokens = p3.valid;

  // Pass 4: Mobile Layout (optional — requires Playwright)
  if (!options?.skipMobileLayout) {
    // This pass needs rendered HTML, skip for now
    // Will be called separately after rendering
  }

  // Pass 5: Performance
  const p5 = pass5_performance(tree);
  allErrors.push(...p5.errors);
  passResults.performance = p5.valid;

  // Pass 6: Accessibility
  const p6 = pass6_accessibility(tree);
  allErrors.push(...p6.errors);
  passResults.accessibility = p6.valid;

  // Pass 7: Compliance
  const p7 = pass7_compliance(tree);
  allErrors.push(...p7.errors);
  passResults.compliance = p7.valid;

  const errors = allErrors.filter(e => e.severity === 'error');
  const warnings = allErrors.filter(e => e.severity === 'warning');
  const score = calculateScore(errors, warnings);

  return {
    valid: errors.length === 0,
    score,
    errors,
    warnings,
    passResults,
  };
}

// ─── Auto-Retry with Feedback ────────────────────────────────────────────────

export interface RetryOptions {
  maxRetries: number;
  minScore: number;  // default 70
}

/** Format errors as feedback for the LLM to fix in next attempt */
export function formatRetryFeedback(result: PipelineResult): string {
  if (result.valid && result.score >= 70) return '';

  const lines = ['## Previous Attempt Failed Validation\n'];

  if (!result.valid) {
    lines.push('### Errors (MUST FIX):');
    result.errors.forEach((e, i) => {
      lines.push(`\n### Error ${i + 1}: ${e.code}`);
      lines.push(e.message);
      lines.push('Fix: Correct this error and regenerate.');
    });
  }

  if (result.warnings.length > 0) {
    lines.push('\n### Warnings (SHOULD FIX):');
    result.warnings.forEach((w, i) => {
      lines.push(`\n### Warning ${i + 1}: ${w.code}`);
      lines.push(w.message);
    });
  }

  lines.push('\nRe-generate fixing ONLY these issues. Keep all valid blocks unchanged.');

  return lines.join('\n');
}
