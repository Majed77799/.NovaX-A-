import React from 'react';
import { View } from 'react-native';
import { Text } from './Text';
import { radii } from '../tokens/radii';

const VARIANTS = {
	neutral: { bg: 'rgba(255,255,255,0.7)', fg: 'high', border: 'rgba(255,255,255,0.25)' },
	success: { bg: 'rgba(16,185,129,0.12)', fg: 'high', border: 'rgba(16,185,129,0.24)' },
	warning: { bg: 'rgba(245,158,11,0.12)', fg: 'high', border: 'rgba(245,158,11,0.24)' },
	error: { bg: 'rgba(239,68,68,0.12)', fg: 'high', border: 'rgba(239,68,68,0.24)' }
};

export function Badge({ children, variant = 'neutral', style }) {
	const v = VARIANTS[variant] || VARIANTS.neutral;
	return (
		<View style={[{ backgroundColor: v.bg, borderColor: v.border, borderWidth: 1, borderRadius: radii.full, paddingHorizontal: 10, paddingVertical: 6 }, style]}>
			<Text size="xs" color={v.fg}>{children}</Text>
		</View>
	);
}