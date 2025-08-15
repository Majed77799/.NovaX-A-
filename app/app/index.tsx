import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Network from 'expo-network';
import { setTti } from '../src/perf';

export default function HomeScreen() {
	const [isOnline, setIsOnline] = useState<boolean | null>(null);
	useEffect(() => {
		const start = Date.now();
		requestAnimationFrame(() => {
			setTti(Date.now() - start);
		});
		const check = async () => {
			const { isConnected } = await Network.getNetworkStateAsync();
			setIsOnline(Boolean(isConnected));
		};
		check();
		const interval = setInterval(check, 5000);
		return () => clearInterval(interval);
	}, []);
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Welcome</Text>
			<Text style={styles.subtitle}>Status: {isOnline === null ? '...' : isOnline ? 'Online' : 'Offline'}</Text>
			<Link href="/chat">Go to Chat</Link>
			<Link href="/templates">Browse Templates</Link>
			<Link href="/purchases">My Purchases</Link>
			<Link href="/admin">Admin</Link>
			<Link href="/diagnostics">Diagnostics</Link>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
	title: { fontSize: 24, fontWeight: '600' },
	subtitle: { fontSize: 14, color: '#555' },
});
//