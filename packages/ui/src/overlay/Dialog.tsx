import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export type DialogProps = {
	open: boolean;
	onClose: () => void;
	title?: string;
	children: React.ReactNode;
};

export function Dialog({ open, onClose, title, children }: DialogProps) {
	const ref = useRef<HTMLDialogElement | null>(null);
	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		if (open && !el.open) el.showModal();
		if (!open && el.open) el.close();
		const onCancel = (e: Event) => { e.preventDefault(); onClose(); };
		el.addEventListener('cancel', onCancel);
		return () => el.removeEventListener('cancel', onCancel);
	}, [open, onClose]);
	if (typeof document === 'undefined') return null;
	return createPortal(
		<dialog ref={ref} className="backdrop:bg-black/40 rounded-xl p-0 border border-[color:var(--color-border)]">
			<div className="ui-glass rounded-xl p-4 min-w-[320px] max-w-[90vw]">
				{title ? <h3 className="text-lg font-semibold mb-2">{title}</h3> : null}
				<div>{children}</div>
				<div className="mt-4 flex justify-end">
					<button onClick={onClose} className="text-sm px-3 py-1 rounded-md border border-[color:var(--color-border)]">Close</button>
				</div>
			</div>
		</dialog>,
		document.body
	);
}