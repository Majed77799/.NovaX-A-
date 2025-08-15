import pg from 'pg';
import { embedText } from '../utils/embedder.js';

const { Pool } = pg;

const CREATE_EXT = `CREATE EXTENSION IF NOT EXISTS vector`;
const CREATE_TABLE = `
CREATE TABLE IF NOT EXISTS memories (
	id TEXT PRIMARY KEY,
	device_id TEXT NOT NULL,
	user_id TEXT NOT NULL,
	text TEXT NOT NULL,
	metadata JSONB DEFAULT '{}'::jsonb,
	embedding vector(384) NOT NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_memories_device_user ON memories(device_id, user_id);
CREATE INDEX IF NOT EXISTS idx_memories_embedding ON memories USING ivfflat (embedding vector_cosine_ops);
`;

export class PgvectorStore {
	constructor() {
		const url = process.env.SUPABASE_DB_URL || process.env.SUPABASE_POSTGRES_URL || process.env.DATABASE_URL;
		if (!url) throw new Error('SUPABASE_* or DATABASE_URL not set');
		this.pool = new Pool({ connectionString: url, max: 10, idleTimeoutMillis: 30000 });
		this._init();
	}

	async _init() {
		const client = await this.pool.connect();
		try {
			await client.query(CREATE_EXT);
			await client.query(CREATE_TABLE);
		} finally {
			client.release();
		}
	}

	async upsert(record) {
		const id = record.id || `${record.deviceId}:${record.userId}:${Date.now()}:${Math.random().toString(36).slice(2)}`;
		const createdAt = new Date().toISOString();
		const embedding = record.embedding || embedText(record.text);
		const client = await this.pool.connect();
		try {
			await client.query(
				`INSERT INTO memories (id, device_id, user_id, text, metadata, embedding, created_at)
				VALUES ($1, $2, $3, $4, $5, $6, $7)
				ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text, metadata = EXCLUDED.metadata, embedding = EXCLUDED.embedding`,
				[id, record.deviceId, record.userId, record.text, JSON.stringify(record.metadata || {}), embedding, createdAt]
			);
			return { ...record, id, createdAt, embedding };
		} finally {
			client.release();
		}
	}

	async search(queryEmbedding, deviceId, userId, limit = 10) {
		const client = await this.pool.connect();
		try {
			const res = await client.query(
				`SELECT id, device_id, user_id, text, metadata, created_at,
				1 - (embedding <=> $1::vector) AS score
				FROM memories
				WHERE device_id = $2 AND user_id = $3
				ORDER BY embedding <-> $1::vector
				LIMIT $4`,
				[queryEmbedding, deviceId, userId, limit]
			);
			return res.rows.map(r => ({
				id: r.id,
				deviceId: r.device_id,
				userId: r.user_id,
				text: r.text,
				metadata: r.metadata || {},
				embedding: undefined,
				createdAt: r.created_at,
				score: Number(r.score)
			}));
		} finally {
			client.release();
		}
	}

	async clear(deviceId, userId) {
		const client = await this.pool.connect();
		try {
			let query = `DELETE FROM memories`;
			const params = [];
			const conditions = [];
			if (deviceId) { params.push(deviceId); conditions.push(`device_id = $${params.length}`); }
			if (userId) { params.push(userId); conditions.push(`user_id = $${params.length}`); }
			if (conditions.length) query += ` WHERE ` + conditions.join(' AND ');
			const res = await client.query(query + ` RETURNING id` , params);
			return { deleted: res.rowCount };
		} finally {
			client.release();
		}
	}

	async export(deviceId, userId) {
		const client = await this.pool.connect();
		try {
			let query = `SELECT id, device_id, user_id, text, metadata, created_at FROM memories`;
			const params = [];
			const conditions = [];
			if (deviceId) { params.push(deviceId); conditions.push(`device_id = $${params.length}`); }
			if (userId) { params.push(userId); conditions.push(`user_id = $${params.length}`); }
			if (conditions.length) query += ` WHERE ` + conditions.join(' AND ');
			const res = await client.query(query, params);
			return res.rows.map(r => ({ id: r.id, deviceId: r.device_id, userId: r.user_id, text: r.text, metadata: r.metadata || {}, embedding: [], createdAt: r.created_at }));
		} finally {
			client.release();
		}
	}
}

export default PgvectorStore;