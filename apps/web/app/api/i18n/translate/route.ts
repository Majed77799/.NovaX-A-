import { NextRequest } from 'next/server';
import { Redis } from '@upstash/redis';
import OpenAI from 'openai';
import { normalizeLang } from '../../../i18n/config';

export const runtime = 'edge';

async function sha256(input: string) {
	const data = new TextEncoder().encode(input);
	const digest = await crypto.subtle.digest('SHA-256', data);
	const bytes = Array.from(new Uint8Array(digest));
	return bytes.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function POST(req: NextRequest) {
	const body = await req.json().catch(() => ({}));
	const texts: string[] = Array.isArray(body.texts) ? body.texts : [];
	const target: string = normalizeLang(body.targetLang || 'en');
	const source: string | undefined = body.sourceLang ? normalizeLang(body.sourceLang) : undefined;
	if (!texts.length) return new Response('Bad Request', { status: 400 });

	const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
	const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
	const redis = redisUrl && redisToken ? new Redis({ url: redisUrl, token: redisToken }) : null;
	const openaiKey = process.env.OPENAI_API_KEY;

	const results: string[] = new Array(texts.length).fill('');
	const missingIndices: number[] = [];

	for (let i = 0; i < texts.length; i++) {
		const key = `i18n:v1:${target}:${await sha256(texts[i])}`;
		if (redis) {
			const cached = await redis.get<string>(key);
			if (cached) { results[i] = cached; continue; }
		}
		missingIndices.push(i);
	}

	if (missingIndices.length && openaiKey) {
		const client = new OpenAI({ apiKey: openaiKey });
		// Send batch to reduce tokens; return in order
		const payload = missingIndices.map(i => texts[i]);
		const system = `You are a professional localization engine. Translate naturally and idiomatically for the target locale (${target}). Preserve product/brand names. Return JSON array of strings, same order, no extra keys.`;
		const user = JSON.stringify({ source: source ?? 'auto', target, texts: payload });
		const res = await client.chat.completions.create({ model: 'gpt-4o-mini', messages: [ { role: 'system', content: system }, { role: 'user', content: user } ] });
		const content = res.choices?.[0]?.message?.content ?? '[]';
		let translated: string[] = [];
		try { translated = JSON.parse(content as string); } catch { translated = payload; }
		for (let j = 0; j < missingIndices.length; j++) {
			const i = missingIndices[j];
			results[i] = translated[j] ?? texts[i];
			if (redis) {
				const key = `i18n:v1:${target}:${await sha256(texts[i])}`;
				await redis.set(key, results[i], { ex: 60 * 60 * 24 * 30 });
			}
		}
	}

	// Fill any remaining holes with originals if same language
	for (let i = 0; i < texts.length; i++) if (!results[i]) results[i] = texts[i];

	return Response.json({ translations: results });
}