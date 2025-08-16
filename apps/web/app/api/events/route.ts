import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		// In production, enqueue/batch to analytics pipeline
		console.log('events', body);
		return Response.json({ ok: true });
	} catch {
		return new Response('Bad Request', { status: 400 });
	}
}