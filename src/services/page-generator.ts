/**
 * Purpose: Page Generation Service — orchestrates the full pipeline:
 *          Product brief → [Copywriter call] → Composer prompt → LLM call →
 *          Parse JSON → Validate (8 passes) → Retry if needed → Render HTML.
 * Dependencies: block-composer.ts, copywriter.ts, validation/pipeline.ts, renderers/index.ts
 * Related: Architecture Finale.md §51, CHAMPION-PROMPTS-DEPLOY.md §17
 *
 * WHY: This is the BRAIN of ECOM-AI. Everything else is support infrastructure.
 *      This service takes a product description and produces a complete HTML page.
 *
 * ARCHITECTURE: Two-call pipeline (when COPYWRITER_ENABLED=true)
 *   Call 1: Copywriter (DeepSeek) → CopywriterOutput (champion text)
 *   Call 2: Composer (MiMo) → BlockTree JSON (structure + pre-written text)
 *   Fallback: Single-call MiMo pipeline if copywriter fails or is disabled.
 */

import { buildComposerPrompt, buildRetryPrompt } from '../agents/prompts/block-composer';
import type { ComposerPromptParams } from '../agents/prompts/block-composer';
import { buildCopywriterPrompt } from '../agents/prompts/copywriter';
import type { CopywriterOutput } from '../agents/prompts/copywriter';
import { validateBlockTree, formatRetryFeedback } from '../validation/pipeline';
import type { PipelineResult } from '../validation/pipeline';
import type { BlockTree, Block } from '../design-system/blocks';
import type { PageType, PaletteKey } from '../design-system/tokens';
import { renderFullPage } from '../renderers';
import '../renderers'; // side-effect: registers all block renderers

// ─── Configuration ───────────────────────────────────────────────────────────

export interface GeneratorConfig {
  /** LLM API endpoint (OpenAI-compatible) */
  apiUrl: string;
  /** API key for the LLM */
  apiKey: string;
  /** Model name */
  model: string;
  /** Temperature for generation (default: 0.3) */
  temperature?: number;
  /** Max tokens for generation (default: 8000) */
  maxTokens?: number;
  /** Max retries on validation failure (default: 3) */
  maxRetries?: number;
  /** Minimum validation score to accept (default: 70) */
  minScore?: number;
  /**
   * All API keys for round-robin rotation on each retry attempt.
   * WHY: MiMo free keys have rate limits and balance caps. Rotating
   *      across keys on EACH retry (not just across requests) means
   *      if one key is exhausted, the next attempt uses a different key.
   * Source: testing-ai-prompt project, pipeline_v2.py _get_next_key()
   */
  allKeys?: string[];
}

const DEFAULT_CONFIG: Partial<GeneratorConfig> = {
  temperature: 0.3,
  maxTokens: 8000,
  maxRetries: 3,
  minScore: 70,
};

// ─── Generation Request ──────────────────────────────────────────────────────

export interface GeneratePageRequest {
  /** Target page type (product-page, checkout, upsell, etc.) */
  pageType: PageType;
  /** Color palette */
  palette: PaletteKey;
  /** Product/brand info that feeds the agent */
  product: {
    name: string;
    description: string;
    price?: string;
    originalPrice?: string;
    niche?: string;
    targetAudience?: string;
    benefits?: string[];
    guarantee?: string;
    imageUrl?: string;
  };
  /** Optional marketing angle override */
  marketingAngle?: ComposerPromptParams['marketingAngle'];
  /** Optional RAG patterns to inject */
  ragPatterns?: string[];
  /** Optional tracking ID */
  trackingId?: string;
}

// ─── Generation Result ───────────────────────────────────────────────────────

export interface GeneratePageResult {
  success: boolean;
  html?: string;
  blockTree?: BlockTree;
  validation?: PipelineResult;
  attempts: number;
  error?: string;
  /** Generation metadata */
  meta: {
    model: string;
    tokensUsed: number;
    durationMs: number;
    pageType: PageType;
    palette: PaletteKey;
    /** Whether the two-call copywriter pipeline was used */
    copywriterUsed?: boolean;
  };
}

// ─── LLM Call ────────────────────────────────────────────────────────────────

interface LlmResponse {
  content: string;
  tokensUsed: number;
  durationMs: number;
}

/**
 * WHY: Round-robin key rotation counter, shared across all calls.
 *      Each callLlm invocation gets the next key in the pool.
 *      Mirrors testing-ai-prompt's _key_rotation_counter pattern.
 */
let _keyRotationCounter = 0;

/**
 * Get the next API key using round-robin rotation.
 * Falls back to the primary apiKey if no allKeys pool.
 */
function getNextKey(config: GeneratorConfig): string {
  const pool = config.allKeys;
  if (pool && pool.length > 1) {
    const key = pool[_keyRotationCounter % pool.length];
    _keyRotationCounter++;
    return key;
  }
  return config.apiKey;
}

/**
 * Call an OpenAI-compatible LLM API.
 * Works with: OpenAI, DeepSeek, MiMo, any OpenAI-compatible endpoint.
 * Rotates API keys on each call when allKeys is provided.
 */
async function callLlm(
  config: GeneratorConfig,
  systemPrompt: string,
  userPrompt: string,
): Promise<LlmResponse> {
  const start = Date.now();

  // WHY: Rotate key on every call, not just across requests.
  //      If key 1 is out of balance, the retry attempt uses key 2.
  const apiKey = getNextKey(config);

  const response = await fetch(config.apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: config.temperature ?? 0.3,
      max_tokens: config.maxTokens ?? 8000,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`LLM API error ${response.status}: ${errorBody}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content ?? '';

  const durationMs = Date.now() - start;
  const tokensUsed = (data.usage?.prompt_tokens ?? 0) + (data.usage?.completion_tokens ?? 0);

  return { content, tokensUsed, durationMs };
}

// ─── JSON Extraction ─────────────────────────────────────────────────────────

/**
 * Extract JSON from LLM output. Handles:
 * - Pure JSON (ideal case)
 * - JSON wrapped in markdown code fences (```json ... ```)
 * - JSON with leading/trailing text
 */
function extractJson(raw: string): unknown {
  // Strip markdown code fences
  let cleaned = raw.trim();

  // Remove ```json ... ``` wrapper
  const fenceMatch = cleaned.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
  if (fenceMatch) {
    cleaned = fenceMatch[1].trim();
  }

  // Try direct parse
  try {
    return JSON.parse(cleaned);
  } catch {
    // Find first { ... last } — LLM sometimes adds text before/after
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      const candidate = cleaned.substring(firstBrace, lastBrace + 1);
      try {
        return JSON.parse(candidate);
      } catch {
        throw new Error(`Failed to parse JSON from LLM output. Raw: ${cleaned.substring(0, 200)}...`);
      }
    }
    throw new Error(`No JSON object found in LLM output. Raw: ${cleaned.substring(0, 200)}...`);
  }
}

// ─── Copywriter Call (Two-Call Pipeline) ──────────────────────────────────────

/**
 * WHY: Separating copywriting from composition lets each model play to its strength.
 *      DeepSeek (champion prompts) writes better text. MiMo (free) structures it.
 *      Lab proved: DeepSeek solo beats MiMo Dual Persona on advertorial (+1.010).
 * Source: CHAMPIONS.md #12, CHAMPION-PROMPTS-DEPLOY.md §17
 */
async function generateCopywriting(
  config: GeneratorConfig,
  pageType: PageType,
  product: GeneratePageRequest['product'],
  marketingAngle?: ComposerPromptParams['marketingAngle'],
): Promise<CopywriterOutput> {
  const { systemPrompt, userPrompt } = await buildCopywriterPrompt({
    pageType,
    product,
    marketingAngle: marketingAngle ? {
      headline: marketingAngle.headline,
      subheadline: marketingAngle.subheadline,
      ctaText: marketingAngle.ctaText,
      benefits: marketingAngle.benefits,
      guarantee: marketingAngle.guarantee,
      painPoint: marketingAngle.painPoint,
    } : undefined,
  });

  const fullConfig = { ...DEFAULT_CONFIG, ...config };
  const llmResult = await callLlm(fullConfig, systemPrompt, userPrompt);

  // WHY: Copywriter returns JSON with CopywriterOutput fields
  const parsed = extractJson(llmResult.content) as CopywriterOutput;

  // Basic shape validation — ensure required fields exist
  if (!parsed.headline || !parsed.body || !parsed.ctaText) {
    throw new Error('Copywriter output missing required fields (headline, body, ctaText)');
  }

  return parsed;
}

// ─── Main Generation Function ────────────────────────────────────────────────

/**
 * Generate a complete page from a product brief.
 *
 * Flow (two-call, when copywriterConfig provided):
 * 1. Call copywriter (DeepSeek) with champion prompt → CopywriterOutput
 * 2. Build composer prompt with pre-written copy
 * 3. Call composer (MiMo) → BlockTree JSON
 * 4. Validate (8 passes)
 * 5. If validation fails → retry with error feedback (max 3)
 * 6. Render HTML via block renderers
 *
 * Flow (single-call fallback, when no copywriterConfig):
 * Same as before — MiMo does both copywriting and composition.
 *
 * Source: CHAMPION-PROMPTS-DEPLOY.md §17 Architecture Hybride DEFINITIVE
 */
export async function generatePage(
  request: GeneratePageRequest,
  config: GeneratorConfig,
  copywriterConfig?: GeneratorConfig,
): Promise<GeneratePageResult> {
  const fullConfig = { ...DEFAULT_CONFIG, ...config };
  const maxRetries = fullConfig.maxRetries ?? 3;
  const minScore = fullConfig.minScore ?? 70;
  const startTime = Date.now();
  let totalTokensUsed = 0;

  // Build the product context string
  const productContext = buildProductContext(request.product);

  // ── Step 1: Copywriter call (optional, two-call pipeline) ──
  let prewrittenCopy: CopywriterOutput | undefined;

  if (copywriterConfig) {
    try {
      prewrittenCopy = await generateCopywriting(
        copywriterConfig,
        request.pageType,
        request.product,
        request.marketingAngle,
      );
      totalTokensUsed += 0; // Tokens tracked inside generateCopywriting
    } catch {
      // WHY: Graceful degradation — if copywriter fails, fall back to single-call
      //      The show must go on. MiMo will handle both copywriting and composition.
      prewrittenCopy = undefined;
    }
  }

  // ── Step 2: Composer call ──

  // Build composer params (with or without pre-written copy)
  const composerParams: ComposerPromptParams = {
    pageType: request.pageType,
    palette: request.palette,
    marketingAngle: request.marketingAngle,
    ragPatterns: request.ragPatterns,
    productContext,
    prewrittenCopy,
  };

  // Build the initial system prompt
  let systemPrompt = buildComposerPrompt(composerParams);
  const userPrompt = prewrittenCopy
    ? `Generate the ${request.pageType} page structure now. Use the PRE-WRITTEN COPY provided above. Output ONLY valid JSON.`
    : `Generate the ${request.pageType} page now. Output ONLY valid JSON.`;

  // Retry loop
  let lastValidation: PipelineResult | undefined;
  let lastBlockTree: BlockTree | undefined;
  let attempts = 0;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    attempts = attempt + 1;

    try {
      // Call LLM
      const llmResult = await callLlm(fullConfig, systemPrompt, userPrompt);
      totalTokensUsed += llmResult.tokensUsed;

      // Parse JSON
      const rawJson = extractJson(llmResult.content);

      // Validate
      const validation = await validateBlockTree(rawJson, { skipMobileLayout: true });
      lastValidation = validation;

      if (!validation.valid || validation.score < minScore) {
        // Validation failed — prepare retry with feedback
        if (attempt < maxRetries) {
          const feedback = formatRetryFeedback(validation);
          const retryPrompt = buildRetryPrompt(
            composerParams,
            validation.errors.map(e => ({ code: e.code, message: e.message })),
            attempt + 1,
            maxRetries,
          );
          // Append retry feedback to system prompt
          systemPrompt = systemPrompt + '\n\n' + feedback + '\n\n' + retryPrompt;
          continue;
        }
        // Exhausted retries — return what we have
        break;
      }

      // Validation passed — extract the block tree
      const p1Result = await validateBlockTree(rawJson, { skipMobileLayout: true });
      // Re-extract from the successful parse
      const tree = extractJson(llmResult.content) as BlockTree;
      lastBlockTree = tree;

      // Render HTML
      const html = renderTreeToHtml(tree);

      const durationMs = Date.now() - startTime;

      return {
        success: true,
        html,
        blockTree: tree,
        validation,
        attempts,
        meta: {
          model: fullConfig.model,
          tokensUsed: totalTokensUsed,
          durationMs,
          pageType: request.pageType,
          palette: request.palette,
          copywriterUsed: !!prewrittenCopy,
        },
      };

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);

      if (attempt < maxRetries) {
        // JSON parse error — retry with feedback
        systemPrompt += `\n\n## ERROR (Attempt ${attempt + 1}/${maxRetries})\nYour output could not be parsed: ${errorMsg}\n\nReturn ONLY valid JSON. No markdown, no code fences, no extra text.`;
        continue;
      }

      // Exhausted retries
      const durationMs = Date.now() - startTime;
      return {
        success: false,
        attempts,
        error: errorMsg,
        meta: {
          model: fullConfig.model,
          tokensUsed: totalTokensUsed,
          durationMs,
          pageType: request.pageType,
          palette: request.palette,
          copywriterUsed: !!prewrittenCopy,
        },
      };
    }
  }

  // All retries exhausted — return best attempt
  const durationMs = Date.now() - startTime;

  // If we have a valid-ish block tree, try to render it anyway
  let html: string | undefined;
  if (lastBlockTree) {
    try {
      html = renderTreeToHtml(lastBlockTree);
    } catch {
      // Render failed too
    }
  }

  return {
    success: false,
    html,
    blockTree: lastBlockTree,
    validation: lastValidation,
    attempts,
    error: `Validation failed after ${attempts} attempts. Score: ${lastValidation?.score ?? 0}/${minScore} required.`,
    meta: {
      model: fullConfig.model,
      tokensUsed: totalTokensUsed,
      durationMs,
      pageType: request.pageType,
      palette: request.palette,
      copywriterUsed: !!prewrittenCopy,
    },
  };
}

// ─── HTML Rendering ──────────────────────────────────────────────────────────

/**
 * Render a BlockTree to full HTML page.
 * Uses the block registry renderers from src/renderers/.
 */
function renderTreeToHtml(tree: BlockTree): string {
  return renderFullPage(tree, tree.palette);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildProductContext(product: GeneratePageRequest['product']): string {
  const lines: string[] = [
    `Product: ${product.name}`,
    `Description: ${product.description}`,
  ];

  if (product.price) {
    lines.push(`Price: ${product.price}`);
    if (product.originalPrice) {
      lines.push(`Original Price: ${product.originalPrice}`);
    }
  }

  if (product.niche) lines.push(`Niche: ${product.niche}`);
  if (product.targetAudience) lines.push(`Target Audience: ${product.targetAudience}`);
  if (product.guarantee) lines.push(`Guarantee: ${product.guarantee}`);
  if (product.imageUrl) lines.push(`Product Image: ${product.imageUrl}`);

  if (product.benefits && product.benefits.length > 0) {
    lines.push(`Key Benefits:`);
    product.benefits.forEach(b => lines.push(`  - ${b}`));
  }

  return lines.join('\n');
}

// ─── Simple Validation-Only (no LLM call) ────────────────────────────────────

/**
 * Validate a pre-built BlockTree JSON without calling an LLM.
 * Useful for testing or when the JSON is already generated.
 */
export async function validateAndRender(
  blockTreeJson: unknown,
): Promise<{ valid: boolean; html?: string; validation: PipelineResult; error?: string }> {
  const validation = await validateBlockTree(blockTreeJson, { skipMobileLayout: true });

  if (!validation.valid) {
    return { valid: false, validation, error: `Validation failed with ${validation.errors.length} errors` };
  }

  try {
    const tree = blockTreeJson as BlockTree;
    const html = renderTreeToHtml(tree);
    return { valid: true, html, validation };
  } catch (error) {
    return {
      valid: false,
      validation,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
