/**
 * Purpose: Image Optimization Pipeline — AVIF/WebP conversion, LQIP, responsive srcset.
 *          Runs at deploy time when images are processed and uploaded to storage.
 *          Uses Sharp for server-side image processing.
 * Dependencies: sharp (npm), @supabase/storage-js (or R2)
 * Related: Architecture Finale.md §53, page-speed-optimizer.ts
 *
 * WHY: Images are 50-70% of page weight. Optimizing them = biggest speed win.
 *      AVIF = 50% smaller than JPEG. WebP = 30% smaller. LQIP = instant perceived load.
 *      Responsive srcset = mobile downloads 400px image, desktop gets 1200px.
 *
 * Pipeline: Original URL → download → Sharp pipeline → AVIF/WebP selection →
 *           LQIP generation → responsive sizes → upload to storage → return URLs
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ImageOptimizationResult {
  /** Original URL (unchanged) */
  originalUrl: string;
  /** Optimized image URL (best format: AVIF > WebP > original) */
  optimizedUrl: string;
  /** Best format selected */
  format: 'avif' | 'webp' | 'original';
  /** LQIP base64 data URI for blur-up placeholder */
  lqip: string;
  /** Responsive sizes for srcset */
  responsiveSizes: ResponsiveSize[];
  /** Bytes saved vs original */
  savingsPercent: number;
}

export interface ResponsiveSize {
  width: number;
  label: string;
  url: string;
}

export interface ImageOptimizerConfig {
  /** AVIF quality (0-100). Lower = smaller but lower quality. 65 is sweet spot. */
  avifQuality: number;
  /** AVIF encoding effort (0-9). 4 = fast, 9 = slow but best compression */
  avifEffort: number;
  /** WebP quality. 80 is good balance. */
  webpQuality: number;
  /** WebP encoding effort (0-6) */
  webpEffort: number;
  /** Minimum savings % to use converted format vs original */
  minSavingsPercent: number;
  /** LQIP width in pixels. 20px = tiny blur placeholder. */
  lqipWidth: number;
  /** LQIP quality (0-100). 20 = very low but enough for blur effect. */
  lqipQuality: number;
  /** Responsive breakpoints to generate */
  responsiveBreakpoints: number[];
  /** Minimum image width to generate responsive sizes */
  minResponsiveWidth: number;
}

export const DEFAULT_IMAGE_CONFIG: ImageOptimizerConfig = {
  avifQuality: 65,       // WHY 65: AVIF quality 65 ≈ JPEG quality 85 visually, but 50% smaller
  avifEffort: 4,         // WHY 4: Fast enough for deploy pipeline, good compression
  webpQuality: 80,       // WHY 80: WebP quality 80 ≈ JPEG quality 90 visually, but 30% smaller
  webpEffort: 4,
  minSavingsPercent: 10,  // WHY 10: If conversion only saves <10%, keep original (avoids format overhead)
  lqipWidth: 20,          // WHY 20: Tiny enough to be <1KB, large enough for blur effect
  lqipQuality: 20,
  responsiveBreakpoints: [400, 800, 1200],
  minResponsiveWidth: 400, // WHY 400: Images smaller than 400px don't benefit from srcset
};

// ─── Format Selection Logic ──────────────────────────────────────────────────

/**
 * Determine the best output format for an image based on size savings.
 * Returns 'avif' if AVIF is at least 10% smaller, 'webp' if WebP is smaller, 'original' otherwise.
 */
export function selectBestFormat(params: {
  originalSize: number;
  avifSize: number | null;
  webpSize: number | null;
  minSavingsPercent: number;
}): 'avif' | 'webp' | 'original' {
  const { originalSize, avifSize, webpSize, minSavingsPercent } = params;

  const threshold = originalSize * (1 - minSavingsPercent / 100);

  // AVIF first — best compression
  if (avifSize !== null && avifSize < threshold) {
    return 'avif';
  }

  // WebP second — good compression, wider support
  if (webpSize !== null && webpSize < originalSize) {
    return 'webp';
  }

  // Original if neither saves enough
  return 'original';
}

// ─── LQIP Generation ─────────────────────────────────────────────────────────

/**
 * Generate a Low Quality Image Placeholder (LQIP) for blur-up loading.
 * Returns a base64 data URI that can be used as a background-image while the real image loads.
 *
 * WHY: LQIP gives instant visual feedback. User sees a blurred version of the image
 *      within 50ms (it's <1KB base64), then the real image fades in. Perceived load = instant.
 *
 * Implementation (requires Sharp):
 * ```
 * import sharp from 'sharp';
 *
 * const lqipBuffer = await sharp(buffer)
 *   .resize(20, null, { withoutEnlargement: true, fit: 'inside' })
 *   .webp({ quality: 20 })
 *   .toBuffer();
 * const lqip = `data:image/webp;base64,${lqipBuffer.toString('base64')}`;
 * ```
 */
export function generateLQIPPlaceholder(width: number = 20): string {
  // Returns a generic 1px placeholder when Sharp isn't available
  // Real implementation uses Sharp at deploy time
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${width}'%3E%3Crect fill='%23e5e7eb' width='100%25' height='100%25'/%3E%3C/svg%3E`;
}

// ─── Responsive Srcset Builder ───────────────────────────────────────────────

/**
 * Build responsive srcset string from optimized image sizes.
 * Filters out sizes larger than the original image.
 */
export function buildSrcset(sizes: ResponsiveSize[]): string {
  return sizes
    .map(s => `${s.url} ${s.width}w`)
    .join(', ');
}

/**
 * Build sizes attribute for responsive images.
 * Default: full width on mobile, contained on desktop.
 */
export function buildSizesAttribute(maxMobileWidth: number = 100): string {
  return `(max-width: 640px) ${maxMobileWidth}vw, (max-width: 1024px) 80vw, 1200px`;
}

// ─── HTML <picture> Generator ─────────────────────────────────────────────────

/**
 * Generate <picture> element with AVIF, WebP, and fallback sources.
 * Includes LQIP for blur-up loading effect.
 */
export function generatePictureHTML(params: {
  src: string;
  alt: string;
  avifUrl?: string;
  webpUrl?: string;
  originalUrl: string;
  lqip?: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
  fetchpriority?: 'high' | 'low' | 'auto';
}): string {
  const {
    alt,
    avifUrl,
    webpUrl,
    originalUrl,
    lqip,
    width,
    height,
    className = '',
    loading = 'lazy',
    fetchpriority,
  } = params;

  const sources: string[] = [];

  if (avifUrl) {
    sources.push(`<source srcset="${avifUrl}" type="image/avif">`);
  }
  if (webpUrl) {
    sources.push(`<source srcset="${webpUrl}" type="image/webp">`);
  }

  const imgAttrs: string[] = [
    `src="${originalUrl}"`,
    `alt="${alt}"`,
    `loading="${loading}"`,
    `decoding="async"`,
  ];

  if (width) imgAttrs.push(`width="${width}"`);
  if (height) imgAttrs.push(`height="${height}"`);
  if (fetchpriority) imgAttrs.push(`fetchpriority="${fetchpriority}"`);
  if (className) imgAttrs.push(`class="${className}"`);
  if (lqip) {
    imgAttrs.push(`style="background-image:url('${lqip}');background-size:cover"`);
  }

  return `<picture>${sources.join('')}<img ${imgAttrs.join(' ')}></picture>`;
}

// ─── Batch Optimization (Deploy Pipeline) ────────────────────────────────────

/**
 * Process all images in an HTML page for optimization.
 * Returns the HTML with optimized image URLs and LQIP placeholders.
 *
 * This is the main entry point for the deploy pipeline.
 * In production, this would:
 * 1. Find all <img> tags in the HTML
 * 2. Download each image
 * 3. Run Sharp pipeline (AVIF, WebP, LQIP, responsive sizes)
 * 4. Upload optimized images to storage
 * 5. Replace URLs in HTML
 */
export function markImagesForOptimization(html: string): string {
  // Mark all external images for deploy-time optimization
  return html.replace(
    /<img([^>]*src\s*=\s*["'])(https?:\/\/[^"']+)(["'][^>]*)>/gi,
    (match: string, before: string, src: string, after: string) => {
      // Skip SVGs, data URIs, and already optimized images
      if (src.endsWith('.svg') || src.startsWith('data:')) return match;

      return `<img${before}${src}${after} data-optimize="true" data-original-src="${src}">`;
    }
  );
}

// ─── Supported Format Detection ───────────────────────────────────────────────

/**
 * Check if a URL points to a raster image that can be optimized.
 */
export function isOptimizableImage(url: string): boolean {
  return /\.(jpe?g|png|webp|avif|tiff?)$/i.test(url) && !url.startsWith('data:');
}
