/**
 * Purpose: Cookie parsing and setting utilities for the Express variant router.
 * Dependencies: cookie (npm), @/services/server-variant-router
 * Related: src/router/index.ts (caller), Architecture Finale.md §12
 *
 * WHY: Cookie-based sticky sessions ensure a visitor always sees the same variant.
 *
 * COOKIE SPEC (Architecture Finale.md §12):
 *   Name: fs_v_{funnelId}
 *   Max-age: 30 days (2,592,000 seconds)
 *   httpOnly: true (not accessible from JS)
 *   Secure: true in production
 *   SameSite: lax (allows top-level navigations)
 *   Path: / (subdomain-scoped)
 */

import { parse as parseCookies } from 'cookie';
import { getVariantCookieName } from '@/services/server-variant-router';

const COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds

export interface VariantCookie {
  name: string;
  value: string;
}

/**
 * Read the variant cookie from the request.
 * Returns null if no cookie found.
 */
export function readVariantCookie(
  cookieHeader: string | undefined,
  funnelSlug: string,
  stepSlug: string,
): string | null {
  if (!cookieHeader) return null;

  const cookies = parseCookies(cookieHeader);
  const cookieName = getVariantCookieName(funnelSlug, stepSlug);

  return cookies[cookieName] || null;
}

/**
 * Build Set-Cookie header value for variant assignment.
 * WHY: Architecture Finale.md §12 — path is always / (subdomain-scoped).
 */
export function buildSetCookieHeader(
  funnelSlug: string,
  stepSlug: string,
  variantValue: string,
): string {
  const cookieName = getVariantCookieName(funnelSlug, stepSlug);

  const parts = [`${cookieName}=${variantValue}`];

  // WHY: Path / for subdomain routing (cookie valid on entire subdomain)
  parts.push('Path=/');
  parts.push(`Max-Age=${COOKIE_MAX_AGE}`);
  parts.push('HttpOnly');
  parts.push('SameSite=Lax');

  // WHY: Secure flag only in production (localhost doesn't support HTTPS)
  if (process.env.NODE_ENV === 'production') {
    parts.push('Secure');
  }

  return parts.join('; ');
}
