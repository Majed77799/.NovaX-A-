'use client'
import { useEffect, useState } from 'react'

export default function NotificationsDemo() {
	const [permission, setPermission] = useState<NotificationPermission>('default')
	useEffect(() => {
		setPermission(Notification.permission)
	}, [])
	return (
		<main style={{ padding: 24 }}>
			<h2>Web Notifications</h2>
			<p>Permission: {permission}</p>
			<button
				onClick={async () => {
					try {
						const p = await Notification.requestPermission()
						setPermission(p)
						if (p === 'granted') new Notification('Hello from NovaX')
					} catch {}
				}}
			>
				Request & Notify
			</button>
		</main>
	)
}