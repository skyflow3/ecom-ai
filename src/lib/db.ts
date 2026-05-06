/**
 * Purpose: Database connection singleton (lazy initialization)
 * Dependencies: postgres, drizzle-orm
 * Related: src/db/schema/index.ts, drizzle.config.ts
 *
 * WHY: Lazy init prevents crashes if DATABASE_URL is missing or DB is unreachable.
 *      The app can start and serve healthcheck/basic routes without a DB connection.
 */

import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/db/schema";

type DbClient = PostgresJsDatabase<typeof schema>;

let _db: DbClient | null = null;
let _client: ReturnType<typeof postgres> | null = null;

// WHY: Lazy getter — only connects when first accessed, not at import time
function getDb(): DbClient {
  if (!_db) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL is not set");
    }
    _client = postgres(connectionString, {
      max: process.env.NODE_ENV === "production" ? 20 : 5,
    });
    _db = drizzle(_client, { schema });
  }
  return _db;
}

// WHY: Getter-based lazy init — preserves full TypeScript type inference
//      while deferring connection until first actual query
export const db: DbClient = new Proxy({} as DbClient, {
  get(_, prop) {
    const actual = getDb();
    const value = (actual as any)[prop];
    // WHY: Bind methods so `db.query.xxx.findFirst()` works
    if (typeof value === "function") {
      return value.bind(actual);
    }
    return value;
  },
});
