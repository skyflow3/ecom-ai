/**
 * Purpose: Billing mutation hooks — Stripe checkout and portal redirects.
 *          Wraps @tanstack/react-query mutations for billing API routes.
 * Dependencies: @tanstack/react-query, @/lib/api-client
 * Related: src/app/(dashboard)/billing/page.tsx, src/app/api/billing/*
 *
 * WHY: Billing actions (checkout, portal) are mutations, not queries.
 *      They redirect the user to Stripe-hosted pages. useMutation handles
 *      loading/error states and triggers the redirect on success.
 *
 * USAGE:
 *   const checkout = useCheckout();
 *   checkout.mutate(priceId);
 *   // User is redirected to Stripe checkout on success
 */

"use client";

import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

interface BillingResponse {
  success: boolean;
  url: string;
}

/**
 * Create a Stripe Checkout Session and redirect the user.
 * Called when user clicks "Upgrade to Pro" or "Upgrade to Enterprise".
 *
 * WHY: Server creates the session (keeps priceId secret), returns a URL,
 *      and we redirect the browser to Stripe's hosted checkout page.
 */
export function useCheckout() {
  return useMutation({
    mutationFn: (priceId: string) =>
      api.post<BillingResponse>("/api/billing/checkout", { priceId }),
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
  });
}

/**
 * Create a Stripe Customer Portal session and redirect the user.
 * Called when user clicks "Manage Billing" or "Manage Subscription".
 *
 * WHY: Stripe portal lets users self-serve: update payment method,
 *      view invoices, upgrade/downgrade, or cancel their subscription.
 *      Requires an existing stripeCustomerId (free users have none).
 */
export function usePortal() {
  return useMutation({
    mutationFn: () =>
      api.post<BillingResponse>("/api/billing/portal", {}),
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
  });
}
