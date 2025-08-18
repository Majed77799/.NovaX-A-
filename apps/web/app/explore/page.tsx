"use client";
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Example of dynamic import for a heavy client component in this route
const HeavyCharts = dynamic(() => import('../(components)/HeavyCharts'), { ssr: false });

export default function Explore() {
	const [items, setItems] = useState<{ id: string; title: string; prompt: string }[]>([]);
	useEffect(() => { (async () => {
		try {
			const local = await import('./templates.json');
			setItems(local.default);
			const remote = await fetch('https://raw.githubusercontent.com/your/repo/main/templates.json').then(r => r.ok ? r.json() : []);
			setItems(prev => [...prev, ...remote]);
		} catch {}
	})() }, []);
	return (
		<div className="container" style={{ paddingTop: 24 }}>
			<h2>Explore</h2>
			<div style={{ display: 'grid', gap: 12 }}>
				{items.map(it => (
					<div key={it.id} style={{ background: '#fff', borderRadius: 12, padding: 12, border: '1px solid rgba(15,18,35,0.08)' }}>
						<strong>{it.title}</strong>
						<p style={{ margin: 0, opacity: 0.8 }}>{it.prompt}</p>
					</div>
				))}
			</div>
			<div style={{ marginTop: 16 }}>
				<HeavyCharts />
			</div>
		</div>
	);
}