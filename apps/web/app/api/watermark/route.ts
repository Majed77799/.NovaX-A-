import { NextRequest } from 'next/server';
import { processNextWatermarkJob } from './worker';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
	const result = await processNextWatermarkJob();
	return Response.json(result);
}