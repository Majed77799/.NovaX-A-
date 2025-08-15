import { z } from 'zod';

export type TrendSource = 'mock';

export type MarketTrends = {
	updatedAt: string;
	keywords: string[];
};

const TrendsRequestSchema = z.object({
	category: z.string().default('general'),
	region: z.string().default('US'),
	limit: z.number().int().min(3).max(50).default(10)
});

export type TrendsRequest = z.infer<typeof TrendsRequestSchema>;

export async function getTrendKeywords(req: Partial<TrendsRequest> = {}): Promise<MarketTrends> {
	const parsed = TrendsRequestSchema.parse(req);
	// Placeholder: In real-world, integrate with Google Trends or internal analytics.
	const mockByCategory: Record<string, string[]> = {
		general: ['AI', 'sustainable', 'minimalist', 'viral', 'limited edition', 'summer', 'bundle deal', 'handmade', 'eco‑friendly', 'durable'],
		fashion: ['capsule wardrobe', 'athleisure', 'pastel tones', 'gender‑neutral', 'retro', 'streetwear', 'elevated basics', 'y2k', 'linen', 'bold prints'],
		tech: ['AI‑powered', 'edge computing', 'privacy‑first', 'open‑source', 'plug‑and‑play', 'battery life', 'wireless', 'multi‑device', 'smart home', 'cloud‑native']
	};
	const base = mockByCategory[parsed.category] ?? mockByCategory.general;
	const keywords = base.slice(0, parsed.limit);
	return { updatedAt: new Date().toISOString(), keywords };
}