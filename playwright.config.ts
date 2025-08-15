import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	testDir: './e2e',
	retries: 0,
	workers: 1,
	use: {
		headless: true,
		baseURL: 'http://localhost:5174',
		trace: 'retain-on-failure',
	},
	projects: [
		{ name: 'chromium', use: { ...devices['Desktop Chrome'] } },
	],
	webServer: {
		command: 'node web/server.js',
		port: 5174,
		reuseExistingServer: !process.env.CI,
		timeout: 15000,
	},
});