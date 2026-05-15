/**
 * Cloudflare Worker: Funnel Subdomain Router
 *
 * WHY: Routes *.nutrovia.co subdomains to the Express Router.
 *      Traefik wildcard doesn't work in Coolify, so this Worker
 *      intercepts subdomain requests, extracts the funnel slug,
 *      and forwards to funnels.nutrovia.co with X-Funnel-Slug header.
 *
 * FLOW:
 *   turmeric.nutrovia.co -> Worker -> X-Funnel-Slug: turmeric -> funnels.nutrovia.co -> Router
 *   funnels.nutrovia.co  -> Worker -> pass through (no change) -> Router
 *   app.nutrovia.co      -> Worker -> pass through (no change) -> Next.js
 */

var ROUTER_HOST = 'funnels.nutrovia.co';
var BASE_DOMAIN = 'nutrovia.co';
var BASE_SUFFIX = '.' + BASE_DOMAIN;

function handleRequest(request) {
  var url = new URL(request.url);
  var host = url.hostname;

  if (!host.endsWith(BASE_SUFFIX)) {
    return fetch(request);
  }

  var subdomain = host.slice(0, -BASE_SUFFIX.length);

  if (!subdomain || subdomain === 'funnels' || subdomain === 'app' ||
      subdomain === 'www' || subdomain === 'api' || subdomain === 'admin') {
    return fetch(request);
  }

  var newHeaders = new Headers(request.headers);
  newHeaders.set('X-Funnel-Slug', subdomain);
  newHeaders.set('X-Original-Host', host);

  var newUrl = new URL(url.pathname + url.search, url);
  newUrl.hostname = ROUTER_HOST;

  var newRequest = new Request(newUrl.toString(), {
    method: request.method,
    headers: newHeaders,
    body: request.body,
    redirect: 'manual',
  });

  return fetch(newRequest);
}

addEventListener('fetch', function(event) {
  event.respondWith(handleRequest(event.request));
});
