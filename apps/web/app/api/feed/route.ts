import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const limit = Number(searchParams.get('limit') ?? '8');
	const cursor = searchParams.get('cursor');
	const start = cursor ? parseInt(cursor, 10) : 0;
	const items = Array.from({ length: limit }).map((_, i) => {
		const idNum = start + i + 1;
		const types: Array<'video'|'image'|'pdf'> = ['video','image','pdf'];
		return { id: `f_${idNum}`, type: types[idNum % 3], title: `Item ${idNum}`, mediaUrl: '' };
	});
	const nextCursor = start + limit >= 64 ? null : String(start + limit);
	const headers = new Headers({ 'x-cache': 'HIT' });
	return Response.json({ items, nextCursor }, { headers });
}