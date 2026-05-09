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
  /**
   * WHY: Multi-phase output instead of single `body` string.
   *      Models compress long strings in JSON. Splitting into phases
   *      ensures each section is complete. Total target: 2000-3000 words.
   *      Non-advertorial types still use the single `body` field.
   */
  body?: string;                    // non-advertorial: single body text
  hookBody?: string;                // advertorial phase 1: opening hook (~300 words)
  painBody?: string;                // advertorial phase 2: pain agitation (~500 words)
  discoveryBody?: string;           // advertorial phase 3: discovery/science (~500 words)
  proofBody?: string;               // advertorial phase 4: social proof/results (~400 words)
  offerBody?: string;               // advertorial phase 5: urgency/offer/close (~300 words)
  benefits: string[];               // 3-5 benefit bullets
  ctaText: string;                  // primary CTA button text
  ctaSecondary?: string;            // negative opt-out text (upsell/downsell)
  guarantee?: string;               // guarantee copy
  testimonial?: {
    quote: string;
    name: string;
    detail: string;                 // "Verified Buyer" or "Lost 12 lbs in 3 weeks"
  };
  painPoint?: string;               // opening pain/agitation paragraph
  urgency?: string;                 // urgency element text
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
  'upsell': 'upsell_judge.json',
  'optin': 'fb_ad_judge.json',       // optin ≈ FB ad (short form)
  'thank-you': 'fb_ad_judge.json',   // thank-you ≈ FB ad (short form)
  'quiz': 'quiz_judge.json',
};

// Page types that use rules_only (no judge file, 8 rules prompt)
// WHY: Advertorial champion #12 uses rules_only + Dual Persona (+0.390).
//      Downsell/checkout/bridge have no judge files, so they use rules_only.
//      Upsell NOW uses D5_Lite with upsell_judge.json (champion #21).
// Source: CHAMPIONS.md #12, CHAMPION-PROMPTS-DEPLOY.md §17 Architecture Hybride
const RULES_ONLY_TYPES: PageType[] = ['advertorial', 'downsell', 'checkout', 'bridge'];

// ─── Page Type → Specialized System Prompts ──────────────────────────────────────
// WHY: Each page type has its own champion system prompt, not a generic one.
// Source: CHAMPION-PROMPTS-DEPLOY.md §1-13 (per-type system prompts)

const TYPE_SYSTEM_PROMPTS: Partial<Record<PageType, string>> = {
  // WHY: Advertorial champion #12 base rules + structure guidance.
  //      Lab uses only 8 rules, but our pipeline needs JSON output which constrains
  //      the model. Adding minimal structure + voice guidance compensates.
  //      Scored 6.44/10 (best so far) vs lab's 8.57 (plain text, no JSON).
  // Source: CHAMPIONS.md #12, CHAMPION-PROMPTS-DEPLOY.md §12
  'advertorial': `You are an elite direct-response advertorial copywriter specializing in long-form native advertising. You write advertorials that look like genuine news articles but convert like the highest-performing sales pages.

You write in FIRST PERSON as a customer sharing their personal discovery story. The reader must feel like they stumbled on a real person's blog post — NOT an ad.

Write the content following these rules:
- Write in FIRST PERSON, conversational
- Use specific numbers, timeframes, and details throughout
- Build emotional tension through failures before revealing solution
- Create a clear villain (hidden cause) and hero (simple solution)
- Include visceral emotional language
- Make the CTA feel like the INEVITABLE conclusion
- 5th-8th grade reading level, short sentences
- NEVER corporate speak, NEVER generic, NEVER hedging

BANNED WORDS: moreover, furthermore, additionally, it's important to note, in today's world, harness, embark, cutting-edge, game-changing, state-of-the-art`,

  // WHY: Product Page champion #3 — D5_Lite with e-commerce specific criteria
  // Source: CHAMPIONS.md #3, CHAMPION-PROMPTS-DEPLOY.md §3
  'product-page': `You are an elite e-commerce copywriter who specializes in writing product pages that convert. You have written product pages that have generated over $100M in revenue. You understand pricing psychology, social proof stacking, risk reversal, and urgency mechanics at the deepest level.

Write conversion-focused product page copy that drives ADD TO CART clicks. Every section must reduce friction and create urgency. Use specific numbers, named experts, and real-sounding testimonials.

SCORING FOCUS:
- Above-the-fold: rating + benefits + pricing + CTA visible without scrolling
- Pricing architecture: 3 tiers with Most Popular/Best Value tags + crossed-out prices + per-day cost
- Social proof: 4+ types distributed throughout (review count, testimonials, stats, media logos)
- Authority: Named expert with credentials that MATCH the product category
- Risk reversal: Guarantee 30+ days, mentioned 2-3 times
- Comparison table: US vs THEM with 5+ criteria
- CTA frequency: 3+ CTAs throughout, direct imperative verbs
- Urgency: Countdown, stock warning, or delivery deadline

BANNED: "Moreover", "Furthermore", "Additionally", "We are committed to", "In today's world"
NEVER use passive CTAs like "Learn More" or "Submit" — always direct: "Order Now", "Try Risk-Free", "Add to Cart"
Every sentence must be SPECIFIC to this product. If you could swap the product name → rewrite it.`,

  // WHY: VSL champion #9 — D5_Lite with video sales letter criteria
  // Source: CHAMPIONS.md #9, CHAMPION-PROMPTS-DEPLOY.md §9
  'vsl': `You are a world-class direct-response VSL (Video Sales Letter) copywriter. You write 30-60 minute video sales presentations that generate millions in revenue.

WINNING VSL STRUCTURE:
Hook (personal transformation or shocking claim) -> Personal backstory (failures, rock bottom) -> Mechanism reveal (hidden cause, simple ritual) -> Proof sequence (testimonials, before/after, authority) -> Objection handling -> FAQ soft close -> CTA with tiered pricing + urgency

SCORING FOCUS:
- Hook: Pattern interrupt that grabs attention in first 5 seconds
- Story arc: Personal failures → discovery → transformation → proof
- Mechanism: Clear villain (hidden cause) and hero (simple ritual/solution)
- Proof cascade: Multiple testimonials, before/after, authority quotes, clinical data
- Price anchoring: Show higher price first, then discount, then break to daily cost
- Multiple soft closes before final CTA
- Urgency: Limited time, limited quantity, or expiring discount

RULES:
- Write in FIRST PERSON, conversational, as if speaking directly to viewer
- Use specific numbers, timeframes, and details throughout
- Build emotional tension through repeated failures before revealing solution
- Use 'hidden', 'secret', 'loophole' language for intrigue
- Contrast 'what doctors think' with 'the truth'
- Include visceral emotional language (pain, freedom, prison, trapped)
- Make the CTA feel like the INEVITABLE conclusion
- Break down to daily cost ('just $1.30 a day')
- 5th-8th grade reading level, short sentences
- NEVER corporate speak, NEVER generic, NEVER hedging ('may help', 'could improve')`,

  // WHY: Upsell champion #21 — D5_Lite, short, urgency-driven
  // Source: CHAMPIONS.md #21, CHAMPION-PROMPTS-DEPLOY.md §21
  'upsell': `You are an elite direct-response copywriter who specializes in post-checkout upsell pages for DTC e-commerce brands. You write one-click upsell copy that converts buyers into repeat buyers immediately after their initial purchase. You understand the psychology of commitment, urgency, and loss aversion at the deepest level.

Your upsell pages are short (3-5 scrolls max), distraction-free, and designed for a single action: clicking "Yes" to add the upgrade. No navigation, no links, no clutter. Just urgency, desire, trust, and a single CTA.

SCORING FOCUS:
- Interrupt & urgency opening: "WAIT!" or "IMPORTANT!" within first 2 seconds
- Scarcity & timer: Countdown prominently near the top
- One-click offer & price anchoring: Strikethrough original vs discounted price
- Social proof: "3,500+ Happy Customers" with star rating
- Risk-reversing guarantee: Colored box directly below CTA ("bottom-of-the-bottle")
- Negative consequence on opt-out: "I understand I won't see this deal again"
- Emotional progression within 3-5 scrolls: urgency → desire → trust → action

RULES:
- Keep it SHORT — upsell copy should be 50% shorter than the main page
- Lead with the DEAL, not the story (customer already bought)
- Stack value: show what they GET vs what they PAY
- Use loss aversion: "No thanks, I don't want to save $X"
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

BANNED WORDS: moreover, furthermore, additionally, it's important to note, in today's world, harness, embark, cutting-edge, game-changing, state-of-the-art`;

// ─── Reddit Persona Prompt (Champion #12 Dual Persona) ──────────────────────────
// WHY: Lab proved Reddit persona often BEATS Copywriter persona on advertorial.
//      The "real person on Reddit" voice generates more authentic, less marketing text.
//      Champion #12: rules_only + Reddit persona → judge both → keep best.
// Source: CHAMPIONS.md #12, CHAMPION-PROMPTS-DEPLOY.md §12

export const REDDIT_PERSONA_PROMPT = `You are a regular person on Reddit sharing an honest experience. You're NOT a marketer or copywriter — you're someone who genuinely found something that worked and wants to help others. Think r/Supplements, r/health, r/Nootropics.

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
- NEVER sound like an ad, NEVER use marketing language, NEVER be salesy`;

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
  ];

  // WHY: Advertorials use multi-phase output for longer text (2000-3000 words).
  //      Single `body` field gets compressed by models. Split into 5 phases
  //      ensures each section is fully written. Total target: 2500+ words.
  //      Uses CRITICAL/MANDATORY/REQUIRED trigger words to force model compliance.
  if (pageType === 'advertorial') {
    fields.push(
      '  "hookBody": "<OPENING HOOK — CRITICAL: This field MUST contain at least 400 words. Write 5-7 full paragraphs. Do NOT summarize or abbreviate. personal story, pattern interrupt. Start with I thought... or shocking claim. Build curiosity. Use **bold** on key phrases.>"',
      '  "painBody": "<PAIN AGITATION — MANDATORY: This field MUST contain at least 550 words. Write 7-9 full paragraphs. Do NOT summarize or abbreviate. deepening the suffering, hidden cause reveal. Specific details: dates, amounts, physical sensations. Doctor visits, failed treatments, losing hope.>"',
      '  "discoveryBody": "<DISCOVERY & SCIENCE — REQUIRED: This field MUST contain at least 550 words. Write 7-9 full paragraphs. Do NOT summarize or abbreviate. the breakthrough moment, how it works. Researcher discovery, clinical study, mechanism explanation. Expert endorsement.>"',
      '  "proofBody": "<PROOF & RESULTS — OBLIGATORY: This field MUST contain at least 450 words. Write 6-8 full paragraphs. Do NOT summarize or abbreviate. testimonials, social proof, before/after. Specific results with numbers. Customer stories. Media mentions. Authority.>"',
      '  "offerBody": "<URGENCY & OFFER — NON-NEGOTIABLE: This field MUST contain at least 350 words. Write 5-6 full paragraphs. Do NOT summarize or abbreviate. limited time, guarantee, final push. Scarcity, special price, risk reversal, reassurance.>"',
    );
  } else {
    fields.push('  "body": "<main marketing copy, 2-5 paragraphs separated by \\n\\n>"');
  }

  fields.push(
    '  "benefits": ["<benefit 1>", "<benefit 2>", "<benefit 3>"]',
    '  "ctaText": "<CTA that continues the story, e.g. Check Availability Now → or See If It Still Works For Me →>"',
  );

  if (pageType === 'upsell' || pageType === 'downsell') {
    fields.push('  "ctaSecondary": "<negative opt-out text, loss aversion>"');
  }

  fields.push(
    '  "guarantee": "<guarantee text>"',
    '  "testimonial": { "quote": "<testimonial quote>", "name": "<customer name>", "detail": "<verification or result>" }',
    '  "painPoint": "<opening pain/agitation paragraph>"',
    '  "urgency": "<urgency element text>"',
  );

  const wordNote = pageType === 'advertorial'
    ? '\n\nWORD COUNT ENFORCEMENT: Your 5 body fields MUST total AT LEAST 2300 words combined. This is NON-NEGOTIABLE. Write FULL, COMPLETE paragraphs. Do NOT summarize, abbreviate, or use shortcuts. Each field is a MAJOR section of a long-form news article. Readers pay for content this long — treat each field as if it were a standalone article section.'
    : '';

  return `OUTPUT FORMAT: Return a valid JSON object with EXACTLY these fields:
{
${fields.join(',\n')}
}
${wordNote}
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
    // rules_only path — no judge file, just the rules
    // WHY: For advertorial, the system prompt already contains the 8 rules.
    //      Don't double-add RULES_ONLY_PROMPT.
    if (pageType === 'advertorial') {
      systemPrompt = `${typePrompt}

---

${buildOutputFormatInstruction(pageType)}`;
    } else {
      systemPrompt = `${typePrompt}

---

${RULES_ONLY_PROMPT}

---

${buildOutputFormatInstruction(pageType)}`;
    }
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

// ─── Free Text Prompt Builders (3-Step Pipeline) ──────────────────────────────
// WHY: The lab proves that FREE TEXT output scores 8.57/10 vs JSON output 6.44/10.
//      The JSON constraint forces the model to spend tokens on structure instead of
//      content. Free text lets the model focus 100% on copywriting quality.
//      The 3-step pipeline: free text → judge → convert to blocks.
// Source: test-results/2026-05-09-advertorial-pipeline.md

// ─── Lab-Faithful Free Text Prompt (EXACTLY like the lab) ──────────────────────
// WHY: The lab's champion #12 for advertorial is RADICALLY SIMPLE:
//      - Just 8 rules (no persona identity, no banned words, no section breakdowns)
//      - Single user message (no system/user split)
//      - Narrative brief ("Write a 1500-word advertorial for...")
//      - FREE TEXT output (no JSON)
//      This produced 8.57/10 in the lab. Our over-engineered prompt got 6.0-6.44.
//      Matching the lab's simplicity is the key to matching the score.
// Source: pipeline_v2.py, CHAMPIONS.md #12, GUIDE-IA.md

const LAB_FAITHFUL_RULES = `Write the content following these rules:
- Write in FIRST PERSON, conversational
- Use specific numbers, timeframes, and details throughout
- Build emotional tension through failures before revealing solution
- Create a clear villain (hidden cause) and hero (simple solution)
- Include visceral emotional language
- Make the CTA feel like the INEVITABLE conclusion
- 5th-8th grade reading level, short sentences
- NEVER corporate speak, NEVER generic, NEVER hedging

END STRONG: The last 400+ words must include urgency (limited time/stock), the guarantee (risk-free), and a direct recommendation to act NOW. Make the reader feel that NOT clicking = more suffering. This section is NON-NEGOTIABLE — do NOT stop writing before it is complete.

BANNED WORDS: moreover, furthermore, additionally, it's important to note, in today's world, harness, embark, cutting-edge, game-changing, state-of-the-art

TOTAL TARGET: 1800-2200 words. Write the FULL content from hook through CTA. Do NOT abbreviate, summarize, or cut off. Reaching the CTA section is MORE IMPORTANT than writing a longer story.`;

const LAB_FAITHFUL_REDDIT = `You are a regular person on Reddit sharing an honest experience. You're NOT a marketer or copywriter — you're someone who genuinely found something that worked and wants to help others. Think r/Supplements, r/health, r/Nootropics.

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

END STRONG: The last 300+ words must be your honest recommendation — mention the deal/price, the guarantee (how many days to return it), and why they should try it NOW. Make it feel like advice to a friend, not a sales pitch. This section is NON-NEGOTIABLE.

TOTAL TARGET: 1800-2200 words. Write the FULL content from hook through recommendation. Do NOT abbreviate, summarize, or cut off. Reaching the recommendation section is MORE IMPORTANT than writing a longer story.`;

/**
 * Build a lab-faithful free text prompt for Copywriter persona.
 * WHY: Matches the lab's exact prompt structure: 8 rules + narrative brief, single message.
 *      The lab's simplicity is what produces 8.57/10.
 */
export function buildFreeTextCopywriterPrompt(
  request: CopywriterRequest,
): { systemPrompt: string; userPrompt: string } {
  const { product, marketingAngle } = request;

  // WHY: Lab sends everything in a single user message (no system prompt).
  //      The model performs better with one flat prompt vs system/user split.
  const systemPrompt = '';

  // Build narrative brief (same format as lab)
  const briefParts: string[] = [];
  briefParts.push(`Write a 1800-2200 word advertorial for '${product.name}'.`);
  briefParts.push(`Target: ${product.targetAudience || 'adults seeking solution'}.`);

  // WHY: Lab brief includes specific hooks, mechanism, proof requirements
  if (product.description) {
    briefParts.push(`Product: ${product.description}`);
  }
  if (product.benefits?.length) {
    briefParts.push(`Key benefits: ${product.benefits.slice(0, 4).join(', ')}.`);
  }
  if (product.guarantee) {
    briefParts.push(`Guarantee: ${product.guarantee}.`);
  }
  if (product.price) {
    briefParts.push(`Price: ${product.price}${product.originalPrice ? ` (was ${product.originalPrice})` : ''}.`);
  }

  // Marketing angle hints (like lab's hook/mechanism/proof instructions)
  if (marketingAngle) {
    if (marketingAngle.painPoint) briefParts.push(`Hook: ${marketingAngle.painPoint}.`);
    if (marketingAngle.headline) briefParts.push(`Angle: ${marketingAngle.headline}.`);
  }

  // WHY: Lab says "Write the FULL content." — simple, no section breakdowns
  const userPrompt = `${LAB_FAITHFUL_RULES}

---

NOW WRITE:
${briefParts.join(' ')}

Write the FULL content.`;

  return { systemPrompt, userPrompt };
}

/**
 * Build a lab-faithful free text prompt for Reddit persona.
 * WHY: Same structure as lab — Reddit persona + rules + narrative brief, single message.
 */
export function buildFreeTextRedditPrompt(
  request: CopywriterRequest,
): { systemPrompt: string; userPrompt: string } {
  const { product, marketingAngle } = request;

  // WHY: Lab sends everything in a single user message (no system prompt).
  const systemPrompt = '';

  // Build narrative brief (same format as lab)
  const briefParts: string[] = [];
  briefParts.push(`Write a 1800-2200 word honest Reddit post about '${product.name}'.`);
  briefParts.push(`Target: ${product.targetAudience || 'adults seeking solution'}.`);
  if (product.description) {
    briefParts.push(`Product: ${product.description}`);
  }
  if (product.benefits?.length) {
    briefParts.push(`Key benefits: ${product.benefits.slice(0, 4).join(', ')}.`);
  }
  if (product.guarantee) {
    briefParts.push(`Guarantee: ${product.guarantee}.`);
  }
  if (product.price) {
    briefParts.push(`Price: ${product.price}${product.originalPrice ? ` (was ${product.originalPrice})` : ''}.`);
  }
  // WHY: Marketing angle gives the Reddit persona a specific mechanism/hook to write about
  if (marketingAngle) {
    if (marketingAngle.headline) briefParts.push(`Angle: ${marketingAngle.headline}.`);
    if (marketingAngle.painPoint) briefParts.push(`Focus on: ${marketingAngle.painPoint}.`);
    if (marketingAngle.benefits?.length) briefParts.push(`Key angles: ${marketingAngle.benefits.join(', ')}.`);
  }

  const userPrompt = `${LAB_FAITHFUL_REDDIT}

Write the FULL content.

---

NOW WRITE:
${briefParts.join(' ')}

Write the FULL content.`;

  return { systemPrompt, userPrompt };
}

// ─── Reddit Persona Prompt Builder ───────────────────────────────────────────
// WHY: Champion #12 Dual Persona — generate with both Copywriter + Reddit,
//      judge both, keep the best. Reddit persona often wins on advertorial.
// Source: CHAMPIONS.md #12

export function buildRedditPersonaPrompt(
  request: CopywriterRequest,
): { systemPrompt: string; userPrompt: string } {
  const { product, marketingAngle, pageType } = request;

  const systemPrompt = REDDIT_PERSONA_PROMPT;

  const userParts: string[] = [];
  userParts.push(`Share your honest experience about this product. Be real, be specific, be skeptical at first.`);

  userParts.push(`\nProduct: ${product.name}`);
  userParts.push(`Description: ${product.description}`);

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

  if (marketingAngle) {
    if (marketingAngle.painPoint) userParts.push(`Pain Point to address: ${marketingAngle.painPoint}`);
  }

  // WHY: Same JSON output format as Copywriter so Dual Persona pick-best works.
  //      Reddit persona fills the same 5 phases but in authentic Reddit voice.
  if (pageType === 'advertorial') {
    userParts.push(`

OUTPUT FORMAT: Return a valid JSON object with EXACTLY these fields:
{
  "headline": "<your Reddit post title, max 80 chars, like a real Reddit title>",
  "subheadline": "<1-2 sentence tl;dr>",
  "hookBody": "<Your opening — the skepticism, the backstory. 350-450 words minimum. Write like a real Reddit post. Use casual language.>",
  "painBody": "<The worst of it — specific failures, money wasted, side effects. 500-600 words minimum. Be brutally honest.>",
  "discoveryBody": "<How you found it, the research rabbit hole, why it's different. 500-600 words minimum. Include specific study details.>",
  "proofBody": "<Your results timeline + other people's results. 400-500 words minimum. Specific numbers, days, measurements.>",
  "offerBody": "<Your honest recommendation, the deal, the guarantee. 350-450 words minimum. Make it feel like advice to a friend.>",
  "benefits": ["<benefit 1>", "<benefit 2>", "<benefit 3>"],
  "ctaText": "<a natural recommendation, like 'check it out' or 'worth a shot'>",
  "guarantee": "<guarantee text>",
  "testimonial": { "quote": "<a real-sounding user quote>", "name": "<username>", "detail": "<result>" },
  "painPoint": "<the #1 struggle>",
  "urgency": "<why they shouldn't wait>"
}

WORD COUNT ENFORCEMENT: Your 5 body fields MUST total AT LEAST 2300 words combined. This is NON-NEGOTIABLE. Write FULL, COMPLETE paragraphs.

Return ONLY the JSON object. No preamble, no markdown, no code fences.`);
  } else {
    userParts.push('\nReturn JSON: {"headline": "...", "body": "...(full story)...", "benefits": [...], "ctaText": "..."}');
  }

  return { systemPrompt, userPrompt: userParts.join('\n') };
}
