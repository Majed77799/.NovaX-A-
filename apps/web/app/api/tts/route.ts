import { NextRequest } from 'next/server';
import OpenAI from 'openai';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
	const { text, voice = 'alloy' } = await req.json().catch(() => ({}));
	if (!text) return new Response('Bad Request', { status: 400 });
	const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
	const result = await openai.audio.speech.create({ model: 'gpt-4o-mini-tts', voice, input: text });
	const arrayBuffer = await result.arrayBuffer();
	return new Response(arrayBuffer, { headers: { 'Content-Type': 'audio/mpeg' } });
}