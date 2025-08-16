export async function apiChat(baseUrl: string, messages: { role: string; content: string }[], signal?: AbortSignal, onToken?: (t: string) => void, token?: string) {
	const res = await fetch(`${baseUrl}/api/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(token? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify({ messages }), signal });
	if (!res.ok || !res.body) throw new Error('chat failed');
	const reader = res.body.getReader();
	const decoder = new TextDecoder();
	while (true) {
		const { done, value } = await reader.read();
		if (done) break;
		const chunk = decoder.decode(value, { stream: true });
		onToken?.(chunk);
	}
}

export async function apiSTT(baseUrl: string, file: File, token?: string) {
	const fd = new FormData();
	fd.append('file', file);
	const res = await fetch(`${baseUrl}/api/stt`, { method: 'POST', headers: { ...(token? { Authorization: `Bearer ${token}` } : {}) }, body: fd });
	if (!res.ok) throw new Error('stt failed');
	return res.json();
}

export async function apiTTS(baseUrl: string, text: string, voice?: string, token?: string) {
	const res = await fetch(`${baseUrl}/api/tts`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(token? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify({ text, voice }) });
	if (!res.ok) throw new Error('tts failed');
	return res.arrayBuffer();
}

export async function apiImage(baseUrl: string, prompt: string, token?: string) {
	const res = await fetch(`${baseUrl}/api/image`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(token? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify({ prompt }) });
	if (!res.ok) throw new Error('image failed');
	return res.json();
}

export async function apiRagSearch(baseUrl: string, query: string, topK = 5, token?: string) {
	const res = await fetch(`${baseUrl}/api/rag/search`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(token? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify({ query, topK }) });
	if (!res.ok) throw new Error('rag search failed');
	return res.json();
}

export async function apiRagUpsert(baseUrl: string, id: string, text: string, metadata?: any, token?: string) {
	const res = await fetch(`${baseUrl}/api/rag/upsert`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(token? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify({ id, text, metadata }) });
	if (!res.ok) throw new Error('rag upsert failed');
	return res.json();
}

export async function apiMarketInsights(baseUrl: string, query: string, token: string) {
	const res = await fetch(`${baseUrl}/api/market/insights`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ query }) });
	if (!res.ok) throw new Error('market insights failed');
	return res.json();
}

export async function apiGenerateContent(baseUrl: string, brief: string, channels: string[], token: string) {
	const res = await fetch(`${baseUrl}/api/content/generate`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ brief, channels }) });
	if (!res.ok) throw new Error('content generate failed');
	return res.json();
}

export async function apiDashboard(baseUrl: string, token: string) {
	const res = await fetch(`${baseUrl}/api/dashboard/insights`, { headers: { Authorization: `Bearer ${token}` } });
	if (!res.ok) throw new Error('dashboard failed');
	return res.json();
}

export async function apiLogin(baseUrl: string, email: string, password: string) {
	const res = await fetch(`${baseUrl}/api/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
	if (!res.ok) throw new Error('login failed');
	return res.json() as Promise<{ token: string }>;
}

export async function apiStripeCheckout(baseUrl: string, token: string) {
	const res = await fetch(`${baseUrl}/api/stripe/checkout`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
	if (!res.ok) throw new Error('checkout failed');
	return res.json() as Promise<{ url: string }>;
}