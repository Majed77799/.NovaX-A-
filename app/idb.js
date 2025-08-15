// Minimal IndexedDB helper without external deps
const DB_NAME = 'offline_demo_db';
const DB_VERSION = 1;

/**
 * Opens database and ensures object stores exist.
 */
export function openDatabase() {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, DB_VERSION);
		request.onupgradeneeded = (event) => {
			const db = event.target.result;
			if (!db.objectStoreNames.contains('messages')) {
				db.createObjectStore('messages', { keyPath: 'id', autoIncrement: true });
			}
			if (!db.objectStoreNames.contains('outbox')) {
				db.createObjectStore('outbox', { keyPath: 'id', autoIncrement: true });
			}
			if (!db.objectStoreNames.contains('templates')) {
				db.createObjectStore('templates', { keyPath: 'id' });
			}
			if (!db.objectStoreNames.contains('settings')) {
				db.createObjectStore('settings', { keyPath: 'key' });
			}
		};
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
}

function withStore(db, storeName, mode, fn) {
	return new Promise((resolve, reject) => {
		const tx = db.transaction(storeName, mode);
		const store = tx.objectStore(storeName);
		Promise.resolve(fn(store))
			.then((result) => {
				tx.oncomplete = () => resolve(result);
				tx.onerror = () => reject(tx.error);
			})
			.catch(reject);
	});
}

export async function addOutboxItem(item) {
	const db = await openDatabase();
	return withStore(db, 'outbox', 'readwrite', (store) => store.add(item));
}

export async function getOutboxItems() {
	const db = await openDatabase();
	return withStore(db, 'outbox', 'readonly', (store) => store.getAll());
}

export async function deleteOutboxItem(id) {
	const db = await openDatabase();
	return withStore(db, 'outbox', 'readwrite', (store) => store.delete(id));
}

export async function addMessage(message) {
	const db = await openDatabase();
	return withStore(db, 'messages', 'readwrite', (store) => store.add(message));
}

export async function getMessages() {
	const db = await openDatabase();
	return withStore(db, 'messages', 'readonly', (store) => store.getAll());
}

export async function clearMessages() {
	const db = await openDatabase();
	return withStore(db, 'messages', 'readwrite', (store) => store.clear());
}

export async function putTemplate(template) {
	const db = await openDatabase();
	return withStore(db, 'templates', 'readwrite', (store) => store.put(template));
}

export async function getTemplates() {
	const db = await openDatabase();
	return withStore(db, 'templates', 'readonly', (store) => store.getAll());
}

export async function clearTemplates() {
	const db = await openDatabase();
	return withStore(db, 'templates', 'readwrite', (store) => store.clear());
}

export async function putSetting(key, value) {
	const db = await openDatabase();
	return withStore(db, 'settings', 'readwrite', (store) => store.put({ key, value }));
}

export async function getSetting(key) {
	const db = await openDatabase();
	return withStore(db, 'settings', 'readonly', (store) => store.get(key));
}

export async function getAllSettings() {
	const db = await openDatabase();
	return withStore(db, 'settings', 'readonly', (store) => store.getAll());
}