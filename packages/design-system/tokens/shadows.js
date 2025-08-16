import { Platform } from 'react-native';

function makeShadow(color, opacity, radius, elevation) {
	if (Platform.OS === 'android') {
		return { elevation };
	}
	return {
		shadowColor: color,
		shadowOpacity: opacity,
		shadowRadius: radius,
		shadowOffset: { width: 0, height: Math.ceil(elevation / 2) }
	};
}

export const shadows = {
	xs: makeShadow('#101828', 0.06, 6, 1),
	sm: makeShadow('#101828', 0.06, 10, 2),
	md: makeShadow('#101828', 0.08, 14, 4),
	lg: makeShadow('#101828', 0.1, 20, 6)
};

export function glassShadow() {
	return makeShadow('#7841FF', 0.25, 16, 6);
}