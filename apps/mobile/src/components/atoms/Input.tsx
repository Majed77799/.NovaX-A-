import React from 'react';
import { TextInput, TextInputProps, View } from 'react-native';
import { useTheme } from '../../theme';

export type InputVariant = 'default' | 'search';

export type InputProps = TextInputProps & {
	variant?: InputVariant;
	left?: React.ReactNode;
	right?: React.ReactNode;
};

export function Input({ variant = 'default', left, right, style, ...rest }: InputProps) {
	const { tokens } = useTheme();
	return (
		<View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: tokens.colors.surface, borderColor: tokens.colors.border, borderWidth: 1, borderRadius: tokens.radii.pill, paddingHorizontal: tokens.spacing.md, paddingVertical: 10 }}>
			{left}
			<TextInput {...rest} placeholderTextColor={tokens.colors.textMuted} style={[{ flex: 1, fontFamily: tokens.typography.fontFamilyRegular, fontSize: tokens.typography.sizeMd }, style]} />
			{right}
		</View>
	);
}