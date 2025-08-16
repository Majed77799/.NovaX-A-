import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ThemeName } from '../theme';

export type ThemeContextValue = {
	theme: ThemeName;
	setTheme: (t: ThemeName) => void;
	toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ initialTheme, children }: { initialTheme?: ThemeName; children: React.ReactNode }) {
	const [theme, setThemeState] = useState<ThemeName>(initialTheme ?? 'light');

	useEffect(() => {
		try {
			const saved = localStorage.getItem('nvx_theme') as ThemeName | null;
			if (saved) setThemeState(saved);
			else if (typeof window !== 'undefined') {
				const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
				setThemeState(prefersDark ? 'dark' : 'light');
			}
		} catch {}
	}, []);

	useEffect(() => {
		if (typeof document !== 'undefined') {
			document.documentElement.setAttribute('data-theme', theme);
			try { localStorage.setItem('nvx_theme', theme); } catch {}
		}
	}, [theme]);

	const setTheme = useCallback((t: ThemeName) => setThemeState(t), []);
	const toggleTheme = useCallback(() => setThemeState(prev => (prev === 'light' ? 'dark' : 'light')), []);

	const value = useMemo<ThemeContextValue>(() => ({ theme, setTheme, toggleTheme }), [theme, setTheme, toggleTheme]);
	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
	const ctx = useContext(ThemeContext);
	if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
	return ctx;
}