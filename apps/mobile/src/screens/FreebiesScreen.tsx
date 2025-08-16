import React from 'react';
import { FlatList, SafeAreaView, View } from 'react-native';
import { useTheme } from '../theme';
import { Card } from '../components/molecules/Card';
import { freebies } from '../data/sample';

export function FreebiesScreen() {
	const { tokens } = useTheme();
	return (
		<SafeAreaView style={{ flex: 1 }}>
			<View style={{ padding: tokens.spacing.lg }}>
				<FlatList
					data={freebies}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => (
						<Card title={item.title} subtitle="Free" imageUri={item.image} badgeLabel={item.badge} />
					)}
					ItemSeparatorComponent={() => <View style={{ height: tokens.spacing.md }} />}
				/>
			</View>
		</SafeAreaView>
	);
}