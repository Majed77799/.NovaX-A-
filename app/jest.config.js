/* eslint-env node */
module.exports = {
	preset: 'jest-expo',
	testEnvironment: 'jsdom',
	setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect', '<rootDir>/jest.setup.ts'],
	transformIgnorePatterns: [
		'node_modules/(?!(jest-)?react-native|@react-native|expo(nent)?|@expo|expo|@expo/.*|@expo(nent)?/.*|@unimodules|unimodules|sentry-expo|@sentry/.*|expo-router|@react-navigation/.*)'
	],
	moduleNameMapper: {
		'^expo-av$': '<rootDir>/__mocks__/expo-av.js',
		'^expo-speech$': '<rootDir>/__mocks__/expo-speech.js',
		'^expo-router$': '<rootDir>/__mocks__/expo-router.js',
		'^expo-network$': '<rootDir>/__mocks__/expo-network.js',
		'^expo-application$': '<rootDir>/__mocks__/expo-application.js',
		'^expo-notifications$': '<rootDir>/__mocks__/expo-notifications.js',
		'^@react-native-async-storage/async-storage$': '@react-native-async-storage/async-storage/jest/async-storage-mock',
	},
};