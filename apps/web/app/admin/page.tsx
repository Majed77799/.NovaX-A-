"use client";
import { useEffect, useState } from 'react';

export default function AdminPage() {
	const [templates, setTemplates] = useState<any[]>([]);
	const [rules, setRules] = useState<any[]>([]);
	useEffect(() => { refresh(); }, []);

	async function refresh() {
		const t = await fetch('/api/admin/templates').then(r => r.json()).then(r => r.items);
		setTemplates(t);
		const pr = await fetch('/api/admin/pricing-rules').then(r => r.json()).then(r => r.rules);
		setRules(pr);
	}

	return (
		<div className="container" style={{ paddingTop: 24 }}>
			<h2>Admin</h2>
			<section>
				<h3>Campaign Templates</h3>
				<button className="btn" onClick={async () => {
					await fetch('/api/admin/templates', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'SOCIAL_CAPTION', title: 'Default Caption', contentTemplate: 'Introducing {{productName}} — {{benefit}}. {{CTA}}', placeholders: ['productName','benefit','CTA'] }) });
					refresh();
				}}>Add default caption</button>
				<div style={{ display: 'grid', gap: 8, marginTop: 12 }}>
					{templates.map(t => (<div key={t.id} style={{ background: '#fff', borderRadius: 8, padding: 12, border: '1px solid rgba(0,0,0,0.08)' }}>
						<strong>{t.title}</strong>
						<pre style={{ whiteSpace: 'pre-wrap' }}>{t.contentTemplate}</pre>
					</div>))}
				</div>
			</section>
			<section style={{ marginTop: 24 }}>
				<h3>Pricing Rules</h3>
				<button className="btn" onClick={async () => {
					await fetch('/api/admin/pricing-rules', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ country: 'in', priceMultiplier: 0.7, priority: 10 }) });
					refresh();
				}}>Add India 30% off</button>
				<div style={{ display: 'grid', gap: 8, marginTop: 12 }}>
					{rules.map(r => (<div key={r.id} style={{ background: '#fff', borderRadius: 8, padding: 12, border: '1px solid rgba(0,0,0,0.08)' }}>
						<code>{JSON.stringify(r)}</code>
					</div>))}
				</div>
			</section>
		</div>
	);
}