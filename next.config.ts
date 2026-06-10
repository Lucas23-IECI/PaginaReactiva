import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'reactiva.cl',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
