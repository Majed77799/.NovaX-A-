import { Skeleton } from '@repo/ui';

export default function Loading() {
	return (
		<div className="grid md:grid-cols-3 gap-4 p-4">
			{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-md" />)}
			<Skeleton className="h-40 rounded-md md:col-span-3" />
		</div>
	);
}