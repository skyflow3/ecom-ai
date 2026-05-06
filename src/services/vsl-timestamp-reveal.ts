/**
 * Purpose: VSL Timestamp Reveal — hide offer sections until viewer hits a specific video timestamp.
 *          The core VSL pattern: video pitches the product, then the buy box "drops" at the perfect moment.
 *          Without this, visitors skip to the price and bounce. With this, they watch the pitch first.
 * Dependencies: None (pure JS injection into rendered HTML)
 * Related: Architecture Finale.md, page-speed-optimizer.ts, blocks.ts
 *
 * WHY: VSL pages that reveal the offer at the right moment convert 2-3x better.
 *      Pattern validated: Emma Relief VSL (vsl1.html) uses Wistia `secondchange` at 32:41.
 *      The offer section (bundle cards + CTA) is hidden with `d-none`, revealed by `dropit()`.
 *
 * Flow: Video plays → agent defines revealTimestamp in block props →
 *       script listens to video player → at timestamp → hide pre-offer, reveal offer.
 *
 * Supports: Wistia, Vidalytics, YouTube, Vimeo, HTML5 <video>
 */

// ─── Configuration ────────────────────────────────────────────────────────────

export interface VSLRevealConfig {
  /** Timestamp in seconds when the offer drops (e.g. 1961 = 32min 41sec) */
  revealAtSeconds: number;
  /** Video player type */
  playerType: 'wistia' | 'vidalytics' | 'youtube' | 'vimeo' | 'html5';
  /** Video ID for desktop (Wistia hash, YouTube ID, etc.) */
  videoId: string;
  /** Video ID for mobile (optional — Emma Relief uses separate Wistia IDs per device) */
  mobileVideoId: string | null;
  /** Breakpoint for mobile video switch (default 768px) */
  mobileBreakpoint: number;
  /** CSS class for sections visible BEFORE the reveal (hidden after) */
  beforeRevealClass: string;
  /** CSS class for sections visible AFTER the reveal (hidden before) */
  afterRevealClass: string;
  /** Animation for the reveal ('fade' | 'slide' | 'instant') */
  revealAnimation: 'fade' | 'slide' | 'instant';
  /** Animation duration in ms */
  animationDuration: number;
  /** Also reveal on video end (if visitor skips to end) */
  revealOnEnd: boolean;
  /** Debug shortcut key (e.g. 'ctrl+b' to manually trigger) */
  debugShortcut: string | null;
}

export const DEFAULT_VSL_REVEAL_CONFIG: VSLRevealConfig = {
  revealAtSeconds: 0,       // Must be set per page
  playerType: 'html5',
  videoId: '',
  mobileVideoId: null,      // Same as videoId if not set
  mobileBreakpoint: 768,    // px — matches Emma Relief pattern
  beforeRevealClass: 'vsl-before-reveal',
  afterRevealClass: 'vsl-after-reveal',
  revealAnimation: 'fade',
  animationDuration: 500,
  revealOnEnd: true,
  debugShortcut: 'ctrl+b',
};

// ─── CSS Styles (injected into <head>) ────────────────────────────────────────

/**
 * Generate CSS for the reveal system.
 * - .vsl-before-reveal sections are visible by default, hidden after reveal
 * - .vsl-after-reveal sections are hidden by default, shown with animation after reveal
 * WHY: CSS handles the initial state + animation. No FOUC (flash of unstyled content).
 */
export function generateVSLRevealCSS(config: VSLRevealConfig): string {
  const transition = config.revealAnimation === 'instant'
    ? 'none'
    : `opacity ${config.animationDuration}ms ease, transform ${config.animationDuration}ms ease`;

  return `<style>
/* VSL Timestamp Reveal System */
.${config.afterRevealClass} {
  display: none;
  opacity: 0;
  transform: translateY(20px);
  transition: ${transition};
}
.${config.afterRevealClass}.vsl-revealed {
  display: block;
  opacity: 1;
  transform: translateY(0);
}
.${config.beforeRevealClass}.vsl-hidden {
  display: none;
}
/* Prevent scroll to offer before reveal */
.${config.afterRevealClass}:not(.vsl-revealed) {
  height: 0;
  overflow: hidden;
  pointer-events: none;
}
</style>`;
}

// ─── Player-Specific Listeners ────────────────────────────────────────────────

/**
 * Generate the video player listener script.
 * Supports: Wistia, Vidalytics, YouTube, Vimeo, HTML5 <video>
 *
 * WHY different players: DTC brands use different video hosts.
 * Wistia = most common for VSL (Emma Relief, PrimalQueen).
 * Vidalytics = popular in DTC for interactive video.
 * YouTube = free option. HTML5 = self-hosted.
 */
export function generatePlayerListener(config: VSLRevealConfig): string {
  const timestampSeconds = config.revealAtSeconds;
  const beforeClass = config.beforeRevealClass;
  const afterClass = config.afterRevealClass;

  // Core reveal function (shared by all players)
  const revealFn = `
function vslRevealOffer() {
  if (window.__vslRevealed) return;
  window.__vslRevealed = true;

  // Hide pre-offer sections
  document.querySelectorAll('.${beforeClass}').forEach(function(el) {
    el.classList.add('vsl-hidden');
  });

  // Reveal offer sections with animation
  document.querySelectorAll('.${afterClass}').forEach(function(el) {
    el.style.display = 'block';
    // Trigger animation on next frame
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        el.classList.add('vsl-revealed');
      });
    });
  });

  // Smooth scroll to offer
  var offerEl = document.querySelector('.${afterClass}');
  if (offerEl) {
    setTimeout(function() {
      offerEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, ${config.animationDuration / 2});
  }
}`;

  // Player-specific time listeners
  let playerScript = '';

  switch (config.playerType) {
    case 'wistia':
      // WHY separate mobile/desktop IDs: Emma Relief uses different Wistia videos per device.
      // Mobile videos are often shorter/vertical, desktop are longer/widescreen.
      const wistiaIdLogic = config.mobileVideoId
        ? `var wistiaID = window.matchMedia("(max-width: ${config.mobileBreakpoint}px)").matches ? '${config.mobileVideoId}' : '${config.videoId}';`
        : `var wistiaID = '${config.videoId}';`;

      playerScript = `
// Wistia player listener (with mobile/desktop video switching)
${wistiaIdLogic}
document.querySelector('.wistia_embed').classList.add('wistia_async_' + wistiaID);

// Load video JSONP
var wistiaScript = document.createElement('script');
wistiaScript.src = 'https://fast.wistia.com/embed/medias/' + wistiaID + '.jsonp';
wistiaScript.async = true;
document.head.appendChild(wistiaScript);

window._wq = window._wq || [];
window._wq.push({
  id: wistiaID,
  onReady: function(video) {
    window.__vslVideo = video;
    video.bind('secondchange', function(s) {
      if (s >= ${timestampSeconds}) {
        vslRevealOffer();
      }
    });
    ${config.revealOnEnd ? `video.bind('end', function() { vslRevealOffer(); });` : ''}
  }
});`;
      break;

    case 'vidalytics':
      playerScript = `
// Vidalytics player listener
window.vidalytics = window.vidalytics || [];
window.vidalytics.push(function(api) {
  api.on('timeupdate', function(time) {
    if (time >= ${timestampSeconds}) {
      vslRevealOffer();
    }
  });
  ${config.revealOnEnd ? `api.on('ended', function() { vslRevealOffer(); });` : ''}
});`;
      break;

    case 'youtube':
      playerScript = `
// YouTube IFrame API listener
function onYouTubeIframeAPIReady() {
  var player = new YT.Player('${config.videoId}', {
    events: {
      onStateChange: function(event) {
        if (event.data === YT.PlayerState.PLAYING) {
          var checkTime = setInterval(function() {
            var currentTime = player.getCurrentTime();
            if (currentTime >= ${timestampSeconds}) {
              clearInterval(checkTime);
              vslRevealOffer();
            }
          }, 1000);
        }
      }
    }
  });
}`;
      break;

    case 'vimeo':
      playerScript = `
// Vimeo player listener
var vimeoPlayer = new Vimeo.Player(document.querySelector('[data-vimeo-id="${config.videoId}"]') || document.querySelector('iframe[src*="${config.videoId}"]'));
vimeoPlayer.on('timeupdate', function(data) {
  if (data.seconds >= ${timestampSeconds}) {
    vslRevealOffer();
  }
});
${config.revealOnEnd ? `vimeoPlayer.on('ended', function() { vslRevealOffer(); });` : ''}`;
      break;

    case 'html5':
      playerScript = `
// HTML5 <video> listener
var html5Video = document.querySelector('video[data-vsl-player]');
if (html5Video) {
  html5Video.addEventListener('timeupdate', function() {
    if (this.currentTime >= ${timestampSeconds}) {
      vslRevealOffer();
    }
  });
  ${config.revealOnEnd ? `html5Video.addEventListener('ended', function() { vslRevealOffer(); });` : ''}
}`;
      break;
  }

  // Debug shortcut (e.g. CTRL+B to manually trigger)
  let debugScript = '';
  if (config.debugShortcut) {
    const keys = config.debugShortcut.split('+').map(k => k.trim());
    const ctrlKey = keys.includes('ctrl');
    const shiftKey = keys.includes('shift');
    const key = keys.find(k => !['ctrl', 'shift', 'alt'].includes(k));

    debugScript = `
document.addEventListener('keydown', function(e) {
  ${ctrlKey ? 'if (!e.ctrlKey) return;' : ''}
  ${shiftKey ? 'if (!e.shiftKey) return;' : ''}
  if (e.key === '${key}') {
    e.preventDefault();
    vslRevealOffer();
  }
});`;
  }

  return `<script>
(function() {
  ${revealFn}
  ${playerScript}
  ${debugScript}
})();
</script>`;
}

// ─── Main Injection Function ──────────────────────────────────────────────────

/**
 * Inject VSL timestamp reveal system into HTML.
 * Adds CSS to <head> and player listener script before </body>.
 *
 * Usage in block renderer:
 * 1. Blocks before the offer get class "vsl-before-reveal"
 * 2. Bundle/CTA blocks get class "vsl-after-reveal"
 * 3. Call injectVSLTimestampReveal() with the video timestamp
 * 4. The script handles everything else
 */
export function injectVSLTimestampReveal(
  html: string,
  config: VSLRevealConfig,
): string {
  if (config.revealAtSeconds <= 0) return html;

  let result = html;

  // Inject CSS in <head>
  result = result.replace('</head>', `${generateVSLRevealCSS(config)}\n</head>`);

  // Inject player listener script before </body>
  result = result.replace('</body>', `${generatePlayerListener(config)}\n</body>`);

  return result;
}

// ─── Block Props Helper ───────────────────────────────────────────────────────

/**
 * Parse a timestamp string (e.g. "32:41", "5:10", "120") to seconds.
 * WHY: Agents define timestamps in human-readable format (MM:SS).
 *      The player API needs seconds.
 */
export function parseTimestamp(timestamp: string): number {
  const parts = timestamp.split(':').map(Number);

  if (parts.length === 1) return parts[0];              // "120" = 120s
  if (parts.length === 2) return parts[0] * 60 + parts[1]; // "5:10" = 310s
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]; // "1:05:30"

  return 0;
}
