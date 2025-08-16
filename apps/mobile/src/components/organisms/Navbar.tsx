import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../theme';

export function Navbar({ children }: { children: React.ReactNode }) {
	const { tokens } = useTheme();
	return (
		<View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: tokens.colors.surface, borderTopColor: tokens.colors.border, borderTopWidth: 1, padding: 10 }}>
			{children}
		</View>
	);
}