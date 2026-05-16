/**
 * Purpose: Funnel Generator — orchestrates sequential page generation for complete marketing funnels.
 *          Supports A/B variants (template + block mode), CTA wiring, and router generation.
 * Dependencies: template-generator.ts (template mode), page-generator.ts (block mode), cta-injector.ts, variant-router.ts
 * Related: scripts/test-funnel.ts, scripts/test-funnel-ab.ts
 *
 * WHY: Each template generates HTML independently. But a real funnel needs pages CONNECTED:
 *      CTA "Order Now" → checkout, "YES!" → next upsell, "No thanks" → skip to next, etc.
 *      This generator produces ALL pages in sequence and wires every CTA to the next page.
 *
 * DUAL MODE: Each variant can use 'template' mode (.marked.html, 99.9% fidelity)
 *            or 'block' mode (AI composes from scratch, ~82% fidelity).
 *
 * A/B TESTING: Steps can have multiple variants with traffic weights.
 *              A router page splits traffic client-side (no backend needed).
 *
 * DESIGN FOR AI AGENTS:
 *   - One entry point: generateFunnel(config, apiConfig) → FunnelResult
 *   - FunnelConfig defines: steps (order, variants, CTA targets), product brief, output settings
 *   - CTA targets are explicit: step.nextOnAccept / step.nextOnDecline → step ID
 *   - Backward compatible: old FunnelStep with templateId still works
 *
 * STANDARD FUNNEL FLOW:
 *   Entry (advertorial/listicle/product page)
 *     → Checkout (form submission, backend handles redirect)
 *       → OTO1 (volume deal)
 *         → OTO2 (cross-sell)
 *           → OTO3 (product upsell)
 *             → OTO4 (product upsell)
 *               → OTO5 (protection)
 *                 → Thank You Page
 */

import { generateFromTemplate, type TemplateGeneratorConfig } from './template-generator';
import { generatePage, type GeneratePageRequest, type GeneratePageResult, type GeneratorConfig } from './page-generator';
import { injectCtaUrls, type CtaMapping } from './cta-injector';
import { generateVariantRouter } from './variant-router';
import type { ProductBrief } from '../agents/prompts/template-filler';
import type { PageType, PaletteKey } from '../design-system/tokens';
import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';

// ─── Types ──────────────────────────────────────────────────────────────────────

/**
 * One variant of a funnel step. Used for A/B testing.
 * WHY: Allows testing different templates or page types against each other.
 *      E.g., entry page with 3 variants: advertorial, listicle, product page.
 */
export interface FunnelVariant {
  /** Variant identifier (e.g., 'a', 'b', 'c') */
  id: string;
  /** Human-readable name (e.g., 'Advertorial Champion', 'Listicle Variant') */
  name: string;
  /** Generation mode: 'template' uses .marked.html, 'block' uses AI block composition */
  mode: 'template' | 'block';
  /** Template ID (required when mode='template'). E.g., 'smoothspire-advertorial' */
  templateId?: string;
  /** Page type (required when mode='block'). E.g., 'product-page', 'upsell' */
  pageType?: PageType;
  /** Color palette for block mode (default: 'emerald') */
  palette?: PaletteKey;
  /** Override product brief values for this variant */
  briefOverrides?: Record<string, any>;
  /** OTO position for upsell-product template (3 or 4) */
  otoPosition?: number;
  /** Traffic weight percentage (e.g., 33 = 33% of traffic). All weights should sum to 100. */
  trafficWeight: number;
}

/**
 * One step in the funnel. Defines which templates/variants to use and where CTAs point.
 * WHY: Backward compatible — old code with templateId still works.
 *      New code uses variants[] for A/B testing.
 */
export interface FunnelStep {
  /** Unique step ID (e.g., 'entry', 'checkout', 'oto1', 'thankyou') */
  id: string;
  /** Output filename base (e.g., 'entry' → entry.html, entry-a.html, entry-b.html) */
  outputFilename: string;
  /** Step ID that the PRIMARY CTA ("Yes!", "Order Now") points to */
  nextOnAccept?: string;
  /** Step ID that the DECLINE CTA ("No thanks") points to */
  nextOnDecline?: string;

  // ── Legacy fields (backward compatible) ──
  /** Template ID — used when variants[] is absent */
  templateId?: string;
  /** Override product brief values — used when variants[] is absent */
  briefOverrides?: Record<string, any>;
  /** OTO position for upsell-product template — used when variants[] is absent */
  otoPosition?: number;

  // ── A/B variants ──
  /** Variants for A/B testing. If absent, falls back to templateId (single variant). */
  variants?: FunnelVariant[];
}

/** Deploy target configuration — sends generated HTML to production Router. */
export interface DeployConfig {
  /** Router URL (e.g., 'http://5.161.254.135' — must bypass Cloudflare for POST) */
  routerUrl: string;
  /** Host header for Traefik routing (e.g., 'go.nutrovia.co') */
  routerHost: string;
  /** Deploy API key (matches DEPLOY_API_KEY on the Router) */
  deployKey: string;
  /** Funnel slug for the deployed pages (e.g., 'vibriance') */
  slug: string;
}

/** Complete funnel configuration — everything needed to generate all pages. */
export interface FunnelConfig {
  /** Base product brief (shared across all steps) */
  product: ProductBrief;
  /** Ordered list of funnel steps */
  steps: FunnelStep[];
  /** Base URL for CTA links (e.g., 'https://nutrovia.co/funnel' or '.' for relative) */
  baseUrl: string;
  /** Output directory for generated HTML files */
  outputDir: string;
  /** Optional: auto-deploy to production Router after generation */
  deploy?: DeployConfig;
}

/** Result of generating a single variant. */
export interface VariantResult {
  variantId: string;
  /** Path to the HTML file */
  outputPath: string;
  /** URL for this variant page */
  url: string;
  /** Number of CTA buttons wired */
  ctasInjected: number;
  success: boolean;
  error?: string;
}

/** Result of generating a single step (may contain multiple variants). */
export interface StepResult {
  stepId: string;
  /** Router HTML path (only if 2+ variants) */
  routerPath?: string;
  /** All variant results for this step */
  variants: VariantResult[];
  success: boolean;
  error?: string;
}

/** Result of generating the complete funnel. */
export interface FunnelResult {
  success: boolean;
  steps: StepResult[];
  /** Total generation time in seconds */
  totalDuration: string;
  /** Total CTA buttons wired across all pages */
  totalCtasInjected: number;
  /** Errors encountered */
  errors: string[];
}

/** Union type for API config — supports both template and block generators. */
export type FunnelApiConfig = TemplateGeneratorConfig & {
  /** Additional keys for block mode round-robin */
  allKeys?: string[];
};

// ─── Internal: Normalized variant (always has all fields resolved) ──────────────

interface NormalizedVariant {
  id: string;
  name: string;
  mode: 'template' | 'block';
  templateId?: string;
  pageType?: PageType;
  palette: PaletteKey;
  briefOverrides: Record<string, any>;
  otoPosition?: number;
  trafficWeight: number;
}

/**
 * Normalize a FunnelStep into an array of NormalizedVariant[].
 * WHY: Backward compatible — if no variants[], creates one from legacy templateId.
 */
function normalizeVariants(step: FunnelStep): NormalizedVariant[] {
  if (step.variants && step.variants.length > 0) {
    return step.variants.map(v => ({
      id: v.id,
      name: v.name,
      mode: v.mode,
      templateId: v.templateId,
      pageType: v.pageType,
      palette: v.palette ?? 'emerald' as PaletteKey,
      briefOverrides: v.briefOverrides ?? {},
      otoPosition: v.otoPosition,
      trafficWeight: v.trafficWeight,
    }));
  }

  // Legacy fallback: single variant from templateId
  if (!step.templateId) {
    throw new Error(`Step "${step.id}" has neither variants[] nor templateId`);
  }

  return [{
    id: 'a',
    name: step.templateId,
    mode: 'template',
    templateId: step.templateId,
    palette: 'emerald' as PaletteKey,
    briefOverrides: step.briefOverrides ?? {},
    otoPosition: step.otoPosition,
    trafficWeight: 100,
  }];
}

// ─── Main Entry Point ───────────────────────────────────────────────────────────

/**
 * Generate a complete funnel: all pages + variants + CTA wiring + routers.
 *
 * FLOW:
 *   1. Create output directory
 *   2. For each step → for each variant → generate HTML (template or block mode)
 *   3. Build URL map from generated pages
 *   4. Inject CTA URLs into each variant
 *   5. Generate router HTML for steps with 2+ variants
 *   6. Return FunnelResult with all paths + stats
 */
export async function generateFunnel(
  config: FunnelConfig,
  apiConfig: FunnelApiConfig
): Promise<FunnelResult> {
  const startTime = Date.now();
  const stepResults: StepResult[] = [];
  const errors: string[] = [];

  // stepId → Map<variantId, { tempPath, outputPath, url }>
  const generatedFiles: Map<string, Map<string, { tempPath: string; outputPath: string; url: string }>> = new Map();
  // stepId → final URL (router URL if 2+ variants, variant URL if 1 variant)
  const stepUrls: Map<string, string> = new Map();

  // ─── Step 0: Create output directory ────────────────────────────────────────

  if (!fs.existsSync(config.outputDir)) {
    fs.mkdirSync(config.outputDir, { recursive: true });
  }

  // ─── Step 1: Generate all pages for all variants ────────────────────────────

  console.log(`\n[funnel] Starting funnel generation with ${config.steps.length} steps`);

  for (const step of config.steps) {
    const variants = normalizeVariants(step);
    const stepFiles: Map<string, { tempPath: string; outputPath: string; url: string }> = new Map();

    console.log(`\n[funnel] Step "${step.id}" — ${variants.length} variant(s)`);

    const variantResults: VariantResult[] = [];

    for (const variant of variants) {
      const label = variants.length > 1 ? ` variant "${variant.id}" (${variant.name})` : '';
      console.log(`[funnel]   Generating${label}: mode=${variant.mode}`);

      try {
        const mergedBrief = mergeBrief(config.product, variant.briefOverrides, variant.otoPosition);

        let outputPath: string;

        if (variant.mode === 'template') {
          // ── Template mode: use template-generator ──
          if (!variant.templateId) throw new Error(`Variant "${variant.id}" has mode='template' but no templateId`);
          const genResult = await generateFromTemplate(
            variant.templateId,
            mergedBrief,
            apiConfig,
            config.outputDir
          );

          if (!genResult.success || !genResult.outputPath) {
            throw new Error(genResult.error ?? 'Template generation failed');
          }

          outputPath = genResult.outputPath;
          console.log(`[funnel]   ✓ Template generated: ${outputPath} (${genResult.slotsFilled} slots)`);

        } else {
          // ── Block mode: use page-generator ──
          if (!variant.pageType) throw new Error(`Variant "${variant.id}" has mode='block' but no pageType`);
          const blockResult: GeneratePageResult = await generatePage(
            {
              pageType: variant.pageType,
              palette: variant.palette,
              product: {
                name: mergedBrief.name,
                description: mergedBrief.description,
                price: mergedBrief.price,
                originalPrice: mergedBrief.originalPrice,
                niche: mergedBrief.niche,
                targetAudience: mergedBrief.targetAudience,
                benefits: mergedBrief.benefits,
                guarantee: mergedBrief.guarantee,
              },
            },
            {
              apiUrl: apiConfig.apiUrl,
              apiKey: apiConfig.apiKey,
              model: apiConfig.model,
              temperature: apiConfig.temperature ?? 0.3,
              maxTokens: apiConfig.maxTokens ?? 16384,
              maxRetries: apiConfig.maxRetries ?? 2,
              allKeys: apiConfig.allKeys,
            }
          );

          if (!blockResult.success || !blockResult.html) {
            throw new Error(blockResult.error ?? 'Block generation failed');
          }

          // Save block-generated HTML to temp file
          const tempFile = `_${step.id}-${variant.id}-${Date.now()}.html`;
          outputPath = path.join(config.outputDir, tempFile);
          fs.writeFileSync(outputPath, blockResult.html, 'utf-8');
          console.log(`[funnel]   ✓ Block generated: ${outputPath} (${blockResult.meta.durationMs}ms)`);
        }

        // Build filename and URL for this variant
        const baseName = step.outputFilename.replace(/\.html$/, '');
        const variantSuffix = variants.length > 1 ? `-${variant.id}` : '';
        const finalFilename = `${baseName}${variantSuffix}.html`;
        const finalPath = path.join(config.outputDir, finalFilename);
        const url = config.baseUrl === '.'
          ? finalFilename
          : `${config.baseUrl}/${finalFilename}`;

        stepFiles.set(variant.id, { tempPath: outputPath, outputPath: finalPath, url });

      } catch (err) {
        const msg = `Step "${step.id}" variant "${variant.id}" failed: ${err instanceof Error ? err.message : String(err)}`;
        console.error(`[funnel]   ✗ ${msg}`);
        errors.push(msg);
        variantResults.push({
          variantId: variant.id,
          outputPath: '',
          url: '',
          ctasInjected: 0,
          success: false,
          error: msg,
        });
      }
    }

    // Determine step URL (router if 2+ variants, direct if 1)
    if (stepFiles.size === 1) {
      const sole = stepFiles.values().next().value!;
      stepUrls.set(step.id, sole.url);
    } else if (stepFiles.size > 1) {
      // Router URL
      const baseName = step.outputFilename;
      const routerUrl = config.baseUrl === '.' ? baseName : `${config.baseUrl}/${baseName}`;
      stepUrls.set(step.id, routerUrl);
    }

    generatedFiles.set(step.id, stepFiles);
    stepResults.push({
      stepId: step.id,
      variants: variantResults,
      success: variantResults.length === 0 || variantResults.some(v => v.success),
    });
  }

  // ─── Step 2: Inject CTA URLs + rename to final filenames ────────────────────

  console.log(`\n[funnel] Injecting CTA URLs...`);

  for (let i = 0; i < config.steps.length; i++) {
    const step = config.steps[i];
    const stepFiles = generatedFiles.get(step.id);
    if (!stepFiles) continue;

    const variants = normalizeVariants(step);
    const stepResult = stepResults[i];

    for (const variant of variants) {
      const fileInfo = stepFiles.get(variant.id);
      if (!fileInfo) continue;

      try {
        // Read generated HTML
        let html = fs.readFileSync(fileInfo.tempPath, 'utf-8');

        // Build CTA mapping — CTAs point to the NEXT STEP's URL (router if multi-variant)
        const ctaMap = buildCtaMapping(step, stepUrls);

        // Determine templateId for CTA injection
        // WHY: cta-injector uses templateId to detect page type and apply correct injection pattern.
        //      Block mode pages use pageType as identifier instead.
        const injectId = variant.mode === 'template'
          ? (variant.templateId ?? '')
          : (variant.pageType ?? '');

        const { html: injectedHtml, ctasInjected } = injectCtaUrls(html, ctaMap, injectId);

        // Save to final filename
        fs.writeFileSync(fileInfo.outputPath, injectedHtml, 'utf-8');

        // Remove temp file if different
        if (fileInfo.tempPath !== fileInfo.outputPath) {
          try { fs.unlinkSync(fileInfo.tempPath); } catch { /* cleanup ok to fail */ }
        }

        // Update variant result
        const existingVr = stepResult.variants.find(v => v.variantId === variant.id);
        if (existingVr) {
          existingVr.outputPath = fileInfo.outputPath;
          existingVr.url = fileInfo.url;
          existingVr.ctasInjected = ctasInjected;
          existingVr.success = true;
          existingVr.error = undefined;
        } else {
          stepResult.variants.push({
            variantId: variant.id,
            outputPath: fileInfo.outputPath,
            url: fileInfo.url,
            ctasInjected,
            success: true,
          });
        }

        console.log(`[funnel]   ✓ ${step.id}/${variant.id}: ${ctasInjected} CTAs → ${fileInfo.outputPath}`);

      } catch (err) {
        const msg = `CTA injection for ${step.id}/${variant.id} failed: ${err instanceof Error ? err.message : String(err)}`;
        console.error(`[funnel]   ✗ ${msg}`);
        errors.push(msg);

        // WHY: Must reset success=false when CTA injection fails, otherwise stale success=true from earlier
        const existingVr = stepResult.variants.find(v => v.variantId === variant.id);
        if (existingVr) {
          existingVr.success = false;
          existingVr.error = msg;
        }
      }
    }
  }

  // ─── Step 3: Generate router HTML for multi-variant steps ────────────────────

  for (let i = 0; i < config.steps.length; i++) {
    const step = config.steps[i];
    const variants = normalizeVariants(step);
    if (variants.length < 2) continue;

    const stepFiles = generatedFiles.get(step.id);
    if (!stepFiles) continue;

    const routerFilename = step.outputFilename;
    const routerPath = path.join(config.outputDir, routerFilename);

    const variantEntries = variants.map(v => {
      const fileInfo = stepFiles.get(v.id);
      return {
        id: v.id,
        file: fileInfo ? path.basename(fileInfo.outputPath) : '',
        weight: v.trafficWeight,
      };
    }).filter(e => e.file);

    const routerHtml = generateVariantRouter(step.id, variantEntries);
    fs.writeFileSync(routerPath, routerHtml, 'utf-8');

    stepResults[i].routerPath = routerPath;
    console.log(`[funnel]   ✓ Router: ${routerPath} (${variantEntries.length} variants)`);
  }

  // ─── Step 4: Save funnel manifest ───────────────────────────────────────────

  const totalCtas = stepResults.reduce((sum, sr) =>
    sum + sr.variants.reduce((vSum, v) => vSum + v.ctasInjected, 0), 0);

  const manifest = {
    generatedAt: new Date().toISOString(),
    totalSteps: config.steps.length,
    successfulSteps: stepResults.filter(r => r.success).length,
    totalCtasInjected: totalCtas,
    steps: stepResults.map(sr => ({
      stepId: sr.stepId,
      router: sr.routerPath ? path.basename(sr.routerPath) : null,
      variants: sr.variants.map(v => ({
        id: v.variantId,
        file: v.outputPath ? path.basename(v.outputPath) : '',
        url: v.url,
        ctasInjected: v.ctasInjected,
        success: v.success,
        error: v.error,
      })),
      success: sr.success,
    })),
    errors,
  };

  const manifestPath = path.join(config.outputDir, 'funnel-manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');

  const duration = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log(`\n[funnel] Complete: ${stepResults.filter(r => r.success).length}/${config.steps.length} steps, ${totalCtas} CTAs in ${duration}s`);
  console.log(`[funnel] Manifest: ${manifestPath}`);

  // ─── Step 5: Auto-deploy to production Router (optional) ────────────────────

  if (config.deploy) {
    console.log(`\n[funnel] Deploying to production...`);
    try {
      await deployFunnelToRouter(config, stepResults);
    } catch (deployErr) {
      const msg = `Deploy failed: ${deployErr instanceof Error ? deployErr.message : String(deployErr)}`;
      console.error(`[funnel] ✗ ${msg}`);
      errors.push(msg);
    }
  }

  return {
    success: errors.length === 0,
    steps: stepResults,
    totalDuration: duration,
    totalCtasInjected: totalCtas,
    errors,
  };
}

// ─── Helpers ────────────────────────────────────────────────────────────────────

/**
 * HTTP request helper using Node.js http module.
 * WHY: Node.js fetch() (undici) ignores custom Host headers, causing Traefik 404.
 *      The http module properly sends the Host header for virtual host routing.
 */
function httpRequest(options: {
  hostname: string;
  port: string | number;
  path: string;
  method: string;
  headers: Record<string, string>;
  body: string;
}): Promise<{ status: number; body: string }> {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk: string) => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode ?? 0, body: data }));
    });
    req.on('error', reject);
    req.write(options.body);
    req.end();
  });
}

/**
 * Deploy generated funnel HTML to production Router via /deploy/batch.
 * WHY: After generating pages locally, we send them to the Router's deploy endpoint.
 *      Bypasses Cloudflare by hitting Traefik directly with Host header.
 *      This eliminates the manual deploy step.
 */
async function deployFunnelToRouter(
  config: FunnelConfig,
  stepResults: StepResult[],
): Promise<void> {
  const deploy = config.deploy!;
  const files: Array<{ filename: string; html: string }> = [];

  // Collect all successfully generated HTML files
  for (const step of stepResults) {
    for (const variant of step.variants) {
      if (!variant.success || !variant.outputPath) continue;
      const filename = path.basename(variant.outputPath);
      const html = fs.readFileSync(variant.outputPath, 'utf-8');
      files.push({ filename, html });
    }
  }

  if (files.length === 0) {
    console.log('[funnel] No files to deploy');
    return;
  }

  const payload = JSON.stringify({ slug: deploy.slug, files });
  console.log(`[funnel] Deploying ${files.length} pages (${(payload.length / 1024 / 1024).toFixed(2)} MB) to ${deploy.slug}.${deploy.routerHost}...`);

  // WHY: Node.js fetch() (undici) ignores custom Host headers, causing Traefik 404.
  //      We use http.request() which properly sends the Host header for Traefik routing.
  const url = new URL(deploy.routerUrl);
  const result = await httpRequest({
    hostname: url.hostname,
    port: url.port || 80,
    path: '/deploy/batch',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': String(Buffer.byteLength(payload)),
      'Host': deploy.routerHost,
      'X-Deploy-Key': deploy.deployKey,
    },
    body: payload,
  });

  if (result.status !== 200) {
    throw new Error(`Router deploy ${result.status}: ${result.body.substring(0, 200)}`);
  }

  const deployResult = JSON.parse(result.body) as { deployed: number; total: number; success: boolean };
  console.log(`[funnel] ✓ Deployed ${deployResult.deployed}/${deployResult.total} pages to production`);

  // Deploy router pages too (for A/B steps)
  for (const step of stepResults) {
    if (!step.routerPath) continue;
    const filename = path.basename(step.routerPath);
    const html = fs.readFileSync(step.routerPath, 'utf-8');
    const routerPayload = JSON.stringify({ slug: deploy.slug, filename, html });

    const routerResult = await httpRequest({
      hostname: url.hostname,
      port: url.port || 80,
      path: '/deploy',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': String(Buffer.byteLength(routerPayload)),
        'Host': deploy.routerHost,
        'X-Deploy-Key': deploy.deployKey,
      },
      body: routerPayload,
    });

    if (routerResult.status !== 200) {
      console.error(`[funnel] ✗ Router page deploy failed: ${routerResult.body.substring(0, 100)}`);
    } else {
      console.log(`[funnel] ✓ Router deployed: ${filename}`);
    }
  }
}

/**
 * Merge base product brief with step-specific overrides.
 * WHY: Upsell pages need different product names, prices, images than the base product.
 */
function mergeBrief(base: ProductBrief, overrides: Record<string, any>, otoPosition?: number): ProductBrief {
  const merged = { ...base };

  for (const [key, value] of Object.entries(overrides)) {
    (merged as any)[key] = value;
  }

  if (otoPosition !== undefined) {
    (merged as any).otoPosition = otoPosition;
  }

  return merged;
}

/**
 * Build CTA URL mapping for a funnel step.
 * WHY: Each step needs to know where its primary/decline CTAs point.
 *      Resolves step IDs to actual URLs (router URL for multi-variant steps).
 */
function buildCtaMapping(step: FunnelStep, stepUrls: Map<string, string>): CtaMapping {
  const primaryUrl = step.nextOnAccept ? (stepUrls.get(step.nextOnAccept) ?? '#') : '#';
  const declineUrl = step.nextOnDecline ? (stepUrls.get(step.nextOnDecline) ?? '#') : undefined;

  const ctaMap: CtaMapping = {
    primary: primaryUrl,
    decline: declineUrl,
  };

  // Thank you page: wire survey, community, continue buttons
  const isThankYou = step.variants?.some(v => v.templateId?.includes('thank-you')) ??
                     (step.templateId?.includes('thank-you') ?? false);

  if (isThankYou) {
    const entryUrl = stepUrls.get('entry') ?? '#';
    ctaMap.continue = entryUrl;
  }

  return ctaMap;
}
