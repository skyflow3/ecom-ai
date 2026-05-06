/**
 * Purpose: Deploy pipeline — takes a variant from DB, validates, renders HTML,
 *          uploads to storage (R2 or local), and updates the DB with the deployed URL.
 * Dependencies: lib/db.ts, validation/pipeline.ts, renderers/index.ts, drizzle-orm
 * Related: src/app/api/funnels/[id]/deploy/route.ts (API consumer), Architecture Finale.md §52
 *
 * WHY: Production pages need to be served as static HTML from a CDN/R2.
 *      This pipeline bridges the gap between the BlockTree in DB and a live URL.
 *      StorageProvider abstraction allows dev (local filesystem) and prod (Cloudflare R2).
 */

import { eq } from 'drizzle-orm';
import { db } from '../lib/db';
import { pageVariants, funnelSteps, funnels } from '../db/schema';
import { validateBlockTree } from '../validation/pipeline';
import type { PipelineResult } from '../validation/pipeline';
import { renderFullPage } from '../renderers';
import type { BlockTree } from '../design-system/blocks';
import '../renderers'; // side-effect: registers all block renderers

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface DeployResult {
  success: boolean;
  url?: string;
  html?: string;
  r2Key?: string;
  validation?: PipelineResult;
  error?: string;
}

export interface StorageProvider {
  /** Upload HTML content to storage under the given key */
  upload(key: string, html: string): Promise<void>;
  /** Get the public URL for a previously uploaded key */
  getUrl(key: string): string;
}

// ─── Local Storage Provider (Development) ──────────────────────────────────────

const LOCAL_STORAGE_DIR = './storage';
const LOCAL_BASE_URL = 'http://localhost:3000/storage';

/**
 * Saves HTML files to ./storage/ directory.
 * Useful for local development where R2 is not configured.
 * Serves files via Next.js static serving or a simple file server.
 */
export class LocalStorageProvider implements StorageProvider {
  async upload(key: string, html: string): Promise<void> {
    const fs = await import('fs/promises');
    const path = await import('path');

    const fullPath = path.join(LOCAL_STORAGE_DIR, key);
    const dir = path.dirname(fullPath);

    // Create directory tree if missing
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(fullPath, html, 'utf-8');
  }

  getUrl(key: string): string {
    return `${LOCAL_BASE_URL}/${key}`;
  }
}

// ─── Cloudflare R2 Storage Provider (Production) ──────────────────────────────

/**
 * Uploads HTML to Cloudflare R2 using the S3-compatible API via @aws-sdk/client-s3.
 * Requires env vars: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET
 * Optionally: R2_PUBLIC_URL (custom domain for the bucket)
 *
 * Run: npm install @aws-sdk/client-s3
 */
export class R2StorageProvider implements StorageProvider {
  private readonly bucket: string;
  private readonly publicUrl: string;
  private readonly s3Client: Promise<import('@aws-sdk/client-s3').S3Client>;

  constructor() {
    const env = process.env;
    const accessKeyId = env.R2_ACCESS_KEY_ID ?? '';
    const secretAccessKey = env.R2_SECRET_ACCESS_KEY ?? '';
    this.bucket = env.R2_BUCKET ?? '';

    const accountId = env.R2_ACCOUNT_ID ?? '';
    const endpoint = `https://${accountId}.r2.cloudflarestorage.com`;

    this.publicUrl = env.R2_PUBLIC_URL ?? `https://${this.bucket}.r2.dev`;

    if (!accessKeyId || !secretAccessKey || !this.bucket || !accountId) {
      throw new Error(
        'R2 storage requires env vars: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET'
      );
    }

    // Lazy-initialize the S3 client — avoids import errors if @aws-sdk/client-s3
    // is not installed and LocalStorageProvider is being used instead.
    this.s3Client = this.createClient(endpoint, accessKeyId, secretAccessKey);
  }

  private async createClient(
    endpoint: string,
    accessKeyId: string,
    secretAccessKey: string,
  ): Promise<import('@aws-sdk/client-s3').S3Client> {
    const { S3Client } = await import('@aws-sdk/client-s3');
    return new S3Client({
      region: 'auto',
      endpoint,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async upload(key: string, html: string): Promise<void> {
    const { PutObjectCommand } = await import('@aws-sdk/client-s3');
    const client = await this.s3Client;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: html,
      ContentType: 'text/html; charset=utf-8',
    });

    try {
      await client.send(command);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`R2 upload failed: ${message}`);
    }
  }

  getUrl(key: string): string {
    return `${this.publicUrl}/${key}`;
  }
}

// ─── Storage Provider Factory ──────────────────────────────────────────────────

/**
 * Returns the appropriate storage provider based on environment.
 * - Production with R2 env vars → R2StorageProvider
 * - Otherwise → LocalStorageProvider
 */
export function getStorageProvider(): StorageProvider {
  const hasR2Config =
    process.env.R2_ACCOUNT_ID &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY &&
    process.env.R2_BUCKET;

  if (hasR2Config) {
    return new R2StorageProvider();
  }

  return new LocalStorageProvider();
}

// ─── Storage Key Generator ─────────────────────────────────────────────────────

/**
 * Generates a unique storage key for a deployed variant.
 * Format: funnels/{funnelSlug}/{stepSlug}/{variantId}.html
 *
 * WHY: Hierarchical keys make it easy to find all pages for a funnel,
 *      purge a funnel's cache, or map URLs back to DB records.
 */
async function buildStorageKey(
  variantId: string,
  stepId: string,
): Promise<string> {
  // Join step + funnel to get slugs
  const stepRow = await db
    .select({
      stepSlug: funnelSteps.slug,
      funnelId: funnelSteps.funnelId,
    })
    .from(funnelSteps)
    .where(eq(funnelSteps.id, stepId))
    .limit(1);

  if (stepRow.length === 0) {
    throw new Error(`Step not found: ${stepId}`);
  }

  const funnelRow = await db
    .select({ slug: funnels.slug })
    .from(funnels)
    .where(eq(funnels.id, stepRow[0].funnelId))
    .limit(1);

  if (funnelRow.length === 0) {
    throw new Error(`Funnel not found: ${stepRow[0].funnelId}`);
  }

  return `funnels/${funnelRow[0].slug}/${stepRow[0].stepSlug}/${variantId}.html`;
}

// ─── Main Deploy Function ──────────────────────────────────────────────────────

/**
 * Deploy a page variant to static storage.
 *
 * Pipeline:
 * 1. Load variant from DB (page jsonb = BlockTree)
 * 2. Validate BlockTree through the 8-pass validation pipeline
 * 3. Render HTML using the block renderer registry
 * 4. Upload to storage (R2 or local)
 * 5. Update DB with r2Key and deployedUrl
 * 6. Return result with URL and HTML
 *
 * @param variantId - UUID of the page_variant to deploy
 * @param options.storageProvider - Override the storage provider (useful for tests)
 */
export async function deployVariant(
  variantId: string,
  options?: { storageProvider?: StorageProvider },
): Promise<DeployResult> {
  // 1. Load variant from DB
  const rows = await db
    .select()
    .from(pageVariants)
    .where(eq(pageVariants.id, variantId))
    .limit(1);

  if (rows.length === 0) {
    return {
      success: false,
      error: `Variant not found: ${variantId}`,
    };
  }

  const variant = rows[0];
  const blockTreeJson = variant.page;

  // 2. Validate BlockTree
  const validation = await validateBlockTree(blockTreeJson, { skipMobileLayout: true });

  if (!validation.valid) {
    return {
      success: false,
      validation,
      error: `Validation failed with ${validation.errors.length} errors. Score: ${validation.score}`,
    };
  }

  // 3. Render HTML
  let html: string;
  try {
    const tree = blockTreeJson as BlockTree;
    html = renderFullPage(tree, tree.palette);
  } catch (renderError) {
    return {
      success: false,
      validation,
      error: `Render failed: ${renderError instanceof Error ? renderError.message : String(renderError)}`,
    };
  }

  // 4. Generate storage key and upload
  const storage = options?.storageProvider ?? getStorageProvider();
  let storageKey: string;

  try {
    storageKey = await buildStorageKey(variantId, variant.stepId);
  } catch (keyError) {
    return {
      success: false,
      validation,
      error: `Key generation failed: ${keyError instanceof Error ? keyError.message : String(keyError)}`,
    };
  }

  try {
    await storage.upload(storageKey, html);
  } catch (uploadError) {
    return {
      success: false,
      validation,
      error: `Storage upload failed: ${uploadError instanceof Error ? uploadError.message : String(uploadError)}`,
    };
  }

  const deployedUrl = storage.getUrl(storageKey);

  // 5. Update DB with deployment info
  await db
    .update(pageVariants)
    .set({
      r2Key: storageKey,
      deployedUrl,
      status: 'deployed',
      updatedAt: new Date(),
    })
    .where(eq(pageVariants.id, variantId));

  // 6. Return result
  return {
    success: true,
    url: deployedUrl,
    html,
    r2Key: storageKey,
    validation,
  };
}
