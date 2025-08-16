import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../theme';
import { Text } from './Text';

export type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger' | 'brand';

export function Badge({ label, tone = 'neutral' }: { label: string; tone?: BadgeTone }) {
	const { tokens } = useTheme();
	const backgroundColor =
		tone === 'success' ? 'rgba(16,185,129,0.15)' :
		tone === 'warning' ? 'rgba(245,158,11,0.15)' :
		tone === 'danger' ? 'rgba(239,68,68,0.15)' :
		tone === 'brand' ? 'rgba(167,139,250,0.18)' :
		'rgba(16,24,40,0.06)';
	const color =
		tone === 'success' ? '#059669' :
		tone === 'warning' ? '#B45309' :
		tone === 'danger' ? '#B91C1C' :
		tone === 'brand' ? tokens.colors.primary :
		tokens.colors.textSecondary;
	return (
		<View style={{ backgroundColor, paddingHorizontal: 10, paddingVertical: 6, borderRadius: tokens.radii.pill, borderWidth: 1, borderColor: 'rgba(16,24,40,0.08)' }}>
			<Text variant="caption" style={{ color }}>
				{label}
			</Text>
		</View>
	);
}