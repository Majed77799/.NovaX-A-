import { NextRequest } from 'next/server';
import Stripe from 'stripe';
import { getUserFromRequest } from '@repo/shared/src/auth';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
	const price = process.env.STRIPE_PRICE_ID;
	if (!process.env.STRIPE_SECRET_KEY || !price) return new Response('Stripe not configured', { status: 500 });
	const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' as any });
	const origin = req.headers.get('origin') ?? process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
	const user = await getUserFromRequest(req);
	const session = await stripe.checkout.sessions.create({
		mode: 'payment',
		line_items: [{ price, quantity: 1 }],
		success_url: `${origin}/settings?status=success`,
		cancel_url: `${origin}/settings?status=cancel`,
		metadata: user?.userId ? { userId: user.userId, email: user.email ?? '' } : undefined
	});
	return Response.json({ url: session.url });
}