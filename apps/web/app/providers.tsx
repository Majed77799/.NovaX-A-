'use client'
import { ReactNode, useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { persistQueryClient } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { I18nProvider } from '@novax/i18n'

const queryClient = new QueryClient()

if (typeof window !== 'undefined') {
	persistQueryClient({
		queryClient,
		persister: createSyncStoragePersister({ storage: window.localStorage }),
	})
}

export default function Providers({ children }: { children: ReactNode }) {
	useEffect(() => {
		if ('serviceWorker' in navigator) {
			navigator.serviceWorker.register('/service-worker.js').catch(() => {})
		}
	}, [])
	return (
		<QueryClientProvider client={queryClient}>
			<I18nProvider defaultLng="en">{children}</I18nProvider>
		</QueryClientProvider>
	)
}