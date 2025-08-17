#!/usr/bin/env node

const missingKeys: string[] = [];

function getEnv(name: string): string | undefined {
	const value = process.env[name];
	if (!value || value.trim() === "") {
		missingKeys.push(name);
		return undefined;
	}
	return value;
}

const linearApiKey = getEnv("LINEAR_API_KEY");
const linearTeamId = getEnv("LINEAR_TEAM_ID");
const linearWebhookSecret = process.env["LINEAR_WEBHOOK_SECRET"]; // optional for Phase 1

const isConnected = Boolean(linearApiKey && linearTeamId);

if (isConnected) {
	console.log("✅ Linear environment detected. Ready to proceed with setup.");
	console.log("- LINEAR_TEAM_ID:", linearTeamId);
	if (!linearWebhookSecret) {
		console.log("ℹ️  Optional: Set LINEAR_WEBHOOK_SECRET to verify incoming webhooks.");
	}
	process.exit(0);
} else {
	console.log("ℹ️  Linear is not fully configured yet.");
	if (missingKeys.length > 0) {
		console.log("Missing keys:", missingKeys.join(", "));
	}
	console.log("\nNext steps:");
	console.log("1) See docs/LINEAR_SETUP.md for how to obtain API key and Team ID");
	console.log("2) Add values to your .env or CI secrets:");
	console.log("   - LINEAR_API_KEY");
	console.log("   - LINEAR_TEAM_ID");
	console.log("   - LINEAR_WEBHOOK_SECRET (optional)");
	console.log("\nThis check exits gracefully so local and CI flows do not break.");
	process.exit(0);
}