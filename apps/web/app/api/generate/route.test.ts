import { describe, it, expect } from 'vitest';
import { buildPrompt } from './prompt';

describe('generate API prompt', () => {
	it('composes prompt with mode and input', () => {
		const p = buildPrompt('ad_google', 'Coffee maker', '', '');
		expect(p).toContain('Google Ads');
		expect(p).toContain('Coffee maker');
	});
});