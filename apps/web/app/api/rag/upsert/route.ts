import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
	const { id, text, metadata } = await req.json().catch(() => ({}));
	if (!id || !text) return new Response('Bad Request', { status: 400 });
	const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
	const emb = await openai.embeddings.create({ model: 'text-embedding-3-small', input: text });
	const vector = emb.data?.[0]?.embedding;
	if (!vector) return new Response('Embed failed', { status: 500 });
	const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
	const { error } = await supabase.from('documents').upsert({ id, content: text, metadata, embedding: vector }).select().single();
	if (error) return new Response(error.message, { status: 500 });
	return Response.json({ ok: true });
}