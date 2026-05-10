/**
 * Purpose: Product Page Template Filler — generates content for ALL slots in a DTC product page.
 *          Takes a product brief → outputs a JSON ContentMap for the template engine.
 *          Optimized for product_page_judge_v2.json criteria (10 criteria, weighted).
 * Dependencies: templates/product-page-tryemsense.html.json (slot config)
 * Related: template-engine.ts (consumes output), template-generator.ts (orchestrates)
 *
 * WHY: Product pages are TRANSACTIONAL (not narrative like advertorials).
 *      Every section is a self-contained persuasion unit designed to close the sale.
 *      Judge criteria correlation: Comparison Table (0.97), Above-Fold (0.89), Social Proof (0.85).
 */

export interface ProductBrief {
  /** Product name */
  name: string;
  /** What the product does (1-2 sentences) */
  description: string;
  /** Niche/category (e.g., "Health & Wellness", "Pain Relief") */
  niche: string;
  /** Target audience description */
  targetAudience: string;
  /** Key benefits (3-5 items) */
  benefits: string[];
  /** Discounted price */
  price: string;
  /** Original price (strikethrough) */
  originalPrice: string;
  /** Discount percentage */
  discountPct: string;
  /** Guarantee terms (e.g., "30-Day Money-Back Guarantee") */
  guarantee: string;
  /** Unique mechanism / technology name (e.g., "Triple Therapy", "Red Light Fusion") */
  mechanismName: string;
  /** Doctor/expert persona for endorsement (e.g., "Dr. Jessica Thompson, Podiatric Specialist") */
  doctorPersona: string;
  /** Number of ratings to display */
  ratingCount?: string;
  /** Star rating (e.g. "4.9") */
  ratingScore?: string;
  /** Product image URL — landscape for hero */
  productImageUrl?: string;
  /** Square product image URL for sidebar/cards */
  productImageSquareUrl?: string;
  /** Logo image URL */
  logoUrl?: string;
  /** Product video URLs (array of MP4 URLs) */
  productVideoUrls?: string[];
  /** Doctor image URL */
  doctorImageUrl?: string;
  /** When true, keep <video> tags and inject .mp4 URLs instead of replacing with images */
  useVideos?: boolean;
}

/**
 * Build the prompt for product page content generation.
 * This is a TRANSACTIONAL page — every element reduces friction and creates urgency.
 */
export function buildProductPageFillerPrompt(brief: ProductBrief): string {
  const ratings = brief.ratingCount ?? `${1000 + Math.floor(Math.random() * 5000)}+`;
  const score = brief.ratingScore ?? '4.9';
  const mechanism = brief.mechanismName;
  const doctor = brief.doctorPersona;

  return `You are an ELITE DTC (Direct-to-Consumer) product page copywriter.

## YOUR TASK
Generate ALL text content for a product page selling: **${brief.name}**

## PRODUCT INFO
- Name: ${brief.name}
- Description: ${brief.description}
- Niche: ${brief.niche}
- Target Audience: ${brief.targetAudience}
- Key Benefits: ${brief.benefits.join(', ')}
- Price: ${brief.price} (was ${brief.originalPrice}, ${brief.discountPct} OFF)
- Guarantee: ${brief.guarantee}
- Unique Mechanism/Technology: ${mechanism}
- Doctor/Expert Persona: ${doctor}

## OUTPUT FORMAT
Output a SINGLE JSON object. Each value is a string. No markdown, no code fences.

## CONTENT RULES (MANDATORY)

### Voice & Style
- Write like a FRIEND recommending a product, not a salesman pitching one.
- Short, punchy sentences. Conversational. No corporate jargon.
- Use SPECIFIC numbers everywhere: "4.9/5 from 12,744 reviews", "in just 15 minutes", "less than $1/day".
- NO: "revolutionary", "cutting-edge", "game-changer", "innovative", "state-of-the-art".
- YES: Specific benefits, real outcomes, named features, concrete promises.

### Product Page Psychology (CRITICAL)
Each section is a SELF-CONTAINED persuasion unit. A reader who only sees ONE section should still want to buy.

1. **Above-Fold (Hero)**: Rating + benefits + CTA must ALL be visible without scrolling. This is the #1 conversion driver.
2. **Problem Section**: Name the SPECIFIC pain. Not "discomfort" but "burning, tingling, that pins-and-needles feeling that keeps you up at 3 AM".
3. **Features Section**: Each feature = benefit headline + how it works + outcome. Use numbered lists for the mechanism breakdown.
4. **Conditions List**: 10 specific conditions/symptoms the product addresses. These must match the product niche.
5. **Testimonials**: 3 different personas. Each highlights a DIFFERENT benefit. Conversational, imperfect, real-sounding.
6. **Comparison Table**: 7 benefits for US (checkmarks) vs 6 negatives for THEM (X marks). Direct, specific, competitive.
7. **Doctor Endorsement**: Named expert with credentials that MATCH the product category. Quote sounds professional but warm.
8. **How-To Steps**: Exactly 3 steps. Dead simple. "Step 1: [Action]. Step 2: [Setting]. Step 3: [Relax]."
9. **Reviews**: 3 detailed reviews with quote titles, verified buyer badge. Different angles (pain relief, quality of life, skeptic converted).
10. **FAQ**: 5 questions addressing real objections (safety, sizing, timeline, usage, medical conditions).

### HTML Formatting (for description fields)
- Use <strong> for emphasis on key phrases (NO class attribute)
- Use <br><br> for paragraph breaks within a slot
- NO other HTML tags allowed
- Keep HTML minimal — the template handles structure

## SLOTS TO FILL

{
  "page_title": "SEO title with product name + main benefit. Under 60 chars.",
  "meta_description": "SEO description. 150-160 chars. Product name + main benefit + CTA.",
  "hero_headline": "Bold emotional headline. Pattern: [Emotion word]! [Benefit] for [Specific Problem] in Your [Body Part/Area]. Example: Finally! Real Relief for Neuropathy Pain in Your Feet",
  "hero_subtitle": "1-2 sentences explaining what the product does using simple terms. Mention the mechanism name. Example: Uses 'Triple Technology' to help relieve pain, tingling, swelling, and fatigue without costly procedures or addictive medications.",
  "hero_benefit_1_title": "Short benefit title (2-4 words). A technology or feature. Example: Red-light heat therapy",
  "hero_benefit_1_desc": "What this benefit does for the user. 1 short sentence. Example: helps dilate blood vessels to support healthy circulation.*",
  "hero_benefit_2_title": "Short benefit title (2-4 words). Different from #1.",
  "hero_benefit_2_desc": "What this benefit does. 1 short sentence.",
  "hero_benefit_3_title": "Short benefit title (2-4 words). Different from #1 and #2.",
  "hero_benefit_3_desc": "What this benefit does. 1 short sentence.",
  "hero_trust_1_title": "Trust badge 1 title. Short, 2-4 words. Example: 30-day money back",
  "hero_trust_1_desc": "Trust badge 1 description. 1 sentence reinforcing confidence. Mention product name. Example: We're so confident [Product] will help you, we're giving you 30 full days to try it out.",
  "hero_trust_2_title": "Trust badge 2 title. Short, 2-4 words. Example: Free shipping",
  "hero_trust_2_desc": "Trust badge 2 description. 1 sentence. Example: Order today and we will handle and send your package completely free of charge!",
  "hero_trust_3_title": "Trust badge 3 title. Short, 2-4 words. Example: High quality guarantee",
  "hero_trust_3_desc": "Trust badge 3 description. 1 sentence about durability/quality. Example: Made from durable, high quality materials, this product is created to last for years.",
  "hiw_heading": "How-it-works section heading. Frames the product as a single solution. Example: One Device That Does It All - Here's How:",
  "hiw_card_1_title": "HIW card 1 title. Short benefit (2-5 words). Example: Promotes better blood flow",
  "hiw_card_1_desc": "HIW card 1 description. 1-2 sentences explaining the science/mechanism behind this benefit. Example: Targeted red light wavelengths penetrate the surface of the skin, promoting more efficient blood flow.*",
  "hiw_card_2_title": "HIW card 2 title. Short benefit (2-5 words). Different from #1. Example: Supports pain relief",
  "hiw_card_2_desc": "HIW card 2 description. 1-2 sentences. Different mechanism than card 1. Example: Different massage intensity levels help relieve pain and tingling in the affected area.*",
  "hiw_card_3_desc": "HIW card 3 description. 1-2 sentences about reducing swelling/healing. Example: Helps reduce swelling and supports the healing of damaged nerves.*",
  "hiw_card_4_title": "HIW card 4 title. Short benefit (2-5 words). About ease of use. Example: Easy to use at home",
  "hiw_card_4_desc": "HIW card 4 description. 1-2 sentences about simplicity, no side effects. Example: No side effects, no complicated routines. Just use it while you relax and let symptoms fade.",
  "problem_headline": "Section heading naming the root cause. Example: The Real Cause of Foot Pain & Aches",
  "problem_description": "3-5 sentences explaining the root cause of the problem in simple, vivid terms. Use <strong> for emphasis on key medical concepts. Use <br><br> for paragraph breaks. End with a hopeful transition like 'But don't worry...'. Example: Your nerves <strong>need oxygen to function properly</strong>, just like the rest of your body.<br><br>That oxygen <strong>gets delivered through your blood</strong>. But when blood flow slows down, <strong>those cells don't get what they need.</strong><br><br>Over time, this can cause <strong>damage</strong> - leading to pain and discomfort.*<br><br>But don't worry...",
  "problem_stat_1_desc": "Problem stat 1 description. Short, ends with asterisk. Example: people aged 40+ report occasional [problem]*",
  "problem_stat_2_desc": "Problem stat 2 description. Short, ends with asterisk. Example: say their everyday life is affected due to [problem].*",
  "problem_stat_3_desc": "Problem stat 3 description. Short, ends with asterisk. Example: rely on medications to reduce [problem].*",
  "problem_stat_4_desc": "Problem stat 4 description. Short, ends with asterisk. Example: noticed negative mood changes due to constant [problem].*",
  "product_headline": "Aspirational heading with promise. Example: You Are One Step Closer to Getting Rid of [Problem] Once and For All*",
  "feature_1_heading": "Introduce the product and its main technology. Example: Meet the [Product Name] [Mechanism Name]",
  "feature_1_description": "3-5 sentences explaining how the product works. Break down the mechanism into numbered steps. Use <strong> for emphasis on key phrases. Use <br><br> for paragraphs.",
  "feature_2_heading": "Heading for conditions list. Example: This Product Also Helps With",
  "feature_2_description": "One sentence intro before the conditions list.",
  "condition_1": "Condition 1 the product addresses",
  "condition_2": "Condition 2",
  "condition_3": "Condition 3",
  "condition_4": "Condition 4",
  "condition_5": "Condition 5",
  "condition_6": "Condition 6",
  "condition_7": "Condition 7",
  "condition_8": "Condition 8",
  "condition_9": "Condition 9",
  "condition_10": "Condition 10",
  "feature_3_heading": "Expert/creator credibility heading. Example: Created by Specialists",
  "feature_3_description": "2-3 sentences about who created it and cost advantage vs alternatives. Use <strong> for key claims.",
  "feature_4_heading": "Ease of use heading. Example: The Perfect At-Home [Therapy/Solution]",
  "feature_4_description": "2-3 sentences about simplicity. List the simple steps inline. Use <strong> for actions like 'slip it on', 'press a button'.",
  "testimonials_headline": "Social proof heading. Example: Our Customers Report Significantly Reduced [Problem] Levels:",
  "testimonial_1_name": "First name + last initial. Example: Jennifer L.",
  "testimonial_1_text": "Conversational review text. 2-3 sentences. Specific outcome mentioned. Imperfect grammar OK — sounds real.",
  "testimonial_2_name": "Different persona (e.g., active worker). First name + last initial.",
  "testimonial_2_text": "Different angle testimonial. 2-3 sentences. Different benefit highlighted.",
  "testimonial_3_name": "Different persona (e.g., skeptic converted). First name + last initial.",
  "testimonial_3_text": "Skeptic-to-believer story. 2-3 sentences.",
  "success_rate_pct": "Success rate number (no % sign). Example: 84",
  "success_rate_title": "What the success rate measures. Example: Improving Blood Circulation In Your Feet*",
  "success_rate_description": "Brief stat explanation. Example: 84% of customers were satisfied and found it effective.*",
  "comparison_headline": "Comparison heading framing the choice. Example: Ditch Expensive [Alternatives], Choose Safer [Category]*",
  "comparison_subtitle": "One-line benefit summary. Example: It's non-addictive, works fast, and actually does GOOD things for your body.",
  "our_product_title": "Product name + technology. Example: [Product Name] [Mechanism Name]",
  "our_benefit_1": "Checkmark benefit 1. Start with positive outcome. Example: 100% drug-free and non-invasive*",
  "our_benefit_2": "Checkmark benefit 2. Speed claim. Example: Delivers relief in just minutes*",
  "our_benefit_3": "Checkmark benefit 3. Authority. Example: Recommended by medical experts*",
  "our_benefit_4": "Checkmark benefit 4. Long-term. Example: Supports long-term health, not just temporary fixes*",
  "our_benefit_5": "Checkmark benefit 5. Symptom targeting. Example: Targets [specific symptoms]*",
  "our_benefit_6": "Checkmark benefit 6. Safety. Example: Safe for daily use - no side effects*",
  "our_benefit_7": "Checkmark benefit 7. Convenience. Example: Easy to use at home, anytime you need it",
  "their_product_title": "Competitor category. Example: Conventional [Category] Methods",
  "their_negative_1": "X mark negative 1. Side effects. Example: Depend on medications that may cause side effects*",
  "their_negative_2": "X mark negative 2. Speed. Example: Can take hours (or longer) to kick in*",
  "their_negative_3": "X mark negative 3. Trust. Example: Not always trusted by medical professionals*",
  "their_negative_4": "X mark negative 4. Duration. Example: Offer short-term relief with repeated use*",
  "their_negative_5": "X mark negative 5. Safety. Example: Risk of long-term harm with frequent use*",
  "their_negative_6": "X mark negative 6. Convenience. Example: Often inconvenient or require prescriptions*",
  "results_headline": "Results heading. Example: These Results Speak for Themselves",
  "results_subtitle": "Results intro with timeline. Example: Here's what this technology can help you achieve in just 90 days.*",
  "result_stat_1_desc": "Stat 1 description. Example: experience reduced [problem]*",
  "result_stat_2_desc": "Stat 2 description. Example: experience reduced [symptom]*",
  "result_stat_3_desc": "Stat 3 description. Example: can now [activity] without discomfort*",
  "doctor_name": "Doctor full name with Dr. prefix. MUST match the niche. Example: Dr. Jessica Thompson",
  "doctor_specialty": "Specialty aligned with product. Example: Podiatric Specialist",
  "doctor_quote": "3-4 sentence endorsement. Pattern: (1) establish expertise, (2) name the science, (3) recommend product. Use <strong> for key claims. Use <br><br> for paragraphs.",
  "howto_headline": "3 steps heading. Example: 3 Simple Steps For [Benefit]",
  "howto_subtitle": "Simplicity reinforcement. Example: Simply [easy action] and enjoy [benefit]!",
  "step_1_title": "Step 1 action title. Example: Wrap It Around Your [Body Part]",
  "step_1_desc": "Step 1 description. Simple, physical action. 1 sentence.",
  "step_2_title": "Step 2 action title. Example: Choose Your Settings",
  "step_2_desc": "Step 2 description. Choosing/customizing. 1 sentence.",
  "step_3_title": "Step 3 relaxation title. Example: Sit Back and Relax",
  "step_3_desc": "Step 3 description. What the user feels/experiences during use. 1-2 sentences, sensory and reassuring. Example: That's it! In just minutes, you'll feel soothing warmth and gentle relief working together to reduce discomfort.*",
  "reviews_subtitle": "Reviews intro. Example: See What Others Are Saying About Our [Product]",
  "reviews_headline": "Social proof heading. Example: Thousands Of Happy Users",
  "review_1_name": "Reviewer name. First + last initial.",
  "review_1_title": "Review title in double quotes. Example: \"Working great for both my elbows and ankles\"",
  "review_1_text": "Detailed review. 2-3 sentences. Specific body part + specific result + lifestyle context.",
  "review_2_name": "Different persona reviewer.",
  "review_2_title": "Different angle review title in quotes.",
  "review_2_text": "Emotional story review. 2-3 sentences. Hope + gratitude.",
  "review_3_name": "Third persona reviewer.",
  "review_3_title": "Powerful before/after title in quotes.",
  "review_3_text": "Before/after comparison review. 2-3 sentences. Life improvement.",
  "guarantee_title": "Guarantee heading. Include duration. Example: 30-Day Money-Back Guarantee",
  "guarantee_subtitle": "Confidence statement. Example: We put our money where our mouth is.",
  "guarantee_description": "Clear guarantee terms. Example: If you're unhappy, you're eligible for a 100% refund within 30 days.",
  "faq_headline": "FAQ heading. Example: Read Our Customers' Frequently Asked Questions",
  "faq_q1": "FAQ question about usage frequency",
  "faq_a1": "Reassuring answer with specific recommendation",
  "faq_q2": "FAQ question about safety/medical conditions",
  "faq_a2": "Safety answer with caveat to consult doctor",
  "faq_q3": "FAQ question about sizing/fitting/compatibility",
  "faq_a3": "Reassuring compatibility answer",
  "faq_q4": "FAQ question about usage constraints",
  "faq_a4": "Clear usage guideline answer",
  "faq_q5": "FAQ question about timeline for results",
  "faq_a5": "Encouraging timeline answer with realistic expectations",
  "disclaimer_text": "Legal disclaimer. 2-3 sentences. Cover: results vary, not medical advice, consult doctor, for external use only. Use [Product Name] not a specific brand. Example: Results may vary from person to person. [Product Name] is not intended to diagnose, treat, cure, or prevent any medical condition. Consult your healthcare provider before use, especially if you have any existing health conditions."
}

## CRITICAL RULES
1. Output ONLY the JSON object. No markdown, no code fences, no explanation.
2. Every string must be properly escaped for JSON.
3. Product name "${brief.name}" must appear at least 8 times across the content.
4. The mechanism "${mechanism}" must be named and explained in feature_1_description.
5. The doctor "${doctor}" must match the product niche (e.g., podiatrist for foot product, dermatologist for skin product).
6. Comparison table is the #1 score driver — make our benefits SPECIFIC and their negatives HIT HARD.
7. Every testimonial and review must sound like a REAL PERSON — imperfect grammar, specific details, emotional.
8. Conditions list must be 10 REAL conditions/symptoms relevant to the product niche.
9. CTA and urgency texts are NOT in the JSON — they are static in the template (handled separately).`;
}
