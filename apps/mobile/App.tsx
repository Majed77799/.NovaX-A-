import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Urbanist_400Regular, Urbanist_700Bold } from '@expo-google-fonts/urbanist';

export default function App() {
	const [fontsLoaded] = useFonts({ Urbanist_400Regular, Urbanist_700Bold });

	if (!fontsLoaded) {
		return null;
	}

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
			<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
				<Text style={{ fontFamily: 'Urbanist_700Bold', fontSize: 24, color: '#111827' }}>Unified App (Expo)</Text>
				<Text style={{ fontFamily: 'Urbanist_400Regular', fontSize: 16, color: '#374151', marginTop: 8 }}>Urbanist font loaded</Text>
			</View>
			<StatusBar style="dark" />
		</SafeAreaView>
	);
}