import { ExpoConfig, ConfigContext } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
	...config,
	name: 'NovaX Mobile',
	slug: 'novax-mobile',
	scheme: 'novax',
	version: '0.1.0',
	updates: { url: '' },
	plugins: ['expo-router'],
	experiments: { typedRoutes: true }
});