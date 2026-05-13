/**
 * Purpose: Settings page — server component wrapper.
 * Dependencies: @clerk/nextjs/server
 * Related: src/app/(dashboard)/settings/settings-client.tsx
 *
 * WHY: Server wrapper prevents static prerendering (Clerk may not be configured
 *      at build time). Client component uses useUser() which needs ClerkProvider.
 */

import { redirect } from "next/navigation";
import SettingsClient from "./settings-client";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const hasClerk = !!process.env.CLERK_SECRET_KEY;

  if (!hasClerk) {
    return <SettingsClient />;
  }

  try {
    const { currentUser } = await import("@clerk/nextjs/server");
    const user = await currentUser();
    if (!user) redirect("/sign-in");
    return <SettingsClient />;
  } catch {
    return <SettingsClient />;
  }
}
