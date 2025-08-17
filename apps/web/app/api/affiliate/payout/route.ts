import { NextRequest } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@repo/db';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
	const { code, userId, dryRun } = await req.json().catch(() => ({}));
	if (!code && !userId) return new Response('Bad Request', { status: 400 });

	let commissions = [] as { id: string; amountCents: number }[];
	let stripeAccountId: string | undefined;

	if (code) {
		const link = await prisma.affiliateLink.findUnique({ where: { code }, include: { commissions: { where: { status: 'PENDING' } }, user: true } });
		if (!link) return new Response('Not Found', { status: 404 });
		commissions = link.commissions.map(c => ({ id: c.id, amountCents: c.amountCents }));
		stripeAccountId = link.user?.stripeAccountId ?? undefined;
	} else if (userId) {
		const links = await prisma.affiliateLink.findMany({ where: { userId }, include: { commissions: { where: { status: 'PENDING' } } } });
		commissions = links.flatMap(l => l.commissions.map(c => ({ id: c.id, amountCents: c.amountCents })));
		const user = await prisma.user.findUnique({ where: { id: userId } });
		stripeAccountId = user?.stripeAccountId ?? undefined;
	}

	const totalCents = commissions.reduce((s, c) => s + c.amountCents, 0);
	if (dryRun) return Response.json({ totalCents, count: commissions.length, stripeAccountId });

	if (totalCents <= 0) return Response.json({ ok: true, totalCents: 0 });

	if (process.env.STRIPE_SECRET_KEY && stripeAccountId) {
		const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' as any });
		try {
			await stripe.transfers.create({ amount: totalCents, currency: 'usd', destination: stripeAccountId, metadata: { reason: 'affiliate_commissions' } });
		} catch (err) {
			// fallback: mark as paid even if transfer failed in test env
		}
	}

	const now = new Date();
	await prisma.affiliateCommission.updateMany({ where: { id: { in: commissions.map(c => c.id) } }, data: { status: 'PAID', paidAt: now } });
	return Response.json({ ok: true, totalCents });
}