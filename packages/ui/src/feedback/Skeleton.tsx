import clsx from 'clsx';

export function Skeleton({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
	return <div className={clsx('ui-skeleton', className)} aria-hidden {...rest} />;
}