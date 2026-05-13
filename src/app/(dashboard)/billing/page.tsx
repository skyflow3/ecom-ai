/**
 * Purpose: Billing page — server component wrapper.
 * Dependencies: @clerk/nextjs/server
 * Related: src/app/(dashboard)/billing/billing-client.tsx
 *
 * WHY: Server wrapper prevents static prerendering (Clerk may not be configured
 *      at build time). Client component uses useUser() which needs ClerkProvider.
 */

import { redirect } from "next/navigation";
import BillingClient from "./billing-client";

export const dynamic = "force-dynamic";

export default async function BillingPage() {
  const hasClerk = !!process.env.CLERK_SECRET_KEY;

  if (!hasClerk) {
    return <BillingClient />;
  }

  try {
    const { currentUser } = await import("@clerk/nextjs/server");
    const user = await currentUser();
    if (!user) redirect("/sign-in");
    return <BillingClient />;
  } catch {
    return <BillingClient />;
  }
}
