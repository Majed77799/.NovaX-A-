import React from 'react';
import { SafeAreaView, View } from 'react-native';
import { useFonts, Urbanist_400Regular, Urbanist_600SemiBold, Urbanist_700Bold } from '@expo-google-fonts/urbanist';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-gesture-handler';
import { ThemeProvider, useTheme } from './theme';
import { AppNavigation } from './navigation';
import { ToastHost } from './components/atoms/Toast';
import { OnboardingScreen } from './screens/OnboardingScreen';

SplashScreen.preventAutoHideAsync().catch(() => {});

function Root() {
	const { tokens } = useTheme();
	const [onboarded, setOnboarded] = React.useState(false);
	const [fontsLoaded] = useFonts({ Urbanist_400Regular, Urbanist_600SemiBold, Urbanist_700Bold });

	React.useEffect(() => {
		if (fontsLoaded) SplashScreen.hideAsync().catch(() => {});
	}, [fontsLoaded]);

	if (!fontsLoaded) return null;

	return (
		<View style={{ flex: 1, backgroundColor: tokens.colors.background }}>
			{onboarded ? <AppNavigation /> : <OnboardingScreen onGetStarted={() => setOnboarded(true)} />}
			<ToastHost />
		</View>
	);
}

export default function App() {
	return (
		<ThemeProvider>
			<Root />
		</ThemeProvider>
	);
}