/**
 * Purpose: CTA URL Injector — post-processes generated HTML to wire CTA buttons to the next funnel page.
 *          Works on FILLED HTML (after template-engine replacement), NOT on .marked.html templates.
 * Dependencies: None (pure string processing)
 * Related: funnel-generator.ts (consumer), template-generator.ts (HTML producer)
 *
 * WHY: Templates have neutral CTA buttons (href="#", onclick="event.preventDefault()").
 *      A complete funnel needs each CTA pointing to the NEXT page.
 *      This injector runs AFTER content generation as a pure post-processing step.
 *
 * DESIGN FOR AI AGENTS:
 *   - One entry point: injectCtaUrls(html, ctaMap, templateId) → { html, ctasInjected }
 *   - Page-type auto-detection from templateId
 *   - Structural targeting (class names, onclick patterns) — no brittle ID matching
 *   - Checkout pages are SKIPPED (backend handles form → OTO1 redirect)
 *
 * CTA PATTERNS BY PAGE TYPE:
 *   advertorial:  <a onclick="linkMethod(event)"> → add href + replace onclick
 *   listicle:     <a class="button w-inline-block" href="#next-step"> → replace href/onclick
 *   product_page: <a class="int-button" href="#next-step"> → replace href/onclick
 *   upsell YES:   <button onclick="callMethod(event)" class="btn-primary"> → replace onclick
 *   upsell NO:    <a onclick="linkMethod(event)" action="route"> → add href + replace onclick
 *   thankyou:     <a class="cta-button|link-width-and-shadow|fk-disable-lazy"> → replace href/onclick
 *   checkout:     SKIP (backend redirect)
 */

// ─── Types ──────────────────────────────────────────────────────────────────────

/** CTA URL mapping — tells the injector where each button should point. */
export interface CtaMapping {
  /** Primary CTA: "Order Now", "YES! Add to order", "Continue Shopping" */
  primary: string;
  /** Decline CTA: "No thanks, I decline" (upsell pages only) */
  decline?: string;
  /** Survey button URL (thank you page only) */
  survey?: string;
  /** Community button URL (thank you page only) */
  community?: string;
  /** Continue shopping URL (thank you page only) */
  continue?: string;
}

/** Result of CTA injection. */
export interface InjectionResult {
  /** Modified HTML with CTA URLs injected */
  html: string;
  /** Number of CTA buttons/links that were modified */
  ctasInjected: number;
}

// ─── Page Type Detection ────────────────────────────────────────────────────────

type PageType = 'advertorial' | 'listicle' | 'product_page' | 'checkout' | 'upsell' | 'downsell' | 'thankyou' | 'optin' | 'quiz' | 'bridge';

/**
 * Detect page type from template ID.
 * WHY: Each page type has unique CTA button patterns requiring different injection strategies.
 */
export function getPageType(templateId: string): PageType {
  if (templateId.includes('advertorial')) return 'advertorial';
  if (templateId.includes('hike-reasons-why') || templateId.includes('listicle')) return 'listicle';
  if (templateId.includes('product-page')) return 'product_page';
  if (templateId.includes('checkout')) return 'checkout';
  if (templateId.includes('upsell')) return 'upsell';
  if (templateId.includes('downsell')) return 'downsell';
  if (templateId.includes('thank-you')) return 'thankyou';
  if (templateId.includes('optin')) return 'optin';
  if (templateId.includes('quiz')) return 'quiz';
  if (templateId.includes('bridge')) return 'bridge';
  return 'advertorial'; // default fallback
}

// ─── Main Entry Point ───────────────────────────────────────────────────────────

/**
 * Inject CTA URLs into generated HTML.
 *
 * @param html - Generated HTML (after template fill, markers replaced)
 * @param ctaMap - Where each CTA button should point
 * @param templateId - Template ID (used to detect page type and CTA patterns)
 * @returns Modified HTML + count of injected CTAs
 */
export function injectCtaUrls(html: string, ctaMap: CtaMapping, templateId: string): InjectionResult {
  const pageType = getPageType(templateId);
  let result = html;
  let count = 0;

  switch (pageType) {
    case 'advertorial': {
      // Target: <a> tags with onclick="linkMethod(event)" — ALL are CTA buttons
      const inject = replaceInTags(html, /<a\s[^>]*onclick="linkMethod\(event\)"[^>]*>/g, ctaMap.primary, 'add_href');
      result = inject.html;
      count = inject.ctasInjected;
      break;
    }

    case 'listicle': {
      // Target: <a> tags with class containing "button w-inline-block" and href="#next-step"
      const inject = replaceInTags(html, /<a\s[^>]*class="[^"]*button w-inline-block[^"]*"[^>]*>/g, ctaMap.primary, 'replace_next_step');
      result = inject.html;
      count = inject.ctasInjected;
      break;
    }

    case 'product_page': {
      // Target: <a> tags with class containing "int-button" and href="#next-step"
      const inject = replaceInTags(html, /<a\s[^>]*class="[^"]*int-button[^"]*"[^>]*>/g, ctaMap.primary, 'replace_next_step');
      result = inject.html;
      count = inject.ctasInjected;
      break;
    }

    case 'upsell':
    case 'downsell': {
      // Two targets: YES buttons (callMethod) + decline links (linkMethod)

      // YES buttons: <button onclick="callMethod(event)">
      const yesInject = replaceInTags(result, /<button\s[^>]*onclick="callMethod\(event\)"[^>]*>/g, ctaMap.primary, 'button');
      result = yesInject.html;
      count += yesInject.ctasInjected;

      // Decline links: <a onclick="linkMethod(event)"> (NOT data-cc-link-attribution)
      const declineInject = replaceInTags(result, /<a\s[^>]*onclick="linkMethod\(event\)"[^>]*>/g, ctaMap.decline ?? ctaMap.primary, 'add_href');
      result = declineInject.html;
      count += declineInject.ctasInjected;
      break;
    }

    case 'thankyou': {
      // Three button types, each identified by unique class name
      const buttons: Array<{ cls: string; url: string }> = [
        { cls: 'cta-button', url: ctaMap.survey ?? '#' },
        { cls: 'link-width-and-shadow', url: ctaMap.community ?? '#' },
        { cls: 'fk-disable-lazy', url: ctaMap.continue ?? ctaMap.primary ?? '#' },
      ];

      for (const btn of buttons) {
        if (btn.url === '#') continue;
        const regex = new RegExp(`<a\\s[^>]*class="[^"]*${escapeRegex(btn.cls)}[^"]*"[^>]*>`, 'g');
        const inject = replaceInTags(result, regex, btn.url, 'replace_hash');
        result = inject.html;
        count += inject.ctasInjected;
      }
      break;
    }

    case 'checkout':
      // SKIP — backend handles checkout → OTO1 redirect after payment
      break;

    case 'optin':
    case 'quiz':
    case 'bridge':
      // Generic CTA pattern — same as advertorial (linkMethod <a> tags)
      const genericInject = replaceInTags(html, /<a\s[^>]*onclick="linkMethod\(event\)"[^>]*>/g, ctaMap.primary, 'add_href');
      result = genericInject.html;
      count = genericInject.ctasInjected;
      break;
  }

  // ─── Universal block-mode CTA injection ───────────────────────────────────────
  // WHY: Block system pages use data-funnel-cta attribute instead of template-specific
  //      patterns (linkMethod, int-button, etc.). This runs AFTER template-specific
  //      injection, so template pages are unaffected (they don't have data-funnel-cta).
  const universalLinkRegex = /<a\s[^>]*data-funnel-cta[^>]*href="[^"]*"[^>]*>/g;
  const universalBtnRegex = /<button\s[^>]*data-funnel-cta[^>]*>/g;

  // <a data-funnel-cta href="..."> → replace href + add onclick
  const linkInject = replaceUniversalCta(result, universalLinkRegex, ctaMap.primary);
  result = linkInject.html;
  count += linkInject.ctasInjected;

  // <button data-funnel-cta> → add onclick
  const btnInject = replaceUniversalCta(result, universalBtnRegex, ctaMap.primary);
  result = btnInject.html;
  count += btnInject.ctasInjected;

  return { html: result, ctasInjected: count };
}

// ─── Core Injection Logic ───────────────────────────────────────────────────────

/**
 * Universal CTA replacement for block-mode pages.
 * WHY: Block system uses data-funnel-cta attribute for all CTA elements.
 *      Works with both <a> and <button> elements.
 */
function replaceUniversalCta(html: string, tagRegex: RegExp, url: string): InjectionResult {
  if (!url || url === '#') return { html, ctasInjected: 0 };

  const escaped = url.replace(/'/g, "\\'");
  const matches = html.match(tagRegex);
  const ctasInjected = matches ? matches.length : 0;

  if (ctasInjected === 0) return { html, ctasInjected: 0 };

  const result = html.replace(tagRegex, (tag) => {
    const onclickAttr = `onclick="window.location.href='${escaped}'; return false;"`;

    // If it has an href, replace it + replace/add onclick
    if (tag.includes('href=')) {
      let modified = tag.replace(/href="[^"]*"/, `href="${url}"`);
      if (modified.includes('onclick=')) {
        modified = modified.replace(/onclick="[^"]*?"/, onclickAttr);
      } else {
        // No existing onclick — add it after the last attribute before >
        modified = modified.replace(/>$/, ` ${onclickAttr}>`);
      }
      return modified;
    }
    // Button without href — replace or add onclick
    if (tag.includes('onclick=')) {
      return tag.replace(/onclick="[^"]*?"/, onclickAttr);
    }
    // No onclick at all — inject it before the closing >
    return tag.replace(/>$/, ` ${onclickAttr}>`);
  });

  return { html: result, ctasInjected };
}

type InjectionMode = 'add_href' | 'replace_next_step' | 'replace_hash' | 'button';

/**
 * Replace CTA attributes in all tags matching the regex.
 *
 * Modes:
 *   'add_href'         — For <a> tags WITHOUT href: add href + replace onclick
 *   'replace_next_step' — For <a> tags WITH href="#next-step": replace href + data-original-href + onclick
 *   'replace_hash'      — For <a> tags WITH href="#": replace href + data-original-href + onclick
 *   'button'            — For <button> tags: replace onclick only
 */
function replaceInTags(html: string, tagRegex: RegExp, url: string, mode: InjectionMode): InjectionResult {
  if (!url || url === '#') return { html, ctasInjected: 0 };

  const escaped = url.replace(/'/g, "\\'");
  const matches = html.match(tagRegex);
  const ctasInjected = matches ? matches.length : 0;

  if (ctasInjected === 0) return { html, ctasInjected: 0 };

  const result = html.replace(tagRegex, (tag) => {
    switch (mode) {
      case 'add_href':
        // Add href + replace onclick (for tags without href attribute)
        return tag
          .replace(
            /onclick="[^"]*?"/,
            `onclick="window.location.href='${escaped}'; return false;"`
          )
          .replace('<a ', `<a href="${url}" `);

      case 'replace_next_step':
        // Replace href="#next-step" + data-original-href + onclick
        return tag
          .replace(/href="#next-step"/, `href="${url}"`)
          .replace(/data-original-href="[^"]*?"/, `data-original-href="${url}"`)
          .replace(
            /onclick="[^"]*?"/,
            `onclick="window.location.href='${escaped}'; return false;"`
          );

      case 'replace_hash':
        // Replace href="#" + data-original-href="#" + onclick
        return tag
          .replace(/href="#"/, `href="${url}"`)
          .replace(/data-original-href="[^"]*?"/, `data-original-href="${url}"`)
          .replace(
            /onclick="[^"]*?"/,
            `onclick="window.location.href='${escaped}'; return false;"`
          );

      case 'button':
        // Replace onclick only (buttons don't have href)
        return tag.replace(
          /onclick="[^"]*?"/,
          `onclick="window.location.href='${escaped}'; return false;"`
        );
    }
  });

  return { html: result, ctasInjected };
}

// ─── Helpers ────────────────────────────────────────────────────────────────────

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
