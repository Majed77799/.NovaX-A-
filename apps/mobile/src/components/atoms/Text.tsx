import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { useTheme } from '../../theme';

export type TextVariant = 'title' | 'subtitle' | 'body' | 'caption' | 'display';
export type TextColor = 'primary' | 'secondary' | 'muted' | 'inverse';

export type TextProps = RNTextProps & {
	variant?: TextVariant;
	color?: TextColor;
	bold?: boolean;
	medium?: boolean;
};

export function Text({ variant = 'body', color = 'primary', bold, medium, style, children, ...rest }: TextProps) {
	const { tokens, isDark } = useTheme();

	const fontSize =
		variant === 'display' ? tokens.typography.sizeDisplay :
		variant === 'title' ? tokens.typography.sizeXl :
		variant === 'subtitle' ? tokens.typography.sizeLg :
		variant === 'caption' ? tokens.typography.sizeXs :
		tokens.typography.sizeMd;

	const lineHeight = fontSize + 6;

	const fontFamily = bold ? tokens.typography.fontFamilyBold : medium ? tokens.typography.fontFamilyMedium : tokens.typography.fontFamilyRegular;

	const colorValue =
		color === 'inverse' ? (isDark ? tokens.colors.textPrimary : '#FFFFFF') :
		color === 'secondary' ? tokens.colors.textSecondary :
		color === 'muted' ? tokens.colors.textMuted :
		tokens.colors.textPrimary;

	return (
		<RNText {...rest} style={[{ fontSize, lineHeight, color: colorValue, fontFamily }, style]}>
			{children}
		</RNText>
	);
}