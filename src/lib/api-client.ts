/**
 * Purpose: Generic fetch wrapper for API routes — typed, concise
 * Dependencies: none (browser fetch)
 * Related: used by React Query hooks across the app
 */

export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(endpoint, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }

  return res.json();
}

/** Convenience methods for common HTTP verbs */
export const api = {
  get: <T>(url: string) => apiClient<T>(url),

  post: <T>(url: string, data: unknown) =>
    apiClient<T>(url, { method: "POST", body: JSON.stringify(data) }),

  put: <T>(url: string, data: unknown) =>
    apiClient<T>(url, { method: "PUT", body: JSON.stringify(data) }),

  delete: <T>(url: string) => apiClient<T>(url, { method: "DELETE" }),

  patch: <T>(url: string, data: unknown) =>
    apiClient<T>(url, { method: "PATCH", body: JSON.stringify(data) }),
};
