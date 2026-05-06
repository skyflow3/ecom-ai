/**
 * Purpose: Sign-in client component — renders Clerk SignIn widget.
 * Dependencies: @clerk/nextjs
 * Related: src/app/(auth)/sign-in/[[...sign-in]]/page.tsx
 */

"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInClient() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <SignIn appearance={{ elements: { card: "shadow-lg" } }} />
    </div>
  );
}
