import AsyncStorage from '@react-native-async-storage/async-storage';

export interface QueuedAction {
	id: string;
	type: 'message' | 'purchase';
	payload: unknown;
	createdAt: number;
}

const STORAGE_KEY = 'offline-queue-v1';

export async function getQueue(): Promise<QueuedAction[]> {
	const raw = await AsyncStorage.getItem(STORAGE_KEY);
	return raw ? JSON.parse(raw) : [];
}

export async function enqueue(action: Omit<QueuedAction, 'id' | 'createdAt'>) {
	const queue = await getQueue();
	queue.push({ ...action, id: String(Date.now()), createdAt: Date.now() });
	await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
}

export async function clearQueue() {
	await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([]));
}

export async function syncQueue(): Promise<number> {
	const queue = await getQueue();
	// Mock sync: we simply clear the queue and return count
	await clearQueue();
	return queue.length;
}