/**
 * Purpose: GET /api/admin/migrate — One-time DB migration for e-commerce tracking
 * Dependencies: drizzle-orm, db
 * Related: drizzle/0001_ecom_tracking.sql (same migration, API version)
 *
 * WHY: No psql available in Coolify (Alpine container, no separate DB service).
 *      Visiting this URL once applies all schema changes.
 *      All statements use IF NOT EXISTS — safe to run multiple times.
 *      DELETE this file after migration if desired.
 */

import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';
import { createLogger } from '@/lib/logger';

const log = createLogger('api:admin:migrate');

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    log.info('Running e-commerce tracking migration...');

    const results: string[] = [];

    await db.execute(sql`ALTER TABLE purchases ALTER COLUMN funnel_id DROP NOT NULL`);
    results.push('funnel_id: made nullable');

    try {
      await db.execute(sql`ALTER TABLE purchases RENAME COLUMN stripe_payment_intent_id TO payment_transaction_id`);
      results.push('stripe_payment_intent_id → payment_transaction_id');
    } catch {
      results.push('payment_transaction_id: already renamed, skipped');
    }

    await db.execute(sql`ALTER TABLE purchases ADD COLUMN IF NOT EXISTS order_number integer`);
    results.push('order_number: added');

    await db.execute(sql`ALTER TABLE purchases ADD COLUMN IF NOT EXISTS customer_phone text`);
    results.push('customer_phone: added');

    await db.execute(sql`ALTER TABLE purchases ADD COLUMN IF NOT EXISTS customer_address jsonb`);
    results.push('customer_address: added');

    await db.execute(sql`ALTER TABLE purchases ADD COLUMN IF NOT EXISTS upsell_history jsonb DEFAULT '[]'::jsonb`);
    results.push('upsell_history: added');

    await db.execute(sql`ALTER TABLE purchases ADD COLUMN IF NOT EXISTS source text DEFAULT 'funnel-checkout'`);
    results.push('source: added');

    await db.execute(sql`ALTER TABLE purchases ADD COLUMN IF NOT EXISTS live_mode boolean DEFAULT false`);
    results.push('live_mode: added');

    await db.execute(sql`CREATE INDEX IF NOT EXISTS purchase_status_idx ON purchases (status)`);
    results.push('purchase_status_idx: created');

    await db.execute(sql`CREATE INDEX IF NOT EXISTS purchase_created_idx ON purchases (created_at)`);
    results.push('purchase_created_idx: created');

    await db.execute(sql`DROP INDEX IF EXISTS purchase_stripe_idx`);
    results.push('purchase_stripe_idx: dropped');

    await db.execute(sql`CREATE INDEX IF NOT EXISTS purchase_payment_idx ON purchases (payment_transaction_id)`);
    results.push('purchase_payment_idx: created');

    try {
      await db.execute(sql`ALTER TABLE purchases ADD CONSTRAINT purchases_order_number_unique UNIQUE(order_number)`);
      results.push('purchases_order_number_unique: added');
    } catch {
      results.push('purchases_order_number_unique: already exists, skipped');
    }

    log.info('Migration completed successfully');

    return Response.json({ success: true, results });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    log.error('Migration failed', { error: message });
    return Response.json({ success: false, error: message }, { status: 500 });
  }
}
