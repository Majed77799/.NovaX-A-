#!/usr/bin/env node
const autocannon = require('autocannon');

const url = process.env.BENCH_BASE_URL || 'http://localhost:3000';

autocannon({
	url: `${url}/api/feed`,
	connections: Number(process.env.BENCH_CONN || 20),
	duration: Number(process.env.BENCH_DURATION || 15),
	method: 'GET',
	headers: { Accept: 'application/json' }
}, (err, result) => {
	if (err) {
		console.error(err);
		process.exitCode = 1;
		return;
	}
	const p95 = (result.latency && (result.latency.p95 ?? result.latency.p97_5)) || null;
	const p99 = result.latency && result.latency.p99;
	console.log(JSON.stringify({ target: '/api/feed', p95, p99, result }, null, 2));
	const over = (p95 != null && p95 > 200) || (p99 != null && p99 > 400);
	if (process.env.BENCH_FAIL_ON_BUDGET === '1' && over) process.exit(2);
});