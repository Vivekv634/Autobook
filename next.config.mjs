import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // API: 'http://localhost:3000',
    API: 'https://autobook1.vercel.app',
    EMAIL: process.env.EMAIL,
    PASSWORD: process.env.PASSWORD,
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    AUTH_DOMAIN: process.env.AUTH_DOMAIN,
    PROJECT_ID: process.env.PROJECT_ID,
    STORAGE_BUCKET: process.env.STORAGE_BUCKET,
    MESSAGING_SENDER_ID: process.env.MESSAGING_SENDER_ID,
    APP_ID: process.env.APP_ID,
    MEASUREMENT_ID: process.env.MEASUREMENT_ID,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      },
    ],
  },
  reactStrictMode: false,
  swcMinify: true,
};

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
})(nextConfig);

export const productionBrowserSourceMaps = true;
