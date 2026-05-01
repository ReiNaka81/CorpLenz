import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @cloudflare/next-on-pages requires this
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
