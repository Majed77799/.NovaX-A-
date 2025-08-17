import { NextRequest } from 'next/server';
import { prisma } from '@repo/db';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
	const { name, description, defaultPriceCents, currency, creatorId, coverUrl } = await req.json().catch(() => ({}));
	if (!name || !defaultPriceCents || !creatorId) return new Response('Bad Request', { status: 400 });
	const product = await prisma.product.create({ data: { name, description, defaultPriceCents, currency: currency ?? 'usd', creatorId, coverUrl } });
	const code = `aff_${Math.random().toString(36).slice(2, 10)}`;
	await prisma.affiliateLink.create({ data: { productId: product.id, code, commissionPercent: product.commissionPercent } });
	return Response.json({ product });
}