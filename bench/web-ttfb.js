#!/usr/bin/env node
const { request } = require('undici');

const url = process.env.BENCH_BASE_URL || 'http://localhost:3000';
const samples = Number(process.env.BENCH_SAMPLES || 9);

(async () => {
	const values = [];
	for (let i = 0; i < samples; i++) {
		const start = process.hrtime.bigint();
		const { body } = await request(`${url}/marketplace`, { method: 'GET', maxRedirections: 1 });
		await body.dump();
		const end = process.hrtime.bigint();
		values.push(Number(end - start) / 1e6);
	}
	values.sort((a,b)=>a-b);
	const p75 = values[Math.floor(values.length * 0.75) - 1] || values[values.length-1];
	console.log(JSON.stringify({ target: '/marketplace', samples, p75Ms: p75, values }, null, 2));
	if (process.env.BENCH_FAIL_ON_BUDGET === '1' && p75 > 200) process.exit(2);
})().catch(err => { console.error(err); process.exit(1); });