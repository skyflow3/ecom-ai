/**
 * Purpose: Redirect /f/{slug} → /funnels/{slug}/ (backward compat)
 * WHY: Single URL system = /funnels/{slug}/. Old /f/ links redirect here.
 *      AI agents only need to know: file path = URL path.
 */

import { NextResponse } from 'next/server';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  return NextResponse.redirect(new URL(`/funnels/${slug}/`, _request.url), 301);
}
