import { NextRequest } from 'next/server';
import { createSSEHeaders } from '@repo/shared';
import { generateStreaming } from '@repo/ai';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
	const { audience, tone, lang } = await req.json().catch(() => ({}));
	const headers = createSSEHeaders();
	const encoder = new TextEncoder();
	const { readable, writable } = new TransformStream();
	const writer = writable.getWriter();
	const signal = req.signal;
	(async () => {
		try {
			const scaffold = `Generate a product marketing blurb for audience ${audience ?? 'general'} in ${lang ?? 'en'} with a ${tone ?? 'friendly'} tone. Keep it under 200 words.`;
			await generateStreaming({
				messages: [
					{ role: 'system', content: 'You are NovaX marketing assistant.' },
					{ role: 'user', content: scaffold }
				],
				onToken: async (t) => { await writer.write(encoder.encode(t)); },
				signal
			});
		} catch {}
		finally {
			try { await writer.close(); } catch {}
		}
	})();
	return new Response(readable, { headers });
}