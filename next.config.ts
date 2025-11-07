import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      new URL("https://cdn.myanimelist.net/images/**"),
      new URL("https://cdn.myanimelist.net/img/**"),
    ],
  },
};

export default nextConfig;
