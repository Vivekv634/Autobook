/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // API: 'http://localhost:3000',
    API: 'https://notesnook-sand.vercel.app',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
        port: '',
      },
    ],
  },
  reactStrictMode: false,
};

export default nextConfig;
