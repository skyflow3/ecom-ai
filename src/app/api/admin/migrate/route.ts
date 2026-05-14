/**
 * Purpose: GET /api/admin/migrate — One-time DB migration for e-commerce tracking
 * Dependencies: drizzle-orm, db
 * Related: drizzle/0001_ecom_tracking.sql (same migration, API version)
 *
 * WHY: Non-technical user can't run psql in Coolify terminal.
 *      Hitting this URL once applies all schema changes.
 *      All statements use IF NOT EXISTS — safe to run multiple times.
 */

import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';
import { createLogger } from '@/lib/logger';

const log = createLogger('api:admin:migrate');

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    log.info('Running e-commerce tracking migration...');

    // WHY: Each statement is idempotent (IF NOT EXISTS, IF EXISTS)
    //      Safe to call multiple times without side effects
    await db.execute(sql`
      ALTER TABLE purchases ALTER COLUMN funnel_id DROP NOT NULL
    `);

    try {
      await db.execute(sql`
        ALTER TABLE purchases RENAME COLUMN stripe_payment_intent_id TO payment_transaction_id
      `);
    } catch {
      // WHY: Column may already be renamed — ignore error
      log.info('Column already renamed or does not exist, skipping rename');
    }

    await db.execute(sql`ALTER TABLE purchases ADD COLUMN IF NOT EXISTS order_number integer`);
    await db.execute(sql`ALTER TABLE purchases ADD COLUMN IF NOT EXISTS customer_phone text`);
    await db.execute(sql`ALTER TABLE purchases ADD COLUMN IF NOT EXISTS customer_address jsonb`);
    await db.execute(sql`ALTER TABLE purchases ADD COLUMN IF NOT EXISTS upsell_history jsonb DEFAULT '[]'::jsonb`);
    await db.execute(sql`ALTER TABLE purchases ADD COLUMN IF NOT EXISTS source text DEFAULT 'funnel-checkout'`);
    await db.execute(sql`ALTER TABLE purchases ADD COLUMN IF NOT EXISTS live_mode boolean DEFAULT false`);

    await db.execute(sql`CREATE INDEX IF NOT EXISTS purchase_status_idx ON purchases (status)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS purchase_created_idx ON purchases (created_at)`);
    await db.execute(sql`DROP INDEX IF EXISTS purchase_stripe_idx`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS purchase_payment_idx ON purchases (payment_transaction_id)`);

    try {
      await db.execute(sql`ALTER TABLE purchases ADD CONSTRAINT purchases_order_number_unique UNIQUE(order_number)`);
    } catch {
      // WHY: Constraint may already exist — ignore error
      log.info('Unique constraint already exists, skipping');
    }

    log.info('Migration completed successfully');

    return new Response(JSON.stringify({
      success: true,
      message: 'E-commerce tracking migration applied. New columns: order_number, customer_phone, customer_address, upsell_history, source, live_mode.',
      columns_added: ['order_number', 'customer_phone', 'customer_address', 'upsell_history', 'source', 'live_mode'],
      indexes_created: ['purchase_status_idx', 'purchase_created_idx', 'purchase_payment_idx'],
      renamed: 'stripe_payment_intent_id → payment_transaction_id',
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    log.error('Migration failed', { error: message });
    return new Response(JSON.stringify({
      success: false,
      error: message,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
