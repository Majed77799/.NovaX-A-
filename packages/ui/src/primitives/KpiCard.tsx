import React, { ReactNode } from 'react';
import { View, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

type Props = {
	label: string;
	value: string | number;
	delta: number;
	children?: ReactNode;
};

export default function KpiCard({ label, value, delta, children }: Props) {
	const deltaColor = delta > 0 ? '#34D399' : delta < 0 ? '#F87171' : '#94A3B8';
	return (
		<BlurView intensity={40} tint="dark" style={{ borderRadius: 16, overflow: 'hidden', flex: 1 }}>
			<LinearGradient
				colors={["rgba(94,234,212,0.12)", "transparent"]}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
				style={{ height: 4 }}
			/>
			<View style={{ padding: 12 }}>
				<Text style={{ color: '#94A3B8', fontSize: 12 }}>{label}</Text>
				<Text style={{ color: 'white', fontSize: 20, marginTop: 4 }}>{value}</Text>
				<Text style={{ color: deltaColor, fontSize: 12, marginTop: 2 }}>{delta > 0 ? '+' : ''}{delta}%</Text>
				{children}
			</View>
		</BlurView>
	);
}