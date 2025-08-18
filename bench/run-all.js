#!/usr/bin/env node
const { spawn } = require('node:child_process');

function run(cmd, args, env = {}) {
	return new Promise((resolve) => {
		const child = spawn(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, ...env } });
		let out = '';
		child.stdout.on('data', d => { out += d.toString(); });
		child.stderr.on('data', d => { out += d.toString(); });
		child.on('close', code => resolve({ code, out }));
	});
}

(async () => {
	const results = {};
	results.feed = await run('node', ['bench/api-feed.js']);
	results.pricing = await run('node', ['bench/api-pricing.js']);
	results.ttfb = await run('node', ['bench/web-ttfb.js']);
	results.mobile = await run('bash', ['bench/mobile-bundle.sh']);
	console.log(JSON.stringify({ results }, null, 2));
	const anyFail = Object.values(results).some(r => r.code && r.code !== 0);
	if (process.env.BENCH_FAIL_ON_BUDGET === '1' && anyFail) process.exit(2);
})();