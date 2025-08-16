import React from 'react';
import { View } from 'react-native';

export function Row({ children, gap = 8, style, align = 'center', justify = 'flex-start' }) {
	return (
		<View style={[{ flexDirection: 'row', gap, alignItems: align, justifyContent: justify }, style]}>
			{children}
		</View>
	);
}