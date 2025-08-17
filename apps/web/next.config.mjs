import withPWA from 'next-pwa';

const isProd = process.env.NODE_ENV === 'production';

const baseConfig = {
	experimental: {
		serverComponentsExternalPackages: ['@prisma/client', 'prisma']
	},
	transpilePackages: ['@repo/shared', '@repo/ai', '@repo/api-client', '@repo/db', '@repo/queue', '@repo/watermark'],
	reactStrictMode: true,
	eslint: { ignoreDuringBuilds: true },
	api: { bodyParser: { sizeLimit: '1mb' } },
	async headers() {
		const corsOrigin = process.env.NOVAX_CORS_ORIGIN || '*';
		return [
			{
				source: '/api/:path*',
				headers: [
					{ key: 'Access-Control-Allow-Origin', value: String(corsOrigin) },
					{ key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
					{ key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' }
				]
			}
		];
	}
};

export default withPWA({
	dest: 'public',
	disable: !isProd,
	register: true,
	skipWaiting: true,
	buildExcludes: [/middleware-manifest\.json$/]
})(baseConfig);