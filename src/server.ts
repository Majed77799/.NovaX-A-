import './env.js';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { getPublicVapidKey, hasVapidKeys, sendPushToMany } from './lib/push.js';
import { listSubscriptions, saveSubscription, removeSubscription } from './storage/subscriptionStore.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// API: expose whether push is available and the public key
app.get('/api/push/public-key', (_req, res) => {
	if (!hasVapidKeys()) {
		return res.json({ enabled: false, publicKey: null });
	}
	return res.json({ enabled: true, publicKey: getPublicVapidKey() });
});

// API: subscribe
app.post('/api/push/subscribe', (req, res) => {
	const subscription = req.body;
	if (!subscription || !subscription.endpoint) {
		return res.status(400).json({ error: 'Invalid subscription' });
	}
	saveSubscription(subscription);
	return res.status(201).json({ ok: true });
});

// API: unsubscribe
app.post('/api/push/unsubscribe', (req, res) => {
	const { endpoint } = req.body || {};
	if (!endpoint) {
		return res.status(400).json({ error: 'Missing endpoint' });
	}
	removeSubscription(endpoint);
	return res.json({ ok: true });
});

// API: send test notification to all subscriptions
app.post('/api/push/test', async (_req, res) => {
	const subs = listSubscriptions();
	try {
		const result = await sendPushToMany(subs as any, {
			title: 'Test Notification',
			body: 'This is a test push notification from the server.',
			icon: '/icons/icon-192.png',
		});
		return res.json({ ok: true, ...result });
	} catch (err) {
		return res.status(500).json({ ok: false, error: (err as Error).message });
	}
});

// Serve static files from /public
const publicDir = path.resolve(__dirname, '..', 'public');
app.use(express.static(publicDir));

app.listen(port, () => {
	// eslint-disable-next-line no-console
	console.log(`Server running on http://localhost:${port}`);
});