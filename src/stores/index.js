import RamJsonStore from './ramJsonStore.js';
import PgvectorStore from './pgvectorStore.js';

export function createMemoryStore() {
	const hasSupabase = !!(process.env.SUPABASE_DB_URL || process.env.SUPABASE_POSTGRES_URL || process.env.DATABASE_URL);
	if (hasSupabase) {
		try {
			return new PgvectorStore();
		} catch (err) {
			console.warn('Failed to init PgvectorStore, falling back to RamJsonStore:', err.message);
			return new RamJsonStore();
		}
	}
	return new RamJsonStore();
}

export default createMemoryStore;