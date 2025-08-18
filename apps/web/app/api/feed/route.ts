export const runtime = 'edge';

import { Redis } from '@upstash/redis';

const headers = {
	'Access-Control-Allow-Origin': process.env.NOVAX_CORS_ORIGIN ?? '*',
	'Access-Control-Allow-Methods': 'GET,OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type, Authorization',
	'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=600'
};

async function getCachedFeed() {
	const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
	const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
	if (!redisUrl || !redisToken) return null;
	try {
		const redis = Redis.fromEnv();
		const cached = await redis.get<string>('feed:v1');
		return cached ? JSON.parse(cached) : null;
	} catch {
		return null;
	}
}

async function setCachedFeed(value: unknown) {
	const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
	const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
	if (!redisUrl || !redisToken) return;
	try {
		const redis = Redis.fromEnv();
		await redis.set('feed:v1', JSON.stringify(value), { ex: 60 });
	} catch {}
}

export async function GET() {
	const cached = await getCachedFeed();
	if (cached) return Response.json({ ok: true, source: 'cache', items: cached }, { headers: { ...headers, 'x-cache': 'hit' } });

	const items = Array.from({ length: 10 }).map((_, i) => ({ id: `${i + 1}`, title: `Item ${i + 1}` }));
	await setCachedFeed(items);
	return Response.json({ ok: true, source: 'origin', items }, { headers: { ...headers, 'x-cache': 'miss' } });
}

export async function OPTIONS() {
	return new Response(null, { status: 204, headers });
}