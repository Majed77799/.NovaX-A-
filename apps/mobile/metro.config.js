const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

if (process.env.NODE_ENV === 'production') {
	config.transformer = config.transformer || {};
	config.transformer.minifierConfig = config.transformer.minifierConfig || {};
	config.transformer.minifierConfig.keep_classnames = false;
	config.transformer.minifierConfig.keep_fnames = false;
	config.transformer.minifierConfig.mangle = {
		...(config.transformer.minifierConfig.mangle || {}),
		keep_classnames: false,
		keep_fnames: false,
	};
	config.transformer.sourceMap = false;
}

module.exports = config;