import React from 'react';
import { View, Text } from 'react-native';
import { BlurView } from 'expo-blur';

export default function FilterBar() {
	return (
		<BlurView intensity={30} tint="dark" style={{ borderRadius: 16, overflow: 'hidden' }}>
			<View style={{ paddingHorizontal: 12, paddingVertical: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
				<Text style={{ color: 'white' }}>Filters</Text>
				<Text style={{ color: '#94A3B8' }}>Last 30d · All Markets</Text>
			</View>
		</BlurView>
	);
}