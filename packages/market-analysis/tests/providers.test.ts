import { describe, it, expect } from 'vitest';
import { fetchEtsyProductStats } from '../src/providers/etsy';
import { fetchGumroadProductStats } from '../src/providers/gumroad';

describe('providers', () => {
	it('etsy returns empty without api key', async () => {
		const original = process.env.ETSY_API_KEY;
		delete (process.env as any).ETSY_API_KEY;
		const res = await fetchEtsyProductStats({ keywords: ['notion template'] });
		expect(Array.isArray(res)).toBe(true);
		expect(res.length).toBe(0);
		process.env.ETSY_API_KEY = original;
	});

	it('gumroad returns empty without tokens', async () => {
		const originalA = process.env.GUMROAD_ACCESS_TOKEN;
		const originalS = process.env.GUMROAD_SELLER_ID;
		delete (process.env as any).GUMROAD_ACCESS_TOKEN;
		delete (process.env as any).GUMROAD_SELLER_ID;
		const res = await fetchGumroadProductStats(['planner']);
		expect(Array.isArray(res)).toBe(true);
		expect(res.length).toBe(0);
		process.env.GUMROAD_ACCESS_TOKEN = originalA;
		process.env.GUMROAD_SELLER_ID = originalS;
	});
});