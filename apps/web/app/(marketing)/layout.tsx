import { Button, useTheme } from '@repo/ui';
import Link from 'next/link';

function ThemeToggle() {
	const { toggleTheme } = useTheme();
	return <Button variant="secondary" size="sm" onClick={toggleTheme} aria-label="Toggle theme">Theme</Button>;
}

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="min-h-dvh">
			<header className="sticky top-0 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-[color:var(--color-border)] z-10">
				<div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
					<Link href="/" className="font-semibold">NovaX</Link>
					<nav className="flex items-center gap-2">
						<Link href="/explore" className="text-sm">Explore</Link>
						<ThemeToggle />
						<Link href="/(app)/dashboard" className="text-sm">Dashboard</Link>
					</nav>
				</div>
			</header>
			<main>{children}</main>
			<footer className="border-t border-[color:var(--color-border)] mt-12">
				<div className="mx-auto max-w-6xl px-4 py-8 text-sm text-[color:var(--color-text-muted)]">© NovaX</div>
			</footer>
		</div>
	);
}