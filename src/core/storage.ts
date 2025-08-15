type JsonValue = string | number | boolean | null | JsonValue[] | { [k: string]: JsonValue };

class MemoryStorage {
	private map = new Map<string, string>();
	getItem(key: string): string | null { return this.map.has(key) ? this.map.get(key)! : null; }
	setItem(key: string, value: string): void { this.map.set(key, value); }
	removeItem(key: string): void { this.map.delete(key); }
}

function getStorage(): Storage | MemoryStorage {
	try {
		if (typeof globalThis !== 'undefined' && 'localStorage' in globalThis && globalThis.localStorage) {
			return globalThis.localStorage as Storage;
		}
	} catch (_e) {
		/* ignore */
	}
	return new MemoryStorage();
}

const storage = getStorage();

export function writeJSON<T extends JsonValue>(key: string, value: T): void {
	storage.setItem(key, JSON.stringify(value));
}

export function readJSON<T extends JsonValue>(key: string, defaultValue: T): T {
	const raw = storage.getItem(key);
	if (raw == null) return defaultValue;
	try {
		return JSON.parse(raw) as T;
	} catch (_e) {
		return defaultValue;
	}
}

export function remove(key: string): void {
	storage.removeItem(key);
}