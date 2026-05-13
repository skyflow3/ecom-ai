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
import { buildUpsellFillerPrompt, type UpsellBrief } from '../agents/prompts/upsell-filler';
import { buildThankYouFillerPrompt, type ThankYouBrief } from '../agents/prompts/thankyou-filler';

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
      //      AI contentMap is spread FIRST so brief values ALWAYS override (brief = source of truth).
      const mergedMap: ContentMap = {
        // AI-generated content (lowest priority — brief values override)
        ...contentMap,
        // Brief-derived values (higher priority — always win over AI)
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
        // Upsell specific: offer pricing, images, countdown — all from brief
        ...(templateId.startsWith('upsell') ? buildUpsellBriefValues(brief) : {}),
        // Cross-sell upsell specific: different slot names from OTO1
        ...(templateId === 'upsell-cross-sell' ? buildCrossSellBriefValues(brief) : {}),
        // Product upsell (OTO3-4) specific: slot names matching the OTO3/OTO4 originals
        ...(templateId === 'upsell-product' ? buildProductUpsellBriefValues(brief) : {}),
        // Protection upsell (OTO5) specific: slot names matching the OTO5 original
        ...(templateId === 'upsell-protection' ? buildProtectionBriefValues(brief) : {}),
        // Thank you page specific: brand identity, support info, images, URLs
        ...(templateId.startsWith('thank-you-page') ? buildThankYouBriefValues(brief) : {}),
        // Image URLs passed through for post-processing replacement
        _doctorImageUrl: brief.doctorImageUrl ?? '',
        _productImageUrl: brief.productImageUrl ?? '',
        _productImageSquareUrl: brief.productImageSquareUrl ?? '',
        _logoUrl: brief.logoUrl ?? '',
        _productVideoUrl: brief.productVideoUrl ?? '',
        _productVideoUrls: (brief as any).productVideoUrls ?? [] as any,
        _commentScreenshotUrls: brief.commentScreenshotUrls ?? [],
        _contentImageUrls: (brief.contentImageUrls ?? {}) as any,
        _useVideos: (brief.useVideos ?? false) as any,
      };

      // Step 5: Fill template
      console.log(`[template-gen] Filling template with ${Object.keys(mergedMap).length} slots...`);
      let result = fillTemplate(templateId, mergedMap, 'marker');

      // Step 5b: Remove optional sections based on template + position
      // WHY: OTO3 shows SECTION_BODY_EXTRA (bullets + extended persuasion) but hides ingredients/usage.
      //      OTO4 shows ingredients/usage but hides SECTION_BODY_EXTRA.
      //      Each OTO gets enough slots for rich persuasion copy.
      if (templateId === 'upsell-product') {
        const position = (brief as any).otoPosition ?? 4;
        if (position === 3) {
          // OTO3: remove ingredient box + usage tips, KEEP body_extra
          result = { ...result, html: result.html.replace(
            /<!-- SECTION_INGREDIENTS_START -->[\s\S]*?<!-- SECTION_INGREDIENTS_END -->/g,
            ''
          )};
          result = { ...result, html: result.html.replace(
            /<!-- SECTION_USAGE_START -->[\s\S]*?<!-- SECTION_USAGE_END -->/g,
            ''
          )};
        } else {
          // OTO4+: remove body_extra section (OTO4 uses ingredients/usage instead)
          result = { ...result, html: result.html.replace(
            /<!-- SECTION_BODY_EXTRA_START -->[\s\S]*?<!-- SECTION_BODY_EXTRA_END -->/g,
            ''
          )};
        }
      }
      // Legacy: upsell-cross-sell still has SECTION_EXTENDED markers
      if (templateId === 'upsell-cross-sell') {
        const position = (brief as any).otoPosition ?? 2;
        if (position >= 3) {
          result = { ...result, html: result.html.replace(
            /<!-- SECTION_EXTENDED_START -->[\s\S]*?<!-- SECTION_EXTENDED_END -->/g,
            ''
          )};
          result = { ...result, html: result.html.replace(
            /<!-- SECTION_USAGE_START -->[\s\S]*?<!-- SECTION_USAGE_END -->/g,
            ''
          )};
        }
      }
      // Thank you page: remove optional sections based on brief flags
      if (templateId.startsWith('thank-you-page')) {
        const tb = brief as any;
        if (tb.showSurvey === false) {
          result = { ...result, html: result.html.replace(
            /<!-- SECTION_SURVEY_START -->[\s\S]*?<!-- SECTION_SURVEY_END -->/g,
            ''
          )};
        }
        if (tb.showVideo === false) {
          result = { ...result, html: result.html.replace(
            /<!-- SECTION_VIDEO_START -->[\s\S]*?<!-- SECTION_VIDEO_END -->/g,
            ''
          )};
        }
        if (tb.showCommunity === false) {
          result = { ...result, html: result.html.replace(
            /<!-- SECTION_COMMUNITY_START -->[\s\S]*?<!-- SECTION_COMMUNITY_END -->/g,
            ''
          )};
        }
        if (tb.showUserGuide === false) {
          result = { ...result, html: result.html.replace(
            /<!-- SECTION_USERGUIDE_START -->[\s\S]*?<!-- SECTION_USERGUIDE_END -->/g,
            ''
          )};
        }
        // WHY: Section markers are HTML comments — always remove them from final output
        //      even when sections are kept visible. They're structural, not content.
        result = { ...result, html: result.html.replace(
          /<!-- SECTION_\w+_(START|END) -->/g,
          ''
        )};
      }
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
    return buildProductPageFillerPrompt(brief as any);
  }
  if (templateId.startsWith('checkout')) {
    return buildCheckoutFillerPrompt(brief);
  }
  if (templateId.startsWith('upsell')) {
    return buildUpsellFillerPrompt(brief, templateId);
  }
  if (templateId.startsWith('thank-you-page')) {
    return buildThankYouFillerPrompt(brief);
  }
  // Default: SmoothSpire narrative advertorial
  return buildTemplateFillerPrompt(brief);
}

// ─── Checkout Brief Values Builder ─────────────────────────────────────────────

/**
 * Parse a price string like "$49.00" to a number (49.00).
 * WHY: Needed for auto-calculating compare prices from discount percentage.
 */
function parsePriceToNum(priceStr: string): number {
  return parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
}

/**
 * Format a number to a price string like "$49.00".
 */
function formatNumToPrice(num: number): string {
  return `$${num.toFixed(2)}`;
}

/**
 * Auto-calculate compare (strikethrough) price from actual price and discount.
 * WHY: The AI or brief provides price + discountPct, but might forget or miscalculate
 *      the comparePrice. This ensures consistency: if discountPct exists, comparePrice
 *      is always calculated automatically.
 *
 * Rules:
 *   - If comparePrice already provided AND differs from price → keep it (explicit override)
 *   - If discountPct provided (> 0) → calculate: comparePrice = price / (1 - discount/100)
 *   - If no discount (0% or empty) → comparePrice = price (no strikethrough shown)
 */
function autoCalcComparePrice(priceStr: string, comparePriceStr: string, discountPctStr: string): string {
  const price = parsePriceToNum(priceStr);
  const comparePrice = parsePriceToNum(comparePriceStr);
  const discountPct = parseFloat(discountPctStr.replace(/[^0-9.]/g, '')) || 0;

  // If comparePrice is already set AND differs from price → trust it
  if (comparePrice > 0 && comparePrice !== price) {
    return comparePriceStr;
  }

  // No discount → compare = price (no strikethrough effect)
  if (discountPct <= 0 || discountPct >= 100) {
    return priceStr;
  }

  // Calculate: original price = sale price / (1 - discount%)
  const originalPrice = price / (1 - discountPct / 100);
  return formatNumToPrice(Math.round(originalPrice * 100) / 100);
}

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

    // Auto-calculate compare prices if not explicitly provided
    const unitComparePrice = autoCalcComparePrice(
      b.unitPrice ?? '', b.comparePrice ?? '', b.discountPct ?? ''
    );
    const totalComparePrice = autoCalcComparePrice(
      b.totalPrice ?? '', b.compareTotal ?? '', b.discountPct ?? ''
    );
    const displayComparePrice = autoCalcComparePrice(
      b.priceDisplay ?? '', b.compareDisplay ?? '', b.discountPct ?? ''
    );

    values[`bundle_${n}_id`] = b.id ?? '';
    values[`bundle_${n}_label`] = b.label ?? '';
    values[`bundle_${n}_qty_label`] = b.qtyLabel ?? '';
    values[`bundle_${n}_price`] = b.unitPrice ?? '';
    values[`bundle_${n}_compare_price`] = unitComparePrice;
    values[`bundle_${n}_total`] = b.totalPrice ?? '';
    values[`bundle_${n}_compare_total`] = totalComparePrice;
    values[`bundle_${n}_discount`] = b.totalDiscount ?? '';
    values[`bundle_${n}_unit_price`] = b.unitPrice ?? '';
    values[`bundle_${n}_ship_span`] = b.shipSpan ?? '';
    values[`bundle_${n}_ship_value`] = b.shipValue ?? '';
    values[`bundle_${n}_img`] = b.img ?? '';
    values[`bundle_${n}_price_display`] = b.priceDisplay ?? '';
    values[`bundle_${n}_compare_display`] = displayComparePrice;
    values[`bundle_${n}_discount_pct`] = b.discountPct ?? '';
    values[`bundle_${n}_shipping`] = b.shipping ?? '';

    // Auto-sync shipSpan: if free shipping, show "$X.XX worth" crossed out.
    // If paid shipping, no crossed-out text (empty).
    // WHY: The AI might set the wrong shipSpan. This auto-corrects based on shipValue.
    const isFreeShipping = (b.shipValue ?? '').toUpperCase() === 'FREE';
    if (!b.shipSpan || b.shipSpan === '$4.95 worth') {
      // Only auto-fix if not explicitly customized
      values[`bundle_${n}_ship_span`] = isFreeShipping ? '$4.95 worth' : '';
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

  // Warranty display — WHY: Consumable products don't need warranty upsell
  // AI sets hasWarranty in contentMap. Brief can override. Default: show (true).
  values['warranty_display'] = cb.hasWarranty === false ? 'display:none' : 'display:block';

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
  values['contact_email'] = (brief as unknown as Record<string, unknown>).contactEmail as string ?? 'contact@nutrovia.com';
  values['product_assets_base_url'] = cb.productAssetsBaseUrl ?? '';
  values['product_gallery_base_url'] = cb.galleryBaseUrl ?? '';
  const galleryImages = cb.galleryImages ?? [];
  for (let i = 0; i < 5; i++) {
    values[`product_gallery_img_${i + 1}`] = galleryImages[i] ?? '';
  }
  values['flag_sprite_url'] = cb.flagSpriteUrl ?? '';

  return values;
}

// ─── Thank You Page Brief Values Builder ────────────────────────────────────────

/**
 * Build thank-you-page-specific ContentMap values from the brief.
 * WHY: Thank you page has brand identity, support info, images, and URLs that
 *      must come from the brief, NOT from AI. These go AFTER AI contentMap so they win.
 */
function buildThankYouBriefValues(brief: ProductBrief): ContentMap {
  const tb = brief as any; // ThankYouBrief passed as ProductBrief
  return {
    // Brand identity
    brand_name: tb.brandName ?? brief.name,
    billing_name: tb.billingName ?? tb.brandName ?? brief.name,
    contact_email: tb.supportEmail ?? '',
    // Order table labels (static)
    order_table_header: 'Items Ordered',
    order_discount_label: 'Discount:',
    order_total_label: 'Total:',
    billing_disclaimer: 'Your billing will appear as:',
    // Product/guide info
    userguide_product_name: tb.userguideProductName ?? brief.name,
    userguide_label: 'User Guide',
    shipping_method: tb.shippingMethod ?? 'Standard Shipping (3-7 days)',
    // Support
    support_email: tb.supportEmail ?? '',
    support_phone: tb.supportPhone ?? '',
    // URLs
    logo_link_url: tb.logoLinkUrl ?? '#',
    survey_url: tb.surveyUrl ?? '#',
    community_url: tb.communityUrl ?? '#',
    terms_url: tb.termsUrl ?? '#',
    privacy_url: tb.privacyUrl ?? '#',
    refund_url: tb.refundUrl ?? '#',
    tracking_script_url: tb.trackingScriptUrl ?? '',
    // Images
    flag_image_url: tb.flagImageUrl ?? '',
    hero_image_url: tb.heroImageUrl ?? '',
    product_image_url: tb.productImageUrl ?? '',
    guide_image_1_url: tb.guideImage1Url ?? '',
    guide_image_2_url: tb.guideImage2Url ?? '',
    community_image_url: tb.communityImageUrl ?? '',
    trust_badge_1_url: tb.trustBadge1Url ?? '',
    trust_badge_2_url: tb.trustBadge2Url ?? '',
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

// ─── Upsell Brief Values Builder ────────────────────────────────────────────────

/**
 * Build upsell-specific ContentMap values from the brief.
 * WHY: Upsell has pricing, image URLs, and countdown that come from the brief,
 *      NOT from AI. Brief values go AFTER AI contentMap so they always win.
 */
function buildUpsellBriefValues(brief: ProductBrief): ContentMap {
  const ub = brief as any; // UpsellBrief passed as ProductBrief
  const values: ContentMap = {
    page_title: brief.name,
    logo_image_url: ub.logoUrl ?? '',
    product_image_url: ub.productImageUrl ?? '',
    countdown_minutes: ub.countdownMinutes ?? '10',
    original_price: ub.retailTotalPrice ?? '',
    discount_badge: `${ub.discountPct ?? ''} OFF!`,
    currency_label: ub.currencyLabel ?? 'USD',
    sale_price: ub.offerTotalPrice ?? '',
    total_label: 'Total:',
  };

  return values;
}

/**
 * Build cross-sell upsell (OTO2-5) ContentMap values from the brief.
 * WHY: Cross-sell template has different slot names than OTO1
 *      (banner_stat, warning_headline, benefit_1-5, usage_instructions, etc.)
 *      These values come from the brief, NOT from AI.
 */
function buildCrossSellBriefValues(brief: ProductBrief): ContentMap {
  const ub = brief as any;
  const values: ContentMap = {
    page_title: brief.name,
    logo_url: ub.logoUrl ?? '',
    product_image_url: ub.productImageUrl ?? '',
    countdown_minutes: ub.countdownMinutes ?? '10',
    price_display: `Just ${ub.offerTotalPrice ?? ''}`,
    discount_display: `${ub.discountPct ?? ''} OFF, today only!`,
  };

  return values;
}

// ─── Product Upsell Brief Values (OTO3-4) ──────────────────────────────────────

/**
 * Build product upsell (OTO3-4) ContentMap values from the brief.
 * WHY: Slot names match the OTO3/OTO4 original HTML (headline_top, sub_headline, etc.)
 *      These are pricing, images, countdown — all from brief, NOT from AI.
 */
function buildProductUpsellBriefValues(brief: ProductBrief): ContentMap {
  const ub = brief as any;
  return {
    page_title: brief.name,
    logo_image_url: ub.logoUrl ?? '',
    product_image_url: ub.productImageUrl ?? '',
    product_image_url_cta: ub.productImageUrl ?? '',
    countdown_minutes: ub.countdownMinutes ?? '10',
    countdown_label: 'Hurry! This offer ends in:',
    progress_text: 'Almost Complete...',
    discount_badge: `${ub.discountPct ?? ''} OFF, Today Only!`,
    pricing_headline: `Upgrade your order now: ${ub.discountPct ?? ''} OFF, just ${ub.offerTotalPrice ?? ''}.`,
    price_display: `Just ${ub.offerTotalPrice ?? ''}`,
  };
}

// ─── Protection Upsell Brief Values (OTO5) ─────────────────────────────────────

/**
 * Build protection upsell (OTO5) ContentMap values from the brief.
 * WHY: Slot names match the OTO5 original HTML (hook_stat, offer_headline, etc.)
 *      Protection pages have a fundamentally different layout from product upsells.
 */
function buildProtectionBriefValues(brief: ProductBrief): ContentMap {
  const ub = brief as any;
  return {
    page_title: brief.name,
    logo_image_url: ub.logoUrl ?? '',
    product_image_url: ub.productImageUrl ?? '',
    countdown_minutes: ub.countdownMinutes ?? '10',
    countdown_label: 'Hurry! This offer ends in:',
    progress_text: 'Almost Complete...',
    currency_label: ub.currencyLabel ?? 'USD',
    price_display: ub.offerTotalPrice ?? '',
  };
}

/**
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
