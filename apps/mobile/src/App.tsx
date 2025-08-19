import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, Urbanist_400Regular, Urbanist_600SemiBold, Urbanist_700Bold } from '@expo-google-fonts/urbanist';
import { MotiView } from 'moti';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootTabParamList = {
    Home: undefined;
    Marketplace: undefined;
    Settings: undefined;
    Profile: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createNativeStackNavigator();

export default function App() {
    const [fontsLoaded] = useFonts({ Urbanist_400Regular, Urbanist_600SemiBold, Urbanist_700Bold });
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => { AsyncStorage.getItem('novax.dark').then(v => setDarkMode(v === '1')); }, []);

    if (!fontsLoaded) return null;

    return (
        <NavigationContainer theme={darkMode ? DarkTheme : DefaultTheme}>
            <Tab.Navigator screenOptions={{ headerShown: false }}>
                <Tab.Screen name="Home" component={HomeScreen} />
                <Tab.Screen name="Marketplace" component={MarketplaceStack} />
                <Tab.Screen name="Settings">
                    {() => <SettingsScreen darkMode={darkMode} setDarkMode={setDarkMode} />}
                </Tab.Screen>
                <Tab.Screen name="Profile" component={ProfileScreen} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}

function HomeScreen({ navigation }: any) {
    return (
        <LinearGradient colors={["#F6E7FF","#E9F0FF","#D7F7FF"]} start={{x:0,y:0}} end={{x:1,y:1}} style={{ flex: 1, padding: 16 }}>
            <View style={{ alignItems: 'center', marginTop: 48 }}>
                <MotiView from={{ opacity: 0.8, scale: 1 }} animate={{ opacity: 1, scale: 1.04 }} transition={{ loop: true, type: 'timing', duration: 1500 }} style={{ width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.35)', shadowColor: '#7841FF', shadowOpacity: 0.35, shadowRadius: 16 }} />
                <Text style={{ fontSize: 22, fontWeight: '700', marginTop: 16 }}>NovaX — Playful SaaS, Serious Power</Text>
                <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
                    <Pressable onPress={() => navigation.navigate('Marketplace')} style={{ backgroundColor: '#fff', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10 }}><Text>Open Marketplace</Text></Pressable>
                    <Pressable onPress={() => Alert.alert('Demo started')} style={{ backgroundColor: '#fff', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10 }}><Text>Start Demo</Text></Pressable>
                </View>
                <View style={{ flexDirection: 'row', gap: 8, marginTop: 16 }}>
                    <Badge text="Creator Lv.3" />
                    <Badge text="Top 10%" />
                    <Badge text="Streak x5" />
                </View>
                <View style={{ height: 10, borderRadius: 6, backgroundColor: 'rgba(15,18,35,0.1)', width: '80%', marginTop: 12 }}>
                    <View style={{ width: '72%', height: '100%', borderRadius: 6, backgroundColor: '#a78bfa' }} />
                </View>
            </View>
        </LinearGradient>
    );
}

function Badge({ text }: { text: string }) {
    return <View style={{ backgroundColor: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.25)', borderWidth: 1, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 }}><Text>{text}</Text></View>;
}

function MarketplaceStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="List" component={MarketplaceScreen} options={{ title: 'Marketplace' }} />
            <Stack.Screen name="Details" component={TemplateDetailsScreen} options={{ presentation: 'modal', title: 'Details' }} />
        </Stack.Navigator>
    );
}

import { templates } from '@repo/tokens';

function MarketplaceScreen({ navigation }: any) {
    return (
        <LinearGradient colors={["#F6E7FF","#E9F0FF","#D7F7FF"]} start={{x:0,y:0}} end={{x:1,y:1}} style={{ flex: 1, padding: 16 }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                {templates.map(t => (
                    <Pressable key={t.id} onPress={() => navigation.push('Details', { id: t.id })} style={{ width: '48%', backgroundColor: 'rgba(255,255,255,0.75)', borderRadius: 12, padding: 12 }}>
                        <View style={{ height: 80, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.6)' }} />
                        <Text style={{ marginTop: 8, fontWeight: '600' }}>{t.title}</Text>
                        <Text style={{ opacity: 0.8 }}>{t.price === 'free' ? 'Free' : t.price}</Text>
                    </Pressable>
                ))}
            </View>
        </LinearGradient>
    );
}

function TemplateDetailsScreen({ route }: any) {
    const { id } = route.params as { id: string };
    const t = useMemo(() => templates.find(x => x.id === id), [id]);
    if (!t) return null;
    async function install() {
        await AsyncStorage.setItem(`novax.template.${t.id}`, 'installed');
        Alert.alert('Installed', `${t.title} is now available.`);
    }
    return (
        <LinearGradient colors={["#F6E7FF","#E9F0FF","#D7F7FF"]} start={{x:0,y:0}} end={{x:1,y:1}} style={{ flex: 1, padding: 16 }}>
            <Text style={{ fontSize: 20, fontWeight: '700' }}>{t.title}</Text>
            <Text style={{ marginTop: 8 }}>{t.description}</Text>
            <Pressable onPress={install} style={{ backgroundColor: '#fff', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, marginTop: 16 }}><Text>Install</Text></Pressable>
        </LinearGradient>
    );
}

function SettingsScreen({ darkMode, setDarkMode }: { darkMode: boolean; setDarkMode: (v: boolean)=>void }) {
    async function toggleDark() {
        const next = !darkMode;
        setDarkMode(next);
        await AsyncStorage.setItem('novax.dark', next ? '1' : '0');
    }
    function openDiagnostics() {
        Alert.alert('Diagnostics', `Platform: mobile\nDark: ${darkMode ? 'on' : 'off'}`);
    }
    return (
        <LinearGradient colors={["#F6E7FF","#E9F0FF","#D7F7FF"]} start={{x:0,y:0}} end={{x:1,y:1}} style={{ flex: 1, padding: 16 }}>
            <Pressable onPress={toggleDark} style={{ backgroundColor: '#fff', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10 }}><Text>Dark Mode: {darkMode ? 'On' : 'Off'}</Text></Pressable>
            <Pressable onPress={openDiagnostics} style={{ backgroundColor: '#fff', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, marginTop: 12 }}><Text>Diagnostics</Text></Pressable>
            <View style={{ marginTop: 12 }}>
                <Text>Audio (stub)</Text>
                <Text>Location (stub)</Text>
                <Text>Geofencing (stub)</Text>
            </View>
        </LinearGradient>
    );
}

function ProfileScreen() {
    const [count, setCount] = useState(0);
    useEffect(() => {
        (async () => {
            const keys = await AsyncStorage.getAllKeys();
            const installed = keys.filter(k => k.startsWith('novax.template.'));
            setCount(installed.length);
        })();
    }, []);
    return (
        <LinearGradient colors={["#F6E7FF","#E9F0FF","#D7F7FF"]} start={{x:0,y:0}} end={{x:1,y:1}} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.8)' }} />
            <Text style={{ marginTop: 8, fontWeight: '600' }}>@novax-user</Text>
            <Text style={{ marginTop: 4 }}>Installed templates: {count}</Text>
        </LinearGradient>
    );
}