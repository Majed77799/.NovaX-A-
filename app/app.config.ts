import { ExpoConfig } from 'expo/config';

export default ({ config }: { config: ExpoConfig }) => ({
	...config,
	extra: {
		EAS_PROJECT_ID: process.env.EAS_PROJECT_ID,
		STRIPE_KEY: process.env.STRIPE_KEY,
		GUMROAD_PRODUCT: process.env.GUMROAD_PRODUCT,
	},
	name: 'app',
	slug: 'app',
	version: '1.0.0',
	orientation: 'portrait',
	icon: './assets/icon.png',
	userInterfaceStyle: 'light',
	newArchEnabled: true,
	splash: {
		image: './assets/splash-icon.png',
		resizeMode: 'contain',
		backgroundColor: '#ffffff',
	},
	ios: { supportsTablet: true },
	android: {
		adaptiveIcon: {
			foregroundImage: './assets/adaptive-icon.png',
			backgroundColor: '#ffffff',
		},
		edgeToEdgeEnabled: true,
	},
	web: {
		bundler: 'metro',
		favicon: './assets/favicon.png',
		name: 'App',
		display: 'standalone',
		backgroundColor: '#ffffff',
		themeColor: '#ffffff',
	},
});
//