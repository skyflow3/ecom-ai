/**
 * Purpose: Test the hike-reasons-why template generation pipeline.
 *          Product brief → AI listicle content → Template fill → Output HTML.
 *          Uses Champion #4 (D5_Lite + patterns from advertorial_listicle_judge_v2.json).
 *
 * Run: npx tsx scripts/test-reasons-why-template.ts
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

import { generateFromTemplate, type TemplateGenerateResult } from '../src/services/template-generator';
import { judgeRawText, type JudgeResult } from '../src/services/content-judge';
import type { ProductBrief } from '../src/agents/prompts/template-filler';
import type { GeneratorConfig } from '../src/services/page-generator';
import { existsSync, mkdirSync, readFileSync } from 'fs';
import { join } from 'path';

const OUTPUT_DIR = join(process.cwd(), 'test-output');

// ─── Test Product Briefs ───────────────────────────────────────────────────────

const BRIEFS: Array<{ name: string; brief: ProductBrief }> = [
  {
    name: 'Nutrovia (Gut Health)',
    brief: {
      name: 'Nutrovia',
      description: 'A breakthrough gut health supplement that targets the hidden "Enzyme Starvation Cycle" — the real reason behind bloating, weight gain, and low energy after 40.',
      niche: 'Health & Wellness',
      targetAudience: 'Women 40-65 struggling with persistent bloating, unexplained weight gain, and digestive issues',
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
      // Image URLs for template replacement
      doctorImageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face',
      productImageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=1264&h=711&fit=crop',
      productImageSquareUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=1080&h=1080&fit=crop',
    },
  },
  {
    name: 'HF Stride (Barefoot Shoes)',
    brief: {
      name: 'HF Stride Barefoot Shoes',
      description: 'Barefoot shoes that fix foot pain, knee pain, and back pain by letting your feet move naturally. Zero-drop sole, wide toe box, ultra-lightweight.',
      niche: 'Pain Relief',
      targetAudience: 'Men and women 40-70 with foot pain, knee pain, or back pain from standing all day',
      benefits: [
        'Eliminates foot pain within the first week of wear',
        'Fixes knee and back pain by restoring natural foot alignment',
        'Ultra-lightweight under 6oz - no leg fatigue',
        'Wide toe box stops bunions and toe pinching',
        'Slip-on design - no bending down to tie shoes',
      ],
      price: '$59.95',
      originalPrice: '$119.95',
      discountPct: '50%',
      guarantee: '30-Day Money-Back Guarantee',
      mechanismName: 'Zero-Drop Natural Alignment',
      authorPersona: 'Athena Hudson, Fitness Researcher',
      categoryBadge: 'Wellness',
      ratingCount: '1,337',
      // Image URLs for template replacement
      doctorImageUrl: 'https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?w=200&h=200&fit=crop&crop=face',
      productImageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1264&h=711&fit=crop',
      productImageSquareUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1080&h=1080&fit=crop',
    },
  },
];

// ─── API Config ───────────────────────────────────────────────────────────────

async function getConfig() {
  // Try MiMo first (free, champion-validated), fallback to DeepSeek
  const mimoKey = process.env.MIMO_API_KEY;
  const deepseekKey = process.env.DEEPSEEK_API_KEY;

  if (mimoKey) {
    // Ping test — MiMo credits may be exhausted
    try {
      const mimoUrl = process.env.MIMO_API_URL ?? 'https://api.xiaomimimo.com/v1/chat/completions';
      const resp = await fetch(mimoUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${mimoKey}` },
        body: JSON.stringify({ model: 'mimo-v2-flash', messages: [{ role: 'user', content: 'Say OK' }], max_tokens: 5 }),
      });
      if (resp.ok) {
        console.log('Using MiMo (free, champion-validated)');
        return {
          apiUrl: mimoUrl,
          apiKey: mimoKey,
          model: 'mimo-v2-flash',
          temperature: 0.3,
          maxTokens: 4096,
          maxRetries: 2,
        };
      }
      console.log(`MiMo ping failed (${resp.status}), falling back to DeepSeek`);
    } catch {
      console.log('MiMo ping failed (network error), falling back to DeepSeek');
    }
  }

  if (!deepseekKey) {
    console.error('ERROR: Neither MIMO_API_KEY nor DEEPSEEK_API_KEY found in .env');
    process.exit(1);
  }

  console.log('Using DeepSeek');
  return {
    apiUrl: process.env.DEEPSEEK_API_URL ?? 'https://api.deepseek.com/v1/chat/completions',
    apiKey: deepseekKey,
    model: process.env.DEEPSEEK_MODEL ?? 'deepseek-chat',
    temperature: 0.3,
    maxTokens: 8192,
    maxRetries: 2,
  };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('='.repeat(60));
  console.log('REASONS WHY — Template Generation Test');
  console.log('='.repeat(60));

  // Pre-flight
  console.log('\nPre-flight checks...');
  const config = await getConfig();

  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Verify marked template exists
  const markedPath = join(process.cwd(), 'templates', 'hike-reasons-why.marked.html');
  if (!existsSync(markedPath)) {
    console.error(`ERROR: Missing marked template: ${markedPath}`);
    process.exit(1);
  }
  console.log(`  Marked template: OK (${(readFileSync(markedPath, 'utf-8').length / 1024).toFixed(0)} KB)`);

  // Verify slot config exists
  const slotConfigPath = join(process.cwd(), 'templates', 'hike-reasons-why.html.json');
  if (!existsSync(slotConfigPath)) {
    console.error(`ERROR: Missing slot config: ${slotConfigPath}`);
    process.exit(1);
  }
  console.log(`  Slot config: OK`);

  const allResults: Array<{
    name: string;
    brief: ProductBrief;
    genResult: TemplateGenerateResult;
    judgeResult: JudgeResult | null;
  }> = [];

  for (const { name, brief } of BRIEFS) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Test: ${name}`);
    console.log(`${'='.repeat(60)}`);
    console.log(`Product: ${brief.name}`);
    console.log(`Audience: ${brief.targetAudience.substring(0, 60)}...`);
    console.log(`Mechanism: ${brief.mechanismName}`);

    // Generate
    console.log(`\n[1/2] Generating with ${config.model} (temp=${config.temperature})...`);
    const genResult = await generateFromTemplate(
      'hike-reasons-why',
      brief,
      config,
      OUTPUT_DIR
    );

    console.log('\n--- Generation Results ---');
    console.log(`Success: ${genResult.success}`);
    console.log(`Duration: ${genResult.duration}s`);
    console.log(`Tokens: ${genResult.tokensUsed}`);
    console.log(`Slots filled: ${genResult.slotsFilled}`);
    console.log(`Slots empty: ${genResult.slotsEmpty}`);
    console.log(`Output: ${genResult.outputPath}`);

    if (genResult.warnings.length > 0) {
      console.log(`Warnings:`);
      genResult.warnings.forEach(w => console.log(`  - ${w}`));
    }

    if (genResult.error) {
      console.error(`Error: ${genResult.error}`);
      continue;
    }

    // Judge
    console.log(`\n[2/2] Judging with V5 Council (listicle judge)...`);

    const htmlContent = readFileSync(genResult.outputPath, 'utf-8');
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

    const briefText = `${brief.name}: ${brief.description} Target: ${brief.targetAudience}`;

    const judgeConfig: GeneratorConfig = {
      apiUrl: process.env.DEEPSEEK_API_URL ?? 'https://api.deepseek.com/v1/chat/completions',
      apiKey: process.env.DEEPSEEK_API_KEY ?? '',
      model: process.env.DEEPSEEK_MODEL ?? 'deepseek-chat',
    };

    const judgeResult = await judgeRawText(rawText, 'listicle', briefText, judgeConfig);

    if (judgeResult) {
      console.log(`\nTotal Score: ${judgeResult.total}/10`);
      console.log(`Tier: ${judgeResult.tier}`);
      console.log(`Judges: ${judgeResult.judgeCount}/3`);

      console.log('\nCriteria Scores:');
      for (const [key, score] of Object.entries(judgeResult.criteriaScores)) {
        console.log(`  ${key}: ${score}/10`);
      }

      if (judgeResult.feedback.length > 0) {
        console.log('\nFeedback:');
        judgeResult.feedback.forEach((f, i) => console.log(`  Judge ${i + 1}: ${f}`));
      }

      // Save judge results
      const judgeOutputPath = genResult.outputPath.replace('.html', '.judge.json');
      fs.writeFileSync(judgeOutputPath, JSON.stringify(judgeResult, null, 2));
      console.log(`\nJudge saved: ${judgeOutputPath}`);
    } else {
      console.log('Judge failed (no valid response)');
    }

    allResults.push({ name, brief, genResult, judgeResult });
  }

  // Summary
  console.log(`\n${'='.repeat(60)}`);
  console.log('SUMMARY');
  console.log(`${'='.repeat(60)}`);
  for (const r of allResults) {
    const score = r.judgeResult?.total ?? 'FAILED';
    const slots = r.genResult.slotsFilled;
    const words = r.judgeResult ? '' : ' (gen error)';
    console.log(`  ${r.name.padEnd(35)} Score: ${score}/10  Slots: ${slots}${words}`);
  }

  // Save summary
  const summaryPath = join(OUTPUT_DIR, `reasons-why-summary-${Date.now()}.json`);
  fs.writeFileSync(summaryPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    model: config.model,
    temperature: config.temperature,
    results: allResults.map(r => ({
      name: r.name,
      product: r.brief.name,
      genSuccess: r.genResult.success,
      slotsFilled: r.genResult.slotsFilled,
      slotsEmpty: r.genResult.slotsEmpty,
      duration: r.genResult.duration,
      tokensUsed: r.genResult.tokensUsed,
      judgeScore: r.judgeResult?.total ?? null,
      judgeTier: r.judgeResult?.tier ?? null,
      criteriaScores: r.judgeResult?.criteriaScores ?? null,
    })),
  }, null, 2));
  console.log(`\nSummary saved: ${summaryPath}`);

  console.log('\n=== Done ===');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
