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
    ],
  },
  async rewrites() {
    const backend = process.env.NEXT_PUBLIC_API_URL;
    if (backend) {
      return [
        { source: '/api/proxy/:path*', destination: `${backend}/api/:path*` },
      ];
    }
    return [];
  },
};

export default nextConfig;
