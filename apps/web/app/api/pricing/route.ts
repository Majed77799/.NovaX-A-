import { NextRequest } from 'next/server';
import { Redis } from '@upstash/redis';
import { connectToDatabase, PricingRuleModel, ProductModel } from '@repo/db';

export const runtime = 'nodejs';

function applyRules(baseCents: number, rules: any[]): number {
	let price = baseCents;
	for (const r of rules.sort((a: any,b: any)=>b.priority-a.priority)) {
		if (!r.active) continue;
		if (r.rule?.type === 'fixed') price = baseCents;
		if (r.rule?.type === 'discount') price = Math.max(0, Math.round(price * (1 - (r.rule?.percentage ?? 0) / 100)));
		if (r.rule?.type === 'dynamic') {
			const min = r.rule?.minCents ?? Math.round(baseCents*0.5);
			const max = r.rule?.maxCents ?? Math.round(baseCents*1.5);
			price = Math.min(max, Math.max(min, price));
		}
	}
	return price;
}

export async function POST(req: NextRequest) {
	const body = await req.json().catch(()=>null) as { productId: string; userId?: string } | null;
	if (!body?.productId) return new Response('Bad Request', { status: 400 });
	const cacheKey = `pricing:${body.productId}:${body.userId ?? 'anon'}`;

	const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
	const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
	if (redisUrl && redisToken) {
		const redis = Redis.fromEnv();
		const cached = await redis.get<number>(cacheKey);
		if (cached) return Response.json({ priceCents: cached });
	}

	await connectToDatabase().catch(()=>null);
	const product = await ProductModel.findById(body.productId).lean().catch(()=>null) as any;
	if (!product) return new Response('Not Found', { status: 404 });
	const rules = await PricingRuleModel.find({ $or: [
		{ scope: 'global' },
		{ scope: 'product', targetId: body.productId },
		{ scope: 'user', targetId: body.userId }
	]}).lean().catch(()=>[]) as any[];
	const priceCents = applyRules(product.priceCents, rules);
	if (redisUrl && redisToken) { const redis = Redis.fromEnv(); await redis.set(cacheKey, priceCents, { ex: 300 }); }
	return Response.json({ priceCents, currency: product.currency });
}