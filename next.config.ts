import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  

  reactStrictMode: true,

    typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Configures the build output to be a self-contained Node.js server.
  // This is ideal for deploying to environments like Docker, AWS ECS, or any Node.js host.
  // It creates a `.next/standalone` folder with all necessary files.
  // output: 'standalone',

  // Custom webpack configuration.
  // This rule is added to allow importing SVG files as React components.
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },

  // No `rewrites` section is needed as the API will be called directly from the client-side.
  // The API server must be configured with proper CORS headers to allow requests
  // from your application's domain (e.g., http://localhost:3000 for development).
};

export default nextConfig;