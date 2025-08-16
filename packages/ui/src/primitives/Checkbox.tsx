import clsx from 'clsx';
import { forwardRef } from 'react';

export type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & { label?: string };

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox({ className, label, ...rest }, ref) {
	return (
		<label className={clsx('inline-flex items-center gap-2 select-none', className)}>
			<input ref={ref} type="checkbox" className="peer h-4 w-4 rounded border-[color:var(--color-border)] text-[#8a6cff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2" {...rest} />
			<span className="text-sm text-[color:var(--color-text)] peer-focus-visible:outline-none">{label}</span>
		</label>
	);
});