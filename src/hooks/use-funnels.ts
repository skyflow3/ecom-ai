/**
 * Purpose: TanStack Query hooks for funnel CRUD operations.
 * Dependencies: @tanstack/react-query, @/lib/api-client
 * Related: src/app/api/funnels/route.ts, src/app/api/funnels/[id]/route.ts
 *
 * WHY: Centralizes all funnel data fetching + mutations in one place.
 *      Components just call useFunnels() / useFunnel(id) / useCreateFunnel().
 *      Query keys are consistent so mutations auto-invalidate the right queries.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

// ─── Response Types ─────────────────────────────────────────────────────────

interface FunnelListItem {
  id: string;
  name: string;
  slug: string;
  status: "draft" | "active" | "paused" | "archived";
  productId: string | null;
  domain: string | null;
  subdomain: string | null;
  createdAt: string;
  updatedAt: string;
}

interface FunnelListResponse {
  success: boolean;
  data: FunnelListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface PageVariant {
  id: string;
  stepId: string;
  name: string;
  status: string;
  trafficWeight: number;
  isControl: boolean;
  createdAt: string;
}

interface FunnelStep {
  id: string;
  funnelId: string;
  type: string;
  name: string;
  slug: string;
  sortOrder: number;
  variants: PageVariant[];
}

interface FunnelDetail {
  id: string;
  name: string;
  slug: string;
  status: "draft" | "active" | "paused";
  productId: string | null;
  domain: string | null;
  subdomain: string | null;
  createdAt: string;
  updatedAt: string;
  steps: FunnelStep[];
  marketingAngles: Array<{
    id: string;
    angle: string;
    source: string;
    createdAt: string;
  }>;
}

interface FunnelDetailResponse {
  success: boolean;
  data: FunnelDetail;
}

interface CreateFunnelPayload {
  name: string;
  slug: string;
  productId?: string;
  domain?: string;
  subdomain?: string;
}

interface CreateFunnelResponse {
  success: boolean;
  data: FunnelDetail & { steps: FunnelStep[] };
}

// ─── Query Keys ─────────────────────────────────────────────────────────────

const funnelKeys = {
  all: ["funnels"] as const,
  list: () => [...funnelKeys.all, "list"] as const,
  detail: (id: string) => [...funnelKeys.all, id] as const,
};

// ─── Hooks ──────────────────────────────────────────────────────────────────

/** Fetch paginated funnel list */
export function useFunnels(page = 1, limit = 20) {
  return useQuery({
    queryKey: [...funnelKeys.list(), { page, limit }],
    queryFn: () =>
      api.get<FunnelListResponse>(
        `/api/funnels?page=${page}&limit=${limit}`
      ),
  });
}

/** Fetch a single funnel with steps and variants */
export function useFunnel(id: string) {
  return useQuery({
    queryKey: funnelKeys.detail(id),
    queryFn: () => api.get<FunnelDetailResponse>(`/api/funnels/${id}`),
    enabled: !!id,
  });
}

/** Create a new funnel — invalidates list on success */
export function useCreateFunnel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateFunnelPayload) =>
      api.post<CreateFunnelResponse>("/api/funnels", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: funnelKeys.all });
    },
  });
}

/** Soft-delete a funnel — invalidates list on success */
export function useDeleteFunnel(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.delete(`/api/funnels/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: funnelKeys.all });
    },
  });
}

/** Update funnel fields (name, slug, domain, status) */
export function useUpdateFunnel(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      name?: string;
      slug?: string;
      domain?: string | null;
      subdomain?: string | null;
      status?: "draft" | "active" | "paused";
    }) => api.patch(`/api/funnels/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: funnelKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: funnelKeys.all });
    },
  });
}
