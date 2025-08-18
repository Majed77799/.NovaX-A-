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
		optimizePackageImports: ['react', 'react-dom', 'framer-motion']
	},
	transpilePackages: ['@repo/shared', '@repo/ai', '@repo/api-client'],
	reactStrictMode: true,
	swcMinify: true,
	eslint: { ignoreDuringBuilds: true },
	images: {
		remotePatterns: [
			// Add your external image hosts here as needed
			{ protocol: 'https', hostname: '**', pathname: '/**' }
		]
	},
	api: { bodyParser: { sizeLimit: '1mb' } },
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
			// Aggressive static asset caching
			{
				source: '/_next/static/:path*',
				headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }]
			},
			{
				source: '/_next/image/:path*',
				headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }]
			},
			{
				source: '/:all*(svg|jpg|jpeg|png|gif|webp|avif|ico|css|js|woff|woff2)',
				headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }]
			}
		];
	}
});