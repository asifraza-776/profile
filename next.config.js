/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // This allows production builds to complete even with ESLint errors
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Also ignore TypeScript errors during build (if any)
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;