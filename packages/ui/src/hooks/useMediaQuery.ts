import { useEffect, useState } from 'react';

export function useMediaQuery(query: string): boolean {
	const [matches, setMatches] = useState<boolean>(false);
	useEffect(() => {
		if (typeof window === 'undefined') return;
		const mql = window.matchMedia(query);
		const handler = (e: MediaQueryListEvent | MediaQueryList) => setMatches('matches' in e ? e.matches : (e as MediaQueryList).matches);
		handler(mql);
		mql.addEventListener?.('change', handler as any);
		return () => mql.removeEventListener?.('change', handler as any);
	}, [query]);
	return matches;
}