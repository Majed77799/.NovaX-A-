import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest, { params }: { params: { productId: string } }) {
	const country = req.headers.get('x-country') ?? 'US';
	const device = req.headers.get('x-device') ?? 'desktop';
	const bucket = req.headers.get('x-ab-bucket') ?? 'A';
	let base = 12.99;
	if (country === 'IN') base = 5.99;
	if (device === 'mobile') base -= 1;
	if (bucket === 'B') base += 0.5;
	const floor = 4.99; const ceiling = 19.99;
	const auditId = crypto.randomUUID();
	return Response.json({ productId: params.productId, price: base, floor, ceiling, auditId });
}