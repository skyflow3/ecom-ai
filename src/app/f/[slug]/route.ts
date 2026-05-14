/**
 * Purpose: Serve funnel entry/router page for a product slug (no page specified)
 * WHY: /f/turmeric → serves the A/B router or default entry page
 *      Tries: index.html (router), then entry.html, then product.html
 * Security: Same validation as [page] route — alphanumeric + hyphens only
 */

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// WHY: Priority order for funnel entry — router first, then fallbacks
const ENTRY_PRIORITIES = ['index.html', 'entry.html', 'product.html'];

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) {
    return NextResponse.json({ error: 'Invalid slug' }, { status: 400 });
  }

  try {
    const { readFileSync, existsSync } = await import('fs');
    const { join } = await import('path');

    const baseCandidates = [
      join(process.cwd(), 'public', 'funnels', slug),
      join(process.cwd(), '.next', 'standalone', 'public', 'funnels', slug),
      join(process.cwd(), '..', 'public', 'funnels', slug),
    ];

    for (const base of baseCandidates) {
      for (const entryFile of ENTRY_PRIORITIES) {
        const filePath = join(base, entryFile);
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
    }

    return NextResponse.json(
      { error: `Funnel "${slug}" not found` },
      { status: 404 }
    );
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
