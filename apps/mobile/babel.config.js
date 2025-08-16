module.exports = function(api) {
	api.cache(true);
	return {
		presets: ['babel-preset-expo'],
		plugins: [
			['babel-plugin-module-resolver', { alias: { '@novax/design-system': '../../packages/design-system' } }]
		]
	};
};