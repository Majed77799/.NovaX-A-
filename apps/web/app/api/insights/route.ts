import { NextRequest } from 'next/server';
import { connectToDatabase, MarketInsightModel } from '@repo/db';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
	await connectToDatabase().catch(()=>null);
	const top = await MarketInsightModel.find().sort({ observedAt: -1 }).limit(50).lean().catch(()=>[]) as any[];
	return Response.json({ insights: top });
}