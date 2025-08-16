import { NextRequest } from 'next/server';
import { connectToDatabase, PointsEventModel } from '@repo/db';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
	const url = new URL(req.url);
	const userId = url.searchParams.get('userId');
	if (!userId) return new Response('Bad Request', { status: 400 });
	await connectToDatabase().catch(()=>null);
	const total = await PointsEventModel.aggregate([{ $match: { userId } }, { $group: { _id: '$userId', sum: { $sum: '$points' } } }]).catch(()=>[]);
	const points = total?.[0]?.sum ?? 0;
	const quests = [
		{ id: 'q1', title: 'Like 3 products', reward: 10 },
		{ id: 'q2', title: 'Join a guild', reward: 20 },
		{ id: 'q3', title: 'Create your first product', reward: 50 }
	];
	return Response.json({ points, quests });
}