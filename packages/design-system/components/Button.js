import React, { useRef } from 'react';
import { Animated, TouchableWithoutFeedback } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../theme/ThemeProvider';
import { Text } from './Text';
import { radii } from '../tokens/radii';

const SIZE_STYLES = {
	sm: { paddingVertical: 8, paddingHorizontal: 12, fontSize: 'sm' },
	md: { paddingVertical: 12, paddingHorizontal: 16, fontSize: 'md' },
	lg: { paddingVertical: 14, paddingHorizontal: 20, fontSize: 'lg' }
};

export function Button({ children, onPress, size = 'md', variant = 'primary', style }) {
	const { colors } = useTheme();
	const s = SIZE_STYLES[size];
	const scale = useRef(new Animated.Value(1)).current;

	function animate(to) {
		Animated.spring(scale, { toValue: to, useNativeDriver: true, speed: 20, bounciness: 8 }).start();
	}

	return (
		<TouchableWithoutFeedback
			onPressIn={() => animate(0.98)}
			onPressOut={() => animate(1)}
			onPress={async () => { try { await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); } catch {} onPress && onPress(); }}
		>
			<Animated.View style={[{ transform: [{ scale }], borderRadius: radii.full }, style]}>
				<LinearGradient
					colors={variant === 'primary' ? [colors.brand.primary, '#B893FF'] : [colors.background.muted, '#FFFFFF']}
					start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
					style={{ paddingVertical: s.paddingVertical, paddingHorizontal: s.paddingHorizontal, borderRadius: radii.full }}
				>
					<Text size={s.fontSize} color={variant === 'primary' ? 'inverse' : 'high'}>{children}</Text>
				</LinearGradient>
			</Animated.View>
		</TouchableWithoutFeedback>
	);
}