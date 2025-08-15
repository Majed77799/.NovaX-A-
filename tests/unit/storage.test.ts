import { readJSON, writeJSON, remove } from '../../src/core/storage';
import { describe, it, expect } from 'vitest';

describe('storage', () => {
	it('writes and reads json', () => {
		writeJSON('k', { a: 1 });
		expect(readJSON('k', null)).toEqual({ a: 1 });
	});

	it('returns default on missing', () => {
		expect(readJSON('missing', 5)).toBe(5);
	});

	it('remove deletes key', () => {
		writeJSON('x', 1);
		remove('x');
		expect(readJSON('x', null)).toBeNull();
	});
});