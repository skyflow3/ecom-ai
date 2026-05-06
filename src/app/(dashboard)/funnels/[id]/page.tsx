/**
 * Purpose: Funnel detail page — server component wrapper that extracts the ID.
 * Dependencies: none
 * Related: src/components/dashboard/funnel-detail-client.tsx
 *
 * WHY: Next.js App Router passes params as a Promise. This server component
 *      unwraps the ID and passes it to the client component for data fetching.
 */

import { FunnelDetailClient } from "@/components/dashboard/funnel-detail-client";

interface FunnelDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function FunnelDetailPage({ params }: FunnelDetailPageProps) {
  const { id } = await params;
  return <FunnelDetailClient funnelId={id} />;
}
