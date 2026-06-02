import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // No special config needed — outputFileTracingRoot was only silencing
  // a local multi-lockfile warning and breaks on Vercel.
};

export default nextConfig;
