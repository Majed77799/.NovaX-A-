import { NextRequest } from 'next/server';
import { Redis } from '@upstash/redis';
import { getUserFromRequest } from '@repo/shared/src/auth';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
	const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
	const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
	let analytics: Record<string, number> = {};
	let latest = { market: [] as any[], content: [] as any[] };
	if (redisUrl && redisToken) {
		const redis = Redis.fromEnv();
		const keys = ['analytics:evt', 'analytics:message'];
		const values = await redis.mget<number[]>(...keys);
		analytics = Object.fromEntries(keys.map((k, i) => [k.replace('analytics:',''), values?.[i] ?? 0]));
		const user = await getUserFromRequest(req);
		if (user?.userId) {
			const [market, content] = await Promise.all([
				redis.lrange<string>(`user:${user.userId}:market`, 0, 9),
				redis.lrange<string>(`user:${user.userId}:content`, 0, 9)
			]);
			latest.market = market.map((s) => { try { return JSON.parse(s); } catch { return null; } }).filter(Boolean);
			latest.content = content.map((s) => { try { return JSON.parse(s); } catch { return null; } }).filter(Boolean);
		}
	}
	return Response.json({ analytics, latest });
}