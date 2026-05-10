/**
 * Purpose: Root layout — wraps the entire app with ClerkProvider + QueryProvider
 * Dependencies: @clerk/nextjs, @tanstack/react-query, next/font/google
 * Related: src/middleware.ts, src/lib/auth.ts, src/lib/query-provider.tsx
 *
 * WHY: ClerkProvider is conditional — skipped if NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
 *      is empty. This allows the app to build and start without Clerk configured,
 *      enabling gradual deployment (add auth later).
 */

import { Inter } from "next/font/google";
import type { Metadata } from "next";
import { QueryProvider } from "@/lib/query-provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ECOM-AI — Funnel Builder",
  description: "E-commerce funnel builder with AI-powered testing",
};

// WHY: Clerk is optional — dynamic import prevents crash when keys are missing
const hasClerkKey = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const body = (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );

  if (!hasClerkKey) {
    return body;
  }

  try {
    const { ClerkProvider } = await import("@clerk/nextjs");
    return <ClerkProvider>{body}</ClerkProvider>;
  } catch {
    // WHY: If Clerk fails to initialize (invalid key, API down), render without it
    return body;
  }
}
