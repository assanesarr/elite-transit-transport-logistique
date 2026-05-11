import type { NextConfig } from "next";
import nextPWA from "next-pwa";
import packageJson from './package.json';

const pkg = packageJson as typeof packageJson & {
  build?: {
    version?: string;
    branch?: string;
    commit?: string;
    updatedAt?: string;
  };
};


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
    APP_NAME: pkg.name,
    NEXT_PUBLIC_APP_VERSION: pkg.version,

    // =========================
    // BUILD INFO
    // =========================
    NEXT_PUBLIC_BRANCH: pkg.build?.branch || "",
    NEXT_PUBLIC_COMMIT: pkg.build?.commit || "",
    NEXT_PUBLIC_UPDATED_AT: pkg.build?.updatedAt || "",
  },
};

// export default nextConfig;
export default withPWA(nextConfig as any);
