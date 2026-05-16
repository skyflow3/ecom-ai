/**
 * Purpose: SCANNER Agent — Autonomous Market Opportunity Discovery.
 *          Discovers mass desires, emotional drivers, and natural market segments
 *          from product category research. Feeds into agent-research.ts.
 * Dependencies: None (pure prompt builder)
 * Related: agent-research.ts (consumer), agent-angle.ts (downstream)
 *
 * WHY: Autonomous agents need to discover WHAT the market wants before
 *      deciding HOW to sell to them. This prompt combines:
 *      - SOP-Mass-Desire-Research-Gemini: Desire vs Feature distinction, saturation methodology
 *      - Foundational-Research-SOP: Sequential phases, avatar, beliefs
 *      - Deep-Psychographic-Avatar: Evidence-first mandate
 *      - Guide-Market-Research-Questions: 14 universal questions as completeness checklist
 *      - Reddit Research SOP: Acute/Chronic language, scoring methodology
 *
 * ARCHITECTURE:
 *   ScannerInput → buildScannerPrompt() → LLM → ScannerOutput → agent-research.ts
 *
 * QUALITY: This prompt has NOT been lab-tested yet. Test in testing-ai-prompt before production.
 */

// ─── Input Types ──────────────────────────────────────────────────────────────────

export interface ScannerInput {
  /** Product category (e.g., "Health & Wellness", "Pet Care", "Skincare", "Fitness Equipment") */
  productCategory: string;
  /** What the product does (1-3 sentences) */
  productDescription: string;
  /** Specific product name (optional, for competitor analysis) */
  productName?: string;
  /** Competitor URLs or names for competitive validation (optional) */
  competitors?: string[];
  /** How deep to research */
  searchDepth: 'quick' | 'standard' | 'deep';
  /** Pre-collected research data (for testing mode without search) */
  researchData?: string;
}

// ─── Output Types ──────────────────────────────────────────────────────────────────

export interface SurfaceDesire {
  /** The desire as "I want [outcome]" — ONE outcome, max 10 words */
  statement: string;
  /** How many times this appeared across sources */
  frequency: number;
  /** Number of distinct platforms where this appeared */
  platformDiversity: number;
  /** Percentage of total mentions */
  percentOfTotal: number;
  /** 3-5 exact quotes from sources */
  sampleQuotes: string[];
  /** Which emotional desires drive this surface desire (IDs) */
  emotionalDriverIds: string[];
}

export interface EmotionalDesire {
  /** The emotion as "I'm [emotion] [specific manifestation]" — max 12 words */
  statement: string;
  /** Category: fear | guilt_shame | frustration_anger | sadness_grief | love_protection | pride_confidence */
  category: 'fear' | 'guilt_shame' | 'frustration_anger' | 'sadness_grief' | 'love_protection' | 'pride_confidence';
  /** How many times this appeared */
  frequency: number;
  /** Average intensity 1-5 (1=calm, 3=frustrated, 5=crisis-level) */
  avgIntensity: number;
  /** Which surface desires this emotion drives (IDs) */
  drivesSurfaceDesireIds: string[];
  /** 3-5 exact quotes showing this emotion */
  sampleQuotes: string[];
}

export interface NaturalSegment {
  /** Segment name (e.g., "The Anxious Protector", "The Frustrated Problem-Solver") */
  name: string;
  /** Dominant emotional driver */
  coreEmotion: string;
  /** Top 3-5 surface desires for this segment */
  topDesires: string[];
  /** Behavioral indicators (what they DO, not demographics) */
  behavioralIndicators: string[];
  /** Language patterns unique to this segment */
  languagePatterns: string[];
  /** Estimated market share (rough) */
  estimatedShare: 'dominant' | 'large' | 'medium' | 'small';
}

export interface ScannerOutput {
  /** Executive summary */
  executiveSummary: {
    /** Total sources analyzed */
    sourcesAnalyzed: number;
    /** Platform breakdown */
    platformBreakdown: Record<string, number>;
    /** Top 3 desires (ranked) */
    topDesires: string[];
    /** Confidence level in findings */
    confidence: 'high' | 'medium' | 'low';
    /** Reason for confidence level */
    confidenceReason: string;
  };
  /** Surface desires ranked by frequency (3-5, only those meeting threshold) */
  surfaceDesires: SurfaceDesire[];
  /** Emotional desires ranked by frequency + intensity (3-5) */
  emotionalDesires: EmotionalDesire[];
  /** Emotion-to-Surface mapping */
  emotionSurfaceMap: Array<{
    surfaceDesireId: string;
    emotionId: string;
    cooccurrencePct: number;
  }>;
  /** Natural market segments based on desire clustering */
  naturalSegments: NaturalSegment[];
  /** Niche scoring aligned with Architecture Finale.md §20 */
  nicheScore: {
    /** Market volume score 0-10 (search volume, product count, forum activity) */
    volumeScore: number;
    /** Pain intensity score 0-10 (emotional weight of primary pain points) */
    painIntensityScore: number;
    /** Market gap score 0-10 (unmet needs, competitor blind spots) */
    marketGapScore: number;
    /** Trend score 0-10 (growth trajectory, seasonal momentum) */
    trendScore: number;
    /** Weighted overall: Volume×0.25 + Pain×0.35 + Gap×0.25 + Trend×0.15 (§20 formula) */
    overallScore: number;
    /** Reasoning for each score component */
    reasoning: {
      volume: string;
      painIntensity: string;
      marketGap: string;
      trend: string;
    };
  };
  /** Honest assessment — what was surprising, what didn't make the cut */
  honestAssessment: {
    surprises: string[];
    expectedButNotFound: string[];
    dataLimitations: string[];
    anomalies: string[];
  };
  /** Research quality metrics */
  researchQuality: {
    /** Did we reach saturation? (repetition > new findings in last 100 sources) */
    saturationReached: boolean;
    /** Platform diversity score (how many different platforms contributed) */
    platformDiversityScore: number;
    /** Overall confidence per desire (1-10) */
    desireConfidence: Array<{ desire: string; confidence: number; reason: string }>;
  };
}

// ─── Source Targets by Depth ────────────────────────────────────────────────────────

const SOURCE_TARGETS: Record<string, { min: number; ideal: number }> = {
  quick: { min: 50, ideal: 100 },
  standard: { min: 200, ideal: 500 },
  deep: { min: 500, ideal: 1000 },
};

// ─── Prompt Builder ─────────────────────────────────────────────────────────────────

/**
 * Build the SCANNER agent prompt — discovers market opportunities.
 * Returns system + user prompts for the LLM.
 */
export function buildScannerPrompt(input: ScannerInput): { system: string; user: string } {
  const targets = SOURCE_TARGETS[input.searchDepth];
  const hasResearchData = !!input.researchData;

  const system = `You are an autonomous MARKET OPPORTUNITY SCANNER — a senior direct-response strategist and consumer psychologist.

Your job: Discover WHAT the market DESIRES (not what they say about products, but what they actually WANT as OUTCOMES).

You are a REPORTER, not a novelist. Report what the market says, not what you think they should say.

## YOUR MISSION

Given a product category and description, analyze market data to produce a structured OPPORTUNITY REPORT identifying:
1. Surface Desires (outcomes people want BY USING the product)
2. Emotional Desires (feelings driving those surface desires)
3. Natural Market Segments (groups clustered by desire profiles)
4. Research Quality Assessment (confidence, saturation, limitations)

## METHODOLOGY (6 Steps)

### STEP 1: DESIRE DISCOVERY

The FUNDAMENTAL distinction — get this wrong and everything fails:

DESIRES = Outcomes people GET BY USING the product
- Health outcomes, behavioral changes, problems prevented, experiences, transformations, financial outcomes
- Test: "Is this something they GET BY USING the product?" If yes = desire.

NOT desires (these are PRODUCT REQUIREMENTS — do NOT include them):
- Usability characteristics ("easy to clean", "simple to use")
- Material specifications ("stainless steel", "organic")
- Technical features ("wireless", "quiet", "waterproof")
- Mechanical functions ("eliminates bacteria", "removes dust")
- Test: "Is this something they want the product TO BE?" If yes = product requirement, NOT desire.

THE 3 COMMON TRAPS:
1. "I want to spend less time [doing maintenance]" = usability requirement, NOT desire
2. "I want to eliminate [mechanical thing]" = mechanical function, NOT desire
3. "I want [product] that is [adjective]" = product requirement, NOT desire

Language patterns that reveal TRUE desires:
- "I want my [pet/child/body] to [health/behavior outcome]"
- "I want to prevent [specific consequence]"
- "I want to avoid [costly consequence]"
- "I want to feel [state]"
- "I'm trying to [achieve outcome]"

Format each desire as: "I want [outcome]" — ONE desire = ONE outcome, max 10 words, no compound statements, no em-dashes, no semicolons.

VERIFICATION (4 questions per desire — ALL must be YES):
1. Does this describe something that HAPPENS by using the product?
2. Is this about beneficiary health/behavior/experience?
3. Is this about a life outcome/transformation?
4. Could this exist independent of product design?

If ANY answer is NO → it's a product requirement, move to separate log.

### STEP 2: KEYWORD FREQUENCY TRACKING

Track 5 keyword categories throughout all sources:
1. MEDICAL/HEALTH TERMS: conditions, diseases, symptoms mentioned
2. PAIN POINT TERMS: descriptive problem words (exact phrasing)
3. EMOTIONAL INTENSITY TERMS: strong emotion signals (ALL CAPS, exclamations, extreme words)
4. OUTCOME/BENEFIT TERMS: positive result descriptors
5. AUTHORITY/INFLUENCE TERMS: who/what influences decisions (doctors, friends, influencers, studies)

Rules: Count variations together ("UTI" + "urinary tract infection" = one group). Note exact phrasing. Track intensity modifiers. Track positive/negative context.

### STEP 3: EMOTIONAL DESIRE DISCOVERY

Categorize emotions into 6 CORE categories using these keyword signals:

1. FEAR — Keywords: "scared", "afraid", "worried", "terrified", "what if", "anxious"
   Example: "I'm terrified something will happen while I'm at work"
2. GUILT/SHAME — Keywords: "bad [role]", "should have", "embarrassed", "failing", "not good enough"
   Example: "I feel like a terrible pet parent for not noticing sooner"
3. FRUSTRATION/ANGER — Keywords: "frustrated", "sick of", "hate", "fed up", "tired of", "nothing works"
   Example: "I'm furious that I spent $200 on something that made it WORSE"
4. SADNESS/GRIEF — Keywords: "heartbroken", "devastated", "regret", "lost", "miss", "used to"
   Example: "I miss being able to do [activity] without pain"
5. LOVE/PROTECTION — Keywords: "love", "protect", "keep safe", "my baby", "precious", "would do anything"
   Example: "I'd pay anything to keep my [loved one] safe from this"
6. PRIDE/CONFIDENCE — Keywords: "proud", "confident", "smart choice", "finally", "best decision"
   Example: "I finally feel like I'm doing right by my [pet/child/body]"

Format: "I'm [emotion] [specific manifestation]" or "I feel [emotion] [trigger]" — max 12 words.

Score each emotional desire:
- FREQUENCY: How many times this emotion pattern appeared (1-10 scale)
- INTENSITY: Average emotional weight (1-5 scale where 1=calm, 3=controlled frustration, 5=crisis/extreme)
- COMBINED: (Frequency + Intensity) / 2

### STEP 4: EMOTION-TO-SURFACE MAPPING

Map which emotional desires drive which surface desires.

CRITICAL RULE: Emotions SHOULD repeat across surface desires. This is CORRECT behavior. Fear can drive both "I want to prevent crisis" and "I want peace of mind." Do NOT seek uniqueness.

THRESHOLD for inclusion:
- Emotion must appear in at least 10% of mentions for that specific surface desire
- At least 5 distinct instances
- Minimum 3 emotional drivers per surface desire

### STEP 5: SEGMENT IDENTIFICATION

Identify natural market segments based on DESIRE CLUSTERING (not demographics):
- Which desires appear together in the same customer voice?
- What distinct "desire profiles" emerge?

For each segment:
- Core emotional driver (dominant emotion)
- Top 3-5 surface desires
- Behavioral indicators (what they DO — search patterns, purchase patterns, avoidance behaviors)
- Language patterns unique to this segment
- Estimated market share (rough)

Example segments:
- "The Anxious Protector" (fear-dominated, prevention-focused)
- "The Frustrated Problem-Solver" (frustration-dominated, has tried many solutions)
- "The Guilt-Driven Caretaker" (guilt-dominated, identity-based)

### STEP 6: QUALITY ASSESSMENT

Report research quality with HONESTY:
- Saturation: Did we stop finding new desires in the last 100 sources?
- Platform diversity: How many distinct platforms contributed data?
- Confidence per desire: Score each desire 1-10 with reason
- Limitations: What data gaps exist? What couldn't we verify?

THE "NO FORCING" RULE: If you're thinking "I need one more to hit 5 desires," STOP. Report what the data shows. It is better to report 3 well-evidenced desires than 5 where the last two are speculative.

## ACUTE vs CHRONIC LANGUAGE

Classify key findings as:
- ACUTE: Writing from inside a crisis moment. Pain is happening RIGHT NOW. (Better for urgent, fear-based angles)
- CHRONIC: Writing from exhausted long-term acceptance. Desperation has flattened into resignation. (Better for empathy-based, "I've been there" angles)

Both are valuable. Both represent different advertising entry points.

## SCORING METHODOLOGY

For every emotional tension and desire, provide three scores:
- Frequency Score (1-10): 1 = fewer than 5 sources, 10 = 50+ sources
- Emotional Intensity Score (1-10):
  - 1-3: Calm, clinical, no emotional markers
  - 4-6: Frustration, disappointment, worry (controlled)
  - 7-9: Desperation, grief, shame, rage, hopelessness
  - 10: Person at or past their limit — self-abandonment, surrender, crisis
- Combined Score: (Frequency + Intensity) / 2, rounded to 1 decimal

If insufficient direct language exists: write "Insufficient direct language to score with confidence" and do NOT assign a score.

## EVIDENCE RULES (MANDATORY)

1. Every claim MUST be backed by at least 2 direct quotes with source platform
2. DO NOT paraphrase — quote exactly as written including grammatical errors, informal spelling
3. DO NOT infer emotions not directly expressed in the text
4. Emotion MUST be linguistically present in the words, not assumed from context
5. Track frequency across platforms — a phrase pattern across 12 posts > a phrase appearing once
6. Weight ORIGINAL POSTS more heavily than comments (OPs are more emotionally raw)
7. Upvotes/helpfulness = community validation signal — note high-validation quotes separately

## 14 UNIVERSAL RESEARCH QUESTIONS (Completeness Checklist)

Verify your report answers ALL of these:
1. What do people want?
2. What are they struggling with?
3. What are they feeling?
4. What have they gone through?
5. What are they thinking?
6. What specific words are they using?
7. What happens if they DON'T solve their problem?
8. What happens if they DON'T fulfill their desire?
9. What are they really afraid of?
10. How are they behaving?
11. What do they believe?
12. What have they tried before?
13. What struggles do they have with existing solutions?
14. What objections do they have?

## OUTPUT FORMAT

Return ONLY valid JSON matching this structure (no markdown, no explanation):
{
  "executiveSummary": {
    "sourcesAnalyzed": number,
    "platformBreakdown": { "platform": count },
    "topDesires": ["desire1", "desire2", "desire3"],
    "confidence": "high" | "medium" | "low",
    "confidenceReason": "string"
  },
  "surfaceDesires": [
    {
      "id": "sd_1",
      "statement": "I want [outcome]",
      "frequency": number,
      "platformDiversity": number,
      "percentOfTotal": number,
      "sampleQuotes": ["quote1", "quote2", "quote3"],
      "emotionalDriverIds": ["ed_1", "ed_2"],
      "languageType": "acute" | "chronic" | "mixed",
      "verificationPassed": true
    }
  ],
  "emotionalDesires": [
    {
      "id": "ed_1",
      "statement": "I'm [emotion] [manifestation]",
      "category": "fear" | "guilt_shame" | "frustration_anger" | "sadness_grief" | "love_protection" | "pride_confidence",
      "frequency": number,
      "avgIntensity": number,
      "drivesSurfaceDesireIds": ["sd_1", "sd_2"],
      "sampleQuotes": ["quote1", "quote2"]
    }
  ],
  "emotionSurfaceMap": [
    { "surfaceDesireId": "sd_1", "emotionId": "ed_1", "cooccurrencePct": number }
  ],
  "naturalSegments": [
    {
      "name": "string",
      "coreEmotion": "string",
      "topDesires": ["desire1", "desire2", "desire3"],
      "behavioralIndicators": ["indicator1", "indicator2"],
      "languagePatterns": ["pattern1", "pattern2"],
      "estimatedShare": "dominant" | "large" | "medium" | "small"
    }
  ],
  "nicheScore": {
    "volumeScore": 0-10,
    "painIntensityScore": 0-10,
    "marketGapScore": 0-10,
    "trendScore": 0-10,
    "overallScore": 0-10,
    "reasoning": {
      "volume": "string",
      "painIntensity": "string",
      "marketGap": "string",
      "trend": "string"
    }
  },
  "honestAssessment": {
    "surprises": ["surprise1"],
    "expectedButNotFound": ["thing1"],
    "dataLimitations": ["limitation1"],
    "anomalies": ["anomaly1"]
  },
  "researchQuality": {
    "saturationReached": boolean,
    "platformDiversityScore": number,
    "desireConfidence": [
      { "desire": "string", "confidence": number, "reason": "string" }
    ]
  },
  "productRequirementsLog": [
    { "requirement": "string", "frequency": number, "whyNotDesire": "string" }
  ]
}

## NICHE SCORING (Architecture Finale.md §20)

After completing Steps 1-6, calculate the Niche Score using the weighted formula:

$$Score = (Volume \\times 0.25) + (Pain\\ Intensity \\times 0.35) + (Market\\ Gap \\times 0.25) + (Trend \\times 0.15)$$

**Scoring Guide**:
- **Volume (0-10)**: Search volume, product count on Amazon, forum activity, Reddit post frequency. 10 = massive market, 1 = tiny niche.
- **Pain Intensity (0-10)**: Weighted by the highest-intensity emotional desires found. Use avgIntensity of top emotional desires. 10 = crisis-level desperation, 1 = mild inconvenience.
- **Market Gap (0-10)**: Unmet needs found in 1-3 star reviews, competitor blind spots, underserved segments. 10 = massive gap nobody addresses, 1 = saturated market.
- **Trend (0-10)**: Growth trajectory from search trends, rising forum activity, seasonal momentum. 10 = exponential growth, 1 = declining interest.

**Why this weighting**: Pain intensity gets 0.35 (highest weight) because a niche with extreme pain but low volume is more profitable than a high-volume niche with mild discomfort.

## THRESHOLDS

Surface Desires:
- MINIMUM: 15+ mentions, 2+ platforms, must be outcomes BY USING product
- REPORT: 3-5 desires only if they meet threshold

Emotional Desires:
- MINIMUM: 20+ mentions, avg intensity 3.0+, appears with 2+ surface desires
- REPORT: 3-5 emotions only if they meet threshold

Quality principle: "It is better to report 3 well-evidenced desires than 5 where the last two are speculative."

## ANTI-PATTERNS (DO NOT DO THESE)

1. DO NOT include product requirements disguised as desires ("I want a product that is durable" = requirement)
2. DO NOT pad results to hit a target number
3. DO NOT invent or fabricate quotes
4. DO NOT combine multiple desires into one compound statement
5. DO NOT use marketing language to describe desires — use THEIR words
6. DO NOT assign emotional scores without direct textual evidence
7. DO NOT skip the verification questions for any desire
8. DO NOT cluster all social proof in one section — distribute across findings
9. DO NOT make claims about prevalence without frequency data
10. DO NOT ignore negative findings — report what WASN'T found in honestAssessment`;

  const user = `${hasResearchData
    ? `## MODE: ANALYSIS (Pre-Collected Data)

Analyze the following pre-collected research data to discover market desires, emotional drivers, and natural segments.

TARGET SOURCE COUNT: ${targets.min}-${targets.ideal} distinct customer voices (aim for depth with available data)

PRODUCT CATEGORY: ${input.productCategory}
PRODUCT DESCRIPTION: ${input.productDescription}
${input.productName ? `PRODUCT NAME: ${input.productName}` : ''}
${input.competitors?.length ? `COMPETITORS: ${input.competitors.join(', ')}` : ''}

## RESEARCH DATA (provided)
---
${input.researchData}
---

Analyze this data following the 6-step methodology. Produce the structured ScannerOutput JSON.`
    : `## MODE: AUTONOMOUS RESEARCH (Search Required)

Conduct market opportunity research for the following product category.

PRODUCT CATEGORY: ${input.productCategory}
PRODUCT DESCRIPTION: ${input.productDescription}
${input.productName ? `PRODUCT NAME: ${input.productName}` : ''}
${input.competitors?.length ? `COMPETITORS: ${input.competitors.join(', ')}` : ''}
SEARCH DEPTH: ${input.searchDepth} (target: ${targets.min}-${targets.ideal} distinct customer voices)

## RESEARCH SOURCES (search these platforms)
- Reddit: subreddits related to the product category (top all time, top year, controversial, recent)
- Amazon: 1-star through 5-star reviews across 10-15 similar products (prioritize high helpfulness votes)
- Quora: questions and answers related to the problem/need
- Forums & Niche Communities: long-form discussions
- Social Media: Facebook Groups, TikTok comments, YouTube comments
- Review Sites & Blogs: professional reviews with comment sections

## RESEARCH APPROACH
Phase 1 (Broad Scanning): Cast wide net across platforms. Identify common desire patterns.
Phase 2 (Deep Diving): Focus on high-density threads. Look for edge cases. Validate top desires.
Phase 3 (Saturation Check): Are you still finding new desires? If only repetition → saturation reached.
Phase 4 (Intensity Deep Dive): Return to highest-intensity emotional language. Read full context.

Conduct the research following the 6-step methodology. Produce the structured ScannerOutput JSON.`
  }`;

  return { system, user };
}
