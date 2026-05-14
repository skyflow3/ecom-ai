/**
 * Purpose: Serve funnel HTML pages by product slug — supports A/B variants
 * WHY: Each product has its own funnel directory under public/funnels/{slug}/.
 *      Any .html file in that directory can be served (entry-a, checkout-b, oto1-v2, etc.)
 *      This supports unlimited A/B testing on every funnel step.
 * URL: /f/turmeric/checkout  → public/funnels/turmeric/checkout.html
 *      /f/turmeric/entry-a  → public/funnels/turmeric/entry-a.html
 * Security: Slug = alphanumeric+hyphens, page = alphanumeric+hyphens, no directory traversal.
 */

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string; page: string }> }
) {
  const { slug, page } = await params;

  // WHY: Prevent directory traversal — only allow safe characters
  if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) {
    return NextResponse.json({ error: 'Invalid slug' }, { status: 400 });
  }
  if (!/^[a-z0-9][a-z0-9-]*$/.test(page)) {
    return NextResponse.json({ error: 'Invalid page name' }, { status: 400 });
  }

  try {
    const { readFileSync, existsSync } = await import('fs');
    const { join } = await import('path');

    const fileName = `${page}.html`;
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
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'no-cache',
          },
        });
      }
    }

    return NextResponse.json(
      { error: `Page "${page}" not found for funnel "${slug}"` },
      { status: 404 }
    );
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
