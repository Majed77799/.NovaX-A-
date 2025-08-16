"use client";
import { Button, Card, DataTable, Input, Select, Switch, Textarea, useToast } from '@repo/ui';
import { useMemo, useState } from 'react';
import confetti from 'canvas-confetti';

type ProductRow = { id: string; title: string; price: number; status: 'draft'|'published' };

export default function ProductsPage() {
	const [rows, setRows] = useState<ProductRow[]>([]);
	const [creating, setCreating] = useState(false);
	const { push } = useToast();
	const columns = useMemo(() => [
		{ key: 'title' as const, header: 'Title' },
		{ key: 'price' as const, header: 'Price', render: (r: ProductRow) => `$${r.price.toFixed(2)}` },
		{ key: 'status' as const, header: 'Status' },
	], []);
	return (
		<div className="grid gap-4">
			<div className="flex items-center justify-between">
				<h2 className="text-lg font-semibold">Products</h2>
				<Button onClick={() => setCreating(true)}>Create product</Button>
			</div>
			<Card>
				<DataTable<ProductRow> data={rows} columns={columns} empty={{ title: 'No products yet', description: 'Create your first product.' }} />
			</Card>
			{creating ? <CreateProduct onClose={() => setCreating(false)} onPublish={() => { push({ title: 'Product published' }); confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } }); setCreating(false); }} /> : null}
		</div>
	);
}

function CreateProduct({ onClose, onPublish }: { onClose: () => void; onPublish: () => void }) {
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [isFreebie, setIsFreebie] = useState(false);
	const [price, setPrice] = useState(9.99);
	const [status, setStatus] = useState<'draft'|'published'>('draft');
	const [uploading, setUploading] = useState(false);
	return (
		<Card title="Create product" subtitle="Draft → publish">
			<div className="grid gap-3">
				<Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
				<Textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} autosize />
				<div className="flex items-center gap-2">
					<Switch checked={isFreebie} onChange={(e) => setIsFreebie((e.target as any).checked)} label="Freebie" />
					{!isFreebie ? <Input type="number" step="0.01" value={price} onChange={(e) => setPrice(parseFloat(e.target.value))} aria-label="Price" /> : null}
					<Select value={status} onChange={(e) => setStatus(e.target.value as any)}>
						<option value="draft">Draft</option>
						<option value="published">Published</option>
					</Select>
				</div>
				<div className="rounded-md border border-dashed p-4 text-sm text-[color:var(--color-text-muted)]">
					{uploading ? 'Uploading…' : 'Upload files (drag & drop) – Coming soon'}
				</div>
				<div className="flex gap-2 justify-end">
					<Button variant="secondary" onClick={onClose}>Cancel</Button>
					<Button onClick={onPublish} disabled={!title.trim() || uploading}>{status === 'published' ? 'Publish' : 'Save draft'}</Button>
				</div>
			</div>
		</Card>
	);
}