/**
 * Purpose: RAG pattern engine tables — winning patterns and vector documents
 * Dependencies: enums.ts
 * Related: Architecture Finale.md §50 (RAG Pattern Engine)
 *
 * WHY: When the AI discovers a winning pattern (e.g. "green CTA + countdown = +12% CVR"),
 *      it gets codified and injected into future agent prompts. This is the self-improvement loop.
 */

import {
  pgTable,
  uuid,
  text,
  integer,
  numeric,
  jsonb,
  timestamp,
  real,
  index,
} from "drizzle-orm/pg-core";

// ─── Winning Patterns ──────────────────────────────────────────────────────────

export const winningPatterns = pgTable("winning_patterns", {
  id: uuid("id").defaultRandom().primaryKey(),
  patternType: text("pattern_type").notNull(),
  pageType: text("page_type").notNull(),
  vertical: text("vertical"),
  description: text("description").notNull(),
  blockSignature: jsonb("block_signature").$type<Record<string, unknown>>(),
  liftPercent: real("lift_percent"),
  confidence: real("confidence"),
  sampleSize: integer("sample_size"),
  experimentIds: jsonb("experiment_ids").$type<string[]>(),
  /** Embedding vector for similarity search (stored as text, cast to vector at query time) */
  embedding: text("embedding"),
  status: text("status").default("candidate"),
  codifiedAt: timestamp("codified_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("pattern_type_page_idx").on(table.patternType, table.pageType),
  index("pattern_status_idx").on(table.status),
]);

// ─── RAG Documents ─────────────────────────────────────────────────────────────

export const ragDocuments = pgTable("rag_documents", {
  id: uuid("id").defaultRandom().primaryKey(),
  sourceType: text("source_type").notNull(),
  content: text("content").notNull(),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  /** Embedding vector for similarity search */
  embedding: text("embedding"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("rag_source_type_idx").on(table.sourceType),
]);
