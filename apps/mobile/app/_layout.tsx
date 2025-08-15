import React from 'react'
import { Slot } from 'expo-router'
import { I18nProvider } from '@novax/i18n'

export default function RootLayout() {
	return (
		<I18nProvider defaultLng="en">
			<Slot />
		</I18nProvider>
	)
}