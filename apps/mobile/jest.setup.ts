import { enableFetchMocks } from 'jest-fetch-mock';
enableFetchMocks();

jest.mock('expo-linear-gradient', () => ({ LinearGradient: require('react-native').View }));

jest.mock('victory-native', () => {
	const { View } = require('react-native');
	return new Proxy({}, { get: () => View });
});

jest.mock('expo-network', () => ({
	getNetworkStateAsync: async () => ({ isConnected: true })
}));