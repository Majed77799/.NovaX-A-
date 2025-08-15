module.exports = {
	env: { es2021: true },
	extends: [
		'eslint:recommended',
		'plugin:react/recommended',
		'plugin:react-hooks/recommended',
		'plugin:@typescript-eslint/recommended',
	],
	parser: '@typescript-eslint/parser',
	parserOptions: { ecmaFeatures: { jsx: true } },
	plugins: ['react', 'react-hooks', '@typescript-eslint', 'jest'],
	rules: {
		'react/react-in-jsx-scope': 'off',
		'@typescript-eslint/no-explicit-any': 'warn',
		'no-warning-comments': ['error', { terms: ['todo', 'fixme'], location: 'start' }],
		'@typescript-eslint/no-require-imports': 'off',
		'@typescript-eslint/func-call-spacing': 'off',
		'react-native/no-inline-styles': 'off',
		'curly': 'off',
		'eol-last': ['warn', 'always'],
	},
};