/**
 * Purpose: Champion Copywriter Agent — generates high-quality marketing text
 *          using proven D5_Lite and rules_only prompts from lab testing.
 * Dependencies: judges/*.json (winner patterns + criteria)
 * Related: src/services/page-generator.ts (consumer), src/agents/prompts/block-composer.ts (composer)
 * Reference: CHAMPION-PROMPTS-DEPLOY.md (source of truth for prompts)
 *
 * WHY: MiMo generates mediocre copywriting. DeepSeek + champion prompts produce
 *      text that scores 8+ out of 10 on lab judges. Separating copywriting from
 *      composition lets each model play to its strength.
 *
 * ARCHITECTURE: Two-call pipeline
 *   Call 1: Copywriter (DeepSeek, this file) -> CopywriterOutput (text)
 *   Call 2: Composer (MiMo, block-composer.ts) -> BlockTree JSON (structure + text)
 */

import type { PageType } from '../../design-system/tokens';

// ─── Copywriter Output (contract between copywriter and composer) ────────────────

export interface CopywriterOutput {
  headline: string;
  subheadline: string;
  body: string;              // main marketing copy (2-5 paragraphs, newline-separated)
  benefits: string[];        // 3-5 benefit bullets
  ctaText: string;           // primary CTA button text
  ctaSecondary?: string;     // negative opt-out text (upsell/downsell)
  guarantee?: string;        // guarantee copy
  testimonial?: {
    quote: string;
    name: string;
    detail: string;          // "Verified Buyer" or "Lost 12 lbs in 3 weeks"
  };
  painPoint?: string;        // opening pain/agitation paragraph
  urgency?: string;          // urgency element text
}

// ─── Page Type → Judge File Mapping ──────────────────────────────────────────────
// WHY: Maps ECOM-AI page types to lab judge configs. Only page types with
//      judge files get the D5_Lite treatment. Others use rules_only.
// Source: CHAMPION-PROMPTS-DEPLOY.md "JUDGE CONFIG FILES NEEDED" table

// WHY: Only page types with a V2 judge file get the D5_Lite treatment.
//      Advertorial is intentionally EXCLUDED — its champion (#12) uses rules_only,
//      not D5_Lite. D5_Lite is archive/fallback for advertorial.
// Source: CHAMPIONS.md #12, CHAMPION-PROMPTS-DEPLOY.md §17
const JUDGE_FILE_MAP: Partial<Record<PageType, string>> = {
  'product-page': 'product_page_judge_v2.json',
  'vsl': 'vsl_judge_v2.json',
  'optin': 'fb_ad_judge.json',       // optin ≈ FB ad (short form)
  'thank-you': 'fb_ad_judge.json',   // thank-you ≈ FB ad (short form)
  'quiz': 'quiz_judge.json',
};

// Page types that use rules_only (no judge file, 8 rules prompt)
// WHY: Advertorial champion #12 uses rules_only + Dual Persona (+0.390).
//      Upsell/downsell/checkout are transactional pages where D5_Lite is overkill.
// Source: CHAMPIONS.md #12, CHAMPION-PROMPTS-DEPLOY.md §17 Architecture Hybride
const RULES_ONLY_TYPES: PageType[] = ['advertorial', 'upsell', 'downsell', 'checkout', 'bridge'];

// ─── Page Type → Specialized System Prompts ──────────────────────────────────────
// WHY: Each page type has its own champion system prompt, not a generic one.
// Source: CHAMPION-PROMPTS-DEPLOY.md §1-13 (per-type system prompts)

const TYPE_SYSTEM_PROMPTS: Partial<Record<PageType, string>> = {
  // WHY: Advertorial champion #12 uses rules_only (not D5_Lite).
  //      Dual Persona is handled at the page-generator level (2 calls, pick best).
  // Source: CHAMPIONS.md #12, CHAMPION-PROMPTS-DEPLOY.md §12
  'advertorial': `You are an elite direct-response advertorial copywriter. You write native advertising that reads like genuine journalism but sells like a late-night infomercial.

FORMAT: Write as a first-person customer confession / personal discovery story. The reader should feel like they stumbled on a real person's blog post — NOT an ad.

STRUCTURE:
1. PATTERN INTERRUPT opening (shocking personal claim, never "Are you tired of...")
2. Relatable failure story (specifics: dates, amounts, physical sensations)
3. Hidden cause / mechanism reveal (reframes the problem entirely)
4. Discovery moment (the "I tried everything and this ONE thing worked")
5. Proof cascade (specific results: "lost 12 lbs in 3 weeks", "saved $847")
6. Objection demolition (embed naturally, never as FAQ)
7. Risk reversal (guarantee that removes all fear)
8. CTA that feels like the INEVITABLE conclusion

VOICE: Raw, conversational, 5th-8th grade reading level. Like a smart friend sharing a desperate 2AM discovery. Short paragraphs (1-3 sentences). Strategic bold for scannability.

NEVER: corporate speak, hedging ("may help", "could improve"), "Moreover", "Furthermore", "Additionally", "It's important to note that", "In today's world"`,

  'product-page': `You are an elite e-commerce copywriter who specializes in writing product pages that convert. You have written product pages that have generated over $100M in revenue. You understand pricing psychology, social proof stacking, risk reversal, and urgency mechanics at the deepest level.

Write conversion-focused product page copy that drives ADD TO CART clicks. Every section must reduce friction and create urgency. Use specific numbers, named experts, and real-sounding testimonials.`,

  'vsl': `You are a world-class direct-response VSL (Video Sales Letter) copywriter. You write 30-60 minute video sales presentations that generate millions in revenue.

WINNING VSL STRUCTURE:
Hook (personal transformation or shocking claim) -> Personal backstory (failures, rock bottom) -> Mechanism reveal (hidden cause, simple ritual) -> Proof sequence (testimonials, before/after, authority) -> Objection handling -> FAQ soft close -> CTA with tiered pricing + urgency

RULES:
- Write in FIRST PERSON, conversational, as if speaking directly to viewer
- Use specific numbers, timeframes, and details throughout
- Build emotional tension through repeated failures before revealing solution
- Create a clear villain (hidden cause) and hero (simple ritual)
- Use 'hidden', 'secret', 'loophole' language for intrigue
- Contrast 'what doctors think' with 'the truth'
- Include visceral emotional language (pain, freedom, prison, trapped)
- Make the CTA feel like the INEVITABLE conclusion
- Price anchoring: show higher price first, then discount
- Break down to daily cost ('just $1.30 a day')
- Multiple soft closes before final CTA
- 5th-8th grade reading level, short sentences
- NEVER corporate speak, NEVER generic, NEVER hedging ('may help', 'could improve')`,

  // WHY: Upsell champion #21 — short, punchy, urgency-driven
  'upsell': `You are a master of one-time-offer copywriting. You write upsell pages that convert at 30%+ by creating irresistible urgency and value stacking.

RULES:
- Keep it SHORT — upsell copy should be 50% shorter than the main page
- Lead with the DEAL, not the story (customer already bought)
- Stack value: show what they GET vs what they PAY
- Use loss aversion: "No thanks, I don't want to save $X"
- Create genuine urgency (limited time, limited quantity)
- One clear CTA, no confusion
- 5th-8th grade reading level`,

  'downsell': `You are a master of downsell copywriting. You write pages that save sales when customers say no to the upsell.

RULES:
- Acknowledge their decision ("I understand...")
- Offer reduced version at lower price (still valuable)
- Same guarantee applies
- Simple yes/no CTA
- Keep it SHORT — even shorter than upsell
- Loss aversion on the opt-out`,

  'checkout': `You are a checkout page copywriter who maximizes completion rates.

RULES:
- Minimal text — the checkout page should reduce friction
- Trust signals (SSL, badges, guarantees)
- Order summary with clear pricing
- One-click order bump if applicable
- Clear CTA with amount
- No distractions, no navigation`,

  'bridge': `You are a bridge page copywriter. Bridge pages connect an ad to an offer.

RULES:
- Very short (100-200 words max)
- Maintain the curiosity gap from the ad
- Prime the reader for the main offer
- Single CTA that leads to the main page
- Match the tone/angle of the referring ad`,
};

// Base system prompt for types without specialized prompt
// Source: CHAMPION-PROMPTS-DEPLOY.md §1
const BASE_SYSTEM_PROMPT = `You are an elite direct-response copywriter with 20 years of experience writing high-converting marketing content. You understand buyer psychology, emotional triggers, and persuasion techniques at the deepest level.

CORE RULES:
1. Write from CUSTOMER perspective (first-person confession/testimonial), NEVER company/seller
2. Use 5th-8th grade reading level. Most sentences under 15 words. Short paragraphs (1-3 sentences)
3. Every claim must be SPECIFIC (numbers, dates, names, physical sensations)
4. Introduce ONE Big Idea / Unique Mechanism that reframes the problem
5. Open with a PATTERN INTERRUPT (never "Are you tired of..." or "In today's world...")
6. Create ESCALATING emotional tension (fear → recognition → surprise → hope → conviction → urgency)
7. Distribute proof throughout (never cluster testimonials in one block)
8. Preempt objections BEFORE they form (never use FAQ section)
9. Never use: "Moreover", "Furthermore", "Additionally", "It's important to note that"
10. End with CTA that feels like the INEVITABLE CONCLUSION of the story

VOICE: Conversational, raw, like a smart friend sharing a desperate 2AM discovery.
FORMAT: Short paragraphs, generous white space, strategic bold for scannability.`;

// ─── Rules_Only Prompt (8 rules) ─────────────────────────────────────────────────
// Source: CHAMPION-PROMPTS-DEPLOY.md §14

const RULES_ONLY_PROMPT = `Write the content following these rules:
- Write in FIRST PERSON, conversational
- Use specific numbers, timeframes, and details throughout
- Build emotional tension through failures before revealing solution
- Create a clear villain (hidden cause) and hero (simple solution)
- Include visceral emotional language
- Make the CTA feel like the INEVITABLE conclusion
- 5th-8th grade reading level, short sentences
- NEVER corporate speak, NEVER generic, NEVER hedging

BANNED WORDS: moreover, furthermore, additionally, it's important to note, in today's world, unlock, discover (as verb), harness, embark, revolutionize, cutting-edge, game-changing, state-of-the-art`;

// ─── Judge Data Loading ──────────────────────────────────────────────────────────

interface JudgeData {
  criteria: Array<{ name: string; weight: number; desc: string }>;
  winner_patterns: string | string[];
  structural_patterns: string[];
  psychological_patterns: string[];
  language_patterns: string[];
  differentiators: string[];
  power_words: string[];
}

// WHY: Cache avoids filesystem reads on every generation call.
// Judge files are small (~20KB), loaded once, cached forever.
const _judgeCache = new Map<string, JudgeData>();

async function loadJudgeData(pageType: PageType): Promise<JudgeData | null> {
  const filename = JUDGE_FILE_MAP[pageType];
  if (!filename) return null;

  if (_judgeCache.has(filename)) return _judgeCache.get(filename)!;

  try {
    const { readFile } = await import('fs/promises');
    const { join } = await import('path');
    const filePath = join(process.cwd(), 'judges', filename);
    const raw = await readFile(filePath, 'utf-8');
    const data = JSON.parse(raw) as JudgeData;
    _judgeCache.set(filename, data);
    return data;
  } catch {
    // Judge file not found — graceful degradation to rules_only
    return null;
  }
}

// ─── Build Patterns Section ──────────────────────────────────────────────────────
// Source: CHAMPION-PROMPTS-DEPLOY.md §2 "Patterns Loading Code" (Python translation)
// WHY: Exact same format as the Python load_patterns() function

function buildPatternsSection(judge: JudgeData): string {
  const parts: string[] = [];

  if (judge.winner_patterns) {
    const wp = typeof judge.winner_patterns === 'string'
      ? judge.winner_patterns
      : judge.winner_patterns.join('\n');
    parts.push(`WINNER PATTERNS:\n${wp}`);
  }

  if (judge.structural_patterns?.length) {
    parts.push('STRUCTURAL PATTERNS:\n' + judge.structural_patterns.map(p => `- ${p}`).join('\n'));
  }

  if (judge.differentiators?.length) {
    parts.push('WHAT WINNERS DO DIFFERENTLY:\n' + judge.differentiators.map(p => `- ${p}`).join('\n'));
  }

  if (judge.power_words?.length) {
    parts.push('POWER WORDS: ' + judge.power_words.join(', '));
  }

  if (judge.psychological_patterns?.length) {
    parts.push('PSYCHOLOGICAL TRIGGERS:\n' + judge.psychological_patterns.map(p => `- ${p}`).join('\n'));
  }

  if (judge.language_patterns?.length) {
    parts.push('LANGUAGE PATTERNS:\n' + judge.language_patterns.map(p => `- ${p}`).join('\n'));
  }

  return parts.join('\n\n');
}

// ─── Build Scoring Rules ─────────────────────────────────────────────────────────
// WHY: Full criteria descriptions (not truncated) so the model understands scoring
// Source: CHAMPION-PROMPTS-DEPLOY.md §2 "SCORING RULES" per champion

function buildScoringRules(judge: JudgeData): string {
  const criteriaLines = judge.criteria.map(c =>
    `- ${c.name} (${(c.weight * 100).toFixed(0)}%): ${c.desc}`
  ).join('\n');

  return `YOUR OUTPUT WILL BE SCORED. KEY SCORING RULES:
${criteriaLines}`;
}

// ─── Output Format Instruction ───────────────────────────────────────────────────

function buildOutputFormatInstruction(pageType: PageType): string {
  const fields: string[] = [
    '  "headline": "<hero headline, max 80 chars>"',
    '  "subheadline": "<supporting subheadline, 1-2 sentences>"',
    '  "body": "<main marketing copy, 2-5 paragraphs separated by \\n\\n>"',
    '  "benefits": ["<benefit 1>", "<benefit 2>", "<benefit 3>"]',
    '  "ctaText": "<primary CTA button text, ALL CAPS>"',
  ];

  if (pageType === 'upsell' || pageType === 'downsell') {
    fields.push('  "ctaSecondary": "<negative opt-out text, loss aversion>"');
  }

  fields.push('  "guarantee": "<guarantee text>"');
  fields.push('  "testimonial": { "quote": "<testimonial quote>", "name": "<customer name>", "detail": "<verification or result>" }');
  fields.push('  "painPoint": "<opening pain/agitation paragraph>"');
  fields.push('  "urgency": "<urgency element text>"');

  return `OUTPUT FORMAT: Return a valid JSON object with EXACTLY these fields:
{
${fields.join(',\n')}
}

Return ONLY the JSON object. No preamble, no markdown, no code fences.`;
}

// ─── Copywriter Request ──────────────────────────────────────────────────────────

export interface CopywriterRequest {
  pageType: PageType;
  product: {
    name: string;
    description: string;
    price?: string;
    originalPrice?: string;
    niche?: string;
    targetAudience?: string;
    benefits?: string[];
    guarantee?: string;
    imageUrl?: string;
  };
  marketingAngle?: {
    headline?: string;
    subheadline?: string;
    ctaText?: string;
    benefits?: string[];
    guarantee?: string;
    painPoint?: string;
  };
}

// ─── Main Prompt Builder ─────────────────────────────────────────────────────────

/**
 * Build the copywriter system prompt + user prompt.
 * Routes to D5_Lite or rules_only based on page type.
 *
 * D5_Lite path: specialized system prompt + judge patterns + scoring rules
 * rules_only path: base system prompt + 8 rules
 *
 * Source: CHAMPION-PROMPTS-DEPLOY.md §17 "Architecture Hybride DEFINITIVE"
 */
export async function buildCopywriterPrompt(
  request: CopywriterRequest,
): Promise<{ systemPrompt: string; userPrompt: string }> {
  const { pageType, product, marketingAngle } = request;
  const useRulesOnly = RULES_ONLY_TYPES.includes(pageType);
  const judge = await loadJudgeData(pageType);

  // Pick the right system prompt for this page type
  const typePrompt = TYPE_SYSTEM_PROMPTS[pageType] ?? BASE_SYSTEM_PROMPT;

  let systemPrompt: string;

  if (useRulesOnly || !judge) {
    // rules_only path — no judge file, just the 8 rules
    // Source: CHAMPION-PROMPTS-DEPLOY.md §14
    systemPrompt = `${typePrompt}

---

${RULES_ONLY_PROMPT}

---

${buildOutputFormatInstruction(pageType)}`;
  } else {
    // D5_Lite path — patterns from judge JSON + scoring rules
    // Source: CHAMPION-PROMPTS-DEPLOY.md §2 "Full Assembly Pattern"
    systemPrompt = `${typePrompt}

---

HERE ARE THE PATTERNS THAT MAKE WINNING COPY:

${buildPatternsSection(judge)}

---

${buildScoringRules(judge)}

---

${buildOutputFormatInstruction(pageType)}`;
  }

  // Build user prompt with product context + marketing angle
  const userParts: string[] = [];

  const briefLabel = useRulesOnly ? 'rules' : 'patterns + scoring rules';
  userParts.push(`NOW WRITE THE FOLLOWING (apply ${briefLabel} above):

Product: ${product.name}
Description: ${product.description}`);

  if (product.price) {
    userParts.push(`Price: $${product.price}`);
    if (product.originalPrice) userParts.push(`Original Price: $${product.originalPrice}`);
  }

  if (product.niche) userParts.push(`Niche: ${product.niche}`);
  if (product.targetAudience) userParts.push(`Target Audience: ${product.targetAudience}`);
  if (product.guarantee) userParts.push(`Guarantee: ${product.guarantee}`);
  if (product.benefits?.length) {
    userParts.push(`Key Benefits:\n${product.benefits.map(b => `  - ${b}`).join('\n')}`);
  }

  // Marketing angle — optional direction (not verbatim)
  if (marketingAngle) {
    const angleParts: string[] = ['\nMARKETING ANGLE (use as direction, NOT verbatim):'];
    if (marketingAngle.headline) angleParts.push(`  Direction: ${marketingAngle.headline}`);
    if (marketingAngle.subheadline) angleParts.push(`  Support: ${marketingAngle.subheadline}`);
    if (marketingAngle.ctaText) angleParts.push(`  CTA Direction: ${marketingAngle.ctaText}`);
    if (marketingAngle.painPoint) angleParts.push(`  Pain Point: ${marketingAngle.painPoint}`);
    if (marketingAngle.benefits?.length) angleParts.push(`  Benefit Themes: ${marketingAngle.benefits.join(', ')}`);
    userParts.push(angleParts.join('\n'));
  }

  userParts.push('\nOUTPUT THE JSON NOW.');

  return { systemPrompt, userPrompt: userParts.join('\n') };
}
