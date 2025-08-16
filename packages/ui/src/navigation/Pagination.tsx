import clsx from 'clsx';

export function Pagination({ page, pageCount, onPageChange }: { page: number; pageCount: number; onPageChange: (p: number) => void }) {
	const prevDisabled = page <= 1;
	const nextDisabled = page >= pageCount;
	return (
		<div className="flex items-center gap-2 text-sm">
			<button aria-label="Previous" disabled={prevDisabled} onClick={() => !prevDisabled && onPageChange(page - 1)} className={clsx('px-2 py-1 rounded-md border', prevDisabled ? 'opacity-50' : 'hover:bg-black/5')}>
				←
			</button>
			<span className="px-2">Page {page} of {pageCount}</span>
			<button aria-label="Next" disabled={nextDisabled} onClick={() => !nextDisabled && onPageChange(page + 1)} className={clsx('px-2 py-1 rounded-md border', nextDisabled ? 'opacity-50' : 'hover:bg-black/5')}>
				→
			</button>
		</div>
	);
}