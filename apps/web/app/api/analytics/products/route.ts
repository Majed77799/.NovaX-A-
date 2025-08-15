import { NextRequest } from 'next/server';
import { Redis } from '@upstash/redis';
import { addDaysUTC, formatDateUTC, ProductTrend, TimeseriesPoint } from '@repo/shared';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
	const url = new URL(req.url);
	const daysParam = Number(url.searchParams.get('days') ?? '14');
	const days = Number.isFinite(daysParam) && daysParam > 0 && daysParam <= 90 ? Math.floor(daysParam) : 14;
	const now = new Date();
	const startDate = addDaysUTC(now, -days + 1);
	const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
	const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
	const knownProducts = ['chat','explore','settings','all'];
	const result: ProductTrend[] = [];
	if (redisUrl && redisToken) {
		const redis = Redis.fromEnv();
		for (const p of knownProducts) {
			let total = 0;
			const series: TimeseriesPoint[] = [];
			for (let i = 0; i < days; i++) {
				const d = formatDateUTC(addDaysUTC(startDate, i));
				const v = Number(await redis.get<number>(`analytics:day:${d}:product:${p}`)) || 0;
				series.push({ date: d, value: v });
				total += v;
			}
			if (total > 0) result.push({ product: p, total, timeseries: series });
		}
	} else {
		for (const p of knownProducts) {
			let total = 0;
			const series: TimeseriesPoint[] = [];
			for (let i = 0; i < days; i++) {
				const d = formatDateUTC(addDaysUTC(startDate, i));
				const base = 60 + (p === 'chat' ? 30 : p === 'explore' ? 10 : 5);
				const v = Math.max(0, base + Math.round(Math.sin(i / 3 + (p==='explore'?0.4:0)) * 12) + Math.round(Math.random() * 5) - 2);
				series.push({ date: d, value: v });
				total += v;
			}
			result.push({ product: p, total, timeseries: series });
		}
	}
	result.sort((a,b)=>b.total-a.total);
	return Response.json(result, { headers: { 'Cache-Control': 'no-store' } });
}