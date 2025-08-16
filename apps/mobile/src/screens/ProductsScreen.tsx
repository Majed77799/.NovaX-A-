import React from 'react';
import { FlatList, SafeAreaView, View } from 'react-native';
import { useTheme } from '../theme';
import { Text } from '../components/atoms/Text';
import { Input } from '../components/atoms/Input';
import { Card } from '../components/molecules/Card';
import { products } from '../data/sample';
import { MagnifyingGlass } from 'phosphor-react-native';

export function ProductsScreen() {
	const { tokens } = useTheme();
	const [query, setQuery] = React.useState('');

	const filtered = React.useMemo(() => products.filter(p => p.title.toLowerCase().includes(query.toLowerCase())), [query]);

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<View style={{ padding: tokens.spacing.lg, gap: tokens.spacing.md }}>
				<Input placeholder="Search" value={query} onChangeText={setQuery} left={<MagnifyingGlass size={18} color={tokens.colors.textMuted} />} />
				<FlatList
					data={filtered}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => (
						<Card title={item.title} subtitle={`$${item.price}`} imageUri={item.image} badgeLabel={item.badge} />
					)}
					ItemSeparatorComponent={() => <View style={{ height: tokens.spacing.md }} />}
				/>
			</View>
		</SafeAreaView>
	);
}