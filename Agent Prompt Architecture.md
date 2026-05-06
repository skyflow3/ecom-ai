1: For $1M+/month DTC subscription funnels with 90% mobile traffic, agents can't be treated like copywriters with CSS access. They need to be constrained composers working inside a hard-coded mobile design system, with prompts that inject winning patterns and guardrails that reject ugly output before Nginx ever sees it.

Your stack — Hono.js + PostgreSQL/Drizzle + Handlebars + Nginx pre-render — is ideal for this because you can enforce structure at three layers: prompt (what the agent can ask for), block library (what it can compose), and renderer (what actually ships).

## 1. LLM prompt structure, block composition, and tokens

**Prompt architecture: three-layer injection, not one big prompt**

Don't give the LLM freedom to invent styles. Give it choices inside a cage:

1. **System layer (immutable):** "You are a DTC funnel composer. Output ONLY valid JSON matching BlockTree schema v3.2. You cannot invent CSS, colors, or spacing. Use only tokens from `design_tokens` provided. Mobile viewport is 375px. All CTAs must be ≥44px height."
2. **Context layer (dynamic from DB):**
   - funnel_type: `advertorial` | `product` | `vsl` | `checkout` | `upsell`
   - brand_tokens: injected from PostgreSQL
   - winning_patterns: top 3 patterns from RAG for this funnel_type (e.g., "sticky ATC after 2nd scroll on product pages increased CVR 18%")
   - constraints: Stripe product IDs, tracking pixels, legal disclaimers
3. **Task layer:** "Compose a block tree for targeting. Goal: subscription opt-in. Use 5-8 blocks max."[product][avatar]

This prevents the classic failure where LLMs generate desktop-first hero sections with 12px text.

**Block composition logic**

Store blocks in Drizzle as atomic, mobile-validated units:

```typescript
// blocks table
id, type, mobile_template, allowed_props, required_props, performance_budget_kb
```

Composition rules hard-coded in Hono.js validator:
- Max tree depth: 2 (section → block, no nested grids)
- Advertorial: must start with `editorial_hero`, then `social_proof_bar`, then `story_block` sequence
- Product page: `image_carousel` must be first, followed by `price_bundle`, CTA within first 600px
- Checkout: max 4 blocks, no images >50kb, no video
- Every page: exactly one `sticky_cta_mobile` block, auto-injected if agent omits

The agent doesn't position blocks with pixels. It selects from a ranked list:

```json
{
  "type": "section",
  "layout": "stack", // only stack or 2-col on mobile
  "blocks": [
    {"type": "image_carousel", "props": {"aspect": "4:5", "swipe": true, "images": [...], "priority": true}},
    {"type": "price_bundle", "props": {"variant": "subscribe_save", "urgency": "low_stock", "sticky": false}}
  ]
}
```

**Design token system**

Tokens live in PostgreSQL, injected into every prompt and compiled to CSS custom properties in Handlebars base template. LLM never sees hex codes, only token names.

| Token group | Mobile-first values |
| --- | --- |
| Spacing | 4pt grid: 4, 8, 12, 16, 24, 32, 48, 64px. Micro=8, macro=24, hero=48 |
| Typography | body 16-18px minimum, h1 28px/1.2, h2 22px/1.3, line-height 1.5x |
| Tap targets | min 44×44px, padding 12px, gap 8px between CTAs |
| Colors | constrained palette: 1 primary, 1 accent, neutrals 900-100, contrast ≥4.5:1 for body |
| Radius | 8px cards, 24px buttons, 0px for editorial images |


Handlebars compiles this to:
```css
:root { --space-2: 8px; --text-body: 16px; --cta-height: 48px; }
```

## 2. What makes LLM output look "good" on mobile

Good mobile DTC isn't about creativity, it's about removing decisions. 80% of funnel traffic is mobile but most funnels are designed for desktop. Your block library must hard-code the patterns that 9-figure brands use.

**Hard-coded patterns per block type:**

- **CTAs:** Big buttons, thumb-friendly design, persistent sticky variant (Netflix-style persistent CTAs boost engagement), 100% width on mobile, never side-by-side
- **Images:** Force 4:5 aspect for product, 16:9 for VSL thumbnails, WebP <80kb, lazy below fold. No agent choice on aspect ratio
- **Typography:** Use low-contrast scale like Minor Second for mobile, max 65 characters per line, system fonts only (SF Pro, Roboto) to avoid FOIT
- **Layout:** Single column stack only. "Two column" becomes stacked on <768px automatically. No horizontal overflow allowed
- **Speed patterns:** One-screen focus, minimal text, progress indicators for checkout

**Block library examples that guarantee polish:**

| Page type | Required blocks (hard-coded) | Why it works |
| --- | --- | --- |
| Advertorial | editorial_hero (large serif headline 28px), byline_bar, story_block with 18px body, inline_social_proof, sticky_cta | Mimics editorial, long-form readability with 1.5x line spacing |
| Product | swipe_carousel (4:5), price_bundle with 3-tier subscribe/save, urgency_pill, accordion_faq, reviews_grid | Thumb swipe + clear value prop, 16px minimum prevents zoom |
| VSL | video_sticky_player (auto-pins on scroll), transcript_accordion, offer_stack | Video-centric with sticky player keeps CTA visible |
| Checkout | trust_badges_row, express_pay_buttons, form_minimal, guarantee_block | Minimal, trust-focused, 44px tap targets |
| Upsell | one_click_offer, countdown_timer, comparison_table | Urgency without clutter |


The LLM chooses content and order, not styles. Every block's Handlebars partial already includes the spacing, typography, and mobile patterns. That's how you get consistency.

## 3. Agent pipeline + A/B testing state machine + RAG

This is where most teams fail: they let agents generate, but never close the loop.

**Architecture:**

```
Agent Composer → Validator → Hono.js API → PostgreSQL (variants table)
    ↓
Nginx pre-render → Cloudflare → traffic split
    ↓
Analytics (CVR, AOV, take-rate) → State Machine
    ↓
RAG Ingestion → Marketing Evolution Engine
```

**State machine integration:**

- **Sandbox:** Agent generates 3 variants per brief. Each gets 500 sessions. Hard fail if Lighthouse <85 mobile
- **Elimination:** After 2,000 sessions, bottom 50% killed. Surviving block trees stored with performance metrics
- **Commando:** Top variant gets 5 agent-generated mutations (swap headline block, change urgency prop). Tests specific patterns
- **Duel:** Winner vs current champion. Needs 95% statistical significance
- **Champion:** Winning JSON block tree promoted to `patterns` table

**RAG-backed Marketing Evolution Engine:**

Store every test in PostgreSQL with vector embeddings of the block tree structure, not just copy:

```sql
CREATE TABLE patterns (
  id, funnel_type, block_signature,
  cvr_lift, mobile_cvr, embedding vector(1536),
  sop_text -- "sticky ATC after image 2 works for skincare"
);
```

Weekly job:
1. Query top 10% performers by funnel_type
2. Use LLM to extract pattern: "What visual structure is common?"
3. Codify into SOP: "For beauty advertorials, use 24px spacing between paragraphs, not 16px. Increases read-through 12%"
4. Inject SOPs into future prompts as `winning_patterns`

The agent prompt then includes: "Recent winning pattern: use `social_proof_bar` immediately after hero on advertorials. CVR +14% across 3 brands."

This creates compound learning. Agents don't start from zero.

## 4. Automated validation before static HTML

Run this in Hono.js middleware before writing to Drizzle:

**Layer 1: Schema**
- Zod validation against BlockTree schema. Reject unknown props, missing required fields, invalid token references

**Layer 2: Mobile layout constraints**
- Tap target check: parse all interactive elements, ensure min-height ≥44px
- Viewport overflow: render in headless Chrome 375px, fail if horizontal scroll >0
- CLS budget: cumulative layout shift <0.1 on mobile, measured via Puppeteer
- Image budget: total <500kb first paint, hero image priority=true
- Block count: advertorial ≤12 blocks, checkout ≤5

**Layer 3: Performance**
- Lighthouse CI mobile: Performance ≥90, Accessibility ≥95, Best Practices ≥90. Fail build if below
- Stripe compatibility: checkout blocks must contain `data-stripe-price-id`, no custom JS on payment form
- Tracking: ensure `fbq`, `ttq`, `gtag` events present on CTA blocks

**Layer 4: Visual regression**
- Render variant, compare to champion using pixel diff. Reject if layout shift >5% without hypothesis

Hono.js endpoint pseudocode:
```typescript
app.post('/compose', async (c) => {
  const tree = await agent.generate(prompt)
  const valid = validateSchema(tree) && await checkMobile(tree)
  if (!valid) return c.json({error: 'failed guardrails'}, 400)
  await db.insert(variants).values({tree, status: 'sandbox'})
  await prerenderToNginx(tree) // Handlebars → static HTML
})
```

Nginx serves pre-rendered HTML, not SSR. This guarantees <800ms TTFB on mobile, critical for conversion.

---

For your DTC subscription use case, start with 18 blocks total, not 100. Five per funnel type, each mobile-perfect. Lock the design tokens in code, not prompts. Let agents compete on composition and copy, not on whether buttons should be 44px or 32px. The visual polish comes from constraints, not from asking the LLM to "make it beautiful."

2: For a block-based, agent-first ecommerce funnel builder (Hono.js, PostgreSQL/Drizzle, Handlebars templates, static HTML pre-rendering via Nginx), where AI
   agents autonomously compose and iterate funnel pages via REST API using a JSON block tree with responsive styles, props, and actions — what is the
  optimal architecture for agents to generate visually polished, high-converting designs for DTC e-commerce subscription funnels (advertorials, product
  pages, VSL pages, checkout flows, upsell pages), given that 90% of traffic is mobile?

  Context: DTC e-commerce subscription funnels (supplements, skincare, beauty, pet) targeting $1M+/month revenue. The AI must produce pages that match
  top-performing DTC brand visual quality — not generic SaaS landing pages. Each page type has distinct design needs: advertorials (editorial, long-form),
  product pages (images, pricing bundles, urgency), checkout (minimal, trust-focused), VSL (video-centric, sticky player), upsell (one-click, urgency).

  (1) How should the LLM prompt structure, block composition logic, and design token system be architected so agents output mobile-first block trees that
  look professionally designed on small screens — cohesive typography, spacing, thumb-friendly CTAs, fast-loading visuals — while remaining technically
  valid (responsive, Stripe-compatible, tracking-instrumented) without human design intervention?

  (2) What makes an LLM-generated design look "good" on mobile? Specifically, what design system (CSS custom properties, spacing scale, typographic scale,
  color palette constraints, image aspect ratios, mobile-specific patterns like sticky CTAs, swipe carousels, accordion FAQs) should be hard-coded into the
  block template library so that ANY agent composition of blocks produces a visually appealing page, not a functional-but-ugly one?

  (3) How should the agent pipeline integrate with the A/B testing state machine (sandbox → elimination → commando → duel → champion) and the RAG-backed
  Marketing Evolution Engine to continuously discover, codify winning visual design patterns into SOPs, and feed them back into future agent generations?

  (4) What automated validation and guardrails should block trees pass through before static HTML generation — schema validation, mobile layout constraint
  checks (min tap targets, viewport overflow, CLS budgets), accessibility, and Lighthouse mobile performance scores?

3: Building an agentic funnel builder that autonomously produces polished, high-converting mobile designs—without a human designer in the loop—requires a carefully layered architecture. The solution combines a rigorous block-composition framework, a hard-coded DTC design system, a feedback-driven evolution pipeline that synthesizes real-world performance data, and a comprehensive validation gateway before any page reaches production. Below, we break down each layer for a system targeting $1M+/month DTC subscription brands.

---

## 1. Agent Prompting, Block Composition, and Token Architecture

The LLM prompt must be structured to guide agents in assembling mobile-first block trees that are technically valid and visually cohesive. The key is to constrain the output domain so the agent operates within a proven, validated design space.

### Prompt Structure
The prompt for each page generation request should include:
- **Page type (role):** advertorial, product page, VSL, checkout, upsell.
- **Brand context:** voice/tone rules, color palette, typography scale, available assets.
- **User intent:** traffic source (e.g., cold vs. warm), funnel stage, primary CTA.
- **Mobile-first mandate:** "Design for a 320px-wide viewport first; scale up only after mobile layout is complete."
- **Design constraints:** hard-coded values for spacing scale, typographic scale, minimum tap targets (44-48px), image aspect ratios, and sticky CTA patterns.
- **Output schema:** a JSON block tree conforming to a strict schema (block types, allowed children, responsive styles, actions).

A typical prompt might open with: "You are a mobile-first funnel designer. Given {{page_type}}, {{brand_context}}, output a valid JSON block tree using only allowed block types from the block library..."

### Block Composition Logic
Agents compose pages by selecting from a curated block library. Each block type encapsulates both structure and behavior:

| Block Type | Purpose | Mobile-Specific Behavior |
|---|---|---|
| Hero/Header | Primary value proposition and CTA | Single-column layout, CTA in thumb zone |
| Image Gallery | Product photos, lifestyle shots | Enforces 4:5 or 1:1 aspect ratios; lazy loads; supports swipeable carousels on mobile |
| Pricing/Bundle | Subscription tiers, quantity breaks | Mobile-optimized radio/chip selection; large tap targets |
| Trust Bar | Security badges, payment icons, testimonials | Compact horizontal scroll; always visible on checkout |
| Accordion FAQ | Long-form Q&A, ingredient details | Replaces desktop tables/columns; reduces scroll fatigue |
| Sticky CTA Bar | Persistent Add-to-Cart or Buy Now | Fixed bottom bar (60px height); visible only on mobile |
| Video Embed | VSL, product demos | Lazy-loaded; sticky player option on mobile |
| Form Block | Checkout fields, email capture | Single-column; autofill enabled; minimal fields |

Each block's JSON includes responsive styles (e.g., `flex-direction: column` on mobile, `row` on desktop), props for dynamic content, and actions (click → navigate, add-to-cart, open Stripe Checkout).

### Design Token System
A centralized design token system ensures visual consistency across any agent-composed page. Tokens are defined as CSS custom properties and injected into every Handlebars template:

```css
:root {
  /* Spacing scale (4px base) */
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.5rem;    /* 24px */
  --space-6: 2rem;      /* 32px */
  --space-8: 3rem;      /* 48px */

  /* Typographic scale (major third, 1.25 ratio) */
  --text-xs: clamp(0.75rem, 2vw, 0.875rem);
  --text-sm: clamp(0.875rem, 2.5vw, 1rem);
  --text-base: clamp(1rem, 3vw, 1.125rem);
  --text-lg: clamp(1.125rem, 3.5vw, 1.5rem);
  --text-xl: clamp(1.5rem, 4vw, 2rem);
  --text-2xl: clamp(2rem, 5vw, 2.5rem);

  /* Color palette constraints */
  --color-primary: #...
  --color-accent: #...
  --color-bg: #...
  --color-text: #...
  --color-cta: #...

  /* Mobile layout constraints */
  --tap-target-min: 44px;
  --cta-height: 56px;
  --sticky-bar-height: 60px;
  --viewport-padding: var(--space-4);

  /* Performance constraints */
  --image-max-width: 100%;
  --iframe-aspect-ratio: 16/9;
}
```

Fluid typography using `clamp()` ensures text scales smoothly across viewports without breakpoint jumps, a proven technique for modern responsive design. The spacing scale uses a 4px base, which maps cleanly to both mobile and desktop grid systems. Tokens are stored alongside block templates, making them the single source of truth for every generated page.

---

## 2. Hard-Coded Design System for Polished Mobile Output

To answer the question directly: what makes an LLM-generated design look "good" on mobile is a comprehensive, non-negotiable design system baked into the template library. Agents cannot override these values—they can only choose which blocks to use and in what order.

### Typographic Scale
Based on a 1.25 major-third ratio, converted to fluid `clamp()` values. Mobile base font size is 16px; body text uses `--text-base`; headings use `--text-lg` through `--text-2xl`. Line heights are fixed at 1.5 for body and 1.2 for headings. This prevents agents from selecting illegibly small text or oversized headlines that break mobile layouts.

### Spacing Scale
A non-negotiable 4px-based spacing scale with 8 discrete steps. All block margins, padding, and gaps reference these tokens. Agents cannot inject arbitrary pixel values. This guarantees consistent vertical rhythm regardless of block composition.

### Color Palette Constraints
Limited to 4–6 roles: primary, accent, background, text, CTA, and success/error states. Contrast ratios enforced: text must meet WCAG AA minimum (4.5:1 for normal text). CTA colors use maximum contrast against background.

### Image Aspect Ratios
Product images: 4:5 (portrait) or 1:1 (square). Hero/banner: 16:9 or 3:4. All images below 200 KB via compression, with WebP/AVIF serving where supported. Lazy loading on all below-fold images. This dramatically improves mobile LCP without sacrificing visual quality.

### Mobile-Specific Patterns Embedded in Templates

**Sticky CTAs:** Primary action buttons (Add to Cart, Buy Now, Subscribe) are locked to the bottom of the viewport at 56-60px height, always visible during scroll. Research shows this pattern boosts add-to-cart rates by 19% and reduces scroll-back friction by 41%. Sticky UI elements must stay under 15% of viewport height to avoid pushing primary content below the fold.

**Swipeable Carousels:** Product images and testimonials use swipeable galleries with dot indicators. Touch targets for navigation arrows are minimum 44px.

**Accordion FAQs:** Long-form content (ingredients, shipping details, subscription terms) collapses into accordion sections on mobile. This replaces desktop dropdown menus, which are notoriously difficult to use on touch devices. Accordion navigation has been shown to increase mobile engagement by over 30% while reducing bounce rates by more than 15%.

**Thumb-Zone Optimization:** All primary CTAs and critical actions are placed in the bottom 40% of the screen—the natural reach of a one-handed thumb grip. Buttons placed in the top third require grip shifts or a second hand, creating micro-friction that kills conversion on mobile.

**Minimum Tap Targets:** Every interactive element (buttons, links, form inputs) is minimum 44px × 44px, with at least 8px spacing between adjacent touch targets. Google's Material Design guidelines and WCAG 2.1 require 48px for critical actions; stores implementing this see a 22% improvement in checkout completion.

**Performance Budgets Embedded in Blocks:** Each block template includes performance constraints: images lazy-loaded by default, videos deferred until user interaction, critical CSS inlined (<150 KB), non-critical JS deferred. These are not optional—they are part of the block's compiled output.

### Why This Approach Works
By hard-coding these rules into the block library and token system, ANY composition of blocks will naturally produce a visually appealing page. The agent's job is reduced to selecting the right blocks for the funnel stage and arranging them in a logical order—not making design decisions about typography, spacing, or color. This is the fundamental architectural insight: *constrain the output space so thoroughly that "bad design" is structurally impossible*.

---

## 3. A/B Testing State Machine and RAG Evolution Engine

The agent pipeline integrates with an A/B testing state machine that progresses through five stages:

```
Sandbox → Elimination → Commando → Duel → Champion
```

### State Machine Architecture

| Stage | Description | Traffic Allocation | Duration |
|---|---|---|---|
| **Sandbox** | Agent generates 5–10 variant block trees; all rendered to static HTML; synthetic validation only (Lighthouse, schema, CLS) | 0% live | Automated |
| **Elimination** | Variants failing validation thresholds (Lighthouse <80, CLS >0.1, schema errors) are pruned | 0% live | Automated |
| **Commando** | Top 2–3 variants receive 5-10% traffic each; metrics tracked (conversion rate, AOV, bounce, LTV) | 15-30% total | 3–7 days |
| **Duel** | Winning Commando variant becomes Challenger; runs against current Champion at 50/50 split | 100% of test traffic | 7–14 days or statistical significance |
| **Champion** | Statistically significant winner (95% confidence) becomes new Champion; promoted to production; losing design patterns are recorded as anti-patterns | 100% live | Until next cycle |

This mirrors the Champion-Challenger methodology where the current best performer (Champion) is pitted against new variants (Challengers) on live traffic, with outcomes compared over time to determine genuine performance impact.

### RAG-Backed Marketing Evolution Engine

The RAG (Retrieval-Augmented Generation) engine is the continuous-learning backbone. It transforms raw A/B test outcomes into encoded design knowledge that informs future agent generations.

**Data Flow:**
1. Every block tree variant is stored with its performance metadata (traffic, conversions, revenue, device, page type, traffic source).
2. When a variant wins a Duel and becomes Champion, its block composition, design patterns, and token usage are vectorized and indexed.
3. When agents generate new pages, the RAG engine retrieves semantically similar high-performing block compositions from the knowledge base and injects them as few-shot examples into the generation prompt.
4. An LLM re-ranker scores retrieved candidates for relevance to the current page type and brand context before inclusion.

**Feedback Loop Mechanics:**
- Winning patterns are codified into "SOPs" (Standard Operating Patterns)—structured records that describe block sequences, token configurations, and context (e.g., "For supplement VSL pages with cold Facebook traffic, use: Hero → Problem/Agitation → Solution Teaser → Video Embed → Sticky CTA → Accordion FAQ → Trust Bar").
- Losing patterns are tagged as anti-patterns, reducing their retrieval weight.
- After every Champion promotion, the RAG index is updated, ensuring the next generation benefits from the most recent winning data.

This feedback loop is a key advantage of agentic architectures: models retrieve knowledge, plan work, call tools, verify outputs, and ship results into production systems, with continuous improvement built in.

### Integration with Agent Pipeline

The agent pipeline operates on a schedule or trigger (new campaign, A/B cycle completion):
1. **Retrieve:** Query RAG engine for top-K winning block compositions matching the target page type, product vertical, and traffic source.
2. **Augment:** Inject retrieved patterns as context into the generation prompt.
3. **Generate:** LLM produces candidate block trees with rationale for each design choice.
4. **Validate:** Block trees pass through the guardrail pipeline (Section 4).
5. **Render:** Valid trees are rendered to static HTML via Handlebars + Nginx.
6. **Deploy to Sandbox:** Variants enter the A/B state machine at the Sandbox stage.

Human-in-the-loop is optional but recommended: high-stakes pages (new brand launches, major campaigns) can flag for human review before Commando traffic allocation. However, the goal is to minimize this to edge cases where confidence scores fall below a threshold.

---

## 4. Automated Validation and Guardrails

Before any block tree is rendered to static HTML, it must pass through a multi-layer guardrail pipeline. These checks are automated, fast, and fail-closed: a single failing check prevents deployment.

### Layer 1: Schema Validation

The JSON block tree is validated against a strict JSON Schema:

- **Structural:** Valid block types only; correct nesting (e.g., Form blocks cannot contain Hero blocks).
- **Required fields:** Every block must have `id`, `type`, `props`, `responsiveStyles`.
- **Token usage:** All style values must reference design tokens (`--space-*`, `--text-*`, `--color-*`); raw pixel values or hex codes are rejected.
- **Action integrity:** All action references must point to valid endpoints (Stripe price IDs, internal routes, tracking events).
- **Tracking instrumentation:** Every interactive element must include `data-track-event` attributes for analytics.

Schema validation is the first and fastest check. Invalid JSON is rejected immediately with a detailed error report.

### Layer 2: Mobile Layout Constraint Checks

These programmatic checks simulate mobile rendering constraints:

- **Tap target audit:** All interactive elements must be ≥44px × 44px. Adjacent touch targets must be ≥8px apart. Failures are flagged with element IDs and recommended fixes.
- **Viewport overflow check:** No element may exceed 100vw horizontally. This catches blocks that might overflow on small screens.
- **Thumb zone verification:** Primary CTAs must be positioned in the lower 60% of the viewport (or have a sticky variant). Top-positioned CTAs trigger a warning.
- **Content hierarchy check:** Above-fold content must include a value proposition, primary CTA, and trust signal. This is validated by analyzing block order and types in the first 600px of rendered height.

### Layer 3: Performance Budget Enforcement

Static HTML is pre-rendered in a headless browser (Puppeteer/Playwright) and analyzed:

- **CLS budget:** Cumulative Layout Shift must be <0.1 on mobile emulation. This is measured by injecting the rendered page into a simulated viewport, loading all assets, and calculating layout shifts during load. Common CLS offenders—late-loading images without dimensions, dynamic font injection, injected ads—are prevented because the block library pre-allocates space for all dynamic content.
- **LCP budget:** Largest Contentful Paint must be <2.5 seconds on simulated 4G. Critical CSS is inlined; hero images are preloaded and dimensioned.
- **Total page weight:** <500 KB on initial load (HTML + critical CSS + above-fold images + minimal JS).
- **Image audit:** All images must be compressed (<200 KB per image) and served in modern formats. Missing `width`/`height` attributes are flagged.

### Layer 4: Accessibility Baseline

- **Color contrast:** All text/background combinations must meet WCAG AA (4.5:1). This is checked by extracting computed styles from the rendered page.
- **Semantic HTML:** Headings must be properly nested (h1 → h2 → h3); form inputs must have associated labels; images must have alt text.
- **Keyboard navigability:** All interactive elements must be focusable and operable via keyboard.

### Layer 5: Lighthouse Mobile Score Gate

The rendered page is submitted to Lighthouse (via PageSpeed Insights API or local Lighthouse CLI) in mobile emulation mode. Minimum passing scores:

| Metric | Gate |
|---|---|
| Performance | ≥80 |
| Accessibility | ≥90 |
| Best Practices | ≥90 |
| SEO | ≥90 |

Pages scoring below 80 on Performance are rejected. Research shows that improving Lighthouse mobile scores from 35 to 92 drove a 20% conversion rate increase and 13% total sales lift, making this a high-ROI gate.

### Guardrail Orchestration

All checks run in parallel where possible (schema validation, token checks, contrast analysis, Lighthouse), then results are aggregated. The system:

1. **Rejects** any variant that fails a hard gate (schema, CLS >0.1, LCP >3s, Lighthouse <80).
2. **Warns** on soft gates (thumb zone violations, missing alt text on non-critical images) and logs them for RAG indexing.
3. **Retries** with different block compositions if a variant fails, up to a configurable limit (default 3 attempts).
4. **Reports** all results to the A/B state machine, which uses pass/fail data to prune variants at the Elimination stage.

---

## Bringing It All Together: The End-to-End Flow

1. **Trigger:** New campaign, scheduled refresh, or A/B cycle completion.
2. **RAG Retrieval:** Winning patterns for target page type are fetched from the Marketing Evolution Engine.
3. **Agent Generation:** LLM composes a JSON block tree using only allowed blocks and design tokens, guided by retrieved patterns.
4. **Schema Validation:** Block tree is checked for structural validity and token compliance.
5. **Render to Static HTML:** Valid tree is compiled via Handlebars templates and pre-rendered.
6. **Guardrail Pipeline:** Rendered page is audited for mobile layout, performance, accessibility, and Lighthouse scores.
7. **A/B State Machine:** Passing variants enter Sandbox → Elimination → Commando → Duel → Champion.
8. **Feedback Loop:** Winning Champion's design patterns are vectorized, indexed, and fed back into the RAG engine.

This architecture ensures that every page an AI agent generates is not only technically valid but genuinely high-converting and visually refined—matching the quality bar of top-performing DTC brands like Hint Water or Java Planet, while operating at the scale and speed that only automation can deliver.

4: **Optimal architecture emphasizes a constrained, token-driven block system with strong mobile-first priors, iterative agent loops, rigorous validation, and closed-loop feedback from real performance data.** This setup enables agents to produce DTC-quality (supplements, skincare, beauty, pet) pages that feel premium and editorial, not generic, while ensuring technical validity for high-traffic mobile funnels (90%+ mobile).

### (1) LLM Prompt Structure, Block Composition Logic, and Design Token System

**Core Data Model (JSON Block Tree):**  
Store pages as a hierarchical JSON tree in PostgreSQL (via Drizzle). Each node:  
- `type`: e.g., `hero`, `text-block`, `image-grid`, `cta-sticky`, `video-player`, `accordion`, `pricing-bundle`, `trust-badges`, `testimonial-carousel`.  
- `props`: content (headlines, copy, images with alt/optimization metadata), actions (Stripe checkout links, tracking events like `addToCart`, `viewContent`).  
- `styles`: references to design tokens only (no arbitrary CSS).  
- `responsive`: minimal overrides (e.g., mobile font scale factor, stack order).  
- `meta`: role in funnel (awareness, consideration, conversion), conversion heuristics.  

**Design Token System (Hard-coded Foundation):**  
Define tokens as CSS custom properties (or a JSON token file synced to Handlebars/Nginx pre-render). Use semantic + primitive layers inspired by modern design systems.  

- **Spacing Scale**: 8px base (mobile rhythm): `space-1` (0.5rem), `space-2` (1rem), `space-3` (1.5rem), `space-4` (2rem), up to `space-8`. Multiples ensure rhythmic vertical flow. Mobile: tighter defaults + padding adjustments.  
- **Typographic Scale**: Mobile-first hierarchy (e.g., `text-xs` to `text-4xl`). Use 1.25–1.333 modular scale for harmony. Semantic: `heading-display`, `heading-section`, `body-lead`, `body-text`, `caption`. Line heights 1.4–1.6 for readability. Font stacks: system + 1-2 web fonts (e.g., Inter/Satoshi for modern DTC).  
- **Color Palette**: Brand primary/accent + neutrals. Semantic: `bg-surface`, `text-primary`, `accent-cta`, `success`, `warning-urgency`. Constraints: max 5-7 colors; high contrast (WCAG AA/AAA). Dark/light modes optional.  
- **Other**: Border radius (`radius-sm/md/lg`), shadows (subtle for depth), image aspect ratios (e.g., 16:9 hero, 1:1 product, 4:5 mobile portrait), container max-widths with mobile 100% fluid.  

**Block Template Library**: Pre-build 30-50 atomic + composite blocks (e.g., "editorial-hero", "urgency-pricing", "sticky-mobile-cta", "VSL-with-transcript"). Each has: default token styles, mobile variants, accessibility props, and example high-converting variants from top DTCs. Agents compose by selecting/combining these, not inventing from scratch.

**LLM Prompt Structure (Agent-First)**:  
Use chain-of-thought with few-shot examples of top DTC pages (advertorial long-form storytelling, product benefit-driven imagery, VSL sticky players, minimal checkout).  

1. **Context**: Funnel stage, product category (e.g., "skincare subscription, anti-aging, $97/mo"), target persona, competitor refs, winning patterns from RAG.  
2. **Constraints**: Mobile-first (single-column, thumb zones, <3s LCP), token-only styles, page-type specifics (advertorial: editorial typography + long scroll; checkout: trust + minimal fields; upsell: one-click urgency).  
3. **Output Format**: Strict JSON schema for block tree + rationale.  
4. **Iteration Instructions**: "Critique for polish, conversion psychology (urgency, social proof, risk reversal), mobile UX. Revise."  

**Composition Logic**: Agents use a "layout engine" prompt or lightweight code step (e.g., via tool) to ensure vertical stack, proper grouping (e.g., no orphaned CTAs), and hierarchy. For visuals: reference optimized image URLs with srcset; agents describe alt text and lazy-loading.

This produces technically valid, responsive output (Handlebars renders tokens to CSS; Nginx serves pre-rendered HTML). Stripe integration via action props; tracking via event attributes.

### (2) What Makes LLM-Generated Designs "Good" on Mobile?

**Key Traits for Polish & Conversion**:  
- **Visual Hierarchy & Readability**: Large hero headlines (mobile-scaled), short paragraphs, ample white space. Thumb-friendly CTAs (min 48-56px tap targets).  
- **Fast, Stable Layout**: Lazy images, font-display: swap, no layout shifts.  
- **DTC Aesthetics**: Clean, premium (high-quality product imagery, subtle animations, editorial tone for advertorials). Not flat SaaS. Use lifestyle/ingredient close-ups, before-after, UGC.  
- **Patterns Hard-Coded in Library**: Sticky bottom CTAs (mobile), swipe carousels (testimonials/products), accordions (FAQs/ingredients), progress indicators (VSL), one-column flows, urgency timers/bundles. Hero with video background or strong imagery + overlay CTA. Pricing with popular badge.

Enforce via tokens + block constraints: any composition inherits rhythm, contrast, and mobile patterns. Agents get examples of "ugly vs. polished" in prompts.

### (3) Integration with A/B Testing State Machine & Marketing Evolution Engine

**Pipeline**:  
- **Agent Generation** → Sandbox (internal traffic or simulated) → A/B state machine (sandbox → elimination → commando → duel → champion).  
- **RAG Marketing Evolution Engine**: Vector DB + graph of past winners (blocks, tokens, full trees, metrics: CVR, add-to-cart rate, LCP, bounce). Retrieve similar funnels + winning variants (e.g., "skincare advertorials with >4% CVR"). Codify into SOPs/prompts (e.g., "Use this hero pattern for supplements").  
- **Feedback Loop**: Post-test, extract winning block subtrees/styles. Fine-tune prompts or few-shots. Retrain/re-prompt agents periodically. Agents propose mutations based on underperforming metrics.  
- **State Machine**: Track variants by tree hash/diff. Auto-promote champions; archive losers with reasons. Use for evolutionary generation (e.g., genetic-style crossover of blocks).

This turns the system into a self-improving engine discovering visual patterns at scale.

### (4) Automated Validation & Guardrails

**Pre-Static HTML Generation Pipeline** (in Hono.js or worker):  
1. **Schema Validation**: JSON Schema/Zod for block tree (required props, valid types, token references only).  
2. **Mobile Layout Checks**: Simulate viewport (e.g., via Puppeteer/Playwright): min tap targets (48px), no horizontal overflow, stacking order, readable text (font size).  
3. **Accessibility**: Automated axe-core or similar (contrast, ARIA, alt texts, keyboard nav).  
4. **Performance**: Headless Lighthouse (mobile preset): thresholds like LCP < 2.5s, CLS < 0.1, INP < 200ms, Performance score > 85-90. Image optimization checks (size, format, lazy).  
5. **Functional**: Mock Stripe flows, tracking pixel fires, form validation. Conversion intent simulation.  
6. **Brand/Policy**: Content moderation (claims compliance for supplements), visual consistency score (token adherence).  

Fail → feedback to agent for revision (with error trace). Pass → pre-render static HTML via Handlebars + cache in Nginx. Monitor real-user metrics post-launch and feed back.

**Implementation Tips**: Use code_execution-like tools in agent loop for validation. Rate-limit generations. Start with strong library + tokens to bootstrap quality, then evolve via data.

This architecture minimizes human intervention while maximizing polish, conversions, and iteration speed for $1M+/mo DTC funnels. It treats design as data-driven and constrained creativity within proven mobile patterns.

5: This is a sophisticated systems architecture problem. Below is a comprehensive blueprint addressing all four dimensions.

---

## (1) Agent Prompt Architecture, Block Composition Logic & Design Token System

### LLM Prompt Structure: The "Funnel DNA" Protocol

The prompt must constrain the LLM's creative freedom to a **closed design grammar** while preserving persuasive copy flexibility. Structure prompts in three layers:

**Layer A: Funnel-Type Ontology (System Prompt)**
```
You are a [Advertorial|ProductPage|VSL|Checkout|Upsell] architect.
Constraints:
- Mobile viewport: 375px–428px primary, 768px secondary
- Max block depth: 3 (section → row → element)
- Allowed blocks: [whitelist for this funnel type]
- Conversion pattern: [editorial-argument|bundle-urgency|video-sticky|minimal-trust|one-click]
```

**Layer B: Block Composition DSL (JSON Schema)**
Each agent outputs a **Block Tree** with strictly typed nodes:

```json
{
  "id": "uuid",
  "type": "section|row|column|element",
  "blockRef": "hero-v1|bundle-grid-v2|sticky-cta-v1",
  "props": {
    "copy": { "headline": "...", "subhead": "..." },
    "media": { "src": "...", "aspect": "4:5", "loading": "eager" },
    "actions": { "cta": { "text": "...", "stripePriceId": "...", "event": "checkout.initiated" } }
  },
  "styleOverrides": {
    "padding": "var(--space-6)",
    "bg": "var(--surface-primary)"
  },
  "children": []
}
```

**Key constraint:** `styleOverrides` can only reference **design tokens**, never raw values. This prevents the LLM from inventing `#ff5733` or `padding: 47px`.

**Layer C: Contextual RAG Injection**
Before generation, inject:
- Top 3 winning block sequences from the Marketing Evolution Engine (by funnel type + niche)
- Current brand design token manifest
- Mobile performance budget (max 2.5s LCP, 0.1 CLS)

### Block Composition Logic: The "Slot-Fill" Pattern

Agents don't design from scratch—they **orchestrate proven block templates** into sequences.

```
┌─────────────────────────────────────────┐
│  Funnel Type → Preset Block Sequence    │
│  (e.g., Advertorial = Hero → Story →    │
│   Proof → Offer → FAQ → Sticky CTA)     │
├─────────────────────────────────────────┤
│  Agent selects block variant per slot   │
│  based on:                              │
│  • RAG-winning patterns                 │
│  • Product category (supplement vs      │
│    skincare have different proof needs) │
│  • Traffic source (FB cold vs email)    │
├─────────────────────────────────────────┤
│  Agent generates copy/media props       │
│  within block constraints               │
└─────────────────────────────────────────┘
```

This ensures the *information architecture* is always sound, while the LLM focuses on *persuasion craft* (copy, social proof selection, offer framing).

### Design Token System: The "Prison of Beauty"

Hard-code a **mobile-optimized token system** that makes mathematical harmony inevitable:

```css
:root {
  /* Typography: Major Third scale (1.25), capped for mobile */
  --text-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);
  --text-sm: clamp(0.875rem, 0.8rem + 0.35vw, 1rem);
  --text-base: clamp(1rem, 0.9rem + 0.5vw, 1.125rem);
  --text-lg: clamp(1.125rem, 1rem + 0.65vw, 1.25rem);
  --text-xl: clamp(1.25rem, 1.1rem + 0.8vw, 1.5rem);
  --text-2xl: clamp(1.5rem, 1.3rem + 1vw, 1.875rem);
  --text-3xl: clamp(1.875rem, 1.6rem + 1.4vw, 2.25rem);
  
  /* Spacing: 4px base, exponential feel */
  --space-1: 0.25rem;  --space-2: 0.5rem;   --space-3: 0.75rem;
  --space-4: 1rem;     --space-5: 1.5rem;   --space-6: 2rem;
  --space-7: 2.5rem;   --space-8: 3rem;     --space-9: 4rem;
  --space-10: 5rem;
  
  /* Colors: Semantic, never raw hex in blocks */
  --surface-primary: #FFFFFF;
  --surface-secondary: #F7F7F5;
  --surface-brand: var(--brand-600);
  --text-primary: #1A1A1A;
  --text-secondary: #6B6B6B;
  --accent-cta: var(--brand-600);
  --accent-urgent: #DC2626;
  
  /* Motion: Reduced by default, instant on mobile */
  --transition-fast: 150ms;
  --transition-base: 200ms;
}
```

**Critical rule:** The LLM prompt explicitly forbids `styleOverrides` that use values outside this token set. The agent can only compose, not invent spacing or colors.

---

## (2) The "Any Composition Looks Good" Design System

To ensure *any* valid block tree looks polished, hard-code these **non-negotiable mobile patterns** into the Handlebars template library:

### A. Typographic Lock-In
- **Max 2 font families** loaded: a geometric sans-serif for UI/CTAs (e.g., Inter, Geist) and an editorial serif for advertorials if needed (e.g., Source Serif).
- **Line-height enforced by element type:** Headlines `1.1–1.2`, body `1.5–1.6`, captions `1.4`.
- **Max line length:** 35–45 characters per line on mobile (achieved via `max-width: 28ch` on headlines, `65ch` on body).

### B. Thumb-Friendly Interaction Zone
All block templates must respect:

```css
.min-tap-target {
  min-height: 48px;
  min-width: 48px;
}

.cta-primary {
  min-height: 56px; /* Prime thumb real estate */
  border-radius: 12px; /* iOS-native feel */
  font-weight: 600;
  letter-spacing: -0.01em;
  width: 100%; /* Full-width on mobile */
  margin-top: var(--space-5);
}
```

### C. Mobile-First Layout Primitives
Hard-code these block templates:

| Block | Mobile Behavior | Conversion Pattern |
|-------|----------------|-------------------|
| `sticky-cta-v1` | Fixed bottom, 16px padding, appears after scroll | Always-visible action |
| `hero-split-v2` | Stacked, image 4:5 aspect, text below | Visual hook |
| `bundle-grid-v3` | Vertical cards, 1-col, large tap targets | Bundle selection |
| `video-sticky-v1` | Inline → sticky top on scroll (250px height) | VSL retention |
| `accordion-faq-v2` | Native `<details>`, 56px summary rows | Objection handling |
| `social-proof-v2` | Horizontal scroll carousel, snap-x | Trust building |
| `urgency-bar-v1` | Sticky top, 44px height, countdown | Scarcity |

### D. Image Aspect Ratio Prison
Restrict agents to these aspect ratios only (enforced by template):
- Product shots: `1:1` or `4:5`
- Lifestyle/editorial: `3:4` or `16:9`
- Icons/avatars: `1:1`
- Video thumbnails: `16:9`

This prevents layout shifts and maintains visual rhythm.

### E. The "Vertical Rhythm" Grid
Every block template uses a **8px baseline grid**. Padding/margins are always multiples of `--space-1` (0.25rem = 4px). This creates subconscious harmony even when blocks are composed by an agent with no taste.

### F. Color Palette Constraints
Provide agents with **pre-approved palette sets** per niche:
- Supplements: Clean white + deep green + warm accent
- Skincare: Soft blush + charcoal + gold accent
- Pet: Warm cream + navy + orange accent

The agent picks a palette set; it cannot modify individual colors. This prevents "corporate blue" genericism while maintaining brand coherence.

---

## (3) A/B Testing Integration & The Marketing Evolution Engine

### The State Machine: Agent-Aware Funnel Lifecycle

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│ SANDBOX  │ → │ ELIMINATE│ → │ COMMANDO │ → │   DUEL   │ → │ CHAMPION │
│ (n=100)  │    │ (n=500)  │    │ (n=2k)   │    │ (n=5k)   │    │ (full)   │
└──────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘
     ↑                                                              │
     └──────────────────── FEEDBACK LOOP ───────────────────────────┘
```

**Agent Integration Points:**

1. **Sandbox Generation:** Agent generates 10 variant block trees per funnel concept. Each varies ONE dimension (headline angle, hero layout, CTA color, social proof placement) while holding others constant.

2. **Elimination Gate:** Auto-kill variants with:
   - Mobile Lighthouse < 70
   - CLS > 0.15
   - Tap target violations
   - Bounce rate > 85% at 10-sec mark

3. **Commando Scaling:** Winning variants get "agent-polished"—the LLM refines copy based on heatmap RAG data (where did users drop off?).

4. **Duel Phase:** Head-to-head block sequence testing. The RAG engine retrieves: *"In supplement advertorials, social-proof-before-offer beats offer-before-proof 62% of the time."*

5. **Champion Codification:** When a variant wins by >15% CVR with p<0.05, the Marketing Evolution Engine:
   - Extracts the block sequence as a **Winning Pattern SOP**
   - Vectorizes the visual layout (not copy, but structure)
   - Stores: `[funnel_type, niche, traffic_source, block_sequence, conversion_lift, confidence]`

### RAG-Backed Marketing Evolution Engine Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Funnel DB      │────▶│  Pattern         │────▶│  Vector Store   │
│  (PostgreSQL)   │     │  Extractor       │     │  (pgvector)     │
│  • Page metrics │     │  • Block tree    │     │  • Embedding of │
│  • Event stream │     │    diff analysis │     │    block layout │
│  • Winner flags │     │  • Lift attribution│   │  • Copy angle   │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                              │                           │
                              ▼                           ▼
                       ┌──────────────────┐     ┌─────────────────┐
                       │  SOP Registry    │◄────│  Semantic       │
                       │  (Drizzle ORM)   │     │  Retrieval      │
                       │  • Pattern ID    │     │  • KNN search   │
                       │  • Constraints   │     │  • Niche filter │
                       │  • Confidence    │     │  • Recency bias │
                       └──────────────────┘     └─────────────────┘
                              │
                              ▼
                       ┌──────────────────┐
                       │  Agent Prompt    │
                       │  Injection       │
                       │  (Top-3 patterns │
                       │   + guardrails)  │
                       └──────────────────┘
```

**Feedback Loop Mechanism:**
- Weekly batch job: Re-embed winning block trees with updated performance data
- Agent prompt dynamically includes: *"Use pattern #2847 (sticky CTA + accordion FAQ + bundle grid) for supplement checkouts; it has 95% confidence and 23% lift."*
- **Negative learning:** Losing patterns are stored with "anti-prompt" tags so agents avoid them

---

## (4) Automated Validation & Guardrails Pipeline

Before Nginx static generation, every block tree passes through a **Validation DAG**:

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   SCHEMA    │───▶│   LAYOUT    │───▶│    A11Y     │───▶│  PERFORMANCE │
│  VALIDATION │    │  CONSTRAINTS│    │   CHECK     │    │   BUDGET     │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
      │                  │                  │                  │
   Zod/Joi           Custom rules        Axe-core         Lighthouse CI
   • Type safety      • Tap targets       • Color contrast  • LCP < 2.5s
   • Block whitelist  • Viewport overflow  • Alt text       • CLS < 0.1
   • Token refs only  • Font size min     • Focus order    • TBT < 200ms
   • Required props   • Max nesting depth  • ARIA labels   • < 500KB JS
```

### Detailed Guardrails

**Schema Validation (Zod)**
```typescript
const BlockTreeSchema = z.object({
  type: z.enum(['section', 'row', 'column', 'element']),
  blockRef: z.string().regex(/^[a-z0-9-]+-v\d+$/), // e.g., hero-v2
  styleOverrides: z.record(z.string().regex(/^var\(--.+\)$/)), // Token prison
  props: z.object({ ... }).strict(),
  children: z.lazy(() => BlockTreeSchema.array()).max(3) // Depth limit
});
```

**Mobile Layout Constraints**
- **Tap Target Audit:** Recursively check all interactive elements. If `width < 48px` or `height < 48px`, auto-reject.
- **Viewport Overflow:** Simulate 375px viewport. If any element `scrollWidth > clientWidth`, flag.
- **Text Legibility:** Minimum `font-size: 14px` for body, `12px` for legal captions only.
- **Safe Area:** Respect `env(safe-area-inset-*)` for sticky CTAs on notched devices.

**Accessibility**
- All images must have `alt` (enforced in schema; agent must generate or use `aria-hidden="true"` for decorative)
- Color contrast ratio ≥ 4.5:1 (automated via `apca-check` or `axe-core`)
- Form inputs must have associated labels
- No `outline: none` without replacement focus style

**Performance Budget (Lighthouse CI in Pipeline)**
- **LCP ≤ 2.5s:** Hero images must be `<img>` with `fetchpriority="high"`, WebP, max 200KB
- **CLS ≤ 0.1:** All media blocks must have explicit `width`/`height` or aspect-ratio containers
- **TBT ≤ 200ms:** No third-party scripts in critical path; Stripe.js loaded async
- **Total Blocking Time:** Handlebars pre-render means zero client-side JS for layout; only interactive hydration (CTA clicks, accordion toggle) loads async

**Stripe & Tracking Instrumentation**
- Schema validates that all `stripePriceId` references exist in product catalog
- Tracking events (`checkout.initiated`, `upsell.accepted`) must match analytics schema
- One-click upsell blocks must include `customer_session_token` prop

---

## Summary: The Core Insight

The optimal architecture treats the LLM not as a designer, but as a **persuasion copywriter and block orchestrator**. All visual quality is guaranteed by:

1. **A closed design token grammar** the agent cannot violate
2. **Hard-coded mobile-first block templates** that encode DTC conversion patterns
3. **A RAG loop that turns winning pages into structural SOPs** the agent retrieves before generating
4. **A validation pipeline that rejects anything that fails mobile UX, performance, or accessibility budgets**

The result: agents compose pages that feel like they were built by a $500/hour DTC conversion agency, rendered as static HTML via Nginx, hitting sub-2.5s LCP on 4G.

6: This architecture must operate on a core principle: **constrained creativity**. Agents don't write CSS or HTML; they compose validated JSON trees against an immutable design system. The rendering pipeline (Handlebars + Nginx) enforces mobile polish, while telemetry + RAG continuously upgrades the constraints.

Here’s the production-ready architecture mapped to your stack and DTC requirements.

---
## (1) Prompt Structure, Block Composition Logic & Design Token Architecture

### LLM Prompt Structure (Multi-Layer)
```text
SYSTEM:
You are a senior DTC conversion designer specializing in mobile-first subscription funnels. 
Output ONLY valid JSON matching the provided BlockTreeSchema. 
Never invent CSS, inline styles, or layout primitives. Use ONLY tokens from the DesignTokenRegistry.
Follow mobile stacking, thumb-zone placement, and conversion heuristics for: {page_type}

CONTEXT:
- Brand: {brand_name}, Audience: {audience}, Offer: {subscription_offer}
- Goal: {primary_goal}, Trust Level: {cold/warm/hot}
- Technical: Hono-compatible, Handlebars-ready, Stripe checkout compatible, GA4/Pixel tracking-ready

RULES:
1. Mobile-first only. Max 3 nesting levels. No arbitrary spacing/colors.
2. Every CTA >= 48px height, sticky where conversion dictates.
3. All media include aspect-ratio, loading="lazy", decoding="async".
4. Attach tracking props: data-gtm-event, data-fb-content-id, data-utm-source.
5. Return JSON only.

FEW-SHOT EXAMPLES: [3 curated, high-CVR DTC block trees for this page type]
```

### Block Composition Logic
- **Registry-Driven**: Agents select from a strict `block_registry` table (Drizzle). Each block declares: `allowed_parents`, `max_children`, `required_props`, `default_tokens`, `page_type_compatibility`.
- **DAG Tree Structure**: 
  ```json
  {
    "type": "section",
    "layout": "stack",
    "children": [
      { "type": "grid", "cols": 1, "children": [ ... ] },
      { "type": "sticky_bar", "props": { "cta_text": "Subscribe & Save", "stripe_price_id": "..." } }
    ]
  }
  ```
- **Composition Engine**: Hono middleware validates tree topology against Drizzle rules before passing to Handlebars. Prevents illegal nesting, enforces mobile stacking defaults.

### Design Token System
- Stored in PostgreSQL: `tokens(id, name, category, mobile_value, desktop_value, hex/numeric, constraints)`
- Agents reference by `token_id` (e.g., `"spacing": "space-m"`, `"color_bg": "surface-alt"`).
- **Resolver Layer**: Handlebars helper `{{resolveToken id}}` maps to CSS custom properties at compile time.
- **Immutability**: Tokens are versioned. Promoting a token requires migration. Agents cannot output raw values.

---
## (2) What Makes LLM-Generated Design "Good" on Mobile?

Polished mobile DTC design emerges from **hard-coded constraints**, not agent freedom. Bake these into the Handlebars partials and CSS foundation:

### Core Design System
| Category | Constraint | Mobile Rationale |
|----------|------------|------------------|
| **Typography** | `clamp(1rem, 4vw + 1rem, 1.15rem)` body; H1 `1.75rem`; 3-size max | Prevents scaling bloat, maintains readable rhythm |
| **Spacing** | 4px grid: `xs:4, s:8, m:12, l:16, xl:24, 2xl:32` | Predictable padding/margin, reduces CLS |
| **Color Palette** | 1 primary, 1 accent, 3 neutrals, semantic states. All WCAG AA | Eliminates muddy contrast, focuses attention |
| **Radii/Shadows** | `--radius: 8px`, `--shadow-sm: 0 1px 2px rgba(0,0,0,0.05)` | Consistent card elevation, avoids heavy iOS/Android mismatch |
| **Images** | Enforced `aspect-ratio` + `object-fit: cover`. WebP/AVIF fallback | Eliminates layout shift, ensures fast paint |

### Hard-Coded Mobile Patterns (Handlebars Partials)
- **Sticky CTA Bar**: `position: sticky; bottom: 0; inset: 0 0 env(safe-area-inset-bottom) 0; backdrop-filter: blur(8px); z-index: 50`
- **Swipe Carousels**: `scroll-snap-type: x mandatory; scroll-padding: 16px;` + native `<section>` structure for a11y
- **Accordion FAQs**: Progressive disclosure using `<details>` + CSS `:has()` for animation. Prevents mobile wall-of-text
- **Bundle Picker**: Horizontal scroll with `touch-action: pan-x`, large tap targets, clear selected state
- **Thumb Zones**: Primary CTAs and navigation locked to `60–80vh` viewport range. Top `0–15vh` reserved for headlines/logos

**Rule**: Agents compose blocks, but layout behavior is **pre-wired** in Handlebars templates. The JSON only toggles variants or passes data.

---
## (3) A/B Testing State Machine + RAG Marketing Evolution Engine

### State Machine Flow
```
Sandbox → Elimination → Commando → Duel → Champion
```
- **Sandbox**: 5% traffic, isolated variant ID, full telemetry enabled
- **Elimination**: Drop variants below baseline CVR after `n` sessions
- **Commando**: Aggressive testing (20–40% traffic), Bayesian bandit allocation
- **Duel**: Head-to-head against current champion, statistical significance threshold (95% confidence, min 2k conversions)
- **Champion**: 80–100% traffic, promoted to `stable`, archived variants tagged for pattern extraction

### RAG-Backed Marketing Evolution Engine
1. **Pattern Extraction**: Nightly job aggregates winning variant JSON + telemetry. Uses rule-based + LLM analysis to extract heuristics:
   - `"sticky_cta + urgency_microcopy + 4:5_hero → +11% CVR on warm traffic"`
   - `"trust_badge_row above pricing → reduces bounce by 18%"`
2. **SOP Generation**: Converts heuristics into structured prompt augmentations + token weight adjustments. Stores in `pgvector` with metadata: `page_type, audience, traffic_temp, lift, json_template`.
3. **Feedback Injection**:
   - **Prompt Context**: RAG retrieves top 3 matching SOPs, injects into `FEW-SHOT EXAMPLES` and `RULES` for next generation cycle.
   - **Block Registry**: High-performing block configs get promoted to `recommended_weight` in composition engine. Low performers get deprecated.
   - **Token Evolution**: If `primary-action` color consistently wins with `blue-600`, system proposes token update → human approves → version bump.

### Architecture Integration (Hono + Drizzle + Nginx)
- Nginx `split_clients` or edge router directs traffic to variant static HTML
- Webhook fires conversion events → Hono `/api/telemetry` → Drizzle `ab_events` table
- Cron job → aggregators → RAG indexer → prompt builder → triggers agent generation for next sprint
- All variants versioned via `drizzle-kit` migrations + Git for prompt/templates

---
## (4) Automated Validation & Guardrails Before Static HTML

Agents generate JSON. Before Handlebars compilation, run a **fail-fast validation pipeline**:

### 1. Schema Validation (Zod)
```ts
const BlockTreeSchema = z.object({
  type: z.enum(['section','grid','text','media','cta','sticky_bar','accordion','trust_badges']),
  props: z.record(z.string(), z.unknown()).refine(props => validateTokenReferences(props)),
  children: z.array(z.lazy(() => BlockTreeSchema)).max(4), // Prevent deep nesting
}).superRefine((tree, ctx) => {
  if (tree.type === 'cta' && !tree.props.tap_target_height) 
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'CTA missing mobile height token' });
});
```
- Disallows arbitrary CSS, enforces token-only, validates Stripe/tracking props

### 2. Mobile Layout Constraint Checks (Static Analyzer)
Custom AST walker checks:
- **Tap Targets**: All interactive props resolve to `>= 48x48px` tokens
- **Viewport Overflow**: No `min-width` or fixed widths > `100vw`. Flex/grid gaps respect `space-scale`
- **CLS Budget**: Media blocks missing `aspect-ratio` or dynamic content without `min-height` tokens fail
- **Safe Area**: Top/bottom containers include `env(safe-area-inset-*)` tokens

### 3. Accessibility Pre-Check
- Headless `axe-core` or custom rules:
  - Contrast ratios ≥ 4.5:1
  - Semantic heading hierarchy (`h1` max 1, sequential `h2-h4`)
  - `aria-label` on all icon buttons/carousels
  - Focus states mapped to token `--focus-ring`

### 4. Lighthouse Mobile Simulation
- Playwright headless run with Moto G4/Chrome emulation
- Metrics: `LCP < 2.2s`, `CLS < 0.1`, `INP < 150ms`
- Checks: Render-blocking scripts, critical CSS inlined, image compression, third-party tag defer
- **Fail Action**: Rejects compilation, returns structured repair hints. Agent retries with constrained prompt. If fails twice, falls back to last champion variant.

---
## Implementation Roadmap

| Phase | Deliverable | Tech |
|-------|-------------|------|
| 1 | Block Registry + Token DB + Zod Schema | Drizzle, PostgreSQL, Zod |
| 2 | Handlebars Partials + Token Resolver | Handlebars, CSS vars, Nginx static serve |
| 3 | Validation Pipeline + Playwright A11y/Lighthouse | Node.js worker queue, Playwright, axe-core |
| 4 | A/B State Machine + Telemetry Ingestion | Hono, pgvector, Nginx split routing |
| 5 | RAG Pattern Extractor + Prompt Orchestrator | LangChain/Custom, OpenAI/Anthropic, cron scheduler |
| 6 | Agent REST API + Retry/Fallback Logic | Hono, queue (BullMQ), fallback champion pool |

**Critical Success Factor**: Treat the AI as a *combinatorial composer*, not a visual artist. Polish comes from immutable tokens, pre-wired mobile patterns, and relentless constraint enforcement. The RAG loop ensures the constraints evolve based on real DTC conversion data, not aesthetic guesswork.

7: # Agent-First DTC Funnel Builder: Complete Architecture

This is a system design problem with four interlocking layers: **design system correctness**, **agent cognition**, **experimental feedback loops**, and **automated quality gates**. I'll address each in depth, then show how they compose.

---

## Part 1: LLM Prompt Structure, Block Composition Logic & Design Token System

The core insight is that agents should never make free-form design decisions. Every degree of freedom you leave open is a vector for ugly output. The architecture inverts the usual approach: **the system constrains 95% of design decisions at the token/template layer, and the agent only decides within a narrow compositional space.**

### The Three-Layer Prompt Architecture

Structure your agent prompts in three distinct phases, each with a different prompt and context:

**Phase 1 — Funnel Strategy Prompt (planner agent)**
This agent receives: funnel type, product category, target avatar, offer structure, traffic source, and A/B test hypothesis. It outputs a `FunnelSpec` JSON: an ordered list of sections with their purpose, emotional beat, and primary CTA. It does not touch visual properties. Example output for a supplement advertorial:

```json
{
  "funnelType": "advertorial",
  "sections": [
    { "id": "hook", "purpose": "pattern_interrupt", "beat": "curiosity", "cta": null },
    { "id": "authority", "purpose": "credibility", "beat": "trust", "cta": null },
    { "id": "problem_agitate", "purpose": "pain_amplification", "beat": "anxiety", "cta": null },
    { "id": "solution_reveal", "purpose": "product_intro", "beat": "hope", "cta": "learn_more_anchor" },
    { "id": "social_proof", "purpose": "risk_reduction", "beat": "validation", "cta": null },
    { "id": "offer", "purpose": "conversion", "beat": "urgency", "cta": "primary_purchase" }
  ]
}
```

**Phase 2 — Block Composition Prompt (composer agent)**
This agent receives the `FunnelSpec` plus your block library manifest (a structured list of available block types with their props schema, design constraints, and mobile behavior). The agent's only job is to select and sequence blocks from the library and fill their props. It cannot invent new blocks or add arbitrary CSS. The system message must be extremely explicit:

```
You are a block composer for DTC mobile-first funnel pages.
You output ONLY valid JSON block trees conforming to BlockTreeSchema v2.
You select blocks exclusively from the provided BlockLibrary.
You NEVER add inline styles, custom CSS classes, or layout properties.
All visual styling is controlled by the design token system — you set ONLY semantic props.
For each block, set: content props (text, images, lists), behavioral props (cta_action, tracking_event), and variant tokens (color_scheme, spacing_variant, emphasis_level).
Mobile layout is handled automatically by the block template — do not attempt to control it.
```

The composition prompt then includes the RAG-retrieved SOPs from your Marketing Evolution Engine as few-shot context: "Here are the top-performing block sequences for supplement advertorials on mobile, validated across 2.3M sessions..." This is the highest-leverage injection point.

**Phase 3 — Content Hydration Prompt (copywriter agent)**
A separate agent fills the text props using the product brief, avatar pain points, and proven copy frameworks. Keeping copy separate from composition prevents the composer agent from hallucinating visual decisions while trying to write copy simultaneously.

### Block Composition Logic in the API

Your Hono.js composition engine should enforce a **block grammar** — rules about which blocks can follow which, similar to a type system for layout. Implement this as a directed graph where nodes are block types and edges represent valid adjacencies:

```typescript
const blockGrammar: BlockGrammar = {
  "hero_advertorial": {
    validPredecessors: [],
    validSuccessors: ["byline_bar", "editorial_body", "pull_quote"],
    maxPerPage: 1,
    mobileConstraints: { minHeight: "100svh", stickyBehavior: "none" }
  },
  "sticky_cta_bar": {
    validPredecessors: ["*"], // can follow anything
    validSuccessors: ["*"],
    maxPerPage: 1,
    mobileConstraints: { position: "fixed", bottom: 0, zIndex: 100, tapTargetMin: 56 }
  },
  "swipe_testimonial_carousel": {
    validPredecessors: ["section_header", "social_proof_header"],
    validSuccessors: ["trust_badge_row", "cta_block"],
    maxPerPage: 3,
    mobileConstraints: { overscrollBehavior: "contain", snapType: "x mandatory" }
  }
}
```

The API validates every block tree against this grammar before accepting it. The agent receives grammar violations as structured error feedback and must re-compose — no human in the loop.

### Design Token System Architecture

This is the most critical infrastructure investment. Every visual decision should resolve to a token, and tokens should be designed so that **any combination produces acceptable output**. This is the "no bad combinations" constraint.

Your CSS custom properties layer should have four tiers:

**Tier 1 — Primitive tokens** (never used directly in templates)
```css
--color-primitive-rose-500: #f43f5e;
--space-primitive-4: 1rem;
--font-primitive-display: 'DM Serif Display', serif;
```

**Tier 2 — Semantic tokens** (what agents reference in props)
```css
--color-brand-primary: var(--color-primitive-rose-500);
--color-surface-page: var(--color-primitive-neutral-50);
--color-text-heading: var(--color-primitive-neutral-900);
--space-section-gap: var(--space-primitive-12); /* 3rem */
--space-block-padding-mobile: var(--space-primitive-4); /* 1rem horizontal */
--font-heading-display: var(--font-primitive-display);
--radius-cta-button: 9999px; /* pill — highest converting on mobile */
```

**Tier 3 — Component tokens** (scoped to block templates, never touched by agents)
```css
/* Inside sticky-cta-bar.hbs */
--_cta-height: 64px;
--_cta-safe-area: env(safe-area-inset-bottom);
--_cta-padding-bottom: calc(var(--_cta-height) + var(--_cta-safe-area) + 8px);
```

**Tier 4 — Theme packages** (what the planner agent selects)
```json
{
  "theme": "premium_wellness",
  "tokens": {
    "color_brand_primary": "#2D6A4F",
    "color_brand_accent": "#95D5B2",
    "color_surface_page": "#FAFAF8",
    "font_heading": "Cormorant Garamond",
    "font_body": "Inter",
    "space_density": "comfortable"
  }
}
```

Provide 8–12 pre-built theme packages tuned per vertical (supplements: earthy/premium; skincare: clean/clinical; beauty: bold/saturated; pet: warm/playful). The agent selects a theme package — it does not construct one from primitives. This eliminates the largest category of ugly output.

---

## Part 2: What Makes LLM-Generated Design Look Good on Mobile

The answer is a **design system that makes correctness the path of least resistance**. Every constraint here should be hard-coded into block templates, not left to the agent.

### Typography Scale (mobile-first, hardcoded)

Use a modular scale with a ratio of 1.25 (Major Third) for mobile, stepping up to 1.333 (Perfect Fourth) at desktop via `clamp()`. Every heading token in your system must use fluid type:

```css
--text-hero: clamp(2rem, 6vw, 3.5rem);      /* H1 advertorial hook */
--text-display: clamp(1.75rem, 5vw, 3rem);   /* H1 product pages */
--text-heading: clamp(1.375rem, 4vw, 2rem);  /* H2 section headers */
--text-subheading: clamp(1.125rem, 3vw, 1.5rem);
--text-body: clamp(1rem, 2.5vw, 1.125rem);   /* Never below 16px */
--text-caption: clamp(0.8125rem, 2vw, 0.875rem);

/* Line heights tuned for mobile reading */
--leading-hero: 1.1;
--leading-heading: 1.2;
--leading-body: 1.65;  /* Critical for advertorial readability */

/* Tracking */
--tracking-hero: -0.02em;
--tracking-heading: -0.015em;
--tracking-body: 0;
--tracking-caps: 0.08em;  /* For eyebrow labels */
```

Hard rule: no agent-accessible text size prop. Agents set semantic roles (`role: "hero_headline"` vs `role: "section_header"`), and the template maps roles to tokens.

### Spacing Scale

Use a 4px base grid with a non-linear scale that produces comfortable mobile spacing:

```css
--space-1: 0.25rem;   /* 4px — micro gaps */
--space-2: 0.5rem;    /* 8px — inline gaps */
--space-3: 0.75rem;   /* 12px — tight component padding */
--space-4: 1rem;      /* 16px — standard padding */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px — card padding */
--space-8: 2rem;      /* 32px — section internal gap */
--space-10: 2.5rem;   /* 40px — between subsections */
--space-12: 3rem;     /* 48px — section separator */
--space-16: 4rem;     /* 64px — major section breaks */
--space-20: 5rem;     /* 80px — hero sections */

/* Mobile horizontal padding — NEVER less than this */
--page-padding-mobile: max(1rem, env(safe-area-inset-left) + 1rem);
```

Block templates use `--space-section-gap: var(--space-12)` as a semantic alias. Agents never touch raw space tokens — they set `spacing_variant: "tight" | "standard" | "generous"` and the template resolves it.

### Color Palette Constraints

Hard-code an 8-color maximum per funnel. The theme package provides: 1 brand primary, 1 brand accent, 1 surface (page background), 1 surface-raised (card backgrounds), 1 text-primary, 1 text-secondary, 1 success, 1 urgency. Every block uses only these 8 semantic roles. Forbidden: random hex values anywhere in agent output. Agents set `color_scheme: "brand" | "inverted" | "neutral" | "urgency"` and the template handles it.

For DTC specifically, the highest-converting color patterns by vertical (validated across top performers):
- **Supplements**: Deep forest green primary + warm cream surface + gold accent. Signals premium/natural.
- **Skincare**: Near-white surface + blush or sage primary + black text. Clinical but warm.
- **Beauty**: High-contrast bold primary (berry, coral, navy) + white. Confidence and boldness.
- **Pet**: Warm orange or teal primary + off-white + illustrated illustrations. Approachable.

### Mobile-Specific Patterns (Hard-Coded into Block Templates)

**Sticky CTA bar**: Every funnel page with a primary CTA must include this block. The template handles `position: fixed; bottom: 0; padding-bottom: env(safe-area-inset-bottom)` plus a JavaScript IntersectionObserver that shows/hides it based on the in-page CTA's visibility. Agent sets only: button label, action, and color scheme.

**Tap targets**: Every interactive element in every template has `min-height: 44px; min-width: 44px` baked in. Buttons always get `padding: 14px 24px` at minimum. The validation pipeline (see Part 4) flags anything smaller.

**Swipe carousels for testimonials**: Use `scroll-snap-type: x mandatory` with `overscroll-behavior-x: contain`. No JS dependency for the swipe behavior itself — pure CSS. Agent provides an array of testimonial objects; the template renders the carousel. Dots/indicators are always rendered for affordance.

**Accordion FAQs**: Every FAQ block uses the native `<details>/<summary>` pattern — zero JS, excellent CLS, instantly accessible. Template adds custom styling on top. Agents provide `[{question, answer}]` arrays, nothing else.

**VSL sticky video**: The VSL template uses `position: sticky; top: 0` with a calculated `max-height` based on viewport. Below the fold, it shrinks to a mini player. Agent sets only: video embed URL, thumbnail, autoplay behavior.

**Image aspect ratios (hard-coded by block type)**:
```
Hero images: 9:16 mobile / 16:9 desktop (via art direction with <picture>)
Product hero: 1:1 or 4:5 (square or portrait — thumb-scrollable)
Testimonial avatars: 1:1, 48px–64px
Social proof logos: variable width, 32px fixed height
Before/after: 1:1 each, side-by-side with slider
Bundle images: 3:4 portrait
```

All images use `loading="lazy"` except the first hero image. The template generates `srcset` automatically based on the agent-provided image asset ID — the agent never writes image URLs or sizes.

### Typography Hierarchy that Agents Must Follow

Advertorials need editorial hierarchy. Hard-code these eyebrow/headline/deck patterns:

```
EYEBROW (caps, small, brand color, letter-spacing: 0.08em)
Hero Headline (2–3 lines max on mobile, tight leading)
Deck / Subheadline (body size+1, secondary color, wider leading)
```

The agent provides three separate text props: `eyebrow`, `headline`, `deck`. Never a single combined heading. The template enforces the visual hierarchy — the agent cannot accidentally make the eyebrow larger than the headline.

---

## Part 3: Agent Pipeline + A/B Testing State Machine + RAG Marketing Evolution Engine

### The Five-Stage Testing State Machine

Map your state machine to funnel-specific semantics:

**Sandbox** → Agent generates 4–8 block tree variants. No live traffic. Automated validation runs (see Part 4). Failing variants are rejected. Passing variants are pre-rendered to static HTML by Nginx and staged. This stage is fully automated with zero human review.

**Elimination** → All passing sandbox variants go live simultaneously, split equally. Traffic minimum: 200 sessions per variant or 48 hours, whichever comes first. Metric: primary micro-conversion (scroll depth to offer section for advertorials, add-to-cart for product pages, video play rate for VSL). Statistical test: multi-armed bandit with Thompson Sampling. Bottom 50% eliminated automatically. Surviving variants advance.

**Commando** → Top 2–3 variants from elimination run head-to-head on higher traffic allocation. Metric shifts to macro-conversion (purchase, subscription initiation). Run to 95% statistical significance minimum, or 500 conversions per variant. This stage is where most design experiments resolve.

**Duel** → Single challenger vs. current champion. 50/50 split. Runs until 99% significance. At this point the visual design difference is usually one or two specific block-level decisions — the block tree diff is small and highly informative for the RAG system.

**Champion** → Winner becomes the new baseline. The winning block tree is serialized in full and passed to the Marketing Evolution Engine. The losing tree is also stored with its delta from the champion — these negative examples are equally valuable.

### Block Tree Diffing for Pattern Extraction

When a variant transitions from Duel to Champion, run a structured diff between the winning and losing block tree. This produces a `DesignDelta` object:

```json
{
  "championId": "variant_0291",
  "loserId": "variant_0288",
  "lift": 0.23,
  "metric": "subscription_initiation",
  "deltas": [
    {
      "blockPath": "sections[2].blocks[0]",
      "blockType": "hero_product",
      "prop": "color_scheme",
      "champion": "inverted",
      "loser": "neutral",
      "significance": 0.99
    },
    {
      "blockPath": "sections[4].blocks[1]",
      "blockType": "cta_block",
      "prop": "size_variant",
      "champion": "xl",
      "loser": "md",
      "significance": 0.97
    }
  ]
}
```

Each `DesignDelta` is a structured insight: "On mobile supplement product pages, inverted color scheme hero + XL CTA beat neutral hero + medium CTA by 23% on subscription initiation." This is what feeds your RAG system.

### RAG Marketing Evolution Engine Architecture

Your vector store should have three collections:

**1. Design Pattern SOPs** — Structured records, each representing a validated design decision with its evidence base:
```json
{
  "id": "sop_mobile_supp_hero_001",
  "category": "mobile_product_hero",
  "vertical": "supplements",
  "pattern": "inverted_color_hero",
  "description": "Use inverted color scheme (dark bg, light text) for hero section on supplement product pages on mobile",
  "evidence": { "sample_sessions": 47000, "avg_lift": 0.19, "experiments": ["exp_029", "exp_041", "exp_067"] },
  "implementation": { "block_type": "hero_product", "prop": "color_scheme", "value": "inverted" },
  "antipattern": "neutral_hero",
  "embedding": [...]
}
```

**2. Block Sequence Templates** — Validated full-page block sequences that performed above a threshold. Not just individual decisions but complete compositional patterns for each funnel type. These become few-shot examples for the Phase 2 composer agent.

**3. Negative Examples** — What lost and by how much. These are injected into the composer prompt as explicit constraints: "Do NOT use accordion_faq above the fold — this pattern lost 15% across 4 experiments on mobile."

### Agent RAG Retrieval at Composition Time

When the composer agent receives a task, before it generates a block tree, the orchestration layer runs a retrieval pass:

```typescript
async function buildComposerContext(spec: FunnelSpec): Promise<ComposerContext> {
  const relevantSOPs = await vectorStore.query({
    collection: "design_patterns",
    filter: { vertical: spec.vertical, funnel_type: spec.funnelType },
    limit: 15,
    includeNegatives: true
  });
  
  const exampleTrees = await vectorStore.query({
    collection: "block_sequences",
    filter: { vertical: spec.vertical, funnel_type: spec.funnelType, min_lift: 0.10 },
    limit: 3
  });
  
  return {
    positiveSOPs: relevantSOPs.filter(s => s.type === "positive"),
    negativeSOPs: relevantSOPs.filter(s => s.type === "negative"),
    exampleTrees: exampleTrees,
    systemPromptAdditions: formatSOPsForPrompt(relevantSOPs)
  };
}
```

The SOPs are formatted into the agent's system message as structured rules, not narrative: "RULE [sop_mobile_supp_hero_001, confidence: HIGH]: Set `color_scheme: 'inverted'` on hero_product blocks for supplement verticals on mobile." The agent treats these as constraints, not suggestions.

### SOP Codification Pipeline

The pipeline from experiment result to codified SOP runs automatically:

1. Champion declared → `DesignDelta` extracted
2. `DesignDelta` checked against existing SOPs (does this confirm or contradict a known pattern?)
3. If confirming: existing SOP's confidence score and evidence count updated
4. If new pattern: draft SOP created, flagged for lightweight human review (15-minute task, not design review — just checking that the pattern makes sense semantically)
5. After 3 confirming experiments with consistent lift: SOP auto-promoted to HIGH confidence, no human review required
6. SOP embedded and inserted into vector store
7. All future agent compositions for that vertical/funnel type now receive this SOP in context

This creates a compounding flywheel: each experiment makes the next generation of agent-composed pages slightly better. At $1M+/month scale with high session volume, this flywheel accelerates quickly.

---

## Part 4: Automated Validation and Guardrails

Every block tree must pass through a sequential validation pipeline before static HTML generation. Fail fast — reject at the earliest possible stage.

### Stage 1 — Schema Validation (< 10ms)

Run JSON Schema validation against your `BlockTreeSchema` on every API submission. Strict mode: no additional properties, all required props present, all enum values valid, all content strings within length limits. Return structured errors that the agent can parse and self-correct:

```json
{
  "valid": false,
  "errors": [
    {
      "path": "sections[2].blocks[1].props.image_asset_id",
      "code": "REQUIRED_MISSING",
      "message": "hero_product block requires image_asset_id",
      "autoCorrectHint": "Omit this block or provide a valid asset ID from the product catalog"
    }
  ]
}
```

### Stage 2 — Grammar Validation (< 50ms)

Run the block grammar graph validation: check valid predecessors/successors, per-page limits, required blocks for each funnel type. For example: every `checkout_flow` funnel type must contain exactly one `trust_badge_row` and one `secure_payment_block`, and the `sticky_cta_bar` is mandatory.

Also validate compositional logic: a VSL funnel cannot have its `vsl_player_block` below an `offer_block` — that would show the price before the pitch, which the grammar forbids.

### Stage 3 — Mobile Layout Constraint Checks (< 200ms, headless rendering)

This is the most important stage and the one most commonly skipped in naive implementations. Use Playwright in headless mode at 390×844 (iPhone 14 viewport) to render the block tree server-side and check:

**Tap target audit**: Query all interactive elements (`a`, `button`, `[role="button"]`, `input`, `select`). Flag any with computed `offsetHeight < 44` or `offsetWidth < 44`. Also check for overlapping tap targets using bounding rect intersection.

**Viewport overflow**: Check `document.documentElement.scrollWidth > window.innerWidth`. Any horizontal overflow fails immediately — this is the single most common mobile rendering failure from agent-generated pages.

**Text overflow / truncation**: Check all heading elements for `scrollWidth > clientWidth` at 390px. This catches agents that provide overly long hero headlines.

**Sticky CTA clearance**: Verify that the last non-sticky content block has adequate bottom padding to not be obscured by the sticky bar. Compute the sticky bar height plus `env(safe-area-inset-bottom)` and verify the clearance.

**Image CLS budget**: Every `<img>` without explicit width/height attributes that would cause layout shift is flagged. Your Handlebars templates should always output width/height on images, but validate this.

### Stage 4 — Lighthouse Mobile Performance (< 30s, async)

Run a Lighthouse mobile audit (device emulation, throttled 4G) on the pre-rendered static HTML. Gate on:

- **Performance score ≥ 75** — Hard gate. Most static pages should hit 85+ easily.
- **LCP ≤ 3.5s** — The hero image or headline. Enforce that the first above-fold image has `fetchpriority="high"` and `loading="eager"` in the template.
- **TBT ≤ 300ms** — Total Blocking Time. All JavaScript in your funnel pages should be minimal and deferred. Your block template system is mostly CSS + minimal vanilla JS — this should be easy.
- **CLS ≤ 0.1** — Already mostly handled by explicit image dimensions and no font-swap causing layout shift (use `font-display: swap` with proper fallback sizing via the `ascent-override` descriptor).

Run Lighthouse asynchronously after Stage 3. If it fails, the block tree is queued for auto-repair: the orchestration layer analyzes the specific failing audits, generates a targeted repair prompt for the agent ("Your LCP element is missing fetchpriority. Regenerate the hero block with lcp_priority: true"), and re-runs from Stage 1. Maximum 3 auto-repair attempts before the task is flagged for human review.

### Stage 5 — Conversion Logic Validation (< 100ms)

Validate that the funnel's conversion logic is wired correctly before HTML generation:

- Every CTA block's `action` prop resolves to a valid endpoint (checkout URL, upsell route, subscription product ID)
- Tracking events are present on every CTA: `data-track-event`, `data-track-payload` attributes are verified in the schema
- Stripe checkout integration: checkout blocks must have valid `price_id` references, and the payment block includes the required Stripe.js embed
- UTM passthrough: verify the template includes UTM parameter forwarding in all CTA hrefs (this is typically a template concern, but validate it)
- Upsell blocks must have both `accept_action` and `decline_action` specified — one-click upsells with no decline path are a UX and legal liability

### Stage 6 — Accessibility Baseline (< 50ms)

Run `axe-core` in Node against the rendered HTML. Gate on zero critical or serious violations. Specifically:

- All `<img>` have meaningful `alt` text (agent-provided, validated for non-empty, non-generic strings like "image" or "product")
- Color contrast ratios ≥ 4.5:1 for body text, ≥ 3:1 for large text — validated programmatically against your design token values
- Heading hierarchy is sequential (no jumping from H1 to H4)
- Form fields in checkout have associated `<label>` elements
- The sticky CTA button has a descriptive `aria-label`

Accessibility here is not just ethics — it directly correlates with SEO performance and ad compliance on Meta/Google, which affects your CPC and therefore your effective ROAS at scale.

---

## Integration Architecture: How It All Fits Together

```
[Agent Orchestrator]
    │
    ├─[Phase 1: Planner Agent] ──→ FunnelSpec JSON
    │        ↑ RAG: product catalog, offer structure, traffic source
    │
    ├─[Phase 2: Composer Agent] ──→ BlockTree JSON
    │        ↑ RAG: Design SOPs, negative examples, example trees
    │
    ├─[Phase 3: Copywriter Agent] ──→ Hydrated BlockTree JSON
    │        ↑ RAG: proven headlines, avatar pain points
    │
    ▼
[Validation Pipeline]
    Stage 1: Schema (sync, < 10ms)
    Stage 2: Grammar (sync, < 50ms)
    Stage 3: Mobile Layout (headless, < 200ms)
    Stage 4: Lighthouse (async, < 30s)
    Stage 5: Conversion Logic (sync, < 100ms)
    Stage 6: Accessibility (sync, < 50ms)
    │
    ├─ PASS → [Static HTML Generator] → Nginx → CDN
    │
    └─ FAIL → [Auto-Repair Loop] → back to Composer Agent (max 3x)
                    │
                    └─ FAIL×3 → [Human Review Queue]
    │
    ▼
[A/B Test State Machine]
    Sandbox → Elimination → Commando → Duel → Champion
    │
    ▼
[Marketing Evolution Engine]
    DesignDelta extraction → SOP codification
    → Vector store update → next agent generation context
```

The critical performance property of this architecture is that **the system gets better every single day without any human design work**, as long as traffic volume is sufficient to run experiments. At $1M+/month with high session counts, you should be completing full Sandbox→Champion cycles on a weekly cadence for your highest-traffic funnel types, generating 50+ validated SOPs per month.

The other critical property is **no creative free-form decisions from agents**. Every agent output is a structured selection from a constrained vocabulary. The design quality comes from the quality of the vocabulary (your block library and token system) and the quality of the selection (your SOPs and composition grammar) — not from the agent's latent sense of aesthetics, which is unreliable and inconsistent.

8: # Architecture for Agent-First DTC Funnel Builder

This is a four-layer problem: **design language**, **agent intelligence**, **feedback loops**, and **validation gates**. I'll address each with production-grade specificity.

---

## Part 1: LLM Prompt Structure, Block Composition, and Design Token System

### The Core Insight

The mistake most teams make is asking the LLM to "design a page." That produces generic output. Instead, you constrain the LLM's creative space to a **curated vocabulary of proven block compositions** — then let it orchestrate, not invent.

### 1.1 Block Taxonomy

Organize blocks into three tiers with strict typing:

```
Tier 1 — Atoms (non-negotiable primitives)
├── text.heading      { level: 1-4, align, weight }
├── text.paragraph    { size, color-variant }
├── text.badge        { variant: urgency|trust|social }
├── media.image       { src, aspect, lazy, alt }
├── media.video       { src, poster, sticky, autoplay-muted }
├── input.field       { type, label, validation, autocomplete }
├── button.cta        { label, size, variant, icon, full-width }
├── button.link       { label, underline-style }
├── divider           { style: line|space|gradient }
└── icon              { name, size }

Tier 2 — Molecules (composed patterns)
├── price.display     { original, current, per-unit, save-badge }
├── testimonial.card  { avatar, name, stars, text, verified-badge }
├── trust.badge-row   { icons: [lock, guarantee, shipping, fda] }
├── accordion.item    { question, answer, default-open }
├── countdown.timer   { target-epoch, label, expired-action }
├── progress.bar      { current, total, label }
├── rating.stars      { value, count, label }
├── image.carousel    { images[], swipe, dots, autoplay }
├── quantity.selector { min, max, bundle-options }
└── comparison.row    { feature, ours, theirs }

Tier 3 — Organisms (page-section archetypes)
├── hero.split        { media-side, headline, subhead, cta, trust-row }
├── hero.full-bleed   { image-bg, overlay, headline, cta }
├── editorial.block   { headline, body-html, pull-quote, image }
├── benefits.grid     { icon, title, description }[]
├── ingredients.panel { image, list[], scientific-callout }
├── social-proof.band { count, avatars, rating, label }
├── bundle.selector   { options[], recommended-idx, savings }
├── faq.accordion     { items[] }
├── video.vsl-player  { src, poster, transcript-toggle, sticky }
├── checkout.form     { fields[], stripe-element, order-summary }
├── upsell.offer      { product, one-click-btn, decline-link, timer }
├── guarantee.section { icon, title, text, days }
├── before-after      { images[], slider }
├── footer.legal      { links[], copyright }
└── nav.sticky-bar    { logo, cta, scroll-hide }
```

### 1.2 Design Token System (Embedded in Every Block Tree)

Define tokens as a **separate top-level object** in the JSON block tree, not scattered across blocks:

```json
{
  "tokens": {
    "color": {
      "bg-primary": "#FFFBF5",
      "bg-surface": "#FFFFFF",
      "bg-accent": "#2D5016",
      "bg-urgency": "#C41E3A",
      "text-primary": "#1A1A1A",
      "text-secondary": "#5A5A5A",
      "text-on-accent": "#FFFFFF",
      "text-on-urgency": "#FFFFFF",
      "border-subtle": "#E8E4DF"
    },
    "typography": {
      "font-display": "Fraunces",
      "font-body": "Source Serif 4",
      "font-ui": "DM Sans",
      "scale": {
        "xs": "0.75rem",
        "sm": "0.875rem",
        "base": "1rem",
        "lg": "1.125rem",
        "xl": "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
        "4xl": "2.25rem",
        "5xl": "3rem"
      },
      "line-height": {
        "tight": 1.15,
        "snug": 1.3,
        "normal": 1.6
      },
      "letter-spacing": {
        "tight": "-0.02em",
        "normal": "0",
        "wide": "0.05em",
        "uppercase": "0.08em"
      }
    },
    "spacing": {
      "unit": "0.25rem",
      "scale": [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128],
      "section-y": { "mobile": "48px", "desktop": "80px" },
      "block-y": { "mobile": "24px", "desktop": "40px" },
      "gutter": { "mobile": "16px", "desktop": "24px" }
    },
    "radius": {
      "sm": "6px",
      "md": "12px",
      "lg": "20px",
      "full": "9999px"
    },
    "shadow": {
      "card": "0 2px 12px rgba(0,0,0,0.06)",
      "elevated": "0 8px 32px rgba(0,0,0,0.12)",
      "cta": "0 4px 16px rgba(0,0,0,0.15)"
    },
    "motion": {
      "duration-fast": "150ms",
      "duration-normal": "300ms",
      "duration-slow": "500ms",
      "easing": "cubic-bezier(0.22, 1, 0.36, 1)"
    }
  }
}
```

The token system is **constrained, not freeform**. Agents pick from a curated palette per vertical:

| Vertical | Primary | Accent | Urgency | Mood |
|----------|---------|--------|---------|------|
| Supplements | Forest green `#2D5016` | Warm gold `#C49A2A` | Deep red `#8B1A1A` | Clean, clinical |
| Skincare | Soft rose `#D4A5A5` | Champagne `#C9B97A` | Coral `#E87461` | Luxe, editorial |
| Beauty | Deep plum `#4A1942` | Gold `#B8860B` | Magenta `#C2185B` | Bold, glamorous |
| Pet | Teal `#1B6B6B` | Orange `#E8751A` | Red `#CC3333` | Warm, trustworthy |

### 1.3 Agent Prompt Architecture

The prompt must be **structured as a multi-stage pipeline**, not a single prompt:

```
┌─────────────────────────────────────────────────────┐
│  STAGE 1: CONTEXT ASSEMBLY                          │
│  ┌─────────────────────────────────────────────┐    │
│  │ Brand Manifest (tokens, voice, constraints)  │    │
│  │ Page Type Spec (required blocks, flow order) │    │
│  │ Product Data (name, price, ingredients, USPs)│    │
│  │ Audience Segment (demographics, pain points) │    │
│  │ Performance History (winning patterns from   │    │
│  │   RAG — see Part 3)                          │    │
│  └─────────────────────────────────────────────┘    │
│                       ▼                              │
│  STAGE 2: COMPOSITION                                │
│  ┌─────────────────────────────────────────────┐    │
│  │ System prompt defines:                        │    │
│  │  - Available blocks (Tier 1/2/3 catalog)     │    │
│  │  - Composition rules (what can nest where)   │    │
│  │  - Mobile-first constraints (hard rules)     │    │
│  │  - Page-type templates (scaffolds)           │    │
│  │  - Design token palette (locked choices)     │    │
│  └─────────────────────────────────────────────┘    │
│                       ▼                              │
│  STAGE 3: REFINEMENT PASS                            │
│  ┌─────────────────────────────────────────────┐    │
│  │ Second LLM call with:                         │    │
│  │  - The draft block tree                       │    │
│  │  - Mobile layout simulation feedback          │    │
│  │  - "Would a DTC brand director approve this?" │    │
│  │  - Specific checks: CTA prominence, spacing,  │    │
│  │    visual hierarchy, scroll depth pacing      │    │
│  └─────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
```

**The composition system prompt** (abbreviated, showing the critical structure):

```markdown
## Role
You are a DTC funnel architect specializing in mobile-first subscription
ecommerce. You compose pages from a constrained block library. You do NOT
invent new blocks or styles. You orchestrate proven patterns.

## Hard Rules — Mobile-First
1. First block MUST be a Tier 3 organism (hero.*)
2. CTA must appear above fold (within first 2 organisms on mobile)
3. Every scroll section ≤ 1 viewport height on mobile (375×812)
4. Sticky CTA bar activates after first CTA scrolls out of viewport
5. Images: max 2 per viewport section, always with aspect ratio specified
6. Text: max 60 chars per line on mobile (use typography scale)
7. Touch targets: all buttons ≥ 48px height, ≥ 44px width
8. Spacing: use ONLY values from the token spacing scale
9. Colors: use ONLY from the provided token palette

## Page Type: {{page_type}}
{{#if page_type == "advertorial"}}
Required flow: editorial.hero → editorial.block×2-4 → social-proof.band
→ editorial.block → product-reveal → benefits.grid → ingredients.panel
→ testimonial.cards×3 → bundle.selector → guarantee → faq → checkout.form
{{/if}}
{{#if page_type == "product"}}
Required flow: hero.split → social-proof.band → benefits.grid → 
before-after → ingredients.panel → bundle.selector (recommended highlighted)
→ testimonial.cards×3-5 → guarantee → faq → sticky-cta-checkout
{{/if}}
{{#if page_type == "vsl"}}
Required flow: hero.minimal → video.vsl-player (sticky) → 
transcript-editorial → benefits → social-proof → bundle.selector →
guarantee → checkout
{{/if}}
...

## Output Format
Return a JSON block tree matching this schema:
{{schema_definition}}

## Winning Patterns (from performance data)
{{rag_context}}
```

### 1.4 Block Composition Rules (Enforced Programmatically)

Define a **block adjacency matrix** — which blocks can follow which:

```typescript
// Drizzle schema for composition rules
const blockRules = pgTable('block_composition_rules', {
  id: serial('id').primaryKey(),
  pageType: varchar('page_type', { length: 32 }), // advertorial, product, vsl...
  blockType: varchar('block_type', { length: 64 }),
  canFollow: jsonb('can_follow').$type<string[]>(),  // allowed predecessors
  canPrecede: jsonb('can_precede').$type<string[]>(), // allowed successors
  required: boolean('required').default(false),
  maxOccurrences: integer('max_occurrences').default(99),
  mobileConstraints: jsonb('mobile_constraints').$type<{
    maxHeightVh?: number;       // max height in viewport units
    minHeightPx?: number;       // minimum rendered height
    requiresStickyCta?: boolean;
    maxImages?: number;
    maxTextBlocks?: number;
  }>(),
});
```

### 1.5 How Blocks Become Valid HTML

Each block type maps to a **Handlebars partial** with baked-in responsive styles:

```handlebars
{{!-- blocks/organisms/hero-split.hbs --}}
<section class="block hero-split" data-block-id="{{id}}"
         style="--media-side: {{mediaSide}}; --bg: {{tokens.color.bg-primary}}">
  <div class="hero-split__media">
    {{> atoms/image 
        src=media.src 
        aspect="3/4" 
        lazy=false
        alt=media.alt}}
  </div>
  <div class="hero-split__content">
    {{> atoms/heading level=1 text=headline align="left"}}
    {{#if subhead}}
      {{> atoms/paragraph text=subhead size="lg" color="secondary"}}
    {{/if}}
    {{#if trustBadges}}
      {{> molecules/trust-badge-row items=trustBadges}}
    {{/if}}
    {{> atoms/cta 
        label=cta.label 
        size="lg" 
        variant="primary" 
        fullWidth=true
        href=cta.href}}
    {{#if socialProof}}
      {{> molecules/social-proof-mini 
          count=socialProof.count 
          avatars=socialProof.avatars}}
    {{/if}}
  </div>
</section>
```

The CSS for this partial uses **only token references**:

```css
.hero-split {
  display: flex;
  flex-direction: column;
  background: var(--bg);
  padding: var(--section-y) var(--gutter);
}

.hero-split__media {
  width: 100%;
  margin-bottom: var(--space-6);
}

.hero-split__media img {
  width: 100%;
  height: auto;
  aspect-ratio: 3/4;
  object-fit: cover;
  border-radius: var(--radius-md);
}

.hero-split__content {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

/* Desktop: side-by-side */
@media (min-width: 768px) {
  .hero-split {
    flex-direction: row;
    align-items: center;
    gap: var(--space-10);
  }
  .hero-split__media {
    flex: 0 0 45%;
    margin-bottom: 0;
  }
  .hero-split__content {
    flex: 1;
  }
}
```

---

## Part 2: The Design System That Guarantees Visual Quality

### 2.1 Why LLM-Generated Designs Look Bad

The failure modes are specific and preventable:

| Failure Mode | Root Cause | Solution |
|---|---|---|
| Inconsistent spacing | LLM picks arbitrary pixel values | Hard-code spacing scale into block schema |
| Poor type hierarchy | LLM uses too many sizes/weights | Lock to a 5-level typographic scale |
| Weak CTA visibility | CTA styled same as surrounding text | Enforce CTA contrast ratio ≥ 4.5:1, minimum size |
| Cramped mobile layout | Desktop-first thinking | Blocks must declare mobile height; reject if > 100vh |
| Visual noise | Too many competing elements per section | Max element count per viewport section |
| Slow loading | Unoptimized hero images | Enforce WebP, max dimensions, lazy loading below fold |
| Broken scroll flow | No rhythm between sections | Alternating background colors, consistent section padding |

### 2.2 The Hard-Coded Design System

This is the **non-negotiable foundation** baked into every Handlebars partial and CSS file. Agents cannot override these — they can only choose from constrained options.

```css
/* ============================================
   DESIGN SYSTEM — DO NOT MODIFY
   All blocks inherit from these custom properties
   ============================================ */

:root {
  /* === SPACING (4px base unit, 12-step scale) === */
  --space-0: 0;
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
  --space-24: 6rem;     /* 96px */

  /* === LAYOUT === */
  --gutter: var(--space-4);          /* 16px mobile */
  --section-padding-y: var(--space-12); /* 48px mobile */
  --max-width: 440px;                /* max content width mobile */
  --max-width-desktop: 720px;        /* max content width desktop */

  /* === TYPOGRAPHY (modular scale, ratio 1.25) === */
  --font-display: 'Fraunces', Georgia, serif;
  --font-body: 'Source Serif 4', Georgia, serif;
  --font-ui: 'DM Sans', system-ui, sans-serif;

  --text-xs: 0.75rem;     /* 12px */
  --text-sm: 0.875rem;    /* 14px */
  --text-base: 1rem;      /* 16px — DO NOT GO BELOW on mobile */
  --text-lg: 1.125rem;    /* 18px */
  --text-xl: 1.25rem;     /* 20px */
  --text-2xl: 1.5rem;     /* 24px */
  --text-3xl: 1.875rem;   /* 30px */
  --text-4xl: clamp(2rem, 5vw, 2.5rem);    /* fluid */
  --text-5xl: clamp(2.5rem, 7vw, 3.5rem);  /* fluid */

  --leading-tight: 1.15;
  --leading-snug: 1.3;
  --leading-normal: 1.6;
  --leading-relaxed: 1.75;

  --tracking-tight: -0.02em;
  --tracking-normal: 0;
  --tracking-wide: 0.05em;
  --tracking-caps: 0.08em;

  /* === COLORS (set per-brand via tokens) === */
  --color-bg: #FFFBF5;
  --color-surface: #FFFFFF;
  --color-accent: #2D5016;
  --color-urgency: #C41E3A;
  --color-text: #1A1A1A;
  --color-text-secondary: #5A5A5A;
  --color-text-on-accent: #FFFFFF;
  --color-border: #E8E4DF;

  /* === INTERACTIVE === */
  --tap-target-min: 48px;     /* minimum touch target */
  --cta-height: 56px;         /* standard CTA height */
  --cta-height-lg: 64px;      /* hero CTA height */
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 20px;
  --radius-full: 9999px;

  /* === SHADOWS === */
  --shadow-card: 0 2px 12px rgba(0,0,0,0.06);
  --shadow-elevated: 0 8px 32px rgba(0,0,0,0.12);
  --shadow-cta: 0 4px 16px rgba(0,0,0,0.15);

  /* === MOTION === */
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --duration-fast: 150ms;
  --duration-normal: 300ms;

  /* === IMAGE CONSTRAINTS === */
  --hero-image-max-width: 100%;
  --image-aspect-hero: 3/4;        /* portrait, mobile-first */
  --image-aspect-product: 1/1;
  --image-aspect-testimonial: 1/1;
  --image-aspect-banner: 16/9;
  --image-aspect-before-after: 1/1;
}

/* === GLOBAL MOBILE CONSTRAINTS === */
*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  font-size: 16px; /* LOCKED. Never allow smaller. */
  -webkit-text-size-adjust: 100%;
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-body);
  font-size: var(--text-base);
  line-height: var(--leading-normal);
  color: var(--color-text);
  background: var(--color-bg);
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden; /* PREVENT HORIZONTAL SCROLL */
}

/* Ensure no element causes horizontal overflow */
img, video, iframe {
  max-width: 100%;
  height: auto;
}

/* === STICKY CTA BAR (mobile pattern) === */
.sticky-cta-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: var(--space-3) var(--gutter);
  padding-bottom: calc(var(--space-3) + env(safe-area-inset-bottom, 0));
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
  box-shadow: 0 -4px 20px rgba(0,0,0,0.08);
  transform: translateY(100%);
  transition: transform var(--duration-normal) var(--ease-out);
}

.sticky-cta-bar.is-visible {
  transform: translateY(0);
}

.sticky-cta-bar .cta {
  width: 100%;
  height: var(--cta-height);
  font-size: var(--text-lg);
}

/* === CTA BUTTON SYSTEM === */
.cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  min-height: var(--tap-target-min);
  padding: var(--space-3) var(--space-6);
  font-family: var(--font-ui);
  font-weight: 700;
  font-size: var(--text-base);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  text-decoration: none;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: transform var(--duration-fast) var(--ease-out),
              box-shadow var(--duration-fast) var(--ease-out);
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}

.cta--primary {
  background: var(--color-accent);
  color: var(--color-text-on-accent);
  box-shadow: var(--shadow-cta);
}

.cta--primary:active {
  transform: scale(0.97);
}

.cta--urgency {
  background: var(--color-urgency);
  color: var(--color-text-on-accent);
}

.cta--full-width {
  width: 100%;
}

.cta--lg {
  height: var(--cta-height-lg);
  font-size: var(--text-lg);
  padding: var(--space-4) var(--space-8);
}

/* === SECTION RHYTHM === */
.block {
  padding: var(--section-padding-y) var(--gutter);
}

.block--surface {
  background: var(--color-surface);
}

.block--tinted {
  background: color-mix(in srgb, var(--color-accent) 5%, var(--color-bg));
}

.block--dark {
  background: var(--color-accent);
  color: var(--color-text-on-accent);
}

/* Alternate sections for visual rhythm */
.block:nth-of-type(even):not(.block--surface):not(.block--dark) {
  background: var(--color-surface);
}
```

### 2.3 Mobile-Specific Patterns (Hard-Coded into Block Library)

**Pattern 1: Sticky CTA Bar**

Every page type except checkout gets a sticky CTA bar. The Handlebars partial:

```handlebars
{{!-- blocks/patterns/sticky-cta-bar.hbs --}}
<div class="sticky-cta-bar" id="sticky-cta" data-track="sticky_cta">
  <div class="sticky-cta-bar__inner">
    {{#if price}}
      <div class="sticky-cta-bar__price">
        <span class="sticky-cta-bar__price-current">{{price.current}}</span>
        {{#if price.perUnit}}
          <span class="sticky-cta-bar__price-unit">({{price.perUnit}}/day)</span>
        {{/if}}
      </div>
    {{/if}}
    {{> atoms/cta label=ctaLabel variant="primary" fullWidth=true size="lg"}}
  </div>
</div>
```

**Pattern 2: Swipe Carousel (Testimonials, Before/After)**

```handlebars
{{!-- blocks/molecules/carousel.hbs --}}
<div class="carousel" data-carousel data-autoplay="{{autoplay}}">
  <div class="carousel__track" role="region" aria-label="{{label}}">
    {{#each items}}
      <div class="carousel__slide" role="group" 
           aria-label="{{math @index '+' 1}} of {{math ../items.length}}">
        {{> @partial-block}}
      </div>
    {{/each}}
  </div>
  <div class="carousel__dots" role="tablist">
    {{#each items}}
      <button class="carousel__dot {{#if @first}}is-active{{/if}}"
              role="tab" aria-label="Slide {{math @index '+' 1}}"
              data-index="{{@index}}"></button>
    {{/each}}
  </div>
</div>
```

```css
.carousel__track {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  gap: var(--space-4);
  padding: 0 var(--gutter);
}

.carousel__track::-webkit-scrollbar { display: none; }

.carousel__slide {
  flex: 0 0 85%;
  scroll-snap-align: center;
  min-width: 0;
}

@media (min-width: 768px) {
  .carousel__slide {
    flex: 0 0 calc(33.333% - var(--space-3));
  }
}
```

**Pattern 3: Accordion FAQ**

```css
.accordion__item {
  border-bottom: 1px solid var(--color-border);
}

.accordion__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: var(--space-4) 0;
  min-height: var(--tap-target-min);
  font-family: var(--font-ui);
  font-size: var(--text-base);
  font-weight: 600;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text);
}

.accordion__trigger::after {
  content: '+';
  font-size: var(--text-xl);
  transition: transform var(--duration-normal) var(--ease-out);
}

.accordion__item.is-open .accordion__trigger::after {
  transform: rotate(45deg);
}

.accordion__content {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows var(--duration-normal) var(--ease-out);
}

.accordion__item.is-open .accordion__content {
  grid-template-rows: 1fr;
}

.accordion__content-inner {
  overflow: hidden;
  padding-bottom: var(--space-4);
  line-height: var(--leading-relaxed);
  color: var(--color-text-secondary);
}
```

**Pattern 4: Bundle Selector with Urgency**

```handlebars
{{!-- blocks/organisms/bundle-selector.hbs --}}
<section class="block block--surface bundle-selector" id="bundles">
  <div class="bundle-selector__header">
    {{> atoms/heading level=2 text="Choose Your Supply" align="center"}}
    {{#if recommendedIndex}}
      <span class="badge badge--popular">Most Popular</span>
    {{/if}}
  </div>
  
  <div class="bundle-selector__options">
    {{#each options}}
      <label class="bundle-option {{#if isRecommended}}bundle-option--recommended{{/if}}"
             data-track="bundle_select" data-bundle="{{id}}">
        <input type="radio" name="bundle" value="{{id}}" 
               {{#if isRecommended}}checked{{/if}}
               class="sr-only">
        <div class="bundle-option__card">
          <div class="bundle-option__header">
            <span class="bundle-option__name">{{name}}</span>
            {{#if savePercent}}
              <span class="bundle-option__save">Save {{savePercent}}%</span>
            {{/if}}
          </div>
          <div class="bundle-option__image">
            {{> atoms/image src=image aspect="1/1" lazy=true alt=name}}
          </div>
          <div class="bundle-option__pricing">
            {{> molecules/price-display 
                original=originalPrice 
                current=currentPrice 
                perUnit=perUnitPrice}}
          </div>
          {{#if supply}}
            <span class="bundle-option__supply">{{supply}} supply</span>
          {{/if}}
        </div>
      </label>
    {{/each}}
  </div>
</section>
```

```css
.bundle-option__card {
  border: 2px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  transition: border-color var(--duration-fast),
              box-shadow var(--duration-fast);
}

input:checked + .bundle-option__card,
.bundle-option--recommended .bundle-option__card {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-accent) 20%, transparent);
}

.bundle-option--recommended {
  position: relative;
}

.bundle-option--recommended::before {
  content: '★ BEST VALUE';
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  padding: var(--space-1) var(--space-3);
  background: var(--color-accent);
  color: var(--color-text-on-accent);
  font-family: var(--font-ui);
  font-size: var(--text-xs);
  font-weight: 700;
  letter-spacing: var(--tracking-caps);
  border-radius: var(--radius-full);
  white-space: nowrap;
}
```

### 2.4 Image Strategy for 90% Mobile Traffic

Hard constraints enforced at the block/template level:

```typescript
const IMAGE_CONSTRAINTS = {
  hero: {
    maxWidth: 800,           // Don't serve 2000px images to mobile
    aspectRatio: '3/4',      // Portrait for mobile hero
    format: 'webp',
    quality: 82,
    sizes: '(max-width: 768px) 100vw, 50vw',
    loading: 'eager',        // First hero is always eager
  },
  product: {
    maxWidth: 600,
    aspectRatio: '1/1',
    format: 'webp',
    quality: 85,
    sizes: '(max-width: 768px) 80vw, 33vw',
    loading: 'lazy',
  },
  testimonial: {
    maxWidth: 200,
    aspectRatio: '1/1',
    format: 'webp',
    quality: 80,
    sizes: '64px',
    loading: 'lazy',
  },
  beforeAfter: {
    maxWidth: 600,
    aspectRatio: '1/1',
    format: 'webp',
    quality: 85,
    sizes: '(max-width: 768px) 90vw, 45vw',
    loading: 'lazy',
  },
  // Total image budget per page
  maxTotalImageWeight: 800,  // KB, for Lighthouse performance
  maxImagesPerPage: 12,
};
```

---

## Part 3: Agent Pipeline + A/B Testing + RAG Integration

### 3.1 The Full Pipeline Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                    MARKETING EVOLUTION ENGINE                     │
│                                                                  │
│  ┌─────────┐    ┌──────────┐    ┌──────────┐    ┌────────────┐  │
│  │  RAG    │    │ Agent    │    │  A/B     │    │  SOP       │  │
│  │  Store  │◄──►│ Composer │◄──►│  Engine  │◄──►│  Codifier  │  │
│  └────┬────┘    └────┬─────┘    └────┬─────┘    └─────┬──────┘  │
│       │              │               │                 │         │
│       ▼              ▼               ▼                 ▼         │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │              PostgreSQL (Drizzle ORM)                        │ │
│  │  funnel_pages | experiments | variants | conversions |       │ │
│  │  block_patterns | winning_sops | rag_documents              │ │
│  └─────────────────────────────────────────────────────────────┘ │
│       │              │               │                 │         │
│       ▼              ▼               ▼                 ▼         │
│  ┌─────────┐   ┌──────────┐   ┌──────────┐   ┌──────────────┐  │
│  │ Vector  │   │ Hono API │   │ Nginx    │   │ Handlebars   │  │
│  │ Store   │   │ Routes   │   │ Static   │   │ Pre-render   │  │
│  │ (pgvec) │   │          │   │ Serve    │   │ Pipeline     │  │
│  └─────────┘   └──────────┘   └──────────┘   └──────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

### 3.2 Drizzle Schema for Experiments and Pattern Learning

```typescript
import { pgTable, text, integer, jsonb, timestamp, 
         boolean, real, varchar, index } from 'drizzle-orm/pg-core';

// === FUNNEL PAGES ===
export const funnelPages = pgTable('funnel_pages', {
  id: text('id').primaryKey(),           // nanoid
  brandId: text('brand_id').notNull(),
  pageType: varchar('page_type', { length: 32 }).notNull(), // advertorial, product, vsl...
  slug: text('slug').notNull().unique(),
  blockTree: jsonb('block_tree').notNull(),        // The JSON block tree
  designTokens: jsonb('design_tokens').notNull(),   // Token overrides
  renderedHtml: text('rendered_html'),               // Pre-rendered static HTML
  status: varchar('status', { length: 16 }).default('draft'), // draft, live, archived
  experimentId: text('experiment_id'),               // Links to active experiment
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (t) => [
  index('idx_pages_brand_type').on(t.brandId, t.pageType),
  index('idx_pages_experiment').on(t.experimentId),
]);

// === EXPERIMENTS (A/B TEST STATE MACHINE) ===
export const experiments = pgTable('experiments', {
  id: text('id').primaryKey(),
  funnelPageId: text('funnel_page_id').notNull(),
  name: text('name').notNull(),
  stage: varchar('stage', { length: 32 }).notNull(),
    // sandbox → elimination → commando → duel → champion
  hypothesis: text('hypothesis'),                    // What we're testing
  primaryMetric: varchar('primary_metric', { length: 32 }).default('conversion_rate'),
  trafficAllocation: real('traffic_allocation').default(1.0), // 0.0-1.0
  minSampleSize: integer('min_sample_size').default(1000),
  confidenceLevel: real('confidence_level').default(0.95),
  startedAt: timestamp('started_at'),
  endedAt: timestamp('ended_at'),
  result: jsonb('result'),                           // Final statistical result
  createdAt: timestamp('created_at').defaultNow(),
});

// === VARIANTS ===
export const variants = pgTable('variants', {
  id: text('id').primaryKey(),
  experimentId: text('experiment_id').notNull(),
  name: text('name').notNull(),                      // "control", "challenger-1"
  blockTree: jsonb('block_tree').notNull(),           // Variant's block tree
  designTokens: jsonb('design_tokens'),               // Token overrides for variant
  renderedHtml: text('rendered_html'),
  trafficWeight: real('traffic_weight').default(0.5), // Traffic split
  isControl: boolean('is_control').default(false),
  createdAt: timestamp('created_at').defaultNow(),
}, (t) => [
  index('idx_variants_experiment').on(t.experimentId),
]);

// === CONVERSIONS ===
export const conversions = pgTable('conversions', {
  id: text('id').primaryKey(),
  variantId: text('variant_id').notNull(),
  experimentId: text('experiment_id').notNull(),
  visitorId: text('visitor_id').notNull(),
  eventType: varchar('event_type', { length: 32 }).notNull(),
    // view, click_cta, add_to_cart, begin_checkout, purchase, subscription_created
  revenue: real('revenue'),
  metadata: jsonb('metadata'),                       // Device, geo, referrer, etc.
  createdAt: timestamp('created_at').defaultNow(),
}, (t) => [
  index('idx_conversions_variant').on(t.variantId),
  index('idx_conversions_experiment').on(t.experimentId, t.eventType),
  index('idx_conversions_time').on(t.createdAt),
]);

// === WINNING PATTERNS (Codified SOPs) ===
export const winningPatterns = pgTable('winning_patterns', {
  id: text('id').primaryKey(),
  patternType: varchar('pattern_type', { length: 64 }).notNull(),
    // "hero_layout", "cta_placement", "bundle_order", "testimonial_count", etc.
  pageType: varchar('page_type', { length: 32 }).notNull(),
  vertical: varchar('vertical', { length: 32 }),     // supplement, skincare, etc.
  description: text('description').notNull(),         // Human-readable SOP
  blockSignature: jsonb('block_signature'),           // The winning block config
  liftPercent: real('lift_percent'),                  // Measured improvement
  confidence: real('confidence'),                     // Statistical confidence
  sampleSize: integer('sample_size'),
  experimentIds: jsonb('experiment_ids').$type<string[]>(), // Source experiments
  embedding: text('embedding'),                       // For vector search (pgvector)
  status: varchar('status', { length: 16 }).default('candidate'),
    // candidate → validated → sop → deprecated
  codifiedAt: timestamp('codified_at'),
  createdAt: timestamp('created_at').defaultNow(),
}, (t) => [
  index('idx_patterns_type_page').on(t.patternType, t.pageType),
  index('idx_patterns_status').on(t.status),
]);

// === RAG DOCUMENTS ===
export const ragDocuments = pgTable('rag_documents', {
  id: text('id').primaryKey(),
  sourceType: varchar('source_type', { length: 32 }).notNull(),
    // "winning_pattern", "experiment_result", "brand_guideline", "competitor_analysis"
  content: text('content').notNull(),
  metadata: jsonb('metadata'),
  embedding: text('embedding'),                       // pgvector column
  createdAt: timestamp('created_at').defaultNow(),
});
```

### 3.3 A/B Testing State Machine

```
                    ┌──────────────────────────────────────────┐
                    │                                          │
    ┌───────────┐   │   ┌────────────┐   ┌──────────────┐     │
    │           │   │   │            │   │              │     │
    │  SANDBOX  ├───┼──►│ ELIMINATION├──►│   COMMANDO   │     │
    │           │   │   │            │   │              │     │
    └─────┬─────┘   │   └─────┬──────┘   └──────┬───────┘     │
          │         │         │                  │             │
     Agent creates  │    n < min_sample     Statistical        │
     variants,     │    OR p > 0.30         significance       │
     small traffic │    → kill weak         reached            │
     (5-10%)       │    variants            p < 0.05           │
          │         │         │                  │             │
          │         │         │                  ▼             │
          │         │   ┌─────▼──────┐   ┌──────────────┐     │
          │         │   │            │   │              │     │
          │         │   │  DUEL      │   │  CHAMPION    │     │
          │         │   │            ├──►│              │     │
          │         │   │ 2 remain,  │   │ Winner gets  │     │
          │         │   │ 50/50 split│   │ 100% traffic │     │
          │         │   └────────────┘   │ Pattern → SOP│     │
          │         │                    └──────────────┘     │
          │         │                                          │
          │         └──────────────────────────────────────────┘
          │              Pattern codified into winning_patterns
          │              RAG document created
          │              Feed back into next agent generation
          │
          ▼
    New experiment spawns
    with challenger variants
```

**Implementation in the Hono API:**

```typescript
// src/services/experiment-state-machine.ts

type Stage = 'sandbox' | 'elimination' | 'commando' | 'duel' | 'champion';

interface StageTransition {
  from: Stage;
  to: Stage;
  condition: (experiment: Experiment, variants: VariantStats[]) => boolean;
}

const TRANSITIONS: StageTransition[] = [
  {
    from: 'sandbox',
    to: 'elimination',
    condition: (exp, variants) => {
      // Move to elimination when we have enough total traffic
      const totalViews = variants.reduce((s, v) => s + v.views, 0);
      return totalViews >= 200;
    },
  },
  {
    from: 'elimination',
    to: 'commando',
    condition: (exp, variants) => {
      // Kill variants with conversion rate < 50% of best
      // and move to commando when 2-3 strong variants remain
      const best = Math.max(...variants.map(v => v.conversionRate));
      const strong = variants.filter(v => v.conversionRate >= best * 0.5);
      const totalViews = variants.reduce((s, v) => s + v.views, 0);
      return strong.length <= 3 && totalViews >= (exp.minSampleSize || 1000);
    },
  },
  {
    from: 'commando',
    to: 'duel',
    condition: (exp, variants) => {
      // Statistical significance check (Chi-squared or Bayesian)
      if (variants.length !== 2) return false;
      const [a, b] = variants;
      const pValue = chiSquaredTest(a.conversions, a.views, 
                                     b.conversions, b.views);
      return pValue < 0.10; // Approaching significance
    },
  },
  {
    from: 'duel',
    to: 'champion',
    condition: (exp, variants) => {
      if (variants.length !== 2) return false;
      const [a, b] = variants;
      const pValue = chiSquaredTest(a.conversions, a.views, 
                                     b.conversions, b.views);
      return pValue < 0.05; // Statistically significant
    },
  },
];
```

### 3.4 RAG-Backed Pattern Codification

When an experiment reaches **champion** stage, the system automatically:

```typescript
// src/services/pattern-codifier.ts

async function codifyWinningPattern(experiment: Experiment): Promise<void> {
  const winner = await getWinningVariant(experiment.id);
  const loser = await getLosingVariant(experiment.id);
  
  // 1. Diff the block trees to identify WHAT changed
  const diff = diffBlockTrees(loser.blockTree, winner.blockTree);
  
  // 2. Classify the pattern type
  const patternType = classifyDiff(diff);
  // e.g., "hero_layout", "cta_copy", "bundle_order", "testimonial_count"
  
  // 3. Calculate lift
  const liftPercent = ((winner.conversionRate - loser.conversionRate) 
                       / loser.conversionRate) * 100;
  
  // 4. Generate human-readable SOP description
  const sopDescription = await llm.describePattern({
    diff,
    liftPercent,
    pageType: experiment.pageType,
    vertical: experiment.vertical,
    winnerBlocks: extractRelevantBlocks(diff, winner.blockTree),
  });
  
  // 5. Store winning pattern
  const pattern = await db.insert(winningPatterns).values({
    id: nanoid(),
    patternType,
    pageType: experiment.pageType,
    vertical: experiment.vertical,
    description: sopDescription,
    blockSignature: extractSignature(diff, winner.blockTree),
    liftPercent,
    confidence: 1 - experiment.result.pValue,
    sampleSize: winner.views + loser.views,
    experimentIds: [experiment.id],
    status: 'candidate', // Needs validation across brands
  });
  
  // 6. Create RAG document for future agent context
  await db.insert(ragDocuments).values({
    id: nanoid(),
    sourceType: 'winning_pattern',
    content: formatRAGDocument(pattern),
    metadata: {
      patternType,
      pageType: experiment.pageType,
      vertical: experiment.vertical,
      liftPercent,
    },
  });
  
  // 7. Generate embedding for vector search
  await updateEmbedding(pattern.id, sopDescription);
}

function formatRAGDocument(pattern: WinningPattern): string {
  return `
PATTERN: ${pattern.patternType}
PAGE TYPE: ${pattern.pageType}
VERTICAL: ${pattern.vertical || 'all'}
LIFT: +${pattern.liftPercent.toFixed(1)}%
CONFIDENCE: ${(pattern.confidence * 100).toFixed(1)}%
SAMPLE: ${pattern.sampleSize} visitors

DESCRIPTION: ${pattern.description}

BLOCK SIGNATURE:
${JSON.stringify(pattern.blockSignature, null, 2)}

STATUS: ${pattern.status}
  `.trim();
}
```

### 3.5 How RAG Context Feeds Into Agent Composition

Before every agent composition call, the system queries for relevant winning patterns:

```typescript
// src/services/agent-context.ts

async function buildAgentContext(
  brandId: string,
  pageType: string,
  vertical: string,
): Promise<AgentContext> {
  
  // 1. Get brand manifest (tokens, voice, constraints)
  const brand = await db.query.brands.findFirst({
    where: eq(brands.id, brandId),
  });
  
  // 2. Vector search for relevant winning patterns
  const relevantPatterns = await db.execute(sql`
    SELECT * FROM winning_patterns
    WHERE status IN ('validated', 'sop')
      AND (page_type = ${pageType} OR page_type = 'all')
      AND (vertical = ${vertical} OR vertical IS NULL)
    ORDER BY lift_percent DESC, confidence DESC
    LIMIT 10
  `);
  
  // 3. Get competitor intelligence (if available)
  const competitorInsights = await db.query.ragDocuments.findMany({
    where: and(
      eq(ragDocuments.sourceType, 'competitor_analysis'),
      sql`metadata->>'vertical' = ${vertical}`,
    ),
    limit: 3,
  });
  
  // 4. Get page-type scaffold
  const scaffold = PAGE_TYPE_SCAFFOLDS[pageType];
  
  return {
    brand,
    scaffold,
    winningPatterns: relevantPatterns.map(p => ({
      description: p.description,
      blockSignature: p.blockSignature,
      lift: p.liftPercent,
    })),
    competitorInsights: competitorInsights.map(d => d.content),
    imageConstraints: IMAGE_CONSTRAINTS,
    designTokens: { ...DEFAULT_TOKENS, ...brand.tokenOverrides },
  };
}
```

The RAG context gets injected into the composition prompt as a "Winning Patterns" section:

```markdown
## Proven Winning Patterns for {{page_type}} in {{vertical}}

These patterns have been statistically validated across multiple experiments.
Incorporate them unless you have a strong reason to deviate.

### Pattern 1: Hero with Social Proof Below Fold (+23% conversion, 99.2% confidence)
Place the hero image on top (mobile) with headline and CTA. Immediately below,
add a social-proof.band showing "{{brand_specific_count}} customers" with 
star rating. This outperforms hero-with-testimonial-inline by 23%.

### Pattern 2: 3-Bundle Selector with Middle Recommended (+18% add-to-cart)
When presenting bundles, use exactly 3 options. The middle option should be 
marked as "Most Popular" or "Best Value" with a badge. Price anchoring: show
the per-day cost prominently. This outperforms 2-bundle and 4-bundle layouts.

### Pattern 3: Sticky CTA Appears After Second Section (+31% checkout starts)
Activate the sticky CTA bar after the user scrolls past the second major 
section (typically benefits.grid). Showing it immediately causes banner 
blindness. Waiting too long loses intent.

...
```

### 3.6 SOP Promotion Pipeline

```typescript
// Candidate → Validated → SOP promotion logic

async function evaluatePatternPromotion(): Promise<void> {
  const candidates = await db.query.winningPatterns.findMany({
    where: eq(winningPatterns.status, 'candidate'),
  });
  
  for (const pattern of candidates) {
    // Count how many independent experiments confirmed this pattern
    const confirmingExperiments = await db.query.experiments.findMany({
      where: and(
        sql`result->>'winningPatternType' = ${pattern.patternType}`,
        eq(experiments.stage, 'champion'),
        sql`result->>'pValue' < '0.05'`,
      ),
    });
    
    if (confirmingExperiments.length >= 3) {
      // Pattern confirmed across 3+ independent experiments → Validated
      await db.update(winningPatterns)
        .set({ status: 'validated', codifiedAt: new Date() })
        .where(eq(winningPatterns.id, pattern.id));
    }
    
    if (confirmingExperiments.length >= 5 
        && pattern.liftPercent > 10
        && pattern.confidence > 0.95) {
      // Strong pattern → promote to SOP
      await db.update(winningPatterns)
        .set({ status: 'sop' })
        .where(eq(winningPatterns.id, pattern.id));
      
      // Auto-update the block template defaults
      await updateBlockDefaults(pattern);
    }
  }
}
```

---

## Part 4: Validation and Guardrails

### 4.1 Validation Pipeline (Runs Before Static HTML Generation)

```
Block Tree JSON
      │
      ▼
┌─────────────────┐
│ 1. Schema        │  Validate against JSON Schema
│    Validation    │  (block types, required props, nesting rules)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 2. Composition   │  Check adjacency matrix,
│    Rules         │  page-type required blocks,
│                  │  max occurrences, ordering
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 3. Design Token  │  Verify all color/spacing/typography
│    Compliance    │  values are from approved token set
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 4. Mobile Layout │  Simulate render at 375×812,
│    Constraints   │  check viewport overflow,
│                  │  tap target sizes, text truncation
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 5. Performance   │  Estimate total image weight,
│    Budget        │  font count, CSS size,
│                  │  animation complexity
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 6. Accessibility │  Color contrast ratios,
│    Checks        │  aria attributes, heading hierarchy,
│                  │  alt text presence
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 7. Compliance    │  Stripe element placement,
│    Checks        │  required legal text,
│                  │  tracking pixel markers
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 8. Lighthouse    │  Run headless Lighthouse
│    Audit         │  (mobile preset, performance ≥ 90)
└────────┬────────┘
         │
         ▼
   Static HTML Generation
   (Handlebars pre-render)
         │
         ▼
   Nginx serves static files
```

### 4.2 Implementation: Schema Validation

```typescript
// src/validation/block-tree-schema.ts

import { z } from 'zod';

// Tier 1: Atoms
const HeadingBlock = z.object({
  type: z.literal('text.heading'),
  id: z.string(),
  props: z.object({
    level: z.number().min(1).max(4),
    text: z.string().min(1).max(200),
    align: z.enum(['left', 'center', 'right']).default('left'),
    weight: z.enum(['normal', 'semibold', 'bold']).default('bold'),
  }),
  styles: z.object({
    color: z.enum(['primary', 'secondary', 'accent', 'urgency']).optional(),
    size: z.enum(['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl']).optional(),
  }).optional(),
});

const CtaBlock = z.object({
  type: z.literal('button.cta'),
  id: z.string(),
  props: z.object({
    label: z.string().min(2).max(60),
    href: z.string().optional(),
    variant: z.enum(['primary', 'secondary', 'urgency', 'ghost']).default('primary'),
    size: z.enum(['sm', 'md', 'lg']).default('md'),
    fullWidth: z.boolean().default(false),
    icon: z.string().optional(),
  }),
  actions: z.object({
    onClick: z.string().optional(),      // Tracking event name
    stripePriceId: z.string().optional(), // Stripe checkout trigger
  }).optional(),
});

const ImageBlock = z.object({
  type: z.literal('media.image'),
  id: z.string(),
  props: z.object({
    src: z.string().url(),
    alt: z.string().min(1),              // REQUIRED for accessibility
    aspect: z.enum(['1/1', '3/4', '4/3', '16/9', '9/16']).default('3/4'),
    lazy: z.boolean().default(true),
    maxWidth: z.number().max(1200).optional(),
  }),
});

// ... (all atom schemas)

// Tier 3: Organisms
const HeroSplitBlock = z.object({
  type: z.literal('hero.split'),
  id: z.string(),
  props: z.object({
    headline: z.string().min(5).max(120),
    subhead: z.string().max(300).optional(),
    media: ImageBlock.shape.props,
    mediaSide: z.enum(['left', 'right']).default('right'),
    cta: CtaBlock.shape.props,
    trustBadges: z.array(z.string()).max(5).optional(),
    socialProof: z.object({
      count: z.string(),
      avatars: z.array(z.string().url()).max(5),
      rating: z.number().min(1).max(5).optional(),
    }).optional(),
  }),
});

// Full block tree schema
const BlockTree = z.object({
  version: z.literal('1.0'),
  pageType: z.enum(['advertorial', 'product', 'vsl', 'checkout', 'upsell']),
  tokens: DesignTokensSchema,
  blocks: z.array(
    z.discriminatedUnion('type', [
      HeroSplitBlock,
      HeroFullBleedBlock,
      EditorialBlock,
      BenefitsGridBlock,
      IngredientsPanelBlock,
      SocialProofBandBlock,
      BundleSelectorBlock,
      FaqAccordionBlock,
      VslPlayerBlock,
      CheckoutFormBlock,
      UpsellOfferBlock,
      GuaranteeSectionBlock,
      BeforeAfterBlock,
      FooterLegalBlock,
      StickyBarBlock,
    ])
  ).min(3).max(30),
  metadata: z.object({
    title: z.string().max(60),           // SEO
    description: z.string().max(160),    // SEO
    ogImage: z.string().url().optional(),
    trackingId: z.string(),
  }),
});
```

### 4.3 Mobile Layout Constraint Checker

```typescript
// src/validation/mobile-constraints.ts

interface LayoutSimulation {
  viewportWidth: 375;
  viewportHeight: 812;
  blockHeights: Map<string, number>;
  cumulativeHeight: number;
  ctaPositions: Array<{ blockId: string; y: number }>;
  firstCtaY: number | null;
  stickyCtaActivatedAt: number | null;
}

async function validateMobileLayout(
  blockTree: BlockTree,
  renderedHtml: string,
): Promise<ValidationResult> {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  
  // 1. Use Puppeteer to render at 375×812
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2 });
  await page.setContent(renderedHtml, { waitUntil: 'networkidle0' });
  
  // 2. Check horizontal overflow
  const hasOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth;
  });
  if (hasOverflow) {
    errors.push({
      code: 'HORIZONTAL_OVERFLOW',
      message: 'Page has horizontal scroll at 375px viewport',
      severity: 'error',
    });
  }
  
  // 3. Check all tap targets meet minimum size
  const smallTapTargets = await page.evaluate(() => {
    const interactive = document.querySelectorAll(
      'button, a, input, select, textarea, [role="button"], [onclick]'
    );
    const violations: Array<{ element: string; width: number; height: number }> = [];
    
    interactive.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.width < 44 || rect.height < 44) {
        violations.push({
          element: el.tagName + (el.className ? `.${el.className}` : ''),
          width: rect.width,
          height: rect.height,
        });
      }
    });
    return violations;
  });
  
  if (smallTapTargets.length > 0) {
    errors.push({
      code: 'TAP_TARGET_TOO_SMALL',
      message: `${smallTapTargets.length} interactive elements below 44×44px`,
      details: smallTapTargets,
      severity: 'error',
    });
  }
  
  // 4. Check CLS (Cumulative Layout Shift)
  const cls = await page.evaluate(async () => {
    return new Promise<number>((resolve) => {
      let clsScore = 0;
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsScore += (entry as any).value;
          }
        }
      });
      observer.observe({ type: 'layout-shift', buffered: true });
      setTimeout(() => {
        observer.disconnect();
        resolve(clsScore);
      }, 3000);
    });
  });
  
  if (cls > 0.1) {
    errors.push({
      code: 'CLS_EXCEEDED',
      message: `CLS score ${cls.toFixed(3)} exceeds 0.1 budget`,
      severity: 'error',
    });
  }
  
  // 5. Check CTA above fold
  const firstCtaRect = await page.evaluate(() => {
    const cta = document.querySelector('.cta, [data-track*="cta"]');
    if (!cta) return null;
    return cta.getBoundingClientRect();
  });
  
  if (!firstCtaRect || firstCtaRect.top > 812) {
    errors.push({
      code: 'CTA_BELOW_FOLD',
      message: 'First CTA is below the fold on mobile (812px viewport)',
      severity: 'error',
    });
  }
  
  // 6. Check section heights
  const sectionHeights = await page.evaluate(() => {
    const sections = document.querySelectorAll('.block');
    return Array.from(sections).map(s => ({
      id: s.id || s.className,
      height: s.getBoundingClientRect().height,
    }));
  });
  
  for (const section of sectionHeights) {
    if (section.height > 1200) { // ~1.5x viewport
      warnings.push({
        code: 'SECTION_TOO_TALL',
        message: `Section "${section.id}" is ${Math.round(section.height)}px tall — 
                  consider splitting for mobile readability`,
      });
    }
  }
  
  // 7. Check text is readable (not too small, not too long)
  const textIssues = await page.evaluate(() => {
    const textElements = document.querySelectorAll('p, span, li, td');
    const issues: Array<{ element: string; fontSize: number; lineWidth: number }> = [];
    
    textElements.forEach(el => {
      const style = window.getComputedStyle(el);
      const fontSize = parseFloat(style.fontSize);
      const lineWidth = el.getBoundingClientRect().width;
      
      if (fontSize < 14 && el.textContent?.trim().length > 10) {
        issues.push({
          element: el.tagName + ` (${el.textContent?.slice(0, 30)}...)`,
          fontSize,
          lineWidth,
        });
      }
    });
    return issues;
  });
  
  if (textIssues.length > 0) {
    warnings.push({
      code: 'TEXT_TOO_SMALL',
      message: `${textIssues.length} text elements below 14px on mobile`,
    });
  }
  
  await page.close();
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
    metrics: { cls, sectionHeights, firstCtaY: firstCtaRect?.top },
  };
}
```

### 4.4 Performance Budget Enforcement

```typescript
// src/validation/performance-budget.ts

const PERFORMANCE_BUDGETS = {
  // Mobile-first budgets (based on 3G Fast: 1.6 Mbps down)
  maxTotalImageWeight: 800,       // KB
  maxImageCount: 12,
  maxFontCount: 3,                // Display + Body + UI
  maxFontWeightCount: 4,          // e.g., 400, 600, 700
  maxCssSize: 50,                 // KB (unminified)
  maxDomNodes: 800,
  maxDomDepth: 15,
  maxExternalRequests: 20,
  maxJsSize: 0,                   // Zero JS except tracking + Stripe
  maxLcp: 2500,                   // ms
  maxFid: 100,                    // ms
  maxCls: 0.1,
  lighthousePerformanceTarget: 90,
  lighthouseAccessibilityTarget: 95,
};

async function validatePerformanceBudget(
  renderedHtml: string,
): Promise<PerformanceResult> {
  const violations: string[] = [];
  
  // 1. Parse HTML for resource counts
  const $ = cheerio.load(renderedHtml);
  
  const imageCount = $('img').length;
  if (imageCount > PERFORMANCE_BUDGETS.maxImageCount) {
    violations.push(`Image count ${imageCount} exceeds budget of ${PERFORMANCE_BUDGETS.maxImageCount}`);
  }
  
  const fontLinks = $('link[href*="fonts.googleapis.com"]');
  const fontFamilies = new Set<string>();
  fontLinks.each((_, el) => {
    const href = $(el).attr('href') || '';
    const families = href.match(/family=([^&:]+)/g) || [];
    families.forEach(f => fontFamilies.add(f));
  });
  if (fontFamilies.size > PERFORMANCE_BUDGETS.maxFontCount) {
    violations.push(`Font family count ${fontFamilies.size} exceeds budget`);
  }
  
  // 2. Run Lighthouse
  const lhr = await lighthouse(`data:text/html,${encodeURIComponent(renderedHtml)}`, {
    onlyCategories: ['performance', 'accessibility'],
    preset: 'mobile',
    throttling: lighthouse.desktop ? undefined : {
      // Simulated 3G
      rttMs: 150,
      throughputKbps: 1600,
      cpuSlowdownMultiplier: 4,
    },
  });
  
  const perfScore = lhr.lhr.categories.performance.score * 100;
  const a11yScore = lhr.lhr.categories.accessibility.score * 100;
  
  if (perfScore < PERFORMANCE_BUDGETS.lighthousePerformanceTarget) {
    violations.push(`Lighthouse performance ${perfScore} < ${PERFORMANCE_BUDGETS.lighthousePerformanceTarget}`);
  }
  
  if (a11yScore < PERFORMANCE_BUDGETS.lighthouseAccessibilityTarget) {
    violations.push(`Lighthouse accessibility ${a11yScore} < ${PERFORMANCE_BUDGETS.lighthouseAccessibilityTarget}`);
  }
  
  return {
    passed: violations.length === 0,
    violations,
    scores: { performance: perfScore, accessibility: a11yScore },
  };
}
```

### 4.5 The Complete Validation Orchestrator

```typescript
// src/validation/pipeline.ts

async function validateBlockTree(
  blockTree: BlockTree,
  brandId: string,
): Promise<{ valid: boolean; html?: string; report: ValidationReport }> {
  
  const report: ValidationReport = {
    stages: [],
    passed: true,
    errors: [],
    warnings: [],
  };
  
  // Stage 1: Schema Validation
  const schemaResult = BlockTree.safeParse(blockTree);
  report.stages.push({
    name: 'schema',
    passed: schemaResult.success,
    errors: schemaResult.success ? [] : formatZodErrors(schemaResult.error),
  });
  if (!schemaResult.success) {
    report.passed = false;
    return { valid: false, report };
  }
  
  // Stage 2: Composition Rules
  const compositionResult = validateComposition(blockTree);
  report.stages.push({ name: 'composition', ...compositionResult });
  if (!compositionResult.passed) {
    report.passed = false;
    report.errors.push(...compositionResult.errors);
  }
  
  // Stage 3: Design Token Compliance
  const tokenResult = validateTokens(blockTree.tokens, brandId);
  report.stages.push({ name: 'tokens', ...tokenResult });
  if (!tokenResult.passed) {
    report.passed = false;
  }
  
  // Stage 4: Pre-render to HTML (needed for remaining checks)
  const html = await renderHandlebars(blockTree);
  
  // Stage 5: Mobile Layout Constraints
  const mobileResult = await validateMobileLayout(blockTree, html);
  report.stages.push({ name: 'mobile-layout', ...mobileResult });
  if (!mobileResult.valid) {
    report.passed = false;
    report.errors.push(...mobileResult.errors);
  }
  report.warnings.push(...mobileResult.warnings);
  
  // Stage 6: Performance Budget
  const perfResult = await validatePerformanceBudget(html);
  report.stages.push({ name: 'performance', ...perfResult });
  if (!perfResult.passed) {
    // Performance failures are warnings, not blockers
    // (agent can iterate)
    report.warnings.push(...perfResult.violations);
  }
  
  // Stage 7: Compliance Checks
  const complianceResult = validateCompliance(blockTree, html);
  report.stages.push({ name: 'compliance', ...complianceResult });
  if (!complianceResult.passed) {
    report.passed = false;
    report.errors.push(...complianceResult.errors);
  }
  
  return {
    valid: report.passed,
    html: report.passed ? html : undefined,
    report,
  };
}
```

### 4.6 Agent Self-Correction Loop

When validation fails, feed errors back to the agent:

```typescript
// src/services/agent-composer.ts

async function composeWithRetry(
  context: AgentContext,
  maxRetries: number = 3,
): Promise<BlockTree> {
  
  let blockTree: BlockTree | null = null;
  let validationReport: ValidationReport | null = null;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    // Compose (or re-compose with error context)
    blockTree = await llm.compose({
      context,
      previousAttempt: blockTree,
      validationErrors: validationReport?.errors || [],
      attempt,
    });
    
    // Validate
    const result = await validateBlockTree(blockTree, context.brand.id);
    validationReport = result.report;
    
    if (result.valid) {
      return blockTree;
    }
    
    // On failure, add specific error context for retry
    context.retryContext = {
      attempt,
      errors: result.report.errors,
      warnings: result.report.warnings,
      failedStage: result.report.stages.find(s => !s.passed)?.name,
    };
  }
  
  throw new AgentCompositionError(
    `Failed to produce valid block tree after ${maxRetries} retries`,
    validationReport,
  );
}
```

The retry prompt includes:

```markdown
## Previous Attempt Failed Validation

Your last block tree had the following errors. Fix them:

### Error 1: CTA_BELOW_FOLD
The first CTA button appeared at y=1043px, which is below the 812px mobile 
viewport. Move the hero CTA into the first organism block, or add a 
sticky CTA bar that activates earlier.

### Error 2: TAP_TARGET_TOO_SMALL
The "Read More" link (element: a.read-more) measured 32×18px. All interactive
elements must be at least 44×44px. Use the button.cta block with size="sm" 
instead of a text link.

### Error 3: SECTION_TOO_TALL
The "editorial.block" at index 3 was 1,450px tall. Break it into 2 separate
editorial blocks with an image or social proof between them.

Re-generate the block tree fixing ONLY these issues. Do not change blocks 
that passed validation.
```

---

## Summary: The Complete Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                         LAYER 1: DESIGN LANGUAGE                     │
│                                                                      │
│  • Block Taxonomy (3 tiers: atoms → molecules → organisms)           │
│  • Design Token System (locked palette per vertical)                 │
│  • Handlebars Partials with baked-in responsive CSS                  │
│  • Mobile-first patterns (sticky CTA, swipe carousel, accordion)     │
│  • Image constraints (aspect ratios, max sizes, WebP, lazy)          │
│  • Typographic scale (5 levels, fluid sizing, locked minimums)       │
│  • Spacing scale (4px base, 12 steps, section rhythm)                │
├──────────────────────────────────────────────────────────────────────┤
│                         LAYER 2: AGENT INTELLIGENCE                  │
│                                                                      │
│  • Multi-stage prompt pipeline (context → compose → refine)          │
│  • Constrained composition (adjacency matrix, page-type scaffolds)   │
│  • RAG-injected winning patterns from validated experiments          │
│  • Brand manifest (tokens, voice, vertical-specific constraints)     │
│  • Self-correction loop with validation error feedback               │
│  • Max 3 retries before human escalation                             │
├──────────────────────────────────────────────────────────────────────┤
│                         LAYER 3: FEEDBACK LOOPS                      │
│                                                                      │
│  • A/B testing state machine (5 stages with statistical gates)       │
│  • Automatic pattern codification at champion stage                  │
│  • RAG document generation with embeddings                           │
│  • SOP promotion pipeline (candidate → validated → sop)              │
│  • Pattern lift tracking across brands and verticals                 │
│  • Deprecation of patterns that stop winning                         │
├──────────────────────────────────────────────────────────────────────┤
│                         LAYER 4: VALIDATION GATES                    │
│                                                                      │
│  • JSON Schema validation (Zod, discriminated unions)                │
│  • Block composition rules (adjacency, required blocks)              │
│  • Design token compliance (no rogue values)                         │
│  • Mobile layout simulation (Puppeteer at 375×812)                   │
│  • Tap target size enforcement (≥ 44×44px)                           │
│  • Horizontal overflow detection                                     │
│  • CLS budget (< 0.1)                                                │
│  • CTA above-fold verification                                       │
│  • Performance budgets (image weight, font count, DOM nodes)         │
│  • Lighthouse mobile audit (perf ≥ 90, a11y ≥ 95)                   │
│  • Accessibility checks (contrast, alt text, heading hierarchy)      │
│  • Compliance checks (Stripe elements, legal text, tracking)         │
└──────────────────────────────────────────────────────────────────────┘
```

The key architectural principle: **the design system guarantees visual quality floor, the agent orchestrates within that system, the A/B engine discovers what works above that floor, and the validation pipeline catches everything that falls below it.** No single layer is sufficient alone — the magic is in their interaction.

9:   Architecture Agent-First : Réponses aux 4 Questions

  (1) Système de Design Tokens + Composition Agent

  Ton architecture a déjà le bon squelette (block tree, responsive styles, template system). Ce qui manque, c'est la couche de contraintes qui empêche un
  agent de produire n'importe quoi. Le problème fondamental : un LLM sans contraintes produit des pages "fonctionnelles mais moches".

  La solution : 3 couches de contraintes imbriquées

  Couche 1 — Design Tokens (hardcoded, non-négociables)

  // src/design-system/tokens.ts
  // WHY: Ces valeurs sont les SEULES que l'agent peut utiliser.
  // N'importe quelle autre valeur = rejeté par le validateur.
  // Inspiré des top performers DTC: Joggo, Meatable, Ozempic funnels.

  export const DESIGN_TOKENS = {
    // Spacing scale — 4px base (mobile thumb = 44px minimum)
    spacing: {
      '0': '0px',
      '1': '4px',    // micro
      '2': '8px',    // tight
      '3': '12px',   // compact
      '4': '16px',   // base mobile padding
      '5': '20px',   // comfortable
      '6': '24px',   // section gap
      '8': '32px',   // large gap
      '10': '40px',  // section padding mobile
      '12': '48px',  // section padding desktop
      '16': '64px',  // hero spacing
    } as const,

    // Typography — 2 fonts max, scale modulaire 1.25
    typography: {
      families: {
        heading: "'DM Serif Display', Georgia, serif",  // DTC premium feel
        body: "'Inter', -apple-system, sans-serif",       // lisible petit écran
      },
      sizes: {
        xs: '0.75rem',    // 12px — captions, badges
        sm: '0.875rem',   // 14px — body compact mobile
        base: '1rem',     // 16px — body default
        lg: '1.125rem',  // 18px — subheadline
        xl: '1.25rem',   // 20px — small heading mobile
        '2xl': '1.5rem', // 24px — heading mobile
        '3xl': '1.875rem', // 30px — headline mobile
        '4xl': '2.25rem',  // 36px — hero headline mobile
        '5xl': '3rem',     // 48px — hero headline desktop only
      },
      weights: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        black: 900,     // headlines only
      },
      lineHeight: {
        tight: '1.2',    // headlines
        snug: '1.375',   // subheadlines
        normal: '1.5',   // body
        relaxed: '1.625', // long-form advertorial
      },
    },

    // Colors — contraint à N palettes pré-validées
    palettes: {
      // Chaque palette est testée pour contraste WCAG AA sur mobile
      'health-warm': {
        primary: '#E74C3C',      // CTA rouge urgence
        primaryHover: '#C0392B',
        secondary: '#2C3E50',    // text
        accent: '#F39C12',       // badges, highlights
        background: '#FFFFFF',
        surface: '#F8F9FA',      // alternating sections
        text: '#1A1A1A',
        textMuted: '#6B7280',
        success: '#27AE60',      // trust signals
        warning: '#F39C12',
      },
      'beauty-clean': {
        primary: '#D4A574',
        primaryHover: '#C4956A',
        secondary: '#4A4A4A',
        accent: '#E8C9A0',
        background: '#FEFEFE',
        surface: '#F5F0EB',
        text: '#2D2D2D',
        textMuted: '#8B8B8B',
        success: '#7FB069',
        warning: '#E6B655',
      },
      'supplement-bold': {
        primary: '#FF6B00',      // orange high-energy
        primaryHover: '#E05E00',
        secondary: '#1A1A2E',
        accent: '#FFB800',
        background: '#FFFFFF',
        surface: '#FFF8F0',
        text: '#1A1A1A',
        textMuted: '#6B7280',
        success: '#10B981',
        warning: '#F59E0B',
      },
      'pet-friendly': {
        primary: '#4CAF50',
        primaryHover: '#43A047',
        secondary: '#37474F',
        accent: '#FF9800',
        background: '#FFFFFF',
        surface: '#F1F8E9',
        text: '#263238',
        textMuted: '#78909C',
        success: '#66BB6A',
        warning: '#FFA726',
      },
    } as const,

    // Border radius — DTC uses soft, never sharp
    radius: {
      none: '0px',
      sm: '4px',
      md: '8px',      // cards, inputs
      lg: '12px',     // buttons mobile
      xl: '16px',     // cards premium
      full: '9999px', // pills, badges
    },

    // Shadows — subtle only (heavy shadows = cheap looking)
    shadow: {
      none: 'none',
      sm: '0 1px 2px rgba(0,0,0,0.05)',
      md: '0 4px 6px rgba(0,0,0,0.07)',
      lg: '0 10px 15px rgba(0,0,0,0.1)',
    },

    // Breakpoints
    breakpoints: {
      mobile: '0px',     // 0-767px — DEFAULT
      tablet: '768px',   // 768-1024px
      desktop: '1025px', // 1025+
    },

    // CTA dimensions — MOBILE FIRST, thumb-friendly
    cta: {
      minHeight: '52px',              // Apple HIG: 44px min, DTC: 52px
      minHeightDesktop: '56px',
      paddingX: '24px',
      paddingXDesktop: '32px',
      fontSize: '1.125rem',           // 18px — readable on mobile
      fontWeight: 'bold',
      borderRadius: 'lg',             // 12px
      fullWidth: true,                // mobile: CTA = 100% width
      fullWidthDesktop: false,        // desktop: auto width
    },

    // Image aspect ratios — DTC specific
    imageRatios: {
      productHero: '4:5',        // 1080x1350 — Instagram/DTC standard
      productThumbnail: '1:1',
      lifestyle: '16:9',
      beforeAfter: '1:1',
      testimonial: '1:1',
      banner: '21:9',            // desktop only
      productInUse: '4:5',
    },

    // Max widths per page type
    pageMaxWidth: {
      advertorial: '720px',      // editorial = narrow, readable
      productPage: '1024px',     // needs side-by-side on desktop
      vsl: '960px',              // video centered
      checkout: '520px',         // minimal, focused
      upsell: '520px',           // same as checkout — impulse
      quiz: '640px',             // centered, focused
    },
  } as const

  export type PaletteKey = keyof typeof DESIGN_TOKENS.palettes
  export type SpacingKey = keyof typeof DESIGN_TOKENS.spacing

  Couche 2 — Block Composition Rules (contraintes par type de page)

  // src/design-system/composition-rules.ts
  // WHY: Un agent ne peut pas juste empiler des blocs au hasard.
  // Chaque type de page a une structure obligatoire et des contraintes.

  export const PAGE_COMPOSITION_RULES: Record<StepType, {
    // Ordre obligatoire des sections (l'agent peut en insérer entre, mais pas réordonner ces-là)
    requiredSequence: string[]
    // Blocs obligatoires (doivent être présents quelque part)
    requiredBlocks: string[]
    // Blocs interdits sur ce type de page
    forbiddenBlocks: string[]
    // Règles de spacing spécifiques
    sectionGap: SpacingKey
    // Headline max chars (mobile)
    headlineMaxChars: number
    // Max blocks total (éviter pages infinies)
    maxBlocks: number
  }> = {
    'product-page': {
      requiredSequence: ['hero', 'bundle-offers', 'add-to-cart'],
      requiredBlocks: ['hero', 'bundle-offers', 'reviews', 'add-to-cart', 'guarantee', 'faq'],
      forbiddenBlocks: ['form', 'quiz-step'],
      sectionGap: '10',
      headlineMaxChars: 60,
      maxBlocks: 15,
    },
    'advertorial': {
      requiredSequence: ['hero'],
      requiredBlocks: ['hero', 'reviews', 'cta'],
      forbiddenBlocks: ['payment-form', 'order-summary', 'quiz-step'],
      sectionGap: '8',
      headlineMaxChars: 80,
      maxBlocks: 20,
    },
    'vsl': {
      requiredSequence: ['hero', 'cta'],
      requiredBlocks: ['hero', 'cta'],
      forbiddenBlocks: ['payment-form', 'bundle-offers', 'quiz-step'],
      sectionGap: '10',
      headlineMaxChars: 50,
      maxBlocks: 8,
    },
    'checkout': {
      requiredSequence: ['order-summary', 'payment-form'],
      requiredBlocks: ['order-summary', 'payment-form', 'trust-badges', 'guarantee'],
      forbiddenBlocks: ['hero', 'countdown', 'reviews', 'comparison-chart', 'product-carousel', 'quiz-step'],
      sectionGap: '6',
      headlineMaxChars: 40,
      maxBlocks: 6,
    },
    'upsell': {
      requiredSequence: ['heading', 'bundle-offers', 'add-to-cart'],
      requiredBlocks: ['heading', 'bundle-offers', 'add-to-cart', 'countdown'],
      forbiddenBlocks: ['payment-form', 'faq', 'comparison-chart', 'product-carousel', 'quiz-step'],
      sectionGap: '6',
      headlineMaxChars: 50,
      maxBlocks: 6,
    },
    'optin': {
      requiredSequence: ['hero', 'form'],
      requiredBlocks: ['hero', 'form', 'trust-badges'],
      forbiddenBlocks: ['payment-form', 'order-summary', 'bundle-offers'],
      sectionGap: '8',
      headlineMaxChars: 60,
      maxBlocks: 6,
    },
    'quiz': {
      requiredSequence: ['quiz-step'],
      requiredBlocks: ['quiz-step'],
      forbiddenBlocks: ['payment-form', 'order-summary', 'bundle-offers', 'comparison-chart'],
      sectionGap: '6',
      headlineMaxChars: 40,
      maxBlocks: 10,
    },
    'downsell': {
      requiredSequence: ['heading', 'bundle-offers', 'add-to-cart'],
      requiredBlocks: ['heading', 'bundle-offers', 'add-to-cart'],
      forbiddenBlocks: ['payment-form', 'faq', 'reviews', 'product-carousel'],
      sectionGap: '6',
      headlineMaxChars: 50,
      maxBlocks: 5,
    },
    'thank-you': {
      requiredSequence: ['heading'],
      requiredBlocks: ['heading'],
      forbiddenBlocks: ['payment-form', 'countdown', 'bundle-offers'],
      sectionGap: '6',
      headlineMaxChars: 40,
      maxBlocks: 5,
    },
    'bridge': {
      requiredSequence: ['heading'],
      requiredBlocks: ['heading', 'button'],
      forbiddenBlocks: ['payment-form', 'order-summary'],
      sectionGap: '6',
      headlineMaxChars: 50,
      maxBlocks: 4,
    },
  }

  Couche 3 — LLM Prompt Structure (le system prompt de l'agent)

  // src/agents/prompts/block-composer.ts
  // WHY: Ce prompt est le seul endroit où l'agent "apprend" le design.
  // Tout le reste est dans le code — le prompt ne fait que référencer.

  export const BLOCK_COMPOSER_SYSTEM_PROMPT = `
  You are a DTC e-commerce page designer. You compose pages as JSON block trees.

  ## YOUR CONSTRAINTS (non-negotiable)

  1. MOBILE FIRST: 90% of traffic is mobile. Design for 390px width (iPhone 14).
  2. You can ONLY use these design tokens: {tokens_reference}
  3. You can ONLY use blocks from the registry: {available_blocks}
  4. The page type "${pageType}" has these rules:
     - Required blocks: {required_blocks}
     - Forbidden blocks: {forbidden_blocks}
     - Max blocks: {max_blocks}
     - Headline max chars: {headline_max_chars}
     - Required sequence: {required_sequence}

  ## PAGE TYPE GUIDE: ${pageType}

  ${getPageTypeGuide(pageType)}

  ## MOBILE DESIGN RULES

  - CTAs: min 52px height, full width on mobile, bold 18px text
  - Text: body 16px minimum (14px for captions only), line-height 1.5+
  - Spacing: use spacing tokens ONLY. Sections need 40px+ gap on mobile
  - Images: product hero = 4:5 ratio, thumbnails = 1:1
  - Colors: pick ONE palette, use it everywhere. Never mix palettes.
  - Typography: 2 fonts max (heading + body). Heading font for headlines only.
  - Padding: 16px horizontal on mobile (edge-to-edge text = unreadable)
  - Above the fold: hero headline + CTA must be visible WITHOUT scrolling

  ## OUTPUT FORMAT

  Return a valid JSON block tree. Every block MUST have:
  - id: nanoid string
  - type: from registry
  - props: matching the block's schema
  - styles: { mobile: {...}, tablet: {...}, desktop: {...} }
    - Use ONLY token values (spacing-X, text-X, palette colors)
    - mobile styles are DEFAULT (rendered first)
    - tablet/desktop are OVERRIDES via media queries
  - visibility: { mobile: true, tablet: true, desktop: true }
  - children: only for section/container blocks

  ## MARKETING ANGLE INJECTION

  The marketing angle provides:
  - headline → use in hero headline
  - subheadline → use in hero subheadline
  - ctaText → use in ALL CTAs (consistency)
  - benefits → use in benefits-list
  - guarantee → use in guarantee block
  - painPoint → reference in first section after hero

  DO NOT rename or rephrase the angle's core message.
  `

  function getPageTypeGuide(type: StepType): string {
    const guides: Record<StepType, string> = {
      'product-page': `
  Structure: Hero → Social Proof (reviews high!) → Product Images → Benefits → Trust → Bundles → Countdown → Comparison → FAQ → Guarantee → Final CTA
  Key: Reviews ABOVE the fold (not buried at bottom). Bundle "Most Popular" pre-selected.
  Sticky CTA bar on mobile (appears after scrolling past hero).`,
      'advertorial': `
  Structure: Editorial Hero → Problem Story → Solution Reveal → Social Proof → Benefits → Authority → CTA woven throughout
  Key: Looks like a NEWS ARTICLE, not a sales page. Long-form (1500-3000 words).
  Subtle CTAs every 3-4 sections. No aggressive pricing until 60%+ scroll depth.
  Fonts: serif heading (editorial feel), sans-serif body.`,
      'vsl': `
  Structure: Hero with video → Problem → Solution → Proof → CTA → FAQ → Guarantee → Final CTA
  Key: Video is the star. Sticky player on mobile (picture-in-picture when scrolling).
  Minimal text. Large play button. Autoplay muted on mobile.
  CTAs appear at key moments (not just at end).`,
      'checkout': `
  Structure: Order Summary → Payment Form → Trust Badges → Guarantee
  Key: MINIMAL. No distractions. No nav. No footer.
  Express checkout (Apple Pay, Google Pay) at TOP.
  Progress bar: "Step 1 of 1" or "Final Step".
  Security badges next to submit button. Guarantee below.`,
      'upsell': `
  Structure: Headline → One-Click Offer → Countdown → Accept/Decline
  Key: ONE offer, ONE decision, ONE click. No complexity.
  "YES! Add to my order" (green) vs "No thanks, I don't want X" (negative opt-out).
  Countdown timer creates urgency. Show savings prominently.`,
      'downsell': `
  Structure: "Wait!" headline → Reduced offer → One-Click Accept
  Key: Even simpler than upsell. Price is the ONLY difference.
  "Before you go..." emotional hook. 50%+ discount typical.`,
      'optin': `
  Structure: Hero → Value Prop → Form (email only) → Trust
  Key: Email + maybe first name. NOTHING else.
  Value prop above form. Form = single column on mobile.
  Button text = benefit ("Get My Free Guide") not action ("Submit").`,
      'quiz': `
  Structure: Question → Options (2-4 visual cards) → Progress bar → Next
  Key: One question per screen. Visual option cards (image + label).
  Progress bar shows completion (reduces abandonment).
  Results → personalized product recommendation.`,
      'thank-you': `
  Structure: Confirmation → Next Steps → Upsell/Cross-sell → Social Share
  Key: Positive reinforcement. "Your order is confirmed!"
  Show order summary. Suggest related products.
  Encourage social sharing or review.`,
      'bridge': `
  Structure: Headline → Brief context → Button to next step
  Key: Single purpose: move visitor to the NEXT page.
  Short, punchy. "Watch the free video" or "See the special offer".
  No distractions. One CTA only.`,
    }
    return guides[type]
  }

  ---
  (2) Ce qui fait qu'un design LLM a l'air "pro" sur mobile

  La réponse courte : ce n'est pas le LLM qui fait le design — c'est le système de templates CSS. Le LLM choisit les blocs et le contenu. Le CSS hardcoded
  fait 90% du travail visuel.

  Le Design System CSS (injecté dans chaque rendu)

  /* src/design-system/mobile-first.css */
  /* WHY: Ce CSS est le "goût" du système.
     L'agent ne touche PAS à ce fichier. Il ne fait que choisir des blocs.
     Ce CSS garantit que N'IMPORTE QUELLE composition de blocs = page pro. */

  /* ==========================================
     RESET + BASE (mobile-first)
     ========================================== */
  :root {
    /* Palette injected at render time */
    --c-primary: var(--palette-primary);
    --c-primary-hover: var(--palette-primary-hover);
    --c-secondary: var(--palette-secondary);
    --c-accent: var(--palette-accent);
    --c-bg: var(--palette-background);
    --c-surface: var(--palette-surface);
    --c-text: var(--palette-text);
    --c-muted: var(--palette-text-muted);
    --c-success: var(--palette-success);

    --f-heading: 'DM Serif Display', Georgia, serif;
    --f-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

    /* Spacing tokens */
    --s-1: 4px; --s-2: 8px; --s-3: 12px; --s-4: 16px;
    --s-5: 20px; --s-6: 24px; --s-8: 32px; --s-10: 40px;
    --s-12: 48px; --s-16: 64px;

    /* Radius tokens */
    --r-sm: 4px; --r-md: 8px; --r-lg: 12px; --r-xl: 16px; --r-full: 9999px;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { font-size: 16px; -webkit-text-size-adjust: 100%; scroll-behavior: smooth; }
  body {
    font-family: var(--f-body);
    color: var(--c-text);
    background: var(--c-bg);
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* ==========================================
     SECTION — le container universel
     ========================================== */
  .funnel-section {
    padding: var(--s-10) var(--s-4);      /* 40px 16px mobile */
    max-width: var(--page-max-width, 720px);
    margin: 0 auto;
  }
  .funnel-section--surface {
    background: var(--c-surface);
  }
  /* Alternance automatique : chaque section paire = surface */
  .funnel-section:nth-child(even) {
    background: var(--c-surface);
  }
  @media (min-width: 768px) {
    .funnel-section { padding: var(--s-12) var(--s-6); }
  }
  @media (min-width: 1025px) {
    .funnel-section { padding: var(--s-16) var(--s-8); }
  }

  /* ==========================================
     TYPOGRAPHY — hiérarchie stricte
     ========================================== */
  .block-heading {
    font-family: var(--f-heading);
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: var(--s-4);
    /* NEVER center on mobile for long headlines — left-aligned = readable */
    text-align: left;
  }
  .block-heading--hero {
    font-size: 2.25rem;       /* 36px mobile */
    letter-spacing: -0.02em;  /* tighter for headlines */
    line-height: 1.1;
  }
  .block-heading--section {
    font-size: 1.5rem;        /* 24px mobile */
  }
  .block-heading--card {
    font-family: var(--f-body);
    font-size: 1.125rem;      /* 18px */
    font-weight: 600;
  }
  @media (min-width: 768px) {
    .block-heading--hero { font-size: 3rem; }     /* 48px desktop */
    .block-heading--section { font-size: 2rem; }   /* 32px desktop */
  }

  .block-text {
    font-size: 1rem;
    line-height: 1.625;       /* 26px — relaxed for advertorials */
    color: var(--c-muted);
  }
  .block-text--sm {
    font-size: 0.875rem;
    line-height: 1.5;
  }

  /* ==========================================
     BUTTONS / CTAs — le plus critique
     ========================================== */
  .cta-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--s-2);
    width: 100%;              /* FULL WIDTH on mobile */
    min-height: 52px;         /* Thumb-friendly */
    padding: var(--s-4) var(--s-6);
    font-family: var(--f-body);
    font-size: 1.125rem;      /* 18px — never smaller on CTA */
    font-weight: 700;
    border: none;
    border-radius: var(--r-lg);
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
    text-decoration: none;
    -webkit-tap-highlight-color: transparent; /* no blue flash on iOS */
  }
  .cta-button--primary {
    background: var(--c-primary);
    color: white;
    box-shadow: 0 4px 14px rgba(0,0,0,0.15);
  }
  .cta-button--primary:active {
    transform: scale(0.97);   /* tactile feedback */
  }
  @media (min-width: 768px) {
    .cta-button {
      width: auto;             /* Auto width desktop */
      min-width: 220px;
      min-height: 56px;
    }
  }

  /* Sticky CTA bar — mobile only */
  .sticky-cta-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: white;
    padding: var(--s-3) var(--s-4);
    border-top: 1px solid #e5e7eb;
    box-shadow: 0 -4px 12px rgba(0,0,0,0.08);
    z-index: 100;
    display: flex;
    align-items: center;
    gap: var(--s-3);
    /* Safe area for iPhone notch */
    padding-bottom: calc(var(--s-3) + env(safe-area-inset-bottom, 0px));
  }
  @media (min-width: 768px) {
    .sticky-cta-bar { display: none; }
  }

  /* ==========================================
     IMAGES — lazy + ratio + blur placeholder
     ========================================== */
  .block-image-wrapper {
    position: relative;
    overflow: hidden;
    border-radius: var(--r-lg);
    background: var(--c-surface); /* prevents CLS */
  }
  .block-image-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: opacity 0.3s ease;
  }
  /* Blur-up placeholder */
  .block-image-wrapper::before {
    content: '';
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    filter: blur(20px);
    transform: scale(1.1);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  .block-image-wrapper.loading::before { opacity: 1; }
  .block-image-wrapper.loaded img { opacity: 1; }

  /* ==========================================
     CARDS — bundles, testimonials, FAQ
     ========================================== */
  .block-card {
    background: white;
    border: 2px solid #e5e7eb;
    border-radius: var(--r-xl);
    padding: var(--s-5);
    transition: border-color 0.2s ease;
  }
  .block-card--selected {
    border-color: var(--c-primary);
    box-shadow: 0 0 0 1px var(--c-primary);
  }
  .block-card--popular {
    position: relative;
    border-color: var(--c-primary);
  }
  .block-card--popular::before {
    content: attr(data-badge);
    position: absolute;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--c-primary);
    color: white;
    padding: var(--s-1) var(--s-4);
    border-radius: var(--r-full);
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  /* ==========================================
     CAROUSEL — touch-friendly
     ========================================== */
  .carousel-container {
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;    /* hide scrollbar */
    display: flex;
    gap: var(--s-3);
    padding: var(--s-2);
  }
  .carousel-container::-webkit-scrollbar { display: none; }
  .carousel-slide {
    flex: 0 0 85%;            /* Show next card peeking */
    scroll-snap-align: center;
  }

  /* ==========================================
     FAQ ACCORDION — mobile optimized
     ========================================== */
  .faq-item {
    border-bottom: 1px solid #e5e7eb;
  }
  .faq-question {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--s-5) 0;
    font-weight: 600;
    font-size: 1rem;
    text-align: left;
    background: none;
    border: none;
    cursor: pointer;
    min-height: 52px;          /* Tap target */
    -webkit-tap-highlight-color: transparent;
  }
  .faq-answer {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
    color: var(--c-muted);
    line-height: 1.625;
  }
  .faq-item.open .faq-answer {
    max-height: 500px;
    padding-bottom: var(--s-5);
  }

  /* ==========================================
     COUNTDOWN TIMER — visual impact
     ========================================== */
  .countdown-boxes {
    display: flex;
    gap: var(--s-2);
    justify-content: center;
  }
  .countdown-box {
    background: var(--c-secondary);
    color: white;
    border-radius: var(--r-md);
    padding: var(--s-3);
    min-width: 60px;
    text-align: center;
  }
  .countdown-box__number {
    font-size: 1.5rem;
    font-weight: 900;
    font-variant-numeric: tabular-nums; /* prevents layout shift */
  }
  .countdown-box__label {
    font-size: 0.625rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    opacity: 0.8;
  }

  /* ==========================================
     TRUST BADGES — horizontal scroll on mobile
     ========================================== */
  .trust-badges-row {
    display: flex;
    gap: var(--s-4);
    overflow-x: auto;
    padding: var(--s-3) 0;
    justify-content: center;
    flex-wrap: wrap;
  }
  .trust-badge {
    display: flex;
    align-items: center;
    gap: var(--s-2);
    font-size: 0.75rem;
    color: var(--c-muted);
    white-space: nowrap;
  }

  /* ==========================================
     REVIEWS — star rating + compact cards
     ========================================== */
  .review-card {
    padding: var(--s-4);
    border-radius: var(--r-lg);
    background: var(--c-surface);
  }
  .review-card__rating {
    color: #F59E0B;          /* Gold stars, always */
    font-size: 0.875rem;
    letter-spacing: 2px;
  }
  .review-card__body {
    font-size: 0.9375rem;
    line-height: 1.5;
    margin: var(--s-2) 0;
  }
  .review-card__author {
    font-size: 0.8125rem;
    color: var(--c-muted);
  }

  /* ==========================================
     GUARANTEE — badge visuel
     ========================================== */
  .guarantee-badge {
    display: flex;
    align-items: center;
    gap: var(--s-3);
    padding: var(--s-4);
    background: var(--c-surface);
    border-radius: var(--r-xl);
    border: 2px dashed var(--c-success);
    text-align: center;
  }
  .guarantee-badge__icon {
    font-size: 2rem;
    flex-shrink: 0;
  }

  Les patterns mobile DTC qui font la différence

  ┌───────────────────────────┬─────────────────────────────────────────────────────────────┬──────────────────────────────────────────────────────────┐
  │          Pattern          │                Pourquoi ça marche sur mobile                │                      Implémentation                      │
  ├───────────────────────────┼─────────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────┤
  │ Sticky CTA bar            │ Conversion +15-30% sur mobile. Le CTA est TOUJOURS visible. │ position: fixed; bottom: 0 + env(safe-area-inset-bottom) │
  ├───────────────────────────┼─────────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────┤
  │ Peeking carousel          │ Indique qu'il y a plus de contenu. Scroll naturel au doigt. │ flex: 0 0 85% + scroll-snap                              │
  ├───────────────────────────┼─────────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────┤
  │ Alternating section bg    │ Crée un rythme visuel sans effort de design.                │ :nth-child(even) { background: var(--c-surface) }        │
  ├───────────────────────────┼─────────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────┤
  │ Badge "Most Popular"      │ Ancre sociale. Guide le choix sans forcer.                  │ ::before pseudo-element sur card                         │
  ├───────────────────────────┼─────────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────┤
  │ Blur-up images            │ Zero CLS (Layout Shift). Sentiment de rapidité.             │ LQIP blur(20px) → transition vers image réelle           │
  ├───────────────────────────┼─────────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────┤
  │ Touch feedback            │ Scale down 0.97 sur :active. iOS native feel.               │ transform: scale(0.97) sur boutons                       │
  ├───────────────────────────┼─────────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────┤
  │ Negative opt-out          │ "No thanks, I don't want to save money" = psychologie.      │ Texte du bouton decline dans l'upsell template           │
  ├───────────────────────────┼─────────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────┤
  │ Serif heading + sans body │ Contraste typographique = hiérarchie visuelle pro.          │ 2 font families dans les tokens                          │
  └───────────────────────────┴─────────────────────────────────────────────────────────────┴──────────────────────────────────────────────────────────┘

  ---
  (3) Pipeline Agent ↔ A/B Testing ↔ RAG Marketing Evolution Engine

  Architecture du pipeline complet

  ┌─────────────────────────────────────────────────────────────────────┐
  │                    AGENT COMPOSER PIPELINE                          │
  │                                                                     │
  │  1. RECEIVE BRIEF                                                   │
  │     ┌──────────┐                                                    │
  │     │ Product  │──→ Marketing Angle (DB)                            │
  │     │ Brief    │──→ Audience Data                                    │
  │     │ + Niche  │──→ Winning Patterns (RAG)                          │
  │     └──────────┘                                                    │
  │            │                                                        │
  │            ▼                                                        │
  │  2. RAG CONTEXT INJECTION                                           │
  │     ┌──────────────────────────────────────┐                        │
  │     │ MarketingKnowledgeInjector middleware │                        │
  │     │                                       │                        │
  │     │ Injects into prompt:                  │                        │
  │     │ - Top 5 winning SOPs for this niche   │                        │
  │     │ - Last 3 champion block trees (JSON)  │                        │
  │     │ - Failed patterns to AVOID            │                        │
  │     │ - Heatmap data from similar funnels   │                        │
  │     │ - Palette recommendation by category  │                        │
  │     └──────────────────────────────────────┘                        │
  │            │                                                        │
  │            ▼                                                        │
  │  3. COMPOSE (LLM call)                                              │
  │     System prompt = BLOCK_COMPOSER_SYSTEM_PROMPT                    │
  │     + RAG context                                                   │
  │     + Page composition rules                                        │
  │     + Design tokens reference                                       │
  │     Output: Block tree JSON                                         │
  │            │                                                        │
  │            ▼                                                        │
  │  4. VALIDATE (automated pipeline)                                   │
  │     ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
  │     │ Schema valid │  │ Mobile check │  │ A11y check   │           │
  │     │ (JSON Schema)│  │ (tap targets,│  │ (contrast,   │           │
  │     │              │  │  overflow)   │  │  alt text)   │           │
  │     └──────────────┘  └──────────────┘  └──────────────┘           │
  │            │                                                        │
  │            ▼                                                        │
  │  5. RENDER → Static HTML → Upload R2 → Deploy via Nginx            │
  │            │                                                        │
  │            ▼                                                        │
  │  6. ENTER A/B TESTING STATE MACHINE                                 │
  │     Sandbox → Elagage → Commando → Duel → Champion                 │
  │            │                                                        │
  │            ▼                                                        │
  │  7. CHAMPION FOUND → FEEDBACK LOOP                                  │
  │     ┌──────────────────────────────────────┐                        │
  │     │ Marketing Evolution Engine (Council)  │                        │
  │     │                                       │                        │
  │     │ Champion block tree → analyzed        │                        │
  │     │ Winning patterns → codified as SOP    │                        │
  │     │ Failed variants → anti-patterns logged│                        │
  │     │ Heatmap data → element-level insights │                        │
  │     │                                       │                        │
  │     │ Output: New MD file in Agent-Intel/   │                        │
  │     │         Updated token recommendations  │                        │
  │     │         Updated composition rules      │                        │
  │     └──────────────────────────────────────┘                        │
  │            │                                                        │
  │            └────→ RAG context for NEXT agent generation              │
  └─────────────────────────────────────────────────────────────────────┘

  Le point clé : comment les winning patterns remontent

  // src/services/marketing-evolution.ts
  // WHY: C'est la boucle de feedback qui rend le système autonome.
  // Sans ça, chaque agent repart de zéro. Avec ça, chaque champion
  // enrichit la base de connaissances pour les générations futures.

  interface WinningPattern {
    // Qu'est-ce qui a gagné
    blockType: string
    pageType: StepType
    category: string       // 'supplements' | 'skincare' | 'beauty' | 'pet'

    // Le pattern précis
    pattern: {
      headlineStyle: string      // "pain-point + timeframe"
      ctaText: string            // "Get Relief Now →"
      bundleLayout: string       // "cards" vs "rows"
      selectedPalette: PaletteKey
      blockOrder: string[]       // l'ordre exact des blocs
      headlineLength: number
      numberOfReviews: number
      hasStickyCta: boolean
      countdownStyle: string
    }

    // La preuve
    evidence: {
      cvr: number
      aov: number
      aovXCvr: number
      visitors: number
      confidenceInterval: { lower: number; upper: number }
      testPhases: string[]       // sandbox, elagage, commando, duel
      eliminationReasons: string[] // pourquoi les autres ont perdu
    }

    // Date pour decay
    crownedAt: string
    niche: string
  }

  async function codifyChampionAsSOP(
    testId: string,
    winnerVariantId: string
  ): Promise<string> {
    // 1. Extraire le block tree du champion
    const winner = await db.select().from(pageVariants)
      .where(eq(pageVariants.id, winnerVariantId))
    const blockTree: Block[] = winner[0].page.blocks

    // 2. Extraire les patterns spécifiques
    const pattern = extractPatterns(blockTree)

    // 3. Analyser pourquoi les autres ont perdu
    const losers = await getEliminatedVariants(testId)
    const failurePatterns = losers.map(l => ({
      eliminatedReason: l.eliminatedReason,
      differentBlocks: diffBlockTrees(blockTree, l.page.blocks),
    }))

    // 4. Rédiger le SOP (LLM call avec Council)
    const sopMarkdown = await councilDebate({
      question: `A new champion was found for ${pattern.category}/${pattern.pageType}.

      Champion pattern: ${JSON.stringify(pattern, null, 2)}

      Losers failed because: ${JSON.stringify(failurePatterns, null, 2)}

      Write a concise SOP that future agents can follow. Include:
      1. What specific design choices won (and why)
      2. What choices lost (and why)
      3. Specific block order recommendation
      4. Palette recommendation for this category
      5. Mobile-specific patterns that drove conversion

      Format: Markdown, under 500 words.`,
    })

    // 5. Persister
    const filename = `sop-${pattern.category}-${pattern.pageType}-${Date.now()}.md`
    const filepath = path.join('Agent-Intelligence', 'Auto-Generated', filename)
    fs.writeFileSync(filepath, sopMarkdown)

    // 6. Indexer pour RAG
    await indexForRAG(filepath, {
      category: pattern.category,
      pageType: pattern.pageType,
      niche: pattern.niche,
      cvr: pattern.evidence.cvr,
    })

    return filepath
  }

  ---
  (4) Validation Automatisée & Guardrails

  Pipeline de validation (avant render HTML)

  // src/validation/block-tree-validator.ts
  // WHY: Un agent peut produire un block tree valide JSON mais
  // visuellement cassé sur mobile. Cette pipeline attrape tout.

  import Ajv from 'ajv'

  // ============================================
  // 1. SCHEMA VALIDATION (structurel)
  // ============================================
  export function validateSchema(blockTree: Block[]): ValidationResult {
    const ajv = new Ajv({ strict: true })
    const errors: ValidationError[] = []

    for (const block of blockTree) {
      // Vérifier que le type existe dans le registry
      const blockDef = registry.getDefinition(block.type)
      if (!blockDef) {
        errors.push({ blockId: block.id, error: `Unknown block type: ${block.type}` })
        continue
      }

      // Valider les props contre le JSON Schema du block
      const valid = ajv.validate(blockDef.propsSchema, block.props)
      if (!valid) {
        errors.push({
          blockId: block.id,
          error: `Props validation failed: ${ajv.errorsText()}`
        })
      }

      // Valider les styles (token values only)
      validateStyles(block, errors)

      // Récursion sur les enfants
      if (block.children) {
        const childResult = validateSchema(block.children)
        errors.push(...childResult.errors)
      }
    }

    return { valid: errors.length === 0, errors }
  }

  // ============================================
  // 2. MOBILE LAYOUT CONSTRAINTS
  // ============================================
  interface MobileConstraints {
    minTapTarget: number        // 44px (Apple HIG) → we use 48px
    maxTextWidth: number        // 65ch for readability
    minBodyFontSize: number     // 16px
    minCtaHeight: number        // 52px
    maxHeadlineChars: number    // depends on page type
    maxSectionPadding: string   // prevent over-padding
    allowedFontFamilies: string[]
    allowedSpacingValues: string[]
    allowedColorValues: string[] // from palette tokens
  }

  const MOBILE_CONSTRAINTS: MobileConstraints = {
    minTapTarget: 48,
    maxTextWidth: 65, // characters
    minBodyFontSize: 16,
    minCtaHeight: 52,
    maxHeadlineChars: 80,
    maxSectionPadding: '64px',
    allowedFontFamilies: [
      "'DM Serif Display', Georgia, serif",
      "'Inter', -apple-system, sans-serif",
    ],
    allowedSpacingValues: Object.values(DESIGN_TOKENS.spacing),
    allowedColorValues: Object.values(DESIGN_TOKENS.palettes).flatMap(p => Object.values(p)),
  }

  export function validateMobileConstraints(
    blockTree: Block[],
    pageType: StepType
  ): ValidationResult {
    const errors: ValidationError[] = []
    const rules = PAGE_COMPOSITION_RULES[pageType]

    for (const block of blockTree) {
      const styles = block.styles.mobile ?? block.styles

      // Check: tap targets minimum 48px (buttons, links)
      if (['button', 'add-to-cart', 'faq', 'quiz-step'].includes(block.type)) {
        const height = parsePx(styles.minHeight ?? styles.height)
        if (height && height < MOBILE_CONSTRAINTS.minTapTarget) {
          errors.push({
            blockId: block.id,
            error: `Tap target too small: ${height}px (min: ${MOBILE_CONSTRAINTS.minTapTarget}px)`,
            severity: 'error',
          })
        }
      }

      // Check: CTA height
      if (block.type === 'button' || block.type === 'add-to-cart') {
        const h = parsePx(styles.minHeight ?? '52px')
        if (h < MOBILE_CONSTRAINTS.minCtaHeight) {
          errors.push({
            blockId: block.id,
            error: `CTA height ${h}px < minimum ${MOBILE_CONSTRAINTS.minCtaHeight}px`,
            severity: 'error',
          })
        }
      }

      // Check: body font size minimum
      if (block.type === 'text' || block.type === 'heading') {
        const fontSize = parsePx(styles.fontSize ?? '16px')
        if (fontSize < MOBILE_CONSTRAINTS.minBodyFontSize) {
          errors.push({
            blockId: block.id,
            error: `Font size ${fontSize}px too small (min: ${MOBILE_CONSTRAINTS.minBodyFontSize}px)`,
            severity: 'warning',
          })
        }
      }

      // Check: headline length
      if (block.type === 'hero' && block.props.headline) {
        if (block.props.headline.length > rules.headlineMaxChars) {
          errors.push({
            blockId: block.id,
            error: `Headline ${block.props.headline.length} chars > max ${rules.headlineMaxChars}`,
            severity: 'warning',
          })
        }
      }

      // Check: color values are from tokens
      for (const [prop, value] of Object.entries(styles)) {
        if (prop.includes('color') || prop.includes('Color') || prop === 'background') {
          if (value && !isTokenColor(value) && !isCssVariable(value)) {
            errors.push({
              blockId: block.id,
              error: `Non-token color "${value}" in ${prop}. Use palette tokens only.`,
              severity: 'warning',
            })
          }
        }
      }
    }

    return { valid: errors.filter(e => e.severity === 'error').length === 0, errors }
  }

  // ============================================
  // 3. COMPOSITION RULES
  // ============================================
  export function validateComposition(
    blockTree: Block[],
    pageType: StepType
  ): ValidationResult {
    const errors: ValidationError[] = []
    const rules = PAGE_COMPOSITION_RULES[pageType]
    const blockTypes = flattenBlockTypes(blockTree)

    // Check: required blocks present
    for (const required of rules.requiredBlocks) {
      if (!blockTypes.includes(required)) {
        errors.push({
          blockId: 'page',
          error: `Required block "${required}" missing for page type "${pageType}"`,
          severity: 'error',
        })
      }
    }

    // Check: forbidden blocks not present
    for (const forbidden of rules.forbiddenBlocks) {
      if (blockTypes.includes(forbidden)) {
        errors.push({
          blockId: 'page',
          error: `Forbidden block "${forbidden}" found for page type "${pageType}"`,
          severity: 'error',
        })
      }
    }

    // Check: max blocks
    if (blockTypes.length > rules.maxBlocks) {
      errors.push({
        blockId: 'page',
        error: `${blockTypes.length} blocks > max ${rules.maxBlocks} for "${pageType}"`,
        severity: 'warning',
      })
    }

    // Check: required sequence order
    const sequenceIndices = rules.requiredSequence.map(type => blockTypes.indexOf(type))
    for (let i = 1; i < sequenceIndices.length; i++) {
      if (sequenceIndices[i] !== -1 && sequenceIndices[i] < sequenceIndices[i-1]) {
        errors.push({
          blockId: 'page',
          error: `Block "${rules.requiredSequence[i]}" appears before "${rules.requiredSequence[i-1]}" — violates required sequence`,
          severity: 'warning',
        })
      }
    }

    return { valid: errors.filter(e => e.severity === 'error').length === 0, errors }
  }

  // ============================================
  // 4. ACCESSIBILITY CHECKS
  // ============================================
  export function validateAccessibility(blockTree: Block[]): ValidationResult {
    const errors: ValidationError[] = []

    for (const block of blockTree) {
      // Images need alt text
      if (block.props.image && !block.props.image.alt) {
        errors.push({ blockId: block.id, error: 'Image missing alt text', severity: 'warning' })
      }

      // Buttons need accessible text
      if (['button', 'add-to-cart'].includes(block.type)) {
        const text = block.props.buttonText ?? block.props.cta?.text
        if (!text) {
          errors.push({ blockId: block.id, error: 'Button missing text', severity: 'error' })
        }
      }

      // Color contrast check (simplified)
      if (block.styles.mobile) {
        const { color, background } = block.styles.mobile
        if (color && background) {
          const ratio = getContrastRatio(color, background)
          if (ratio < 4.5) { // WCAG AA
            errors.push({
              blockId: block.id,
              error: `Contrast ratio ${ratio.toFixed(2)} < 4.5 (WCAG AA)`,
              severity: 'warning',
            })
          }
        }
      }
    }

    return { valid: errors.filter(e => e.severity === 'error').length === 0, errors }
  }

  // ============================================
  // 5. PERFORMANCE BUDGETS (pre-render)
  // ============================================
  export function validatePerformanceBudgets(page: Page): ValidationResult {
    const errors: ValidationError[] = []

    // Count images
    const images = countBlocksByType(page.blocks, 'image')
    const carousels = countBlocksByType(page.blocks, 'product-carousel')
    const totalImages = images + carousels * 8 // estimate 8 per carousel

    if (totalImages > 20) {
      errors.push({
        blockId: 'page',
        error: `${totalImages} images > budget of 20 (mobile performance)`,
        severity: 'warning',
      })
    }

    // Check custom JS size
    const customJsSize = new TextEncoder().encode(page.meta.customHead ?? '').length
    if (customJsSize > 5000) {
      errors.push({
        blockId: 'page',
        error: `Custom JS ${(customJsSize / 1024).toFixed(1)}KB > 5KB budget`,
        severity: 'warning',
      })
    }

    // Max Google Fonts
    const fontLinks = (page.meta.customHead ?? '').match(/fonts\.googleapis/g) ?? []
    if (fontLinks.length > 2) {
      errors.push({
        blockId: 'page',
        error: `${fontLinks.length} Google Font requests > max 2`,
        severity: 'warning',
      })
    }

    return { valid: errors.filter(e => e.severity === 'error').length === 0, errors }
  }

  // ============================================
  // PIPELINE ORCHESTRATOR
  // ============================================
  export async function validateBlockTree(
    blockTree: Block[],
    pageType: StepType,
    page: Page,
  ): Promise<{
    valid: boolean
    errors: ValidationError[]
    warnings: ValidationError[]
    score: number  // 0-100 quality score
  }> {
    const results = await Promise.all([
      validateSchema(blockTree),
      validateMobileConstraints(blockTree, pageType),
      validateComposition(blockTree, pageType),
      validateAccessibility(blockTree),
      validatePerformanceBudgets(page),
    ])

    const allErrors = results.flatMap(r => r.errors)
    const errors = allErrors.filter(e => e.severity === 'error' || !e.severity)
    const warnings = allErrors.filter(e => e.severity === 'warning')

    // Quality score: start at 100, -10 per error, -3 per warning
    const score = Math.max(0, 100 - (errors.length * 10) - (warnings.length * 3))

    return { valid: errors.length === 0, errors, warnings, score }
  }

  Comment l'agent reçoit les erreurs et itère

  // src/agents/composer.ts
  // WHY: L'agent ne fait pas que générer — il corrige automatiquement
  // jusqu'à ce que le block tree passe la validation.

  export async function composePage(params: {
    pageType: StepType
    productBrief: ProductBrief
    marketingAngle: MarketingAngle
    ragContext: string
    maxRetries: number  // default: 3
  }): Promise<{ blockTree: Block[]; validationScore: number }> {

    let attempt = 0
    let lastErrors: ValidationError[] = []

    while (attempt < params.maxRetries) {
      attempt++

      const prompt = buildComposerPrompt({
        pageType: params.pageType,
        ragContext: params.ragContext,
        marketingAngle: params.marketingAngle,
        previousErrors: attempt > 1 ? lastErrors : undefined,
      })

      const blockTree = await llm.generate(prompt)

      const validation = await validateBlockTree(
        blockTree, params.pageType, page
      )

      if (validation.valid) {
        return { blockTree, validationScore: validation.score }
      }

      lastErrors = validation.errors
    }

    throw new Error(`Failed to generate valid block tree after ${attempt} attempts`)
  }

  ---
  Résumé : l'architecture en 5 principes

  ┌─────┬──────────────────────────────────────┬────────────────────────────────────────────────────────────────────────────────────────────────────────┐
  │  #  │               Principe               │                                                Comment                                                 │
  ├─────┼──────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ 1   │ L'agent ne designe pas — il compose  │ Le CSS fait 90% du visuel. L'agent choisit des blocs et du contenu dans un cadre strict.               │
  ├─────┼──────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ 2   │ Les tokens sont une prison           │ Palette, spacing, typography — l'agent ne peut utiliser QUE les valeurs prédéfinies. Toute autre       │
  │     │ bienveillante                        │ valeur = rejetée.                                                                                      │
  ├─────┼──────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ 3   │ Chaque type de page a ses règles     │ Un checkout n'est pas un advertorial. Required blocks, forbidden blocks, max blocks, headline limits — │
  │     │                                      │  tout est codifié.                                                                                     │
  ├─────┼──────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ 4   │ Validation avant render, pas après   │ Schema + mobile + composition + a11y + performance — 5 passes de validation. Score < 70 = auto-retry   │
  │     │                                      │ avec feedback d'erreurs.                                                                               │
  ├─────┼──────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ 5   │ Les champions nourrissent les futurs │ RAG injection des winning patterns. Council Debate codifie les SOPs. Chaque génération est meilleure   │
  │     │  agents                              │ que la précédente.                                                                                     │
  └─────┴──────────────────────────────────────┴────────────────────────────────────────────────────────────────────────────────────────────────────────┘

  L'architecture de ton Architecture Finale est solide. Ce qui manquait, c'est cette couche de contraintes de design entre le LLM et le block tree. Sans
  elle, l'agent a trop de liberté et produit du "fonctionnel mais moche". Avec elle, N'IMPORTE QUELLE composition de blocs est visuellement cohérente sur
  mobile.