import clsx from 'clsx';

export type CardProps = React.HTMLAttributes<HTMLDivElement> & {
	interactive?: boolean;
	title?: string;
	subtitle?: string;
	footer?: React.ReactNode;
};

export function Card({ className, interactive, title, subtitle, children, footer, ...rest }: CardProps) {
	return (
		<div className={clsx('ui-glass rounded-[16px] p-4 border transition will-change-transform', interactive && 'hover:shadow-lg hover:scale-[1.01]')} {...rest}>
			{title ? <div className="mb-1 text-base font-semibold">{title}</div> : null}
			{subtitle ? <div className="mb-2 text-sm text-[color:var(--color-text-muted)]">{subtitle}</div> : null}
			<div className={clsx('text-sm', className)}>{children}</div>
			{footer ? <div className="mt-3">{footer}</div> : null}
		</div>
	);
}