"use client";
import { useEffect, useRef, useState } from 'react';

export default function FeedPage() {
	const [items, setItems] = useState<any[]>([]);
	const [cursor, setCursor] = useState<string | null>(null);
	const loadingRef = useRef(false);
	const loadMoreRef = useRef<HTMLDivElement>(null);

	async function loadMore(reset = false) {
		if (loadingRef.current) return;
		loadingRef.current = true;
		const qs = new URLSearchParams();
		if (!reset && cursor) qs.set('cursor', cursor);
		const res = await fetch(`/api/feed?${qs}`);
		const data = await res.json();
		setItems(prev => reset ? data.items : [...prev, ...data.items]);
		setCursor(data.nextCursor ?? null);
		loadingRef.current = false;
	}

	useEffect(() => {
		const io = new IntersectionObserver(entries => {
			if (entries.some(e => e.isIntersecting)) loadMore();
		}, { rootMargin: '400px' });
		if (loadMoreRef.current) io.observe(loadMoreRef.current);
		loadMore();
		const es = new EventSource('/api/feed/stream');
		es.onmessage = (ev) => {
			if (ev?.data === 'update') { setCursor(null); loadMore(true); }
		};
		return () => { io.disconnect(); es.close(); };
	}, []);

	async function act(productId: string, type: 'LIKE'|'SAVE'|'SHARE') {
		await fetch('/api/feed', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId, type }) });
	}

	return (
		<div style={{ height: '100vh', overflowY: 'auto' }}>
			{items.map(it => (
				<div key={it.id} style={{ height: '100vh', scrollSnapAlign: 'start', position: 'relative', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
					<div style={{ position: 'absolute', inset: 0, backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: `url(${it.coverUrl || ''})`, filter: 'blur(6px)', opacity: 0.4 }} />
					<div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', padding: 24 }}>
						<div style={{ background: 'rgba(255,255,255,0.85)', borderRadius: 16, padding: 16, width: '100%', maxWidth: 560, margin: '0 auto' }}>
							<h3 style={{ margin: 0 }}>{it.name}</h3>
							<p style={{ marginTop: 4, opacity: 0.8 }}>by {it.creator?.name ?? 'Creator'}</p>
							<div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'space-between' }}>
								<strong>{(it.priceCents/100).toLocaleString(undefined, { style: 'currency', currency: it.currency?.toUpperCase?.() || 'USD' })}</strong>
								<div style={{ display: 'flex', gap: 8 }}>
									<button className="btn" onClick={() => act(it.id, 'LIKE')}>♥ Like</button>
									<button className="btn" onClick={() => act(it.id, 'SAVE')}>💾 Save</button>
									<button className="btn" onClick={() => act(it.id, 'SHARE')}>↗ Share</button>
									<button className="btn" onClick={() => checkout(it.id)}>Buy</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			))}
			<div ref={loadMoreRef} />
		</div>
	);

	async function checkout(productId: string) {
		const res = await fetch('/api/stripe/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId }) });
		const data = await res.json();
		if (data?.url) window.location.href = data.url;
	}
}