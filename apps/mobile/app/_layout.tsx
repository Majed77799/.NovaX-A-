import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native';

export default function RootLayout() {
	const [loaded] = useFonts({ Urbanist: require('../src/assets/Urbanist-VariableFont_wght.ttf') });
	if (!loaded) return null;
	return (
		<LinearGradient colors={["#F6E7FF","#E9F0FF","#D7F7FF"]} start={{x:0,y:0}} end={{x:1,y:1}} style={{ flex: 1 }}>
			<SafeAreaView style={{ flex: 1 }}>
				<Stack screenOptions={{ headerShown: false }} />
			</SafeAreaView>
		</LinearGradient>
	);
}