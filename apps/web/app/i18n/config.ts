export const SUPPORTED_LANGS = ['en','es','fr','de','it','pt','nl','sv','no','da','fi','pl','cs','tr','ar','he','ru','uk','zh','ja','ko','hi'] as const;
export type SupportedLang = typeof SUPPORTED_LANGS[number];

export function normalizeLang(input: string | null | undefined): SupportedLang {
	const lower = (input || '').toLowerCase();
	for (const lang of SUPPORTED_LANGS) {
		if (lower === lang || lower.startsWith(lang + '-')) return lang;
	}
	return 'en';
}