import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const DATA_DIR = join(process.cwd(), 'data');
const SUBSCRIPTIONS_FILE = join(DATA_DIR, 'subscriptions.json');

type PushSubscriptionObject = {
	endpoint: string;
	keys?: {
		p256dh?: string;
		auth?: string;
	};
	expirationTime?: number | null;
	// Allow unknown extra fields
	[key: string]: unknown;
};

function ensureStore(): void {
	if (!existsSync(DATA_DIR)) {
		mkdirSync(DATA_DIR, { recursive: true });
	}
	if (!existsSync(SUBSCRIPTIONS_FILE)) {
		writeFileSync(SUBSCRIPTIONS_FILE, JSON.stringify([], null, 2));
	}
}

export function listSubscriptions(): PushSubscriptionObject[] {
	ensureStore();
	const raw = readFileSync(SUBSCRIPTIONS_FILE, 'utf8');
	return JSON.parse(raw);
}

export function saveSubscription(sub: PushSubscriptionObject): void {
	ensureStore();
	const subs = listSubscriptions();
	const existingIndex = subs.findIndex(s => s.endpoint === sub.endpoint);
	if (existingIndex >= 0) {
		subs[existingIndex] = sub;
	} else {
		subs.push(sub);
	}
	writeFileSync(SUBSCRIPTIONS_FILE, JSON.stringify(subs, null, 2));
}

export function removeSubscription(endpoint: string): void {
	ensureStore();
	const subs = listSubscriptions();
	const next = subs.filter(s => s.endpoint !== endpoint);
	writeFileSync(SUBSCRIPTIONS_FILE, JSON.stringify(next, null, 2));
}