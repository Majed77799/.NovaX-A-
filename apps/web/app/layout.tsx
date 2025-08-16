import type { Metadata } from 'next';
import { Urbanist } from 'next/font/google';
import './globals.css';
import '@repo/ui/styles.css';
import Providers from './providers';

const urbanist = Urbanist({ subsets: ['latin'], weight: ['400','500','600','700'], variable: '--font-urbanist', preload: true });

export const metadata: Metadata = {
	title: 'Ello Replica',
	description: 'Ello-inspired AI assistant',
	manifest: '/manifest.webmanifest',
	appleWebApp: { capable: true, statusBarStyle: 'default', title: 'Ello' },
	icons: [ { rel: 'icon', url: '/icons/icon-192.png' } ]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className={urbanist.variable}>
			<body>
				<div className="bg-hero-gradient min-h-dvh">
					<Providers>
						{children}
					</Providers>
				</div>
			</body>
		</html>
	);
}