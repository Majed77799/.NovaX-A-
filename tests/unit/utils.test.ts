import { assert, deepMerge, generateId } from '../../src/core/utils';
import { describe, expect, it } from 'vitest';

describe('utils', () => {
	it('assert throws on falsey', () => {
		expect(() => assert(false, 'no')).toThrowError('no');
	});

	it('deepMerge merges objects deeply', () => {
		const a: { foo: { bar: number }; arr: number[] } = { foo: { bar: 1 }, arr: [1] };
		const b: { foo: { baz: number }; arr: number[]; x: number } = { foo: { baz: 2 }, arr: [9], x: 3 };
		const merged = deepMerge(a, b);
		expect(merged.foo).toEqual({ bar: 1, baz: 2 });
		expect(merged.arr).toEqual([9]);
		const withX = merged as { foo: { bar: number; baz: number }; arr: number[]; x: number };
		expect(withX.x).toBe(3);
	});

	it('generateId unique-ish', () => {
		const id1 = generateId('p');
		const id2 = generateId('p');
		expect(id1).not.toEqual(id2);
		expect(id1.startsWith('p_')).toBe(true);
	});
});