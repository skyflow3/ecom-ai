/**
 * Purpose: GET /api/orders/[id] (order detail) + PATCH /api/orders/[id] (update status)
 * Dependencies: drizzle-orm, zod, schema (purchases), db
 * Related: /api/orders (list/create), /api/orders/[id]/upsell
 *
 * WHY: Single order operations — AI agents use GET to fetch full order details
 *      for logistics export. PATCH allows status updates (shipped, delivered, refunded).
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { purchases } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { createLogger } from '@/lib/logger';

const log = createLogger('api:orders:id');

export const dynamic = 'force-dynamic';

// ─── GET: Order Detail ──────────────────────────────────────────────────────

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const order = await db.query.purchases.findFirst({
      where: eq(purchases.id, id),
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, order });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    log.error('Failed to get order', { error: message });
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}

// ─── PATCH: Update Order Status ─────────────────────────────────────────────

const updateOrderSchema = z.object({
  status: z.enum(['pending', 'paid', 'shipped', 'delivered', 'refunded']),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = updateOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid status', details: parsed.error.issues },
        { status: 400 },
      );
    }

    const [updated] = await db
      .update(purchases)
      .set({ status: parsed.data.status, updatedAt: new Date() })
      .where(eq(purchases.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 },
      );
    }

    log.info('Order status updated', { orderId: id, status: parsed.data.status });

    return NextResponse.json({ success: true, order: updated });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    log.error('Failed to update order', { error: message });
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
