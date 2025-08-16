import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { radii } from '../tokens/radii';
import { glassShadow } from '../tokens/shadows';

export function Card({ children, style, elevated = true, padding = 14 }) {
	const { colors, mode } = useTheme();
	const isDark = mode === 'dark';
	return (
		<View style={[
			{ backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.5)', borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.25)', borderRadius: radii.lg, padding },
			elevated ? glassShadow() : null,
			style
		]}>
			{children}
		</View>
	);
}