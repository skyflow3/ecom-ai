/**
 * Purpose: Health check endpoint for the Express variant router.
 * Dependencies: express
 * Related: src/router/index.ts (mounts this handler)
 */

import { type Request, type Response } from 'express';

export function healthHandler(_req: Request, res: Response): void {
  res.json({
    status: 'ok',
    service: 'variant-router',
    version: process.env.npm_package_version || '0.1.0',
    uptime: process.uptime(),
  });
}
