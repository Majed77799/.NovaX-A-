import { ColorValue } from 'react-native';

export type ColorPalette = {
	background: string;
	surface: string;
	surfaceAlt: string;
	card: string;
	border: string;
	textPrimary: string;
	textSecondary: string;
	textMuted: string;
	primary: string;
	secondary: string;
	success: string;
	warning: string;
	danger: string;
	shadow: string;
};

export type Gradient = string[];

export type Spacing = {
	xs: number; // 4 — half-step, allowed for fine-tuning
	sm: number; // 8
	md: number; // 16
	lg: number; // 24
	xl: number; // 32
	xxl: number; // 40
	xxxl: number; // 48
};

export type Radii = {
	sm: number;
	md: number;
	lg: number;
	xl: number;
	pill: number;
	full: number;
};

export type Typography = {
	fontFamilyRegular: string;
	fontFamilyMedium: string;
	fontFamilyBold: string;
	sizeXs: number;
	sizeSm: number;
	sizeMd: number;
	sizeLg: number;
	sizeXl: number;
	sizeDisplay: number;
	lineBase: number;
};

export type Tokens = {
	colors: ColorPalette;
	gradients: {
		brand: Gradient; // purple -> pink -> blue
		card: Gradient;
		button: Gradient;
	};
	spacing: Spacing;
	radii: Radii;
	typography: Typography;
	iconSize: {
		sm: number;
		md: number;
		lg: number;
	};
};

export const lightColors: ColorPalette = {
	background: '#F8FAFF',
	surface: 'rgba(255,255,255,0.9)',
	surfaceAlt: 'rgba(255,255,255,0.7)',
	card: 'rgba(255,255,255,0.85)',
	border: 'rgba(16,24,40,0.08)',
	textPrimary: '#0B1020',
	textSecondary: 'rgba(11,16,32,0.72)',
	textMuted: 'rgba(11,16,32,0.52)',
	primary: '#8B5CF6', // purple-500
	secondary: '#06B6D4', // cyan-500
	success: '#10B981',
	warning: '#F59E0B',
	danger: '#EF4444',
	shadow: '#101828',
};

export const darkColors: ColorPalette = {
	background: '#0B0F1A',
	surface: 'rgba(15,18,35,0.8)',
	surfaceAlt: 'rgba(15,18,35,0.6)',
	card: 'rgba(15,18,35,0.7)',
	border: 'rgba(255,255,255,0.08)',
	textPrimary: '#E5E8F0',
	textSecondary: 'rgba(229,232,240,0.76)',
	textMuted: 'rgba(229,232,240,0.56)',
	primary: '#A78BFA',
	secondary: '#22D3EE',
	success: '#34D399',
	warning: '#FBBF24',
	danger: '#F87171',
	shadow: '#000000',
};

export const gradients = {
	brand: ['#D6BCFA', '#FBCFE8', '#BAE6FD'], // pastel purple -> pink -> blue
	card: ['#FFFFFF', 'rgba(255,255,255,0.7)'],
	button: ['#A78BFA', '#F472B6', '#60A5FA'],
};

export const spacing: Spacing = {
	xs: 4,
	sm: 8,
	md: 16,
	lg: 24,
	xl: 32,
	xxl: 40,
	xxxl: 48,
};

export const radii: Radii = {
	sm: 8,
	md: 12,
	lg: 16,
	xl: 24,
	pill: 999,
	full: 9999,
};

export const typography: Typography = {
	fontFamilyRegular: 'Urbanist_400Regular',
	fontFamilyMedium: 'Urbanist_600SemiBold',
	fontFamilyBold: 'Urbanist_700Bold',
	sizeXs: 12,
	sizeSm: 14,
	sizeMd: 16,
	sizeLg: 20,
	sizeXl: 24,
	sizeDisplay: 32,
	lineBase: 22,
};

export const iconSize = { sm: 18, md: 22, lg: 28 } as const;

export const lightTokens: Tokens = {
	colors: lightColors,
	gradients,
	spacing,
	radii,
	typography,
	iconSize,
};

export const darkTokens: Tokens = {
	colors: darkColors,
	gradients,
	spacing,
	radii,
	typography,
	iconSize,
};