/**
 * Purpose: Test the 3-step agent pipeline (Scanner → Research → Angle).
 *          Chains agent-scanner.ts → agent-research.ts → agent-angle.ts
 *          through DeepSeek (tested) or MiMo (free).
 *
 * Run:
 *   npx tsx scripts/test-agent-pipeline.ts                    # All agents, DeepSeek
 *   npx tsx scripts/test-agent-pipeline.ts --model mimo       # All agents, MiMo (free)
 *   npx tsx scripts/test-agent-pipeline.ts --agent scanner    # Only scanner
 *   npx tsx scripts/test-agent-pipeline.ts --agent research   # Only research (needs scanner output)
 *   npx tsx scripts/test-agent-pipeline.ts --agent angle      # Only angle (needs research output)
 *
 * Output: test-output/agent-pipeline/
 *   - scanner_output.json, research_output.json, angle_output.json
 *   - pipeline_results.json (scores + metadata)
 *   - *_raw.txt (raw LLM responses for debugging)
 *
 * WHY: The agent pipeline was lab-tested at 9.06/10 avg (4 products).
 *      T1 Desire Mining Chain is the champion technique.
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

import { buildScannerPrompt, type ScannerInput, type ScannerOutput } from '../src/agents/prompts/agent-scanner';
import { buildResearchPrompt, type ResearchInput, type ResearchOutput } from '../src/agents/prompts/agent-research';
import { buildAnglePrompt, type AngleInput, type AngleOutput } from '../src/agents/prompts/agent-angle';

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
  // Default: DeepSeek (tested, 9.06/10)
  return {
    apiUrl: process.env.DEEPSEEK_API_URL ?? 'https://api.deepseek.com/v1/chat/completions',
    apiKey: process.env.DEEPSEEK_API_KEY ?? '',
    model: process.env.DEEPSEEK_MODEL ?? 'deepseek-chat',
    temperature: 0.3,
  };
}

// ─── Test Product ─────────────────────────────────────────────────────────────

const TEST_PRODUCT = {
  category: 'Health & Wellness — Joint Pain Supplements',
  description: 'Premium turmeric curcumin supplement with black pepper extract (BioPerine) for joint pain relief, inflammation reduction, and mobility support. Targets adults 40-65 experiencing chronic joint discomfort.',
  name: 'Nutrovia Turmeric Curcumin',
  competitors: ['Vimerson Health Turmeric', "Nature's Nutrition Turmeric", 'Qunol Turmeric'],
  price: '$29.97',
};

// ─── Output Directory ─────────────────────────────────────────────────────────

const OUTPUT_DIR = path.join(process.cwd(), 'test-output', 'agent-pipeline');

function ensureOutputDir() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
}

function saveJson(filename: string, data: unknown) {
  fs.writeFileSync(path.join(OUTPUT_DIR, filename), JSON.stringify(data, null, 2), 'utf-8');
}

function saveRaw(filename: string, text: string) {
  fs.writeFileSync(path.join(OUTPUT_DIR, filename), text, 'utf-8');
}

// ─── LLM Call ─────────────────────────────────────────────────────────────────

async function callLlm(config: LlmConfig, system: string, user: string): Promise<{ text: string; tokens: number; durationMs: number }> {
  const isXiaomimimo = config.apiUrl.includes('xiaomimimo');

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (isXiaomimimo) {
    headers['api-key'] = config.apiKey;
  } else {
    headers['Authorization'] = `Bearer ${config.apiKey}`;
  }

  const payload = {
    model: config.model,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
    temperature: config.temperature,
    // WHY: No max_tokens — let model finish naturally. Truncation = corrupted JSON.
  };

  const start = Date.now();
  const response = await fetch(config.apiUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`API error ${response.status}: ${body.substring(0, 300)}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content ?? '';
  const tokens = (data.usage?.prompt_tokens ?? 0) + (data.usage?.completion_tokens ?? 0);
  const durationMs = Date.now() - start;

  return { text, tokens, durationMs };
}

// ─── JSON Extraction ──────────────────────────────────────────────────────────

function extractJson(text: string): string | null {
  let cleaned = text.trim();

  // Remove markdown code block wrapper
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '');
    cleaned = cleaned.replace(/\n?```\s*$/, '');
    cleaned = cleaned.trim();
  }

  if (!cleaned.includes('{')) return null;

  // Extract from first { to end
  const start = cleaned.indexOf('{');
  let jsonStr = cleaned.substring(start);

  // Try direct parse
  try {
    JSON.parse(jsonStr);
    return jsonStr;
  } catch {
    // Try to repair truncated JSON
    return repairJson(jsonStr);
  }
}

function repairJson(s: string): string | null {
  let inString = false;
  let escapeNext = false;
  const openStack: string[] = [];

  for (const c of s) {
    if (escapeNext) { escapeNext = false; continue; }
    if (c === '\\' && inString) { escapeNext = true; continue; }
    if (c === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (c === '{' || c === '[') openStack.push(c);
    else if (c === '}' && openStack[openStack.length - 1] === '{') openStack.pop();
    else if (c === ']' && openStack[openStack.length - 1] === '[') openStack.pop();
  }

  if (openStack.length === 0) return s;

  let repaired = s.trimEnd();
  if (inString) repaired += '"';

  for (let i = openStack.length - 1; i >= 0; i--) {
    repaired += openStack[i] === '{' ? '}' : ']';
  }

  try {
    JSON.parse(repaired);
    return repaired;
  } catch {
    return null;
  }
}

// ─── Agent Runners ────────────────────────────────────────────────────────────

interface AgentResult {
  status: 'OK' | 'FAIL' | 'PARTIAL';
  tokens?: number;
  durationMs?: number;
  error?: string;
}

async function runScanner(config: LlmConfig): Promise<AgentResult & { data?: ScannerOutput }> {
  console.log('\n' + '='.repeat(60));
  console.log('SCANNER AGENT');
  console.log('='.repeat(60));

  const input: ScannerInput = {
    productCategory: TEST_PRODUCT.category,
    productDescription: TEST_PRODUCT.description,
    productName: TEST_PRODUCT.name,
    competitors: TEST_PRODUCT.competitors,
    searchDepth: 'standard',
  };

  const { system, user } = buildScannerPrompt(input);

  console.log(`  Model: ${config.model}`);
  console.log(`  Product: ${TEST_PRODUCT.name}`);
  console.log('  Calling LLM...');

  try {
    const { text, tokens, durationMs } = await callLlm(config, system, user);
    console.log(`  Response: ${text.length} chars, ${(durationMs / 1000).toFixed(1)}s, ${tokens} tokens`);

    saveRaw('scanner_raw.txt', text);

    const jsonStr = extractJson(text);
    if (!jsonStr) {
      console.log('  FAIL: Could not extract JSON');
      return { status: 'FAIL', error: 'No JSON in response', tokens, durationMs };
    }

    const parsed: ScannerOutput = JSON.parse(jsonStr);
    saveJson('scanner_output.json', parsed);
    console.log(`  OK: ${parsed.surfaceDesires?.length ?? 0} surface desires, ${parsed.emotionalDesires?.length ?? 0} emotional desires`);

    return { status: 'OK', data: parsed, tokens, durationMs };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.log(`  FAIL: ${msg}`);
    return { status: 'FAIL', error: msg };
  }
}

async function runResearch(config: LlmConfig, scannerData: ScannerOutput): Promise<AgentResult & { data?: ResearchOutput }> {
  console.log('\n' + '='.repeat(60));
  console.log('RESEARCH AGENT');
  console.log('='.repeat(60));

  // WHY: Pick the first (largest) segment from scanner output
  const targetSegment = scannerData.naturalSegments?.[0]?.name ?? 'The Frustrated Problem-Solver';

  const input: ResearchInput = {
    productCategory: TEST_PRODUCT.category,
    productDescription: TEST_PRODUCT.description,
    productName: TEST_PRODUCT.name,
    scannerData,
    targetSegmentName: targetSegment,
    searchDepth: 'standard',
  };

  const { system, user } = buildResearchPrompt(input);

  console.log(`  Model: ${config.model}`);
  console.log(`  Segment: ${targetSegment}`);
  console.log('  Calling LLM...');

  try {
    const { text, tokens, durationMs } = await callLlm(config, system, user);
    console.log(`  Response: ${text.length} chars, ${(durationMs / 1000).toFixed(1)}s, ${tokens} tokens`);

    saveRaw('research_raw.txt', text);

    const jsonStr = extractJson(text);
    if (!jsonStr) {
      console.log('  FAIL: Could not extract JSON');
      return { status: 'FAIL', error: 'No JSON in response', tokens, durationMs };
    }

    const parsed: ResearchOutput = JSON.parse(jsonStr);
    saveJson('research_output.json', parsed);

    const chainCount = parsed.desireMiningChains?.length ?? 0;
    const langCount = parsed.languageVault?.length ?? 0;
    console.log(`  OK: ${parsed.painPoints?.length ?? 0} pain points, ${chainCount} T1 chains, ${langCount} language vault phrases`);

    return { status: 'OK', data: parsed, tokens, durationMs };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.log(`  FAIL: ${msg}`);
    return { status: 'FAIL', error: msg };
  }
}

async function runAngle(config: LlmConfig, scannerData: ScannerOutput, researchData: ResearchOutput): Promise<AgentResult & { data?: AngleOutput }> {
  console.log('\n' + '='.repeat(60));
  console.log('ANGLE AGENT');
  console.log('='.repeat(60));

  const input: AngleInput = {
    productCategory: TEST_PRODUCT.category,
    productDescription: TEST_PRODUCT.description,
    productName: TEST_PRODUCT.name,
    productPrice: TEST_PRODUCT.price,
    scannerData,
    researchData,
  };

  const { system, user } = buildAnglePrompt(input);

  console.log(`  Model: ${config.model}`);
  console.log(`  Product: ${TEST_PRODUCT.name}`);
  console.log('  Calling LLM...');

  try {
    const { text, tokens, durationMs } = await callLlm(config, system, user);
    console.log(`  Response: ${text.length} chars, ${(durationMs / 1000).toFixed(1)}s, ${tokens} tokens`);

    saveRaw('angle_raw.txt', text);

    const jsonStr = extractJson(text);
    if (!jsonStr) {
      console.log('  FAIL: Could not extract JSON');
      return { status: 'FAIL', error: 'No JSON in response', tokens, durationMs };
    }

    const parsed: AngleOutput = JSON.parse(jsonStr);
    saveJson('angle_output.json', parsed);

    const angleCount = parsed.angles?.length ?? 0;
    const recommended = parsed.recommendedAngleId ?? 'none';
    const awareness = parsed.awarenessAnalysis?.level ?? '?';
    console.log(`  OK: ${angleCount} angles, recommended: ${recommended}, awareness level: ${awareness}`);

    return { status: 'OK', data: parsed, tokens, durationMs };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.log(`  FAIL: ${msg}`);
    return { status: 'FAIL', error: msg };
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  // Parse args
  const args = process.argv.slice(2);
  const agentIdx = args.indexOf('--agent');
  const modelIdx = args.indexOf('--model');

  const agent = agentIdx >= 0 ? args[agentIdx + 1] : 'all';
  const model = modelIdx >= 0 ? args[modelIdx + 1] : 'deepseek';

  if (!['scanner', 'research', 'angle', 'all'].includes(agent)) {
    console.error('Usage: --agent scanner|research|angle|all --model deepseek|mimo');
    process.exit(1);
  }

  console.log(`Agent Pipeline Test — ${new Date().toISOString()}`);
  console.log(`Model: ${model} | Agent: ${agent}`);

  ensureOutputDir();

  const config = getModelConfig(model);

  // Pre-flight: check API key
  if (!config.apiKey) {
    console.error(`ERROR: No API key for ${model}. Check .env`);
    process.exit(1);
  }
  console.log('Pre-flight: API key found');

  const results: Record<string, AgentResult & { data?: unknown }> = {};

  // ── Scanner ──
  let scannerData: ScannerOutput | undefined;

  if (agent === 'scanner' || agent === 'all') {
    const result = await runScanner(config);
    results.scanner = result;
    scannerData = result.data;

    if (result.status !== 'OK') {
      console.log(`\nScanner failed (${result.status}). Stopping pipeline.`);
      saveResults(results, 'ABORTED_AT_SCANNER', model);
      return;
    }

    // If only running scanner, stop here
    if (agent === 'scanner') {
      saveResults(results, 'SCANNER_ONLY', model);
      printSummary(results, 'SCANNER_ONLY', model);
      return;
    }
  } else {
    // Load existing scanner output
    const scannerPath = path.join(OUTPUT_DIR, 'scanner_output.json');
    if (!fs.existsSync(scannerPath)) {
      console.error('ERROR: No scanner output found. Run scanner first.');
      process.exit(1);
    }
    scannerData = JSON.parse(fs.readFileSync(scannerPath, 'utf-8'));
    console.log(`Loaded existing scanner output (${JSON.stringify(scannerData).length} chars)`);
  }

  // ── Research ──
  let researchData: ResearchOutput | undefined;

  if (agent === 'research' || agent === 'angle' || agent === 'all') {
    if (!scannerData) {
      console.error('ERROR: No scanner data available.');
      process.exit(1);
    }

    const result = await runResearch(config, scannerData);
    results.research = result;
    researchData = result.data;

    if (result.status !== 'OK') {
      console.log(`\nResearch failed (${result.status}). Stopping.`);
      saveResults(results, 'ABORTED_AT_RESEARCH', model);
      return;
    }
  } else {
    const researchPath = path.join(OUTPUT_DIR, 'research_output.json');
    if (!fs.existsSync(researchPath)) {
      console.error('ERROR: No research output found. Run research first.');
      process.exit(1);
    }
    researchData = JSON.parse(fs.readFileSync(researchPath, 'utf-8'));
    console.log(`Loaded existing research output (${JSON.stringify(researchData).length} chars)`);
  }

  // ── Angle ──
  if (agent === 'angle' || agent === 'all') {
    if (!scannerData || !researchData) {
      console.error('ERROR: Missing scanner or research data.');
      process.exit(1);
    }

    const result = await runAngle(config, scannerData, researchData);
    results.angle = result;
  }

  // ── Summary ──
  const pipelineStatus = results.angle ? 'COMPLETE' : results.research ? 'PARTIAL' : 'SCANNER_ONLY';
  saveResults(results, pipelineStatus, model);
  printSummary(results, pipelineStatus, model);
}

function saveResults(results: Record<string, AgentResult>, status: string, model: string) {
  const summary = {
    timestamp: new Date().toISOString(),
    model,
    product: TEST_PRODUCT.name,
    pipelineStatus: status,
    agents: Object.fromEntries(
      Object.entries(results).map(([key, val]) => [key, {
        status: val.status,
        tokens: val.tokens,
        durationMs: val.durationMs,
        error: val.error,
      }])
    ),
  };
  saveJson('pipeline_results.json', summary);
}

function printSummary(results: Record<string, AgentResult>, status: string, model: string) {
  console.log('\n' + '='.repeat(60));
  console.log('PIPELINE SUMMARY');
  console.log('='.repeat(60));

  for (const [name, result] of Object.entries(results)) {
    const dur = result.durationMs ? `${(result.durationMs / 1000).toFixed(1)}s` : 'N/A';
    const tok = result.tokens ?? 'N/A';
    console.log(`  ${name.toUpperCase()}: ${result.status} | Tokens: ${tok} | Time: ${dur}`);
  }

  console.log(`\n  Pipeline: ${status}`);
  console.log(`  Model: ${model}`);
  console.log(`  Product: ${TEST_PRODUCT.name}`);
  console.log(`  Output: ${OUTPUT_DIR}`);
  console.log('='.repeat(60));
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
