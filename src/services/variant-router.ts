/**
 * Purpose: Variant Router — generates client-side traffic splitter HTML for A/B testing.
 *          No backend needed. Uses localStorage for sticky sessions.
 * Dependencies: None (pure string builder)
 * Related: funnel-generator.ts (consumer)
 *
 * WHY: A/B testing needs traffic splitting. Client-side means zero backend infrastructure.
 *      AI agents deploy static files and the router handles the split automatically.
 *
 * BEHAVIOR:
 *   - First visit: weighted random selection, stored in localStorage
 *   - Return visit: same variant (sticky session via localStorage)
 *   - Direct variant URL access: works normally (bypasses router)
 *   - Fallback: if JS disabled, shows "Redirecting..." message
 */

export interface RouterVariantEntry {
  /** Variant ID (e.g., 'a', 'b', 'c') */
  id: string;
  /** HTML filename (e.g., 'entry-a.html') */
  file: string;
  /** Traffic weight percentage (e.g., 33 = 33%) */
  weight: number;
}

/**
 * Generate a router HTML page that redirects to the appropriate variant.
 *
 * @param stepId - Funnel step ID (used for localStorage key)
 * @param variants - Variant entries with id, file, and weight
 * @returns Complete HTML string for the router page
 */
export function generateVariantRouter(stepId: string, variants: RouterVariantEntry[]): string {
  // WHY: Using JSON.stringify for safe embedding — no manual escaping needed.
  const variantsJson = JSON.stringify(variants);
  const storageKey = `funnel_${stepId}_variant`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Loading...</title>
<script>
(function() {
  var variants = ${variantsJson};
  var storageKey = '${storageKey}';

  function pickVariant() {
    var assigned = localStorage.getItem(storageKey);
    if (assigned) {
      for (var i = 0; i < variants.length; i++) {
        if (variants[i].id === assigned) return variants[i];
      }
    }
    var rand = Math.random() * 100;
    var cumulative = 0;
    for (var j = 0; j < variants.length; j++) {
      cumulative += variants[j].weight;
      if (rand < cumulative) {
        localStorage.setItem(storageKey, variants[j].id);
        return variants[j];
      }
    }
    var last = variants[variants.length - 1];
    localStorage.setItem(storageKey, last.id);
    return last;
  }

  var chosen = pickVariant();
  if (chosen && chosen.file) {
    window.location.replace(chosen.file);
  }
})();
</script>
</head>
<body style="margin:0;padding:20px;font-family:system-ui,sans-serif;text-align:center;color:#666">
<p>Redirecting...</p>
<noscript>
<p>Please enable JavaScript to continue.</p>
<p style="margin-top:20px">
<a href="${variants[0]?.file ?? '#'}">Click here to continue</a>
</p>
</noscript>
</body>
</html>`;
}
