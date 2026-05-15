/**
 * Purpose: HTML file provider — reads funnel HTML from disk.
 * Dependencies: fs/promises, path
 * Related: src/router/index.ts (caller), Architecture Finale.md §12 + §13
 *
 * WHY: Architecture Finale.md §12 — HTML is served from /data/funnels/{slug}/{variantId}.html
 *      The variant router reads the file and serves it to the visitor.
 *      In production: /data/funnels/ (Docker shared volume, Nginx also mounts this for assets)
 *      In development: {project_root}/public/funnels/ (fallback)
 *
 * ARCHITECTURE:
 *   - Nginx serves static assets DIRECTLY from /data/funnels (not through this router)
 *   - This module only reads HTML files for the variant router
 *   - htmlPath format from resolveVariant(): "/funnels/turmeric/advertorial.html" (legacy)
 *     or directly "{slug}/{variantId}.html" (Architecture Finale.md §12)
 */

import { readFile } from 'fs/promises';
import { join, resolve } from 'path';
import { createLogger } from '@/lib/logger';

const log = createLogger('router:html-provider');

// WHY: Architecture Finale.md §13 — FUNNELS_DATA_DIR env var (note: "FUNNELS" plural)
const FUNNELS_DATA_DIR = process.env.FUNNELS_DATA_DIR || process.env.FUNNEL_DATA_DIR || '/data/funnels';

// WHY: Project root fallback for development (where tsx runs from)
const PROJECT_ROOT = resolve(process.cwd());

/**
 * Read an HTML file from disk.
 * Tries production path first, then development fallback.
 *
 * @param htmlPath Path like "/funnels/turmeric/advertorial.html" or "turmeric/variant-uuid.html"
 * @returns HTML content as string, or null if not found
 */
export async function readHtmlFile(htmlPath: string): Promise<string | null> {
  // WHY: Normalize path — strip leading slashes and optional /funnels/ prefix
  //      resolveVariant() may return "/funnels/turmeric/advertorial.html" (legacy format)
  //      Architecture Finale.md §12 uses "{slug}/{variantId}.html"
  const normalizedPath = htmlPath
    .replace(/^\/+/, '')              // strip leading slashes
    .replace(/^funnels\//, '');       // strip "funnels/" prefix if present

  // Try 1: Production path (/data/funnels/{slug}/{file}.html)
  const prodPath = join(FUNNELS_DATA_DIR, normalizedPath);
  try {
    const content = await readFile(prodPath, 'utf-8');
    log.debug('HTML served from production path', { path: prodPath });
    return content;
  } catch {
    // File not found in production path — try fallback
  }

  // Try 2: Development path (public/funnels/{slug}/{file}.html)
  const devPath = join(PROJECT_ROOT, 'public', 'funnels', normalizedPath);
  try {
    const content = await readFile(devPath, 'utf-8');
    log.debug('HTML served from dev path', { path: devPath });
    return content;
  } catch {
    // File not found in either location
  }

  log.warn('HTML file not found', { htmlPath, tried: [prodPath, devPath] });
  return null;
}
