import fs from 'fs';
import path from 'path';
import { embedText, cosineSimilarity } from '../utils/embedder.js';

const DATA_DIR = path.join(process.cwd(), 'data');
const JSONL_PATH = path.join(DATA_DIR, 'memory.jsonl');

function ensureDataDir() {
	if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
	if (!fs.existsSync(JSONL_PATH)) fs.writeFileSync(JSONL_PATH, '');
}

export class RamJsonStore {
	constructor() {
		/** @type {Map<string, any>} */
		this.records = new Map();
		ensureDataDir();
		this._loadSummaries();
	}

	_loadSummaries() {
		try {
			const contents = fs.readFileSync(JSONL_PATH, 'utf8');
			for (const line of contents.split(/\n+/).filter(Boolean)) {
				const obj = JSON.parse(line);
				const id = obj.id || `${obj.deviceId}:${obj.userId}:${Math.random().toString(36).slice(2)}`;
				this.records.set(id, { ...obj, id });
			}
		} catch {
			// ignore
		}
	}

	_appendSummary(record) {
		const summary = {
			id: record.id,
			deviceId: record.deviceId,
			userId: record.userId,
			text: record.text,
			metadata: record.metadata || {},
			createdAt: record.createdAt,
		};
		fs.appendFileSync(JSONL_PATH, JSON.stringify(summary) + '\n');
	}

	async upsert(record) {
		const id = record.id || `${record.deviceId}:${record.userId}:${Date.now()}:${Math.random().toString(36).slice(2)}`;
		const createdAt = new Date().toISOString();
		const embedding = record.embedding || embedText(record.text);
		const stored = { ...record, id, createdAt, embedding };
		this.records.set(id, stored);
		this._appendSummary(stored);
		return stored;
	}

	async search(queryEmbedding, deviceId, userId, limit = 10) {
		const results = [];
		for (const rec of this.records.values()) {
			if (rec.deviceId !== deviceId || rec.userId !== userId) continue;
			const score = cosineSimilarity(queryEmbedding, rec.embedding || embedText(rec.text));
			results.push({ ...rec, score });
		}
		results.sort((a, b) => b.score - a.score);
		return results.slice(0, limit);
	}

	async clear(deviceId, userId) {
		let deleted = 0;
		for (const [id, rec] of Array.from(this.records.entries())) {
			if ((deviceId && rec.deviceId !== deviceId) || (userId && rec.userId !== userId)) continue;
			this.records.delete(id);
			deleted += 1;
		}
		// rewrite JSONL without cleared records
		const lines = [];
		for (const rec of this.records.values()) {
			lines.push(JSON.stringify({ id: rec.id, deviceId: rec.deviceId, userId: rec.userId, text: rec.text, metadata: rec.metadata || {}, createdAt: rec.createdAt }));
		}
		ensureDataDir();
		fs.writeFileSync(JSONL_PATH, lines.join('\n') + (lines.length ? '\n' : ''));
		return { deleted };
	}

	async export(deviceId, userId) {
		const out = [];
		for (const rec of this.records.values()) {
			if ((deviceId && rec.deviceId !== deviceId) || (userId && rec.userId !== userId)) continue;
			out.push({ ...rec });
		}
		return out;
	}
}

export default RamJsonStore;