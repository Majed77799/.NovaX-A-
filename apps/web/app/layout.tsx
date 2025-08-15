import './globals.css';
import type { Metadata } from 'next';
import { Urbanist } from 'next/font/google';

const urbanist = Urbanist({ subsets: ['latin'] });

	export const metadata: Metadata = {
		title: 'Unified App',
		description: 'Web + API + PWA',
		icons: [{ rel: 'icon', url: '/icons/icon.svg' }]
	};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className={urbanist.className}>{children}</body>
		</html>
	);
}