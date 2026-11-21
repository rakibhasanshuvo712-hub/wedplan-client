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
    const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL;
    const envUrl = process.env.NEXT_PUBLIC_API_URL;
    const defaultProdUrl = 'https://wedplan-backend-inky.vercel.app/api';

    // In production or on Vercel, fallback to deployed backend if env is empty or points to localhost
    const targetUrl = isProduction && (!envUrl || envUrl.includes('localhost'))
      ? defaultProdUrl
      : (envUrl || 'http://localhost:5000/api');

    const cleanTarget = targetUrl.replace(/\/$/, '');

    return [
      {
        source: '/api/:path*',
        destination: `${cleanTarget}/:path*`,
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
