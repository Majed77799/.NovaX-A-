import { NextRequest } from 'next/server';
import { prisma } from '@repo/db';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const code = searchParams.get('code');
	if (!code) return new Response('Bad Request', { status: 400 });
	const link = await prisma.affiliateLink.findUnique({ where: { code }, include: { clicks: true, commissions: true } });
	if (!link) return new Response('Not Found', { status: 404 });
	const clicks = link.clicks.length;
	const conversions = link.commissions.length;
	const earningsCents = link.commissions.reduce((sum, c) => sum + c.amountCents, 0);
	return Response.json({ code, clicks, conversions, earningsCents, currency: 'usd' });
}