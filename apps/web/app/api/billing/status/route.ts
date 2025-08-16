import { NextRequest } from 'next/server';
import { getUserFromRequest } from '@repo/shared/src/auth';
import { Redis } from '@upstash/redis';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
	const user = await getUserFromRequest(req);
	if (!user?.userId) return Response.json({ premium: false });
	if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
		const redis = Redis.fromEnv();
		const v = await redis.get<string>(`user:${user.userId}:premium`);
		return Response.json({ premium: v === '1' });
	}
	return Response.json({ premium: false });
}