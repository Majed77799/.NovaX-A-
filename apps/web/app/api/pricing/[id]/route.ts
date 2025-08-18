export const runtime = 'edge';

import { Redis } from '@upstash/redis';
import { NextRequest } from 'next/server';

const headers = {
	'Access-Control-Allow-Origin': process.env.NOVAX_CORS_ORIGIN ?? '*',
	'Access-Control-Allow-Methods': 'GET,OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type, Authorization',
	'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600'
};

async function getCachedPrice(id: string) {
	const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
	const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
	if (!redisUrl || !redisToken) return null;
	try {
		const redis = Redis.fromEnv();
		const cached = await redis.get<string>(`price:${id}:v1`);
		return cached ? JSON.parse(cached) : null;
	} catch {
		return null;
	}
}

async function setCachedPrice(id: string, value: unknown) {
	const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
	const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
	if (!redisUrl || !redisToken) return;
	try {
		const redis = Redis.fromEnv();
		await redis.set(`price:${id}:v1`, JSON.stringify(value), { ex: 120 });
	} catch {}
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
	const id = params.id;
	if (!id) return new Response('Bad Request', { status: 400, headers });

	const cached = await getCachedPrice(id);
	if (cached) return Response.json({ ok: true, source: 'cache', id, price: cached }, { headers: { ...headers, 'x-cache': 'hit' } });

	const price = { currency: 'USD', amount: 999 + (Number(id.replace(/\D/g, '')) % 100) };
	await setCachedPrice(id, price);
	return Response.json({ ok: true, source: 'origin', id, price }, { headers: { ...headers, 'x-cache': 'miss' } });
}

export async function OPTIONS() {
	return new Response(null, { status: 204, headers });
}