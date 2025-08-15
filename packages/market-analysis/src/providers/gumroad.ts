import { ProductStatsData } from '../types';

// Gumroad API does not provide general search; this is a best-effort placeholder using seller context if provided.
// If GUMROAD_ACCESS_TOKEN or GUMROAD_SELLER_ID are missing, this provider returns empty.

export async function fetchGumroadProductStats(keywords: string[]): Promise<ProductStatsData> {
	const token = process.env.GUMROAD_ACCESS_TOKEN;
	const sellerId = process.env.GUMROAD_SELLER_ID;
	if (!token || !sellerId) return [];
	const results: ProductStatsData = [];
	for (const keyword of keywords) {
		try {
			// There is no search; attempt to list products and filter by keyword in name/description
			const res = await fetch(`https://api.gumroad.com/v2/products?seller_id=${encodeURIComponent(sellerId)}`, {
				headers: { Authorization: `Bearer ${token}` }
			});
			if (!res.ok) continue;
			const json: any = await res.json();
			const matching = (json?.products ?? []).filter((p: any) =>
				typeof p?.name === 'string' && p.name.toLowerCase().includes(keyword.toLowerCase())
			);
			const prices = matching
				.map((p: any) => Number(p?.price ?? 0) / 100)
				.filter((n: number) => isFinite(n) && n > 0);
			if (prices.length === 0) continue;
			prices.sort((a: number, b: number) => a - b);
			const median = prices.length % 2 ? prices[(prices.length - 1) / 2] : (prices[prices.length/2 - 1] + prices[prices.length/2]) / 2;
			const avg = Math.round((prices.reduce((a: number, b: number) => a + b, 0) / prices.length) * 100) / 100;
			results.push({ platform: 'gumroad', keyword, avgPrice: avg, medianPrice: median, sampleSize: prices.length });
		} catch {
			continue;
		}
	}
	return results;
}