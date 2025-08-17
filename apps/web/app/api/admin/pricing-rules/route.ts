import { NextRequest } from 'next/server';
import { prisma } from '@repo/db';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const productId = searchParams.get('productId') ?? undefined;
	const rules = await prisma.pricingRule.findMany({ where: { productId }, orderBy: { priority: 'desc' } });
	return Response.json({ rules });
}

export async function POST(req: NextRequest) {
	const body = await req.json().catch(() => ({}));
	const rule = await prisma.pricingRule.create({ data: body });
	return Response.json({ rule });
}

export async function PUT(req: NextRequest) {
	const { id, ...data } = await req.json().catch(() => ({}));
	if (!id) return new Response('Bad Request', { status: 400 });
	const rule = await prisma.pricingRule.update({ where: { id }, data });
	return Response.json({ rule });
}