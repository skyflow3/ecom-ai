/**
 * Purpose: Funnels list page — server wrapper for the funnels grid.
 * Dependencies: @/components/dashboard/funnels-list-client
 * Related: src/components/dashboard/funnels-list-client.tsx
 *
 * WHY: Thin server wrapper that delegates rendering to the client component.
 *      The client component handles data fetching via TanStack Query with
 *      loading skeletons, error states, and responsive grid layout.
 */

import { FunnelsListClient } from "@/components/dashboard/funnels-list-client";

export default function FunnelsPage() {
  return <FunnelsListClient />;
}
