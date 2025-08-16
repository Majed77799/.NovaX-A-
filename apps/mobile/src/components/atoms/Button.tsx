import React from 'react';
import { ActivityIndicator, Pressable, PressableProps, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme';
import { Text } from './Text';

export type ButtonVariant = 'primary' | 'secondary' | 'gradient';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = PressableProps & {
	variant?: ButtonVariant;
	size?: ButtonSize;
	title: string;
	left?: React.ReactNode;
	right?: React.ReactNode;
	loading?: boolean;
};

export function Button({ variant = 'primary', size = 'md', title, left, right, loading, disabled, style, ...rest }: ButtonProps) {
	const { tokens } = useTheme();
	const height = size === 'sm' ? 36 : size === 'lg' ? 52 : 44;
	const paddingHorizontal = size === 'sm' ? tokens.spacing.md : tokens.spacing.lg;
	const borderRadius = tokens.radii.pill;

	const baseStyle: ViewStyle = {
		borderRadius,
		borderWidth: 1,
		borderColor: variant === 'secondary' ? tokens.colors.border : 'transparent',
		backgroundColor: variant === 'secondary' ? tokens.colors.surface : tokens.colors.primary,
	};

	const mergedStyle = typeof style === 'function'
		? (state: any) => [baseStyle, style(state)]
		: [baseStyle, style as any];

	const content = (
		<View style={{ height, borderRadius, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal }}>
			{left}
			<Text color={variant === 'secondary' ? 'primary' : 'inverse'} medium>
				{title}
			</Text>
			{right}
		</View>
	);

	if (variant === 'gradient') {
		return (
			<Pressable {...rest} disabled={disabled || loading} style={style as any}>
				<LinearGradient colors={tokens.gradients.button} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderRadius }}>
					{loading ? <ActivityIndicator style={{ paddingVertical: 12 }} color="#fff" /> : content}
				</LinearGradient>
			</Pressable>
		);
	}

	return (
		<Pressable {...rest} disabled={disabled || loading} style={mergedStyle}>
			{loading ? <ActivityIndicator style={{ paddingVertical: 12 }} color={variant === 'secondary' ? tokens.colors.textPrimary : '#fff'} /> : content}
		</Pressable>
	);
}