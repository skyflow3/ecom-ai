/**
 * Purpose: Express Variant Router — serves funnel pages with A/B testing.
 *          Subdomain routing ONLY: turmeric.nutrovia.co → this router.
 * Dependencies: express, @/services/server-variant-router, @/router/*
 * Related: Architecture Finale.md §12 (Variant Router on port 3001)
 *
 * WHY: Funnel pages are 100% static HTML. The A/B routing must happen
 *      BEFORE serving the file. This Express service:
 *      - Receives funnel slug via X-Funnel-Slug header (set by Nginx)
 *      - Calls resolveVariant() to assign a variant (cookie-based sticky sessions)
 *      - Serves the correct HTML file from disk
 *      - Proxies tracking requests to Next.js /api/track
 *
 * FLOW (Architecture Finale.md §12):
 *   1. Nginx receives turmeric.nutrovia.co
 *   2. Nginx extracts subdomain, sets X-Funnel-Slug: turmeric
 *   3. Nginx proxies to this router (port 3001)
 *   4. Router reads cookie fs_v_{funnelId} (or assigns variant)
 *   5. Router serves /data/funnels/{slug}/{variantId}.html
 *
 * ARCHITECTURE NOTES:
 *   - Static assets (.js, .css, .png, etc.) are served by Nginx DIRECTLY
 *     from /data/funnels volume — they never hit this router.
 *   - Only HTML page requests reach this router.
 *   - No path-based routing (/funnels/ or /f/) — subdomain ONLY.
 *
 * EXPRESS 5 NOTE:
 *   Express 5 changed route matching. app.use() intercepts ALL requests,
 *   even those matching app.get() routes defined before it. We use a
 *   Router with mergeParams to handle specific routes first.
 */

import express from 'express';
import { resolveVariant } from '@/services/server-variant-router';
import { extractFunnelSlug } from './subdomain';
import { readVariantCookie, buildSetCookieHeader } from './cookies';
import { readHtmlFile } from './html-provider';
import { healthHandler } from './health';
import { trackProxyHandler, trackOptionsHandler } from './track-proxy';
import { deployHandler, batchDeployHandler } from './deploy';
import { createLogger } from '@/lib/logger';

const log = createLogger('router:main');

// ─── Express App ──────────────────────────────────────────────────────────────

const app = express();
const PORT = parseInt(process.env.ROUTER_PORT || '3001', 10);

// WHY: Parse JSON bodies for tracking proxy
app.use(express.json({ limit: '1mb' }));

// ─── Dedicated Routes (handled BEFORE catch-all) ──────────────────────────────

app.get('/health', healthHandler);

// WHY: Funnel pages on subdomains POST tracking data here
app.options('/track', trackOptionsHandler);
app.post('/track', trackProxyHandler);

// WHY: Worker deploys funnel HTML via these endpoints
app.post('/deploy', deployHandler);
app.post('/deploy/batch', batchDeployHandler);

// ─── Catch-All: Funnel Page Routing ───────────────────────────────────────────
// WHY: Architecture Finale.md §12 — ALL other requests are funnel pages.
//      We use a dedicated Router to avoid Express 5's app.use() intercepting
//      the specific routes above.
//
//      The funnel slug comes from X-Funnel-Slug header (set by Nginx).
//      Path becomes the step slug:
//        turmeric.nutrovia.co/          → stepSlug = '' (entry page)
//        turmeric.nutrovia.co/checkout  → stepSlug = 'checkout'

const funnelRouter = express.Router();

funnelRouter.all('/{*splat}', async (req, res) => {
  const host = req.headers.host;
  // WHY: Architecture Finale.md §12 — Nginx passes funnel slug via X-Funnel-Slug header
  const xFunnelSlug = req.headers['x-funnel-slug'] as string | undefined;
  let funnelSlug = extractFunnelSlug(host, xFunnelSlug);

  // WHY: Path becomes the step slug (or contains funnel slug for path-based routing)
  const pathname = req.path.replace(/^\/|\/$/g, '');

  if (!funnelSlug) {
    // WHY: Path-based routing fallback — funnels.nutrovia.co/{funnelSlug}/{stepSlug}
    //      This avoids needing wildcard DNS or per-funnel Traefik configuration.
    //      When subdomain extraction fails (e.g. host = funnels.nutrovia.co),
    //      the first path segment is treated as the funnel slug.
    const pathParts = pathname.split('/').filter(Boolean);
    if (pathParts.length > 0 && /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(pathParts[0])) {
      funnelSlug = pathParts[0];
      const stepSlug = pathParts.slice(1).join('/');
      await handleFunnelRequest(req, res, funnelSlug, stepSlug || '');
      return;
    }
    return res.status(400).send('Missing funnel slug');
  }

  const stepSlug = pathname || '';
  await handleFunnelRequest(req, res, funnelSlug, stepSlug);
});

// WHY: Mount funnel router last — specific routes above take priority
app.use(funnelRouter);

// ─── Core Funnel Handler ──────────────────────────────────────────────────────

async function handleFunnelRequest(
  req: express.Request,
  res: express.Response,
  funnelSlug: string,
  stepSlug: string,
): Promise<void> {
  try {
    // Step 1: Read existing cookie
    const cookieValue = readVariantCookie(
      req.headers.cookie,
      funnelSlug,
      stepSlug || 'entry',
    );

    // Step 2: Resolve variant (DB query, traffic allocation, etc.)
    const resolution = await resolveVariant(funnelSlug, stepSlug, cookieValue ?? undefined);

    if (!resolution.success || !resolution.htmlPath) {
      // WHY: Resolution failed — try serving static file as fallback.
      //      For entry page (no stepSlug), try index.html first (deploy endpoint convention),
      //      then advertorial.html (legacy convention).
      const fallbackPaths = stepSlug
        ? [`/${funnelSlug}/${stepSlug}.html`]
        : [`/${funnelSlug}/index.html`, `/${funnelSlug}/advertorial.html`];

      for (const fallbackPath of fallbackPaths) {
        const html = await readHtmlFile(fallbackPath);
        if (html) {
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.setHeader('Cache-Control', 'public, max-age=300');
          res.send(html);
          return;
        }
      }

      log.warn('Funnel not found', { funnelSlug, stepSlug });
      res.status(404).send('Funnel page not found');
      return;
    }

    // Step 3: Read HTML file from disk
    const html = await readHtmlFile(resolution.htmlPath);
    if (!html) {
      // WHY: Fallback to convention-based static file path
      //      resolveVariant may return a guessed path that doesn't exist
      const fallbackPaths = stepSlug
        ? [`/${funnelSlug}/${stepSlug}.html`]
        : [`/${funnelSlug}/index.html`, `/${funnelSlug}/advertorial.html`];

      let fallbackHtml: string | null = null;
      for (const fallbackPath of fallbackPaths) {
        fallbackHtml = await readHtmlFile(fallbackPath);
        if (fallbackHtml) break;
      }

      if (fallbackHtml) {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Cache-Control', 'public, max-age=300');
        res.send(fallbackHtml);
        return;
      }

      log.warn('HTML file not found', { funnelSlug, stepSlug, htmlPath: resolution.htmlPath });
      res.status(404).send('Funnel page not found');
      return;
    }

    // Step 4: Set cookie if new assignment
    if (resolution.shouldSetCookie && resolution.cookieValue) {
      const setCookie = buildSetCookieHeader(
        funnelSlug,
        stepSlug || 'entry',
        resolution.cookieValue,
      );
      res.setHeader('Set-Cookie', setCookie);
    }

    // Step 5: Serve HTML
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    // WHY: Short cache for HTML (5 min) — variants can change during A/B tests
    //      Assets get long cache (1 year) served directly by Nginx
    res.setHeader('Cache-Control', 'public, max-age=300');

    log.info('Funnel served', {
      funnelSlug,
      stepSlug: stepSlug || 'entry',
      variantId: resolution.variantId,
      htmlPath: resolution.htmlPath,
      newAssignment: resolution.shouldSetCookie,
    });

    res.send(html);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    log.error('Funnel handler error', { funnelSlug, stepSlug, error: message });
    res.status(500).send('Internal server error');
  }
}

// ─── Start Server ─────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  log.info('Variant Router started', {
    port: PORT,
    mode: process.env.NODE_ENV || 'development',
    baseDomain: process.env.BASE_DOMAIN || 'nutrovia.co',
    funnelDataDir: process.env.FUNNEL_DATA_DIR || '/data/funnels',
  });
});
