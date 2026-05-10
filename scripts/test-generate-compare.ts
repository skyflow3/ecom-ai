/**
 * Purpose: Auto-compare generated advertorial with winner benchmarks.
 *          Measures: blocks, images, testimonials, words, structure.
 * Usage:   npx tsx scripts/test-generate-compare.ts <tree.json> [winner.html...]
 */

import * as fs from 'fs';
import * as path from 'path';

// ─── Advertorial Winner Benchmarks ─────────────────────────────────────────
// WHY: Extracted from C:\Users\Admin\Downloads\SITES\htlm-pages\ analysis
const BENCHMARKS = {
  blocks:     { min: 30, target: 40, max: 50 },
  images:     { min: 8,  target: 12, max: 15 },
  words:      { min: 2000, target: 2500, max: 3500 },
  testimonials: { min: 3, target: 5, max: 8 },
  editorialHeadings: { min: 3, target: 4, max: 6 },
  authorCtas: { min: 2, target: 2, max: 3 },
  bodyTextBlocks: { min: 6, target: 10, max: 15 },
  wordsPerBodyBlock: { min: 150, target: 250, max: 400 },
};

function score(actual: number, bench: { min: number; target: number; max: number }): number {
  if (actual >= bench.target) return 10;
  if (actual >= bench.min) return 5 + (actual - bench.min) / (bench.target - bench.min) * 5;
  return Math.max(0, (actual / bench.min) * 5);
}

function main() {
  const treePath = process.argv[2];
  if (!treePath) {
    console.log('Usage: npx tsx scripts/test-generate-compare.ts <tree.json>');
    process.exit(1);
  }

  const tree = JSON.parse(fs.readFileSync(treePath, 'utf-8'));
  const blocks = tree.blocks || [];

  // Count metrics
  const metrics = {
    blocks: blocks.length,
    images: blocks.filter(b => b.type === 'image').length,
    testimonials: blocks.filter(b => b.type === 'testimonial').length,
    editorialHeadings: blocks.filter(b => b.type === 'editorial-heading').length,
    authorCtas: blocks.filter(b => b.type === 'author-cta').length,
    bodyTextBlocks: blocks.filter(b => b.type === 'body-text').length,
  };

  const bodyBlocks = blocks.filter(b => b.type === 'body-text');
  const wordsPerBlock = bodyBlocks.map(b => {
    const content = b.props?.content || '';
    return content.split(/\s+/).filter(Boolean).length;
  });
  const totalWords = wordsPerBlock.reduce((a, b) => a + b, 0);
  const avgWordsPerBlock = bodyBlocks.length > 0 ? Math.round(totalWords / bodyBlocks.length) : 0;

  // Score each metric
  const scores: Record<string, { value: number; score: number; target: string; status: string }> = {};

  for (const [key, bench] of Object.entries(BENCHMARKS)) {
    const actual = key === 'words' ? totalWords
      : key === 'wordsPerBodyBlock' ? avgWordsPerBlock
      : (metrics as any)[key] || 0;
    const s = score(actual, bench);
    const status = s >= 10 ? '✅' : s >= 5 ? '⚠️' : '❌';
    scores[key] = {
      value: actual,
      score: Math.round(s * 10) / 10,
      target: `${bench.min}-${bench.max} (target: ${bench.target})`,
      status,
    };
  }

  // Overall score
  const totalScore = Object.values(scores).reduce((a, s) => a + s.score, 0);
  const maxScore = Object.keys(scores).length * 10;
  const pct = Math.round((totalScore / maxScore) * 100);

  // Report
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║         ADVERTORIAL vs WINNER BENCHMARKS                ║');
  console.log('╠══════════════════════════════════════════════════════════╣');
  console.log(`║  Overall: ${pct}% (${totalScore}/${maxScore})                                      ║`);
  console.log('╠══════════════════════════════════════════════════════════╣');
  console.log('║  Metric           Value    Score   Target               ║');
  console.log('╠══════════════════════════════════════════════════════════╣');

  for (const [key, s] of Object.entries(scores)) {
    const name = key.padEnd(18);
    const val = String(s.value).padEnd(8);
    const sc = `${s.score}/10`.padEnd(8);
    const tgt = s.target.padEnd(22);
    console.log(`║  ${s.status} ${name}${val}${sc}${tgt}║`);
  }

  console.log('╚══════════════════════════════════════════════════════════╝');

  // Specific recommendations
  console.log('\n📋 RECOMMENDATIONS:');
  const recs: string[] = [];
  if (totalWords < 2000) {
    recs.push(`- WORD COUNT: ${totalWords}/2000. Add more paragraphs per body-text block (target 4-6 paragraphs, 250 words each).`);
  }
  if (metrics.images < 8) {
    recs.push(`- IMAGES: ${metrics.images}/8. Add more image blocks between body-text sections.`);
  }
  if (metrics.testimonials < 3) {
    recs.push(`- TESTIMONIALS: ${metrics.testimonials}/3. Add more customer stories.`);
  }
  if (avgWordsPerBlock < 150) {
    recs.push(`- WORDS/BLOCK: ${avgWordsPerBlock}/150. Each body-text block needs 3-6 paragraphs.`);
  }

  if (recs.length === 0) {
    console.log('  All metrics at or above target. Ready for visual review.');
  } else {
    recs.forEach(r => console.log(r));
  }

  // Block structure analysis
  console.log('\n📊 BLOCK STRUCTURE:');
  const blockTypes = blocks.map(b => b.type);
  blockTypes.forEach((type, i) => {
    const icon = type === 'body-text' ? '📝'
      : type === 'image' ? '🖼️'
      : type === 'testimonial' ? '⭐'
      : type === 'editorial-heading' ? '📌'
      : type === 'author-cta' ? '🔗'
      : type === 'button' || type === 'sticky-cta' ? '🔘'
      : '📦';
    console.log(`  ${String(i + 1).padStart(2)} ${icon} ${type}`);
  });
}

main();
