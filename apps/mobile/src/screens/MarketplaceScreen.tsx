import React from 'react';
import { FlatList, SafeAreaView, View, Dimensions } from 'react-native';
import { useTheme } from '../theme';
import { products } from '../data/sample';
import { Card } from '../components/molecules/Card';

export function MarketplaceScreen() {
	const { tokens } = useTheme();
	const numColumns = 2;
	const gap = tokens.spacing.md;
	const cardWidth = (Dimensions.get('window').width - tokens.spacing.lg * 2 - gap) / numColumns;

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<View style={{ padding: tokens.spacing.lg }}>
				<FlatList
					data={products}
					numColumns={numColumns}
					columnWrapperStyle={{ gap }}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => (
						<View style={{ width: cardWidth, marginBottom: gap }}>
							<Card title={item.title} subtitle={`$${item.price}`} imageUri={item.image} badgeLabel={item.badge} />
						</View>
					)}
				/>
			</View>
		</SafeAreaView>
	);
}