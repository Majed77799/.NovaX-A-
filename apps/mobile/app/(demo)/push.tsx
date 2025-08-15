import React, { useEffect, useState } from 'react'
import { View, Text, Button } from 'react-native'
import * as Notifications from 'expo-notifications'

export default function PushDemo() {
	const [token, setToken] = useState<string | null>(null)
	useEffect(() => {
		Notifications.getExpoPushTokenAsync().then((t) => setToken(t.data)).catch(() => {})
	}, [])
	return (
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16 }}>
			<Text>Push Token:</Text>
			<Text selectable>{token ?? 'N/A'}</Text>
			<Button title="Send Local Notification" onPress={() => Notifications.scheduleNotificationAsync({ content: { title: 'Hello', body: 'From NovaX' }, trigger: null })} />
		</View>
	)
}