import React, { useCallback, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';

type RootStackParamList = {
	Home: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function HomeScreen() {
	useEffect(() => {
		const timer = setTimeout(() => {
			console.log('SMOKE: NovaX ready text mounted');
		}, 1000);
		return () => clearTimeout(timer);
	}, []);

	return (
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' }}>
			<Text testID="novax-text" accessibilityLabel="NovaX ready" style={{ fontSize: 18, color: '#111827' }}>
				NovaX ready
			</Text>
		</View>
	);
}

class RootErrorBoundary extends React.Component<React.PropsWithChildren<{}>, { hasError: boolean; message?: string }> {
	constructor(props: React.PropsWithChildren<{}>) {
		super(props);
		this.state = { hasError: false };
	}
	static getDerivedStateFromError(error: Error) {
		return { hasError: true, message: String(error?.message ?? 'Unknown error') };
	}
	componentDidCatch(error: Error, errorInfo: any) {
		console.error('Root render error', error, errorInfo);
	}
	render() {
		if (this.state.hasError) {
			return (
				<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF' }}>
					<Text style={{ color: 'red' }}>App failed to load</Text>
					{this.state.message ? <Text selectable style={{ paddingTop: 8 }}>{this.state.message}</Text> : null}
				</View>
			);
		}
		return this.props.children as any;
	}
}

export default function App() {
	const [appIsReady, setAppIsReady] = useState(false);

	useEffect(() => {
		(async () => {
			try {
				try { await SplashScreen.preventAutoHideAsync(); } catch {}
				// Load fonts if/when added; use system fallback by default
				await Font.loadAsync({});
			} catch (e) {
				console.error('Error during font/splash init', e);
			} finally {
				setAppIsReady(true);
			}
		})();
	}, []);

	const onLayoutRootView = useCallback(async () => {
		if (appIsReady) {
			try { await SplashScreen.hideAsync(); } catch {}
		}
	}, [appIsReady]);

	if (!appIsReady) {
		return null;
	}

	return (
		<RootErrorBoundary>
			<GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
				<SafeAreaProvider>
					<NavigationContainer>
						<Stack.Navigator>
							<Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
						</Stack.Navigator>
					</NavigationContainer>
				</SafeAreaProvider>
			</GestureHandlerRootView>
		</RootErrorBoundary>
	);
}

