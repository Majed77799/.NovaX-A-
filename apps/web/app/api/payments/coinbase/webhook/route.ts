import { NextRequest } from 'next/server';
import { Redis } from '@upstash/redis';

export const runtime = 'edge';

async function hmacSha256(secret: string, payload: string) {
	const enc = new TextEncoder();
	const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
	const sig = await crypto.subtle.sign('HMAC', key, enc.encode(payload));
	return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function POST(req: NextRequest) {
	const secret = process.env.COINBASE_COMMERCE_WEBHOOK_SECRET;
	if (!secret) return new Response('Not Configured', { status: 500 });
	const rawBody = await req.text();
	const sigHeader = req.headers.get('x-cc-webhook-signature') || '';
	const calc = await hmacSha256(secret, rawBody);
	if (sigHeader !== calc) return new Response('Invalid signature', { status: 401 });
	const event = JSON.parse(rawBody);
	const type = event?.event?.type as string;
	const chargeId = event?.event?.data?.id as string | undefined;
	const metadata = event?.event?.data?.metadata || {};
	const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
	const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
	if (!redisUrl || !redisToken) return new Response('OK', { status: 200 });
	const redis = new Redis({ url: redisUrl, token: redisToken });
	// Find session by chargeId in cached entries (simple approach: store direct key when creating)
	// In our create route, we store under session id. We cannot map chargeId -> session easily without extra index.
	// Store a secondary index if metadata.sessionId provided; fallback to no-op.
	const sessionId = metadata?.sessionId as string | undefined;
	if (sessionId) {
		if (type === 'charge:confirmed') await redis.set(`pay:${sessionId}`, { status: 'paid', provider: 'coinbase', chargeId }, { ex: 60*60*24 });
		if (type === 'charge:failed' || type === 'charge:pending_expired') await redis.set(`pay:${sessionId}`, { status: 'failed', provider: 'coinbase', chargeId }, { ex: 60*60*24 });
	}
	return new Response('OK', { status: 200 });
}