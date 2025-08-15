import { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

interface PurchasedItem { id: string; title: string; }

export default function PurchasesScreen() {
	const [items, setItems] = useState<PurchasedItem[]>([]);

	useEffect(() => {
		const load = async () => {
			const purchasedMap = JSON.parse((await AsyncStorage.getItem('purchases')) || '{}') as Record<string, boolean>;
			const list = Object.keys(purchasedMap).filter(k => purchasedMap[k]).map(id => ({ id, title: id }));
			setItems(list);
		};
		load();
	}, []);

	const redownload = async (id: string) => {
		const dir = FileSystem.documentDirectory + 'templates/';
		const fileUri = dir + `${id}.txt`;
		await FileSystem.writeAsStringAsync(fileUri, `Template: ${id}`);
	};

	return (
		<View style={styles.container}>
			<FlatList
				data={items}
				keyExtractor={i => i.id}
				renderItem={({ item }) => (
					<View style={styles.row}>
						<Text>{item.title}</Text>
						<Button title="Re-download" onPress={() => redownload(item.id)} />
					</View>
				)}
				ListEmptyComponent={<Text>No purchases yet.</Text>}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 12, paddingTop: 40 },
	row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
});
//