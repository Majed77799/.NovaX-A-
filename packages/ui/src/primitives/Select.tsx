import clsx from 'clsx';
import { forwardRef } from 'react';

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
	label?: string;
	error?: string;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select({ className, label, error, children, id, ...rest }, ref) {
	const selectId = id ?? `select_${Math.random().toString(36).slice(2)}`;
	return (
		<div>
			{label ? <label htmlFor={selectId} className="mb-1 block text-sm text-[color:var(--color-text-muted)]">{label}</label> : null}
			<select
				id={selectId}
				ref={ref}
				className={clsx('w-full h-10 rounded-[10px] border bg-white/90 dark:bg-white/[0.04] transition-shadow px-3 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2', error ? 'border-[#ef4444]' : 'border-[color:var(--color-border)]', className)}
				{...rest}
			>
				{children}
			</select>
			{error ? <div role="alert" className="mt-1 text-xs text-[#ef4444]">{error}</div> : null}
		</div>
	);
});