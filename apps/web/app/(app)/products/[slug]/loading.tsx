import { Skeleton } from '@repo/ui';

export default function Loading() {
	return (
		<div className="mx-auto max-w-5xl px-4 py-6 grid md:grid-cols-2 gap-6">
			<div>
				<Skeleton className="aspect-video rounded-lg" />
				<div className="grid grid-cols-4 gap-2 mt-3">
					{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-md" />)}
				</div>
			</div>
			<div>
				<Skeleton className="h-8 w-1/2 mb-3" />
				<Skeleton className="h-16 w-full mb-4" />
				<div className="flex gap-2"><Skeleton className="h-10 w-28" /><Skeleton className="h-10 w-28" /></div>
			</div>
		</div>
	);
}