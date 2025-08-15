export type Role = 'user' | 'assistant' | 'system';
export type ChatMessage = { id: string; role: Role; content: string; createdAt?: string; language?: string };

export function createSSEHeaders() {
	return new Headers({ 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-cache, no-transform', 'X-Accel-Buffering': 'no' });
}

export function detectLanguage(text: string): string {
	// naive detection fallback
	const hasCJK = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/.test(text);
	if (hasCJK) return 'zh';
	if (/[اأإآء-ي]/.test(text)) return 'ar';
	if (/á|é|í|ó|ú|ñ|¿|¡/.test(text)) return 'es';
	return 'en';
}

export function needsTranslation(src: string, dst: string) {
	return src && dst && src !== dst;
}

export function isRTL(lang: string) {
	return ['ar', 'he', 'fa', 'ur'].includes(lang);
}

export function hashAnonymousId(input: string) {
	let hash = 0;
	for (let i = 0; i < input.length; i++) {
		hash = (hash << 5) - hash + input.charCodeAt(i);
		hash |= 0;
	}
	return `u_${Math.abs(hash)}`;
}