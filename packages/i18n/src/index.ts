import React, { ReactNode, useEffect, useState } from 'react'
import i18next, { InitOptions } from 'i18next'
import { I18nextProvider } from 'react-i18next'

const defaultResources = {
	en: { translation: { welcome: 'Welcome to NovaX' } },
	es: { translation: { welcome: 'Bienvenido a NovaX' } },
}

const defaultOptions: InitOptions = {
	resources: defaultResources,
	fallbackLng: 'en',
	interpolation: { escapeValue: false },
}

export function I18nProvider({ children, defaultLng = 'en' }: { children: ReactNode; defaultLng?: string }) {
	const [ready, setReady] = useState(false)
	useEffect(() => {
		if (!i18next.isInitialized) {
			i18next.init({ ...defaultOptions, lng: defaultLng }).finally(() => setReady(true))
		} else {
			i18next.changeLanguage(defaultLng).finally(() => setReady(true))
		}
	}, [defaultLng])
	if (!ready) return null
	return <I18nextProvider i18n={i18next}>{children}</I18nextProvider>
}