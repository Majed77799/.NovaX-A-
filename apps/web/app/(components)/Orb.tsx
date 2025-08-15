"use client";
import { useMemo } from 'react';

export type OrbState = 'idle'|'thinking'|'speaking';

export function Orb({ state = 'idle' }: { state?: OrbState }) {
	const className = useMemo(() => ['orb', state].join(' '), [state]);
	return (
		// CSS glow + blur fallback; Skia can be added in native app impl
		<div className={className} role="img" aria-label={`orb ${state}`}/>
	);
}