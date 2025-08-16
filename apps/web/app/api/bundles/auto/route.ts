import { NextRequest } from 'next/server';
import { Redis } from '@upstash/redis';
import { connectToDatabase, ProductModel, SocialActionModel } from '@repo/db';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
	const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
	const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
	const cacheKey = 'bundles:auto';
	if (redisUrl && redisToken) {
		const redis = Redis.fromEnv();
		const cached = await redis.get<string>(cacheKey);
		if (cached) return new Response(cached, { headers: { 'Content-Type': 'application/json' } });
	}
	await connectToDatabase().catch(()=>null);
	const products = await ProductModel.find().limit(100).lean().catch(()=>[]) as any[];
	const recentLikes = await SocialActionModel.find({ action: 'like' }).sort({ createdAt: -1 }).limit(300).lean().catch(()=>[]) as any[];
	const likeCounts = recentLikes.reduce((acc: Record<string, number>, a: any) => { acc[a.targetId] = (acc[a.targetId]||0)+1; return acc; }, {});
	const sorted = products.sort((a,b) => (likeCounts[b._id?.toString()] ?? 0) - (likeCounts[a._id?.toString()] ?? 0));
	const bundles = [] as any[];
	for (let i=0;i<sorted.length;i+=3) {
		const group = sorted.slice(i, i+3);
		if (group.length < 2) break;
		const bundlePrice = Math.round(group.reduce((sum: number, p: any) => sum + p.priceCents, 0) * 0.85);
		bundles.push({ id: `auto-${i/3}`, productIds: group.map((p:any)=>p._id?.toString()), priceCents: bundlePrice, discountPct: 15 });
	}
	const body = JSON.stringify({ bundles });
	if (redisUrl && redisToken) { const redis = Redis.fromEnv(); await redis.set(cacheKey, body, { ex: 300 }); }
	return new Response(body, { headers: { 'Content-Type': 'application/json' } });
}