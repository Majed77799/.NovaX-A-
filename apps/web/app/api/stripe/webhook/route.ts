import { NextRequest } from 'next/server';
import { constructStripeEvent } from '@repo/integrations';
import { Redis } from '@upstash/redis';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
	const secret = process.env.STRIPE_WEBHOOK_SECRET;
	if (!secret) return new Response('Webhook secret missing', { status: 500 });
	const signature = req.headers.get('stripe-signature');
	const rawBody = await req.text();
	let event: any;
	try { event = await constructStripeEvent(rawBody, signature, secret); } catch { return new Response('Bad signature', { status: 400 }); }
	if (event.type === 'checkout.session.completed') {
		const session = event.data.object as any;
		const userId = session?.metadata?.userId;
		if (userId && process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
			const redis = Redis.fromEnv();
			await redis.set(`user:${userId}:premium`, '1');
		}
	}
	return new Response(null, { status: 204 });
}