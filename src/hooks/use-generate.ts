/**
 * Purpose: TanStack Query hooks for page generation + variant deployment.
 * Dependencies: @tanstack/react-query, @/lib/api-client
 * Related: src/app/api/funnels/[id]/generate/route.ts, src/app/api/funnels/[id]/deploy/route.ts
 *
 * WHY: Page generation and deployment are async operations (AI generation + hosting).
 *      useMutation handles loading/error states. Query invalidation refreshes
 *      the funnel detail page automatically after generation completes.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

// ─── Generate Page ──────────────────────────────────────────────────────────

interface GeneratePagePayload {
  stepId: string;
  variantId?: string;
}

interface GeneratePageResponse {
  success: boolean;
  data: {
    variantId: string;
    status: string;
  };
}

/**
 * Trigger AI page generation for a funnel step.
 * Invalidates the funnel detail query so the UI refreshes when done.
 */
export function useGeneratePage(funnelId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: GeneratePagePayload) =>
      api.post<GeneratePageResponse>(
        `/api/funnels/${funnelId}/generate`,
        payload
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["funnels", funnelId] });
    },
  });
}

// ─── Deploy Variant ─────────────────────────────────────────────────────────

interface DeployVariantPayload {
  variantId: string;
}

interface DeployVariantResponse {
  success: boolean;
  data: {
    variantId: string;
    deployedAt: string;
  };
}

/**
 * Deploy a specific variant to live hosting.
 * Invalidates funnel detail so status badges update.
 */
export function useDeployVariant(funnelId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: DeployVariantPayload) =>
      api.post<DeployVariantResponse>(
        `/api/funnels/${funnelId}/deploy`,
        payload
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["funnels", funnelId] });
    },
  });
}
