import express from 'express';
import { z } from 'zod';
import { embedText } from '../utils/embedder.js';

export function createMemoryRouter(store) {
	const router = express.Router();

	const UpsertSchema = z.object({
		id: z.string().optional(),
		deviceId: z.string(),
		userId: z.string(),
		text: z.string().min(1),
		metadata: z.record(z.any()).optional(),
	});

	router.post('/upsert', async (req, res) => {
		try {
			const payload = UpsertSchema.parse(req.body);
			const embedding = embedText(payload.text);
			const saved = await store.upsert({ ...payload, embedding });
			res.json({ ok: true, record: saved });
		} catch (err) {
			res.status(400).json({ ok: false, error: String(err.message || err) });
		}
	});

	const SearchSchema = z.object({
		deviceId: z.string(),
		userId: z.string(),
		query: z.string().min(1),
		limit: z.number().int().min(1).max(100).optional().default(10),
	});

	router.post('/search', async (req, res) => {
		try {
			const payload = SearchSchema.parse(req.body);
			const queryEmbedding = embedText(payload.query);
			const hits = await store.search(queryEmbedding, payload.deviceId, payload.userId, payload.limit);
			res.json({ ok: true, results: hits });
		} catch (err) {
			res.status(400).json({ ok: false, error: String(err.message || err) });
		}
	});

	router.post('/clear', async (req, res) => {
		try {
			const deviceId = typeof req.body?.deviceId === 'string' ? req.body.deviceId : undefined;
			const userId = typeof req.body?.userId === 'string' ? req.body.userId : undefined;
			const result = await store.clear(deviceId, userId);
			res.json({ ok: true, ...result });
		} catch (err) {
			res.status(500).json({ ok: false, error: String(err.message || err) });
		}
	});

	router.get('/export', async (req, res) => {
		try {
			const deviceId = typeof req.query.deviceId === 'string' ? req.query.deviceId : undefined;
			const userId = typeof req.query.userId === 'string' ? req.query.userId : undefined;
			const records = await store.export(deviceId, userId);
			res.setHeader('Content-Type', 'application/json');
			res.setHeader('Content-Disposition', 'attachment; filename="memory-export.json"');
			res.end(JSON.stringify(records, null, 2));
		} catch (err) {
			res.status(500).json({ ok: false, error: String(err.message || err) });
		}
	});

	return router;
}

export default createMemoryRouter;