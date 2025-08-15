import { useState } from 'react';
import { View, Text, Button, StyleSheet, Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Application from 'expo-application';
import * as Notifications from 'expo-notifications';
import { getTti } from '../src/perf';

export default function DiagnosticsScreen() {
	const [token, setToken] = useState<string | null>(null);

	async function registerForPushNotificationsAsync() {
		try {
			const { status: existingStatus } = await Notifications.getPermissionsAsync();
			let finalStatus = existingStatus;
			if (existingStatus !== 'granted') {
				const { status } = await Notifications.requestPermissionsAsync();
				finalStatus = status;
			}
			if (finalStatus !== 'granted') {
				return;
			}
			const projId = Application.applicationId || undefined;
			const t = (await Notifications.getExpoPushTokenAsync({ projectId: projId })).data;
			setToken(t);
		} catch (e) {
			console.warn('Push registration failed', e);
		}
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Diagnostics</Text>
			<Text>Platform: {Platform.OS}</Text>
			<Text>Brand: {Device.brand}</Text>
			<Text>Model: {Device.modelName}</Text>
			<Text>TTI: {getTti() ?? 'n/a'} ms</Text>
			<Button title="Register Push (optional)" onPress={registerForPushNotificationsAsync} />
			{token && <Text selectable>Token: {token}</Text>}
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 12, paddingTop: 40, gap: 8 },
	title: { fontSize: 20, fontWeight: '700' },
});
//