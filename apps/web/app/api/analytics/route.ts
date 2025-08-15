import { NextRequest } from 'next/server';
import { Redis } from '@upstash/redis';
import { formatDateUTC, addDaysUTC, AnalyticsSummary, TimeseriesPoint } from '@repo/shared';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
		const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
		const now = new Date();
		const day = formatDateUTC(now);
		const type = (body?.t ?? 'evt') as string;
		const product = (body?.product ?? 'all') as string;
		if (redisUrl && redisToken) {
			const redis = Redis.fromEnv();
			// global daily counter
			await redis.incr(`analytics:day:${day}:total`);
			// type breakdown
			await redis.incr(`analytics:day:${day}:type:${type}`);
			// product breakdown
			await redis.incr(`analytics:day:${day}:product:${product}`);
		} else {
			console.log('analytics', { type, product, day });
		}
		return Response.json({ ok: true });
	} catch {
		return new Response('Bad Request', { status: 400 });
	}
}

export async function GET(req: NextRequest) {
	const url = new URL(req.url);
	const daysParam = Number(url.searchParams.get('days') ?? '14');
	const days = Number.isFinite(daysParam) && daysParam > 0 && daysParam <= 90 ? Math.floor(daysParam) : 14;
	const now = new Date();
	const end = formatDateUTC(now);
	const startDate = addDaysUTC(now, -days + 1);
	const start = formatDateUTC(startDate);
	const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
	const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
	let total = 0;
	let previousTotal = 0;
	const series: TimeseriesPoint[] = [];
	const byType = new Map<string, number>();
	const byProduct = new Map<string, number>();
	if (redisUrl && redisToken) {
		const redis = Redis.fromEnv();
		for (let i = 0; i < days; i++) {
			const d = formatDateUTC(addDaysUTC(startDate, i));
			const v = Number(await redis.get<number>(`analytics:day:${d}:total`)) || 0;
			series.push({ date: d, value: v });
			total += v;
		}
		// previous window for change
		for (let i = 0; i < days; i++) {
			const d = formatDateUTC(addDaysUTC(startDate, i - days));
			previousTotal += Number(await redis.get<number>(`analytics:day:${d}:total`)) || 0;
		}
		// accumulate types and products for current window
		for (let i = 0; i < days; i++) {
			const d = formatDateUTC(addDaysUTC(startDate, i));
			// naive few common types
			const types = ['message','image','tts','stt','evt'];
			for (const t of types) {
				const v = Number(await redis.get<number>(`analytics:day:${d}:type:${t}`)) || 0;
				if (v) byType.set(t, (byType.get(t) ?? 0) + v);
			}
			const products = ['chat','explore','settings','all'];
			for (const p of products) {
				const v = Number(await redis.get<number>(`analytics:day:${d}:product:${p}`)) || 0;
				if (v) byProduct.set(p, (byProduct.get(p) ?? 0) + v);
			}
		}
	} else {
		// fallback: generate demo data
		for (let i = 0; i < days; i++) {
			const d = formatDateUTC(addDaysUTC(startDate, i));
			const base = 100 + Math.round(Math.sin(i / 3) * 20) + Math.round(Math.random() * 8);
			series.push({ date: d, value: base });
			total += base;
		}
		previousTotal = Math.max(1, Math.round(total * 0.9));
		byType.set('message', Math.round(total * 0.7));
		byType.set('image', Math.round(total * 0.15));
		byType.set('tts', Math.round(total * 0.1));
		byType.set('stt', Math.round(total * 0.05));
		byProduct.set('chat', Math.round(total * 0.8));
		byProduct.set('explore', Math.round(total * 0.15));
		byProduct.set('settings', Math.round(total * 0.05));
	}
	const changePct = previousTotal ? ((total - previousTotal) / previousTotal) * 100 : undefined;
	const summary: AnalyticsSummary = {
		range: { start, end },
		totalEvents: total,
		activeProducts: byProduct.size,
		byType: Array.from(byType.entries()).map(([type, total]) => ({ type, total })).sort((a,b)=>b.total-a.total),
		timeseries: series,
		previousTotal,
		changePct
	};
	return Response.json(summary, { headers: { 'Cache-Control': 'no-store' } });
}