/* eslint-env node */
/* eslint-disable @typescript-eslint/no-require-imports */
module.exports = function (api) {
	api.cache(true);
	return {
		presets: ['babel-preset-expo'],
	};
};