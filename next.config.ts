import type { NextConfig } from "next";
import nextPWA from "next-pwa";
import packageJson from './package.json';


const withPWA = nextPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  webpack(config) {
    return config;
  },
  env: {
    NEXT_PUBLIC_APP_VERSION: packageJson.version,
  },
};

// export default nextConfig;
export default withPWA(nextConfig as any);
