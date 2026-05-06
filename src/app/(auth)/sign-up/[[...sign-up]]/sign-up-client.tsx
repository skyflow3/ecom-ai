/**
 * Purpose: Sign-up client component — renders Clerk SignUp widget.
 * Dependencies: @clerk/nextjs
 * Related: src/app/(auth)/sign-up/[[...sign-up]]/page.tsx
 */

"use client";

import { SignUp } from "@clerk/nextjs";

export default function SignUpClient() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <SignUp appearance={{ elements: { card: "shadow-lg" } }} />
    </div>
  );
}
