/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow local, Supabase Storage, and high-quality placeholder CDNs
    domains: ['localhost', 'supabase.co', 'images.pexels.com', 'images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

module.exports = nextConfig;
