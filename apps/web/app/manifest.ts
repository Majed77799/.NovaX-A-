import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: 'Unified App',
		short_name: 'Unified',
		description: 'Web + API + PWA',
		start_url: '/',
		display: 'standalone',
		background_color: '#0ea5e9',
		theme_color: '#0ea5e9',
		icons: [
			{ src: '/icons/icon.svg', sizes: 'any', type: 'image/svg+xml' }
		]
	};
}