import { TrendsData } from '../types';

export type FetchTrendsOptions = { keywords: string[]; geo?: string; timeframe?: string };

export async function fetchTrends(options: FetchTrendsOptions): Promise<TrendsData> {
	const { keywords, geo = 'US', timeframe = 'now 7-d' } = options;
	// Lazy import to keep consumer environments flexible
	let googleTrends: any;
	try {
		// @ts-ignore - no types available for google-trends-api
		const mod = await import('google-trends-api');
		googleTrends = (mod as any).default || mod;
	} catch {
		throw new Error('google-trends-api not installed');
	}

	const series: Record<string, { time: Date; value: number }[]> = {} as any;
	for (const kw of keywords) {
		try {
			const res = await googleTrends.interestOverTime({ keyword: kw, geo, timeframe });
			const parsed = JSON.parse(res);
			const points = (parsed?.default?.timelineData ?? []).map((p: any) => ({ time: new Date(Number(p.time) * 1000), value: Number(p.value?.[0] ?? 0) }));
			series[kw] = points;
		} catch {
			series[kw] = [];
		}
	}

	let relatedTopics: { title: string; type: string; value: number }[] = [];
	try {
		const res = await googleTrends.relatedTopics({ keyword: keywords.join(','), geo, timeframe });
		const parsed = JSON.parse(res);
		relatedTopics = (parsed?.default?.rankedList?.[0]?.rankedKeyword ?? []).map((rk: any) => ({ title: rk.topic?.title ?? rk.query ?? 'Unknown', type: rk.topic?.type ?? 'Topic', value: rk.value ?? 0 }));
	} catch {
		relatedTopics = [];
	}

	return {
		keywords,
		series: Object.fromEntries(Object.entries(series).map(([k, arr]) => [k, arr.map(p => ({ date: p.time.toISOString(), interest: p.value }))])),
		relatedTopics
	};
}