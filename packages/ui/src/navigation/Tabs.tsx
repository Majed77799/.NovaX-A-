import { useEffect, useId, useMemo, useState } from 'react';
import clsx from 'clsx';

export type Tab = { id: string; label: string; disabled?: boolean };

export function Tabs({ tabs, value, onChange }: { tabs: Tab[]; value?: string; onChange?: (id: string) => void }) {
	const [internal, setInternal] = useState<string>(value ?? tabs[0]?.id);
	const active = value ?? internal;
	const setActive = (id: string) => { setInternal(id); onChange?.(id); };
	const listId = useId();
	const enabledTabs = useMemo(() => tabs.filter(t => !t.disabled), [tabs]);
	useEffect(() => { if (value) setInternal(value); }, [value]);
	return (
		<div>
			<div role="tablist" aria-orientation="horizontal" id={listId} className="inline-flex rounded-[12px] border border-[color:var(--color-border)] p-1 bg-white/60 dark:bg-white/[0.04]">
				{tabs.map(t => (
					<button
						key={t.id}
						role="tab"
						aria-selected={active === t.id}
						disabled={!!t.disabled}
						onClick={() => setActive(t.id)}
						onKeyDown={(e) => {
							if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
								e.preventDefault();
								const idx = enabledTabs.findIndex(tb => tb.id === active);
								const next = e.key === 'ArrowRight' ? (idx + 1) % enabledTabs.length : (idx - 1 + enabledTabs.length) % enabledTabs.length;
								setActive(enabledTabs[next]!.id);
							}
						}}
						className={clsx('px-3 py-1.5 rounded-[10px] text-sm transition', active === t.id ? 'bg-[#ece8ff] text-[#35258f]' : 'text-[color:var(--color-text-muted)] hover:bg-black/5')}
					>
						{t.label}
					</button>
				))}
			</div>
		</div>
	);
}