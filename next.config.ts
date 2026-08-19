import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root — a stray package.json exists in the parent (home)
  // directory, which otherwise makes Next infer the wrong root.
  turbopack: {
    root: __dirname,
  },
  // The order route compresses payment screenshots with sharp. File tracing
  // misses libvips' native .so files on Vercel, so force-include the platform
  // packages for that function.
  outputFileTracingIncludes: {
    "/api/order": ["./node_modules/@img/**/*", "./node_modules/sharp/**/*"],
  },
  // Dev only. Next blocks cross-origin requests for dev assets, and the server
  // boots on localhost — so opening the site from a phone on the LAN
  // (http://<your-ip>:3000) served the HTML but not the client bundle, leaving
  // the page unhydrated: visible, but nothing responded to taps. Allow the
  // private LAN ranges so on-device testing works.
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "172.16.*.*", "*.local"],
};

export default nextConfig;
