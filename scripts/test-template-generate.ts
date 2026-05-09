/**
 * Purpose: Test the full template generation pipeline.
 *          Product brief → AI content → Template fill → Output HTML.
 *          INDEPENDENT from block system test (test-generate.ts).
 *
 * Run: npx tsx scripts/test-template-generate.ts
 */

// Read .env manually (no dotenv dependency in Next.js project)
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

import { generateFromTemplate, type TemplateGenerateResult } from '../src/services/template-generator';
import { getTemplateInfo } from '../src/services/template-engine';
import { judgeRawText, type JudgeResult } from '../src/services/content-judge';
import type { ProductBrief } from '../src/agents/prompts/template-filler';
import type { GeneratorConfig } from '../src/services/page-generator';
import { existsSync, mkdirSync, readFileSync } from 'fs';
import { join } from 'path';

const OUTPUT_DIR = join(process.cwd(), 'test-output');

// ─── Test Product Brief ───────────────────────────────────────────────────────

const TEST_BRIEF: ProductBrief = {
  name: 'Nutrovia',
  description: 'A breakthrough gut health supplement that targets the hidden "Enzyme Starvation Cycle" — the real reason behind bloating, weight gain, and low energy after 40.',
  niche: 'Health & Wellness',
  targetAudience: 'Women 40-65 struggling with persistent bloating, unexplained weight gain, and digestive issues who have tried everything without success',
  benefits: [
    'Eliminates bloating within 14 days by restoring digestive enzymes',
    'Melts stubborn belly fat by fixing the enzyme starvation cycle',
    'Restores natural energy without caffeine or stimulants',
    'Reverses the hidden enzyme decline that starts after age 40',
    'Clinically tested formula with 47,300+ satisfied customers',
  ],
  price: '$49',
  originalPrice: '$119',
  discountPct: '58%',
  guarantee: '90-Day Money-Back Guarantee',
  mechanismName: 'Enzyme Starvation Cycle',
  authorPersona: 'Dr. Sarah Mitchell, MD, Nutritionist',
  categoryBadge: 'Health',
  ratingCount: '4,891',
  // Image URLs — replace all SmoothSpine product images
  // Section content images: 1264x711 (16:9 landscape) to match original winner template
  // Sidebar + update box: 1080x1080 (square) to match original dimensions
  // Doctor: small square for byline photo
  doctorImageUrl: 'https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?w=200&h=200&fit=crop&crop=face',
  productImageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=1264&h=711&fit=crop',
  productImageSquareUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=1080&h=1080&fit=crop',
  logoUrl: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=200&h=60&fit=crop',
  commentScreenshotUrls: [
    'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=1264&h=711&fit=crop',
    'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=1264&h=711&fit=crop',
  ],
};

// ─── API Config ───────────────────────────────────────────────────────────────

function getConfig() {
  // Use DeepSeek for best quality (same as copywriter)
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
  console.log('=== Template Generation Test ===\n');
  console.log(`Product: ${TEST_BRIEF.name}`);
  console.log(`Niche: ${TEST_BRIEF.niche}`);
  console.log(`Target: ${TEST_BRIEF.targetAudience.substring(0, 60)}...`);
  console.log(`Mechanism: ${TEST_BRIEF.mechanismName}\n`);

  // Show template info
  const info = getTemplateInfo('smoothspire-advertorial');
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

  // NOTE: Now using marker mode — .marked.html has {{SLOT}} markers
  const result = await generateFromTemplate(
    'smoothspire-advertorial',
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
  console.log('\n=== Judge Evaluation (V5 Council) ===\n');

  // Extract text from generated HTML for judging
  const htmlContent = readFileSync(result.outputPath, 'utf-8');
  const rawText = htmlContent
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')   // strip scripts
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')      // strip styles
    .replace(/<[^>]+>/g, ' ')                             // strip tags
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
    'advertorial',
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

    // Save judge results alongside the HTML
    const judgeOutputPath = result.outputPath.replace('.html', '.judge.json');
    const fs2 = await import('fs');
    fs2.writeFileSync(judgeOutputPath, JSON.stringify(judgeResult, null, 2));
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
