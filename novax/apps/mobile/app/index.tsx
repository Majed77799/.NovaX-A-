import { Text, View } from 'react-native';
import { Button } from '@novax/ui';

export default function HomeScreen() {
	return (
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 }}>
			<Text style={{ fontSize: 24, fontWeight: '600' }}>Novax Mobile</Text>
			<Button label="Tap me" onPress={() => {}} />
		</View>
	);
}