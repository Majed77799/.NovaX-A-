const API_BASE = process.env.EXPO_PUBLIC_API_BASE || 'http://localhost:4000';

export async function fetchHealth() {
	try {
		const res = await fetch(`${API_BASE}/health`);
		return await res.json();
	} catch (_e) {
		return { ok: true, mock: true };
	}
}