/**
 * Purpose: GET /api/pages/[variantId] — Serve a generated page as full HTML.
 *          Public endpoint (no auth required). Used to view deployed pages.
 * Dependencies: db, schema, renderers
 * Related: src/middleware.ts (public route), src/services/deploy-pipeline.ts
 *
 * WHY: AI agents and external systems need a URL to view generated pages.
 *      This endpoint renders the BlockTree from DB and returns full HTML.
 *      No authentication — pages are public by design (funnel traffic).
 */

import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { pageVariants } from '@/db/schema/core';
import { renderFullPage } from '@/renderers';
import '@/renderers'; // side-effect: registers all block renderers
import type { BlockTree } from '@/design-system/blocks';

interface RouteContext {
  params: Promise<{ variantId: string }>;
}

export async function GET(
  _request: NextRequest,
  context: RouteContext,
) {
  try {
    const { variantId } = await context.params;

    // Fetch variant from DB
    const [variant] = await db
      .select()
      .from(pageVariants)
      .where(eq(pageVariants.id, variantId))
      .limit(1);

    if (!variant) {
      return new NextResponse('Page not found', { status: 404 });
    }

    // Render BlockTree to HTML
    const blockTree = variant.page as unknown as BlockTree;

    if (!blockTree?.blocks || blockTree.blocks.length === 0) {
      return new NextResponse('Page has no content yet', { status: 204 });
    }

    const html = renderFullPage(blockTree, blockTree.palette);

    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        // WHY: Cache for 60s — pages don't change frequently but agents
        //      may hit this URL repeatedly for verification.
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
