/**
 * Purpose: POST /api/pages — Validate and render a pre-built BlockTree JSON.
 *          No LLM call — just validates + renders HTML.
 *          Useful for testing renderers or re-rendering saved block trees.
 *
 * GET /api/pages?html=true — Returns HTML instead of JSON.
 *
 * Request body (POST):
 *   { blockTree: <BlockTree JSON object> }
 *
 * Response:
 *   { valid, html?, validation, error? }
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { validateAndRender } from '../../../services/page-generator';
import { createLogger } from '../../../lib/logger';

const log = createLogger('api:pages');

// ─── Request Schema ──────────────────────────────────────────────────────────

const renderRequestSchema = z.object({
  blockTree: z.record(z.unknown()),
});

// ─── POST Handler ────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = renderRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid request', details: parsed.error.issues },
        { status: 400 },
      );
    }

    const result = await validateAndRender(parsed.data.blockTree);

    if (!result.valid) {
      return NextResponse.json(result, { status: 422 });
    }

    // Check if client wants HTML directly
    const acceptHeader = request.headers.get('accept') ?? '';
    const wantsHtml = acceptHeader.includes('text/html') ||
                      new URL(request.url).searchParams.get('html') === 'true';

    if (wantsHtml && result.html) {
      return new NextResponse(result.html, {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    log.error('Render failed', { error: message });
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
