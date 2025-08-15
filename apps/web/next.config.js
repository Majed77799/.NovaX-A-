const withPWA = require('next-pwa')({
	dest: 'public',
	disable: process.env.NODE_ENV === 'development'
});

/** @type {import('next').NextConfig} */
const nextConfig = {
	webpack: (config) => {
		config.resolve.alias = {
			...(config.resolve.alias || {}),
			'react-native$': 'react-native-web'
		};
		return config;
	}
};

module.exports = withPWA(nextConfig);