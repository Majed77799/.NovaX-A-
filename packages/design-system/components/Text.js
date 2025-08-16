import React from 'react';
import { Text as RNText } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { fontFamily, fontSizes, lineHeights } from '../tokens/typography';

export function Text({ children, size = 'md', color = 'high', style, ...rest }) {
	const { colors, ready } = useTheme();
	return (
		<RNText
			{...rest}
			style={[{ fontFamily: ready ? fontFamily.base : fontFamily.fallback, fontSize: fontSizes[size], lineHeight: lineHeights[size], color: colors.text[color] }, style]}
		>
			{children}
		</RNText>
	);
}