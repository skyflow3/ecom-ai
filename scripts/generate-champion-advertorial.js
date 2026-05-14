/**
 * Generate a champion advertorial page using DeepSeek + rules_only prompt.
 * Calls DeepSeek for copywriting, then MiMo for composition.
 * Saves result to DB and returns preview URL.
 *
 * Usage: node scripts/generate-champion-advertorial.js
 */

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || "sk-c9302aa3a9924479b7b2adcbea3ea98f";
const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";
const MIMO_API_KEY = process.env.MIMO_API_KEY || "sk-sa8bzvwg4prq46r6429yt6th3ov2cbw394ntxdvkj0fklq3u";
const MIMO_API_URL = "https://api.xiaomimimo.com/v1/chat/completions";
const DATABASE_URL = process.env.DATABASE_URL || "postgres://postgres:xiQzZYV2Guqykc0WWvvxWRAVAFcIr2zjULIlVOxAu1J21pIHOMX1BrtX99ewjJNt@o0os8kg4gw4s8wskwcko4sko:5432/postgres";

const PRODUCT = {
  name: "GutRevive Pro",
  description: "Advanced probiotic supplement with 5 clinically-tested strains (Lactobacillus acidophilus, Bifidobacterium lactis, Lactobacillus plantarum, Lactobacillus rhamnosus, Bifidobacterium longum) plus prebiotic fiber. Targets bloating, low energy, digestive discomfort, and immune health. 30-day supply, 60 capsules. Made in USA, GMP certified, third-party tested.",
  price: "49",
  originalPrice: "89",
  niche: "health",
  targetAudience: "Adults 35-65 experiencing bloating, low energy, digestive issues",
  benefits: [
    "Eliminates bloating within 14 days",
    "Boosts natural energy by supporting nutrient absorption",
    "Restores gut microbiome balance with 50 billion CFU",
    "Strengthens immune system — 70% of immunity starts in the gut",
    "Improves sleep quality through the gut-brain connection"
  ],
  guarantee: "90-Day Empty Bottle Guarantee — Full refund even if you use the entire bottle"
};

// Champion advertorial system prompt (rules_only — CHAMPIONS.md #12)
const COPYWRITER_SYSTEM = `You are an elite direct-response advertorial copywriter. You write native advertising that reads like genuine journalism but sells like a late-night infomercial.

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

NEVER: corporate speak, hedging ("may help", "could improve"), "Moreover", "Furthermore", "Additionally"

RULES:
- Write in FIRST PERSON, conversational
- Use specific numbers, timeframes, and details throughout
- Build emotional tension through failures before revealing solution
- Create a clear villain (hidden cause) and hero (simple solution)
- Include visceral emotional language
- Make the CTA feel like the INEVITABLE conclusion
- 5th-8th grade reading level, short sentences
- NEVER corporate speak, NEVER generic, NEVER hedging

BANNED WORDS: moreover, furthermore, additionally, it's important to note, in today's world, unlock, discover (as verb), harness, embark, revolutionize, cutting-edge, game-changing, state-of-the-art

OUTPUT FORMAT: Return a valid JSON object with EXACTLY these fields:
{
  "headline": "<hero headline, max 80 chars>",
  "subheadline": "<supporting subheadline, 1-2 sentences>",
  "body": "<main marketing copy, 2-5 paragraphs separated by \\n\\n>",
  "benefits": ["<benefit 1>", "<benefit 2>", "<benefit 3>"],
  "ctaText": "<primary CTA button text, ALL CAPS>",
  "guarantee": "<guarantee text>",
  "testimonial": { "quote": "<testimonial quote>", "name": "<customer name>", "detail": "<verification or result>" },
  "painPoint": "<opening pain/agitation paragraph>",
  "urgency": "<urgency element text>"
}

Return ONLY the JSON object. No preamble, no markdown, no code fences.`;

const COPYWRITER_USER = `NOW WRITE THE FOLLOWING (apply rules above):

Product: ${PRODUCT.name}
Description: ${PRODUCT.description}
Price: $${PRODUCT.price}
Original Price: $${PRODUCT.originalPrice}
Niche: ${PRODUCT.niche}
Target Audience: ${PRODUCT.targetAudience}
Guarantee: ${PRODUCT.guarantee}
Key Benefits:
${PRODUCT.benefits.map(b => `  - ${b}`).join('\n')}

OUTPUT THE JSON NOW.`;

async function callApi(url, apiKey, model, systemPrompt, userPrompt, temp = 0.5, maxTokens = 4000) {
  const start = Date.now();
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: temp,
      max_tokens: maxTokens,
    }),
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`API error ${resp.status}: ${err}`);
  }

  const data = await resp.json();
  const content = data.choices?.[0]?.message?.content ?? "";
  const tokens = (data.usage?.prompt_tokens ?? 0) + (data.usage?.completion_tokens ?? 0);
  const duration = Date.now() - start;

  return { content, tokens, duration };
}

function extractJson(raw) {
  let cleaned = raw.trim();
  const fenceMatch = cleaned.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
  if (fenceMatch) cleaned = fenceMatch[1].trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const first = cleaned.indexOf("{");
    const last = cleaned.lastIndexOf("}");
    if (first !== -1 && last > first) {
      return JSON.parse(cleaned.substring(first, last + 1));
    }
    throw new Error("No JSON found in output");
  }
}

async function main() {
  console.log("=== CHAMPION ADVERTORIAL GENERATOR ===\n");
  console.log("Step 1: DeepSeek copywriter (rules_only champion #12)...\n");

  // Step 1: Copywriter (DeepSeek)
  const copyResult = await callApi(DEEPSEEK_API_URL, DEEPSEEK_API_KEY, "deepseek-chat", COPYWRITER_SYSTEM, COPYWRITER_USER, 0.5, 4000);
  console.log(`DeepSeek: ${copyResult.tokens} tokens, ${(copyResult.duration / 1000).toFixed(1)}s`);

  const copy = extractJson(copyResult.content);
  console.log(`\nHEADLINE: ${copy.headline}`);
  console.log(`CTA: ${copy.ctaText}`);
  console.log(`BODY length: ${copy.body.length} chars`);

  // Save copy to file for reference
  const fs = await import("fs");
  const path = await import("path");
  const copyPath = path.join(process.cwd(), "scripts", "last_champion_copy.json");
  fs.writeFileSync(copyPath, JSON.stringify(copy, null, 2));
  console.log(`\nCopy saved to: ${copyPath}`);

  // Step 2: Build BlockTree manually with the champion copy
  // WHY: MiMo is unreliable at producing valid BlockTree JSON.
  //      DeepSeek generates the TEXT, we structure it into proper blocks.
  console.log("\nStep 2: Building BlockTree with champion copy...\n");

  const blockTree = {
    version: "1.0",
    pageType: "advertorial",
    palette: "health-warm",
    blocks: [
      {
        id: "hero-main",
        type: "hero",
        props: {
          headline: copy.headline,
          subheadline: copy.subheadline,
          image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&h=1000&fit=crop",
          ctaText: copy.ctaText,
        },
        styles: { mobile: { padding: "16px", textAlign: "center" }, tablet: {}, desktop: {} },
        visibility: "all",
      },
      {
        id: "pain-section",
        type: "body-text",
        props: {
          content: copy.painPoint,
        },
        styles: { mobile: { padding: "16px" }, tablet: {}, desktop: {} },
        visibility: "all",
      },
      {
        id: "body-main",
        type: "body-text",
        props: {
          content: copy.body,
        },
        styles: { mobile: { padding: "16px" }, tablet: {}, desktop: {} },
        visibility: "all",
      },
      {
        id: "product-image",
        type: "image",
        props: {
          src: "https://images.unsplash.com/photo-1584308666544-7b0e9a3b4c9e?w=800&h=600&fit=crop",
          alt: PRODUCT.name,
        },
        styles: { mobile: { padding: "16px" }, tablet: {}, desktop: {} },
        visibility: "all",
      },
      {
        id: "benefits-list",
        type: "benefits-list",
        props: {
          title: "What GutRevive Pro Does For You",
          items: copy.benefits.map((b, i) => ({
            icon: ["check", "zap", "shield", "heart", "moon"][i] || "check",
            text: b,
          })),
        },
        styles: { mobile: { padding: "16px" }, tablet: {}, desktop: {} },
        visibility: "all",
      },
      {
        id: "testimonial-1",
        type: "testimonial",
        props: {
          quote: copy.testimonial.quote,
          name: copy.testimonial.name,
          detail: copy.testimonial.detail,
          rating: 5,
        },
        styles: { mobile: { padding: "16px" }, tablet: {}, desktop: {} },
        visibility: "all",
      },
      {
        id: "social-proof",
        type: "social-proof",
        props: {
          text: "Over 47,300 customers have already transformed their gut health with GutRevive Pro",
          count: "47,300+",
          label: "Happy Customers",
        },
        styles: { mobile: { padding: "16px" }, tablet: {}, desktop: {} },
        visibility: "all",
      },
      {
        id: "pricing",
        type: "bundle-offers",
        props: {
          title: "Choose Your Supply",
          offers: [
            {
              quantity: 1,
              label: "Single Bottle",
              price: 49,
              originalPrice: 89,
              savings: "Save 45%",
              popular: false,
              selected: false,
              freeShipping: false,
            },
            {
              quantity: 3,
              label: "Most Popular",
              price: 33,
              totalPrice: 99,
              originalPrice: 267,
              savings: "Save 63%",
              popular: true,
              selected: true,
              freeShipping: true,
            },
            {
              quantity: 6,
              label: "Best Value",
              price: 25,
              totalPrice: 149,
              originalPrice: 534,
              savings: "Save 72%",
              popular: false,
              selected: false,
              freeShipping: true,
            },
          ],
        },
        styles: { mobile: { padding: "16px" }, tablet: {}, desktop: {} },
        visibility: "all",
      },
      {
        id: "guarantee",
        type: "guarantee",
        props: {
          guaranteeType: "money-back",
          days: 90,
          title: copy.guarantee,
          description: "Try GutRevive Pro completely risk-free. If you don't experience noticeably better digestion, more energy, and less bloating within 90 days, we'll refund every penny — even if the bottle is empty. No questions asked. No hoops to jump through.",
        },
        styles: { mobile: { padding: "16px" }, tablet: {}, desktop: {} },
        visibility: "all",
      },
      {
        id: "cta-final",
        type: "button",
        props: {
          text: copy.ctaText,
          variant: "primary",
          fullWidth: true,
        },
        styles: { mobile: { padding: "16px 16px 8px" }, tablet: {}, desktop: {} },
        visibility: "all",
      },
      {
        id: "urgency-text",
        type: "body-text",
        props: {
          content: copy.urgency,
        },
        styles: { mobile: { padding: "0 16px 16px", textAlign: "center" }, tablet: {}, desktop: {} },
        visibility: "all",
      },
      {
        id: "trust-badges",
        type: "trust-badges",
        props: {
          badges: ["SSL Secure", "Made in USA", "GMP Certified", "Third-Party Tested"],
        },
        styles: { mobile: { padding: "16px" }, tablet: {}, desktop: {} },
        visibility: "all",
      },
    ],
    metadata: {
      title: copy.headline,
      description: copy.subheadline,
      trackingId: "advertorial-champion-v1",
    },
  };

  // Step 3: Save to DB via direct SQL
  console.log("Step 3: Saving to database...\n");

  const postgres = (await import("postgres")).default;
  const sql = postgres(DATABASE_URL, { max: 1 });

  try {
    // Insert new variant
    const [variant] = await sql`
      INSERT INTO page_variants (step_id, name, status, traffic_weight, is_control, page)
      VALUES (
        ${"b5fad900-89df-4432-aa9d-e69b82c4fa6d"},
        ${"Champion Advertorial — DeepSeek rules_only"},
        'draft',
        100,
        false,
        ${sql.json(blockTree)}
      )
      RETURNING id, name
    `;

    console.log(`Variant created: ${variant.id}`);
    console.log(`\n=== PREVIEW URL ===`);
    console.log(`https://nutrovia.co/api/preview/${variant.id}`);
    console.log(`==================\n`);

    // Also update step to point to this variant
    await sql`
      UPDATE funnel_steps
      SET active_variant_id = ${variant.id}
      WHERE id = ${"b5fad900-89df-4432-aa9d-e69b82c4fa6d"}
    `;
    console.log("Step updated to use champion variant.");
  } finally {
    await sql.end();
  }
}

main().catch((err) => {
  console.error("FATAL:", err);
  process.exit(1);
});
