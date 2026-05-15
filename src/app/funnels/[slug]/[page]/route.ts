/**
 * Purpose: Serve funnel page — /funnels/turmeric/checkout.html → checkout.html
 * WHY: Next.js standalone serves static files, but this handler ensures
 *      both /funnels/turmeric/checkout and /funnels/turmeric/checkout.html work.
 * Rule: file path = URL path. public/funnels/{slug}/{page}.html → /funnels/{slug}/{page}.html
 */

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string; page: string }> }
) {
  const { slug, page } = await params;

  if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) {
    return NextResponse.json({ error: 'Invalid slug' }, { status: 400 });
  }

  // Strip .html extension if present (page comes without it from Next.js)
  const pageName = page.replace(/\.html$/, '');
  if (!/^[a-z0-9][a-z0-9-]*$/.test(pageName)) {
    return NextResponse.json({ error: 'Invalid page name' }, { status: 400 });
  }

  try {
    const { readFileSync, existsSync } = await import('fs');
    const { join } = await import('path');

    const fileName = `${pageName}.html`;
    const candidates = [
      join(process.cwd(), 'public', 'funnels', slug, fileName),
      join(process.cwd(), '.next', 'standalone', 'public', 'funnels', slug, fileName),
      join(process.cwd(), '..', 'public', 'funnels', slug, fileName),
    ];

    for (const filePath of candidates) {
      if (existsSync(filePath)) {
        const html = readFileSync(filePath, 'utf-8');
        return new NextResponse(html, {
          status: 200,
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        });
      }
    }

    return NextResponse.json(
      { error: `Page "${pageName}" not found for funnel "${slug}"` },
      { status: 404 }
    );
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
