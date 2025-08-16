import { NextRequest } from 'next/server';
import Stripe from 'stripe';
import { connectToDatabase, UserModel } from '@repo/db';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
	const { userId } = await req.json().catch(()=>({})) as { userId?: string };
	if (!userId) return new Response('Bad Request', { status: 400 });
	const secret = process.env.STRIPE_SECRET_KEY;
	if (!secret) return new Response('Stripe not configured', { status: 500 });
	const stripe = new Stripe(secret, { apiVersion: '2024-06-20' as any });
	await connectToDatabase().catch(()=>null);
	let user = await UserModel.findById(userId).catch(()=>null) as any;
	if (!user) return new Response('User not found', { status: 404 });
	if (!user.stripeConnectId) {
		const account = await stripe.accounts.create({ type: 'express' });
		user.stripeConnectId = account.id;
		await user.save();
	}
	const origin = req.headers.get('origin') ?? process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
	const link = await stripe.accountLinks.create({ account: user.stripeConnectId, refresh_url: `${origin}/settings`, return_url: `${origin}/settings`, type: 'account_onboarding' });
	return Response.json({ url: link.url });
}