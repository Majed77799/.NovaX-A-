export interface MemoryRecord {
  id: string;
  deviceId: string;
  userId: string;
  text: string;
  embedding: number[];
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface SearchResult extends MemoryRecord {
  score: number;
}

export interface MemoryStore {
  upsert(record: Omit<MemoryRecord, 'createdAt' | 'embedding'> & { embedding?: number[] }): Promise<MemoryRecord>;
  search(queryEmbedding: number[], deviceId: string, userId: string, limit: number): Promise<SearchResult[]>;
  clear(deviceId?: string, userId?: string): Promise<{ deleted: number }>
  export(deviceId?: string, userId?: string): Promise<MemoryRecord[]>;
}