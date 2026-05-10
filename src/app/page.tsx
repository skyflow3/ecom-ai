/**
 * Purpose: Root page — redirects based on auth status
 * Dependencies: @clerk/nextjs/server
 * Related: src/app/(dashboard)/layout.tsx, src/app/(auth)/sign-in/page.tsx
 */

import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Home() {
  // WHY: If Clerk is not configured, skip auth entirely and go to dashboard
  const hasClerk =
    !!process.env.CLERK_SECRET_KEY &&
    !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!hasClerk) redirect("/dashboard");

  try {
    const { currentUser } = await import("@clerk/nextjs/server");
    const user = await currentUser();
    if (user) redirect("/dashboard");
    redirect("/sign-in");
  } catch {
    redirect("/dashboard");
  }
}
