/**
 * Purpose: In-memory job store for async page generation.
 *          Tracks generation jobs across their lifecycle.
 * Dependencies: none
 * Related: src/app/api/funnels/[id]/generate/route.ts
 *
 * WHY: Page generation takes 90-180s (two LLM calls + validation).
 *      Cloudflare proxies timeout at 100s with error 524.
 *      Async jobs let the POST return immediately with a jobId,
 *      and the frontend polls for the result.
 */

export interface GenerateJob {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  /** Progress percentage (0-100) */
  progress: number;
  /** Human-readable status message */
  message: string;
  /** Result data (only when status=completed) */
  result?: {
    html: string;
    blockTree: unknown;
    validation: {
      score: number;
      valid: boolean;
      errors: unknown[];
    };
    attempts: number;
    meta: Record<string, unknown>;
  };
  /** Error message (only when status=failed) */
  error?: string;
  createdAt: number;
  updatedAt: number;
}

// WHY: Map is sufficient — jobs are ephemeral. If the server restarts,
//      in-progress jobs are lost, but the user can just retry.
//      No need for Redis or DB persistence for transient generation state.
const jobs = new Map<string, GenerateJob>();

let jobCounter = 0;

/** Create a new job and return its ID */
export function createJob(): string {
  jobCounter++;
  const id = `gen_${Date.now()}_${jobCounter}`;
  const now = Date.now();

  jobs.set(id, {
    id,
    status: 'pending',
    progress: 0,
    message: 'Queued',
    createdAt: now,
    updatedAt: now,
  });

  return id;
}

/** Get a job by ID */
export function getJob(jobId: string): GenerateJob | undefined {
  return jobs.get(jobId);
}

/** Update a job's status */
export function updateJob(
  jobId: string,
  update: Partial<Pick<GenerateJob, 'status' | 'progress' | 'message' | 'result' | 'error'>>,
): void {
  const job = jobs.get(jobId);
  if (!job) return;

  Object.assign(job, update, { updatedAt: Date.now() });
}

/**
 * Cleanup old completed/failed jobs (older than 1 hour).
 * WHY: Prevent memory leak from accumulated job entries.
 */
export function cleanupOldJobs(): void {
  const ONE_HOUR = 60 * 60 * 1000;
  const cutoff = Date.now() - ONE_HOUR;

  for (const [id, job] of jobs) {
    if ((job.status === 'completed' || job.status === 'failed') && job.updatedAt < cutoff) {
      jobs.delete(id);
    }
  }
}
