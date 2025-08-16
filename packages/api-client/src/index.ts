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

// New APIs to be implemented in web app
export async function apiFeed(baseUrl: string, userId?: string) {
	const url = new URL(`${baseUrl}/api/feed`);
	if (userId) url.searchParams.set('userId', userId);
	const res = await fetch(url.toString(), { headers: { 'Accept-Language': typeof navigator !== 'undefined' ? navigator.language : 'en' } });
	if (!res.ok) throw new Error('feed failed');
	return res.json();
}

export async function apiPricing(baseUrl: string, productId: string, userId?: string) {
	const res = await fetch(`${baseUrl}/api/pricing`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId, userId }) });
	if (!res.ok) throw new Error('pricing failed');
	return res.json();
}

export async function apiBundle(baseUrl: string, userId?: string) {
	const res = await fetch(`${baseUrl}/api/bundles/auto`, { headers: { 'Accept-Language': typeof navigator !== 'undefined' ? navigator.language : 'en' } });
	if (!res.ok) throw new Error('bundle failed');
	return res.json();
}

export async function apiWatermark(baseUrl: string, orderId: string) {
	const res = await fetch(`${baseUrl}/api/watermark`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ orderId }) });
	if (!res.ok) throw new Error('watermark failed');
	return res.json();
}

export async function apiSocial(baseUrl: string, action: { targetType: string; targetId: string; action: string; commentText?: string }) {
	const res = await fetch(`${baseUrl}/api/social`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(action) });
	if (!res.ok) throw new Error('social failed');
	return res.json();
}

export async function apiGuilds(baseUrl: string) {
	const res = await fetch(`${baseUrl}/api/guilds`);
	if (!res.ok) throw new Error('guilds failed');
	return res.json();
}

export async function apiQuests(baseUrl: string, userId: string) {
	const res = await fetch(`${baseUrl}/api/quests?userId=${encodeURIComponent(userId)}`);
	if (!res.ok) throw new Error('quests failed');
	return res.json();
}