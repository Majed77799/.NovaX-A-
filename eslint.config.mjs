// @ts-check
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default [
	{ languageOptions: { globals: globals.browser } },
	...tseslint.configs.recommended,
	{
		files: ['**/*.{ts,tsx,js,jsx}'],
		rules: {
			'no-console': 'warn',
			'@typescript-eslint/explicit-function-return-type': 'off'
		}
	}
]