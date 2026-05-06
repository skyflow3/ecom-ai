/**
 * Purpose: Root page — redirects based on auth status
 * Dependencies: @clerk/nextjs/server
 * Related: src/app/(dashboard)/layout.tsx, src/app/(auth)/sign-in/page.tsx
 */

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

// WHY: Prevents static generation — Clerk may not be configured at build time
export const dynamic = "force-dynamic";

export default async function Home() {
  // WHY: If Clerk is not configured, skip auth check and go to dashboard
  const hasClerk = !!process.env.CLERK_SECRET_KEY;
  if (!hasClerk) redirect("/dashboard");

  const user = await currentUser();
  if (user) redirect("/dashboard");
  redirect("/sign-in");
}
