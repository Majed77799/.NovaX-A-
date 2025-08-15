import React from 'react';
import { Text, View } from 'react-native';
import { fetchHealth } from './api';

export default function Home() {
	const [status, setStatus] = React.useState<'...' | 'ok' | 'error'>('...');
	React.useEffect(() => {
		fetchHealth().then((r) => setStatus(r?.ok ? 'ok' : 'error')).catch(() => setStatus('error'));
	}, []);

	return (
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
			<Text style={{ fontFamily: 'Urbanist_400Regular', fontSize: 24 }}>NovaX Mobile</Text>
			<Text style={{ marginTop: 8 }}>API: {status}</Text>
		</View>
	);
}