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
	transpilePackages: ['@repo/shared', '@repo/ai', '@repo/api-client'],
	reactStrictMode: true
});