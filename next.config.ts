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
  // WHY: Legal pages served as clean URLs via funnel API route.
  //      Homepage "/" is handled by middleware.ts (rewrites don't work in standalone+Traefik).
  async rewrites() {
    return [
      // ── Legal pages (required for Stripe activation) ──
      { source: "/privacy", destination: "/api/funnel/privacy.html" },
      { source: "/terms", destination: "/api/funnel/terms.html" },
      { source: "/refund", destination: "/api/funnel/refund.html" },
      { source: "/contact", destination: "/api/funnel/contact.html" },

      // ── .html URLs for backward compat (internal funnel links) ──
      { source: "/index.html", destination: "/api/funnel/index.html" },
      { source: "/product.html", destination: "/api/funnel/product.html" },
      { source: "/checkout.html", destination: "/api/funnel/checkout.html" },
      { source: "/thankyou.html", destination: "/api/funnel/thankyou.html" },
      { source: "/oto:num(\\d).html", destination: "/api/funnel/oto:num.html" },
    ];
  },
};

export default nextConfig;
