import { useEffect, useRef, useState } from 'react';

export type DropdownItem = { id: string; label: string; onSelect: () => void; disabled?: boolean };
export function Dropdown({ trigger, items }: { trigger: React.ReactNode; items: DropdownItem[] }) {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement | null>(null);
	useEffect(() => {
		const onDoc = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
		document.addEventListener('mousedown', onDoc);
		return () => document.removeEventListener('mousedown', onDoc);
	}, []);
	return (
		<div ref={ref} className="relative inline-block">
			<button onClick={() => setOpen(v => !v)} aria-expanded={open} aria-haspopup aria-label="Menu">{trigger}</button>
			{open ? (
				<div role="menu" className="absolute right-0 mt-2 min-w-[180px] bg-white dark:bg-neutral-900 border border-[color:var(--color-border)] rounded-[12px] shadow-lg p-1 z-[var(--z-dropdown)]">
					{items.map(it => (
						<button key={it.id} role="menuitem" disabled={!!it.disabled} onClick={() => { if (!it.disabled) { it.onSelect(); setOpen(false); } }} className="w-full text-left text-sm px-3 py-2 rounded-[10px] hover:bg-black/5 disabled:opacity-50">
							{it.label}
						</button>
					))}
				</div>
			) : null}
		</div>
	);
}