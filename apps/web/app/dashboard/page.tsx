"use client";
import { useEffect, useState } from 'react';

export default function Dashboard() {
	const [data, setData] = useState<any>(null);
	useEffect(() => { (async () => {
		try { const r = await fetch('/api/dashboard/insights'); if (r.ok) setData(await r.json()); } catch {}
	})() }, []);
	return (
		<div className="container" style={{ paddingTop: 24 }}>
			<h2>Dashboard</h2>
			{!data && <p>Loading…</p>}
			{data && (
				<div style={{ display: 'grid', gap: 12 }}>
					<section style={{ background: '#fff', border: '1px solid rgba(15,18,35,0.08)', borderRadius: 12, padding: 12 }}>
						<h3>Analytics</h3>
						<p>Total events: {data.analytics?.evt ?? 0} · Messages: {data.analytics?.message ?? 0}</p>
					</section>
					<section style={{ background: '#fff', border: '1px solid rgba(15,18,35,0.08)', borderRadius: 12, padding: 12 }}>
						<h3>Market Insights</h3>
						{(data.latest.market as any[]).length === 0 ? <p>No insights yet.</p> : <ul>{data.latest.market.map((i: any) => <li key={i.id}>{i.text}</li>)}</ul>}
						<a className="quick-chip btn" href="/market">Run Market Analysis</a>
					</section>
					<section style={{ background: '#fff', border: '1px solid rgba(15,18,35,0.08)', borderRadius: 12, padding: 12 }}>
						<h3>Content</h3>
						{(data.latest.content as any[]).length === 0 ? <p>No content yet.</p> : <ul>{data.latest.content.map((c: any) => <li key={c.id}>{c.title}</li>)}</ul>}
						<a className="quick-chip btn" href="/content">Generate Content</a>
					</section>
				</div>
			)}
		</div>
	);
}