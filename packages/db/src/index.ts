import { prisma } from './client';
import type { PricingRule, Product } from '@prisma/client';

export { prisma };

export type PricingContext = {
	country?: string;
	currentDemand?: number;
	salesVelocity?: number;
	at?: Date;
};

export async function evaluatePricingForProduct(productId: string, ctx: PricingContext) {
	const product = await prisma.product.findUnique({ where: { id: productId } });
	if (!product) throw new Error('Product not found');
	const rules = await prisma.pricingRule.findMany({ where: { active: true, OR: [{ productId }, { productId: null }] }, orderBy: { priority: 'desc' } });
	return applyRules(product, rules, ctx);
}

function applyRules(product: Product, rules: PricingRule[], ctx: PricingContext) {
	let price = product.defaultPriceCents;
	const now = ctx.at ?? new Date();
	for (const r of rules) {
		if (r.productId && r.productId !== product.id) continue;
		if (r.country && ctx.country && r.country.toLowerCase() !== ctx.country.toLowerCase()) continue;
		if (r.timeStart && now < r.timeStart) continue;
		if (r.timeEnd && now > r.timeEnd) continue;
		if (typeof r.minDemand === 'number' && (ctx.currentDemand ?? 0) < r.minDemand) continue;
		if (typeof r.salesVelocityThreshold === 'number' && (ctx.salesVelocity ?? 0) < r.salesVelocityThreshold) continue;
		if (typeof r.priceCents === 'number') price = r.priceCents;
		else if (typeof r.priceMultiplier === 'number') price = Math.max(1, Math.round(price * r.priceMultiplier));
	}
	return { priceCents: price, currency: product.currency };
}