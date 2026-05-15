/**
 * Purpose: Redirect /f/{slug}/{page} → /funnels/{slug}/{page}.html (backward compat)
 * WHY: Single URL system = /funnels/{slug}/{page}.html. Old /f/ links redirect here.
 */

import { NextResponse } from 'next/server';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string; page: string }> }
) {
  const { slug, page } = await params;
  return NextResponse.redirect(new URL(`/funnels/${slug}/${page}.html`, _request.url), 301);
}
