import { addOutboxItem, getOutboxItems, deleteOutboxItem, addMessage, getMessages, putTemplate, getTemplates, clearTemplates, putSetting, getSetting } from './idb.js';

const connectionChip = document.getElementById('connection-chip');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const outboxList = document.getElementById('outbox-list');
const messagesList = document.getElementById('messages-list');
const templatesList = document.getElementById('templates-list');
const loadTemplatesBtn = document.getElementById('load-templates');
const clearTemplatesBtn = document.getElementById('clear-templates');
const apiBaseInput = document.getElementById('api-base-input');
const saveSettingsBtn = document.getElementById('save-settings');

function updateConnectionChip() {
	const online = navigator.onLine;
	connectionChip.textContent = online ? 'Online' : 'Offline';
	connectionChip.classList.toggle('online', online);
	connectionChip.title = online ? 'Online. Changes will sync.' : 'Offline Mode. Changes will sync when reconnected.';
}

window.addEventListener('online', async () => {
	updateConnectionChip();
	await syncOutbox();
});
window.addEventListener('offline', () => {
	updateConnectionChip();
});

async function loadSettings() {
	const apiBase = await getSetting('apiBase');
	if (apiBase && apiBase.value) {
		apiBaseInput.value = apiBase.value;
	}
}

saveSettingsBtn.addEventListener('click', async () => {
	await putSetting('apiBase', apiBaseInput.value.trim());
	alert('Settings saved.');
});

function li(content, meta) {
	const item = document.createElement('li');
	const left = document.createElement('div');
	left.textContent = content;
	const right = document.createElement('div');
	right.className = 'meta';
	right.textContent = meta;
	item.appendChild(left);
	item.appendChild(right);
	return item;
}

async function renderOutbox() {
	outboxList.innerHTML = '';
	const items = await getOutboxItems();
	for (const item of items) {
		const row = document.createElement('li');
		const text = document.createElement('div');
		text.textContent = item.text;
		const meta = document.createElement('div');
		meta.className = 'meta';
		meta.textContent = 'queued';
		row.appendChild(text);
		row.appendChild(meta);
		outboxList.appendChild(row);
	}
}

async function renderMessages() {
	messagesList.innerHTML = '';
	const items = await getMessages();
	for (const m of items) {
		messagesList.appendChild(li(m.text, new Date(m.sentAt).toLocaleString()));
	}
}

async function renderTemplates() {
	templatesList.innerHTML = '';
	const items = await getTemplates();
	for (const t of items) {
		const row = document.createElement('li');
		const text = document.createElement('div');
		text.textContent = t.text;
		const applyBtn = document.createElement('button');
		applyBtn.textContent = 'Use';
		applyBtn.addEventListener('click', () => {
			messageInput.value = t.text;
			messageInput.focus();
		});
		row.appendChild(text);
		row.appendChild(applyBtn);
		templatesList.appendChild(row);
	}
}

loadTemplatesBtn.addEventListener('click', async () => {
	const samples = [
		{ id: 'greeting', text: 'Hello! Quick update: we are offline-first now.' },
		{ id: 'followup', text: 'Following up on my previous message.' },
		{ id: 'closing', text: 'Thanks! Talk soon.' }
	];
	for (const t of samples) await putTemplate(t);
	await renderTemplates();
});

clearTemplatesBtn.addEventListener('click', async () => {
	await clearTemplates();
	await renderTemplates();
});

messageForm.addEventListener('submit', async (e) => {
	e.preventDefault();
	const text = messageInput.value.trim();
	if (!text) return;
	messageInput.value = '';
	await enqueueOrSend(text);
	await renderOutbox();
});

async function enqueueOrSend(text) {
	const payload = { text, createdAt: Date.now() };
	if (!navigator.onLine) {
		await addOutboxItem(payload);
		// Try to schedule a background sync if available
		if (navigator.serviceWorker && 'SyncManager' in window) {
			navigator.serviceWorker.ready.then((reg) => {
				reg.sync.register('sync-outbox').catch(() => {});
			});
		}
		return;
	}
	try {
		await sendToServer(payload);
	} catch (err) {
		await addOutboxItem(payload);
		if (navigator.serviceWorker && 'SyncManager' in window) {
			navigator.serviceWorker.ready.then((reg) => {
				reg.sync.register('sync-outbox').catch(() => {});
			});
		}
	}
}

function getApiBase() {
	const val = apiBaseInput.value.trim();
	return val || 'https://example.invalid';
}

async function sendToServer(payload) {
	const url = getApiBase() + '/messages';
	// This endpoint is illustrative. It will likely fail without a backend.
	const res = await fetch(url, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload)
	});
	if (!res.ok) throw new Error('Network error');
	const saved = await res.json().catch(() => ({ id: Math.random().toString(36).slice(2), ...payload }));
	await addMessage({ id: saved.id || undefined, text: payload.text, sentAt: Date.now() });
	await renderMessages();
}

async function syncOutbox() {
	const items = await getOutboxItems();
	for (const item of items) {
		try {
			await sendToServer(item);
			await deleteOutboxItem(item.id);
		} catch (err) {
			// Stop on first failure to avoid hammering
			break;
		}
	}
	await renderOutbox();
}

async function registerServiceWorker() {
	if ('serviceWorker' in navigator) {
		try {
			await navigator.serviceWorker.register('./sw.js');
			// Optionally, background sync if supported
			if ('serviceWorker' in navigator && 'SyncManager' in window) {
				navigator.serviceWorker.ready.then((reg) => {
					// Register a one-off sync; actual trigger is on outbox update
					reg.sync.register('sync-outbox').catch(() => {});
				});
			}
			// Listen for SW-triggered sync messages
			navigator.serviceWorker.addEventListener('message', (event) => {
				if (event.data && event.data.type === 'SYNC_OUTBOX') {
					syncOutbox();
				}
			});
		} catch (e) {}
	}
}

async function init() {
	updateConnectionChip();
	await loadSettings();
	await renderOutbox();
	await renderMessages();
	await renderTemplates();
	await registerServiceWorker();
}

init();