import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_APIKEY: process.env.NEXT_PUBLIC_APIKEY,
    NEXT_PUBLIC_AUTHDOMAIN: process.env.NEXT_PUBLIC_AUTHDOMAIN,
    NEXT_PUBLIC_PROJECTID: process.env.NEXT_PUBLIC_PROJECTID,
    NEXT_PUBLIC_STORAGEBUCKET: process.env.NEXT_PUBLIC_STORAGEBUCKET,
    NEXT_PUBLIC_MESSAGINGSENDERID: process.env.NEXT_PUBLIC_MESSAGINGSENDERID,
    NEXT_PUBLIC_APPID: process.env.NEXT_PUBLIC_APPID,
    NEXT_PUBLIC_MEASUREMENTID: process.env.NEXT_PUBLIC_MEASUREMENTID,
    NEXT_PUBLIC_API: process.env.NEXT_PUBLIC_API,
    NEXT_PUBLIC_EMAIL: process.env.NEXT_PUBLIC_EMAIL,
    NEXT_PUBLIC_APIKEY_PUBLIC: process.env.NEXT_PUBLIC_APIKEY_PUBLIC,
    NEXT_PUBLIC_APIKEY_PRIVATE: process.env.NEXT_PUBLIC_APIKEY_PRIVATE,
    NEXT_PUBLIC_FROM_EMAIL: process.env.NEXT_PUBLIC_FROM_EMAIL,
    NEXT_PUBLIC_FROM_NAME: process.env.NEXT_PUBLIC_FROM_NAME,
  },
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [new URL("https://api.dicebear.com/9.x/identicon/svg")],
  },
};

export default nextConfig;
