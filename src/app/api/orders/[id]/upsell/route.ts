/**
 * Purpose: POST /api/orders/[id]/upsell — Track upsell accept/decline
 * Dependencies: drizzle-orm, zod, schema (purchases), db
 * Related: /api/orders/[id], public/oto1-5.html (client-side calls)
 *
 * WHY: Each upsell page calls this endpoint when user clicks YES or NO.
 *      Appends to upsellHistory array and updates total if accepted.
 *      This gives full revenue attribution per OTO step.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { purchases } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { createLogger } from '@/lib/logger';

const log = createLogger('api:orders:upsell');

export const dynamic = 'force-dynamic';

// ─── POST: Track Upsell ─────────────────────────────────────────────────────

const upsellSchema = z.object({
  oto: z.number().int().min(1).max(10),
  accepted: z.boolean(),
  price: z.number().min(0).default(0),
  name: z.string().default(''),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = upsellSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid upsell data', details: parsed.error.issues },
        { status: 400 },
      );
    }

    const { oto, accepted, price, name } = parsed.data;

    // WHY: Fetch current purchase to append to existing upsellHistory
    const order = await db.query.purchases.findFirst({
      where: eq(purchases.id, id),
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 },
      );
    }

    const currentHistory = (order.upsellHistory ?? []) as Array<{
      oto: number; accepted: boolean; price: number; name: string;
    }>;

    // WHY: Replace existing entry for same OTO (user can click YES then NO)
    const updatedHistory = [
      ...currentHistory.filter(u => u.oto !== oto),
      { oto, accepted, price, name },
    ];

    // WHY: Recalculate total — add upsell price if accepted
    const currentTotal = parseFloat(order.total ?? '0');
    const upsellTotal = updatedHistory
      .filter(u => u.accepted)
      .reduce((sum, u) => sum + u.price, 0);
    const newTotal = parseFloat(order.subtotal ?? '0') + upsellTotal +
      parseFloat(order.shipping ?? '0') + parseFloat(order.tax ?? '0');

    // WHY: If accepted, add upsell item to items array
    const currentItems = (order.items ?? []) as Array<{
      name: string; qty: number; price: number; type: string;
    }>;
    const updatedItems: Array<{ name: string; qty: number; price: number; type: 'main' | 'upsell' }> = [
      ...currentItems.filter(i => i.type !== `upsell-oto${oto}`).map(i => ({ ...i, type: i.type as 'main' | 'upsell' })),
      ...(accepted ? [{
        name: name || `OTO${oto} Upsell`,
        qty: 1,
        price,
        type: 'upsell' as const,
      }] : []),
    ];

    const [updated] = await db
      .update(purchases)
      .set({
        upsellHistory: updatedHistory,
        items: updatedItems,
        total: newTotal.toFixed(2),
        updatedAt: new Date(),
      })
      .where(eq(purchases.id, id))
      .returning();

    log.info('Upsell tracked', { orderId: id, oto, accepted, price });

    return NextResponse.json({ success: true, order: updated });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    log.error('Failed to track upsell', { error: message });
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
