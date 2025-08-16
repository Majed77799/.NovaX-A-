import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../theme';

export function Sidebar({ children }: { children: React.ReactNode }) {
	const { tokens } = useTheme();
	return (
		<View style={{ width: 280, backgroundColor: tokens.colors.surface, borderRightColor: tokens.colors.border, borderRightWidth: 1, padding: tokens.spacing.lg }}>
			{children}
		</View>
	);
}