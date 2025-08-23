import express from 'express';
import crypto from 'crypto';
import { createCheckoutSession, isStripeEnabled, verifyStripeWebhook } from '../lib/stripe.js';
import { getTemplateById, recordPurchase, ensureUser } from '../lib/db.js';
import { getGumroadUrlForTemplate, validateGumroadReceipt } from '../lib/gumroad.js';

const router = express.Router();

router.post('/checkout', async (req, res) => {
	try {
		const { templateId, email, successRedirect, cancelRedirect } = req.body || {};
		if (!templateId || !email) return res.status(400).json({ error: 'templateId and email are required' });
		const template = getTemplateById(templateId);
		if (!template || !template.active) return res.status(404).json({ error: 'Template not found' });

		const user = ensureUser(email);

		if (isStripeEnabled) {
			const base = process.env.PUBLIC_BASE_URL || `${req.protocol}://${req.get('host')}`;
			const success_url = successRedirect || `${base}/billing/success?session_id={CHECKOUT_SESSION_ID}&t=${templateId}`;
			const cancel_url = cancelRedirect || `${base}/billing/cancel`;
			const session = await createCheckoutSession({
				price_cents: template.price_cents,
				success_url,
				cancel_url,
				metadata: { templateId, templateTitle: template.title, userId: user.id, email: user.email },
			});
			return res.json({ provider: 'stripe', url: session.url, sessionId: session.id });
		}

		const gumroadUrl = getGumroadUrlForTemplate(templateId);
		if (!gumroadUrl) return res.status(500).json({ error: 'Checkout unavailable' });
		return res.json({ provider: 'gumroad', url: gumroadUrl });
	} catch (e) {
		return res.status(500).json({ error: 'Checkout failed', details: e.message });
	}
});

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
	try {
		if (!isStripeEnabled) return res.status(200).send('ignored');
		const sig = req.headers['stripe-signature'];
		const event = verifyStripeWebhook(req.body, sig);
		if (event.type === 'checkout.session.completed') {
			const session = event.data.object;
			const templateId = session.metadata?.templateId;
			const userId = session.metadata?.userId;
			if (templateId && userId) {
				recordPurchase({
					id: session.id,
					user_id: userId,
					template_id: templateId,
					provider: 'stripe',
					provider_session_id: session.id,
					receipt: JSON.stringify(session),
				});
			}
		}
		return res.status(200).send('ok');
	} catch (e) {
		return res.status(400).send(`Webhook Error: ${e.message}`);
	}
});

router.post('/gumroad/receipt', async (req, res) => {
	try {
		const { templateId, email, receiptToken } = req.body || {};
		if (!templateId || !email || !receiptToken) return res.status(400).json({ error: 'Missing fields' });
		const valid = await validateGumroadReceipt({ templateId, email, purchaseToken: receiptToken });
		if (!valid.valid) return res.status(400).json({ error: 'Invalid receipt' });
		const user = ensureUser(email);
		recordPurchase({
			id: crypto.randomUUID(),
			user_id: user.id,
			template_id: templateId,
			provider: 'gumroad',
			provider_session_id: receiptToken,
			receipt: JSON.stringify(valid.receipt),
		});
		return res.json({ ok: true });
	} catch (e) {
		return res.status(500).json({ error: 'Receipt failed', details: e.message });
	}
});

export default router;