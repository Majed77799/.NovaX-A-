import withPWA from 'next-pwa';
import bundleAnalyzer from '@next/bundle-analyzer';

const isProd = process.env.NODE_ENV === 'production';
const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === 'true' });

const baseNextConfig = {
	experimental: {
		serverActions: { allowedOrigins: ['*'] }
	},
	modularizeImports: {
		lodash: { transform: 'lodash/{{member}}' },
		'lodash-es': { transform: 'lodash-es/{{member}}' },
		'date-fns': { transform: 'date-fns/{{member}}' }
	},
	swcMinify: true,
	images: { unoptimized: process.env.NEXT_IMAGE_UNOPTIMIZED === 'true' },
	transpilePackages: ['@repo/shared', '@repo/ai', '@repo/api-client'],
	reactStrictMode: true,
	eslint: { ignoreDuringBuilds: true },
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
			}
		];
	}
};

export default withBundleAnalyzer(
	withPWA({
		dest: 'public',
		disable: !isProd,
		register: true,
		skipWaiting: true,
		buildExcludes: [/middleware-manifest\.json$/]
	})(baseNextConfig)
);