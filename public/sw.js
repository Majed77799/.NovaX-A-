self.addEventListener('install', (event) => {
	self.skipWaiting();
});

self.addEventListener('activate', (event) => {
	clients.claim();
});

self.addEventListener('push', (event) => {
	let data = {};
	try {
		data = event.data ? event.data.json() : {};
	} catch (e) {
		data = { title: 'Notification', body: event.data ? event.data.text() : '' };
	}
	const title = data.title || 'Notification';
	const options = {
		body: data.body || '',
		icon: data.icon || '/icons/icon-192.png',
		badge: data.badge || '/icons/icon-192.png',
		data: data.url ? { url: data.url } : undefined
	};
	event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
	event.notification.close();
	const url = (event.notification && event.notification.data && event.notification.data.url) || '/';
	event.waitUntil(
		clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
			for (const client of clientList) {
				if (client.url === url && 'focus' in client) {
					return client.focus();
				}
			}
			if (clients.openWindow) {
				return clients.openWindow(url);
			}
		})
	);
});