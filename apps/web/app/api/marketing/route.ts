import { NextRequest } from 'next/server';
import OpenAI from 'openai';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
	const body = await req.json().catch(()=>null) as { title: string; description?: string; keywords?: string[] } | null;
	if (!body?.title) return new Response('Bad Request', { status: 400 });
	const openaiKey = process.env.OPENAI_API_KEY;
	if (!openaiKey) return Response.json({ headline: `Introducing ${body.title}`, copy: body.description ?? '', imageB64: null, mock: true });
	const client = new OpenAI({ apiKey: openaiKey });
	const prompt = `Write a catchy headline and 2-sentence ad copy for a digital product titled "${body.title}" with keywords: ${(body.keywords ?? []).join(', ')}`;
	const text = await client.chat.completions.create({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }] });
	const headline = text.choices?.[0]?.message?.content?.split('\n')[0] ?? `Introducing ${body.title}`;
	const img = await client.images.generate({ prompt: `Ad banner for ${body.title}`, model: 'gpt-image-1', size: '1024x1024' });
	const imageB64 = img.data?.[0]?.b64_json ?? null;
	return Response.json({ headline, copy: text.choices?.[0]?.message?.content ?? '', imageB64 });
}