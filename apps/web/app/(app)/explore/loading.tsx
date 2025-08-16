import { Skeleton } from '@repo/ui';

export default function Loading() {
	return (
		<div className="mx-auto max-w-3xl px-4 py-4 space-y-3">
			{Array.from({ length: 4 }).map((_, i) => (
				<div key={i} className="space-y-2">
					<Skeleton className="h-80 w-full rounded-lg" />
					<Skeleton className="h-6 w-1/2" />
				</div>
			))}
		</div>
	);
}