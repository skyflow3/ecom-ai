/**
 * Purpose: Dashboard home page — server component wrapper.
 * Dependencies: @clerk/nextjs/server
 * Related: src/components/dashboard/dashboard-client.tsx
 *
 * WHY: Server component fetches the user name on the server (no client flash),
 *      then passes it to the client component for interactive data fetching.
 */

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const name =
    [user.firstName, user.lastName].filter(Boolean).join(" ") || null;

  return <DashboardClient userName={name} />;
}
