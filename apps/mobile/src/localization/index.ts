import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';
import en from './locales/en.json';
import es from './locales/es.json';

const i18n = new I18n({ en, es });

i18n.enableFallback = true;

i18n.defaultLocale = 'en';

const deviceLocale = Localization.getLocales()[0]?.languageCode ?? 'en';

i18n.locale = ['en', 'es'].includes(deviceLocale) ? deviceLocale : 'en';

export function t(key: string, options?: Record<string, unknown>): string {
	return i18n.t(key, options);
}

export function setLocale(locale: 'en' | 'es') {
	i18n.locale = locale;
}

export type SupportedLocale = 'en' | 'es';