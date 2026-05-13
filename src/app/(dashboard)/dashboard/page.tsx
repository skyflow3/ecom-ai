/**
 * Purpose: Dashboard home page — server component wrapper.
 * Dependencies: @clerk/nextjs/server
 * Related: src/components/dashboard/dashboard-client.tsx
 *
 * WHY: Server component fetches the user name on the server (no client flash),
 *      then passes it to the client component for interactive data fetching.
 */

import { redirect } from "next/navigation";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

// WHY: Prevents static generation — Clerk may not be configured at build time
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const hasClerk = !!process.env.CLERK_SECRET_KEY;

  if (!hasClerk) {
    return <DashboardClient userName="User" />;
  }

  try {
    const { currentUser } = await import("@clerk/nextjs/server");
    const user = await currentUser();

    if (!user) {
      redirect("/sign-in");
    }

    const name = [user.firstName, user.lastName].filter(Boolean).join(" ") || "User";
    return <DashboardClient userName={name} />;
  } catch {
    return <DashboardClient userName="User" />;
  }
}
