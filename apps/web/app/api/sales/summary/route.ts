import { NextRequest } from 'next/server';
import Stripe from 'stripe';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
	try {
		const secret = process.env.STRIPE_SECRET_KEY;
		if (!secret) return Response.json({ ok: false, reason: 'stripe_not_configured' }, { status: 200 });
		const stripe = new Stripe(secret, { apiVersion: '2024-06-20' as any });
		const { searchParams } = new URL(req.url);
		const start = Number(searchParams.get('start')) || Math.floor(Date.now()/1000) - 60*60*24*30;
		const end = Number(searchParams.get('end')) || Math.floor(Date.now()/1000);
		let totalAmount = 0;
		let totalCount = 0;
		const params: Stripe.PaymentIntentListParams = { created: { gte: start, lte: end }, limit: 100 };
		for await (const pi of (stripe.paymentIntents.list(params) as any).autoPagingIterator?.() ?? (await stripe.paymentIntents.list(params)).data) {
			if (pi.status === 'succeeded') {
				totalAmount += pi.amount_received ?? 0;
				totalCount += 1;
			}
		}
		return Response.json({ ok: true, totalAmount, totalCount });
	} catch (e) {
		return Response.json({ ok: false, error: 'failed' }, { status: 500 });
	}
}