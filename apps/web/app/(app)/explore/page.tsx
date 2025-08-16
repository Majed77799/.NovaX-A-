"use client";
import useSWRInfinite from 'swr/infinite';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Card, Tabs, type Tab } from '@repo/ui';

export type FeedItem = { id: string; type: 'video'|'image'|'pdf'; title: string; mediaUrl: string; liked?: boolean; likes?: number; comments?: number };

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function ExploreFeed() {
	const tabs: Tab[] = useMemo(() => [{ id: 'for-you', label: 'For you' }, { id: 'trending', label: 'Trending' }], []);
	const [tab, setTab] = useState('for-you');
	const getKey = (pageIndex: number, previousPageData: any) => {
		if (previousPageData && !previousPageData.items.length) return null;
		const cursor = previousPageData?.nextCursor ?? '';
		return `/api/feed?tab=${tab}&limit=8&cursor=${cursor}`;
	};
	const { data, size, setSize, mutate, isLoading } = useSWRInfinite(getKey, fetcher, { revalidateOnFocus: false });
	const items: FeedItem[] = useMemo(() => (data?.flatMap((p: any) => p.items) ?? []), [data]);
	const endRef = useRef<HTMLDivElement | null>(null);
	useEffect(() => { const obs = new IntersectionObserver((entries) => { if (entries[0]?.isIntersecting) setSize(s => s + 1); }); const el = endRef.current; if (el) obs.observe(el); return () => { if (el) obs.unobserve(el); obs.disconnect(); }; }, [setSize]);
	useEffect(() => { setSize(1); }, [tab, setSize]);
	const like = useCallback(async (id: string) => {
		mutate(async (pages) => {
			const list = pages ?? [];
			const copy = list.map((p: any) => ({ ...p, items: p.items.map((it: FeedItem) => it.id === id ? { ...it, liked: !it.liked, likes: (it.likes ?? 0) + (it.liked ? -1 : 1) } : it) }));
			fetch('/api/events', { method: 'POST', body: JSON.stringify({ type: 'like', id }), headers: { 'Content-Type': 'application/json' } }).catch(()=>{});
			return copy;
		}, { revalidate: false });
	}, [mutate]);
	return (
		<div className="mx-auto max-w-3xl px-4 py-4">
			<div className="mb-3"><Tabs tabs={tabs} value={tab} onChange={setTab} /></div>
			<div className="grid gap-3">
				{items.map(it => (
					<Card key={it.id} interactive>
						<div className="aspect-[3/4] w-full bg-black/5 rounded-lg mb-2" aria-label={`${it.type} preview`} />
						<div className="flex items-center justify-between">
							<div className="font-medium">{it.title}</div>
							<div className="flex items-center gap-2 text-sm">
								<Button variant="ghost" size="sm" aria-label="Like" onClick={() => like(it.id)}>{it.liked ? '♥' : '♡'} {it.likes ?? 0}</Button>
								<Button variant="ghost" size="sm" aria-label="Comment">💬 {it.comments ?? 0}</Button>
								<Button variant="secondary" size="sm" aria-label="Quick add">Add</Button>
							</div>
						</div>
					</Card>
				))}
				{isLoading ? <div className="py-6 text-center text-sm">Loading…</div> : null}
				<div ref={endRef} />
			</div>
		</div>
	);
}