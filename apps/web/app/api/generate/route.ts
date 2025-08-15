import { NextRequest } from 'next/server';
import { generateStreaming } from '@repo/ai';
import { createSSEHeaders } from '@repo/shared';
import { getTrendKeywords } from '@repo/market-analysis';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
	const body = await req.json().catch(() => null) as {
		mode: 'product_description'|'social_instagram'|'social_tiktok'|'social_twitter'|'ad_facebook'|'ad_google'|'email_template';
		keywords?: string;
		product?: string;
		targetAudience?: string;
		useTrends?: boolean;
		category?: string;
	} | null;
	if (!body?.mode) return new Response('Bad Request', { status: 400 });
	const encoder = new TextEncoder();
	const headers = createSSEHeaders();
	const { readable, writable } = new TransformStream();
	const writer = writable.getWriter();
	const signal = req.signal;

	(async () => {
		try {
			const trendKeywords = body.useTrends ? (await getTrendKeywords({ category: body.category ?? 'general', limit: 8 })).keywords.join(', ') : '';
			const prompt = buildPrompt(body.mode, body.product ?? body.keywords ?? '', body.targetAudience ?? '', trendKeywords);

			const hasAnyKey = !!(process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY || process.env.GOOGLE_API_KEY);
			if (!hasAnyKey) {
				const mock = `MOCK: ${prompt}\n\nLorem ipsum dolor sit amet...`;
				await writer.write(encoder.encode(mock));
				return;
			}

			await generateStreaming({
				messages: [
					{ role: 'system', content: 'You are a world-class marketing copywriter. Be on-brand, persuasive, concise, and follow platform best practices.' },
					{ role: 'user', content: prompt }
				],
				onToken: async (token) => { await writer.write(encoder.encode(token)); },
				temperature: 0.8,
				maxTokens: 700,
				signal
			});
		} catch (err) {
		} finally {
			try { await writer.close(); } catch {}
		}
	})();

	return new Response(readable, { headers });
}

function buildPrompt(mode: string, input: string, audience: string, trends: string) {
	const trendLine = trends ? `Incorporate these trend keywords when natural: ${trends}.` : '';
	switch (mode) {
		case 'product_description':
			return `Create a compelling product description for: ${input}. ${trendLine} Include bullet points and a short headline.`;
		case 'social_instagram':
			return `Write an Instagram caption for: ${input}. ${trendLine} Include 8-12 relevant hashtags and a call-to-action.`;
		case 'social_tiktok':
			return `Write a short TikTok script and caption for: ${input}. ${trendLine} Keep it fun, high-energy, and add 6-10 hashtags.`;
		case 'social_twitter':
			return `Write 1-2 concise tweets about: ${input}. ${trendLine} Optimize for engagement, use hooks, and emojis sparingly.`;
		case 'ad_facebook':
			return `Write 2 variations of Facebook ad copy for: ${input}. ${trendLine} Provide primary text, headline, and description.`;
		case 'ad_google':
			return `Write Google Ads copy for: ${input}. ${trendLine} Provide multiple headlines (30 chars) and descriptions (90 chars).`;
		case 'email_template':
			return `Write an email marketing template for: ${input}. ${trendLine} Include subject line options, preview text, and body with sections.`;
		default:
			return input;
	}
}