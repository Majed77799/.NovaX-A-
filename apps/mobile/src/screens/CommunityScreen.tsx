import React from 'react';
import { SafeAreaView, View } from 'react-native';
import { useTheme } from '../theme';
import { Text } from '../components/atoms/Text';

export function CommunityScreen() {
	const { tokens } = useTheme();
	return (
		<SafeAreaView style={{ flex: 1 }}>
			<View style={{ padding: tokens.spacing.lg, gap: tokens.spacing.md }}>
				<Text variant="title" medium>Community</Text>
				<Text color="secondary">Creator spotlights, discussions, collaborations.</Text>
			</View>
		</SafeAreaView>
	);
}