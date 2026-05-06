/**
 * Purpose: Billing page — server component wrapper.
 * Dependencies: @clerk/nextjs/server
 * Related: src/app/(dashboard)/billing/billing-client.tsx
 *
 * WHY: Server wrapper prevents static prerendering (Clerk may not be configured
 *      at build time). Client component uses useUser() which needs ClerkProvider.
 */

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import BillingClient from "./billing-client";

// WHY: Prevents static generation — Clerk may not be configured at build time
export const dynamic = "force-dynamic";

export default async function BillingPage() {
  const hasClerk = !!process.env.CLERK_SECRET_KEY;
  const user = hasClerk ? await currentUser() : null;

  // WHY: Billing requires auth — redirect if not signed in
  if (hasClerk && !user) {
    redirect("/sign-in");
  }

  return <BillingClient />;
}
