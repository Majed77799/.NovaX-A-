export async function apiChat(baseUrl: string, messages: { role: string; content: string }[], signal?: AbortSignal, onToken?: (t: string) => void) {
	const res = await fetch(`${baseUrl}/api/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages }), signal });
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

export async function apiSTT(baseUrl: string, file: File) {
	const fd = new FormData();
	fd.append('file', file);
	const res = await fetch(`${baseUrl}/api/stt`, { method: 'POST', body: fd });
	if (!res.ok) throw new Error('stt failed');
	return res.json();
}

export async function apiTTS(baseUrl: string, text: string, voice?: string) {
	const res = await fetch(`${baseUrl}/api/tts`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text, voice }) });
	if (!res.ok) throw new Error('tts failed');
	return res.arrayBuffer();
}

export async function apiImage(baseUrl: string, prompt: string) {
	const res = await fetch(`${baseUrl}/api/image`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt }) });
	if (!res.ok) throw new Error('image failed');
	return res.json();
}

export async function apiRagSearch(baseUrl: string, query: string, topK = 5) {
	const res = await fetch(`${baseUrl}/api/rag/search`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query, topK }) });
	if (!res.ok) throw new Error('rag search failed');
	return res.json();
}

export async function apiRagUpsert(baseUrl: string, id: string, text: string, metadata?: any) {
	const res = await fetch(`${baseUrl}/api/rag/upsert`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, text, metadata }) });
	if (!res.ok) throw new Error('rag upsert failed');
	return res.json();
}

export async function apiAnalyticsSummary(baseUrl: string, days = 14) {
	const res = await fetch(`${baseUrl}/api/analytics?days=${days}`, { cache: 'no-store' });
	if (!res.ok) throw new Error('analytics summary failed');
	return res.json();
}

export async function apiAnalyticsProducts(baseUrl: string, days = 14) {
	const res = await fetch(`${baseUrl}/api/analytics/products?days=${days}`, { cache: 'no-store' });
	if (!res.ok) throw new Error('analytics products failed');
	return res.json();
}

export async function apiAnalyticsPredict(baseUrl: string, days = 14, horizon = 7) {
	const res = await fetch(`${baseUrl}/api/analytics/predict?days=${days}&horizon=${horizon}`, { cache: 'no-store' });
	if (!res.ok) throw new Error('analytics predict failed');
	return res.json();
}