/**
 * Purpose: GET /api/admin/migrate — DB setup for e-commerce tracking
 * Dependencies: drizzle-orm, db
 * Related: drizzle/0001_ecom_tracking.sql
 *
 * WHY: No psql in Coolify Alpine container. This endpoint handles BOTH cases:
 *      - Fresh DB: creates purchases table from scratch with all columns
 *      - Existing DB: migrates old schema (ALTER TABLE, RENAME, ADD columns)
 *      All statements use IF NOT EXISTS — safe to run multiple times.
 */

import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';
import { createLogger } from '@/lib/logger';

const log = createLogger('api:admin:migrate');

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    log.info('Running e-commerce DB setup...');
    const results: string[] = [];

    // WHY: Create purchases table IF NOT EXISTS — works on fresh DB
    //      All new columns included from the start (order_number, phone, address, upsell_history, live_mode, source)
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS purchases (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        funnel_id UUID,
        variant_id UUID,
        order_number INTEGER UNIQUE,
        session_id TEXT NOT NULL,
        customer_email TEXT NOT NULL,
        customer_name TEXT,
        customer_phone TEXT,
        customer_address JSONB,
        items JSONB DEFAULT '[]'::jsonb NOT NULL,
        upsell_history JSONB DEFAULT '[]'::jsonb,
        subtotal NUMERIC(12, 2) NOT NULL,
        shipping NUMERIC(12, 2) DEFAULT '0',
        tax NUMERIC(12, 2) DEFAULT '0',
        total NUMERIC(12, 2) NOT NULL,
        currency TEXT DEFAULT 'USD',
        payment_transaction_id TEXT,
        status TEXT DEFAULT 'pending',
        live_mode BOOLEAN DEFAULT false,
        source TEXT DEFAULT 'funnel-checkout',
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `);
    results.push('purchases table: created or already exists');

    // WHY: On existing DB, migrate old columns
    try {
      await db.execute(sql`ALTER TABLE purchases ALTER COLUMN funnel_id DROP NOT NULL`);
      results.push('funnel_id: made nullable');
    } catch {
      results.push('funnel_id: already nullable, skipped');
    }

    try {
      await db.execute(sql`ALTER TABLE purchases RENAME COLUMN stripe_payment_intent_id TO payment_transaction_id`);
      results.push('stripe_payment_intent_id → payment_transaction_id');
    } catch {
      results.push('payment_transaction_id: already renamed or column fresh, skipped');
    }

    // WHY: Add columns if missing (no-op if table was just created with them)
    const columns = [
      { name: 'order_number', def: 'INTEGER' },
      { name: 'customer_phone', def: 'TEXT' },
      { name: 'customer_address', def: 'JSONB' },
      { name: 'upsell_history', def: "JSONB DEFAULT '[]'::jsonb" },
      { name: 'source', def: "TEXT DEFAULT 'funnel-checkout'" },
      { name: 'live_mode', def: 'BOOLEAN DEFAULT false' },
    ];

    for (const col of columns) {
      try {
        await db.execute(sql`ALTER TABLE purchases ADD COLUMN IF NOT EXISTS ${sql.identifier(col.name)} ${sql.raw(col.def)}`);
        results.push(`${col.name}: added`);
      } catch {
        results.push(`${col.name}: already exists, skipped`);
      }
    }

    // WHY: Create indexes (idempotent)
    await db.execute(sql`CREATE INDEX IF NOT EXISTS purchase_funnel_idx ON purchases (funnel_id)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS purchase_variant_idx ON purchases (variant_id)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS purchase_email_idx ON purchases (customer_email)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS purchase_status_idx ON purchases (status)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS purchase_created_idx ON purchases (created_at)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS purchase_payment_idx ON purchases (payment_transaction_id)`);
    results.push('indexes: created');

    try {
      await db.execute(sql`DROP INDEX IF EXISTS purchase_stripe_idx`);
      results.push('purchase_stripe_idx: dropped (old)');
    } catch {
      results.push('purchase_stripe_idx: skip');
    }

    // WHY: Create the order_number sequence for auto-increment (#1001, #1002...)
    await db.execute(sql`CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1001`);
    results.push('order_number_seq: created');

    log.info('DB setup completed successfully');

    return Response.json({ success: true, results });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    log.error('DB setup failed', { error: message });
    return Response.json({ success: false, error: message }, { status: 500 });
  }
}
