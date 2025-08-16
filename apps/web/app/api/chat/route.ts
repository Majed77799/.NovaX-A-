import { NextRequest } from 'next/server';
import { generateStreaming } from '@repo/ai';
import { ChatMessage, createSSEHeaders, detectLanguage } from '@repo/shared';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
	const body = await req.json().catch(() => null) as { messages: ChatMessage[] } | null;
	if (!body?.messages) return new Response('Bad Request', { status: 400 });
	const encoder = new TextEncoder();
	const headers = createSSEHeaders();
	const { readable, writable } = new TransformStream();
	const writer = writable.getWriter();
	const signal = req.signal;

	(async () => {
		try {
			const last = body.messages[body.messages.length - 1];
			const userLang = detectLanguage(last?.content ?? '');
			const systemMsg = { role: 'system' as const, content: `You are Ello. Always reply in ${userLang}. Keep responses concise and helpful.` };

			const hasAnyKey = !!(process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY || process.env.GOOGLE_API_KEY);
			if (!hasAnyKey) {
				const mock = `Hello! I am running in mock mode. You said: ${last?.content ?? ''}`;
				await writer.write(encoder.encode(mock));
				return;
			}

			await generateStreaming({
				messages: [systemMsg, ...body.messages.map(m => ({ role: m.role, content: m.content }))],
				onToken: async (token) => { await writer.write(encoder.encode(token)); },
				signal
			});
		} catch (err) {
		} finally {
			try { await writer.close(); } catch {}
		}
	})();

	return new Response(readable, { headers });
}

export async function OPTIONS() { return new Response(null, { status: 204 }); }