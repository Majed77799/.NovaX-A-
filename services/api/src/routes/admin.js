import express from 'express';
import { adminAuth } from '../middleware/auth.js';
import { upsertTemplate, db } from '../lib/db.js';

const router = express.Router();

router.use(adminAuth);

// Legacy explicit upsert
router.post('/templates/upsert', (req, res) => {
	try {
		const t = req.body || {};
		if (!t.id || !t.title) return res.status(400).json({ error: 'id and title required' });
		upsertTemplate({
			id: t.id,
			title: t.title,
			description: t.description || '',
			price_cents: t.price_cents ?? 0,
			badge: t.badge || null,
			featured: t.featured ? 1 : 0,
			trending_score: t.trending_score ?? 0,
			pinned: t.pinned ? 1 : 0,
			file_url: t.file_url || null,
			thumbnail_url: t.thumbnail_url || null,
			provider: t.provider || 'local',
			remote_id: t.remote_id || null,
			active: t.active === false ? 0 : 1,
		});
		return res.json({ ok: true });
	} catch (e) {
		return res.status(500).json({ error: 'Failed to upsert', details: e.message });
	}
});

// RESTful create/update
router.post('/templates', (req, res) => {
	try {
		const t = req.body || {};
		if (!t.id || !t.title) return res.status(400).json({ error: 'id and title required' });
		upsertTemplate({
			id: t.id,
			title: t.title,
			description: t.description || '',
			price_cents: t.price_cents ?? 0,
			badge: t.badge || null,
			featured: t.featured ? 1 : 0,
			trending_score: t.trending_score ?? 0,
			pinned: t.pinned ? 1 : 0,
			file_url: t.file_url || null,
			thumbnail_url: t.thumbnail_url || null,
			provider: t.provider || 'local',
			remote_id: t.remote_id || null,
			active: t.active === false ? 0 : 1,
		});
		return res.json({ ok: true });
	} catch (e) {
		return res.status(500).json({ error: 'Failed to upsert', details: e.message });
	}
});

// Legacy explicit remove
router.post('/templates/remove', (req, res) => {
	try {
		const { id } = req.body || {};
		if (!id) return res.status(400).json({ error: 'id required' });
		db.prepare('DELETE FROM templates WHERE id = ?').run(id);
		return res.json({ ok: true });
	} catch (e) {
		return res.status(500).json({ error: 'Failed to remove', details: e.message });
	}
});

// RESTful remove
router.delete('/templates/:id', (req, res) => {
	try {
		const { id } = req.params;
		if (!id) return res.status(400).json({ error: 'id required' });
		db.prepare('DELETE FROM templates WHERE id = ?').run(id);
		return res.json({ ok: true });
	} catch (e) {
		return res.status(500).json({ error: 'Failed to remove', details: e.message });
	}
});

export default router;