import type { Metadata } from 'next';
import { Urbanist } from 'next/font/google';
import './globals.css';

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
					<nav style={{ display: 'flex', gap: 12, padding: 12 }}>
						<a className="quick-chip btn" href="/">Assistant</a>
						<a className="quick-chip btn" href="/dashboard">Dashboard</a>
						<a className="quick-chip btn" href="/market">Market</a>
						<a className="quick-chip btn" href="/content">Content</a>
						<a className="quick-chip btn" href="/login" style={{ marginLeft: 'auto' }}>Login</a>
					</nav>
					{children}
				</div>
			</body>
		</html>
	);
}