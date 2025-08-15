module.exports = {
	preset: 'jest-expo',
	testEnvironment: 'jsdom',
	setupFiles: ['@react-native-async-storage/async-storage/jest/async-storage-mock'],
	setupFilesAfterEnv: ['<rootDir>/jest.setup.ts', '@testing-library/jest-native/extend-expect'],
	transformIgnorePatterns: [
		'node_modules/(?!(react-native|react-native-svg|@react-native|expo(nent)?|@expo(nent)?|victory-native)/)'
	]
};