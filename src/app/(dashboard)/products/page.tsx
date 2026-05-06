/**
 * Purpose: Products list page — shows products linked to funnels.
 * Dependencies: lucide-react, @/components/ui/card
 * Related: src/app/(dashboard)/layout.tsx, src/hooks/use-funnels.ts
 *
 * WHY: Products are the items being sold through funnels. This page gives an
 *      overview of all products. Currently products are created inline during
 *      funnel creation. A dedicated products management page will come later.
 */

"use client";

import Link from "next/link";
import { Package, Plus, ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// ─── Page Component ───────────────────────────────────────────────────────────

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="mt-1 text-sm text-gray-500">
            Products are linked to your funnels. Create a funnel to add products.
          </p>
        </div>
        <Link href="/funnels/new">
          <Button>
            <Plus className="h-4 w-4" />
            New Funnel
          </Button>
        </Link>
      </div>

      {/* Empty state */}
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 py-16">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <Package className="h-8 w-8 text-gray-400" />
        </div>
        <h2 className="mt-4 text-lg font-semibold text-gray-900">
          Products are managed through funnels
        </h2>
        <p className="mt-2 max-w-md text-center text-sm text-gray-500">
          Each funnel is tied to a product. When you create a new funnel, you
          define the product details. View your funnels to see associated
          products.
        </p>
        <Link href="/funnels" className="mt-6">
          <Button variant="outline">
            View Funnels
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
