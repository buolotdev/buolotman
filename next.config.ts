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
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
      },
      {
        protocol: 'http',
        hostname: 'boulotman-api-env.eba-exncce63.eu-north-1.elasticbeanstalk.com',
      },
      {
        protocol: 'https',
        hostname: 'boulotman-api-env.eba-exncce63.eu-north-1.elasticbeanstalk.com',
      },
      {
        protocol: 'http',
        hostname: 'BoulotMan-API-env.eba-exncce63.eu-north-1.elasticbeanstalk.com',
      },
      {
        protocol: 'https',
        hostname: 'boulotman-api.onrender.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://BoulotMan-API-env.eba-exncce63.eu-north-1.elasticbeanstalk.com';
    return [
      { source: '/api/:path*/', destination: `${backendUrl}/api/:path*/` },
      { source: '/api/:path*', destination: `${backendUrl}/api/:path*/` },
    ];
  },
  trailingSlash: true,
  output: 'standalone',
};

export default nextConfig;
