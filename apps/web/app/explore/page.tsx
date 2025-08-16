"use client";
import { useEffect, useState } from 'react';

export default function Explore() {
	const [items, setItems] = useState<{ id: string; title: string; prompt: string }[]>([]);
	const [lang, setLang] = useState<string>('en');
	useEffect(() => { (async () => {
		try {
			const local = await import('./templates.json');
			setItems(local.default);
			const remote = await fetch('https://raw.githubusercontent.com/your/repo/main/templates.json').then(r => r.ok ? r.json() : []);
			setItems(prev => [...prev, ...remote]);
		} catch {}
		try {
			const res = await fetch('/api/i18n/locale');
			const data = await res.json();
			setLang(data.lang || 'en');
		} catch { setLang('en'); }
	})() }, []);

	useEffect(() => { (async () => {
		if (!items.length) return;
		if (lang === 'en') return;
		try {
			const titles = items.map(i => i.title);
			const prompts = items.map(i => i.prompt);
			const res1 = await fetch('/api/i18n/translate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ texts: titles, targetLang: lang }) });
			const res2 = await fetch('/api/i18n/translate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ texts: prompts, targetLang: lang }) });
			if (res1.ok && res2.ok) {
				const t1 = await res1.json();
				const t2 = await res2.json();
				setItems(prev => prev.map((it, idx) => ({ ...it, title: t1.translations[idx] || it.title, prompt: t2.translations[idx] || it.prompt })));
			}
		} catch {}
	})() }, [lang, items.length]);

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