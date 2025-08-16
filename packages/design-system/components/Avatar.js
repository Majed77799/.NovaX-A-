import React from 'react';
import { Image, View } from 'react-native';
import { Text } from './Text';
import { radii } from '../tokens/radii';
import { useTheme } from '../theme/ThemeProvider';

export function Avatar({ uri, name = '', size = 40, style }) {
	const initials = name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
	const { colors } = useTheme();
	return (
		<View style={[{ width: size, height: size, borderRadius: size/2, backgroundColor: 'rgba(255,255,255,0.7)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center' }, style]}>
			{uri ? (
				<Image source={{ uri }} style={{ width: size, height: size, borderRadius: size/2 }} />
			) : (
				<Text size="sm" color="high">{initials}</Text>
			)}
		</View>
	);
}