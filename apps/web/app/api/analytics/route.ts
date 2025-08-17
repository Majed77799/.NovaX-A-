import { NextRequest } from 'next/server';
import { Redis } from '@upstash/redis';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
		const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
		if (redisUrl && redisToken) {
			const redis = Redis.fromEnv();
			await redis.incr(`analytics:${body.t ?? 'evt'}`);
		} else {
			console.log('analytics', body?.t ?? 'evt');
		}
		return Response.json({ ok: true });
	} catch {
		return new Response('Bad Request', { status: 400 });
	}
}