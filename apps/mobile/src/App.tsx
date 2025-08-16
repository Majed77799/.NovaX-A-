import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Urbanist_400Regular, Urbanist_500Medium, Urbanist_700Bold } from '@expo-google-fonts/urbanist';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigation from './navigation';
import GradientBackground from './components/GradientBackground';
import { View, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
	const [loaded] = useFonts({ Urbanist_400Regular, Urbanist_500Medium, Urbanist_700Bold });

	if (!loaded) {
		return (
			<GradientBackground>
				<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
					<Text>Loading…</Text>
				</View>
			</GradientBackground>
		);
	}

	return (
		<GradientBackground>
			<SafeAreaProvider>
				<GestureHandlerRootView style={{ flex: 1 }}>
					<RootNavigation />
					<StatusBar style="dark" />
				</GestureHandlerRootView>
			</SafeAreaProvider>
		</GradientBackground>
	);
}