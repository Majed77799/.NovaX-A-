import { NextRequest } from 'next/server';
import { prisma } from '@repo/db';
import { generateStreaming } from '@repo/ai';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
	const { productId } = await req.json().catch(() => ({}));
	if (!productId) return new Response('Bad Request', { status: 400 });
	const product = await prisma.product.findUnique({ where: { id: productId } });
	if (!product) return new Response('Not Found', { status: 404 });

	const [landingTpl] = await prisma.campaignTemplate.findMany({ where: { type: 'LANDING' }, take: 1, orderBy: { updatedAt: 'desc' } });
	const captionsTpl = await prisma.campaignTemplate.findMany({ where: { type: 'SOCIAL_CAPTION' }, take: 2, orderBy: { updatedAt: 'desc' } });
	const [tiktokTpl] = await prisma.campaignTemplate.findMany({ where: { type: 'TIKTOK_SCRIPT' }, take: 1, orderBy: { updatedAt: 'desc' } });

	const system = { role: 'system' as const, content: 'You are a marketing copy AI. Generate concise, high-converting content.' };
	const inputs = {
		productName: product.name,
		benefit: product.description?.slice(0, 160) ?? 'Unlock value instantly',
		CTA: 'Buy now'
	};

	async function fillTemplate(tpl?: { contentTemplate: string }) {
		if (!tpl) return '';
		const userPrompt = renderPlaceholders(tpl.contentTemplate, inputs);
		let content = '';
		if (process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY || process.env.GOOGLE_API_KEY) {
			await generateToString([{ role: 'user', content: userPrompt }], (t) => { content += t; });
			return content.trim();
		}
		return userPrompt;
	}

	async function generateToString(messages: { role: 'user'|'system'|'assistant'; content: string }[], onToken: (t: string)=>void) {
		await generateStreaming({ messages: [system, ...messages], onToken });
	}

	const landingHtml = await fillTemplate(landingTpl);
	const caption1 = await fillTemplate(captionsTpl[0]);
	const caption2 = await fillTemplate(captionsTpl[1]);
	const tiktokScript = await fillTemplate(tiktokTpl);

	const socialCaptions = [caption1, caption2].filter(Boolean);
	if (!landingHtml || socialCaptions.length < 2 || !tiktokScript) return new Response('Templates missing', { status: 500 });

	const campaign = await prisma.campaign.create({ data: { productId, landingHtml, socialCaptions, tiktokScript } });
	return Response.json({ campaign: { ...campaign, product, bundle: { landingHtml, socialCaptions, tiktokScript } } });
}

function renderPlaceholders(template: string, values: Record<string, string>) {
	return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, k) => values[k] ?? '');
}