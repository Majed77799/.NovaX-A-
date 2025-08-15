const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.nodeModulesPaths = [
	// Ensure Metro resolves from repo root for workspaces
	require('path').resolve(__dirname, '../../node_modules'),
	require('path').resolve(__dirname, 'node_modules')
];

module.exports = config;