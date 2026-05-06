/**
 * Purpose: Loading skeleton for /billing page.
 *          Matches the layout of the billing page to prevent layout shift.
 * Dependencies: none
 * Related: src/app/(dashboard)/billing/page.tsx
 */

export default function BillingLoading() {
  return (
    <div className="space-y-8 p-6 max-w-6xl mx-auto animate-pulse">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-48 bg-gray-200 rounded-md" />
        <div className="h-4 w-72 bg-gray-200 rounded-md" />
      </div>

      {/* Current plan banner skeleton */}
      <div className="h-20 w-full bg-gray-200 rounded-lg" />

      {/* Plan cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="border rounded-lg p-6 space-y-4"
          >
            <div className="h-5 w-20 bg-gray-200 rounded" />
            <div className="h-8 w-24 bg-gray-200 rounded" />
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} className="h-4 bg-gray-100 rounded" />
              ))}
            </div>
            <div className="h-10 w-full bg-gray-200 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}
