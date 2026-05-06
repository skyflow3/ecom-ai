/**
 * Purpose: Offers, subscriptions, upsell, multi-country configuration tables
 * Dependencies: enums.ts
 * Related: Architecture Finale.md §38-§43 (Offers, Subscription, Upsell, Multi-country)
 *
 * WHY: The offer system drives monetization. Free trial, subscription, upsell,
 *      and downsell strategies are configured here per product/funnel.
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

// ─── Offers ────────────────────────────────────────────────────────────────────

export const offers = pgTable("offers", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").notNull(),
  funnelId: uuid("funnel_id"),
  name: text("name").notNull(),
  type: text("type").notNull(),
  regularPrice: numeric("regular_price", { precision: 12, scale: 2 }).notNull(),
  trialPrice: numeric("trial_price", { precision: 12, scale: 2 }).default("0"),
  shippingPrice: numeric("shipping_price", { precision: 12, scale: 2 }).default("4.90"),
  subscriptionPrice: numeric("subscription_price", { precision: 12, scale: 2 }),
  subscriptionInterval: text("subscription_interval").default("month"),
  subscriptionBenefits: jsonb("subscription_benefits").$type<{
    lifetimeDiscount?: number;
    freeShipping?: boolean;
    cancelAnytime?: boolean;
    freeGifts?: string[];
  }>().default({ lifetimeDiscount: 50, freeShipping: true, cancelAnytime: true, freeGifts: [] }),
  shippingExplanation: text("shipping_explanation"),
  trialDurationDays: integer("trial_duration_days").default(30),
  autoChargeAfterTrial: boolean("auto_charge_after_trial").default(true),
  cancelWarningEmail: text("cancel_warning_email"),
  cancelWarningPage: text("cancel_warning_page"),
  limitedSpots: integer("limited_spots"),
  countdownMinutes: integer("countdown_minutes"),
  promoCode: text("promo_code"),
  trialHeadline: text("trial_headline"),
  whyFreeExplanation: text("why_free_explanation"),
  guaranteeText: text("guarantee_text"),
  stripeTrialPriceId: text("stripe_trial_price_id"),
  stripeSubscriptionPriceId: text("stripe_subscription_price_id"),
  maxTrafficPercent: integer("max_traffic_percent").default(100),
  dailyBudgetCap: numeric("daily_budget_cap", { precision: 10, scale: 2 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("offers_product_idx").on(table.productId),
]);

// ─── Offer Templates ───────────────────────────────────────────────────────────

export const offerTemplates = pgTable("offer_templates", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  source: text("source"),
  estimatedCvr: text("estimated_cvr"),
  bestForNiches: jsonb("best_for_niches").$type<string[]>().default([]),
  funnelFlow: jsonb("funnel_flow").$type<string[]>().default([]),
  config: jsonb("config").notNull(),
  headlines: jsonb("headlines").$type<string[]>().default([]),
  ctaTexts: jsonb("cta_texts").$type<string[]>().default([]),
  whyFreeTexts: jsonb("why_free_texts").$type<string[]>().default([]),
  guaranteeTexts: jsonb("guarantee_texts").$type<string[]>().default([]),
  cancelWarningTexts: jsonb("cancel_warning_texts").$type<string[]>().default([]),
  isProven: boolean("is_proven").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Upsell Offers ─────────────────────────────────────────────────────────────
// WHY: Self-referencing FK for downsell chains (upsell → downsell → downsell)

export const upsellOffers = pgTable("upsell_offers", {
  id: uuid("id").defaultRandom().primaryKey(),
  funnelId: uuid("funnel_id").notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  trigger: text("trigger").notNull(),
  productId: uuid("product_id").notNull(),
  mainProductId: uuid("main_product_id").notNull(),
  regularPrice: numeric("regular_price", { precision: 12, scale: 2 }).notNull(),
  upsellPrice: numeric("upsell_price", { precision: 12, scale: 2 }).notNull(),
  discountPercent: integer("discount_percent").default(30),
  headline: text("headline").notNull(),
  subheadline: text("subheadline"),
  ctaText: text("cta_text").notNull(),
  urgencyNote: text("urgency_note"),
  noThanksText: text("no_thanks_text").default("No thanks, I'll pass"),
  vslEnabled: boolean("vsl_enabled").default(false),
  vslVideoUrl: text("vsl_video_url"),
  vslAutoplay: boolean("vsl_autoplay").default(true),
  vslPosterImage: text("vsl_poster_image"),
  oneClick: boolean("one_click").default(true),
  showNoThanks: boolean("show_no_thanks").default(true),
  noThanksBehavior: text("no_thanks_behavior").default("downsell"),
  /** Self-reference: if noThanksBehavior = 'downsell', this points to the downsell offer */
  downsellId: uuid("downsell_id"),
  impressions: integer("impressions").default(0),
  conversions: integer("conversions").default(0),
  revenue: numeric("revenue", { precision: 12, scale: 2 }).default("0"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("upsell_funnel_idx").on(table.funnelId),
]);

// ─── Subscription Milestones ───────────────────────────────────────────────────

export const subscriptionMilestones = pgTable("subscription_milestones", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").notNull(),
  month: integer("month").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull(),
  valueUsd: numeric("value_usd", { precision: 8, scale: 2 }),
  retainAfterMonths: integer("retain_after_months"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("milestones_product_month").on(table.productId, table.month),
]);

// ─── Retention Triggers ────────────────────────────────────────────────────────

export const retentionTriggers = pgTable("retention_triggers", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").notNull(),
  name: text("name").notNull(),
  triggerType: text("trigger_type").notNull(),
  daysOffset: integer("days_offset").notNull(),
  emailSubject: text("email_subject").notNull(),
  emailBody: text("email_body").notNull(),
  ctaText: text("cta_text"),
  ctaUrl: text("cta_url"),
  incentiveType: text("incentive_type"),
  incentiveValue: text("incentive_value"),
  skipIfStillActive: boolean("skip_if_still_active").default(true),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("retention_product_type").on(table.productId, table.triggerType),
]);

// ─── Promo Auto Rules ──────────────────────────────────────────────────────────

export const promoAutoRules = pgTable("promo_auto_rules", {
  id: uuid("id").defaultRandom().primaryKey(),
  funnelId: uuid("funnel_id").notNull(),
  promoCode: text("promo_code").notNull(),
  triggerType: text("trigger_type").notNull(),
  triggerValue: text("trigger_value").notNull(),
  discountPercent: integer("discount_percent").notNull(),
  maxUses: integer("max_uses"),
  usedCount: integer("used_count").default(0),
  expiresAt: timestamp("expires_at"),
  bannerText: text("banner_text"),
  bannerStyle: text("banner_style").default("banner_top"),
  autoApply: boolean("auto_apply").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("promo_trigger_idx").on(table.triggerType, table.triggerValue),
]);

// ─── Country Configs (multi-country expansion) ─────────────────────────────────

export const countryConfigs = pgTable("country_configs", {
  id: uuid("id").defaultRandom().primaryKey(),
  countryCode: text("country_code").notNull().unique(),
  countryName: text("country_name").notNull(),
  language: text("language").notNull(),
  currency: text("currency").notNull(),
  currencySymbol: text("currency_symbol").notNull(),
  requiredProcessors: jsonb("required_processors").$type<string[]>().default([]),
  recommendedProcessors: jsonb("recommended_processors").$type<string[]>().default([]),
  translationMethod: text("translation_method").default("same_english"),
  adsLanguage: text("ads_language").default("en"),
  siteLanguage: text("site_language").default("en"),
  testWithEnglishFirst: boolean("test_with_english_first").default(true),
  englishProficiency: text("english_proficiency").default("medium"),
  estimatedCpcRange: jsonb("estimated_cpc_range").$type<[number, number]>(),
  recommendedPlatforms: jsonb("recommended_platforms").$type<string[]>().default([]),
  population: integer("population"),
  avgOrderValue: numeric("avg_order_value", { precision: 8, scale: 2 }),
  expansionPhase: integer("expansion_phase").default(1),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
