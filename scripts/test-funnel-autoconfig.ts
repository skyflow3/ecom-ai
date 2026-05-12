/**
 * Purpose: Test auto-config prompt — AI generates a FunnelConfig from a product brief,
 *          then generateFunnel() executes it.
 *
 * Run: npx tsx scripts/test-funnel-autoconfig.ts
 *
 * FLOW:
 *   1. Define a product brief
 *   2. Call buildFunnelConfigPrompt() → get system + user prompt
 *   3. Send to DeepSeek LLM → parse FunnelConfig JSON
 *   4. Pass to generateFunnel() → generate all pages
 *   5. Validate results
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

import { buildFunnelConfigPrompt } from '../src/agents/prompts/funnel-filler';
import { generateFunnel, type FunnelConfig } from '../src/services/funnel-generator';
import type { ProductBrief } from '../src/agents/prompts/template-filler';

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

// ─── API Config ────────────────────────────────────────────────────────────────

function getApiConfig() {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    console.error('ERROR: DEEPSEEK_API_KEY not found in .env');
    process.exit(1);
  }

  return {
    apiUrl: process.env.DEEPSEEK_API_URL ?? 'https://api.deepseek.com/v1/chat/completions',
    apiKey,
    model: process.env.DEEPSEEK_MODEL ?? 'deepseek-chat',
    temperature: 0.3,
    maxTokens: 16384,
    maxRetries: 3,
  };
}

// ─── LLM Call Helper ───────────────────────────────────────────────────────────

async function callLlm(
  system: string,
  user: string,
  apiConfig: ReturnType<typeof getApiConfig>,
): Promise<string> {
  const body = {
    model: apiConfig.model,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
    temperature: 0.3,
    max_tokens: 16384,
  };

  console.log(`[autoconfig] Calling ${apiConfig.model}...`);

  const response = await fetch(apiConfig.apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiConfig.apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`LLM API error ${response.status}: ${text}`);
  }

  const data = await response.json() as any;
  const content = data.choices?.[0]?.message?.content ?? '';

  console.log(`[autoconfig] Response received (${content.length} chars, ${data.usage?.total_tokens ?? '?'} tokens)`);

  return content;
}

// ─── Parse FunnelConfig from LLM response ───────────────────────────────────────

function parseFunnelConfig(raw: string, outputDir: string): FunnelConfig {
  // Strip markdown code fences if present
  let cleaned = raw.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
  }

  // Try to find JSON object
  const jsonStart = cleaned.indexOf('{');
  const jsonEnd = cleaned.lastIndexOf('}');
  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error('No JSON object found in LLM response');
  }

  cleaned = cleaned.substring(jsonStart, jsonEnd + 1);

  let parsed: any;
  try {
    parsed = JSON.parse(cleaned);
  } catch (e) {
    // Try fixing common JSON issues (trailing commas, comments)
    cleaned = cleaned
      .replace(/,\s*([}\]])/g, '$1')  // trailing commas
      .replace(/\/\/.*$/gm, '');       // single-line comments
    parsed = JSON.parse(cleaned);
  }

  // Validate minimum required structure
  if (!parsed.steps || !Array.isArray(parsed.steps)) {
    throw new Error('Parsed JSON missing "steps" array');
  }

  // Inject outputDir and ensure baseUrl
  parsed.outputDir = outputDir;
  if (!parsed.baseUrl) parsed.baseUrl = '.';
  if (!parsed.product) parsed.product = PRODUCT;

  console.log(`[autoconfig] Parsed FunnelConfig: ${parsed.steps.length} steps`);
  for (const step of parsed.steps) {
    const variantCount = step.variants?.length ?? 1;
    const mode = step.variants?.[0]?.mode ?? step.templateId ? 'template' : 'unknown';
    console.log(`[autoconfig]   Step "${step.id}": ${variantCount} variant(s), mode=${mode}`);
  }

  return parsed as FunnelConfig;
}

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('=== AUTO-CONFIG FUNNEL TEST ===\n');
  console.log('Product:', PRODUCT.name);
  console.log('Niche:', PRODUCT.niche);
  console.log('Price:', PRODUCT.price, '(was', PRODUCT.originalPrice + ')');
  console.log();

  const apiConfig = getApiConfig();
  const outputDir = path.join(process.cwd(), 'test-output', `autoconfig-${Date.now()}`);

  // ── Step 1: Generate FunnelConfig via AI ─────────────────────────────────────
  console.log('── STEP 1: AI generates FunnelConfig ──\n');

  const { system, user } = buildFunnelConfigPrompt(PRODUCT);

  // Save prompt for debugging
  const promptDir = path.join(outputDir, '_prompts');
  if (!fs.existsSync(promptDir)) fs.mkdirSync(promptDir, { recursive: true });
  fs.writeFileSync(path.join(promptDir, 'system.txt'), system, 'utf-8');
  fs.writeFileSync(path.join(promptDir, 'user.txt'), user, 'utf-8');

  const rawResponse = await callLlm(system, user, apiConfig);

  // Save raw response
  fs.writeFileSync(path.join(promptDir, 'raw-response.txt'), rawResponse, 'utf-8');

  // ── Step 2: Parse FunnelConfig ───────────────────────────────────────────────
  console.log('\n── STEP 2: Parse FunnelConfig ──\n');

  let funnelConfig: FunnelConfig;
  try {
    funnelConfig = parseFunnelConfig(rawResponse, outputDir);
  } catch (err) {
    console.error('FAILED to parse FunnelConfig from AI response:');
    console.error(err instanceof Error ? err.message : err);
    console.error('\nRaw response saved to:', path.join(promptDir, 'raw-response.txt'));
    process.exit(1);
  }

  // Save parsed config
  fs.writeFileSync(
    path.join(outputDir, 'funnel-config.json'),
    JSON.stringify(funnelConfig, null, 2),
    'utf-8',
  );

  // ── Step 3: Generate funnel ─────────────────────────────────────────────────
  console.log('\n── STEP 3: Generate funnel from AI config ──\n');

  const result = await generateFunnel(funnelConfig, apiConfig);

  // ── Step 4: Report results ───────────────────────────────────────────────────
  console.log('\n=== RESULTS ===');
  console.log(`Success: ${result.success}`);
  console.log(`Duration: ${result.totalDuration}s`);
  console.log(`Total CTAs: ${result.totalCtasInjected}`);
  console.log(`Errors: ${result.errors.length}`);

  for (const step of result.steps) {
    console.log(`\n  Step: ${step.stepId} ${step.success ? '✓' : '✗'}`);
    if (step.routerPath) {
      console.log(`    Router: ${path.basename(step.routerPath)}`);
    }
    for (const v of step.variants) {
      console.log(`    variant ${v.variantId}: ${v.success ? '✓' : '✗'} ${path.basename(v.outputPath || '?')} (${v.ctasInjected} CTAs)`);
      if (v.error) console.log(`      Error: ${v.error}`);
    }
  }

  // ── Step 5: Validation ──────────────────────────────────────────────────────
  console.log('\n=== VALIDATION ===');

  const checks: Array<{ name: string; pass: boolean; detail: string }> = [];

  // Check 1: All steps succeeded
  const allStepsOk = result.steps.every(s => s.success);
  checks.push({ name: 'All steps succeeded', pass: allStepsOk, detail: `${result.steps.filter(s => s.success).length}/${result.steps.length}` });

  // Check 2: Entry page has variants
  const entryStep = result.steps.find(s => s.stepId === 'entry');
  const hasVariants = entryStep && entryStep.variants.length >= 2;
  checks.push({ name: 'Entry has A/B variants', pass: !!hasVariants, detail: `${entryStep?.variants.length ?? 0} variants` });

  // Check 3: Router generated for multi-variant steps
  const hasRouter = entryStep?.routerPath;
  checks.push({ name: 'Router page generated', pass: !!hasRouter, detail: hasRouter ? path.basename(hasRouter) : 'none' });

  // Check 4: CTAs wired
  checks.push({ name: 'CTAs injected', pass: result.totalCtasInjected > 0, detail: `${result.totalCtasInjected} total` });

  // Check 5: Upsell steps exist
  const upsellSteps = result.steps.filter(s => s.stepId.startsWith('oto'));
  checks.push({ name: 'Upsell steps present', pass: upsellSteps.length >= 1, detail: `${upsellSteps.length} upsell(s)` });

  // Check 6: Thank you page exists
  const thankyouStep = result.steps.find(s => s.stepId === 'thankyou' || s.stepId === 'thank-you');
  checks.push({ name: 'Thank you page', pass: !!thankyouStep, detail: thankyouStep ? 'present' : 'missing' });

  // Check 7: All files exist on disk
  const allFilesExist = result.steps.every(s =>
    s.variants.every(v => !v.success || (v.outputPath && fs.existsSync(v.outputPath)))
  );
  checks.push({ name: 'All files on disk', pass: allFilesExist, detail: '' });

  // Check 8: HTML valid (basic check)
  let htmlValid = true;
  for (const step of result.steps) {
    for (const v of step.variants) {
      if (!v.success || !v.outputPath) continue;
      const html = fs.readFileSync(v.outputPath, 'utf-8');
      if (!html.includes('</html>')) {
        htmlValid = false;
      }
    }
  }
  checks.push({ name: 'HTML structure valid', pass: htmlValid, detail: '' });

  for (const check of checks) {
    console.log(`  ${check.pass ? '✓' : '✗'} ${check.name}${check.detail ? ` (${check.detail})` : ''}`);
  }

  const passCount = checks.filter(c => c.pass).length;
  console.log(`\n  Score: ${passCount}/${checks.length} checks passed`);

  // Save validation results
  fs.writeFileSync(
    path.join(outputDir, 'validation.json'),
    JSON.stringify({ checks, score: `${passCount}/${checks.length}`, success: result.success }, null, 2),
    'utf-8',
  );

  console.log(`\n=== DONE ===`);
  console.log(`Output: ${outputDir}`);
  console.log(`Config: ${path.join(outputDir, 'funnel-config.json')}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
