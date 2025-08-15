import React, { useEffect, useState } from 'react'
import { Text, View, Button, Image } from 'react-native'
import * as Notifications from 'expo-notifications'
import * as ImagePicker from 'expo-image-picker'
import * as Speech from 'expo-speech'

export default function HomeScreen() {
	const [imageUri, setImageUri] = useState<string | null>(null)
	useEffect(() => {
		Notifications.requestPermissionsAsync().catch(() => {})
	}, [])
	return (
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 }}>
			<Text style={{ fontSize: 24 }}>NovaX Mobile</Text>
			<Button title="Pick Image" onPress={async () => {
				const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images })
				if (!res.canceled) setImageUri(res.assets[0].uri)
			}} />
			<Button title="Speak" onPress={() => Speech.speak('Hello from NovaX')} />
			{imageUri && <Image source={{ uri: imageUri }} style={{ width: 200, height: 200 }} />}
		</View>
	)
}