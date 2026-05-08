/**
 * Purpose: Page preview route — renders generated page variant HTML in a sandboxed iframe.
 *          Fetches variant from DB by ID or falls back to the step's active variant.
 *          If no variant ID given, finds the first step with a generated page.
 * Dependencies: db, schema, renderers
 * Related: src/app/(dashboard)/funnels/[id]/page.tsx, src/renderers/index.ts
 *
 * WHY: Users need to see what the AI generated before deploying. This route
 *      renders the BlockTree into HTML and displays it in a mobile-frame iframe.
 */

import Link from "next/link";
import { eq, asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { funnels, funnelSteps, pageVariants } from "@/db/schema/core";
import { renderFullPage } from "@/renderers";
import "@/renderers"; // side-effect: registers all block renderers
import type { BlockTree } from "@/design-system/blocks";

interface PreviewPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ variant?: string; step?: string }>;
}

export default async function PreviewPage({
  params,
  searchParams,
}: PreviewPageProps) {
  const { id: funnelId } = await params;
  const { variant: variantId, step: stepId } = await searchParams;

  // ── Resolve which variant to show ──────────────────────────────────────────
  let html = "";
  let variantName = "";
  let stepName = "";
  let error = "";

  try {
    // Verify funnel exists
    const [funnel] = await db
      .select({ id: funnels.id, name: funnels.name })
      .from(funnels)
      .where(eq(funnels.id, funnelId))
      .limit(1);

    if (!funnel) {
      error = "Funnel not found";
    } else {
      let resolvedVariantId = variantId;

      // If no variant ID specified, find the first step's active variant
      if (!resolvedVariantId) {
        const steps = await db
          .select({ id: funnelSteps.id, name: funnelSteps.name, activeVariantId: funnelSteps.activeVariantId })
          .from(funnelSteps)
          .where(eq(funnelSteps.funnelId, funnelId))
          .orderBy(asc(funnelSteps.sortOrder));

        if (stepId) {
          const targetStep = steps.find(s => s.id === stepId);
          if (targetStep?.activeVariantId) {
            resolvedVariantId = targetStep.activeVariantId;
          }
        } else {
          // Pick first step that has an active variant
          const stepWithVariant = steps.find(s => s.activeVariantId);
          if (stepWithVariant?.activeVariantId) {
            resolvedVariantId = stepWithVariant.activeVariantId;
            stepName = stepWithVariant.name;
          }
        }
      }

      if (!resolvedVariantId) {
        error = "No generated page found. Generate a page first.";
      } else {
        // Fetch the variant
        const [variant] = await db
          .select()
          .from(pageVariants)
          .where(eq(pageVariants.id, resolvedVariantId))
          .limit(1);

        if (!variant) {
          error = "Variant not found";
        } else {
          variantName = variant.name;

          // Get step name if not already set
          if (!stepName) {
            const [step] = await db
              .select({ name: funnelSteps.name })
              .from(funnelSteps)
              .where(eq(funnelSteps.id, variant.stepId))
              .limit(1);
            stepName = step?.name ?? "Unknown Step";
          }

          // Render BlockTree to HTML
          const blockTree = variant.page as unknown as BlockTree;
          if (blockTree && blockTree.blocks && blockTree.blocks.length > 0) {
            try {
              html = renderFullPage(blockTree, blockTree.palette);
            } catch (renderErr) {
              error = `Render error: ${renderErr instanceof Error ? renderErr.message : String(renderErr)}`;
            }
          } else {
            error = "This variant has no page content yet.";
          }
        }
      }
    }
  } catch (err) {
    error = `Error: ${err instanceof Error ? err.message : String(err)}`;
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex h-screen flex-col bg-gray-100">
      {/* ─── Top bar ──────────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-2.5 shadow-sm">
        <div className="flex items-center gap-4">
          <Link
            href={`/funnels/${funnelId}`}
            className="text-sm text-gray-500 hover:text-black transition-colors"
          >
            &larr; Back
          </Link>
          <span className="text-sm font-medium text-gray-900">Preview</span>
          {stepName && (
            <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
              {stepName}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {variantName && (
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
              {variantName}
            </span>
          )}
          <Link
            href={`/funnels/${funnelId}`}
            className="rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-800 transition-colors"
          >
            Return to Funnel
          </Link>
        </div>
      </header>

      {/* ─── Preview area ─────────────────────────────────────────────────── */}
      <div className="flex flex-1 items-center justify-center p-4">
        {error ? (
          <div className="max-w-md text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-sm text-gray-600">{error}</p>
          </div>
        ) : (
          /* WHY: Mobile-first iframe (375x812 = iPhone viewport). 90% of funnel
             traffic is mobile. Desktop preview available via toggle later. */
          <div className="relative">
            {/* Phone frame */}
            <div className="overflow-hidden rounded-[2.5rem] border-[8px] border-gray-900 bg-white shadow-2xl"
              style={{ width: 391, height: 828 }}
            >
              <iframe
                srcDoc={html}
                className="h-full w-full border-0"
                sandbox="allow-scripts"
                title="Page Preview"
                style={{ width: 375, height: 812 }}
              />
            </div>
            {/* Notch */}
            <div className="absolute left-1/2 top-0 h-6 w-28 -translate-x-1/2 rounded-b-2xl bg-gray-900" />
          </div>
        )}
      </div>
    </div>
  );
}
