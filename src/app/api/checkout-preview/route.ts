/**
 * Purpose: Serve the checkout preview HTML for live testing.
 *          Reads the static HTML from public/checkout-preview.html.
 * WHY: Next.js standalone doesn't reliably serve .html from public/.
 *      API route guarantees the HTML is served with correct headers.
 */

import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export const dynamic = 'force-static';

export async function GET() {
  try {
    const filePath = join(process.cwd(), 'public', 'checkout-preview.html');
    const html = readFileSync(filePath, 'utf-8');

    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=300',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Checkout preview not found' }, { status: 404 });
  }
}
