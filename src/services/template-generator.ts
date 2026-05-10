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
import { buildReasonsWhyPrompt } from '../agents/prompts/reasons-why-filler';
import { buildProductPageFillerPrompt } from '../agents/prompts/product-page-filler';
import { buildCheckoutFillerPrompt, type CheckoutBrief } from '../agents/prompts/checkout-filler';

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

      // Step 1: Build prompt (route by template type)
      const prompt = buildPromptForTemplate(templateId, brief);

      // Step 2: Call AI
      console.log(`[template-gen] Calling ${config.model} for content generation...`);
      const aiResponse = await callLlm(config.apiUrl, config.apiKey, config.model, prompt, temperature, maxTokens);
      totalTokens += aiResponse.tokens;

      // Step 3: Parse JSON response
      const contentMap = parseContentMap(aiResponse.text);

      if (!contentMap) {
        lastError = 'AI response is not valid JSON';
        console.warn(`[template-gen] Attempt ${attempt}: ${lastError}`);
        console.warn(`[template-gen] Raw response (first 500 chars): ${aiResponse.text.substring(0, 500)}`);
        console.warn(`[template-gen] Raw response length: ${aiResponse.text.length}`);
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
        // Product page specific: static slots that come from the brief, not AI
        ...(templateId.startsWith('product-page') ? {
          cta_text: `GET ${brief.discountPct} OFF TODAY ONLY!`,
          sticky_cta_text: 'ORDER NOW!',
          sale_discount_text: `${brief.discountPct} OFF`,
          review_count: brief.ratingCount ?? '1,257+',
          review_score: (brief as any).ratingScore ?? '4.9',
          stock_level: 'LOW',
          stock_level_text: 'Current stock level:',
          stock_urgency_text: `if you order now. Better hurry -- stock is running out!`,
          discount_urgency_text: `Get ${brief.discountPct} OFF Discount`,
          doctor_meet: 'Meet',
          copyright_text: `${brief.name}. All rights reserved.`,
          sale_banner_uk_text: `Limited Time Promo: ${brief.discountPct} OFF`,
        } : {}),
        // Checkout specific: bundle pricing, URLs, warranty — all from brief
        ...(templateId.startsWith('checkout') ? buildCheckoutBriefValues(brief) : {}),
        // Image URLs passed through for post-processing replacement
        _doctorImageUrl: brief.doctorImageUrl ?? '',
        _productImageUrl: brief.productImageUrl ?? '',
        _productImageSquareUrl: brief.productImageSquareUrl ?? '',
        _logoUrl: brief.logoUrl ?? '',
        _productVideoUrl: brief.productVideoUrl ?? '',
        _productVideoUrls: brief.productVideoUrls ?? [],
        _commentScreenshotUrls: brief.commentScreenshotUrls ?? [],
        _contentImageUrls: brief.contentImageUrls ?? {},
        _useVideos: brief.useVideos ?? false,
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

// ─── Prompt Router ──────────────────────────────────────────────────────────────

/**
 * Route to the correct prompt builder based on template ID.
 * WHY: Different templates (narrative advertorial vs listicle) need different prompts.
 */
function buildPromptForTemplate(templateId: string, brief: ProductBrief): string {
  if (templateId.startsWith('hike-reasons-why')) {
    return buildReasonsWhyPrompt(brief);
  }
  if (templateId.startsWith('product-page')) {
    return buildProductPageFillerPrompt(brief);
  }
  if (templateId.startsWith('checkout')) {
    return buildCheckoutFillerPrompt(brief);
  }
  // Default: SmoothSpire narrative advertorial
  return buildTemplateFillerPrompt(brief);
}

// ─── Checkout Brief Values Builder ─────────────────────────────────────────────

/**
 * Build checkout-specific ContentMap values from the brief.
 * WHY: Checkout has 54 bundle/pricing/URL markers that must come from the brief,
 *      NOT from AI. This function maps CheckoutBrief → ContentMap for those slots.
 *      Brief values go AFTER AI contentMap in the merge so they always win.
 */
function buildCheckoutBriefValues(brief: ProductBrief): ContentMap {
  const cb = brief as any; // CheckoutBrief passed as ProductBrief
  const values: ContentMap = {
    product_name: brief.name,
    product_name_plural: cb.namePlural ?? `${brief.name}s`,
    product_type: cb.productType ?? 'Product',
  };

  // Bundle pricing (3 or 4 bundles)
  const bundles = cb.bundles ?? [];
  for (let i = 0; i < bundles.length; i++) {
    const b = bundles[i];
    const n = i + 1;
    values[`bundle_${n}_id`] = b.id ?? '';
    values[`bundle_${n}_label`] = b.label ?? '';
    values[`bundle_${n}_qty_label`] = b.qtyLabel ?? '';
    values[`bundle_${n}_price`] = b.unitPrice ?? '';
    values[`bundle_${n}_compare_price`] = b.comparePrice ?? '';
    values[`bundle_${n}_total`] = b.totalPrice ?? '';
    values[`bundle_${n}_compare_total`] = b.compareTotal ?? '';
    values[`bundle_${n}_discount`] = b.totalDiscount ?? '';
    values[`bundle_${n}_unit_price`] = b.unitPrice ?? '';
    values[`bundle_${n}_ship_span`] = b.shipSpan ?? '';
    values[`bundle_${n}_ship_value`] = b.shipValue ?? '';
    values[`bundle_${n}_img`] = b.img ?? '';
    values[`bundle_${n}_price_display`] = b.priceDisplay ?? '';
    values[`bundle_${n}_compare_display`] = b.compareDisplay ?? '';
    values[`bundle_${n}_discount_pct`] = b.discountPct ?? '';
    if (n === 1) {
      // Bundle 1 has shipping text instead of FREE SHIPPING
      values[`bundle_${n}_shipping`] = b.shipping ?? '';
    }
  }

  // Bundle 4 visibility (hide if only 3 bundles)
  values['bundle_4_display'] = bundles.length >= 4 ? 'display:block' : 'display:none';
  // Clear bundle 4 data if hidden
  if (bundles.length < 4) {
    values['bundle_4_id'] = '';
    values['bundle_4_label'] = '';
    values['bundle_4_qty_label'] = '';
    values['bundle_4_price'] = '';
    values['bundle_4_compare_price'] = '';
    values['bundle_4_total'] = '';
    values['bundle_4_compare_total'] = '';
    values['bundle_4_discount'] = '';
    values['bundle_4_unit_price'] = '';
    values['bundle_4_ship_span'] = '';
    values['bundle_4_ship_value'] = '';
    values['bundle_4_img'] = '';
    values['bundle_4_price_display'] = '';
    values['bundle_4_compare_display'] = '';
    values['bundle_4_discount_pct'] = '';
  }

  // Initial order summary (defaults to bundle 2 = best seller)
  const defaultBundle = bundles.length >= 2 ? bundles[1] : bundles[0];
  if (defaultBundle) {
    values['order_initial_subtotal'] = defaultBundle.totalPrice;
    values['order_initial_price'] = defaultBundle.totalPrice;
    values['order_initial_compare_price'] = defaultBundle.comparePrice;
    values['order_initial_total'] = defaultBundle.totalPrice;
    values['order_initial_compare_total'] = defaultBundle.compareTotal;
    values['order_initial_grand_total'] = defaultBundle.totalPrice;
    values['order_initial_shipping_worth'] = defaultBundle.shipValue;
    values['compare_shipping'] = defaultBundle.shipValue === 'FREE' ? 'FREE' : defaultBundle.shipValue;
  }

  // Warranty
  const warranty = cb.warranty;
  if (warranty) {
    values['warranty_description'] = warranty.description;
    values['warranty_duration'] = warranty.duration;
    values['warranty_price'] = warranty.price;
    values['warranty_price_num'] = warranty.priceNum;
  }

  // URLs
  values['checkout_base_url'] = cb.checkoutBaseUrl ?? '';
  values['checkout_url'] = cb.checkoutUrl ?? '';
  values['secure_base_url'] = cb.secureBaseUrl ?? cb.checkoutBaseUrl ?? '';
  values['stripe_api_endpoint'] = cb.stripeApiEndpoint ?? '';
  values['google_places_api_key'] = cb.googlePlacesApiKey ?? '';
  values['stripe_redirect_base_url'] = cb.stripeRedirectBaseUrl ?? cb.checkoutBaseUrl ?? '';
  values['terms_url'] = cb.termsUrl ?? '#';
  values['privacy_url'] = cb.privacyUrl ?? '#';
  values['refund_url'] = cb.refundUrl ?? '#';

  // Discount banner text (matches brief discountPct)
  values['sale_discount_text'] = `${brief.discountPct} OFF`;
  values['discount_applied_text'] = `${brief.discountPct} OFF Applied`;

  // Image URLs
  values['logo_image'] = cb.logoUrl ?? '';
  values['brand_image'] = cb.brandImageUrl ?? '';
  values['product_assets_base_url'] = cb.productAssetsBaseUrl ?? '';
  values['product_gallery_base_url'] = cb.galleryBaseUrl ?? '';
  const galleryImages = cb.galleryImages ?? [];
  for (let i = 0; i < 5; i++) {
    values[`product_gallery_img_${i + 1}`] = galleryImages[i] ?? '';
  }
  values['flag_sprite_url'] = cb.flagSpriteUrl ?? '';

  return values;
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
