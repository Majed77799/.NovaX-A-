import type { Metadata } from 'next';
import { Urbanist } from 'next/font/google';
import './globals.css';
import { headers } from 'next/headers';
import { normalizeLang } from './i18n/config';

const urbanist = Urbanist({ subsets: ['latin'], weight: ['400','500','600','700'], variable: '--font-urbanist', preload: true });

export const metadata: Metadata = {
	title: 'Ello Replica',
	description: 'Ello-inspired AI assistant',
	manifest: '/manifest.webmanifest',
	appleWebApp: { capable: true, statusBarStyle: 'default', title: 'Ello' },
	icons: [ { rel: 'icon', url: '/icons/icon-192.png' } ]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	const h = headers();
	const accept = h.get('accept-language') || 'en';
	const lang = normalizeLang(accept);
	return (
		<html lang={lang} className={urbanist.variable}>
			<body>
				<div className="bg-hero-gradient min-h-dvh">
					{children}
				</div>
			</body>
		</html>
	);
}