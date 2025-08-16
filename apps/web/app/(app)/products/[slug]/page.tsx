"use client";
import useSWR from 'swr';
import { Badge, Button, Card, Chip } from '@repo/ui';
import { useMemo } from 'react';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function ProductDetail({ params, searchParams }: { params: { slug: string }; searchParams: { lang?: string } }) {
	const { data: product } = useSWR(`/api/products/${params.slug}?lang=${searchParams.lang ?? ''}`, fetcher);
	const { data: pricing } = useSWR(() => product ? `/api/pricing/${product.id}` : null, fetcher);
	const priceText = useMemo(() => {
		if (!pricing) return '—';
		const clamped = Math.min(Math.max(pricing.price, pricing.floor), pricing.ceiling);
		return `$${clamped.toFixed(2)}`;
	}, [pricing]);
	if (!product) return <div className="p-4">Loading…</div>;
	return (
		<div className="mx-auto max-w-5xl px-4 py-6 grid md:grid-cols-2 gap-6">
			<div>
				<Card>
					<div className="aspect-video rounded-lg bg-black/5 mb-3" />
					<div className="grid grid-cols-4 gap-2">
						{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-20 rounded-md bg-black/5" />)}
					</div>
				</Card>
			</div>
			<div>
				<div className="flex items-center gap-2 mb-2">
					<h1 className="text-2xl font-semibold">{product.title}</h1>
					<Badge variant="primary">{product.status}</Badge>
				</div>
				<p className="text-[color:var(--color-text-muted)] mb-3">{product.description}</p>
				<div className="flex gap-2 mb-4">{product.tags?.map((t: string) => <Chip key={t}>{t}</Chip>)}</div>
				<div className="flex items-center gap-3 mb-4">
					<div className="text-3xl font-extrabold">{priceText}</div>
					{pricing ? <Badge variant="info">dynamic</Badge> : null}
				</div>
				<div className="flex gap-2">
					<Button data-audit-id={pricing?.auditId ?? ''}>Buy now</Button>
					<Button variant="secondary" onClick={async () => { const res = await fetch('/api/freebies/claim', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId: product.id }) }); if (res.ok) { const { url } = await res.json(); window.location.href = url; } }}>Get freebie</Button>
				</div>
				<Card className="mt-6" title="Affiliate referral" subtitle="Share and earn">
					Use your unique link to earn commission on each sale.
				</Card>
			</div>
		</div>
	);
}