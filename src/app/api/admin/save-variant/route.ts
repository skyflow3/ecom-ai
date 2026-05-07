/**
 * Purpose: Admin endpoint to save a pre-built BlockTree as a page variant.
 *          Used by scripts to insert champion copy pages.
 * Dependencies: db, schema
 * Related: scripts/save-champion-blocktree.json
 *
 * WHY: DB is not accessible from outside Docker. This endpoint lets us
 *      save pre-built BlockTrees from local scripts via HTTP.
 *      DELETE after use — not for production.
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { pageVariants, funnelSteps } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

const schema = z.object({
  stepId: z.string().uuid(),
  name: z.string().min(1).max(200),
  blockTree: z.record(z.unknown()),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsed.error.issues },
      { status: 400 },
    );
  }

  const { stepId, name, blockTree } = parsed.data;

  const [variant] = await db
    .insert(pageVariants)
    .values({
      stepId,
      name,
      status: "draft",
      trafficWeight: 100,
      isControl: false,
      page: blockTree as Record<string, unknown>,
    })
    .returning();

  // Update step to point to this variant
  await db
    .update(funnelSteps)
    .set({ activeVariantId: variant.id })
    .where(eq(funnelSteps.id, stepId));

  return NextResponse.json({
    success: true,
    variantId: variant.id,
    previewUrl: `/api/preview/${variant.id}`,
  });
}
