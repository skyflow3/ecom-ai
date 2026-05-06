/**
 * Purpose: Research & discovery tables — niche analysis, AI consensus, knowledge base
 * Dependencies: enums.ts
 * Related: Architecture Finale.md §5-§13 (Research Engine, Knowledge Base)
 *
 * WHY: The research engine discovers profitable niches before spending ad budget.
 *      Knowledge sources + evolution debates let the system self-improve.
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
} from "drizzle-orm/pg-core";

// ─── Discovered Niches ─────────────────────────────────────────────────────────

export const discoveredNiches = pgTable("discovered_niches", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").unique().notNull(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  volumeScore: numeric("volume_score", { precision: 4, scale: 2 }),
  intensityScore: numeric("intensity_score", { precision: 4, scale: 2 }),
  gapScore: numeric("gap_score", { precision: 4, scale: 2 }),
  trendScore: numeric("trend_score", { precision: 4, scale: 2 }),
  accessibilityScore: numeric("accessibility_score", { precision: 4, scale: 2 }),
  totalScore: numeric("total_score", { precision: 4, scale: 2 }),
  demandVolume: integer("demand_volume"),
  estimatedCpc: numeric("estimated_cpc", { precision: 5, scale: 2 }),
  status: text("status").default("researching"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Research Sources ──────────────────────────────────────────────────────────

export const researchSources = pgTable("research_sources", {
  id: uuid("id").defaultRandom().primaryKey(),
  nicheId: uuid("niche_id").notNull(),
  type: text("type"),
  url: text("url"),
  content: text("content"),
  sentiment: numeric("sentiment", { precision: 4, scale: 2 }),
  extractedKeywords: jsonb("extracted_keywords").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("research_source_niche_idx").on(table.nicheId),
]);

// ─── Marketing Angles Research ─────────────────────────────────────────────────

export const marketingAnglesResearch = pgTable("marketing_angles_research", {
  id: uuid("id").defaultRandom().primaryKey(),
  nicheId: uuid("niche_id").notNull(),
  painPoint: text("pain_point").notNull(),
  desire: text("desire").notNull(),
  avatar: text("avatar").notNull(),
  emotion: text("emotion").notNull(),
  promise: text("promise").notNull(),
  hooks: jsonb("hooks").$type<string[]>(),
  confidenceScore: numeric("confidence_score", { precision: 4, scale: 2 }),
  status: text("status").default("generated"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("angles_research_niche_idx").on(table.nicheId),
]);

// ─── AI Consensus Votes ────────────────────────────────────────────────────────

export const aiConsensusVotes = pgTable("ai_consensus_votes", {
  id: uuid("id").defaultRandom().primaryKey(),
  nicheId: uuid("niche_id").notNull(),
  modelName: text("model_name").notNull(),
  totalScore: numeric("total_score", { precision: 4, scale: 2 }),
  rawResponse: jsonb("raw_response").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("consensus_niche_idx").on(table.nicheId),
]);

// ─── Knowledge Sources ─────────────────────────────────────────────────────────

export const knowledgeSources = pgTable("knowledge_sources", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  type: text("type").notNull(),
  isActive: boolean("is_active").default(true),
  lastCheckedAt: timestamp("last_checked_at"),
});

// ─── Raw Insights ──────────────────────────────────────────────────────────────

export const rawInsights = pgTable("raw_insights", {
  id: uuid("id").defaultRandom().primaryKey(),
  sourceId: uuid("source_id"),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  contentHash: text("content_hash").notNull(),
  relevanceScore: numeric("relevance_score", { precision: 4, scale: 2 }),
  status: text("status").default("new"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("insights_source_idx").on(table.sourceId),
]);

// ─── Evolution Debates (AI self-improvement) ───────────────────────────────────

export const evolutionDebates = pgTable("evolution_debates", {
  id: uuid("id").defaultRandom().primaryKey(),
  insightId: uuid("insight_id"),
  topic: text("topic").notNull(),
  argumentsFor: jsonb("arguments_for").$type<string[]>(),
  argumentsAgainst: jsonb("arguments_against").$type<string[]>(),
  decision: text("decision").default("research"),
  confidence: numeric("confidence", { precision: 4, scale: 2 }),
  concludedAt: timestamp("concluded_at"),
}, (table) => [
  index("debates_insight_idx").on(table.insightId),
]);

// ─── Change Proposals ──────────────────────────────────────────────────────────

export const changeProposals = pgTable("change_proposals", {
  id: uuid("id").defaultRandom().primaryKey(),
  debateId: uuid("debate_id"),
  type: text("type").notNull(),
  diffContent: text("diff_content"),
  status: text("status").default("pending_review"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("proposals_debate_idx").on(table.debateId),
]);

// ─── Surveys ───────────────────────────────────────────────────────────────────

export const surveys = pgTable("surveys", {
  id: uuid("id").defaultRandom().primaryKey(),
  shopId: uuid("shop_id").notNull(),
  name: text("name").notNull(),
  trigger: text("trigger").notNull(),
  questions: jsonb("questions").notNull(),
  reward: jsonb("reward").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at").defaultNow(),
});

// ─── Survey Responses ──────────────────────────────────────────────────────────

export const surveyResponses = pgTable("survey_responses", {
  id: uuid("id").defaultRandom().primaryKey(),
  surveyId: uuid("survey_id").notNull(),
  customerHash: text("customer_hash").notNull(),
  answers: jsonb("answers").notNull(),
  sentimentScore: numeric("sentiment_score", { precision: 4, scale: 2 }),
  keywords: jsonb("keywords").$type<string[]>(),
  completedAt: timestamp("completed_at").defaultNow(),
}, (table) => [
  index("responses_survey_idx").on(table.surveyId),
]);

// ─── Survey Insights ───────────────────────────────────────────────────────────

export const surveyInsights = pgTable("survey_insights", {
  id: uuid("id").defaultRandom().primaryKey(),
  shopId: uuid("shop_id").notNull(),
  category: text("category").notNull(),
  keyword: text("keyword").notNull(),
  frequency: integer("frequency").default(1),
  sentimentAvg: numeric("sentiment_avg", { precision: 4, scale: 2 }),
  lastUpdated: timestamp("last_updated").defaultNow(),
}, (table) => [
  index("insights_shop_category_idx").on(table.shopId, table.category),
]);
