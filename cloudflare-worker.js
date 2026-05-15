/**
 * Cloudflare Worker: Funnel Subdomain Router with Edge Cache
 *
 * WHY: Routes *.nutrovia.co subdomains to the Express Router.
 *      First request fetches from origin and caches at the edge.
 *      Subsequent requests served from cache (~1ms).
 *
 * FLOW:
 *   Request -> Worker -> cache hit? -> return cached (~1ms)
 *                            |
 *                            miss -> X-Funnel-Slug -> go.nutrovia.co -> Router -> cache + return (~50ms)
 */

var ROUTER_HOST = 'go.nutrovia.co';
var BASE_DOMAIN = 'nutrovia.co';
var BASE_SUFFIX = '.' + BASE_DOMAIN;

function handleRequest(event) {
  var request = event.request;
  var url = new URL(request.url);
  var host = url.hostname;

  if (!host.endsWith(BASE_SUFFIX)) {
    return fetch(request);
  }

  var subdomain = host.slice(0, -BASE_SUFFIX.length);

  // WHY: Reserved subdomains pass through without caching
  if (!subdomain || subdomain === 'go' || subdomain === 'app' ||
      subdomain === 'www' || subdomain === 'api' || subdomain === 'admin') {
    return fetch(request);
  }

  // WHY: Build cache key that includes the subdomain
  //      turmeric.nutrovia.co/checkout -> unique cache entry
  var cacheKey = new Request(url.toString(), request);

  // WHY: Check edge cache first — if hit, return instantly (~1ms)
  var cache = caches.default;
  return cache.match(cacheKey).then(function(cachedResponse) {
    if (cachedResponse) {
      return cachedResponse;
    }

    // WHY: Cache miss — fetch from Router via go.nutrovia.co
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

    return fetch(newRequest).then(function(response) {
      // WHY: Only cache successful HTML responses
      if (response.status === 200) {
        // WHY: Clone before caching — response can only be consumed once
        var responseToCache = response.clone();
        event.waitUntil(cache.put(cacheKey, responseToCache));
      }
      return response;
    });
  });
}

addEventListener('fetch', function(event) {
  event.respondWith(handleRequest(event));
});
