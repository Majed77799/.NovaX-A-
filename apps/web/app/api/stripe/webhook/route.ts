import { NextRequest } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@repo/db';
import { enqueueWatermarkJob } from '@repo/queue';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
	const secret = process.env.STRIPE_WEBHOOK_SECRET;
	if (!process.env.STRIPE_SECRET_KEY || !secret) return new Response('Stripe not configured', { status: 500 });
	const body = await req.text();
	const sig = req.headers.get('stripe-signature') ?? '';
	const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' as any });
	let event: Stripe.Event;
	try { event = stripe.webhooks.constructEvent(body, sig, secret); } catch { return new Response('Bad signature', { status: 400 }); }

	if (event.type === 'checkout.session.completed') {
		const session = event.data.object as Stripe.Checkout.Session;
		const productId = (session.metadata?.productId ?? '') as string;
		const affiliateCode = (session.metadata?.affiliateCode ?? '') as string;
		const buyerEmail = session.customer_details?.email ?? session.customer_email ?? '';
		const amountTotal = session.amount_total ?? 0;
		const currency = session.currency ?? 'usd';
		if (productId && buyerEmail) {
			const sale = await prisma.sale.create({ data: {
				productId,
				buyerEmail,
				priceCents: amountTotal,
				currency,
				transactionHash: session.id
			}});
			if (affiliateCode) {
				const link = await prisma.affiliateLink.findUnique({ where: { code: affiliateCode } });
				if (link) {
					const percent = link.commissionPercent ?? (await prisma.product.findUnique({ where: { id: productId } }))?.commissionPercent ?? 0;
					const amountCents = Math.floor((amountTotal * percent) / 100);
					await prisma.affiliateCommission.create({ data: { affiliateLinkId: link.id, saleId: sale.id, amountCents } });
				}
			}
			await prisma.watermarkJob.create({ data: { saleId: sale.id, status: 'QUEUED' } });
			await enqueueWatermarkJob(sale.id);
		}
	}

	return Response.json({ received: true });
}

export async function GET() { return new Response('ok'); }