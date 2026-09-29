import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tshhpufqgcpofxlljgrh.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    // Disable optimization for local images to allow query parameters for cache busting
    unoptimized: true,
  },
};

export default nextConfig;
