import type { Metadata } from 'next';
import { Urbanist } from 'next/font/google';
import './globals.css';

const urbanist = Urbanist({ subsets: ['latin'], weight: ['400','500','600','700'], variable: '--font-urbanist', preload: true });

	export const metadata: Metadata = {
		title: 'NovaX',
		description: 'NovaX — World‑class AI assistant',
		manifest: '/manifest.webmanifest',
		appleWebApp: { capable: true, statusBarStyle: 'default', title: 'NovaX' },
		icons: [ { rel: 'icon', url: '/icons/icon-192.png' } ]
	};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className={urbanist.variable}>
			<body>
				<div className="bg-hero-gradient min-h-dvh" role="application">
					<nav aria-label="Primary" style={{ position: 'sticky', top: 0, backdropFilter: 'saturate(120%) blur(8px)', WebkitBackdropFilter: 'saturate(120%) blur(8px)', background: 'rgba(255,255,255,0.6)', borderBottom: '1px solid var(--glass-border)' }}>
						<div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, paddingBottom: 12 }}>
							<strong>NovaX</strong>
							<div style={{ display: 'flex', gap: 12 }}>
								<a href="/" aria-label="Home">Home</a>
								<a href="/explore" aria-label="Explore">Explore</a>
								<a href="/settings" aria-label="Settings">Settings</a>
							</div>
						</div>
					</nav>
					{children}
				</div>
			</body>
		</html>
	);
}