/**
 * Purpose: API route that serves a generated page variant as raw HTML.
 *          URL: /api/preview/{variantId}
 * Dependencies: db, schema, renderers
 * Related: src/services/deploy-pipeline.ts
 *
 * WHY: Quick way to view AI-generated pages without R2/CDN.
 *      Returns full HTML document with proper Content-Type header.
 *      Can be opened directly in browser or embedded in iframe.
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { pageVariants } from "@/db/schema";
import { eq } from "drizzle-orm";
import { renderFullPage } from "@/renderers";
import type { BlockTree } from "@/design-system/blocks";
import "@/renderers";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(
  _request: NextRequest,
  context: RouteContext,
) {
  const { id: variantId } = await context.params;

  const [variant] = await db
    .select()
    .from(pageVariants)
    .where(eq(pageVariants.id, variantId))
    .limit(1);

  if (!variant) {
    return new NextResponse("Variant not found", { status: 404 });
  }

  const tree = variant.page as BlockTree;
  const html = renderFullPage(tree, tree.palette);

  return new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });
}
