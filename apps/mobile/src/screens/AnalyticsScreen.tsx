import React from 'react';
import { SafeAreaView, View } from 'react-native';
import { useTheme } from '../theme';
import { Text } from '../components/atoms/Text';

export function AnalyticsScreen() {
	const { tokens } = useTheme();
	return (
		<SafeAreaView style={{ flex: 1 }}>
			<View style={{ padding: tokens.spacing.lg, gap: tokens.spacing.md }}>
				<Text variant="title" medium>Analytics</Text>
				<View style={{ flexDirection: 'row', gap: tokens.spacing.md }}>
					<View style={{ flex: 1, backgroundColor: tokens.colors.card, padding: tokens.spacing.md, borderRadius: tokens.radii.lg, borderWidth: 1, borderColor: tokens.colors.border }}>
						<Text variant="subtitle">Sales</Text>
						<Text variant="display" bold>1,542</Text>
					</View>
					<View style={{ flex: 1, backgroundColor: tokens.colors.card, padding: tokens.spacing.md, borderRadius: tokens.radii.lg, borderWidth: 1, borderColor: tokens.colors.border }}>
						<Text variant="subtitle">Earnings</Text>
						<Text variant="display" bold>$42.1k</Text>
					</View>
				</View>
			</View>
		</SafeAreaView>
	);
}