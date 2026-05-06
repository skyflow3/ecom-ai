/**
 * Purpose: Page Speed Optimization Pipeline — transforms block-rendered HTML for max speed.
 *          ECOM-AI specific: we GENERATE pages from BlockTree JSON, we don't clone sites.
 *          Applied AFTER block rendering, BEFORE deployment.
 * Dependencies: image-optimizer.ts (deploy-time image processing)
 * Related: Architecture Finale.md §53, validation/pipeline.ts (pass5_performance)
 *
 * WHY: A funnel page that loads in <2s converts 2-3x better than one loading in 5s.
 *      Mobile traffic is 90% of DTC. Every 100ms improvement = measurable CVR increase.
 *
 * Pipeline: Block Renderer HTML → optimizePageSpeed() → DEPLOY
 *
 * NOTE: We GENERATE our own HTML from a BlockTree. That means:
 * - No tracking scripts to block (we don't inject any)
 * - No messy markup to clean (our renderer outputs clean HTML)
 * - No external CSS to inline (we have our own mobile-first.css)
 * - No relative URLs to fix (our renderer uses absolute Supabase Storage URLs)
 */

// ─── Configuration ────────────────────────────────────────────────────────────

export interface SpeedOptimizerConfig {
  /** Speculation Rules API — prerender checkout on hover, prefetch all pages */
  speculationRules: {
    enabled: boolean;
    /** URL patterns to prerender on hover */
    prerenderPatterns: string[];
    /** 'immediate' | 'moderate' | 'conservative' */
    prerenderEagerness: 'immediate' | 'moderate' | 'conservative';
    /** Enable prefetch for all internal links */
    prefetchEnabled: boolean;
  };

  /** Image optimizations */
  images: {
    /** Add fetchpriority="high" to hero image (LCP) */
    lcpPriority: boolean;
    /** Add loading="lazy" + decoding="async" to non-hero images */
    lazyLoad: boolean;
    /** Add aspect-ratio from tokens.ts IMAGE_RATIOS to images without dimensions */
    aspectRatio: boolean;
  };

  /** Font optimizations */
  fonts: {
    /** Inject font-display: swap into all @font-face (prevents FOIT) */
    fontDisplaySwap: boolean;
  };

  /** Video optimizations */
  video: {
    /** Set preload="metadata" on videos (don't preload entire video) */
    preloadMetadata: boolean;
  };

  /** View Transitions API for smoother page-to-page navigation */
  viewTransitions: boolean;

  /** content-visibility: auto for off-screen sections (skip rendering) */
  contentVisibility: {
    enabled: boolean;
    /** Sections beyond this viewport multiplier get content-visibility */
    thresholdMultiplier: number;
    /** Intrinsic size estimate for hidden content */
    intrinsicSize: string;
  };

  /** HTML minification (remove whitespace, comments) */
  minifyHTML: boolean;

  /** Optimistic UI for add-to-cart buttons */
  optimisticUI: {
    enabled: boolean;
    feedbackText: string;
    feedbackDuration: number;
  };

  /** Predictive prefetch on link hover */
  predictivePrefetch: boolean;

  /** Resource hints — preconnect + dns-prefetch for third-party origins */
  resourceHints: {
    enabled: boolean;
    /** Origins to preconnect (DNS + TCP + TLS handshake ahead of time) */
    preconnectOrigins: string[];
    /** Origins to dns-prefetch (DNS resolution only, lighter) */
    dnsPrefetchOrigins: string[];
  };

  /** Preload critical fonts before browser discovers them in CSS */
  preloadFonts: {
    enabled: boolean;
    /** Font files to preload */
    fonts: Array<{ url: string; type: 'woff2' | 'woff' | 'ttf'; crossOrigin?: boolean }>;
  };

  /** Critical CSS — inline above-fold styles, async load full stylesheet */
  criticalCSS: {
    enabled: boolean;
    /** Pre-extracted critical CSS (generated at build time from mobile-first.css) */
    css: string;
    /** Load full stylesheet asynchronously via loadCSS pattern */
    asyncLoadFullStylesheet: boolean;
  };

  /** Partytown — run analytics in Web Worker (zero main-thread impact) */
  partytown: {
    enabled: boolean;
    /** Browser APIs to forward from worker to main thread */
    forward: string[];
  };
}

export const DEFAULT_SPEED_CONFIG: SpeedOptimizerConfig = {
  speculationRules: {
    enabled: true,
    prerenderPatterns: ['*/checkout*', '*/order*', '*/confirm*'],
    prerenderEagerness: 'moderate',
    prefetchEnabled: true,
  },

  images: {
    lcpPriority: true,
    lazyLoad: true,
    aspectRatio: true,
  },

  fonts: {
    fontDisplaySwap: true,
  },

  video: {
    preloadMetadata: true,
  },

  viewTransitions: true,

  contentVisibility: {
    enabled: true,
    thresholdMultiplier: 1.5,
    intrinsicSize: 'auto 500px',
  },

  minifyHTML: true,

  optimisticUI: {
    enabled: true,
    feedbackText: '✓ Added!',
    feedbackDuration: 1500,
  },

  predictivePrefetch: true,

  resourceHints: {
    enabled: true,
    preconnectOrigins: [
      'https://js.stripe.com',       // Stripe checkout
      'https://fonts.gstatic.com',    // Google Fonts CDN
      // Add Supabase Storage URL: 'https://<project>.supabase.co'
    ],
    dnsPrefetchOrigins: [
      'https://fonts.googleapis.com',
    ],
  },

  preloadFonts: {
    enabled: true,
    fonts: [
      // Self-hosted font files — override URLs for your setup
      // tokens.ts: heading = 'DM Serif Display', body = 'Inter'
      // { url: '/fonts/dm-serif-display.woff2', type: 'woff2', crossOrigin: true },
      // { url: '/fonts/inter-regular.woff2', type: 'woff2', crossOrigin: true },
    ],
  },

  criticalCSS: {
    enabled: false,   // Requires build-time extraction — enable after setup
    css: '',          // Populated at build time from mobile-first.css
    asyncLoadFullStylesheet: true,
  },

  partytown: {
    enabled: false,   // Enable when analytics are added
    forward: ['dataLayer.push', 'fbq', 'gtag'],
  },
};

// ─── Duplicate Injection Guard ────────────────────────────────────────────────

const MARKER = '<!-- ECOM-AI-SPEED -->';

// ─── Main Optimizer ───────────────────────────────────────────────────────────

/**
 * Apply all speed optimizations to block-rendered HTML.
 * Returns optimized HTML ready for deployment.
 */
export function optimizePageSpeed(
  html: string,
  config: SpeedOptimizerConfig = DEFAULT_SPEED_CONFIG,
): string {
  // Guard: don't optimize twice
  if (html.includes(MARKER)) return html;

  let optimized = html;

  // 1. LCP: fetchpriority="high" on hero image
  if (config.images.lcpPriority) {
    optimized = injectLCPPriority(optimized);
  }

  // 2. Lazy load non-hero images
  if (config.images.lazyLoad) {
    optimized = injectLazyLoading(optimized);
  }

  // 3. CLS: aspect-ratio from design tokens
  if (config.images.aspectRatio) {
    optimized = injectAspectRatio(optimized);
  }

  // 4. Font-display: swap
  if (config.fonts.fontDisplaySwap) {
    optimized = injectFontDisplaySwap(optimized);
  }

  // 5. Video preload="metadata"
  if (config.video.preloadMetadata) {
    optimized = injectVideoPreloadMetadata(optimized);
  }

  // 6. Speculation Rules (prerender checkout on hover)
  if (config.speculationRules.enabled) {
    optimized = injectSpeculationRules(optimized, config.speculationRules);
  }

  // 7. View Transitions
  if (config.viewTransitions) {
    optimized = injectViewTransitions(optimized);
  }

  // 8. content-visibility for off-screen sections
  if (config.contentVisibility.enabled) {
    optimized = injectContentVisibility(optimized, config.contentVisibility);
  }

  // 9. Optimistic UI for cart buttons
  if (config.optimisticUI.enabled) {
    optimized = injectOptimisticUI(optimized, config.optimisticUI);
  }

  // 10. Predictive prefetch on link hover
  if (config.predictivePrefetch) {
    optimized = injectPredictivePrefetch(optimized);
  }

  // 11. Preconnect + DNS-prefetch for third-party origins
  if (config.resourceHints.enabled) {
    optimized = injectResourceHints(optimized, config.resourceHints);
  }

  // 12. Preload critical fonts
  if (config.preloadFonts.enabled) {
    optimized = injectPreloadFonts(optimized, config.preloadFonts);
  }

  // 13. Critical CSS inline + async full stylesheet
  if (config.criticalCSS.enabled) {
    optimized = injectCriticalCSS(optimized, config.criticalCSS);
  }

  // 14. Partytown (analytics in Web Worker)
  if (config.partytown.enabled) {
    optimized = injectPartytown(optimized, config.partytown);
  }

  // 15. Add marker + HTML minification
  optimized = optimized.replace('</head>', `${MARKER}\n</head>`);

  if (config.minifyHTML) {
    optimized = minifyHTML(optimized);
  }

  return optimized;
}

// ─── 1. LCP Priority ─────────────────────────────────────────────────────────

/**
 * Set fetchpriority="high" on the hero block image.
 * Our block renderer outputs: <img data-block-type="hero" ...>
 * WHY: LCP = biggest ranking factor. Hero image must load first.
 */
export function injectLCPPriority(html: string): string {
  // First try: find our hero block image
  const heroRegex = /<img(?=[^>]*data-block-type\s*=\s*["'](?:hero|product-hero)["'])(?![^>]*fetchpriority)[^>]*>/i;
  let match = html.match(heroRegex);

  // Fallback: first image without fetchpriority or loading=lazy
  if (!match) {
    const fallbackRegex = /<img(?![^>]*fetchpriority)(?![^>]*loading\s*=\s*["']lazy["'])[^>]*>/i;
    match = html.match(fallbackRegex);
  }

  if (match) {
    const original = match[0];
    const optimized = original
      .replace(/<img/, '<img fetchpriority="high"')
      .replace(/\s*loading\s*=\s*["'][^"']*["']/, '');
    html = html.replace(original, optimized);
  }

  return html;
}

// ─── 2. Lazy Loading ─────────────────────────────────────────────────────────

/**
 * Add loading="lazy" + decoding="async" to non-hero images.
 * Hero already has fetchpriority="high" from step 1.
 * WHY: Images below viewport waste bandwidth. lazy = browser loads when needed.
 */
export function injectLazyLoading(html: string): string {
  return html.replace(
    /<img(?![^>]*fetchpriority)(?![^>]*loading\s*=)([^>]*)>/gi,
    (_match, attrs: string) => `<img${attrs} loading="lazy" decoding="async">`
  );
}

// ─── 3. CLS Prevention (aspect-ratio) ────────────────────────────────────────

/**
 * Add aspect-ratio from tokens.ts IMAGE_RATIOS to images without width/height.
 * Uses data-block-type attribute set by our block renderer.
 *
 * tokens.ts IMAGE_RATIOS:
 *   productHero=4:5, productThumbnail=1:1, banner=21:9,
 *   lifestyle=16:9, beforeAfter=1:1, testimonial=1:1
 *
 * WHY: CLS = Core Web Vital. Images without dimensions = layout shift on load.
 */
export function injectAspectRatio(html: string): string {
  return html.replace(/<img([^>]*)>/gi, (fullMatch, attrs: string) => {
    const hasWidth = /width\s*=/i.test(attrs);
    const hasHeight = /height\s*=/i.test(attrs);
    const hasAspectRatio = /aspect-ratio/i.test(attrs);
    if ((hasWidth && hasHeight) || hasAspectRatio) return fullMatch;

    // Use data-block-type from our renderer (not CSS class names)
    let ratio = '4/5'; // default: productHero (tokens.ts)
    if (/data-block-type\s*=\s*["'](?:hero|product-hero)["']/i.test(attrs)) ratio = '4/5';
    if (/data-block-type\s*=\s*["'](?:thumbnail|product-thumbnail|testimonial|before-after)["']/i.test(attrs)) ratio = '1/1';
    if (/data-block-type\s*=\s*["']banner["']/i.test(attrs)) ratio = '21/9';
    if (/data-block-type\s*=\s*["']lifestyle["']/i.test(attrs)) ratio = '16/9';
    // Custom ratio from block props (overrides above)
    const ratioMatch = attrs.match(/data-ratio\s*=\s*["']([^"']+)["']/i);
    if (ratioMatch) ratio = ratioMatch[1];

    if (/style\s*=/i.test(attrs)) {
      return `<img${attrs.replace(/style\s*=\s*["']/i, `style="aspect-ratio:${ratio};`)}>`;
    }
    return `<img${attrs} style="aspect-ratio:${ratio}">`;
  });
}

// ─── 4. Font Display Swap ────────────────────────────────────────────────────

/**
 * Inject font-display: swap into all @font-face.
 * WHY: Without swap, browsers hide text 3s (FOIT). With swap, text shows immediately
 *      with fallback font (Inter → system sans), then swaps when custom font loads.
 */
export function injectFontDisplaySwap(html: string): string {
  return html.replace(
    /@font-face\s*\{/gi,
    '@font-face { font-display: swap; '
  ).replace(
    /font-display\s*:\s*(?!swap)[^;]+;/gi,
    'font-display: swap;'
  );
}

// ─── 5. Video Preload Metadata ───────────────────────────────────────────────

/**
 * Set preload="metadata" on all <video>.
 * WHY: preload="auto" downloads entire video. preload="metadata" = ~1KB (duration, thumbnail).
 *      User clicks Play → video streams normally. No waste for non-viewers.
 */
export function injectVideoPreloadMetadata(html: string): string {
  return html.replace(
    /<video(?![^>]*preload\s*=)([^>]*)>/gi,
    '<video$1 preload="metadata">'
  ).replace(
    /<video([^>]*\s)preload\s*=\s*["']auto["']([^>]*)>/gi,
    '<video$1preload="metadata"$2>'
  );
}

// ─── 6. Speculation Rules API ────────────────────────────────────────────────

/**
 * Prerender checkout/order pages on hover. Prefetch all internal links.
 * WHY: Speculation Rules (Chrome 121+) = prerender entire page on hover.
 *      Product page → hover "Buy Now" → checkout prerendered → click = instant (<100ms).
 *      Single biggest speed win for funnel conversions.
 */
export function injectSpeculationRules(
  html: string,
  config: SpeedOptimizerConfig['speculationRules'],
): string {
  const prerender = config.prerenderPatterns.length > 0
    ? `"prerender": [{"where": {"href_matches": ${JSON.stringify(config.prerenderPatterns)}}, "eagerness": "${config.prerenderEagerness}"}]`
    : '';

  const prefetch = config.prefetchEnabled
    ? `"prefetch": [{"where": {"and": [{"href_matches": "/*"}, {"not": {"href_matches": ["/logout", "/admin/*", "/api/*"]}}]}, "eagerness": "conservative"}]`
    : '';

  const rules = [prerender, prefetch].filter(Boolean).join(', ');
  if (!rules) return html;

  return html.replace('</head>', `<script type="speculationrules">{${rules}}</script>\n</head>`);
}

// ─── 7. View Transitions ─────────────────────────────────────────────────────

/**
 * Cross-fade between pages (product → checkout → thank-you).
 * WHY: Native browser cross-fade. Reduces perceived load. Zero JS.
 *      Chrome 111+. Graceful degradation for others.
 */
export function injectViewTransitions(html: string): string {
  return html.replace('</head>', `<style>@view-transition{navigation:auto}</style>\n</head>`);
}

// ─── 8. Content Visibility ───────────────────────────────────────────────────

/**
 * Skip rendering off-screen .funnel-section blocks.
 * WHY: content-visibility: auto = browser skips layout+paint for off-screen sections.
 *      30-50% faster initial render on long pages (advertorial, VSL = 10+ sections).
 *      Our CSS uses .funnel-section for every section.
 */
export function injectContentVisibility(
  html: string,
  config: SpeedOptimizerConfig['contentVisibility'],
): string {
  if (!config.enabled) return html;

  const script = `<script>
(function(){
  var sections=document.querySelectorAll('.funnel-section');
  var threshold=window.innerHeight*${config.thresholdMultiplier};
  sections.forEach(function(s){
    var rect=s.getBoundingClientRect();
    if(rect.top>threshold&&!s.style.contentVisibility){
      s.style.contentVisibility='auto';
      s.style.containIntrinsicSize='${config.intrinsicSize}';
    }
  });
})();
</script>`;

  return html.replace('</body>', `${script}\n</body>`);
}

// ─── 9. Optimistic UI ────────────────────────────────────────────────────────

/**
 * Instant visual feedback on add-to-cart buttons.
 * WHY: Perceived speed > actual speed. Click = instant "✓ Added!" (0ms feel)
 *      even if Stripe API takes 500ms. Reduces hesitation on checkout.
 *      Uses data-block-type="add-to-cart" from our block renderer.
 */
export function injectOptimisticUI(
  html: string,
  config: SpeedOptimizerConfig['optimisticUI'],
): string {
  if (!config.enabled) return html;

  const script = `<script>
(function(){
  var feedbackText='${config.feedbackText}';
  var duration=${config.feedbackDuration};
  var btns=document.querySelectorAll('[data-block-type="add-to-cart"],[data-block-type="cta"],[data-block-type="button"]');
  btns.forEach(function(btn){
    btn.addEventListener('click',function(){
      var original=this.innerHTML;
      var originalBg=this.style.background;
      this.setAttribute('data-original',original);
      this.innerHTML=feedbackText;
      this.style.background='#22c55e';
      this.style.pointerEvents='none';
      var self=this;
      setTimeout(function(){
        if(self.getAttribute('data-original')){
          self.innerHTML=self.getAttribute('data-original');
          self.style.background=originalBg||'';
          self.style.pointerEvents='';
          self.removeAttribute('data-original');
        }
      },duration);
    },true);
  });
})();
</script>`;

  return html.replace('</body>', `${script}\n</body>`);
}

// ─── 10. Predictive Prefetch ─────────────────────────────────────────────────

/**
 * Prefetch internal links on 200ms hover. Preloads next page before click.
 * WHY: Combined with Speculation Rules, creates near-instant navigation
 *      between funnel steps (product → checkout → thank-you).
 */
export function injectPredictivePrefetch(html: string): string {
  const script = `<script>
(function(){
  var links=document.querySelectorAll('a[href]');
  var prefetchTimers={};
  links.forEach(function(link){
    link.addEventListener('mouseenter',function(){
      var href=this.href;
      if(href&&!prefetchTimers[href]&&href.startsWith(window.location.origin)){
        prefetchTimers[href]=setTimeout(function(){
          var l=document.createElement('link');
          l.rel='prefetch';
          l.href=href;
          document.head.appendChild(l);
        },200);
      }
    });
    link.addEventListener('mouseleave',function(){
      if(prefetchTimers[this.href]){
        clearTimeout(prefetchTimers[this.href]);
        delete prefetchTimers[this.href];
      }
    });
  });
})();
</script>`;

  return html.replace('</body>', `${script}\n</body>`);
}

// ─── 11. Resource Hints (Preconnect + DNS-prefetch) ───────────────────────────

/**
 * Inject preconnect + dns-prefetch hints for third-party origins.
 * WHY: preconnect = DNS + TCP + TLS handshake done BEFORE the browser needs it.
 *      First image from Supabase Storage = 0ms connection (instead of 200-500ms).
 *      dns-prefetch = DNS only (lighter, for less critical origins).
 */
export function injectResourceHints(
  html: string,
  config: SpeedOptimizerConfig['resourceHints'],
): string {
  const hints: string[] = [];

  for (const origin of config.preconnectOrigins) {
    hints.push(`<link rel="preconnect" href="${origin}" crossorigin>`);
  }

  for (const origin of config.dnsPrefetchOrigins) {
    hints.push(`<link rel="dns-prefetch" href="${origin}">`);
  }

  if (hints.length === 0) return html;

  return html.replace('</head>', `${hints.join('\n')}\n</head>`);
}

// ─── 12. Preload Critical Fonts ───────────────────────────────────────────────

/**
 * Preload critical font files in <head> before browser discovers them in CSS.
 * WHY: Without preload, browser flow = parse HTML → find CSS → request CSS →
 *      parse CSS → find @font-face → request font. That's 4 steps before font download.
 *      With preload = font download starts immediately, parallel to CSS parsing.
 *      tokens.ts fonts: DM Serif Display (heading), Inter (body).
 */
export function injectPreloadFonts(
  html: string,
  config: SpeedOptimizerConfig['preloadFonts'],
): string {
  if (config.fonts.length === 0) return html;

  const links = config.fonts.map(f => {
    const attrs = [
      'rel="preload"',
      'as="font"',
      `type="font/${f.type}"`,
      `href="${f.url}"`,
    ];
    if (f.crossOrigin) attrs.push('crossorigin');
    return `<link ${attrs.join(' ')}>`;
  });

  return html.replace('</head>', `${links.join('\n')}\n</head>`);
}

// ─── 13. Critical CSS Inline ──────────────────────────────────────────────────

/**
 * Inline critical (above-fold) CSS in <head>, async load full stylesheet.
 * WHY: Browser needs CSS before first paint. Without critical CSS:
 *      - Browser waits for FULL stylesheet download before rendering anything.
 *      With critical CSS inlined:
 *      - Browser renders above-fold content immediately from inline <style>.
 *      - Full stylesheet loads async (non-blocking).
 *      Critical CSS is extracted at build time from mobile-first.css.
 */
export function injectCriticalCSS(
  html: string,
  config: SpeedOptimizerConfig['criticalCSS'],
): string {
  if (!config.css) return html;

  let result = html;

  // Inline critical CSS in <head>
  result = result.replace('</head>', `<style>${config.css}</style>\n</head>`);

  // Async load full stylesheet using loadCSS pattern
  // WHY: rel="preload" downloads CSS without blocking render.
  //      onload swaps to rel="stylesheet" so browser applies it.
  if (config.asyncLoadFullStylesheet) {
    result = result.replace(
      /<link([^>]*rel\s*=\s*["']stylesheet["'][^>]*)>/gi,
      (match, attrs: string) => {
        // Skip print media and other conditional stylesheets
        if (/media\s*=\s*["'](?!all|screen)/i.test(attrs)) return match;

        const hrefMatch = attrs.match(/href\s*=\s*["']([^"']+)["']/i);
        if (!hrefMatch) return match;

        const href = hrefMatch[1];
        return (
          `<link rel="preload" as="style" href="${href}" onload="this.onload=null;this.rel='stylesheet'">` +
          `<noscript><link rel="stylesheet" href="${href}"></noscript>`
        );
      }
    );
  }

  return result;
}

// ─── 14. Partytown (Analytics in Web Worker) ──────────────────────────────────

/**
 * Offload analytics scripts to a Web Worker via Partytown.
 * WHY: Analytics scripts (GA, FB Pixel) run on the main thread.
 *      Each script = 50-100ms of JS execution blocking page interactivity.
 *      Partytown moves them to a Web Worker = zero main-thread impact.
 *      Requires @builder.io/partytown installed and snippet in public/~partytown/.
 *      Disabled by default — enable when analytics are added.
 */
export function injectPartytown(
  html: string,
  config: SpeedOptimizerConfig['partytown'],
): string {
  const forwardStr = config.forward.length > 0
    ? `\n  forward: ${JSON.stringify(config.forward)},`
    : '';

  const configScript = `<script>
  window.partytown = {${forwardStr}
    resolveUrl: function(url) {
      return url;
    }
  };
</script>`;

  // Load Partytown library from public/~partytown/
  const loaderScript = '<script src="/~partytown/partytown.js"></script>';

  return html.replace('</head>', `${configScript}\n${loaderScript}\n</head>`);
}

// ─── 15. HTML Minification ───────────────────────────────────────────────────

/**
 * Remove comments, whitespace between tags. Preserve script/style/pre/textarea.
 * WHY: 10-20% smaller HTML. Faster download + faster parse.
 */
export function minifyHTML(html: string): string {
  const preserved: string[] = [];
  let result = html;

  // Preserve script/style/pre/textarea content
  result = result.replace(
    /<(script|style|pre|textarea)[^>]*>[\s\S]*?<\/\1>/gi,
    (match) => {
      preserved.push(match);
      return `___PRESERVED_${preserved.length - 1}___`;
    }
  );

  // Remove HTML comments (keep conditional IE comments)
  result = result.replace(/<!--(?!\[if)[\s\S]*?-->/g, '');

  // Collapse whitespace between tags
  result = result.replace(/\s+/g, ' ');
  result = result.replace(/>\s+</g, '><');
  result = result.replace(/\s+>/g, '>');
  result = result.replace(/\s+\/>/g, '/>');

  // Restore preserved content
  result = result.replace(
    /___PRESERVED_(\d+)___/g,
    (_, idx) => preserved[parseInt(idx)]
  );

  return result.trim();
}
