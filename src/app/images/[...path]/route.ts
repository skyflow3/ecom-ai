/**
 * Purpose: Serve static image/asset files from public/images/ directory.
 * WHY: Next.js standalone does NOT serve static files from public/ automatically.
 *      With <base href="/"> in funnel HTML, relative paths like "images/nutrovia-hero.png"
 *      resolve to "/images/nutrovia-hero.png" — this route serves them.
 * Usage: /images/nutrovia-hero.png → serves public/images/nutrovia-hero.png
 */

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const ALLOWED_EXTENSIONS = [
  '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico', '.avif',
];

const CONTENT_TYPES: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.avif': 'image/avif',
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await params;

  const filePath = segments.join('/');
  const ext = filePath.toLowerCase().split('.').pop();
  const extWithDot = ext ? `.${ext}` : '';

  if (!ALLOWED_EXTENSIONS.includes(extWithDot)) {
    return NextResponse.json({ error: 'File type not allowed' }, { status: 403 });
  }

  // WHY: Block path traversal attempts
  if (filePath.includes('..') || filePath.startsWith('/') || filePath.includes('\\')) {
    return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
  }

  try {
    const { readFileSync, existsSync } = await import('fs');
    const { join } = await import('path');

    const candidates = [
      join(process.cwd(), 'public', 'images', filePath),
      join(process.cwd(), '.next', 'standalone', 'public', 'images', filePath),
      join(process.cwd(), '..', 'public', 'images', filePath),
    ];

    for (const fullPath of candidates) {
      if (existsSync(fullPath)) {
        const buffer = readFileSync(fullPath);
        const contentType = CONTENT_TYPES[extWithDot] || 'application/octet-stream';
        return new NextResponse(buffer, {
          status: 200,
          headers: {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=86400, immutable',
          },
        });
      }
    }

    return NextResponse.json({ error: `Image not found: ${filePath}` }, { status: 404 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
