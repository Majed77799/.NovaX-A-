import React from 'react';
import { Image, SafeAreaView, View } from 'react-native';
import { useTheme } from '../theme';
import { Text } from '../components/atoms/Text';
import { user } from '../data/sample';
import { Badge } from '../components/atoms/Badge';

export function ProfileScreen() {
	const { tokens } = useTheme();
	return (
		<SafeAreaView style={{ flex: 1 }}>
			<View style={{ padding: tokens.spacing.lg, alignItems: 'center', gap: tokens.spacing.lg }}>
				<Image source={{ uri: user.avatar }} style={{ width: 96, height: 96, borderRadius: 48 }} />
				<Text variant="title" medium>{user.name}</Text>
				<View style={{ flexDirection: 'row', gap: tokens.spacing.lg }}>
					<View style={{ alignItems: 'center' }}>
						<Text variant="subtitle" bold>{user.stats.sales}</Text>
						<Text color="secondary">Sales</Text>
					</View>
					<View style={{ alignItems: 'center' }}>
						<Text variant="subtitle" bold>${user.stats.earnings}</Text>
						<Text color="secondary">Earnings</Text>
					</View>
					<View style={{ alignItems: 'center' }}>
						<Text variant="subtitle" bold>{user.stats.followers}</Text>
						<Text color="secondary">Followers</Text>
					</View>
				</View>
				<View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: tokens.spacing.sm, justifyContent: 'center' }}>
					{user.badges.map((b) => (<Badge key={b} label={b} tone="brand"/>))}
				</View>
			</View>
		</SafeAreaView>
	);
}