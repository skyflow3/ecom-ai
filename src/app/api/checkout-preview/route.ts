/**
 * Purpose: Serve the checkout preview HTML for live testing.
 * WHY: API route guarantees the HTML is served with correct headers.
 */

import { NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

export async function GET() {
  try {
    const filePath = join(process.cwd(), 'public', 'checkout-preview.html');

    if (!existsSync(filePath)) {
      return NextResponse.json({ error: 'checkout-preview.html not found in public/' }, { status: 404 });
    }

    const html = readFileSync(filePath, 'utf-8');

    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
