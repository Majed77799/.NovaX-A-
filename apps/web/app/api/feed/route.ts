import { NextRequest } from 'next/server';
import { prisma } from '@repo/db';
import { Redis } from '@upstash/redis';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const cursor = searchParams.get('cursor') ?? undefined;
	const limit = Math.min(parseInt(searchParams.get('limit') ?? '10', 10) || 10, 50);
	const userId = searchParams.get('userId') ?? undefined;

	const products = await prisma.product.findMany({
		where: { published: true },
		orderBy: { createdAt: 'desc' },
		take: limit + 1,
		cursor: cursor ? { id: cursor } : undefined,
		include: { sales: true, events: true, creator: true }
	});

	function score(p: any) {
		const sales = p.sales.length;
		const engagement = p.events.length;
		const recency = 1 / (1 + (Date.now() - new Date(p.createdAt).getTime()) / (1000 * 60 * 60 * 24));
		let prefs = 0;
		if (userId) {
			const liked = p.events.find((e: any) => e.userId === userId && (e.type === 'LIKE' || e.type === 'SAVE')) ? 1 : 0;
			prefs = liked * 0.5;
		}
		return sales * 1.5 + engagement * 1.0 + recency * 5 + prefs;
	}

	const sorted = products.sort((a, b) => score(b) - score(a));
	const items = sorted.slice(0, limit).map(p => ({
		id: p.id,
		name: p.name,
		coverUrl: p.coverUrl,
		creator: { id: p.creatorId, name: p.creator?.name },
		priceCents: p.defaultPriceCents,
		currency: p.currency
	}));
	const nextCursor = products.length > limit ? products[limit]?.id : undefined;
	return Response.json({ items, nextCursor });
}

export async function POST(req: NextRequest) {
	const { productId, userId, type } = await req.json().catch(() => ({}));
	if (!productId || !type) return new Response('Bad Request', { status: 400 });
	await prisma.feedEvent.create({ data: { productId, userId, type } as any });
	try {
		if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
			const redis = Redis.fromEnv();
			await redis.incr('feed:version');
		}
	} catch {}
	return Response.json({ ok: true });
}