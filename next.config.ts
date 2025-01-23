import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Ignore ESLint errors during production builds
  },
};

// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public', // Location where the service worker files will be generated
  disable: process.env.NODE_ENV === 'development', // Disable PWA in development mode
});

module.exports = withPWA({
  eslint: {
    ignoreDuringBuilds: true, // Ignore ESLint errors during production builds
  },
});

export default nextConfig;
