/**
 * Purpose: Render-only service — loads a variant from DB, validates, renders HTML.
 *          No deployment, no storage upload. Useful for preview and debugging.
 * Dependencies: lib/db.ts, validation/pipeline.ts, renderers/index.ts, drizzle-orm
 * Related: src/services/deploy-pipeline.ts (full deploy), src/app/api/pages/route.ts
 *
 * WHY: Preview needs to be fast and side-effect-free. Deploying to storage on every
 *      preview would be wasteful and slow. This service renders without touching storage.
 */

import { eq } from 'drizzle-orm';
import { db } from '../lib/db';
import { pageVariants } from '../db/schema';
import { validateBlockTree } from '../validation/pipeline';
import type { PipelineResult } from '../validation/pipeline';
import { renderFullPage } from '../renderers';
import type { BlockTree } from '../design-system/blocks';
import '../renderers'; // side-effect: registers all block renderers

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface RenderResult {
  html: string;
  validation: PipelineResult;
}

// ─── Main Render Function ──────────────────────────────────────────────────────

/**
 * Render a page variant to HTML without deploying.
 *
 * Flow:
 * 1. Load variant from DB (page jsonb = BlockTree)
 * 2. Validate BlockTree through the 8-pass validation pipeline
 * 3. Render HTML using the block renderer registry
 * 4. Return HTML + validation result
 *
 * @param variantId - UUID of the page_variant to render
 * @throws Error if variant not found, validation fails, or render fails
 */
export async function renderVariant(variantId: string): Promise<RenderResult> {
  // 1. Load variant from DB
  const rows = await db
    .select()
    .from(pageVariants)
    .where(eq(pageVariants.id, variantId))
    .limit(1);

  if (rows.length === 0) {
    throw new Error(`Variant not found: ${variantId}`);
  }

  const variant = rows[0];
  const blockTreeJson = variant.page;

  // 2. Validate BlockTree
  const validation = await validateBlockTree(blockTreeJson, { skipMobileLayout: true });

  // 3. Render HTML — even if validation has warnings, still render for preview
  //    Only hard errors (severity 'error') would block, but we still return the HTML
  //    so the caller can decide what to show.
  const tree = blockTreeJson as BlockTree;
  const html = renderFullPage(tree, tree.palette);

  return { html, validation };
}
