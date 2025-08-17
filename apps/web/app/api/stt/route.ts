import { NextRequest } from 'next/server';
import OpenAI from 'openai';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
	const form = await req.formData();
	const file = form.get('file');
	if (!(file instanceof File)) return new Response('No file', { status: 400 });
	const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
	const transcription = await openai.audio.transcriptions.create({ file, model: 'whisper-1', response_format: 'json' as any });
	return Response.json({ text: (transcription as any).text ?? '' });
}