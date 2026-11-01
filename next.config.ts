import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Image optimization config */
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  /* Production compression and optimization */
  compress: true,
  productionBrowserSourceMaps: false,

  /* Real HTTP redirects. A redirect() inside a page cannot send a 308 here:
     the root loading.tsx makes responses stream, so the 200 status is
     already out by the time the page runs and the "redirect" becomes a
     client-side one that search engines do not treat as a move. */
  async redirects() {
    return [{ source: "/blog", destination: "/insights", permanent: true }];
  },

  /* Headers for caching and performance */
  async headers() {
    return [
      {
        // Brand assets are replaced in place under the same name, so a day
        // with revalidation rather than `immutable`.
        source: "/(images|videos)/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
      {
        source: "/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
