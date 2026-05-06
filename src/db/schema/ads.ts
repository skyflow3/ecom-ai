/**
 * Purpose: Facebook/Meta Ads engine tables — campaigns, creatives, metrics, budgets
 * Dependencies: enums.ts
 * Related: Architecture Finale.md §14 (Facebook Ads Engine)
 *
 * WHY: The ads engine is the traffic acquisition system. It manages the full funnel:
 *      Niche Research → Angle Research → Campaigns → Ad Sets → Ads → Metrics
 *      Budget allocation and creative fatigue detection run on top.
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
import {
  campaignTypeEnum,
  campaignPhaseEnum,
  adFateEnum,
  adsFunnelStageEnum,
  alertSeverityEnum,
} from "./enums";

// ─── Meta Ad Accounts ──────────────────────────────────────────────────────────

export const metaAdAccounts = pgTable("meta_ad_accounts", {
  id: uuid("id").defaultRandom().primaryKey(),
  funnelId: uuid("funnel_id"),
  metaAdAccountId: text("meta_ad_account_id").notNull(),
  accessToken: text("access_token").notNull(),
  pixelId: text("pixel_id").notNull(),
  businessId: text("business_id"),
  appSecret: text("app_secret"),
  trackingDomain: text("tracking_domain"),
  currency: text("currency").default("USD"),
  isFresh: boolean("is_fresh").default(true),
  isActive: boolean("is_active").default(true),
  signalQualityScore: numeric("signal_quality_score", { precision: 4, scale: 2 }).default("0"),
  eventMatchQuality: numeric("event_match_quality", { precision: 4, scale: 2 }).default("0"),
  lastSignalCheckAt: timestamp("last_signal_check_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("ad_account_meta_idx").on(table.metaAdAccountId),
]);

// ─── Niche Research (ads-focused) ──────────────────────────────────────────────

export const nicheResearch = pgTable("niche_research", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  trendsData: jsonb("trends_data").$type<Record<string, unknown>>(),
  painPoints: jsonb("pain_points").$type<string[]>().default([]),
  desireStatements: jsonb("desire_statements").$type<string[]>().default([]),
  competitorAds: jsonb("competitor_ads").$type<Record<string, unknown>>(),
  difficulty: integer("difficulty").default(5),
  opportunityScore: numeric("opportunity_score", { precision: 6, scale: 2 }).default("0"),
  status: text("status").default("research"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Angle Research ────────────────────────────────────────────────────────────

export const angleResearch = pgTable("angle_research", {
  id: uuid("id").defaultRandom().primaryKey(),
  nicheId: uuid("niche_id").notNull(),
  name: text("name").notNull(),
  painPoint: text("pain_point").notNull(),
  desire: text("desire").notNull(),
  promise: text("promise").notNull(),
  avatar: jsonb("avatar").notNull(),
  emotion: text("emotion").notNull(),
  awarenessLevel: text("awareness_level").notNull(),
  funnelStage: adsFunnelStageEnum("funnel_stage").default("tofu"),
  landingPageSlug: text("landing_page_slug"),
  cpc: numeric("cpc", { precision: 10, scale: 4 }),
  ctr: numeric("ctr", { precision: 6, scale: 4 }),
  status: text("status").default("research"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("angle_niche_idx").on(table.nicheId),
]);

// ─── Ad Campaigns ──────────────────────────────────────────────────────────────

export const adCampaigns = pgTable("ad_campaigns", {
  id: uuid("id").defaultRandom().primaryKey(),
  type: campaignTypeEnum("type").notNull(),
  phase: campaignPhaseEnum("phase").default("phase1_validation"),
  name: text("name").notNull(),
  adAccountId: uuid("ad_account_id").notNull(),
  funnelId: uuid("funnel_id"),
  angleId: uuid("angle_id").notNull(),
  budgetDaily: integer("budget_daily").notNull(),
  targetCpa: integer("target_cpa"),
  currency: text("currency").default("USD"),
  testCountry: text("test_country"),
  status: text("status").default("draft"),
  minimumRunDays: integer("minimum_run_days").default(3),
  metaCampaignId: text("meta_campaign_id"),
  startedAt: timestamp("started_at"),
  endedAt: timestamp("ended_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("campaigns_account_idx").on(table.adAccountId),
  index("campaigns_angle_idx").on(table.angleId),
  index("campaigns_type_status").on(table.type, table.status),
]);

// ─── Ad Sets ───────────────────────────────────────────────────────────────────

export const adSets = pgTable("ad_sets", {
  id: uuid("id").defaultRandom().primaryKey(),
  campaignId: uuid("campaign_id").notNull(),
  name: text("name").notNull(),
  targeting: jsonb("targeting").notNull(),
  landingPageSlug: text("landing_page_slug").notNull(),
  landingPageUrl: text("landing_page_url").notNull(),
  budgetDaily: integer("budget_daily"),
  costCap: integer("cost_cap"),
  status: text("status").default("active"),
  metaAdSetId: text("meta_ad_set_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("adsets_campaign_idx").on(table.campaignId),
]);

// ─── Ads ───────────────────────────────────────────────────────────────────────

export const ads = pgTable("ads", {
  id: uuid("id").defaultRandom().primaryKey(),
  adSetId: uuid("ad_set_id").notNull(),
  name: text("name").notNull(),
  format: text("format").notNull(),
  creativeType: text("creative_type").notNull(),
  funnelStage: adsFunnelStageEnum("funnel_stage").default("tofu"),
  headline: text("headline").notNull(),
  primaryText: text("primary_text").notNull(),
  description: text("description"),
  ctaText: text("cta_text").notNull(),
  callToAction: text("call_to_action").default("LEARN_MORE"),
  imageUrl: text("image_url"),
  videoUrl: text("video_url"),
  thumbnailUrl: text("thumbnail_url"),
  urlTags: text("url_tags"),
  entityId: text("entity_id"),
  entitySlot: text("entity_slot"),
  creatorProfileId: uuid("creator_profile_id"),
  isWhitelisted: boolean("is_whitelisted").default(false),
  postingAsPage: text("posting_as_page"),
  status: text("status").default("draft"),
  fate: adFateEnum("fate").default("pending"),
  fateReason: text("fate_reason"),
  metaAdId: text("meta_ad_id"),
  metaCreativeId: text("meta_creative_id"),
  reviewedAt: timestamp("reviewed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("ads_adset_idx").on(table.adSetId),
  index("ads_fate_idx").on(table.fate, table.status),
  index("ads_entity_idx").on(table.entityId),
]);

// ─── Ad Metrics Daily ──────────────────────────────────────────────────────────

export const adMetricsDaily = pgTable("ad_metrics_daily", {
  id: uuid("id").defaultRandom().primaryKey(),
  adId: uuid("ad_id").notNull(),
  campaignId: uuid("campaign_id").notNull(),
  date: timestamp("date").notNull(),
  spend: integer("spend").default(0),
  impressions: integer("impressions").default(0),
  clicks: integer("clicks").default(0),
  cpc: numeric("cpc", { precision: 10, scale: 4 }).default("0"),
  cpm: numeric("cpm", { precision: 10, scale: 4 }).default("0"),
  ctr: numeric("ctr", { precision: 6, scale: 4 }).default("0"),
  landingPageViews: integer("landing_page_views").default(0),
  addToCarts: integer("add_to_carts").default(0),
  initiateCheckouts: integer("initiate_checkouts").default(0),
  purchases: integer("purchases").default(0),
  purchaseValue: integer("purchase_value").default(0),
  cvr: numeric("cvr", { precision: 6, scale: 4 }).default("0"),
  aov: numeric("aov", { precision: 12, scale: 2 }).default("0"),
  aovTimesCvr: numeric("aov_times_cvr", { precision: 10, scale: 4 }).default("0"),
  cpa: numeric("cpa", { precision: 12, scale: 2 }).default("0"),
  roas: numeric("roas", { precision: 8, scale: 4 }).default("0"),
  atcToPurchaseRatio: numeric("atc_to_purchase_ratio", { precision: 6, scale: 2 }).default("0"),
  videoViews25: integer("video_views_25").default(0),
  videoViews50: integer("video_views_50").default(0),
  videoViews75: integer("video_views_75").default(0),
  videoViews100: integer("video_views_100").default(0),
  cpmr: numeric("cpmr", { precision: 10, scale: 4 }).default("0"),
  incrementalReachPct: numeric("incremental_reach_pct", { precision: 6, scale: 4 }).default("0"),
  incrementalConversions: integer("incremental_conversions").default(0),
  incrementalRoas: numeric("incremental_roas", { precision: 8, scale: 4 }).default("0"),
}, (table) => [
  uniqueIndex("metrics_ad_date").on(table.adId, table.date),
  index("metrics_campaign_date").on(table.campaignId, table.date),
  index("metrics_date").on(table.date),
]);

// ─── Creative Templates ────────────────────────────────────────────────────────

export const creativeTemplates = pgTable("creative_templates", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  format: text("format").notNull(),
  funnelStage: adsFunnelStageEnum("funnel_stage").notNull(),
  hookStructures: jsonb("hook_structures").$type<string[]>().default([]),
  bodyStructures: jsonb("body_structures").$type<string[]>().default([]),
  ctaVariants: jsonb("cta_variants").$type<string[]>().default([]),
  visualGuidance: text("visual_guidance"),
  emotionGuide: text("emotion_guide"),
  metaCompliance: text("meta_compliance"),
  placeholderKeys: jsonb("placeholder_keys").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Budget Allocations ────────────────────────────────────────────────────────

export const budgetAllocations = pgTable("budget_allocations", {
  id: uuid("id").defaultRandom().primaryKey(),
  funnelId: uuid("funnel_id"),
  totalDailyBudget: integer("total_daily_budget").notNull(),
  testingBudget: integer("testing_budget").notNull(),
  scalingBudget: integer("scaling_budget").notNull(),
  cboBudget: integer("cbo_budget").notNull(),
  zombieBudget: integer("zombie_budget").notNull(),
  testingCreativeBudget: integer("testing_creative_budget").notNull(),
  testingLpBudget: integer("testing_lp_budget").notNull(),
  dailyCreativesNeeded: integer("daily_creatives_needed").default(0),
  videoEditorsNeeded: integer("video_editors_needed").default(1),
  copywritersNeeded: integer("copywriters_needed").default(1),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("budget_funnel_idx").on(table.funnelId),
]);

// ─── Ad Alerts ─────────────────────────────────────────────────────────────────

export const adAlerts = pgTable("ad_alerts", {
  id: uuid("id").defaultRandom().primaryKey(),
  type: text("type").notNull(),
  severity: alertSeverityEnum("severity").default("info"),
  campaignId: uuid("campaign_id"),
  adId: uuid("ad_id"),
  message: text("message").notNull(),
  data: jsonb("data").$type<Record<string, unknown>>().default({}),
  acknowledgedAt: timestamp("acknowledged_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("alerts_severity_idx").on(table.severity, table.acknowledgedAt),
]);

// ─── Creator Profiles (partnerships) ──────────────────────────────────────────

export const creatorProfiles = pgTable("creator_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  metaPageId: text("meta_page_id"),
  metaHandle: text("meta_handle"),
  adAccountId: text("ad_account_id"),
  isWhitelisted: boolean("is_whitelisted").default(false),
  whitelistedAt: timestamp("whitelisted_at"),
  nicheCategory: text("niche_category"),
  followerCount: integer("follower_count"),
  avgEngagementRate: numeric("avg_engagement_rate", { precision: 4, scale: 2 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Placement Tests ───────────────────────────────────────────────────────────

export const placementTests = pgTable("placement_tests", {
  id: uuid("id").defaultRandom().primaryKey(),
  campaignId: uuid("campaign_id").notNull(),
  testType: text("test_type").notNull(),
  variantA: jsonb("variant_a").notNull(),
  variantB: jsonb("variant_b").notNull(),
  status: text("status").default("draft"),
  winnerVariant: text("winner_variant"),
  metricsA: jsonb("metrics_a").$type<Record<string, unknown>>(),
  metricsB: jsonb("metrics_b").$type<Record<string, unknown>>(),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("placement_test_campaign").on(table.campaignId),
]);

// ─── Creative Fatigue Scores ───────────────────────────────────────────────────

export const creativeFatigueScores = pgTable("creative_fatigue_scores", {
  id: uuid("id").defaultRandom().primaryKey(),
  adId: text("ad_id").notNull(),
  date: timestamp("date").notNull(),
  frequency: numeric("frequency", { precision: 6, scale: 2 }),
  ctrTrend7d: numeric("ctr_trend_7d", { precision: 6, scale: 4 }),
  roasTrend7d: numeric("roas_trend_7d", { precision: 6, scale: 4 }),
  fatigueScore: integer("fatigue_score"),
  recommendation: text("recommendation"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ─── Ads Extensions ────────────────────────────────────────────────────────────

export const adsExtensions = pgTable("ads_extensions", {
  adId: text("ad_id").primaryKey(),
  funnelStage: text("funnel_stage").default("tofu"),
  forceSpendPercent: integer("force_spend_percent"),
  placementExclusions: jsonb("placement_exclusions").$type<string[]>().default(["audience_network"]),
});
