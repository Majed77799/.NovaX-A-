import clsx from 'clsx';

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
	variant?: 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'primary';
	size?: 'sm' | 'md';
};

const variants: Record<NonNullable<BadgeProps['variant']>, string> = {
	neutral: 'bg-[rgba(0,0,0,0.06)] text-[color:var(--color-text)] dark:bg-white/10',
	success: 'bg-[#dcfce7] text-[#065f46] dark:bg-[#14532d] dark:text-[#bbf7d0]',
	warning: 'bg-[#fef3c7] text-[#78350f] dark:bg-[#78350f] dark:text-[#fde68a]',
	danger: 'bg-[#fee2e2] text-[#7f1d1d] dark:bg-[#991b1b] dark:text-[#fecaca]',
	info: 'bg-[#e0f2fe] text-[#0c4a6e] dark:bg-[#0c4a6e] dark:text-[#bae6fd]',
	primary: 'bg-[#ece8ff] text-[#35258f] dark:bg-[#382f79] dark:text-white'
};
const sizes: Record<NonNullable<BadgeProps['size']>, string> = {
	sm: 'text-[11px] px-2 py-0.5 rounded-[999px]',
	md: 'text-xs px-2.5 py-1 rounded-[999px]'
};

export function Badge({ variant = 'neutral', size = 'sm', className, ...rest }: BadgeProps) {
	return <span className={clsx('inline-flex items-center font-medium', variants[variant], sizes[size], className)} {...rest} />;
}