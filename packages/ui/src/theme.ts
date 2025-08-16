export type ColorScale = {
	50: string; 100: string; 200: string; 300: string; 400: string; 500: string; 600: string; 700: string; 800: string; 900: string;
};

export type ThemeTokens = {
	colors: {
		background: string;
		surface: string;
		muted: string;
		text: string;
		textMuted: string;
		primary: ColorScale;
		success: ColorScale;
		warning: ColorScale;
		danger: ColorScale;
		accent: ColorScale;
		border: string;
		shadow: string;
	};
	spacing: { xs: number; sm: number; md: number; lg: number; xl: number; '2xl': number };
	radius: { sm: number; md: number; lg: number; xl: number; pill: number };
	shadows: { sm: string; md: string; lg: string; xl: string };
	z: { dropdown: number; modal: number; toast: number; popover: number; tooltip: number };
	motion: { durationSm: number; durationMd: number; durationLg: number; springStiffness: number; springDamping: number };
};

export const lightTheme: ThemeTokens = {
	colors: {
		background: '#fbfbfe',
		surface: 'rgba(255,255,255,0.7)',
		muted: '#f2f4f8',
		text: '#0f1223',
		textMuted: '#5b607a',
		primary: {
			50: '#f4f2ff', 100: '#ece8ff', 200: '#d8d0ff', 300: '#c2b6ff', 400: '#a792ff', 500: '#8a6cff', 600: '#6b46ff', 700: '#5a38e6', 800: '#482fba', 900: '#35258f'
		},
		success: { 50: '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0', 300: '#86efac', 400: '#4ade80', 500: '#22c55e', 600: '#16a34a', 700: '#15803d', 800: '#166534', 900: '#14532d' },
		warning: { 50: '#fffbeb', 100: '#fef3c7', 200: '#fde68a', 300: '#fcd34d', 400: '#fbbf24', 500: '#f59e0b', 600: '#d97706', 700: '#b45309', 800: '#92400e', 900: '#78350f' },
		danger: { 50: '#fef2f2', 100: '#fee2e2', 200: '#fecaca', 300: '#fca5a5', 400: '#f87171', 500: '#ef4444', 600: '#dc2626', 700: '#b91c1c', 800: '#991b1b', 900: '#7f1d1d' },
		accent: { 50: '#eefbfd', 100: '#d9f5fb', 200: '#b6ecf7', 300: '#88def0', 400: '#5fcae6', 500: '#38bdf8', 600: '#1996cf', 700: '#0e74a6', 800: '#0c5f86', 900: '#0b4d6b' },
		border: 'rgba(15,18,35,0.10)',
		shadow: 'rgba(16, 24, 40, 0.08)'
	},
	spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, '2xl': 32 },
	radius: { sm: 6, md: 10, lg: 14, xl: 20, pill: 999 },
	shadows: {
		sm: '0 2px 8px rgba(16,24,40,0.06)',
		md: '0 8px 24px rgba(16,24,40,0.08)',
		lg: '0 12px 36px rgba(16,24,40,0.10)',
		xl: '0 18px 48px rgba(16,24,40,0.12)'
	},
	z: { dropdown: 20, modal: 40, toast: 50, popover: 30, tooltip: 60 },
	motion: { durationSm: 140, durationMd: 220, durationLg: 300, springStiffness: 220, springDamping: 26 }
};

export const darkTheme: ThemeTokens = {
	...lightTheme,
	colors: {
		...lightTheme.colors,
		background: '#0b0d17',
		surface: 'rgba(17,18,28,0.6)',
		muted: '#121524',
		text: '#e7e9f7',
		textMuted: '#a8adcd',
		border: 'rgba(231,233,247,0.12)',
		shadow: 'rgba(0,0,0,0.45)'
	}
};

export type ThemeName = 'light' | 'dark';