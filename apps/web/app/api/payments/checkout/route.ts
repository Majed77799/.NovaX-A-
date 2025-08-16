import { NextRequest } from 'next/server';
import { Redis } from '@upstash/redis';
import Stripe from 'stripe';

export const runtime = 'edge';

async function createStripeCheckout(amount: number, currency: string, origin: string) {
	const price = process.env.STRIPE_PRICE_ID;
	const key = process.env.STRIPE_SECRET_KEY;
	if (!key) throw new Error('STRIPE_NOT_CONFIGURED');
	const stripe = new Stripe(key as string, { apiVersion: '2024-06-20' as any });
	const session = await stripe.checkout.sessions.create({
		mode: 'payment',
		line_items: price ? [{ price, quantity: 1 }] : [{ price_data: { currency, unit_amount: amount, product_data: { name: 'NovaX Product' } }, quantity: 1 }],
		success_url: `${origin}/settings?status=success`,
		cancel_url: `${origin}/settings?status=cancel`
	});
	return { url: session.url! };
}

async function createCoinbaseCharge(amount: number, currency: string, name: string, sessionId: string) {
	const apiKey = process.env.COINBASE_COMMERCE_API_KEY;
	if (!apiKey) throw new Error('COINBASE_NOT_CONFIGURED');
	const res = await fetch('https://api.commerce.coinbase.com/charges', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', 'X-CC-Api-Key': apiKey, 'X-CC-Version': '2018-03-22' },
		body: JSON.stringify({ name, pricing_type: 'fixed_price', local_price: { amount: (amount/100).toFixed(2), currency }, metadata: { sessionId } })
	});
	if (!res.ok) throw new Error('COINBASE_CREATE_FAILED');
	const data = await res.json();
	return { url: data?.data?.hosted_url as string, id: data?.data?.id as string };
}

function createWiseInstructions(amount: number, currency: string, reference: string) {
	// Provide bank details via env and return instruction URL-like payload
	const accName = process.env.WISE_BENEFICIARY_NAME || 'NovaX Ltd';
	const iban = process.env.WISE_BENEFICIARY_IBAN || 'DE00 0000 0000 0000 0000 00';
	const bic = process.env.WISE_BENEFICIARY_BIC || 'TRWIBEB1XXX';
	const note = `REF ${reference}`;
	const instructions = `Transfer ${amount/100} ${currency} to ${accName}, IBAN ${iban}, BIC ${bic}. Use reference: ${note}.`;
	return { url: `wise://instructions?ref=${encodeURIComponent(reference)}`, note, instructions };
}

export async function POST(req: NextRequest) {
	const { method = 'stripe', amount = 1000, currency = 'USD', name = 'NovaX Product', productId = 'default' } = await req.json().catch(() => ({}));
	const origin = req.headers.get('origin') ?? process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
	const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
	const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
	const redis = redisUrl && redisToken ? new Redis({ url: redisUrl, token: redisToken }) : null;
	const sessionId = crypto.randomUUID();

	async function persist(status: string, payload: any) {
		if (!redis) return;
		await redis.set(`pay:${sessionId}`, { status, method, amount, currency, productId, payload }, { ex: 60 * 60 * 24 });
	}

	try {
		if (method === 'crypto') {
			const c = await createCoinbaseCharge(amount, currency, name, sessionId);
			await persist('pending', { provider: 'coinbase', chargeId: c.id });
			return Response.json({ url: c.url, sessionId });
		}
		if (method === 'wise') {
			const ref = `NVX-${sessionId.slice(0,8)}`;
			const i = createWiseInstructions(amount, currency, ref);
			await persist('pending', { provider: 'wise', reference: ref });
			return Response.json({ url: i.url, reference: ref, instructions: i.instructions, sessionId });
		}
		if (method === 'stripe' || method === 'paypal') {
			// paypal not implemented -> fallback to stripe
			const s = await createStripeCheckout(amount, currency, origin);
			await persist('pending', { provider: 'stripe' });
			return Response.json({ url: s.url, sessionId });
		}
		throw new Error('UNSUPPORTED_METHOD');
	} catch (err) {
		// Fallback to Stripe
		try {
			const s = await createStripeCheckout(amount, currency, origin);
			await persist('pending', { provider: 'stripe' });
			return Response.json({ url: s.url, sessionId, fallback: true });
		} catch {
			return new Response('Payment initialization failed', { status: 500 });
		}
	}
}