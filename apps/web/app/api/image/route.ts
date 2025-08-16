import { NextRequest } from 'next/server';
import OpenAI from 'openai';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
	const { prompt } = await req.json().catch(() => ({}));
	if (!prompt) return new Response('Bad Request', { status: 400 });
	const openaiKey = process.env.OPENAI_API_KEY;
	if (openaiKey) {
		const client = new OpenAI({ apiKey: openaiKey });
		const img = await client.images.generate({ prompt, model: 'gpt-image-1', size: '1024x1024' });
		const b64 = img.data?.[0]?.b64_json;
		if (!b64) return new Response('Failed', { status: 500 });
		return Response.json({ b64 });
	}
	const stabilityKey = process.env.STABILITY_API_KEY;
	if (stabilityKey) {
		const res = await fetch('https://api.stability.ai/v1/generation/sdxl-1024-v1-0/text-to-image', {
			method: 'POST',
			headers: { 'Authorization': `Bearer ${stabilityKey}`, 'Content-Type': 'application/json' },
			body: JSON.stringify({ text_prompts: [{ text: prompt }] })
		});
		if (!res.ok) return new Response('Failed', { status: 500 });
		const data = await res.json();
		return Response.json({ b64: data?.artifacts?.[0]?.base64 ?? null });
	}
	// 1x1 transparent PNG
	const tinyPng = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9VgqC9sAAAAASUVORK5CYII=';
	return Response.json({ b64: tinyPng, mock: true });
}

export async function OPTIONS() { return new Response(null, { status: 204 }); }