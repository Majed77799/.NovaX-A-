"use client";
import { useState } from 'react';

export default function MarketPage() {
	const [query, setQuery] = useState('AI productivity tools for SMBs');
	const [insights, setInsights] = useState<{ id: string; text: string }[]>([]);
	const [loading, setLoading] = useState(false);
	async function run() {
		if (!query.trim()) return;
		setLoading(true);
		try {
			const res = await fetch('/api/market/insights', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query }) });
			const data = await res.json();
			setInsights(data.insights ?? []);
		} finally { setLoading(false); }
	}
	return (
		<div className="container" style={{ paddingTop: 24 }}>
			<h2>Market Analysis</h2>
			<div style={{ display: 'flex', gap: 8 }}>
				<input value={query} onChange={e=>setQuery(e.target.value)} placeholder="What market, trend, or product?" style={{ flex: 1 }} />
				<button className="btn" onClick={run} disabled={loading}>{loading? 'Analyzing…' : 'Analyze'}</button>
			</div>
			<div style={{ marginTop: 16 }}>
				{insights.length === 0 ? <p>No insights yet.</p> : (
					<ul>
						{insights.map(i => <li key={i.id}>{i.text}</li>)}
					</ul>
				)}
			</div>
		</div>
	);
}