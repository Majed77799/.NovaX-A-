/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	presets: [require('nativewind/preset')],
	theme: {
		extend: {
			colors: {
				pastelStart: '#F6E7FF',
				pastelMid: '#E9F0FF',
				pastelEnd: '#D7F7FF',
				glass: 'rgba(255,255,255,0.6)',
				glassBorder: 'rgba(255,255,255,0.25)',
				ink: '#0f1223',
			},
			fontFamily: {
				urbanist: ['Urbanist_400Regular', 'system-ui'],
				urbanistMedium: ['Urbanist_500Medium'],
				urbanistBold: ['Urbanist_700Bold'],
			},
			boxShadow: {
				soft: '0 10px 30px rgba(16,24,40,0.06)'
			}
		}
	}
};