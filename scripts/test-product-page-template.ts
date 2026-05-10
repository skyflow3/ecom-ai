/**
 * Purpose: Test the product page template generation pipeline.
 *          Product brief → AI content → Template fill → Output HTML → Judge.
 *
 * Run: npx tsx scripts/test-product-page-template.ts
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

import { generateFromTemplate } from '../src/services/template-generator';
import { getTemplateInfo } from '../src/services/template-engine';
import { judgeRawText, type JudgeResult } from '../src/services/content-judge';
import type { ProductBrief } from '../src/agents/prompts/product-page-filler';
import type { GeneratorConfig } from '../src/services/page-generator';
import { existsSync, mkdirSync, readFileSync } from 'fs';
import { join } from 'path';

const OUTPUT_DIR = join(process.cwd(), 'test-output');

// ─── Test Product Brief (Turmeric supplement — different from foot massager) ────

const TEST_BRIEF: ProductBrief = {
  name: 'TurmericMD+',
  description: 'A joint pain relief supplement using a patented "Golden Fusion Extract" that combines turmeric curcumin with black pepper extract for 2,000% better absorption than regular turmeric.',
  niche: 'Health & Wellness',
  targetAudience: 'Adults 45+ suffering from joint pain, stiffness, and inflammation who want a natural alternative to painkillers',
  benefits: [
    'Reduces joint pain and stiffness in as little as 7 days',
    '2000% better absorption than regular turmeric supplements',
    'Anti-inflammatory formula backed by 45+ clinical studies',
    'Supports healthy cartilage and flexible movement',
    '100% natural with zero side effects',
  ],
  price: '$39',
  originalPrice: '$89',
  discountPct: '55%',
  guarantee: '90-Day Money-Back Guarantee',
  mechanismName: 'Golden Fusion Extract',
  doctorPersona: 'Dr. Robert Chen, Rheumatology Specialist',
  ratingCount: '8,400+',
  ratingScore: '4.8',
  // Image URLs — small transparent placeholders so CSS controls display size
  // Logo: original is 160x40 SVG, use same ratio
  productImageUrl: 'https://placehold.co/800x600/ffffff/FF6B35?text=TMD%2B',
  productImageSquareUrl: 'https://placehold.co/600x600/ffffff/FF6B35?text=TMD%2B',
  doctorImageUrl: 'https://placehold.co/427x500/f5f5f5/333?text=Dr.+Chen',
  logoUrl: 'https://placehold.co/160x40/FF6B35/ffffff?text=TurmericMD%2B',
  productVideoUrls: ['https://placehold.co/800x600/ffffff/FF6B35?text=TMD%2B'],
};

// ─── API Config ───────────────────────────────────────────────────────────────

function getConfig() {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    console.error('ERROR: DEEPSEEK_API_KEY not found in .env');
    process.exit(1);
  }

  return {
    apiUrl: process.env.DEEPSEEK_API_URL ?? 'https://api.deepseek.com/v1/chat/completions',
    apiKey,
    model: process.env.DEEPSEEK_MODEL ?? 'deepseek-chat',
    temperature: 0.5,
    maxTokens: 16384,
    maxRetries: 2,
  };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const TEMPLATE_ID = 'product-page-tryemsense';

  console.log('=== Product Page Template Test ===\n');
  console.log(`Product: ${TEST_BRIEF.name}`);
  console.log(`Niche: ${TEST_BRIEF.niche}`);
  console.log(`Target: ${TEST_BRIEF.targetAudience.substring(0, 60)}...`);
  console.log(`Mechanism: ${TEST_BRIEF.mechanismName}`);
  console.log(`Doctor: ${TEST_BRIEF.doctorPersona}\n`);

  // Show template info
  const info = getTemplateInfo(TEMPLATE_ID);
  console.log(`Template: ${info.id}`);
  console.log(`AI slots to fill: ${info.aiSlotsCount}\n`);

  // Ensure output dir exists
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Generate!
  const config = getConfig();
  console.log(`Using model: ${config.model}`);
  console.log(`API: ${config.apiUrl}\n`);
  console.log('Generating content... (this may take 30-60 seconds)\n');

  const result = await generateFromTemplate(
    TEMPLATE_ID,
    TEST_BRIEF,
    config,
    OUTPUT_DIR
  );

  // Report results
  console.log('\n=== Results ===');
  console.log(`Success: ${result.success}`);
  console.log(`Duration: ${result.duration}s`);
  console.log(`Tokens used: ${result.tokensUsed}`);
  console.log(`Retries: ${result.retries}`);
  console.log(`Slots filled: ${result.slotsFilled}`);
  console.log(`Slots empty: ${result.slotsEmpty}`);
  console.log(`Output: ${result.outputPath}`);

  if (result.warnings.length > 0) {
    console.log(`\nWarnings (${result.warnings.length}):`);
    result.warnings.forEach(w => console.log(`  - ${w}`));
  }

  if (result.error) {
    console.error(`\nError: ${result.error}`);
    process.exit(1);
  }

  // ─── Judge the generated content ────────────────────────────────────────────
  console.log('\n=== Judge Evaluation (V5 Council — Product Page) ===\n');

  const htmlContent = readFileSync(result.outputPath, 'utf-8');
  const rawText = htmlContent
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();

  const brief = `${TEST_BRIEF.name}: ${TEST_BRIEF.description} Target: ${TEST_BRIEF.targetAudience}`;

  const judgeConfig: GeneratorConfig = {
    apiUrl: process.env.DEEPSEEK_API_URL ?? 'https://api.deepseek.com/v1/chat/completions',
    apiKey: process.env.DEEPSEEK_API_KEY ?? '',
    model: process.env.DEEPSEEK_MODEL ?? 'deepseek-chat',
  };

  const judgeResult: JudgeResult | null = await judgeRawText(
    rawText,
    'product-page',
    brief,
    judgeConfig
  );

  if (judgeResult) {
    console.log(`Total Score: ${judgeResult.total}/10`);
    console.log(`Tier: ${judgeResult.tier}`);
    console.log(`Winner Similarity: ${(judgeResult.winnerSimilarity * 100).toFixed(0)}%`);
    console.log(`Judges: ${judgeResult.judgeCount}/3`);

    console.log('\nCriteria Scores:');
    for (const [key, score] of Object.entries(judgeResult.criteriaScores)) {
      console.log(`  ${key}: ${score}`);
    }

    console.log('\nAnti-Bias Scores:');
    for (const [key, score] of Object.entries(judgeResult.antiBiasScores)) {
      console.log(`  ${key}: ${score}`);
    }

    if (judgeResult.hardCapApplied) {
      console.log(`\nHard Cap: ${judgeResult.hardCapApplied} (capped from ${judgeResult.hardCapOriginal})`);
    }

    if (judgeResult.feedback.length > 0) {
      console.log('\nFeedback:');
      judgeResult.feedback.forEach((f, i) => console.log(`  Judge ${i + 1}: ${f}`));
    }

    // Save judge results
    const judgeOutputPath = result.outputPath.replace('.html', '.judge.json');
    fs.writeFileSync(judgeOutputPath, JSON.stringify(judgeResult, null, 2));
    console.log(`\nJudge results saved: ${judgeOutputPath}`);
  } else {
    console.log('Judge evaluation failed (no valid response from judges)');
  }

  console.log('\n=== Done ===');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
