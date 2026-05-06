/**
 * Purpose: Database connection singleton (lazy initialization)
 * Dependencies: postgres, drizzle-orm
 * Related: src/db/schema/index.ts, drizzle.config.ts
 *
 * WHY: Lazy init prevents crashes if DATABASE_URL is missing or DB is unreachable.
 *      The app can start and serve healthcheck/basic routes without a DB connection.
 */

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/db/schema";

let _db: ReturnType<typeof drizzle> | null = null;
let _client: ReturnType<typeof postgres> | null = null;

// WHY: Lazy getter — only connects when first accessed, not at import time
function getDb() {
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

// WHY: Export as getter so `import { db }` still works via Proxy
//      but connection is only created when db is actually used
export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_, prop) {
    return (getDb() as any)[prop];
  },
});
