/**
 * Purpose: Lab-exact test — replicate the exact lab flow for advertorial.
 *          Uses MiMo as producer (free), max_tokens=4000, single user message,
 *          rules_only prompt + Dual Persona pick-best.
 * Usage:   npx tsx scripts/test-lab-exact.ts
 *
 * WHY: Lab scores 8.57/10 with this exact setup. ECOM-AI scores 6.0-6.44.
 *      This test isolates each variable to find what causes the gap.
 * Source: pipeline_v2.py, CHAMPIONS.md #12
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

import { judgeRawText } from '../src/services/content-judge';
import { getCopywriterConfig } from '../src/lib/config';

const OUTPUT_DIR = path.join(__dirname, '..', 'test-output');
const RESULTS_DIR = path.join(__dirname, '..', 'test-results');

// ─── Lab-Exact Prompts ───────────────────────────────────────────────────────

const RULES_ONLY = `Write the content following these rules:
- Write in FIRST PERSON, conversational
- Use specific numbers, timeframes, and details throughout
- Build emotional tension through failures before revealing solution
- Create a clear villain (hidden cause) and hero (simple solution)
- Include visceral emotional language
- Make the CTA feel like the INEVITABLE conclusion
- 5th-8th grade reading level, short sentences
- NEVER corporate speak, NEVER generic, NEVER hedging`;

const REDDIT_PERSONA = `You are a regular person on Reddit sharing an honest experience. You're NOT a marketer or copywriter — you're someone who genuinely found something that worked and wants to help others. Think r/Supplements, r/health, r/Nootropics.

PERSONALITY:
- Skeptical by nature — you've "tried everything" before
- Honest about the journey — failures, doubts, timeline
- Specific with real numbers (days, dollars, measurements)
- Conversational — like texting a friend, not writing an ad
- Anti-hype — if something sounds too good, you call it out
- Emotional but authentic — real frustration, real relief

RULES:
- Write in FIRST PERSON as a real person
- Start with skepticism ("I didn't believe it either")
- Include specific timeline (Week 1 felt X, Week 4 felt Y)
- Mention doubts and almost-giving-up moments
- Use casual language, contractions, even occasional typos feel natural
- Reference real daily struggles (not marketing abstractions)
- The CTA should feel like a genuine recommendation to a friend
- NEVER sound like an ad, NEVER use marketing language, NEVER be salesy

Write the FULL content.`;

// ─── Lab-Exact Briefs (from test_dual_persona.py) ────────────────────────────
// WHY: Testing with the EXACT same briefs the lab used for champion #12.
//      If scores match ~8.5, pipeline works. If not, something else is wrong.

const LAB_BRIEFS = [
  {
    name: 'joint_pain',
    brief: `Write a 1500-word advertorial for 'FlexRevive' joint supplement. Target: adults 50-70 with chronic joint pain. Hook: couldn't play with grandkids. Mechanism: 'zombie cells' in joints + simple morning drink. Proof: 3 testimonials with specific results. Objections: 'nothing works for me'. CTA: 6-bottle best value $39/bottle. 90-day guarantee.`,
  },
  {
    name: 'gut_bloating',
    brief: `Write a 1500-word advertorial for 'GutRelief' gut health supplement. Target: adults 40-65 with chronic bloating and constipation. Hook: embarrassing bloating moment. Mechanism: hidden gut parasite + 7-second morning ritual. Proof: 3 testimonials. Objections: 'I'm clean', 'tried everything'. CTA: 3-bottle bundle $49/bottle, 180-day guarantee.`,
  },
  {
    name: 'weight_menopause',
    brief: `Write a 1500-word advertorial for 'SlimSwitch' metabolism booster. Target: women 35-55 with post-menopause weight gain. Hook: wedding dress story (couldn't zip it). Mechanism: 'metabolic switch' + 7-second coffee ritual. Proof: 3 women lost 20-40 lbs. Objections: 'slow metabolism is genetic'. CTA: 6 bottles $39 each. 60-day guarantee.`,
  },
];

// Also test the Nutrovia brief for comparison
const NUTROVIA_BRIEF = `Write a 1500-word advertorial for 'Nutrovia'. Target: Women 40-65 experiencing bloating, digestive discomfort, and fatigue. Hook: couldn't enjoy meals with family anymore. Mechanism: gut bacteria imbalance + 12-strain probiotic reset. Proof: 3 testimonials with specific results. Objections: 'nothing works for me'. CTA: 6-bottle best value $49/bottle. 90-day guarantee.`;

// ─── Lab-Exact API Call ──────────────────────────────────────────────────────

async function callMimo(prompt: string): Promise<{ text: string; tokens: number; durationMs: number }> {
  const mimoUrl = process.env.MIMO_API_URL ?? 'https://api.xiaomimimo.com/v1/chat/completions';
  const mimoKey = process.env.MIMO_API_KEY_5 ?? process.env.MIMO_API_KEY_6 ?? process.env.MIMO_API_KEY ?? '';
  const mimoModel = 'mimo-v2-flash';

  const start = Date.now();
  const resp = await fetch(mimoUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': mimoKey, // WHY: xiaomimimo uses api-key header
    },
    body: JSON.stringify({
      model: mimoModel,
      messages: [{ role: 'user', content: prompt }], // WHY: Single user message, no system — lab exact
      temperature: 0.3,
      max_completion_tokens: 4000, // WHY: xiaomimimo uses max_completion_tokens
    }),
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`MiMo API error ${resp.status}: ${err}`);
  }

  const data = await resp.json();
  const text = data.choices?.[0]?.message?.content ?? '';
  const tokens = (data.usage?.prompt_tokens ?? 0) + (data.usage?.completion_tokens ?? 0);
  return { text, tokens, durationMs: Date.now() - start };
}

// ─── Main ────────────────────────────────────────────────────────────────────

interface BriefResult {
  name: string;
  copyScore: number;
  redditScore: number;
  winnerScore: number;
  winner: string;
  copyWords: number;
  redditWords: number;
  criteriaScores?: Record<string, number>;
  antiBiasScores?: Record<string, number>;
}

async function main() {
  console.log('=== LAB-EXACT TEST v2 (3 Lab Briefs + Nutrovia) ===\n');

  for (const dir of [OUTPUT_DIR, RESULTS_DIR]) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }

  // Pre-flight: check MiMo API
  console.log('Pre-flight: checking MiMo API...');
  try {
    const test = await callMimo('ping');
    console.log(`MiMo API: OK (${test.durationMs}ms)\n`);
  } catch (err) {
    console.error('MiMo API: FAILED —', err);
    process.exit(1);
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const judgeConfig = getCopywriterConfig();

  // Test all briefs: 3 lab briefs + Nutrovia
  const allBriefs = [
    ...LAB_BRIEFS,
    { name: 'nutrovia', brief: NUTROVIA_BRIEF },
  ];

  const allResults: BriefResult[] = [];

  for (const briefObj of allBriefs) {
    console.log(`\n${'═'.repeat(60)}`);
    console.log(`BRIEF: ${briefObj.name}`);
    console.log(`${'═'.repeat(60)}`);
    const judgeBrief = `Advertorial for ${briefObj.name}`;

    // Generate Copywriter
    console.log(`  Generating Copywriter...`);
    const copyPrompt = `${RULES_ONLY}\n\n---\n\nNOW WRITE:\n${briefObj.brief}`;
    const copyResult = await callMimo(copyPrompt);
    const copyWords = copyResult.text.split(/\s+/).filter(Boolean).length;
    console.log(`    → ${copyWords} words, ${copyResult.tokens} tokens, ${copyResult.durationMs}ms`);

    fs.writeFileSync(path.join(OUTPUT_DIR, `lab-${briefObj.name}-copy-${timestamp}.txt`), copyResult.text);

    // Generate Reddit
    console.log(`  Generating Reddit...`);
    const redditPrompt = `${REDDIT_PERSONA}\n\n---\n\nNOW WRITE:\n${briefObj.brief}`;
    const redditResult = await callMimo(redditPrompt);
    const redditWords = redditResult.text.split(/\s+/).filter(Boolean).length;
    console.log(`    → ${redditWords} words, ${redditResult.tokens} tokens, ${redditResult.durationMs}ms`);

    fs.writeFileSync(path.join(OUTPUT_DIR, `lab-${briefObj.name}-reddit-${timestamp}.txt`), redditResult.text);

    // Judge both
    console.log(`  Judging...`);
    const [copyJudge, redditJudge] = await Promise.all([
      judgeRawText(copyResult.text, 'advertorial', judgeBrief, judgeConfig),
      judgeRawText(redditResult.text, 'advertorial', judgeBrief, judgeConfig),
    ]);

    const copyScore = copyJudge?.total ?? 0;
    const redditScore = redditJudge?.total ?? 0;
    const winner = copyScore >= redditScore ? 'Copywriter' : 'Reddit';
    const winnerScore = Math.max(copyScore, redditScore);

    console.log(`\n  Copywriter: ${copyScore}/10 ${copyJudge ? `[${copyJudge.tier}]` : '(failed)'}`);
    console.log(`  Reddit:     ${redditScore}/10 ${redditJudge ? `[${redditJudge.tier}]` : '(failed)'}`);
    console.log(`  → ${winner} wins (${winnerScore}/10)`);

    if (copyJudge) {
      console.log(`  Copywriter criteria:`);
      for (const [k, v] of Object.entries(copyJudge.criteriaScores)) {
        console.log(`    ${k}: ${v}`);
      }
      console.log(`  Anti-bias:`);
      for (const [k, v] of Object.entries(copyJudge.antiBiasScores)) {
        console.log(`    ${k}: ${v}`);
      }
    }
    if (redditJudge) {
      console.log(`  Reddit criteria:`);
      for (const [k, v] of Object.entries(redditJudge.criteriaScores)) {
        console.log(`    ${k}: ${v}`);
      }
    }

    allResults.push({
      name: briefObj.name,
      copyScore,
      redditScore,
      winnerScore,
      winner,
      copyWords,
      redditWords,
      criteriaScores: (copyScore >= redditScore ? copyJudge : redditJudge)?.criteriaScores,
      antiBiasScores: (copyScore >= redditScore ? copyJudge : redditJudge)?.antiBiasScores,
    });

    // Save incremental results
    const incResults = {
      test: 'lab-exact-v2',
      date: new Date().toISOString(),
      brief: briefObj.name,
      briefText: briefObj.brief,
      config: {
        model: 'mimo-v2-flash',
        temperature: 0.3,
        max_tokens: 4000,
        prompt: 'rules_only (8 rules)',
        messageFormat: 'single user message (no system)',
      },
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
      winner,
      winnerScore,
      feedback: {
        copywriter: copyJudge?.feedback,
        reddit: redditJudge?.feedback,
      },
    };

    const incFile = path.join(RESULTS_DIR, `lab-v2-${briefObj.name}-${timestamp}.json`);
    fs.writeFileSync(incFile, JSON.stringify(incResults, null, 2));
    console.log(`  Saved: ${incFile}`);
  }

  // ═══════════════════════════════════════════════════════════════
  // SUMMARY
  // ═══════════════════════════════════════════════════════════════

  console.log(`\n${'═'.repeat(60)}`);
  console.log('SUMMARY');
  console.log(`${'═'.repeat(60)}`);

  const labResults = allResults.filter(r => r.name !== 'nutrovia');
  const labAvg = labResults.reduce((s, r) => s + r.winnerScore, 0) / labResults.length;
  const nutroviaResult = allResults.find(r => r.name === 'nutrovia');

  console.log(`\n| Brief | Copywriter | Reddit | Winner | Score |`);
  console.log(`|-------|-----------|--------|--------|-------|`);
  for (const r of allResults) {
    console.log(`| ${r.name} | ${r.copyScore.toFixed(2)} | ${r.redditScore.toFixed(2)} | ${r.winner} | ${r.winnerScore.toFixed(2)} |`);
  }

  console.log(`\nLab briefs avg: ${labAvg.toFixed(2)}/10 (Lab reference: 8.58)`);
  console.log(`Gap: ${(8.58 - labAvg).toFixed(2)} points`);
  if (nutroviaResult) {
    console.log(`Nutrovia: ${nutroviaResult.winnerScore.toFixed(2)}/10`);
  }

  // Save full results
  const fullResults = {
    test: 'lab-exact-v2',
    date: new Date().toISOString(),
    config: {
      model: 'mimo-v2-flash',
      temperature: 0.3,
      max_tokens: 4000,
      prompt: 'rules_only (8 rules)',
      messageFormat: 'single user message (no system)',
    },
    briefs: allResults,
    labAverage: Math.round(labAvg * 100) / 100,
    labReference: 8.58,
    gap: +(8.58 - labAvg).toFixed(2),
  };

  const fullFile = path.join(RESULTS_DIR, `lab-v2-summary-${timestamp}.json`);
  fs.writeFileSync(fullFile, JSON.stringify(fullResults, null, 2));
  console.log(`\nFull results saved: ${fullFile}`);
  console.log('\n═══ DONE ═══');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
