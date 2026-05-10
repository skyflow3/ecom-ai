/**
 * Purpose: Serve the checkout preview HTML for live testing.
 * WHY: Next.js standalone changes process.cwd(). We embed the HTML
 *      directly to avoid filesystem path issues in Docker.
 */

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // WHY: Try multiple paths — standalone server restructures the directory
    const { readFileSync, existsSync } = await import('fs');
    const { join } = await import('path');

    const candidates = [
      join(process.cwd(), 'public', 'checkout-preview.html'),
      join(process.cwd(), '.next', 'standalone', 'public', 'checkout-preview.html'),
      join(process.cwd(), '..', 'public', 'checkout-preview.html'),
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

    // WHY: Fallback — list what's in public/ for debugging
    const { readdirSync } = await import('fs');
    let debug = 'checkout-preview.html not found. ';
    for (const dir of [join(process.cwd(), 'public'), join(process.cwd())]) {
      try {
        debug += `\n${dir}: ${readdirSync(dir).join(', ')}`;
      } catch {
        debug += `\n${dir}: (not found)`;
      }
    }

    return NextResponse.json({ error: debug }, { status: 404 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
