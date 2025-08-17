import { NextRequest } from 'next/server';
import Stripe from 'stripe';
import { prisma, evaluatePricingForProduct } from '@repo/db';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
	const body = await req.json().catch(() => ({})) as { productId?: string; affiliateCode?: string; buyerEmail?: string };
	const productId = body.productId;
	if (!process.env.STRIPE_SECRET_KEY || !productId) return new Response('Stripe not configured', { status: 500 });
	const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' as any });
	const origin = req.headers.get('origin') ?? process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
	const product = await prisma.product.findUnique({ where: { id: productId } });
	if (!product) return new Response('Not Found', { status: 404 });
	const country = (req.headers.get('x-vercel-ip-country') || req.headers.get('x-geo-country') || '').toLowerCase() || undefined;
	const priceEval = await evaluatePricingForProduct(productId, { country });

	const metadata: Record<string, string> = { productId, affiliateCode: body.affiliateCode ?? '' };
	const session = await stripe.checkout.sessions.create({
		mode: 'payment',
		line_items: [{
			price_data: {
				currency: priceEval.currency,
				product_data: { name: product.name },
				unit_amount: priceEval.priceCents
			},
			quantity: 1
		}],
		success_url: `${origin}/settings?status=success`,
		cancel_url: `${origin}/settings?status=cancel`,
		metadata,
		customer_email: body.buyerEmail
	});
	return Response.json({ url: session.url });
}