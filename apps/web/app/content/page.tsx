"use client";
import { useState } from 'react';

export default function ContentPage() {
	const [brief, setBrief] = useState('Launch copy for our AI product research tool');
	const [result, setResult] = useState<any>(null);
	const [loading, setLoading] = useState(false);
	async function run() {
		if (!brief.trim()) return;
		setLoading(true);
		try {
			const res = await fetch('/api/content/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ brief, channels: ['twitter','linkedin','instagram'] }) });
			const data = await res.json();
			setResult(data.data ?? null);
		} finally { setLoading(false); }
	}
	return (
		<div className="container" style={{ paddingTop: 24 }}>
			<h2>AI Content Generator</h2>
			<div style={{ display: 'grid', gap: 8 }}>
				<textarea value={brief} onChange={e=>setBrief(e.target.value)} rows={4} placeholder="Describe what to generate" />
				<button className="btn" onClick={run} disabled={loading}>{loading? 'Generating…' : 'Generate'}</button>
				{result && (
					<div style={{ display: 'grid', gap: 8 }}>
						<section style={{ background: '#fff', border: '1px solid rgba(15,18,35,0.08)', borderRadius: 12, padding: 12 }}>
							<h3>{result.headline}</h3>
							<p>{result.description}</p>
						</section>
						<section style={{ background: '#fff', border: '1px solid rgba(15,18,35,0.08)', borderRadius: 12, padding: 12 }}>
							<h4>Social Posts</h4>
							<pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(result.posts, null, 2)}</pre>
						</section>
						<section style={{ background: '#fff', border: '1px solid rgba(15,18,35,0.08)', borderRadius: 12, padding: 12 }}>
							<h4>Product Listing</h4>
							<pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(result.product, null, 2)}</pre>
						</section>
					</div>
				)}
			</div>
		</div>
	);
}