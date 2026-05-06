"use client";

/**
 * Purpose: New funnel creation page — form with product info, niche, marketing angle.
 * Dependencies: @tanstack/react-query, lucide-react, UI components
 * Related: src/hooks/use-funnels.ts (useCreateFunnel), src/app/api/funnels/route.ts
 *
 * WHY: Creates a funnel via POST to /api/funnels. The API auto-generates the
 *      5 standard steps. On success, redirects to the new funnel's detail page.
 *      Slug is auto-generated from the name for UX convenience.
 */

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateFunnel } from "@/hooks/use-funnels";

// ─── Niche Options ──────────────────────────────────────────────────────────

const NICHES = [
  { value: "health", label: "Health" },
  { value: "beauty", label: "Beauty & Skincare" },
  { value: "supplement", label: "Supplements" },
  { value: "pet", label: "Pet Care" },
  { value: "fitness", label: "Fitness" },
  { value: "finance", label: "Finance" },
] as const;

// ─── Slug Generation ────────────────────────────────────────────────────────
// WHY: Auto-generate URL-safe slugs from the funnel name to reduce friction.

function nameToSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// ─── Form State ─────────────────────────────────────────────────────────────

interface FormData {
  name: string;
  slug: string;
  niche: string;
  description: string;
  price: string;
  marketingAngle: string;
}

const INITIAL_FORM: FormData = {
  name: "",
  slug: "",
  niche: "",
  description: "",
  price: "",
  marketingAngle: "",
};

// ─── Page Component ─────────────────────────────────────────────────────────

export default function NewFunnelPage() {
  const router = useRouter();
  const createMutation = useCreateFunnel();
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [slugEdited, setSlugEdited] = useState(false);

  // Auto-generate slug from name unless user manually edited it
  const computedSlug = useMemo(() => {
    if (slugEdited) return form.slug;
    return nameToSlug(form.name);
  }, [form.name, form.slug, slugEdited]);

  const canSubmit =
    form.name.trim().length > 0 &&
    computedSlug.length > 0 &&
    !createMutation.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await createMutation.mutateAsync({
        name: form.name.trim(),
        slug: computedSlug,
      });

      // API returns { success: true, data: { id, ... } }
      const funnelId = (result as { data: { id: string } }).data?.id;
      if (funnelId) {
        router.push(`/funnels/${funnelId}`);
      } else {
        router.push("/funnels");
      }
    } catch {
      // Error is handled by mutation state — displayed below
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Back link */}
      <Link
        href="/funnels"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Funnels
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create New Funnel</h1>
        <p className="mt-1 text-sm text-gray-500">
          Set up your funnel. We&apos;ll auto-generate the 5 standard steps.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-5 w-5 text-blue-500" />
              Product Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Funnel name */}
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Funnel Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="name"
                placeholder="e.g. Gundry MD Energy Enhancer"
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>

            {/* Slug */}
            <div>
              <label
                htmlFor="slug"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                URL Slug <span className="text-red-500">*</span>
              </label>
              <Input
                id="slug"
                placeholder="auto-generated-from-name"
                value={computedSlug}
                onChange={(e) => {
                  setSlugEdited(true);
                  setForm((prev) => ({ ...prev, slug: e.target.value }));
                }}
              />
              <p className="mt-1 text-xs text-gray-400">
                Lowercase, alphanumeric, dashes only. Used in URLs.
              </p>
            </div>

            {/* Niche */}
            <div>
              <label
                htmlFor="niche"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Niche
              </label>
              <select
                id="niche"
                value={form.niche}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, niche: e.target.value }))
                }
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <option value="">Select a niche...</option>
                {NICHES.map((n) => (
                  <option key={n.value} value={n.value}>
                    {n.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Product Description
              </label>
              <textarea
                id="description"
                rows={3}
                placeholder="Describe the product — benefits, target audience, key selling points..."
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              />
            </div>

            {/* Price */}
            <div className="max-w-xs">
              <label
                htmlFor="price"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Product Price
              </label>
              <Input
                id="price"
                type="text"
                placeholder="$49.95"
                value={form.price}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, price: e.target.value }))
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Marketing angle */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Marketing Angle</CardTitle>
          </CardHeader>
          <CardContent>
            <label
              htmlFor="angle"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Primary Marketing Angle
            </label>
            <Input
              id="angle"
              placeholder="e.g. Ancient secret to boundless energy..."
              value={form.marketingAngle}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  marketingAngle: e.target.value,
                }))
              }
            />
            <p className="mt-1 text-xs text-gray-400">
              The main hook or angle for your funnel pages.
            </p>
          </CardContent>
        </Card>

        {/* Error message */}
        {createMutation.error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {createMutation.error.message}
          </div>
        )}

        {/* Submit */}
        <div className="flex items-center justify-end gap-3">
          <Link href="/funnels">
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={!canSubmit}>
            {createMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Funnel"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
