import { NextRequest } from 'next/server';
import { Redis } from '@upstash/redis';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
	const { readable, writable } = new TransformStream();
	const writer = writable.getWriter();
	const encoder = new TextEncoder();
	const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
	const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
	let lastVersion = '';
	let timer: any;

	async function send(data: string) {
		await writer.write(encoder.encode(`data: ${data}\n\n`));
	}

	(async () => {
		try {
			await send('connected');
			if (redisUrl && redisToken) {
				const redis = Redis.fromEnv();
				timer = setInterval(async () => {
					try {
						const v = String(await redis.get('feed:version'));
						if (v && v !== lastVersion) { lastVersion = v; await send('update'); }
						else { await send('ping'); }
					} catch { /* noop */ }
				}, 2000);
			} else {
				// fallback heartbeat
				timer = setInterval(async () => { await send('ping'); }, 5000);
			}
		} catch {
		} finally {
			// writer will be closed by the framework on connection drop
		}
	})();

	const headers = new Headers({ 'Content-Type': 'text/event-stream; charset=utf-8', 'Cache-Control': 'no-cache, no-transform', 'Connection': 'keep-alive', 'X-Accel-Buffering': 'no' });
	return new Response(readable, { headers });
}