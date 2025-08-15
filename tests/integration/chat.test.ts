import { describe, it, expect } from 'vitest';
import { sendMessage, streamMessage } from '../../src/services/chat';
import { OfflineQueue } from '../../src/services/offlineQueue';

describe('chat service', () => {
	it('sendMessage echoes', async () => {
		const res = await sendMessage('hello');
		expect(res.content).toBe('Echo: hello');
	});

	it('streamMessage yields chunks in order', async () => {
		const chunks: string[] = [];
		for await (const part of streamMessage('hi')) {
			chunks.push(part);
		}
		expect(chunks.join('')).toBe('Echo: hi');
	});
});

describe('offline queue', () => {
	it('buffers when offline then drains', async () => {
		const processed: number[] = [];
		const q = new OfflineQueue<number>(async (n) => {
			await new Promise((r) => setTimeout(r, 5));
			processed.push(n);
		});

		q.setOnline(false);
		q.enqueue(1);
		q.enqueue(2);
		expect(processed).toEqual([]);

		q.setOnline(true);
		await new Promise((r) => setTimeout(r, 50));
		expect(processed).toEqual([1, 2]);
	});
});