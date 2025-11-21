import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // We can remove 'unoptimized' now because Netlify handles image optimization!
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allows external images from your blog posts
      },
    ],
  },
};

export default nextConfig;