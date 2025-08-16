import { NextRequest } from 'next/server';
import Stripe from 'stripe';
import { connectToDatabase, OrderModel, ProductModel } from '@repo/db';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
	const { productId, buyerId = 'anon', quantity = 1 } = await req.json().catch(()=>({})) as { productId?: string; buyerId?: string; quantity?: number };
	const secret = process.env.STRIPE_SECRET_KEY;
	if (!secret) return new Response('Stripe not configured', { status: 500 });
	const stripe = new Stripe(secret, { apiVersion: '2024-06-20' as any });
	await connectToDatabase().catch(()=>null);
	let lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
	let currency = 'usd';
	let amountCents = 0;
	if (productId) {
		const product = await ProductModel.findById(productId).lean().catch(()=>null) as any;
		if (!product) return new Response('Not Found', { status: 404 });
		currency = product.currency;
		amountCents = product.priceCents * quantity;
		lineItems.push({ quantity, price_data: { currency, unit_amount: product.priceCents, product_data: { name: product.title?.en ?? Object.values(product.title ?? {})[0] ?? 'Product' } } });
	} else {
		const price = process.env.STRIPE_PRICE_ID;
		if (!price) return new Response('Stripe not configured', { status: 500 });
		lineItems.push({ price, quantity: 1 });
	}
	const order = await OrderModel.create({ buyerId, items: productId ? [{ productId, quantity, priceCents: amountCents/quantity, currency }] : [], amountCents, currency, status: 'created' });
	const origin = req.headers.get('origin') ?? process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
	const session = await stripe.checkout.sessions.create({
		mode: 'payment',
		line_items: lineItems,
		success_url: `${origin}/settings?status=success`,
		cancel_url: `${origin}/settings?status=cancel`,
		metadata: { orderId: order._id?.toString() }
	});
	return Response.json({ url: session.url });
}