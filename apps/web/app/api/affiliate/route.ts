import { NextRequest } from 'next/server';
import { prisma } from '@repo/db';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
	const { productId, userId, commissionPercent } = await req.json().catch(() => ({}));
	if (!productId) return new Response('Bad Request', { status: 400 });
	const product = await prisma.product.findUnique({ where: { id: productId } });
	if (!product) return new Response('Not Found', { status: 404 });
	const code = `aff_${Math.random().toString(36).slice(2, 10)}`;
	const link = await prisma.affiliateLink.create({ data: { productId, userId, commissionPercent: commissionPercent ?? product.commissionPercent, code } });
	return Response.json({ link });
}

export async function PUT(req: NextRequest) {
	const { code } = await req.json().catch(() => ({}));
	if (!code) return new Response('Bad Request', { status: 400 });
	const ip = req.headers.get('x-forwarded-for') ?? '';
	const ua = req.headers.get('user-agent') ?? '';
	const referer = req.headers.get('referer') ?? '';
	const link = await prisma.affiliateLink.findUnique({ where: { code } });
	if (!link) return new Response('Not Found', { status: 404 });
	await prisma.affiliateClick.create({ data: { affiliateLinkId: link.id, ip, userAgent: ua, referer } });
	return Response.json({ ok: true });
}