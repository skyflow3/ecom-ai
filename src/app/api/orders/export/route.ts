/**
 * Purpose: GET /api/orders/export — Export orders as JSON or CSV for logistics
 * Dependencies: drizzle-orm, zod, schema (purchases), db
 * Related: /api/orders (list), AI agents (consumers)
 *
 * WHY: AI agents call this endpoint to export order data for logistics teams.
 *      Supports JSON (structured) and CSV (spreadsheet-friendly) formats.
 *      Filters: status, date range. Used for email/WhatsApp dispatch to logistics.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { purchases } from '@/db/schema';
import { eq, desc, gte, lte, and } from 'drizzle-orm';
import { createLogger } from '@/lib/logger';

const log = createLogger('api:orders:export');

export const dynamic = 'force-dynamic';

// ─── Export Schema ───────────────────────────────────────────────────────────

const exportSchema = z.object({
  format: z.enum(['json', 'csv']).default('json'),
  status: z.string().optional(),
  liveMode: z.enum(['true', 'false']).optional().transform(v => v === 'true' ? true : v === 'false' ? false : undefined),
  from: z.string().optional(),
  to: z.string().optional(),
});

// ─── CSV Helper ──────────────────────────────────────────────────────────────

function toCSV(orders: any[]): string {
  const headers = [
    'orderNumber', 'status', 'liveMode', 'customerName', 'customerEmail', 'customerPhone',
    'street', 'city', 'state', 'zip', 'country',
    'items', 'subtotal', 'shipping', 'tax', 'total', 'currency',
    'upsellHistory', 'paymentTransactionId', 'createdAt',
  ];

  const rows = orders.map(o => {
    const addr = o.customerAddress ?? {};
    const itemsStr = (o.items ?? []).map((i: any) => `${i.name} x${i.qty} @${i.price}`).join('; ');
    const upsellStr = (o.upsellHistory ?? [])
      .map((u: any) => `OTO${u.oto}:${u.accepted ? 'YES' : 'NO'}${u.accepted ? ` $${u.price}` : ''}`)
      .join('; ');

    return [
      o.orderNumber ?? '',
      o.status ?? '',
      o.liveMode ? 'LIVE' : 'TEST',
      o.customerName ?? '',
      o.customerEmail ?? '',
      o.customerPhone ?? '',
      addr.street ?? '',
      addr.city ?? '',
      addr.state ?? '',
      addr.zip ?? '',
      addr.country ?? '',
      `"${itemsStr}"`,
      o.subtotal ?? '0',
      o.shipping ?? '0',
      o.tax ?? '0',
      o.total ?? '0',
      o.currency ?? 'USD',
      `"${upsellStr}"`,
      o.paymentTransactionId ?? '',
      o.createdAt ?? '',
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}

// ─── GET: Export Orders ─────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = exportSchema.safeParse({
      format: searchParams.get('format'),
      status: searchParams.get('status'),
      liveMode: searchParams.get('liveMode'),
      from: searchParams.get('from'),
      to: searchParams.get('to'),
    });

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid params', details: parsed.error.issues },
        { status: 400 },
      );
    }

    const { format, status, liveMode, from, to } = parsed.data;

    const conditions = [];
    if (status) conditions.push(eq(purchases.status, status));
    if (liveMode !== undefined) conditions.push(eq(purchases.liveMode, liveMode));
    if (from) conditions.push(gte(purchases.createdAt, new Date(from)));
    if (to) conditions.push(lte(purchases.createdAt, new Date(to)));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const orderRows = await db.query.purchases.findMany({
      where,
      orderBy: desc(purchases.createdAt),
      // WHY: No limit on export — agents need all matching orders
    });

    log.info('Orders exported', { format, count: orderRows.length, status: status ?? 'all' });

    if (format === 'csv') {
      const csv = toCSV(orderRows);
      return new NextResponse(csv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="orders-${new Date().toISOString().slice(0, 10)}.csv"`,
        },
      });
    }

    // JSON format
    return NextResponse.json({
      success: true,
      exportedAt: new Date().toISOString(),
      count: orderRows.length,
      orders: orderRows,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    log.error('Failed to export orders', { error: message });
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
