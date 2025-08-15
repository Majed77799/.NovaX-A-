import withPWA from 'next-pwa';

// eslint-disable-next-line no-undef
const isDev = typeof process !== 'undefined' ? process.env.NODE_ENV !== 'production' : true;

const withPWAWrapped = withPWA({
	/*
	 next-pwa v5 works with Next 14.
	 dest 'public' generates sw.js under public
	*/
	dest: 'public',
	disable: false,
	register: true,
	skipWaiting: true
});

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	compiler: {
		removeConsole: isDev ? false : { exclude: ['error'] }
	}
};

export default withPWAWrapped(nextConfig);