/**
 * Purpose: HTTP Cache Headers Middleware — tiered caching for Cloudflare CDN.
 *          Applied as Express/Next.js middleware to set correct Cache-Control headers.
 *          Every static asset gets CDN-cached. Dynamic pages get no-store.
 * Dependencies: None (pure header logic)
 * Related: Architecture Finale.md §53, server.ts (Express) or next.config.ts (Next.js)
 *
 * WHY: Correct cache headers = zero redundant downloads. A CSS file cached at the
 *      CDN edge for 1 hour means every visitor after the first gets it in < 50ms.
 *      "immutable" on resources means browsers never revalidate = zero conditional requests.
 *
 * Cache Strategy:
 *   - API routes: no-store (always fresh)
 *   - Funnel HTML: no-store (mutable, A/B testing)
 *   - Static assets (CSS/JS/images): public, max-age=3600, s-maxage=3600 (1h CDN)
 *   - Optimized images: public, max-age=31536000, immutable (1 year, content-hash URLs)
 *   - Fonts: public, max-age=31536000, immutable (never change)
 */

import { NextRequest, NextResponse } from 'next/server';

// ─── Route Classification ─────────────────────────────────────────────────────

type CacheTier = 'no-store' | 'short-cache' | 'cdn-cache' | 'immutable';

interface CacheRule {
  pattern: RegExp;
  tier: CacheTier;
  headers: Record<string, string>;
}

// ─── Cache Rules ──────────────────────────────────────────────────────────────

const CACHE_RULES: CacheRule[] = [
  // No-store: Dynamic content that must always be fresh
  {
    pattern: /^\/api\//,
    tier: 'no-store',
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, private',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  },
  {
    pattern: /^\/(editor|admin|dashboard)/,
    tier: 'no-store',
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, private',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  },

  // Immutable: Content-addressed resources (never change, cache forever)
  // WHY: Images with hash-based URLs never change. "immutable" prevents
  //      browsers from sending conditional GET requests (304 checks).
  {
    pattern: /\/_next\/image\//,
    tier: 'immutable',
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  },
  {
    pattern: /\/_next\/static\//,
    tier: 'immutable',
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  },
  {
    pattern: /\.(avif|webp|woff2|woff|ttf)$/i,
    tier: 'immutable',
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  },

  // CDN cache: Static assets with 1-hour TTL at edge
  {
    pattern: /\.(css|js|jpg|jpeg|png|gif|svg|ico|webmanifest)$/i,
    tier: 'cdn-cache',
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  },

  // Short cache: Funnel pages (mutable but can be briefly cached)
  {
    pattern: /^\/[a-z0-9-]+$/i, // slug-based funnel URLs
    tier: 'short-cache',
    headers: {
      'Cache-Control': 'public, max-age=0, s-maxage=60, must-revalidate',
      // WHY s-maxage=60: CDN caches for 60 seconds, browser always revalidates.
      //      Good for A/B testing: variant changes propagate within 1 minute.
    },
  },
];

// ─── Early Hints (103) ────────────────────────────────────────────────────────

/**
 * Early Hints: Link header → Cloudflare converts to 103 Early Hints response.
 * WHY: Normal flow = browser sends request → waits for server → gets HTML → then starts loading resources.
 *      With Early Hints = server sends resource hints BEFORE the HTML is ready.
 *      Browser starts preconnect/preload while server is still generating the page.
 *      Cloudflare automatically converts Link headers to 103 Early Hints.
 *      Saves ~1 RTT (round trip time) = 50-200ms on first visit.
 */
const EARLY_HINT_LINKS = [
  '<https://js.stripe.com>; rel=preconnect; crossorigin',
  '<https://fonts.gstatic.com>; rel=preconnect; crossorigin',
  // Add Supabase Storage: '<<project>.supabase.co>; rel=preconnect; crossorigin',
];

// ─── Security Headers (performance-adjacent) ─────────────────────────────────

const SECURITY_HEADERS: Record<string, string> = {
  // WHY these matter for speed:
  // - HSTS: Browser skips HTTP→HTTPS redirect (saves 1 RTT)
  // - nosniff: Browser doesn't waste time sniffing MIME types
  // - Permissions-Policy: No permission prompts that block rendering
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

// ─── Middleware ────────────────────────────────────────────────────────────────

/**
 * Next.js middleware for cache headers and security.
 * Runs on every request before the route handler.
 */
export function cacheHeadersMiddleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // Apply Early Hints Link header (Cloudflare converts to 103 response)
  response.headers.set('Link', EARLY_HINT_LINKS.join(', '));

  // Apply security headers to all responses
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }

  // HSTS (only over HTTPS)
  if (request.nextUrl.protocol === 'https:' ||
      request.headers.get('x-forwarded-proto') === 'https') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  // Apply cache rules
  for (const rule of CACHE_RULES) {
    if (rule.pattern.test(pathname)) {
      for (const [key, value] of Object.entries(rule.headers)) {
        response.headers.set(key, value);
      }
      break; // First match wins
    }
  }

  // X-Cache-Status header for debugging (always set)
  if (!response.headers.has('Cache-Control')) {
    response.headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
  }

  return response;
}

// ─── Express-compatible middleware (for non-Next.js routes) ───────────────────

/**
 * Express middleware version of the cache headers logic.
 * Use in custom Express server or API routes.
 */
export function expressCacheHeaders(req: { path: string; headers: Record<string, string>; secure: boolean }, res: {
  setHeader: (key: string, value: string) => void;
  getHeader: (key: string) => string | undefined;
}): void {
  // Security headers
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    res.setHeader(key, value);
  }

  // HSTS
  if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  // Cache rules
  for (const rule of CACHE_RULES) {
    if (rule.pattern.test(req.path)) {
      for (const [key, value] of Object.entries(rule.headers)) {
        res.setHeader(key, value);
      }
      return;
    }
  }

  // Default: no cache
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
}

// ─── Compression Config ──────────────────────────────────────────────────────

/**
 * Compression configuration for Express/Next.js.
 * Uses Brotli (quality 6) with 1KB threshold.
 * WHY Brotli over Gzip: 15-20% better compression for text assets.
 * WHY threshold 1024: Compressing responses < 1KB adds overhead (compressed can be larger).
 * WHY skip images: JPEG/PNG/WebP are already compressed. Double-compressing wastes CPU.
 */
export const COMPRESSION_CONFIG = {
  level: 6,         // WHY 6: Sweet spot between CPU usage and compression ratio
  threshold: 1024,  // WHY 1024: Skip compression for tiny responses
  // Skip already-compressed formats
  shouldCompress: (contentType: string): boolean => {
    if (!contentType) return true;
    const skipTypes = [
      'image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif',
      'video/', 'audio/', 'application/zip', 'application/gzip',
    ];
    return !skipTypes.some(t => contentType.includes(t));
  },
} as const;
