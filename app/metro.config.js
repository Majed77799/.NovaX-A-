/* eslint-env node */
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
config.transformer.minifierConfig = {
	mangle: { toplevel: true },
	compress: { drop_console: true, passes: 2 },
};

module.exports = config;