"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Input, useKeyboardShortcuts, useTheme } from '@repo/ui';
import { useRef } from 'react';

function Topbar() {
	const router = useRouter();
	const { toggleTheme } = useTheme();
	const searchRef = useRef<HTMLInputElement | null>(null);
	useKeyboardShortcuts({
		'/': (e) => { e.preventDefault(); searchRef.current?.focus(); },
		'g p': () => router.push('/(app)/dashboard/products'),
		'g e': () => router.push('/(app)/explore')
	});
	return (
		<header className="sticky top-0 h-14 flex items-center gap-3 px-4 border-b border-[color:var(--color-border)] backdrop-blur supports-[backdrop-filter]:bg-white/60 z-10">
			<Input ref={searchRef} placeholder="Search" aria-label="Search" className="max-w-sm" />
			<div className="ml-auto flex items-center gap-2">
				<Button variant="secondary" size="sm" onClick={toggleTheme} aria-label="Toggle theme">Theme</Button>
				<Button variant="ghost" size="sm" aria-label="Notifications">🔔</Button>
			</div>
		</header>
	);
}

function Sidebar() {
	return (
		<aside className="w-60 border-r border-[color:var(--color-border)] hidden md:block">
			<nav className="p-3 space-y-1 text-sm">
				<Link className="block px-3 py-2 rounded-md hover:bg-black/5" href="/(app)/dashboard/products">Products</Link>
				<Link className="block px-3 py-2 rounded-md hover:bg-black/5" href="/(app)/explore">Explore</Link>
				<Link className="block px-3 py-2 rounded-md hover:bg-black/5" href="/(app)/dashboard/marketing">Marketing</Link>
				<Link className="block px-3 py-2 rounded-md hover:bg-black/5" href="/(app)/dashboard/analytics">Analytics</Link>
				<Link className="block px-3 py-2 rounded-md hover:bg-black/5" href="/settings">Settings</Link>
			</nav>
		</aside>
	);
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="min-h-dvh grid grid-rows-[auto_1fr]">
			<Topbar />
			<div className="grid grid-cols-[auto_1fr]">
				<Sidebar />
				<main className="p-4">{children}</main>
			</div>
		</div>
	);
}