import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Appearance, useColorScheme } from 'react-native';
import * as Font from 'expo-font';
import { useFonts, Urbanist_500Medium, Urbanist_700Bold } from '@expo-google-fonts/urbanist';
import * as Colors from '../tokens/colors';
import { fontFamily } from '../tokens/typography';

const ThemeContext = createContext({
	mode: 'light',
	colors: Colors.light,
	ready: false,
	setMode: (_m) => {}
});

export function ThemeProvider({ children, initialMode }) {
	const system = useColorScheme();
	const [mode, setMode] = useState(initialMode || system || 'light');
	const [ready, setReady] = useState(false);
	const [loaded] = useFonts({ Urbanist_500Medium, Urbanist_700Bold });

	useEffect(() => {
		let cancelled = false;
		async function aliasFonts() {
			if (!loaded || cancelled) return;
			try {
				await Font.loadAsync({ [fontFamily.base]: Urbanist_500Medium, 'Urbanist-Bold': Urbanist_700Bold });
				if (!cancelled) setReady(true);
			} catch {
				if (!cancelled) setReady(true);
			}
		}
		aliasFonts();
		return () => { cancelled = true; };
	}, [loaded]);

	useEffect(() => {
		const sub = Appearance.addChangeListener(({ colorScheme }) => {
			if (!initialMode) setMode(colorScheme ?? 'light');
		});
		return () => sub.remove();
	}, [initialMode]);

	const value = useMemo(() => ({ mode, colors: mode === 'dark' ? Colors.dark : Colors.light, ready, setMode }), [mode, ready]);
	return (
		<ThemeContext.Provider value={value}>
			{children}
		</ThemeContext.Provider>
	);
}

export function useTheme() {
	return useContext(ThemeContext);
}