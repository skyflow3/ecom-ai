/**
 * Purpose: Auth pages layout — centered children, no sidebar/header
 * Dependencies: none
 * Related: sign-in/page.tsx, sign-up/page.tsx
 */

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      {children}
    </div>
  );
}
