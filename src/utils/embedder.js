import crypto from 'crypto';

/**
 * Deterministic, lightweight text embedder for demo purposes.
 * Produces a fixed-size vector by hashing words into buckets.
 */
export function embedText(text, dims = 384) {
	const sanitized = (text || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
	const tokens = sanitized.split(/\s+/).filter(Boolean);
	const vector = new Array(dims).fill(0);
	for (const token of tokens) {
		const h = crypto.createHash('sha256').update(token).digest();
		const idx = h.readUInt32BE(0) % dims;
		const sign = (h[4] % 2) === 0 ? 1 : -1;
		vector[idx] += sign * 1.0;
	}
	// L2 normalize
	const norm = Math.sqrt(vector.reduce((s, v) => s + v * v, 0)) || 1;
	for (let i = 0; i < vector.length; i += 1) vector[i] = vector[i] / norm;
	return vector;
}

export function cosineSimilarity(a, b) {
	let dot = 0;
	let na = 0;
	let nb = 0;
	for (let i = 0; i < a.length && i < b.length; i += 1) {
		dot += a[i] * b[i];
		na += a[i] * a[i];
		nb += b[i] * b[i];
	}
	const denom = Math.sqrt(na) * Math.sqrt(nb) || 1;
	return dot / denom;
}