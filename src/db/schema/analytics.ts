/**
 * Purpose: Analytics & tracking tables — events, metrics aggregations, revenue attribution
 * Dependencies: enums.ts
 * Related: Architecture Finale.md §2 (Events, Metrics)
 *
 * WHY: Separate raw events from aggregations. 5min for real-time, hourly for dashboards,
 *      daily for trend analysis. Element revenue tracks which BLOCK drives purchases.
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
  bigint,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { eventTypeEnum } from "./enums";

// ─── Events (raw tracking) ─────────────────────────────────────────────────────

export const events = pgTable("events", {
  id: uuid("id").defaultRandom().primaryKey(),
  eventType: eventTypeEnum("event_type").notNull(),
  eventId: text("event_id").notNull(),
  variantId: uuid("variant_id"),
  funnelId: uuid("funnel_id"),
  sessionId: text("session_id"),
  visitorId: text("visitor_id"),
  blockId: text("block_id"),
  elementTag: text("element_tag"),
  value: numeric("value", { precision: 10, scale: 2 }),
  currency: text("currency").default("USD"),
  payload: jsonb("payload").$type<Record<string, unknown>>().default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("events_variant_time").on(table.variantId, table.createdAt),
  index("events_type_time").on(table.eventType, table.createdAt),
  index("events_funnel_time").on(table.funnelId, table.createdAt),
]);

// ─── Raw Events (ingestion buffer) ─────────────────────────────────────────────

export const rawEvents = pgTable("raw_events", {
  eventId: text("event_id").primaryKey(),
  eventType: text("event_type").notNull(),
  sessionId: text("session_id").notNull(),
  payload: jsonb("payload").notNull(),
  receivedAt: timestamp("received_at").defaultNow(),
});

// ─── Metrics: 5-minute buckets (real-time) ─────────────────────────────────────
// WHY: No id PK — composite unique on (variantId, bucket) for upsert efficiency

export const metrics5min = pgTable("metrics_5min", {
  variantId: uuid("variant_id").notNull(),
  bucket: timestamp("bucket").notNull(),
  views: integer("views").default(0),
  clicks: integer("clicks").default(0),
  atc: integer("atc").default(0),
  purchases: integer("purchases").default(0),
  revenue: numeric("revenue", { precision: 12, scale: 2 }).default("0"),
}, (table) => [
  uniqueIndex("uniq_variant_bucket").on(table.variantId, table.bucket),
]);

// ─── Metrics: Hourly ───────────────────────────────────────────────────────────

export const metricsHourly = pgTable("metrics_hourly", {
  id: uuid("id").defaultRandom().primaryKey(),
  variantId: uuid("variant_id").notNull(),
  hour: timestamp("hour").notNull(),
  visitors: integer("visitors").default(0),
  pageViews: integer("page_views").default(0),
  clicks: integer("clicks").default(0),
  addToCarts: integer("add_to_carts").default(0),
  checkoutStarts: integer("checkout_starts").default(0),
  purchases: integer("purchases").default(0),
  revenue: numeric("revenue", { precision: 12, scale: 2 }).default("0"),
}, (table) => [
  uniqueIndex("hourly_variant_hour").on(table.variantId, table.hour),
]);

// ─── Metrics: Daily ────────────────────────────────────────────────────────────

export const metricsDaily = pgTable("metrics_daily", {
  id: uuid("id").defaultRandom().primaryKey(),
  variantId: uuid("variant_id").notNull(),
  funnelId: uuid("funnel_id").notNull(),
  date: timestamp("date").notNull(),
  visitors: integer("visitors").default(0),
  pageViews: integer("page_views").default(0),
  clicks: integer("clicks").default(0),
  addToCarts: integer("add_to_carts").default(0),
  purchases: integer("purchases").default(0),
  revenue: numeric("revenue", { precision: 12, scale: 2 }).default("0"),
  newCustomerSpend: integer("new_customer_spend").default(0),
  existingCustomerSpend: integer("existing_customer_spend").default(0),
  engagedAudienceSpend: integer("engaged_audience_spend").default(0),
  cvr: numeric("cvr", { precision: 6, scale: 4 }).default("0"),
  aov: numeric("aov", { precision: 12, scale: 2 }).default("0"),
  aovTimesCvr: numeric("aov_times_cvr", { precision: 10, scale: 4 }).default("0"),
  cartToPurchaseRatio: numeric("cart_to_purchase_ratio", { precision: 6, scale: 2 }).default("0"),
}, (table) => [
  uniqueIndex("daily_variant_date").on(table.variantId, table.date),
  index("daily_funnel").on(table.funnelId, table.date),
]);

// ─── Block Events (block-level interaction tracking) ───────────────────────────

export const blockEvents = pgTable("block_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  blockId: text("block_id").notNull(),
  variantId: uuid("variant_id"),
  eventType: text("event_type").notNull(),
  count: integer("count").default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("block_events_idx").on(table.blockId, table.variantId, table.eventType),
]);

// ─── Element Revenue (which UI element drove the purchase) ──────────────────────

export const elementRevenue = pgTable("element_revenue", {
  id: uuid("id").defaultRandom().primaryKey(),
  variantId: uuid("variant_id").notNull(),
  bid: text("bid").notNull(),
  clicks: integer("clicks").default(0),
  revenue: numeric("revenue", { precision: 12, scale: 2 }).default("0"),
  rect: jsonb("rect").$type<{ x: number; y: number; w: number; h: number }>(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  uniqueIndex("uniq_elem_rev").on(table.variantId, table.bid),
]);

// ─── Touchpoints (multi-touch attribution) ─────────────────────────────────────

export const touchpoints = pgTable("touchpoints", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionId: text("session_id").notNull(),
  userHash: text("user_hash").notNull(),
  channel: text("channel").notNull(),
  campaignId: text("campaign_id"),
  adId: text("ad_id"),
  timestamp: bigint("timestamp", { mode: "number" }).notNull(),
  cost: numeric("cost", { precision: 12, scale: 2 }),
});

// ─── Attributions ──────────────────────────────────────────────────────────────

export const attributions = pgTable("attributions", {
  id: uuid("id").defaultRandom().primaryKey(),
  purchaseId: uuid("purchase_id").notNull(),
  model: text("model").notNull(),
  totalRevenue: numeric("total_revenue", { precision: 12, scale: 2 }),
  roasBreakdown: jsonb("roas_breakdown").$type<Record<string, number>>(),
  calculatedAt: timestamp("calculated_at").defaultNow(),
});

// ─── Agent Costs ───────────────────────────────────────────────────────────────

export const agentCosts = pgTable("agent_costs", {
  id: uuid("id").defaultRandom().primaryKey(),
  agentId: text("agent_id").notNull(),
  action: text("action").notNull(),
  costCents: integer("cost_cents").default(0),
  revenueCents: integer("revenue_cents").default(0),
  roi: numeric("roi", { precision: 10, scale: 2 }).default("0"),
  ts: timestamp("ts").defaultNow(),
});

// ─── FB Accounts Warmup ────────────────────────────────────────────────────────

export const fbAccountsWarmup = pgTable("fb_accounts_warmup", {
  accountId: text("account_id").primaryKey(),
  warmupStage: integer("warmup_stage").default(0),
  dailySpendCap: integer("daily_spend_cap").default(50),
  trustScore: integer("trust_score").default(0),
});
