import clsx from 'clsx';
import { forwardRef, useEffect, useRef } from 'react';

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
	autosize?: boolean;
	error?: string;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea({ className, autosize, error, onChange, ...rest }, ref) {
	const internalRef = useRef<HTMLTextAreaElement | null>(null);
	useEffect(() => {
		if (!autosize) return;
		const el = internalRef.current;
		if (!el) return;
		const resize = () => { el.style.height = 'auto'; el.style.height = `${el.scrollHeight}px`; };
		resize();
		el.addEventListener('input', resize);
		return () => el.removeEventListener('input', resize);
	}, [autosize]);
	return (
		<div>
			<textarea
				ref={(node) => { internalRef.current = node; if (typeof ref === 'function') ref(node); else if (ref) (ref as any).current = node; }}
				className={clsx('w-full min-h-[80px] rounded-[10px] border bg-white/90 dark:bg-white/[0.04] transition-shadow px-3 py-2 text-sm placeholder:text-[color:var(--color-text-muted)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2', error ? 'border-[#ef4444]' : 'border-[color:var(--color-border)]', className)}
				onChange={onChange}
				{...rest}
			/>
			{error ? <div role="alert" className="mt-1 text-xs text-[#ef4444]">{error}</div> : null}
		</div>
	);
});