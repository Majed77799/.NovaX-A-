export type PriceRange = { low: number; high: number; median?: number };

export type CategoryStat = {
	category: string;
	demandScore: number; // 0-100 normalized
	avgPriceRange?: PriceRange;
};

export type TrendPoint = { date: string; interest: number };

export type TrendsData = {
	keywords: string[];
	series: Record<string, TrendPoint[]>; // keyword -> timeseries
	relatedTopics: { title: string; type: string; value: number }[];
};

export type ProductStat = {
	platform: 'etsy' | 'gumroad';
	keyword: string;
	avgPrice: number;
	medianPrice: number;
	sampleSize: number;
};

export type ProductStatsData = ProductStat[];

export type MarketAnalysisInput = {
	geo?: string; // e.g., 'US'
	keywords?: string[];
};

export type MarketAnalysisCore = {
	topCategories: CategoryStat[];
	suggestedPriceRanges: Record<string, PriceRange>;
	marketOpportunityScore: number; // 0-100
	summary: string;
	raw: { trends: TrendsData; productStats?: ProductStatsData };
};

export type MarketAnalysisResult = MarketAnalysisCore & {
	recommendations: string[];
};