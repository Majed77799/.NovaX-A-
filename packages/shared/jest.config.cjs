/** @type {import('jest').Config} */
module.exports = {
	testEnvironment: 'node',
	transform: {
		'^.+\\.(t|j)sx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.json' }]
	},
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
	testMatch: ['<rootDir>/__tests__/**/*.test.(ts|tsx|js)']
};

