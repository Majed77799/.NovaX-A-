/* global navigator, Notification, fetch */

async function getPublicKey() {
	const res = await fetch('/api/push/public-key');
	if (!res.ok) return null;
	const data = await res.json();
	if (!data.enabled || !data.publicKey) return null;
	return data.publicKey;
}

function urlBase64ToUint8Array(base64String) {
	const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
	const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
	const rawData = atob(base64);
	const outputArray = new Uint8Array(rawData.length);
	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
}

async function registerServiceWorker() {
	if (!('serviceWorker' in navigator)) return null;
	return navigator.serviceWorker.register('/sw.js');
}

async function getExistingSubscription() {
	const reg = await navigator.serviceWorker.ready;
	return reg.pushManager.getSubscription();
}

async function subscribe(publicKey) {
	const reg = await navigator.serviceWorker.ready;
	const subscription = await reg.pushManager.subscribe({
		userVisibleOnly: true,
		applicationServerKey: urlBase64ToUint8Array(publicKey)
	});
	await fetch('/api/push/subscribe', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(subscription)
	});
	return subscription;
}

async function unsubscribe() {
	const existing = await getExistingSubscription();
	if (!existing) return;
	await fetch('/api/push/unsubscribe', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ endpoint: existing.endpoint })
	});
	await existing.unsubscribe();
}

async function updateToggleState(toggle) {
	const existing = await getExistingSubscription();
	toggle.checked = Boolean(existing);
}

async function init() {
	const toggle = document.getElementById('push-toggle');
	const section = document.getElementById('push-section');
	const statusEl = document.getElementById('push-status');
	const testBtn = document.getElementById('test-push');

	const publicKey = await getPublicKey();
	if (!publicKey || !('Notification' in window) || !('serviceWorker' in navigator) || !('PushManager' in window)) {
		section.style.display = 'none';
		return;
	}

	await registerServiceWorker();
	await updateToggleState(toggle);

	toggle.addEventListener('change', async () => {
		if (toggle.checked) {
			const perm = await Notification.requestPermission();
			if (perm !== 'granted') {
				statusEl.textContent = 'Notifications permission denied';
				toggle.checked = false;
				return;
			}
			try {
				await subscribe(publicKey);
				statusEl.textContent = 'Subscribed';
			} catch (e) {
				statusEl.textContent = 'Failed to subscribe';
				toggle.checked = false;
			}
		} else {
			try {
				await unsubscribe();
				statusEl.textContent = 'Unsubscribed';
			} catch (e) {
				statusEl.textContent = 'Failed to unsubscribe';
				toggle.checked = true;
			}
		}
	});

	testBtn.addEventListener('click', async () => {
		try {
			const res = await fetch('/api/push/test', { method: 'POST' });
			if (res.ok) {
				statusEl.textContent = 'Test notification sent';
			} else {
				statusEl.textContent = 'Failed to send test notification';
			}
		} catch (e) {
			statusEl.textContent = 'Failed to send test notification';
		}
	});
}

window.addEventListener('DOMContentLoaded', init);