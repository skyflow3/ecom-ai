/**
 * Purpose: Marketing layout — simple nav for public pages (no sidebar, no auth).
 * Dependencies: next/link
 * Related: src/app/(marketing)/pricing/page.tsx
 *
 * WHY: Marketing pages (pricing, landing, etc.) are public and don't need the
 *      dashboard sidebar. This layout provides a clean header with logo + nav.
 *      No auth required. Centered content with max-w-6xl.
 */

import Link from "next/link";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-100">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-xl font-bold">
            ECOM-AI
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/pricing"
              className="text-sm text-gray-600 hover:text-black"
            >
              Pricing
            </Link>
            <Link
              href="/sign-in"
              className="text-sm text-gray-600 hover:text-black"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="rounded-lg bg-black px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}
