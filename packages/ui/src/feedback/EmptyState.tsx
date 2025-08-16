export function EmptyState({ icon, title, description, action }: { icon?: React.ReactNode; title: string; description?: string; action?: React.ReactNode }) {
	return (
		<div className="text-center p-8 ui-glass rounded-[16px] border">
			<div className="mx-auto w-12 h-12 rounded-full bg-black/5 flex items-center justify-center mb-3">{icon ?? '✦'}</div>
			<div className="text-base font-semibold mb-1">{title}</div>
			{description ? <div className="text-sm text-[color:var(--color-text-muted)] mb-3">{description}</div> : null}
			{action}
		</div>
	);
}