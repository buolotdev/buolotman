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
      { source: '/media/:path*', destination: `${backendUrl}/media/:path*` },
    ];
  },
  async redirects() {
    return [
      {
        source: '/admin/users/:path*',
        destination: '/dashboard/admin/users/',
        permanent: false,
      },
      {
        source: '/admin/verification/:path*',
        destination: '/dashboard/admin/verification/',
        permanent: false,
      },
      {
        source: '/admin/disputes/:path*',
        destination: '/dashboard/admin/disputes/',
        permanent: false,
      },
      {
        source: '/admin/tasks/:path*',
        destination: '/dashboard/admin/tasks/',
        permanent: false,
      },
      {
        source: '/admin/payments/:path*',
        destination: '/dashboard/admin/payments/',
        permanent: false,
      },
      {
        source: '/admin/settings/:path*',
        destination: '/dashboard/admin/settings/',
        permanent: false,
      },
      {
        source: '/admin/support/:path*',
        destination: '/dashboard/admin/support/',
        permanent: false,
      },
      {
        source: '/admin/messages/:path*',
        destination: '/dashboard/admin/messages/',
        permanent: false,
      },
      {
        source: '/admin/',
        destination: '/dashboard/admin/',
        permanent: false,
      },
    ];
  },
  trailingSlash: true,
  output: 'standalone',
};

export default nextConfig;
