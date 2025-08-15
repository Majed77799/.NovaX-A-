import { describe, it, expect } from 'vitest';
import { pdfFromText } from './utils';

describe('pdfFromText', () => {
	it('returns base64 string', () => {
		const b64 = pdfFromText('hello');
		expect(typeof b64).toBe('string');
		expect(b64.length).toBeGreaterThan(10);
	});
});