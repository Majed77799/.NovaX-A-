import { NextRequest } from 'next/server';
import sharp from 'sharp';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
	const { b64, buyerId } = await req.json().catch(() => ({}));
	if (!b64 || !buyerId) return new Response('Bad Request', { status: 400 });
	const input = Buffer.from(b64, 'base64');
	const img = sharp(input);
	const meta = await img.metadata();
	const width = meta.width || 1024;
	const height = meta.height || 1024;
	const svg = Buffer.from(`<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="${Math.floor(width/16)}" fill="rgba(200,200,200,0.25)" transform="rotate(-30 ${width/2} ${height/2})">Purchased by ${buyerId}</text></svg>`);
	const out = await img.composite([{ input: svg, gravity: 'center' }]).png().toBuffer();
	return Response.json({ b64: out.toString('base64') });
}