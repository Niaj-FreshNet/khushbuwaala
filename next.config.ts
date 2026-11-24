import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },

  // Deploys build into a side folder (NEXT_DIST_DIR=.next-build) and swap it in when ready, so
  // the running shop keeps its files while the new version is being built.
  distDir: process.env.NEXT_DIST_DIR || ".next",

  images: {
    formats: ["image/avif", "image/webp"], // ✅ better compression
    minimumCacheTTL: 60 * 60 * 24 * 31,   // resized pictures are kept by browsers for 31 days
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
      { protocol: "https", hostname: "i.ibb.co", pathname: "/**" },
      // ⚠️ try to avoid serving images from API domain if possible
      { protocol: "https", hostname: "api.khushbuwaala.com", pathname: "/**" },
      { protocol: "http", hostname: "api.khushbuwaala.com", pathname: "/**" },
    ],
  },

  experimental: {
    optimizePackageImports: ["@radix-ui/react-icons", "lucide-react"], // ✅ helps bundle
  },

  async redirects() {
    return [
      // One address for the shop: www sends visitors (and Google) to the plain domain.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.khushbuwaala.com" }],
        destination: "https://khushbuwaala.com/:path*",
        permanent: true,
      },
      { source: "/products/:slug", destination: "/product/:slug", permanent: true },
      // Pages taken down on 2026-11-24 (sample content, never real): old links go somewhere useful.
      { source: "/click-collect", destination: "/stores", permanent: false },
      { source: "/news", destination: "/blog", permanent: false },
      // Old addresses Google still asks for (Search Console, "Not found", 2026-11-25)
      { source: "/news/:path*", destination: "/blog", permanent: true },
      { source: "/for-women", destination: "/womens-perfume", permanent: true },
      { source: "/oriental-collection", destination: "/oriental-attar", permanent: true },
      { source: "/oriental/:slug", destination: "/product/:slug", permanent: true },
      { source: "/artificialOud/:slug", destination: "/product/:slug", permanent: true },
      { source: "/inspiredPerfumeOil/:slug", destination: "/product/:slug", permanent: true },
      { source: "/naturalAttar/:slug", destination: "/product/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
