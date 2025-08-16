import React from 'react';
import { TextInput } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { radii } from '../tokens/radii';
import { fontFamily, fontSizes, lineHeights } from '../tokens/typography';

export function Input({ value, onChangeText, placeholder, multiline = false, size = 'md', style, ...rest }) {
	const { colors, ready, mode } = useTheme();
	const isDark = mode === 'dark';
	return (
		<TextInput
			value={value}
			onChangeText={onChangeText}
			placeholder={placeholder}
			placeholderTextColor={colors.text.low}
			multiline={multiline}
			style={[{
				fontFamily: ready ? fontFamily.base : fontFamily.fallback,
				fontSize: fontSizes[size],
				lineHeight: lineHeights[size],
				paddingHorizontal: 12,
				paddingVertical: 8,
				backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#fff',
				color: colors.text.high,
				borderWidth: 1,
				borderColor: colors.border.soft,
				borderRadius: radii.full,
				maxHeight: multiline ? 24*4 : undefined
			}, style]}
			{...rest}
		/>
	);
}