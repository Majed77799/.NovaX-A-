import './globals.css';
import type { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = { title: 'Ello', description: 'AI Companion' };

export default function RootLayout({ children }: { children: ReactNode }) {
	const lang = 'en';
	return (
		<html lang={lang}>
			<body>{children}</body>
		</html>
	);
}