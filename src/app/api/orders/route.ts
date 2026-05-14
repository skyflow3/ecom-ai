/**
 * Purpose: POST /api/orders (create purchase) + GET /api/orders (list orders)
 * Dependencies: drizzle-orm, zod, schema (purchases), db
 * Related: src/db/schema/core.ts (purchases table), /api/orders/[id], /api/orders/export
 *
 * WHY: Central order management endpoint. Client checkout creates purchases here
 *      after Stripe confirmation. AI agents query GET for order listing/export.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { purchases } from '@/db/schema';
import { eq, desc, gte, lte, and, sql, count } from 'drizzle-orm';
import { createLogger } from '@/lib/logger';

const log = createLogger('api:orders');

export const dynamic = 'force-dynamic';

// ─── POST: Create Order ─────────────────────────────────────────────────────

const createOrderSchema = z.object({
  sessionId: z.string().min(1),
  customerEmail: z.string().email(),
  customerName: z.string().optional(),
  customerPhone: z.string().optional(),
  customerAddress: z.object({
    street: z.string(),
    apt: z.string().optional(),
    city: z.string(),
    state: z.string(),
    zip: z.string(),
    country: z.string(),
  }).optional(),
  items: z.array(z.object({
    name: z.string(),
    qty: z.number().int().min(1),
    price: z.number().min(0),
    type: z.enum(['main', 'upsell']),
  })).min(1),
  subtotal: z.number().min(0),
  shipping: z.number().min(0).default(0),
  tax: z.number().min(0).default(0),
  total: z.number().min(0),
  currency: z.string().default('USD'),
  paymentTransactionId: z.string().optional(),
  source: z.string().default('funnel-checkout'),
  liveMode: z.boolean().default(false),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid order data', details: parsed.error.issues },
        { status: 400 },
      );
    }

    const data = parsed.data;

    // WHY: Auto-increment sequence for human-readable order numbers (#1001, #1002...)
    //      Create if not exists — idempotent, safe to run on every request
    await db.execute(sql`CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1001`);
    const [{ nextval }] = await db.execute(sql`SELECT nextval('order_number_seq')`);
    const orderNumber = Number(nextval);

    const [order] = await db.insert(purchases).values({
      sessionId: data.sessionId,
      customerEmail: data.customerEmail,
      customerName: data.customerName ?? null,
      customerPhone: data.customerPhone ?? null,
      customerAddress: data.customerAddress ?? null,
      items: data.items,
      subtotal: data.subtotal.toString(),
      shipping: data.shipping.toString(),
      tax: data.tax.toString(),
      total: data.total.toString(),
      currency: data.currency,
      paymentTransactionId: data.paymentTransactionId ?? null,
      status: 'pending',
      liveMode: data.liveMode,
      source: data.source,
      orderNumber,
    }).returning();

    log.info('Order created', { orderId: order.id, orderNumber, email: data.customerEmail });

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    log.error('Failed to create order', { error: message });
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}

// ─── GET: List Orders ───────────────────────────────────────────────────────

const listOrdersSchema = z.object({
  status: z.string().optional(),
  liveMode: z.enum(['true', 'false']).optional().transform(v => v === 'true' ? true : v === 'false' ? false : undefined),
  from: z.string().optional(), // ISO date
  to: z.string().optional(),   // ISO date
  limit: z.coerce.number().int().min(1).max(200).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    // WHY: searchParams.get() returns null when missing, but Zod optional() expects undefined
    const parsed = listOrdersSchema.safeParse({
      status: searchParams.get('status') ?? undefined,
      liveMode: searchParams.get('liveMode') ?? undefined,
      from: searchParams.get('from') ?? undefined,
      to: searchParams.get('to') ?? undefined,
      limit: searchParams.get('limit') ?? undefined,
      offset: searchParams.get('offset') ?? undefined,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid query params', details: parsed.error.issues },
        { status: 400 },
      );
    }

    const { status, liveMode, from, to, limit, offset } = parsed.data;

    // WHY: Build conditions dynamically — each filter is optional
    const conditions = [];
    if (status) conditions.push(eq(purchases.status, status));
    if (liveMode !== undefined) conditions.push(eq(purchases.liveMode, liveMode));
    if (from) conditions.push(gte(purchases.createdAt, new Date(from)));
    if (to) conditions.push(lte(purchases.createdAt, new Date(to)));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [orderRows, [{ total: totalCount }]] = await Promise.all([
      db.query.purchases.findMany({
        where,
        orderBy: desc(purchases.createdAt),
        limit,
        offset,
      }),
      db.select({ total: count() }).from(purchases).where(where ?? sql`1=1`),
    ]);

    return NextResponse.json({
      success: true,
      orders: orderRows,
      total: totalCount,
      hasMore: offset + limit < totalCount,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    log.error('Failed to list orders', { error: message });
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
