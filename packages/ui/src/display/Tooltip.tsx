"use client";
import { useId, useState } from 'react';

export function Tooltip({ label, children, side = 'top' }: { label: string; children: React.ReactElement; side?: 'top'|'bottom'|'left'|'right' }) {
	const [open, setOpen] = useState(false);
	const id = useId();
	const offset = 8;
	const posProp: 'top'|'bottom'|'left'|'right' = side === 'top' ? 'bottom' : side === 'bottom' ? 'top' : side === 'left' ? 'right' : 'left';
	const style: React.CSSProperties = { [posProp]: `calc(100% + ${offset}px)` } as any;
	return (
		<span className="relative inline-flex" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} onFocus={() => setOpen(true)} onBlur={() => setOpen(false)}>
			{children}
			{open ? (
				<span role="tooltip" id={id} className="absolute z-[var(--z-tooltip)] px-2 py-1 text-xs text-white bg-black/90 rounded-md" style={style}>
					{label}
				</span>
			) : null}
		</span>
	);
}