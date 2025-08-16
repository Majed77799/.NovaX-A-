import withPWA from 'next-pwa';

const isProd = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: { serverActions: { bodySizeLimit: '5mb' } },
	images: { remotePatterns: [ { protocol: 'https', hostname: '**' } ] },
	eslint: { ignoreDuringBuilds: true }
};

const withPWAConfigured = withPWA({
	dest: 'public',
	disable: !isProd,
	register: true,
	skipWaiting: true
});

export default withPWAConfigured(nextConfig);