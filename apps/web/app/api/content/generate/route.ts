import { NextRequest } from 'next/server';
import { generateStreaming } from '@repo/ai';
import { getUserFromRequest } from '@repo/shared/auth';
import { Redis } from '@upstash/redis';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
	const body = await req.json().catch(() => null) as { brief: string; tone?: string; channels?: string[] } | null;
	if (!body?.brief) return new Response('Bad Request', { status: 400 });
	const signal = req.signal;
	let text = '';
	await generateStreaming({
		messages: [
			{ role: 'system', content: 'You are a marketing content generator. Output JSON with keys: headline, description, keywords[], posts{ twitter, linkedin, instagram }, product{ title, bullets[], seo{ title, description, tags[] } }' },
			{ role: 'user', content: `Brief: ${body.brief}. Tone: ${body.tone ?? 'friendly'}. Channels: ${(body.channels ?? ['twitter','linkedin']).join(', ')}` }
		],
		onToken: (t) => { text += t; },
		signal
	});
	let jsonStart = text.indexOf('{');
	let jsonEnd = text.lastIndexOf('}');
	let data: any = null;
	if (jsonStart >= 0 && jsonEnd > jsonStart) {
		try { data = JSON.parse(text.slice(jsonStart, jsonEnd + 1)); } catch {}
	}
	try {
		const user = await getUserFromRequest(req);
		const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
		const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
		if (user?.userId && redisUrl && redisToken) {
			const redis = Redis.fromEnv();
			await redis.lpush(`user:${user.userId}:content`, JSON.stringify({ at: Date.now(), brief: body.brief, data }));
		}
	} catch {}
	return Response.json({ data, raw: text });
}