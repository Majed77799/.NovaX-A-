import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const databaseFile = process.env.DATABASE_URL || './data/app.db';
const absoluteDbPath = path.isAbsolute(databaseFile)
	? databaseFile
	: path.join(process.cwd(), databaseFile);

const dbDir = path.dirname(absoluteDbPath);
if (!fs.existsSync(dbDir)) {
	fs.mkdirSync(dbDir, { recursive: true });
}

export const db = new Database(absoluteDbPath);

db.pragma('journal_mode = WAL');

db.exec(`
CREATE TABLE IF NOT EXISTS users (
	id TEXT PRIMARY KEY,
	email TEXT UNIQUE,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS templates (
	id TEXT PRIMARY KEY,
	title TEXT NOT NULL,
	description TEXT,
	price_cents INTEGER DEFAULT 0,
	badge TEXT,
	featured INTEGER DEFAULT 0,
	trending_score INTEGER DEFAULT 0,
	pinned INTEGER DEFAULT 0,
	file_url TEXT,
	thumbnail_url TEXT,
	provider TEXT DEFAULT 'local',
	remote_id TEXT,
	active INTEGER DEFAULT 1,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS purchases (
	id TEXT PRIMARY KEY,
	user_id TEXT NOT NULL,
	template_id TEXT NOT NULL,
	provider TEXT NOT NULL,
	provider_session_id TEXT,
	receipt TEXT,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	UNIQUE(user_id, template_id)
);

CREATE TABLE IF NOT EXISTS pins (
	id TEXT PRIMARY KEY,
	user_id TEXT NOT NULL,
	template_id TEXT NOT NULL,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	UNIQUE(user_id, template_id)
);
`);

export function upsertTemplate(template) {
	const now = new Date().toISOString();
	const payload = {
		id: template.id,
		title: template.title,
		description: template.description ?? '',
		price_cents: template.price_cents ?? 0,
		badge: template.badge ?? null,
		featured: template.featured ? 1 : 0,
		trending_score: template.trending_score ?? 0,
		pinned: template.pinned ? 1 : 0,
		file_url: template.file_url ?? null,
		thumbnail_url: template.thumbnail_url ?? null,
		provider: template.provider ?? 'local',
		remote_id: template.remote_id ?? null,
		active: template.active === 0 || template.active === false ? 0 : 1,
		created_at: template.created_at || now,
		updated_at: now,
	};
	db.prepare(`
		INSERT INTO templates (id, title, description, price_cents, badge, featured, trending_score, pinned, file_url, thumbnail_url, provider, remote_id, active, created_at, updated_at)
		VALUES (@id, @title, @description, @price_cents, @badge, @featured, @trending_score, @pinned, @file_url, @thumbnail_url, @provider, @remote_id, @active, @created_at, @updated_at)
		ON CONFLICT(id) DO UPDATE SET
			title=excluded.title,
			description=excluded.description,
			price_cents=excluded.price_cents,
			badge=excluded.badge,
			featured=excluded.featured,
			trending_score=excluded.trending_score,
			pinned=excluded.pinned,
			file_url=excluded.file_url,
			thumbnail_url=excluded.thumbnail_url,
			provider=excluded.provider,
			remote_id=excluded.remote_id,
			active=excluded.active,
			updated_at=@updated_at
	`).run(payload);
}

export function listTemplates({ onlyActive = true } = {}) {
	const stmt = db.prepare(`SELECT * FROM templates ${onlyActive ? 'WHERE active = 1' : ''} ORDER BY featured DESC, trending_score DESC, created_at DESC`);
	return stmt.all();
}

export function getTemplateById(id) {
	return db.prepare('SELECT * FROM templates WHERE id = ?').get(id);
}

export function recordPurchase({ id, user_id, template_id, provider, provider_session_id, receipt }) {
	return db
		.prepare(
			`INSERT OR IGNORE INTO purchases (id, user_id, template_id, provider, provider_session_id, receipt) VALUES (?, ?, ?, ?, ?, ?)`
		)
		.run(id, user_id, template_id, provider, provider_session_id || null, receipt || null);
}

export function getUserPurchases(user_id) {
	return db.prepare('SELECT * FROM purchases WHERE user_id = ?').all(user_id);
}

export function pinTemplate({ user_id, template_id }) {
	return db
		.prepare(`INSERT OR IGNORE INTO pins (id, user_id, template_id) VALUES (lower(hex(randomblob(16))), ?, ?)`)
		.run(user_id, template_id);
}

export function listPinned(user_id) {
	return db
		.prepare(
			`SELECT t.* FROM templates t JOIN pins p ON p.template_id = t.id WHERE p.user_id = ? ORDER BY p.created_at DESC`
		)
		.all(user_id);
}

export function ensureUser(email) {
	const existing = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
	if (existing) return existing;
	const id = Buffer.from(`${email}-${Date.now()}`).toString('base64url');
	db.prepare('INSERT INTO users (id, email) VALUES (?, ?)').run(id, email);
	return { id, email };
}