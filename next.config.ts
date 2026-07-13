import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'sxmjwjuwfsvjjqcldziw.supabase.co',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
      },
    ],
  },
  async rewrites() {
    return [
      { source: '/api/:path*', destination: 'http://127.0.0.1:8000/api/:path*' },
    ];
  },
  output: 'standalone',
};

export default nextConfig;
