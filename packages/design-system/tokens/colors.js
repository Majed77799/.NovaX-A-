export const light = {
	// Brand
	brand: {
		primary: '#7C5CFF',
		secondary: '#5EEAD4',
		accent: '#FFB3C7'
	},
	// Text
	text: {
		high: '#0F1223',
		medium: '#364152',
		low: '#6C7280',
		inverse: '#FFFFFF'
	},
	// Backgrounds
	background: {
		soft: '#FFFFFF',
		muted: '#F7F8FB',
		// Pastel gradient stops inspired by Ello style
		gradientA: '#F6E7FF',
		gradientB: '#E9F0FF',
		gradientC: '#D7F7FF'
	},
	// Borders
	border: {
		soft: 'rgba(15,18,35,0.08)',
		emphasis: 'rgba(15,18,35,0.14)'
	},
	// Overlays
	overlay: {
		soft: 'rgba(15,18,35,0.04)',
		strong: 'rgba(15,18,35,0.56)'
	},
	// Feedback
	status: {
		success: '#10B981',
		warning: '#F59E0B',
		error: '#EF4444',
		info: '#3B82F6'
	}
};

export const dark = {
	brand: {
		primary: '#9D86FF',
		secondary: '#7DE9D9',
		accent: '#FFC1D3'
	},
	text: {
		high: '#FFFFFF',
		medium: 'rgba(255,255,255,0.82)',
		low: 'rgba(255,255,255,0.64)',
		inverse: '#0F1223'
	},
	background: {
		soft: '#0F1223',
		muted: '#15192D',
		gradientA: '#2C1247',
		gradientB: '#131B3A',
		gradientC: '#0E2430'
	},
	border: {
		soft: 'rgba(255,255,255,0.12)',
		emphasis: 'rgba(255,255,255,0.18)'
	},
	overlay: {
		soft: 'rgba(255,255,255,0.06)',
		strong: 'rgba(0,0,0,0.56)'
	},
	status: {
		success: '#34D399',
		warning: '#FBBF24',
		error: '#F87171',
		info: '#60A5FA'
	}
};

export const gradients = {
	pastel: (c) => [c.background.gradientA, c.background.gradientB, c.background.gradientC],
	brand: (c) => [c.brand.primary, '#B893FF']
};