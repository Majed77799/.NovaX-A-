export const runtime = 'nodejs';

function toSSEEvent(data: unknown, id?: number) {
	const payload = `data: ${JSON.stringify(data)}\n` + (id !== undefined ? `id: ${id}\n` : '') + '\n';
	return new TextEncoder().encode(payload);
}

export async function POST(req: Request) {
	const useMocks = process.env.USE_MOCKS === 'true' || !process.env.OPENAI_API_KEY;
	let body: any = {};
	try { body = await req.json(); } catch { /* ignore invalid json */ }
	const userMessage = typeof body?.message === 'string' ? body.message : '';

	const stream = new ReadableStream<Uint8Array>({
		start(controller) {
			// Always send an initial event to open the stream
			controller.enqueue(toSSEEvent({ type: 'start' }, 0));
			if (useMocks) {
				const chunks = (userMessage?.trim() ? `Echo: ${userMessage}` : 'Hello from mock stream!').split(' ');
				let id = 1;
				let i = 0;
				const interval = setInterval(() => {
					if (i >= chunks.length) {
						controller.enqueue(toSSEEvent({ type: 'done' }, id++));
						clearInterval(interval);
						controller.close();
						return;
					}
					controller.enqueue(toSSEEvent({ type: 'delta', content: (i === 0 ? '' : ' ') + chunks[i] }, id++));
					i++;
				}, 120);
				return;
			}
			// If real provider is configured but we keep it simple: stream a placeholder
			let id = 1;
			controller.enqueue(toSSEEvent({ type: 'delta', content: 'Real provider not wired in this template.' }, id++));
			controller.enqueue(toSSEEvent({ type: 'done' }, id++));
			controller.close();
		}
	});

	return new Response(stream, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache, no-transform',
			'Connection': 'keep-alive'
		}
	});
}