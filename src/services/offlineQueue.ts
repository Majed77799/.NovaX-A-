export class OfflineQueue<T> {
	private isOnline = true;
	private queue: T[] = [];
	private processing = false;

	constructor(private readonly processor: (item: T) => Promise<void>) {}

	setOnline(online: boolean): void {
		this.isOnline = online;
		if (this.isOnline) void this.drain();
	}

	enqueue(item: T): void {
		if (this.isOnline) {
			void this.processItem(item);
		} else {
			this.queue.push(item);
		}
	}

	private async processItem(item: T): Promise<void> {
		await this.processor(item);
	}

	private async drain(): Promise<void> {
		if (this.processing) return;
		this.processing = true;
		try {
			while (this.queue.length > 0 && this.isOnline) {
				const next = this.queue.shift() as T;
				await this.processor(next);
			}
		} finally {
			this.processing = false;
		}
	}
}