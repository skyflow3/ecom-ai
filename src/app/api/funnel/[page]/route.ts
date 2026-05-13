/**
 * Purpose: Serve funnel HTML pages from public/ directory.
 * WHY: Next.js standalone does NOT serve static files from public/ automatically.
 *      This route handler reads HTML files and serves them with proper content-type.
 * Usage: /api/funnel/index.html → serves public/index.html
 */

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const ALLOWED_PAGES = [
  'index.html',
  'product.html',
  'checkout.html',
  'oto1.html',
  'oto2.html',
  'oto3.html',
  'oto4.html',
  'oto5.html',
  'thankyou.html',
];

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ page: string }> }
) {
  const { page } = await params;

  // WHY: Only serve whitelisted pages — prevent directory traversal
  if (!ALLOWED_PAGES.includes(page)) {
    return NextResponse.json({ error: 'Page not found' }, { status: 404 });
  }

  try {
    const { readFileSync, existsSync } = await import('fs');
    const { join } = await import('path');

    const candidates = [
      join(process.cwd(), 'public', page),
      join(process.cwd(), '.next', 'standalone', 'public', page),
      join(process.cwd(), '..', 'public', page),
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

    return NextResponse.json({ error: `${page} not found in public/` }, { status: 404 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
