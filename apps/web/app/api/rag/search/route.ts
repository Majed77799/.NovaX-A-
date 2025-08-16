import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
	const { query, topK = 5 } = await req.json().catch(() => ({}));
	if (!query) return new Response('Bad Request', { status: 400 });
	const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);
	const { data, error } = await supabase.rpc('match_documents', { query_text: query, match_count: topK });
	if (error) return new Response(error.message, { status: 500 });
	return Response.json({ matches: data });
}

export async function OPTIONS() { return new Response(null, { status: 204 }); }