import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme, Theme as NavTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View } from 'react-native';
import { useTheme } from '../theme';
import { t } from '../localization';
import { ProductsScreen } from '../screens/ProductsScreen';
import { FreebiesScreen } from '../screens/FreebiesScreen';
import { AnalyticsScreen } from '../screens/AnalyticsScreen';
import { CommunityScreen } from '../screens/CommunityScreen';
import { MarketplaceScreen } from '../screens/MarketplaceScreen';
import { ProductDetailScreen } from '../screens/ProductDetailScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { House, ShoppingBagOpen, ChartLineUp, UsersThree } from 'phosphor-react-native';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function Tabs() {
	const { tokens, isDark } = useTheme();
	return (
		<Tab.Navigator
			screenOptions={{
				headerShown: false,
				tabBarStyle: { backgroundColor: tokens.colors.surface, borderTopColor: tokens.colors.border, borderTopWidth: 1, height: 64 },
				tabBarActiveTintColor: tokens.colors.primary,
				tabBarInactiveTintColor: tokens.colors.textMuted,
			}}
		>
			<Tab.Screen name="Products" component={ProductsScreen} options={{ title: t('tab.products'), tabBarIcon: ({ color }) => <House color={color} size={22} weight="duotone"/> }} />
			<Tab.Screen name="Freebies" component={FreebiesScreen} options={{ title: t('tab.freebies'), tabBarIcon: ({ color }) => <ShoppingBagOpen color={color} size={22} weight="duotone"/> }} />
			<Tab.Screen name="Analytics" component={AnalyticsScreen} options={{ title: t('tab.analytics'), tabBarIcon: ({ color }) => <ChartLineUp color={color} size={22} weight="duotone"/> }} />
			<Tab.Screen name="Community" component={CommunityScreen} options={{ title: t('tab.community'), tabBarIcon: ({ color }) => <UsersThree color={color} size={22} weight="duotone"/> }} />
		</Tab.Navigator>
	);
}

export function AppNavigation() {
	const { isDark } = useTheme();
	const navTheme: NavTheme = isDark ? DarkTheme : DefaultTheme;
	return (
		<NavigationContainer theme={navTheme}>
			<Stack.Navigator>
				<Stack.Screen name="Root" component={Tabs} options={{ headerShown: false }} />
				<Stack.Screen name="Marketplace" component={MarketplaceScreen} />
				<Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
				<Stack.Screen name="Profile" component={ProfileScreen} />
				<Stack.Screen name="Settings" component={SettingsScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}