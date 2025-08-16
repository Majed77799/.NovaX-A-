import { Skeleton } from '@repo/ui';

export default function Loading() {
	return (
		<div className="p-4 space-y-3">
			<div className="flex items-center justify-between"><Skeleton className="h-6 w-32" /><Skeleton className="h-8 w-28" /></div>
			<Skeleton className="h-40 w-full" />
		</div>
	);
}