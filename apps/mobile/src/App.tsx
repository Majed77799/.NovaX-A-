import React, { Suspense } from 'react';
import { NavigationContainer, DefaultTheme, Theme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native';

const AnalyticsScreen = React.lazy(() => import('./screens/AnalyticsScreen'));

function MarketInsightsScreen() {
	return (
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
			<Text>Market Insights</Text>
		</View>
	);
}

const Tab = createBottomTabNavigator();

const theme: Theme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		background: '#0B0F14'
	}
};

export default function App() {
	return (
		<SafeAreaProvider>
			<NavigationContainer theme={theme}>
				<Tab.Navigator
					initialRouteName="MarketInsights"
					screenOptions={({ route }) => ({
						tabBarIcon: ({ color, size }) => {
							const icon = route.name === 'MarketInsights' ? ('analytics-outline' as const) : ('pulse-outline' as const);
							return <Ionicons name={icon} size={size} color={color} />;
						},
						tabBarStyle: { backgroundColor: 'rgba(14,18,24,0.8)', borderTopColor: 'rgba(255,255,255,0.08)' },
						tabBarActiveTintColor: '#5EEAD4',
						tabBarInactiveTintColor: '#94A3B8',
						headerShown: false
					})}
				>
					<Tab.Screen name="MarketInsights" component={MarketInsightsScreen} options={{ title: 'Market Insights' }} />
					<Tab.Screen name="Analytics" options={{ title: 'Analytics' }}>
						{() => (
							<Suspense fallback={<View style={{ flex: 1 }} />}>
								<AnalyticsScreen />
							</Suspense>
						)}
					</Tab.Screen>
				</Tab.Navigator>
			</NavigationContainer>
		</SafeAreaProvider>
	);
}