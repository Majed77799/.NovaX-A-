// @ts-check

import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
	{ ignores: ["**/node_modules/**", "**/.next/**", "**/dist/**", "**/build/**"] },
	js.configs.recommended,
	...tseslint.configs.recommended,
	{
		files: ["apps/web/**/*.{ts,tsx}"] ,
		languageOptions: {
			ecmaVersion: 2023,
			sourceType: "module",
			parserOptions: { project: "./apps/web/tsconfig.json" }
		},
		plugins: { react: reactPlugin, "react-hooks": reactHooksPlugin },
		rules: {
			"react/react-in-jsx-scope": "off",
			"react/jsx-uses-react": "off",
			"react/prop-types": "off",
			"no-unused-vars": "off",
			"@typescript-eslint/no-unused-vars": "off",
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/ban-ts-comment": "off",
			"react-hooks/rules-of-hooks": "error",
			"react-hooks/exhaustive-deps": "off"
		}
	},
	{
		files: ["apps/mobile/**/*.{ts,tsx}"] ,
		languageOptions: {
			ecmaVersion: 2023,
			sourceType: "module",
			parserOptions: { project: "./apps/mobile/tsconfig.json" }
		},
		plugins: { react: reactPlugin, "react-hooks": reactHooksPlugin },
		rules: {
			"react/react-in-jsx-scope": "off",
			"react/jsx-uses-react": "off",
			"react/prop-types": "off",
			"no-unused-vars": "off",
			"@typescript-eslint/no-unused-vars": "off",
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/ban-ts-comment": "off",
			"react-hooks/rules-of-hooks": "error",
			"react-hooks/exhaustive-deps": "off"
		}
	},
	{
		files: ["apps/mobile/babel.config.js"],
		rules: { "no-undef": "off" }
	}
];