import { Tabs } from 'expo-router';
import { useEffect } from 'react';
import { LogBox, Button } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { syncQueue } from '../src/offline';

export default function RootLayout() {
	useEffect(() => {
		LogBox.ignoreAllLogs(true);
	}, []);

	return (
		<>
			<StatusBar style="auto" />
			<Tabs
				screenOptions={{
					headerShown: true,
					headerRight: () => (
						<Button title="Sync" onPress={async () => { await syncQueue(); }} />
					),
				}}
			>
				<Tabs.Screen name="index" options={{ title: 'Home' }} />
				<Tabs.Screen name="chat" options={{ title: 'Chat' }} />
				<Tabs.Screen name="templates/index" options={{ title: 'Templates' }} />
				<Tabs.Screen name="purchases" options={{ title: 'My Purchases' }} />
				<Tabs.Screen name="admin/index" options={{ title: 'Admin' }} />
				<Tabs.Screen name="diagnostics" options={{ title: 'Diagnostics' }} />
			</Tabs>
		</>
	);
}
//