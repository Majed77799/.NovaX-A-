import { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type Toast = { id: string; title?: string; description?: string; variant?: 'default'|'success'|'error' };

export type ToastContextValue = {
	toasts: Toast[];
	push: (t: Omit<Toast, 'id'>) => string;
	remove: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
	const [toasts, setToasts] = useState<Toast[]>([]);
	const remove = useCallback((id: string) => setToasts(prev => prev.filter(t => t.id !== id)), []);
	const push = useCallback((t: Omit<Toast, 'id'>) => {
		const id = crypto.randomUUID();
		setToasts(prev => [...prev, { id, ...t }]);
		setTimeout(() => remove(id), 3000);
		return id;
	}, [remove]);
	const value = useMemo(() => ({ toasts, push, remove }), [toasts, push, remove]);
	return (
		<ToastContext.Provider value={value}>
			{children}
			<div className="fixed bottom-4 right-4 z-[var(--z-toast)] space-y-2">
				{toasts.map(t => (
					<div key={t.id} className="ui-glass rounded-[12px] px-3 py-2 min-w-[240px] border">
						<div className="text-sm font-medium">{t.title}</div>
						{t.description ? <div className="text-xs text-[color:var(--color-text-muted)]">{t.description}</div> : null}
					</div>
				))}
			</div>
		</ToastContext.Provider>
	);
}

export function useToast() {
	const ctx = useContext(ToastContext);
	if (!ctx) throw new Error('useToast must be used within ToastProvider');
	return ctx;
}