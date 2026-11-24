import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },

  images: {
    formats: ["image/avif", "image/webp"], // ✅ better compression
    minimumCacheTTL: 60 * 60 * 24 * 7,    // ✅ cache optimized images 7 days
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
      { source: "/products/:slug", destination: "/product/:slug", permanent: true },
      // Pages taken down on 2026-11-24 (sample content, never real): old links go somewhere useful.
      { source: "/click-collect", destination: "/stores", permanent: false },
      { source: "/news", destination: "/blog", permanent: false },
    ];
  },
};

export default nextConfig;
