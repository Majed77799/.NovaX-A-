import { prisma } from '@repo/db';
import { generateLicenseJSON } from '@repo/shared';

export async function processNextWatermarkJob() {
	const job = await prisma.watermarkJob.findFirst({ where: { status: 'QUEUED' }, orderBy: { createdAt: 'asc' }, include: { sale: { include: { product: { include: { assets: true } } } } } });
	if (!job) return { processed: false };
	await prisma.watermarkJob.update({ where: { id: job.id }, data: { status: 'PROCESSING' } });
	try {
		const sale = job.sale;
		const asset = sale.product.assets[0];
		const resultUrl = await applyWatermarkMock(asset?.fileUrl ?? '', sale.buyerEmail, sale.transactionHash);
		const licenseContent = generateLicenseJSON({ buyerEmail: sale.buyerEmail, productId: sale.productId, transactionHash: sale.transactionHash });
		await prisma.license.create({ data: { saleId: sale.id, content: licenseContent } });
		await prisma.watermarkJob.update({ where: { id: job.id }, data: { status: 'DONE', resultUrl } });
		return { processed: true };
	} catch (err: any) {
		await prisma.watermarkJob.update({ where: { id: job.id }, data: { status: 'FAILED', error: String(err?.message ?? err) } });
		return { processed: false };
	}
}

async function applyWatermarkMock(fileUrl: string, buyerEmail: string, tx: string) {
	// In production, fetch the file, embed watermark text for PDF/image/video, and upload to storage
	// For now, return the input URL appended with watermark query for tracing
	const wm = encodeURIComponent(`${buyerEmail}-${tx}`);
	return `${fileUrl}?wm=${wm}`;
}