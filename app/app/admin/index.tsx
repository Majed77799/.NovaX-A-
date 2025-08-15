import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import * as jose from 'jose';

export default function AdminScreen() {
	const [jwt, setJwt] = useState('');
	const [secret, setSecret] = useState('secret');
	const [payload, setPayload] = useState<Record<string, unknown> | null>(null);

	const decode = async () => {
		try {
			const { payload } = await jose.jwtVerify(jwt, new TextEncoder().encode(secret));
			setPayload(payload as Record<string, unknown>);
		} catch (e: unknown) {
			Alert.alert('Invalid token', String((e as Error)?.message || e));
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Admin</Text>
			<TextInput style={styles.input} placeholder="JWT" value={jwt} onChangeText={setJwt} />
			<TextInput style={styles.input} placeholder="Secret" value={secret} onChangeText={setSecret} />
			<Button title="Verify" onPress={decode} />
			{payload && (
				<View style={styles.card}>
					<Text style={styles.subtitle}>Payload</Text>
					<Text selectable>{JSON.stringify(payload, null, 2)}</Text>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 12, paddingTop: 40, gap: 8 },
	title: { fontSize: 20, fontWeight: '700' },
	subtitle: { fontSize: 16, fontWeight: '600' },
	input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8 },
	card: { padding: 10, backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#eee', gap: 6 },
});