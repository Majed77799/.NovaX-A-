import { NextRequest } from 'next/server';
import { evaluatePricingForProduct } from '@repo/db';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const productId = searchParams.get('productId');
	if (!productId) return new Response('Bad Request', { status: 400 });
	const country = (req.headers.get('x-vercel-ip-country') || req.headers.get('x-geo-country') || '').toLowerCase() || undefined;
	const price = await evaluatePricingForProduct(productId, { country });
	return Response.json(price);
}