import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import DashboardScreen from '../screens/DashboardScreen';
import MarketplaceScreen from '../screens/MarketplaceScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { Text } from 'react-native';

const Tab = createBottomTabNavigator();

const theme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		background: 'transparent'
	}
};

export default function RootNavigation() {
	return (
		<NavigationContainer theme={theme}>
			<Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle: { backgroundColor: 'rgba(255,255,255,0.7)', borderTopWidth: 0 }, tabBarActiveTintColor: '#0f1223' }}>
				<Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: ({ color }) => <Text style={{ color }}>Home</Text> }} />
				<Tab.Screen name="Dashboard" component={DashboardScreen} options={{ tabBarLabel: ({ color }) => <Text style={{ color }}>Dashboard</Text> }} />
				<Tab.Screen name="Marketplace" component={MarketplaceScreen} options={{ tabBarLabel: ({ color }) => <Text style={{ color }}>Market</Text> }} />
				<Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: ({ color }) => <Text style={{ color }}>Profile</Text> }} />
			</Tab.Navigator>
		</NavigationContainer>
	);
}