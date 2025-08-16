import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { radii } from '../tokens/radii';

export function Surface({ children, style, rounded = 'lg', padding = 12, bordered = true, background = 'soft' }) {
	const { colors } = useTheme();
	return (
		<View style={[
			{ backgroundColor: colors.background[background] || colors.background.soft, borderRadius: radii[rounded] || radii.lg, padding, borderWidth: bordered ? 1 : 0, borderColor: colors.border.soft },
			style
		]}>
			{children}
		</View>
	);
}