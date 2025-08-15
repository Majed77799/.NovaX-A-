"use client";
import { useState } from 'react';

export default function Page() {
	const [data, setData] = useState<any | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function run() {
		setLoading(true); setError(null);
		try {
			const res = await fetch('/api/market', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) });
			if (!res.ok) throw new Error(await res.text());
			setData(await res.json());
		} catch (e: any) {
			setError(e?.message ?? String(e));
		} finally { setLoading(false); }
	}

	return (
		<div style={{ padding: 24 }}>
			<h1>Market Analysis (Debug)</h1>
			<button onClick={run} disabled={loading} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #ccc' }}>
				{loading ? 'Running…' : 'Run'}
			</button>
			{error && <p style={{ color: 'crimson' }}>{error}</p>}
			{data && <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(data, null, 2)}</pre>}
		</div>
	);
}