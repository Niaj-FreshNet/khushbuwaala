import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
      {
        protocol: "http",
        hostname: "api.khushbuwaala.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.khushbuwaala.com",
        pathname: "/**",
      },
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
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
