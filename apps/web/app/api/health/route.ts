import { Redis } from '@upstash/redis';
import { connectToDatabase } from '@repo/db';

export const runtime = 'nodejs';

export async function GET() {
	const checks: Record<string, string> = {};
	try { await connectToDatabase(); checks.mongo = 'ok'; } catch { checks.mongo = 'fail'; }
	try {
		if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
			const redis = Redis.fromEnv();
			await redis.ping();
			checks.redis = 'ok';
		} else { checks.redis = 'skip'; }
	} catch { checks.redis = 'fail'; }
	return Response.json({ ok: Object.values(checks).every(v => v === 'ok' || v === 'skip'), checks });
}

export async function OPTIONS() { return new Response(null, { status: 204 }); }