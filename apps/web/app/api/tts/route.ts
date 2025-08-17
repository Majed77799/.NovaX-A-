import { NextRequest } from 'next/server';
import OpenAI from 'openai';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
	const { text, voice = 'alloy' } = await req.json().catch(() => ({}));
	if (!text) return new Response('Bad Request', { status: 400 });
	const key = process.env.OPENAI_API_KEY;
	if (!key) {
		return new Response(null, { status: 204, headers: { 'Cache-Control': 'no-store' } });
	}
	const openai = new OpenAI({ apiKey: key });
	const result = await openai.audio.speech.create({ model: 'gpt-4o-mini-tts', voice, input: text });
	const arrayBuffer = await result.arrayBuffer();
	return new Response(arrayBuffer, { headers: { 'Content-Type': 'audio/mpeg' } });
}