"use client";
import { ThemeProvider, ToastProvider } from '@repo/ui';

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider>
			<ToastProvider>
				{children}
			</ToastProvider>
		</ThemeProvider>
	);
}