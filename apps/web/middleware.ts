import { NextResponse, type NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { jwtVerify } from 'jose';

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
const limiter = redisUrl && redisToken ? new Ratelimit({ redis: Redis.fromEnv(), limiter: Ratelimit.fixedWindow(30, '1 m') }) : null;
const authSecret = process.env.AUTH_JWT_SECRET;

export async function middleware(request: NextRequest) {
	const ip = request.ip ?? request.headers.get('x-forwarded-for') ?? 'unknown';
	if (limiter) {
		const { success } = await limiter.limit(`mw:${ip}`);
		if (!success) return new NextResponse('Too Many Requests', { status: 429 });
	}
	if (request.nextUrl.pathname.startsWith('/api') && authSecret) {
		const auth = request.headers.get('authorization') ?? '';
		const token = auth.toLowerCase().startsWith('bearer ') ? auth.slice(7).trim() : '';
		if (!token) return new NextResponse('Unauthorized', { status: 401 });
		try { await jwtVerify(token, new TextEncoder().encode(authSecret)); } catch { return new NextResponse('Unauthorized', { status: 401 }); }
	}
	const res = NextResponse.next();
	res.headers.set('x-request-id', crypto.randomUUID());
	return res;
}

export const config = { matcher: ['/api/:path*'] };