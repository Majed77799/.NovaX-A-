import { describe, it, expect } from 'vitest';
import { getTrendKeywords } from './index';

describe('getTrendKeywords', () => {
	it('returns default trends', async () => {
		const res = await getTrendKeywords();
		expect(Array.isArray(res.keywords)).toBe(true);
		expect(res.keywords.length).toBeGreaterThan(0);
	});
	it('respects limit', async () => {
		const res = await getTrendKeywords({ limit: 3 });
		expect(res.keywords.length).toBe(3);
	});
});