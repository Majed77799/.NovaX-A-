import { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from 'expo-web-browser';

interface TemplateItem { id: string; title: string; price: number; }

const CATALOG: TemplateItem[] = [
	{ id: 't1', title: 'Product Launch Copy', price: 9 },
	{ id: 't2', title: 'Support Reply', price: 4 },
	{ id: 't3', title: 'Blog Outline', price: 7 },
];

export default function TemplatesScreen() {
	const [downloading, setDownloading] = useState<string | null>(null);
	const [purchased, setPurchased] = useState<Record<string, boolean>>({});

	useEffect(() => {
		AsyncStorage.getItem('purchases').then(v => setPurchased(v ? JSON.parse(v) : {}));
	}, []);

	const savePurchases = async (obj: Record<string, boolean>) => {
		setPurchased(obj);
		await AsyncStorage.setItem('purchases', JSON.stringify(obj));
	};

	const purchase = async (item: TemplateItem, provider: 'stripe' | 'gumroad') => {
		// Mock: open provider checkout then mark as purchased
		await WebBrowser.openBrowserAsync(`https://example.com/checkout/${provider}/${item.id}`);
		const next = { ...purchased, [item.id]: true };
		await savePurchases(next);
		Alert.alert('Purchased', `${item.title} purchased via ${provider}.`);
	};

	const download = async (item: TemplateItem) => {
		if (!purchased[item.id]) {
			Alert.alert('Not purchased', 'Please purchase first.');
			return;
		}
		setDownloading(item.id);
		try {
			const dir = FileSystem.documentDirectory + 'templates/';
			await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
			const fileUri = dir + `${item.id}.txt`;
			await FileSystem.writeAsStringAsync(fileUri, `Template: ${item.title}`);
			Alert.alert('Downloaded', `Saved to ${fileUri}`);
		} finally {
			setDownloading(null);
		}
	};

	return (
		<View style={styles.container}>
			<FlatList
				data={CATALOG}
				keyExtractor={i => i.id}
				renderItem={({ item }) => (
					<View style={styles.card}>
						<Text style={styles.title}>{item.title}</Text>
						<Text>${item.price.toFixed(2)}</Text>
						<View style={styles.row}>
							<Button title="Stripe" onPress={() => purchase(item, 'stripe')} />
							<Button title="Gumroad" onPress={() => purchase(item, 'gumroad')} />
							<Button title={downloading === item.id ? '...' : 'Download'} onPress={() => download(item)} />
						</View>
					</View>
				)}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 12, paddingTop: 40 },
	card: { padding: 12, backgroundColor: '#fff', borderRadius: 8, marginBottom: 10, gap: 6, borderWidth: 1, borderColor: '#eee' },
	title: { fontSize: 16, fontWeight: '600' },
	row: { flexDirection: 'row', gap: 8 },
});
//