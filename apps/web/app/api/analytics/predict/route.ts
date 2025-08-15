import { NextRequest } from 'next/server';
import { Redis } from '@upstash/redis';
import { addDaysUTC, formatDateUTC, PredictionPoint, PredictionResponse } from '@repo/shared';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
	const url = new URL(req.url);
	const daysParam = Number(url.searchParams.get('days') ?? '14');
	const horizonParam = Number(url.searchParams.get('horizon') ?? '7');
	const days = Number.isFinite(daysParam) && daysParam > 3 && daysParam <= 90 ? Math.floor(daysParam) : 14;
	const horizon = Number.isFinite(horizonParam) && horizonParam > 0 && horizonParam <= 30 ? Math.floor(horizonParam) : 7;
	const now = new Date();
	const startDate = addDaysUTC(now, -days + 1);
	const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
	const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
	const history: number[] = [];
	if (redisUrl && redisToken) {
		const redis = Redis.fromEnv();
		for (let i = 0; i < days; i++) {
			const d = formatDateUTC(addDaysUTC(startDate, i));
			const v = Number(await redis.get<number>(`analytics:day:${d}:total`)) || 0;
			history.push(v);
		}
	} else {
		for (let i = 0; i < days; i++) {
			history.push(100 + Math.round(Math.sin(i/3)*20) + Math.round(Math.random()*8));
		}
	}
	const actual: PredictionPoint[] = [];
	for (let i = 0; i < days; i++) {
		const d = formatDateUTC(addDaysUTC(startDate, i));
		actual.push({ date: d, value: history[i]!, kind: 'actual' });
	}
	// simple linear regression y = a*x + b over last N points
	let basis: 'linear'|'avg'|'none' = 'none';
	let forecast: number[] = [];
	if (history.length >= 4) {
		const n = history.length;
		let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
		for (let i = 0; i < n; i++) {
			sumX += i;
			sumY += history[i]!;
			sumXY += i * history[i]!;
			sumXX += i * i;
		}
		const denom = (n * sumXX - sumX * sumX);
		if (denom !== 0) {
			const a = (n * sumXY - sumX * sumY) / denom;
			const b = (sumY - a * sumX) / n;
			basis = 'linear';
			for (let i = 0; i < horizon; i++) {
				const x = n + i;
				forecast.push(Math.max(0, Math.round(a * x + b)));
			}
		}
	}
	if (basis === 'none') {
		basis = 'avg';
		const avg = Math.round(history.reduce((s, v) => s + v, 0) / history.length);
		forecast = Array.from({ length: horizon }, () => avg);
	}
	const predicted: PredictionPoint[] = [];
	for (let i = 0; i < horizon; i++) {
		const d = formatDateUTC(addDaysUTC(now, i + 1));
		predicted.push({ date: d, value: forecast[i]!, kind: 'predicted' });
	}
	const series: PredictionPoint[] = [...actual, ...predicted];
	const resp: PredictionResponse = { basis, horizon, series };
	return Response.json(resp, { headers: { 'Cache-Control': 'no-store' } });
}