/**
 * Purpose: TanStack Query provider — wraps the app
 * Dependencies: @tanstack/react-query
 * Related: src/app/layout.tsx, all pages using useQuery/useMutation
 *
 * WHY: QueryClient must be created once and shared across the app.
 *      Using useState ensures it's not recreated on every render in dev mode.
 */

"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
