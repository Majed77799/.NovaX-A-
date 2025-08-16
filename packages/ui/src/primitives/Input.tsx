import clsx from 'clsx';
import { forwardRef } from 'react';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
	startIcon?: React.ReactNode;
	endIcon?: React.ReactNode;
	error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ className, startIcon, endIcon, error, ...rest }, ref) {
	return (
		<div className={clsx('relative')}> 
			{startIcon ? <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--color-text-muted)]" aria-hidden>{startIcon}</span> : null}
			<input
				ref={ref}
				className={clsx('w-full h-10 rounded-[10px] border bg-white/90 dark:bg-white/[0.04] transition-shadow px-3 text-sm placeholder:text-[color:var(--color-text-muted)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2', error ? 'border-[#ef4444]' : 'border-[color:var(--color-border)]', startIcon && 'pl-9', endIcon && 'pr-9', className)}
				{...rest}
			/>
			{endIcon ? <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--color-text-muted)]" aria-hidden>{endIcon}</span> : null}
			{error ? <div role="alert" className="mt-1 text-xs text-[#ef4444]">{error}</div> : null}
		</div>
	);
});