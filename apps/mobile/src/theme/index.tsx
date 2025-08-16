import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Appearance } from 'react-native';
import { darkTokens, lightTokens, Tokens } from './tokens';

export type ThemeMode = 'light' | 'dark' | 'system';

export type ThemeContextValue = {
	mode: ThemeMode;
	setMode: (mode: ThemeMode) => void;
	tokens: Tokens;
	isDark: boolean;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const systemScheme = Appearance.getColorScheme() ?? 'light';
	const [mode, setMode] = useState<ThemeMode>('system');

	const isDark = useMemo(() => {
		if (mode === 'system') return systemScheme === 'dark';
		return mode === 'dark';
	}, [mode, systemScheme]);

	const tokens = useMemo(() => (isDark ? darkTokens : lightTokens), [isDark]);

	const value = useMemo<ThemeContextValue>(() => ({ mode, setMode, tokens, isDark }), [mode, tokens, isDark]);

	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
	const ctx = useContext(ThemeContext);
	if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
	return ctx;
}

export type { Tokens } from './tokens';