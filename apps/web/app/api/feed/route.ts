import { NextRequest } from 'next/server';
import { Redis } from '@upstash/redis';
import { detectLanguage } from '@repo/shared';
import { connectToDatabase, ProductModel, SocialActionModel } from '@repo/db';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
	const url = new URL(req.url);
	const userId = url.searchParams.get('userId') ?? 'anon';
	const acceptLang = req.headers.get('accept-language') ?? 'en';
	const lang = detectLanguage(acceptLang);

	const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
	const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
	const cacheKey = `feed:${userId}:${lang}`;
	if (redisUrl && redisToken) {
		const redis = Redis.fromEnv();
		const cached = await redis.get<string>(cacheKey);
		if (cached) return new Response(cached, { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=60' } });
	}

	await connectToDatabase().catch(()=>null);
	// Fetch candidate products
	const products = await ProductModel.find().limit(50).lean().catch(()=>[]) as any[];
	// Simple ranking: prefer items with more recent social actions
	const recentLikes = await SocialActionModel.find({ action: 'like' }).sort({ createdAt: -1 }).limit(200).lean().catch(()=>[]) as any[];
	const likeCounts = recentLikes.reduce((acc: Record<string, number>, a: any) => { acc[a.targetId] = (acc[a.targetId]||0)+1; return acc; }, {});
	const ranked = products
		.map(p => ({ p, score: (likeCounts[p._id?.toString()] ?? 0) + Math.random()*0.1 }))
		.sort((a,b) => b.score - a.score)
		.slice(0, 20)
		.map(({ p }) => ({ id: p._id?.toString(), title: p.title?.[lang] ?? p.title?.en ?? Object.values(p.title ?? {})[0], priceCents: p.priceCents, currency: p.currency }));

	const body = JSON.stringify({ items: ranked });
	if (redisUrl && redisToken) {
		const redis = Redis.fromEnv();
		await redis.set(cacheKey, body, { ex: 60 });
	}
	return new Response(body, { headers: { 'Content-Type': 'application/json' } });
}