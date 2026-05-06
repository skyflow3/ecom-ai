/**
 * Purpose: Universal testing framework — any dimension can be tested (§36)
 * Dependencies: enums.ts
 * Related: Architecture Finale.md §36 (Universal Testing Framework)
 *
 * WHY: Not just pages — ads, emails, offers, pricing, funnels can all be tested.
 *      The AI judge decides winners, discovers patterns, and creates knowledge.
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
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// ─── Test Dimensions ───────────────────────────────────────────────────────────

export const testDimensions = pgTable("test_dimensions", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  description: text("description"),
  possibleValues: jsonb("possible_values").$type<string[]>().default([]),
  primaryMetric: text("primary_metric").notNull(),
  secondaryMetrics: jsonb("secondary_metrics").$type<string[]>().default([]),
  minSampleSize: integer("min_sample_size").default(100),
  estimatedDuration: text("estimated_duration"),
  priority: integer("priority").default(50),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Universal Tests ───────────────────────────────────────────────────────────

export const universalTests = pgTable("universal_tests", {
  id: uuid("id").defaultRandom().primaryKey(),
  dimensionId: uuid("dimension_id").notNull(),
  funnelId: uuid("funnel_id"),
  name: text("name").notNull(),
  hypothesis: text("hypothesis"),
  proposedBy: text("proposed_by").default("ai_judge"),
  variants: jsonb("variants").$type<Array<{ id: string; label: string; config: Record<string, unknown> }>>().notNull(),
  status: text("status").default("proposed"),
  trafficSplit: text("traffic_split").default("equal"),
  startedAt: timestamp("started_at"),
  endedAt: timestamp("ended_at"),
  winnerVariantId: text("winner_variant_id"),
  confidence: numeric("confidence", { precision: 4, scale: 3 }),
  isSignificant: boolean("is_significant").default(false),
  judgeDecision: jsonb("judge_decision").$type<Record<string, unknown>>(),
  targetScope: text("target_scope"),
  targetId: uuid("target_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("ut_dimension_idx").on(table.dimensionId),
  index("ut_status_idx").on(table.status),
  index("ut_funnel_idx").on(table.funnelId),
]);

// ─── Universal Test Results ────────────────────────────────────────────────────

export const universalTestResults = pgTable("universal_test_results", {
  id: uuid("id").defaultRandom().primaryKey(),
  testId: uuid("test_id").notNull(),
  variantId: text("variant_id").notNull(),
  impressions: integer("impressions").default(0),
  clicks: integer("clicks").default(0),
  conversions: integer("conversions").default(0),
  revenue: numeric("revenue", { precision: 12, scale: 2 }).default("0"),
  spend: numeric("spend", { precision: 12, scale: 2 }).default("0"),
  ctr: numeric("ctr", { precision: 6, scale: 4 }),
  cvr: numeric("cvr", { precision: 6, scale: 4 }),
  cpa: numeric("cpa", { precision: 12, scale: 2 }),
  roas: numeric("roas", { precision: 8, scale: 4 }),
  aov: numeric("aov", { precision: 12, scale: 2 }),
  primaryMetricValue: numeric("primary_metric_value", { precision: 12, scale: 4 }),
  confidenceLower: numeric("confidence_lower", { precision: 6, scale: 4 }),
  confidenceUpper: numeric("confidence_upper", { precision: 6, scale: 4 }),
  sampleSize: integer("sample_size").default(0),
  periodStart: timestamp("period_start"),
  periodEnd: timestamp("period_end"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("utr_test_variant").on(table.testId, table.variantId),
  index("utr_test_idx").on(table.testId),
]);

// ─── Test Knowledge (discovered patterns) ──────────────────────────────────────

export const testKnowledge = pgTable("test_knowledge", {
  id: uuid("id").defaultRandom().primaryKey(),
  dimensionSlug: text("dimension_slug").notNull(),
  pattern: text("pattern").notNull(),
  confidence: numeric("confidence", { precision: 4, scale: 3 }),
  sampleTests: integer("sample_tests").default(1),
  applicability: text("applicability").default("universal"),
  nicheCategory: text("niche_category"),
  source: text("source").default("auto_discovered"),
  isActive: boolean("is_active").default(true),
  discoveredAt: timestamp("discovered_at").defaultNow().notNull(),
  lastConfirmedAt: timestamp("last_confirmed_at"),
}, (table) => [
  index("tk_dimension_idx").on(table.dimensionSlug),
  index("tk_active_idx").on(table.isActive),
]);

// ─── Judge Decision Log ────────────────────────────────────────────────────────

export const judgeDecisionLog = pgTable("judge_decision_log", {
  id: uuid("id").defaultRandom().primaryKey(),
  testId: uuid("test_id"),
  dimensionSlug: text("dimension_slug").notNull(),
  funnelId: uuid("funnel_id"),
  decision: text("decision").notNull(),
  winnerId: text("winner_id"),
  reasoning: text("reasoning").notNull(),
  confidence: numeric("confidence", { precision: 4, scale: 3 }),
  nextSteps: jsonb("next_steps").$type<Record<string, unknown>>(),
  metricsSnapshot: jsonb("metrics_snapshot").$type<Record<string, unknown>>(),
  decidedAt: timestamp("decided_at").defaultNow().notNull(),
}, (table) => [
  index("jdl_test_idx").on(table.testId),
  index("jdl_dimension_idx").on(table.dimensionSlug),
  index("jdl_date_idx").on(table.decidedAt),
]);
