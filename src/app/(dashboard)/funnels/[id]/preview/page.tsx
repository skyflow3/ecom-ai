/**
 * Purpose: Page preview route — renders the HTML of a generated page variant.
 *          Placeholder implementation; will be wired to DB/API later.
 * Dependencies: next/link
 * Related: src/app/(dashboard)/funnels/[id]/page.tsx, src/components/dashboard/funnel-detail-client.tsx
 *
 * WHY: Users need to preview generated page variants before publishing.
 *      This route is accessed from the funnel detail page. The variant ID
 *      is passed via the `?variant=` query param. For now, it shows a
 *      placeholder. Full implementation will fetch variant HTML from the DB
 *      and render it in a sandboxed iframe.
 */

import Link from "next/link";

interface PreviewPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ variant?: string }>;
}

export default async function PreviewPage({
  params,
  searchParams,
}: PreviewPageProps) {
  const { id } = await params;
  const { variant } = await searchParams;

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* ─── Top bar ────────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
        <div className="flex items-center gap-4">
          <Link
            href={`/funnels/${id}`}
            className="text-sm text-gray-600 hover:text-black transition-colors"
          >
            &larr; Back to Funnel
          </Link>
          <span className="text-sm font-medium text-gray-900">
            Preview
          </span>
        </div>

        {variant && (
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
            Variant: {variant}
          </span>
        )}
      </header>

      {/* ─── Preview area ───────────────────────────────────────────────── */}
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
            <svg
              className="h-8 w-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </div>

          <h1 className="mb-2 text-xl font-semibold text-gray-900">
            Preview Coming Soon
          </h1>
          <p className="mb-1 text-sm text-gray-500">
            Page variant preview is under development.
          </p>

          {variant && (
            <p className="text-sm text-gray-400">
              Requested variant:{" "}
              <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-mono">
                {variant}
              </code>
            </p>
          )}

          {!variant && (
            <p className="text-sm text-gray-400">
              Pass a variant ID via{" "}
              <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-mono">
                ?variant=xxx
              </code>
            </p>
          )}

          <Link
            href={`/funnels/${id}`}
            className="mt-6 inline-flex items-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
          >
            Return to Funnel
          </Link>
        </div>
      </div>
    </div>
  );
}
