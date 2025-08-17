import { Queue, Worker, QueueEvents, JobsOptions } from 'bullmq';
import IORedis, { RedisOptions } from 'ioredis';

let connection: IORedis | null = null;

function getConnection() {
	if (connection) return connection;
	const url = process.env.REDIS_URL ?? 'redis://localhost:6379';
	const opts: RedisOptions = { maxRetriesPerRequest: null, enableReadyCheck: false, lazyConnect: true } as any;
	connection = new IORedis(url, opts);
	return connection;
}

export function getWatermarkQueue() {
	const conn = getConnection();
	return new Queue('watermark', { connection: conn });
}

export function getWatermarkEvents() {
	const conn = getConnection();
	return new QueueEvents('watermark', { connection: conn });
}

export async function enqueueWatermarkJob(saleId: string, opts?: JobsOptions) {
	const q = getWatermarkQueue();
	return q.add('watermark', { saleId }, { removeOnComplete: true, removeOnFail: true, attempts: 3, backoff: { type: 'exponential', delay: 5000 }, ...opts });
}

export type WatermarkProcessor = (saleId: string) => Promise<void>;

export function createWatermarkWorker(processor: WatermarkProcessor) {
	const conn = getConnection();
	const worker = new Worker('watermark', async (job) => {
		const saleId: string = job.data.saleId;
		await processor(saleId);
	}, { connection: conn });
	return worker;
}