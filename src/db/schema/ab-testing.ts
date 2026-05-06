/**
 * Purpose: A/B testing tables — hypotheses, experiments, metrics, state machine
 * Dependencies: enums.ts
 * Related: Architecture Finale.md §2, §49 (A/B State Machine)
 *
 * WHY: Two experiment systems coexist:
 *   1. ab_tests + test_variant_metrics = core funnel page testing (§2)
 *   2. experiments + experiment_variants + conversions = design system testing (§49)
 * Both use the 5-stage state machine (sandbox→elimination→commando→duel→champion).
 */

import {
  pgTable,
  uuid,
  text,
  integer,
  numeric,
  jsonb,
  timestamp,
  boolean,
  real,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import {
  abTestStatusEnum,
  testPhaseEnum,
} from "./enums";

// ─── Hypotheses ────────────────────────────────────────────────────────────────

export const hypotheses = pgTable("hypotheses", {
  id: uuid("id").defaultRandom().primaryKey(),
  funnelId: uuid("funnel_id").notNull(),
  stepId: uuid("step_id"),
  title: text("title").notNull(),
  description: text("description"),
  targetVariable: text("target_variable").notNull(),
  variableCategory: text("variable_category").notNull(),
  aboveFold: boolean("above_fold").default(true),
  impact: integer("impact").notNull(),
  confidence: integer("confidence").notNull(),
  ease: integer("ease").default(8),
  status: text("status").default("draft"),
  testId: uuid("test_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("hypotheses_funnel_idx").on(table.funnelId),
  index("hypotheses_status_idx").on(table.status),
]);

// ─── A/B Tests (core funnel testing) ──────────────────────────────────────────

export const abTests = pgTable("ab_tests", {
  id: uuid("id").defaultRandom().primaryKey(),
  stepId: uuid("step_id").notNull(),
  hypothesisId: uuid("hypothesis_id"),
  phase: testPhaseEnum("phase").default("sandbox"),
  status: abTestStatusEnum("status").default("draft"),
  primaryMetric: text("primary_metric").default("aov_cvr"),
  thresholds: jsonb("thresholds").notNull(),
  minSampleSize: integer("min_sample_size").default(500),
  confidenceThreshold: numeric("confidence_threshold", { precision: 4, scale: 3 }).default("0.950"),
  autoPromote: boolean("auto_promote").default(true),
  winnerVariantId: uuid("winner_variant_id"),
  startedAt: timestamp("started_at"),
  endedAt: timestamp("ended_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Test Variant Metrics (per-variant stats per test) ─────────────────────────

export const testVariantMetrics = pgTable("test_variant_metrics", {
  id: uuid("id").defaultRandom().primaryKey(),
  variantId: uuid("variant_id").notNull(),
  testId: uuid("test_id").notNull(),
  visitors: integer("visitors").default(0),
  clicks: integer("clicks").default(0),
  addToCarts: integer("add_to_carts").default(0),
  checkoutStarts: integer("checkout_starts").default(0),
  purchases: integer("purchases").default(0),
  revenue: numeric("revenue", { precision: 12, scale: 2 }).default("0"),
  cvr: numeric("cvr", { precision: 6, scale: 4 }).default("0"),
  aov: numeric("aov", { precision: 12, scale: 2 }).default("0"),
  aovTimesCvr: numeric("aov_times_cvr", { precision: 10, scale: 4 }).default("0"),
  cartToPurchaseRatio: numeric("cart_to_purchase_ratio", { precision: 6, scale: 2 }).default("0"),
  cvrLower: numeric("cvr_lower", { precision: 6, scale: 4 }),
  cvrUpper: numeric("cvr_upper", { precision: 6, scale: 4 }),
  isSandbox: boolean("is_sandbox").default(false),
  sandboxVisits: integer("sandbox_visits").default(0),
  sandboxPassed: boolean("sandbox_passed").default(false),
  eliminatedAt: timestamp("eliminated_at"),
  eliminatedReason: text("eliminated_reason"),
  promotedAt: timestamp("promoted_at"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("tvm_variant_test").on(table.variantId, table.testId),
  index("tvm_test_idx").on(table.testId),
]);

// ─── Test Queue (variant scheduling) ───────────────────────────────────────────

export const testQueue = pgTable("test_queue", {
  id: uuid("id").defaultRandom().primaryKey(),
  testId: uuid("test_id").notNull(),
  variantId: uuid("variant_id").notNull(),
  priority: integer("priority").default(0),
  status: text("status").default("queued"),
  enqueuedAt: timestamp("enqueued_at").defaultNow().notNull(),
  activatedAt: timestamp("activated_at"),
}, (table) => [
  index("queue_test_status").on(table.testId, table.status),
]);

// ─── Experiments (design system testing, §49) ──────────────────────────────────

export const experiments = pgTable("experiments", {
  id: uuid("id").defaultRandom().primaryKey(),
  /** Points to funnelSteps.id (the page being tested) */
  funnelPageId: uuid("funnel_page_id").notNull(),
  name: text("name").notNull(),
  stage: text("stage").default("sandbox"),
  hypothesis: text("hypothesis"),
  primaryMetric: text("primary_metric").default("conversion_rate"),
  trafficAllocation: real("traffic_allocation").default(1.0),
  minSampleSize: integer("min_sample_size").default(1000),
  confidenceLevel: real("confidence_level").default(0.95),
  startedAt: timestamp("started_at"),
  endedAt: timestamp("ended_at"),
  result: jsonb("result").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("exp_page_idx").on(table.funnelPageId),
]);

// ─── Experiment Variants (§49 design system variants) ──────────────────────────
// WHY: Distinct from pageVariants — these store blockTree + designTokens for the
//      design system A/B pipeline, not the core funnel variant system.

export const experimentVariants = pgTable("experiment_variants", {
  id: uuid("id").defaultRandom().primaryKey(),
  experimentId: uuid("experiment_id").notNull(),
  name: text("name").notNull(),
  blockTree: jsonb("block_tree").notNull(),
  designTokens: jsonb("design_tokens").$type<Record<string, unknown>>(),
  renderedHtml: text("rendered_html"),
  trafficWeight: real("traffic_weight").default(0.5),
  isControl: boolean("is_control").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("variant_exp_idx").on(table.experimentId),
]);

// ─── Conversions (experiment tracking) ─────────────────────────────────────────

export const conversions = pgTable("conversions", {
  id: uuid("id").defaultRandom().primaryKey(),
  variantId: uuid("variant_id").notNull(),
  experimentId: uuid("experiment_id").notNull(),
  visitorId: text("visitor_id").notNull(),
  eventType: text("event_type").notNull(),
  revenue: numeric("revenue", { precision: 12, scale: 2 }),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("conv_variant_idx").on(table.variantId),
  index("conv_exp_type_idx").on(table.experimentId, table.eventType),
  index("conv_time_idx").on(table.createdAt),
]);

// ─── Growth Cycles (autonomous improvement loops) ──────────────────────────────

export const growthCycles = pgTable("growth_cycles", {
  id: uuid("id").defaultRandom().primaryKey(),
  funnelId: uuid("funnel_id").notNull(),
  stepId: uuid("step_id"),
  cycleNumber: integer("cycle_number").notNull(),
  status: text("status").default("proposing"),
  hypothesisId: uuid("hypothesis_id"),
  previousScore: numeric("previous_score", { precision: 10, scale: 2 }),
  currentScore: numeric("current_score", { precision: 10, scale: 2 }),
  improvement: numeric("improvement", { precision: 6, scale: 2 }),
  agentDecision: jsonb("agent_decision").$type<Record<string, unknown>>(),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
}, (table) => [
  index("cycles_funnel_idx").on(table.funnelId, table.cycleNumber),
]);

// ─── Test Learnings (cross-funnel knowledge transfer) ──────────────────────────

export const testLearnings = pgTable("test_learnings", {
  id: uuid("id").defaultRandom().primaryKey(),
  hypothesisId: uuid("hypothesis_id").notNull(),
  funnelId: uuid("funnel_id").notNull(),
  variableFingerprint: text("variable_fingerprint").notNull(),
  winnerVariantId: uuid("winner_variant_id"),
  metricBefore: numeric("metric_before", { precision: 10, scale: 4 }),
  metricAfter: numeric("metric_after", { precision: 10, scale: 4 }),
  improvement: numeric("improvement", { precision: 6, scale: 2 }),
  sampleSize: integer("sample_size"),
  confidence: numeric("confidence", { precision: 4, scale: 3 }),
  transferable: boolean("transferable").default(false),
  transferredFrom: uuid("transferred_from"),
  confidenceBoost: numeric("confidence_boost", { precision: 4, scale: 3 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("learnings_fingerprint_idx").on(table.variableFingerprint),
  index("learnings_funnel_idx").on(table.funnelId),
]);
