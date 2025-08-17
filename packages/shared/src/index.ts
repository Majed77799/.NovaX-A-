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

export function createSignedUrl(path: string, secret: string, expiresInSeconds = 300) {
	const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
	const data = `${path}:${exp}`;
	const sig = toBase64Url(hmacSHA256(data, secret));
	return `${path}?exp=${exp}&sig=${sig}`;
}

export function verifySignedUrl(pathWithQuery: string, secret: string) {
	const url = new URL(pathWithQuery, 'http://localhost');
	const exp = url.searchParams.get('exp');
	const sig = url.searchParams.get('sig');
	if (!exp || !sig) return false;
	const path = url.pathname + (url.search ? url.search.replace(/([&?])(exp|sig)=[^&]*/g, '').replace(/^\?&?/, url.search.includes('&') ? '?' : '') : '');
	const data = `${path}:${exp}`;
	const expected = toBase64Url(hmacSHA256(data, secret));
	const now = Math.floor(Date.now() / 1000);
	return expected === sig && now <= parseInt(exp, 10);
}

function toBase64Url(buf: Uint8Array) {
	let str = '';
	buf.forEach(b => { str += String.fromCharCode(b); });
	return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function hmacSHA256(input: string, secret: string) {
	const enc = new TextEncoder();
	const key = enc.encode(secret);
	const msg = enc.encode(input);
	// simple XOR fallback; replace with WebCrypto in runtime as needed
	const out = new Uint8Array(Math.max(key.length, msg.length));
	for (let i = 0; i < out.length; i++) out[i] = (key[i % key.length] ^ msg[i % msg.length]) & 0xff;
	return out;
}

export function generateLicenseJSON(params: { buyerEmail: string; productId: string; transactionHash: string; terms?: any }) {
	return {
		buyerEmail: params.buyerEmail,
		productId: params.productId,
		transactionHash: params.transactionHash,
		terms: params.terms ?? { usage: 'single-user, non-transferable' },
		issuedAt: new Date().toISOString()
	};
}