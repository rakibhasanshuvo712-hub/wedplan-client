import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'https://wedplan-backend-inky.vercel.app/api'}/:path*`,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/payment/success',
        destination: '/dashboard/payment-success',
        permanent: false,
      },
      {
        source: '/payment/cancel',
        destination: '/dashboard/payment-cancel',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
