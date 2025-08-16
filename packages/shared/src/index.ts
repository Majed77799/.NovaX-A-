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

// Observability utilities
export type LogLevel = 'debug'|'info'|'warn'|'error';

export function log(level: LogLevel, message: string, meta?: Record<string, any>) {
	try {
		const line = JSON.stringify({ t: new Date().toISOString(), level, message, ...meta });
		console[level === 'debug' ? 'log' : level]?.(line);
	} catch {}
}

export function metric(name: string, value = 1, tags?: Record<string,string|number>) {
	try {
		console.log(JSON.stringify({ t: new Date().toISOString(), metric: name, value, tags }));
	} catch {}
}

export function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
	let timer: any;
	return new Promise<T>((resolve, reject) => {
		timer = setTimeout(() => reject(new Error('timeout')), ms);
		p.then(v => { clearTimeout(timer); resolve(v); }).catch(err => { clearTimeout(timer); reject(err); });
	});
}

export function stableIdempotencyKey(parts: (string|number)[]) {
	return parts.join(':');
}

export function embedWatermark(text: string, hash: string) {
	return `${text}\n\n<!-- wm:${hash} -->`;
}