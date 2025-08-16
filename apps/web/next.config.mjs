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
		serverActions: { allowedOrigins: ['*'] }
	},
	transpilePackages: ['@repo/shared', '@repo/ai', '@repo/api-client', '@repo/ui'],
	reactStrictMode: true,
	eslint: { ignoreDuringBuilds: true },
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
			}
		];
	}
});