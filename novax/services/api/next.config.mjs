/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
  reactStrictMode: true,
  transpilePackages: ["@novax/core"],
};

export default nextConfig;