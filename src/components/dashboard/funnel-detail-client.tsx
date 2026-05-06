"use client";

/**
 * Purpose: Funnel detail page — steps timeline, actions, editable name.
 * Dependencies: @tanstack/react-query, lucide-react, UI components
 * Related: src/app/(dashboard)/funnels/[id]/page.tsx (server wrapper)
 *
 * WHY: Shows the full funnel with its 5 steps in a vertical timeline.
 *      Each step has generate + preview actions. The funnel name is inline-editable.
 *      Deploy/Delete/Pause actions in the action bar at top.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Play,
  Trash2,
  Edit3,
  Check,
  X,
  FileText,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Heart,
  Loader2,
  Eye,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useFunnel, useUpdateFunnel, useDeleteFunnel } from "@/hooks/use-funnels";
import { useGeneratePage } from "@/hooks/use-generate";

// ─── Step Type Config ───────────────────────────────────────────────────────
// WHY: Maps step types to icons and colors for the timeline display.

const STEP_CONFIG: Record<
  string,
  { icon: React.ElementType; color: string; bgColor: string }
> = {
  "product-page": {
    icon: FileText,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  checkout: {
    icon: CreditCard,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  upsell: {
    icon: TrendingUp,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  downsell: {
    icon: TrendingDown,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
  "thank-you": {
    icon: Heart,
    color: "text-pink-600",
    bgColor: "bg-pink-100",
  },
};

// ─── Status Badge ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const variantMap: Record<
    string,
    "default" | "secondary" | "destructive" | "outline"
  > = {
    active: "default",
    draft: "secondary",
    paused: "outline",
  };

  return (
    <Badge variant={variantMap[status] ?? "secondary"}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

// ─── Inline Editable Name ───────────────────────────────────────────────────

function EditableName({
  name,
  onSave,
  isSaving,
}: {
  name: string;
  onSave: (newName: string) => void;
  isSaving: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(name);

  if (editing) {
    return (
      <div className="flex items-center gap-2">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="max-w-sm text-xl font-bold"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter" && value.trim()) {
              onSave(value.trim());
              setEditing(false);
            }
            if (e.key === "Escape") {
              setValue(name);
              setEditing(false);
            }
          }}
        />
        <Button
          size="icon"
          variant="ghost"
          onClick={() => {
            onSave(value.trim());
            setEditing(false);
          }}
          disabled={isSaving || !value.trim()}
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Check className="h-4 w-4" />
          )}
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => {
            setValue(name);
            setEditing(false);
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setEditing(true)}
      className="group flex items-center gap-2"
    >
      <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
      <Edit3 className="h-4 w-4 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100" />
    </button>
  );
}

// ─── Step Timeline Item ─────────────────────────────────────────────────────

function StepTimelineItem({
  step,
  funnelId,
  isLast,
}: {
  step: {
    id: string;
    type: string;
    name: string;
    sortOrder: number;
    variants: Array<{ id: string; name: string; status: string }>;
  };
  funnelId: string;
  isLast: boolean;
}) {
  const config = STEP_CONFIG[step.type] ?? {
    icon: FileText,
    color: "text-gray-600",
    bgColor: "bg-gray-100",
  };
  const Icon = config.icon;
  const generateMutation = useGeneratePage(funnelId);

  return (
    <div className="flex gap-4">
      {/* Timeline line + circle */}
      <div className="flex flex-col items-center">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${config.bgColor}`}
        >
          <Icon className={`h-5 w-5 ${config.color}`} />
        </div>
        {!isLast && <div className="w-px flex-1 bg-gray-200" />}
      </div>

      {/* Step content */}
      <div className="flex-1 pb-8">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="text-base">{step.name}</CardTitle>
                <Badge variant="outline" className="text-xs">
                  {step.type}
                </Badge>
              </div>
              <span className="text-xs text-gray-400">
                {step.variants.length} variant
                {step.variants.length !== 1 ? "s" : ""}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  generateMutation.mutate({ stepId: step.id })
                }
                disabled={generateMutation.isPending}
              >
                {generateMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                Generate Page
              </Button>
              <Button size="sm" variant="ghost">
                <Eye className="h-4 w-4" />
                Preview
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ─── Loading Skeleton ───────────────────────────────────────────────────────

function FunnelDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-64" />
      <div className="flex gap-2">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
      <div className="space-y-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-4">
            <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Client Component ──────────────────────────────────────────────────

interface FunnelDetailClientProps {
  funnelId: string;
}

export function FunnelDetailClient({ funnelId }: FunnelDetailClientProps) {
  const router = useRouter();
  const { data, isLoading, error } = useFunnel(funnelId);
  const updateMutation = useUpdateFunnel(funnelId);
  const deleteMutation = useDeleteFunnel(funnelId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <LinkHeader />
        <FunnelDetailSkeleton />
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="space-y-6">
        <LinkHeader />
        <Card>
          <CardContent className="py-8 text-center text-sm text-red-600">
            Failed to load funnel. It may not exist or has been deleted.
          </CardContent>
        </Card>
      </div>
    );
  }

  const funnel = data.data;
  const steps = funnel.steps ?? [];

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this funnel?")) {
      await deleteMutation.mutateAsync();
      router.push("/funnels");
    }
  };

  return (
    <div className="space-y-6">
      <LinkHeader />

      {/* Header row: name + status + actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <EditableName
            name={funnel.name}
            onSave={(newName) => updateMutation.mutate({ name: newName })}
            isSaving={updateMutation.isPending}
          />
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>/{funnel.slug}</span>
            <StatusBadge status={funnel.status} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline">
            <Play className="h-4 w-4" />
            Deploy
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            Delete
          </Button>
        </div>
      </div>

      {/* Steps timeline */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Funnel Steps
        </h2>
        <div className="space-y-0">
          {steps.map((step, idx) => (
            <StepTimelineItem
              key={step.id}
              step={step}
              funnelId={funnelId}
              isLast={idx === steps.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Back link header ───────────────────────────────────────────────────────

function LinkHeader() {
  return (
    <Link
      href="/funnels"
      className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
    >
      <ArrowLeft className="h-4 w-4" />
      Back to Funnels
    </Link>
  );
}
