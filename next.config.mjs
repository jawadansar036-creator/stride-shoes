/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow any http/https hostname so both Unsplash CDN links AND
    // local /uploads/ paths from Next.js's static serving work correctly.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com',
      },
      // Allow any HTTPS host so admin-uploaded images hosted on external CDNs work
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Also serve locally-uploaded images from the public folder without optimisation issues
    localPatterns: [
      {
        pathname: '/uploads/**',
      },
    ],
  },
};

export default nextConfig;
