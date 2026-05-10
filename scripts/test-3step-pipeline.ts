/**
 * Purpose: Test the 3-step pipeline (free text → judge → convert to blocks)
 *          and compare with the 2-call pipeline (JSON copywriter → composer).
 *          Measures judge score improvement from switching to free text.
 * Usage:   npx tsx scripts/test-3step-pipeline.ts
 *
 * WHY: The lab gets 8.57/10 with free text. ECOM-AI gets 6.44 with JSON.
 *      This test validates that the 3-step pipeline closes the gap.
 * Source: test-results/2026-05-09-advertorial-pipeline.md, GUIDE-IA.md #3
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

import { generatePage } from '../src/services/page-generator';
import type { GeneratePageRequest } from '../src/services/page-generator';
import { judgeContent, judgeRawText } from '../src/services/content-judge';
import { getLlmConfig, getCopywriterConfig } from '../src/lib/config';
import { buildFreeTextCopywriterPrompt, buildFreeTextRedditPrompt } from '../src/agents/prompts/copywriter';

// Ensure renderers are registered
import '../src/renderers';

// ─── Test Configuration ──────────────────────────────────────────────────────

const OUTPUT_DIR = path.join(__dirname, '..', 'test-output');
const RESULTS_DIR = path.join(__dirname, '..', 'test-results');

const NUTROVIA_PRODUCT: GeneratePageRequest = {
  pageType: 'advertorial',
  palette: 'health-warm' as any,
  product: {
    name: 'Nutrovia',
    description: 'Advanced gut health supplement with 12 probiotic strains, prebiotic fiber, and digestive enzymes. Targets bloating, irregular digestion, and low energy caused by poor gut health.',
    price: '$49',
    originalPrice: '$89',
    niche: 'Health & Wellness / Gut Health',
    targetAudience: 'Women 40-65 experiencing bloating, digestive discomfort, and fatigue',
    benefits: [
      'Eliminates bloating within 14 days',
      'Restores regular digestion naturally',
      'Boosts energy through improved nutrient absorption',
      '12 clinically-studied probiotic strains',
      'Prebiotic fiber feeds beneficial gut bacteria',
      '90-day money-back guarantee',
    ],
    guarantee: '90-day full refund, no questions asked',
    imageUrl: 'https://picsum.photos/seed/nutrovia/600/400',
  },
};

// ─── Helper: Call LLM for free text generation ────────────────────────────────

async function callLlmForText(
  apiUrl: string,
  apiKey: string,
  model: string,
  systemPrompt: string,
  userPrompt: string,
): Promise<{ text: string; tokens: number; durationMs: number }> {
  const start = Date.now();
  const resp = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 16384,
    }),
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`API error ${resp.status}: ${err}`);
  }

  const data = await resp.json();
  const text = data.choices?.[0]?.message?.content ?? '';
  const tokens = (data.usage?.prompt_tokens ?? 0) + (data.usage?.completion_tokens ?? 0);
  return { text, tokens, durationMs: Date.now() - start };
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('=== 3-Step Pipeline Test (Free Text → Judge → Blocks) ===\n');

  // Ensure dirs exist
  for (const dir of [OUTPUT_DIR, RESULTS_DIR]) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }

  // Pre-flight: check DeepSeek API
  console.log('Pre-flight: checking DeepSeek API...');
  try {
    const resp = await fetch(
      process.env.DEEPSEEK_API_URL ?? 'https://api.deepseek.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [{ role: 'user', content: 'ping' }],
          max_tokens: 5,
        }),
      },
    );
    if (!resp.ok) throw new Error(`DeepSeek API returned ${resp.status}`);
    console.log('DeepSeek API: OK\n');
  } catch (err) {
    console.error('DeepSeek API: FAILED —', err);
    process.exit(1);
  }

  const copywriterConfig = getCopywriterConfig();
  const brief = `Advertorial for ${NUTROVIA_PRODUCT.product.name}: ${NUTROVIA_PRODUCT.product.description}`;
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

  // ═══════════════════════════════════════════════════════════════
  // TEST A: 3-Step Pipeline (Free Text → Judge → Blocks)
  // ═══════════════════════════════════════════════════════════════
  console.log('═══ TEST A: 3-Step Pipeline (Free Text) ═══\n');

  // Step 1: Generate FREE TEXT with both personas
  console.log('Step 1: Generating free text (Copywriter + Reddit personas)...');
  const startTime = Date.now();

  const copyPrompt = buildFreeTextCopywriterPrompt({
    pageType: NUTROVIA_PRODUCT.pageType,
    product: NUTROVIA_PRODUCT.product,
  });
  const redditPrompt = buildFreeTextRedditPrompt({
    pageType: NUTROVIA_PRODUCT.pageType,
    product: NUTROVIA_PRODUCT.product,
  });

  const apiUrl = copywriterConfig.apiUrl;
  const apiKey = copywriterConfig.allKeys?.[0] ?? copywriterConfig.apiKey;
  const model = copywriterConfig.model;

  const [copyTextResult, redditTextResult] = await Promise.allSettled([
    callLlmForText(apiUrl, apiKey, model, copyPrompt.systemPrompt, copyPrompt.userPrompt),
    callLlmForText(apiUrl, apiKey, model, redditPrompt.systemPrompt, redditPrompt.userPrompt),
  ]);

  const copyText = copyTextResult.status === 'fulfilled' ? copyTextResult.value.text : '';
  const redditText = redditTextResult.status === 'fulfilled' ? redditTextResult.value.text : '';

  const copyWords = copyText.split(/\s+/).filter(Boolean).length;
  const redditWords = redditText.split(/\s+/).filter(Boolean).length;
  console.log(`  Copywriter: ${copyWords} words (${copyTextResult.status === 'fulfilled' ? `${copyTextResult.value.durationMs}ms` : 'FAILED'})`);
  console.log(`  Reddit:     ${redditWords} words (${redditTextResult.status === 'fulfilled' ? `${redditTextResult.value.durationMs}ms` : 'FAILED'})`);

  // Save raw texts
  fs.writeFileSync(path.join(OUTPUT_DIR, `3step-copy-${timestamp}.txt`), copyText);
  fs.writeFileSync(path.join(OUTPUT_DIR, `3step-reddit-${timestamp}.txt`), redditText);

  // Step 2: Judge both free texts
  console.log('\nStep 2: Judging free texts (V5 Council)...');

  const [copyJudge, redditJudge] = await Promise.all([
    judgeRawText(copyText, NUTROVIA_PRODUCT.pageType, brief, copywriterConfig),
    judgeRawText(redditText, NUTROVIA_PRODUCT.pageType, brief, copywriterConfig),
  ]);

  const copyScore = copyJudge?.total ?? 0;
  const redditScore = redditJudge?.total ?? 0;

  console.log(`  Copywriter judge: ${copyScore}/10 ${copyJudge ? `[${copyJudge.tier}]` : '(failed)'}`);
  console.log(`  Reddit judge:     ${redditScore}/10 ${redditJudge ? `[${redditJudge.tier}]` : '(failed)'}`);

  const bestText = copyScore >= redditScore ? copyText : redditText;
  const bestLabel = copyScore >= redditScore ? 'Copywriter' : 'Reddit';
  const bestScore = Math.max(copyScore, redditScore);
  console.log(`\n  → ${bestLabel} wins (${bestScore}/10)`);

  if (copyJudge) {
    console.log('\n  Copywriter criteria:');
    for (const [k, v] of Object.entries(copyJudge.criteriaScores)) {
      console.log(`    ${k}: ${v}/10`);
    }
  }
  if (redditJudge) {
    console.log('\n  Reddit criteria:');
    for (const [k, v] of Object.entries(redditJudge.criteriaScores)) {
      console.log(`    ${k}: ${v}/10`);
    }
  }

  // Step 3: Convert best text to BlockTree via full pipeline
  console.log('\nStep 3: Converting best text to BlockTree...');
  const composerConfig = getLlmConfig();
  const fullResult = await generatePage(NUTROVIA_PRODUCT, composerConfig, copywriterConfig);
  const totalDuration = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log(`\n  Pipeline result: ${fullResult.success ? 'SUCCESS' : 'FAILED'}`);
  console.log(`  Duration: ${totalDuration}s`);
  console.log(`  Attempts: ${fullResult.attempts}`);
  console.log(`  Validation: ${fullResult.validation?.score ?? 0}/100`);
  console.log(`  Free text used: ${fullResult.meta.freeTextUsed ?? false}`);

  // Judge the final BlockTree too (post-composer)
  let finalJudge: Awaited<ReturnType<typeof judgeContent>> = null;
  if (fullResult.blockTree) {
    finalJudge = await judgeContent(fullResult.blockTree, NUTROVIA_PRODUCT.pageType, brief, copywriterConfig);
    if (finalJudge) {
      console.log(`  Final BlockTree judge: ${finalJudge.total}/10 [${finalJudge.tier}]`);
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // SAVE RESULTS
  // ═══════════════════════════════════════════════════════════════

  const results = {
    test: '3-step-pipeline',
    date: new Date().toISOString(),
    product: NUTROVIA_PRODUCT.product.name,
    freeText: {
      copywriter: {
        words: copyWords,
        judgeScore: copyScore,
        judgeTier: copyJudge?.tier,
        criteriaScores: copyJudge?.criteriaScores,
        antiBiasScores: copyJudge?.antiBiasScores,
      },
      reddit: {
        words: redditWords,
        judgeScore: redditScore,
        judgeTier: redditJudge?.tier,
        criteriaScores: redditJudge?.criteriaScores,
        antiBiasScores: redditJudge?.antiBiasScores,
      },
      winner: bestLabel,
      winnerScore: bestScore,
    },
    composer: {
      success: fullResult.success,
      validationScore: fullResult.validation?.score,
      attempts: fullResult.attempts,
      freeTextUsed: fullResult.meta.freeTextUsed,
    },
    finalBlockTreeJudge: finalJudge ? {
      total: finalJudge.total,
      tier: finalJudge.tier,
      criteriaScores: finalJudge.criteriaScores,
    } : null,
    duration: totalDuration,
  };

  const resultsFile = path.join(RESULTS_DIR, `3step-pipeline-${timestamp}.json`);
  fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));
  console.log(`\nResults saved: ${resultsFile}`);

  // Save HTML if available
  if (fullResult.html) {
    const htmlFile = path.join(OUTPUT_DIR, `3step-${timestamp}.html`);
    fs.writeFileSync(htmlFile, fullResult.html);
    console.log(`HTML saved: ${htmlFile}`);
  }

  // ═══════════════════════════════════════════════════════════════
  // COMPARISON SUMMARY
  // ═══════════════════════════════════════════════════════════════

  console.log('\n═══ COMPARISON ═══');
  console.log(`Lab reference:     8.57/10 (MiMo, free text, temp=0.3)`);
  console.log(`Previous ECOM-AI:  6.44/10 (DeepSeek, JSON, triggers)`);
  console.log(`3-Step Free Text:  ${bestScore}/10 (${bestLabel} persona)`);
  if (finalJudge) {
    console.log(`Post-composer:     ${finalJudge.total}/10`);
  }
  const improvement = bestScore - 6.44;
  console.log(`\nImprovement vs JSON: ${improvement >= 0 ? '+' : ''}${improvement.toFixed(2)} points`);
  console.log(`Gap vs lab:         ${(8.57 - bestScore).toFixed(2)} points remaining`);

  // Update GUIDE-IA.md checkpoint
  console.log('\n═══ DONE ═══');
  console.log('Next: Update GUIDE-IA.md with results if score improved');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
