import { NextRequest } from 'next/server';
import { Redis } from '@upstash/redis';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
	const id = new URL(req.url).searchParams.get('id');
	if (!id) return new Response('Bad Request', { status: 400 });
	const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
	const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
	if (!redisUrl || !redisToken) return new Response('Not Configured', { status: 500 });
	const redis = new Redis({ url: redisUrl, token: redisToken });
	const data = await redis.get(`pay:${id}`);
	return Response.json({ data });
}