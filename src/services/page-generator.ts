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
import { buildCopywriterPrompt, buildRedditPersonaPrompt, buildFreeTextCopywriterPrompt, buildFreeTextRedditPrompt } from '../agents/prompts/copywriter';
import type { CopywriterOutput } from '../agents/prompts/copywriter';
import { judgeContent, judgeRawText } from './content-judge';
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
  /** Max tokens for generation (default: 16384, no artificial limit) */
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
  maxTokens: 16384,
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
    /** Whether the 3-step free text pipeline was used */
    freeTextUsed?: boolean;
  };
}

// ─── LLM Call ────────────────────────────────────────────────────────────────

interface LlmResponse {
  content: string;
  tokensUsed: number;
  durationMs: number;
  /** WHY: Detects truncation — 'length' means output was cut off mid-sentence */
  finishReason: string | null;
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

  // WHY: MiMo (xiaomimimo) API uses different header and token param names.
  //      Source: pipeline_v2.py line 114-117
  const isXiaomimimo = config.apiUrl.includes('xiaomimimo');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (isXiaomimimo) {
    headers['api-key'] = apiKey;
  } else {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  // WHY: xiaomimimo uses max_completion_tokens, others use max_tokens.
  const payload: Record<string, unknown> = {
    model: config.model,
    messages: systemPrompt
      ? [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ]
      : [{ role: 'user', content: userPrompt }],
    temperature: config.temperature ?? 0.3,
  };
  // WHY: No max_tokens limit — let the model finish naturally. Truncation = broken output.

  const response = await fetch(config.apiUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`LLM API error ${response.status}: ${errorBody}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content ?? '';
  const finishReason = data.choices?.[0]?.finish_reason ?? null;

  const durationMs = Date.now() - start;
  const tokensUsed = (data.usage?.prompt_tokens ?? 0) + (data.usage?.completion_tokens ?? 0);

  return { content, tokensUsed, durationMs, finishReason };
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

  // TEMP DEBUG: Log copywriter output word counts per phase
  const phases = ['hookBody', 'painBody', 'discoveryBody', 'proofBody', 'offerBody'] as const;
  const hasPhases = parsed.hookBody || parsed.painBody;
  if (hasPhases) {
    console.log('[copywriter] Phase word counts:');
    let totalCopy = 0;
    for (const phase of phases) {
      const text = (parsed as any)[phase] || '';
      const wc = text.split(/\s+/).filter(Boolean).length;
      totalCopy += wc;
      console.log(`  ${phase}: ${wc} words`);
    }
    console.log(`  TOTAL copywriter: ${totalCopy} words`);
  } else if (parsed.body) {
    const wc = parsed.body.split(/\s+/).filter(Boolean).length;
    console.log(`[copywriter] Single body: ${wc} words`);
  }

  // Basic shape validation — ensure required fields exist
  // WHY: Advertorials use multi-phase output (hookBody, painBody, etc.)
  //      Other page types use single `body` field.
  const hasBody = parsed.body || parsed.hookBody || parsed.painBody;
  if (!parsed.headline || !hasBody || !parsed.ctaText) {
    throw new Error('Copywriter output missing required fields (headline, body/phase, ctaText)');
  }

  return parsed;
}

// ─── Reddit Persona Call (Dual Persona Champion #12) ──────────────────────────

/**
 * WHY: Champion #12 Dual Persona — Reddit persona often beats Copywriter
 *      on advertorial. Generates copy using the "real person on Reddit" voice.
 *      Output format is the same CopywriterOutput JSON for compatibility.
 * Source: CHAMPIONS.md #12
 */
async function generateRedditCopy(
  config: GeneratorConfig,
  pageType: PageType,
  product: GeneratePageRequest['product'],
  marketingAngle?: ComposerPromptParams['marketingAngle'],
): Promise<CopywriterOutput> {
  const { systemPrompt, userPrompt } = buildRedditPersonaPrompt({
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

  // Parse JSON (same format as Copywriter)
  const parsed = extractJson(llmResult.content) as CopywriterOutput;

  // Debug: log Reddit persona word counts
  const phases = ['hookBody', 'painBody', 'discoveryBody', 'proofBody', 'offerBody'] as const;
  const hasPhases = parsed.hookBody || parsed.painBody;
  if (hasPhases) {
    console.log('[reddit] Phase word counts:');
    let totalCopy = 0;
    for (const phase of phases) {
      const text = (parsed as any)[phase] || '';
      const wc = text.split(/\s+/).filter(Boolean).length;
      totalCopy += wc;
      console.log(`  ${phase}: ${wc} words`);
    }
    console.log(`  TOTAL reddit: ${totalCopy} words`);
  } else if (parsed.body) {
    const wc = parsed.body.split(/\s+/).filter(Boolean).length;
    console.log(`[reddit] Single body: ${wc} words`);
  }

  const hasBody = parsed.body || parsed.hookBody || parsed.painBody;
  if (!parsed.headline || !hasBody) {
    throw new Error('Reddit persona output missing required fields');
  }

  return parsed;
}

// ─── Dummy Tree Builder (for judge scoring pre-composer) ──────────────────────

/**
 * WHY: The judge needs a BlockTree to extract text from. But at the copywriter
 *      stage, we only have CopywriterOutput (text), not a BlockTree yet.
 *      This builds a minimal tree with body-text blocks so the judge can score it.
 */
function buildDummyTree(copy: CopywriterOutput): BlockTree {
  const blocks: Block[] = [];

  // Headline as hero block
  blocks.push({
    id: 'judge-hero',
    type: 'hero',
    props: { headline: copy.headline, subheadline: copy.subheadline, alignment: 'left' },
    styles: { mobile: {}, tablet: {}, desktop: {} },
    visibility: 'all' as const,
  });

  // Each phase as body-text
  const phases = ['hookBody', 'painBody', 'discoveryBody', 'proofBody', 'offerBody'] as const;
  for (const phase of phases) {
    const text = (copy as any)[phase];
    if (text && typeof text === 'string') {
      blocks.push({
        id: `judge-${phase}`,
        type: 'body-text',
        props: { content: text },
        styles: { mobile: {}, tablet: {}, desktop: {} },
        visibility: 'all' as const,
      });
    }
  }

  // Single body fallback
  if (copy.body) {
    blocks.push({
      id: 'judge-body',
      type: 'body-text',
      props: { content: copy.body },
      styles: { mobile: {}, tablet: {}, desktop: {} },
      visibility: 'all' as const,
    });
  }

  // Benefits
  if (copy.benefits?.length) {
    blocks.push({
      id: 'judge-benefits',
      type: 'benefits-list',
      props: { benefits: copy.benefits, iconType: 'checkmark' },
      styles: { mobile: {}, tablet: {}, desktop: {} },
      visibility: 'all' as const,
    });
  }

  // CTA
  if (copy.ctaText) {
    blocks.push({
      id: 'judge-cta',
      type: 'button',
      props: { text: copy.ctaText, variant: 'primary', fullWidth: true, size: 'lg' },
      styles: { mobile: {}, tablet: {}, desktop: {} },
      visibility: 'all' as const,
    });
  }

  // Guarantee
  if (copy.guarantee) {
    blocks.push({
      id: 'judge-guarantee',
      type: 'guarantee',
      props: { title: 'Guarantee', description: copy.guarantee, days: 90, iconType: 'shield' },
      styles: { mobile: {}, tablet: {}, desktop: {} },
      visibility: 'all' as const,
    });
  }

  return {
    version: '1.0',
    pageType: 'advertorial',
    palette: 'health-warm',
    blocks,
    metadata: { title: copy.headline, description: '' },
  };
}

// ─── Word Count Helper ────────────────────────────────────────────────────────

function countCopyWords(copy: CopywriterOutput): number {
  const phases = ['hookBody', 'painBody', 'discoveryBody', 'proofBody', 'offerBody'] as const;
  const hasPhases = copy.hookBody || copy.painBody;

  if (hasPhases) {
    let total = 0;
    for (const phase of phases) {
      const text = (copy as any)[phase] || '';
      total += text.split(/\s+/).filter(Boolean).length;
    }
    return total;
  }

  if (copy.body) {
    return copy.body.split(/\s+/).filter(Boolean).length;
  }

  return 0;
}

// ─── Free Text Generation (3-Step Pipeline) ────────────────────────────────────

/**
 * WHY: Even when finishReason='stop', the model often ends without urgency/CTA.
 *      This checks the last 400 words for real CTA signals. If missing, we need continuation.
 *      Only matches strong CTA signals (guarantee, urgency, limited, act/click/order now).
 *      Weak mentions like "bottle" or "safety net" don't count.
 */
const CTA_SIGNALS = /\b(guarantee|money.?back|risk.?free|limited.?time|limited.?stock|limited.?supply|act.?now|click.?here|order.?now|get.?yours|check.?avail|don.?t.?wait|spots?.?left|running.?out|discount|special.?offer|today.?only|only\s*\d+\s*left|claim.?your|before.?it.?s?.?too.?late|last.?chance)\b/i;

function needsCtaContinuation(text: string): boolean {
  // Check last 400 words for CTA signals
  const words = text.split(/\s+/);
  const tail = words.slice(-400).join(' ');
  return !CTA_SIGNALS.test(tail);
}

/**
 * WHY: The lab proves free text output scores 8.57/10 vs JSON output 6.44/10.
 *      The JSON constraint forces the model to spend tokens on structure instead
 *      of persuasive copywriting. Free text lets the model focus 100% on quality.
 *      This is Step 1 of the 3-step pipeline: free text → judge → convert to blocks.
 * Source: test-results/2026-05-09-advertorial-pipeline.md, GUIDE-IA.md #3
 */
async function generateFreeTextCopy(
  config: GeneratorConfig,
  pageType: PageType,
  product: GeneratePageRequest['product'],
  marketingAngle?: ComposerPromptParams['marketingAngle'],
): Promise<string> {
  const { systemPrompt, userPrompt } = buildFreeTextCopywriterPrompt({
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

  const fullConfig = { ...DEFAULT_CONFIG, ...config, maxTokens: 16384 };
  const llmResult = await callLlm(fullConfig, systemPrompt, userPrompt);

  let text = llmResult.content;
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  console.log(`[free-text-copywriter] Generated ${wordCount} words (finishReason: ${llmResult.finishReason})`);

  // WHY: DeepSeek often stops before writing the urgency/CTA section, even with finishReason='stop'.
  //      Two triggers: (1) physical truncation (finishReason='length'), (2) missing CTA signals.
  const isTruncated = llmResult.finishReason === 'length';
  const missingCta = needsCtaContinuation(text);

  if (isTruncated || missingCta) {
    const reason = isTruncated ? 'truncated' : 'missing CTA/urgency section';
    const lastChars = text.slice(-300);
    console.log(`[free-text-copywriter] ${reason}! Requesting continuation...`);
    const continuation = await callLlm(
      fullConfig,
      'You are continuing a sales advertorial that was cut off. Continue writing from where you left off. Complete the urgency/CTA section now. Do NOT repeat what was already written. Do NOT add a new introduction. Just continue the text.',
      `CONTINUE FROM HERE (last words of the previous part):\n\n...${lastChars}\n\nContinue the advertorial now. Include urgency (limited time/stock), the money-back guarantee, and a direct recommendation to act NOW. End with a strong CTA button text like "Check Availability Now →"`,
    );
    text = text + '\n\n' + continuation.content;
    const finalWords = text.split(/\s+/).filter(Boolean).length;
    console.log(`[free-text-copywriter] After continuation: ${finalWords} words total`);
  }

  return text;
}

/**
 * WHY: Reddit persona often beats Copywriter on advertorial (+0.373 in lab).
 *      Free text version lets Reddit persona write naturally without JSON constraint.
 * Source: CHAMPIONS.md #12
 */
async function generateFreeTextReddit(
  config: GeneratorConfig,
  pageType: PageType,
  product: GeneratePageRequest['product'],
  marketingAngle?: ComposerPromptParams['marketingAngle'],
): Promise<string> {
  const { systemPrompt, userPrompt } = buildFreeTextRedditPrompt({
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

  const fullConfig = { ...DEFAULT_CONFIG, ...config, maxTokens: 16384 };
  const llmResult = await callLlm(fullConfig, systemPrompt, userPrompt);

  let text = llmResult.content;
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  console.log(`[free-text-reddit] Generated ${wordCount} words (finishReason: ${llmResult.finishReason})`);

  // WHY: DeepSeek often stops before writing the urgency/CTA section, even with finishReason='stop'.
  //      Two triggers: (1) physical truncation (finishReason='length'), (2) missing CTA signals.
  const isTruncated = llmResult.finishReason === 'length';
  const missingCta = needsCtaContinuation(text);

  if (isTruncated || missingCta) {
    const reason = isTruncated ? 'truncated' : 'missing CTA/urgency section';
    const lastChars = text.slice(-300);
    console.log(`[free-text-reddit] ${reason}! Requesting continuation...`);
    const continuation = await callLlm(
      fullConfig,
      'You are continuing a Reddit post / personal story that was cut off. Continue writing from where you left off. Stay in character as a real person sharing their experience. Complete the urgency/CTA section now. Do NOT repeat what was already written.',
      `CONTINUE FROM HERE (last words of the previous part):\n\n...${lastChars}\n\nContinue the Reddit post now. Wrap up the story: mention any limited-time offer or discount you found, confirm the money-back guarantee, and end with a recommendation to check it out. Keep it sounding like a real person, not a sales pitch.`,
    );
    text = text + '\n\n' + continuation.content;
    const finalWords = text.split(/\s+/).filter(Boolean).length;
    console.log(`[free-text-reddit] After continuation: ${finalWords} words total`);
  }

  return text;
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
  judgeConfig?: GeneratorConfig,
): Promise<GeneratePageResult> {
  const fullConfig = { ...DEFAULT_CONFIG, ...config };
  const maxRetries = fullConfig.maxRetries ?? 3;
  const minScore = fullConfig.minScore ?? 70;
  const startTime = Date.now();
  let totalTokensUsed = 0;

  // Build the product context string
  const productContext = buildProductContext(request.product);

  // ── Step 1: Copywriter call (optional, two-call pipeline) ──
  // WHY: Two architectures coexist:
  //      1. 3-Step Pipeline (advertorial): free text → judge → convert to blocks
  //         Matches lab architecture. Free text scores 8.57 vs JSON 6.44.
  //      2. 2-Call Pipeline (other types): JSON copywriter → composer
  //         Works well for transactional formats (upsell, checkout, product-page).
  // Source: GUIDE-IA.md "Architecture Actuelle", test-results/2026-05-09-advertorial-pipeline.md
  let prewrittenCopy: CopywriterOutput | undefined;
  let prewrittenRawText: string | undefined;

  if (copywriterConfig) {
    const useThreeStepPipeline = request.pageType === 'advertorial';

    if (useThreeStepPipeline) {
      // ── 3-Step Pipeline (lab-faithful): free text → judge → convert ──
      // WHY: Lab generates FREE TEXT, not JSON. This is the #1 factor in the
      //      score gap (8.57 lab vs 6.44 ECOM-AI). Free text lets the model
      //      focus on copywriting quality without JSON structure overhead.
      // Source: GUIDE-IA.md #3, test-results/2026-05-09-advertorial-pipeline.md
      try {
        // Step 1: Generate FREE TEXT with both personas in parallel
        const [copyResult, redditResult] = await Promise.allSettled([
          generateFreeTextCopy(copywriterConfig, request.pageType, request.product, request.marketingAngle),
          generateFreeTextReddit(copywriterConfig, request.pageType, request.product, request.marketingAngle),
        ]);

        const copyText = copyResult.status === 'fulfilled' ? copyResult.value : undefined;
        const redditText = redditResult.status === 'fulfilled' ? redditResult.value : undefined;

        if (copyText && redditText) {
          // Step 2: Judge both in parallel, pick the best
          // WHY: Judge uses DeepSeek (more accurate), producer uses MiMo (free).
          //      Falls back to copywriterConfig if judgeConfig not provided.
          const brief = `${request.product.name}: ${request.product.description}`;
          const judgeCfg = judgeConfig ?? copywriterConfig;
          const [copyJudge, redditJudge] = await Promise.all([
            judgeRawText(copyText, request.pageType, brief, judgeCfg),
            judgeRawText(redditText, request.pageType, brief, judgeCfg),
          ]);

          const copyScore = copyJudge?.total ?? 0;
          const redditScore = redditJudge?.total ?? 0;

          if (copyScore >= redditScore) {
            prewrittenRawText = copyText;
            console.log(`[3-step] Copywriter free text wins (judge ${copyScore} vs ${redditScore})`);
          } else {
            prewrittenRawText = redditText;
            console.log(`[3-step] Reddit free text wins (judge ${redditScore} vs ${copyScore})`);
          }
        } else {
          prewrittenRawText = copyText ?? redditText;
        }
      } catch {
        prewrittenRawText = undefined;
      }
    } else {
      // Single persona for non-advertorial
      try {
        prewrittenCopy = await generateCopywriting(
          copywriterConfig,
          request.pageType,
          request.product,
          request.marketingAngle,
        );
      } catch {
        prewrittenCopy = undefined;
      }
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
    prewrittenRawText,
  };

  // Build the initial system prompt
  let systemPrompt = buildComposerPrompt(composerParams);
  const userPrompt = prewrittenCopy
    ? `Generate the ${request.pageType} page structure now. Use the PRE-WRITTEN COPY provided above. Output ONLY valid JSON.`
    : `Generate the ${request.pageType} page now. Output ONLY valid JSON.`;

  // Retry loop
  // WHY: Separate counters for API errors vs validation errors.
  //      API errors (402 Insufficient Balance, 429 Rate Limit) should retry
  //      with a DIFFERENT key without consuming a validation retry slot.
  //      Only validation failures count toward maxRetries.
  let lastValidation: PipelineResult | undefined;
  let lastBlockTree: BlockTree | undefined;
  let attempts = 0;
  const MAX_API_RETRIES = 6; // Try up to 6 different keys before giving up
  let apiRetries = 0;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    attempts = attempt + 1;

    try {
      // Call LLM (rotates key via getNextKey on each call)
      const llmResult = await callLlm(fullConfig, systemPrompt, userPrompt);
      totalTokensUsed += llmResult.tokensUsed;
      apiRetries = 0; // Reset on successful API call

      // Parse JSON
      const rawJson = extractJson(llmResult.content);

      // WHY: Save the parsed JSON BEFORE validation so we always have something to render,
      //      even if validation fails. Previously, lastBlockTree stayed undefined when
      //      validation failed (e.g. forbidden block), meaning no HTML output at all.
      lastBlockTree = rawJson as BlockTree;

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
      const tree = rawJson as BlockTree;

      // WHY: Composer ignores prompt-level bans on certain block types.
      //      Post-generation filtering is the only reliable way to remove them.
      const BANNED_ADVERTORIAL_BLOCKS = ['numbered-benefits'];
      if (request.pageType === 'advertorial' && Array.isArray(tree.blocks)) {
        const before = tree.blocks.length;
        tree.blocks = tree.blocks.filter(b => !BANNED_ADVERTORIAL_BLOCKS.includes(b.type));
        const removed = before - tree.blocks.length;
        if (removed > 0) {
          console.warn(`[block-filter] Removed ${removed} banned blocks: ${BANNED_ADVERTORIAL_BLOCKS.join(', ')}`);
        }
      }

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
          freeTextUsed: !!prewrittenRawText,
        },
      };

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);

      // WHY: API errors (402, 429) should retry with next key WITHOUT
      //      consuming a validation retry. Just decrement attempt counter
      //      and try the next key in the pool.
      const isApiError = errorMsg.includes('LLM API error 402') || errorMsg.includes('LLM API error 429');

      if (isApiError && apiRetries < MAX_API_RETRIES) {
        apiRetries++;
        attempt--; // Don't count API errors toward validation retries
        continue;  // getNextKey() will give us the next key
      }

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
