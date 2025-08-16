import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
	try {
		const { productId } = await req.json();
		const url = `https://example.com/downloads/${productId}?sig=${Math.random().toString(36).slice(2)}`;
		return Response.json({ url, disclaimer: 'This is a free sample. Get the full version via AI subscription.' });
	} catch {
		return new Response('Bad Request', { status: 400 });
	}
}