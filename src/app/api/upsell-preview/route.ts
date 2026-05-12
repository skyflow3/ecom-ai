/**
 * Purpose: Serve the upsell preview HTML for live testing.
 * WHY: Same pattern as checkout-preview — reads from public/ folder.
 */

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { readFileSync, existsSync } = await import('fs');
    const { join } = await import('path');

    const candidates = [
      join(process.cwd(), 'public', 'upsell-preview.html'),
      join(process.cwd(), '.next', 'standalone', 'public', 'upsell-preview.html'),
      join(process.cwd(), '..', 'public', 'upsell-preview.html'),
    ];

    for (const filePath of candidates) {
      if (existsSync(filePath)) {
        const html = readFileSync(filePath, 'utf-8');
        return new NextResponse(html, {
          status: 200,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'no-cache',
          },
        });
      }
    }

    return NextResponse.json({ error: 'upsell-preview.html not found in public/' }, { status: 404 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
