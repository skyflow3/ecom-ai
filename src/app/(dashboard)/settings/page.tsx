/**
 * Purpose: Settings page — user profile, plan info, security, and billing link.
 * Dependencies: @clerk/nextjs, @/lib/plans, lucide-react, UI components
 * Related: src/app/(dashboard)/layout.tsx, src/app/(dashboard)/billing/page.tsx
 *
 * WHY: Users need a central place to view their profile and manage their account.
 *      Clerk provides user info (name, email, avatar). Plan comes from publicMetadata
 *      synced by the Stripe webhook. Billing management links to the billing page.
 */

"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import {
  User,
  CreditCard,
  Shield,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PLANS, type PlanKey } from "@/lib/plans";

// ─── Loading Skeleton ─────────────────────────────────────────────────────────

function SettingsSkeleton() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Skeleton className="h-8 w-32" />
        <Skeleton className="mt-1 h-4 w-64" />
      </div>
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-5 w-64" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default function SettingsPage() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <SettingsSkeleton />;
  }

  // WHY: user.publicMetadata.plan is synced by the Clerk webhook
  //      when the user subscribes via Stripe. Defaults to "free".
  const currentPlan = ((user?.publicMetadata?.plan as string) ??
    "free") as PlanKey;
  const planLimits = PLANS[currentPlan];

  const fullName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Not set";
  const email =
    user?.primaryEmailAddress?.emailAddress ??
    user?.emailAddresses?.[0]?.emailAddress ??
    "Not set";

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account and subscription.
        </p>
      </div>

      {/* ─── Profile section ──────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="h-5 w-5 text-gray-400" />
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            {user?.imageUrl ? (
              <img
                src={user.imageUrl}
                alt={fullName}
                className="h-16 w-16 rounded-full border border-gray-200"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <User className="h-8 w-8 text-gray-400" />
              </div>
            )}
            <div>
              <p className="text-lg font-semibold text-gray-900">{fullName}</p>
              <p className="text-sm text-gray-500">{email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ─── Plan & Billing section ───────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <CreditCard className="h-5 w-5 text-gray-400" />
            Plan & Billing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-4">
            <div>
              <p className="text-sm text-gray-500">Current plan</p>
              <p className="text-lg font-semibold text-gray-900">
                {planLimits.name}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Price</p>
              <p className="text-lg font-semibold text-gray-900">
                ${planLimits.price}
                <span className="text-sm font-normal text-gray-500">/mo</span>
              </p>
            </div>
          </div>

          {/* Plan limits */}
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Funnels</span>
              <span className="font-medium">
                {planLimits.funnels === -1
                  ? "Unlimited"
                  : `${planLimits.funnels}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Pages / month</span>
              <span className="font-medium">
                {planLimits.pagesPerMonth === -1
                  ? "Unlimited"
                  : `${planLimits.pagesPerMonth}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span>A/B Tests</span>
              <span className="font-medium">
                {planLimits.abTests === -1
                  ? "Unlimited"
                  : planLimits.abTests === 0
                    ? "None"
                    : `${planLimits.abTests}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Custom Domains</span>
              <span className="font-medium">
                {planLimits.customDomain ? "Yes" : "No"}
              </span>
            </div>
          </div>

          {/* Billing actions */}
          <div className="flex gap-2 border-t border-gray-100 pt-4">
            <Link href="/billing" className="flex-1">
              <Button variant="outline" className="w-full">
                <ExternalLink className="h-4 w-4" />
                Manage Billing
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* ─── Security section ─────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="h-5 w-5 text-gray-400" />
            Security
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            Your account security is managed through Clerk. Change your password,
            enable two-factor authentication, and manage connected accounts from
            the user menu in the top-right corner.
          </p>
          <div className="mt-3 rounded-lg border border-gray-100 bg-gray-50 p-3">
            <p className="text-xs text-gray-400">
              Click your avatar in the top-right corner to access account
              management options.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
