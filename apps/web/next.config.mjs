import withPWA from 'next-pwa';

const isProd = process.env.NODE_ENV === 'production';

export default withPWA({
	dest: 'public',
	disable: !isProd,
	register: true,
	skipWaiting: true,
	buildExcludes: [/middleware-manifest\.json$/]
})({
	experimental: {
		serverActions: { allowedOrigins: ['*'] },
		optimizePackageImports: ['react', 'react-dom']
	},
	transpilePackages: ['@repo/shared', '@repo/ai', '@repo/api-client', '@repo/tokens'],
	reactStrictMode: true,
	swcMinify: true,
	eslint: { ignoreDuringBuilds: true },
	api: { bodyParser: { sizeLimit: '1mb' } },
	images: {
		remotePatterns: [
			{ protocol: 'https', hostname: 'images.unsplash.com' },
			{ protocol: 'https', hostname: 'avatars.githubusercontent.com' },
			{ protocol: 'https', hostname: 'cdn.jsdelivr.net' }
		]
	},
	async headers() {
		const corsOrigin = process.env.NOVAX_CORS_ORIGIN || '*';
		return [
			{
				source: '/api/:path*',
				headers: [
					{ key: 'Access-Control-Allow-Origin', value: corsOrigin },
					{ key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
					{ key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' }
				]
			},
			{
				source: '/_next/static/:path*',
				headers: [
					{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }
				]
			},
			{
				source: '/icons/:path*',
				headers: [
					{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }
				]
			},
			{
				source: '/manifest.webmanifest',
				headers: [
					{ key: 'Cache-Control', value: 'public, max-age=3600' }
				]
			}
		];
	}
});