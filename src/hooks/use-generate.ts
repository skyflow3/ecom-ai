/**
 * Purpose: TanStack Query hooks for page generation + variant deployment.
 * Dependencies: @tanstack/react-query, @/lib/api-client
 * Related: src/app/api/funnels/[id]/generate/route.ts
 *
 * WHY: Page generation is now async (jobId-based polling).
 *      POST returns jobId immediately, then we poll GET for completion.
 *      This avoids Cloudflare 524 timeouts on long-running requests.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

// ─── Async Generate Page (Polling) ──────────────────────────────────────────

interface GeneratePagePayload {
  stepId: string;
  variantId?: string;
  pageType?: string;
  palette?: string;
  product?: Record<string, unknown>;
}

interface GeneratePageResponse {
  success: boolean;
  data: {
    jobId: string;
    status: string;
    message: string;
  };
}

interface PollResponse {
  success: boolean;
  data: {
    jobId: string;
    status: 'pending' | 'running' | 'completed' | 'failed';
    progress: number;
    message: string;
    result?: {
      html: string;
      blockTree: unknown;
      validation: { score: number; valid: boolean; errors: unknown[] };
      attempts: number;
      meta: Record<string, unknown>;
    };
    error?: string;
  };
}

const POLL_INTERVAL_MS = 3000;  // 3 seconds
const MAX_POLL_DURATION_MS = 300000; // 5 minutes

/**
 * Poll the job status endpoint until completed or failed.
 */
async function pollUntilDone(
  funnelId: string,
  jobId: string,
  onProgress?: (progress: number, message: string) => void,
): Promise<PollResponse['data']> {
  const startTime = Date.now();

  while (Date.now() - startTime < MAX_POLL_DURATION_MS) {
    const poll = await api.get<PollResponse>(
      `/api/funnels/${funnelId}/generate?jobId=${jobId}`,
    );

    if (!poll.success || !poll.data) {
      throw new Error('Poll request failed');
    }

    onProgress?.(poll.data.progress, poll.data.message);

    if (poll.data.status === 'completed') {
      return poll.data;
    }

    if (poll.data.status === 'failed') {
      throw new Error(poll.data.error ?? 'Generation failed');
    }

    // Wait before next poll
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
  }

  throw new Error('Generation timed out after 5 minutes');
}

/**
 * Trigger async AI page generation for a funnel step.
 * POST returns jobId, then polls until complete.
 */
export function useGeneratePage(funnelId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      payload: GeneratePagePayload & {
        onProgress?: (progress: number, message: string) => void;
      },
    ) => {
      const { onProgress, ...body } = payload;

      // Step 1: Start generation (returns jobId immediately)
      const start = await api.post<GeneratePageResponse>(
        `/api/funnels/${funnelId}/generate`,
        body,
      );

      if (!start.success || !start.data?.jobId) {
        throw new Error('Failed to start generation');
      }

      // Step 2: Poll until done
      const result = await pollUntilDone(funnelId, start.data.jobId, onProgress);
      return result;
    },
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
 */
export function useDeployVariant(funnelId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: DeployVariantPayload) =>
      api.post<DeployVariantResponse>(
        `/api/funnels/${funnelId}/deploy`,
        payload,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["funnels", funnelId] });
    },
  });
}
