import clsx from 'clsx';

export type ChipProps = React.HTMLAttributes<HTMLDivElement> & {
	onDismiss?: () => void;
	selected?: boolean;
};

export function Chip({ className, children, onDismiss, selected, ...rest }: ChipProps) {
	return (
		<div className={clsx('inline-flex items-center gap-2 px-3 py-1 rounded-[999px] border text-sm select-none', selected ? 'bg-[#ece8ff] border-[#a792ff]' : 'bg-white/70 border-[color:var(--color-border)]', className)} {...rest}>
			<span>{children}</span>
			{onDismiss ? (
				<button aria-label="Remove" onClick={onDismiss} className="ml-1 rounded-full w-5 h-5 inline-flex items-center justify-center hover:bg-black/10">×</button>
			) : null}
		</div>
	);
}