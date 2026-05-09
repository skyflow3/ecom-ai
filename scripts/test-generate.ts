/**
 * Purpose: Standalone advertorial generation test — bypasses DB, calls AI pipeline directly.
 *          Outputs HTML file to test-output/ for browser preview.
 * Usage:   npx tsx scripts/test-generate.ts [model]
 *          model: deepseek-chat (default), deepseek-v4-pro, mimo-v2.5-pro
 *
 * WHY: Testing via Coolify deploy cycle is slow (5+ min). This script lets us
 *      iterate on copywriter prompts + renderer CSS in <2 min cycles locally.
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

import { generatePage } from '../src/services/page-generator';
import type { GeneratePageRequest } from '../src/services/page-generator';
import { judgeContent } from '../src/services/content-judge';
import { getLlmConfig, getCopywriterConfig } from '../src/lib/config';
import * as fs from 'fs';
import * as path from 'path';

// ─── Ensure renderers are registered (side-effect import) ────────────────────
import '../src/renderers';

// ─── Test Configuration ──────────────────────────────────────────────────────

const OUTPUT_DIR = path.join(__dirname, '..', 'test-output');

const NUTROVIA_PRODUCT: GeneratePageRequest = {
  pageType: 'advertorial',
  palette: 'health',
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
  // WHY: Lab proves specific angle/mechanism = higher C1 (Big Idea) scores.
  //      Without this, the model invents a generic mechanism that scores 3-4/10.
  //      The "enzyme starvation cycle" is a unique reframe of gut health.
  marketingAngle: {
    headline: "The 'Enzyme Starvation Cycle' That's Making Women Over 40 Look 6 Months Pregnant",
    subheadline: "A top gastroenterologist discovered why probiotics alone can't fix bloating — and the simple 3-enzyme reset that finally can.",
    ctaText: 'Check Availability Now →',
    painPoint: "Hidden enzyme deficiency that starves your gut bacteria — even if you take probiotics every day",
    benefits: [
      'Breaks the enzyme starvation cycle at the root cause',
      'Feeds AND replenishes gut bacteria simultaneously',
      'Works within 14 days — even after years of chronic bloating',
    ],
    guarantee: '90-day full refund, no questions asked — even if the bottle is empty',
  },
};

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('=== Advertorial Generation Test ===\n');

  // Ensure output dir exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Pre-flight: ping DeepSeek
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

  // Generate
  const startTime = Date.now();
  const cliModel = process.argv[2]; // optional: deepseek-v4-pro, mimo-v2.5-pro
  console.log('Starting generation (pageType=advertorial, product=Nutrovia)...\n');
  if (cliModel) console.log(`CLI override model: ${cliModel}\n`);

  const composerConfig = getLlmConfig();
  const copywriterConfig = getCopywriterConfig();

  // WHY: Allow CLI model override for A/B testing different models
  if (cliModel) {
    composerConfig.model = cliModel;
    copywriterConfig.model = cliModel;
    // MiMO model needs different API URL
    if (cliModel.includes('mimo')) {
      const mimoUrl = process.env.MIMO_API_URL ?? 'https://api.xiaomimimo.com/v1/chat/completions';
      composerConfig.apiUrl = mimoUrl;
      copywriterConfig.apiUrl = mimoUrl;
      // WHY: Use newest keys first (5,6 have balance, 1-4 are depleted)
      composerConfig.apiKey = process.env.MIMO_API_KEY_5 ?? process.env.MIMO_API_KEY_6 ?? process.env.MIMO_API_KEY ?? '';
      copywriterConfig.apiKey = process.env.MIMO_API_KEY_5 ?? process.env.MIMO_API_KEY_6 ?? process.env.MIMO_API_KEY ?? '';
      composerConfig.allKeys = [process.env.MIMO_API_KEY_5, process.env.MIMO_API_KEY_6].filter(Boolean) as string[];
      copywriterConfig.allKeys = [process.env.MIMO_API_KEY_5, process.env.MIMO_API_KEY_6].filter(Boolean) as string[];
    }
  }

  console.log(`Copywriter: ${copywriterConfig.model} @ ${copywriterConfig.temperature} temp`);
  console.log(`Composer: ${composerConfig.model} @ ${composerConfig.temperature} temp\n`);

  const result = await generatePage(NUTROVIA_PRODUCT, composerConfig, copywriterConfig);

  const duration = ((Date.now() - startTime) / 1000).toFixed(1);

  // ─── Report ──────────────────────────────────────────────────────────────────

  console.log('\n=== RESULTS ===');
  console.log(`Success: ${result.success}`);
  console.log(`Duration: ${duration}s`);
  console.log(`Attempts: ${result.attempts}`);
  console.log(`Tokens used: ${result.meta.tokensUsed}`);
  console.log(`Copywriter used: ${result.meta.copywriterUsed}`);

  if (result.validation) {
    console.log(`\nValidation:`);
    console.log(`  Score: ${result.validation.score}/100`);
    console.log(`  Valid: ${result.validation.valid}`);
    console.log(`  Errors: ${result.validation.errors.length}`);
    console.log(`  Warnings: ${result.validation.warnings.length}`);

    if (result.validation.errors.length > 0) {
      console.log('\n  Errors:');
      result.validation.errors.forEach(e => console.log(`    - [${e.code}] ${e.message}`));
    }
    if (result.validation.warnings.length > 0) {
      console.log('\n  Warnings (first 10):');
      result.validation.warnings.slice(0, 10).forEach(w => console.log(`    - [${w.code}] ${w.message}`));
    }
  }

  if (result.error) {
    console.log(`\nError: ${result.error}`);
  }

  // ─── Copywriting Judge (V5 Council) ──────────────────────────────────────────

  let judgeResult: Awaited<ReturnType<typeof judgeContent>> = null;
  if (result.blockTree) {
    console.log('\n=== COPYWRITING JUDGE (V5 Council — 3 personas) ===');
    console.log('Calling 3 judges in parallel (Copywriter, Strategist, Psychologist)...');

    const judgeConfig = getCopywriterConfig();
    const brief = `Advertorial for ${NUTROVIA_PRODUCT.product.name}: ${NUTROVIA_PRODUCT.product.description}`;

    try {
      judgeResult = await judgeContent(
        result.blockTree,
        NUTROVIA_PRODUCT.pageType,
        brief,
        judgeConfig,
      );

      if (judgeResult) {
        const tierEmoji = judgeResult.tier === 'elite' ? 'ELITE' :
          judgeResult.tier === 'approaching' ? 'APPROACHING' :
          judgeResult.tier === 'needs_work' ? 'NEEDS WORK' : 'REJECT';

        console.log(`\nJudge Score: ${judgeResult.total}/10 [${tierEmoji}]`);
        console.log(`Winner Similarity: ${(judgeResult.winnerSimilarity * 100).toFixed(0)}%`);
        console.log(`Judges Responded: ${judgeResult.judgeCount}/3`);

        if (judgeResult.hardCapApplied) {
          console.log(`Hard Cap: ${judgeResult.hardCapApplied} (original: ${judgeResult.hardCapOriginal})`);
        }

        console.log('\nCriteria Scores:');
        for (const [key, score] of Object.entries(judgeResult.criteriaScores)) {
          const weight = (judgeResult as any).criteriaScores?.[key] !== undefined ? '' : '';
          console.log(`  ${key}: ${score}/10`);
        }

        console.log('\nAnti-Bias Scores:');
        for (const [key, score] of Object.entries(judgeResult.antiBiasScores)) {
          console.log(`  ${key}: ${score}/10`);
        }

        if (judgeResult.feedback.length > 0) {
          console.log('\nFeedback:');
          judgeResult.feedback.forEach((f, i) => console.log(`  [Judge ${i + 1}] ${f}`));
        }
      } else {
        console.log('No judge config found for this page type.');
      }
    } catch (err) {
      console.log(`Judge error: ${err}`);
    }
  }

  // ─── Save HTML ───────────────────────────────────────────────────────────────

  if (result.html) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const modelTag = cliModel ? `-${cliModel.replace(/[^a-z0-9]/gi, '-')}` : '';
    const htmlFile = path.join(OUTPUT_DIR, `advertorial${modelTag}-${timestamp}.html`);
    fs.writeFileSync(htmlFile, result.html);
    console.log(`\nHTML saved: ${htmlFile}`);
    console.log(`Open in browser: file://${htmlFile.replace(/\\/g, '/')}`);

    // Also save metadata
    const metaFile = path.join(OUTPUT_DIR, `advertorial${modelTag}-${timestamp}.json`);
    fs.writeFileSync(metaFile, JSON.stringify({
      success: result.success,
      attempts: result.attempts,
      duration,
      tokensUsed: result.meta.tokensUsed,
      copywriterUsed: result.meta.copywriterUsed,
      validation: result.validation ? {
        score: result.validation.score,
        valid: result.validation.valid,
        errors: result.validation.errors.length,
        warnings: result.validation.warnings.length,
        errorCodes: result.validation.errors.map(e => e.code),
        warningCodes: result.validation.warnings.map(w => w.code),
      } : null,
      judge: judgeResult ? {
        total: judgeResult.total,
        tier: judgeResult.tier,
        winnerSimilarity: judgeResult.winnerSimilarity,
        judgeCount: judgeResult.judgeCount,
        hardCapApplied: judgeResult.hardCapApplied,
        criteriaScores: judgeResult.criteriaScores,
        antiBiasScores: judgeResult.antiBiasScores,
        feedback: judgeResult.feedback,
      } : null,
      error: result.error,
    }, null, 2));
    console.log(`Meta saved: ${metaFile}`);

    // Save blockTree for analysis
    if (result.blockTree) {
      const treeFile = path.join(OUTPUT_DIR, `advertorial${modelTag}-${timestamp}-tree.json`);
      fs.writeFileSync(treeFile, JSON.stringify(result.blockTree, null, 2));
      console.log(`Tree saved: ${treeFile}`);
    }
  }

  console.log('\n=== DONE ===');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
