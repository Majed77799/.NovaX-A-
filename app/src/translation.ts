export type TranslationLang = 'none' | 'es' | 'fr';

const esMap: Record<string, string> = {
	hello: 'hola',
	this: 'esto',
	is: 'es',
	a: 'un',
	streamed: 'transmitido',
	response: 'respuesta',
};

const frMap: Record<string, string> = {
	hello: 'bonjour',
	this: 'ceci',
	is: 'est',
	a: 'un',
	streamed: 'diffusé',
	response: 'réponse',
};

function translateWord(word: string, lang: TranslationLang): string {
	const key = word.toLowerCase().replace(/[^a-z]/gi, '');
	if (!key) return word;
	const map = lang === 'es' ? esMap : frMap;
	const translated = map[key];
	if (!translated) return word;
	// Preserve capitalization
	if (word[0] === word[0].toUpperCase()) {
		return translated[0].toUpperCase() + translated.slice(1);
	}
	return translated;
}

export function translateText(text: string, lang: TranslationLang): string {
	if (lang === 'none') return text;
	return text
		.split(/(\b)/)
		.map(token => (/\w/.test(token) ? translateWord(token, lang) : token))
		.join('');
}