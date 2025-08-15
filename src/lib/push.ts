import webPush, { PushSubscription, SendResult } from 'web-push';

const vapidPublicKey = process.env.VAPID_PUBLIC_KEY || '';
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY || '';
const vapidContactEmail = process.env.VAPID_CONTACT_EMAIL || 'mailto:admin@localhost';

let configured = false;

function configureIfPossible(): void {
	if (configured) return;
	if (vapidPublicKey && vapidPrivateKey) {
		webPush.setVapidDetails(vapidContactEmail, vapidPublicKey, vapidPrivateKey);
		configured = true;
	}
}

export function hasVapidKeys(): boolean {
	return Boolean(vapidPublicKey && vapidPrivateKey);
}

export function getPublicVapidKey(): string | null {
	return hasVapidKeys() ? vapidPublicKey : null;
}

export async function sendPush(
	subscription: PushSubscription,
	payload: Record<string, unknown>
): Promise<SendResult> {
	configureIfPossible();
	if (!configured) {
		throw new Error('VAPID keys are not configured');
	}
	const data = JSON.stringify(payload);
	return webPush.sendNotification(subscription, data);
}

export async function sendPushToMany(
	subscriptions: PushSubscription[],
	payload: Record<string, unknown>
): Promise<{ successes: number; failures: number }>
{
	let successes = 0;
	let failures = 0;
	for (const sub of subscriptions) {
		try {
			await sendPush(sub, payload);
			successes += 1;
		} catch (_err) {
			failures += 1;
		}
	}
	return { successes, failures };
}