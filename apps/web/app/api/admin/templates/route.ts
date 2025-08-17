import { NextRequest } from 'next/server';
import { prisma } from '@repo/db';

export const runtime = 'nodejs';

export async function GET() {
	const items = await prisma.campaignTemplate.findMany({ orderBy: { updatedAt: 'desc' } });
	return Response.json({ items });
}

export async function POST(req: NextRequest) {
	const { type, title, contentTemplate, placeholders } = await req.json().catch(() => ({}));
	if (!type || !title || !contentTemplate) return new Response('Bad Request', { status: 400 });
	const item = await prisma.campaignTemplate.create({ data: { type, title, contentTemplate, placeholders: placeholders ?? [] } });
	return Response.json({ item });
}

export async function PUT(req: NextRequest) {
	const { id, ...data } = await req.json().catch(() => ({}));
	if (!id) return new Response('Bad Request', { status: 400 });
	const item = await prisma.campaignTemplate.update({ where: { id }, data });
	return Response.json({ item });
}