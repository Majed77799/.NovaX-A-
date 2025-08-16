"use client";
import clsx from 'clsx';

export default function Orb({ state = 'idle' as 'idle'|'thinking'|'speaking' }) {
	return <div className={clsx('orb', state)} aria-label={`assistant ${state}`} />;
}