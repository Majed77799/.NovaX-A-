'use client';

export default function HomePage() {
	const testChat = async () => {
		try {
			await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: 'hello' }) });
		} catch {}
	};
	return (
		<main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: 24 }}>
			<h1>Unified App</h1>
			<p>Next.js + PWA + API</p>
			<div style={{ display: 'flex', gap: 12 }}>
				<a href="/api/health" style={{ textDecoration: 'underline' }}>API Health</a>
				<button onClick={testChat} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer' }}>Test Chat (POST)</button>
			</div>
		</main>
	);
}