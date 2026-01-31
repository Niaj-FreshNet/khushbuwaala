import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.ibb.co",
        pathname: "/**",
      },

      // ✅ ADD THIS
      {
        protocol: "http", // because your URL is http
        hostname: "api.khushbuwaala.com",
        pathname: "/**",
      },
      {
        protocol: "https", // future-proof if you enable SSL later
        hostname: "api.khushbuwaala.com",
        pathname: "/**",
      },
    ],

    domains: [
      "res.cloudinary.com",
      "i.ibb.co",
      "api.khushbuwaala.com", // optional but nice to keep
    ],
  },

  experimental: {
    optimizePackageImports: ["@radix-ui/react-icons"],
  },

  async redirects() {
    return [
      {
        source: "/products/:slug",
        destination: "/product/:slug",
        permanent: true, // ✅ 308 (SEO-friendly)
      },
    ];
  },
};

export default nextConfig;
