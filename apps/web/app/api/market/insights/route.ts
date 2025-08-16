import { NextRequest } from 'next/server';
import { generateStreaming } from '@repo/ai';
import { getUserFromRequest } from '@repo/shared/auth';
import { Redis } from '@upstash/redis';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
	const body = await req.json().catch(() => null) as { query: string } | null;
	if (!body?.query) return new Response('Bad Request', { status: 400 });
	const signal = req.signal;
	let text = '';
	await generateStreaming({
		messages: [
			{ role: 'system', content: 'You are an AI market analyst. Provide concise, bullet-point insights with metrics and trends.' },
			{ role: 'user', content: `Analyze: ${body.query}` }
		],
		onToken: (t) => { text += t; },
		signal,
		preferred: ['gemini','openai','anthropic']
	});
	const insights = text.split(/\n|\r/).filter(Boolean).slice(0, 10).map((line, idx) => ({ id: String(idx+1), text: line.replace(/^[-•]\s*/, '') }));
	try {
		const user = await getUserFromRequest(req);
		const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
		const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
		if (user?.userId && redisUrl && redisToken) {
			const redis = Redis.fromEnv();
			await redis.lpush(`user:${user.userId}:market`, JSON.stringify({ at: Date.now(), query: body.query, insights }));
		}
	} catch {}
	return Response.json({ insights, raw: text });
}