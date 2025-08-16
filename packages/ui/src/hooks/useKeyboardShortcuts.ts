import { useEffect } from 'react';

export type ShortcutHandler = (event: KeyboardEvent) => void;
export type ShortcutMap = Record<string, ShortcutHandler>;

function normalize(key: string): string {
	return key.trim().toLowerCase().replace(/\s+/g, ' ');
}

export function useKeyboardShortcuts(map: ShortcutMap, enabled = true) {
	useEffect(() => {
		if (!enabled) return;
		const handler = (event: KeyboardEvent) => {
			if (event.target && (event.target as HTMLElement).isContentEditable) return;
			const el = event.target as HTMLElement | null;
			if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT')) {
				if (!(event.key === '/' && map['/'])) return;
			}
			const parts: string[] = [];
			if (event.ctrlKey) parts.push('ctrl');
			if (event.metaKey) parts.push('meta');
			if (event.altKey) parts.push('alt');
			if (event.shiftKey) parts.push('shift');
			parts.push(event.key.toLowerCase());
			const combo = normalize(parts.join('+'));
			const simple = normalize(event.key);
			if (map[combo]) { map[combo](event); }
			else if (map[simple]) { map[simple](event); }
		};
		document.addEventListener('keydown', handler);
		return () => document.removeEventListener('keydown', handler);
	}, [enabled, map]);
}