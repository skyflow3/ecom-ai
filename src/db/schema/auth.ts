/**
 * Purpose: Auth-related tables — Clerk user sync
 * Dependencies: drizzle-orm/pg-core
 * Related: src/app/api/webhooks/clerk/route.ts, src/lib/auth.ts
 *
 * WHY: Clerk is the auth provider, but we need a local users table
 *      for relational queries (funnels.createdBy → users.id, etc.).
 *      The Clerk webhook keeps this table in sync.
 */

import {
  pgTable,
  uuid,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// ─── Users ──────────────────────────────────────────────────────────────────────
// WHY: Local mirror of Clerk users. Webhook-synced on create/update/delete.
//      Role and plan are managed HERE, not in Clerk metadata (simpler queries).

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  /** Clerk user ID — the foreign key back to Clerk */
  clerkId: text("clerk_id").notNull(),
  email: text("email").notNull(),
  name: text("name"),
  imageUrl: text("image_url"),
  /** user | admin | deleted (soft-delete) */
  role: text("role").default("user").notNull(),
  /** free | pro | enterprise */
  plan: text("plan").default("free").notNull(),
  /** Stripe Customer ID — set on first checkout, used for portal + webhooks */
  stripeCustomerId: text("stripe_customer_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("users_clerk_id_idx").on(table.clerkId),
]);
