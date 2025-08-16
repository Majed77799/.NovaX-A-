"use client";
import { useEffect, useState } from 'react';

export default function Explore() {
	const [items, setItems] = useState<{ id: string; title: string; prompt: string }[]>([]);
	useEffect(() => { (async () => {
		try {
			const local = await import('./templates.json');
			setItems(local.default);
			const remote = await fetch('https://raw.githubusercontent.com/your/repo/main/templates.json', { cache: 'force-cache', next: { revalidate: 3600 } }).then(r => r.ok ? r.json() : []);
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
		</div>
	);
}