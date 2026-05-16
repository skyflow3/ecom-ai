/**
 * Purpose: Inject tracking snippet into deployed funnel pages and redeploy.
 *          No MiMo regeneration needed — just HTML modification.
 * Dependencies: Node.js fetch API
 * Related: src/services/funnel-metrics.ts (generateTrackingSnippet)
 *
 * WHY: Deployed pages were generated BEFORE tracking injection was added.
 *      This script fetches each page, adds the snippet, and deploys via Router API.
 *
 * Usage: npx tsx scripts/inject-tracking-deploy.ts --slug=nutrovia
 */

const ROUTER_URL = process.env.ROUTER_URL || 'https://go.nutrovia.co';
// WHY: Use go.nutrovia.co domain — direct IP not routable (behind Traefik)
const DEPLOY_URL = process.env.DEPLOY_URL || 'http://go.nutrovia.co';

// ─── Tracking Snippet (same as generateTrackingSnippet in funnel-metrics.ts) ──

function generateTrackingSnippet(stepId: string, variantId: string): string {
  return `<script data-funnel-track="${stepId}/${variantId}">
(function(){
  var stepId="${stepId}", variantId="${variantId}";

  function track(type, url) {
    var payload = { step: stepId, variant: variantId, type: type, url: url || '', ts: Date.now() };
    try {
      var stored = JSON.parse(localStorage.getItem('funnel_events') || '[]');
      stored.push(payload);
      if (stored.length > 500) stored = stored.slice(-500);
      localStorage.setItem('funnel_events', JSON.stringify(stored));
    } catch(e) {}
    try {
      navigator.sendBeacon && navigator.sendBeacon('/track', JSON.stringify(payload));
    } catch(e) {}
  }

  track('pageView', window.location.href);

  document.addEventListener('click', function(e) {
    var el = e.target.closest('a[href], button[onclick]');
    if (el) {
      var href = el.getAttribute('href') || '';
      if (href && href !== '#' && !href.startsWith('javascript')) {
        track('ctaClick', href);
      }
    }
  });
})();
</script>`;
}

// ─── Pages per funnel ──────────────────────────────────────────────────────────

const FUNNEL_PAGES: Record<string, string[]> = {
  nutrovia: ['index.html', 'oto1.html', 'oto2.html', 'oto3.html', 'oto4.html', 'oto5.html', 'thankyou.html'],
  vibriance: ['index.html', 'oto1.html', 'oto2.html', 'oto3.html', 'oto4.html', 'oto5.html', 'thankyou.html'],
};

// ─── Step ID mapping ───────────────────────────────────────────────────────────
// WHY: The tracking snippet needs stepId and variantId.
//      For existing deployed pages, stepId = filename without extension, variantId = 'a' (single variant).

function getStepId(filename: string): string {
  if (filename === 'index.html') return 'entry';
  if (filename === 'thankyou.html') return 'thankyou';
  return filename.replace('.html', ''); // oto1, oto2, etc.
}

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const slug = process.argv.find(a => a.startsWith('--slug='))?.split('=')[1];
  if (!slug) {
    console.error('Usage: npx tsx scripts/inject-tracking-deploy.ts --slug=nutrovia');
    process.exit(1);
  }

  const pages = FUNNEL_PAGES[slug];
  if (!pages) {
    console.error(`Unknown funnel: ${slug}. Available: ${Object.keys(FUNNEL_PAGES).join(', ')}`);
    process.exit(1);
  }

  console.log(`\n=== Injecting tracking into ${slug} funnel (${pages.length} pages) ===\n`);

  const deployed: string[] = [];
  const failed: string[] = [];

  for (const page of pages) {
    const stepId = getStepId(page);
    const variantId = 'a'; // Single variant for existing funnels

    // 1. Fetch current HTML
    const fetchUrl = `${ROUTER_URL}/${slug}/${page}`;
    console.log(`Fetching ${page}...`);

    const response = await fetch(fetchUrl);
    if (response.status === 404) {
      console.log(`  SKIP: ${page} not found (404)`);
      continue;
    }
    if (!response.ok) {
      console.error(`  FAIL: ${response.status} for ${page}`);
      failed.push(page);
      continue;
    }

    let html = await response.text();

    // 2. Check if tracking already exists
    if (html.includes('data-funnel-track')) {
      console.log(`  SKIP: ${page} already has tracking`);
      continue;
    }

    // 3. Inject tracking snippet before </body>
    const snippet = generateTrackingSnippet(stepId, variantId);
    html = html.replace('</body>', snippet + '\n</body>');

    // 4. Deploy via Router API
    console.log(`  Deploying ${page}...`);
    try {
      const deployResponse = await fetch(`${DEPLOY_URL}/deploy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Host': 'go.nutrovia.co',
        },
        body: JSON.stringify({
          slug,
          filename: page,
          html,
        }),
      });

      if (deployResponse.ok) {
        console.log(`  OK: ${page} deployed with tracking`);
        deployed.push(page);
      } else {
        const text = await deployResponse.text();
        console.error(`  FAIL: ${page} deploy → ${deployResponse.status}: ${text.slice(0, 100)}`);
        failed.push(page);
      }
    } catch (err) {
      console.error(`  FAIL: ${page} deploy → ${err instanceof Error ? err.message : String(err)}`);
      failed.push(page);
    }
  }

  console.log(`\n=== Results ===`);
  console.log(`Deployed: ${deployed.length}/${pages.length}`);
  if (failed.length > 0) console.log(`Failed: ${failed.join(', ')}`);
  console.log(`\nDone.`);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
