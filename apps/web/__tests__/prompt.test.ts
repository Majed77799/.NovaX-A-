import { describe, it, expect } from 'vitest';
import { buildPrompt } from '../app/api/generate/prompt';

describe('buildPrompt', () => {
	it('includes trends when provided', () => {
		const p = buildPrompt('product_description', 'Acme Widget', '', 'trendy, viral');
		expect(p).toContain('trendy, viral');
	});
	it('handles audience', () => {
		const p = buildPrompt('social_instagram', 'Sneakers', 'Gen Z', '');
		expect(p).toContain('Gen Z');
	});
	it('covers all modes', () => {
		const modes: any[] = ['product_description','social_instagram','social_tiktok','social_twitter','ad_facebook','ad_google','email_template'];
		for (const m of modes) {
			const p = buildPrompt(m, 'X', '', '');
			expect(typeof p).toBe('string');
		}
	});
});