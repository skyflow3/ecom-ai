/**
 * Purpose: PostgreSQL enum types for ECOM-AI database
 * Dependencies: drizzle-orm/pg-core
 * Related: Architecture Finale.md (52 sections, 10 enums)
 *
 * WHY: Drizzle pgEnum creates real PostgreSQL enum types.
 *      Type-safe at TypeScript level, enforced at DB level.
 */

import { pgEnum } from "drizzle-orm/pg-core";

// ─── Core Enums ────────────────────────────────────────────────────────────────

/** Funnel step types — the 10 page types the AI can compose */
export const stepTypeEnum = pgEnum("step_type", [
  "optin",
  "checkout",
  "thank-you",
  "upsell",
  "downsell",
  "advertorial",
  "vsl",
  "quiz",
  "product-page",
  "bridge",
]);

/** Funnel lifecycle status */
export const funnelStatusEnum = pgEnum("funnel_status", [
  "draft",
  "active",
  "paused",
  "archived",
]);

// ─── A/B Testing Enums ─────────────────────────────────────────────────────────

/** A/B test lifecycle */
export const abTestStatusEnum = pgEnum("ab_test_status", [
  "draft",
  "running",
  "paused",
  "completed",
]);

/** Event types tracked across all pages */
export const eventTypeEnum = pgEnum("event_type", [
  "PageView",
  "ViewContent",
  "AddToCart",
  "InitiateCheckout",
  "Purchase",
  "click",
  "scroll",
  "form_submit",
]);

/** A/B test phases — 5-stage state machine (§49) */
export const testPhaseEnum = pgEnum("test_phase", [
  "sandbox",
  "elimination",
  "commando",
  "duel",
  "champion",
]);

// ─── Ads Enums ─────────────────────────────────────────────────────────────────

/** Campaign strategy types */
export const campaignTypeEnum = pgEnum("campaign_type", [
  "testing",
  "cbo_scaling",
  "zombie_cost_cap",
]);

/** Campaign lifecycle phases */
export const campaignPhaseEnum = pgEnum("campaign_phase", [
  "phase1_validation",
  "phase2_scaling",
]);

/** Ad creative outcome after testing */
export const adFateEnum = pgEnum("ad_fate", [
  "winner",
  "almost",
  "loser",
  "pending",
]);

/** Full-funnel ad targeting stages */
export const adsFunnelStageEnum = pgEnum("ads_funnel_stage", [
  "tofu",
  "mofu",
  "bofu",
  "retention",
  "reactivation",
]);

/** Alert severity for ad monitoring */
export const alertSeverityEnum = pgEnum("alert_severity", [
  "info",
  "warning",
  "critical",
]);
