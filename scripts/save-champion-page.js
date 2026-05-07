/**
 * Save the champion BlockTree to DB via the production API.
 * The BlockTree was built with DeepSeek champion copy.
 */
import { readFileSync } from "fs";
import { join } from "path";

const API_BASE = "https://app.nutrovia.co";
const STEP_ID = "b5fad900-89df-4432-aa9d-e69b82c4fa6d";
const FUNNEL_ID = "48f12583-cc04-489d-8ccc-87e0913740d9";

// Read the champion copy from the file saved by the generator
const copy = JSON.parse(readFileSync(join("scripts", "last_champion_copy.json"), "utf-8"));

const PRODUCT = {
  name: "GutRevive Pro",
  benefits: [
    "Eliminates bloating within 14 days",
    "Boosts natural energy by supporting nutrient absorption",
    "Restores gut microbiome balance with 50 billion CFU",
    "Strengthens immune system — 70% of immunity starts in the gut",
    "Improves sleep quality through the gut-brain connection"
  ],
  guarantee: "90-Day Empty Bottle Guarantee — Full refund even if you use the entire bottle"
};

// Build BlockTree with champion copy
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
      props: { content: copy.painPoint },
      styles: { mobile: { padding: "16px" }, tablet: {}, desktop: {} },
      visibility: "all",
    },
    {
      id: "body-main",
      type: "body-text",
      props: { content: copy.body },
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
            quantity: 1, label: "Single Bottle", price: 49, originalPrice: 89,
            savings: "Save 45%", popular: false, selected: false, freeShipping: false,
          },
          {
            quantity: 3, label: "Most Popular", price: 33, totalPrice: 99,
            originalPrice: 267, savings: "Save 63%", popular: true, selected: true, freeShipping: true,
          },
          {
            quantity: 6, label: "Best Value", price: 25, totalPrice: 149,
            originalPrice: 534, savings: "Save 72%", popular: false, selected: false, freeShipping: true,
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
        guaranteeType: "money-back", days: 90, title: PRODUCT.guarantee,
        description: "Try GutRevive Pro completely risk-free. If you don't experience noticeably better digestion, more energy, and less bloating within 90 days, we'll refund every penny — even if the bottle is empty. No questions asked.",
      },
      styles: { mobile: { padding: "16px" }, tablet: {}, desktop: {} },
      visibility: "all",
    },
    {
      id: "cta-final",
      type: "button",
      props: { text: copy.ctaText, variant: "primary", fullWidth: true },
      styles: { mobile: { padding: "16px 16px 8px" }, tablet: {}, desktop: {} },
      visibility: "all",
    },
    {
      id: "urgency-text",
      type: "body-text",
      props: { content: copy.urgency },
      styles: { mobile: { padding: "0 16px 16px", textAlign: "center" }, tablet: {}, desktop: {} },
      visibility: "all",
    },
    {
      id: "trust-badges",
      type: "trust-badges",
      props: { badges: ["SSL Secure", "Made in USA", "GMP Certified", "Third-Party Tested"] },
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

// Use the generate API to save (it accepts a variantName)
// But we need to save the PRE-BUILT blockTree, not generate a new one.
// Alternative: use the DB seed/setup endpoint pattern to insert directly.
// Simplest: use the preview API to render from a temp variant.

// Actually, let's use the generate endpoint but trick it —
// the generate endpoint always calls the LLM. Instead, let's just call the DB directly
// from inside the Docker container via an API call.

// Use the /api/admin/seed pattern — direct postgres connection
const DB_URL = "postgres://postgres:xiQzZYV2Guqykc0WWvvxWRAVAFcIr2zjULIlVOxAu1J21pIHOMX1BrtX99ewjJNt@5.161.254.135:5432/postgres";

async function main() {
  console.log("Connecting to production DB...");
  const postgres = (await import("postgres")).default;
  const sql = postgres(DB_URL, { max: 1 });

  try {
    const [variant] = await sql`
      INSERT INTO page_variants (step_id, name, status, traffic_weight, is_control, page)
      VALUES (
        ${STEP_ID},
        ${"Champion Advertorial — DeepSeek rules_only"},
        'draft',
        100,
        false,
        ${sql.json(blockTree)}
      )
      RETURNING id, name
    `;

    console.log(`\nVariant created: ${variant.id}`);
    console.log(`Name: ${variant.name}`);
    console.log(`\n=== PREVIEW URL ===`);
    console.log(`https://app.nutrovia.co/api/preview/${variant.id}`);
    console.log(`==================\n`);

    // Update step
    await sql`
      UPDATE funnel_steps
      SET active_variant_id = ${variant.id}
      WHERE id = ${STEP_ID}
    `;
    console.log("Step updated.");
  } finally {
    await sql.end();
  }
}

main().catch((err) => {
  console.error("FATAL:", err.message);
  process.exit(1);
});
