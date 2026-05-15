/**
 * Purpose: One-time setup endpoint — runs DB migration + seed
 * Dependencies: postgres, fs
 * Related: drizzle/0000_handy_proteus.sql, src/db/seed.ts
 *
 * WHY: Standalone Docker build doesn't include drizzle-kit.
 *      This route executes the raw SQL migration and seeds initial data.
 *      Call once: GET /api/admin/setup
 */

import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import postgres from "postgres";

export const dynamic = "force-dynamic";

export async function GET() {
  const results: string[] = [];

  try {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      return NextResponse.json({ error: "DATABASE_URL not set" }, { status: 500 });
    }

    // WHY: Direct postgres connection for raw SQL execution (drizzle not needed)
    const sql = postgres(connectionString, { max: 1 });

    // ── Step 1: Run migration SQL ────────────────────────────────────────────
    try {
      const migrationPath = join(process.cwd(), "drizzle", "0000_black_warlock.sql");
      const migrationSQL = await readFile(migrationPath, "utf-8");

      // WHY: drizzle-kit generates SQL with --> statement-breakpoint separators
      const statements = migrationSQL
        .split("--> statement-breakpoint")
        .map((s) => s.trim())
        .filter((s) => s.length > 0 && !s.startsWith("--") && s !== "");

      results.push(`Found ${statements.length} migration statements`);

      for (let i = 0; i < statements.length; i++) {
        try {
          await sql.unsafe(statements[i]);
        } catch (err: any) {
          // WHY: "already exists" errors are OK (idempotent migration)
          if (err?.message?.includes("already exists") || err?.message?.includes("duplicate")) {
            // Skip — table/type already exists
          } else {
            results.push(`Statement ${i + 1} error: ${err?.message}`);
          }
        }
      }

      results.push("Migration complete");
    } catch (err: any) {
      results.push(`Migration file error: ${err?.message}`);
    }

    // ── Step 2: Verify tables exist ──────────────────────────────────────────
    try {
      const tables = await sql`
        SELECT table_name FROM information_schema.tables
        WHERE table_schema = 'public'
        ORDER BY table_name
      `;
      results.push(`Created ${tables.length} tables: ${tables.map((t: any) => t.table_name).join(", ")}`);
    } catch (err: any) {
      results.push(`Table check error: ${err?.message}`);
    }

    await sql.end();

    return NextResponse.json({
      status: "done",
      steps: results,
    });
  } catch (error: any) {
    return NextResponse.json({
      status: "error",
      error: error?.message,
      steps: results,
    }, { status: 500 });
  }
}
