import { NextRequest } from 'next/server';
import Stripe from 'stripe';
import { connectToDatabase, OrderModel, ProductModel, UserModel } from '@repo/db';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
	const secret = process.env.STRIPE_SECRET_KEY;
	const whSecret = process.env.STRIPE_WEBHOOK_SECRET;
	if (!secret || !whSecret) return new Response('Stripe not configured', { status: 500 });
	const stripe = new Stripe(secret, { apiVersion: '2024-06-20' as any });
	const rawBody = await req.text();
	const sig = req.headers.get('stripe-signature') ?? '';
	let event: Stripe.Event;
	try { event = stripe.webhooks.constructEvent(rawBody, sig, whSecret); } catch {
		return new Response('Invalid signature', { status: 400 });
	}
	await connectToDatabase().catch(()=>null);
	if (event.type === 'checkout.session.completed') {
		const session = event.data.object as Stripe.Checkout.Session;
		const orderId = (session.metadata as any)?.orderId;
		if (!orderId) return new Response('ok');
		const order = await OrderModel.findById(orderId).catch(()=>null) as any;
		if (!order || order.status === 'paid') return new Response('ok');
		order.status = 'paid';
		order.stripeSessionId = session.id;
		await order.save();
		// Transfer revenue to creators
		for (const item of order.items ?? []) {
			const product = await ProductModel.findById(item.productId).lean().catch(()=>null) as any;
			if (!product) continue;
			for (const split of product.creators ?? []) {
				const amount = Math.round(item.priceCents * (split.shareBps / 10000));
				const user = await UserModel.findById(split.userId).lean().catch(()=>null) as any;
				if (!user?.stripeConnectId) continue;
				try {
					await stripe.transfers.create({ amount, currency: order.currency, destination: user.stripeConnectId, description: `Order ${order._id?.toString()} split` });
				} catch {}
			}
		}
	}
	return new Response('ok');
}