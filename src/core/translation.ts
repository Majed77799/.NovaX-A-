export type Translations = Record<string, Record<string, string>>;

export interface TranslatorOptions {
	defaultLocale: string;
	translations: Translations;
}

export type InterpolationValues = Record<string, string | number>;

function interpolate(template: string, values?: InterpolationValues): string {
	if (!values) return template;
	return template.replace(/\{(\w+)\}/g, (_m, key) => String(values[key] ?? `{${key}}`));
}

export function createTranslator(options: TranslatorOptions) {
	const { defaultLocale, translations } = options;
	function translate(key: string, values?: InterpolationValues, locale?: string): string {
		const chosenLocale = locale ?? defaultLocale;
		const byLocale = translations[chosenLocale] || {};
		const fallback = translations[defaultLocale] || {};
		const template = byLocale[key] ?? fallback[key] ?? key;
		return interpolate(template, values);
	}
	return { t: translate };
}