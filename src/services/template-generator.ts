/**
 * Purpose: Template-based page generator — AI generates content → inject into winner HTML.
 *          INDEPENDENT from block system (page-generator.ts).
 * Dependencies: template-engine.ts, template-filler.ts
 * Related: scripts/test-template-generate.ts (test script)
 *
 * FLOW:
 *   1. Product brief → AI generates content map (47 slots)
 *   2. Content map → template engine fills HTML
 *   3. Filled HTML → saved to output/
 *
 * WHY: Templates give 99.9% visual fidelity with winners.
 *      Block system gives ~82%. For advertorials, templates win.
 */

import { fillTemplate, saveFilledTemplate, type ContentMap, type TemplateResult } from './template-engine';
import { buildTemplateFillerPrompt, type ProductBrief } from '../agents/prompts/template-filler';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TemplateGeneratorConfig {
  apiUrl: string;
  apiKey: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
  maxRetries?: number;
}

export interface TemplateGenerateResult {
  success: boolean;
  templateId: string;
  outputPath: string;
  duration: string;
  tokensUsed: number;
  retries: number;
  slotsFilled: number;
  slotsEmpty: number;
  warnings: string[];
  error?: string;
}

// ─── Default Config ───────────────────────────────────────────────────────────

const DEFAULT_GEN_CONFIG: Partial<TemplateGeneratorConfig> = {
  temperature: 0.5,
  maxTokens: 16384,
  maxRetries: 2,
};

// ─── Main Generator ───────────────────────────────────────────────────────────

/**
 * Generate a complete advertorial page using a template.
 *
 * @param templateId - Template to use (e.g., 'smoothspire-advertorial')
 * @param brief - Product information for content generation
 * @param config - AI API configuration
 * @param outputDir - Where to save the output HTML
 */
export async function generateFromTemplate(
  templateId: string,
  brief: ProductBrief,
  config: TemplateGeneratorConfig,
  outputDir: string
): Promise<TemplateGenerateResult> {
  const startTime = Date.now();
  const maxRetries = config.maxRetries ?? DEFAULT_GEN_CONFIG.maxRetries ?? 2;
  const temperature = config.temperature ?? DEFAULT_GEN_CONFIG.temperature ?? 0.5;
  const maxTokens = config.maxTokens ?? DEFAULT_GEN_CONFIG.maxTokens ?? 16384;

  let lastError: string | undefined;
  let totalTokens = 0;
  let retryCount = 0;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        retryCount = attempt;
        console.log(`[template-gen] Retry attempt ${attempt}/${maxRetries}`);
      }

      // Step 1: Build prompt
      const prompt = buildTemplateFillerPrompt(brief);

      // Step 2: Call AI
      console.log(`[template-gen] Calling ${config.model} for content generation...`);
      const aiResponse = await callLlm(config.apiUrl, config.apiKey, config.model, prompt, temperature, maxTokens);
      totalTokens += aiResponse.tokens;

      // Step 3: Parse JSON response
      const contentMap = parseContentMap(aiResponse.text);

      if (!contentMap) {
        lastError = 'AI response is not valid JSON';
        console.warn(`[template-gen] Attempt ${attempt}: ${lastError}`);
        continue;
      }

      // Step 4: Merge brief values (these come from the brief, not AI)
      // WHY: product_name, prices, rating count, images are known upfront — no need for AI to generate them.
      const mergedMap: ContentMap = {
        product_name: brief.name,
        product_price: brief.price,
        product_original_price: brief.originalPrice,
        product_discount_pct: brief.discountPct,
        hero_rating_text: `${brief.ratingCount ?? '4,891'} Ratings`,
        // Trust badge guarantee text (not in slot config but exists in template HTML)
        trust_badge_guarantee: brief.guarantee,
        // Image URLs passed through for post-processing replacement
        _doctorImageUrl: brief.doctorImageUrl ?? '',
        _productImageUrl: brief.productImageUrl ?? '',
        _productImageSquareUrl: brief.productImageSquareUrl ?? '',
        _logoUrl: brief.logoUrl ?? '',
        _productVideoUrl: brief.productVideoUrl ?? '',
        _commentScreenshotUrls: brief.commentScreenshotUrls ?? [],
        _contentImageUrls: brief.contentImageUrls ?? {},
        ...contentMap,
      };

      // Step 5: Fill template
      console.log(`[template-gen] Filling template with ${Object.keys(mergedMap).length} slots...`);
      const result = fillTemplate(templateId, mergedMap, 'marker');

      // Step 5: Save output
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
      const filename = `template-${templateId}-${timestamp}.html`;
      const outputPath = `${outputDir}/${filename}`;

      saveFilledTemplate(result, outputPath);

      const duration = ((Date.now() - startTime) / 1000).toFixed(1);

      // Also save metadata
      const metaOutputPath = outputPath.replace('.html', '.json');
      const meta = {
        success: true,
        templateId,
        product: brief.name,
        duration,
        tokensUsed: totalTokens,
        retries: retryCount,
        slotsFilled: result.slotsFilled,
        slotsEmpty: result.slotsEmpty,
        warnings: result.warnings,
        model: config.model,
        temperature,
        timestamp: new Date().toISOString(),
      };

      const fs = await import('fs');
      fs.writeFileSync(metaOutputPath, JSON.stringify(meta, null, 2));

      console.log(`[template-gen] Success! ${result.slotsFilled} slots filled in ${duration}s`);
      console.log(`[template-gen] Output: ${outputPath}`);

      return {
        success: true,
        templateId,
        outputPath,
        duration,
        tokensUsed: totalTokens,
        retries: retryCount,
        slotsFilled: result.slotsFilled,
        slotsEmpty: result.slotsEmpty,
        warnings: result.warnings,
      };

    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
      console.warn(`[template-gen] Attempt ${attempt} failed: ${lastError}`);
    }
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  return {
    success: false,
    templateId,
    outputPath: '',
    duration,
    tokensUsed: totalTokens,
    retries: retryCount,
    slotsFilled: 0,
    slotsEmpty: 0,
    warnings: [],
    error: `All ${maxRetries + 1} attempts failed. Last error: ${lastError}`,
  };
}

// ─── LLM Call ─────────────────────────────────────────────────────────────────

interface LlmResponse {
  text: string;
  tokens: number;
}

async function callLlm(
  apiUrl: string,
  apiKey: string,
  model: string,
  prompt: string,
  temperature: number,
  maxTokens: number
): Promise<LlmResponse> {
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: 'You are an elite direct-response copywriter. Output ONLY valid JSON.' },
        { role: 'user', content: prompt },
      ],
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`API error ${response.status}: ${body.substring(0, 200)}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content ?? '';

  // Extract token usage
  const tokens = (data.usage?.prompt_tokens ?? 0) + (data.usage?.completion_tokens ?? 0);

  return { text, tokens };
}

// ─── JSON Parser ──────────────────────────────────────────────────────────────

/**
 * Parse AI response into ContentMap. Handles:
 * - Clean JSON
 * - JSON wrapped in markdown code fences
 * - JSON with trailing text
 */
function parseContentMap(text: string): ContentMap | null {
  // Strip markdown code fences if present
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
  }

  // Try direct parse
  try {
    const parsed = JSON.parse(cleaned);
    return normalizeContentMap(parsed);
  } catch {
    // Try to find JSON object in the text
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start !== -1 && end > start) {
      try {
        const parsed = JSON.parse(cleaned.substring(start, end + 1));
        return normalizeContentMap(parsed);
      } catch {
        return null;
      }
    }
    return null;
  }
}

/**
 * Normalize the parsed content map — handle array fields that come as strings.
 * WHY: AI sometimes outputs JSON arrays as escaped strings instead of actual arrays.
 */
function normalizeContentMap(parsed: Record<string, unknown>): ContentMap {
  const result: ContentMap = {};

  for (const [key, value] of Object.entries(parsed)) {
    if (typeof value === 'string') {
      // Check if it's a JSON array string
      if (value.startsWith('[') && value.endsWith(']')) {
        try {
          result[key] = JSON.parse(value);
        } catch {
          result[key] = value;
        }
      } else {
        result[key] = value;
      }
    } else if (Array.isArray(value)) {
      result[key] = value;
    } else if (value && typeof value === 'object') {
      result[key] = value as Record<string, string>[];
    } else {
      result[key] = String(value ?? '');
    }
  }

  return result;
}
