import { Queue, Worker, QueueEvents, JobsOptions, Processor } from "bullmq";
import IORedis from "ioredis";

export type QueueConfig = {
  connectionUrl: string;
  queueName: string;
};

export function createRedisConnection(connectionUrl: string): IORedis {
  return new IORedis(connectionUrl, { maxRetriesPerRequest: null });
}

export function createQueue(config: QueueConfig): Queue {
  const connection = createRedisConnection(config.connectionUrl);
  return new Queue(config.queueName, { connection });
}

export function createWorker(
  config: QueueConfig,
  processor: Processor
): { worker: Worker; events: QueueEvents } {
  const connection = createRedisConnection(config.connectionUrl);
  const worker = new Worker(config.queueName, processor, { connection });
  const events = new QueueEvents(config.queueName, { connection });
  return { worker, events };
}

export async function enqueueJob<TData>(
  queue: Queue,
  name: string,
  data: TData,
  options?: JobsOptions
) {
  return queue.add(name, data, options);
}