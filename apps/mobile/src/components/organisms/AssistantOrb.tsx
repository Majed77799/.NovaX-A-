import React, { useMemo } from 'react';
import { View } from 'react-native';
import Animated, { Easing, interpolate, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import LottieView from 'lottie-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme';

export type OrbState = 'idle' | 'listening' | 'responding';

export type AssistantOrbProps = {
	state?: OrbState;
	size?: number;
	useLottie?: boolean;
};

export function AssistantOrb({ state = 'idle', size = 96, useLottie = false }: AssistantOrbProps) {
	const { tokens } = useTheme();
	const pulse = useSharedValue(0);
	const wave = useSharedValue(0);

	React.useEffect(() => {
		pulse.value = withRepeat(withTiming(1, { duration: 1600, easing: Easing.inOut(Easing.ease) }), -1, true);
		wave.value = withRepeat(withTiming(1, { duration: 1400, easing: Easing.out(Easing.quad) }), -1, false);
	}, [pulse, wave]);

	const orbStyle = useAnimatedStyle(() => {
		const scale = state === 'idle' ? interpolate(pulse.value, [0, 1], [0.95, 1.05]) : 1;
		return { transform: [{ scale }] };
	});

	const ringStyle = useAnimatedStyle(() => {
		const opacity = state === 'listening' ? interpolate(wave.value, [0, 1], [0.5, 0]) : 0;
		const scale = state === 'listening' ? interpolate(wave.value, [0, 1], [1, 1.8]) : 1;
		return { opacity, transform: [{ scale }] };
	});

	const glowColors = useMemo(() => tokens.gradients.brand, [tokens.gradients.brand]);

	if (useLottie) {
		const source =
			state === 'idle'
				? require('../../assets/lottie/orb_idle.json')
				: state === 'listening'
				? require('../../assets/lottie/orb_listening.json')
				: require('../../assets/lottie/orb_responding.json');
		return (
			<View style={{ width: size, height: size }}>
				<LottieView source={source} autoPlay loop style={{ width: size, height: size }} />
			</View>
		);
	}

	return (
		<View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
			<Animated.View style={[{ position: 'absolute', width: size, height: size, borderRadius: size / 2, backgroundColor: tokens.colors.card }, orbStyle]}>
				<LinearGradient colors={glowColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1, borderRadius: size / 2 }} />
			</Animated.View>
			<Animated.View style={[{ position: 'absolute', width: size, height: size, borderRadius: size / 2, borderWidth: 2, borderColor: 'rgba(255,255,255,0.65)' }, ringStyle]} />
			{state === 'responding' && (
				<Animated.View style={{ position: 'absolute', width: size * 1.2, height: size * 1.2, borderRadius: (size * 1.2) / 2, backgroundColor: 'rgba(255,255,255,0.15)' }} />
			)}
		</View>
	);
}