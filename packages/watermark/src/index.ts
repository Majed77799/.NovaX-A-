import { prisma } from '@repo/db';
import { generateLicenseJSON } from '@repo/shared';

type Asset = { fileUrl: string; fileName: string };

export async function processSaleWatermark(saleId: string) {
	const job = await prisma.watermarkJob.findUnique({ where: { saleId }, include: { sale: { include: { product: { include: { assets: true } } } } } });
	if (!job) throw new Error('job not found');
	await prisma.watermarkJob.update({ where: { id: job.id }, data: { status: 'PROCESSING' } });
	try {
		const sale = job.sale;
		const asset = sale.product.assets[0] as Asset | undefined;
		const resultUrl = await applyWatermark(asset, sale.buyerEmail, sale.transactionHash);
		const licenseContent = generateLicenseJSON({ buyerEmail: sale.buyerEmail, productId: sale.productId, transactionHash: sale.transactionHash });
		await prisma.license.upsert({ where: { saleId: sale.id }, create: { saleId: sale.id, content: licenseContent }, update: { content: licenseContent } });
		await prisma.watermarkJob.update({ where: { id: job.id }, data: { status: 'DONE', resultUrl } });
	} catch (err: any) {
		await prisma.watermarkJob.update({ where: { id: job?.id ?? '' }, data: { status: 'FAILED', error: String(err?.message ?? err) } });
		throw err;
	}
}

async function applyWatermark(asset: Asset | undefined, email: string, tx: string) {
	if (!asset?.fileUrl) throw new Error('no asset');
	const ext = (asset.fileName?.split('.').pop() ?? '').toLowerCase();
	const wm = encodeURIComponent(`${email}-${tx}`);
	switch (ext) {
		case 'pdf':
			return `${asset.fileUrl}?wm_text=${wm}&type=pdf`;
		case 'png':
		case 'jpg':
		case 'jpeg':
			return `${asset.fileUrl}?wm_text=${wm}&type=image`;
		case 'mp4':
		case 'mov':
			return `${asset.fileUrl}?wm_text=${wm}&type=video`;
		default:
			return `${asset.fileUrl}?wm_text=${wm}&type=other`;
	}
}