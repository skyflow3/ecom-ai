/**
 * Purpose: Content Judge Service — V5 Council (3 personas) evaluation of copywriting quality.
 *          Scores generated content against lab-validated judge configs.
 * Dependencies: judges/*.json (criteria, weights, patterns, hard caps)
 * Related: src/services/page-generator.ts (consumer), scripts/test-generate.ts (CLI)
 * Source: content_producer.py (Python reference implementation)
 *
 * WHY: The validation pipeline (Zod) checks STRUCTURE. This judge checks QUALITY.
 *      A page can pass validation with score 100 but have terrible copywriting.
 *      The V5 Council uses 3 independent personas to reduce individual bias,
 *      then takes the median of their scores for each criterion.
 *
 * ARCHITECTURE: V5 Council
 *   Content → [Copywriter persona] → Scores 1
 *           → [Strategist persona]  → Scores 2  → Median → Weighted Avg → Hard Caps → Final Score
 *           → [Psychologist persona] → Scores 3
 */

import type { PageType } from '../design-system/tokens';
import type { BlockTree } from '../design-system/blocks';

// ─── Judge Config Shape ──────────────────────────────────────────────────────

interface JudgeCriterion {
  name: string;
  weight: number;
  desc: string;
}

interface HardCap {
  min: number;
  cap: number;
  reason: string;
}

interface AntiBiasWeight {
  S1_GenericPenalty: number;
  S2_HedgingPenalty: number;
  S3_EmotionalAuthenticity: number;
  S4_AISyntaxPenalty: number;
  S5_FluffPenalty: number;
}

interface AntiBiasCriteria {
  S1_GenericPenalty: string;
  S2_HedgingPenalty: string;
  S3_EmotionalAuthenticity: string;
  S4_AISyntaxPenalty: string;
  S5_FluffPenalty: string;
}

interface JudgeConfig {
  content_type: string;
  type_name: string;
  criteria: JudgeCriterion[];
  hard_caps: Record<string, HardCap>;
  anti_bias_weights: AntiBiasWeight;
  anti_bias_criteria: AntiBiasCriteria;
  winner_patterns: string;
  structural_patterns: string[];
  psychological_patterns: string[];
  language_patterns: string[];
  differentiators: string[];
  power_words: string[];
  scoring_thresholds: {
    winner_elite: number;
    winner_approaching: number;
    needs_work: number;
    reject: number;
  };
}

// ─── Judge Result ────────────────────────────────────────────────────────────

export interface JudgeResult {
  /** Weighted average score (main metric) */
  total: number;
  /** Per-criterion median scores */
  criteriaScores: Record<string, number>;
  /** Anti-bias median scores */
  antiBiasScores: Record<string, number>;
  /** Winner similarity (0-1) */
  winnerSimilarity: number;
  /** Quality tier based on thresholds */
  tier: 'elite' | 'approaching' | 'needs_work' | 'reject';
  /** Hard cap applied? */
  hardCapApplied?: string;
  hardCapOriginal?: number;
  /** Feedback from judges */
  feedback: string[];
  /** Number of judges that responded */
  judgeCount: number;
  /** Per-judge raw scores for transparency */
  rawScores: Record<string, string | number>[];
}

// ─── Judge Config Loader ─────────────────────────────────────────────────────

import type { GeneratorConfig } from './page-generator';

// WHY: Cache avoids filesystem reads on every judge call.
const _judgeConfigCache = new Map<string, JudgeConfig>();

const JUDGE_FILE_MAP: Record<string, string> = {
  'advertorial': 'advertorial_judge_v2.json',
  'product-page': 'product_page_judge_v2.json',
  'vsl': 'vsl_judge_v2.json',
  'upsell': 'upsell_judge.json',
  'video-ad': 'video_ad_judge_v2.json',
  'listicle': 'advertorial_listicle_judge_v2.json',
  'vsl-teaser': 'vsl_teaser_judge_v2.json',
  'retargeting-video': 'video_ads_retargeting_judge.json',
  'fb-ad': 'fb_ad_judge.json',
  'image-ad-long': 'image_ads_long_form_copy_judge.json',
  'image-ad-retargeting': 'image_ads_retargeting_judge.json',
  'whatsapp': 'whatsapp_sms_judge.json',
  'quiz': 'quiz_judge.json',
  'soap-opera': 'soap_opera_judge.json',
  'video-ai': 'video_ai_judge.json',
};

async function loadJudgeConfig(pageType: PageType): Promise<JudgeConfig | null> {
  const filename = JUDGE_FILE_MAP[pageType];
  if (!filename) return null;

  if (_judgeConfigCache.has(filename)) return _judgeConfigCache.get(filename)!;

  try {
    const { readFile } = await import('fs/promises');
    const { join } = await import('path');
    const filePath = join(process.cwd(), 'judges', filename);
    const raw = await readFile(filePath, 'utf-8');
    const data = JSON.parse(raw) as JudgeConfig;
    _judgeConfigCache.set(filename, data);
    return data;
  } catch {
    return null;
  }
}

// ─── Three Judge Personas ────────────────────────────────────────────────────
// Source: content_producer.py JUDGE_PERSONAS

const JUDGE_PERSONAS: Record<string, string> = {
  Copywriter:
    'You are a world-class direct-response copywriter who has written hundreds of winning ads, sales pages, and email sequences. You evaluate content for persuasion, emotional impact, and conversion potential. You know what makes people BUY.',
  Strategist:
    'You are a senior content strategist who has managed $50M+ in ad spend across e-commerce brands. You evaluate content for strategic alignment, audience fit, and business impact. You know what drives REVENUE.',
  Psychologist:
    'You are a consumer psychologist specializing in buying behavior and persuasion science. You evaluate content for psychological triggers, emotional resonance, and cognitive biases used. You know what makes people ACT.',
};

// ─── Anti-Bias Criteria (shared across all content types) ─────────────────────
// Source: content_producer.py ANTI_BIAS_CRITERIA

// WHY: Anti-bias criteria are scored 1-10 like all other criteria (higher = better).
//      Previous version used penalty language ("max 4 if...") which caused judges to
//      return 0 (interpreting it as "no penalty") instead of scoring 1-10.
//      Updated to make the 1-10 scale explicit for each criterion.
const ANTI_BIAS_CRITERIA = `
IMPORTANT: Score ALL criteria below on a 1-10 scale where 10 = excellent. Do NOT use 0.

S1_GenericPenalty: Is the content HYPER-SPECIFIC to this product/audience/mechanism, or could it apply to ANYTHING?
   SCORING: 10 = extremely specific (unique mechanisms, named individuals, exact numbers, product-specific details). 7 = good specificity. 4 = generic (could swap product name and copy still works). 1 = completely generic.

S2_HedgingPenalty: Does the content take STRONG positions or hedge everything?
   SCORING: 10 = bold, confident claims ("this will", "you'll notice", "proven to"). 7 = mostly confident with some hedging. 4 = heavy hedging ("may help", "could improve", "some people find"). 1 = every claim is softened.

S3_EmotionalAuthenticity: Does the content feel GENUINELY emotional or formulaically emotional?
   SCORING: 10 = emotions feel earned through story and specificity, genuinely moving. 7 = authentic emotional tone. 5 = formulaic emotions ("imagine a world where...", "what if I told you..."). 1 = zero emotional resonance.

S4_AISyntaxPenalty: Does the content sound like AI wrote it?
   SCORING: 10 = reads like a real person talking to a friend (conversational, raw, uses "Look,", "Here's the thing," fragments). 7 = natural tone with minor AI patterns. 4 = 2+ AI patterns ("Moreover", "Furthermore", "Additionally", corporate brochure tone). 1 = obviously AI-generated.

S5_FluffPenalty: Is every sentence EARNING its place, or is there filler?
   SCORING: 10 = every sentence has purpose, benefit statements have mechanisms, emotional claims have evidence. 7 = mostly tight writing. 4 = 3+ sentences could be deleted without impact, buzzwords without proof. 1 = mostly filler.`;

// ─── Build Judge Prompt ──────────────────────────────────────────────────────

function buildJudgePrompt(
  personaDesc: string,
  criteria: JudgeCriterion[],
  content: string,
  contentFormat: string,
  brief: string,
  winnerPatterns: string,
  maxChars = 8000,
): string {
  const criteriaText = criteria
    .map((c, i) => `- ${c.name}: ${c.desc}`)
    .join('\n');

  const allKeys = [
    ...criteria.map((c, i) => c.name || `C${i + 1}`),
    'S1_GenericPenalty', 'S2_HedgingPenalty', 'S3_EmotionalAuthenticity',
    'S4_AISyntaxPenalty', 'S5_FluffPenalty',
  ];

  const jsonTemplate = allKeys.map(k => `"${k}": 0`).join(',');
  const jsonKeysStr = `{${jsonTemplate},"winner_similarity": 0,"feedback": "2-3 sentences: what works, what needs improvement"}`;

  // WHY: Long advertorials have 10000+ chars but judge only sees maxChars.
  //      If we just slice from start, the CTA/urgency section at the END is invisible.
  //      Solution: show first half + last quarter to capture both hook AND CTA.
  const contentForJudge = content.length <= maxChars
    ? content
    : content.slice(0, Math.floor(maxChars * 0.65))
      + '\n\n[... content continues ...]\n\n'
      + content.slice(-Math.floor(maxChars * 0.35));

  return `${personaDesc}

CONTENT TYPE: ${contentFormat.replace(/_/g, ' ').toUpperCase()}

BRIEF (what was requested):
${brief || 'Not specified'}

CONTENT TO EVALUATE:
${contentForJudge}

WINNER PATTERNS (what winning ${contentFormat}s look like):
${winnerPatterns || 'General best practices for this content type.'}

SCORE THIS CONTENT on each criterion (1-10):

${criteriaText}

ANTI-BIAS CRITERIA (applied to ALL content types):
${ANTI_BIAS_CRITERIA}

OUTPUT ONLY JSON:
${jsonKeysStr}

winner_similarity: How similar is this to winning ${contentFormat}s? (0.0 to 1.0)`;
}

// ─── Extract Text from BlockTree ─────────────────────────────────────────────

/**
 * WHY: The judge evaluates TEXT quality, not HTML or block structure.
 *      We extract all text content from body-text, testimonials, headlines, etc.
 */
function extractTextFromTree(tree: BlockTree): string {
  const texts: string[] = [];

  for (const block of tree.blocks) {
    const p = block.props;
    if (!p) continue;

    // Body text blocks — main content
    if (block.type === 'body-text' && typeof p.content === 'string') {
      texts.push(p.content);
    }
    // Headlines
    if (typeof p.headline === 'string') texts.push(p.headline);
    if (typeof p.subheadline === 'string') texts.push(p.subheadline);
    if (typeof p.text === 'string' && block.type === 'editorial-heading') texts.push(p.text);
    // Testimonials
    if (typeof p.content === 'string' && block.type === 'testimonial') texts.push(p.content);
    if (typeof p.quote === 'string') texts.push(p.quote);
    // CTAs
    if (typeof p.ctaText === 'string') texts.push(p.ctaText);
    if (typeof p.text === 'string' && block.type === 'button') texts.push(p.text);
    // Benefits
    if (Array.isArray(p.benefits)) {
      for (const b of p.benefits) {
        if (typeof b === 'string') texts.push(b);
        else if (b && typeof b.title === 'string') texts.push(b.title);
      }
    }
    // Guarantee
    if (typeof p.description === 'string' && block.type === 'guarantee') texts.push(p.description);
    // Social proof urgency text
    if (typeof p.urgencyText === 'string') texts.push(p.urgencyText);
    if (typeof p.productText === 'string') texts.push(p.productText);
  }

  return texts.join('\n\n');
}

// ─── Median Calculation ──────────────────────────────────────────────────────

function median(values: number[]): number {
  if (values.length === 0) return 5.0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  return sorted[mid];
}

// ─── LLM Call (reuse page-generator pattern) ─────────────────────────────────

async function callJudgeLlm(
  config: GeneratorConfig,
  prompt: string,
): Promise<string | null> {
  try {
    const apiKey = config.allKeys && config.allKeys.length > 1
      ? config.allKeys[Math.floor(Math.random() * config.allKeys.length)]
      : config.apiKey;

    const response = await fetch(config.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.5,
        max_tokens: 800,
      }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data.choices?.[0]?.message?.content ?? null;
  } catch {
    return null;
  }
}

// ─── Extract JSON from judge response ────────────────────────────────────────

function extractJudgeJson(raw: string): Record<string, number | string> | null {
  try {
    // Try direct parse first
    return JSON.parse(raw.trim());
  } catch {
    // Find JSON object in response
    const match = raw.match(/\{[^{}]*\}/s);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        return null;
      }
    }
    return null;
  }
}

// ─── Main Judge Function ─────────────────────────────────────────────────────

/**
 * Evaluate copywriting quality using V5 Council (3 personas).
 *
 * Source: content_producer.py judge_content()
 *
 * @param tree - The generated BlockTree to evaluate
 * @param pageType - Page type (determines which judge config to use)
 * @param brief - What was requested (product name, description, etc.)
 * @param config - LLM config for judge calls (typically DeepSeek)
 * @returns JudgeResult with scores, tier, and feedback
 */
export async function judgeContent(
  tree: BlockTree,
  pageType: PageType,
  brief: string,
  config: GeneratorConfig,
): Promise<JudgeResult | null> {
  const judgeConfig = await loadJudgeConfig(pageType);
  if (!judgeConfig) return null;

  const content = extractTextFromTree(tree);
  if (!content || content.length < 100) return null;

  const { criteria, anti_bias_weights, anti_bias_criteria, hard_caps, winner_patterns, scoring_thresholds, type_name } = judgeConfig;

  // Build weights map: criteria weights + anti-bias weights
  const weights: Record<string, number> = {};
  for (const c of criteria) {
    weights[c.name] = c.weight;
  }
  weights.S1_GenericPenalty = anti_bias_weights.S1_GenericPenalty;
  weights.S2_HedgingPenalty = anti_bias_weights.S2_HedgingPenalty;
  weights.S3_EmotionalAuthenticity = anti_bias_weights.S3_EmotionalAuthenticity;
  weights.S4_AISyntaxPenalty = anti_bias_weights.S4_AISyntaxPenalty;
  weights.S5_FluffPenalty = anti_bias_weights.S5_FluffPenalty;

  const criteriaKeys = criteria.map(c => c.name);
  const antiBiasKeys = ['S1_GenericPenalty', 'S2_HedgingPenalty', 'S3_EmotionalAuthenticity', 'S4_AISyntaxPenalty', 'S5_FluffPenalty'];

  // Call 3 personas in parallel
  const personaEntries = Object.entries(JUDGE_PERSONAS);
  const judgePromises = personaEntries.map(([personaName, personaDesc]) => {
    const prompt = buildJudgePrompt(personaDesc, criteria, content, type_name, brief, winner_patterns);
    return callJudgeLlm(config, prompt).then(result => ({ personaName, result }));
  });

  const judgeResponses = await Promise.all(judgePromises);

  // Parse scores from each judge
  const scoresList: Record<string, number | string>[] = [];
  for (const { personaName, result } of judgeResponses) {
    if (!result) continue;
    const parsed = extractJudgeJson(result);
    if (parsed) {
      scoresList.push(parsed);
    }
  }

  if (scoresList.length === 0) return null;

  // Calculate median for each criterion
  const medianScores: Record<string, number> = {};

  for (const key of criteriaKeys) {
    const values = scoresList
      .map(s => typeof s[key] === 'number' ? s[key] as number : undefined)
      .filter((v): v is number => v !== undefined);
    medianScores[key] = Math.round(median(values) * 100) / 100;
  }

  // Anti-bias medians
  for (const key of antiBiasKeys) {
    const values = scoresList
      .map(s => typeof s[key] === 'number' ? s[key] as number : undefined)
      .filter((v): v is number => v !== undefined);
    medianScores[key] = Math.round(median(values) * 100) / 100;
  }

  // Winner similarity median
  const ws = scoresList
    .map(s => typeof s.winner_similarity === 'number' ? s.winner_similarity as number : undefined)
    .filter((v): v is number => v !== undefined);
  const winnerSimilarity = ws.length > 0 ? Math.round(median(ws) * 1000) / 1000 : 0.5;

  // Weighted average
  let weightedAvg = 0;
  for (const [key, weight] of Object.entries(weights)) {
    weightedAvg += (medianScores[key] ?? 5.0) * weight;
  }

  // Apply hard caps
  let hardCapApplied: string | undefined;
  let hardCapOriginal: number | undefined;

  for (const [capKey, capConfig] of Object.entries(hard_caps)) {
    const criterionScore = medianScores[capKey] ?? 10;
    const minThreshold = capConfig.min;
    if (criterionScore < minThreshold) {
      if (weightedAvg > capConfig.cap) {
        hardCapApplied = capKey;
        hardCapOriginal = Math.round(weightedAvg * 100) / 100;
        weightedAvg = capConfig.cap;
        break;
      }
    }
  }

  const totalScore = Math.round(weightedAvg * 100) / 100;

  // Determine tier
  let tier: JudgeResult['tier'];
  if (totalScore >= scoring_thresholds.winner_elite) tier = 'elite';
  else if (totalScore >= scoring_thresholds.winner_approaching) tier = 'approaching';
  else if (totalScore >= scoring_thresholds.needs_work) tier = 'needs_work';
  else tier = 'reject';

  // Collect feedback from judges
  const feedback: string[] = [];
  for (const scores of scoresList) {
    if (typeof scores.feedback === 'string' && scores.feedback) {
      feedback.push(scores.feedback);
    }
  }

  return {
    total: totalScore,
    criteriaScores: Object.fromEntries(criteriaKeys.map(k => [k, medianScores[k]])),
    antiBiasScores: Object.fromEntries(antiBiasKeys.map(k => [k, medianScores[k]])),
    winnerSimilarity,
    tier,
    hardCapApplied,
    hardCapOriginal,
    feedback,
    judgeCount: scoresList.length,
    rawScores: scoresList,
  };
}

// ─── Judge Raw Text (3-Step Pipeline) ──────────────────────────────────────────

/**
 * Judge raw free-text copywriting (not a BlockTree).
 * WHY: The 3-step pipeline generates FREE TEXT (no JSON), then judges it BEFORE
 *      converting to blocks. This matches the lab architecture where raw text
 *      scores higher (8.57) than JSON-constrained output (6.44).
 *
 * @param rawText - The free-text copy to evaluate
 * @param pageType - Page type (determines which judge config to use)
 * @param brief - What was requested (product name, description, etc.)
 * @param config - LLM config for judge calls
 * @returns JudgeResult with scores, tier, and feedback
 */
export async function judgeRawText(
  rawText: string,
  pageType: PageType,
  brief: string,
  config: GeneratorConfig,
): Promise<JudgeResult | null> {
  if (!rawText || rawText.length < 100) return null;

  // WHY: Wrap raw text in a minimal BlockTree so the existing judge can score it.
  //      The judge extracts text from body-text blocks, so one block with all the text works.
  const tree: BlockTree = {
    version: '1.0',
    pageType,
    palette: 'health-warm' as any, // WHY: palette not needed for judging, just satisfies type
    blocks: [
      {
        id: 'raw-headline',
        type: 'hero',
        props: {
          headline: rawText.split('\n')[0] ?? '',
          subheadline: '',
          alignment: 'left',
        },
        styles: { mobile: {}, tablet: {}, desktop: {} },
        visibility: 'all' as const,
      },
      {
        id: 'raw-body',
        type: 'body-text',
        props: { content: rawText },
        styles: { mobile: {}, tablet: {}, desktop: {} },
        visibility: 'all' as const,
      },
    ],
    metadata: { title: rawText.split('\n')[0] ?? '', description: '' },
  };

  return judgeContent(tree, pageType, brief, config);
}
