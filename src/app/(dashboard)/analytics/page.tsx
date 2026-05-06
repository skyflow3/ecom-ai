/**
 * Purpose: Analytics placeholder page — coming soon state with chart placeholders.
 * Dependencies: lucide-react, @/components/ui/card
 * Related: src/app/(dashboard)/layout.tsx
 *
 * WHY: Analytics is listed in the sidebar nav but the full analytics module
 *      is not built yet. This page provides a clear "coming soon" state so
 *      users aren't confused by a 404 when clicking the nav link.
 *      Metric cards show "--" placeholders matching the dashboard pattern.
 */

import {
  BarChart3,
  TrendingUp,
  Eye,
  MousePointerClick,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ─── Metric Placeholder Card ──────────────────────────────────────────────────

function MetricPlaceholder({
  icon,
  label,
  description,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">
          {label}
        </CardTitle>
        <div className="text-gray-400">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-300">--</div>
        <p className="mt-1 text-xs text-gray-400">{description}</p>
      </CardContent>
    </Card>
  );
}

// ─── Chart Placeholder Card ───────────────────────────────────────────────────

function ChartPlaceholder({
  title,
  subtitle,
  icon,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50">
          <div className="text-center">
            {icon}
            <p className="mt-2 text-sm font-medium text-gray-500">
              Chart coming soon
            </p>
            <p className="text-xs text-gray-400">{subtitle}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track performance across all your funnels.
        </p>
      </div>

      {/* Metric cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricPlaceholder
          icon={<Eye className="h-5 w-5" />}
          label="Page Views"
          description="Across all funnels"
        />
        <MetricPlaceholder
          icon={<MousePointerClick className="h-5 w-5" />}
          label="Click-Through Rate"
          description="Average across pages"
        />
        <MetricPlaceholder
          icon={<TrendingUp className="h-5 w-5" />}
          label="Conversions"
          description="Last 30 days"
        />
        <MetricPlaceholder
          icon={<BarChart3 className="h-5 w-5" />}
          label="Revenue"
          description="Last 30 days"
        />
      </div>

      {/* Chart placeholders */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartPlaceholder
          title="Conversion Funnel"
          subtitle="Conversion data by funnel step"
          icon={<BarChart3 className="mx-auto h-10 w-10 text-gray-300" />}
        />
        <ChartPlaceholder
          title="Revenue Over Time"
          subtitle="Daily/weekly revenue trends"
          icon={<TrendingUp className="mx-auto h-10 w-10 text-gray-300" />}
        />
      </div>

      {/* Info banner */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
        Analytics is coming soon. Connect your tracking pixels and we&apos;ll show
        real-time performance data for all your funnels.
      </div>
    </div>
  );
}
