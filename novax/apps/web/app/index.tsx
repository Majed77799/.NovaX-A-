import { Text, View } from 'react-native';
import { Button } from '@novax/ui';

export default function WebHome() {
	return (
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, padding: 40 }}>
			<Text style={{ fontSize: 24, fontWeight: '600' }}>Novax Web</Text>
			<Button label="Click me" onPress={() => {}} />
		</View>
	);
}