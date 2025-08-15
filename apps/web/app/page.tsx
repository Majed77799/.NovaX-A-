'use client'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

export default function HomePage() {
	const { t, i18n } = useTranslation()
	return (
		<main style={{ padding: 24, maxWidth: 940, margin: '0 auto' }}>
			<h1>NovaX</h1>
			<p>{t('welcome', 'Welcome to NovaX')}</p>
			<div style={{ display: 'flex', gap: 12 }}>
				<button onClick={() => i18n.changeLanguage('en')}>EN</button>
				<button onClick={() => i18n.changeLanguage('es')}>ES</button>
			</div>
			<ul>
				<li>
					<Link href="/chat">Chat (AI)</Link>
				</li>
				<li>
					<Link href="/image">Image Generation</Link>
				</li>
			</ul>
		</main>
	)
}