import { NextRequest } from 'next/server';
import { analyzeCore, fetchEtsyProductStats, fetchGumroadProductStats, fetchTrends, MarketAnalysisInput, MarketAnalysisResult } from '@repo/market-analysis';
import { generateStreaming } from '@repo/ai';

export const runtime = 'nodejs';

export async function OPTIONS() {
	return new Response(null, { status: 204 });
}

export async function POST(req: NextRequest) {
	const body = await req.json().catch(() => ({})) as MarketAnalysisInput;
	const keywords = body.keywords && body.keywords.length ? body.keywords : [
		'Notion template',
		'Canva template',
		'printable planner',
		'Lightroom preset',
		'SEO checklist',
		'ebook',
		'course'
	];
	const geo = body.geo || 'US';

	try {
		const trends = await fetchTrends({ keywords, geo, timeframe: 'now 7-d' });

		// Optional: Product stats from Etsy and Gumroad if keys/tokens exist
		const [etsyStats, gumroadStats] = await Promise.all([
			fetchEtsyProductStats({ keywords }),
			fetchGumroadProductStats(keywords)
		]);
		const stats = [...etsyStats, ...gumroadStats];

		const core = analyzeCore(trends, stats);

		// AI recommendations (optional if keys available)
		const hasAnyKey = !!(process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY || process.env.GOOGLE_API_KEY);
		let recommendations: string[] = [];
		if (hasAnyKey) {
			let text = '';
			await generateStreaming({
				messages: [
					{ role: 'system', content: 'You are a product strategist. Output 6 concise bullet recommendations for digital product ideas. Each line: "- Idea — why it fits now; suggested price range: $L-$H". Keep total under 1200 characters.' },
					{ role: 'user', content: JSON.stringify({ topCategories: core.topCategories.slice(0,5), suggestedPriceRanges: core.suggestedPriceRanges, marketOpportunityScore: core.marketOpportunityScore }) }
				],
				onToken: (t) => { text += t; }
			});
			recommendations = text.split(/\n|\r/).map(s => s.trim()).filter(s => s.startsWith('-')).slice(0, 8);
		} else {
			recommendations = core.topCategories.slice(0, 6).map(c => `- ${capitalize(c.category)} — strong demand; suggested price range: $${Math.max(2, Math.round(c.demandScore/12))}-$${Math.max(5, Math.round(c.demandScore/6 + 5))}`);
		}

		const result: MarketAnalysisResult = { ...core, recommendations };
		return Response.json(result, { status: 200 });
	} catch (err: any) {
		// Offline or rate limited fallbacks
		if (err?.message?.includes('google-trends-api')) {
			return new Response(JSON.stringify({ error: 'Missing dependency or trends unavailable', code: 'TRENDS_UNAVAILABLE' }), { status: 503 });
		}
		return new Response(JSON.stringify({ error: 'Market analysis failed', details: String(err?.message ?? err) }), { status: 500 });
	}
}

function capitalize(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }