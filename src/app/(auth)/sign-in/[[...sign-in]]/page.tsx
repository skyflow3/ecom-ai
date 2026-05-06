/**
 * Purpose: Sign-in page — server component wrapper.
 * Dependencies: @clerk/nextjs/server
 * Related: src/app/(auth)/sign-in/[[...sign-in]]/sign-in-client.tsx
 *
 * WHY: Server wrapper prevents static prerendering and redirects to dashboard
 *      if auth is not configured.
 */

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import SignInClient from "./sign-in-client";

// WHY: Prevents static generation — Clerk may not be configured at build time
export const dynamic = "force-dynamic";

export default async function SignInPage() {
  const hasClerk = !!process.env.CLERK_SECRET_KEY;

  // WHY: If Clerk is not configured, skip auth and redirect to dashboard
  if (!hasClerk) redirect("/dashboard");

  // WHY: If already signed in, go to dashboard
  const user = await currentUser();
  if (user) redirect("/dashboard");

  return <SignInClient />;
}
