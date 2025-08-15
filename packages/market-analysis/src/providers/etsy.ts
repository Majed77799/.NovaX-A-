import { ProductStatsData } from '../types';

type FetchOpts = { keywords: string[]; apiKey?: string };

export async function fetchEtsyProductStats(opts: FetchOpts): Promise<ProductStatsData> {
	const apiKey = opts.apiKey || process.env.ETSY_API_KEY;
	if (!apiKey) return [];
	const results: ProductStatsData = [];
	for (const keyword of opts.keywords) {
		try {
			const url = `https://openapi.etsy.com/v3/application/listings/active?keywords=${encodeURIComponent(keyword)}&limit=25&offset=0`;
			const res = await fetch(url, { headers: { 'x-api-key': apiKey } as any });
			if (!res.ok) continue;
			const json: any = await res.json();
			const prices = (json?.results ?? [])
				.map((item: any) => Number(item?.price?.amount ? item.price.amount / 100 : item?.price ?? 0))
				.filter((n: number) => isFinite(n) && n > 0);
			if (prices.length === 0) continue;
			prices.sort((a: number, b: number) => a - b);
			const median = prices.length % 2 ? prices[(prices.length - 1) / 2] : (prices[prices.length/2 - 1] + prices[prices.length/2]) / 2;
			const avg = Math.round((prices.reduce((a: number, b: number) => a + b, 0) / prices.length) * 100) / 100;
			results.push({ platform: 'etsy', keyword, avgPrice: avg, medianPrice: median, sampleSize: prices.length });
		} catch {
			continue;
		}
	}
	return results;
}