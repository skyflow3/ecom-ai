/**
 * Purpose: Billing page client — plan overview, upgrade/downgrade, Stripe portal access.
 *          Shows current plan, plan comparison cards, and billing actions.
 * Dependencies: @clerk/nextjs, @/lib/plans, @/hooks/use-billing, lucide-react
 * Related: src/app/(dashboard)/billing/page.tsx, src/app/api/billing/*
 *
 * WHY: Users need a self-serve billing page to manage their subscription.
 *      Current plan comes from Clerk user metadata (synced via webhook).
 *      Upgrade triggers Stripe checkout; manage triggers Stripe portal.
 */

"use client";

import { useUser } from "@clerk/nextjs";
import {
  Check,
  X,
  CreditCard,
  Loader2,
  Crown,
  Sparkles,
  Building2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PLANS, type PlanKey, type PlanLimits } from "@/lib/plans";
import { useCheckout, usePortal } from "@/hooks/use-billing";

// ─── Plan display config (adds UI-specific fields to PLANS data) ─────────────

interface PlanCardConfig {
  key: PlanKey;
  limits: PlanLimits;
  description: string;
  features: string[];
  icon: React.ElementType;
  accent: string;
  popular?: boolean;
}

const PLAN_CARDS: PlanCardConfig[] = [
  {
    key: "free",
    limits: PLANS.free,
    description: "Try ECOM-AI with basic funnel building",
    features: [
      `${PLANS.free.funnels} funnel`,
      `${PLANS.free.pagesPerMonth} pages per month`,
      "Basic analytics",
      "AI content generation",
      "Community support",
    ],
    icon: Sparkles,
    accent: "border-gray-200",
  },
  {
    key: "pro",
    limits: PLANS.pro,
    description: "For growing stores that need more power",
    features: [
      `${PLANS.pro.funnels} funnels`,
      `${PLANS.pro.pagesPerMonth} pages per month`,
      "A/B testing",
      "Priority AI generation",
      "Custom domains",
      `${PLANS.pro.abTests} concurrent A/B tests`,
      "Email support",
    ],
    icon: Crown,
    accent: "border-blue-500",
    popular: true,
  },
  {
    key: "enterprise",
    limits: PLANS.enterprise,
    description: "For high-volume stores and agencies",
    features: [
      "Unlimited funnels",
      "Unlimited pages",
      "Unlimited A/B tests",
      "Custom domains",
      "API access",
      "Priority support",
      "Dedicated account manager",
    ],
    icon: Building2,
    accent: "border-purple-500",
  },
];

// ─── Page Component ──────────────────────────────────────────────────────────

export default function BillingClient() {
  const { user, isLoaded } = useUser();
  const checkout = useCheckout();
  const portal = usePortal();

  // WHY: user.publicMetadata.plan is set by the Stripe webhook.
  //      Falls back to "free" if not set yet (new users).
  const currentPlan = ((user?.publicMetadata?.plan as string) ??
    "free") as PlanKey;

  const isPending = checkout.isPending || portal.isPending;

  // ─── Handlers ─────────────────────────────────────────────────────────────────

  function handleUpgrade(planKey: PlanKey) {
    const priceId = PLANS[planKey].stripePriceId;
    if (!priceId) return;
    checkout.mutate(priceId);
  }

  function handleManageBilling() {
    portal.mutate();
  }

  // ─── Render ────────────────────────────────────────────────────────────────────

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 max-w-6xl mx-auto">
      {/* ─── Header ──────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
        <p className="text-gray-500 mt-1">
          Manage your subscription and billing preferences.
        </p>
      </div>

      {/* ─── Error banner ────────────────────────────────────────────────── */}
      {(checkout.error || portal.error) && (
        <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="text-sm">
            {checkout.error?.message ||
              portal.error?.message ||
              "Something went wrong. Please try again."}
          </p>
        </div>
      )}

      {/* ─── Current plan banner ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
            <CreditCard className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Current plan</p>
            <p className="text-lg font-semibold text-gray-900">
              {PLANS[currentPlan].name}
            </p>
          </div>
        </div>

        {/* WHY: Only show "Manage Billing" if user has a Stripe customer ID,
                  which means they've subscribed before. Portal requires it. */}
        {currentPlan !== "free" && (
          <button
            onClick={handleManageBilling}
            disabled={isPending}
            className={cn(
              "inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors",
              "hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {portal.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CreditCard className="h-4 w-4" />
            )}
            Manage Billing
          </button>
        )}
      </div>

      {/* ─── Plan cards ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLAN_CARDS.map((plan) => {
          const isCurrentPlan = plan.key === currentPlan;
          const isUpgrade =
            !isCurrentPlan &&
            PLANS[plan.key].price > PLANS[currentPlan].price;
          const isDowngrade =
            !isCurrentPlan &&
            PLANS[plan.key].price < PLANS[currentPlan].price &&
            currentPlan !== "free";
          const Icon = plan.icon;

          return (
            <div
              key={plan.key}
              className={cn(
                "relative rounded-lg border-2 p-6 transition-shadow",
                plan.accent,
                isCurrentPlan && "ring-2 ring-blue-500 ring-offset-2",
                plan.popular && !isCurrentPlan && "shadow-md"
              )}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Current plan badge */}
              {isCurrentPlan && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center rounded-full bg-green-600 px-3 py-1 text-xs font-semibold text-white">
                    Current Plan
                  </span>
                </div>
              )}

              {/* Plan header */}
              <div className="flex items-center gap-3 mb-4">
                <Icon className="h-6 w-6 text-gray-700" />
                <h3 className="text-xl font-bold text-gray-900">
                  {plan.limits.name}
                </h3>
              </div>

              {/* Price */}
              <div className="mb-4">
                <span className="text-3xl font-bold text-gray-900">
                  ${plan.limits.price}
                </span>
                <span className="text-gray-500">/month</span>
              </div>

              <p className="text-sm text-gray-500 mb-6">
                {plan.description}
              </p>

              {/* Features list */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm text-gray-700"
                  >
                    <Check className="h-4 w-4 mt-0.5 text-green-500 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Action button */}
              {isCurrentPlan ? (
                <div className="flex items-center justify-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-500">
                  <Check className="h-4 w-4" />
                  Current Plan
                </div>
              ) : (
                <button
                  onClick={() => handleUpgrade(plan.key)}
                  disabled={
                    isPending ||
                    !plan.limits.stripePriceId
                  }
                  className={cn(
                    "w-full rounded-md px-4 py-2.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
                    isUpgrade &&
                      "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
                    isDowngrade &&
                      "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500",
                    !isUpgrade &&
                      !isDowngrade &&
                      "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-900",
                    (isPending || !plan.limits.stripePriceId) &&
                      "opacity-50 cursor-not-allowed"
                  )}
                >
                  {isPending ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </span>
                  ) : isUpgrade ? (
                    "Upgrade"
                  ) : isDowngrade ? (
                    "Downgrade"
                  ) : (
                    "Get Started"
                  )}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* ─── Manage billing link for free users ──────────────────────────── */}
      {currentPlan === "free" && (
        <p className="text-center text-sm text-gray-400">
          Already subscribed?{" "}
          <button
            onClick={handleManageBilling}
            disabled={isPending}
            className="text-blue-600 hover:underline disabled:opacity-50"
          >
            Manage your billing
          </button>
        </p>
      )}
    </div>
  );
}
