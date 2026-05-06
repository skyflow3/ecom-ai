/**
 * Purpose: Database connection singleton
 * Dependencies: postgres, drizzle-orm
 * Related: src/db/schema/index.ts, drizzle.config.ts
 */

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/db/schema";

const connectionString = process.env.DATABASE_URL!;

// WHY: postgres.js singleton — prevents connection pool exhaustion in dev
const queryClient = postgres(connectionString, {
  max: process.env.NODE_ENV === "production" ? 20 : 5,
});

export const db = drizzle(queryClient, { schema });
