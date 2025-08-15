const CACHE_NAME = 'offline-demo-cache-v1';
const CORE_ASSETS = [
	'./',
	'./index.html',
	'./styles.css',
	'./app.js',
	'./idb.js'
];

self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
	);
	self.skipWaiting();
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches.keys().then((keys) => Promise.all(keys.map((k) => k === CACHE_NAME ? undefined : caches.delete(k))))
	);
	self.clients.claim();
});

// Network falling back to cache for navigation and same-origin assets
self.addEventListener('fetch', (event) => {
	const req = event.request;
	if (req.method !== 'GET') return;
	const url = new URL(req.url);
	if (url.origin === location.origin) {
		// For HTML navigations prefer network, fallback to cache
		if (req.mode === 'navigate') {
			event.respondWith(
				fetch(req).catch(() => caches.match('./index.html'))
			);
			return;
		}
		// For same-origin assets try cache first then network
		event.respondWith(
			caches.match(req).then((cached) => cached || fetch(req))
		);
	}
});

// Background Sync for outbox (cooperative; requires client helper)
self.addEventListener('sync', (event) => {
	if (event.tag === 'sync-outbox') {
		event.waitUntil(
			self.clients.matchAll({ includeUncontrolled: true, type: 'window' }).then((clients) => {
				for (const client of clients) {
					client.postMessage({ type: 'SYNC_OUTBOX' });
				}
			})
		);
	}
});

// Receive messages from page to trigger sync manually
self.addEventListener('message', (event) => {
	if (event.data && event.data.type === 'REQUEST_SYNC') {
		self.registration.sync && self.registration.sync.register('sync-outbox').catch(() => {});
	}
});