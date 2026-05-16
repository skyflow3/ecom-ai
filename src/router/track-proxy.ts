/**
 * Purpose: Tracking handler — records A/B metrics locally + forwards to Next.js /api/track.
 * Dependencies: express
 * Related: src/router/index.ts (mounts this handler), src/app/api/track/route.ts (consumer)
 *
 * WHY: Funnel pages send tracking events to /track. We:
 *      1. Write metrics locally (metrics.json per funnel) for A/B evaluation
 *      2. Transform payload to /api/track format + forward for PostgreSQL analytics
 *
 * FORMAT BRIDGE:
 *   Old snippet sends: { step, variant, type, url, ts }
 *   /api/track expects: { variantId, event, sessionId, data }
 *   This handler translates between the two formats.
 */

import { type Request, type Response } from 'express';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { createLogger } from '@/lib/logger';

const log = createLogger('router:track');

const FUNNELS_DATA_DIR = process.env.FUNNELS_DATA_DIR || process.env.FUNNEL_DATA_DIR || '/data/funnels';
const TRACK_TARGET = process.env.TRACK_TARGET || 'http://localhost:3000';

/** Old format from generateTrackingSnippet() in funnel-metrics.ts */
interface LegacyTrackPayload {
  step: string;
  variant: string;
  type: 'pageView' | 'ctaClick';
  url?: string;
  ts?: number;
  funnelSlug?: string;
}

/** New format expected by /api/track (Zod schema in route.ts) */
interface ModernTrackPayload {
  variantId: string;
  event: 'pageview' | 'cta_click' | 'scroll' | 'click' | 'form_submit' | 'purchase';
  sessionId: string;
  data?: {
    blockId?: string;
    scrollDepth?: number;
    timeOnPage?: number;
    elementId?: string;
    metadata?: Record<string, unknown>;
  };
  url?: string;
  referrer?: string;
  userAgent?: string;
}

/**
 * Handle tracking events — write locally + transform + forward to Next.js.
 */
export async function trackProxyHandler(req: Request, res: Response): Promise<void> {
  const payload = req.body as LegacyTrackPayload;

  // WHY: Write metrics locally for A/B evaluation (file-based, no DB needed)
  if (payload.step && payload.variant && payload.type) {
    try {
      const referer = (req.headers.referer || req.headers.origin || '') as string;
      writeLocalMetric(payload, referer);
    } catch (err) {
      log.warn('Local metric write failed', { error: err instanceof Error ? err.message : String(err) });
    }
  }

  // WHY: Transform old format → new format and forward to /api/track
  //      The Next.js endpoint has a strict Zod schema — raw old format would 400.
  const modernPayload = transformToModernFormat(payload, req);
  if (!modernPayload) {
    // WHY: If payload can't be transformed, local metrics were still recorded
    res.status(200).json({ success: true, local: true, forwarded: false });
    return;
  }

  try {
    const targetUrl = `${TRACK_TARGET}/api/track`;
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Real-IP': (req.headers['x-real-ip'] as string) || req.ip || '',
        'X-Forwarded-For': (req.headers['x-forwarded-for'] as string) || '',
      },
      body: JSON.stringify(modernPayload),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    // WHY: Local metrics still recorded even if Next.js is down
    res.status(200).json({ success: true, local: true, forwarded: false });
  }
}

/**
 * Transform old tracking format to new /api/track format.
 *
 * WHY: The inline snippet (generateTrackingSnippet) sends legacy format:
 *      { step, variant, type: 'pageView'|'ctaClick', url, ts }
 *      But /api/track expects:
 *      { variantId, event: 'pageview'|'cta_click', sessionId, data }
 *
 *      sessionId is generated from IP + variant for dedup.
 *      variantId uses the variant field directly.
 */
function transformToModernFormat(
  legacy: LegacyTrackPayload,
  req: Request,
): ModernTrackPayload | null {
  const eventMap: Record<string, ModernTrackPayload['event']> = {
    pageView: 'pageview',
    ctaClick: 'cta_click',
  };

  const event = eventMap[legacy.type];
  if (!event) return null;

  // WHY: Generate stable sessionId from IP + variant for dedup
  const ip = (req.headers['x-real-ip'] as string) || req.ip || 'unknown';
  const sessionId = `sid-${legacy.variant}-${ip.replace(/\./g, '').slice(0, 12)}`;

  return {
    variantId: legacy.variant,
    event,
    sessionId,
    data: {
      metadata: {
        step: legacy.step,
        ...(legacy.url ? { legacyUrl: legacy.url } : {}),
      },
    },
    url: legacy.url,
    referrer: (req.headers.referer || req.headers.origin || '') as string,
    userAgent: req.headers['user-agent'] || '',
  };
}

/**
 * Write a single metric event to the funnel's metrics.json.
 * WHY: Simple file-based metrics — no DB required for A/B evaluation.
 */
function writeLocalMetric(payload: LegacyTrackPayload, referer: string): void {
  const funnelSlug = payload.funnelSlug || extractSlugFromReferer(referer);
  if (!funnelSlug) return;

  const metricsPath = join(FUNNELS_DATA_DIR, funnelSlug, 'metrics.json');
  if (!existsSync(metricsPath)) return;

  const metrics = JSON.parse(readFileSync(metricsPath, 'utf-8'));
  const step = metrics.steps?.[payload.step];
  if (!step) return;

  const variant = step.variants?.find((v: any) => v.variantId === payload.variant);
  if (!variant) return;

  if (payload.type === 'pageView') {
    variant.pageViews = (variant.pageViews || 0) + 1;
    step.totalViews = (step.totalViews || 0) + 1;
  } else if (payload.type === 'ctaClick') {
    variant.ctaClicks = (variant.ctaClicks || 0) + 1;
    if (payload.url) {
      variant.ctas = variant.ctas || {};
      variant.ctas[payload.url] = (variant.ctas[payload.url] || 0) + 1;
    }
  }

  // Recalculate CVR
  variant.cvr = variant.pageViews > 0 ? variant.ctaClicks / variant.pageViews : 0;

  // Update best variant
  const eligible = step.variants.filter((v: any) => (v.pageViews || 0) >= 10);
  step.bestVariant = eligible.length > 0
    ? eligible.reduce((best: any, v: any) => v.cvr > best.cvr ? v : best).variantId
    : null;

  metrics.updatedAt = new Date().toISOString();
  writeFileSync(metricsPath, JSON.stringify(metrics, null, 2), 'utf-8');
}

/**
 * Extract funnel slug from referer URL.
 * WHY: Tracking events come from funnel pages, so the referer contains the slug.
 *      e.g., https://nutrovia.nutrovia.co/nutrovia/ → slug = "nutrovia"
 */
function extractSlugFromReferer(referer: string): string | null {
  try {
    const url = new URL(referer);
    const parts = url.pathname.split('/').filter(Boolean);
    return parts[0] || null;
  } catch {
    return null;
  }
}

/**
 * CORS preflight for tracking endpoint.
 */
export function trackOptionsHandler(_req: Request, res: Response): void {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400');
  res.status(204).end();
}
