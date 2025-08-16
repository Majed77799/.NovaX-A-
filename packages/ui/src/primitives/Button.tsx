import { motion, type HTMLMotionProps } from 'framer-motion';
import { forwardRef } from 'react';
import clsx from 'clsx';

export type ButtonProps = HTMLMotionProps<'button'> & {
	variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
	size?: 'sm' | 'md' | 'lg';
	loading?: boolean;
	icon?: React.ReactNode;
	iconRight?: React.ReactNode;
	fullWidth?: boolean;
};

const base = 'inline-flex items-center justify-center rounded-[10px] transition-transform duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
	sm: 'h-8 px-3 text-sm gap-1.5',
	md: 'h-10 px-4 text-sm gap-2',
	lg: 'h-12 px-5 text-base gap-2.5'
};
const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
	primary: 'bg-[#8a6cff] text-white shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-95',
	secondary: 'bg-[color:var(--color-surface)] text-[color:var(--color-text)] border border-[color:var(--color-border)] hover:shadow-md',
	ghost: 'bg-transparent text-[color:var(--color-text)] hover:bg-[rgba(0,0,0,0.04)]',
	danger: 'bg-[#ef4444] text-white shadow-sm hover:shadow-md active:scale-95'
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button({ variant = 'primary', size = 'md', className, loading, children, icon, iconRight, fullWidth, ...rest }, ref) {
	return (
		<motion.button
			whileTap={{ scale: 0.97 }}
			ref={ref}
			className={clsx(base, sizes[size], variants[variant], fullWidth && 'w-full', className)}
			aria-busy={loading || undefined}
			{...rest}
		>
			{icon ? <span aria-hidden className="shrink-0">{icon}</span> : null}
			<span className="truncate">{children as unknown as React.ReactNode}</span>
			{loading ? <span className="ml-2 inline-block w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" aria-hidden /> : iconRight ? <span aria-hidden className="shrink-0">{iconRight}</span> : null}
		</motion.button>
	);
});