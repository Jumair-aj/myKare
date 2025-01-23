import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public', // Location where the service worker files will be generated
  disable: process.env.NODE_ENV === 'development', // Disable PWA in development mode
});

module.exports = withPWA({
  // Other Next.js configurations here...
});

export default nextConfig;
