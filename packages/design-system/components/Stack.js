import React from 'react';
import { View } from 'react-native';

export function Stack({ children, gap = 8, style, align = 'stretch' }) {
	return (
		<View style={[{ flexDirection: 'column', gap, alignItems: align }, style]}>
			{children}
		</View>
	);
}