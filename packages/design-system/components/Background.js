import React from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme/ThemeProvider';
import { gradients } from '../tokens/colors';

export function Background({ children, style }) {
	const { colors } = useTheme();
	return (
		<LinearGradient colors={gradients.pastel(colors)} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[{ flex: 1 }, style]}>
			{children}
		</LinearGradient>
	);
}