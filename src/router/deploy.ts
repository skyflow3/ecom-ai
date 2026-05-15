/**
 * Purpose: Funnel deployment endpoint — accepts HTML and writes to disk.
 * Dependencies: express, fs/promises, path
 * Related: src/router/index.ts (mounts this handler)
 *
 * WHY: The Worker generates funnel HTML and needs a place to deploy it.
 *      Instead of a shared Docker volume, the Router exposes a POST endpoint
 *      that accepts funnel HTML and writes to its own filesystem.
 *
 * FLOW:
 *   Worker → POST /deploy { slug, filename, html } → Router writes to /data/funnels/{slug}/{filename}.html
 *
 * AUTH: API key via X-Deploy-Key header (matches DEPLOY_API_KEY env var)
 */

import type { Request, Response } from 'express';
import { writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { createLogger } from '@/lib/logger';

const log = createLogger('router:deploy');

const FUNNELS_DATA_DIR = process.env.FUNNELS_DATA_DIR || process.env.FUNNEL_DATA_DIR || '/data/funnels';
const DEPLOY_API_KEY = process.env.DEPLOY_API_KEY || '';

interface DeployBody {
  slug: string;
  filename: string;
  html: string;
}

export async function deployHandler(req: Request, res: Response): Promise<void> {
  // WHY: Auth check — prevent unauthorized deployments
  const deployKey = req.headers['x-deploy-key'] as string | undefined;
  if (DEPLOY_API_KEY && deployKey !== DEPLOY_API_KEY) {
    log.warn('Deploy rejected — invalid API key');
    res.status(401).json({ error: 'Invalid deploy key' });
    return;
  }

  const { slug, filename, html } = req.body as DeployBody;

  // WHY: Validate inputs — prevent path traversal
  if (!slug || !filename || !html) {
    res.status(400).json({ error: 'Missing required fields: slug, filename, html' });
    return;
  }

  if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(slug)) {
    res.status(400).json({ error: 'Invalid slug format' });
    return;
  }

  if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?\.html$/.test(filename)) {
    res.status(400).json({ error: 'Invalid filename — must be {name}.html' });
    return;
  }

  try {
    const dirPath = join(FUNNELS_DATA_DIR, slug);
    const filePath = join(dirPath, filename);

    // WHY: Create directory if it doesn't exist
    await mkdir(dirPath, { recursive: true });

    await writeFile(filePath, html, 'utf-8');

    log.info('Funnel deployed', { slug, filename, size: html.length });

    res.json({
      success: true,
      path: filePath,
      size: html.length,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    log.error('Deploy failed', { slug, filename, error: message });
    res.status(500).json({ error: 'Deploy failed', details: message });
  }
}

/**
 * Batch deploy — multiple files at once.
 * WHY: Funnel generation produces 7-10 pages (entry, checkout, oto1-5, thankyou).
 *      One request is more efficient than 7-10 separate requests.
 */
interface BatchDeployBody {
  slug: string;
  files: Array<{ filename: string; html: string }>;
}

export async function batchDeployHandler(req: Request, res: Response): Promise<void> {
  const deployKey = req.headers['x-deploy-key'] as string | undefined;
  if (DEPLOY_API_KEY && deployKey !== DEPLOY_API_KEY) {
    log.warn('Batch deploy rejected — invalid API key');
    res.status(401).json({ error: 'Invalid deploy key' });
    return;
  }

  const { slug, files } = req.body as BatchDeployBody;

  if (!slug || !files || !Array.isArray(files) || files.length === 0) {
    res.status(400).json({ error: 'Missing required fields: slug, files[]' });
    return;
  }

  if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(slug)) {
    res.status(400).json({ error: 'Invalid slug format' });
    return;
  }

  const results: Array<{ filename: string; success: boolean; size?: number; error?: string }> = [];

  try {
    const dirPath = join(FUNNELS_DATA_DIR, slug);
    await mkdir(dirPath, { recursive: true });

    for (const file of files) {
      if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?\.html$/.test(file.filename)) {
        results.push({ filename: file.filename, success: false, error: 'Invalid filename' });
        continue;
      }

      try {
        const filePath = join(dirPath, file.filename);
        await writeFile(filePath, file.html, 'utf-8');
        results.push({ filename: file.filename, success: true, size: file.html.length });
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        results.push({ filename: file.filename, success: false, error: msg });
      }
    }

    const successCount = results.filter(r => r.success).length;
    log.info('Batch deploy completed', { slug, total: files.length, success: successCount });

    res.json({
      success: successCount === files.length,
      slug,
      deployed: successCount,
      total: files.length,
      results,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    log.error('Batch deploy failed', { slug, error: message });
    res.status(500).json({ error: 'Batch deploy failed', details: message });
  }
}
