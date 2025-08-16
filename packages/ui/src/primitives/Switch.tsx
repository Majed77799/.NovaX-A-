import { forwardRef, useCallback } from 'react';
import clsx from 'clsx';

export type SwitchProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'role'> & { label?: string };

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch({ className, checked, onChange, label, disabled, ...rest }, ref) {
	const handleKey = useCallback((e: React.KeyboardEvent<HTMLSpanElement>) => {
		if (disabled) return;
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			(onChange as any)?.({ target: { checked: !checked } });
		}
	}, [checked, disabled, onChange]);
	return (
		<label className={clsx('inline-flex items-center gap-2 cursor-pointer', disabled && 'opacity-50 cursor-not-allowed', className)}>
			<input ref={ref} type="checkbox" className="sr-only" checked={checked} onChange={onChange} disabled={disabled} {...rest} />
			<span
				role="switch"
				aria-checked={!!checked}
				tabIndex={0}
				onKeyDown={handleKey}
				className={clsx('relative h-6 w-10 rounded-full transition-colors', checked ? 'bg-[#8a6cff]' : 'bg-[color:var(--color-border)]')}
			>
				<span className={clsx('absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform shadow', checked && 'translate-x-4')} />
			</span>
			{label ? <span className="text-sm">{label}</span> : null}
		</label>
	);
});