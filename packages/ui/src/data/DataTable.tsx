import { useMemo, useState } from 'react';
import { EmptyState } from '../feedback/EmptyState';

export type Column<T> = { key: keyof T; header: string; width?: string; render?: (row: T) => React.ReactNode };

export function DataTable<T extends { id: string }>({ data, columns, empty }: { data: T[]; columns: Column<T>[]; empty?: { title: string; description?: string } }) {
	const [sortKey, setSortKey] = useState<keyof T | null>(null);
	const [sortDir, setSortDir] = useState<'asc'|'desc'>('asc');
	const sorted = useMemo(() => {
		if (!sortKey) return data;
		return [...data].sort((a,b) => {
			const av = a[sortKey]; const bv = b[sortKey];
			if (av === bv) return 0;
			return (av as any) > (bv as any) ? (sortDir === 'asc' ? 1 : -1) : (sortDir === 'asc' ? -1 : 1);
		});
	}, [data, sortKey, sortDir]);
	if (!data.length) return <EmptyState title={empty?.title ?? 'No data'} description={empty?.description} />;
	return (
		<div className="w-full overflow-x-auto">
			<table className="w-full text-sm">
				<thead>
					<tr>
						{columns.map(col => (
							<th key={String(col.key)} style={{ width: col.width }} className="text-left font-medium text-[color:var(--color-text-muted)] py-2">
								<button onClick={() => { if (sortKey === col.key) setSortDir(d => d === 'asc' ? 'desc' : 'asc'); else setSortKey(col.key); }} className="inline-flex items-center gap-1">
									{col.header}
									{sortKey === col.key ? (sortDir === 'asc' ? '▲' : '▼') : null}
								</button>
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{sorted.map(row => (
						<tr key={row.id} className="border-t border-[color:var(--color-border)]">
							{columns.map(col => (
								<td key={String(col.key)} className="py-2">
									{col.render ? col.render(row) : String(row[col.key])}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}