import { motion, AnimatePresence } from 'framer-motion';

export type SheetProps = {
	open: boolean;
	onClose: () => void;
	side?: 'right'|'left'|'bottom'|'top';
	title?: string;
	children: React.ReactNode;
};

export function Sheet({ open, onClose, side = 'right', title, children }: SheetProps) {
	return (
		<AnimatePresence>
			{open ? (
				<div className="fixed inset-0 z-[var(--z-modal)]" aria-modal>
					<motion.div className="absolute inset-0 bg-black/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
					<motion.div
						className="absolute bg-white dark:bg-neutral-900 border border-[color:var(--color-border)] shadow-xl"
						initial={side === 'right' ? { x: '100%' } : side === 'left' ? { x: '-100%' } : side === 'bottom' ? { y: '100%' } : { y: '-100%' }}
						animate={{ x: 0, y: 0 }}
						exit={side === 'right' ? { x: '100%' } : side === 'left' ? { x: '-100%' } : side === 'bottom' ? { y: '100%' } : { y: '-100%' }}
						transition={{ type: 'spring', stiffness: 260, damping: 26 }}
						style={side === 'right' ? { top: 0, right: 0, height: '100%', width: '480px', maxWidth: '100%' } : side === 'left' ? { top: 0, left: 0, height: '100%', width: '480px', maxWidth: '100%' } : side === 'bottom' ? { left: 0, right: 0, bottom: 0, height: '60vh' } : { left: 0, right: 0, top: 0, height: '60vh' }}
					>
						<div className="p-4">
							{title ? <h3 className="text-lg font-semibold mb-2">{title}</h3> : null}
							{children}
						</div>
					</motion.div>
				</div>
			) : null}
		</AnimatePresence>
	);
}