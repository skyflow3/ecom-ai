"use client";

/**
 * Purpose: Dashboard home page — stats cards, recent funnels, quick actions.
 * Dependencies: @clerk/nextjs, @tanstack/react-query, lucide-react, UI components
 * Related: src/app/(dashboard)/dashboard/page.tsx (server component wrapper)
 *
 * WHY: Split into server + client so the server component can pass the user name
 *      for the welcome message while the client component handles data fetching
 *      with TanStack Query (loading skeletons, error states, refetching).
 */

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import {
  Target,
  FlaskConical,
  TrendingUp,
  DollarSign,
  Plus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useFunnels } from "@/hooks/use-funnels";

// ─── Stats Cards ────────────────────────────────────────────────────────────

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  description?: string;
}

function StatCard({ icon, value, label, description }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">
          {label}
        </CardTitle>
        <div className="text-gray-400">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="mt-1 text-xs text-gray-500">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-5 rounded" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ─── Status Badge Helper ────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const variantMap: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
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

// ─── Recent Funnels Table ───────────────────────────────────────────────────

function RecentFunnelsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-24" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function RecentFunnels() {
  const { data, isLoading, error } = useFunnels(1, 5);

  if (isLoading) return <RecentFunnelsSkeleton />;
  if (error) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-sm text-red-600">
          Failed to load funnels. Please try again.
        </CardContent>
      </Card>
    );
  }

  const funnels = data?.data ?? [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Funnels</CardTitle>
        <Link href="/funnels/new">
          <Button size="sm">
            <Plus className="h-4 w-4" />
            New Funnel
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {funnels.length === 0 ? (
          <div className="py-8 text-center">
            <Target className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-2 text-sm text-gray-500">
              No funnels yet. Create your first one!
            </p>
            <Link href="/funnels/new" className="mt-4 inline-block">
              <Button>
                <Plus className="h-4 w-4" />
                Create Funnel
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {funnels.map((funnel) => (
              <Link
                key={funnel.id}
                href={`/funnels/${funnel.id}`}
                className="flex items-center justify-between rounded-lg border border-gray-100 p-3 transition-colors hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <Target className="h-4 w-4 text-gray-400" />
                  <span className="font-medium text-gray-900">
                    {funnel.name}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-400">
                    {new Date(funnel.createdAt).toLocaleDateString()}
                  </span>
                  <StatusBadge status={funnel.status} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Main Client Component ──────────────────────────────────────────────────

interface DashboardClientProps {
  userName: string | null;
}

export function DashboardClient({ userName }: DashboardClientProps) {
  const { data: funnelsData, isLoading: funnelsLoading } = useFunnels(1, 1);
  const firstName = userName?.split(" ")[0] ?? "there";

  const totalFunnels = funnelsData?.pagination.total ?? 0;

  return (
    <div className="space-y-6">
      {/* Welcome message */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {firstName}
          </h1>
          <p className="text-sm text-gray-500">
            Here&apos;s what&apos;s happening with your funnels.
          </p>
        </div>
        <Link href="/funnels/new">
          <Button>
            <Plus className="h-4 w-4" />
            New Funnel
          </Button>
        </Link>
      </div>

      {/* Stats cards */}
      {funnelsLoading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<Target className="h-5 w-5" />}
            value={totalFunnels}
            label="Total Funnels"
          />
          <StatCard
            icon={<FlaskConical className="h-5 w-5" />}
            value={0}
            label="Active Tests"
            description="A/B tests running now"
          />
          <StatCard
            icon={<TrendingUp className="h-5 w-5" />}
            value="--"
            label="Conversion Rate"
            description="Across all funnels"
          />
          <StatCard
            icon={<DollarSign className="h-5 w-5" />}
            value="--"
            label="Revenue"
            description="Last 30 days"
          />
        </div>
      )}

      {/* Recent funnels */}
      <RecentFunnels />
    </div>
  );
}
