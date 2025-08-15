import { CategoryStat, MarketAnalysisCore, PriceRange, ProductStatsData, TrendsData } from './types';

function normalize(value: number, min: number, max: number): number {
	if (!isFinite(value)) return 0;
	if (max === min) return 0;
	return Math.max(0, Math.min(100, Math.round(((value - min) / (max - min)) * 100)));
}

export function inferCategoriesFromTrends(trends: TrendsData): CategoryStat[] {
	// Use related topics and keywords as proxies for categories
	const buckets: Record<string, { sum: number; count: number }> = {};
	for (const topic of trends.relatedTopics) {
		const key = topic.title.toLowerCase();
		buckets[key] = buckets[key] || { sum: 0, count: 0 };
		buckets[key].sum += topic.value;
		buckets[key].count += 1;
	}
	// Also derive average interest per keyword
	for (const [kw, points] of Object.entries(trends.series)) {
		const avg = points.length ? points.reduce((a, p) => a + p.interest, 0) / points.length : 0;
		const key = kw.toLowerCase();
		buckets[key] = buckets[key] || { sum: 0, count: 0 };
		buckets[key].sum += avg;
		buckets[key].count += 1;
	}
	const rawScores = Object.entries(buckets).map(([category, v]) => ({ category, raw: v.sum / Math.max(1, v.count) }));
	const max = rawScores.reduce((m, x) => Math.max(m, x.raw), 0);
	const min = rawScores.reduce((m, x) => Math.min(m, x.raw), Infinity);
	const stats: CategoryStat[] = rawScores
		.map(x => ({ category: x.category, demandScore: normalize(x.raw, min, max) }))
		.sort((a, b) => b.demandScore - a.demandScore)
		.slice(0, 10);
	return stats;
}

export function aggregatePriceRanges(categories: CategoryStat[], productStats?: ProductStatsData): Record<string, PriceRange> {
	const map: Record<string, PriceRange> = {};
	for (const cat of categories) {
		const matches = (productStats ?? []).filter(p => p.keyword.toLowerCase().includes(cat.category));
		if (!matches.length) {
			// Heuristic price range based on demand
			const baseLow = Math.max(2, Math.round(cat.demandScore / 10));
			const baseHigh = baseLow * 3 + 5;
			map[cat.category] = { low: baseLow, high: baseHigh, median: Math.round((baseLow + baseHigh) / 2) };
			continue;
		}
		const avg = matches.reduce((a, p) => a + p.avgPrice, 0) / matches.length;
		const median = matches.reduce((a, p) => a + p.medianPrice, 0) / matches.length;
		map[cat.category] = {
			low: Math.max(1, Math.round(avg * 0.7)),
			high: Math.max(2, Math.round(avg * 1.4)),
			median: Math.round(median)
		};
	}
	return map;
}

export function computeOpportunityScore(categories: CategoryStat[], priceRanges: Record<string, PriceRange>): number {
	// Weighted by top categories demand and price spread (lower prices may increase opportunity for volume)
	const top = categories.slice(0, 5);
	if (!top.length) return 0;
	let total = 0;
	for (const cat of top) {
		const pr = priceRanges[cat.category];
		const spread = pr ? pr.high - pr.low : 10;
		const score = cat.demandScore * (spread < 20 ? 1.1 : 0.9);
		total += score;
	}
	return Math.max(0, Math.min(100, Math.round(total / top.length)));
}

export function summarize(trends: TrendsData, categories: CategoryStat[], opportunity: number): string {
	const top = categories.slice(0, 3).map(c => c.category).join(', ');
	return `Top trending categories: ${top}. Overall market opportunity score: ${opportunity}/100. Based on Google Trends for ${trends.keywords.join(', ')}.`;
}

export function analyzeCore(trends: TrendsData, productStats?: ProductStatsData): MarketAnalysisCore {
	const categories = inferCategoriesFromTrends(trends);
	const priceRanges = aggregatePriceRanges(categories, productStats);
	const opportunity = computeOpportunityScore(categories, priceRanges);
	const summary = summarize(trends, categories, opportunity);
	return {
		topCategories: categories,
		suggestedPriceRanges: priceRanges,
		marketOpportunityScore: opportunity,
		summary,
		raw: { trends, productStats }
	};
}