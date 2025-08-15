import { createTranslator } from '../../src/core/translation';
import { describe, it, expect } from 'vitest';

describe('translation', () => {
	const t = createTranslator({
		defaultLocale: 'en',
		translations: {
			en: { hello: 'Hello {name}' },
			fr: { hello: 'Bonjour {name}' },
		},
	});

	it('fallback to default', () => {
		expect(t.t('missing')).toBe('missing');
	});

	it('interpolates values', () => {
		expect(t.t('hello', { name: 'Sam' })).toBe('Hello Sam');
	});

	it('uses requested locale', () => {
		expect(t.t('hello', { name: 'Sam' }, 'fr')).toBe('Bonjour Sam');
	});
});