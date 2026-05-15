# Funnel Builder Agent-First — Architecture Finale

> Version ultime compilée depuis 6 réponses d'IA. Stack: Hono.js · Drizzle ORM · PostgreSQL 16 · BullMQ · Redis 7 · Stripe · Cloudflare R2

---

## 1. Types TypeScript

### 1.1 Base

```typescript
type Device = 'mobile' | 'tablet' | 'desktop'

type Responsive<T> = { mobile: T; tablet?: T; desktop?: T }

type DeviceVisibility = { mobile: boolean; tablet: boolean; desktop: boolean }

type ResponsiveStyles = Responsive<Record<string, string>>

// Media asset with lazy loading support
interface MediaAsset {
  url: string
  alt: string
  width?: number
  height?: number
  blurDataUrl?: string           // LQIP placeholder for lazy loading
}

// Action générique pour tout élément cliquable
type BlockAction =
  | { type: 'link'; url: string; newTab?: boolean }
  | { type: 'navigate_step'; stepSlug: string }
  | { type: 'navigate_funnel'; funnelSlug: string; stepSlug?: string }  // cross-funnel navigation
  | { type: 'submit_form'; formId: string }
  | { type: 'open_popup'; popupId: string }
  | { type: 'stripe_checkout'; priceId: string; mode: 'payment' | 'subscription' }
  | { type: 'checkout'; productId?: string; bundleId?: string }  // server-side cart resolution
  | { type: 'scroll'; target: string }
```

### 1.2 Block

```typescript
type BlockType =
  // Basic
  | 'hero' | 'text' | 'heading' | 'button' | 'image' | 'image-link' | 'video'
  | 'section' | 'divider' | 'spacer' | 'custom-html'
  // Commerce
  | 'product-carousel' | 'product-info' | 'order-summary' | 'payment-form'
  | 'bundle-offers' | 'pricing-display' | 'countdown' | 'add-to-cart'
  // Social Proof
  | 'reviews' | 'testimonial' | 'trust-badges' | 'customer-count'
  | 'as-seen-in' | 'expert-endorsement' | 'ugc-gallery'
  // Content
  | 'faq' | 'comparison-chart' | 'reasons-why' | 'size-guide'
  | 'guarantee' | 'benefits-list'
  // Forms
  | 'form' | 'input-field' | 'quiz-step'
  // Custom (agents can register new types)
  | string

interface Block<T = Record<string, unknown>> {
  id: string                    // nanoid
  type: BlockType
  props: T
  styles: ResponsiveStyles
  visibility: DeviceVisibility
  children?: Block[]            // composability (section, container)
  locked?: boolean
  analyticsId?: string          // for block-level tracking
  metadata?: {
    marketingAngle?: string
    abTestId?: string
    cro?: { priority: 'critical' | 'high' | 'medium' | 'low'; note?: string }
  }
}
```

### 1.3 Block Props (tous les types)

```typescript
// --- HERO ---
interface HeroProps {
  variant: 'split-left' | 'split-right' | 'centered' | 'full-width-image' | 'video'
  image?: { src: string; alt: string }
  video?: { src: string; poster?: string; autoplay?: boolean }
  overlayText?: string          // reprend angle marketing
  headline: string              // PROMESSE (pas nom produit)
  subheadline?: string
  cta?: {
    text: string
    action: BlockAction
    variant: 'primary' | 'secondary' | 'outline'
  }
  socialProof?: {
    count?: number              // "10,000+"
    rating?: number             // 4.8
    reviewCount?: number
  }
  badges?: Array<{ text: string; icon?: string }>  // "Free Shipping", "60-Day Guarantee"
  urgency?: { type: 'countdown' | 'stock' | 'limited-offer'; value?: string }
}

// --- PRODUCT CAROUSEL ---
interface ProductCarouselProps {
  images: Array<{
    src: string; alt: string; type: 'hero' | 'in-use' | 'closeup' | 'lifestyle' | 'before-after'
  }>                            // min 5, max 10
  layout: 'thumbnails-left' | 'thumbnails-bottom' | 'slider'
  autoplay?: boolean
  showFullscreen?: boolean
}

// --- BUNDLE OFFERS ---
interface BundleOffer {
  id: string
  title: string                 // "Perfect for 1-bedroom" — PAS "Buy 2"
  quantity: number
  pricePerUnit: number
  totalPrice: number
  compareAtPrice?: number       // crossed out
  savings?: string              // "Save 30%"
  badge?: 'most-popular' | 'best-value' | 'recommended' | null
  stripePriceId: string
}

interface BundleOffersProps {
  title: string
  bundles: BundleOffer[]
  layout: 'cards' | 'rows' | 'toggle'
  defaultSelected?: string
  shippingNote?: string
}

// --- REVIEWS (VISIBLES EN HAUT) ---
interface ReviewItem {
  author: string
  location?: string
  rating: 1 | 2 | 3 | 4 | 5   // inclure 1-2 étoiles pour crédibilité
  title?: string
  body: string
  date?: string
  avatar?: string
  images?: string[]
  verified?: boolean
}

interface ReviewsProps {
  layout: 'carousel' | 'grid' | 'masonry'
  showRating: boolean
  showOneAndTwoStars: boolean   // forcé à true pour crédibilité
  reviews: ReviewItem[]
  overallRating: number
  totalReviews: number
}

// --- FAQ ---
interface FAQProps {
  layout: 'accordion' | 'list' | 'tabs'
  questions: Array<{
    question: string; answer: string; openByDefault?: boolean
  }>                            // minimum 5-10
}

// --- COUNTDOWN ---
interface CountdownProps {
  endDate?: string              // ISO ou null pour evergreen
  durationMinutes?: number      // evergreen timer
  label?: string
  style: 'flip' | 'digital' | 'simple'
  onExpire: 'hide' | 'reset' | 'redirect'
  redirectUrl?: string
}

// --- PRICING DISPLAY ---
interface PricingDisplayProps {
  price: number
  compareAtPrice?: number
  currency: string
  displayMode: 'price-only' | 'compare' | 'per-day' | 'per-month' | 'installment'
  // 'compare' = show compareAtPrice crossed out
  // 'per-day' = show daily cost
  // 'per-month' = show monthly cost
  // 'installment' = show installment text
  subscriptionInterval?: 'day' | 'week' | 'month' | 'year'
  savingsText?: string          // "Save 47%"
  installmentText?: string      // "or 4x $12.50"
}

// --- ADD TO CART ---
interface AddToCartProps {
  buttonText: string
  buttonVariant: 'primary' | 'secondary'
  behavior: 'redirect-cart' | 'slide-cart' | 'direct-checkout' | 'custom'
  showQuantity?: boolean
  variantSelector?: Array<{ name: string; options: string[] }>
}

// --- COMPARISON CHART ---
interface ComparisonChartProps {
  ourLabel: string
  competitorLabel: string
  rows: Array<{ feature: string; ours: boolean | string; competitor: boolean | string }>
}

// --- GUARANTEE ---
interface GuaranteeProps {
  type: 'money-back' | 'warranty' | 'satisfaction' | 'double'
  duration: string              // "30 days"
  title: string
  description: string
  icon?: string
  badgeImage?: string
}

// --- TRUST BADGES ---
interface TrustBadgesProps {
  badges: Array<{ text: string; icon?: string; image?: string }>
  layout: 'row' | 'grid'
}

// --- TESTIMONIAL ---
interface TestimonialProps {
  variant: 'card' | 'quote' | 'video' | 'ugc'
  author: string
  role?: string
  quote: string
  avatar?: string
  video?: { src: string; thumbnail: string }
  rating?: number
  beforeAfter?: { before: string; after: string }
}

// --- PAYMENT FORM ---
interface PaymentFormProps {
  provider: 'stripe'
  collectShipping: boolean
  collectBilling: boolean
  showOrderSummary: boolean
  expressCheckout?: Array<'apple-pay' | 'google-pay' | 'link'>
  submitLabel: string
  guaranteeText?: string
}

// --- ORDER SUMMARY ---
interface OrderSummaryProps {
  items: Array<{ title: string; quantity: number; price: number; image?: string }>
  subtotal: number
  shipping: number | 'free' | 'calculated'
  tax?: number
  discount?: { code: string; amount: number }
  total: number
  freeShippingThreshold?: number
  currentCartValue?: number
}

// --- QUIZ STEP ---
interface QuizStepProps {
  question: string
  subtitle?: string
  options: Array<{ label: string; value: string; image?: string; leadsTo?: string }>
  progress?: number
  multiSelect?: boolean
}

// --- SECTION (composable) ---
interface SectionProps {
  maxWidth?: string
  padding?: string
  background?: string
  fullBleed?: boolean
}
```

### 1.4 Page

```typescript
interface PageGlobalStyles {
  backgroundColor: string
  fontFamily: string
  maxWidth: string             // '768px' | '1024px' | '1280px'
  primaryColor: string
  secondaryColor: string
  accentColor: string
  textColor: string
  borderRadius?: string
}

interface PageMeta {
  title: string
  description: string
  favicon?: string
  ogImage?: string
  customHead?: string
}

interface Page {
  id: string
  globalStyles: PageGlobalStyles
  meta: PageMeta
  blocks: Block[]
  tracking: {
    pixelIds?: string[]
    gaId?: string
    customEvents?: Record<string, string>
  }
}
```

### 1.5 Funnel

```typescript
type StepType =
  | 'optin' | 'checkout' | 'thank-you' | 'upsell' | 'downsell'
  | 'advertorial' | 'vsl' | 'quiz' | 'product-page' | 'bridge'

type FunnelStatus = 'draft' | 'active' | 'paused' | 'archived'

interface MarketingAngle {
  id: string
  name: string                 // "knee-pain-seniors"
  headline: string
  subheadline: string
  painPoint: string
  solution: string
  ctaText: string
  benefits: string[]
  offerName: string
  bonuses?: string[]
  guarantee: string
  testimonialFocus?: string
  imageStyle?: string
}

interface FunnelStep {
  id: string
  type: StepType
  name: string
  slug: string
  order: number
  variants: PageVariant[]
  activeVariantId: string
  nextStepId?: string
  abTestConfig?: ABTestConfig
}

interface PageVariant {
  id: string
  name: string                 // "Control", "V2 - urgency headline"
  page: Page
  angle?: string
  hypothesis?: string
  changedBlocks?: string[]
  status: 'draft' | 'active' | 'paused' | 'winner' | 'loser'
  trafficWeight: number
  isControl: boolean
  isWinner?: boolean
  testVariable?: {
    name: string                // "headline" | "cta-color" | "price"
    value: string
    baseline: string
  }
}

interface ABTestConfig {
  id: string
  status: 'draft' | 'running' | 'paused' | 'completed'
  startedAt?: string
  endedAt?: string
  winnerVariantId?: string
  minSampleSize: number
  confidenceThreshold: number  // 0.95
  primaryMetric: 'cvr' | 'aov' | 'aov_cvr' | 'add_to_cart_rate'
  autoPromote: boolean
}

interface Funnel {
  id: string
  name: string
  slug: string
  domain?: string
  subdomain?: string
  steps: FunnelStep[]
  productId: string              // FK → products table (séparé, pas JSON inline)
  marketingAngles: MarketingAngle[]
  status: FunnelStatus
  createdAt: string
  updatedAt: string
}

// WHY Products/Bundles/Purchases séparés : un produit peut être dans N funnels,
// un bundle contient M produits, les orders doivent être queryables indépendamment
interface Product {
  id: string
  name: string
  description?: string
  images: string[]
  price: number
  compareAtPrice?: number
  currency: string
  stripeProductId?: string
  stripePriceId?: string
  isActive: boolean
  metadata?: Record<string, unknown>
}

interface Bundle {
  id: string
  funnelId?: string              // nullable = bundle global
  name: string                   // "Perfect for 1-bedroom"
  description?: string
  products: Array<{ productId: string; quantity: number }>
  price: number
  compareAtPrice?: number
  isPopular?: boolean
  isOptimal?: boolean            // "Best Value" badge
  isActive: boolean
}

interface Purchase {
  id: string
  funnelId: string
  variantId?: string
  sessionId: string
  customerEmail: string
  customerName?: string
  items: Array<{ productId: string; bundleId?: string; name: string; quantity: number; price: number }>
  subtotal: number
  shipping: number
  tax: number
  total: number
  currency: string
  stripePaymentIntentId?: string
  status: 'pending' | 'paid' | 'refunded' | 'disputed'
}
```

### 1.6 Template

```typescript
interface TemplatePlaceholder {
  key: string                   // "HEADLINE"
  description: string
  required: boolean
  mapFromAngle?: keyof MarketingAngle
  example: string
}

interface Template {
  id: string
  slug: string
  name: string
  type: StepType
  description: string
  blocks: Block[]               // contient {{PLACEHOLDER}} dans les props
  placeholders: TemplatePlaceholder[]
  globalStyles: Partial<PageGlobalStyles>
  usageCount?: number
}

// === ANALYTICS & EVENTS ===
interface AnalyticsEvent {
  event_id: string;
  event_type: 'page_view' | 'click' | 'purchase' | 'add_to_cart';
  event_time: number;
  session_id: string;
  user_id?: string;
  page: { url: string; variant_id: string; funnel_id: string };
  device: { type: 'mobile' | 'desktop' | 'tablet' };
  custom_data?: Record<string, unknown>;
}

// === HEATMAP ===
interface HeatmapDataPoint {
  variant_id: string;
  element_bid: string;
  element_type: string;
  position: { x: number; y: number; width: number; height: number };
  clicks: number;
  sessions: number;
  revenue_generated: number;
  conversions: number;
  date: string;
}

// === ATTRIBUTION ===
interface Touchpoint {
  id: string;
  session_id: string;
  user_hash: string;
  channel: string;
  event_type: string;
  timestamp: number;
  cost?: number;
}
interface AttributionResult {
  purchase_id: string;
  revenue: number;
  attribution_model: string;
  touchpoints: Array<{ touchpoint_id: string; weight: number; revenue_attributed: number; channel: string }>;
}

// === SURVEYS ===
interface Survey {
  id: string;
  shop_id: string;
  name: string;
  trigger: 'qr_packaging' | 'email_post_purchase';
  questions: Array<{ id: string; type: string; text: string }>;
}
interface SurveyResponse {
  id: string;
  survey_id: string;
  customer_hash: string;
  answers: Record<string, string | number>;
  sentiment_score?: number;
  keywords: string[];
}

// === RESEARCH ENGINE (Prompt 5) ===
interface NicheCandidate {
  id: string;
  name: string;
  slug: string;
  category: string;
  scores: NicheScores;
  status: 'researching' | 'scored' | 'validating' | 'winner' | 'rejected' | 'product_created';
}
interface NicheScores {
  volume_score: number;
  pain_intensity_score: number;
  market_gap_score: number;
  trend_score: number;
  accessibility_score: number;
  weighted_total: number;
}
interface DiscoveredAngle {
  id: string;
  niche_id: string;
  avatar: string;
  pain_point: string;
  desire: string;
  emotion: string;
  promise: string;
  hooks: string[];
  confidence_score: number;
}
interface ResearchConsensus {
  niche_id: string;
  ai_models_used: string[];
  final_score: number;
  methodology_notes: string;
}
```

---

## 2. Schéma DB (Drizzle ORM + PostgreSQL 16)

```typescript
import {
  pgTable, uuid, text, jsonb, integer, numeric,
  boolean, timestamp, index, uniqueIndex, pgEnum
} from 'drizzle-orm/pg-core'

// === ENUMS ===
const stepTypeEnum = pgEnum('step_type', [
  'optin', 'checkout', 'thank-you', 'upsell', 'downsell',
  'advertorial', 'vsl', 'quiz', 'product-page', 'bridge'
])
const funnelStatusEnum = pgEnum('funnel_status', ['draft', 'active', 'paused', 'archived'])
const abTestStatusEnum = pgEnum('ab_test_status', ['draft', 'running', 'paused', 'completed'])
const eventTypeEnum = pgEnum('event_type', [
  'PageView', 'ViewContent', 'AddToCart', 'InitiateCheckout', 'Purchase',
  'click', 'scroll', 'form_submit'
])

// === FUNNELS ===
export const funnels = pgTable('funnels', {
  id:        uuid('id').defaultRandom().primaryKey(),
  name:      text('name').notNull(),
  slug:      text('slug').notNull().unique(),
  domain:    text('domain'),
  subdomain: text('subdomain'),
  status:    funnelStatusEnum('status').default('draft'),
  productId: uuid('product_id').references(() => products.id),   // FK → products table

  // === RESEARCH MODE ===
  // WHY: Research-before-Product approach. Test angles cheap BEFORE creating products.
  // Phase 0: Ad only (just CTR/CPC), Phase 1: Ad + Landing, Phase 2: Full Funnel with checkout.
  // When researchMode is true, the funnel uses simplified templates and lower tracking requirements.
  researchMode:     boolean('research_mode').default(false),
  researchPhase:    text('research_phase').$type<'phase0_ad_only'|'phase1_landing'|'phase2_full_funnel'>(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// === MARKETING ANGLES ===
export const marketingAngles = pgTable('marketing_angles', {
  id:          uuid('id').defaultRandom().primaryKey(),
  funnelId:    uuid('funnel_id').references(() => funnels.id, { onDelete: 'cascade' }),
  name:        text('name').notNull(),
  headline:    text('headline').notNull(),
  subheadline: text('subheadline'),
  painPoint:   text('pain_point'),
  solution:    text('solution'),
  ctaText:     text('cta_text'),
  benefits:    jsonb('benefits').$type<string[]>().default([]),
  guarantee:   text('guarantee'),
  extras:      jsonb('extras').default({}),
  createdAt:   timestamp('created_at').defaultNow().notNull(),
}, t => [index('angles_funnel_idx').on(t.funnelId)])

// === FUNNEL STEPS ===
export const funnelSteps = pgTable('funnel_steps', {
  id:              uuid('id').defaultRandom().primaryKey(),
  funnelId:        uuid('funnel_id').references(() => funnels.id, { onDelete: 'cascade' }).notNull(),
  type:            stepTypeEnum('type').notNull(),
  name:            text('name').notNull(),
  slug:            text('slug').notNull(),
  sortOrder:       integer('sort_order').notNull(),
  activeVariantId: uuid('active_variant_id'),
  nextStepId:      uuid('next_step_id'),
  createdAt:       timestamp('created_at').defaultNow().notNull(),
}, t => [
  index('steps_funnel_idx').on(t.funnelId),
  uniqueIndex('steps_funnel_slug').on(t.funnelId, t.slug),
])

// === PAGE VARIANTS ===
export const pageVariants = pgTable('page_variants', {
  id:               uuid('id').defaultRandom().primaryKey(),
  stepId:           uuid('step_id').references(() => funnelSteps.id, { onDelete: 'cascade' }).notNull(),
  name:             text('name').notNull(),
  angle:            text('angle'),
  hypothesis:       text('hypothesis'),
  status:           text('status').$type<'draft'|'active'|'paused'|'winner'|'loser'>().default('draft'),
  trafficWeight:    integer('traffic_weight').default(50),
  isControl:        boolean('is_control').default(false),
  isWinner:         boolean('is_winner').default(false),
  page:             jsonb('page').$type<Page>().notNull(),
  changedBlocks:    jsonb('changed_blocks').$type<string[]>().default([]),
  testVariable:     jsonb('test_variable').$type<{ name: string; value: string; baseline: string }>(),
  r2Key:            text('r2_key'),
  deployedUrl:      text('deployed_url'),
  createdAt:        timestamp('created_at').defaultNow().notNull(),
  updatedAt:        timestamp('updated_at').defaultNow().notNull(),
}, t => [index('variants_step_idx').on(t.stepId)])

// === A/B TEST PHASES ===
// WHY state machine: chaque phase a des règles d'élimination différentes
// SANDBOX = isolé, ÉLAGAGE = coupe brute, COMMANDO = top 2, DUEL = 1v1
const testPhaseEnum = pgEnum('test_phase', [
  'sandbox', 'elagage', 'commando', 'duel', 'champion'
])

// === HYPOTHESES ===
// WHY: chaque test part d'une hypothèse avec scoring Impact×Confidence
export const hypotheses = pgTable('hypotheses', {
  id:               uuid('id').defaultRandom().primaryKey(),
  funnelId:         uuid('funnel_id').references(() => funnels.id).notNull(),
  stepId:           uuid('step_id').references(() => funnelSteps.id),

  // Description humaine
  title:            text('title').notNull(),         // "Urgency headline beats transformation headline"
  description:      text('description'),

  // Variable testée (1 SEULE variable par hypothèse — règle stricte)
  targetVariable:   text('target_variable').notNull(), // "props.headline" (dot notation)
  variableCategory: text('variable_category').notNull(), // "headline" | "cta" | "pricing" | "layout" | "bundle" | "image"
  aboveFold:        boolean('above_fold').default(true),

  // Scoring ICE: Impact × Confidence × Ease
  impact:           integer('impact').notNull(),     // 1-15
  confidence:       integer('confidence').notNull(), // 1-15
  ease:             integer('ease').default(8),      // 1-15 (toujours élevé car 1 variable)

  // Status
  status:           text('status').$type<'draft'|'testing'|'validated'|'invalidated'|'archived'>().default('draft'),
  testId:           uuid('test_id').references(() => abTests),

  createdAt:        timestamp('created_at').defaultNow().notNull(),
}, t => [
  index('hypotheses_funnel_idx').on(t.funnelId),
  index('hypotheses_status_idx').on(t.status),
])

// === A/B TESTS ===
export const abTests = pgTable('ab_tests', {
  id:                  uuid('id').defaultRandom().primaryKey(),
  stepId:              uuid('step_id').references(() => funnelSteps.id).notNull(),
  hypothesisId:        uuid('hypothesis_id').references(() => hypotheses),

  // State machine: sandbox → elagage → commando → duel → champion
  phase:               testPhaseEnum('phase').default('sandbox'),
  status:              abTestStatusEnum('status').default('draft'),
  primaryMetric:       text('primary_metric').default('aov_cvr'),

  // Seuils CONFIGURABLES par test (pas hardcodés)
  thresholds:          jsonb('thresholds').$type<{
    sandboxVisits: number         // default: 200 — isolation avant comparaison
    elagageVisits: number         // default: 150 — firewall de coupe
    elagageRatio: number          // default: 0.33 — kill si CTR < best × ratio
    commandoClicks: number        // default: 30 — checkpoint clicks leader
    commandoVisits: number        // default: 200 — checkpoint visits chaque variant
    duelKoGap: number             // default: 0.30 — KO si gap > 30%
    duelImpatienceClicks: number  // default: 50 — force décision si trop lent
  }>().notNull().default({
    sandboxVisits: 200, elagageVisits: 150, elagageRatio: 0.33,
    commandoClicks: 30, commandoVisits: 200,
    duelKoGap: 0.30, duelImpatienceClicks: 50,
  }),

  // Stats config
  minSampleSize:       integer('min_sample_size').default(500),
  confidenceThreshold: numeric('confidence_threshold', { precision: 4, scale: 3 }).default('0.950'),
  autoPromote:         boolean('auto_promote').default(true),

  winnerVariantId:     uuid('winner_variant_id'),
  startedAt:           timestamp('started_at'),
  endedAt:             timestamp('ended_at'),
  createdAt:           timestamp('created_at').defaultNow().notNull(),
})

// === TEST VARIANT METRICS (séparé de pageVariants) ===
// WHY: métriques changent 100x/jour, structure change rarement
// Séparer évite les lock conflicts sur la table principale
export const testVariantMetrics = pgTable('test_variant_metrics', {
  id:                uuid('id').defaultRandom().primaryKey(),
  variantId:         uuid('variant_id').references(() => pageVariants.id).notNull(),
  testId:            uuid('test_id').references(() => abTests).notNull(),

  // Compteurs temps réel (incrémentés par le tracking)
  visitors:          integer('visitors').default(0),
  clicks:            integer('clicks').default(0),
  addToCarts:         integer('add_to_carts').default(0),
  checkoutStarts:    integer('checkout_starts').default(0),
  purchases:         integer('purchases').default(0),
  revenue:           numeric('revenue', { precision: 12, scale: 2 }).default('0'),

  // Métriques calculées (par le worker, pas en temps réel)
  cvr:               numeric('cvr', { precision: 6, scale: 4 }).default('0'),
  aov:               numeric('aov', { precision: 12, scale: 2 }).default('0'),
  aovTimesCvr:       numeric('aov_times_cvr', { precision: 10, scale: 4 }).default('0'),
  cartToPurchaseRatio: numeric('cart_to_purchase', { precision: 6, scale: 2 }).default('0'),

  // Stats confidence interval
  cvrLower:          numeric('cvr_lower', { precision: 6, scale: 4 }),
  cvrUpper:          numeric('cvr_upper', { precision: 6, scale: 4 }),

  // Sandbox tracking
  isSandbox:         boolean('is_sandbox').default(false),
  sandboxVisits:     integer('sandbox_visits').default(0),
  sandboxPassed:     boolean('sandbox_passed').default(false),

  // Phase-specific
  eliminatedAt:      timestamp('eliminated_at'),
  eliminatedReason:  text('eliminated_reason'),  // 'elagage_low_ctr' | 'commando_low_clicks' | 'duel_ko' | 'duel_impatience'
  promotedAt:        timestamp('promoted_at'),

  updatedAt:         timestamp('updated_at').defaultNow().notNull(),
}, t => [
  uniqueIndex('tvm_variant_test').on(t.variantId, t.testId),
  index('tvm_test_idx').on(t.testId),
])

// === TEST QUEUE (challengers en attente) ===
// WHY: quand un Duel est en cours, les nouveaux challengers attendent
export const testQueue = pgTable('test_queue', {
  id:            uuid('id').defaultRandom().primaryKey(),
  testId:        uuid('test_id').references(() => abTests).notNull(),
  variantId:     uuid('variant_id').references(() => pageVariants.id).notNull(),
  priority:      integer('priority').default(0),  // Impact×Confidence score
  status:        text('status').$type<'queued'|'active'|'completed'|'cancelled'>().default('queued'),
  enqueuedAt:    timestamp('enqueued_at').defaultNow().notNull(),
  activatedAt:   timestamp('activated_at'),
}, t => [index('queue_test_status').on(t.testId, t.status)])

// === BLOCK TYPE REGISTRY (agent extensibility) ===
export const blockDefinitions = pgTable('block_definitions', {
  type:           text('type').primaryKey(),
  category:       text('category').notNull(),            // 'basic', 'commerce', 'social-proof', 'content'
  label:          text('label').notNull(),
  propsSchema:    jsonb('props_schema').notNull(),        // JSON Schema for validation
  htmlTemplate:   text('html_template').notNull(),        // Handlebars HTML template
  cssTemplate:    text('css_template'),                   // optional scoped CSS (Handlebars)
  jsTemplate:     text('js_template'),                    // optional client-side JS (Handlebars)
  defaultStyles:  jsonb('default_styles').default({}),
  isBuiltIn:      boolean('is_built_in').default(false),
  createdAt:      timestamp('created_at').defaultNow().notNull(),
})

// === PRODUCTS ===
export const products = pgTable('products', {
  id:              uuid('id').defaultRandom().primaryKey(),
  name:            text('name').notNull(),
  description:     text('description'),
  images:          jsonb('images').$type<string[]>().default([]),
  price:           numeric('price', { precision: 12, scale: 2 }).notNull(),
  compareAtPrice:  numeric('compare_at_price', { precision: 12, scale: 2 }),
  currency:        text('currency').default('USD'),
  stripeProductId: text('stripe_product_id'),
  stripePriceId:   text('stripe_price_id'),
  isActive:        boolean('is_active').default(true),
  metadata:        jsonb('metadata').default({}),
  createdAt:       timestamp('created_at').defaultNow().notNull(),
  updatedAt:       timestamp('updated_at').defaultNow().notNull(),
}, t => [index('product_active_idx').on(t.isActive)])

// === BUNDLES ===
export const bundles = pgTable('bundles', {
  id:            uuid('id').defaultRandom().primaryKey(),
  funnelId:      uuid('funnel_id').references(() => funnels.id, { onDelete: 'cascade' }),
  name:          text('name').notNull(),
  description:   text('description'),
  products:      jsonb('products').$type<Array<{ productId: string; quantity: number }>>().default([]).notNull(),
  price:         numeric('price', { precision: 12, scale: 2 }).notNull(),
  compareAtPrice: numeric('compare_at_price', { precision: 12, scale: 2 }),
  isPopular:     boolean('is_popular').default(false),
  isOptimal:     boolean('is_optimal').default(false),
  isActive:      boolean('is_active').default(true),
  createdAt:     timestamp('created_at').defaultNow().notNull(),
  updatedAt:     timestamp('updated_at').defaultNow().notNull(),
}, t => [index('bundle_funnel_idx').on(t.funnelId)])

// === PURCHASES ===
export const purchases = pgTable('purchases', {
  id:                    uuid('id').defaultRandom().primaryKey(),
  funnelId:              uuid('funnel_id').references(() => funnels.id, { onDelete: 'cascade' }),
  variantId:             uuid('variant_id').references(() => pageVariants.id),
  orderNumber:           integer('order_number').unique(),
  sessionId:             text('session_id').notNull(),
  customerEmail:         text('customer_email').notNull(),
  customerName:          text('customer_name'),
  customerPhone:         text('customer_phone'),
  customerAddress:       jsonb('customer_address').$type<CustomerAddress>(),
  items:                 jsonb('items').$type<OrderItem[]>().default([]).notNull(),
  upsellHistory:         jsonb('upsell_history').$type<UpsellEntry[]>().default([]),
  subtotal:              numeric('subtotal', { precision: 12, scale: 2 }).notNull(),
  shipping:              numeric('shipping', { precision: 12, scale: 2 }).default('0'),
  tax:                   numeric('tax', { precision: 12, scale: 2 }).default('0'),
  total:                 numeric('total', { precision: 12, scale: 2 }).notNull(),
  currency:              text('currency').default('USD'),
  paymentTransactionId:  text('payment_transaction_id'),  // processor-agnostic (Stripe, PayPal, etc.)
  status:                text('status').default('pending'),
  liveMode:              boolean('live_mode').default(false),
  source:                text('source').default('funnel-checkout'),
  createdAt:             timestamp('created_at').defaultNow().notNull(),
  updatedAt:             timestamp('updated_at').defaultNow().notNull(),
}, t => [
  index('purchase_funnel_idx').on(t.funnelId),
  index('purchase_variant_idx').on(t.variantId),
  index('purchase_email_idx').on(t.customerEmail),
  index('purchase_payment_idx').on(t.paymentTransactionId),
  index('purchase_status_idx').on(t.status),
  index('purchase_created_idx').on(t.createdAt),
])

// === TEMPLATES ===
export const templates = pgTable('templates', {
  id:          uuid('id').defaultRandom().primaryKey(),
  slug:        text('slug').notNull().unique(),
  name:        text('name').notNull(),
  type:        text('type').notNull(),
  description: text('description'),
  structure:   jsonb('structure').$type<{
    blocks: Block[]
    placeholders: TemplatePlaceholder[]
    globalStyles: Partial<PageGlobalStyles>
  }>().notNull(),
  isBuiltIn:   boolean('is_built_in').default(false),
  createdAt:   timestamp('created_at').defaultNow().notNull(),
  updatedAt:   timestamp('updated_at').defaultNow().notNull(),
}, t => [index('templates_type_idx').on(t.type)])

// === PIXEL CONFIGS (par funnel) ===
export const pixelConfigs = pgTable('pixel_configs', {
  id:            uuid('id').defaultRandom().primaryKey(),
  funnelId:      uuid('funnel_id').references(() => funnels.id).notNull(),
  pixelId:       text('pixel_id').notNull(),
  accessToken:   text('access_token').notNull(),          // Meta CAPI token
  testEventCode: text('test_event_code'),
  ga4Id:         text('ga4_id'),
  createdAt:     timestamp('created_at').defaultNow().notNull(),
}, t => [index('pixel_funnel_idx').on(t.funnelId)])

// === EVENTS (raw, append-only) ===
export const events = pgTable('events', {
  id:         uuid('id').defaultRandom().primaryKey(),
  eventType:  eventTypeEnum('event_type').notNull(),
  eventId:    text('event_id').notNull(),                  // CAPI dedup
  variantId:  uuid('variant_id').references(() => pageVariants.id),
  funnelId:   uuid('funnel_id').references(() => funnels.id),
  sessionId:  text('session_id'),
  visitorId:  text('visitor_id'),
  blockId:    text('block_id'),
  elementTag: text('element_tag'),
  value:      numeric('value', { precision: 10, scale: 2 }),
  currency:   text('currency').default('USD'),
  payload:    jsonb('payload').default({}),
  createdAt:  timestamp('created_at').defaultNow().notNull(),
}, t => [
  index('events_variant_time').on(t.variantId, t.createdAt),
  index('events_type_time').on(t.eventType, t.createdAt),
  index('events_funnel_time').on(t.funnelId, t.createdAt),
])

// === METRICS HOURLY (aggregation) ===
export const metricsHourly = pgTable('metrics_hourly', {
  id:              uuid('id').defaultRandom().primaryKey(),
  variantId:       uuid('variant_id').references(() => pageVariants.id).notNull(),
  hour:            timestamp('hour').notNull(),
  visitors:        integer('visitors').default(0),
  pageViews:       integer('page_views').default(0),
  clicks:          integer('clicks').default(0),
  addToCarts:      integer('add_to_carts').default(0),
  checkoutStarts:  integer('checkout_starts').default(0),
  purchases:       integer('purchases').default(0),
  revenue:         numeric('revenue', { precision: 12, scale: 2 }).default('0'),
}, t => [uniqueIndex('hourly_variant_hour').on(t.variantId, t.hour)])

// === METRICS DAILY (dashboard) ===
export const metricsDaily = pgTable('metrics_daily', {
  id:                 uuid('id').defaultRandom().primaryKey(),
  variantId:          uuid('variant_id').references(() => pageVariants.id).notNull(),
  funnelId:           uuid('funnel_id').references(() => funnels.id).notNull(),
  date:               timestamp('date').notNull(),
  visitors:           integer('visitors').default(0),
  pageViews:          integer('page_views').default(0),
  clicks:             integer('clicks').default(0),
  addToCarts:         integer('add_to_carts').default(0),
  purchases:          integer('purchases').default(0),
  revenue:            numeric('revenue', { precision: 12, scale: 2 }).default('0'),
  newCustomerSpend:   integer('new_customer_spend').default(0),
  existingCustomerSpend: integer('existing_customer_spend').default(0),
  engagedAudienceSpend: integer('engaged_audience_spend').default(0),
  cvr:                numeric('cvr', { precision: 6, scale: 4 }).default('0'),
  aov:                numeric('aov', { precision: 12, scale: 2 }).default('0'),
  aovTimesCvr:        numeric('aov_times_cvr', { precision: 10, scale: 4 }).default('0'),
  cartToPurchaseRatio: numeric('cart_to_purchase', { precision: 6, scale: 2 }).default('0'),
}, t => [
  uniqueIndex('daily_variant_date').on(t.variantId, t.date),
  index('daily_funnel').on(t.funnelId, t.date),
])

// === BLOCK EVENTS (block-level click tracking) ===
export const blockEvents = pgTable('block_events', {
  id:        uuid('id').defaultRandom().primaryKey(),
  blockId:   text('block_id').notNull(),
  variantId: uuid('variant_id').references(() => pageVariants.id),
  eventType: text('event_type').notNull(),                // 'click' | 'view'
  count:     integer('count').default(1),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, t => [index('block_events_idx').on(t.blockId, t.variantId, t.eventType)])

// === ANALYTICS EXTENSIONS (Prompt 4) ===
export const rawEvents = pgTable('raw_events', {
  eventId: text('event_id').primaryKey(),
  eventType: text('event_type').notNull(),
  sessionId: text('session_id').notNull(),
  payload: jsonb('payload').notNull(),
  receivedAt: timestamp('received_at').defaultNow(),
})

// === AGRÉGATION ASYNCHRONE 5-MIN (Protection DB) ===
export const metrics5min = pgTable('metrics_5min', {
  variantId: uuid('variant_id').notNull(),
  bucket: timestamp('bucket').notNull(),
  views: integer('views').default(0),
  clicks: integer('clicks').default(0),
  atc: integer('atc').default(0),
  purchases: integer('purchases').default(0),
  revenue: numeric('revenue', { precision: 12, scale: 2 }).default('0')
}, t => [uniqueIndex('uniq_variant_bucket').on(t.variantId, t.bucket)])

// === TRACKING COÛTS AGENTS ===
export const agentCosts = pgTable('agent_costs', {
  id: uuid('id').defaultRandom().primaryKey(),
  agentId: text('agent_id').notNull(),
  action: text('action').notNull(),                  
  costCents: integer('cost_cents').default(0),
  revenueCents: integer('revenue_cents').default(0), 
  roi: numeric('roi', { precision: 10, scale: 2 }).default('0'),
  ts: timestamp('ts').defaultNow()
})

// === WARMUP FACEBOOK ADS (Anti-Ban) ===
export const fbAccountsWarmup = pgTable('fb_accounts_warmup', {
  accountId: text('account_id').primaryKey(),
  warmupStage: integer('warmup_stage').default(0),        
  dailySpendCap: integer('daily_spend_cap').default(50),  
  trustScore: integer('trust_score').default(0)           
})

export const elementRevenue = pgTable('element_revenue', {
  id: uuid('id').defaultRandom().primaryKey(),
  variantId: uuid('variant_id').notNull(),
  bid: text('bid').notNull(),
  clicks: integer('clicks').default(0),
  revenue: numeric('revenue', { precision: 12, scale: 2 }).default('0'),
  rect: jsonb('rect'),
  updatedAt: timestamp('updated_at').defaultNow()
}, t => [uniqueIndex('uniq_elem_rev').on(t.variantId, t.bid)])

export const touchpoints = pgTable('touchpoints', {
  id: uuid('id').defaultRandom().primaryKey(),
  sessionId: text('session_id').notNull(),
  userHash: text('user_hash').notNull(),
  channel: text('channel').notNull(),
  campaignId: text('campaign_id'),
  adId: text('ad_id'),
  timestamp: bigint('timestamp', { mode: 'number' }).notNull(),
  cost: numeric('cost', { precision: 12, scale: 2 }),
})

export const attributions = pgTable('attributions', {
  id: uuid('id').defaultRandom().primaryKey(),
  purchaseId: uuid('purchase_id').notNull(),
  model: text('model').notNull(),
  totalRevenue: numeric('total_revenue', { precision: 12, scale: 2 }),
  roasBreakdown: jsonb('roas_breakdown'),
  calculatedAt: timestamp('calculated_at').defaultNow()
})

export const surveys = pgTable('surveys', {
  id: uuid('id').defaultRandom().primaryKey(),
  shopId: uuid('shop_id').notNull(),
  name: text('name').notNull(),
  trigger: text('trigger').notNull(),
  questions: jsonb('questions').notNull(),
  reward: jsonb('reward'),
  createdAt: timestamp('created_at').defaultNow()
})

export const surveyResponses = pgTable('survey_responses', {
  id: uuid('id').defaultRandom().primaryKey(),
  surveyId: uuid('survey_id').references(() => surveys.id),
  customerHash: text('customer_hash').notNull(),
  answers: jsonb('answers').notNull(),
  sentimentScore: numeric('sentiment_score', { precision: 4, scale: 2 }),
  keywords: jsonb('keywords').$type<string[]>(),
  completedAt: timestamp('completed_at').defaultNow()
})

export const surveyInsights = pgTable('survey_insights', {
  id: uuid('id').defaultRandom().primaryKey(),
  shopId: uuid('shop_id').notNull(),
  category: text('category').notNull(),
  keyword: text('keyword').notNull(),
  frequency: integer('frequency').default(1),
  sentimentAvg: numeric('sentiment_avg', { precision: 4, scale: 2 }),
  lastUpdated: timestamp('last_updated').defaultNow()
})

// === RESEARCH ENGINE (Prompt 5) ===
export const discoveredNiches = pgTable('discovered_niches', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: text('slug').unique().notNull(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  volumeScore: numeric('volume_score', { precision: 4, scale: 2 }),
  intensityScore: numeric('intensity_score', { precision: 4, scale: 2 }),
  gapScore: numeric('gap_score', { precision: 4, scale: 2 }),
  trendScore: numeric('trend_score', { precision: 4, scale: 2 }),
  accessibilityScore: numeric('accessibility_score', { precision: 4, scale: 2 }),
  totalScore: numeric('total_score', { precision: 4, scale: 2 }),
  demandVolume: integer('demand_volume'),
  estimatedCpc: numeric('estimated_cpc', { precision: 5, scale: 2 }),
  status: text('status').$type<'researching' | 'scored' | 'validating' | 'winner' | 'rejected' | 'product_created'>().default('researching'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const researchSources = pgTable('research_sources', {
  id: uuid('id').defaultRandom().primaryKey(),
  nicheId: uuid('niche_id').references(() => discoveredNiches.id, { onDelete: 'cascade' }),
  type: text('type').$type<'google_trends' | 'reddit' | 'amazon_review' | 'trustpilot'>(),
  url: text('url'),
  content: text('content'),
  sentiment: numeric('sentiment', { precision: 4, scale: 2 }),
  extractedKeywords: jsonb('extracted_keywords').$type<string[]>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const marketingAnglesResearch = pgTable('marketing_angles_research', {
  id: uuid('id').defaultRandom().primaryKey(),
  nicheId: uuid('niche_id').references(() => discoveredNiches.id, { onDelete: 'cascade' }),
  painPoint: text('pain_point').notNull(),
  desire: text('desire').notNull(),
  avatar: text('avatar').notNull(),
  emotion: text('emotion').notNull(),
  promise: text('promise').notNull(),
  hooks: jsonb('hooks').$type<string[]>(),
  confidenceScore: numeric('confidence_score', { precision: 4, scale: 2 }),
  status: text('status').$type<'generated' | 'testing' | 'winner' | 'loser'>().default('generated'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const aiConsensusVotes = pgTable('ai_consensus_votes', {
  id: uuid('id').defaultRandom().primaryKey(),
  nicheId: uuid('niche_id').references(() => discoveredNiches.id, { onDelete: 'cascade' }),
  modelName: text('model_name').notNull(),
  totalScore: numeric('total_score', { precision: 4, scale: 2 }),
  rawResponse: jsonb('raw_response'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// === FUNNEL BUILDER (SOP) ===
export const blocksDefinitions = pgTable('block_definitions', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),             
  category: text('category').notNull(),              
  description: text('description'),
  htmlTemplate: text('html_template').notNull(),
  cssTemplate: text('css_template').default(''),
  jsTemplate: text('js_template').default(''),
  configSchema: jsonb('config_schema').notNull(),
  defaultConfig: jsonb('default_config').notNull(),
  isSystem: boolean('is_system').default(false),     
  createdByAgent: boolean('created_by_agent').default(false),
  usageCount: integer('usage_count').default(0),
  performanceScore: numeric('performance_score', { precision: 4, scale: 2 }).default('0'), 
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

### 4.1 Catalogue des Blocs Système (JSON Specs)

Ces schémas définissent le `config_schema` attendu par le moteur de rendu pour chaque bloc. L'Agent IA doit générer du JSON respectant scrupuleusement ces types.

#### BLOC : anchor-nav
```json
{
  "name": "anchor-nav",
  "category": "navigation",
  "description": "Barre de navigation par ancrage (vers Reviews, Features, etc.) pour bypasser le scroll-fatigue",
  "configSchema": {
    "links": {
      "type": "array",
      "required": true,
      "items": { "label": "string", "targetBlockBid": "string", "icon": "string" }
    },
    "style": { "type": "enum", "values": ["horizontal", "vertical", "floating"], "default": "horizontal" },
    "mobileBehavior": { "type": "enum", "values": ["hide", "collapse", "show"], "default": "show" }
  }
}
```

#### BLOC : hero-main
```json
{
  "name": "hero-main",
  "category": "hero",
  "description": "Hero section principale avec image, headline, CTA",
  "configSchema": {
    "headline": { "type": "string", "required": true },
    "subheadline": { "type": "string", "required": false },
    "heroImage": { "type": "url", "required": false },
    "heroVideo": { "type": "url", "required": false },
    "ctaText": { "type": "string", "required": true, "default": "Shop Now" },
    "ctaAction": { "type": "enum", "values": ["scroll_to_checkout", "url", "scroll_to_id"], "default": "scroll_to_checkout" },
    "ctaColor": { "type": "color", "default": "#E74C3C" },
    "socialProof": { "type": "string", "required": false },
    "alignment": { "type": "enum", "values": ["left", "center", "right"], "default": "center" }
  }
}
```

#### BLOC : product-carousel
```json
{
  "name": "product-carousel",
  "category": "product",
  "description": "Carousel d'images produit",
  "configSchema": {
    "images": {
      "type": "array",
      "required": true,
      "items": { "url": "string", "alt": "string", "caption": "string" }
    },
    "thumbnails": { "type": "boolean", "default": true }
  }
}
```

#### BLOC : product-info
```json
{
  "name": "product-info",
  "category": "product",
  "description": "Titre produit, prix, reviews, bullets bénéfices, CTA",
  "configSchema": {
    "productTitle": { "type": "string", "required": true },
    "price": { "type": "number", "required": true },
    "compareAtPrice": { "type": "number", "required": false },
    "reviewCount": { "type": "number", "default": 0 },
    "averageRating": { "type": "number", "default": 0 },
    "bullets": { "type": "array", "items": "string", "required": true },
    "ctaText": { "type": "string", "default": "Add to Cart" }
  }
}
```

#### BLOC : bundle-selector
```json
{
  "name": "bundle-selector",
  "category": "bundle",
  "description": "Sélecteur de bundles pour augmenter l'AOV",
  "configSchema": {
    "bundles": {
      "type": "array",
      "required": true,
      "items": {
        "name": "string",
        "quantity": "number",
        "price": "number",
        "compareAtPrice": "number",
        "isPopular": "boolean"
      }
    }
  }
}
```

#### BLOC : testimonials-grid
```json
{
  "name": "testimonials-grid",
  "category": "social_proof",
  "configSchema": {
    "testimonials": {
      "type": "array",
      "required": true,
      "items": { "name": "string", "rating": "number", "text": "string", "verified": "boolean" }
    }
  }
}
```

#### BLOC : faq-accordion
```json
{
  "name": "faq-accordion",
  "category": "content",
  "configSchema": {
    "title": { "type": "string", "default": "Frequently Asked Questions" },
    "faqs": {
      "type": "array",
      "required": true,
      "items": { "question": "string", "answer": "string" }
    }
  }
}
```

#### BLOC : checkout-form
```json
{
  "name": "checkout-form",
  "category": "checkout",
  "configSchema": {
    "title": { "type": "string", "default": "Complete Your Order" },
    "provider": { "type": "enum", "values": ["stripe", "paypal", "both"], "default": "both" }
  }
}
```

#### BLOC : guarantee-badge
```json
{
  "name": "guarantee-badge",
  "category": "trust",
  "configSchema": {
    "type": { "type": "enum", "values": ["30_days", "money_back", "secure_payment", "free_shipping"], "default": "30_days" }
  }
}
```

// === GROWTH LOOP & AUTONOMY (Post-V1) ===
export const growthCycles = pgTable('growth_cycles', {
  id:            uuid('id').defaultRandom().primaryKey(),
  funnelId:      uuid('funnel_id').references(() => funnels.id).notNull(),
  stepId:        uuid('step_id').references(() => funnelSteps.id),
  cycleNumber:   integer('cycle_number').notNull(),       
  status:        text('status').$type<'proposing'|'executing'|'testing'|'analyzing'|'completed'>().default('proposing'),
  hypothesisId:  uuid('hypothesis_id').references(() => hypotheses.id),
  previousScore: numeric('previous_score', { precision: 10, scale: 2 }),  
  currentScore:  numeric('current_score', { precision: 10, scale: 2 }),   
  improvement:   numeric('improvement', { precision: 6, scale: 2 }),      
  agentDecision: jsonb('agent_decision').$type<{
    action: 'continue' | 'pivot' | 'double_down' | 'pause'
    reasoning: string
    nextHypothesis?: string
  }>(),
  startedAt:     timestamp('started_at').defaultNow().notNull(),
  completedAt:   timestamp('completed_at'),
}, t => [index('cycles_funnel_idx').on(t.funnelId, t.cycleNumber)])

export const testLearnings = pgTable('test_learnings', {
  id:                uuid('id').defaultRandom().primaryKey(),
  hypothesisId:      uuid('hypothesis_id').references(() => hypotheses.id).notNull(),
  funnelId:          uuid('funnel_id').references(() => funnels.id).notNull(),
  variableFingerprint: text('variable_fingerprint').notNull(),
  winnerVariantId:   uuid('winner_variant_id'),
  metricBefore:      numeric('metric_before', { precision: 10, scale: 4 }),
  metricAfter:       numeric('metric_after', { precision: 10, scale: 4 }),
  improvement:       numeric('improvement', { precision: 6, scale: 2 }),
  sampleSize:        integer('sample_size'),
  confidence:        numeric('confidence', { precision: 4, scale: 3 }),  
  transferable:      boolean('transferable').default(false),
  transferredFrom:   uuid('transferred_from'),  
  confidenceBoost:   numeric('confidence_boost', { precision: 4, scale: 3 }),
  createdAt:         timestamp('created_at').defaultNow().notNull(),
}, t => [
  index('learnings_fingerprint_idx').on(t.variableFingerprint),
  index('learnings_funnel_idx').on(t.funnelId),
])

// === EVOLUTION ENGINE (Auto-Update Loop) ===
export const knowledgeSources = pgTable('knowledge_sources', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  url: text('url').notNull(),
  type: text('type').$type<'api_docs' | 'blog' | 'forum' | 'competitor' | 'social'>().notNull(),
  isActive: boolean('is_active').default(true),
  lastCheckedAt: timestamp('last_checked_at'),
})

export const rawInsights = pgTable('raw_insights', {
  id: uuid('id').defaultRandom().primaryKey(),
  sourceId: uuid('source_id').references(() => knowledgeSources.id),
  title: text('title').notNull(),
  summary: text('summary').notNull(), 
  contentHash: text('content_hash').notNull(), 
  relevanceScore: numeric('relevance_score', { precision: 4, scale: 2 }),
  status: text('status').$type<'new' | 'discarded' | 'debating' | 'approved' | 'implemented'>().default('new'),
  createdAt: timestamp('created_at').defaultNow(),
})

export const evolutionDebates = pgTable('evolution_debates', {
  id: uuid('id').defaultRandom().primaryKey(),
  insightId: uuid('insight_id').references(() => rawInsights.id),
  topic: text('topic').notNull(),
  argumentsFor: jsonb('arguments_for').$type<string[]>(),
  argumentsAgainst: jsonb('arguments_against').$type<string[]>(),
  decision: text('decision').$type<'reject' | 'research' | 'implement'>().default('research'),
  confidence: numeric('confidence', { precision: 4, scale: 2 }),
  concludedAt: timestamp('concluded_at'),
})

export const changeProposals = pgTable('change_proposals', {
  id: uuid('id').defaultRandom().primaryKey(),
  debateId: uuid('debate_id').references(() => evolutionDebates.id),
  type: text('type').$type<'code_diff' | 'prompt_update' | 'sop_creation' | 'marketing_heuristic' | 'db_migration'>().notNull(),
  diffContent: text('diff_content'),
  status: text('status').$type<'pending_review' | 'approved' | 'rejected' | 'merged'>().default('pending_review'),
  createdAt: timestamp('created_at').defaultNow(),
})

// === MEDIA BUYING HACKS: FATIGUE & ADS EXTENSIONS ===
export const creativeFatigueScores = pgTable('creative_fatigue_scores', {
  id: uuid('id').defaultRandom().primaryKey(),
  adId: text('ad_id').notNull(), 
  date: timestamp('date').notNull(),
  frequency: numeric('frequency', { precision: 6, scale: 2 }),
  ctrTrend7d: numeric('ctr_trend_7d', { precision: 6, scale: 4 }),
  roasTrend7d: numeric('roas_trend_7d', { precision: 6, scale: 4 }),
  fatigueScore: integer('fatigue_score'),
  recommendation: text('recommendation').$type<'refresh' | 'pause' | 'replace'>(),
  createdAt: timestamp('created_at').defaultNow(),
})

export const adsExtensions = pgTable('ads_extensions', {
  adId: text('ad_id').primaryKey(), // Lier au composant d'ads réel plus tard
  funnelStage: text('funnel_stage').$type<'tofu' | 'mofu' | 'bofu'>().default('tofu'),
  forceSpendPercent: integer('force_spend_percent'), 
  placementExclusions: jsonb('placement_exclusions').$type<string[]>().default(['audience_network']),
})

```

**22 tables total (core)**: funnels, marketing_angles, funnel_steps, page_variants, ab_tests, hypotheses, test_variant_metrics, test_queue, block_definitions, products, bundles, purchases, templates, pixel_configs, events, metrics_hourly, metrics_daily, block_events

**+ 9 tables Facebook Ads** (section 14) : meta_ad_accounts, niche_research, angle_research, ad_campaigns, ad_sets, ads, ad_metrics_daily, creative_templates, budget_allocations, ad_alerts

**Total : 32 tables**

### Drizzle Relations (obligatoires pour les jointures type-safe)

```typescript
import { relations } from 'drizzle-orm'

export const funnelsRelations = relations(funnels, ({ many, one }) => ({
  steps: many(funnelSteps),
  angles: many(marketingAngles),
  events: many(events),
  purchases: many(purchases),
  bundles: many(bundles),
  hypotheses: many(hypotheses),
  product: one(products, {
    fields: [funnels.productId],
    references: [products.id],
  }),
}))

export const funnelStepsRelations = relations(funnelSteps, ({ one, many }) => ({
  funnel: one(funnels, {
    fields: [funnelSteps.funnelId],
    references: [funnels.id],
  }),
  variants: many(pageVariants),
  tests: many(abTests),
}))

export const pageVariantsRelations = relations(pageVariants, ({ one, many }) => ({
  step: one(funnelSteps, {
    fields: [pageVariants.stepId],
    references: [funnelSteps.id],
  }),
  testMetrics: many(testVariantMetrics),
}))

export const hypothesesRelations = relations(hypotheses, ({ one }) => ({
  funnel: one(funnels, { fields: [hypotheses.funnelId], references: [funnels.id] }),
  step: one(funnelSteps, { fields: [hypotheses.stepId], references: [funnelSteps.id] }),
  test: one(abTests, { fields: [hypotheses.testId], references: [abTests.id] }),
}))

export const abTestsRelations = relations(abTests, ({ one, many }) => ({
  step: one(funnelSteps, { fields: [abTests.stepId], references: [funnelSteps.id] }),
  hypothesis: one(hypotheses, { fields: [abTests.hypothesisId], references: [hypotheses.id] }),
  variantMetrics: many(testVariantMetrics),
  queue: many(testQueue),
}))

export const testVariantMetricsRelations = relations(testVariantMetrics, ({ one }) => ({
  variant: one(pageVariants, { fields: [testVariantMetrics.variantId], references: [pageVariants.id] }),
  test: one(abTests, { fields: [testVariantMetrics.testId], references: [abTests.id] }),
}))

export const testQueueRelations = relations(testQueue, ({ one }) => ({
  test: one(abTests, { fields: [testQueue.testId], references: [abTests.id] }),
  variant: one(pageVariants, { fields: [testQueue.variantId], references: [pageVariants.id] }),
}))

export const productsRelations = relations(products, ({ many }) => ({
  funnels: many(funnels),
}))

export const bundlesRelations = relations(bundles, ({ one }) => ({
  funnel: one(funnels, {
    fields: [bundles.funnelId],
    references: [funnels.id],
  }),
}))

export const purchasesRelations = relations(purchases, ({ one }) => ({
  funnel: one(funnels, {
    fields: [purchases.funnelId],
    references: [funnels.id],
  }),
  variant: one(pageVariants, {
    fields: [purchases.variantId],
    references: [pageVariants.id],
  }),
}))

export const surveysRelations = relations(surveys, ({ many }) => ({
  responses: many(surveyResponses)
}))

export const surveyResponsesRelations = relations(surveyResponses, ({ one }) => ({
  survey: one(surveys, { fields: [surveyResponses.surveyId], references: [surveys.id] })
}))

export const discoveredNichesRelations = relations(discoveredNiches, ({ many }) => ({
  sources: many(researchSources),
  angles: many(marketingAnglesResearch),
  consensusVotes: many(aiConsensusVotes)
}))

export const researchSourcesRelations = relations(researchSources, ({ one }) => ({
  niche: one(discoveredNiches, { fields: [researchSources.nicheId], references: [discoveredNiches.id] })
}))

export const marketingAnglesResearchRelations = relations(marketingAnglesResearch, ({ one }) => ({
  niche: one(discoveredNiches, { fields: [marketingAnglesResearch.nicheId], references: [discoveredNiches.id] })
}))

export const growthCyclesRelations = relations(growthCycles, ({ one }) => ({
  funnel: one(funnels, { fields: [growthCycles.funnelId], references: [funnels.id] }),
  step: one(funnelSteps, { fields: [growthCycles.stepId], references: [funnelSteps.id] }),
  hypothesis: one(hypotheses, { fields: [growthCycles.hypothesisId], references: [hypotheses.id] })
}))

export const testLearningsRelations = relations(testLearnings, ({ one }) => ({
  funnel: one(funnels, { fields: [testLearnings.funnelId], references: [funnels.id] }),
  hypothesis: one(hypotheses, { fields: [testLearnings.hypothesisId], references: [hypotheses.id] })
}))
```

---

## 3. A/B Testing Decision Engine

### State Machine

```
                    ┌──────────┐
                    │ SANDBOX  │ 200 visits isolés
                    │ (éligé)  │ newcomer pas encore comparé
                    └────┬─────┘
                         │ sandboxVisits atteint
                         ▼
                  ┌─────────────┐
           ┌─────►│   ÉLAGAGE   │ Coupe à 150 visits
           │      │  (firewall) │ Kill si CTR < best × 0.33
           │      └──────┬──────┘
           │             │ survivants
           │             ▼
           │      ┌─────────────┐
           │      │  COMMANDO   │ 30 clicks leader + 200 visits chacun
           │      │ (checkpoint)│ Garde top 2
           │      └──────┬──────┘
           │             │ top 2
           │             ▼
           │      ┌─────────────┐
           │      │    DUEL     │ KO: gap > 30%
           │      │   (1 vs 1)  │ Impatience: 50 clicks sans décision
           │      └──────┬──────┘
           │             │ winner trouvé
           │             ▼
           │      ┌─────────────┐
           │      │  CHAMPION   │ Variant gagnant = 100% trafic
           │      │ (déployé)   │ Learning enregistré
           │      └─────────────┘
           │
           │ Nouveau challenger arrive → Queue si Duel en cours
           └──────── Sinon → Sandbox pour ce challenger
```

### Decision Engine (Worker BullMQ)

```typescript
// src/workers/ab-test-engine.ts
// WHY BullMQ: les calculs statistiques sont CPU-intensive,
// ne pas bloquer l'API principale

import { db } from '../db'
import { abTests, testVariantMetrics, testQueue, pageVariants } from '../db/schema'
import { eq, and, gte, sql } from 'drizzle-orm'

// ============================================
// STATS — Wilson Score Interval
// ============================================

function getBonferroniAlpha(numVariants: number, baseAlpha: number = 0.05): number {
  return baseAlpha / numVariants; // Évite les faux gagnants (Multiple Testing Problem)
}

function wilsonInterval(successes: number, trials: number, numVariants: number = 2): {
  lower: number; upper: number; point: number
} {
  if (trials === 0) return { lower: 0, upper: 0, point: 0 }
  // Correction de Bonferroni appliquée au Z-Score
  const alpha = getBonferroniAlpha(numVariants);
  const z = 1.96; // (Simplification, devrait être jStat.normal.inv(1 - alpha/2, 0, 1))
  
  const p = successes / trials
  const n = trials
  const z2 = z * z
  const denom = 1 + z2 / n
  const center = (p + z2 / (2 * n)) / denom
  const spread = z * Math.sqrt((p * (1 - p) + z2 / (4 * n)) / n) / denom
  return {
    lower: Math.max(0, center - spread),
    upper: Math.min(1, center + spread),
    point: p,
  }
}

function calculateScore(cvr: number, aov: number): number {
  return cvr * aov  // AOV × CVR = revenue per visitor
}

// ============================================
// PHASE PROCESSORS
// ============================================

async function processSandboxVariants(testId: string, thresholds: TestThresholds) {
  const metrics = await db.select().from(testVariantMetrics)
    .where(and(eq(testVariantMetrics.testId, testId), eq(testVariantMetrics.isSandbox, true)))

  for (const m of metrics) {
    if (m.sandboxVisits >= thresholds.sandboxVisits) {
      // Sandbox passed → move to elagage
      await db.update(testVariantMetrics)
        .set({ isSandbox: false, sandboxPassed: true })
        .where(eq(testVariantMetrics.id, m.id))
    }
  }

  // If all sandbox variants passed → transition to elagage
  const remaining = metrics.filter(m => !m.sandboxPassed && m.sandboxVisits < thresholds.sandboxVisits)
  if (remaining.length === 0 && metrics.length > 0) {
    await db.update(abTests).set({ phase: 'elagage' }).where(eq(abTests.id, testId))
  }
}

async function runElagage(testId: string, thresholds: TestThresholds) {
  const metrics = await db.select().from(testVariantMetrics)
    .where(and(eq(testVariantMetrics.testId, testId), eq(testVariantMetrics.isSandbox, false)))

  const activeMetrics = metrics.filter(m => !m.eliminatedAt)

  // Trouver le meilleur CTR
  const bestCvr = Math.max(...activeMetrics.map(m => Number(m.cvr)))

  for (const m of activeMetrics) {
    if (m.visitors >= thresholds.elagageVisits) {
      const cvr = Number(m.cvr)
      // Kill si CTR < best × ratio
      if (cvr < bestCvr * thresholds.elagageRatio) {
        await db.update(testVariantMetrics).set({
          eliminatedAt: new Date(),
          eliminatedReason: 'elagage_low_ctr',
        }).where(eq(testVariantMetrics.id, m.id))
      }
    }
  }

  // Si plus de 2 survivants → commando
  const survivors = activeMetrics.filter(m => !m.eliminatedAt)
  if (survivors.length <= 2) {
    await db.update(abTests).set({ phase: 'duel' }).where(eq(abTests.id, testId))
  } else {
    await db.update(abTests).set({ phase: 'commando' }).where(eq(abTests.id, testId))
  }
}

async function runCommando(testId: string, thresholds: TestThresholds) {
  const metrics = await db.select().from(testVariantMetrics)
    .where(and(eq(testVariantMetrics.testId, testId), eq(testVariantMetrics.isSandbox, false)))

  const activeMetrics = metrics.filter(m => !m.eliminatedAt)

  // Checkpoint: leader a 30+ clicks ET chaque variant a 200+ visits
  const leader = activeMetrics.reduce((best, m) =>
    Number(m.aovTimesCvr) > Number(best.aovTimesCvr) ? m : best
  )

  const allHaveMinVisits = activeMetrics.every(m => m.visitors >= thresholds.commandoVisits)
  const leaderHasMinClicks = leader.clicks >= thresholds.commandoClicks

  if (allHaveMinVisits && leaderHasMinClicks) {
    // Garder top 2, éliminer le reste
    const sorted = [...activeMetrics].sort((a, b) =>
      Number(b.aovTimesCvr) - Number(a.aovTimesCvr)
    )

    for (let i = 2; i < sorted.length; i++) {
      await db.update(testVariantMetrics).set({
        eliminatedAt: new Date(),
        eliminatedReason: 'commando_low_clicks',
      }).where(eq(testVariantMetrics.id, sorted[i].id))
    }

    await db.update(abTests).set({ phase: 'duel' }).where(eq(abTests.id, testId))
  }
}

async function runDuel(testId: string, thresholds: TestThresholds) {
  const metrics = await db.select().from(testVariantMetrics)
    .where(and(eq(testVariantMetrics.testId, testId), eq(testVariantMetrics.isSandbox, false)))

  const activeMetrics = metrics.filter(m => !m.eliminatedAt)
  if (activeMetrics.length < 2) return

  const [a, b] = activeMetrics.sort((x, y) =>
    Number(y.aovTimesCvr) - Number(x.aovTimesCvr)
  )

  const scoreA = Number(a.aovTimesCvr)
  const scoreB = Number(b.aovTimesCvr)
  const gap = scoreB > 0 ? (scoreA - scoreB) / scoreB : 1

  // KO: gap > 30%
  if (gap >= thresholds.duelKoGap) {
    await crownChampion(testId, a.variantId, 'duel_ko')
    return
  }

  // Impatience: 50 clicks sans décision
  if (a.clicks >= thresholds.duelImpatienceClicks && b.clicks >= thresholds.duelImpatienceClicks) {
    await crownChampion(testId, a.variantId, 'duel_impatience')
    return
  }
}

async function crownChampion(testId: string, winnerVariantId: string, reason: string) {
  // Transaction: tout ou rien
  await db.transaction(async (tx) => {
    // 1. Marquer le test comme champion
    await tx.update(abTests).set({
      phase: 'champion',
      status: 'completed',
      winnerVariantId,
      endedAt: new Date(),
    }).where(eq(abTests.id, testId))

    // 2. Éliminer les autres variants
    await tx.update(testVariantMetrics).set({
      eliminatedAt: new Date(),
      eliminatedReason: reason,
    }).where(and(
      eq(testVariantMetrics.testId, testId),
      sql`${testVariantMetrics.variantId} != ${winnerVariantId}`,
    ))

    // 3. Marquer le winner
    await tx.update(testVariantMetrics).set({
      promotedAt: new Date(),
    }).where(and(
      eq(testVariantMetrics.testId, testId),
      eq(testVariantMetrics.variantId, winnerVariantId),
    ))

    // 4. Mettre à jour le step pour pointer vers le champion
    const [test] = await tx.select().from(abTests).where(eq(abTests.id, testId))
    if (test) {
      await tx.update(funnelSteps).set({
        activeVariantId: winnerVariantId,
      }).where(eq(funnelSteps.id, test.stepId))
    }

    // 5. Activer le prochain challenger dans la queue
    const [nextInQueue] = await tx.select().from(testQueue)
      .where(and(eq(testQueue.testId, testId), eq(testQueue.status, 'queued')))
      .orderBy(testQueue.priority)
      .limit(1)

    if (nextInQueue) {
      await tx.update(testQueue).set({ status: 'active', activatedAt: new Date() })
        .where(eq(testQueue.id, nextInQueue.id))
    }
  })
}

// ============================================
// MAIN WORKER LOOP (BullMQ cron)
// ============================================

export async function processAbTests() {
  const activeTests = await db.select().from(abTests)
    .where(eq(abTests.status, 'running'))

  for (const test of activeTests) {
    try {
      switch (test.phase) {
        case 'sandbox':   await processSandboxVariants(test.id, test.thresholds); break
        case 'elagage':   await runElagage(test.id, test.thresholds); break
        case 'commando':  await runCommando(test.id, test.thresholds); break
        case 'duel':      await runDuel(test.id, test.thresholds); break
        // champion = rien à faire, déjà déployé
      }
    } catch (err) {
      // Log mais ne crash pas — les autres tests doivent continuer
      console.error(`A/B test ${test.id} error in phase ${test.phase}:`, err)
    }
  }
}
```

### Types utilisés par le Decision Engine

```typescript
interface TestThresholds {
  sandboxVisits: number         // 200
  elagageVisits: number         // 150
  elagageRatio: number          // 0.33
  commandoClicks: number        // 30
  commandoVisits: number        // 200
  duelKoGap: number             // 0.30
  duelImpatienceClicks: number  // 50
}
```

---

## 4. Block Engine (Registry + Extensibilité)

```typescript
// src/blocks/registry.ts
import Handlebars from 'handlebars'
import { db } from '../db'
import { blockDefinitions } from '../db/schema'
import { eq } from 'drizzle-orm'
import type { Block, DeviceStyles } from './types'

type RenderFn = (block: Block, ctx: RenderContext) => string

interface BlockDef {
  type: string
  category: string
  label: string
  propsSchema: Record<string, unknown>
  render: RenderFn
  defaultStyles: DeviceStyles
}

interface RenderContext {
  variantId: string
  funnelId: string
  stepSlug: string
  trackingAttrs: (blockId: string, tag?: string) => string
}

class BlockRegistry {
  private renderers = new Map<string, RenderFn>()

  register(def: BlockDef) {
    this.renderers.set(def.type, def.render)
  }

  getRenderer(type: string): RenderFn | undefined {
    return this.renderers.get(type)
  }

  renderBlock(block: Block, ctx: RenderContext): string {
    // Visibility check
    if (block.visibility && ctx.device && !block.visibility[ctx.device]) return ''

    const renderer = this.renderers.get(block.type)

    // Built-in renderer found
    if (renderer) {
      let html = renderer(block, ctx)
      // Render children if present
      if (block.children?.length) {
        const childrenHtml = block.children.map(c => this.renderBlock(c, ctx)).join('')
        html = html.replace('{{children}}', childrenHtml)
      }
      return html.replace('{{children}}', '')
    }

    // Fallback: custom block from DB (Handlebars)
    // WHY Handlebars: agents can't upload JS functions, but they can upload templates
    return this.renderCustomBlock(block, ctx)
  }

  private async renderCustomBlock(block: Block, ctx: RenderContext): Promise<string> {
    const [row] = await db.select().from(blockDefinitions)
      .where(eq(blockDefinitions.type, block.type)).limit(1)
    if (!row) return `<!-- Unknown block: ${block.type} -->`
    const compiled = Handlebars.compile(row.renderTemplate)
    return compiled({ props: block.props, styles: block.styles, ctx })
  }
}

export const registry = new BlockRegistry()
```

### Agent enregistre un nouveau bloc via API:

```
POST /api/v1/block-definitions
{
  "type": "shipping-progress",
  "category": "commerce",
  "label": "Shipping Progress Bar",
  "propsSchema": { /* JSON Schema */ },
  "renderTemplate": "<div class='ship-bar'>...</div>",
  "defaultStyles": { "mobile": { "padding": "12px 16px" } }
}
```

Le serveur persiste en DB → disponible immédiatement, pas de redéploiement.

---

## 5. Template System

### Template Product Page (structure):

```typescript
// src/templates/product-page.ts
export const productPageTemplate = {
  slug: 'product-page',
  type: 'product-page',
  name: 'Product Page — High Converting',
  placeholders: [
    { key: 'HEADLINE',    required: true, mapFromAngle: 'headline',
      description: 'Hero headline — PROMESSE, pas nom produit',
      example: 'Get near instant relief from stiff, achy knees' },
    { key: 'SUBHEADLINE', required: true, mapFromAngle: 'subheadline', ... },
    { key: 'CTA_TEXT',    required: true, mapFromAngle: 'ctaText', example: 'Shop Now →' },
    { key: 'GUARANTEE',   required: true, mapFromAngle: 'guarantee', ... },
    { key: 'HERO_IMAGE',  required: true, description: 'Product in action', ... },
    { key: 'CAROUSEL_IMAGES', required: true, description: '5-10 images', ... },
    { key: 'BENEFITS',    required: true, mapFromAngle: 'benefits', ... },
    { key: 'REVIEWS',     required: true, ... },
    { key: 'BUNDLES',     required: true, ... },
    { key: 'FAQ_ITEMS',   required: true, ... },
    { key: 'COMPARISON',  required: false, ... },
  ],
  globalStyles: {
    backgroundColor: '#ffffff',
    fontFamily: "'Inter', -apple-system, sans-serif",
    maxWidth: '1024px',
    primaryColor: '#ff6b00',
    textColor: '#1a1a1a',
  },
  blocks: [
    // 0 — Hero (above fold, 80% CRO)
    { type: 'hero', props: { headline: '{{HEADLINE}}', cta: { text: '{{CTA_TEXT}}' }, ... } },
    // 1 — Reviews VISIBLES EN HAUT (pas en bas!)
    { type: 'reviews', props: { showOneAndTwoStars: true, ... } },
    // 2 — Product Carousel (min 5 images)
    { type: 'product-carousel', props: { images: '{{CAROUSEL_IMAGES}}' } },
    // 3 — Benefits
    { type: 'benefits-list', props: { items: '{{BENEFITS}}' } },
    // 4 — Trust Badges
    { type: 'trust-badges', props: { ... } },
    // 5 — Bundle Offers (noms logiques, Most Popular badge)
    { type: 'bundle-offers', props: { bundles: '{{BUNDLES}}' } },
    // 6 — Countdown Timer
    { type: 'countdown', props: { style: 'boxes', onExpire: 'reset' } },
    // 7 — Comparison Chart
    { type: 'comparison-chart', props: { ... } },
    // 8 — FAQ (min 5-10)
    { type: 'faq', props: { questions: '{{FAQ_ITEMS}}' } },
    // 9 — Guarantee
    { type: 'guarantee', props: { text: '{{GUARANTEE}}' } },
    // 10 — CTA final
    { type: 'add-to-cart', props: { buttonText: '{{CTA_TEXT}}', behavior: 'direct-checkout' } },
  ]
}

### 5.2 Template VSL (Video Sales Letter)
```typescript
export const vslTemplate = {
  slug: 'vsl-classic',
  blocks: [
    { type: 'hero', props: { headline: '{{HEADLINE}}', video: '{{VIDEO_URL}}' } },
    { type: 'section', props: { children: [
        { type: 'heading', props: { text: 'The Problem' } },
        { type: 'text', props: { content: '{{PROBLEM_TEXT}}' } }
    ]}},
    { type: 'section', props: { children: [
        { type: 'heading', props: { text: 'The Solution' } },
        { type: 'text', props: { content: '{{SOLUTION_TEXT}}' } }
    ]}},
    { type: 'cta', props: { buttons: [{ text: '{{CTA_TEXT}}', action: 'checkout' }] } }
  ]
}
```

### 5.3 Template Optin (Lead Magnet)
```typescript
export const optinTemplate = {
  slug: 'optin-lead-magnet',
  blocks: [
    { type: 'hero', props: { headline: '{{HEADLINE}}', subline: '{{SUBLINE}}' } },
    { type: 'form', props: { fields: ['email', 'first_name'], submitText: '{{CTA_TEXT}}' } },
    { type: 'trust-badges', props: { badges: ['No Spam', 'Secure'] } }
  ]
}
```

### 5.4 Template Listicle (10 Reasons Why)
```typescript
export const listicleTemplate = {
  slug: 'listicle-10-reasons',
  blocks: [
    { type: 'hero', props: { headline: '{{COUNT}} Reasons Why {{TOPIC}}' } },
    { type: 'reasons-list', props: { items: '{{REASONS_JSON}}' } },
    { type: 'cta', props: { text: '{{CTA_TEXT}}', action: 'checkout' } }
  ]
}
```
```

### Fill Template (service):

```typescript
// src/services/template.service.ts
function fillPlaceholders(blocks: Block[], placeholders: TemplatePlaceholder[], data: Record<string, unknown>): Block[] {
  return JSON.parse(JSON.stringify(blocks), (key, value) => {
    if (typeof value === 'string' && value.startsWith('{{') && value.endsWith('}}')) {
      const phKey = value.slice(2, -2).trim()
      return data[phKey] ?? value
    }
    return value
  })
}

// L'angle marketing est injecté PARTOUT automatiquement
function buildTemplateData(angle: MarketingAngle, overrides: Record<string, unknown>): Record<string, unknown> {
  return {
    HEADLINE:    angle.headline,
    SUBHEADLINE: angle.subheadline,
    CTA_TEXT:    angle.ctaText,
    GUARANTEE:   angle.guarantee,
    BENEFITS:    angle.benefits,
    ...overrides, // agent peut override n'importe quel placeholder
  }
}
```

---

## 6. HTML Renderer

```typescript
// src/renderer/html-renderer.ts
function renderPageHtml(page: Page, ctx: RenderContext & { pixelId?: string; ga4Id?: string }): string {
  const blocksHtml = page.blocks.map(b => registry.renderBlock(b, ctx)).join('\n')

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(page.meta.title)}</title>
<meta name="description" content="${esc(page.meta.description ?? '')}">
${page.meta.ogImage ? `<meta property="og:image" content="${page.meta.ogImage}">` : ''}
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
img,video{max-width:100%;height:auto;display:block}
body{font-family:${page.globalStyles.fontFamily};color:${page.globalStyles.textColor};background:${page.globalStyles.backgroundColor};-webkit-font-smoothing:antialiased}
.page-wrapper{max-width:${page.globalStyles.maxWidth};margin:0 auto}
.hide-mobile{display:block}.hide-tablet{display:block}.hide-desktop{display:none}
@media(min-width:768px){.hide-tablet{display:none}.hide-mobile{display:block}}
@media(min-width:1025px){.hide-desktop{display:none}}
</style>
${page.meta.customHead ?? ''}
${ctx.pixelId ? renderFbPixel(ctx.pixelId) : ''}
</head>
<body>
<div class="page-wrapper">${blocksHtml}</div>
<script>
(function(){
  var V='${ctx.variantId}',SID='s_'+Date.now().toString(36);
  function t(e,bid,tag,p){navigator.sendBeacon('/api/v1/t',JSON.stringify({v:V,e:e,bid:bid||'',tag:tag||',p:p||{}}))}
  t('page_view');
  document.addEventListener('click',function(ev){
    var el=ev.target.closest('[data-bid]');
    if(el)t('click',el.dataset.bid,el.dataset.tag)
  });
  var s25=0,s50=0,s75=0,s100=0;
  window.addEventListener('scroll',function(){
    var p=Math.round(window.scrollY/(document.body.scrollHeight-window.innerHeight)*100);
    if(p>=25&&!s25){s25=1;t('scroll','','25%')}
    if(p>=50&&!s50){s50=1;t('scroll','','50%')}
    if(p>=75&&!s75){s75=1;t('scroll','','75%')}
    if(p>=95&&!s100){s100=1;t('scroll','','100%')}
  });
  window._ft=t;
})();
</script>
</body></html>`
}
```

### Tracking script features:
- `< 1KB` minifié
- `sendBeacon` pour fiabilité (ne bloque pas la navigation)
- Click tracking délégué via `data-bid`
- Scroll depth: 25%, 50%, 75%, 100%
- Expose `window._ft()` pour checkout events

---

## 7. Meta CAPI Handler (Server-Side)

```typescript
// src/api/routes/events.ts (Hono)
import { Hono } from 'hono'

const events = new Hono()

// Client-side relay: POST /api/v1/events/capi
events.post('/capi', async (c) => {
  const { event, data, eventId, pageId, variantId, sourceUrl, userAgent, fbc, fbp, email, phone } = await c.req.json()

  const config = await getPixelConfig(pageId)
  if (!config?.accessToken) return c.json({ ok: false }, 400)

  // Build user_data with hashed PII
  const userData: Record<string, string> = { client_user_agent: userAgent }
  if (fbc) userData.fbc = fbc
  if (fbp) userData.fbp = fbp
  if (email) userData.em = sha256(email.trim().toLowerCase())
  if (phone) userData.ph = sha256(phone.replace(/\D/g, ''))

  // Send to Meta CAPI
  await fetch(`https://graph.facebook.com/v19.0/${config.pixelId}/events?access_token=${config.accessToken}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      data: [{
        event_name: event,
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,              // même ID que pixel client → déduplication
        event_source_url: sourceUrl,
        action_source: 'website',
        user_data: userData,
        custom_data: { ...data, variant_id: variantId },
      }],
    }),
  })

  return c.json({ ok: true })
})

// Stripe webhook → Purchase CAPI
// In webhook handler:
// if (event.type === 'payment_intent.succeeded') {
//   await sendCapiEvent('Purchase', { value, currency, content_type: 'product' }, pi.metadata)
// }
```

---

## 8. API Endpoints (Hono.js)

### Création rapide
```
POST /api/v1/funnels/create-from-template
Body: { templateSlug, funnelName, domain, product, angle, placeholders }
Response: { funnelId, steps: [{ stepId, slug, variantId }], previewUrls }

POST /api/v1/funnels/:id/clone
Body: { newName, newAngle, overridePlaceholders? }
Response: { funnelId, clonedFrom }
```

### Manipulation de blocs
```
POST   /api/v1/variants/:variantId/blocks          → Ajouter un bloc
PATCH  /api/v1/variants/:variantId/blocks/:blockId  → Modifier props/styles
DELETE /api/v1/variants/:variantId/blocks/:blockId  → Supprimer
PUT    /api/v1/variants/:variantId/blocks/reorder    → Réordonner
POST   /api/v1/variants/:variantId/blocks/:blockId/clone → Cloner (A/B)
```

### Iteration API (mutations granulaires champ par champ)
```
POST /api/v1/funnels/:id/iterate
Body: {
  mutations: [
    { blockId: "hero-1", field: "props.headline", value: "New headline" },
    { blockId: "cta-2",  field: "props.cta.text", value: "Buy Now" },
    { blockId: "faq-3",  field: "styles.mobile.paddingTop", value: "40px" },
  ]
}
Response: { updated: number, variantId, previewUrl }

// WHY: l'agent peut ajuster un headline sans renvoyer tout le bloc
// field = chemin dot-notation dans le bloc JSON
```

### A/B Testing (Hypothesis-Driven)
```
POST /api/v1/hypotheses
Body: {
  funnelId, stepId,
  title: "Urgency headline beats transformation headline",
  targetVariable: "props.headline",        // dot notation — 1 variable SEULE
  variableCategory: "headline",             // headline|cta|pricing|layout|bundle|image
  aboveFold: true,
  impact: 12, confidence: 8, ease: 10       // ICE score = 960
}
Response: { hypothesisId, priorityScore }
// WHY: chaque test part d'une hypothèse, pas d'un variant random

POST /api/v1/steps/:stepId/tests
Body: { hypothesisId, controlVariantId, challengerOverrides: [{
  blockId: "hero-1",
  propertyPath: "content.headline",
  newValue: "Last chance: 50% off ends tonight"
}] }
// Validation: 1 SEULE variable modifiée (comparée au targetVariable de l'hypothèse)
// Crée: abTest (phase=sandbox) + testVariantMetrics + testQueue entry

POST /api/v1/tests/:testId/start
// Lance le test: status=running, phase=sandbox

GET  /api/v1/tests/:testId/status
Response: {
  phase: "duel",
  variants: [{
    id, name, visitors, clicks, purchases, revenue,
    cvr, aov, aovTimesCvr,
    cvrLower, cvrUpper,                    // Wilson interval
    isSandbox, sandboxPassed,
    eliminatedAt, eliminatedReason
  }],
  thresholds: { ... },
  nextCheckpoint: "Waiting for 30 clicks on leader",
  estimatedTimeToResult: "4 hours"
}

POST /api/v1/tests/:testId/promote/:variantId
// Promouvoir manuellement un winner (override l'auto-promote)

GET  /api/v1/hypotheses?funnelId=xxx&status=draft
// Liste les hypothèses triées par priorityScore (Impact×Confidence×Ease)

POST /api/v1/tests/:testId/challenger
Body: { blockId, propertyPath, newValue }
// Ajoute un challenger au test → entre dans testQueue si duel en cours
```

### Déploiement
```
POST /api/v1/funnels/:id/deploy
Body: { environment: 'preview' | 'production' }
Response: { deployedSteps, urls, r2Keys }
```

### Métriques
```
GET /api/v1/metrics?funnelId=xxx&period=7d
Response: { summary: { aov, cvr, aovTimesCvr, cartToPurchaseRatio }, breakdown: [...] }

POST /api/v1/t/track  (endpoint tracking, appelé par sendBeacon)
Body: { v: variantId, e: eventType, bid: blockId, tag: elementTag }
```

### Block Registry
```
POST /api/v1/block-definitions   → Agent enregistre nouveau type
GET  /api/v1/block-definitions   → Liste tous les types disponibles
```

---

## 9. Déploiement (BullMQ Worker)

```
Agent → POST /api/v1/funnels/create-from-template
  ↓
Hono valide (Zod) → Stocke page JSON dans PostgreSQL
  ↓
POST /api/v1/funnels/:id/deploy → Queue BullMQ job
  ↓
Render Worker:
  1. Charge page JSON depuis DB
  2. Remplit placeholders avec angle marketing
  3. Génère HTML statique via BlockRegistry
  4. Upload sur Cloudflare R2
  5. Update r2Key + deployedUrl dans DB
  ↓
Nginx reverse proxy:
  - Sert HTML depuis R2 (cache 5 min)
  - Assets: cache 1 an
  - Sous-domaines dynamiques par funnel
  - Cookie-based A/B routing
```

---

## 10. Score AOV × CVR — Règles

| Score | Verdict | Action |
|-------|---------|--------|
| 0-100 | Mauvais | Revoir hero + bundles |
| 100-250 | A optimiser | A/B test headline + prix |
| 250-400 | Correct | Optimiser upsells |
| 400+ | Excellent | Scale budget ads |

| ATC:Purchase | Verdict |
|---|---|
| 5:1 | Problème checkout |
| 3:1 | Bon |
| 2:1 | Excellent |

---

## 11. Décisions clés (pourquoi)

| Décision | Choix | Pourquoi |
|---|---|---|
| Stockage blocs | JSONB dans page_variants | Flexibilité agents, pas de migration par bloc |
| Rendering | Server-side HTML statique | Performance pure, pas de JS framework client |
| A/B routing | Cookie + Nginx | HTML 100% statique, routing avant serve |
| Extensibilité blocs | DB registry + Handlebars | Agents ajoutent blocs sans redéployer |
| Templates | JSON avec {{placeholders}} | Un seul appel API remplit tout |
| Métriques | Append-only events → hourly → daily | Requêtes rapides sur dashboards |
| CAPI | Serveur → Meta API | Contourne ad blockers, +70% events trackés |
| Tracking script | Inline < 1KB, sendBeacon | Zero ralentissement, fiable |
| Produit/Bundle/Purchase | Tables séparées | Réutilisable cross-funnel, queryable, pas JSON rigide |
| Iteration API | Mutations champ par champ | Agent ajuste un headline sans renvoyer tout le bloc |
| A/B State Machine | 5 phases (sandbox→champion) | Élimination progressive, pas de gaspillage de trafic |
| Hypothèses first-class | Table dédiée avec ICE scoring | Data-driven, pas au feeling |
| Metrics séparées | test_variant_metrics vs page_variants | Updates fréquents ne bloquent pas la structure |
| Seuils configurables | JSONB thresholds par test | Différents funnels = différents volumes de trafic |
| 1 variable par test | Validation API + targetVariable | Résultats interprétables, pas de confusion |
| Wilson interval | Pour CVR confidence | Meilleur que le Z-test pour petits échantillons |

---

## 12. Déploiement — Docker Compose + Nginx + Variant Router

### Docker Compose (6 services)

```yaml
# docker-compose.yml
services:
  api:
    build: { context: ., dockerfile: Dockerfile }
    ports: ["3000:3000"]
    env_file: .env
    depends_on: [postgres, redis]
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:3000/api/v1/health"]
      interval: 30s
      timeout: 5s
      retries: 3

  worker:
    build: { context: ., dockerfile: Dockerfile.worker }
    env_file: .env
    depends_on: [postgres, redis]
    command: node dist/workers.js

  router:
    build: { context: ., dockerfile: Dockerfile.router }
    ports: ["3001:3001"]
    env_file: .env
    depends_on: [api, redis]

  nginx:
    image: nginx:alpine
    ports: ["80:80", "443:443"]
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - /data/funnels:/data/funnels:ro       # HTML statique servi par Nginx
    depends_on: [router, api]

  postgres:
    image: postgres:16-alpine
    volumes: [pgdata:/var/lib/postgresql/data]
    environment:
      POSTGRES_DB: funnel_builder
      POSTGRES_USER: ${POSTGRES_USER:-postgres}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}

  redis:
    image: redis:7-alpine
    volumes: [redisdata:/data]

volumes:
  pgdata:
  redisdata:
```

### Variant Router (port 3001)

```typescript
// workers/variant-router.ts (Express léger)
// WHY: HTML est 100% statique — le routing A/B doit se faire AVANT de servir le fichier
import express from 'express'
import { getFunnelBySlug, assignVariant } from './services/variant.service'

const app = express()

app.get('*', async (req, res) => {
  const funnelSlug = req.headers['x-funnel-slug'] as string
  if (!funnelSlug) return res.status(400).send('Missing funnel slug')

  const funnel = await getFunnelBySlug(funnelSlug)
  if (!funnel) return res.status(404).send('Funnel not found')

  const cookieName = `fs_v_${funnel.id}`
  let assignedVariantId = req.cookies?.[cookieName]

  if (!assignedVariantId) {
    assignedVariantId = await assignVariant(funnel.id)
    res.cookie(cookieName, assignedVariantId, {
      maxAge: 30 * 24 * 60 * 60 * 1000,   // 30 jours
      httpOnly: true,
      secure: true,
    })
  }

  // HTML statique servi depuis le disque (déployé par BullMQ worker)
  const htmlPath = `/data/funnels/${funnelSlug}/${assignedVariantId}.html`
  res.sendFile(htmlPath)
})

app.listen(3001)
```

### Nginx config (simplifié)

```nginx
server {
  listen 80;
  server_name ~^(?<subdomain>.+)\.nutrovia\.co$;

  # Static assets — cache 1 an
  location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2)$ {
    root /data/funnels;
    expires 365d;
    add_header Cache-Control "public, immutable";
  }

  # HTML — route via Variant Router (cookie-based A/B)
  location / {
    proxy_pass http://router:3001;
    proxy_set_header X-Funnel-Slug $subdomain;
    proxy_set_header Host $host;
  }

  # API routes — proxy vers Hono
  location /api/ {
    proxy_pass http://api:3000;
  }
}
```

---

## 13. Variables d'environnement

```bash
# === Core ===
DATABASE_URL=postgresql://user:pass@host:5432/funnel_builder
REDIS_URL=redis://redis:6379
BASE_DOMAIN=nutrovia.co

# === Auth ===
BETTER_AUTH_SECRET=xxx
AGENT_API_KEYS=key1,key2,key3                # Bearer tokens pour agents AI

# === Stripe ===
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...

# === Meta CAPI ===
FB_PIXEL_ID=xxx
FB_CAPI_ACCESS_TOKEN=xxx
FB_TEST_EVENT_CODE=TESTxxxxx                 # Optionnel, pour debug

# === Cloudflare R2 (optional, fallback: local disk) ===
CLOUDFLARE_R2_ACCOUNT_ID=xxx
CLOUDFLARE_R2_ACCESS_KEY_ID=xxx
CLOUDFLARE_R2_SECRET_ACCESS_KEY=xxx
CLOUDFLARE_R2_BUCKET=funnels
CLOUDFLARE_R2_PUBLIC_URL=https://cdn.nutrovia.co

# === Funnel Data ===
FUNNELS_DATA_DIR=/data/funnels               # Local HTML output dir

# === Admin (basic auth en production) ===
ADMIN_USERNAME=admin
ADMIN_PASSWORD=xxx

# === App URL ===
NEXT_PUBLIC_APP_URL=https://app.nutrovia.co

# === Meta Marketing API (Ads Automation) ===
META_APP_ID=xxx
META_APP_SECRET=xxx
META_SYSTEM_USER_TOKEN=xxx                         # Long-lived system user token
META_BUSINESS_ID=xxx
META_API_VERSION=v21.0
META_RATE_LIMIT_PER_HOUR=180                       # Safety margin under 200
```

---

## 14. Facebook Ads Automation Engine

> Issu du Prompt 3 — comparaison de 6 réponses IA. Intégré à l'architecture existante.

### Architecture globale

```
┌──────────────────────────────────────────────────────────┐
│                    FACEBOOK ADS ENGINE                    │
│                                                          │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │   RESEARCH   │  │   CAMPAIGN   │  │   CREATIVE     │  │
│  │   ENGINE     │  │   MANAGER    │  │   PIPELINE     │  │
│  │             │  │             │  │               │  │
│  │ Google Trends│  │ State Machine│  │ Batch 15-25   │  │
│  │ Reddit/Forums│  │ Testing→CBO  │  │ Templates     │  │
│  │ Amazon Reviews│ │ →Zombie→Champ│  │ Image/Video   │  │
│  └──────┬──────┘  └──────┬───────┘  └───────┬────────┘  │
│         │                │                    │           │
│  ┌──────┴────────────────┴────────────────────┴───────┐  │
│  │              BUDGET OPTIMIZER                        │  │
│  │              (20% rule + scaling tiers + backward)   │  │
│  └──────────────────────┬─────────────────────────────┘  │
│                          │                               │
│  ┌───────────────────────┴─────────────────────────────┐  │
│  │              LANDING PAGE ROUTER                      │  │
│  │              (auto LP per angle + OG tags + URL map)  │  │
│  └──────────────────────┬─────────────────────────────┘  │
│                          │                               │
│  ┌───────────────────────┴─────────────────────────────┐  │
│  │              KPI DASHBOARD + ALERTS                   │  │
│  │              (AOV×CVR, CPA, ROAS par ad/angle)       │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                          │
│  API: Meta Marketing API v21.0 + Custom Tracking Domain   │
│  DB: 9 nouvelles tables dans notre PostgreSQL existant     │
│  Jobs: BullMQ workers pour sync + optimisation             │
└──────────────────────────────────────────────────────────┘
```

### 14.1 Types TypeScript — Ads

```typescript
// src/types/ads.types.ts

// ============================================
// META API CONFIG
// ============================================

interface MetaApiConfig {
  accessToken: string              // System user token (long-lived)
  adAccountId: string              // act_xxxxxxxx
  pixelId: string                  // Meta Pixel ID
  businessId: string               // Business Manager ID
  appSecret?: string               // For appsecret_proof
  apiVersion: 'v21.0'
}

// WHY: constantes critiques — limites Meta à respecter pour éviter les bans
const META_API_LIMITS = {
  rateLimitPerHour: 200,           // par ad account
  maxAdsPerCampaign: 50,
  maxAdsetsPerCampaign: 5000,
  maxCreativesPerAdset: 50,
  videoMaxSizeMB: 4096,
  imageMaxSizeMB: 30,
  imageMinResolution: '600x600',
  imageRecommendedResolution: '1080x1080',
  videoMinDuration: 1,
  videoMaxDuration: 241,
  textLimits: {
    primaryText: 125,              // au-delà = "See More"
    headline: 40,
    description: 30,
  },
} as const

// ============================================
// CAMPAIGN TYPES
// ============================================

type CampaignType = 'testing' | 'cbo_scaling' | 'zombie_cost_cap'
type CampaignPhase = 'phase1_validation' | 'phase2_scaling'
type AdFate = 'winner' | 'almost' | 'loser' | 'pending'
type CampaignStatus = 'draft' | 'active' | 'paused' | 'completed' | 'killed'

// NOTE: CampaignPhase (phase1_validation / phase2_scaling) = PHASES PRODUIT
// Après qu'un produit existe. Différent de ResearchPhase (§32) = PHASES RECHERCHE avant produit.

// ============================================
// NICHE & ANGLE RESEARCH
// ============================================

interface NicheResearch {
  id: string
  name: string                     // "knee-pain-seniors"
  category: string                 // "health" | "beauty" | "fitness" | "pets" | ...
  trendsData?: {
    interestOverTime: Array<{ date: string; value: number }>
    relatedQueries: string[]
    risingTerms: string[]
  }
  competitorAds?: Array<{
    imageUrl: string; headline: string; copy: string; estimatedSpend?: string
  }>
  painPoints: string[]
  desireStatements: string[]
  difficulty: number               // 1-10
  opportunityScore: number         // Impact × Confidence
}

interface AngleResearch {
  id: string
  nicheId: string
  name: string                     // "testo-productivite-h25"
  painPoint: string
  desire: string
  promise: string
  avatar: {
    ageRange: [number, number]
    gender: 'male' | 'female' | 'all'
    situation: string              // "office worker, sedentary"
    language: string
  }
  emotion: 'fear' | 'anger' | 'desire' | 'curiosity' | 'hope' | 'surprise'
  awarenessLevel: 'unaware' | 'problem_aware' | 'solution_aware' | 'product_aware' | 'most_aware'
  funnelStage: 'tofu' | 'mofu' | 'bofu' | 'retention' | 'reactivation'
  cpc?: number
  ctr?: number
  status: 'research' | 'phase1_testing' | 'phase1_validated' | 'phase2_active' | 'paused' | 'killed'
}

// ============================================
// CAMPAIGN / ADSET / AD
// ============================================

interface AdCampaign {
  id: string
  type: CampaignType
  phase: CampaignPhase
  name: string                     // "[Type] - [Angle] - [Avatar] - [Date]"
  adAccountId: string
  funnelId?: string
  angleId: string
  budgetDaily: number              // cents
  targetCpa?: number               // for Zombie
  currency: string
  testCountry?: string             // 'PH' | 'ZA'
  status: CampaignStatus
  minimumRunDays: number           // 3 for testing, 0 for others
  metaCampaignId?: string
  startedAt?: string
}

interface AdSet {
  id: string
  campaignId: string
  name: string
  targeting: {
    countries: string[]
    ageMin: number
    ageMax: number
    genders: Array<1 | 2>
    broadTargeting?: boolean
    lookalikeAudienceId?: string
    interestIds?: string[]
    customAudienceIds?: string[]
  }
  landingPageSlug: string
  landingPageUrl: string
  budgetDaily?: number
  status: 'active' | 'paused'
  metaAdSetId?: string
}

interface Ad {
  id: string
  adSetId: string
  name: string                     // "[Concept] - [Hook #] - [Format]"
  format: 'image' | 'video'
  creativeType:
    | 'founder_story' | 'ugc_viral' | 'education' | 'antagoniste'
    | 'stop_doing' | 'skeptic' | 'problem_solution' | 'life_hack'
    | 'comparison' | 'product_demo' | 'before_after' | 'review'
    | 'micro_trottoir' | 'podcast_clip' | 'testimonial' | 'cartoon'
    | 'role_play' | 'mixed'
    | 'problem_callout' | 'reviews_screenshot' | 'us_vs_them'
    | 'feature_callout' | 'static_ad' | 'ugly_ad' | 'comment_response'
    | 'fake_tweet' | 'post_it' | 'screenshot_mail' | 'shocking_image'
  funnelStage: 'tofu' | 'mofu' | 'bofu' | 'retention' | 'reactivation'
  headline: string
  primaryText: string
  ctaText: string
  callToAction: 'LEARN_MORE' | 'SHOP_NOW' | 'DISCOVER' | 'BUY_NOW'
  imageUrl?: string
  videoUrl?: string
  thumbnailUrl?: string
  urlTags?: string
  status: 'draft' | 'active' | 'paused' | 'killed'
  fate: AdFate
  fateReason?: string
  metaAdId?: string
  metaCreativeId?: string
  reviewedAt?: string
}

// ============================================
// AD METRICS (synced daily from Meta API)
// ============================================

interface AdMetrics {
  adId: string
  date: string
  spend: number; impressions: number; clicks: number
  cpc: number; cpm: number; ctr: number
  landingPageViews: number; addToCarts: number; initiateCheckouts: number
  purchases: number; purchaseValue: number
  cvr: number; aov: number; aovTimesCvr: number
  cpa: number; roas: number; atcToPurchaseRatio: number
  videoViews25: number; videoViews50: number; videoViews75: number; videoViews100: number
}

// ============================================
// CREATIVE TEMPLATE
// WHY: chaque format créatif a une structure reproductible
// ============================================

interface CreativeTemplate {
  id: string
  format: Ad['creativeType']
  funnelStage: 'tofu' | 'mofu' | 'bofu' | 'retention' | 'reactivation'
  template: {
    hookStructures: string[]       // ["[SHOCKING STAT] + [IMPLICATION]", ...]
    bodyStructures: string[]       // ["[STORY] → [DISCOVERY] → [RESULT]", ...]
    ctaVariants: string[]          // ["En savoir plus", "Découvrir pourquoi", ...]
    visualGuidance: string
    emotionGuide: string
    metaComplianceNotes: string    // "Use 'Je/Ils' only, never 'Tu'"
  }
  placeholderKeys: string[]        // ["PAIN_POINT", "DESIRED_RESULT", "TIMEFRAME"]
}

// ============================================
// BUDGET ALLOCATION (20% rule)
// ============================================

interface BudgetAllocation {
  id: string
  funnelId?: string
  totalDailyBudget: number
  testingBudget: number            // 20% of total
  scalingBudget: number            // 80% of total
  cboBudget: number                // 70% of scaling
  zombieBudget: number             // 30% of scaling
  testingCreativeBudget: number    // 75% of testing
  testingLpBudget: number          // 25% of testing
  dailyCreativesNeeded: number
  videoEditorsNeeded: number
  copywritersNeeded: number
}

// ============================================
// ALERT SYSTEM
// ============================================

interface AdAlert {
  id: string
  type: 'cpa_explosion' | 'roas_drop' | 'spike_spend' | 'creative_fatigue' | 'budget_depleted'
  severity: 'info' | 'warning' | 'critical'
  campaignId?: string
  adId?: string
  message: string
  data: Record<string, unknown>
  acknowledgedAt?: string
}
```

### 14.2 Schéma DB — 9 nouvelles tables

```typescript
// Ajout au schema Drizzle existant

const campaignTypeEnum = pgEnum('campaign_type', ['testing', 'cbo_scaling', 'zombie_cost_cap'])
const campaignPhaseEnum = pgEnum('campaign_phase', ['phase1_validation', 'phase2_scaling'])
const adFateEnum = pgEnum('ad_fate', ['winner', 'almost', 'loser', 'pending'])
const adsFunnelStageEnum = pgEnum('ads_funnel_stage', ['tofu', 'mofu', 'bofu', 'retention', 'reactivation'])
const alertSeverityEnum = pgEnum('alert_severity', ['info', 'warning', 'critical'])

// === META AD ACCOUNTS (1 per funnel, fresh) ===
// WHY: chaque funnel a son propre ad account — jamais réutiliser un compte avec des campagnes supprimées
export const metaAdAccounts = pgTable('meta_ad_accounts', {
  id:               uuid('id').defaultRandom().primaryKey(),
  funnelId:         uuid('funnel_id').references(() => funnels.id),
  metaAdAccountId:  text('meta_ad_account_id').notNull(),
  accessToken:      text('access_token').notNull(),          // encrypted
  pixelId:          text('pixel_id').notNull(),
  businessId:       text('business_id'),
  appSecret:        text('app_secret'),
  trackingDomain:   text('tracking_domain'),                 // t.domaine.com
  currency:         text('currency').default('USD'),
  isFresh:          boolean('is_fresh').default(true),        // WHY: fresh account check
  isActive:         boolean('is_active').default(true),

  // === SIGNAL QUALITY (Andromeda) ===
  // WHY: Without good signal, Andromeda can't scale. Event Match Quality = Meta's score
  // for how well your server-side events match real users. Score 0-10.
  // Low signal = Meta can't find lookalikes = scaling blocked.
  // Server-side tracking via own domain (already have CAPI) = primary signal source.
  signalQualityScore: numeric('signal_quality_score', { precision: 4, scale: 2 }).default('0'),
  eventMatchQuality:  numeric('event_match_quality', { precision: 4, scale: 2 }).default('0'),
  lastSignalCheckAt:  timestamp('last_signal_check_at'),

  createdAt:        timestamp('created_at').defaultNow().notNull(),
}, t => [uniqueIndex('ad_account_meta_idx').on(t.metaAdAccountId)])

// === NICHE RESEARCH ===
export const nicheResearch = pgTable('niche_research', {
  id:               uuid('id').defaultRandom().primaryKey(),
  name:             text('name').notNull(),
  category:         text('category').notNull(),
  trendsData:       jsonb('trends_data').$type<NicheResearch['trendsData']>(),
  painPoints:       jsonb('pain_points').$type<string[]>().default([]),
  desireStatements: jsonb('desire_statements').$type<string[]>().default([]),
  competitorAds:    jsonb('competitor_ads').$type<NicheResearch['competitorAds']>(),
  difficulty:       integer('difficulty').default(5),
  opportunityScore: numeric('opportunity_score', { precision: 6, scale: 2 }).default('0'),
  status:           text('status').$type<'research'|'testing'|'validated'|'killed'>().default('research'),
  createdAt:        timestamp('created_at').defaultNow().notNull(),
  updatedAt:        timestamp('updated_at').defaultNow().notNull(),
})

// === ANGLE RESEARCH ===
export const angleResearch = pgTable('angle_research', {
  id:               uuid('id').defaultRandom().primaryKey(),
  nicheId:          uuid('niche_id').references(() => nicheResearch.id).notNull(),
  name:             text('name').notNull(),
  painPoint:        text('pain_point').notNull(),
  desire:           text('desire').notNull(),
  promise:          text('promise').notNull(),
  avatar:           jsonb('avatar').$type<AngleResearch['avatar']>().notNull(),
  emotion:          text('emotion').notNull(),
  awarenessLevel:   text('awareness_level').notNull(),
  funnelStage:      adsFunnelStageEnum('funnel_stage').default('tofu'),
  landingPageSlug:  text('landing_page_slug'),
  cpc:              numeric('cpc', { precision: 10, scale: 4 }),
  ctr:              numeric('ctr', { precision: 6, scale: 4 }),
  status:           text('status').$type<AngleResearch['status']>().default('research'),
  createdAt:        timestamp('created_at').defaultNow().notNull(),
  updatedAt:        timestamp('updated_at').defaultNow().notNull(),
}, t => [index('angle_niche_idx').on(t.nicheId)])

// === CAMPAIGNS ===
export const adCampaigns = pgTable('ad_campaigns', {
  id:                uuid('id').defaultRandom().primaryKey(),
  type:              campaignTypeEnum('type').notNull(),
  phase:             campaignPhaseEnum('phase').default('phase1_validation'),
  name:              text('name').notNull(),
  adAccountId:       uuid('ad_account_id').references(() => metaAdAccounts.id).notNull(),
  funnelId:          uuid('funnel_id').references(() => funnels.id),
  angleId:           uuid('angle_id').references(() => angleResearch.id).notNull(),
  budgetDaily:       integer('budget_daily').notNull(),
  targetCpa:         integer('target_cpa'),
  currency:          text('currency').default('USD'),
  testCountry:       text('test_country'),
  status:            text('status').$type<CampaignStatus>().default('draft'),
  minimumRunDays:    integer('minimum_run_days').default(3),
  metaCampaignId:    text('meta_campaign_id'),
  startedAt:         timestamp('started_at'),
  endedAt:           timestamp('ended_at'),
  createdAt:         timestamp('created_at').defaultNow().notNull(),
  updatedAt:         timestamp('updated_at').defaultNow().notNull(),
}, t => [
  index('campaigns_account_idx').on(t.adAccountId),
  index('campaigns_angle_idx').on(t.angleId),
  index('campaigns_type_status').on(t.type, t.status),
])

// === ADSETS ===
export const adSets = pgTable('ad_sets', {
  id:               uuid('id').defaultRandom().primaryKey(),
  campaignId:       uuid('campaign_id').references(() => adCampaigns.id, { onDelete: 'cascade' }).notNull(),
  name:             text('name').notNull(),
  targeting:        jsonb('targeting').$type<AdSet['targeting']>().notNull(),
  landingPageSlug:  text('landing_page_slug').notNull(),
  landingPageUrl:   text('landing_page_url').notNull(),
  budgetDaily:      integer('budget_daily'),
  costCap:          integer('cost_cap'),             // WHY: pour Zombie dynamic adjustment
  status:           text('status').$type<'active'|'paused'>().default('active'),
  metaAdSetId:      text('meta_ad_set_id'),
  createdAt:        timestamp('created_at').defaultNow().notNull(),
}, t => [index('adsets_campaign_idx').on(t.campaignId)])

// === ADS ===
export const ads = pgTable('ads', {
  id:               uuid('id').defaultRandom().primaryKey(),
  adSetId:          uuid('ad_set_id').references(() => adSets.id, { onDelete: 'cascade' }).notNull(),
  name:             text('name').notNull(),
  format:           text('format').$type<'image'|'video'>().notNull(),
  creativeType:     text('creative_type').notNull(),
  funnelStage:      adsFunnelStageEnum('funnel_stage').default('tofu'),
  headline:         text('headline').notNull(),
  primaryText:      text('primary_text').notNull(),
  description:      text('description'),
  ctaText:          text('cta_text').notNull(),
  callToAction:     text('call_to_action').default('LEARN_MORE'),
  imageUrl:         text('image_url'),
  videoUrl:         text('video_url'),
  thumbnailUrl:     text('thumbnail_url'),
  urlTags:          text('url_tags'),

  // === ENTITY ID (Meta Andromeda) ===
  // WHY: Meta groups similar ads under same Entity ID — they compete against each other.
  // Creative Diversity hierarchy: Format > Vehicle > Persona > Message.
  // Each entity should have max 1 ad per "slot" in the hierarchy.
  // Without Entity ID management, ads cannibalize each other → higher CPM, lower reach.
  entityId:          text('entity_id'),
  entitySlot:        text('entity_slot').$type<'format'|'vehicle'|'persona'|'message'>(),

  // === PARTNERSHIP ADS & WHITELISTING ===
  // WHY: Ads from creator handles or non-brand pages get more trust at TOFU.
  // Partnership Ads = ads shown from creator's handle, not brand page.
  // Need different ad accounts per creator for Meta compliance.
  creatorProfileId:  uuid('creator_profile_id').references(() => creatorProfiles.id),
  isWhitelisted:     boolean('is_whitelisted').default(false),
  postingAsPage:     text('posting_as_page'),            // Meta page ID to post from

  status:           text('status').$type<Ad['status']>().default('draft'),
  fate:             adFateEnum('fate').default('pending'),
  fateReason:       text('fate_reason'),
  metaAdId:         text('meta_ad_id'),
  metaCreativeId:   text('meta_creative_id'),
  reviewedAt:       timestamp('reviewed_at'),
  createdAt:        timestamp('created_at').defaultNow().notNull(),
  updatedAt:        timestamp('updated_at').defaultNow().notNull(),
}, t => [
  index('ads_adset_idx').on(t.adSetId),
  index('ads_fate_idx').on(t.fate, t.status),
  index('ads_entity_idx').on(t.entityId),
])

// === AD METRICS DAILY ===
export const adMetricsDaily = pgTable('ad_metrics_daily', {
  id:                  uuid('id').defaultRandom().primaryKey(),
  adId:                uuid('ad_id').references(() => ads.id, { onDelete: 'cascade' }).notNull(),
  campaignId:          uuid('campaign_id').references(() => adCampaigns.id).notNull(),
  date:                timestamp('date').notNull(),
  spend:               integer('spend').default(0),
  impressions:         integer('impressions').default(0),
  clicks:              integer('clicks').default(0),
  cpc:                 numeric('cpc', { precision: 10, scale: 4 }).default('0'),
  cpm:                 numeric('cpm', { precision: 10, scale: 4 }).default('0'),
  ctr:                 numeric('ctr', { precision: 6, scale: 4 }).default('0'),
  landingPageViews:    integer('landing_page_views').default(0),
  addToCarts:           integer('add_to_carts').default(0),
  initiateCheckouts:   integer('initiate_checkouts').default(0),
  purchases:           integer('purchases').default(0),
  purchaseValue:       integer('purchase_value').default(0),
  cvr:                 numeric('cvr', { precision: 6, scale: 4 }).default('0'),
  aov:                 numeric('aov', { precision: 12, scale: 2 }).default('0'),
  aovTimesCvr:         numeric('aov_times_cvr', { precision: 10, scale: 4 }).default('0'),
  cpa:                 numeric('cpa', { precision: 12, scale: 2 }).default('0'),
  roas:                numeric('roas', { precision: 8, scale: 4 }).default('0'),
  atcToPurchaseRatio:  numeric('atc_purchase_ratio', { precision: 6, scale: 2 }).default('0'),
  videoViews25:        integer('video_views_25').default(0),
  videoViews50:        integer('video_views_50').default(0),
  videoViews75:        integer('video_views_75').default(0),
  videoViews100:       integer('video_views_100').default(0),

  // === INCREMENTAL METRICS (Andromeda) ===
  // WHY: Incremental Attribution ≠ ROAS. ROAS counts last-second impression conversions.
  // Incremental = would this conversion have happened WITHOUT the ad?
  // CPMR = CPM × Frequency — must decrease with creative diversity.
  // Incremental Reach % = aim for 10%, below = diminishing returns.
  cpmr:                numeric('cpmr', { precision: 10, scale: 4 }).default('0'),
  incrementalReachPct: numeric('incremental_reach_pct', { precision: 6, scale: 4 }).default('0'),
  incrementalConversions: integer('incremental_conversions').default(0),
  incrementalRoas:     numeric('incremental_roas', { precision: 8, scale: 4 }).default('0'),
}, t => [
  uniqueIndex('metrics_ad_date').on(t.adId, t.date),
  index('metrics_campaign_date').on(t.campaignId, t.date),
  index('metrics_date').on(t.date),
])

// === CREATIVE TEMPLATES ===
// WHY: templates reproductibles par format créatif — les agents AI les utilisent pour générer des batchs
export const creativeTemplates = pgTable('creative_templates', {
  id:               uuid('id').defaultRandom().primaryKey(),
  name:             text('name').notNull(),
  format:           text('format').notNull(),              // creativeType value
  funnelStage:      adsFunnelStageEnum('funnel_stage').notNull(),
  hookStructures:   jsonb('hook_structures').$type<string[]>().default([]),
  bodyStructures:   jsonb('body_structures').$type<string[]>().default([]),
  ctaVariants:      jsonb('cta_variants').$type<string[]>().default([]),
  visualGuidance:   text('visual_guidance'),
  emotionGuide:     text('emotion_guide'),
  metaCompliance:   text('meta_compliance'),               // "Use 'Je/Ils' only, never 'Tu'"
  placeholderKeys:  jsonb('placeholder_keys').$type<string[]>().default([]),
  createdAt:        timestamp('created_at').defaultNow().notNull(),
})

// === BUDGET ALLOCATIONS ===
export const budgetAllocations = pgTable('budget_allocations', {
  id:                    uuid('id').defaultRandom().primaryKey(),
  funnelId:              uuid('funnel_id').references(() => funnels.id),
  totalDailyBudget:      integer('total_daily_budget').notNull(),
  testingBudget:         integer('testing_budget').notNull(),       // 20%
  scalingBudget:         integer('scaling_budget').notNull(),       // 80%
  cboBudget:             integer('cbo_budget').notNull(),           // 70% of scaling
  zombieBudget:          integer('zombie_budget').notNull(),        // 30% of scaling
  testingCreativeBudget: integer('testing_creative_budget').notNull(), // 75% of testing
  testingLpBudget:       integer('testing_lp_budget').notNull(),    // 25% of testing
  dailyCreativesNeeded:  integer('daily_creatives_needed').default(0),
  videoEditorsNeeded:    integer('video_editors_needed').default(1),
  copywritersNeeded:     integer('copywriters_needed').default(1),
  updatedAt:             timestamp('updated_at').defaultNow().notNull(),
}, t => [index('budget_funnel_idx').on(t.funnelId)])

// === ALERTS ===
export const adAlerts = pgTable('ad_alerts', {
  id:              uuid('id').defaultRandom().primaryKey(),
  type:            text('type').notNull(),
  severity:        alertSeverityEnum('severity').default('info'),
  campaignId:      uuid('campaign_id').references(() => adCampaigns.id),
  adId:            uuid('ad_id').references(() => ads.id),
  message:         text('message').notNull(),
  data:            jsonb('data').default({}),
  acknowledgedAt:  timestamp('acknowledged_at'),
  createdAt:       timestamp('created_at').defaultNow().notNull(),
}, t => [index('alerts_severity_idx').on(t.severity, t.acknowledgedAt)])
```

### 14.3 Drizzle Relations — Ads

```typescript
export const metaAdAccountsRelations = relations(metaAdAccounts, ({ one, many }) => ({
  funnel: one(funnels, { fields: [metaAdAccounts.funnelId], references: [funnels.id] }),
  campaigns: many(adCampaigns),
}))

export const nicheResearchRelations = relations(nicheResearch, ({ many }) => ({
  angles: many(angleResearch),
}))

export const angleResearchRelations = relations(angleResearch, ({ one, many }) => ({
  niche: one(nicheResearch, { fields: [angleResearch.nicheId], references: [nicheResearch.id] }),
  campaigns: many(adCampaigns),
}))

export const adCampaignsRelations = relations(adCampaigns, ({ one, many }) => ({
  adAccount: one(metaAdAccounts, { fields: [adCampaigns.adAccountId], references: [metaAdAccounts.id] }),
  funnel: one(funnels, { fields: [adCampaigns.funnelId], references: [funnels.id] }),
  angle: one(angleResearch, { fields: [adCampaigns.angleId], references: [angleResearch.id] }),
  adSets: many(adSets),
  metrics: many(adMetricsDaily),
  alerts: many(adAlerts),
}))

export const adSetsRelations = relations(adSets, ({ one, many }) => ({
  campaign: one(adCampaigns, { fields: [adSets.campaignId], references: [adCampaigns.id] }),
  ads: many(ads),
}))

export const adsRelations = relations(ads, ({ one, many }) => ({
  adSet: one(adSets, { fields: [ads.adSetId], references: [adSets.id] }),
  metrics: many(adMetricsDaily),
  alerts: many(adAlerts),
}))

export const adMetricsDailyRelations = relations(adMetricsDaily, ({ one }) => ({
  ad: one(ads, { fields: [adMetricsDaily.adId], references: [ads.id] }),
  campaign: one(adCampaigns, { fields: [adMetricsDaily.campaignId], references: [adCampaigns.id] }),
}))

export const budgetAllocationsRelations = relations(budgetAllocations, ({ one }) => ({
  funnel: one(funnels, { fields: [budgetAllocations.funnelId], references: [funnels.id] }),
}))

export const adAlertsRelations = relations(adAlerts, ({ one }) => ({
  campaign: one(adCampaigns, { fields: [adAlerts.campaignId], references: [adCampaigns.id] }),
  ad: one(ads, { fields: [adAlerts.adId], references: [ads.id] }),
}))

// === CREATOR PROFILES (Partnership Ads & Whitelisting) ===
// WHY: Partnership Ads = ads shown from creator's handle, not brand page.
// Meta requires whitelisting per creator. Different ad accounts per creator for compliance.
// At TOFU, creator-handle ads get 2-3x higher engagement than brand-page ads.
export const creatorProfiles = pgTable('creator_profiles', {
  id:               uuid('id').defaultRandom().primaryKey(),
  name:             text('name').notNull(),
  metaPageId:       text('meta_page_id'),
  metaHandle:       text('meta_handle'),
  adAccountId:      text('ad_account_id'),              // Dedicated ad account per creator
  isWhitelisted:    boolean('is_whitelisted').default(false),
  whitelistedAt:    timestamp('whitelisted_at'),
  nicheCategory:    text('niche_category'),
  followerCount:    integer('follower_count'),
  avgEngagementRate: numeric('avg_engagement_rate', { precision: 4, scale: 2 }),
  isActive:         boolean('is_active').default(true),
  createdAt:        timestamp('created_at').defaultNow().notNull(),
  updatedAt:        timestamp('updated_at').defaultNow().notNull(),
})

// === AUDIENCE NETWORK A/B TEST CONFIG ===
// WHY: Audience Network has ~47% bot click rate. BUT: blindly banning may lose cheap conversions.
// EVERYTHING must be A/B testable. Some niches/products may actually perform well on AN.
// This table stores per-campaign A/B test results for AN vs no-AN.
export const placementTests = pgTable('placement_tests', {
  id:                uuid('id').defaultRandom().primaryKey(),
  campaignId:        uuid('campaign_id').references(() => adCampaigns.id).notNull(),
  testType:          text('test_type').$type<'audience_network'|'reels'|'stories'|'feed_priority'>().notNull(),
  variantA:          jsonb('variant_a').$type<{ placements: string[]; budgetPct: number }>().notNull(),
  variantB:          jsonb('variant_b').$type<{ placements: string[]; budgetPct: number }>().notNull(),
  status:            text('status').$type<'draft'|'running'|'completed'>().default('draft'),
  winnerVariant:     text('winner_variant').$type<'A'|'B'|'tie'>(),
  metricsA:          jsonb('metrics_a').$type<{ spend: number; conversions: number; cpa: number; botClickPct?: number }>(),
  metricsB:          jsonb('metrics_b').$type<{ spend: number; conversions: number; cpa: number; botClickPct?: number }>(),
  startedAt:         timestamp('started_at'),
  completedAt:       timestamp('completed_at'),
  createdAt:         timestamp('created_at').defaultNow().notNull(),
}, t => [index('placement_test_campaign').on(t.campaignId)])
```

### 14.4 Campaign Manager — State Machine

```typescript
// src/services/campaign-manager.ts

class CampaignManager {
  // Ad fate decision after 3-day minimum
  async reviewAd(adId: string, targetCpa: number): Promise<AdFate> {
    const metrics = await this.getAggregatedMetrics(adId, 3)

    if (metrics.purchases === 0 && metrics.spend > 5000) {
      return this.assignFate(adId, 'loser', 'no_purchases_3_days')
    }

    const cpa = metrics.spend / metrics.purchases

    if (cpa <= targetCpa) {
      return this.assignFate(adId, 'winner', `cpa_${cpa.toFixed(0)}_under_target_${targetCpa}`)
    }
    if (cpa <= targetCpa * 1.5) {
      return this.assignFate(adId, 'almost', `cpa_${cpa.toFixed(0)}_1.5x_target`)
    }
    return this.assignFate(adId, 'loser', `cpa_${cpa.toFixed(0)}_2x_plus_target`)
  }

  // Winner → CBO Scaling
  async promoteToCbo(adId: string): Promise<string> {
    // WHY: dupliquer, jamais déplacer — garder l'historique dans la campagne testing
    const ad = await db.query.ads.findFirst({ where: eq(ads.id, adId) })
    const adSet = await db.query.adSets.findFirst({ where: eq(adSets.id, ad.adSetId) })
    const campaign = await db.query.adCampaigns.findFirst({ where: eq(adCampaigns.id, adSet.campaignId) })

    let cboCampaign = await db.query.adCampaigns.findFirst({
      where: and(
        eq(adCampaigns.angleId, campaign.angleId),
        eq(adCampaigns.type, 'cbo_scaling'),
        eq(adCampaigns.status, 'active'),
      ),
    })

    if (!cboCampaign) {
      const metaCampaignId = await metaApi.createCampaign({ ... })
      cboCampaign = await db.insert(adCampaigns).values({ type: 'cbo_scaling', ... }).returning().then(r => r[0])
    }

    const { adId: newAdId } = await metaApi.createAd({ ...ad, adSetId: cboAdSet.metaAdSetId })
    return newAdId
  }

  // Almost → Zombie Cost Cap
  async promoteToZombie(adId: string, targetCpa: number): Promise<string> {
    // WHY: Zombie = budget display 100K, dépense réelle 2K-25K selon opportunités
    // Cost cap = target CPA → Meta ne dépense que si atteignable
    // Similaire à promoteToCbo mais crée zombie campaign avec cost cap
  }

  // Phase Produit 1 → Phase Produit 2 graduation check
  // WHY: Phase 1 = validation (CPC < $0.50, CTR > 2%, 200+ clicks)
  // Phase 2 = scaling US avec CBO + Zombie
  // ATTENTION: ne PAS confondre avec ResearchPhase (§32) qui est AVANT produit
  async checkPhase1Graduation(angleId: string): Promise<boolean> {
    const criteria = { maxCpc: 50, minCtr: 2.0, minClicks: 200 }  // cents, %, count
    // WHY: CPC < $0.50 ET CTR > 2% ET 200+ clicks = signal fort pour scaling US
    // ...aggregate metrics and compare
  }
}
```

### 14.5 Budget Optimizer — Règle des 20% + Scaling Tiers

```typescript
// src/services/budget-optimizer.ts

class BudgetOptimizer {
  calculateAllocation(totalDailyBudget: number): Omit<BudgetAllocation, 'id' | 'updatedAt'> {
    const testingBudget = Math.round(totalDailyBudget * 0.20)
    const scalingBudget = totalDailyBudget - testingBudget
    const cboBudget = Math.round(scalingBudget * 0.70)       // WHY: 70/30 split CBO/Zombie
    const zombieBudget = scalingBudget - cboBudget
    const testingCreativeBudget = Math.round(testingBudget * 0.75)
    const testingLpBudget = testingBudget - testingCreativeBudget

    // Backward math: combien de créas par jour?
    const avgCpcUs = 150                                       // cents
    const creativesPerCampaign = 20
    const campaignsCount = Math.ceil(testingCreativeBudget / 30000) // $300/campaign
    const totalCreatives = campaignsCount * creativesPerCampaign
    const videoEditorsNeeded = Math.ceil(totalCreatives * 0.4 / 10)
    const copywritersNeeded = Math.ceil(totalCreatives * 0.3 / 20)

    return {
      totalDailyBudget, testingBudget, scalingBudget,
      cboBudget, zombieBudget, testingCreativeBudget, testingLpBudget,
      dailyCreativesNeeded: totalCreatives,
      videoEditorsNeeded, copywritersNeeded,
    }
  }

  // WHY: scaling par paliers selon ROAS — pas de +20% aveugle
  async scaleCbo(campaignId: string): Promise<number> {
    const campaign = await db.query.adCampaigns.findFirst({ where: eq(adCampaigns.id, campaignId) })
    const last7Days = await this.getRecentMetrics(campaignId, 7)
    const avgRoas = last7Days.reduce((sum, d) => sum + Number(d.roas), 0) / last7Days.length

    // Scaling tiers — meilleur que +20% fixe
    let multiplier = 1.0
    if (avgRoas >= 4.0 && campaign!.budgetDaily < 500000) multiplier = 1.50   // +50% agressif sous $5K
    else if (avgRoas >= 3.0 && campaign!.budgetDaily < 2000000) multiplier = 1.20  // +20% modéré
    else if (avgRoas >= 2.5) multiplier = 1.10                                 // +10% conservateur
    else if (avgRoas < 1.5 && campaign!.budgetDaily > 100000) multiplier = 0.80   // -20% réduction

    const newBudget = Math.round(campaign!.budgetDaily * multiplier)
    // Update DB + Meta API budget
    return newBudget
  }

  // WHY: ajuster dynamiquement le cost cap de la Zombie selon la performance réelle
  async adjustZombieCostCaps(adAccountId: string): Promise<void> {
    const zombieAdSets = await db.query.adSets.findMany({
      where: /* zombie campaigns, active */
    })
    for (const adSet of zombieAdSets) {
      const recentCpa = await this.getRecentCpa(adSet.id, 7)
      // Si performe mieux que cost cap → baisser pour plus de volume
      if (recentCpa < (adSet.costCap! * 0.9)) {
        await db.update(adSets).set({ costCap: Math.round(adSet.costCap! * 0.95) })
      }
      // Si ne dépense pas → monter légèrement
      else if (recentSpend < 2000) {
        await db.update(adSets).set({ costCap: Math.min(Math.round(adSet.costCap! * 1.05), 10000) })
      }
    }
  }
}
```

### 14.6 Naming Convention — Validation

```typescript
// WHY: nommage strict = lisibilité instantanée dans le Business Manager
const NAMING_PATTERNS = {
  campaign: /^(Testing|CBO Scaling|Zombie) - .+ - .+ - \d{4}-\d{2}$/,
  adset:    /^.+ - (Broad|LLA \d+%|MOFU|BOFU|Retarget)/,
  ad:       /^.+ - Hook \d+ - (UGC|founder|image-text|before-after|cartoon|testimonial)$/,
} as const

function validateNaming(name: string, type: 'campaign' | 'adset' | 'ad'): boolean {
  return NAMING_PATTERNS[type].test(name)
}
```

### 14.7 BullMQ Jobs — Ads

| Job | Cron | Rôle |
|---|---|---|
| `ads:sync-metrics` | Toutes les heures | Sync Meta API → ad_metrics_daily |
| `ads:review-ads` | Quotidien (6h) | Review ads après 3 jours minimum |
| `ads:check-phase1` | Quotidien (8h) | Vérifier graduation Phase 1 → Phase 2 |
| `ads:scale-cbo` | Quotidien (10h) | Scaling progressif CBO (tiers) |
| `ads:adjust-zombie` | Quotidien (12h) | Dynamic cost cap adjustment Zombie |
| `ads:check-alerts` | Toutes les 6h | Détecter CPA explosion, ROAS drop, score AOV×CVR |
| `ads:cleanup` | Hebdomadaire | Purge old drafts, killed campaigns |

### 14.8 KPI Dashboard — Alert Thresholds

| Métrique | Seuil Alerte (Rouge) | Cible (Vert) |
|---|---|---|
| AOV × CVR | < 100 | 400+ |
| ATC : Purchase | > 5:1 (problème checkout) | 2:1 |
| ROAS CBO | < 1.5 | 3.0+ |
| CPA vs Target | > 2x | < 1x |
| CAPI Match Rate | < 6.0 | 8.5+ |
| Stop Rate (3s video) | < 15% (hook mauvais) | 35%+ |

### 14.9 API Endpoints — Ads

```typescript
// src/api/routes/ads.ts (Hono)
const ads = new Hono()

// === META AD ACCOUNTS ===
POST   /api/v1/ads/accounts                        → Connect new ad account
GET    /api/v1/ads/accounts                        → List accounts

// === NICHE & ANGLE RESEARCH ===
POST   /api/v1/ads/niches                          → Create niche research
GET    /api/v1/ads/niches?status=research           → List niches
POST   /api/v1/ads/niches/:id/analyze              → Trigger Trends + Reddit analysis
POST   /api/v1/ads/angles                          → Create angle from niche
GET    /api/v1/ads/angles?nicheId=xxx&status=phase1_testing

// === CAMPAIGNS ===
POST   /api/v1/ads/campaigns                       → Create (Testing/CBO/Zombie)
GET    /api/v1/ads/campaigns?type=testing&status=active
POST   /api/v1/ads/campaigns/:id/launch            → Launch → Meta API
POST   /api/v1/ads/campaigns/:id/pause

// === ADS ===
POST   /api/v1/ads/ads/batch                       → Create 15-25 ads in batch
GET    /api/v1/ads/ads?campaignId=xxx&fate=pending
POST   /api/v1/ads/ads/:id/review                  → Manual fate assignment
POST   /api/v1/ads/ads/:id/promote-cbo             → Winner → CBO
POST   /api/v1/ads/ads/:id/promote-zombie          → Almost → Zombie
DELETE /api/v1/ads/ads/:id                          → Kill loser

// === METRICS ===
GET    /api/v1/ads/metrics?campaignId=xxx&period=7d
GET    /api/v1/ads/metrics/angles?nicheId=xxx       → Cross-angle comparison

// === BUDGET ===
GET    /api/v1/ads/budget?funnelId=xxx
PUT    /api/v1/ads/budget                           → Update allocation
POST   /api/v1/ads/budget/scale                     → Trigger CBO scaling

// === ALERTS ===
GET    /api/v1/ads/alerts?severity=critical
POST   /api/v1/ads/alerts/:id/acknowledge

// === CREATIVE TEMPLATES ===
GET    /api/v1/ads/creative-templates               → List templates
POST   /api/v1/ads/creative-templates               → Create template

// === TRACKING DOMAIN ===
POST   /api/v1/ads/tracking-domain                  → Configure t.domaine.com
```

### 14.10 Nginx — Custom Tracking Domain (CAPI)

```nginx
# Auto-generated per funnel — WHY: ad blockers block graph.facebook.com
# Custom domain looks like first-party traffic → passes ad blockers → +70% events
server {
    listen 443 ssl;
    server_name t.~^(?<subdomain>.+)\.nutrovia\.co$;

    location / {
        proxy_pass http://api:3000/api/v1/events/capi;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Funnel-Slug $subdomain;
    }
}
```

### 14.11 Décisions clés — Ads

| Décision | Choix | Pourquoi |
|---|---|---|
| 9 tables séparées vs 1 polymorphique | 9 tables | Queryable, indexable, pas de JSON parsing |
| Validation des Claims Légales | API Validation | Avant tout déploiement ADS, vérifier vocabulaire NSFW/illégal pour éviter les bans. |
| JWT Stateless Cookies | Remplacement de Redis | Sauvegarde drastique de la RAM (+500$) en retirant les sessions en mémoire. |
| Warmup Stage Facebook | Paliers de Trust | Un compte neuf avec 100K$ = ban Meta immédiat. On démarre doucement. |
| meta_ad_accounts lié à funnelId | FK vers funnels | 1 funnel = 1 ad account fresh, jamais réutiliser |
| creative_templates table | Table dédiée | Templates reproductibles par format, agents les utilisent |
| Budget split CBO 70% / Zombie 30% | 70/30 du scaling | CBO = growth, Zombie = opportunisme |
| Scaling tiers (ROAS 4→+50%, 3→+20%, 2.5→+10%) | Paliers | Plus intelligent que +20% aveugle |
| Zombie cost cap dynamic | Worker quotidien | Baisser si performe, monter si ne dépense pas |
| Naming validation regex | API validation | Lisibilité critique dans Business Manager |
| isFresh sur meta_ad_accounts | Boolean | Fresh account check — jamais réutiliser un compte |
| costCap sur ad_sets | Column dédiée | Permet dynamic adjustment par le worker |
| Meta API v21.0 | Version fixe | Stability, pas de breaking changes surprises |

---

## 15. Event Tracking System (Analytics)

### Architecture Hybride Native (Zéro Outil Tiers)

Notre analytique est 100% internalisée, éliminant GA4 pour un tracking de précision au service des agents IA et combinée avec un pont Server-Side Meta CAPI pour le contournement des AdBlockers.

- **Tracker Vanilla JS (< 5KB)** : Injecté en fin de body, utilise `navigator.sendBeacon` pour batcher les données sans latence.
- **Auto-tracking complet** : Scroll 25/50/75/100, page_view, clic sur éléments `data-bid`.
- **Ingestion Hono.js + Redis** : Stockage asynchrone via BullMQ (`/api/v1/t/events`) vers une table partitionnée `raw_events` pour relecture.
- **Server Side Meta CAPI** : Hachage SHA256 des données client (email, téléphone, IP) en backend avant l'envoi direct à Meta Graph pour 100% de match rate sur CAPI (notamment `AddToCart` et `Purchase`).

```typescript
// Script d'envoi batch asynchrone côté client (minifié < 5KB)
const tracking = {
  sessionId: localStorage.getItem('s_id') || crypto.randomUUID(),
  send: (event, params) => {
    const data = { e: event, p: { ...params, url: location.href, ts: Date.now() }, v: window.__VARIANT_ID__ };
    navigator.sendBeacon('/api/v1/t/collect', JSON.stringify(data));
  }
};
```

---

## 16. Heatmap Engine (Revenue-per-Click)

Contrairement à Hotjar qui capture les mouvements et ne sort que des nuages de couleurs, notre module associe un **revenu financier aux clics**.

- **Liaison Session-Clic-Vente** : Chaque bloc a un Identifiant (`data-bid`). Si la session se termine par un achat, le clic sur un bloc est crédité du revenu généré.
- **Score AOV × CVR par Bloc** : Permet à l'Agent IA d'analyser en JSON (`/api/v1/elements/:variantId`) et d'élaguer les blocs "morts" ou déficitaires dans ses designs.
- **Sampling Desktop Exclusif** : L'A/B test Heatmap des souris est agressif mais *sample* uniquement à 500ms sur Desktop. Suppression pure et dure du tracking des mouvements pour le Mobile (qui représente 80% du trafic) afin d'économiser l'overhead inutile.

---

## 17. Attribution Engine (Multi-Touch)

Remplacement d'outils type Triple Whale et Hyros, avec stockage des parcours clients réels (`touchpoints`).

- Modèles supportés : First-Click, Last-Click, Linear, Position-Based (ex: 40/20/40), Time-decay. 
- Calcule dynamiquement le vrai ROAS par _Angle Marketing_.
- Attribue la valeur en background (worker `attributePurchase`) lors d'une transaction Stripe.

---

## 18. Survey System & Customer Feedback Loop

Alternative à Typeform, complètement automatisée (boucle post-achat) pour transformer les feedbacks en data IA actionnable :

1. **QR Code Packaging** : A la confirmation de commande, expédition d'un QR code unique lié au *Customer Hash*.
2. **Déclenchement Email (J+3, Réception, J+30)** : Mène à un formulaire d'étude hébergé en interne (cadeau de parrainage à la clé).
3. **Analyse de Sentiment Locale** : Les résultats (réponses ouvertes) sont traités pour assigner un score de sentiment et extraire les mots-clés (`pain_point`, `benefit`, `objection`).
4. **Agent Prompts** : L'Agent IA se connecte à `/api/v1/insights?category=pain_point` et génère automatiquement de nouvelles Hypothèses de tests à valider.

---

## 19. Décisions Clés — Analytics & Intelligence

| Décision | Choix | Pourquoi |
|---|---|---|
| Sampling Souris (Heatmap) | Desktop only (500ms) | Mobile est 80% du trafic et tactile; capture mouvement inutile. |
| Hybrid Tracking Meta CAPI | Côté serveur + Client | Bypass complet d'Adblockers (match rate +30-50%). |
| Table `raw_events` | Partitionnée | Absorbe les lourdes charges sans verrouiller BDD analytique. |
| Heatmap "Revenue-per-click" | Data-BID attribution | Permet à l'Agent de prioriser selon l'AOV, pas juste le CTR. |
| Post-purchase Survey Email | Automatisé J+3 à J+30 | Nourrit les agents IA en "langage client" et "pain points" frais. |

---

## 20. Research & Niche Discovery Engine

L'industrialisation de la loterie produit, gérée de A à Z par les Agents. Plus d'exploration manuelle, le système "scanne" le marché avant de lancer la création.

- **Ingestion Asynchrone (BullMQ)** : Aspiration méthodique des données avec proxies rotatifs pour respecter les T.O.S (Terms of Service).
   - *Google Trends* : Monitoring des pics d'intérêts sur ingrédients (collagène, GLP-1).
   - *Amazon* : Focus absolu sur les reviews 1 à 3 étoiles (pour extraire le Pain Point).
   - *Reddit* : Identification des frustrations urgentes ("Aidez-moi avec...").

- **Formule "Niche Scoring"** : Au lieu du simple volume, nous combinons les facteurs de conviction :
  $$Score = (Volume \times 0.25) + (Intensité Douleur \times 0.35) + (Gap Marché \times 0.25) + (Tendance \times 0.15)$$
  *On donne un poids très lourd à la douleur client. Une niche avec peu de volume mais une douleur extrême est plus rentable.*

## 21. Multi-IA Consensus Workflow

Pour éliminer l'hallucination d'un LLM unique qui validerait une mauvaise idée de niche, le "Consensus" distribue la charge d'évaluation.

- **Le Vote IA** : Les signaux bruts scrapés (des centaines de textes dé-saturés par NLP) sont envoyés simultanément à **3 Modèles** (ex: GPT-4o, Claude 3.5 Sonnet, Gemini 1.5 Pro).
- L'agent agrège les réponses : Si les 3 IA classent la "Douleur" de la niche à plus de 7/10, la niche passe en statut `scored` ou `validating`.

## 22. Angle Generation & Phase 1 Validation (Low-Cost)

Une fois la niche scorée, on **ne crée pas de produit**, on génère un "Angle Marketing".

- **Matrice Combinatoire** : Croisement NLP automatisé de `Avatar` × `Pain Point` × `Émotion` = Angle (ex: *Femme active* + *Manger sans prendre de poids* + *Désir/Facilité*).
- **Le Test Facebook (Philippines)** : L'angle sélectionné déclenche automatiquement une création de Landing Page et de publicités aux Philippines via l'API (Budget: 15$ / jour).
- On cherche le vrai CTR et vrai CPC. Si ça clique (intérêt validé par des humains), l'Agent marque l'Angle en `winner`.

## 23. Product Recommendation Model

C'est seulement l'A/B test "Phase 1" gagné qui active la Phase 2 :
- L'Agent utilise l'Angle Vainqueur et recommande le type de produit.
- Exemple: Si l'angle gagnant parle de "sommeil facile", et les Trends montrent "Gummies", l'IA propose *Gummies au Magnésium / Mélatonine*.
- L'humain n'a plus qu'à "saisir" la formulation chez le fournisseur et valider le Hook créatif.

---

## 24. Horizon Post-V1 (L'Autonomie Totale)

Au-delà de la création et du déploiement, le véritable potentiel de ce système réside dans son évolution vers un **Agent AI Auto-Optimisant 24/7**. Ces concepts, issus du Backlog et du moteur d'intégration de templates, représentent la V2 du projet.

### A. Growth Loop Automatisée (Auto-Proposer)
Au lieu d'attendre qu'un humain lance un A/B test, un Cron asynchrone analyse les métriques quotidiennes. 
S'il détecte un *bottleneck* (ex: "Le taux d'Add-to-Cart a chuté à 2% sur mobile"), l'Agent propose une Hypothèse. Il génère **lui-même** le variant via le composant `Block Engine`, le déploie dans la machine d'A/B Testing en isolant 200 visites (Phase *Sandbox*). Si la variation améliore le score, il la promeut en Champion. Le système boucle sur lui-même infiniment.

### B. Cross-Shop Learning Transfer
Le vrai "Network Effect" du système. Si un test prouve statistiquement de manière significative que "Bouton d'urgence Rouge > Bouton Confiance Vert" sur la Boutique A, l'Agent attribue un modèle de *Variable Fingerprint*. Il ira alors **booster la validation** d'une hypothèse similaire sur la Boutique B, réduisant la durée de chauffe nécessaire et capitalisant sur la data inter-projet.

### C. Le Block Engine (Générateur sans UI)
Afin d'éviter la complexité d'un builder visuel (glisser-déposer inexploitable par l'IA), l'Agent manipule uniquement le `blocks_definitions`. Il pousse un format JSON strict au backend (Hono), qui assemble les briques HTML/Tailwind en un fichier `.html` statique servi via Cloudflare et Nginx, garantissant des temps de chargement sous les 200 millisecondes et une étanchéité parfaite pour les scores SEO Core Web Vitals.


## 25. HTML RENDERER & SCRIPT DE TRACKING
## 6. HTML RENDERER

### Responsabilité

Le HTML Renderer transforme un `FunnelConfig` JSON en un fichier HTML statique complet, prêt à être servi par Nginx.

### Règles de rendu CRITIQUES

**1. Mobile First obligatoire**
- Toutes les dimensions et styles sont d'abord définis pour mobile
- Breakpoints desktop via `@media (min-width: 768px)`
- Tester les dimensions : iPhone 14 (390×844), Samsung S23 (393×851)

**2. Performance**
- Images : `loading="lazy"` sur toutes sauf la première (above-the-fold)
- CSS inline dans `<style>` dans le `<head>` (pas de fichier externe)
- JS en fin de `<body>` ou `defer`
- Pas de framework JS (vanilla uniquement)

**3. Tracking automatique injecté**
- Pixel FB si `fbPixelId` fourni
- Event `PageView` au chargement
- Event `ViewContent` après 3 secondes de scroll
- Event `AddToCart` au clic sur Add to Cart
- Event `InitiateCheckout` sur checkout
- Event `Purchase` après confirmation
- **Cookie de sticky session** : UUID généré une fois, stocké dans cookie `fs_sid`, durée 30 jours
- **Call de tracking custom** vers `/api/v1/track/{variantId}` à chaque événement

**4. Template de base HTML**
```html
<!DOCTYPE html>
<html lang="{{meta.language}}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{meta.title}}</title>
  <meta name="description" content="{{meta.description}}">
  
  <!-- Theme CSS variables -->
  <style>
    :root {
      --primary: {{theme.primaryColor}};
      --secondary: {{theme.secondaryColor}};
      --font: '{{theme.fontFamily}}', sans-serif;
      --radius: {{theme.borderRadius}};
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: var(--font); }
    /* ... reset CSS ... */
  </style>
  
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  
  <!-- Blocks CSS (inline) -->
  {{BLOCKS_CSS}}
  
  <!-- FB Pixel (si configuré) -->
  {{FB_PIXEL_CODE}}
  
  <!-- Custom head code -->
  {{tracking.customHeadCode}}
</head>
<body>
  <!-- Tracking hidden input pour variantId -->
  <input type="hidden" id="__variant_id" value="{{variantId}}">
  <input type="hidden" id="__funnel_id" value="{{funnelId}}">
  
  <!-- Blocs rendus séquentiellement -->
  {{RENDERED_BLOCKS}}
  
  <!-- Sticky Session Script -->
  <script>
    (function() {
      function getCookie(name) { /* ... */ }
      function setCookie(name, value, days) { /* ... */ }
      
      let sid = getCookie('fs_sid');
      if (!sid) {
        sid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0;
          return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        setCookie('fs_sid', sid, 30);
      }
      window.__FS_SID = sid;
    })();
  </script>
  
  <!-- Analytics Tracker -->
  <script>
    const VARIANT_ID = document.getElementById('__variant_id').value;
    const FUNNEL_ID = document.getElementById('__funnel_id').value;
    
    function track(eventType, data = {}) {
      fetch('/api/v1/track/' + VARIANT_ID, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType,
          sessionId: window.__FS_SID,
          device: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
          utmSource: new URLSearchParams(window.location.search).get('utm_source'),
          utmCampaign: new URLSearchParams(window.location.search).get('utm_campaign'),
          utmContent: new URLSearchParams(window.location.search).get('utm_content'),
          ...data
        }),
        keepalive: true
      });
    }
    
    // Pageview
    track('pageview');
    
    // CTA clicks (auto-detect via data attribute)
    document.querySelectorAll('[data-track-click]').forEach(el => {
      el.addEventListener('click', () => track('click', { element: el.dataset.trackClick }));
    });
    
    // Scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', function() {
      const pct = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
      if (pct > maxScroll && pct % 25 === 0) {
        maxScroll = pct;
        track('scroll_depth', { scrollDepth: pct });
      }
    });
  </script>
  
  <!-- Blocks JS (inline) -->
  {{BLOCKS_JS}}
  
  <!-- Custom body code -->
  {{tracking.customBodyCode}}
</body>
</html>
```



## 26. API REST AGENTS (ENDPOINTS COMPLETS)

## 7. API AGENTS — ENDPOINTS COMPLETS

### Base URL
```
/api/v1/agents/
```

### Authentification
Header requis : `X-Agent-Key: {agent_api_key}` (clé stockée en DB, liée à un projet)

---

### 7.1 FUNNELS

#### POST /api/v1/agents/funnels/create
Crée un funnel avec N variantes et les déploie immédiatement.

**Request Body :**
```json
{
  "projectId": "uuid",
  "name": "Fatigue - Angle Médecin",
  "pageType": "landing",
  "angleId": "uuid (optionnel)",
  "variants": [
    {
      "name": "variant-headline-01",
      "config": {
        "meta": {
          "title": "Docteur découvre la cause de la fatigue chronique",
          "description": "...",
          "language": "fr",
          "marketingAngle": "fatigue-cause-cachee",
          "productName": "Boost Pro",
          "productPrice": 49.99,
          "currency": "USD"
        },
        "tracking": {
          "fbPixelId": "1234567890"
        },
        "theme": {
          "primaryColor": "#E74C3C",
          "secondaryColor": "#2C3E50",
          "fontFamily": "Inter",
          "borderRadius": "8px"
        },
        "blocks": [
          {
            "blockName": "hero-main",
            "config": {
              "headline": "Le Secret que les Médecins Cachent sur la Fatigue Chronique",
              "subheadline": "Cette découverte simple élimine la fatigue en 7 jours",
              "ctaText": "Je Veux Plus d'Énergie",
              "ctaAction": "scroll_to_checkout",
              "socialProof": "47,000+ clients satisfaits",
              "badges": ["Livraison gratuite", "Satisfait ou remboursé 30j"]
            }
          },
          {
            "blockName": "countdown-timer",
            "config": {
              "type": "session",
              "durationMinutes": 20,
              "headline": "Offre spéciale expire dans :"
            }
          },
          {
            "blockName": "benefits-section",
            "config": {
              "title": "5 Raisons Pour Lesquelles Boost Pro Fonctionne",
              "benefits": [
                { "icon": "⚡", "title": "Énergie en 30 minutes", "description": "Formule à absorption rapide..." },
                { "icon": "🧠", "title": "Focus mental accru", "description": "Améliore la concentration..." }
              ]
            }
          },
          {
            "blockName": "bundle-selector",
            "config": {
              "bundles": [
                { "id": "b1", "name": "Starter", "quantity": 1, "price": 49.99, "compareAtPrice": 79.99 },
                { "id": "b2", "name": "Most Popular", "quantity": 3, "price": 119.99, "compareAtPrice": 239.97, "isPopular": true, "badge": "Most Popular" },
                { "id": "b3", "name": "Best Value", "quantity": 6, "price": 199.99, "compareAtPrice": 479.94, "badge": "Best Value" }
              ],
              "defaultSelected": "b2"
            }
          },
          {
            "blockName": "testimonials-grid",
            "config": {
              "testimonials": [
                { "name": "Marie L.", "rating": 5, "text": "J'ai retrouvé mon énergie d'avant...", "verified": true }
              ]
            }
          },
          {
            "blockName": "guarantee-badge",
            "config": { "days": 30 }
          },
          {
            "blockName": "faq-accordion",
            "config": {
              "faqs": [
                { "question": "En combien de temps vais-je voir des résultats ?", "answer": "..." }
              ]
            }
          },
          {
            "blockName": "sticky-cta-bar",
            "config": { "text": "Offre limitée", "ctaText": "Commander Maintenant", "price": 49.99 }
          }
        ]
      }
    }
  ],
  "trafficSplit": "equal"
}
```

**Response :**
```json
{
  "funnelId": "uuid",
  "name": "Fatigue - Angle Médecin",
  "status": "active",
  "abPhase": "exploration",
  "variants": [
    {
      "variantId": "uuid",
      "name": "variant-headline-01",
      "url": "https://fatigue-v1.mydomain.com",
      "status": "warming_up"
    }
  ]
}
```

---

#### GET /api/v1/agents/funnels/{funnelId}/stats
Retourne toutes les statistiques du funnel.

**Response :**
```json
{
  "funnelId": "uuid",
  "abPhase": "duel",
  "variants": [
    {
      "variantId": "uuid",
      "name": "variant-headline-01",
      "status": "active",
      "uniqueVisits": 1247,
      "clicks": 234,
      "addToCarts": 87,
      "purchases": 43,
      "revenue": 2149.57,
      "ctr": 0.1876,
      "cvr": 0.0345,
      "aov": 49.99,
      "aovXCvr": 1.72,
      "atcRatio": 2.02
    }
  ],
  "leader": { "variantId": "uuid", "aovXCvr": 1.72 },
  "recommendation": "Duel Final en cours. La Variante A a 12% d'avance sur B. Attendre 50 clics sur le leader avant de trancher."
}
```

---

#### POST /api/v1/agents/funnels/{funnelId}/iterate
Crée de nouvelles variantes basées sur une variante existante (mutations).

**Request Body :**
```json
{
  "baseVariantId": "uuid",
  "mutations": [
    {
      "name": "variant-headline-02",
      "changes": [
        {
          "blockName": "hero-main",
          "field": "headline",
          "value": "Nouvelle Headline à Tester"
        }
      ]
    }
  ]
}
```

---

#### POST /api/v1/agents/funnels/{funnelId}/pause
#### POST /api/v1/agents/funnels/{funnelId}/resume
#### DELETE /api/v1/agents/funnels/{funnelId}

---

### 7.2 BLOCKS (Librairie auto-enrichissante)

#### POST /api/v1/agents/blocks/create
Permet à un agent de créer un nouveau bloc et l'ajouter à la librairie.

#### GET /api/v1/agents/blocks
Liste tous les blocs disponibles avec leurs schemas.

---

### 7.3 ANALYTICS

#### POST /api/v1/track/{variantId}
Endpoint de tracking (appelé depuis le HTML du funnel).

**Logique côté serveur :**
1. Vérifier si `sessionId` a déjà généré un event `pageview` pour ce `variantId`
2. Si non → `isUnique = true`, incrémenter `uniqueVisits` sur la variante
3. Mettre à jour les compteurs agrégés sur `variants` (clicks, addToCarts, purchases, revenue)
4. Déclencher le job BullMQ `evaluate-ab-test` (avec debounce de 5 minutes)

---

### 7.4 ADS (Intégration Facebook)

#### POST /api/v1/agents/ads/sync/{projectId}
#### GET /api/v1/agents/ads/{projectId}/campaigns

---

## 27. MARKETING EVOLUTION ENGINE (SELF-LEARNING)

Ce module permet au système de s'auto-optimiser en apprenant de ses échecs et en enrichissant sa base de connaissances marketing.

### 27.1 Architecture RAG & Injection Dynamique

Inspiré du système `ai-factory`, chaque agent injecte dans son contexte les ressources du dossier `/Agent-Intelligence/`.

- **Middleware `MarketingKnowledgeInjector`** : 
  - Scanne récursivement le dossier `/Agent-Intelligence/`.
  - Identifie les SOPs pertinents (ex: recherche d'avatar → `02-Research-Methods/Deep-Psychographic-Avatar-Research-SOP.md`).
- **Leçons Apprises** : Les résultats de split-testing sont convertis en "Marketing Heuristics" et stockés dans la table `change_proposals`.

### 27.2 Boucle de Génération de SOP Autonome

1. **Scout Signal** : L'agent remarque un pattern d'échec/succès.
2. **Council Debate** : Les agents débattent via un workflow multi-agent.
3. **SOP Generation** : Rédaction d'un nouveau fichier Markdown.
4. **Persistance** : Sauvegarde dans `Agent-Intelligence/Auto-Generated/`.

### 27.3 Flux d'Évolution (The Council)

```mermaid
graph TD
    A[Data Analysis: AOV x CVR] --> B{Pattern Detected?}
    B -- Oui --> C[Scout: Create Insight]
    C --> D[Council Debate: Multi-Agent]
    D --> E{Consensus Found?}
    E -- SOP Creation --> F[Architect: Write MD File]
    E -- Prompt Update --> G[Architect: Update Prompt Schema]
    F --> H[Save to /Agent-Intelligence/Auto-Generated/]
    G --> I[Modify db.change_proposals]
    H --> J[Future Agents read it via RAG]
    I --> J
```

### 27.4 Kill Switch & Gouvernance

- **Auto-SOP** : Les agents peuvent créer des SOPs marketing en autonomie totale (non-destructeur).
- **Code/DB Change** : Tout changement de code ou de schéma DB reste bloqué par le Dashboard de validation humaine.

---

## 28. ROADMAP & ÉVOLUTIONS (POST-V1)

### 1. Growth Loop Automatisée
Cycle autonome : Hypothèse → Stratégie → Exécution → Test → Analyse → Répétition.

### 2. Cross-Shop Learning Transfer
Partage des succès entre différents funnels pour accélérer l'apprentissage.

### 3. Agent AI Auto-Proposer
L'IA suggère proactivement des modifications basées sur les données.

### 4. Dynamic Traffic Allocation
Allocation dynamique du trafic vers les variantes les plus performantes.

---

## 29. Entity ID & Creative Diversity (Meta Andromeda)

> Issu du transcript Meta Ads Andromeda Scaling Roadmap (Leifi/Adfluent, $200M+ in sales).
> Meta's Andromeda system groups similar ads under the same **Entity ID** — they compete against each other, not against competitors.

### 29.1 Pourquoi c'est critique

Sans gestion des Entity IDs, vos propres ads se **cannibalisent**:
- 3 ads similaires sur le même Entity = Meta choisit 1, ignore les 2 autres
- Résultat: CPM plus haut, reach plus bas, budget gaspillé
- **Creative Diversity** = le signal #1 qu'Andromeda utilise pour étendre la portée

### 29.2 Hiérarchie de diversité (du plus impactant au moins)

| Niveau | Dimension | Exemple | Impact Reach |
|--------|-----------|---------|-------------|
| 1 (TOP) | **Format** | Image vs Carousel vs Video vs Reel | Très haut |
| 2 | **Vehicle** | UGC vs Doctor vs Founder vs Podcast | Haut |
| 3 | **Persona** | Homme 25-34 vs Femme 35-54 | Moyen |
| 4 | **Message** | Pain point A vs Pain point B | Bas |

**Règle**: Chaque Entity ID devrait avoir max 1 ad par "slot" dans cette hiérarchie.

### 29.3 Entity ID Management dans ECOM-AI

```typescript
// Quand un agent crée un batch d'ads:
function assignEntityIds(ads: AdCreate[]): AdCreate[] {
  // 1. Grouper par angle + format + vehicle + persona
  // 2. Chaque groupe unique = 1 Entity ID
  // 3. Ads dans le même groupe = variations de message seulement
  // 4. Si >1 ad dans le même groupe → alerte "cannibalisation risk"

  const groups = groupBy(ads, a =>
    `${a.angleId}|${a.format}|${a.creativeType}|${a.targetingHash}`
  )

  return ads.map(ad => ({
    ...ad,
    entityId: generateEntityId(ad),
    entitySlot: getEntitySlot(ad),  // 'format' | 'vehicle' | 'persona' | 'message'
  }))
}
```

### 29.4 Règles A/B Test Entity ID

| Test | Question | Comment tester |
|------|----------|----------------|
| Même Entity, messages différents | Quel message gagne? | A/B standard dans le même ad set |
| Entity différents | Plus de diversité = plus de reach? | Split test: 3 entities vs 1 entity |
| Format diversité | Image + Video vs Video seul? | Compare CPMR et Incremental Reach |

**TOUT est A/B testable** — pas de "best practice" hardcodé. Le système propose, les données décident.

---

## 30. TOFU/MOFU/BOFU Stage System (Schwartz + Hawkins)

> Issu du Master Prompt IDEES (921 lignes) + transcript Meta Andromeda.
> Chaque étape du funnel correspond à un niveau de conscience (Schwartz) et une émotion (Hawkins).

### 30.1 Les 5 étapes et leur mapping

| Étape | Budget Split | Schwartz Awareness | Hawkins Émotion | Objectif | Meta Targeting |
|-------|-------------|-------------------|----------------|----------|----------------|
| **TOFU** | 70% | Unaware → Problem Aware | Curiosity, Surprise | Attirer l'attention | Broad (1% LLA, Interests) |
| **MOFU** | 15% | Solution Aware | Desire, Hope | Éduquer sur la solution | 3-5% LLA, Engaged Video Viewers |
| **BOFU** | 5% | Product Aware | Trust, Courage | Convertir | Custom Audience, Website Visitors |
| **Rétention** | 5% | Most Aware | Gratitude, Pride | Re-acheter | Purchasers, Email List |
| **Réactivation** | 5% | Most Aware (lost) | Relief | Regagner les perdus | Lapsed Purchasers, Cart Abandoners |

**Le split 70/15/5/5/5 est un DÉFAUT** — A/B testable. Certaines niches nécessitent plus de MOFU.

### 30.2 Types de contenu par étape

| Étape | Formats ads | Landing Page | Ton | Exemple |
|-------|------------|-------------|-----|---------|
| **TOFU** | UGC viral, hooks chocs, before/after | Advertorial (story, éducatif) | Conversational, "tu" | "Tu ne devineras jamais ce qui cause vraiment..." |
| **MOFU** | Doctor/expert, éducation, comparaison | VSL ou Quiz (diagnostic) | Autoritaire, preuves | "Voici pourquoi la science dit..." |
| **BOFU** | Témoignages, reviews, urgency | Product Page (bundles, reviews) | Direct, confiance | "Rejoint 47,000+ clients. Garantie 30j." |
| **Rétention** | Email/SMS, offres exclusives | Upsell page | Gratitude, VIP | "Votre prochaine boîte est prête..." |
| **Réactivation** | Remarketing, offres irrésistibles | Downsell | Urgence, FOMO | "Dernière chance avant rupture de stock" |

### 30.3 Structure TypeScript — Funnel Stage Config

```typescript
interface FunnelStageConfig {
  stage: 'tofu' | 'mofu' | 'bofu' | 'retention' | 'reactivation'

  // Schwartz Awareness Level
  awarenessLevel: 'unaware' | 'problem_aware' | 'solution_aware' | 'product_aware' | 'most_aware'

  // Hawkins Emotion (primary + secondary)
  primaryEmotion: string
  secondaryEmotion?: string

  // Content strategy
  adFormats: string[]           // ['ugc_viral', 'hook_choc', 'before_after']
  landingPageType: StepType     // 'advertorial' | 'vsl' | 'quiz' | 'product-page'
  toneGuidance: string          // 'conversational' | 'authoritative' | 'direct'

  // Meta targeting
  targetingType: 'broad' | 'lookalike' | 'custom' | 'retargeting'
  audienceSpec?: {
    lookalikePct?: number       // 1, 3, 5, 10
    customAudienceType?: string // 'purchasers' | 'video_viewers' | 'cart_abandoners'
    retentionDays?: number
  }

  // Budget (default, A/B testable)
  budgetPct: number             // default: tofu=70, mofu=15, bofu=5, retention=5, reactivation=5

  // A/B test flag
  budgetTestActive?: boolean
  budgetTestVariants?: Array<{ pct: number; label: string }>
}
```

### 30.4 API Endpoints — Funnel Stages

```
GET  /api/v1/funnels/:id/stages                          → Get all stage configs
PUT  /api/v1/funnels/:id/stages/:stage                   → Update stage config
POST /api/v1/funnels/:id/stages/:stage/test-budget       → Launch budget A/B test for this stage
GET  /api/v1/funnels/:id/stages/:stage/performance       → Get stage-level metrics
```

---

## 31. Scaling Roadmap Phases ($0 → $1M+/mois)

> Issu du transcript Meta Ads Andromeda Scaling Roadmap (Leifi/Adfluent).
> Chaque phase de revenu a une structure de campagne, volume créatif, et split TOFU différent.

### 31.1 Les 5 phases

| Phase | Revenu/mois | Testing:CBO:Zombie | TOFU Split | Créatifs/sem | Campagnes actives |
|-------|-------------|--------------------|-----------|-------------|------------------|
| **1** | $0 - $5K | 40:40:20 | 40% | 15-25 | 1-2 testing |
| **2** | $5K - $20K | 50:35:15 | 50% | 25-50 | 2-3 testing + 1 CBO |
| **3** | $20K - $100K | 60:30:10 | 60% | 50-100 | 3-5 testing + 2-3 CBO + 1-2 Zombie |
| **4** | $100K - $500K | 70:20:10 | 70% | 100-200 | 5+ testing + 5+ CBO + 3+ Zombie |
| **5** | $500K+ | 85:13:2 | 85% | 200+ | Full scale, auto-optimization |

**Pourquoi le TOFU split augmente**: Plus tu scales, plus tu as besoin de NOUVEAUX clients. MOFU/BOFU saturent vite. Seul le TOFU apporte du volume incrémental.

### 31.2 Structure de campagne par phase

```
PHASE 1 ($0-$5K):
  1 Testing Campaign (Broad, 1 country, $15-30/jour)
  → 15-25 creatives
  → Winner → manual scaling (duplicate + increase budget 20%)

PHASE 2 ($5K-$20K):
  1-2 Testing Campaigns (Broad + 1% LLA)
  1 CBO Campaign (winners from testing)
  → 25-50 creatives/sem
  → Auto CBO scaling (tiers: ROAS 4→+50%, 3→+20%, 2.5→+10%)

PHASE 3 ($20K-$100K):
  3-5 Testing Campaigns (Broad + LLA 1-5% + Interest stacks)
  2-3 CBO Campaigns (by angle)
  1-2 Zombie Campaigns (cost cap, almost-winners)
  → 50-100 creatives/sem
  → Partnership Ads begin (creator handles)

PHASE 4 ($100K-$500K):
  Full testing matrix (angles × formats × audiences)
  5+ CBO by angle/geo
  3+ Zombie
  Partnership Ads at scale (5-10 creators)
  → 100-200 creatives/sem

PHASE 5 ($500K+):
  Full automation, AI generates and tests continuously
  Creative diversity critical (Entity ID management)
  Incremental Reach optimization
  → 200+ creatives/sem
```

### 31.3 Auto-Detection de Phase

```typescript
// Worker quotidien qui vérifie le revenu des 30 derniers jours
async function detectScalingPhase(funnelId: string): Promise<ScalingPhase> {
  const revenue30d = await getRevenueLast30Days(funnelId)

  if (revenue30d < 5000) return { phase: 1, name: 'Validation' }
  if (revenue30d < 20000) return { phase: 2, name: 'Initial Scale' }
  if (revenue30d < 100000) return { phase: 3, name: 'Growth' }
  if (revenue30d < 500000) return { phase: 4, name: 'Scale' }
  return { phase: 5, name: 'Full Scale' }
}

// Quand la phase change → alerte + suggestion de restructuration
// L'utilisateur confirme AVANT toute restructuration
```

### 31.4 Alertes de Transition

| Événement | Alerte | Action proposée |
|-----------|--------|----------------|
| Phase 1 → 2 | Revenue > $5K/mois | Créer 1ère CBO campaign |
| Phase 2 → 3 | Revenue > $20K/mois | Ajouter Zombie + Partnership Ads |
| Phase 3 → 4 | Revenue > $100K/mois | Scaling agressif, +créatifs |
| Créatifs insuffisants | <15 actifs/phase | Augmenter production IA |
| Creative Fatigue | Frequency > 3 | Remplacement urgent |

---

## 32. Research Mode (Full Funnel Mass Testing)

> Research-before-Product: tester les angles à bas coût AVANT de créer des produits.
> EVERYTHING is A/B testable — pas de "best practice" hardcodé.
>
> ATTENTION: Les "Phases Recherche" (0/1/2) ci-dessous sont AVANT produit.
> Une fois le produit créé, on passe aux "Phases Produit" (CampaignPhase §14: validation → scaling).

### 32.1 Pourquoi Research Mode

Le flux classique = créer un produit → lancer des ads → espérer que ça marche. **70% des produits e-commerce échouent.**

Research Mode inverse le risque:
1. Trouver ce que les gens veulent (angles qui clickent)
2. Valider qu'ils achètent (checkout)
3. SEULEMENT ENSUITE créer le produit

### 32.2 Les 3 phases de Research Mode

```
PHASE 0 — AD ONLY (élimination brutale)
  Coût: $2-5/jour/angle
  Mesure: CTR ad, CPC, Thumb-stop ratio
  Seuil de passage: CTR > 2%, CPC < $0.50
  → Élimine 70-80% des angles en 2-3 jours

PHASE 1 — AD + ADVERTORIAL (validation d'intérêt)
  Coût: $10-15/jour/angle
  Landing: Advertorial UNIQUEMENT (pas de quiz/VSL en Research Mode)
  Mesure: Bounce rate, Time on page, % CTA clicks
  Seuil de passage: Bounce < 60%, CTA click > 3%
  → Élimine 50% des angles restants en 3-5 jours

PHASE 2 — FULL FUNNEL (validation d'achat)
  Coût: $20-30/jour/angle
  Funnel complet: Ad → Advertorial → Page Produit → Checkout
  Produit: fictif (meilleur produit possible, composition idéale alignée sur l'angle validé)
  Mesure: Add-to-cart rate, Checkout rate, AOV estimé
  Seuil de validation: ATC > 5%, Checkout > 1%
  → Si validé: créer le vrai produit OU trouver un équivalent
  → Si achat: livrer OU rembourser + noter la demande

NOTE: Le funnel est TOUJOURS complet (Ad → Advertorial → Page Produit → Checkout)
pour chaque angle en Phase 2. Pourquoi:
- Aucun angle désavantagé: les angles "éducation" (TOFU) bénéficient de l'advertorial
- On mesure TOUT: % CTA advertorial ET % buy clicks produit pour CHAQUE angle
- Pas de comparaison biaisée: chaque angle passe par le même parcours
- Les données réelles diront APRÈS si certains angles n'ont pas besoin d'advertorial
```

### 32.3 Coût total estimé par angle

| Phase | Coût/jour | Durée | Coût total | Taux de passage |
|-------|-----------|-------|-----------|----------------|
| Phase 0 | $3 | 3 jours | $9/angle | 20-30% passent |
| Phase 1 | $12 | 5 jours | $60/angle | 40-50% passent |
| Phase 2 | $25 | 7 jours | $175/angle | 10-20% gagnent |

**Budget total pour tester 20 angles:**
- Phase 0: 20 × $9 = **$180** (élimine 14-16 angles)
- Phase 1: 5 × $60 = **$300** (élimine 2-3 angles)
- Phase 2: 2 × $175 = **$350** (valide 0-1 winner)
- **Total: ~$830 pour trouver un angle validé**

### 32.4 Production rapide par angle

Pour chaque angle en Phase 1+, générer:

```
1. 1 image produit IA (style produit e-commerce, fond neutre)
   — Utiliser les tools IA existants de l'équipe
   — Fond blanc ou coloré uni, pas de lifestyle complexe
2. 3-5 images stock (lifestyle via API Pexels/Unsplash)
3. 1 advertorial (généré par content_producer.py, 1 seul par angle, pas de A/B test copywriting)
4. 1 page produit (template auto, produit fictif aligné sur l'angle)
5. 2-3 ads text variants (même angle, hooks différents)
Temps cible: ~2-3 min/angle pour la production
```

### 32.5 Types TypeScript — Research Mode

```typescript
interface ResearchCampaign {
  id: string
  funnelId: string
  nicheId: string

  // Les angles à tester
  angles: Array<{
    id: string
    name: string                 // "knee-pain-seniors"
    painPoint: string
    desire: string
    promise: string
    currentPhase: 0 | 1 | 2
    phaseResults: {
      phase0?: { ctr: number; cpc: number; passed: boolean; eliminatedAt?: string }
      phase1?: { bounceRate: number; ctaClickPct: number; passed: boolean; eliminatedAt?: string }
      phase2?: { atcRate: number; checkoutRate: number; winner: boolean }
    }
  }>

  // WHY: Funnel complet par défaut pour chaque angle.
  // Ad → Advertorial → Page Produit → Checkout
  // Pas de A/B test landing type en Research Mode.
  // L'optimisation du format (quiz, VSL, etc.) vient APRÈS avec le A/B Testing Engine (§3).
  funnelFlow: 'ad_advertorial_product_checkout'  // fixe en Research Mode

  totalBudget: number
  status: 'active' | 'completed' | 'paused'
}
```

### 32.6 API Endpoints — Research Mode

```
POST /api/v1/research/campaigns                    → Create research campaign
GET  /api/v1/research/campaigns/:id/progress       → Get angles + phase results
POST /api/v1/research/angles/:id/promote-phase     → Manually promote angle to next phase
POST /api/v1/research/angles/:id/eliminate         → Kill angle
GET  /api/v1/research/campaigns/:id/budget         → Get spend per angle per phase
POST /api/v1/research/winners/:angleId/create-product → Convert winner to real product
```

---

## 33. Creative Scaling Matrix & Winner Rate

> Issu du transcript Andromeda + IDEES. Motion benchmark (1.3B ads analysés): seul 4-8% deviennent winners.

### 33.1 La Matrice

| | Ugly (raw) | Chameleon (native) | Branded (polished) |
|---|---|---|---|
| **Image statique** | Screenshot, post-it, texte image | Photo lifestyle native | Packshot pro, infographie |
| **Carousel** | Captures d'écran produits | UGC slides natif | Catalogue brandé |
| **Vidéo courte (<30s)** | TikTok raw, face caméra | UGC natif, POV | Pub polishée |
| **Vidéo longue (>30s)** | Tuto téléphone, FB live natif | Mini-doc, témoignage | VSL production |

**Règle**: Tester les 12 combinaisons. Le gagnant est IMPOSSIBLE à prédire à l'avance.

### 33.2 Winner Rate Tracking

```typescript
interface CreativeWinnerRate {
  // Sur les X derniers jours:
  totalCreativesLaunched: number
  totalWinners: number               // CPA sous target
  totalAlmost: number                // CPA < 1.5x target
  totalLosers: number                // CPA > 2x target

  winnerRate: number                 // totalWinners / totalCreativesLaunched
  // Benchmark Motion: 4-8%
  // Si < 4%: problème de qualité créative ou d'angle
  // Si > 8%: excellente période, scale agressivement

  // Par dimension:
  byFormat: Record<string, { launched: number; winners: number; rate: number }>
  byVehicle: Record<string, { launched: number; winners: number; rate: number }>
  byStage: Record<string, { launched: number; winners: number; rate: number }>
}
```

### 33.3 CPMR (Cost Per 1000 Reached)

$$CPMR = CPM \times Frequency$$

- **Doit diminuer** avec la creative diversity (plus d'entities = reach plus large pour le même coût)
- Si CPMR augmente → fatigue créative → besoin de nouveaux creatives
- **Seuil d'alerte**: CPMR en hausse de >20% sur 7 jours

### 33.4 Incremental Reach %

$$Incremental\ Reach\ \% = \frac{Nouveaux\ utilisateurs\ atteints\ ce\ mois}{Total\ utilisateurs\ atteints\ ce\ mois}$$

- **Cible: 10%+** — en dessous = diminishing returns
- Si < 5%: la audience est saturée, il faut de nouveaux angles/formats
- Tracked dans `ad_metrics_daily.incremental_reach_pct`

### 33.5 API Endpoints — Creative Matrix

```
GET  /api/v1/creatives/winner-rate?funnelId=xxx&period=30d    → Winner rate + breakdown
GET  /api/v1/creatives/cpmr-trend?funnelId=xxx&period=14d     → CPMR trend + fatigue alert
GET  /api/v1/creatives/matrix?funnelId=xxx                     → Performance by format × polish level
POST /api/v1/creatives/batch-generate                          → Generate batch of creatives for matrix
```

---

## 34. Incremental Attribution & Signal Quality

> Issu des transcripts YouTube + Andromeda. Incremental Attribution ≠ ROAS.
> Signal Quality est le prérequis pour qu'Andromeda scale vos ads.

### 34.1 Pourquoi Incremental ≠ ROAS

| Métrique | Ce qu'elle mesure | Le problème |
|----------|------------------|-------------|
| **ROAS** | Revenue / Ad Spend | Compte les conversions qui seraient arrivées SANS l'ad (dernière impression = crédit) |
| **Incremental ROAS** | Revenue causé par l'ad / Ad Spend | Élimine les conversions "naturelles" → vrai impact de l'ad |

**Exemple**: Un client voit votre ad 1 seconde avant de cliquer sur un bookmark → ROAS compte ça comme une conversion. Incremental l'élimine.

### 34.2 Signal Quality (Event Match Quality)

Meta score la qualité de vos événements server-side de 0 à 10:

| Score | Interprétation | Action |
|-------|---------------|--------|
| 8-10 | Excellent | Andromeda scale normalement |
| 6-8 | Correct | Peu scale, amélioration possible |
| 4-6 | Médiocre | Scaling bloqué, urgence d'améliorer |
| < 4 | Mauvais | Andromeda quasi-inactif |

**Comment améliorer le signal:**
1. **CAPI via domaine propre** (déjà dans l'architecture §7 + §14.10) — bypass ad blockers
2. **Hash PII côté serveur** (email, phone, name, IP) — dédupliquer
3. **Tous les events importants** (PageView, ViewContent, AddToCart, InitiateCheckout, Purchase)
4. **Test Event Code** pour debug

### 34.3 Table Signal Quality Tracking

```typescript
// Déjà ajouté à metaAdAccounts: signalQualityScore, eventMatchQuality, lastSignalCheckAt

// Worker quotidien qui vérifie le signal
async function checkSignalQuality(adAccountId: string): Promise<SignalReport> {
  // 1. Meta API: Event Match Quality Score
  // 2. Comparer events reçus (notre DB) vs events rapportés (Meta)
  // 3. Calculer le match rate
  // 4. Alerte si score < 6.0

  return {
    eventMatchQuality: 7.8,
    totalEventsSent: 15432,
    totalEventsMatched: 12891,
    matchRate: 0.835,           // 83.5%
    missingFields: ['phone'],   // PII qu'on ne collecte pas
    recommendation: 'Add phone collection at checkout for +15% match rate',
  }
}
```

### 34.4 MARM (Meta Adaptive Ranking Model)

Nouvelle couche Meta qui décide le **niveau de compute** par utilisateur AVANT le ranking:

- Meta alloue plus de compute aux utilisateurs "intéréssants"
- Les ads avec bon signal quality bénéficient de plus de compute
- Impact: ads avec bon signal voient leur coût baisser naturellement

**Implication pour ECOM-AI**: Le signal quality n'est pas "nice to have" — c'est le **prérequis** pour que tout le reste fonctionne. Priorité absolue dans le setup.

### 34.5 Tout est A/B Testable — Checklist

| Dimension | "Best Practice" | Ce qu'on A/B teste |
|-----------|----------------|-------------------|
| Audience Network | "Bannir, 47% bots" | AN activé vs désactivé par campagne |
| Placement | "Feed only" | Feed vs Reels vs Stories vs AN |
| Broad targeting | "Meilleur pour TOFU" | Broad vs Interest vs LLA |
| Cost Cap vs Bid Cap | "Cost cap pour scaling" | Cost cap vs Bid cap vs Auto bid |
| CAPI domain | "Domaine propre requis" | Custom domain vs graph.facebook.com |
| Creative freshness | "Changer toutes les 2 sem" | Mesurer fatigue par frequency > 3 |
| TOFU split | "70% par défaut" | Tester 60% vs 70% vs 80% |
| Format diversité | "Video > Image" | Tester tous les formats dans la matrice |

**Règle absolue**: AUCUNE "best practice" n'est hardcodée comme règle. Toute recommandation = default A/B testable.

### 34.6 Alertes Signal Quality

| Métrique | Seuil Alerte | Cible |
|----------|-------------|-------|
| Event Match Quality | < 6.0 | 8.5+ |
| CAPI Match Rate | < 70% | 85%+ |
| Missing PII Fields | > 2 | 0 |
| Events Lost (ad blocker) | > 30% | < 15% |

---

## 35. Mise à jour Table Count

**Tables ajoutées par les sections 29-34:**
- `creator_profiles` (Partnership Ads)
- `placement_tests` (A/B test placements/Audience Network)

**Colonnes ajoutées aux tables existantes:**
- `ads`: `entityId`, `entitySlot`, `creatorProfileId`, `isWhitelisted`, `postingAsPage`
- `ad_metrics_daily`: `cpmr`, `incrementalReachPct`, `incrementalConversions`, `incrementalRoas`
- `meta_ad_accounts`: `signalQualityScore`, `eventMatchQuality`, `lastSignalCheckAt`
- `funnels`: `researchMode`, `researchPhase`

**Total tables: 34** (22 core + 2 nouvelles + 9 ads + 1 placement_tests)

---

## 36. Universal Testing Framework — Tout est A/B Testable

> RÈGLE ABSOLUE: TOUT dans ce projet qui PEUT recevoir un test DOIT être A/B testable.
> Aucune "best practice" n'est hardcodée. Tout est un default proposé, validé par les données.
> Un AI Judge (CEO) décide: quoi tester, comment, interprète les résultats, et choisit la suite.

### 36.1 Pourquoi un framework universel

Actuellement, l'A/B testing est dispersé:
- §3: Page variants (headline, CTA, layout...)
- §14: Ad fate (winner/almost/loser)
- §32: Research mode phases

**Problème**: Chaque système a SA propre logique de test. Pas de vue unifiée. Pas de décision centrale.

**Solution**: Un framework unique qui peut tester N'IMPORTE QUELLE dimension du projet:

| Catégorie | Ce qu'on teste | Métriques | Qui décide |
|-----------|---------------|-----------|------------|
| **Landing Pages** | Headlines, CTA, layout, bundles, FAQ, images | CVR, AOV×CVR, bounce rate | AI Judge |
| **Ads** | Format, hook, copy, image vs video, CTA text | CTR, CPC, CPA, ROAS | AI Judge |
| **Targeting** | Broad vs LLA, % LLA, interests, pays | CPA, CPMR, Incremental Reach | AI Judge |
| **Placements** | Feed vs Reels vs Stories vs Audience Network | CPA, bot click %, ROAS | AI Judge |
| **Budget Split** | TOFU 60% vs 70% vs 80%, CBO/Zombie ratio | Revenue total, CPA global | AI Judge |
| **Pricing** | Prix unitaire, bundle structure, discount % | AOV, CVR, AOV×CVR | AI Judge |
| **Creative Formats** | UGC vs Doctor vs Founder vs Podcast | CTR, CPA, winner rate | AI Judge |
| **Email Sequences** | Sujet, body, timing, fréquence | Open rate, click rate, revenue | AI Judge |
| **Funnel Structure** | Advertorial vs VSL vs Quiz vs direct product | CVR global, AOV×CVR | AI Judge |
| **Retargeting** | Durée, fréquence, message, offre | ROAS retargeting, CPA | AI Judge |

### 36.2 Architecture du Framework

```
┌─────────────────────────────────────────────────────────────┐
│               UNIVERSAL TESTING FRAMEWORK                    │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  TEST         │  │  AI JUDGE    │  │  KNOWLEDGE BASE  │  │
│  │  REGISTRY     │  │  (CEO)       │  │                  │  │
│  │              │  │              │  │  Tous les résultats│
│  │  Dimensions  │  │  Décide:     │  │  de tous les tests│
│  │  enregistrées│  │  - quoi      │  │  passés           │
│  │  (= tout ce  │  │  - comment   │  │                  │
│  │   qui peut   │  │  - résultats │  │  Patterns         │
│  │   être testé)│  │  - next step │  │  découverts       │
│  └──────┬───────┘  └──────┬───────┘  └───────┬──────────┘  │
│         │                 │                   │             │
│  ┌──────┴─────────────────┴───────────────────┴──────────┐  │
│  │              TEST RUNNER (exécution)                    │  │
│  │                                                        │  │
│  │  1. Crée les variants                                  │  │
│  │  2. Route le trafic / configure les groupes             │  │
│  │  3. Collecte les métriques                              │  │
│  │  4. Calcule la significativité statistique              │  │
│  │  5. Envoie au Judge pour décision                       │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  Feedback loop: Judge décide → Runner exécute → Results →   │
│  Knowledge Base → Judge lit les résultats → nouvelle décision│
└─────────────────────────────────────────────────────────────┘
```

### 36.3 Schéma DB — Tables Universelles

```typescript
// === UNIVERSAL TEST DIMENSIONS ===
// WHY: Registry de TOUT ce qui peut être testé dans le projet.
// Chaque dimension = 1 type de chose testable (ex: "ad_format", "landing_headline")
export const testDimensions = pgTable('test_dimensions', {
  id:               uuid('id').defaultRandom().primaryKey(),
  slug:             text('slug').notNull().unique(),          // "ad_format" | "landing_headline" | "targeting_type"
  name:             text('name').notNull(),                   // "Format de publicité"
  category:         text('category').notNull(),               // "ads" | "landing" | "targeting" | "budget" | "email" | "funnel"
  description:      text('description'),
  possibleValues:   jsonb('possible_values').$type<string[]>().default([]), // ["image", "video", "carousel"]
  primaryMetric:    text('primary_metric').notNull(),         // "cpa" | "ctr" | "cvr" | "aov_cvr" | "roas"
  secondaryMetrics: jsonb('secondary_metrics').$type<string[]>().default([]),
  minSampleSize:    integer('min_sample_size').default(100),  // Minimum pour significativité
  estimatedDuration: text('estimated_duration'),              // "3 days" | "7 days"
  priority:         integer('priority').default(50),          // 0-100, higher = test first
  isActive:         boolean('is_active').default(true),       // Can be disabled if dimension closed
  createdAt:        timestamp('created_at').defaultNow().notNull(),
})

// === UNIVERSAL TESTS ===
// WHY: Un seul format pour TOUS les tests du projet, quelle que soit la dimension.
export const universalTests = pgTable('universal_tests', {
  id:               uuid('id').defaultRandom().primaryKey(),
  dimensionId:      uuid('dimension_id').references(() => testDimensions.id).notNull(),
  funnelId:         uuid('funnel_id').references(() => funnels.id),

  // Test design
  name:             text('name').notNull(),                   // "Image vs Video ads for knee-pain angle"
  hypothesis:       text('hypothesis'),                       // "Video ads will have higher CTR because..."
  proposedBy:       text('proposed_by').default('ai_judge'),  // 'ai_judge' | 'human' | 'auto_growth'

  // Variants being tested
  variants:         jsonb('variants').$type<Array<{
    id: string
    label: string              // "Image statique"
    config: Record<string, unknown>  // Configuration spécifique au variant
  }>>().notNull(),

  // Execution
  status:           text('status').$type<'proposed'|'approved'|'running'|'analyzing'|'completed'>().default('proposed'),
  trafficSplit:     text('traffic_split').default('equal'),   // 'equal' | '80_20' | custom
  startedAt:        timestamp('started_at'),
  endedAt:          timestamp('ended_at'),

  // Results
  winnerVariantId:  text('winner_variant_id'),
  confidence:       numeric('confidence', { precision: 4, scale: 3 }),
  isSignificant:    boolean('is_significant').default(false),

  // Judge decision
  judgeDecision:    jsonb('judge_decision').$type<{
    action: 'declare_winner' | 'inconclusive' | 'need_more_data' | 'refine_test' | 'new_dimension'
    winnerId?: string
    reasoning: string
    nextTestSuggestion?: string           // What to test next based on these results
    confidence: number
  }>(),

  // Link to specific system (polymorphic)
  targetScope:      text('target_scope'),                     // 'all_funnels' | 'funnel_specific' | 'ad_account'
  targetId:         uuid('target_id'),                        // FK vers le funnel/ad_campaign/niche concerné

  createdAt:        timestamp('created_at').defaultNow().notNull(),
  updatedAt:        timestamp('updated_at').defaultNow().notNull(),
}, t => [
  index('ut_dimension_idx').on(t.dimensionId),
  index('ut_status_idx').on(t.status),
  index('ut_funnel_idx').on(t.funnelId),
])

// === UNIVERSAL TEST RESULTS ===
// WHY: Suivi détaillé par variant. Le Judge lit ces données pour décider.
export const universalTestResults = pgTable('universal_test_results', {
  id:               uuid('id').defaultRandom().primaryKey(),
  testId:           uuid('test_id').references(() => universalTests.id, { onDelete: 'cascade' }).notNull(),
  variantId:        text('variant_id').notNull(),             // Matches variants[].id in universalTests

  // Raw metrics (collected by the runner)
  impressions:      integer('impressions').default(0),
  clicks:           integer('clicks').default(0),
  conversions:      integer('conversions').default(0),
  revenue:          numeric('revenue', { precision: 12, scale: 2 }).default('0'),
  spend:            numeric('spend', { precision: 12, scale: 2 }).default('0'),

  // Calculated metrics
  ctr:              numeric('ctr', { precision: 6, scale: 4 }),
  cvr:              numeric('cvr', { precision: 6, scale: 4 }),
  cpa:              numeric('cpa', { precision: 12, scale: 2 }),
  roas:             numeric('roas', { precision: 8, scale: 4 }),
  aov:              numeric('aov', { precision: 12, scale: 2 }),
  primaryMetricValue: numeric('primary_metric_value', { precision: 12, scale: 4 }),

  // Statistical
  confidenceLower:  numeric('confidence_lower', { precision: 6, scale: 4 }),
  confidenceUpper:  numeric('confidence_upper', { precision: 6, scale: 4 }),
  sampleSize:       integer('sample_size').default(0),

  // Time period
  periodStart:      timestamp('period_start'),
  periodEnd:        timestamp('period_end'),

  updatedAt:        timestamp('updated_at').defaultNow().notNull(),
}, t => [
  uniqueIndex('utr_test_variant').on(t.testId, t.variantId),
  index('utr_test_idx').on(t.testId),
])

// === TEST KNOWLEDGE BASE ===
// WHY: Tous les résultats alimentent une base de connaissances.
// Le Judge lit cette table pour proposer de NOUVEAUX tests basés sur les patterns.
export const testKnowledge = pgTable('test_knowledge', {
  id:               uuid('id').defaultRandom().primaryKey(),
  dimensionSlug:    text('dimension_slug').notNull(),         // "ad_format"
  pattern:          text('pattern').notNull(),                // "video > image for health products"
  confidence:       numeric('confidence', { precision: 4, scale: 3 }),
  sampleTests:      integer('sample_tests').default(1),      // How many tests confirm this pattern
  applicability:    text('applicability').$type<'universal'|'niche_specific'|'product_specific'>().default('universal'),
  nicheCategory:    text('niche_category'),                   // null = universal
  source:           text('source').$type<'auto_discovered'|'human_insight'|'external_benchmark'>().default('auto_discovered'),
  isActive:         boolean('is_active').default(true),
  discoveredAt:     timestamp('discovered_at').defaultNow().notNull(),
  lastConfirmedAt:  timestamp('last_confirmed_at'),
}, t => [
  index('tk_dimension_idx').on(t.dimensionSlug),
  index('tk_active_idx').on(t.isActive),
])

// === JUDGE DECISION LOG ===
// WHY: Toutes les décisions du Judge sont tracées. Transparence totale.
export const judgeDecisionLog = pgTable('judge_decision_log', {
  id:               uuid('id').defaultRandom().primaryKey(),
  testId:           uuid('test_id').references(() => universalTests.id),

  // Context
  dimensionSlug:    text('dimension_slug').notNull(),
  funnelId:         uuid('funnel_id').references(() => funnels.id),

  // Decision
  decision:         text('decision').$type<
    'declare_winner' | 'inconclusive' | 'need_more_data' | 'refine_test' | 'new_dimension' | 'pause_dimension'
  >().notNull(),
  winnerId:         text('winner_id'),
  reasoning:        text('reasoning').notNull(),              // Full AI reasoning
  confidence:       numeric('confidence', { precision: 4, scale: 3 }),

  // Next steps proposed
  nextSteps:        jsonb('next_steps').$type<Array<{
    type: 'new_test' | 'refine_current' | 'apply_winner' | 'abandon_dimension'
    description: string
    priority: number
  }>>(),

  // Metrics snapshot at decision time
  metricsSnapshot:  jsonb('metrics_snapshot').$type<Record<string, { variantA: number; variantB: number }>>(),

  decidedAt:        timestamp('decided_at').defaultNow().notNull(),
}, t => [
  index('jdl_test_idx').on(t.testId),
  index('jdl_dimension_idx').on(t.dimensionSlug),
  index('jdl_date_idx').on(t.decidedAt),
])
```

### 36.4 L'AI Judge (CEO) — Logique de Décision

```typescript
// src/services/ai-judge.ts

class AIJudge {
  // ============================================
  // BOUCLE PRINCIPALE — Tourne en continu
  // ============================================

  async runDecisionLoop(): Promise<void> {
    // 1. Quels tests sont en cours?
    const runningTests = await this.getRunningTests()

    for (const test of runningTests) {
      // Collecter les métriques
      const results = await this.collectResults(test)

      // Assez de données pour analyser?
      if (!this.hasMinimumData(results, test)) continue

      // Analyser
      const analysis = this.statisticalAnalysis(results)

      // Prendre une décision
      const decision = await this.makeDecision(test, analysis)

      // Logger et exécuter
      await this.logAndExecute(test, decision)
    }

    // 2. Proposer de NOUVEAUX tests
    await this.proposeNewTests()
  }

  // ============================================
  // ANALYSE STATISTIQUE
  // ============================================

  private statisticalAnalysis(results: UniversalTestResult[]): StatisticalAnalysis {
    // Wilson Score Interval (déjà utilisé dans §3)
    // + Bonferroni correction si >2 variants
    // + Effect size (Cohen's d) pour juger l'impact pratique, pas juste la significativité

    const variants = results.map(r => ({
      id: r.variantId,
      primaryMetric: Number(r.primaryMetricValue),
      sampleSize: r.sampleSize,
    }))

    // Calculer intervalles de confiance
    const intervals = variants.map(v =>
      wilsonInterval(v.primaryMetric * v.sampleSize, v.sampleSize, variants.length)
    )

    // Chevauchement des intervalles?
    const hasOverlap = this.checkIntervalOverlap(intervals)

    // Effect size
    const effectSize = this.cohensD(variants[0], variants[1])

    return {
      intervals,
      hasOverlap,
      effectSize,                         // <0.2 = small, 0.2-0.8 = medium, >0.8 = large
      isSignificant: !hasOverlap,
      practicalSignificance: effectSize > 0.2,
    }
  }

  // ============================================
  // DÉCISION DU JUDGE
  // ============================================

  private async makeDecision(
    test: UniversalTest,
    analysis: StatisticalAnalysis
  ): Promise<JudgeDecision> {

    // CAS 1: Résultat clair + significatif + impact pratique
    if (analysis.isSignificant && analysis.practicalSignificance) {
      const winner = this.identifyWinner(test, analysis)
      return {
        action: 'declare_winner',
        winnerId: winner.id,
        reasoning: `Winner clair: ${winner.id} avec intervalle [${winner.lower}, ${winner.upper}], effect size ${analysis.effectSize.toFixed(2)}`,
        confidence: 0.95,
        nextTestSuggestion: this.suggestFollowUp(test, winner),
      }
    }

    // CAS 2: Significatif mais impact faible (<0.2 effect size)
    if (analysis.isSignificant && !analysis.practicalSignificance) {
      return {
        action: 'inconclusive',
        reasoning: `Statistiquement significatif mais impact pratique trop faible (effect size ${analysis.effectSize.toFixed(2)}). Pas worth le changement.`,
        confidence: 0.60,
        nextTestSuggestion: 'Tester une dimension plus impactante à la place',
      }
    }

    // CAS 3: Pas assez de données
    if (!this.hasEnoughSampleSize(test, analysis)) {
      return {
        action: 'need_more_data',
        reasoning: `Sample size insuffisant (${analysis.totalSamples} vs ${test.minSampleSize} requis). Continuer la collecte.`,
        confidence: 0.30,
      }
    }

    // CAS 4: Trop de bruit, pas de pattern
    return {
      action: 'refine_test',
      reasoning: 'Pas de différence claire entre variants. Peut-être que la dimension testée n\'a pas d\'impact. Suggérer de tester une dimension différente ou affiner les variants.',
      confidence: 0.40,
      nextTestSuggestion: 'Soit affiner les variants (plus contrastés), soit abandonner cette dimension',
    }
  }

  // ============================================
  // PROPOSITION DE NOUVEAUX TESTS
  // ============================================

  async proposeNewTests(): Promise<void> {
    // 1. Lire la Knowledge Base pour les patterns existants
    const knownPatterns = await this.getActivePatterns()

    // 2. Identifier les dimensions NON testées
    const untestedDimensions = await this.getUntestedDimensions()

    // 3. Prioriser par impact estimé:
    //    - Dimensions jamais testées → HIGH priority (discovery)
    //    - Dimensions avec résultats contradictoires → re-test
    //    - Dimensions où le winner peut être battu → refine
    const proposals = this.prioritizeTests(untestedDimensions, knownPatterns)

    // 4. Créer les tests proposés (status: 'proposed')
    for (const proposal of proposals.slice(0, 5)) {  // Max 5 tests proposés en parallèle
      await this.createTestProposal(proposal)
    }
  }

  private suggestFollowUp(test: UniversalTest, winner: Variant): string {
    // Exemples de suggestions contextuelles:
    // - "Video a gagné sur Image → tester Video court vs Video long"
    // - "Headline A a gagné → tester 3 variations de Headline A (hooks différents)"
    // - "TOFU 70% a gagné → tester si 75% ou 80% est encore mieux"
    return `Winner trouvé sur ${test.dimensionSlug}. Prochaine étape: affiner le winner ou tester une dimension corrélée.`
  }
}
```

### 36.5 Dimensions Enregistrées par Défaut

```typescript
// src/data/default-dimensions.ts
// WHY: Ces dimensions sont pré-enregistrées. Le Judge peut en ajouter de nouvelles.

const DEFAULT_DIMENSIONS = [
  // === ADS ===
  { slug: 'ad_format',           name: 'Format pub',       category: 'ads',       possibleValues: ['image', 'video', 'carousel'], primaryMetric: 'ctr' },
  { slug: 'ad_vehicle',          name: 'Véhicule créatif', category: 'ads',       possibleValues: ['ugc', 'doctor', 'founder', 'podcast', 'cartoon'], primaryMetric: 'cpa' },
  { slug: 'ad_hook_style',       name: 'Style de hook',   category: 'ads',       possibleValues: ['shock', 'question', 'story', 'stat', 'challenge'], primaryMetric: 'ctr' },
  { slug: 'ad_cta_text',         name: 'Texte CTA',       category: 'ads',       possibleValues: ['shop_now', 'learn_more', 'discover', 'get_offer'], primaryMetric: 'ctr' },
  { slug: 'ad_polish_level',     name: 'Niveau polish',   category: 'ads',       possibleValues: ['ugly', 'chameleon', 'branded'], primaryMetric: 'cpa' },

  // === TARGETING ===
  { slug: 'targeting_type',      name: 'Type ciblage',    category: 'targeting', possibleValues: ['broad', 'lookalike_1', 'lookalike_3', 'interest'], primaryMetric: 'cpa' },
  { slug: 'placement_config',    name: 'Placements',      category: 'targeting', possibleValues: ['feed_only', 'feed_reels', 'all_except_an', 'all_including_an'], primaryMetric: 'cpa' },
  { slug: 'audience_network',    name: 'Audience Network',category: 'targeting', possibleValues: ['enabled', 'disabled'], primaryMetric: 'cpa' },
  { slug: 'geo_test',            name: 'Pays de test',    category: 'targeting', possibleValues: ['PH', 'ZA', 'US', 'UK'], primaryMetric: 'cpa' },

  // === BUDGET ===
  { slug: 'tofu_split',          name: 'TOFU budget %',   category: 'budget',    possibleValues: ['60', '70', '80', '85'], primaryMetric: 'revenue' },
  { slug: 'cbo_zombie_ratio',    name: 'CBO/Zombie split',category: 'budget',    possibleValues: ['70_30', '80_20', '60_40'], primaryMetric: 'roas' },
  { slug: 'scaling_speed',       name: 'Vitesse scaling', category: 'budget',    possibleValues: ['conservative_10', 'moderate_20', 'aggressive_50'], primaryMetric: 'roas' },

  // === LANDING PAGE ===
  { slug: 'page_type',           name: 'Type de page',    category: 'landing',   possibleValues: ['advertorial', 'vsl', 'product_page', 'quiz'], primaryMetric: 'cvr' },
  { slug: 'headline_style',      name: 'Style headline',  category: 'landing',   possibleValues: ['pain', 'promise', 'curiosity', 'urgency'], primaryMetric: 'cvr' },
  { slug: 'cta_button_text',     name: 'Texte bouton',    category: 'landing',   possibleValues: ['shop_now', 'try_risk_free', 'get_started', 'claim_offer'], primaryMetric: 'cvr' },
  { slug: 'cta_button_color',    name: 'Couleur bouton',  category: 'landing',   possibleValues: ['red', 'green', 'orange', 'blue'], primaryMetric: 'cvr' },
  { slug: 'bundle_structure',    name: 'Structure bundles',category: 'landing',  possibleValues: ['1_3_6', '1_2_3', '2_4_6', '1_3_5'], primaryMetric: 'aov_cvr' },
  { slug: 'review_count',        name: 'Nombre reviews',  category: 'landing',   possibleValues: ['3', '5', '8', '12'], primaryMetric: 'cvr' },
  { slug: 'countdown_timer',     name: 'Timer countdown',  category: 'landing',  possibleValues: ['evergreen', 'fixed', 'none'], primaryMetric: 'cvr' },
  { slug: 'guarantee_display',   name: 'Affichage garantie',category: 'landing', possibleValues: ['badge', 'section', 'both', 'none'], primaryMetric: 'cvr' },

  // === FUNNEL STRUCTURE ===
  { slug: 'funnel_length',       name: 'Longueur funnel', category: 'funnel',    possibleValues: ['direct_product', 'ad_product', 'ad_adv_product', 'ad_vsl_product'], primaryMetric: 'aov_cvr' },
  { slug: 'upsell_sequence',     name: 'Séquence upsell', category: 'funnel',    possibleValues: ['none', 'one_upsell', 'upsell_downsell', 'two_upsells'], primaryMetric: 'aov' },

  // === PRICING ===
  { slug: 'price_point',         name: 'Point de prix',   category: 'pricing',   possibleValues: ['low_29', 'mid_49', 'high_79', 'premium_99'], primaryMetric: 'aov_cvr' },
  { slug: 'discount_display',    name: 'Affichage promo', category: 'pricing',   possibleValues: ['percentage', 'fixed_amount', 'per_day', 'none'], primaryMetric: 'cvr' },

  // === EMAIL / RETENTION ===
  { slug: 'email_subject_style', name: 'Style sujet email',category: 'email',   possibleValues: ['curiosity', 'urgency', 'personal', 'question'], primaryMetric: 'open_rate' },
  { slug: 'email_send_time',     name: 'Heure envoi',     category: 'email',     possibleValues: ['morning_8h', 'midday_12h', 'evening_18h', 'night_21h'], primaryMetric: 'open_rate' },
  { slug: 'retargeting_window',  name: 'Fenêtre retargeting',category: 'email', possibleValues: ['1_day', '3_day', '7_day', '14_day', '30_day'], primaryMetric: 'roas' },

  // === CREATIVE ===
  { slug: 'creative_diversity',  name: 'Diversité créative',category: 'creative', possibleValues: ['1_format', '2_formats', '3_formats', 'all_formats'], primaryMetric: 'cpmr' },
  { slug: 'entity_density',      name: 'Ads par Entity',  category: 'creative',  possibleValues: ['1_per_entity', '2_per_entity', '3_per_entity'], primaryMetric: 'incremental_reach' },
]
```

### 36.6 BullMQ Jobs — Judge

| Job | Cron | Rôle |
|---|---|---|
| `judge:analyze-tests` | Toutes les 2h | Analyser les tests en cours, prendre des décisions |
| `judge:propose-tests` | Quotidien (7h) | Proposer de nouveaux tests basés sur la Knowledge Base |
| `judge:sync-results` | Toutes les heures | Collecter métriques → universal_test_results |
| `judge:cleanup` | Hebdomadaire | Purge tests > 90 jours, archive patterns confirmés |
| `judge:health-check` | Quotidien (9h) | Vérifier que tous les tests actifs collectent des données |

### 36.7 API Endpoints — Universal Testing

```
// === DIMENSIONS (ce qui est testable) ===
GET    /api/v1/testing/dimensions                              → Liste toutes les dimensions testables
POST   /api/v1/testing/dimensions                              → Ajouter une nouvelle dimension testable
GET    /api/v1/testing/dimensions/:slug/status                 → Etat: testé? Pattern découvert? En cours?

// === TESTS ===
GET    /api/v1/testing/tests?status=running&dimension=ad_format → Liste les tests (filtres possibles)
POST   /api/v1/testing/tests/propose                           → Demander au Judge de proposer un test
POST   /api/v1/testing/tests/:id/approve                       → Approuver un test proposé (passe en running)
GET    /api/v1/testing/tests/:id/results                       → Résultats détaillés par variant
POST   /api/v1/testing/tests/:id/override                      → Override manuel de la décision du Judge

// === KNOWLEDGE BASE ===
GET    /api/v1/testing/knowledge                               → Tous les patterns découverts
GET    /api/v1/testing/knowledge/:dimension                    → Patterns pour une dimension spécifique
GET    /api/v1/testing/knowledge/:dimension/history             → Historique des tests sur cette dimension

// === JUDGE ===
GET    /api/v1/testing/judge/decisions                         → Toutes les décisions du Judge
GET    /api/v1/testing/judge/decisions/:id/reasoning           → Raisonnement complet du Judge
GET    /api/v1/testing/judge/queue                             → Tests proposés en attente d'approbation
POST   /api/v1/testing/judge/trigger-analysis                  → Forcer une analyse immédiate

// === DASHBOARD ===
GET    /api/v1/testing/dashboard                               → Vue d'ensemble: tests actifs, résultats, patterns
GET    /api/v1/testing/dashboard/untested                      → Dimensions jamais testées (opportunités)
```

### 36.8 Dashboard — Vue Unifiée

```
┌─────────────────────────────────────────────────────────────┐
│                  TESTING DASHBOARD                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  TESTS ACTIFS (5)                                            │
│  ┌──────────────────────┬───────────┬────────┬─────────┐   │
│  │ Dimension            │ Status    │ Données│ Juge    │   │
│  ├──────────────────────┼───────────┼────────┼─────────┤   │
│  │ ad_format            │ Running   │ 340/500│ ...     │   │
│  │ page_type            │ Running   │ 120/200│ ...     │   │
│  │ tofu_split           │ Analyzing │ 800/800│ Winner! │   │
│  │ targeting_type       │ Running   │ 50/300 │ ...     │   │
│  │ bundle_structure     │ Running   │ 200/200│ Tie     │   │
│  └──────────────────────┴───────────┴────────┴─────────┘   │
│                                                              │
│  PATTERNS CONFIRMÉS (12)                                     │
│  ┌──────────────────────┬─────────────────────────────────┐│
│  │ Dimension            │ Pattern                         ││
│  ├──────────────────────┼─────────────────────────────────┤│
│  │ ad_format            │ Video > Image pour health       ││
│  │ page_type            │ Advertorial > Product pour TOFU ││
│  │ bundle_structure     │ 1_3_6 > 1_2_3 pour AOV         ││
│  │ cta_button_color     │ Orange > Red > Green            ││
│  │ ...                  │ ...                             ││
│  └──────────────────────┴─────────────────────────────────┘│
│                                                              │
│  PROCHAINES PROPOSITIONS DU JUGE (3)                         │
│  1. [HIGH] Tester audience_network on/off (jamais testé)     │
│  2. [MED]  Refiner ad_hook_style: shock vs question          │
│  3. [LOW]  Tester email_send_time: matin vs soir             │
│                                                              │
│  DECISIONS DU JUGE (dernières 7j)                            │
│  - Lundi: Winner video > image (conf 0.95, effect 0.42)     │
│  - Mercredi: Inconclusive countdown_timer (effect 0.08)      │
│  - Vendredi: Need more data targeting_type (200/300)         │
└─────────────────────────────────────────────────────────────┘
```

### 36.9 Flux de Décision Complet

```
1. Judge scanne les dimensions → identifie ce qui n'est PAS testé
2. Judge propose un test (dimension + variants + hypothèse)
3. Test apparaît dans le Dashboard → statut "proposé"
4. Humain OU auto-approve → statut "running"
5. Test Runner configure les variants (ads, landing, targeting...)
6. Métriques collectées en continu → universal_test_results
7. Judge analyse périodiquement (toutes les 2h)
8. Si significatif → décision: winner / inconclusive / refine
9. Décision loggée → judge_decision_log
10. Si winner → appliqué automatiquement + Knowledge Base mise à jour
11. Knowledge Base alimente les futures propositions (feedback loop)
12. Judge propose le TEST SUIVANT basé sur les résultats
```

### 36.10 Règles du Judge

| Règle | Pourquoi |
|-------|----------|
| **Minimum 3 tests** avant de déclarer un pattern | 1 test = chance, 2 = coincidence, 3 = pattern |
| **Effect size > 0.2** requis pour winner | Significatif mais impact <0.2 = pas worth le changement |
| **Max 5 tests en parallèle** par funnel | Trop de tests = trop peu de données par test = pas de résultats |
| **Priorité: dimensions jamais testées** | Discovery > Optimization. Un nouveau format > tweaker un bouton |
| **Auto-apply winners** si confidence > 0.95 + effect > 0.4 | Safe d'automatiser les wins clairs |
| **Human review** si confidence < 0.80 ou dimension critique | Pricing, budget splits = trop risqué en auto |
| **Abandon dimension** si 3 tests consécutifs = inconclusive | Certains paramètres n'ont simplement pas d'impact |

---

## 37. Mise à jour Table Count — Final

**Tables totales: 39**

| Catégorie | Tables | Détail |
|-----------|--------|--------|
| Core (funnel, blocks, variants) | 22 | §2 original |
| Ads | 9 | §14 original |
| Partnership & Placements | 2 | §34 (creator_profiles, placement_tests) |
| Universal Testing | 5 | §36 (test_dimensions, universal_tests, universal_test_results, test_knowledge, judge_decision_log) |
| **TOTAL** | **38** | |

**Colonnes ajoutées (§29-34):**
- `ads`: `entityId`, `entitySlot`, `creatorProfileId`, `isWhitelisted`, `postingAsPage`
- `ad_metrics_daily`: `cpmr`, `incrementalReachPct`, `incrementalConversions`, `incrementalRoas`
- `meta_ad_accounts`: `signalQualityScore`, `eventMatchQuality`, `lastSignalCheckAt`
- `funnels`: `researchMode`, `researchPhase`

---

## 38. Free Trial + Shipping Offer Model

> Le modèle "Free Trial + Pay Shipping Only" est le plus agressif et le plus rentable
> en e-commerce subscription. 87% retention (Curology, Primal Queen, Bioma).
> Le client paie juste le shipping ($4.90), essaie 30 jours, puis est chargé automatiquement.
> L'ads peut crier "GRATUIT!" → CTR massif.
>
> ⚠️ RISQUE: Offrir un produit gratuit coûte cher (produit + shipping).
> On teste avec un FAIBLE pourcentage du trafic d'abord (A/B test vs full price).
> On surveille les dépenses ads vs revenue subscription.

### 38.1 Pourquoi ce modèle domine

| Métrique | One-Time Purchase | Free Trial + Shipping |
|----------|------------------:|----------------------:|
| CTR ads | 1-2% | 3-8% ("GRATUIT" dans le hook) |
| Conversion page | 2-5% | 15-30% (friction quasi-zéro) |
| Retention 30j | — | 87% (produit de qualité) |
| LTV client | 1× prix | 6-12× prix (subscription) |
| AOV first order | $30-50 | $4.90 (shipping only) |

**Clé**: Le produit DOIT être bon. Si le client n'aime pas → cancel immédiat → perte shipping.
C'est pourquoi on valide en Research Mode (§32) AVANT de lancer en free trial.

### 38.2 Règles de Sécurité Financière

> WHY: Offrir un produit gratuit = coûteux. On ne peut pas envoyer des milliers de produits gratuits
> sans garantie de retour. Ces règles protègent la rentabilité.

| Règle | Détail |
|-------|--------|
| **Traffic limit** | Commencer avec 5-10% du trafic sur le free trial, 90-95% sur full price |
| **Budget cap** | Max $X/jour en ads pour le free trial (configurable) |
| **Monitoring quotidien** | Si cancel rate > X% ou ad spend > revenue × 3 → pause auto |
| **Shipping $4.90** | Toujours facturer le shipping pour filtrer les abuseurs |
| **Quality gate** | Produit doit avoir 4.5+ étoiles Amazon OU être testé en Research Mode d'abord |

### 38.3 Types d'offres

```typescript
// src/types/offers.ts

type OfferType =
  | 'trial_free_shipping'       // Produit gratuit, payer uniquement shipping ($4.90)
  | 'trial_discount_first'      // Premier mois -50%, puis prix normal
  | 'subscription_lifetime'     // -50% à vie si abonnement (Primal Queen style)
  | 'bundle_buy_x_get_y'        // Achète 2 reçois 1 gratuit
  | 'limited_countdown'         // "50% off pour les 30 prochains" + countdown
  | 'one_time_only'             // Achat unique classique (sans trial)

interface Offer {
  id: string
  productId: string
  type: OfferType

  // Pricing
  regularPrice: number          // Prix normal one-time (ex: $49)
  trialPrice: number            // Prix pendant le trial (ex: $0)
  shippingPrice: number         // Shipping pendant trial (ex: $4.90)
  subscriptionPrice: number     // Prix après trial (ex: $24.50 = -50% à vie)
  subscriptionInterval: 'month' // Tous les combien

  // Subscription benefits (ce que le subscriber obtient EN PLUS)
  subscriptionBenefits: {
    lifetimeDiscount: number     // 50 (%) — -50% à vie
    freeShipping: boolean       // true — shipping gratuit sur toutes les commandes futures
    cancelAnytime: boolean      // true
    freeGifts: string[]         // ["Travel case month 2", "Bonus product month 4"]
  }

  // Anti-abuse
  shippingExplanation: string   // "On charge $4.90 pour le shipping pour éviter les abus.
                                //  Mais avec votre abonnement, le shipping est GRATUIT à vie!"
  abusePreventionNote: string   // Ce texte est affiché sur la page produit

  // Trial settings
  trialDurationDays: number     // Durée du trial (ex: 30)
  autoChargeAfterTrial: boolean // Charger automatiquement après trial

  // Urgence (optionnel)
  limitedSpots?: number         // "Pour les 30 prochains" (countdown décrémenté)
  countdownMinutes?: number     // Timer sur la page produit
  promoCode?: string            // Code auto-détecté (ex: "EMILY50")

  // Retention anti-cancel
  cancelWarningEmail: string    // Email: "Attention, vous perdrez votre -50% à VIE..."
  cancelWarningPage: string     // Page de cancel: "Êtes-vous sûr de vouloir perdre..."

  // Copywriting
  trialHeadline: string         // "Try It Free — Then Lock in 50% Off Every Purchase"
  whyFreeExplanation: string    // "87% of customers stay subscribed — so it's a win-win..."
  guaranteeText: string         // "30-Day Glow Money-Back Guarantee"
}
```

### 38.4 Stratégie de Pricing & Retention Anti-Cancel

**Le piège de l'engagement**: Quand le client veut annuler, lui rappeler ce qu'il PERD.

**Email de cancel (automatique)**:
```
Subject: ⚠️ Wait! You're about to lose your lifetime benefits...

You're about to cancel your subscription. Before you do, remember:

❌ You'll lose your 50% OFF FOR LIFE discount
❌ You'll lose FREE SHIPPING on all future orders
❌ This was a special offer — you won't be able to get it back
❌ Your next free gift ($15 value) won't be shipped

87% of our customers stay because the product works.
Give it one more month — we'll add a FREE [gift] to your next order.

[Keep My Subscription]  [I'm Sure — Cancel]
```

**Page de désabonnement (landing page dédiée)**:
```
⚠️ Are you sure you want to lose your lifetime benefits?

Your subscription gives you:
✅ 50% OFF for life — you'll never find this price again
✅ FREE shipping on every single order
✅ Free gifts every [X] months ($15-25 value each)
✅ Priority customer support

This was a special one-time offer.
If you cancel now, you can NOT re-subscribe at this price.

[Keep My 50% Off Benefits]    [Cancel Anyway]
```

**A/B test de l'offre**:
- **Variant A (contrôle)**: Prix normal, pas de free trial
- **Variant B (test)**: Free trial + shipping $4.90 + -50% à vie + free shipping à vie
- **Traffic split**: 90% A / 10% B au début, puis ajuster selon les résultats
- **Metric principale**: LTV à 90 jours (pas juste CVR immédiate)

### 38.5 Impact sur le Funnel — Gratuit = Page Produit Direct — L'advertorial est-elle nécessaire?

**PRINCIPE**: Quand le produit est GRATUIT, on en parle LE PLUS TÔT POSSIBLE.
L'ads DOIT dire "GRATUIT" dès le début (dans le hook). Le client veut claim → page produit direct.

**DÉFAUT pour Free Trial**: Ad ("GRATUIT!") → Page Produit → Checkout (SANS advertorial)

| Scénario | Funnel par défaut | Pourquoi |
|----------|-------------------|----------|
| **Free Trial** | Ad → Page Produit → Checkout | GRATUIT dans l'ads → le client veut commander direct. Pas besoin de convaincre. |
| **Free Trial (test alt.)** | Ad → Advertorial → Page Produit → Checkout | A/B test: l'advertorial peut augmenter la QUALITÉ des leads (meilleur retention 30j). |
| **Full Price** | Ad → Advertorial → Page Produit → Checkout | L'advertorial est OBLIGATOIRE pour justifier le prix. |

**Ads spécialisée Free Trial**:
- Hook: "FREE! Just pay shipping $4.90" / "Get yours FREE — limited spots!"
- CTA: "Claim Your Free Trial" (pas "Buy Now" ou "Learn More")
- Format: UGC, TikTok style, avant/après, ou créateur tenant le produit
- Urgence: "For the next 30 orders only!" + countdown

**A/B test intégré** (dimension `funnel_with_without_advertorial`):
- Flow A (défaut): Ad → Page Produit → Checkout (plus de conversions, moins qualifié?)
- Flow B (test): Ad → Advertorial → Page Produit → Checkout (moins de conversions, meilleur retention?)
- Metric principale: LTV 90 jours (pas juste CVR immédiate)
- Le winner décidera si l'advertorial est nécessaire

**Note**: En free trial, l'advertorial ne doit PLUS convaincre d'acheter, mais convaincre d'ESSAYER.
Si on utilise une advertorial, le CTA change: "Claim Your Free Trial" au lieu de "Buy Now".

**RÉPONSE**: Ça dépend du type d'offre et du canal:

| Scénario | Funnel | Pourquoi |
|----------|--------|----------|
| **Free Trial via Ads UGC/TikTok** | Ad → Page Produit → Checkout | L'UGC fait déjà le selling. "GRATUIT" = le client veut commander direct. |
| **Free Trial via Ads Image/Native** | Ad → Advertorial → Page Produit → Checkout | L'image ne suffit pas à convaincre. L'advertorial explique POURQUOI c'est gratuit. |
| **Full Price via Ads** | Ad → Advertorial → Page Produit → Checkout | L'advertorial est OBLIGATOIRE pour justifier le prix. |

**En Research Mode (§32)**: Tester les 2 flows automatiquement.
- Flow A: Ad → Page Produit (sans advertorial) → Checkout
- Flow B: Ad → Advertorial → Page Produit → Checkout
- Le winner décidera si l'advertorial est nécessaire pour CE produit/angle.

**Note**: En free trial, l'advertorial ne doit PLUS convaincre d'acheter, mais convaincre d'ESSAYER.
Le CTA change: "Claim Your Free Trial" au lieu de "Buy Now".

### 38.6 Schéma DB — Offres

```typescript
// === OFFERS ===
// WHY: Un produit peut avoir plusieurs offres (free trial, one-time, subscription lifetime).
// L'offre est testable en A/B (§36 Universal Testing).
// ⚠️ Free trial = risqué. Toujours tester avec faible % trafic d'abord.
export const offers = pgTable('offers', {
  id:                    uuid('id').defaultRandom().primaryKey(),
  productId:             uuid('product_id').references(() => products.id).notNull(),
  funnelId:              uuid('funnel_id').references(() => funnels.id),
  name:                  text('name').notNull(),                  // "Free Trial + Shipping"
  type:                  text('type').$type<OfferType>().notNull(),

  // Pricing
  regularPrice:          numeric('regular_price', { precision: 12, scale: 2 }).notNull(),
  trialPrice:            numeric('trial_price', { precision: 12, scale: 2 }).default('0'),
  shippingPrice:         numeric('shipping_price', { precision: 12, scale: 2 }).default('4.90'),
  subscriptionPrice:     numeric('subscription_price', { precision: 12, scale: 2 }),
  subscriptionInterval:  text('subscription_interval').$type<'month'>().default('month'),

  // Subscription benefits
  subscriptionBenefits:  jsonb('subscription_benefits').$type<{
    lifetimeDiscount: number          // 50 = -50%
    freeShipping: boolean
    cancelAnytime: boolean
    freeGifts: string[]
  }>().default({ lifetimeDiscount: 50, freeShipping: true, cancelAnytime: true, freeGifts: [] }),

  // Anti-abuse
  shippingExplanation:   text('shipping_explanation'),

  // Trial
  trialDurationDays:     integer('trial_duration_days').default(30),
  autoChargeAfterTrial:  boolean('auto_charge_after_trial').default(true),

  // Retention anti-cancel
  cancelWarningEmail:    text('cancel_warning_email'),
  cancelWarningPage:     text('cancel_warning_page'),

  // Urgence
  limitedSpots:          integer('limited_spots'),
  countdownMinutes:      integer('countdown_minutes'),
  promoCode:             text('promo_code'),

  // Copywriting
  trialHeadline:         text('trial_headline'),
  whyFreeExplanation:    text('why_free_explanation'),
  guaranteeText:         text('guarantee_text'),

  // Stripe
  stripeTrialPriceId:    text('stripe_trial_price_id'),
  stripeSubscriptionPriceId: text('stripe_subscription_price_id'),

  // Security: traffic limit for risky offers
  maxTrafficPercent:     integer('max_traffic_percent').default(100),  // 10 = 10% of traffic
  dailyBudgetCap:        numeric('daily_budget_cap', { precision: 10, scale: 2 }),

  isActive:              boolean('is_active').default(true),
  createdAt:             timestamp('created_at').defaultNow().notNull(),
  updatedAt:             timestamp('updated_at').defaultNow().notNull(),
}, t => [index('offers_product_idx').on(t.productId)])
```

### 38.7 Dimension A/B Testable

| Dimension | Ce qu'on teste | Métriques |
|-----------|---------------|-----------|
| `offer_type` | Free Trial vs -50% Lifetime vs One-Time | CVR, Retention 30j, LTV 90j |
| `trial_shipping_price` | $0 vs $4.90 vs $7.90 | CVR, Qualité leads, Abuse rate |
| `trial_duration` | 15 jours vs 30 jours vs 60 jours | Retention %, Cancel rate |
| `funnel_with_without_advertorial` | Ad→Page Produit vs Ad→Advertorial→Page Produit | CVR global, Cost per Trial |
| `why_free_copy` | Différentes versions "Why free?" | CVR trial claim |
| `cancel_friction` | 1-click cancel vs Warning page vs Call/email | Retention, Satisfaction |
| `cancel_warning_message` | Différents textes anti-cancel | Retention après tentative cancel |
| `subscription_benefits_display` | Montrer vs cacher les benefices à vie | Subscription CVR |

---

## 39. Offer Templates Library

> Les meilleures offres e-commerce suivent des patterns éprouvés.
> Au lieu de créer une offre from scratch, l'IA sélectionne un template gagnant
> et l'adapte au produit. Inspiré de: Primal Queen, Curology, Bioma, Ryze, Valere.

### 39.1 Pourquoi des templates

**Problème**: Créer une offre efficace demande de l'expérience. Une mauvaise offre = CVR divisée par 3.

**Solution**: Library de templates pré-configurés, chacun basé sur une offre qui a généré $1M+ en revenu.
L'IA choisit le meilleur template selon le produit, la niche, et le marché cible.

### 39.2 Templates par catégorie

```typescript
// src/types/offer-templates.ts

interface OfferTemplate {
  id: string
  name: string
  category: 'subscription_trial' | 'subscription_discount' | 'bundle' | 'urgency' | 'loyalty'
  source: string                          // Marque qui a validé cette offre
  estimatedCvr: string                    // "15-30%" (basé sur données réelles)
  bestFor: string[]                       // ["skincare", "supplement", "pet"]
  funnelFlow: string[]                    // ["ad", "advertorial?", "product_page", "checkout"]

  // Template config
  config: {
    offerType: OfferType
    pricing: {
      regularPrice: string                // "$49"
      displayPrice: string                // "$0 — Just Pay Shipping $4.90"
      subscriptionPrice: string           // "$24.50/month (-50% for life)"
      shippingPrice: string               // "$4.90 (first), FREE (subscription)"
    }
    urgency?: {
      type: 'countdown' | 'limited_spots' | 'flash_sale'
      defaultSpots: number                // 30
      defaultMinutes: number              // 60
    }
    promoCode?: {
      format: string                      // "{creator}50"
      discount: number                    // 50 (%)
    }
  }

  // Copywriting templates
  headlines: string[]                     // Variants testées
  ctaTexts: string[]
  whyFreeTexts: string[]
  guaranteeTexts: string[]
  cancelWarningTexts: string[]            // Textes anti-cancel

  isProven: boolean                       // Validé par données réelles
}
```

### 39.3 Templates pré-configurés

| # | Nom | Source | Offre | CVR estimée | Best for |
|---|-----|--------|-------|-------------|----------|
| 1 | **Primal Queen Free Trial** | Primal Queen | Produit gratuit, pay shipping $5.45, -50% à vie après 30j | 20-30% | Skincare, Supplement |
| 2 | **Curology Consultation** | Curology | Quiz personnalisé → Free trial + shipping | 15-25% | Skincare personnalisé |
| 3 | **Bioma Quiz Funnel** | Bioma | Quiz diagnostic → Free trial + subscription | 15-25% | Supplement santé |
| 4 | **Ryze Bundle Loyalty** | Ryze | Subscribe & get X FREE every month for life | 10-20% | Consommable récurrent |
| 5 | **Limited Spots Countdown** | Multiple | "50% off pour les 30 prochains" + countdown | 20-35% | Tous produits |
| 6 | **Creator Promo Code** | Multiple | Code promo créateur (ex: "EMILY50") auto-détecté | 15-25% | Tous produits |
| 7 | **Subscribe Only** | Multiple | Ne PAS montrer one-time, que subscription pré-cochée | 25-40% | Consommable |
| 8 | **Buy X Get Y Bundle** | Multiple | Achète 6 reçois 2 gratuits (packs dégressifs) | 15-25% | Packs physiques |
| 9 | **Try & Decide** | Multiple | Essai 30j gratuit, décide ensuite, cancel 1 click | 20-30% | Tous produits |
| 10 | **QR Code Loyalty** | Original | QR code dans le colis → -50% subscription à vie | 10-20% (post-achat) | Tous produits |

### 39.4 Exemples de copywriting par template

**Template 1 — Primal Queen Style (Free Trial)**:
```
Headline: "Try It Free — Then Lock in 50% Off Every Purchase"
CTA: "Claim Your Free Trial — Just Pay Shipping $4.90"
Why Free: "Because it works. 87% of customers stay subscribed — so it's a win-win.
With over 8,500 reviews and a 4.8/5 rating, we're confident you'll love it too.
You've got 30 days to decide. Cancel in one click or just contact us."
Shipping note: "We charge $4.90 for shipping to avoid abuse. But with your subscription,
shipping is FREE for life on all future orders!"
Guarantee: "30-Day Glow Money-Back Guarantee"
Cancel warning: "⚠️ You'll lose your 50% OFF FOR LIFE discount and FREE shipping forever.
This was a special offer — you won't be able to get it back."
```

**Template 5 — Limited Spots (Urgence)**:
```
Headline: "🔥 50% OFF — Only {countdown} spots left!"
CTA: "Claim My 50% Off Now"
Countdown: "⏳ This deal ends in {timer}"
Promo: "Use code {CODE} at checkout — exclusive through this link"
```

**Template 7 — Subscribe Only (Pas de one-time)**:
```
Headline: "Subscribe & Save 50% For Life"
CTA: "Start My Subscription — 50% Off"
No one-time option visible. Subscription pré-coché.
Benefits list: "Free shipping forever + Cancel anytime + Free gifts every month"
Cancel warning: "You're about to lose your exclusive 50% lifetime discount and free shipping.
This offer was available only once and cannot be restored."
```

### 39.5 Schéma DB — Offer Templates

```typescript
// === OFFER TEMPLATES ===
// WHY: Pre-built offer structures from proven winners.
// AI selects best template → adapts to product → A/B tests the result.
export const offerTemplates = pgTable('offer_templates', {
  id:                uuid('id').defaultRandom().primaryKey(),
  name:              text('name').notNull(),
  category:          text('category').$type<'subscription_trial'|'subscription_discount'|'bundle'|'urgency'|'loyalty'>().notNull(),
  source:            text('source'),
  estimatedCvr:      text('estimated_cvr'),
  bestForNiches:     jsonb('best_for_niches').$type<string[]>().default([]),
  funnelFlow:        jsonb('funnel_flow').$type<string[]>().default([]),

  // Full config (JSON)
  config:            jsonb('config').$type<OfferTemplate['config']>().notNull(),

  // Copywriting
  headlines:         jsonb('headlines').$type<string[]>().default([]),
  ctaTexts:          jsonb('cta_texts').$type<string[]>().default([]),
  whyFreeTexts:      jsonb('why_free_texts').$type<string[]>().default([]),
  guaranteeTexts:    jsonb('guarantee_texts').$type<string[]>().default([]),
  cancelWarningTexts: jsonb('cancel_warning_texts').$type<string[]>().default([]),

  isProven:          boolean('is_proven').default(false),
  isActive:          boolean('is_active').default(true),
  createdAt:         timestamp('created_at').defaultNow().notNull(),
  updatedAt:         timestamp('updated_at').defaultNow().notNull(),
})
```

---

## 40. Subscription Experience & Retention

> Le vrai revenue est dans la RETENTION, pas l'acquisition.
> Un client qui reste 6 mois × $25/mois = $150 LTV. Un one-time buyer = $25.
> Cette section couvre 4 mécaniques de rétention qui augmentent le LTV de 3-10×.

### 40.1 Subscription Roadmap — Montrer la Valeur Future

**Concept**: Montrer aux subscribers ce qu'ils reçoivent chaque mois.
Like a roadmap: mois 1 = produit, mois 2 = free gift, mois 3 = free course, mois 4 = community access...

**Pourquoi**: Le client ne voit que le prix mensuel. Il doit VOIR ce qu'il obtient.
- "Stay subscribed and unlock: Month 2 = Free travel case ($15 value)"
- "Month 3 = Access to exclusive community"
- "Month 4 = Free bonus product ($20 value)"

```typescript
// src/types/subscription-roadmap.ts

interface SubscriptionMilestone {
  month: number                         // 1, 2, 3, 4, 5, 6...
  title: string                         // "Free Travel Case"
  description: string
  type: 'free_product' | 'discount' | 'course' | 'community' | 'upgrade' | 'free_gift'
  valueUsd: number                      // Valeur perçue ($15)
  retainAfterMonths: number             // Ce milestone retient les clients jusqu'à ce mois
}
```

**Schéma DB**:

```typescript
// === SUBSCRIPTION MILESTONES ===
// WHY: Show subscribers what they'll receive each month.
// Reduces churn by showing future value. Inspired by subscription brands
// that offer free gifts, courses, and community access.
export const subscriptionMilestones = pgTable('subscription_milestones', {
  id:                uuid('id').defaultRandom().primaryKey(),
  productId:         uuid('product_id').references(() => products.id).notNull(),
  month:             integer('month').notNull(),                // 1, 2, 3, 4...
  title:             text('title').notNull(),                   // "Free Travel Case"
  description:       text('description'),
  type:              text('type').$type<'free_product'|'discount'|'course'|'community'|'upgrade'|'free_gift'>().notNull(),
  valueUsd:          numeric('value_usd', { precision: 8, scale: 2 }),
  retainAfterMonths: integer('retain_after_months'),
  isActive:          boolean('is_active').default(true),
  createdAt:         timestamp('created_at').defaultNow().notNull(),
}, t => [index('milestones_product_month').on(t.productId, t.month)])
```

### 40.2 Retention Email Timing — Les Moments Critiques du Churn

**Problème**: Le plus gros churn arrive entre le mois 1 et le mois 2 (avant la 1ère recharge).
Si on ne fait rien, 30-50% des subscribers annulent.

**Solution**: Emails automatiques avec timing précis, ciblant les moments de churn.

**Timing critique (basé sur données réelles)**:

| Moment | Churn risk | Email | Incitation |
|--------|------------|-------|------------|
| J+3 après livraison | LOW | "Comment tu trouves le produit?" | Lien vers review |
| J+7 avant recharge | **HIGH** | "Ton prochain ordre arrive dans 7 jours" | "Free gift avec cette commande!" |
| J+3 avant recharge | **CRITICAL** | "Dernière chance pour ton free gift" | Countdown + urgence |
| J+1 après recharge échouée | **EMERGENCY** | "On remarque que tu n'as pas rechargé" | Discount exceptionnel |
| Mois 3 milestone | LOW | "Tu as débloqué [milestone]!" | Free product / community access |

```typescript
// src/types/retention-triggers.ts

interface RetentionTrigger {
  id: string
  productId: string

  // QUAND déclencher
  triggerType: 'before_recharge' | 'after_delivery' | 'no_reorder' | 'milestone_reached'
  daysOffset: number                     // -7 = 7j avant recharge, +3 = 3j après livraison

  // QUOI envoyer
  emailSubject: string
  emailBody: string
  ctaText: string

  // INCITATION (optionnel)
  incentiveType?: 'free_gift' | 'discount' | 'early_access' | 'bonus_product'
  incentiveValue?: string                // "Free travel case" | "20%"

  skipIfStillActive: boolean             // Ne pas envoyer si le client est encore actif
}
```

**Schéma DB**:

```typescript
// === RETENTION TRIGGERS ===
// WHY: Automated emails at critical churn moments.
// Month 1→2 is highest churn. Targeted emails with incentives reduce churn by 30-50%.
export const retentionTriggers = pgTable('retention_triggers', {
  id:                  uuid('id').defaultRandom().primaryKey(),
  productId:           uuid('product_id').references(() => products.id).notNull(),
  name:                text('name').notNull(),                    // "Pre-Recharge Free Gift"

  // Timing
  triggerType:         text('trigger_type').$type<'before_recharge'|'after_delivery'|'no_reorder'|'milestone_reached'>().notNull(),
  daysOffset:          integer('days_offset').notNull(),

  // Content
  emailSubject:        text('email_subject').notNull(),
  emailBody:           text('email_body').notNull(),
  ctaText:             text('cta_text'),
  ctaUrl:              text('cta_url'),

  // Incentive
  incentiveType:       text('incentive_type').$type<'free_gift'|'discount'|'early_access'|'bonus_product'>(),
  incentiveValue:      text('incentive_value'),

  skipIfStillActive:   boolean('skip_if_still_active').default(true),
  isActive:            boolean('is_active').default(true),
  createdAt:           timestamp('created_at').defaultNow().notNull(),
}, t => [index('retention_product_type').on(t.productId, t.triggerType)])
```

### 40.3 QR Code Post-Achat — Upsell dans le Colis

**Concept**: Un QR code imprimé dans le colis qui redirige vers une page spéciale:
- "Scanne pour -50% à vie sur ton abonnement"
- Page unique avec countdown + offre exclusive
- Trackable (chaque QR code = 1 code promo unique)

```typescript
// Dans la table offers, ajouter:
interface PostPurchaseQR {
  enabled: boolean
  landingPageUrl: string                  // Page spéciale post-achat
  promoCodeFormat: string                 // "LOYAL-{random}" ou "{name}50"
  discountPercent: number                 // 50
  expiresInDays: number                   // 7 (urgence)
  trackConversionFrom: 'qr_scan' | 'unique_code'
}
```

**Pourquoi ça marche**: Le client a DÉJÀ le produit en main. Il l'aime (si qualité bonne).
Le QR code arrive au meilleur moment: quand le client est satisfait du produit.
Conversion typique: 10-20% de scans → subscription.

### 40.4 Promo Code Auto-Détection

**Concept**: Quand un client arrive via un lien créateur (ex: tiktok.com/@emily), le code promo
est automatiquement détecté et appliqué. Pas besoin de le taper.

**UX flow**:
1. Client clique sur lien créateur avec `?ref=emily`
2. Page charge → détecte `ref=emily` → lookup `promo_auto_rules`
3. Banner: "🎉 EMILY50 detected — 50% off! Click to apply"
4. Client clique → code appliqué → prix mis à jour en temps réel
5. Countdown: "Offer expires in 1h 13min"

```typescript
// src/types/promo-auto-detect.ts

interface PromoAutoRule {
  id: string
  promoCode: string                       // "EMILY50"
  triggerType: 'url_param' | 'referrer' | 'creator_link' | 'qr_code'
  triggerValue: string                    // "?ref=emily" | "tiktok.com/@emily"
  discountPercent: number                 // 50
  maxUses: number | null                  // null = unlimited
  expiresAt: Date | null

  // UX sur la page
  bannerText: string                      // "🎉 Code EMILY50 detected! Click to apply"
  bannerStyle: 'popup' | 'banner_top' | 'inline' | 'floating'
  autoApply: boolean                      // true = applique auto, false = demande confirmation
}
```

**Schéma DB**:

```typescript
// === PROMO AUTO RULES ===
// WHY: Remove friction. Client doesn't have to remember/type promo code.
// Creator links auto-apply discount → higher CVR.
export const promoAutoRules = pgTable('promo_auto_rules', {
  id:                uuid('id').defaultRandom().primaryKey(),
  funnelId:          uuid('funnel_id').references(() => funnels.id).notNull(),
  promoCode:         text('promo_code').notNull(),                 // "EMILY50"
  triggerType:       text('trigger_type').$type<'url_param'|'referrer'|'creator_link'|'qr_code'>().notNull(),
  triggerValue:      text('trigger_value').notNull(),
  discountPercent:   integer('discount_percent').notNull(),
  maxUses:           integer('max_uses'),
  usedCount:         integer('used_count').default(0),
  expiresAt:         timestamp('expires_at'),

  // UX
  bannerText:        text('banner_text'),
  bannerStyle:       text('banner_style').$type<'popup'|'banner_top'|'inline'|'floating'>().default('banner_top'),
  autoApply:         boolean('auto_apply').default(false),

  isActive:          boolean('is_active').default(true),
  createdAt:         timestamp('created_at').defaultNow().notNull(),
}, t => [index('promo_trigger_idx').on(t.triggerType, t.triggerValue)])
```

### 40.5 Dimensions A/B Testable (Subscription Experience)

| Dimension | Ce qu'on teste | Métriques |
|-----------|---------------|-----------|
| `roadmap_visibility` | Montrer roadmap vs ne pas montrer | Retention month 2-3 |
| `retention_email_timing` | 7j vs 5j vs 3j avant recharge | Cancel rate, Retention % |
| `retention_incentive_type` | Free gift vs Discount vs Early access | Open rate, Click rate, Retention |
| `qr_code_offer` | -50% vs Free product vs Free shipping | QR scan rate, Subscription CVR |
| `promo_auto_apply` | Auto-apply vs Click-to-apply vs Manual | CVR, Abandon panier |
| `subscribe_only_vs_choice` | Subscription only vs Subscription + One-time | Subscription CVR, AOV |
| `cancel_friction` | 1-click cancel vs Warning page vs Call/email | Retention, Satisfaction |
| `cancel_warning_message` | Différents textes anti-cancel | Retention après tentative cancel |

---

## 41. Multi-country & Localization

> US/UK/AUS sont les marchés les plus concurrentiels.
> Lancer en Norway, Denmark, Netherlands, Germany = moins de concurrence, CPC 3-5× plus bas.
> Snapchat CPAs 3-4× plus bas que Meta dans certains pays.
> Ce système gère: targeting par pays, payment processors locaux, traduction automatique.

### 41.1 Stratégie par Phase

```
PHASE 1 — TEST CHEAP ($2-5/jour)
  Pays: Philippines, Afrique du Sud, Nouvelle-Zélande
  Pourquoi: CPC $0.10-0.30 (vs $0.80-2.00 US)
  Objectif: Valider hooks/angles qui CTR (cheap = plus d'angles testés pour moins cher)
  Note: Afficher devise locale, shipping badge pays
  ⚠️ Ces pays ne sont PAS représentatifs du marché final. On valide juste l'angle.

PHASE 2 — SCALE ANGLOPHONE ($20-50/jour)
  Pays: UK, Australia, Canada
  Pourquoi: Marchés anglais, mêmes ads, résultats représentatifs
  Objectif: Valider la CONVERSION réelle avec pouvoir d'achat similaire US
  Note: Même ads anglais, ajuster prix/shipping. C'est ICI qu'on confirme le winner.
  ⚠️ On fait P2 AVANT P3 car: pas de traduction nécessaire = plus rapide + cheaper.

PHASE 3 — EXPAND EUROPE ($10-30/jour/pays)
  Pays: Norway, Denmark, Netherlands, Germany, Sweden, Switzerland
  Pourquoi: Moins de concurrence, haut pouvoir d'achat, CPC plus bas
  Objectif: Marchés très rentables avec CPC bas
  Note: Traduire ads + site, payment processors locaux (Klarna, IDEAL...)
  ⚠️ On fait P3 APRÈS P2 car: nécessite traduction + payment processors locaux = plus de setup

PHASE 4 — MONDE ($50+/jour/pays)
  Pays: France, Espagne, Italie, Brésil, Japon...
  Pourquoi: Expansion maximale
  Objectif: Couvrir tous les marchés rentables
```

### 41.2 Payment Processors par Pays

| Pays | Stripe | PayPal | Klarna | IDEAL | Bancontact | Autre |
|------|--------|--------|--------|-------|------------|-------|
| US | ✅ | ✅ | — | — | — | — |
| UK | ✅ | ✅ | ✅ | — | — | — |
| Australia | ✅ | ✅ | ✅ | — | — | — |
| Canada | ✅ | ✅ | — | — | — | — |
| Germany | ✅ | ✅ (OBLIG) | ✅ | — | — | PayPal tracking sync |
| Netherlands | ✅ | ✅ | — | ✅ (OBLIG) | — | — |
| Belgium | ✅ | ✅ | ✅ | — | ✅ | — |
| Norway | ✅ | ✅ | ✅ | — | — | Vipps |
| Denmark | ✅ | ✅ | ✅ | — | — | MobilePay |
| Sweden | ✅ | ✅ | ✅ (OBLIG) | — | — | — |
| Switzerland | ✅ | ✅ | — | — | — | TWINT |
| France | ✅ | ✅ | ✅ | — | — | — |
| Philippines | ✅ | ✅ | — | — | — | GCash, Maya |
| South Africa | ✅ | ✅ | — | — | — | PayFast |

**Règles**:
- PayPal OBLIGATOIRE partout (trust + dispute protection)
- Klarna OBLIGATOIRE en Suède (expected by consumers)
- IDEAL OBLIGATOIRE aux Netherlands (méthode #1)
- Adapter la devise locale (ZAR pour Afrique du Sud, PHP pour Philippines)

### 41.3 Traduction & Localization

```typescript
// src/types/localization.ts

type TranslationMethod =
  | 'same_english'           // Pays anglophone, pas de traduction
  | 'elevenlabs_dubbing'     // Vidéo: ElevenLabs dubbing (auto lip-sync)
  | 'ai_text_translation'    // Texte: DeepSeek/GPT pour ads + pages
  | 'ugc_local_creator'      // Payer un créateur local pour refaire la vidéo
  | 'manual_csv'             // ElevenLabs Manual Dub avec CSV traduction

interface CountryConfig {
  countryCode: string                  // 'NO' (Norway)
  countryName: string                  // 'Norway'
  language: string                     // 'no' (Norwegian)
  currency: string                     // 'NOK'
  currencySymbol: string               // 'kr'

  // Payment
  requiredProcessors: string[]         // ['stripe', 'klarna', 'vipps']
  recommendedProcessors: string[]      // ['paypal']

  // Translation
  translationMethod: TranslationMethod
  adsLanguage: string                  // 'en' (parfois anglais OK même si pays non-anglophone)
  siteLanguage: string                 // 'no' (site traduit)

  // Testing strategy
  testWithEnglishFirst: boolean        // true = tester ads en anglais d'abord
  englishProficiency: 'high' | 'medium' | 'low'  // Norway = high

  // Market
  estimatedCpcRange: [number, number]  // [0.10, 0.50]
  recommendedPlatforms: string[]       // ['snapchat', 'facebook', 'tiktok']
  population: number
  avgOrderValue: number
}
```

### 41.4 Testing Countries — Priorité

| Priorité | Pays | Pourquoi | CPC estimé | Platforms |
|----------|------|----------|------------|-----------|
| **P1 — Test** | Philippines | CPC $0.05-0.15 | Ultra cheap | FB, TikTok |
| **P1 — Test** | South Africa | CPC $0.10-0.30 | Cheap, marché anglais | FB, Snapchat |
| **P2 — Scale** | UK | Marché anglais principal | $0.50-1.50 | FB, TikTok, Snap |
| **P2 — Scale** | Australia | Haut pouvoir d'achat | $0.40-1.20 | FB, TikTok |
| **P3 — Expand** | Netherlands | 18M, super anglais, IDEAL | $0.20-0.60 | Snap, FB |
| **P3 — Expand** | Norway | Top 1 rentable | $0.15-0.50 | Snap, FB |
| **P3 — Expand** | Denmark | Haut pouvoir d'achat | $0.20-0.60 | FB, Snap |
| **P3 — Expand** | Germany | +80M, PayPal obligatoire | $0.30-0.80 | FB, TikTok |
| **P3 — Expand** | Sweden | Klarna obligatoire | $0.25-0.70 | FB, Snap |
| **P4 — Monde** | France, Espagne, Italie... | Expansion | Variable | Tous |

### 41.5 Snapchat Ads — Note pour le Ads Engine (§14)

> ⚠️ NOTE: Snapchat est un CANAL ADS, pas un feature de localisation.
> Il est mentionné ici car ses CPAs sont particulièrement bas dans les pays P1-P3.
> L'intégration technique (API, pixel, campagne) se fera dans le Ads Engine (§14).

**Pourquoi Snapchat dans les pays P1-P3**:
- CPAs 3-4× plus bas que Meta dans certains pays
- Sub ¢0.20 CPC et CPM ~$1 sur les top ads
- Top pays Snapchat: US, France, UK, Allemagne, Canada, Australie, Netherlands, Afrique du Sud, Suède, Norway
- Particulièrement fort en P1 (Afrique du Sud) et P3 (Norway, Netherlands, Denmark)

**TODO pour le Ads Engine (§14)**:
- Ajouter `snapchat` dans l'enum des plateformes supportées
- Intégrer Snapchat Marketing API (création/optimisation campaigns)
- Pixel Snapchat (add to cart + purchase) dans le checkout
- Format ads Snapchat: vertical court (15-30s), style UGC

### 41.6 Schéma DB — Multi-country

```typescript
// === COUNTRY CONFIGS ===
// WHY: Each country has different payment processors, languages, and CPC ranges.
// AI uses this to recommend which countries to test and how.
export const countryConfigs = pgTable('country_configs', {
  id:                     uuid('id').defaultRandom().primaryKey(),
  countryCode:            text('country_code').notNull().unique(),  // 'NO'
  countryName:            text('country_name').notNull(),
  language:               text('language').notNull(),               // 'no'
  currency:               text('currency').notString(),             // 'NOK'
  currencySymbol:         text('currency_symbol').notNull(),        // 'kr'

  // Payment processors
  requiredProcessors:     jsonb('required_processors').$type<string[]>().default([]),
  recommendedProcessors:  jsonb('recommended_processors').$type<string[]>().default([]),

  // Translation
  translationMethod:      text('translation_method').$type<TranslationMethod>().default('same_english'),
  adsLanguage:             text('ads_language').default('en'),
  siteLanguage:            text('site_language').default('en'),

  // Testing strategy
  testWithEnglishFirst:   boolean('test_with_english_first').default(true),
  englishProficiency:     text('english_proficiency').$type<'high'|'medium'|'low'>().default('medium'),

  // Market data
  estimatedCpcRange:      jsonb('estimated_cpc_range').$type<[number, number]>(),
  recommendedPlatforms:   jsonb('recommended_platforms').$type<string[]>().default([]),
  population:             integer('population'),
  avgOrderValue:          numeric('avg_order_value', { precision: 8, scale: 2 }),

  // Phase dans la roadmap d'expansion
  expansionPhase:         integer('expansion_phase').default(1),
  isActive:               boolean('is_active').default(true),
  createdAt:              timestamp('created_at').defaultNow().notNull(),
})
```

### 41.7 Dimensions A/B Testable (Multi-country)

| Dimension | Ce qu'on teste | Métriques |
|-----------|---------------|-----------|
| `country_targeting` | US vs UK vs Norway vs Netherlands | CPA, CPC, CVR par pays |
| `ads_language` | English ads vs Local language ads | CTR, CPA, CVR |
| `site_language` | English site vs Translated site | CVR, Time on page |
| `payment_processor` | Stripe only vs PayPal + Klarna | Checkout CVR, Abandon |
| `currency_display` | USD vs Local currency | CVR, Trust |
| `platform` | Facebook vs Snapchat vs TikTok | CPC, CPA, ROAS |

---

## 42. Mise à jour Table Count — Final V2

**Tables totales: 44**

| Catégorie | Tables | Détail |
|-----------|--------|--------|
| Core (funnel, blocks, variants) | 22 | §2 original |
| Ads | 9 | §14 original |
| Partnership & Placements | 2 | §34 (creator_profiles, placement_tests) |
| Universal Testing | 5 | §36 (test_dimensions, universal_tests, universal_test_results, test_knowledge, judge_decision_log) |
| **Offers** | 1 | §38 (offers) |
| **Offer Templates** | 1 | §39 (offer_templates) |
| **Subscription Experience** | 3 | §40 (subscription_milestones, retention_triggers, promo_auto_rules) |
| **Multi-country** | 1 | §41 (country_configs) |
| **TOTAL** | **44** | |

**Nouvelles colonnes ajoutées (§38-41):**
- `offers`: Free Trial, Shipping, Subscription Lifetime, Urgence, Anti-cancel
- `offer_templates`: 10 templates pré-configurés de marques $1M+
- `subscription_milestones`: roadmap mensuelle pour subscribers
- `retention_triggers`: emails automatiques avant moments critiques de churn
- `promo_auto_rules`: détection auto des codes promo créateurs
- `country_configs`: payment processors et traduction par pays

---

## 43. Upsell Strategy — Maximiser l'AOV

> Le premier achat est souvent un produit entry-level (masque collagène, complément...).
> L'upsell transforme un achat $30 en $80+ en proposant un produit complémentaire
> AU MOMENT où le client est le plus chaud (pendant ou juste après le checkout).
> Exemples: Primal Queen upsell supplement, Valere upsell VSL + masque laser,
> Curology upsell routine complète.

### 43.1 Pourquoi l'upsell est critique

| Métrique | Sans upsell | Avec upsell |
|----------|------------:|------------:|
| AOV | $30-50 | $80-120 |
| Revenue par client | $30 | $80-120 (+150-300%) |
| Profit margin | 20-30% | 40-60% (le 2e produit coûte moins cher à produire) |
| CVR upsell | — | 15-35% (le client est déjà en mode achat) |

**Clé**: L'upsell se présente AU MOMENT où le client a déjà sa carte bancaire en main.
Il est en "buying mode" → beaucoup plus susceptible d'accepter.

### 43.2 Types d'Upsell

```typescript
// src/types/upsell.ts

type UpsellType =
  | 'complementary_product'    // Produit complémentaire (masque + sérum)
  | 'upgrade_quantity'         // Plus de quantité (4 masques → 8 masques, -20%)
  | 'subscription_upgrade'     // Passer de one-time à subscription (-50%)
  | 'bundle_deal'              // Pack complet (routine skincare complète)
  | 'vip_access'               // Accès VIP / community / coaching
  | 'extended_warranty'        // Garantie étendue
  | 'expedited_shipping'       // Shipping prioritaire

interface UpsellOffer {
  id: string
  funnelId: string
  name: string                               // "Sérum Anti-Age complémentaire"
  type: UpsellType

  // Position dans le funnel
  trigger: 'after_checkout' | 'thank_you_page' | 'one_click' | 'email_post_purchase'
  // WHY 'one_click': Le client clique 1 fois, ajouté à sa commande SANS re-saisir CB.
  // C'est le format le plus convertisseur (15-35% CVR).

  // Produit upsell
  productId: string                          // Le produit proposé
  mainProductId: string                      // Le produit principal (celui déjà acheté)

  // Pricing
  regularPrice: number                       // Prix normal du produit upsell
  upsellPrice: number                        // Prix upsell (souvent -30 à -50%)
  discountPercent: number                    // 30 = -30%

  // Copywriting
  headline: string                           // "Wait! Complete your routine with..."
  subheadline: string
  ctaText: string                            // "Yes! Add to my order" vs "No thanks"
  urgencyNote: string                        // "This offer is only available NOW"

  // VSL intégrée (optionnel)
  vsl?: {
    enabled: boolean
    videoUrl: string                         // Vidéo de vente courte (30-90s)
    autoplay: boolean
    posterImage: string
  }

  // Friction
  oneClick: boolean                          // true = pas de re-saisie CB
  showNoThanks: boolean                      // true = montrer bouton "No thanks"
  noThanksBehavior: 'nothing' | 'downsell'  // downsell = proposer offre plus légère

  isActive: boolean
}
```

### 43.3 Structure Upsell dans le Funnel

```
FUNNEL COMPLET avec upsells:

Ad → Advertorial → Page Produit → CHECKOUT
                                          ↓
                                    UPSSELL 1 (one-click)
                                    "Ajoutez le sérum pour -30%"
                                    [Yes, Add!] [No thanks]
                                          ↓
                                    DOWNSELL (si refus)
                                    "Ok, juste le mini-sérum à -50%"
                                    [Ok!] [Non merci]
                                          ↓
                                    THANK YOU PAGE
                                    → Upsell 2 (email post-achat J+1)
                                    → QR Code dans le colis (§40.3)
                                    → Subscription upgrade (§38)
```

**Règles d'or**:
- **MAX 1 upsell** avant la thank you page (trop = friction = abandon)
- **One-click** = pas de re-saisie carte bancaire
- **Toujours proposer un downsell** si le client refuse l'upsell
- **L'upsell doit être LOGIQUE** par rapport au produit principal (masque → sérum, pas masque → livre de cuisine)

### 43.4 Exemples d'Upsell par Niche

| Niche | Produit principal | Upsell 1 | Upsell 2 (post-achat) | Downsell |
|-------|-------------------|----------|----------------------|----------|
| Skincare | Masque collagène (4 pack) | Sérum anti-âge -30% | Routine complète (8 produits) -40% | Mini-sérum échantillon -50% |
| Supplement | Complément chat (30 caps) | Pack 90 caps -25% | Subscription mensuelle -50% | Pack 60 caps -15% |
| Santé | Probiotiques | Prébiotique combo -30% | Pack immunité complète -35% | Ebook recettes gut health gratuit |
| Beauté | Fond de teint | Poudre fixante -25% | Routine complète maquillage -40% | Echantillon gratuit |
| Fitness | Protéine | Shaker + scoop offert | Pack protéine + créatine -30% | Ebook recettes protéinées gratuit |

### 43.5 Upsell avec VSL intégrée

**Concept**: Certains upsells incluent une courte VSL (30-90s) qui vend le produit complémentaire.
Le client vient de acheter → il est en confiance → la VSL capitalise sur ce momentum.

**Exemple** (inspiré des pages upsell existantes):
```
[VIDÉO 30-60s]
"Vous venez de commander nos masques collagène. Mais saviez-vous que
l'efficacité du collagène est MULTIPLIÉE par 3 quand vous combinez avec
notre sérum à l'acide hyaluronique? C'est pourquoi on vous offre -30%
UNIQUEMENT sur cette page..."

[CTA]
"Oui! Ajouter le sérum à ma commande (-30%)"
[Un bouton plus petit] "Non merci, je passe"
```

**Format vidéo**: Courte (30-90s), dynamique, pas de répétition.
Le client a déjà acheté → pas besoin de long selling. Juste: bénéfice + offre + urgence.

### 43.6 Schéma DB — Upsells

```typescript
// === UPSELL OFFERS ===
// WHY: Upsells increase AOV by 150-300%. Presented after checkout when client
// is in "buying mode". One-click = no re-entering card details.
export const upsellOffers = pgTable('upsell_offers', {
  id:                  uuid('id').defaultRandom().primaryKey(),
  funnelId:            uuid('funnel_id').references(() => funnels.id).notNull(),
  name:                text('name').notNull(),
  type:                text('type').$type<UpsellType>().notNull(),

  // Position
  trigger:             text('trigger').$type<'after_checkout'|'thank_you_page'|'one_click'|'email_post_purchase'>().notNull(),

  // Products
  productId:           uuid('product_id').references(() => products.id).notNull(),       // Upsell product
  mainProductId:       uuid('main_product_id').references(() => products.id).notNull(),  // Product already bought

  // Pricing
  regularPrice:        numeric('regular_price', { precision: 12, scale: 2 }).notNull(),
  upsellPrice:         numeric('upsell_price', { precision: 12, scale: 2 }).notNull(),
  discountPercent:     integer('discount_percent').default(30),

  // Copywriting
  headline:            text('headline').notNull(),
  subheadline:         text('subheadline'),
  ctaText:             text('cta_text').notNull(),
  urgencyNote:         text('urgency_note'),
  noThanksText:        text('no_thanks_text').default('No thanks, I\'ll pass'),

  // VSL
  vslEnabled:          boolean('vsl_enabled').default(false),
  vslVideoUrl:         text('vsl_video_url'),
  vslAutoplay:         boolean('vsl_autoplay').default(true),
  vslPosterImage:      text('vsl_poster_image'),

  // Friction
  oneClick:            boolean('one_click').default(true),
  showNoThanks:        boolean('show_no_thanks').default(true),
  noThanksBehavior:    text('no_thanks_behavior').$type<'nothing'|'downsell'>().default('downsell'),

  // Downsell (si client refuse)
  downsellId:          uuid('downsell_id').references(() => upsellOffers.id),

  // Stats
  impressions:         integer('impressions').default(0),
  conversions:         integer('conversions').default(0),
  revenue:             numeric('revenue', { precision: 12, scale: 2 }).default('0'),

  isActive:            boolean('is_active').default(true),
  createdAt:           timestamp('created_at').defaultNow().notNull(),
  updatedAt:           timestamp('updated_at').defaultNow().notNull(),
}, t => [index('upsell_funnel_idx').on(t.funnelId)])
```

### 43.7 Dimensions A/B Testable (Upsell)

| Dimension | Ce qu'on teste | Métriques |
|-----------|---------------|-----------|
| `upsell_type` | Complementary vs Quantity upgrade vs Bundle | Upsell CVR, AOV increase |
| `upsell_discount` | -20% vs -30% vs -50% | Upsell CVR, Revenue per upsell |
| `upsell_trigger` | After checkout vs Thank you page vs Email J+1 | Upsell CVR, Total revenue |
| `upsell_with_vsl` | VSL 30s vs VSL 60s vs No VSL | Upsell CVR |
| `upsell_one_click` | One-click vs Standard checkout | Upsell CVR, Abandon rate |
| `downsell_offer` | Cheaper product vs Discount vs Free trial | Downsell CVR |
| `no_thanks_text` | "No thanks" vs "I prefer aging faster" | Upsell CVR |
| `upsell_copywriting` | Different headlines/CTAs | Upsell CVR |

---

## 44. Mise à jour Table Count — Final V3

**Tables totales: 45**

| Catégorie | Tables | Détail |
|-----------|--------|--------|
| Core (funnel, blocks, variants) | 22 | §2 original |
| Ads | 9 | §14 original |
| Partnership & Placements | 2 | §34 (creator_profiles, placement_tests) |
| Universal Testing | 5 | §36 (test_dimensions, universal_tests, universal_test_results, test_knowledge, judge_decision_log) |
| Offers | 1 | §38 (offers) |
| Offer Templates | 1 | §39 (offer_templates) |
| Subscription Experience | 3 | §40 (subscription_milestones, retention_triggers, promo_auto_rules) |
| Multi-country | 1 | §41 (country_configs) |
| **Upsell** | 1 | §43 (upsell_offers) |
| **TOTAL** | **45** | |

---

## 45. Design Token System

> Les design tokens sont les SEULES valeurs visuelles que l'agent peut utiliser.
> Toute autre valeur = rejetée par le validateur.
> Inspiré des top performers DTC. L'agent compose des blocs, le CSS fait 90% du visuel.

### 45.1 Spacing Scale (4px base)

```typescript
const SPACING = {
  '0': '0px',
  '1': '4px',     // micro — badge padding, icon gap
  '2': '8px',     // tight — inline gaps, chip padding
  '3': '12px',    // compact — card inner gaps
  '4': '16px',    // base mobile padding — the default
  '5': '20px',    // comfortable — list item gaps
  '6': '24px',    // section gap mobile
  '8': '32px',    // large gap
  '10': '40px',   // section padding mobile
  '12': '48px',   // section padding desktop
  '16': '64px',   // hero spacing
} as const

type SpacingKey = keyof typeof SPACING
```

**WHY 4px base**: Mobile thumb = 44px minimum tap target. 4px divise parfaitement 44 (11 steps). Apple HIG + DTC empirique.

### 45.2 Typography (2 fonts max, scale modulaire 1.25)

```typescript
const TYPOGRAPHY = {
  families: {
    heading: "'DM Serif Display', Georgia, serif",   // DTC premium editorial feel
    body: "'Inter', -apple-system, sans-serif",       // lisible petit écran, testé mobile
  },

  sizes: {
    xs: '0.75rem',      // 12px — captions, badges, legal
    sm: '0.875rem',     // 14px — body compact mobile, metadata
    base: '1rem',       // 16px — body default (NEVER smaller on mobile)
    lg: '1.125rem',     // 18px — subheadline, CTA text
    xl: '1.25rem',      // 20px — small heading mobile
    '2xl': '1.5rem',    // 24px — heading mobile
    '3xl': '1.875rem',  // 30px — headline mobile
    '4xl': '2.25rem',   // 36px — hero headline mobile
    '5xl': '3rem',      // 48px — hero headline desktop ONLY
  },

  weights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,         // CTAs, headlines
    black: 900,        // hero headlines only
  },

  lineHeight: {
    tight: '1.2',       // headlines
    snug: '1.375',      // subheadlines
    normal: '1.5',      // body
    relaxed: '1.625',   // long-form advertorial
  },
} as const
```

**WHY 2 fonts max**: Plus de fonts = chargement lent + incohérence visuelle. Serif heading crée la hiérarchie "editorial". Sans-serif body = lisible 16px mobile.

### 45.3 Color Palettes (par niche, pré-validées WCAG AA)

```typescript
const PALETTES = {
  // Health/Supplement — urgence + confiance
  'health-warm': {
    name: 'Health Warm',
    bestFor: ['supplement', 'health', 'fitness'],
    primary: '#E74C3C',        // CTA rouge urgence
    primaryHover: '#C0392B',
    secondary: '#2C3E50',      // text principal
    accent: '#F39C12',         // badges, highlights, countdown
    background: '#FFFFFF',
    surface: '#F8F9FA',        // alternating sections
    text: '#1A1A1A',
    textMuted: '#6B7280',
    success: '#27AE60',        // trust signals, guarantee badge
    warning: '#F39C12',
  },

  // Beauty/Skincare — premium, propre, doré
  'beauty-clean': {
    name: 'Beauty Clean',
    bestFor: ['skincare', 'beauty', 'cosmetics'],
    primary: '#D4A574',        // CTA doré/nectar
    primaryHover: '#C4956A',
    secondary: '#4A4A4A',
    accent: '#E8C9A0',
    background: '#FEFEFE',
    surface: '#F5F0EB',        // warm off-white
    text: '#2D2D2D',
    textMuted: '#8B8B8B',
    success: '#7FB069',
    warning: '#E6B655',
  },

  // Supplement Bold — haute énergie, action
  'supplement-bold': {
    name: 'Supplement Bold',
    bestFor: ['supplement', 'nootropic', 'energy'],
    primary: '#FF6B00',        // orange high-energy
    primaryHover: '#E05E00',
    secondary: '#1A1A2E',      // dark navy text
    accent: '#FFB800',         // gold badges
    background: '#FFFFFF',
    surface: '#FFF8F0',        // warm tint
    text: '#1A1A1A',
    textMuted: '#6B7280',
    success: '#10B981',
    warning: '#F59E0B',
  },

  // Pet — naturel, amical, confiance
  'pet-friendly': {
    name: 'Pet Friendly',
    bestFor: ['pet', 'animal', 'natural'],
    primary: '#4CAF50',        // green natural
    primaryHover: '#43A047',
    secondary: '#37474F',
    accent: '#FF9800',         // orange warm accent
    background: '#FFFFFF',
    surface: '#F1F8E9',        // light green tint
    text: '#263238',
    textMuted: '#78909C',
    success: '#66BB6A',
    warning: '#FFA726',
  },
} as const

type PaletteKey = keyof typeof PALETTES
```

**Règle absolue**: L'agent choisit UNE palette par funnel. Jamais de mix. Chaque palette est pré-validée pour contraste WCAG AA (≥ 4.5) sur mobile.

### 45.4 Border Radius, Shadows, Breakpoints

```typescript
const RADIUS = {
  none: '0px',
  sm: '4px',       // small elements, tags
  md: '8px',       // inputs, small cards
  lg: '12px',      // buttons mobile, cards
  xl: '16px',      // premium cards, modals
  full: '9999px',  // pills, badges, avatars
} as const

// WHY soft never sharp: DTC premium = rounded corners. Sharp = cheap/enterprise look.
const SHADOW = {
  none: 'none',
  sm: '0 1px 2px rgba(0,0,0,0.05)',     // subtle elevation
  md: '0 4px 6px rgba(0,0,0,0.07)',      // cards
  lg: '0 10px 15px rgba(0,0,0,0.1)',     // modals, popups
} as const

// WHY heavy shadows = cheap: overdone shadows scream "template builder".
const BREAKPOINTS = {
  mobile: '0px',       // 0-767px — DEFAULT, always designed first
  tablet: '768px',     // 768-1024px
  desktop: '1025px',   // 1025+
} as const
```

### 45.5 CTA Dimensions (Mobile-First, Thumb-Friendly)

```typescript
const CTA_DIMENSIONS = {
  minHeight: '52px',                // Apple HIG: 44px min, DTC: 52px for comfort
  minHeightDesktop: '56px',
  paddingX: '24px',                 // mobile
  paddingXDesktop: '32px',
  fontSize: '1.125rem',             // 18px — NEVER smaller on CTAs
  fontWeight: 'bold' as const,
  borderRadius: RADIUS.lg,          // 12px
  fullWidth: true,                   // mobile: CTAs are 100% width
  fullWidthDesktop: false,           // desktop: auto width, min 220px
  minDesktopWidth: '220px',
  touchFeedback: 'scale(0.97)',      // tactile press feedback
} as const
```

### 45.6 Image Aspect Ratios (DTC-Specific)

```typescript
const IMAGE_RATIOS = {
  productHero: '4:5',          // 1080x1350 — Instagram/DTC standard, best mobile
  productThumbnail: '1:1',     // square grid
  lifestyle: '16:9',           // wide lifestyle shot
  beforeAfter: '1:1',          // side-by-side comparison
  testimonial: '1:1',          // avatar/photo
  banner: '21:9',              // desktop only hero banner
  productInUse: '4:5',         // person using product, portrait
} as const
```

### 45.7 Page Max-Widths par Type

```typescript
const PAGE_MAX_WIDTHS = {
  advertorial: '720px',       // editorial = narrow, readable, newspaper feel
  'product-page': '1024px',   // needs side-by-side on desktop
  vsl: '960px',               // video centered
  checkout: '520px',          // minimal, focused, no distraction
  upsell: '520px',            // same as checkout — impulse decision
  downsell: '520px',          // same as upsell
  optin: '640px',             // centered, focused on form
  quiz: '640px',              // one question, centered
  'thank-you': '640px',       // confirmation, warm
  bridge: '640px',            // single purpose, move to next step
} as const
```

**WHY**: Page width = prime psychologique. Checkout étroit = focus. Advertorial étroit = article. Product page large = e-commerce.

### 45.8 Design Tokens Exports (TypeScript)

```typescript
export const DESIGN_TOKENS = {
  spacing: SPACING,
  typography: TYPOGRAPHY,
  palettes: PALETTES,
  radius: RADIUS,
  shadow: SHADOW,
  breakpoints: BREAKPOINTS,
  cta: CTA_DIMENSIONS,
  imageRatios: IMAGE_RATIOS,
  pageMaxWidth: PAGE_MAX_WIDTHS,
} as const

// Agent-safe subset: only key references, not raw values
export type DesignTokenSet = typeof DESIGN_TOKENS
export type PaletteKey = keyof typeof PALETTES
export type SpacingKey = keyof typeof SPACING
export type FontSizeKey = keyof typeof TYPOGRAPHY.sizes
```

---

## 46. Block Composition Rules (par type de page)

> L'agent ne peut pas empiler des blocs au hasard.
> Chaque type de page a une structure obligatoire, des blocs interdits, et un maximum.
> C'est une "grammaire" — l'agent compose dans ce cadre strict.

### 46.1 Règles par Type de Page

```typescript
type StepType =
  | 'product-page' | 'advertorial' | 'vsl' | 'checkout'
  | 'upsell' | 'downsell' | 'optin' | 'quiz'
  | 'thank-you' | 'bridge'

interface CompositionRule {
  requiredSequence: string[]    // Order must be respected (can insert between)
  requiredBlocks: string[]      // Must be present somewhere
  forbiddenBlocks: string[]     // Must NOT appear
  sectionGap: SpacingKey        // Spacing between sections
  headlineMaxChars: number      // Max headline length (mobile readability)
  maxBlocks: number             // Prevent infinite pages
}

const PAGE_COMPOSITION_RULES: Record<StepType, CompositionRule> = {
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
    requiredBlocks: ['hero', 'reviews', 'button'],
    forbiddenBlocks: ['payment-form', 'order-summary', 'quiz-step'],
    sectionGap: '8',
    headlineMaxChars: 80,
    maxBlocks: 20,
  },
  'vsl': {
    requiredSequence: ['hero', 'button'],
    requiredBlocks: ['hero', 'button'],
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
  'downsell': {
    requiredSequence: ['heading', 'bundle-offers', 'add-to-cart'],
    requiredBlocks: ['heading', 'bundle-offers', 'add-to-cart'],
    forbiddenBlocks: ['payment-form', 'faq', 'reviews', 'product-carousel'],
    sectionGap: '6',
    headlineMaxChars: 50,
    maxBlocks: 5,
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
```

### 46.2 Guide de Structure par Type (injecté dans le prompt agent)

| Type | Structure optimale | Points clés |
|------|-------------------|-------------|
| **product-page** | Hero → Social Proof (reviews HIGH!) → Images → Benefits → Trust → Bundles → Countdown → Comparison → FAQ → Guarantee → Final CTA | Reviews ABOVE fold. Bundle "Most Popular" pre-selected. Sticky CTA mobile. |
| **advertorial** | Editorial Hero → Problem Story → Solution Reveal → Social Proof → Benefits → Authority → CTA woven throughout | NEWS ARTICLE look. Long-form. Subtle CTAs every 3-4 sections. Serif heading. |
| **vsl** | Hero with video → Problem → Solution → Proof → CTA → FAQ → Guarantee → Final CTA | Video is the star. Sticky player mobile (PiP). CTAs at key moments. |
| **checkout** | Order Summary → Payment → Trust Badges → Guarantee | MINIMAL. No nav, no footer. Express checkout (Apple/Google Pay) TOP. Security badges next to submit. |
| **upsell** | Headline → One-Click Offer → Countdown → Accept/Decline | ONE offer, ONE decision, ONE click. "YES! Add to my order" (green) vs negative opt-out. |
| **downsell** | "Wait!" headline → Reduced Offer → One-Click Accept | Even simpler than upsell. Price is ONLY difference. 50%+ discount typical. |
| **optin** | Hero → Value Prop → Form (email only) → Trust | Email + maybe first name. NOTHING else. Button = benefit ("Get My Free Guide"). |
| **quiz** | Question → Options (2-4 visual cards) → Progress bar → Next | One question per screen. Visual option cards. Progress bar reduces abandonment. |
| **thank-you** | Confirmation → Next Steps → Upsell/Cross-sell → Social Share | Positive reinforcement. Order summary. Related products. |
| **bridge** | Headline → Brief context → Button to next step | Single purpose: move to NEXT page. One CTA only. No distractions. |

---

## 47. CSS Design System Mobile-First

> Ce CSS est le "goût" du système. L'agent ne touche PAS à ce fichier.
> Il choisit des blocs, le CSS garantit que N'IMPORTE QUELLE composition = page pro.
> 90% du visuel vient du CSS, pas du LLM.

### 47.1 Reset + Base (Mobile-First)

```css
:root {
  /* Palette injected at render time from §45 PALETTES */
  --c-primary: var(--palette-primary);
  --c-primary-hover: var(--palette-primary-hover);
  --c-secondary: var(--palette-secondary);
  --c-accent: var(--palette-accent);
  --c-bg: var(--palette-background);
  --c-surface: var(--palette-surface);
  --c-text: var(--palette-text);
  --c-muted: var(--palette-text-muted);
  --c-success: var(--palette-success);
  --c-warning: var(--palette-warning);

  /* Fonts from §45 */
  --f-heading: 'DM Serif Display', Georgia, serif;
  --f-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

  /* Spacing tokens from §45 */
  --s-1: 4px; --s-2: 8px; --s-3: 12px; --s-4: 16px;
  --s-5: 20px; --s-6: 24px; --s-8: 32px; --s-10: 40px;
  --s-12: 48px; --s-16: 64px;

  /* Radius tokens from §45 */
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
```

### 47.2 Sections (.funnel-section)

```css
/* WHY: Le container universel. Toute section de page = .funnel-section */
.funnel-section {
  padding: var(--s-10) var(--s-4);       /* 40px 16px mobile */
  max-width: var(--page-max-width, 720px);
  margin: 0 auto;
}
.funnel-section--surface { background: var(--c-surface); }

/* Alternance automatique : chaque section paire = surface */
/* WHY: Crée un rythme visuel sans effort de design */
.funnel-section:nth-child(even) { background: var(--c-surface); }

@media (min-width: 768px) {
  .funnel-section { padding: var(--s-12) var(--s-6); }
}
@media (min-width: 1025px) {
  .funnel-section { padding: var(--s-16) var(--s-8); }
}
```

### 47.3 Typography (Hiérarchie Stricte)

```css
/* WHY: Serif heading = editorial DTC feel. Sans body = lisible 16px mobile */
.block-heading {
  font-family: var(--f-heading);
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: var(--s-4);
  text-align: left;  /* NEVER center long headlines on mobile — left = readable */
}
.block-heading--hero {
  font-size: 2.25rem;       /* 36px mobile */
  letter-spacing: -0.02em;  /* tighter for headlines */
  line-height: 1.1;
}
.block-heading--section { font-size: 1.5rem; }   /* 24px mobile */
.block-heading--card {
  font-family: var(--f-body);
  font-size: 1.125rem;      /* 18px */
  font-weight: 600;
}
@media (min-width: 768px) {
  .block-heading--hero { font-size: 3rem; }       /* 48px desktop */
  .block-heading--section { font-size: 2rem; }    /* 32px desktop */
}

.block-text {
  font-size: 1rem;
  line-height: 1.625;       /* 26px — relaxed for advertorials */
  color: var(--c-muted);
}
.block-text--sm { font-size: 0.875rem; line-height: 1.5; }
```

### 47.4 Buttons / CTAs (Le Plus Critique)

```css
/* WHY: Full-width mobile = thumb-friendly. 52px = DTC optimal.
   Touch feedback scale(0.97) = iOS native feel. */
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
.cta-button--primary:active { transform: scale(0.97); } /* tactile feedback */
.cta-button--urgency {
  background: var(--c-primary);
  color: white;
  animation: pulse-glow 2s infinite;
}
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 4px 14px rgba(0,0,0,0.15); }
  50% { box-shadow: 0 4px 20px rgba(0,0,0,0.3); }
}
@media (min-width: 768px) {
  .cta-button { width: auto; min-width: 220px; min-height: 56px; }
}

/* Sticky CTA bar — mobile only */
/* WHY: Conversion +15-30% sur mobile. CTA TOUJOURS visible. */
.sticky-cta-bar {
  position: fixed;
  bottom: 0; left: 0; right: 0;
  background: white;
  padding: var(--s-3) var(--s-4);
  border-top: 1px solid #e5e7eb;
  box-shadow: 0 -4px 12px rgba(0,0,0,0.08);
  z-index: 100;
  display: flex;
  align-items: center;
  gap: var(--s-3);
  padding-bottom: calc(var(--s-3) + env(safe-area-inset-bottom, 0px)); /* iPhone notch */
}
@media (min-width: 768px) {
  .sticky-cta-bar { display: none; }
}
```

### 47.5 Images (Lazy + Ratio + Blur Placeholder)

```css
/* WHY: Zero CLS (Layout Shift). blur-up placeholder = sentiment de rapidité. */
.block-image-wrapper {
  position: relative;
  overflow: hidden;
  border-radius: var(--r-lg);
  background: var(--c-surface); /* prevents CLS while loading */
}
.block-image-wrapper img {
  width: 100%; height: 100%;
  object-fit: cover;
  transition: opacity 0.3s ease;
}
.block-image-wrapper::before {
  content: '';
  position: absolute; inset: 0;
  background-size: cover;
  background-position: center;
  filter: blur(20px);
  transform: scale(1.1);
  opacity: 0;
  transition: opacity 0.3s ease;
}
.block-image-wrapper.loading::before { opacity: 1; }
.block-image-wrapper.loaded img { opacity: 1; }
```

### 47.6 Cards (Bundles, Testimonials, FAQ)

```css
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
/* WHY: "Most Popular" badge = ancre sociale, guide le choix */
.block-card--popular {
  position: relative;
  border-color: var(--c-primary);
}
.block-card--popular::before {
  content: attr(data-badge);
  position: absolute;
  top: -12px; left: 50%;
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
```

### 47.7 Carousel (Touch-Friendly)

```css
/* WHY: Peeking (85%) indique qu'il y a plus de contenu. Scroll naturel au doigt. */
.carousel-container {
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  display: flex;
  gap: var(--s-3);
  padding: var(--s-2);
}
.carousel-container::-webkit-scrollbar { display: none; }
.carousel-slide {
  flex: 0 0 85%;            /* Show next card peeking */
  scroll-snap-align: center;
}
@media (min-width: 768px) {
  .carousel-slide { flex: 0 0 calc(33.333% - var(--s-3)); }
}
```

### 47.8 FAQ Accordion (Mobile Optimized)

```css
.faq-item { border-bottom: 1px solid #e5e7eb; }
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
  min-height: 52px;           /* Tap target */
  -webkit-tap-highlight-color: transparent;
}
.faq-question::after {
  content: '+';
  font-size: 1.25rem;
  transition: transform 0.3s ease;
}
.faq-item.open .faq-question::after { transform: rotate(45deg); }
.faq-answer {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.3s ease;
}
.faq-item.open .faq-answer { grid-template-rows: 1fr; }
.faq-answer-inner {
  overflow: hidden;
  padding-bottom: var(--s-5);
  line-height: 1.625;
  color: var(--c-muted);
}
```

### 47.9 Countdown Timer

```css
/* WHY: tabular-nums prevents layout shift when numbers change */
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
  font-variant-numeric: tabular-nums;
}
.countdown-box__label {
  font-size: 0.625rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  opacity: 0.8;
}
```

### 47.10 Trust Badges, Reviews, Guarantee

```css
/* Trust badges */
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

/* Reviews */
.review-card {
  padding: var(--s-4);
  border-radius: var(--r-lg);
  background: var(--c-surface);
}
.review-card__rating {
  color: #F59E0B;             /* Gold stars — ALWAYS */
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

/* Guarantee */
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
```

### 47.11 Patterns Mobile DTC (Récap)

| Pattern | Impact | CSS |
|---------|--------|-----|
| Sticky CTA bar | +15-30% conversion | `position: fixed; bottom: 0` + `safe-area-inset-bottom` |
| Peeking carousel | Indique plus de contenu | `flex: 0 0 85%` + `scroll-snap` |
| Alternating section bg | Rythme visuel sans effort | `:nth-child(even) { background: var(--c-surface) }` |
| Badge "Most Popular" | Ancre sociale | `::before` pseudo-element sur card |
| Blur-up images | Zero CLS | LQIP `blur(20px)` → transition |
| Touch feedback | iOS native feel | `transform: scale(0.97)` sur `:active` |
| Negative opt-out | Psychologie | Texte du bouton decline dans upsell template |
| Serif heading + sans body | Hiérarchie pro | 2 font families dans les tokens |


---

## 48. Validation Pipeline (8 Passes)

> Avant qu'un block tree ne devienne du HTML, il passe 8 passes de validation.
> Si validation échoue -> auto-retry avec feedback d'erreurs (max 3 tentatives).
> Quality score 0-100. < 70 = auto-retry.
> **100% automatise - aucun humain ne valide manuellement.**

### 48.1 Pipeline Diagram

```
Block Tree JSON
      |
      v
+------------------+
| 1. Schema        |  Validate against Zod schemas
|    Validation    |  (block types, required props, nesting rules)
+--------+---------+
         v
+------------------+
| 2. Composition   |  Required blocks, forbidden blocks,
|    Rules         |  sequence, max blocks (section 46)
+--------+---------+
         v
+------------------+
| 3. Design Token  |  All colors/spacing/typography
|    Compliance    |  from approved token set (section 45)
+--------+---------+
         v
+------------------+
| 4. Mobile Layout |  Playwright render at 375x812,
|    Constraints   |  overflow, tap targets, CLS, CTA fold
+--------+---------+
         v
+------------------+
| 5. Performance   |  Image weight <= 800KB, <= 12 images,
|    Budget        |  <= 3 fonts, zero JS, DOM <= 800
+--------+---------+
         v
+------------------+
| 6. Accessibility |  Contrast >= 4.5 (WCAG AA),
|    Checks        |  alt text, heading hierarchy, aria
+--------+---------+
         v
+------------------+
| 7. Compliance    |  Stripe elements, legal text,
|    Checks        |  tracking pixel markers
+--------+---------+
         v
+------------------+
| 8. Lighthouse    |  Mobile preset audit
|    Audit         |  Performance >= 90, Accessibility >= 95
+--------+---------+
         |
         v
   Static HTML Generation
   -> Upload R2 -> Deploy via Nginx
```

### 48.2 Pass 1: Schema Validation (Zod)

```typescript
import { z } from 'zod'

const HeadingBlock = z.object({
  type: z.literal('heading'),
  id: z.string(),
  props: z.object({
    level: z.number().min(1).max(4),
    text: z.string().min(1).max(200),
    align: z.enum(['left', 'center', 'right']).default('left'),
    weight: z.enum(['normal', 'semibold', 'bold']).default('bold'),
  }),
})

const CtaBlock = z.object({
  type: z.literal('button'),
  id: z.string(),
  props: z.object({
    label: z.string().min(2).max(60),
    variant: z.enum(['primary', 'secondary', 'urgency', 'ghost']).default('primary'),
    size: z.enum(['sm', 'md', 'lg']).default('md'),
    fullWidth: z.boolean().default(true),
  }),
})

const ImageBlock = z.object({
  type: z.literal('image'),
  id: z.string(),
  props: z.object({
    src: z.string().url(),
    alt: z.string().min(1),
    aspect: z.enum(['1/1', '3/4', '4/3', '16/9', '9/16']).default('3/4'),
    lazy: z.boolean().default(true),
  }),
})

const BlockTreeSchema = z.object({
  version: z.literal('1.0'),
  pageType: z.enum(['product-page', 'advertorial', 'vsl', 'checkout', 'upsell', 'downsell', 'optin', 'quiz', 'thank-you', 'bridge']),
  palette: z.enum(['health-warm', 'beauty-clean', 'supplement-bold', 'pet-friendly']),
  blocks: z.array(z.discriminatedUnion('type', [HeadingBlock, CtaBlock, ImageBlock])).min(3).max(30),
  metadata: z.object({
    title: z.string().max(60),
    description: z.string().max(160),
    trackingId: z.string(),
  }),
})
```

### 48.3 Pass 2: Composition Rules (section 46)

```typescript
function validateComposition(blockTree: BlockTree, pageType: StepType): ValidationResult {
  const rules = PAGE_COMPOSITION_RULES[pageType]
  const blockTypes = blockTree.blocks.map(b => b.type)
  const errors: ValidationError[] = []

  for (const required of rules.requiredBlocks) {
    if (!blockTypes.includes(required)) {
      errors.push({ code: 'REQUIRED_BLOCK_MISSING', message: `"${required}" missing for "${pageType}"`, severity: 'error' })
    }
  }
  for (const forbidden of rules.forbiddenBlocks) {
    if (blockTypes.includes(forbidden)) {
      errors.push({ code: 'FORBIDDEN_BLOCK_PRESENT', message: `"${forbidden}" forbidden in "${pageType}"`, severity: 'error' })
    }
  }
  if (blockTypes.length > rules.maxBlocks) {
    errors.push({ code: 'MAX_BLOCKS_EXCEEDED', message: `${blockTypes.length} > max ${rules.maxBlocks}`, severity: 'warning' })
  }
  return { valid: errors.filter(e => e.severity === 'error').length === 0, errors }
}
```

### 48.4 Pass 4: Mobile Layout (Playwright 375x812)

```typescript
const MOBILE_CONSTRAINTS = {
  viewportWidth: 375,
  viewportHeight: 812,
  minTapTarget: 44,
  minCtaHeight: 52,
  minBodyFontSize: 16,
  maxClsScore: 0.1,
  maxSectionHeight: 1200,
}

async function validateMobileLayout(renderedHtml: string): Promise<ValidationResult> {
  const errors: ValidationError[] = []
  const page = await browser.newPage()
  await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2 })
  await page.setContent(renderedHtml, { waitUntil: 'networkidle0' })

  // Horizontal overflow
  const hasOverflow = await page.evaluate(() =>
    document.documentElement.scrollWidth > document.documentElement.clientWidth
  )
  if (hasOverflow) errors.push({ code: 'HORIZONTAL_OVERFLOW', severity: 'error', message: 'Horizontal scroll at 375px' })

  // Tap targets >= 44x44px
  const smallTargets = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button, a, input, [role="button"]'))
      .filter(el => { const r = el.getBoundingClientRect(); return r.width < 44 || r.height < 44 })
      .map(el => ({ tag: el.tagName, w: el.getBoundingClientRect().width, h: el.getBoundingClientRect().height }))
  })
  if (smallTargets.length > 0) errors.push({ code: 'TAP_TARGET_TOO_SMALL', severity: 'error', message: `${smallTargets.length} elements < 44x44px` })

  // First CTA above fold
  const ctaTop = await page.evaluate(() => {
    const cta = document.querySelector('.cta-button, [data-track*="cta"]')
    return cta ? cta.getBoundingClientRect().top : null
  })
  if (ctaTop === null || ctaTop > 812) errors.push({ code: 'CTA_BELOW_FOLD', severity: 'error', message: 'First CTA below 812px' })

  await page.close()
  return { valid: errors.filter(e => e.severity === 'error').length === 0, errors }
}
```

### 48.5 Performance Budget

```typescript
const PERFORMANCE_BUDGETS = {
  maxTotalImageWeight: 800,   // KB
  maxImageCount: 12,
  maxFontCount: 3,
  maxCssSize: 50,             // KB
  maxDomNodes: 800,
  maxJsSize: 0,               // Zero JS except tracking + Stripe
  lighthousePerformanceTarget: 90,
  lighthouseAccessibilityTarget: 95,
}
```

### 48.6 Auto-Retry avec Feedback

```typescript
async function composeWithRetry(context: AgentContext, maxRetries = 3) {
  let attempt = 0
  let lastErrors: ValidationError[] = []

  while (attempt < maxRetries) {
    attempt++
    const blockTree = await llm.compose({
      context,
      previousErrors: attempt > 1 ? lastErrors : undefined,
      attempt,
    })
    const result = await validateBlockTree(blockTree, context.pageType)
    if (result.valid) return { blockTree, score: result.score }
    lastErrors = result.errors
  }
  throw new AgentCompositionError(`Failed after ${maxRetries} retries`)
}

// Quality score: 100 - (errors x 10) - (warnings x 3)
function calculateQualityScore(errors: ValidationError[], warnings: ValidationError[]): number {
  return Math.max(0, 100 - errors.length * 10 - warnings.length * 3)
}
```

Le retry prompt inclut les erreurs specifiques :

```markdown
## Previous Attempt Failed Validation

### Error 1: CTA_BELOW_FOLD
First CTA at y=1043px, below 812px viewport.
Fix: Move hero CTA into first block, or add sticky CTA bar earlier.

### Error 2: TAP_TARGET_TOO_SMALL
"Read More" link 32x18px. Must be >= 44x44px.
Fix: Use button block with size="sm" instead of text link.

Re-generate fixing ONLY these issues.
```

---

## 49. A/B Testing State Machine (5 Etapes)

> Chaque page generee entre dans une state machine A/B avec gates statistiques.
> **100% automatise - l'IA lance les tests, analyse les resultats, promeut les champions.**
> Quand champion trouve -> pattern auto-codifie en SOP via section 50.

### 49.1 State Machine Diagram

```
                    +------------------------------------------+
                    |                                          |
    +-----------+   |   +------------+   +--------------+     |
    |           |   |   |            |   |              |     |
    |  SANDBOX  +---+---> ELIMINATION+--->   COMMANDO   |     |
    |           |   |   |            |   |              |     |
    +-----+-----+   |   +-----+------+   +------+-------+     |
          |         |         |                  |             |
     Agent creates  |    Kill weak variants   Statistical       |
     n variants,   |    (p > 0.30)            significance      |
     5-10% traffic |                          reached           |
          |         |                          p < 0.05          |
          |         |         |                  |             |
          |         |   +-----v------+   +--------------+      |
          |         |   |            |   |              |      |
          |         |   |   DUEL     |   |  CHAMPION    |      |
          |         |   |            +--->              |      |
          |         |   | 2 remain,  |   | 100% traffic |      |
          |         |   | 50/50 split|   | Pattern->SOP |      |
          |         |   +------------+   +--------------+      |
          |         |                                          |
          |         +------------------------------------------+
          |              Pattern codified -> section 50 RAG Engine
          |
          v
    New experiment spawns with challenger variants
```

### 49.2 Stage Gates

| From -> To | Condition | Threshold |
|------------|-----------|-----------|
| Sandbox -> Elimination | Total traffic reached | >= 200 views across all variants |
| Elimination -> Commando | Weak variants killed | Only 2-3 strong remain (CVR >= 50% of best) |
| Commando -> Duel | Significance approaching | p < 0.10 (Chi-squared) |
| Duel -> Champion | Statistical significance | p < 0.05 (Chi-squared) |

### 49.3 Drizzle Schema (3 nouvelles tables)

```typescript
// -- EXPERIMENTS --
export const experiments = pgTable('experiments', {
  id:               uuid('id').primaryKey().defaultRandom(),
  funnelPageId:     uuid('funnel_page_id').references(() => funnelPages.id).notNull(),
  name:             text('name').notNull(),
  stage:            text('stage').$type<'sandbox'|'elimination'|'commando'|'duel'|'champion'>().default('sandbox'),
  hypothesis:       text('hypothesis'),
  primaryMetric:    text('primary_metric').default('conversion_rate'),
  trafficAllocation: real('traffic_allocation').default(1.0),
  minSampleSize:    integer('min_sample_size').default(1000),
  confidenceLevel:  real('confidence_level').default(0.95),
  startedAt:        timestamp('started_at'),
  endedAt:          timestamp('ended_at'),
  result:           jsonb('result'),
  createdAt:        timestamp('created_at').defaultNow().notNull(),
}, t => [index('exp_page_idx').on(t.funnelPageId)])

// -- VARIANTS --
export const variants = pgTable('variants', {
  id:             uuid('id').primaryKey().defaultRandom(),
  experimentId:   uuid('experiment_id').references(() => experiments.id).notNull(),
  name:           text('name').notNull(),
  blockTree:      jsonb('block_tree').notNull(),
  designTokens:   jsonb('design_tokens'),
  renderedHtml:   text('rendered_html'),
  trafficWeight:  real('traffic_weight').default(0.5),
  isControl:      boolean('is_control').default(false),
  createdAt:      timestamp('created_at').defaultNow().notNull(),
}, t => [index('variant_exp_idx').on(t.experimentId)])

// -- CONVERSIONS --
export const conversions = pgTable('conversions', {
  id:             uuid('id').primaryKey().defaultRandom(),
  variantId:      uuid('variant_id').references(() => variants.id).notNull(),
  experimentId:   uuid('experiment_id').references(() => experiments.id).notNull(),
  visitorId:      text('visitor_id').notNull(),
  eventType:      text('event_type').$type<
    'view' | 'click_cta' | 'add_to_cart' | 'begin_checkout' | 'purchase' | 'subscription_created'
  >().notNull(),
  revenue:        numeric('revenue', { precision: 12, scale: 2 }),
  metadata:       jsonb('metadata'),
  createdAt:      timestamp('created_at').defaultNow().notNull(),
}, t => [
  index('conv_variant_idx').on(t.variantId),
  index('conv_exp_type_idx').on(t.experimentId, t.eventType),
  index('conv_time_idx').on(t.createdAt),
])
```

---

## 50. RAG Pattern Engine (Feedback Loop)

> **Boucle de feedback autonome.** Quand un champion est trouve, l'IA extrait
> le pattern, le stocke comme SOP, et l'injecte dans les futures generations.
> Chaque generation de pages est meilleure que la precedente. Zero humain.

### 50.1 Flow de Codification

```
Champion trouve (section 49)
      |
      v
1. Diff block trees (winner vs loser)
      |
      v
2. Classifier pattern type (hero_layout, cta_placement, bundle_order...)
      |
      v
3. Calculer lift % = ((winner CVR - loser CVR) / loser CVR) x 100
      |
      v
4. Generer SOP description (LLM Council, < 500 words)
      |
      v
5. Stocker winning_pattern (DB + embedding pgvector)
      |
      v
6. Creer RAG document pour vector search
      |
      v
7. Injecter dans contexte du prochain agent (section 51)
```

### 50.2 SOP Promotion Pipeline

```typescript
// candidate -> validated -> sop -> deprecated
// candidate: 1 experiment
// validated: 3+ independent experiments
// sop: 5+ experiments + lift > 10% + confidence > 95%
// deprecated: stopped winning

async function evaluatePatternPromotion(): Promise<void> {
  const candidates = await db.query.winningPatterns.findMany({
    where: eq(winningPatterns.status, 'candidate'),
  })
  for (const pattern of candidates) {
    const confirming = await db.query.experiments.findMany({
      where: and(
        eq(experiments.stage, 'champion'),
        sql`result->>'winningPatternType' = ${pattern.patternType}`,
      ),
    })
    if (confirming.length >= 3) {
      await db.update(winningPatterns).set({ status: 'validated' }).where(eq(winningPatterns.id, pattern.id))
    }
    if (confirming.length >= 5 && pattern.liftPercent > 10 && pattern.confidence > 0.95) {
      await db.update(winningPatterns).set({ status: 'sop' }).where(eq(winningPatterns.id, pattern.id))
      await updateBlockDefaults(pattern)
    }
  }
}
```

### 50.3 Agent Context Building (RAG Query)

```typescript
async function buildAgentContext(brandId: string, pageType: string, vertical: string): Promise<AgentContext> {
  const brand = await db.query.brands.findFirst({ where: eq(brands.id, brandId) })
  const patterns = await db.execute(sql`
    SELECT * FROM winning_patterns
    WHERE status IN ('validated', 'sop')
      AND (page_type = ${pageType} OR page_type = 'all')
      AND (vertical = ${vertical} OR vertical IS NULL)
    ORDER BY lift_percent DESC LIMIT 10
  `)
  return {
    brand,
    scaffold: PAGE_COMPOSITION_RULES[pageType],
    winningPatterns: patterns.map(p => ({ description: p.description, blockSignature: p.blockSignature, lift: p.liftPercent })),
    designTokens: { ...DEFAULT_TOKENS, ...brand.tokenOverrides },
  }
}
```

### 50.4 Drizzle Schema (2 nouvelles tables)

```typescript
// -- WINNING PATTERNS --
export const winningPatterns = pgTable('winning_patterns', {
  id:             uuid('id').primaryKey().defaultRandom(),
  patternType:    text('pattern_type').notNull(),
  pageType:       text('page_type').notNull(),
  vertical:       text('vertical'),
  description:    text('description').notNull(),
  blockSignature:  jsonb('block_signature'),
  liftPercent:    real('lift_percent'),
  confidence:     real('confidence'),
  sampleSize:     integer('sample_size'),
  experimentIds:  jsonb('experiment_ids').$type<string[]>(),
  embedding:      text('embedding'),
  status:         text('status').$type<'candidate'|'validated'|'sop'|'deprecated'>().default('candidate'),
  codifiedAt:     timestamp('codified_at'),
  createdAt:      timestamp('created_at').defaultNow().notNull(),
}, t => [
  index('pattern_type_page_idx').on(t.patternType, t.pageType),
  index('pattern_status_idx').on(t.status),
])

// -- RAG DOCUMENTS --
export const ragDocuments = pgTable('rag_documents', {
  id:             uuid('id').primaryKey().defaultRandom(),
  sourceType:     text('source_type').$type<'winning_pattern'|'experiment_result'|'brand_guideline'|'competitor_analysis'>().notNull(),
  content:        text('content').notNull(),
  metadata:       jsonb('metadata'),
  embedding:      text('embedding'),
  createdAt:      timestamp('created_at').defaultNow().notNull(),
})
```

---

## 51. Block Composer System Prompt (Template Agent)

> Le prompt que recoit l'agent pour composer des pages. **100% IA - aucun humain.**
> Ce prompt + les tokens (section 45) + les composition rules (section 46) + le CSS (section 47)
> = le "cerveau design" autonome de l'agent.

### 51.1 System Prompt Template

```typescript
export const BLOCK_COMPOSER_SYSTEM_PROMPT = `
You are a DTC e-commerce page designer. You compose pages as JSON block trees.
You are AUTONOMOUS - no human will review or modify your output.

## YOUR CONSTRAINTS (non-negotiable)

1. MOBILE FIRST: 90% of traffic is mobile. Design for 390px width (iPhone 14).
2. You can ONLY use design tokens from the approved set.
3. You can ONLY use blocks from the block registry.
4. The page type "{pageType}" has these rules:
   - Required blocks: {required_blocks}
   - Forbidden blocks: {forbidden_blocks}
   - Max blocks: {max_blocks}
   - Headline max chars: {headline_max_chars}
   - Required sequence: {required_sequence}

## DESIGN TOKENS (your ONLY allowed values)

{tokens_reference}

## BLOCK REGISTRY (your ONLY allowed blocks)

{available_blocks}

## PAGE TYPE GUIDE: {pageType}

{page_type_guide}

## MOBILE DESIGN RULES

- CTAs: min 52px height, full width mobile, bold 18px text
- Text: body 16px min (14px captions only), line-height 1.5+
- Spacing: tokens ONLY. Sections 40px+ gap mobile
- Images: product hero = 4:5, thumbnails = 1:1
- Colors: ONE palette only, never mix
- Typography: 2 fonts max. Heading font for headlines only.
- Padding: 16px horizontal mobile
- Above fold: hero headline + CTA visible WITHOUT scrolling

## PROVEN WINNING PATTERNS

{rag_patterns}

## OUTPUT FORMAT

Return JSON block tree:
{
  "version": "1.0",
  "pageType": "{pageType}",
  "palette": "health-warm",
  "blocks": [{ "id": "nano-id", "type": "...", "props": {...}, "styles": {...} }],
  "metadata": { "title": "...", "description": "...", "trackingId": "..." }
}

## MARKETING ANGLE INJECTION

- headline -> hero headline
- subheadline -> hero subheadline
- ctaText -> ALL CTAs (consistency)
- benefits -> benefits-list
- guarantee -> guarantee block
- painPoint -> first section after hero

DO NOT rename or rephrase the angle's core message.
`
```

### 51.2 Page Type Guides (injectes dynamiquement)

```typescript
function getPageTypeGuide(type: StepType): string {
  const guides: Record<StepType, string> = {
    'product-page': `
Structure: Hero -> Social Proof (reviews HIGH!) -> Product Images -> Benefits -> Trust -> Bundles -> Countdown -> Comparison -> FAQ -> Guarantee -> Final CTA
Key: Reviews ABOVE fold. Bundle "Most Popular" pre-selected. Sticky CTA mobile.`,
    'advertorial': `
Structure: Editorial Hero -> Problem Story -> Solution Reveal -> Social Proof -> Benefits -> Authority -> CTA woven throughout
Key: NEWS ARTICLE look. Long-form. Subtle CTAs every 3-4 sections. Serif heading.`,
    'vsl': `
Structure: Hero with video -> Problem -> Solution -> Proof -> CTA -> FAQ -> Guarantee -> Final CTA
Key: Video is the star. Sticky player mobile (PiP). CTAs at key moments.`,
    'checkout': `
Structure: Order Summary -> Payment -> Trust Badges -> Guarantee
Key: MINIMAL. No nav. No footer. Express checkout TOP. Security badges next to submit.`,
    'upsell': `
Structure: Headline -> One-Click Offer -> Countdown -> Accept/Decline
Key: ONE offer, ONE decision, ONE click. Negative opt-out decline button.`,
    'downsell': `
Structure: "Wait!" headline -> Reduced Offer -> One-Click Accept
Key: Even simpler than upsell. Price ONLY difference. 50%+ discount.`,
    'optin': `
Structure: Hero -> Value Prop -> Form (email only) -> Trust
Key: Email + first name max. Button = benefit ("Get My Free Guide").`,
    'quiz': `
Structure: Question -> Options (2-4 visual cards) -> Progress bar -> Next
Key: One question per screen. Progress bar reduces abandonment.`,
    'thank-you': `
Structure: Confirmation -> Next Steps -> Upsell/Cross-sell -> Social Share
Key: Positive reinforcement. Order summary. Related products.`,
    'bridge': `
Structure: Headline -> Brief context -> Button to next step
Key: Single purpose: move to NEXT page. One CTA only.`,
  }
  return guides[type]
}
```

---

## 52. Mise a jour Table Count - Final V4

**Tables totales: 50**

| Categorie | Tables | Detail |
|-----------|--------|--------|
| Core (funnel, blocks, variants) | 22 | section 2 original |
| Ads | 9 | section 14 original |
| Partnership & Placements | 2 | section 34 |
| Universal Testing | 5 | section 36 |
| Offers | 1 | section 38 |
| Offer Templates | 1 | section 39 |
| Subscription Experience | 3 | section 40 |
| Multi-country | 1 | section 41 |
| Upsell | 1 | section 43 |
| **A/B Testing** | 3 | section 49 (experiments, variants, conversions) |
| **RAG Pattern Engine** | 2 | section 50 (winning_patterns, rag_documents) |
| **TOTAL** | **50** | |
