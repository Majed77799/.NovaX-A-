import { Pressable, Text, ViewStyle } from 'react-native';
import React from 'react';

export type ButtonProps = {
	label: string;
	onPress?: () => void;
	disabled?: boolean;
	style?: ViewStyle;
};

export function Button({ label, onPress, disabled, style }: ButtonProps) {
	return (
		<Pressable
			accessibilityRole="button"
			disabled={disabled}
			onPress={onPress}
			style={{
				paddingHorizontal: 16,
				paddingVertical: 10,
				backgroundColor: disabled ? '#94a3b8' : '#2563eb',
				borderRadius: 8,
				...style,
			}}
		>
			<Text style={{ color: 'white', fontWeight: '600' }}>{label}</Text>
		</Pressable>
	);
}