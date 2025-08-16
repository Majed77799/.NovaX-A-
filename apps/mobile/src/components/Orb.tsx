import React, { memo } from 'react';
import { View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import LottieView from 'lottie-react-native';

const ORB_SIZE = 120;

export type OrbState = 'idle'|'thinking'|'speaking';

export const Orb = memo(({ state = 'idle', lottieSource }: { state?: OrbState; lottieSource?: any }) => {
	if (lottieSource) {
		return (
			<LottieView source={lottieSource} autoPlay loop style={{ width: ORB_SIZE, height: ORB_SIZE }} />
		);
	}

	const scale = useSharedValue(1);
	const translateY = useSharedValue(0);

	React.useEffect(() => {
		if (state === 'idle') {
			scale.value = withRepeat(withTiming(1.04, { duration: 1800, easing: Easing.inOut(Easing.ease) }), -1, true);
			translateY.value = withRepeat(withTiming(-2, { duration: 1400, easing: Easing.inOut(Easing.ease) }), -1, true);
		} else if (state === 'thinking') {
			scale.value = withRepeat(withTiming(1.02, { duration: 900, easing: Easing.inOut(Easing.ease) }), -1, true);
			translateY.value = withRepeat(withTiming(-3, { duration: 900, easing: Easing.inOut(Easing.ease) }), -1, true);
		} else {
			scale.value = withRepeat(withTiming(1.06, { duration: 700, easing: Easing.inOut(Easing.ease) }), -1, true);
			translateY.value = withRepeat(withTiming(-1, { duration: 700, easing: Easing.inOut(Easing.ease) }), -1, true);
		}
	}, [state]);

	const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }, { translateY: translateY.value }] }));

	return (
		<Animated.View style={[{ width: ORB_SIZE, height: ORB_SIZE, borderRadius: ORB_SIZE/2 }, style]}
			className="shadow-2xl"
		>
			<View className="absolute inset-0 rounded-full" style={{ shadowColor: '#7841FF', shadowOpacity: 0.35, shadowRadius: 28 }} />
			<View className="absolute inset-0 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.35)' }} />
			<View className="absolute inset-0 rounded-full" style={{ shadowColor: '#7CC1FF', shadowOpacity: 0.35, shadowRadius: 40 }} />
		</Animated.View>
	);
});

export default Orb;