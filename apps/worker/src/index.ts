import { createWatermarkWorker, getWatermarkEvents } from '@repo/queue';
import { processSaleWatermark } from '@repo/watermark';

async function main() {
	console.log('Worker starting...');
	createWatermarkWorker(async (saleId) => {
		console.log('Processing watermark for sale', saleId);
		await processSaleWatermark(saleId);
		console.log('Done watermark for sale', saleId);
	});
	const events = getWatermarkEvents();
	events.on('completed', ({ jobId }) => console.log('Job completed', jobId));
	events.on('failed', ({ jobId, failedReason }) => console.error('Job failed', jobId, failedReason));
}

main().catch(err => { console.error(err); process.exit(1); });