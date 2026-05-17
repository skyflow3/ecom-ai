/**
 * Purpose: Full autonomous pipeline — Product Brief → HTML Advertorial.
 *          Chains ALL 5 steps: Scanner → Research → Angle → Copywriter → Template.
 *
 * Run:
 *   npx tsx scripts/test-full-pipeline.ts                      # DeepSeek (all steps)
 *   npx tsx scripts/test-full-pipeline.ts --model mimo         # MiMo (free)
 *   npx tsx scripts/test-full-pipeline.ts --skip-agents        # Skip agent steps, use cached results
 *   npx tsx scripts/test-full-pipeline.ts --template hike-reasons-why  # Use listicle template
 *
 * Output: test-output/full-pipeline/
 *   - scanner_output.json, research_output.json, angle_output.json (agent results)
 *   - advertorial.html (final HTML output)
 *   - pipeline_summary.json (full metadata)
 *
 * WHY: This is the HOLY GRAIL — one product brief in, one complete advertorial out.
 *      The agents discover the optimal angle, the copywriter writes with that angle,
 *      the template engine produces 99.9% fidelity HTML.
 */

import * as fs from 'fs';
import * as path from 'path';

// Load .env
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

import { buildScannerPrompt, type ScannerOutput } from '../src/agents/prompts/agent-scanner';
import { buildResearchPrompt, type ResearchOutput } from '../src/agents/prompts/agent-research';
import { buildAnglePrompt, type AngleOutput, type MarketingAngle } from '../src/agents/prompts/agent-angle';
import { generateFromTemplate, type TemplateGenerateResult } from '../src/services/template-generator';
import type { ProductBrief } from '../src/agents/prompts/template-filler';

// ─── Config ──────────────────────────────────────────────────────────────────

interface LlmConfig {
  apiUrl: string;
  apiKey: string;
  model: string;
  temperature: number;
}

function getModelConfig(model: string): LlmConfig {
  if (model === 'mimo') {
    const key = process.env.MIMO_API_KEY_5 || process.env.MIMO_API_KEY_6 || process.env.MIMO_API_KEY || '';
    return {
      apiUrl: process.env.MIMO_API_URL ?? 'https://api.xiaomimimo.com/v1/chat/completions',
      apiKey: key,
      model: 'mimo-v2-flash',
      temperature: 0.3,
    };
  }
  return {
    apiUrl: process.env.DEEPSEEK_API_URL ?? 'https://api.deepseek.com/v1/chat/completions',
    apiKey: process.env.DEEPSEEK_API_KEY ?? '',
    model: process.env.DEEPSEEK_MODEL ?? 'deepseek-chat',
    temperature: 0.3,
  };
}

// ─── Product Input ────────────────────────────────────────────────────────────

/** The ONLY thing you need to provide. Everything else is discovered by agents. */
interface ProductInput {
  category: string;
  description: string;
  name: string;
  competitors: string[];
  price: string;
  originalPrice: string;
  guarantee: string;
  /** Template to use for final HTML generation */
  templateId: string;
}

const DEFAULT_PRODUCT: ProductInput = {
  category: 'Health & Wellness — Joint Pain Supplements',
  description: 'Premium turmeric curcumin supplement with black pepper extract (BioPerine) for joint pain relief, inflammation reduction, and mobility support. Targets adults 40-65 experiencing chronic joint discomfort.',
  name: 'Nutrovia Turmeric Curcumin',
  competitors: ['Vimerson Health Turmeric', "Nature's Nutrition Turmeric", 'Qunol Turmeric'],
  price: '$49',
  originalPrice: '$119',
  guarantee: '90-Day Money-Back Guarantee',
  templateId: 'smoothspire-advertorial',
};

// ─── Output Directory ─────────────────────────────────────────────────────────

const OUTPUT_DIR = path.join(process.cwd(), 'test-output', 'full-pipeline');

function ensureDir() {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function saveJson(filename: string, data: unknown) {
  fs.writeFileSync(path.join(OUTPUT_DIR, filename), JSON.stringify(data, null, 2), 'utf-8');
}

// ─── LLM Call ─────────────────────────────────────────────────────────────────

async function callLlm(config: LlmConfig, system: string, user: string): Promise<{ text: string; tokens: number; durationMs: number }> {
  const isXiaomimimo = config.apiUrl.includes('xiaomimimo');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (isXiaomimimo) headers['api-key'] = config.apiKey;
  else headers['Authorization'] = `Bearer ${config.apiKey}`;

  const payload = {
    model: config.model,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
    temperature: config.temperature,
  };

  const start = Date.now();
  const response = await fetch(config.apiUrl, { method: 'POST', headers, body: JSON.stringify(payload) });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`API error ${response.status}: ${body.substring(0, 300)}`);
  }
  const data = await response.json();
  return {
    text: data.choices?.[0]?.message?.content ?? '',
    tokens: (data.usage?.prompt_tokens ?? 0) + (data.usage?.completion_tokens ?? 0),
    durationMs: Date.now() - start,
  };
}

function extractJson(text: string): string | null {
  let s = text.trim();
  if (s.startsWith('```')) {
    s = s.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '').trim();
  }
  if (!s.includes('{')) return null;
  s = s.substring(s.indexOf('{'));
  try { JSON.parse(s); return s; } catch { /* try repair */ }
  // Simple repair: close open brackets
  let inStr = false, esc = false;
  const stack: string[] = [];
  for (const c of s) {
    if (esc) { esc = false; continue; }
    if (c === '\\' && inStr) { esc = true; continue; }
    if (c === '"') { inStr = !inStr; continue; }
    if (inStr) continue;
    if (c === '{' || c === '[') stack.push(c);
    else if (c === '}' && stack[stack.length - 1] === '{') stack.pop();
    else if (c === ']' && stack[stack.length - 1] === '[') stack.pop();
  }
  if (stack.length === 0) return s;
  let repaired = s.trimEnd();
  if (inStr) repaired += '"';
  for (let i = stack.length - 1; i >= 0; i--) repaired += stack[i] === '{' ? '}' : ']';
  try { JSON.parse(repaired); return repaired; } catch { return null; }
}

// ─── Agent Steps ──────────────────────────────────────────────────────────────

async function runScanner(config: LlmConfig, product: ProductInput): Promise<ScannerOutput> {
  console.log('\n[1/5] SCANNER — Discovering market desires...');
  const { system, user } = buildScannerPrompt({
    productCategory: product.category,
    productDescription: product.description,
    productName: product.name,
    competitors: product.competitors,
    searchDepth: 'standard',
  });
  const { text, tokens, durationMs } = await callLlm(config, system, user);
  console.log(`  ${text.length} chars, ${(durationMs / 1000).toFixed(1)}s, ${tokens} tokens`);
  const json = extractJson(text);
  if (!json) throw new Error('Scanner: no JSON in response');
  const data: ScannerOutput = JSON.parse(json);
  saveJson('scanner_output.json', data);
  console.log(`  → ${data.surfaceDesires?.length ?? 0} surface desires, ${data.emotionalDesires?.length ?? 0} emotional desires`);
  return data;
}

async function runResearch(config: LlmConfig, product: ProductInput, scanner: ScannerOutput): Promise<ResearchOutput> {
  console.log('\n[2/5] RESEARCH — Deep avatar profiling + T1 chains...');
  const segment = scanner.naturalSegments?.[0]?.name ?? 'The Frustrated Problem-Solver';
  const { system, user } = buildResearchPrompt({
    productCategory: product.category,
    productDescription: product.description,
    productName: product.name,
    scannerData: scanner,
    targetSegmentName: segment,
    searchDepth: 'standard',
  });
  const { text, tokens, durationMs } = await callLlm(config, system, user);
  console.log(`  ${text.length} chars, ${(durationMs / 1000).toFixed(1)}s, ${tokens} tokens`);
  const json = extractJson(text);
  if (!json) throw new Error('Research: no JSON in response');
  const data: ResearchOutput = JSON.parse(json);
  saveJson('research_output.json', data);
  console.log(`  → ${data.painPoints?.length ?? 0} pain points, ${data.desireMiningChains?.length ?? 0} T1 chains`);
  return data;
}

async function runAngle(config: LlmConfig, product: ProductInput, scanner: ScannerOutput, research: ResearchOutput): Promise<AngleOutput> {
  console.log('\n[3/5] ANGLE — Discovering optimal marketing angle...');
  const { system, user } = buildAnglePrompt({
    productCategory: product.category,
    productDescription: product.description,
    productName: product.name,
    productPrice: product.price,
    scannerData: scanner,
    researchData: research,
  });
  const { text, tokens, durationMs } = await callLlm(config, system, user);
  console.log(`  ${text.length} chars, ${(durationMs / 1000).toFixed(1)}s, ${tokens} tokens`);
  const json = extractJson(text);
  if (!json) throw new Error('Angle: no JSON in response');
  const data: AngleOutput = JSON.parse(json);
  saveJson('angle_output.json', data);
  const recommended = data.angles?.find(a => a.id === data.recommendedAngleId) ?? data.angles?.[0];
  console.log(`  → ${data.angles?.length ?? 0} angles, recommended: "${recommended?.name ?? 'none'}"`);
  return data;
}

// ─── Angle → ProductBrief Mapping ────────────────────────────────────────────

/**
 * WHY: This is the BRIDGE between agent strategy and copywriter execution.
 *      The agents discover WHAT to say, the copywriter figures out HOW to say it.
 *      We enrich the ProductBrief with angle-specific discoveries:
 *      - mechanismName from oneBelief
 *      - description enriched with emotionalEngine + massDesire
 *      - benefits from belief shifts + pain points
 *      - targetAudience from scanner segment
 */
function angleToBrief(product: ProductInput, scanner: ScannerOutput, research: ResearchOutput, angle: AngleOutput): ProductBrief {
  const recommended = angle.angles?.find(a => a.id === angle.recommendedAngleId) ?? angle.angles?.[0];

  // Extract mechanism name from oneBelief: "[New Opportunity] is the key to [Desire] through [New Mechanism]"
  const oneBelief = recommended?.oneBelief ?? '';
  const mechanismMatch = oneBelief.match(/through\s+(.+)$/i);
  const mechanismName = mechanismMatch?.[1] ?? recommended?.umpUmsPair?.ums ?? product.description.split('.')[0];

  // Enrich description with emotional engine and mass desire
  const emotionalEngine = recommended?.emotionalEngine ?? '';
  const massDesire = recommended?.massDesire ?? '';
  const enrichedDescription = `${product.description} ANGLE: ${emotionalEngine}. Core desire: ${massDesire}.`;

  // Build benefits from belief shifts + top pain points
  const beliefBenefits = recommended?.beliefShiftChain?.map(b => b.desiredState ?? b.belief) ?? [];
  const painBenefits = research.painPoints?.slice(0, 3).map(p => `Overcome: ${p.statement}`) ?? [];
  const allBenefits = [...product.description.split('.').filter(s => s.trim()), ...beliefBenefits.slice(0, 2), ...painBenefits.slice(0, 2)].map(s => s.trim()).filter(Boolean);

  // Target audience from scanner segment
  const segment = scanner.naturalSegments?.[0];
  const targetAudience = segment
    ? `${segment.name} — ${segment.behavioralIndicators?.slice(0, 2).join(', ') ?? product.category}`
    : product.category;

  // Copywriting gold from T1 chains
  const t1Gold = research.desireMiningChains?.flatMap(c => [c.copywritingGold, c.rootDriver]).filter(Boolean) ?? [];
  const agentContext = t1Gold.length > 0
    ? `\n\nAGENT DISCOVERIES (use these to guide copy tone):\n${t1Gold.slice(0, 4).map(g => `- ${g}`).join('\n')}`
    : '';

  return {
    name: product.name,
    description: enrichedDescription + agentContext,
    niche: product.category,
    targetAudience,
    benefits: allBenefits.length > 0 ? allBenefits : ['Relief from chronic discomfort', 'Restored mobility and freedom', 'Natural, drug-free solution'],
    price: product.price,
    originalPrice: product.originalPrice,
    discountPct: `${Math.round((1 - parseFloat(product.price.replace(/[^0-9.]/g, '')) / parseFloat(product.originalPrice.replace(/[^0-9.]/g, ''))) * 100)}%`,
    guarantee: product.guarantee,
    mechanismName,
    authorPersona: 'Dr. James Miller, PT, MD',
    categoryBadge: 'Health',
    ratingCount: `${3000 + Math.floor(Math.random() * 5000)}`,
  };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const modelIdx = args.indexOf('--model');
  const skipAgents = args.includes('--skip-agents');
  const templateIdx = args.indexOf('--template');

  const model = modelIdx >= 0 ? args[modelIdx + 1] : 'deepseek';
  const templateId = templateIdx >= 0 ? args[templateIdx + 1] : DEFAULT_PRODUCT.templateId;

  console.log('═'.repeat(60));
  console.log('FULL AUTONOMOUS PIPELINE');
  console.log('═'.repeat(60));
  console.log(`Model: ${model} | Template: ${templateId} | Skip agents: ${skipAgents}`);

  ensureDir();
  const config = getModelConfig(model);
  if (!config.apiKey) {
    console.error(`ERROR: No API key for ${model}. Check .env`);
    process.exit(1);
  }

  const product = DEFAULT_PRODUCT;
  const timings: Record<string, number> = {};
  const totalStart = Date.now();

  let scanner: ScannerOutput;
  let research: ResearchOutput;
  let angle: AngleOutput;

  // ── Steps 1-3: Agent Pipeline ──
  if (skipAgents) {
    console.log('\nSkipping agents, loading cached results...');
    scanner = JSON.parse(fs.readFileSync(path.join(OUTPUT_DIR, 'scanner_output.json'), 'utf-8'));
    research = JSON.parse(fs.readFileSync(path.join(OUTPUT_DIR, 'research_output.json'), 'utf-8'));
    angle = JSON.parse(fs.readFileSync(path.join(OUTPUT_DIR, 'angle_output.json'), 'utf-8'));
    console.log('  Loaded cached agent outputs');
  } else {
    scanner = await runScanner(config, product);
    timings.scanner = Date.now() - totalStart;

    research = await runResearch(config, product, scanner);
    timings.research = Date.now() - totalStart - timings.scanner;

    angle = await runAngle(config, product, scanner, research);
    timings.angle = Date.now() - totalStart - timings.research - timings.scanner;
  }

  // ── Step 4: Angle → ProductBrief Mapping ──
  console.log('\n[4/5] MAPPING — Angle → enriched ProductBrief...');
  const brief = angleToBrief(product, scanner, research, angle);
  saveJson('enriched_brief.json', brief);
  console.log(`  mechanismName: "${brief.mechanismName}"`);
  console.log(`  benefits: ${brief.benefits.length} items`);
  console.log(`  targetAudience: "${brief.targetAudience.substring(0, 60)}..."`);

  // ── Step 5: Template Generation ──
  console.log('\n[5/5] TEMPLATE — Generating HTML advertorial...');
  const templateStart = Date.now();

  const templateConfig = {
    apiUrl: config.apiUrl,
    apiKey: config.apiKey,
    model: config.model,
    temperature: 0.5,
    maxRetries: 2,
  };

  const result: TemplateGenerateResult = await generateFromTemplate(templateId, brief, templateConfig, OUTPUT_DIR);
  timings.template = Date.now() - templateStart;

  if (result.success) {
    console.log(`  ✓ HTML generated: ${result.outputPath}`);
    console.log(`  Slots filled: ${result.slotsFilled}/${result.slotsFilled + result.slotsEmpty}`);
    console.log(`  Duration: ${result.duration}`);
    if (result.warnings.length > 0) {
      console.log(`  Warnings: ${result.warnings.join('; ')}`);
    }
  } else {
    console.log(`  ✗ Template generation failed: ${result.error}`);
  }

  // ── Summary ──
  const totalDuration = Date.now() - totalStart;
  const summary = {
    timestamp: new Date().toISOString(),
    product: product.name,
    model,
    templateId,
    skipAgents,
    timings: {
      total: `${(totalDuration / 1000).toFixed(1)}s`,
      ...Object.fromEntries(Object.entries(timings).map(([k, v]) => [k, `${(v / 1000).toFixed(1)}s`])),
    },
    agents: {
      scanner: { desires: scanner.surfaceDesires?.length, emotions: scanner.emotionalDesires?.length },
      research: { painPoints: research.painPoints?.length, t1Chains: research.desireMiningChains?.length },
      angle: { angles: angle.angles?.length, recommended: angle.recommendedAngleId },
    },
    template: {
      success: result.success,
      slotsFilled: result.slotsFilled,
      slotsEmpty: result.slotsEmpty,
    },
  };
  saveJson('pipeline_summary.json', summary);

  console.log('\n' + '═'.repeat(60));
  console.log('PIPELINE COMPLETE');
  console.log('═'.repeat(60));
  console.log(`  Total: ${(totalDuration / 1000).toFixed(1)}s`);
  console.log(`  Template: ${templateId}`);
  console.log(`  Output: ${OUTPUT_DIR}`);
  console.log(`  HTML: ${result.success ? result.outputPath : 'FAILED'}`);
  console.log('═'.repeat(60));
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
