/**
 * Purpose: Subdomain extraction from Host header.
 *          Used by the Express variant router to determine which funnel to serve.
 * Dependencies: None
 * Related: src/router/index.ts (caller)
 *
 * WHY: Subdomain routing maps {funnel}.nutrovia.co to the correct funnel.
 *      Nginx sets X-Funnel-Slug header from server_name regex (Architecture Finale.md §12),
 *      but we also extract from Host as fallback (for development without Nginx).
 *
 * EXAMPLES:
 *   turmeric.nutrovia.co       → "turmeric"
 *   www.turmeric.nutrovia.co   → "turmeric" (strip www)
 *   app.nutrovia.co            → null (reserved, not a funnel)
 *   nutrovia.co                → null (no subdomain)
 *   localhost:3001             → null (development, use path-based)
 */

import { createLogger } from '@/lib/logger';

const log = createLogger('router:subdomain');

// WHY: Base domain is configurable — allows multi-tenant deployment
const BASE_DOMAIN = process.env.BASE_DOMAIN || 'nutrovia.co';

// WHY: Reserved subdomains that should NOT be treated as funnel slugs
const RESERVED_SUBDOMAINS = ['app', 'www', 'api', 'admin', 'cdn', 't', 'mail', 'staging', 'go', 'funnels'];

/**
 * Extract funnel slug from subdomain.
 * Priority:
 *   1. X-Subdomain header (set by Nginx from server_name regex)
 *   2. Host header parsing (fallback)
 *
 * Returns null if no valid funnel subdomain found.
 */
export function extractFunnelSlug(
  host: string | undefined,
  xFunnelSlug: string | undefined,
): string | null {
  // WHY: Architecture Finale.md §12 — Nginx sets X-Funnel-Slug from server_name regex
  if (xFunnelSlug && isValidSlug(xFunnelSlug)) {
    return xFunnelSlug;
  }

  // Priority 2: Parse from Host header
  if (!host) return null;

  // WHY: Strip port number (localhost:3001, turmeric.nutrovia.co:443)
  const hostname = host.split(':')[0].toLowerCase();

  // WHY: localhost / IP addresses have no subdomain — use path-based routing
  if (hostname === 'localhost' || /^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
    return null;
  }

  // WHY: Check if host ends with our base domain
  //   turmeric.nutrovia.co → matches
  //   turmeric.other.com → no match (different domain)
  const suffix = `.${BASE_DOMAIN}`;
  if (!hostname.endsWith(suffix)) {
    // WHY: In development, BASE_DOMAIN might be localhost or custom
    //      If it doesn't match, return null and fall back to path-based
    log.debug('Host does not match base domain', { hostname, baseDomain: BASE_DOMAIN });
    return null;
  }

  // Extract subdomain part: "turmeric.nutrovia.co" → "turmeric"
  const subdomainPart = hostname.slice(0, -suffix.length);

  // WHY: Handle www.turmeric.nutrovia.co → "www.turmeric" → strip "www."
  const parts = subdomainPart.split('.');
  const slug = parts[0] === 'www' ? parts[1] || parts[0] : parts[0];

  // WHY: Multi-level subdomains like "api.staging.nutrovia.co"
  //      Only the first non-www part is the funnel slug
  if (parts.length > 2) {
    log.debug('Multi-level subdomain, using first segment', { hostname, slug });
  }

  return isValidSlug(slug) ? slug : null;
}

/**
 * Validate that a slug matches [a-z0-9-]+ pattern.
 * Rejects empty strings, reserved subdomains, and invalid characters.
 */
function isValidSlug(slug: string): boolean {
  if (!slug || slug.length === 0) return false;
  if (RESERVED_SUBDOMAINS.includes(slug)) return false;
  return /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(slug);
}
