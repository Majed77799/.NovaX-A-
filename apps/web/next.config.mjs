import createNextPwa from '@ducanh2912/next-pwa'

const withPWA = createNextPwa({
	// Disable in development
	disable: process.env.NODE_ENV === 'development',
	dest: 'public',
	sw: 'service-worker.js',
})

export default withPWA({
	reactStrictMode: true,
	experimental: { typedRoutes: true },
	transpilePackages: ['@novax/ai', '@novax/i18n', '@novax/shared', '@novax/ui'],
})