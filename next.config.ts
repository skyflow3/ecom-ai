import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  // WHY: No rewrites — they don't execute in standalone mode behind Traefik proxy.
  //      Routing is handled by:
  //        - src/app/route.ts              → "/" homepage (serves public/index.html)
  //        - public/*.html                  → static legal/funnel pages
  //        - src/app/api/funnel/[page]/     → dynamic funnel pages (CTA injection)
  //        - src/middleware.ts              → domain redirect + API key protection
};

export default nextConfig;
