/**
 * Purpose: Barrel export for all Drizzle schema tables
 * Dependencies: All schema files
 * Related: drizzle.config.ts (points here), src/lib/db.ts
 *
 * WHY: Single entry point for `drizzle(db, { schema })` and `drizzle-kit`.
 *      Import * as schema from here to get all tables + relations.
 *
 * SCHEMA MAP:
 *   enums.ts     — 10 PostgreSQL enums
 *   core.ts      — 10 tables (funnels, products, steps, variants, blocks, templates, bundles, purchases, pixels)
 *   analytics.ts — 11 tables (events, metrics, attribution, costs)
 *   ab-testing.ts — 10 tables (hypotheses, tests, experiments, growth cycles)
 *   ads.ts       — 15 tables (campaigns, creatives, metrics, budgets, creators)
 *   research.ts  — 11 tables (niches, knowledge, surveys)
 *   offers.ts    — 8 tables (offers, subscriptions, upsell, country configs)
 *   testing.ts   — 5 tables (universal testing framework)
 *   rag.ts       — 2 tables (winning patterns, RAG documents)
 *   auth.ts      — 1 table  (users — Clerk sync mirror)
 *
 * TOTAL: ~73 table definitions (51 unique tables, some renamed to resolve duplicates)
 */

// ─── Enums ─────────────────────────────────────────────────────────────────────
export {
  stepTypeEnum,
  funnelStatusEnum,
  abTestStatusEnum,
  eventTypeEnum,
  testPhaseEnum,
  campaignTypeEnum,
  campaignPhaseEnum,
  adFateEnum,
  adsFunnelStageEnum,
  alertSeverityEnum,
} from "./enums";

// ─── Core ──────────────────────────────────────────────────────────────────────
export {
  products,
  funnels,
  marketingAngles,
  funnelSteps,
  pageVariants,
  blockDefinitions,
  templates,
  bundles,
  purchases,
  pixelConfigs,
} from "./core";

// ─── Analytics ─────────────────────────────────────────────────────────────────
export {
  events,
  rawEvents,
  metrics5min,
  metricsHourly,
  metricsDaily,
  blockEvents,
  elementRevenue,
  touchpoints,
  attributions,
  agentCosts,
  fbAccountsWarmup,
} from "./analytics";

// ─── A/B Testing ───────────────────────────────────────────────────────────────
export {
  hypotheses,
  abTests,
  testVariantMetrics,
  testQueue,
  experiments,
  experimentVariants,
  conversions,
  growthCycles,
  testLearnings,
} from "./ab-testing";

// ─── Ads ───────────────────────────────────────────────────────────────────────
export {
  metaAdAccounts,
  nicheResearch,
  angleResearch,
  adCampaigns,
  adSets,
  ads,
  adMetricsDaily,
  creativeTemplates,
  budgetAllocations,
  adAlerts,
  creatorProfiles,
  placementTests,
  creativeFatigueScores,
  adsExtensions,
} from "./ads";

// ─── Research ──────────────────────────────────────────────────────────────────
export {
  discoveredNiches,
  researchSources,
  marketingAnglesResearch,
  aiConsensusVotes,
  knowledgeSources,
  rawInsights,
  evolutionDebates,
  changeProposals,
  surveys,
  surveyResponses,
  surveyInsights,
} from "./research";

// ─── Offers ────────────────────────────────────────────────────────────────────
export {
  offers,
  offerTemplates,
  upsellOffers,
  subscriptionMilestones,
  retentionTriggers,
  promoAutoRules,
  countryConfigs,
} from "./offers";

// ─── Testing ───────────────────────────────────────────────────────────────────
export {
  testDimensions,
  universalTests,
  universalTestResults,
  testKnowledge,
  judgeDecisionLog,
} from "./testing";

// ─── RAG ───────────────────────────────────────────────────────────────────────
export {
  winningPatterns,
  ragDocuments,
} from "./rag";

// ─── Auth ───────────────────────────────────────────────────────────────────────
export {
  users,
} from "./auth";
