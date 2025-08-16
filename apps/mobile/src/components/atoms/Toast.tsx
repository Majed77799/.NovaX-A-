import React from 'react';
import { Animated, Easing, View } from 'react-native';
import { useTheme } from '../../theme';
import { Text } from './Text';

let singleton: { show: (msg: string) => void } | null = null;

export function showToast(message: string) {
	singleton?.show(message);
}

export function ToastHost() {
	const { tokens } = useTheme();
	const [message, setMessage] = React.useState<string | null>(null);
	const opacity = React.useRef(new Animated.Value(0)).current;

	const show = React.useCallback((msg: string) => {
		setMessage(msg);
		Animated.timing(opacity, { toValue: 1, duration: 220, useNativeDriver: true, easing: Easing.out(Easing.quad) }).start(() => {
			setTimeout(() => {
				Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => setMessage(null));
			}, 2000);
		});
	}, [opacity]);

	React.useEffect(() => {
		singleton = { show };
		return () => { singleton = null; };
	}, [show]);

	if (!message) return null;

	return (
		<Animated.View pointerEvents="none" style={{ position: 'absolute', bottom: 24, left: 24, right: 24, opacity }}>
			<View style={{ backgroundColor: tokens.colors.surface, borderColor: tokens.colors.border, borderWidth: 1, borderRadius: tokens.radii.lg, padding: 14, shadowColor: tokens.colors.shadow, shadowOpacity: 0.08, shadowRadius: 20 }}>
				<Text>{message}</Text>
			</View>
		</Animated.View>
	);
}