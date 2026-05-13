/**
 * Purpose: Core domain tables — funnels, products, steps, variants, blocks
 * Dependencies: enums.ts
 * Related: Architecture Finale.md §2 (Core Tables)
 *
 * WHY: These are the foundation tables every other domain references.
 *      Funnels → Steps → Variants is the core hierarchy.
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
  stepTypeEnum,
  funnelStatusEnum,
} from "./enums";

// ─── Products ──────────────────────────────────────────────────────────────────

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  images: jsonb("images").$type<string[]>().default([]),
  price: numeric("price", { precision: 12, scale: 2 }).notNull(),
  compareAtPrice: numeric("compare_at_price", { precision: 12, scale: 2 }),
  currency: text("currency").default("USD"),
  stripeProductId: text("stripe_product_id"),
  stripePriceId: text("stripe_price_id"),
  isActive: boolean("is_active").default(true),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("product_active_idx").on(table.isActive),
]);

// ─── Funnels ───────────────────────────────────────────────────────────────────

export const funnels = pgTable("funnels", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  domain: text("domain"),
  subdomain: text("subdomain"),
  status: funnelStatusEnum("status").default("draft"),
  productId: uuid("product_id"),
  researchMode: boolean("research_mode").default(false),
  researchPhase: text("research_phase"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("funnel_product_idx").on(table.productId),
]);

// ─── Marketing Angles ──────────────────────────────────────────────────────────

export const marketingAngles = pgTable("marketing_angles", {
  id: uuid("id").defaultRandom().primaryKey(),
  funnelId: uuid("funnel_id").notNull(),
  name: text("name").notNull(),
  headline: text("headline").notNull(),
  subheadline: text("subheadline"),
  painPoint: text("pain_point"),
  solution: text("solution"),
  ctaText: text("cta_text"),
  benefits: jsonb("benefits").$type<string[]>().default([]),
  guarantee: text("guarantee"),
  extras: jsonb("extras").$type<Record<string, unknown>>().default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("angles_funnel_idx").on(table.funnelId),
]);

// ─── Funnel Steps ──────────────────────────────────────────────────────────────

export const funnelSteps = pgTable("funnel_steps", {
  id: uuid("id").defaultRandom().primaryKey(),
  funnelId: uuid("funnel_id").notNull(),
  type: stepTypeEnum("type").notNull(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  sortOrder: integer("sort_order").notNull(),
  activeVariantId: uuid("active_variant_id"),
  nextStepId: uuid("next_step_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("steps_funnel_idx").on(table.funnelId),
  uniqueIndex("steps_funnel_slug").on(table.funnelId, table.slug),
]);

// ─── Page Variants ─────────────────────────────────────────────────────────────

export const pageVariants = pgTable("page_variants", {
  id: uuid("id").defaultRandom().primaryKey(),
  stepId: uuid("step_id").notNull(),
  name: text("name").notNull(),
  angle: text("angle"),
  hypothesis: text("hypothesis"),
  status: text("status").default("draft"),
  trafficWeight: integer("traffic_weight").default(50),
  isControl: boolean("is_control").default(false),
  isWinner: boolean("is_winner").default(false),
  /** Block tree JSON — the page composition from §45-§47 */
  page: jsonb("page").notNull(),
  changedBlocks: jsonb("changed_blocks").$type<string[]>().default([]),
  testVariable: jsonb("test_variable").$type<{ name: string; value: string; baseline: string }>(),
  r2Key: text("r2_key"),
  deployedUrl: text("deployed_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("variants_step_idx").on(table.stepId),
]);

// ─── Block Definitions ─────────────────────────────────────────────────────────
// WHY: Section 4 version (uuid PK) — tracks usage and performance for RAG

export const blockDefinitions = pgTable("block_definitions", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
  category: text("category").notNull(),
  description: text("description"),
  htmlTemplate: text("html_template").notNull(),
  cssTemplate: text("css_template").default(""),
  jsTemplate: text("js_template").default(""),
  configSchema: jsonb("config_schema").notNull(),
  defaultConfig: jsonb("default_config").notNull(),
  isSystem: boolean("is_system").default(false),
  createdByAgent: boolean("created_by_agent").default(false),
  usageCount: integer("usage_count").default(0),
  performanceScore: numeric("performance_score", { precision: 4, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Templates ─────────────────────────────────────────────────────────────────

export const templates = pgTable("templates", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  description: text("description"),
  /** Template structure: blocks, placeholders, globalStyles */
  structure: jsonb("structure").notNull(),
  isBuiltIn: boolean("is_built_in").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("templates_type_idx").on(table.type),
]);

// ─── Bundles ───────────────────────────────────────────────────────────────────

export const bundles = pgTable("bundles", {
  id: uuid("id").defaultRandom().primaryKey(),
  funnelId: uuid("funnel_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  products: jsonb("products").$type<Array<{ productId: string; quantity: number }>>().default([]).notNull(),
  price: numeric("price", { precision: 12, scale: 2 }).notNull(),
  compareAtPrice: numeric("compare_at_price", { precision: 12, scale: 2 }),
  isPopular: boolean("is_popular").default(false),
  isOptimal: boolean("is_optimal").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("bundle_funnel_idx").on(table.funnelId),
]);

// ─── Purchases (E-Commerce Orders) ──────────────────────────────────────────────
// WHY: Extended from basic purchases to full e-commerce order tracking.
//      funnelId nullable allows standalone orders without funnel reference.
//      upsellHistory tracks accept/decline per OTO for revenue attribution.
//      orderNumber is human-readable (auto-increment #1001, #1002...).

export type CustomerAddress = {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

export type UpsellEntry = {
  oto: number;
  accepted: boolean;
  price: number;
  name: string;
};

export type OrderItem = {
  name: string;
  qty: number;
  price: number;
  type: 'main' | 'upsell';
};

export const purchases = pgTable("purchases", {
  id: uuid("id").defaultRandom().primaryKey(),
  // WHY: nullable — standalone e-commerce orders don't have a funnel reference
  funnelId: uuid("funnel_id"),
  variantId: uuid("variant_id"),
  orderNumber: integer("order_number").unique(),
  sessionId: text("session_id").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerName: text("customer_name"),
  customerPhone: text("customer_phone"),
  customerAddress: jsonb("customer_address").$type<CustomerAddress>(),
  items: jsonb("items").$type<OrderItem[]>().default([]).notNull(),
  upsellHistory: jsonb("upsell_history").$type<UpsellEntry[]>().default([]),
  subtotal: numeric("subtotal", { precision: 12, scale: 2 }).notNull(),
  shipping: numeric("shipping", { precision: 12, scale: 2 }).default("0"),
  tax: numeric("tax", { precision: 12, scale: 2 }).default("0"),
  total: numeric("total", { precision: 12, scale: 2 }).notNull(),
  currency: text("currency").default("USD"),
  // WHY: Generic — works with Stripe, PayPal, Mercado Pago, or any processor
  paymentTransactionId: text("payment_transaction_id"),
  // WHY: pending → paid → shipped → delivered | refunded
  status: text("status").default("pending"),
  // WHY: false = Stripe test mode (4242 card), true = real payment
  //      AI agents filter with GET /api/orders?liveMode=true to export only real orders
  liveMode: boolean("live_mode").default(false),
  source: text("source").default("funnel-checkout"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("purchase_funnel_idx").on(table.funnelId),
  index("purchase_variant_idx").on(table.variantId),
  index("purchase_email_idx").on(table.customerEmail),
  index("purchase_payment_idx").on(table.paymentTransactionId),
  index("purchase_status_idx").on(table.status),
  index("purchase_created_idx").on(table.createdAt),
]);

// ─── Pixel Configs ─────────────────────────────────────────────────────────────

export const pixelConfigs = pgTable("pixel_configs", {
  id: uuid("id").defaultRandom().primaryKey(),
  funnelId: uuid("funnel_id").notNull(),
  pixelId: text("pixel_id").notNull(),
  accessToken: text("access_token").notNull(),
  testEventCode: text("test_event_code"),
  ga4Id: text("ga4_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("pixel_funnel_idx").on(table.funnelId),
]);
