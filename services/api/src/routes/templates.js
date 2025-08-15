import express from 'express';
import axios from 'axios';
import crypto from 'crypto';
import { listTemplates, upsertTemplate, getTemplateById, getUserPurchases, ensureUser } from '../lib/db.js';
import { userAuth } from '../middleware/auth.js';

const router = express.Router();

async function fetchRemoteTemplates() {
	const url = process.env.REMOTE_TEMPLATES_URL;
	if (!url) return [];
	try {
		const { data } = await axios.get(url, { timeout: 5000 });
		return Array.isArray(data) ? data : [];
	} catch (e) {
		return [];
	}
}

router.get('/list', async (req, res) => {
	try {
		const remote = await fetchRemoteTemplates();
		for (const r of remote) {
			if (!r.id) continue;
			upsertTemplate({
				id: r.id,
				title: r.title,
				description: r.description || '',
				price_cents: r.price_cents ?? 0,
				badge: r.badge || null,
				featured: r.featured ? 1 : 0,
				trending_score: r.trending_score ?? 0,
				pinned: r.pinned ? 1 : 0,
				file_url: r.file_url || null,
				thumbnail_url: r.thumbnail_url || null,
				provider: r.provider || 'local',
				remote_id: r.remote_id || null,
				active: r.active === false ? 0 : 1,
			});
		}
		const all = listTemplates({ onlyActive: true });
		return res.json({ templates: all });
	} catch (e) {
		return res.status(500).json({ error: 'Failed to list templates', details: e.message });
	}
});

router.post('/purchase', async (req, res) => {
	try {
		const { templateId, email, provider = 'manual', receipt } = req.body || {};
		if (!templateId || !email) return res.status(400).json({ error: 'Missing fields' });
		const template = getTemplateById(templateId);
		if (!template) return res.status(404).json({ error: 'Template not found' });
		const user = ensureUser(email);
		const id = crypto.randomUUID();
		import('../lib/db.js').then(({ recordPurchase }) => {
			recordPurchase({ id, user_id: user.id, template_id: templateId, provider, provider_session_id: null, receipt: receipt ? JSON.stringify(receipt) : null });
		});
		return res.json({ ok: true, id });
	} catch (e) {
		return res.status(500).json({ error: 'Failed to record purchase', details: e.message });
	}
});

router.get('/download', async (req, res) => {
	try {
		const { templateId, email } = req.query;
		if (!templateId || !email) return res.status(400).json({ error: 'Missing fields' });
		const user = ensureUser(String(email));
		const purchases = getUserPurchases(user.id);
		const has = purchases.find((p) => p.template_id === templateId);
		if (!has) return res.status(403).json({ error: 'Not purchased' });
		const template = getTemplateById(templateId);
		if (!template?.file_url) return res.status(404).json({ error: 'File not found' });
		return res.json({ url: template.file_url });
	} catch (e) {
		return res.status(500).json({ error: 'Failed to get download', details: e.message });
	}
});

router.get('/mine', async (req, res) => {
	try {
		const { email } = req.query;
		if (!email) return res.status(400).json({ error: 'Email required' });
		const user = ensureUser(String(email));
		const purchases = getUserPurchases(user.id);
		return res.json({ purchases });
	} catch (e) {
		return res.status(500).json({ error: 'Failed', details: e.message });
	}
});

export default router;