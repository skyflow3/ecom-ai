"use client";

/**
 * Purpose: Funnels list page — grid of funnel cards with create button.
 * Dependencies: @tanstack/react-query, lucide-react, UI components
 * Related: src/app/(dashboard)/funnels/page.tsx (server wrapper)
 *
 * WHY: Shows all funnels in a responsive grid. Each card links to the detail page.
 *      Empty state provides a clear CTA when no funnels exist yet.
 */

import Link from "next/link";
import { Plus, Target, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useFunnels } from "@/hooks/use-funnels";

// ─── Status Badge ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const variantMap: Record<
    string,
    "default" | "secondary" | "destructive" | "outline"
  > = {
    active: "default",
    draft: "secondary",
    paused: "outline",
    archived: "destructive",
  };

  return (
    <Badge variant={variantMap[status] ?? "secondary"}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

// ─── Loading Skeleton Grid ──────────────────────────────────────────────────

function FunnelsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ─── Empty State ────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 py-16">
      <Target className="h-16 w-16 text-gray-300" />
      <h3 className="mt-4 text-lg font-semibold text-gray-900">
        No funnels yet
      </h3>
      <p className="mt-1 max-w-sm text-center text-sm text-gray-500">
        Create your first funnel to start building high-converting pages with AI.
      </p>
      <Link href="/funnels/new" className="mt-6">
        <Button>
          <Plus className="h-4 w-4" />
          Create Your First Funnel
        </Button>
      </Link>
    </div>
  );
}

// ─── Funnel Card ────────────────────────────────────────────────────────────

interface FunnelCardProps {
  funnel: {
    id: string;
    name: string;
    slug: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
}

function FunnelCard({ funnel }: FunnelCardProps) {
  return (
    <Link href={`/funnels/${funnel.id}`}>
      <Card className="transition-shadow hover:shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <CardTitle className="text-base">{funnel.name}</CardTitle>
            <ExternalLink className="h-4 w-4 shrink-0 text-gray-400" />
          </div>
          <p className="text-xs text-gray-400">{funnel.slug}</p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <StatusBadge status={funnel.status} />
            <span className="text-xs text-gray-400">
              {new Date(funnel.createdAt).toLocaleDateString()}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

// ─── Main Client Component ──────────────────────────────────────────────────

export function FunnelsListClient() {
  const { data, isLoading, error } = useFunnels(1, 50);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <FunnelsGridHeader count={null} />
        <FunnelsSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <FunnelsGridHeader count={null} />
        <Card>
          <CardContent className="py-8 text-center text-sm text-red-600">
            Failed to load funnels. Please refresh the page.
          </CardContent>
        </Card>
      </div>
    );
  }

  const funnels = data?.data ?? [];
  const total = data?.pagination.total ?? 0;

  return (
    <div className="space-y-6">
      <FunnelsGridHeader count={total} />
      {funnels.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {funnels.map((funnel) => (
            <FunnelCard key={funnel.id} funnel={funnel} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Header with create button ──────────────────────────────────────────────

function FunnelsGridHeader({ count }: { count: number | null }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Funnels</h1>
        {count !== null && (
          <p className="text-sm text-gray-500">
            {count} funnel{count !== 1 ? "s" : ""} total
          </p>
        )}
      </div>
      <Link href="/funnels/new">
        <Button>
          <Plus className="h-4 w-4" />
          New Funnel
        </Button>
      </Link>
    </div>
  );
}
