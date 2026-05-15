/**
 * Purpose: Tracking proxy — forwards /track requests to Next.js /api/track.
 * Dependencies: express, node:http
 * Related: src/router/index.ts (mounts this handler)
 *
 * WHY: Funnel pages on subdomains (turmeric.nutrovia.co) send tracking events
 *      to /track. The tracking logic lives in Next.js /api/track (src/app/api/track/route.ts).
 *      This proxy forwards the request so we don't duplicate the tracking code.
 *
 *      In the future Hono migration, this proxy goes away — Hono will handle tracking directly.
 */

import { type Request, type Response } from 'express';
import { createLogger } from '@/lib/logger';

const log = createLogger('router:track-proxy');

// WHY: Next.js service name in Docker Compose is "web"
const TRACK_TARGET = process.env.TRACK_TARGET || 'http://localhost:3000';

/**
 * Proxy tracking POST requests to Next.js /api/track.
 * Fire-and-forget — the response goes directly back to the client.
 */
export async function trackProxyHandler(req: Request, res: Response): Promise<void> {
  try {
    const targetUrl = `${TRACK_TARGET}/api/track`;

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': req.headers['content-type'] || 'application/json',
        // WHY: Forward original IP for geo-location
        'X-Real-IP': req.headers['x-real-ip'] as string || req.ip || '',
        'X-Forwarded-For': req.headers['x-forwarded-for'] as string || '',
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    log.error('Track proxy failed', { error: message });
    // WHY: Tracking failure should return success to not break the client
    res.status(200).json({ success: true, proxied: false });
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
