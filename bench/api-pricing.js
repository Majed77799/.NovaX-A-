#!/usr/bin/env node
const autocannon = require('autocannon');

const url = process.env.BENCH_BASE_URL || 'http://localhost:3000';
const id = process.env.BENCH_PRICE_ID || '123';

autocannon({
	url: `${url}/api/pricing/${id}`,
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
	console.log(JSON.stringify({ target: '/api/pricing/:id', p95, result }, null, 2));
	const over = (p95 != null && p95 > 150);
	if (process.env.BENCH_FAIL_ON_BUDGET === '1' && over) process.exit(2);
});