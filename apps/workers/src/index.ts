import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import OpenAI from 'openai';
import Stripe from 'stripe';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { connectToDatabase, ProductModel, WatermarkModel, MarketInsightModel } from '@repo/db';
import { embedWatermark, log, metric, stableIdempotencyKey, withTimeout } from '@repo/shared';

const redisConnection = new IORedis(process.env.REDIS_URL || process.env.UPSTASH_REDIS_REST_URL || 'redis://localhost:6379');

function makeQueue(name: string) {
	return new Queue(name, { connection: redisConnection });
}

export const translationQueue = makeQueue('translations');
export const marketingQueue = makeQueue('marketing');
export const watermarkQueue = makeQueue('watermark');
export const insightsQueue = makeQueue('insights');

// Translation Worker
new Worker('translations', async job => {
	await connectToDatabase();
	const { productId, to } = job.data as { productId: string; to: string };
	const product = await ProductModel.findById(productId).catch(()=>null) as any;
	if (!product) return;
	const openaiKey = process.env.OPENAI_API_KEY;
	if (!openaiKey) { product.translations = product.translations || {}; product.translations[to] = { title: product.title?.en ?? '', description: product.description?.en ?? '' }; await product.save(); return; }
	const client = new OpenAI({ apiKey: openaiKey });
	const titlePrompt = `Translate to ${to}: ${product.title?.en ?? Object.values(product.title ?? {})[0] ?? ''}`;
	const descPrompt = `Translate to ${to}: ${product.description?.en ?? ''}`;
	const [t, d] = await Promise.all([
		client.chat.completions.create({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: titlePrompt }] }),
		client.chat.completions.create({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: descPrompt }] })
	]);
	product.translations = product.translations || {};
	product.translations[to] = { title: t.choices?.[0]?.message?.content ?? '', description: d.choices?.[0]?.message?.content ?? '' };
	await product.save();
	metric('translations.completed');
}, { connection: redisConnection });

// Marketing Worker
new Worker('marketing', async job => {
	const { title, description } = job.data as { title: string; description?: string };
	const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
	await client.images.generate({ prompt: `Ad banner for ${title}`, model: 'gpt-image-1', size: '1024x1024' });
	metric('marketing.generated');
}, { connection: redisConnection });

// Watermark Worker - generate PDF with watermark
new Worker('watermark', async job => {
	await connectToDatabase();
	const { orderId, buyerId, assetKey, text } = job.data as { orderId: string; buyerId: string; assetKey: string; text: string };
	const hash = stableIdempotencyKey([orderId, buyerId, assetKey]);
	const existing = await WatermarkModel.findOne({ watermarkHash: hash }).lean().catch(()=>null);
	if (existing) return;
	const content = embedWatermark(text, hash);
	const pdfDoc = await PDFDocument.create();
	const page = pdfDoc.addPage();
	const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
	const fontSize = 12;
	page.drawText(content, { x: 50, y: 750, size: fontSize, font, color: rgb(0, 0, 0) });
	const pdfBytes = await pdfDoc.save();
	await WatermarkModel.create({ orderId, buyerId, assetKey, watermarkHash: hash });
	metric('watermark.created');
	return pdfBytes;
}, { connection: redisConnection });

// Insights Worker - ingest mock metrics
new Worker('insights', async job => {
	await connectToDatabase();
	const { source, key, value } = job.data as { source: 'twitter'|'reddit'|'news'|'custom'; key: string; value: number };
	await MarketInsightModel.create({ source, key, value, observedAt: new Date() });
	metric('insights.ingested');
}, { connection: redisConnection });

// Startup
async function main() {
	log('info', 'Workers started');
}

main().catch(err => { log('error', 'worker startup failed', { err: String(err) }); process.exit(1); });