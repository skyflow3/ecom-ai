/**
 * Purpose: POST /api/generate — Generate a page from a product brief.
 *          Calls the LLM agent, validates, and returns HTML.
 * Dependencies: page-generator.ts, lib/config.ts
 * Related: Architecture Finale.md §51
 *
 * Request body:
 *   { pageType, palette, product: { name, description, ... }, marketingAngle?, ragPatterns? }
 *
 * Response:
 *   { success, html?, blockTree?, validation?, attempts, meta, error? }
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generatePage, type GeneratePageRequest } from '../../../services/page-generator';
import { getLlmConfig } from '../../../lib/config';
import { createLogger } from '../../../lib/logger';

const log = createLogger('api:generate');

// ─── Request Schema ──────────────────────────────────────────────────────────

const generateRequestSchema = z.object({
  pageType: z.enum([
    'product-page', 'advertorial', 'vsl', 'checkout',
    'upsell', 'downsell', 'optin', 'quiz', 'thank-you', 'bridge',
  ]),
  palette: z.enum([
    'health-warm', 'beauty-clean', 'supplement-bold',
    'pet-friendly', 'beauty-bold',
  ]),
  product: z.object({
    name: z.string().min(1),
    description: z.string().min(10),
    price: z.string().optional(),
    originalPrice: z.string().optional(),
    niche: z.string().optional(),
    targetAudience: z.string().optional(),
    benefits: z.array(z.string()).optional(),
    guarantee: z.string().optional(),
    imageUrl: z.string().optional(),
  }),
  marketingAngle: z.object({
    headline: z.string().optional(),
    subheadline: z.string().optional(),
    ctaText: z.string().optional(),
    benefits: z.array(z.string()).optional(),
    guarantee: z.string().optional(),
    painPoint: z.string().optional(),
  }).optional(),
  ragPatterns: z.array(z.string()).optional(),
  trackingId: z.string().optional(),
});

// ─── POST Handler ────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const parsed = generateRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request',
          details: parsed.error.issues.map(i => ({
            path: i.path.join('.'),
            message: i.message,
          })),
        },
        { status: 400 },
      );
    }

    // Get LLM config from environment
    const llmConfig = getLlmConfig();

    // Generate the page — cast via Zod validated data
    const genRequest = parsed.data as GeneratePageRequest;
    const result = await generatePage(genRequest, llmConfig);

    // Return result
    const status = result.success ? 200 : 422;
    return NextResponse.json(result, { status });

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    log.error('Generation failed', { error: message });
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
