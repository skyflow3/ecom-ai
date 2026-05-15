/**
 * Purpose: Serve funnel entry page — /funnels/turmeric/ → index.html
 * WHY: Next.js standalone doesn't serve directory indexes from public/.
 *      This route reads the HTML file and returns it.
 * Rule: file path = URL path. public/funnels/{slug}/ → /funnels/{slug}/
 */

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const ENTRY_FILES = ['index.html', 'entry.html', 'product.html'];

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
      for (const entryFile of ENTRY_FILES) {
        const filePath = join(base, entryFile);
        if (existsSync(filePath)) {
          const html = readFileSync(filePath, 'utf-8');
          return new NextResponse(html, {
            status: 200,
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
          });
        }
      }
    }

    return NextResponse.json({ error: `Funnel "${slug}" not found` }, { status: 404 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
