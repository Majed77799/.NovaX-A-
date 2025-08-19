module.exports = function(api) {
	api.cache(true);
	return {
		presets: ['babel-preset-expo'],
		plugins: [
			// Keep plugin list minimal to avoid reanimated/moti crashes at boot
		],
	};
};